/* Admin console public config — no secrets.
 * Default points at temporary Vercel Admin API.
 * Override via login form, ?api=URL, or localStorage admin_api_base.
 */
window.ADMIN_API_BASE =
  window.ADMIN_API_BASE || "https://nexttrade-ea-admin-api.vercel.app";
