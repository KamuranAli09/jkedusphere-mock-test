/*!
 * JKEdusphere shared footer.
 * Add ONE line before </body> on any page:   <script src="/footer.js"></script>
 * Optional: put <div id="jke-footer"></div> where you want it; otherwise it is appended to the end of <body>.
 * Edit the config below once and every page updates.
 */
(function () {
  if (window.__jkeFooter) return;
  window.__jkeFooter = true;

  var SITE = "https://jkedusphere.com";
  var CONFIG = {
    name: "JKEdusphere",
    tagline:
      "Free & premium mock tests, notes and current affairs for J&K aspirants preparing for JKSSB, JKPSC, JKPSI, UPSC and more.",
    year: new Date().getFullYear(),
    socials: [
      { label: "Telegram", href: "https://t.me/JKEdusphere", icon: "tg" },
      {
        label: "WhatsApp",
        href: "https://api.whatsapp.com/send/?phone=917051617362&text=Hi+JKEdusphere%2C+I+need+help",
        icon: "wa",
      },
      { label: "Website", href: "https://www.jkedusphere.online", icon: "web" },
      // Add more, e.g. { label: "Instagram", href: "https://instagram.com/yourpage", icon: "web" }
    ],
    // nav: "x" = opens that section inside the tests app (works on every page)
    columns: [
      {
        title: "Quick links",
        links: [
          { t: "Mock Tests", href: SITE + "/", nav: "home" },
          { t: "Leaderboard", href: SITE + "/?go=lb", nav: "lb" },
          { t: "Check Your Score", href: SITE + "/?go=ak", nav: "ak" },
          { t: "Study Notes", href: SITE + "/notes" },
          { t: "MCQs", href: SITE + "/", mcq: true },
        ],
      },
      {
        title: "Explore",
        links: [
          { t: "jkedusphere.online", href: "https://www.jkedusphere.online", ext: true },
          { t: "jkedusphere.com", href: SITE + "/", ext: true },
          { t: "Telegram Channel", href: "https://t.me/JKEdusphere", ext: true },
        ],
      },
      {
        title: "Support",
        links: [
          { t: "Contact Us", href: "https://www.jkedusphere.online/p/contact-us_15.html" },
          {
            t: "WhatsApp Help",
            href: "https://api.whatsapp.com/send/?phone=917051617362&text=Hi+JKEdusphere%2C+I+need+help",
            ext: true,
          },
          { t: "Privacy Policy", href: "https://www.jkedusphere.online/p/privacy-policy.html" },
        ],
      },
    ],
    madeIn: "Made with care in Jammu & Kashmir",
  };

  var ICONS = {
    tg: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21.9 4.6 18.7 19.7c-.2 1-.9 1.3-1.7.8l-4.7-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.8 8.7-7.9c.4-.3-.1-.5-.6-.2L6.6 13.6l-4.7-1.5c-1-.3-1-1 .2-1.5L20.4 3.5c.9-.3 1.6.2 1.5 1.1Z"/></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20.5l1.7-5A8.5 8.5 0 1 1 21 11.5Z"/><path d="M9 9.5c.5 2.5 2.5 4.5 5 5l1.2-1.3-1.8-.9-.8.7c-.9-.4-1.7-1.2-2.1-2.1l.7-.8-.9-1.8L9 9.5Z"/></svg>',
    web: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="9.5"/><path d="M2.5 12h19M12 2.5c2.7 2.8 4 6 4 9.5s-1.3 6.7-4 9.5c-2.7-2.8-4-6-4-9.5s1.3-6.7 4-9.5Z"/></svg>',
  };

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  var CSS =
    ".jke-ft{margin-top:8px;background:#fff;border-top:1px solid #e7e9f1;font-family:'Google Sans Text','DM Sans',Arial,Helvetica,sans-serif;line-height:1.4;text-align:left;clear:both}" +
    ".jke-ft *{box-sizing:border-box}" +
    ".jke-ft a{text-decoration:none}" +
    ".jke-ft-in{max-width:1120px;margin:0 auto;padding:36px 20px 28px;display:grid;grid-template-columns:1.6fr 1fr 1fr 1fr;gap:28px 40px}" +
    ".jke-ft-logo{display:flex;align-items:center;gap:10px;font-size:16px;font-weight:800;color:#0d2b52;letter-spacing:-.2px}" +
    ".jke-ft-mark{width:32px;height:32px;border-radius:9px;background:linear-gradient(135deg,#0d2b52,#1a4a7a 55%,#4db3e6);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800}" +
    ".jke-ft-brand p{margin:12px 0 16px;max-width:340px;font-size:13px;line-height:1.65;color:#5b6478}" +
    ".jke-ft-soc{display:flex;gap:8px}" +
    ".jke-ft-soc a{width:36px;height:36px;border-radius:50%;border:1px solid #e7e9f1;display:flex;align-items:center;justify-content:center;color:#5b6478;transition:all .15s}" +
    ".jke-ft-soc a:hover{color:#fff;background:#482dff;border-color:#482dff;transform:translateY(-1px)}" +
    ".jke-ft-soc svg{width:17px;height:17px}" +
    ".jke-ft-col h4{margin:0 0 12px;font-size:12px;font-weight:800;letter-spacing:.7px;text-transform:uppercase;color:#08102b}" +
    ".jke-ft-col a{display:block;padding:5px 0;font-size:13.5px;font-weight:500;color:#5b6478;transition:color .15s}" +
    ".jke-ft-col a:hover{color:#482dff}" +
    ".jke-ft-bar{max-width:1120px;margin:0 auto;padding:16px 20px calc(18px + env(safe-area-inset-bottom,0px));border-top:1px solid #eef0f7;display:flex;justify-content:space-between;gap:8px 20px;flex-wrap:wrap;font-size:12px;color:#8b92a5}" +
    "@media (max-width:820px){.jke-ft-in{grid-template-columns:1fr 1fr;padding:28px 18px 20px}.jke-ft-brand{grid-column:1/-1}.jke-ft-bar{flex-direction:column;padding:14px 18px calc(16px + env(safe-area-inset-bottom,0px))}}" +
    "body:has(#test-pg.on) .jke-ft{display:none !important}";

  function link(l) {
    var a = '<a href="' + esc(l.href) + '"';
    if (l.nav) a += ' data-jnav="' + esc(l.nav) + '"';
    if (l.mcq) a += ' data-jmcq="1"';
    if (l.ext) a += ' target="_blank" rel="noopener"';
    return a + ">" + esc(l.t) + "</a>";
  }

  function build() {
    var c = CONFIG;
    var soc = c.socials
      .map(function (s) {
        return '<a href="' + esc(s.href) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '" title="' + esc(s.label) + '">' + (ICONS[s.icon] || ICONS.web) + "</a>";
      })
      .join("");
    var cols = c.columns
      .map(function (col) {
        return '<nav class="jke-ft-col" aria-label="' + esc(col.title) + '"><h4>' + esc(col.title) + "</h4>" + col.links.map(link).join("") + "</nav>";
      })
      .join("");
    return (
      '<div class="jke-ft-in"><div class="jke-ft-brand"><div class="jke-ft-logo"><span class="jke-ft-mark">JK</span><span>' +
      esc(c.name) + "</span></div><p>" + esc(c.tagline) + '</p><div class="jke-ft-soc">' + soc + "</div></div>" + cols + "</div>" +
      '<div class="jke-ft-bar"><span>&copy; ' + c.year + " " + esc(c.name) + ". All rights reserved.</span><span>" + esc(c.madeIn) + "</span></div>"
    );
  }

  function onClick(e) {
    var a = e.target.closest && e.target.closest(".jke-ft a");
    if (!a) return;
    var nav = a.getAttribute("data-jnav");
    if (nav && typeof window.goNav === "function") {
      e.preventDefault();
      window.scrollTo(0, 0);
      window.goNav(nav);
      return;
    }
    if (a.getAttribute("data-jmcq")) {
      var m = document.querySelector(".nl-mcqs");
      if (m) {
        e.preventDefault();
        window.scrollTo(0, 0);
        setTimeout(function () { m.click(); }, 250);
      }
    }
  }

  function init() {
    if (!document.getElementById("jke-footer-css")) {
      var st = document.createElement("style");
      st.id = "jke-footer-css";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    var el = document.createElement("div");
    el.className = "jke-ft";
    el.innerHTML = build();
    var slot = document.getElementById("jke-footer");
    if (slot) { slot.innerHTML = ""; slot.appendChild(el); } else { document.body.appendChild(el); }
    el.addEventListener("click", onClick);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
