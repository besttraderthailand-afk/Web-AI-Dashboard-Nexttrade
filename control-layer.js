/**
 * NexxTrade control layer — separate from the chart.
 * Browser + Node. Never logs or returns raw API keys.
 */
(function (root, factory) {
  if (typeof module === "object" && module.exports) module.exports = factory();
  else root.NexxControl = factory();
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  var PROVIDERS = [
    { id: "openai", label: "OpenAI", placeholder: "sk-...", prefix: ["sk-"], min: 20 },
    { id: "anthropic", label: "Anthropic", placeholder: "sk-ant-...", prefix: ["sk-ant-"], min: 20 },
    { id: "gemini", label: "Gemini", placeholder: "AIza...", prefix: ["AIza"], min: 20 },
    { id: "xai", label: "xAI / Grok", placeholder: "xai-...", prefix: ["xai-"], min: 16 },
  ];

  var SNAP_FIELDS = [
    { id: "symbol", label: "SYMBOL", aliases: ["symbol", "pair", "ticker"] },
    { id: "timeframe", label: "TIMEFRAME", aliases: ["timeframe", "tf", "period"] },
    { id: "session", label: "SESSION", aliases: ["session", "sess"] },
    { id: "bias", label: "BIAS", aliases: ["bias", "direction"] },
    { id: "risk", label: "RISK", aliases: ["risk", "riskpct", "rr"] },
    { id: "setup", label: "SETUP", aliases: ["setup", "note", "plan", "snap"] },
  ];

  function maskKey(value) {
    var s = String(value || "");
    if (s.length < 8) return s ? "••••" : "";
    return s.slice(0, 4) + "…" + s.slice(-3);
  }

  function classifyKey(provider, raw) {
    var value = String(raw || "").trim();
    if (!value) return { status: "WAIT_KEY", reason: "empty" };
    if (value.length < provider.min) return { status: "BAD_KEY", reason: "too_short" };
    var okPrefix = provider.prefix.some(function (p) {
      return value.indexOf(p) === 0;
    });
    if (!okPrefix) return { status: "BAD_KEY", reason: "bad_prefix" };
    return { status: "OK", reason: "shape_ok", masked: maskKey(value) };
  }

  function providerState(saved) {
    saved = saved || {};
    return PROVIDERS.map(function (p) {
      var raw = saved[p.id] || "";
      var cls = classifyKey(p, raw);
      return {
        id: p.id,
        label: p.label,
        placeholder: p.placeholder,
        status: cls.status,
        reason: cls.reason,
        masked: cls.masked || "",
        hasKey: Boolean(String(raw).trim()),
      };
    });
  }

  function anyProviderOk(states) {
    return states.some(function (s) {
      return s.status === "OK";
    });
  }

  function parseSnap(text) {
    var lines = String(text || "")
      .split(/\r?\n/)
      .map(function (l) {
        return l.trim();
      })
      .filter(Boolean);
    var out = {
      symbol: "",
      timeframe: "",
      session: "",
      bias: "",
      risk: "",
      setup: "",
      rawLines: lines.slice(0, 6),
    };
    lines.forEach(function (line, idx) {
      var m = line.match(/^([A-Za-z฀-๏_ ]+)\s*[:=]\s*(.+)$/);
      if (m) {
        var key = m[1].trim().toLowerCase().replace(/\s+/g, "");
        var val = m[2].trim();
        var field = SNAP_FIELDS.find(function (f) {
          return f.id === key || f.label.toLowerCase() === key || f.aliases.indexOf(key) >= 0;
        });
        if (field) {
          out[field.id] = val;
          return;
        }
      }
      if (idx < SNAP_FIELDS.length && !out[SNAP_FIELDS[idx].id]) {
        out[SNAP_FIELDS[idx].id] = line;
      }
    });
    return out;
  }

  function snapCard(snap) {
    return SNAP_FIELDS.map(function (f) {
      return { id: f.id, label: f.label, value: snap[f.id] || "\u2014" };
    });
  }

  function defaultMode() {
    return {
      analyzeOnly: true,
      tradeUnlocked: false,
      tradeArmed: false,
    };
  }

  function canArmTrade(mode, providers) {
    if (mode.analyzeOnly) return { ok: false, reason: "ANALYZE_ONLY" };
    if (!anyProviderOk(providers)) return { ok: false, reason: "NO_PROVIDER" };
    if (!mode.tradeUnlocked) return { ok: false, reason: "TRADE_LOCKED" };
    return { ok: true, reason: "ARMED" };
  }

  return {
    PROVIDERS: PROVIDERS,
    SNAP_FIELDS: SNAP_FIELDS,
    maskKey: maskKey,
    classifyKey: classifyKey,
    providerState: providerState,
    anyProviderOk: anyProviderOk,
    parseSnap: parseSnap,
    snapCard: snapCard,
    defaultMode: defaultMode,
    canArmTrade: canArmTrade,
  };
});
