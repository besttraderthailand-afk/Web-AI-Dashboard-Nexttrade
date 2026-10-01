/**
 * Phase 1 wallet connect — EIP-1193 (MetaMask/injected) + WalletConnect scaffold.
 * No backend SIWE session. Payment / vault not handled here.
 */
(function (global) {
  "use strict";

  var BSC = {
    chainId: Number(global.WALLET_CHAIN_ID) || 56,
    chainHex: String(global.WALLET_CHAIN_HEX || "0x38"),
    chainName: global.WALLET_CHAIN_NAME || "BNB Smart Chain",
    rpcUrl: global.WALLET_RPC_URL || "https://bsc-dataseed.binance.org/",
    explorer: global.WALLET_EXPLORER || "https://bscscan.com",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  };

  var WC_UMD =
    "https://cdn.jsdelivr.net/npm/@walletconnect/ethereum-provider@2.21.1/dist/index.umd.js";

  var state = {
    provider: null,
    account: null,
    chainId: null,
    method: null,
    wcProvider: null,
  };

  var listeners = [];

  function shorten(addr) {
    if (!addr || addr.length < 10) return addr || "";
    return addr.slice(0, 6) + "…" + addr.slice(-4);
  }

  function normalizeChainId(raw) {
    if (raw == null) return null;
    if (typeof raw === "number") return raw;
    var s = String(raw);
    if (s.indexOf("0x") === 0 || s.indexOf("0X") === 0) return parseInt(s, 16);
    return parseInt(s, 10);
  }

  function getWcProjectId() {
    if (global.WALLETCONNECT_PROJECT_ID && String(global.WALLETCONNECT_PROJECT_ID).trim()) {
      return String(global.WALLETCONNECT_PROJECT_ID).trim();
    }
    try {
      var ls = localStorage.getItem("walletconnect_project_id");
      if (ls && ls.trim()) return ls.trim();
    } catch (e) {}
    return "";
  }

  function emit() {
    var snap = {
      account: state.account,
      chainId: state.chainId,
      method: state.method,
      short: shorten(state.account),
      onBsc: state.chainId === BSC.chainId,
    };
    listeners.forEach(function (fn) {
      try { fn(snap); } catch (e) { console.error(e); }
    });
  }

  function on(fn) {
    listeners.push(fn);
    emit();
    return function off() {
      listeners = listeners.filter(function (x) { return x !== fn; });
    };
  }

  function bindProviderEvents(provider) {
    if (!provider || !provider.on) return;
    provider.on("accountsChanged", function (accounts) {
      if (!accounts || !accounts.length) { clearSession(false); return; }
      state.account = accounts[0];
      emit();
    });
    provider.on("chainChanged", function (cid) {
      state.chainId = normalizeChainId(cid);
      emit();
    });
    provider.on("disconnect", function () { clearSession(false); });
  }

  function clearSession(disconnectProvider) {
    if (disconnectProvider && state.wcProvider) {
      try { if (state.wcProvider.disconnect) state.wcProvider.disconnect(); } catch (e) {}
    }
    state.provider = null;
    state.account = null;
    state.chainId = null;
    state.method = null;
    state.wcProvider = null;
    emit();
  }

  async function ensureBsc(provider) {
    var cid = normalizeChainId(await provider.request({ method: "eth_chainId" }));
    state.chainId = cid;
    if (cid === BSC.chainId) return true;
    try {
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: BSC.chainHex }],
      });
      state.chainId = BSC.chainId;
      return true;
    } catch (err) {
      var code = err && (err.code || (err.data && err.data.originalError && err.data.originalError.code));
      if (code === 4902) {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [{
            chainId: BSC.chainHex,
            chainName: BSC.chainName,
            nativeCurrency: BSC.nativeCurrency,
            rpcUrls: [BSC.rpcUrl],
            blockExplorerUrls: [BSC.explorer],
          }],
        });
        state.chainId = BSC.chainId;
        return true;
      }
      throw err;
    }
  }

  function getInjected() {
    if (typeof global.ethereum === "undefined") return null;
    var eth = global.ethereum;
    if (eth.providers && eth.providers.length) {
      var mm = eth.providers.find(function (p) { return p.isMetaMask; });
      return mm || eth.providers[0];
    }
    return eth;
  }

  async function connectInjected() {
    var provider = getInjected();
    if (!provider) {
      throw new Error("ไม่พบ MetaMask หรือวอลเล็ต injected — ติดตั้ง MetaMask หรือเปิดจาก in-app browser");
    }
    var accounts = await provider.request({ method: "eth_requestAccounts" });
    if (!accounts || !accounts.length) throw new Error("ผู้ใช้ยกเลิกการเชื่อมต่อ");
    state.provider = provider;
    state.account = accounts[0];
    state.method = "injected";
    bindProviderEvents(provider);
    try {
      await ensureBsc(provider);
    } catch (e) {
      console.warn("switch to BSC failed:", e);
      state.chainId = normalizeChainId(await provider.request({ method: "eth_chainId" }));
    }
    emit();
    return state.account;
  }

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (global["@walletconnect/ethereum-provider"]) { resolve(); return; }
      var s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.dataset.wcUmd = "1";
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("โหลด WalletConnect SDK ไม่สำเร็จ")); };
      document.head.appendChild(s);
    });
  }

  function getEthereumProviderCtor() {
    var mod = global["@walletconnect/ethereum-provider"];
    if (mod && mod.EthereumProvider) return mod.EthereumProvider;
    if (mod && mod.default && mod.default.EthereumProvider) return mod.default.EthereumProvider;
    if (global.EthereumProvider) return global.EthereumProvider;
    return null;
  }

  async function connectWalletConnect() {
    var projectId = getWcProjectId();
    if (!projectId) throw new Error("WC_PROJECT_ID_MISSING");
    await loadScript(WC_UMD);
    var EthereumProvider = getEthereumProviderCtor();
    if (!EthereumProvider) throw new Error("WalletConnect EthereumProvider ไม่พร้อมใช้งานจาก CDN");
    var wc = await EthereumProvider.init({
      projectId: projectId,
      optionalChains: [BSC.chainId],
      showQrModal: true,
      metadata: {
        name: "NexxTrade Web AI Dashboard",
        description: "Customer wallet connect · BSC USDT",
        url: global.location.origin,
        icons: [global.location.origin + "/favicon.ico"],
      },
    });
    await wc.enable();
    var accounts = wc.accounts || [];
    if (!accounts.length) accounts = await wc.request({ method: "eth_accounts" });
    if (!accounts || !accounts.length) throw new Error("WalletConnect ไม่ได้บัญชี");
    state.wcProvider = wc;
    state.provider = wc;
    state.account = accounts[0];
    state.method = "walletconnect";
    state.chainId = normalizeChainId(wc.chainId) || BSC.chainId;
    bindProviderEvents(wc);
    try { await ensureBsc(wc); } catch (e) { console.warn("WC switch to BSC:", e); }
    emit();
    return state.account;
  }

  async function disconnect() {
    if (state.method === "walletconnect" && state.wcProvider) {
      try { await state.wcProvider.disconnect(); } catch (e) {}
    }
    clearSession(false);
  }

  /** Client-only personal_sign demo — NOT SIWE session auth (no backend nonce). */
  async function personalSignDemo() {
    if (!state.provider || !state.account) throw new Error("ยังไม่ได้เชื่อมวอลเล็ต");
    var msg =
      "NexxTrade demo personal_sign (ไม่ใช่ SIWE session)\nAddress: " +
      state.account +
      "\nTime: " +
      new Date().toISOString();
    var hex =
      "0x" +
      Array.from(new TextEncoder().encode(msg))
        .map(function (b) { return b.toString(16).padStart(2, "0"); })
        .join("");
    var sig = await state.provider.request({
      method: "personal_sign",
      params: [hex, state.account],
    });
    return { message: msg, signature: sig, demoOnly: true };
  }

  async function tryRestoreInjected() {
    var provider = getInjected();
    if (!provider) return null;
    try {
      var accounts = await provider.request({ method: "eth_accounts" });
      if (!accounts || !accounts.length) return null;
      state.provider = provider;
      state.account = accounts[0];
      state.method = "injected";
      state.chainId = normalizeChainId(await provider.request({ method: "eth_chainId" }));
      bindProviderEvents(provider);
      emit();
      return state.account;
    } catch (e) {
      return null;
    }
  }

  global.NexxWallet = {
    BSC: BSC,
    on: on,
    connectInjected: connectInjected,
    connectWalletConnect: connectWalletConnect,
    disconnect: disconnect,
    personalSignDemo: personalSignDemo,
    tryRestoreInjected: tryRestoreInjected,
    getWcProjectId: getWcProjectId,
    getState: function () {
      return {
        account: state.account,
        chainId: state.chainId,
        method: state.method,
        short: shorten(state.account),
        onBsc: state.chainId === BSC.chainId,
      };
    },
    shorten: shorten,
  };
})(typeof window !== "undefined" ? window : globalThis);
