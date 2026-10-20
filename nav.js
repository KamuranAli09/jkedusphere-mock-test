/* JKEdusphere shared top bar.
 * Used by notes.html and the MCQ pages so they look and behave like the mock-test site.
 * Add to a page with:   <div id="jke-nav"></div><script src="/nav.js"></script>
 * Links are root-relative, so they work on any domain this site is served from.
 */
(function () {
  var SESSION_KEY = "jke_sess_v4"; // same key the mock-test app uses to remember a login
  var BLOG = "https://jkedusphere.blogspot.com/";
  var LINKS = [
    { id: "tests", label: "Tests", href: "/" },
    { id: "ranks", label: "Ranks", href: "/?go=lb" },
    { id: "ak", label: "Check Your Score", href: "/?go=ak", auth: true },
    { id: "hist", label: "My Attempts", href: "/?go=hist", auth: true },
    { id: "notes", label: "Notes", href: "/notes" },
    { id: "mcqs", label: "MCQs", href: "#", menu: true },
  ];

  var CSS =
    "#jke-nav{--nav:54px;--p:#482dff;--p2:#3a22d9;--g:#0d9488;--g2:#0f766e;--t1:#08102b;--t2:#4a5568;--t3:#718096;--bd:#e2e8f0;" +
    "position:fixed;top:0;left:0;right:0;z-index:9000;height:var(--nav);background:rgba(253,252,255,.95);" +
    "backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--bd);" +
    "display:flex;align-items:center;padding:0 16px;gap:10px;font-family:'Google Sans Text','DM Sans',Arial,Helvetica,sans-serif;line-height:1;box-sizing:border-box}" +
    "#jke-nav *{box-sizing:border-box}" +
    "#jke-nav a{text-decoration:none}" +
    "#jke-nav .nav-logo{display:flex;align-items:center;gap:9px;flex-shrink:0;padding-right:14px;margin-right:6px;border-right:1px solid var(--bd)}" +
    "#jke-nav .nav-logo-icon{width:32px;height:32px;border-radius:8px;background:linear-gradient(135deg,#0d2b52 0%,#1a4a7a 55%,#4db3e6 100%);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;color:#fff;letter-spacing:-.5px;box-shadow:0 2px 10px rgba(26,74,122,.35)}" +
    "#jke-nav .nav-logo-name{font-size:13px;font-weight:800;letter-spacing:-.2px;background:linear-gradient(90deg,#0d2b52 0%,#1a4a7a 45%,#4db3e6 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}" +
    "#jke-nav .nav-links{display:flex;height:var(--nav);flex:1;min-width:0;overflow-x:auto;overflow-y:hidden;-webkit-overflow-scrolling:touch;scrollbar-width:none;gap:0;margin:0}" +
    "#jke-nav .nav-links::-webkit-scrollbar{display:none}" +
    "#jke-nav .nav-link{display:flex;align-items:center;gap:5px;padding:0 13px;height:100%;font-size:12px;font-weight:600;color:var(--t3);cursor:pointer;border-bottom:2px solid transparent;border-radius:0;background:none;transition:all .15s;white-space:nowrap}" +
    "#jke-nav .nav-link:hover{color:var(--t2);background:none}" +
    "#jke-nav .nav-link.on{color:var(--t1);border-bottom-color:var(--p)}" +
    "#jke-nav .nav-desktop-links{display:none;align-items:center;gap:4px;height:var(--nav)}" +
    "@media (min-width:768px){#jke-nav .nav-desktop-links{display:flex}}" +
    "#jke-nav .nav-right{margin-left:auto;display:flex;align-items:center;gap:8px;flex-shrink:0;position:relative}" +
    "#jke-nav .nav-btn{padding:7px 15px;border:0;border-radius:9999px;font-size:12px;font-weight:700;font-family:inherit;background:var(--p);color:#fff;cursor:pointer;transition:all .15s;box-shadow:0 2px 10px rgba(72,45,255,.3)}" +
    "#jke-nav .nav-btn:hover{background:var(--p2);transform:translateY(-1px)}" +
    "#jke-nav .nav-prof{display:flex;align-items:center;gap:7px;cursor:pointer;padding:6px;margin:-6px;background:none;border:0;font-family:inherit}" +
    "#jke-nav .nav-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--g),var(--g2));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(0,201,122,.2)}" +
    "#jke-nav .nav-uname{display:none;font-size:12px;font-weight:600;color:var(--t2);max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}" +
    "@media (min-width:440px){#jke-nav .nav-uname{display:block}}" +
    "#jke-nav .nav-menu{display:none;position:absolute;top:calc(100% + 12px);right:0;min-width:190px;background:#fff;border:1px solid var(--bd);border-radius:12px;box-shadow:0 8px 30px rgba(0,0,0,.12);padding:6px;z-index:9100}" +
    "#jke-nav .nav-menu.open{display:block}" +
    "#jke-nav .nav-menu .nm-head{padding:8px 10px 10px;border-bottom:1px solid var(--bd);margin-bottom:4px}" +
    "#jke-nav .nav-menu .nm-name{font-size:13px;font-weight:700;color:var(--t1)}" +
    "#jke-nav .nav-menu .nm-mail{font-size:11px;color:var(--t3);margin-top:3px;overflow:hidden;text-overflow:ellipsis}" +
    "#jke-nav .nav-menu a,#jke-nav .nav-menu button{display:block;width:100%;text-align:left;padding:9px 10px;border:0;background:none;border-radius:8px;font-family:inherit;font-size:12.5px;font-weight:600;color:var(--t2);cursor:pointer}" +
    "#jke-nav .nav-menu a:hover,#jke-nav .nav-menu button:hover{background:#f1f4f9;color:var(--t1)}" +
    "@media (max-width:480px){#jke-nav .nav-logo-name{display:none}#jke-nav .nav-logo{padding-right:4px}#jke-nav .nav-link{padding:0 8px;font-size:11.5px;gap:3px}#jke-nav .nav-btn{padding:8px 14px}}";

  var MENU_CSS =
    "#jke-nav .mq-caret,.nav-link .mq-caret{font-size:9px;margin-left:3px;opacity:.7}" +
    "#jke-mcq-menu{display:none;position:fixed;z-index:9500;min-width:210px;max-width:calc(100vw - 16px);max-height:70vh;overflow-y:auto;background:#fff;border:1px solid #e2e8f0;border-radius:12px;box-shadow:0 12px 36px rgba(8,16,43,.16);padding:6px;font-family:'Google Sans Text','DM Sans',Arial,Helvetica,sans-serif}" +
    "#jke-mcq-menu.open{display:block}" +
    "#jke-mcq-menu a{display:block;padding:10px 12px;border-radius:8px;font-size:13px;font-weight:600;color:#4a5568;text-decoration:none;line-height:1.3}" +
    "#jke-mcq-menu a:hover{background:#f1f4f9;color:#08102b}" +
    "#jke-mcq-menu .mq-empty{padding:10px 12px;font-size:12.5px;color:#718096}";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function session() {
    try {
      var u = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      if (!u || !u.email) return null;
      if (u.exp && Date.now() > u.exp) return null;
      return u;
    } catch (e) {
      return null;
    }
  }

  function activeId() {
    var p = (location.pathname || "").toLowerCase();
    if (p.indexOf("notes") >= 0) return "notes";
    if (p.indexOf("mcq") >= 0) return "mcqs";
    return "";
  }

  function rightHtml() {
    var u = session();
    if (!u) return '<button type="button" class="nav-btn" id="jn-signin">Sign In</button>';
    var name = String(u.name || u.email);
    var ini = name.split(" ").map(function (w) { return w[0] || ""; }).join("").slice(0, 2).toUpperCase();
    return (
      '<button type="button" class="nav-prof" id="jn-prof" aria-haspopup="true">' +
      '<span class="nav-av">' + esc(ini) + "</span>" +
      '<span class="nav-uname">' + esc(name) + "</span></button>" +
      '<div class="nav-menu" id="jn-menu">' +
      '<div class="nm-head"><div class="nm-name">' + esc(name) + '</div><div class="nm-mail">' + esc(u.email) + "</div></div>" +
      '<a href="/">My Tests</a>' +
      '<a href="/?go=ak">Check Your Score</a>' +
      '<a href="/?go=hist">My Attempts</a>' +
      '<a href="/?go=lb">Leaderboard</a>' +
      '<button type="button" id="jn-out">Sign out</button></div>'
    );
  }

  // ── "MCQs" dropdown (list comes from /mcq-pages.js) ──
  var menuEl = null;
  function mcqPages() {
    return (window.JKE_MCQ_PAGES || []).filter(function (p) { return p && p.href && p.title; });
  }
  function closeMenu() {
    if (menuEl) menuEl.classList.remove("open");
  }
  function toggleMenu(ev) {
    if (ev) { ev.preventDefault(); ev.stopPropagation(); }
    if (!menuEl) { menuEl = document.createElement("div"); menuEl.id = "jke-mcq-menu"; document.body.appendChild(menuEl); }
    if (menuEl.classList.contains("open")) { closeMenu(); return false; }
    var pages = mcqPages();
    menuEl.innerHTML = pages.length
      ? pages.map(function (p) { return '<a href="' + esc(p.href) + '">' + esc(p.title) + "</a>"; }).join("")
      : '<div class="mq-empty">No MCQ pages yet.</div>';
    menuEl.classList.add("open");
    var a = ev && (ev.currentTarget || ev.target);
    var r = a && a.getBoundingClientRect ? a.getBoundingClientRect() : { left: 8, bottom: 54 };
    var w = menuEl.offsetWidth || 220;
    menuEl.style.top = Math.round(r.bottom + 6) + "px";
    menuEl.style.left = Math.max(8, Math.min(Math.round(r.left), window.innerWidth - w - 8)) + "px";
    return false;
  }
  document.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeMenu(); });
  window.addEventListener("resize", closeMenu);
  window.MCQMENU = { toggle: toggleMenu, close: closeMenu };

  function render() {
    var host = document.getElementById("jke-nav");
    if (!host) {
      host = document.createElement("div");
      host.id = "jke-nav";
      document.body.insertBefore(host, document.body.firstChild);
    }
    var on = activeId();
    host.innerHTML =
      '<a class="nav-logo" href="' + BLOG + '"><div class="nav-logo-icon">JK</div><span class="nav-logo-name">JKEdusphere</span></a>' +
      '<div class="nav-links">' +
      LINKS.filter(function (l) { return !l.auth || session(); }).map(function (l) {
        if (l.menu) {
          return '<a class="nav-link' + (l.id === on ? " on" : "") + '" href="#" data-mcqs="1">' + l.label + ' <span class="mq-caret">▾</span></a>';
        }
        return '<a class="nav-link' + (l.id === on ? " on" : "") + '" href="' + l.href + '">' + l.label + "</a>";
      }).join("") +
      "</div>" +
      '<div class="nav-desktop-links"><a class="nav-link" href="' + BLOG + '">Home</a></div>' +
      '<div class="nav-right" id="nav-right">' + rightHtml() + "</div>";

    var mq = host.querySelector("[data-mcqs]");
    if (mq) mq.addEventListener("click", toggleMenu);
    var signin = document.getElementById("jn-signin");
    if (signin) {
      // The sign-in popup lives in the mock-test app; "?login=1" opens it straight away.
      signin.addEventListener("click", function () { location.href = "/?login=1"; });
    }
    var prof = document.getElementById("jn-prof");
    var menu = document.getElementById("jn-menu");
    if (prof && menu) {
      prof.addEventListener("click", function (e) { e.stopPropagation(); menu.classList.toggle("open"); });
      document.addEventListener("click", function () { menu.classList.remove("open"); });
    }
    var out = document.getElementById("jn-out");
    if (out) {
      out.addEventListener("click", function () {
        try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
        render();
      });
    }
  }

  if (!document.getElementById("jke-nav-css")) {
    var st = document.createElement("style");
    st.id = "jke-nav-css";
    st.textContent = (window.JKE_NAV_MENU_ONLY ? "" : CSS) + MENU_CSS;
    document.head.appendChild(st);
  }
  function start() {
    if (!window.JKE_NAV_MENU_ONLY) render();
  }
  function boot() {
    if (window.JKE_MCQ_PAGES || window.JKE_NAV_MENU_ONLY) { start(); return; }
    // pages that don't include /mcq-pages.js themselves: load it, then draw the bar
    var sc = document.createElement("script");
    sc.src = "/mcq-pages.js";
    sc.onload = sc.onerror = start;
    document.head.appendChild(sc);
  }
  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);
  window.JKENav = { render: render };
})();
