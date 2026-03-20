# Zombie Squad Run iOS Web Wrap

This folder automates the Windows-friendly prep path for getting Zombie Squad Run ready for iOS packaging.

## What this solves
You said the constraint is Windows only. Native iOS builds still require Apple tooling somewhere, but this scaffold automates the prep so you can do almost everything on Windows and use a cloud macOS/iOS builder for the final build/sign/upload.

## Fastest Windows-only route
1. Install Node.js on Windows.
2. Run `npm install` in this folder.
3. Run `npm run release:prep`.
4. Push this folder to GitHub.
5. Use Codemagic or another cloud Apple build service.
6. Add Apple Developer credentials in the cloud service.
7. Build the iOS app and export `.ipa` or publish to App Store Connect.

## Scripts
- `npm run prepare:web` - copies game assets into the Capacitor web folder
- `npm run release:prep` - prepares web assets and release bundle
- `npm run validate:release` - checks required release scaffold files
- `npm run check:placeholders` - flags obvious placeholder values still present in shipping docs/config
- `npm run preflight` - runs release validation and prints next-step guidance
- `npm run release:check` - runs validation, checks placeholders, prepares assets, builds the release bundle, and prints next steps
- `npm run cap:init:notes` - prints the next-step guidance

## Quickstart
- `QUICKSTART.md`

## Added automation
- `.github/workflows/release-prep.yml` - GitHub Actions prep workflow
- `codemagic.yaml` - Codemagic starter workflow
- `release/assets-checklist/` - icon and screenshot planning pack
- `release/store-assets/` - listing copy, icon brief, and page templates
- `release/LAUNCH_PLAN.md` - paid vs free launch recommendation
- `release/CLOUD_BUILD_ENV_TEMPLATE.md` - cloud build environment variable template
- `release/FINAL_SUBMISSION_BUNDLE.md` - final handoff/submission summary
- `release/REPO_PUBLISH_CHECKLIST.md` - repo-ready publishing checklist
- `release/LAUNCH_DAY_CHECKLIST.md` - launch-day execution checklist
- `release/store-assets/` - store listing asset template pack

## Important note
This scaffold does not eliminate Apple's build/signing requirements. It automates prep and reduces Mac dependence by shifting the final iOS build step to a cloud service.
