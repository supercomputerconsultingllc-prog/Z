# Codemagic Release-Ready Notes

This repo now targets a release-oriented Codemagic flow.

## What the workflow should do
- install dependencies
- stamp final app config
- stamp public support/privacy URLs
- run final release prep
- generate a submission packet
- add and sync iOS platform
- archive/export a signed `.ipa`
- optionally publish to App Store Connect

## Required Codemagic setup outside git
- connect the repo in Codemagic
- add environment variables and secrets
- configure iOS signing
- connect App Store Connect publishing if you want direct upload

## Required secrets
- `APPLE_TEAM_ID`
- `APP_STORE_CONNECT_ISSUER_ID`
- `APP_STORE_CONNECT_KEY_ID`
- `APP_STORE_CONNECT_PRIVATE_KEY_BASE64`

## Important note
If you use direct publishing from Codemagic, make sure the App Store Connect app record already exists and uses the same bundle ID as `APP_ID`.
