/* JKEdusphere edge worker
 * ------------------------------------------------------------------
 * URL housekeeping + clean addresses. It does not change any page logic.
 *
 *  1. www.jkedusphere.com            -> https://jkedusphere.com   (301)
 *  2. http://                        -> https://                  (301)
 *  3. /NOTES, /Mcqs/History-Of-JandK -> lowercase version         (301)
 *  4. trailing slash / double slash  -> removed                   (301)
 *  5. Clean URLs: /notes.html -> /notes, /mcqs/english.html -> /mcqs/english,
 *     /index.html -> /                                            (301)
 *  6. App pages (APP_ROUTES below) all serve index.html, which opens the right
 *     section from the address: /leaderboard, /answer-key-marker, /my-attempts,
 *     /login, /signup. Each gets its own <title>, description and canonical.
 *  7. Old links keep working: /?go=lb, /?go=ak, /?go=hist, /?login=1, /?login=su
 *     are redirected (301) to the new addresses. /?go=prem and /?test=... stay as they are.
 *  8. /sitemap.xml is built automatically on every request from
 *     mcq-pages.js, so adding an MCQ page there updates the sitemap too.
 *  9. Unknown URLs get the real 404 page with a true 404 status.
 */

const SITE = "https://jkedusphere.com";

/* ── App pages ───────────────────────────────────────────────────────
 * All of these are served from /index.html (the mock-test app).
 * Add a new section of the app here AND in the route table inside index.html (APP_ROUTES).
 * noindex = kept out of Google (private / login pages).
 */
const APP_ROUTES = {
  "/": null, // index.html already carries its own title and description
  "/leaderboard": {
    title: "Leaderboard – Live Mock Test Ranks | JKEdusphere",
    desc: "See live ranks and top performers in JKEdusphere mock tests for JKSSB, JKPSI Telecom, JKPSC and UPSC aspirants.",
  },
  "/answer-key-marker": {
    title: "Answer Key Matcher – Check Your Score | JKEdusphere",
    desc: "Free answer key matcher: enter your responses after the exam and get your score and analysis. Sign-in required.",
    noindex: true,
  },
  "/my-attempts": {
    title: "My Attempts | JKEdusphere",
    desc: "Your mock test attempts, scores and ranks on JKEdusphere.",
    noindex: true,
  },
  "/login": {
    title: "Sign In | JKEdusphere",
    desc: "Sign in to JKEdusphere to take mock tests, track your ranks and check your score.",
    noindex: true,
  },
  "/signup": {
    title: "Create Free Account | JKEdusphere",
    desc: "Create a free JKEdusphere account to take mock tests, track your ranks and check your score.",
    noindex: true,
  },
};

// Other spellings people may type or link to -> the real address (301).
const ALIASES = {
  "/leaderboards": "/leaderboard",
  "/ranks": "/leaderboard",
  "/ranking": "/leaderboard",
  "/answer-key": "/answer-key-marker",
  "/answerkey": "/answer-key-marker",
  "/answer-key-matcher": "/answer-key-marker",
  "/check-your-score": "/answer-key-marker",
  "/attempts": "/my-attempts",
  "/history": "/my-attempts",
  "/signin": "/login",
  "/sign-in": "/login",
  "/register": "/signup",
  "/sign-up": "/signup",
  "/tests": "/",
  "/mock-tests": "/",
};

// Old "/?go=" values -> new address
const GO_PATHS = { lb: "/leaderboard", ak: "/answer-key-marker", hist: "/my-attempts" };

// Public URLs always listed in the sitemap (in addition to the MCQ pages).
// Login-only and private pages are left out on purpose.
const SITEMAP_STATIC = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/notes", priority: "0.8", changefreq: "weekly" },
  { loc: "/leaderboard", priority: "0.6", changefreq: "daily" },
];

const MCQ_PRIORITY = "0.7";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;
    const isSafe = method === "GET" || method === "HEAD";

    // 1 + 2. host / protocol
    const isProd = url.hostname === "jkedusphere.com" || url.hostname === "www.jkedusphere.com";
    if (isProd && isSafe) {
      if (url.hostname === "www.jkedusphere.com" || url.protocol === "http:") {
        return redirect(SITE + tidy(url.pathname) + url.search);
      }
    }

    if (!isSafe) return env.ASSETS.fetch(request);

    // sitemap (dynamic)
    if (url.pathname.toLowerCase() === "/sitemap.xml") {
      return sitemap(env, request);
    }

    // 3 + 4. lowercase, collapse //, strip trailing slash
    const path = tidy(url.pathname);
    if (path !== url.pathname) {
      return redirect(url.origin + path + url.search);
    }

    // 7. old query-string links (/?go=lb, /?login=1 ...)
    const legacy = legacyTarget(url);
    if (legacy) return redirect(url.origin + legacy);

    // other spellings
    if (ALIASES[path]) return redirect(url.origin + ALIASES[path] + url.search);

    // 5. clean URLs: no ".html"
    if (path.endsWith(".html") && path !== "/404.html") {
      const clean = path === "/index.html" ? "/" : path.slice(0, -5);
      return redirect(url.origin + clean + url.search);
    }

    // 6. app pages
    if (Object.prototype.hasOwnProperty.call(APP_ROUTES, path)) {
      const res = await env.ASSETS.fetch(new Request(url.origin + "/index.html", request));
      if (res.status !== 200) return res;
      return withMeta(res, path, APP_ROUTES[path], request.method);
    }

    // Serve the file. Extensionless URLs map to <path>.html (/notes, /mcqs/english).
    let assetPath = path;
    if (!/\.[a-z0-9]+$/.test(path)) assetPath = path + ".html";

    if (path !== "/404") {
      const res = await env.ASSETS.fetch(new Request(url.origin + assetPath, request));
      if (res.status !== 404) return res;
    }

    // 9. real 404 page
    const nf = await env.ASSETS.fetch(new Request(url.origin + "/404.html", request));
    return new Response(request.method === "HEAD" ? null : nf.body, {
      status: 404,
      headers: nf.headers,
    });
  },
};

