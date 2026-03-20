# Final Submission Bundle

## Include these before submission
- release web assets
- App Store copy drafts
- support URL
- privacy policy URL
- generated or polished screenshots
- icon asset
- launch pricing decision
- cloud build signing configuration
- hosted support/privacy page source in `release/hosted-pages/`

## Minimum final review
1. Confirm metadata matches the current build.
2. Confirm screenshots match the current UI.
3. Confirm support and privacy URLs are live.
4. Confirm age rating answers are accurate.
5. Confirm paid vs free launch choice is intentional.

## Suggested handoff order
1. Run `npm run finalize:release`
2. Review `release/submission-packet/APP_STORE_SUBMISSION_PACKET.md`
3. Push repo
4. Build in Codemagic
5. Upload to App Store Connect or let Codemagic publish to TestFlight
6. Complete store fields
7. Submit for review
