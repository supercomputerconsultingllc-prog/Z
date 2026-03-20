# Windows-to-iOS Shipping Path

## Best route when you only have Windows
Use a cloud macOS/iOS build service.

### Recommended option
- Codemagic

### Why
- can build iOS apps from GitHub
- handles Apple signing workflows in the cloud
- works from Windows

## Practical flow
1. Prepare the web app locally on Windows.
2. Push the wrapper repo to GitHub.
3. Connect the repo to Codemagic.
4. Configure Apple certificates, provisioning, and App Store Connect credentials.
5. Trigger iOS builds in the cloud.
6. Download `.ipa` or submit to App Store Connect.

## What still needs Apple access
- Apple Developer account
- app identifiers
- certificates/profiles or App Store Connect API credentials

## Fastest monetization path
- ship as paid app first, or
- ship free and add rewarded revive later once release flow is stable
