# Enterprise Release Runbook

This file is the concise operator guide for turning this repo into a reviewable App Store submission example.

## Release objective
Ship a paid-upfront iOS wrapper build of Zombie Squad Run with:
- real bundle identifier
- live support and privacy URLs
- generated screenshots and icon
- release bundle and submission packet
- cloud build path via Codemagic

## 1. Local release prep
```bash
cd apps/zombie-squad-run-ios-webwrap
cp .env.example .env
```

Fill:
- `APP_ID`
- `APP_NAME`
- `PAGES_BASE_URL` or `GITHUB_OWNER` + `GITHUB_REPO`

Then run:
```bash
npm install
npm run finalize:release
npm run generate:submission-packet
```

## 2. Publish public pages
Required before App Store submission:
- support page live
- privacy page live

Preferred route:
- push to GitHub
- enable GitHub Pages
- run the Pages publish workflow
- verify `/support/` and `/privacy/`

Then rerun:
```bash
npm run set:pages-urls
npm run finalize:release
```

## 3. Apple setup
Create or confirm:
- Apple Developer membership
- Bundle ID matching `APP_ID`
- App Store Connect app record
- App Store Connect API key

## 4. Codemagic setup
Add these environment variables in Codemagic:
- `APP_ID`
- `APP_NAME`
- `PAGES_BASE_URL` or (`GITHUB_OWNER`, `GITHUB_REPO`)
- `APPLE_TEAM_ID`
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_ID`
- `APP_STORE_CONNECT_PRIVATE_KEY_BASE64`

Configure signing so the workflow can archive/export an `.ipa`.

## 5. Build and upload
Use the `zombie-squad-run-ios` workflow in `codemagic.yaml`.

Expected outputs:
- prepared release bundle
- generated submission packet
- signed `.ipa`
- optional upload to App Store Connect

## 6. Final App Store Connect tasks
- choose the uploaded build
- verify metadata fields
- verify screenshots
- set pricing tier
- complete App Privacy answers
- submit for review

## 7. What makes this repo reviewer-friendly
A reviewer should be able to inspect:
- `codemagic.yaml`
- `release/UPLOAD_AND_MONETIZE_GUIDE.md`
- `ENTERPRISE_RELEASE_RUNBOOK.md`
- `release/submission-packet/APP_STORE_SUBMISSION_PACKET.md`
- `release/monetization/launch-config.json`

## Recommended v1 launch model
- paid-upfront
- $0.99 or $1.99
- no ad SDK in v1
- rewarded revive only in a later update
