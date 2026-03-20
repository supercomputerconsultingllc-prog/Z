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
- `npm run cap:init:notes` - prints the next-step guidance

## Important note
This scaffold does not eliminate Apple's build/signing requirements. It automates prep and reduces Mac dependence by shifting the final iOS build step to a cloud service.