function tidy(p) {
  p = p.toLowerCase().replace(/\/{2,}/g, "/");
  return p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p;
}

function redirect(location) {
  return new Response(null, { status: 301, headers: { Location: location } });
}

// "/?go=lb" -> "/leaderboard";  "/?login=su&go=prem" -> "/signup?next=%2F%3Fgo%3Dprem"
function legacyTarget(url) {
  if (url.pathname !== "/") return null;
  const q = url.searchParams;
  const go = q.get("go");
  const login = q.get("login");
  const goPath = go ? GO_PATHS[go] : null;
  if (!login && !goPath) return null;

  const rest = new URLSearchParams(q);
  rest.delete("login");
  if (goPath) rest.delete("go");

  let dest;
  if (login !== null && login !== "") {
    dest = login === "su" ? "/signup" : "/login";
    const next = goPath || (go === "prem" ? "/?go=prem" : null);
    if (next) {
      if (!goPath) rest.delete("go"); // it travels inside next
      rest.set("next", next);
    }
  } else {
    dest = goPath;
  }
  const qs = rest.toString();
  return dest + (qs ? "?" + qs : "");
}

// Gives each app page its own title / description / canonical (index.html is one file for all of them).
function withMeta(res, path, meta, method) {
  if (!meta) return res;
  const canonical = SITE + path;
  const attr = (name, value) => ({ element(e) { e.setAttribute(name, value); } });
  const out = new HTMLRewriter()
    .on("title", { element(e) { e.setInnerContent(meta.title); } })
    .on('meta[name="description"]', attr("content", meta.desc))
    .on('meta[property="og:title"]', attr("content", meta.title))
    .on('meta[property="og:description"]', attr("content", meta.desc))
    .on('meta[property="og:url"]', attr("content", canonical))
    .on('meta[name="twitter:title"]', attr("content", meta.title))
    .on('meta[name="twitter:description"]', attr("content", meta.desc))
    .on('link[rel="canonical"]', attr("href", canonical))
    .on('meta[name="robots"]', {
      element(e) { if (meta.noindex) e.setAttribute("content", "noindex, nofollow"); },
    })
    .transform(res);
  const r = new Response(method === "HEAD" ? null : out.body, out);
  if (meta.noindex) r.headers.set("X-Robots-Tag", "noindex, nofollow");
  return r;
}

function xmlEscape(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

// Reads the list of MCQ pages from mcq-pages.js (the same file that feeds the MCQs dropdown).
async function mcqUrls(env, origin) {
  try {
    const r = await env.ASSETS.fetch(new Request(origin + "/mcq-pages.js"));
    if (!r.ok) return [];
    let src = await r.text();
    src = src.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""); // drop comments
    const out = [];
    const re = /href\s*:\s*["']([^"']+)["']/g;
    let m;
    while ((m = re.exec(src))) {
      let p = m[1].trim();
      if (/^https?:\/\//i.test(p)) {
        if (!p.startsWith(SITE + "/")) continue; // only our own pages
        p = p.slice(SITE.length);
      }
      if (!p.startsWith("/")) p = "/" + p;
      p = p.split("#")[0].split("?")[0].toLowerCase();
      if (p.endsWith(".html")) p = p.slice(0, -5); // clean URL
      if (!out.includes(p)) out.push(p);
    }
    return out;
  } catch (e) {
    return [];
  }
}

async function sitemap(env, request) {
  const origin = new URL(request.url).origin;
  const mcqs = await mcqUrls(env, origin);
  const items = SITEMAP_STATIC.concat(
    mcqs.map((loc) => ({ loc, priority: MCQ_PRIORITY, changefreq: "monthly" }))
  );
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    items
      .map(
        (i) =>
          "  <url>\n    <loc>" + xmlEscape(SITE + i.loc) + "</loc>\n" +
          "    <changefreq>" + i.changefreq + "</changefreq>\n" +
          "    <priority>" + i.priority + "</priority>\n  </url>"
      )
      .join("\n") +
    "\n</urlset>\n";
  return new Response(request.method === "HEAD" ? null : body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
