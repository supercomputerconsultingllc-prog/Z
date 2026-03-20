# Repo Publish Checklist

## Before pushing to GitHub
- [ ] review `package.json`
- [ ] confirm bundle identifier placeholder is replaced
- [ ] remove placeholder support email values
- [ ] remove placeholder website URLs
- [ ] confirm privacy policy text is acceptable
- [ ] confirm no secrets are committed
- [ ] confirm Apple credentials are **not** stored in the repo

## Recommended repo contents
- web wrap scaffold
- release docs
- generated release bundle
- Capacitor config
- cloud build config

## Recommended repo excludes
- local caches
- temporary export files
- signing materials
- API keys or tokens

## First push sequence
1. initialize repo if needed
2. commit scaffold
3. push to GitHub
4. connect GitHub repo to Codemagic
5. verify GitHub Actions prep workflow appears
