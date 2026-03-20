# Store Asset Template Pack

This folder helps you prepare App Store listing assets.

## Files
- `SCREENSHOT_SCRIPT.md`
- `STORE_LISTING_TEMPLATE.md`
- `PROMO_ASSET_PLAN.md`
- `APP_STORE_SUBMISSION_NOTES.md`
- `APP_STORE_FIELD_CHECKLIST.md`
- `APP_STORE_DESCRIPTION_LONG.md`
- `APP_STORE_SHORT_DESCRIPTION.txt`
- `ICON_BRIEF.md`
- `SCREEN_TEXT_OVERLAYS.md`
- `app-store-metadata.json`
- `support-page-template.html`
- `privacy-page-template.html`
- `ASSET_REQUIREMENTS.json`
- `assets/README.md`

Use these as the base for icon, screenshot, listing, support page, privacy page, and submission-note preparation before submission.

## Final asset drop zone
When you have final export-ready assets, place them in `assets/` using the exact filenames listed in `ASSET_REQUIREMENTS.json`. Then run `npm run check:assets` or `npm run preflight` to verify nothing critical is missing before cloud build or App Store upload.

## Starter asset generation
You can generate a first-pass icon and screenshot pack with:
- `npm run generate:icon`
- `npm run capture:screenshots`
- `npm run assets:starter-pack`

These outputs are intended as a usable first pack and review baseline. Replace them later with polished marketing art if needed.
