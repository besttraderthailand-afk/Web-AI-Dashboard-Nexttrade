"use strict";

const crypto = require("crypto");

const DEFAULT_BOT_USERNAME = process.env.TELEGRAM_BOT_USERNAME || "NexxTradeSignalBot";
const SERVICE_TOKEN = process.env.SIGNAL_BOT_TOKEN || "";

function now() {
  return Date.now();
}

function licenseStatus(row) {
  if (!row) return "missing";
  if (row.revokedAt) return "revoked";
  if (row.expiresAt && row.expiresAt < now()) return "expired";
  return "active";
}

function isSignalEligible(row) {
  return licenseStatus(row) === "active" && row.signalEnabled !== false;
}

function publicLicenseView(row) {
  if (!row) {
    return { status: "missing", expiry: null, signal_enabled: false };
  }
  return {
    id: row.id,
    ea: row.ea,
    client_id: row.userId,
    account: row.account || null,
    last4: row.last4,
    status: licenseStatus(row),
    expiry: row.expiresAt,
    signal_enabled: isSignalEligible(row),
    telegram_bound: Boolean(row.telegramChatId),
    telegram_chat_id: row.telegramChatId || null,
  };
}

function ensureLicenseDefaults(row) {
  if (row.signalEnabled === undefined) row.signalEnabled = true;
  if (row.telegramChatId === undefined) row.telegramChatId = null;
  if (!row.webhooks) row.webhooks = [];
  return row;
}

function findActiveLicense(store, { id, ea, userId, keyHash }) {
  return (
    store.state.licenses.find((l) => {
      if (id && l.id === id) return true;
      if (keyHash && l.hash === keyHash && (!ea || l.ea === String(ea))) return true;
      if (ea && userId && l.ea === String(ea) && l.userId === String(userId) && !l.revokedAt) return true;
      return false;
    }) || null
  );
}

function setSignalEnabled(store, { id, ea, userId, enabled, reason }) {
  const row = findActiveLicense(store, { id, ea, userId });
  if (!row) {
    const err = new Error("license not found");
    err.status = 404;
    throw err;
  }
  ensureLicenseDefaults(row);
  const prev = Boolean(row.signalEnabled);
  row.signalEnabled = Boolean(enabled);
  row.signalUpdatedAt = now();
  const event = pushEntitlementEvent(store, {
    type: row.signalEnabled ? "signal.enabled" : "signal.disabled",
    licenseId: row.id,
    client_id: row.userId,
    ea: row.ea,
    chat_id: row.telegramChatId,
    reason: reason || "admin",
    prev,
  });
  return { license: publicLicenseView(row), event };
}

function createStartToken(store, { userId, ea, licenseId, dashboardUrl }) {
  const license = findActiveLicense(store, { id: licenseId, ea, userId });
  if (!license) {
    const err = new Error("license not found");
    err.status = 404;
    throw err;
  }
  ensureLicenseDefaults(license);
  if (!isSignalEligible(license)) {
    const err = new Error("signal not entitled");
    err.status = 403;
    err.code = "signal_not_entitled";
    throw err;
  }
  const token = crypto.randomBytes(16).toString("hex");
  const row = {
    token,
    licenseId: license.id,
    client_id: license.userId,
    ea: license.ea,
    createdAt: now(),
    expiresAt: now() + 15 * 60 * 1000,
    usedAt: null,
  };
  store.state.signalStartTokens = store.state.signalStartTokens || [];
  store.state.signalStartTokens.push(row);
  const bot = store.state.signalBotUsername || DEFAULT_BOT_USERNAME;
  const dash = dashboardUrl || store.state.dashboardUrl || "";
  return {
    start_token: token,
    expiresAt: row.expiresAt,
    telegram_deep_link: "https://t.me/" + bot + "?start=" + token,
    dashboard_url: dash,
    client_id: license.userId,
    ea: license.ea,
    license: publicLicenseView(license),
  };
}

