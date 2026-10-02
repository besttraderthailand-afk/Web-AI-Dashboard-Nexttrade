/* Public config — no secrets.
 * Override via window.* before this script, ?query, or localStorage where noted.
 */

window.ADMIN_API_BASE =
  window.ADMIN_API_BASE || "https://nexttrade-ea-admin-api.vercel.app";

/* ---- Customer auth (locked plan 2026-10-02): Google primary ----
 * Set GOOGLE_CLIENT_ID from Google Cloud OAuth Web client (public).
 * Never commit client secrets. Leave empty → UI shows Thai setup hint.
 * localStorage override: google_client_id
 */
window.GOOGLE_CLIENT_ID =
  window.GOOGLE_CLIENT_ID ||
  "680268728616-uasvqesui9dgqhth085791h27rtdh6ts.apps.googleusercontent.com";

/* ---- Customer hosts (locked plan): app. ai. news. pay. go. ; admin separate ----
 * Placeholders use nexxtrade.example (same pattern as go. link + ADMIN_HOSTS docs).
 * Do not invent a real custom domain here — fill after DNS is ready.
 *
 * CUSTOMER_MENU_MODE:
 *   "auto"  — on vercel.app / github.io / localhost → SPA hash; on *.nexxtrade.example → host URLs
 *   "spa"   — always same-origin #page (single Vercel project today)
 *   "hosts" — always navigate to CUSTOMER_HOSTS absolute URLs
 */
window.CUSTOMER_ROOT_DOMAIN = window.CUSTOMER_ROOT_DOMAIN || "nexxtrade.example";
window.CUSTOMER_MENU_MODE = window.CUSTOMER_MENU_MODE || "auto";
window.CUSTOMER_HOSTS = window.CUSTOMER_HOSTS || {
  app: "https://app.nexxtrade.example",
  ai: "https://ai.nexxtrade.example",
  news: "https://news.nexxtrade.example",
  pay: "https://pay.nexxtrade.example",
  go: "https://go.nexxtrade.example",
};
/* Admin is NOT in customer menu — separate origin only */
window.ADMIN_HOST_URL =
  window.ADMIN_HOST_URL || "https://admin.nexxtrade.example";

/* WalletConnect / Reown — secondary (claim/withdraw only). Not primary login. */
window.WALLETCONNECT_PROJECT_ID = window.WALLETCONNECT_PROJECT_ID || "";

/* BSC mainnet — connect / switch target (claim wallet only) */
window.WALLET_CHAIN_ID = window.WALLET_CHAIN_ID || 56;
window.WALLET_CHAIN_HEX = window.WALLET_CHAIN_HEX || "0x38";
window.WALLET_CHAIN_NAME = window.WALLET_CHAIN_NAME || "BNB Smart Chain";
window.WALLET_RPC_URL =
  window.WALLET_RPC_URL || "https://bsc-dataseed.binance.org/";
window.WALLET_EXPLORER = window.WALLET_EXPLORER || "https://bscscan.com";

/* USDT BEP20 payment vault — leave empty.
 * Locked pay plan uses bill-number + QR matching (integer 20 USDT), not a shared vault.
 * Do not invent an address.
 */
window.USDT_PAYMENT_VAULT = window.USDT_PAYMENT_VAULT || "";

window.CATALOG_STATIC_URL = window.CATALOG_STATIC_URL || "./catalog/eas.json";

window.NEXTTRADE_BACKEND_URL = window.NEXTTRADE_BACKEND_URL || "";

window.LOCAL_AGENT_URL = window.LOCAL_AGENT_URL || "http://127.0.0.1:8787";

window.CHAT_PROXY_URL = window.CHAT_PROXY_URL || "";
