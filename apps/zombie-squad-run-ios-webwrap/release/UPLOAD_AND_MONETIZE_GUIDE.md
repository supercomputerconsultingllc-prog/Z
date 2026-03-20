# Upload And Monetize Guide

This is the near-seamless path for taking Zombie Squad Run from workspace to a paid App Store submission.

## 1. Fill final values
```bash
cp .env.example .env
npm run apply:env-config
```

## 2. Generate release assets and hosted pages
```bash
npm run assets:starter-pack
```

## 3. Publish support and privacy pages
Fastest path: GitHub Pages.
- enable GitHub Pages with GitHub Actions
- run the `publish-hosted-pages` workflow
- confirm `/support/` and `/privacy/` are live

## 4. Stamp public URLs into metadata
```bash
GITHUB_OWNER=YOUR_USER GITHUB_REPO=YOUR_REPO npm run set:pages-urls
```

## 5. Choose launch monetization
Edit:
- `release/monetization/launch-config.json`

Recommended first release:
- `launchModel`: `paid-upfront`
- `paidPriceTier`: `$0.99` or `$1.99`
- keep rewarded revive as a later update

## 6. Run the final one-command prep
```bash
npm run finalize:release
```

## 7. Push to GitHub and build in Codemagic
- push repo
- connect Codemagic
- set Apple credentials as secure environment variables
- run the iOS workflow

## 8. Upload and submit
- upload the `.ipa` to App Store Connect
- choose the build
- paste final metadata
- set the paid price tier
- submit for review

## 9. Monitor after submission
- review status in App Store Connect
- support mailbox for bug reports
- first-session install quality
- early conversion versus price point

## Version 1 monetization recommendation
Paid upfront is still the cleanest path. It gets the app live with the least policy and SDK friction. Add rewarded revive only after the upload and review path is proven.
