# Hosted Pages Quickstart

Use this when you need real support and privacy URLs for App Store submission.

## Generate the pages
```bash
npm run build:hosted-pages
```

That produces:
- `release/hosted-pages/support/index.html`
- `release/hosted-pages/privacy/index.html`

## Fastest publish option
Use GitHub Pages if this project is already in GitHub. A workflow is included at `.github/workflows/publish-hosted-pages.yml`.

Other static hosts also work:
- Cloudflare Pages
- Netlify
- Vercel static hosting

See also:
- `release/GITHUB_PAGES_SETUP.md`

## Then update metadata
Put the final public URLs into:
- `release/store-assets/app-store-metadata.json`

If you use GitHub Pages, those will usually look like:
- `https://USER.github.io/REPO/support/`
- `https://USER.github.io/REPO/privacy/`

## Example URL shape
- `https://your-site.example/zombie-squad-run/support/`
- `https://your-site.example/zombie-squad-run/privacy/`

## Final check
Run:
```bash
npm run check:placeholders
npm run preflight
```
