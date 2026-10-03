/* Inline TradingView chart (home + #ai) and calendar/timeline (home + #news).
   Mounts when the section is shown. Symbol search and TF are client-side only. */
(function () {
  const TV_JS = "https://s3.tradingview.com/tv.js";
  const EVENTS_JS = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
  const TIMELINE_JS = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
  const TFS = window.NEXX_TF_LIST || [
    { id: "1", label: "1" },
    { id: "5", label: "5" },
    { id: "15", label: "15" },
    { id: "30", label: "30" },
    { id: "1H", label: "1H" },
    { id: "4H", label: "4H" },
    { id: "1D", label: "1D" },
    { id: "1W", label: "1W" }
  ];
  const TFMAP = window.NEXX_TF_TO_TV || { "15": "15", "1H": "60" };
  const BOOK = window.NEXX_SYMBOL_BOOK || [
    {
      id: "XAUUSD",
      label: "ทอง",
      aliases: ["gold", "xau"],
      providers: [
        { name: "OANDA", tv: "OANDA:XAUUSD" },
        { name: "FX", tv: "FX:XAUUSD" },
        { name: "FOREXCOM", tv: "FOREXCOM:XAUUSD" },
        { name: "TVC", tv: "TVC:GOLD" }
      ]
    }
  ];

  let current = {
    id: "XAUUSD",
    label: "ทอง",
    provider: "OANDA",
    tv: "OANDA:XAUUSD"
  };
  let currentTf = "15";
  let frameSeq = 0;
  let mountGen = 0;
  const newsMounted = {};

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (typeof TradingView !== "undefined") {
        resolve();
        return;
      }
      const existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === "1") {
          resolve();
          return;
        }
        existing.addEventListener("load", () => resolve());
        existing.addEventListener("error", reject);
        return;
      }
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => {
        s.dataset.loaded = "1";
        resolve();
      };
      s.onerror = () => reject(new Error("load failed: " + src));
      document.head.appendChild(s);
    });
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  function flatRows() {
    const rows = [];
    BOOK.forEach((s) => {
      (s.providers || []).forEach((p) => {
        rows.push({
          id: s.id,
          label: s.label || s.id,
          aliases: s.aliases || [],
          provider: p.name,
          tv: p.tv
        });
      });
    });
    return rows;
  }

  function filterRows(query) {
    const q = String(query || "").trim().toLowerCase();
    const rows = flatRows();
    if (!q) return rows.slice(0, 40);
    return rows
      .filter((r) => {
        const hay = [r.id, r.label, r.provider, r.tv].concat(r.aliases).join(" ").toLowerCase();
        return hay.indexOf(q) !== -1;
      })
      .slice(0, 40);
  }

  function paintChrome() {
    const title = current.id + " · " + currentTf;
    ["aiChartTitle", "homeChartTitle"].forEach((id) => {
      const n = document.getElementById(id);
      if (n) n.textContent = title;
    });
    const metaHtml =
      esc(current.label) +
      " · " +
      esc(current.provider) +
      " · " +
      esc(current.tv) +
      ' · <a href="ai-chart.html">เปิดเต็มจอ</a>';
    ["aiChartMeta", "homeChartMeta"].forEach((id) => {
      const n = document.getElementById(id);
      if (n) n.innerHTML = metaHtml;
    });
    ["aiTfBar", "homeTfBar"].forEach((id) => {
      const tf = document.getElementById(id);
      if (!tf) return;
      tf.innerHTML = TFS.map((t) => {
        const tid = t.id || t;
        const lab = t.label || t;
        return (
          '<button type="button" class="' +
          (tid === currentTf ? "on" : "") +
          '" data-tf="' +
          esc(tid) +
          '">' +
          esc(lab) +
          "</button>"
        );
      }).join("");
      tf.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          currentTf = b.getAttribute("data-tf") || currentTf;
          paintChrome();
          showActiveChart();
        };
      });
    });
    ["homeSymbolSearch", "aiSymbolSearch"].forEach((id) => {
      const el = document.getElementById(id);
      if (el && document.activeElement !== el) el.value = current.tv;
    });
  }

  function mountAdvancedChart(host) {
    if (!host) return;
    if (typeof TradingView === "undefined") {
      host.innerHTML =
        '<p class="muted" style="padding:16px">โหลด TradingView ไม่ได้ — อนุญาต s3.tradingview.com แล้วรีเฟรช</p>';
      return;
    }
    host.innerHTML = "";
    const node = document.createElement("div");
    frameSeq += 1;
    node.id = "tvFrame" + frameSeq;
    node.style.height = "100%";
    node.style.width = "100%";
    host.appendChild(node);
    new TradingView.widget({
      autosize: true,
      symbol: current.tv,
      interval: TFMAP[currentTf] || "15",
      timezone: "Asia/Bangkok",
      theme: "dark",
      style: "1",
      locale: "th_TH",
      toolbar_bg: "#101827",
      enable_publishing: false,
      hide_top_toolbar: false,
      hide_legend: false,
      withdateranges: false,
      allow_symbol_change: true,
      save_image: false,
      container_id: node.id,
      studies: ["MASimple@tv-basicstudies"]
    });
  }

  function showActiveChart() {
    const home = document.getElementById("home");
    const ai = document.getElementById("ai");
    let host = null;
    if (home && home.classList.contains("on")) host = document.getElementById("homeChartHost");
    else if (ai && ai.classList.contains("on")) host = document.getElementById("tvInlineHost");
    if (host) showChart(host);
  }

  async function showChart(host) {
    if (!host) return;
    const gen = ++mountGen;
    paintChrome();
    try {
      await loadScript(TV_JS);
    } catch (e) {
      if (gen !== mountGen) return;
      host.innerHTML =
        '<p class="muted" style="padding:16px">โหลด TradingView ไม่ได้ · <a href="ai-chart.html">เปิดเต็มจอ</a></p>';
      return;
    }
    if (gen !== mountGen) return;
    mountAdvancedChart(host);
  }

  function injectEmbed(container, scriptSrc, config) {
    if (!container) return;
    container.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "tradingview-widget-container";
    wrap.style.height = "100%";
    wrap.style.width = "100%";
    const inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    inner.style.height = "100%";
    inner.style.width = "100%";
    wrap.appendChild(inner);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptSrc;
    script.async = true;
    script.text = JSON.stringify(config);
    wrap.appendChild(script);
    container.appendChild(wrap);
  }

  function mountNewsPair(calId, feedId) {
    if (newsMounted[calId]) return;
    const cal = document.getElementById(calId);
    const feed = document.getElementById(feedId);
    if (!cal && !feed) return;
    injectEmbed(cal, EVENTS_JS, {
      colorTheme: "dark",
      isTransparent: false,
      width: "100%",
      height: 400,
      locale: "th_TH",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,gb,jp,cn,au,ca,ch,nz"
    });
    injectEmbed(feed, TIMELINE_JS, {
      feedMode: "symbol",
      symbol: "OANDA:XAUUSD",
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "regular",
      width: "100%",
      height: 400,
      locale: "th_TH"
    });
    newsMounted[calId] = true;
  }

  function applySymbol(row) {
    current = {
      id: row.id,
      label: row.label,
      provider: row.provider,
      tv: row.tv
    };
    document.querySelectorAll(".symbol-results").forEach((box) => {
      box.hidden = true;
    });
    paintChrome();
    showActiveChart();
  }

  function fillResults(box, query) {
    const rows = filterRows(query);
    if (!rows.length) {
      box.innerHTML = '<div class="muted" style="padding:10px">ไม่พบสัญลักษณ์</div>';
      box.hidden = false;
      return;
    }
    box.innerHTML = rows
      .map(
        (r) =>
          '<button type="button" data-tv="' +
          esc(r.tv) +
          '" data-id="' +
          esc(r.id) +
          '" data-prov="' +
          esc(r.provider) +
          '" data-label="' +
          esc(r.label) +
          '"><span>' +
          esc(r.id) +
          " <small>" +
          esc(r.label) +
          "</small><br><small>" +
          esc(r.tv) +
          "</small></span><span class=\"prov\">" +
          esc(r.provider) +
          "</span></button>"
      )
      .join("");
    box.hidden = false;
    box.querySelectorAll("button").forEach((b) => {
      b.addEventListener("click", (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        applySymbol({
          id: b.getAttribute("data-id"),
          label: b.getAttribute("data-label"),
          provider: b.getAttribute("data-prov"),
          tv: b.getAttribute("data-tv")
        });
      });
    });
  }

  function bindSearch(inputId, boxId) {
    const input = document.getElementById(inputId);
    const box = document.getElementById(boxId);
    if (!input || !box || input.dataset.bound === "1") return;
    input.dataset.bound = "1";
    input.addEventListener("focus", () => fillResults(box, input.value));
    input.addEventListener("input", () => fillResults(box, input.value));
    input.addEventListener("keydown", (ev) => {
      if (ev.key === "Escape") box.hidden = true;
      if (ev.key === "Enter") {
        const first = box.querySelector("button");
        if (first) first.click();
        ev.preventDefault();
      }
    });
  }

  function onPage(name) {
    if (name === "home") {
      showChart(document.getElementById("homeChartHost"));
      mountNewsPair("homeCalendarHost", "homeTimelineHost");
    } else if (name === "ai") {
      showChart(document.getElementById("tvInlineHost"));
    } else if (name === "news") {
      mountNewsPair("tvCalendarHost", "tvTimelineHost");
    }
  }

  function boot() {
    bindSearch("homeSymbolSearch", "homeSymbolResults");
    bindSearch("aiSymbolSearch", "aiSymbolResults");
    document.addEventListener("click", (ev) => {
      document.querySelectorAll(".symbol-search").forEach((wrap) => {
        if (!wrap.contains(ev.target)) {
          const box = wrap.querySelector(".symbol-results");
          if (box) box.hidden = true;
        }
      });
    });
    paintChrome();
    let page = "home";
    const hash = (location.hash || "").replace(/^#/, "");
    const node = hash && document.getElementById(hash);
    if (node && node.classList.contains("page")) page = hash;
    onPage(page);
  }

  window.NexxDashboardWidgets = {
    onPage: onPage,
    ensureChart: function () {
      showChart(document.getElementById("tvInlineHost") || document.getElementById("homeChartHost"));
    },
    ensureNews: function () {
      mountNewsPair("tvCalendarHost", "tvTimelineHost");
      mountNewsPair("homeCalendarHost", "homeTimelineHost");
    }
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
