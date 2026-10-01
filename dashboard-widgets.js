/* Inline TradingView chart (#ai) + calendar/timeline (#news).
   Reuses chart-assets.js catalog; lazy-mounts when page becomes visible. */
(function () {
  const TV_JS = "https://s3.tradingview.com/tv.js";
  const EVENTS_JS = "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
  const TIMELINE_JS = "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
  const TFS = ["M1", "M5", "M15", "H1"];
  const TFMAP = window.NEXX_TF_TO_TV || { M1: "1", M5: "5", M15: "15", H1: "60" };
  const ASSETS = window.NEXX_ASSETS || [
    { id: "XAUUSD", group: "metal", label: "ทอง", venue: "v1", tv: "OANDA:XAUUSD" }
  ];

  let currentAsset = ASSETS.find((a) => a.id === "XAUUSD") || ASSETS[0];
  let currentTf = "M15";
  let tvWidget = null;
  let chartReady = false;
  let newsReady = false;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const existing = document.querySelector('script[src="' + src + '"]');
      if (existing) {
        if (existing.dataset.loaded === "1" || typeof TradingView !== "undefined") {
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

  function mountAdvancedChart() {
    const host = document.getElementById("tvInlineHost");
    if (!host) return;
    if (typeof TradingView === "undefined") {
      host.innerHTML =
        '<p class="muted" style="padding:16px">โหลด TradingView ไม่ได้ — เปิด <a href="ai-chart.html">ai-chart.html</a> หรืออนุญาต s3.tradingview.com</p>';
      return;
    }
    host.innerHTML = "";
    const node = document.createElement("div");
    node.id = "tvInlineFrame";
    node.style.height = "100%";
    host.appendChild(node);
    tvWidget = new TradingView.widget({
      autosize: true,
      symbol: currentAsset.tv || currentAsset.id,
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
      container_id: "tvInlineFrame",
      studies: ["MASimple@tv-basicstudies"]
    });
  }

  function paintChartChrome() {
    const title = document.getElementById("aiChartTitle");
    const meta = document.getElementById("aiChartMeta");
    const bar = document.getElementById("aiAssetBar");
    const tf = document.getElementById("aiTfBar");
    if (title) title.textContent = currentAsset.id + " · " + currentTf;
    if (meta) {
      meta.innerHTML =
        currentAsset.label +
        " · " +
        (currentAsset.tv || currentAsset.id) +
        ' · <a href="ai-chart.html">เปิดเต็มจอ</a>';
    }
    if (bar) {
      const v1 = ASSETS.filter((a) => a.venue === "v1");
      bar.innerHTML = v1
        .map(
          (x) =>
            '<button type="button" class="' +
            (x.id === currentAsset.id ? "on" : "") +
            '" data-id="' +
            x.id +
            '">' +
            x.id +
            "</button>"
        )
        .join("");
      bar.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          currentAsset = ASSETS.find((x) => x.id === b.dataset.id) || currentAsset;
          paintChartChrome();
          mountAdvancedChart();
        };
      });
    }
    if (tf) {
      tf.innerHTML = TFS.map(
        (t) =>
          '<button type="button" class="' +
          (t === currentTf ? "on" : "") +
          '" data-tf="' +
          t +
          '">' +
          t +
          "</button>"
      ).join("");
      tf.querySelectorAll("button").forEach((b) => {
        b.onclick = () => {
          currentTf = b.dataset.tf;
          paintChartChrome();
          mountAdvancedChart();
        };
      });
    }
  }

  function injectEmbed(container, scriptSrc, config) {
    if (!container) return;
    container.innerHTML = "";
    const wrap = document.createElement("div");
    wrap.className = "tradingview-widget-container";
    wrap.style.height = "100%";
    const inner = document.createElement("div");
    inner.className = "tradingview-widget-container__widget";
    wrap.appendChild(inner);
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptSrc;
    script.async = true;
    script.text = JSON.stringify(config);
    wrap.appendChild(script);
    container.appendChild(wrap);
  }

  function mountNewsWidgets() {
    const cal = document.getElementById("tvCalendarHost");
    const feed = document.getElementById("tvTimelineHost");
    injectEmbed(cal, EVENTS_JS, {
      colorTheme: "dark",
      isTransparent: true,
      width: "100%",
      height: 420,
      locale: "th_TH",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,gb,jp,cn,au,ca,ch,nz"
    });
    injectEmbed(feed, TIMELINE_JS, {
      feedMode: "symbol",
      symbol: "OANDA:XAUUSD",
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: 420,
      locale: "th_TH"
    });
  }

  async function ensureChart() {
    if (chartReady) {
      // Remount if host was emptied
      if (!document.getElementById("tvInlineFrame")) {
        paintChartChrome();
        mountAdvancedChart();
      }
      return;
    }
    paintChartChrome();
    try {
      await loadScript(TV_JS);
      mountAdvancedChart();
      chartReady = true;
    } catch (e) {
      const host = document.getElementById("tvInlineHost");
      if (host) {
        host.innerHTML =
          '<p class="muted" style="padding:16px">โหลด TradingView ไม่ได้ · <a href="ai-chart.html">ai-chart.html</a></p>';
      }
    }
  }

  function ensureNews() {
    if (newsReady) return;
    mountNewsWidgets();
    newsReady = true;
  }

  window.NexxDashboardWidgets = {
    ensureChart: ensureChart,
    ensureNews: ensureNews,
    onPage: function (name) {
      if (name === "ai") ensureChart();
      if (name === "news") ensureNews();
    }
  };
})();
