/* JKEdusphere shared top bar + side menu.
 *
 * Bar layout
 *   logged out :  [☰] [logo ............................ Sign In]
 *   logged in  :  [logo ............................ avatar] [☰]
 * All links live in the side menu (opens from the left when logged out, from the right when logged in).
 *
 * Add to a page with:   <div id="jke-nav"></div><script src="/nav.js"></script>
 * The logo is live text (inline SVG, styled with CSS) so it stays sharp at any size. Links are root-relative.
 *
 * The mock-test page (index.html) draws its own bar and sets window.JKE_NAV_MENU_ONLY = 1,
 * so this file only supplies the menu there. That page tells us about sign-in / sign-out with
 *   JKENav.setAuth(true | false)
 * and handles its own in-page navigation through window.goNav(...).
 */
(function () {
  var SESSION_KEY = "jke_sess_v4"; // same key the mock-test app uses to remember a login
  var BLOG = "https://jkedusphere.com/";
  var LOGO_ALT = "JKEdusphere – Powered by Vision & Knowledge";

  // Wordmark + tagline as real text on a 657×147 canvas (same proportions and colours as the artwork).
  // textLength pins each line to its exact width, so it can never look squeezed or stretched.
  function logoSvg(uid) {
    var g = "jkeg-" + uid;
    return (
      '<svg class="jke-logo" viewBox="0 0 657 147" width="143" height="32" role="img" aria-label="' + esc(LOGO_ALT) + '">' +
      '<defs><linearGradient id="' + g + '" gradientUnits="userSpaceOnUse" x1="6" y1="0" x2="651" y2="0">' +
      '<stop offset="0" stop-color="#1b235a"/><stop offset=".124" stop-color="#1b235a"/><stop offset=".248" stop-color="#1f2c61"/>' +
      '<stop offset=".434" stop-color="#1e3a72"/><stop offset=".496" stop-color="#1f417a"/><stop offset=".62" stop-color="#407eb8"/>' +
      '<stop offset=".682" stop-color="#61acdd"/><stop offset=".744" stop-color="#6cbce1"/><stop offset=".874" stop-color="#6cbde9"/>' +
      '<stop offset="1" stop-color="#6cbde9"/></linearGradient></defs>' +
      '<text x="6" y="86" textLength="645" lengthAdjust="spacing" font-size="106" font-weight="700" fill="url(#' + g + ')">JKEdusphere</text>' +
      '<text x="74" y="134" textLength="506" lengthAdjust="spacing" font-size="33.5" font-weight="400" fill="#8f8e8d">Powered by Vision &amp; Knowledge</text>' +
      "</svg>"
    );
  }

  // go = the mock-test app's own page name (used by window.goNav when it exists)
  var LINKS = [
    { id: "blog", label: "Home", href: BLOG, ico: "home" },
    { sep: true },
    { id: "home", label: "Tests", labelIn: "My Tests", href: "/", go: "home", ico: "tests" },
    { id: "lb", label: "Ranks", labelIn: "Leaderboard", href: "/?go=lb", go: "lb", ico: "trophy" },
    { id: "ak", label: "Check Your Score", href: "/?go=ak", go: "ak", auth: true, ico: "key" },
    { id: "hist", label: "My Attempts", href: "/?go=hist", go: "hist", auth: true, ico: "clock" },
    { sep: true },
    { id: "notes", label: "Notes", href: "/notes", ico: "notes" },
    { id: "mcqs", label: "MCQs", href: "#", menu: true, ico: "mcq" },
  ];

  var ICONS = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    tests: '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M9 14l2 2 4-4"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 01-8 0z"/><path d="M8 6H5a3 3 0 003 4M16 6h3a3 3 0 01-3 4"/><path d="M12 13v4M9 20h6M10 17h4"/>',
    key: '<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>',
    clock: '<path d="M3 12a9 9 0 109-9 9 9 0 00-7 3.5L3 8"/><path d="M3 3v5h5"/><path d="M12 8v4l3 2"/>',
    notes: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
    mcq: '<path d="M4 7l2 2 3-3M4 16l2 2 3-3"/><path d="M12 8h8M12 17h8"/>',
    out: '<path d="M9 4H5v16h4"/><path d="M16 8l4 4-4 4M20 12H9"/>',
  };
  function ico(name) {
    return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + ICONS[name] + "</svg>";
  }

  /* ───────────── styles ───────────── */

  // The bar itself (only injected on pages that let this file draw the bar)
  var BAR_CSS = [
    "#jke-nav{--nav:54px;--p:#1a4a7a;--p2:#123253;--g:#0d9488;--g2:#0f766e;--t1:#08102b;--t2:#4a5568;--t3:#718096;--bd:#e2e8f0;",
    "position:fixed;top:0;left:0;right:0;z-index:9000;height:var(--nav);background:rgba(253,252,255,.95);",
    "backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px);border-bottom:1px solid var(--bd);",
    "display:flex;align-items:center;padding:0 16px;gap:10px;font-family:'Google Sans Text','DM Sans',Arial,Helvetica,sans-serif;line-height:1;box-sizing:border-box}",
    "#jke-nav *{box-sizing:border-box}",
    "#jke-nav a{text-decoration:none}",
    "#jke-nav .nav-btn{padding:7px 15px;border:0;border-radius:9999px;font-size:12px;font-weight:700;font-family:inherit;background:var(--p);color:#fff;cursor:pointer;transition:all .15s;box-shadow:0 2px 10px rgba(26,74,122,.3)}",
    "#jke-nav .nav-btn:hover{background:var(--p2);transform:translateY(-1px)}",
    "#jke-nav .nav-prof{display:flex;align-items:center;gap:7px;cursor:pointer;padding:6px;margin:-6px;background:none;border:0;font-family:inherit;-webkit-tap-highlight-color:transparent}",
    "#jke-nav .nav-av{width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--g),var(--g2));display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(0,201,122,.2)}",
    "#jke-nav .nav-uname{display:none;font-size:12px;font-weight:600;color:var(--t2);max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    "@media (min-width:440px){#jke-nav .nav-uname{display:block}}",
  ].join("");

  // Burger + logo + side menu (injected everywhere, including the mock-test page)
  var MENU_CSS = [
    /* bar pieces shared with the mock-test page's own bar */
    "#jke-nav .nav-logo{display:flex;align-items:center;flex-shrink:0;min-width:0;padding:0;margin:0;border:0;order:1}",
    ".jke-logo{display:block;height:32px;width:auto;aspect-ratio:657/147;overflow:visible;flex-shrink:0}",
    ".jke-logo text{font-family:Lato,Carlito,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;text-rendering:geometricPrecision;-webkit-font-smoothing:antialiased}",
    "#jke-nav .nav-prof{display:flex;align-items:center;gap:7px;cursor:pointer;padding:6px;margin:-6px;background:none;border:0;font-family:inherit;-webkit-tap-highlight-color:transparent}",
    "#jke-nav .nav-right{margin-left:auto;order:2;display:flex;align-items:center;gap:8px;flex-shrink:0;position:relative}",
    "@media (max-width:350px){#jke-nav .jke-logo{height:27px}}",

    /* the staircase burger: no border, no background */
    "#jke-nav .nav-burger{order:0;flex-shrink:0;display:flex;flex-direction:column;justify-content:center;align-items:flex-start;gap:4px;",
    "width:40px;height:40px;padding:0 10px;margin:0 -10px 0 -10px;border:0;border-radius:0;background:none;box-shadow:none;",
    "cursor:pointer;-webkit-tap-highlight-color:transparent;font:inherit;color:#08102b}",
    "#jke-nav .nav-burger i{display:block;height:2px;border-radius:2px;background:currentColor;transition:width .2s ease}",
    "#jke-nav .nav-burger i:nth-child(1){width:20px}",
    "#jke-nav .nav-burger i:nth-child(2){width:14px}",
    "#jke-nav .nav-burger i:nth-child(3){width:8px}",
    "#jke-nav .nav-burger:hover i:nth-child(2){width:18px}",
    "#jke-nav .nav-burger:hover i:nth-child(3){width:14px}",
    "#jke-nav .nav-burger:focus{outline:none}",
    "#jke-nav .nav-burger:focus-visible{outline:2px solid #4db3e6;outline-offset:-4px;border-radius:6px}",
    /* logged in: burger goes to the far right, stairs mirror so they hug the edge */
    "#jke-nav.is-in .nav-burger{order:3;align-items:flex-end}",

    /* side menu */
    "html.jke-lock{overflow:hidden}",
    "#jke-scrim{position:fixed;inset:0;z-index:9590;background:rgba(8,16,43,.35);opacity:0;visibility:hidden;transition:opacity .25s ease,visibility 0s linear .25s}",
    "#jke-scrim.open{opacity:1;visibility:visible;transition:opacity .25s ease}",
    "#jke-drawer{--accent:#1a4a7a;position:fixed;top:0;bottom:0;left:0;z-index:9600;width:min(280px,82vw);background:#fff;overflow:hidden;",
    "display:flex;flex-direction:column;font-family:'Google Sans Text','DM Sans',Arial,Helvetica,sans-serif;line-height:1.3;box-sizing:border-box;",
    "box-shadow:8px 0 32px rgba(8,16,43,.14);transform:translateX(-102%);visibility:hidden;",
    "transition:transform .26s cubic-bezier(.22,.8,.3,1),visibility 0s linear .26s}",
    "#jke-drawer *{box-sizing:border-box}",
    "#jke-drawer.right{left:auto;right:0;box-shadow:-8px 0 32px rgba(8,16,43,.14);transform:translateX(102%)}",
    "#jke-drawer.open{transform:none;visibility:visible;transition:transform .26s cubic-bezier(.22,.8,.3,1)}",
    /* top */
    "#jke-drawer .jd-top{position:relative;flex-shrink:0;padding:calc(20px + env(safe-area-inset-top,0px)) 20px 18px;border-bottom:1px solid #eef1f5}",
    "#jke-drawer .jd-close{position:absolute;top:calc(10px + env(safe-area-inset-top,0px));right:8px;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border:0;background:none;border-radius:50%;color:#8793a6;cursor:pointer;-webkit-tap-highlight-color:transparent}",
    "#jke-drawer .jd-close:hover{background:#f4f7fb;color:#08102b}",
    "#jke-drawer .jd-close:focus-visible,#jke-drawer .jd-item:focus-visible,#jke-drawer .jd-sub a:focus-visible,#jke-drawer .jd-signin:focus-visible{outline:2px solid #4db3e6;outline-offset:-2px}",
    "#jke-drawer .jd-user{display:none;align-items:center;gap:12px;padding-right:34px}",
    "#jke-drawer.in .jd-user{display:flex}",
    "#jke-drawer .jd-av{width:40px;height:40px;border-radius:50%;flex-shrink:0;background:#eef2f8;color:#1a4a7a;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center}",
    "#jke-drawer .jd-who{min-width:0}",
    "#jke-drawer .jd-name{font-size:15px;font-weight:700;color:#08102b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    "#jke-drawer .jd-mail{font-size:12px;color:#8793a6;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}",
    "#jke-drawer .jd-guest{padding-right:34px}",
    "#jke-drawer.in .jd-guest{display:none}",
    "#jke-drawer .jd-guest b{display:block;font-size:16px;font-weight:700;color:#08102b}",
    "#jke-drawer .jd-guest span{display:block;font-size:12.5px;color:#8793a6;margin-top:4px;line-height:1.45}",
    "#jke-drawer .jd-signin{margin-top:14px;padding:9px 20px;border:0;border-radius:9999px;background:#1a4a7a;color:#fff;font-family:inherit;font-size:13px;font-weight:700;cursor:pointer}",
    /* list */
    "#jke-drawer .jd-list{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:8px 10px;-webkit-overflow-scrolling:touch}",
    "#jke-drawer .jd-sep{height:1px;background:#eef1f5;margin:8px 10px}",
    "#jke-drawer .jd-item{display:flex;align-items:center;gap:14px;width:100%;padding:12px 10px;margin:0;border:0;border-radius:10px;background:none;",
    "font-family:inherit;font-size:14.5px;font-weight:500;color:#3d4757;text-align:left;text-decoration:none;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:background .15s,color .15s}",
    "#jke-drawer .jd-item:hover{background:#f6f8fb;color:#08102b}",
    "#jke-drawer .jd-ico{width:20px;height:20px;flex-shrink:0;display:flex;color:#8793a6;transition:color .15s}",
    "#jke-drawer .jd-item:hover .jd-ico{color:#3d4757}",
    "#jke-drawer .jd-lbl{flex:1;min-width:0}",
    "#jke-drawer .jd-item.on{background:#f1f5fa;color:var(--accent);font-weight:700}",
    "#jke-drawer .jd-item.on .jd-ico{color:var(--accent)}",
    "#jke-drawer .jd-item[data-auth]{display:none}",
    "#jke-drawer.in .jd-item[data-auth]{display:flex}",
    "#jke-drawer .jd-caret{width:16px;height:16px;flex-shrink:0;transition:transform .2s ease;opacity:.45}",
    "#jke-drawer .jd-mcq[aria-expanded=true] .jd-caret{transform:rotate(180deg)}",
    "#jke-drawer .jd-sub{display:none;margin:0 0 4px 20px;padding-left:24px}",
    "#jke-drawer .jd-sub.open{display:block}",
    "#jke-drawer .jd-sub a{display:block;padding:9px 10px;border-radius:8px;font-size:13.5px;font-weight:500;color:#5b6678;text-decoration:none}",
    "#jke-drawer .jd-sub a:hover{background:#f6f8fb;color:#08102b}",
    "#jke-drawer .jd-empty{padding:9px 10px;font-size:13px;color:#8793a6}",
    /* footer */
    "#jke-drawer .jd-foot{display:none;flex-shrink:0;padding:8px 10px calc(10px + env(safe-area-inset-bottom,0px));border-top:1px solid #eef1f5}",
    "#jke-drawer.in .jd-foot{display:block}",
    "#jke-drawer .jd-out{width:100%;display:flex;align-items:center;gap:14px;padding:12px 10px;border:0;border-radius:10px;background:none;font-family:inherit;font-size:14.5px;font-weight:500;color:#8793a6;cursor:pointer;text-align:left}",
    "#jke-drawer .jd-out:hover{background:#fff5f5;color:#c53030}",
    "@media (prefers-reduced-motion:reduce){#jke-drawer,#jke-scrim,#jke-nav .nav-burger i{transition:none !important}}",
  ].join("");

  /* ───────────── helpers ───────────── */

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

  // The mock-test page reports its login state here; other pages read it from storage.
  var authOverride = null, userOverride = null;
  function isIn() {
    return authOverride !== null ? authOverride : !!session();
  }
  function curUser() {
    var u = authOverride !== null ? userOverride : session();
    if (!u) return null;
    var name = String(u.name || u.email || "");
    return {
      name: name,
      email: String(u.email || ""),
      ini: name.split(" ").map(function (w) { return w[0] || ""; }).join("").slice(0, 2).toUpperCase() || "U",
    };
  }

  function activeId() {
    var p = (location.pathname || "").toLowerCase();
    if (p.indexOf("notes") >= 0) return "notes";
    if (p.indexOf("mcq") >= 0) return "mcqs";
    return "";
  }

  function mcqPages() {
    return (window.JKE_MCQ_PAGES || []).filter(function (p) { return p && p.href && p.title; });
  }

  /* ───────────── side menu ───────────── */

  var drawer = null, scrim = null, lastFocus = null;
  var CARET = '<svg class="jd-caret" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8l5 5 5-5"/></svg>';
  var CLOSE = '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15"/></svg>';

  function buildDrawer() {
    if (drawer || !document.body) return;
    var on = activeId();
    var pages = mcqPages();

    scrim = document.createElement("div");
    scrim.id = "jke-scrim";
    scrim.addEventListener("click", closeDrawer);

    drawer = document.createElement("div");
    drawer.id = "jke-drawer";
    drawer.setAttribute("role", "dialog");
    drawer.setAttribute("aria-modal", "true");
    drawer.setAttribute("aria-label", "Menu");
    drawer.setAttribute("aria-hidden", "true");

    var items = LINKS.map(function (l) {
      if (l.sep) return '<div class="jd-sep"></div>';
      var cls = "jd-item" + (l.id === on ? " on" : "");
      var auth = l.auth ? " data-auth" : "";
      var chip = '<span class="jd-ico">' + ico(l.ico) + "</span>";
      if (l.menu) {
        return (
          '<button type="button" class="' + cls + ' jd-mcq" id="nl-' + l.id + '" aria-expanded="false" aria-controls="jd-mcq-list">' +
          chip + '<span class="jd-lbl">' + esc(l.label) + "</span>" + CARET + "</button>" +
          '<div class="jd-sub" id="jd-mcq-list">' +
          (pages.length
            ? pages.map(function (p) { return '<a href="' + esc(p.href) + '">' + esc(p.title) + "</a>"; }).join("")
            : '<div class="jd-empty">No MCQ pages yet.</div>') +
          "</div>"
        );
      }
      return (
        '<a class="' + cls + '" id="nl-' + l.id + '" href="' + esc(l.href) + '"' + auth +
        (l.go ? ' data-go="' + l.go + '"' : "") + ">" + chip + '<span class="jd-lbl">' + esc(l.label) + "</span></a>"
      );
    }).join("");

    drawer.innerHTML =
      '<div class="jd-top">' +
      '<button type="button" class="jd-close" aria-label="Close menu">' + CLOSE + "</button>" +
      '<div class="jd-user"><div class="jd-av" id="jd-av"></div><div class="jd-who"><div class="jd-name" id="jd-name"></div><div class="jd-mail" id="jd-mail"></div></div></div>' +
      '<div class="jd-guest"><b>Welcome</b><span>Sign in to track your tests and ranks.</span><button type="button" class="jd-signin" id="jd-signin">Sign In</button></div>' +
      "</div>" +
      '<nav class="jd-list" aria-label="Main">' + items + "</nav>" +
      '<div class="jd-foot"><button type="button" class="jd-out" id="jd-out"><span class="jd-ico">' + ico("out") + "</span>Sign out</button></div>";

    drawer.addEventListener("click", function (e) {
      var t = e.target.closest ? e.target.closest("a,button") : null;
      if (!t) return;
      if (t.classList.contains("jd-close")) { closeDrawer(); return; }
      if (t.id === "jd-out") { closeDrawer(true); signOut(); return; }
      if (t.id === "jd-signin") {
        closeDrawer(true);
        if (typeof window.openAuthModal === "function") window.openAuthModal("si");
        else location.href = "/?login=1";
        return;
      }
      if (t.classList.contains("jd-mcq")) {
        var open = t.getAttribute("aria-expanded") !== "true";
        t.setAttribute("aria-expanded", open ? "true" : "false");
        var sub = document.getElementById("jd-mcq-list");
        if (sub) sub.classList.toggle("open", open);
        return;
      }
      var go = t.getAttribute("data-go");
      if (go && typeof window.goNav === "function") {
        // on the mock-test page: switch pages in place (keeps its exit-test guard)
        e.preventDefault();
        closeDrawer(true);
        window.goNav(go);
        return;
      }
      closeDrawer(true); // normal link: the browser follows it
    });

    document.body.appendChild(scrim);
    document.body.appendChild(drawer);
    syncDrawer();
  }

  function syncDrawer() {
    var nav = document.getElementById("jke-nav");
    var inn = isIn();
    if (nav) nav.classList.toggle("is-in", inn);
    if (!drawer) return;
    drawer.classList.toggle("in", inn);
    drawer.classList.toggle("right", inn);
    LINKS.forEach(function (l) {
      if (!l.labelIn) return;
      var el = document.querySelector("#nl-" + l.id + " .jd-lbl");
      if (el) el.textContent = inn ? l.labelIn : l.label;
    });
    var u = inn ? curUser() : null;
    var set = function (id, v) { var e = document.getElementById(id); if (e) e.textContent = v; };
    set("jd-av", u ? u.ini : "");
    set("jd-name", u ? u.name : "");
    set("jd-mail", u ? u.email : "");
  }

  function signOut() {
    if (window.AUTH && typeof window.AUTH.logout === "function") {
      // mock-test page: its own logout, behind its exit-test guard
      if (window.EXITGUARD && typeof window.EXITGUARD.confirm === "function") window.EXITGUARD.confirm(window.AUTH.logout);
      else window.AUTH.logout();
      return;
    }
    try { localStorage.removeItem(SESSION_KEY); } catch (e) {}
    render();
  }

  function burgerEl() {
    return document.querySelector("#jke-nav .nav-burger");
  }

  function openDrawer() {
    buildDrawer();
    if (!drawer) return;
    syncDrawer();
    lastFocus = document.activeElement;
    drawer.classList.add("open");
    scrim.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("jke-lock");
    var b = burgerEl();
    if (b) { b.setAttribute("aria-expanded", "true"); b.setAttribute("aria-label", "Close menu"); }
    var first = drawer.querySelector(".jd-close");
    if (first) first.focus({ preventScroll: true });
  }

  function closeDrawer(skipFocus) {
    if (!drawer || !drawer.classList.contains("open")) return;
    drawer.classList.remove("open");
    scrim.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("jke-lock");
    var b = burgerEl();
    if (b) { b.setAttribute("aria-expanded", "false"); b.setAttribute("aria-label", "Open menu"); }
    if (skipFocus !== true) {
      var f = b || lastFocus;
      if (f && f.focus) f.focus({ preventScroll: true });
    }
  }

  function toggleDrawer() {
    if (drawer && drawer.classList.contains("open")) closeDrawer();
    else openDrawer();
  }

  // One delegated listener, so it works whichever script drew the bar.
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest("#jke-nav .nav-burger") : null;
    if (b) { e.preventDefault(); e.stopPropagation(); toggleDrawer(); return; }
    var p = e.target.closest ? e.target.closest("#jke-nav .nav-prof") : null;
    if (p) { e.preventDefault(); e.stopPropagation(); toggleDrawer(); }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeDrawer();
  });
  window.addEventListener("resize", function () { /* keep it open on rotate; nothing to do */ });

  // Old pages call MCQMENU.toggle(event) from a "MCQs" link; send them to the new menu.
  window.MCQMENU = {
    toggle: function (ev) {
      if (ev && ev.preventDefault) ev.preventDefault();
      openDrawer();
      var m = drawer && drawer.querySelector(".jd-mcq");
      if (m && m.getAttribute("aria-expanded") !== "true") m.click();
      return false;
    },
    close: closeDrawer,
  };

  /* ───────────── the bar (pages that let nav.js draw it) ───────────── */

  function rightHtml() {
    // signed in: nothing here (the account card is in the side menu)
    if (session()) return "";
    return '<button type="button" class="nav-btn" id="jn-signin">Sign In</button>';
  }

  function render() {
    var host = document.getElementById("jke-nav");
    if (!host) {
      host = document.createElement("div");
      host.id = "jke-nav";
      document.body.insertBefore(host, document.body.firstChild);
    }
    authOverride = null; // this page reads the login from storage
    host.innerHTML =
      '<button type="button" class="nav-burger" aria-label="Open menu" aria-expanded="false" aria-controls="jke-drawer"><i></i><i></i><i></i></button>' +
      '<a class="nav-logo" href="' + BLOG + '" aria-label="JKEdusphere home">' + logoSvg("bar") + "</a>" +
      '<div class="nav-right" id="nav-right">' + rightHtml() + "</div>";

    buildDrawer();
    syncDrawer();

    var signin = document.getElementById("jn-signin");
    if (signin) {
      // The sign-in popup lives in the mock-test app; "?login=1" opens it straight away.
      signin.addEventListener("click", function () { location.href = "/?login=1"; });
    }
  }

  /* ───────────── boot ───────────── */

  if (!document.getElementById("jke-nav-css")) {
    var st = document.createElement("style");
    st.id = "jke-nav-css";
    st.textContent = (window.JKE_NAV_MENU_ONLY ? "" : BAR_CSS) + MENU_CSS;
    document.head.appendChild(st);
  }

  if (!document.getElementById("jke-nav-font")) {
    var lk = document.createElement("link");
    lk.id = "jke-nav-font";
    lk.rel = "stylesheet";
    lk.href = "https://fonts.googleapis.com/css2?family=Lato:wght@400;700&display=swap";
    document.head.appendChild(lk);
  }

  function start() {
    if (window.JKE_NAV_MENU_ONLY) buildDrawer();
    else render();
  }
  function ready(fn) {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
    else fn();
  }
  function boot() {
    if (window.JKE_MCQ_PAGES || window.JKE_NAV_MENU_ONLY) { ready(start); return; }
    // pages that don't include /mcq-pages.js themselves: load it, then draw the bar
    var sc = document.createElement("script");
    sc.src = "/mcq-pages.js";
    sc.onload = sc.onerror = function () { ready(start); };
    document.head.appendChild(sc);
  }
  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);

  window.JKENav = {
    render: render,
    open: openDrawer,
    close: closeDrawer,
    // for the mock-test page: tell the menu who (if anyone) is signed in: setAuth(true, {name, email})
    setAuth: function (inn, user) { authOverride = !!inn; userOverride = user || null; syncDrawer(); },
  };
})();
