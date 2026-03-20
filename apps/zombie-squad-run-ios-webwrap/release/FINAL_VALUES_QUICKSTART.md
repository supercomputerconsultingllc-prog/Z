# Final Values Quickstart

This is the last-mile configuration pass before a real iOS submission.

## 1. Copy env template
```bash
cp .env.example .env
```

## 2. Fill in `.env`
Required:
- `APP_ID`
- `APP_NAME`
- `APPLE_TEAM_ID`
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_ID`
- `APP_STORE_CONNECT_PRIVATE_KEY_BASE64`

## 3. Apply the app identifier locally
```bash
npm run apply:env-config
```

That updates `capacitor.config.json` with your final app ID and app name.

## 4. Publish support/privacy pages
Use GitHub Pages or another static host.

## 5. Stamp the public URLs into metadata
Example with GitHub Pages:
```bash
GITHUB_OWNER=YOUR_USER GITHUB_REPO=YOUR_REPO npm run set:pages-urls
```

Or with a custom base URL:
```bash
PAGES_BASE_URL=https://your-site.example/zombie-squad-run npm run set:pages-urls
```

## 6. Run final checks
```bash
npm run check:placeholders
npm run preflight
npm run release:check
```

## Notes
- Keep real Apple secrets in Codemagic or your cloud provider, not in git.
- `.env` should stay local.
