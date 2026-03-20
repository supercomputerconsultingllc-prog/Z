# Release Handoff Checklist

Use this when presenting the repo as a polished release example.

## Repo readiness
- [ ] `README.md` explains the release path clearly
- [ ] `ENTERPRISE_RELEASE_RUNBOOK.md` is current
- [ ] `codemagic.yaml` reflects the intended cloud build path
- [ ] no secrets are committed
- [ ] `.env.example` contains placeholders only

## Asset readiness
- [ ] icon generated
- [ ] raw screenshots generated
- [ ] polished screenshots generated
- [ ] support/privacy hosted pages generated
- [ ] release bundle created
- [ ] submission packet generated

## Metadata readiness
- [ ] bundle ID set
- [ ] support URL live
- [ ] privacy URL live
- [ ] pricing decision set
- [ ] review notes aligned to the build
- [ ] privacy disclosures aligned to the build

## Cloud build readiness
- [ ] Apple Developer account active
- [ ] App Store Connect app record exists
- [ ] Codemagic secrets configured
- [ ] signing configured
- [ ] archive/export path tested

## Submission readiness
- [ ] `.ipa` produced successfully
- [ ] build uploaded to App Store Connect or TestFlight
- [ ] screenshots and metadata verified
- [ ] pricing set in App Store Connect
- [ ] app submitted for review
