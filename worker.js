/* JKEdusphere edge worker
 * ------------------------------------------------------------------
 * Only does URL housekeeping. It does NOT touch any page, script or style.
 *
 *  1. www.jkedusphere.com            -> https://jkedusphere.com   (301)
 *  2. http://                        -> https://                  (301)
 *  3. /NOTES, /Mcqs/History-Of-JandK -> lowercase version         (301)
 *  4. trailing slash / double slash  -> removed                   (301)
 *  5. /notes.html -> /notes, /index.html -> /                     (301)
 *     /mcqs/<page> -> /mcqs/<page>.html                           (301)
 *     (these match the canonical URLs already written in the pages)
 *  6. /sitemap.xml is built automatically on every request from
 *     mcq-pages.js, so adding an MCQ page there updates the sitemap too.
 *  7. Unknown URLs get the real 404 page with a true 404 status.
 */

const SITE = "https://jkedusphere.com";

// Top-level pages that exist as files. Add a line here for any new top-level page.
// key = public URL (no extension), value = file in the repo
const PAGES = {
  "/": "/index.html",
  "/notes": "/notes.html",
};

// Public URLs always listed in the sitemap (in addition to the MCQ pages).
const SITEMAP_STATIC = [
  { loc: "/", priority: "1.0", changefreq: "weekly" },
  { loc: "/notes", priority: "0.8", changefreq: "weekly" },
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

    // 5. canonical forms
    if (path === "/index.html") return redirect(url.origin + "/" + url.search);
    if (path === "/notes.html") return redirect(url.origin + "/notes" + url.search);

    // MCQ pages: canonical form is /mcqs/<name>.html
    if (path.startsWith("/mcqs/") && !path.includes(".")) {
      return redirect(url.origin + path + ".html" + url.search);
    }

    // Serve the file
    let assetPath = PAGES[path] || path;
    // Extensionless unknown path: try <path>.html (so future top-level pages still work)
    if (!PAGES[path] && !/\.[a-z0-9]+$/.test(path)) assetPath = path + ".html";

    const res = await env.ASSETS.fetch(new Request(url.origin + assetPath, request));
    if (res.status !== 404) return res;

    // 7. real 404 page
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
      if (!p.endsWith(".html")) p += ".html";
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
