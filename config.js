/* Public config — no secrets.
 * Admin console + customer wallet connect settings.
 * Override via window.* before this script, ?query, or localStorage where noted.
 */
window.ADMIN_API_BASE =
  window.ADMIN_API_BASE || "https://nexttrade-ea-admin-api.vercel.app";

/* WalletConnect / Reown Cloud Project ID (public).
 * Set here, or window.WALLETCONNECT_PROJECT_ID before load,
 * or localStorage key: walletconnect_project_id
 * Allowed origin for this deploy: https://web-ai-dashboard-nt.vercel.app
 * Leave empty → WalletConnect button shows setup hint (MetaMask still works).
 */
window.WALLETCONNECT_PROJECT_ID = window.WALLETCONNECT_PROJECT_ID || "";

/* BSC mainnet — connect / switch target */
window.WALLET_CHAIN_ID = window.WALLET_CHAIN_ID || 56;
window.WALLET_CHAIN_HEX = window.WALLET_CHAIN_HEX || "0x38";
window.WALLET_CHAIN_NAME = window.WALLET_CHAIN_NAME || "BNB Smart Chain";
window.WALLET_RPC_URL =
  window.WALLET_RPC_URL || "https://bsc-dataseed.binance.org/";
window.WALLET_EXPLORER = window.WALLET_EXPLORER || "https://bscscan.com";

/* USDT BEP20 payment vault — leave empty = payment stays simulation (do not invent) */
window.USDT_PAYMENT_VAULT = window.USDT_PAYMENT_VAULT || "";

/* EA catalog — public, no auth.
 * Live: ADMIN_API_BASE + "/catalog/eas"
 * Fallback static file (always ship with Pages/Vercel static):
 */
window.CATALOG_STATIC_URL = window.CATALOG_STATIC_URL || "./catalog/eas.json";

/* nexttrade-backend (scan / news / rules / notify) — set ONLY after a real public URL exists.
 * Leave empty until VPS/Docker deploy is live. Do not invent a host.
 * Example: "https://api.your-domain.com"
 * CORS on the backend must include this dashboard origin.
 */
window.NEXTTRADE_BACKEND_URL = window.NEXTTRADE_BACKEND_URL || "";

