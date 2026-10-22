Upload to the jkedusphere-mock-test repo (same paths):
  index.html                    replace (root)
  nav.js                        replace (root)
  mcq-pages.js                  NEW (root)  <- the list behind the MCQs dropdown
  mcqs/history-of-jandk.html    replace
  mcqs/_template.html           replace

To add an MCQ page later: upload its .html into mcqs/, then add one line in mcq-pages.js.

--- Redirects & sitemap (worker.js, wrangler.jsonc, robots.txt) ---
worker.js handles www -> non-www, http -> https, UPPERCASE URLs -> lowercase, trailing slashes,
and builds /sitemap.xml automatically from mcq-pages.js. Nothing else to maintain:
  * New MCQ page  -> add its line in mcq-pages.js (sitemap updates itself).
  * New top-level page (like notes) -> add it to PAGES and SITEMAP_STATIC at the top of worker.js.
