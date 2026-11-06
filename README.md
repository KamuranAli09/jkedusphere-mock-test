# JKEdusphere Mock Test Platform

Static frontend served by a Cloudflare Worker (`worker.js`). Backend: Node.js + MongoDB on Render (see `JKE_URL` in `index.html`); payments via Razorpay.

## Addresses

| Address | What it is | Access |
|---|---|---|
| `/` | Tests (splash page when signed out, dashboard when signed in) | public |
| `/leaderboard` | Ranks | public |
| `/answer-key-marker` | Answer Key Matcher | sign-in required |
| `/my-attempts` | Attempt history | sign-in required |
| `/login`, `/signup` | Sign-in / sign-up page (`?next=/page` returns the student to that page afterwards) | public, `noindex` |
| `/notes` | Notes store | public |
| `/mcqs/<name>` | Topic MCQ pages | public |

Old links (`/?go=lb`, `/?login=1`, `/notes.html`, `/mcqs/english.html`) are 301-redirected to these.

## Files
- `index.html` — the whole mock-test app (HTML/CSS/JS inline). It reads the address bar to decide which section to open.
- `worker.js` — routes, redirects, per-page title/description/canonical, `/sitemap.xml`.
- `nav.js` — top bar + side menu for every page. Also holds `window.JKE_SITE` (page addresses and the info@/support@ emails) that `footer.js` and the app read.
- `footer.js` — the one shared footer (links, socials, emails).
- `mcq-pages.js` — list behind the MCQs menu and the sitemap.
- `notes.html`, `404.html`, `mcqs/*.html` — other pages.

## Common changes
- **Rename a page address:** edit `JKE_SITE.paths` in `nav.js`, `APP_ROUTES` / `ALIASES` in `worker.js`.
- **Add an MCQ page:** upload `mcqs/<name>.html`, add one line to `mcq-pages.js` (sitemap updates itself). Canonical URL has no `.html`.
- **Add a top-level static page:** upload `<name>.html` (served at `/<name>`), add it to `SITEMAP_STATIC` in `worker.js`, add `<div id="jke-nav"></div><script src="/nav.js"></script>` at the top and `<script src="/footer.js"></script>` at the bottom.
- **Change footer links or emails:** `footer.js` (CONFIG) and `JKE_SITE.emails` in `nav.js`.

## Deploy
`wrangler deploy` (Workers with static assets; see `wrangler.jsonc`) or the Cloudflare Git integration. Test locally with `npx wrangler dev`.
