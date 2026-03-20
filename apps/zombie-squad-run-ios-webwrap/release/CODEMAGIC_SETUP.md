# Codemagic Setup Notes

## Before you start
- Apple Developer account active
- GitHub repo created
- support/privacy URLs ready or placeholder pages hosted

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
- support placeholder

## What to upload/configure in Codemagic
- bundle identifier
- team ID
- App Store Connect API key
- signing certificates / provisioning profile or automatic signing config

## Final outputs
- signed `.ipa`
- optional upload to App Store Connect
