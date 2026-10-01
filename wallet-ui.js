(function () {
  "use strict";
  var W = window.NexxWallet;
  if (!W) {
    console.error("NexxWallet missing — load wallet-connect.js first");
    return;
  }
  var who = document.getElementById("who");
  var connectBtn = document.getElementById("connect");
  var menu = document.getElementById("walletMenu");
  var errEl = document.getElementById("walletErr");
  var wcHint = document.getElementById("wcHint");
  var btnInjected = document.getElementById("btnInjected");
  var btnWc = document.getElementById("btnWc");
  var btnSiwe = document.getElementById("btnSiweDemo");
  var btnDisc = document.getElementById("btnDisconnect");
  if (!who || !connectBtn || !menu) return;

  function setErr(msg) {
    errEl.textContent = msg || "";
  }

  function refreshWcGate() {
    var id = W.getWcProjectId();
    if (id) {
      btnWc.disabled = false;
      wcHint.textContent = "WalletConnect พร้อม (Project ID จาก config / localStorage)";
    } else {
      btnWc.disabled = true;
      wcHint.innerHTML =
        "ยังไม่ได้ตั้ง <code>WALLETCONNECT_PROJECT_ID</code> ใน <code>config.js</code> " +
        "หรือ localStorage <code>walletconnect_project_id</code>. " +
        "สร้างที่ Reown/WalletConnect Cloud แล้วอนุญาต origin " +
        "<code>https://web-ai-dashboard-nt.vercel.app</code> — MetaMask ใช้งานได้ทันที";
    }
  }

  function render(s) {
    refreshWcGate();
    if (!s.account) {
      who.textContent = "ยังไม่เชื่อมวอลเล็ต";
      who.className = "pill";
      connectBtn.textContent = "เชื่อมวอลเล็ต";
      btnSiwe.style.display = "none";
      btnDisc.style.display = "none";
      btnInjected.style.display = "";
      btnWc.style.display = "";
      return;
    }
    var chainLabel = s.onBsc ? "BSC" : "chain " + (s.chainId || "?");
    who.textContent = s.short + " · " + chainLabel;
    who.className = "pill " + (s.onBsc ? "ok-chain" : "warn-chain");
    connectBtn.textContent = "วอลเล็ต";
    btnSiwe.style.display = "";
    btnDisc.style.display = "";
    btnInjected.style.display = "none";
    btnWc.style.display = "none";
    wcHint.textContent =
      s.method === "walletconnect" ? "เชื่อมผ่าน WalletConnect" : "เชื่อมผ่าน MetaMask/injected";
  }

  connectBtn.addEventListener("click", function () {
    setErr("");
    refreshWcGate();
    menu.classList.toggle("open");
  });
  document.addEventListener("click", function (e) {
    if (!menu.contains(e.target) && e.target !== connectBtn) menu.classList.remove("open");
  });

  btnInjected.addEventListener("click", function () {
    setErr("");
    W.connectInjected()
      .then(function () {
        menu.classList.remove("open");
      })
      .catch(function (e) {
        setErr((e && e.message) || String(e));
      });
  });

  btnWc.addEventListener("click", function () {
    setErr("");
    if (!W.getWcProjectId()) {
      refreshWcGate();
      return;
    }
    W.connectWalletConnect()
      .then(function () {
        menu.classList.remove("open");
      })
      .catch(function (e) {
        if (e && e.message === "WC_PROJECT_ID_MISSING") refreshWcGate();
        else setErr((e && e.message) || String(e));
      });
  });

  btnDisc.addEventListener("click", function () {
    setErr("");
    W.disconnect().then(function () {
      menu.classList.remove("open");
    });
  });

  btnSiwe.addEventListener("click", function () {
    setErr("");
    W.personalSignDemo()
      .then(function (r) {
        setErr(
          "เดโม personal_sign สำเร็จ (ไม่ใช่ SIWE session / ไม่มี nonce จากเซิร์ฟเวอร์): " +
            String(r.signature).slice(0, 18) +
            "…"
        );
      })
      .catch(function (e) {
        setErr((e && e.message) || String(e));
      });
  });

  W.on(render);
  W.tryRestoreInjected();

  var vault = (window.USDT_PAYMENT_VAULT || "").trim();
  var payNote = document.getElementById("payVaultNote");
  var payBtn = document.getElementById("payMem");
  if (payNote && vault) {
    payNote.textContent =
      "Vault (config): " +
      vault.slice(0, 8) +
      "… — การโอน USDT จริงยังไม่เปิดใน Phase 1 (ปุ่มยังเป็นจำลอง)";
  }
  if (payBtn) payBtn.title = "จำลองเท่านั้น — ยังไม่โอน USDT บนเชน";
})();
