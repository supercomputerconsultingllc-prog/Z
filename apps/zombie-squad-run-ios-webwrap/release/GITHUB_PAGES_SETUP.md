# GitHub Pages Setup

This is the fastest path to real support and privacy URLs from this repo.

## What the workflow does
The workflow at `.github/workflows/publish-hosted-pages.yml` builds:
- `release/hosted-pages/support/index.html`
- `release/hosted-pages/privacy/index.html`

Then it publishes them to GitHub Pages.

## One-time GitHub setup
1. Push the repo to GitHub.
2. In GitHub, open **Settings → Pages**.
3. Set **Build and deployment** to **GitHub Actions**.
4. Run the **publish-hosted-pages** workflow once, or push a change to the support/privacy source files.

## Resulting URL shape
If the repo is `https://github.com/USER/REPO`, the published pages usually appear at:
- `https://USER.github.io/REPO/support/`
- `https://USER.github.io/REPO/privacy/`

## After publish
Update `release/store-assets/app-store-metadata.json` with the real published URLs, then run:
```bash
npm run check:placeholders
npm run preflight
```

## Practical example
If your GitHub Pages site becomes:
- `https://USER.github.io/REPO/support/`
- `https://USER.github.io/REPO/privacy/`

put those exact URLs into the metadata file and the placeholder check will stop failing for those fields.

## Notes
- GitHub Pages URLs are public, so only publish final support/privacy content.
- If you want a custom domain later, you can add it in GitHub Pages settings.
