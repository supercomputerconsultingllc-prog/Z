# Replace Values Checklist

Before shipping, replace all explicit placeholder markers.

## Required replacements
- `REPLACE_WITH_REAL_APP_ID`
- `REPLACE_WITH_REAL_SUPPORT_URL`
- `REPLACE_WITH_REAL_PRIVACY_URL`
- `REPLACE_WITH_REAL_TEAM_ID`
- `REPLACE_WITH_REAL_ISSUER_ID`
- `REPLACE_WITH_REAL_KEY_ID`
- `REPLACE_WITH_REAL_BASE64_KEY`

## Main files to update
- `capacitor.config.json`
- `.env.example` (for reference only, real values go in cloud build secrets)
- `release/store-assets/app-store-metadata.json`

## Important note
Do not commit real Apple secrets to git.
Use your cloud build provider secret store for sensitive values.

## Suggested order
1. Choose final app ID
2. Host support page
3. Host privacy page
4. Configure cloud build secrets
5. Run `npm run check:placeholders`
6. Run `npm run release:check`
