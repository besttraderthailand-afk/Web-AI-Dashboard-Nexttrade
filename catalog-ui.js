/* EA catalog + license/signal entitlement UI hooks (customer dashboard).
   Catalog: Admin API /catalog/eas → static ./catalog/eas.json
   License verify: POST ADMIN_API_BASE/license/verify when backend ships it.
   No secrets; no invented vault / WC / passwords. */
(function () {
  "use strict";

  function apiBase() {
    return String(window.ADMIN_API_BASE || "").replace(/\/+$/, "");
  }

  function staticCatalogUrl() {
    return window.CATALOG_STATIC_URL || "./catalog/eas.json";
  }

  async function fetchJson(url) {
    const r = await fetch(url, { credentials: "omit" });
    if (!r.ok) throw new Error("HTTP " + r.status + " " + url);
    return r.json();
  }

  async function loadCatalog() {
    const base = apiBase();
    const errors = [];
    if (base) {
      try {
        const j = await fetchJson(base + "/catalog/eas");
        const eas = (j.data && j.data.eas) || j.eas || [];
        return { eas: eas, source: "api", raw: j };
      } catch (e) {
        errors.push(String(e.message || e));
      }
    }
    try {
      const j = await fetchJson(staticCatalogUrl());
      const eas = (j.data && j.data.eas) || j.eas || [];
      return { eas: eas, source: "static", raw: j, errors: errors };
    } catch (e) {
      errors.push(String(e.message || e));
      throw new Error(errors.join(" · ") || "catalog load failed");
    }
  }

  function renderLicList(eas, meta) {
    const box = document.getElementById("licList");
    if (!box) return;
    if (!eas.length) {
      box.innerHTML = '<p class="muted">แคตตาล็อกว่าง</p>';
      return;
    }
    const srcLabel =
      meta.source === "api"
        ? "Live API · " + apiBase()
        : "Static · catalog/eas.json" + (meta.errors && meta.errors.length ? " (API ยังไม่พร้อม)" : "");
    box.innerHTML =
      '<p class="muted" id="licSrc" style="margin-bottom:8px">' +
      srcLabel +
      "</p>" +
      eas
        .map(function (e) {
          const lic = e.license_required
            ? '<span class="tag">ซื้อ ' +
              (e.license_price_usdt || 0) +
              " USDT</span>" +
              (e.checkout_path
                ? ' <span class="muted">' + e.checkout_path + "</span>"
                : "")
            : '<span class="ok">รวมในแพ็กเกจ</span>';
          return (
            '<div class="news-item"><b>' +
            (e.code || "") +
            "</b> " +
            (e.name || "") +
            " " +
            lic +
            "</div>"
          );
        })
        .join("");
  }

  function fillEaSelect(eas) {
    const sel = document.getElementById("sigEa");
    if (!sel) return;
    const paid = eas.filter(function (e) {
      return e.license_required;
    });
    const list = paid.length ? paid : eas;
    sel.innerHTML = list
      .map(function (e) {
        return (
          '<option value="' +
          e.code +
          '">' +
          e.code +
          " · " +
          e.name +
          (e.license_required ? " (license)" : "") +
          "</option>"
        );
      })
      .join("");
  }

  function setSigMsg(text, ok) {
    const el = document.getElementById("sigMsg");
    if (!el) return;
    el.className = ok === true ? "ok" : ok === false ? "bad" : "muted";
    el.textContent = text;
  }

  async function verifyLicense() {
    const key = (document.getElementById("sigKey") || {}).value || "";
    const ea = (document.getElementById("sigEa") || {}).value || "";
    const trimmed = String(key).trim();
    if (!trimmed || !ea) {
      setSigMsg("ใส่ license key และเลือก EA", false);
      return;
    }
    const base = apiBase();
    if (!base) {
      setSigMsg("ยังไม่ได้ตั้ง ADMIN_API_BASE ใน config.js", false);
      return;
    }
    setSigMsg("กำลังตรวจ…", null);
    try {
      const r = await fetch(base + "/license/verify", {
        method: "POST",
        headers: { "content-type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({ key: trimmed, ea: ea }),
      });
      const j = await r.json().catch(function () {
        return {};
      });
      if (r.status === 404) {
        setSigMsg(
          "API ยังไม่มี /license/verify — รอ backend ต่อสาย (ดู docs/SIGNAL_LICENSE.md) · แคตตาล็อก EA ใช้ได้แล้ว",
          false
        );
        paintEntitlement(null, true);
        return;
      }
      if (!r.ok) {
        setSigMsg(
          (j.message || j.error || "verify failed") + " (HTTP " + r.status + ")",
          false
        );
        paintEntitlement(null, false);
        return;
      }
      const view = j.license || j.data || j;
      paintEntitlement(view, false);
      const eligible =
        view.status === "active" && view.signal_enabled !== false;
      setSigMsg(
        eligible
          ? "สิทธิ์สัญญาณพร้อม · status=" + view.status
          : "ไม่มีสิทธิ์สัญญาณ · status=" + (view.status || "?"),
        eligible
      );
    } catch (e) {
      setSigMsg("เรียก API ไม่ได้: " + (e.message || e), false);
      paintEntitlement(null, false);
    }
  }

  function paintEntitlement(view, pendingBackend) {
    const box = document.getElementById("sigEntitlement");
    const bindBtn = document.getElementById("sigBindTg");
    if (!box) return;
    if (pendingBackend) {
      box.innerHTML =
        '<p class="muted">UI พร้อมแล้ว — รอ <code>POST /license/verify</code> บน Admin API / nexttrade-backend</p>';
      if (bindBtn) bindBtn.disabled = true;
      return;
    }
    if (!view) {
      box.innerHTML = "";
      if (bindBtn) bindBtn.disabled = true;
      return;
    }
    const rows = [
      ["status", view.status],
      ["signal_enabled", String(view.signal_enabled)],
      ["expiry", view.expiry || view.expiresAt || "—"],
      ["telegram_bound", String(view.telegram_bound || false)],
    ];
    box.innerHTML =
      "<table>" +
      rows
        .map(function (r) {
          return "<tr><td>" + r[0] + "</td><td><b>" + r[1] + "</b></td></tr>";
        })
        .join("") +
      "</table>";
    if (bindBtn) {
      const ok =
        view.status === "active" &&
        view.signal_enabled !== false &&
        !view.telegram_bound;
      bindBtn.disabled = !ok;
    }
  }

  function startTelegramLink() {
    setSigMsg(
      "ผูก Telegram ต้องมี POST /signal/start-link ฝั่ง server — ยังไม่เปิดบน Vercel ชั่วคราว (ดู docs/SIGNAL_LICENSE.md)",
      false
    );
  }

  async function init() {
    try {
      const meta = await loadCatalog();
      renderLicList(meta.eas, meta);
      fillEaSelect(meta.eas);
      const homeEa = document.getElementById("homeEaCount");
      if (homeEa) {
        const paid = meta.eas.filter(function (e) {
          return e.license_required;
        }).length;
        homeEa.textContent =
          meta.eas.length +
          " EA · ต้องซื้อไลเซนส์ " +
          paid +
          " ตัว · แหล่ง " +
          (meta.source === "api" ? "API" : "static JSON");
      }
    } catch (e) {
      const box = document.getElementById("licList");
      if (box) {
        box.innerHTML =
          '<p class="bad">โหลดแคตตาล็อกไม่ได้</p><p class="muted">' +
          (e.message || e) +
          "</p>";
      }
    }
    const verifyBtn = document.getElementById("sigVerify");
    if (verifyBtn) verifyBtn.onclick = verifyLicense;
    const bindBtn = document.getElementById("sigBindTg");
    if (bindBtn) {
      bindBtn.disabled = true;
      bindBtn.onclick = startTelegramLink;
    }
  }

  window.NexxCatalogUi = { loadCatalog: loadCatalog, init: init, verifyLicense: verifyLicense };
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
