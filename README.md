# JKEdusphere Mock Test Platform

Static frontend for the JKEdusphere mock test platform. Backend is Google Apps Script + Google Sheets; payments via Razorpay.

## Structure
- `index.html` — the entire app (HTML/CSS/JS inline). No build step required.

## Deploy to Cloudflare Pages
1. Push this repo to GitHub.
2. In Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**.
3. Select this repo/branch.
4. Build settings:
   - Build command: *(leave blank)*
   - Build output directory: `/` (repo root)
5. Deploy. You'll get a `*.pages.dev` URL to test first.
6. Once verified, add your custom domain under **Custom domains** in the Pages project settings.

## Notes
- Google Apps Script endpoint URL and all external resources (fonts, Razorpay checkout.js) are absolute — no config changes needed for a new domain.
- No relative or root-relative asset paths — safe to host from any subdirectory or root.
