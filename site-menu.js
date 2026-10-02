/**
 * Customer nav → subdomain hosts per locked plan (app/ai/news/pay/go).
 * Admin host never appears in this menu.
 */
(function (global) {
  "use strict";

  var PAGE_HOST = {
    home: "app",
    tree: "app",
    keys: "app",
    ai: "ai",
    control: "ai",
    news: "news",
    pay: "pay",
    aff: "go",
  };

  var LABELS = {
    home: { host: "app.", title: "ฮับ" },
    ai: { host: "ai.", title: "กราฟ + แชต" },
    control: { host: "ai.", title: "ควบคุม" },
    news: { host: "news.", title: "ข่าว" },
    pay: { host: "pay.", title: "ชำระเงิน" },
    aff: { host: "go.", title: "Affiliate" },
    tree: { host: "app.", title: "ผังสมาชิก" },
    keys: { host: "app.", title: "API Keys" },
  };

  function hosts() {
    return global.CUSTOMER_HOSTS || {};
  }

  function rootDomain() {
    return String(global.CUSTOMER_ROOT_DOMAIN || "nexxtrade.example");
  }

  function mode() {
    var m = String(global.CUSTOMER_MENU_MODE || "auto").toLowerCase();
    if (m === "spa" || m === "hosts") return m;
    var host = (location.hostname || "").toLowerCase();
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host.endsWith(".vercel.app") ||
      host.endsWith(".github.io")
    ) {
      return "spa";
    }
    if (host.endsWith("." + rootDomain()) || host === rootDomain()) {
      return "hosts";
    }
    return "spa";
  }

  function urlFor(page) {
    var key = PAGE_HOST[page] || "app";
    var base = hosts()[key] || "";
    var hash = "#" + page;
    if (mode() === "spa" || !base) {
      return hash;
    }
    return String(base).replace(/\/$/, "") + "/" + hash;
  }

  function goSpa(name) {
    var pages = document.querySelectorAll(".page");
    var nav = document.querySelectorAll("#siteMenu [data-page]");
    pages.forEach(function (p) {
      p.classList.toggle("on", p.id === name);
    });
    nav.forEach(function (b) {
      b.classList.toggle("on", b.getAttribute("data-page") === name);
    });
    try {
      history.replaceState(null, "", "#" + name);
    } catch (e) {}
  }

  function navigate(page) {
    var href = urlFor(page);
    if (href.charAt(0) === "#") {
      goSpa(page);
      var menu = document.getElementById("siteMenu");
      if (menu) menu.classList.remove("open");
      return;
    }
    location.href = href;
  }

  function wire() {
    var menu = document.getElementById("siteMenu");
    if (!menu) return;

    menu.querySelectorAll("[data-page]").forEach(function (el) {
      var page = el.getAttribute("data-page");
      var meta = LABELS[page];
      if (meta) {
        el.innerHTML = "<small>" + meta.host + "</small>" + meta.title;
      }
      if (el.tagName === "A") {
        el.setAttribute("href", urlFor(page));
      }
      el.addEventListener("click", function (ev) {
        if (mode() === "spa" || urlFor(page).charAt(0) === "#") {
          ev.preventDefault();
          navigate(page);
        }
        /* hosts mode: let browser follow absolute href */
      });
    });

    document.querySelectorAll("[data-go]").forEach(function (b) {
      b.addEventListener("click", function (ev) {
        ev.preventDefault();
        navigate(b.getAttribute("data-go"));
      });
    });

    var toggle = document.getElementById("menuToggle");
    if (toggle) {
      toggle.onclick = function () {
        menu.classList.toggle("open");
      };
    }

    if (location.hash) {
      goSpa(location.hash.slice(1));
    }

    var modePill = document.getElementById("hostModeHint");
    if (modePill) {
      modePill.textContent =
        mode() === "spa"
          ? "เมนูโหมด SPA (Vercel เดียว) · โดเมนจริงยังเป็น placeholder " + rootDomain()
          : "เมนูโหมดซับโดเมน · " + rootDomain();
    }
  }

  global.NexxSiteMenu = {
    urlFor: urlFor,
    navigate: navigate,
    mode: mode,
    goSpa: goSpa,
    wire: wire,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", wire);
  } else {
    wire();
  }
})(typeof window !== "undefined" ? window : globalThis);
