# Codemagic Setup Notes

## Before you start
- Apple Developer account active
- GitHub repo created
- support/privacy URLs ready, or run `npm run build:hosted-pages` and publish `release/hosted-pages/` to a static host like GitHub Pages before final submission

## High-level steps
1. Create a Codemagic account.
2. Connect your GitHub repository.
3. Choose iOS workflow.
4. Configure environment variables and signing.
5. Add App Store Connect API key or signing certificates.
6. Run the build.

## Files you should already have from this workspace
- game web assets
- release checklist
- App Store copy draft
- privacy draft
- support draft
- generated icon and screenshots from `npm run assets:starter-pack`
- generated hosted pages in `release/hosted-pages/`

## What to upload/configure in Codemagic
- bundle identifier
- team ID
- App Store Connect API key
- signing certificates / provisioning profile or automatic signing config

## Final outputs
- signed `.ipa`
- optional upload to App Store Connect

## Included starter file
- `codemagic.yaml`
