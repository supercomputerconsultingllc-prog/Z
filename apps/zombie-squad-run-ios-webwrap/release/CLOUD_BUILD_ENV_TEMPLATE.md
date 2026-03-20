# Cloud Build Environment Template

Use these values in Codemagic or your chosen cloud iOS build service.

## Required identifiers
- `APP_ID` = final app bundle ID, for example `com.zombiesquadrun.game`
- `APP_NAME` = Zombie Squad Run
- `APPLE_TEAM_ID` = your Apple Developer team ID
- optional `BUILD_NOTIFY_EMAIL` = address for Codemagic build notifications
- optional `PAGES_BASE_URL` = published support/privacy site base URL
- optional `GITHUB_OWNER` = GitHub username or org
- optional `GITHUB_REPO` = GitHub repository name

## App Store Connect
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_ID`
- `APP_STORE_CONNECT_PRIVATE_KEY_BASE64`

## Notes
- Do not commit real secrets to git.
- Store signing credentials only in the cloud build provider.
- Keep bundle identifier and App Store Connect app record aligned.
