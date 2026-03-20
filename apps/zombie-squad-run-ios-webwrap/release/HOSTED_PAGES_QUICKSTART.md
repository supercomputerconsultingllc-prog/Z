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
Publish the `release/hosted-pages/` folder to any static host, for example:
- GitHub Pages
- Cloudflare Pages
- Netlify
- Vercel static hosting

## Then update metadata
Put the final public URLs into:
- `release/store-assets/app-store-metadata.json`

## Example URL shape
- `https://your-site.example/zombie-squad-run/support/`
- `https://your-site.example/zombie-squad-run/privacy/`

## Final check
Run:
```bash
npm run check:placeholders
npm run preflight
```
