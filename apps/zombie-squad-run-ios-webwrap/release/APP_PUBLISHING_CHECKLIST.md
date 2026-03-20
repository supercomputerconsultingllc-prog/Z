# App Publishing Checklist

## Local Windows prep
- [ ] Node.js installed
- [ ] `npm install` ran successfully
- [ ] `npm run release:prep` ran successfully
- [ ] game reviewed in local browser
- [ ] app icon created and placed at `release/store-assets/assets/icon/app-icon-1024.png`
- [ ] 5 screenshots exported to `release/store-assets/assets/screenshots/iphone/`
- [ ] `npm run check:assets` passes

## Cloud iOS build prep
- [ ] GitHub repo created
- [ ] repo pushed
- [ ] GitHub Actions prep workflow reviewed
- [ ] Codemagic project connected
- [ ] Codemagic YAML reviewed
- [ ] Apple Developer account active
- [ ] signing configured
- [ ] App Store Connect metadata ready

## Launch prep
- [ ] pricing chosen
- [ ] `npm run build:hosted-pages` ran successfully
- [ ] support URL live
- [ ] privacy policy URL live
- [ ] screenshots uploaded
- [ ] age rating reviewed