function bindChatId(store, { startToken, chatId, telegramUserId }) {
  const tokens = store.state.signalStartTokens || [];
  const row = tokens.find((t) => t.token === String(startToken));
  if (!row) {
    const err = new Error("start token not found");
    err.status = 404;
    err.code = "bad_start_token";
    throw err;
  }
  if (row.usedAt) {
    const err = new Error("start token already used");
    err.status = 409;
    err.code = "start_token_used";
    throw err;
  }
  if (row.expiresAt < now()) {
    const err = new Error("start token expired");
    err.status = 410;
    err.code = "start_token_expired";
    throw err;
  }
  const license = store.state.licenses.find((l) => l.id === row.licenseId);
  if (!license || !isSignalEligible(license)) {
    const err = new Error("signal not entitled");
    err.status = 403;
    err.code = "signal_not_entitled";
    throw err;
  }
  ensureLicenseDefaults(license);
  license.telegramChatId = String(chatId);
  license.telegramUserId = telegramUserId ? String(telegramUserId) : null;
  license.telegramBoundAt = now();
  row.usedAt = now();
  row.chat_id = String(chatId);
  const event = pushEntitlementEvent(store, {
    type: "telegram.bound",
    licenseId: license.id,
    client_id: license.userId,
    ea: license.ea,
    chat_id: license.telegramChatId,
  });
  return { license: publicLicenseView(license), event };
}

function unbindChatId(store, { userId, ea, licenseId, reason }) {
  const license = findActiveLicense(store, { id: licenseId, ea, userId });
  if (!license) {
    const err = new Error("license not found");
    err.status = 404;
    throw err;
  }
  const prev = license.telegramChatId;
  license.telegramChatId = null;
  license.telegramUnboundAt = now();
  const event = pushEntitlementEvent(store, {
    type: "telegram.unbound",
    licenseId: license.id,
    client_id: license.userId,
    ea: license.ea,
    chat_id: prev,
    reason: reason || "user",
  });
  return { license: publicLicenseView(license), event };
}

function listRecipients(store, { ea, includeDisabled } = {}) {
  return store.state.licenses
    .map(ensureLicenseDefaults)
    .filter((l) => {
      if (ea && l.ea !== String(ea)) return false;
      if (!l.telegramChatId) return false;
      if (includeDisabled) return true;
      return isSignalEligible(l);
    })
    .map((l) => ({
      client_id: l.userId,
      ea: l.ea,
      chat_id: l.telegramChatId,
      status: licenseStatus(l),
      expiry: l.expiresAt,
      signal_enabled: isSignalEligible(l),
      license_id: l.id,
    }));
}

function pushEntitlementEvent(store, event) {
  const row = { id: store.id("sev"), at: now(), ...event };
  store.state.signalEvents = store.state.signalEvents || [];
  store.state.signalEvents.push(row);
  if (store.state.signalEvents.length > 2000) store.state.signalEvents.shift();
  const hooks = store.state.signalWebhooks || [];
  row.delivered = hooks.map((url) => ({ url, queued: true }));
  return row;
}

function registerWebhook(store, { url }) {
  if (!url || !/^https?:\/\//i.test(url)) {
    const err = new Error("webhook url required");
    err.status = 400;
    throw err;
  }
  store.state.signalWebhooks = store.state.signalWebhooks || [];
  if (!store.state.signalWebhooks.includes(url)) store.state.signalWebhooks.push(url);
  return { webhooks: store.state.signalWebhooks };
}

function assertBotToken(headerToken) {
  const incoming = String(headerToken || "");
  if (!SERVICE_TOKEN || incoming !== SERVICE_TOKEN) {
    const err = new Error("bot token required");
    err.status = 401;
    err.code = "bot_unauthenticated";
    throw err;
  }
}

module.exports = {
  licenseStatus,
  isSignalEligible,
  publicLicenseView,
  ensureLicenseDefaults,
  findActiveLicense,
  setSignalEnabled,
  createStartToken,
  bindChatId,
  unbindChatId,
  listRecipients,
  registerWebhook,
  assertBotToken,
  DEFAULT_BOT_USERNAME,
};
