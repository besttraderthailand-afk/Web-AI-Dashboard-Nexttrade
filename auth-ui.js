/**
 * Primary customer auth UI — Google.
 * Web3 wallet is NOT primary (claim/withdraw only elsewhere).
 */
(function () {
  "use strict";
  var G = window.NexxGoogleAuth;
  if (!G) {
    console.error("NexxGoogleAuth missing — load google-auth.js first");
    return;
  }

  var who = document.getElementById("who");
  var btn = document.getElementById("btnGoogleLogin");
  var btnOut = document.getElementById("btnGoogleLogout");
  var gsiHost = document.getElementById("gsiButton");
  var hint = document.getElementById("googleAuthHint");
  var errEl = document.getElementById("googleAuthErr");

  function setErr(msg) {
    if (errEl) errEl.textContent = msg || "";
  }

  function render(user) {
    if (!who) return;
    if (!user) {
      who.textContent = "ยังไม่เข้าสู่ระบบ";
      who.className = "pill";
      if (btn) btn.style.display = "";
      if (btnOut) btnOut.style.display = "none";
      if (gsiHost) gsiHost.style.display = "";
      return;
    }
    var label = user.email || user.name || "Google";
    who.textContent = "Google · " + label;
    who.className = "pill ok-chain";
    if (btn) btn.style.display = "none";
    if (btnOut) btnOut.style.display = "";
    if (gsiHost) gsiHost.style.display = "none";
  }

  function showSetupHint() {
    var id = G.getClientId();
    if (hint) {
      if (id) {
        hint.textContent = "Google Sign-In พร้อม (Client ID จาก config / localStorage)";
      } else {
        hint.innerHTML =
          "ยังไม่ได้ตั้ง <code>GOOGLE_CLIENT_ID</code> ใน <code>config.js</code> " +
          "หรือ localStorage <code>google_client_id</code>. " +
          "สร้าง OAuth 2.0 Client ID (Web) ใน Google Cloud Console " +
          "แล้วใส่ Authorized JavaScript origins: " +
          "<code>https://web-ai-dashboard-nt.vercel.app</code> " +
          "และโดเมนลูกค้าเมื่อมี (app/ai/news/pay/go.<em>your-domain</em>)";
      }
    }
    if (btn) btn.disabled = !id;
  }

  function boot() {
    showSetupHint();
    render(G.getUser());
    if (G.getClientId() && gsiHost) {
      G.renderButton(gsiHost).catch(function (e) {
        setErr(e.message || String(e));
      });
    }
  }

  if (btn) {
    btn.addEventListener("click", function () {
      setErr("");
      if (!G.getClientId()) {
        setErr("ตั้ง GOOGLE_CLIENT_ID ก่อน (ดูข้อความด้านล่าง)");
        showSetupHint();
        return;
      }
      G.prompt().catch(function (e) {
        setErr(e.message || String(e));
      });
    });
  }
  if (btnOut) {
    btnOut.addEventListener("click", function () {
      G.signOut();
      render(null);
    });
  }

  window.addEventListener("nexx-google-auth", function (ev) {
    render(ev.detail || null);
  });

  boot();
})();
