const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const required = [
  'package.json',
  'capacitor.config.json',
  'README.md',
  'QUICKSTART.md',
  'release/APP_PUBLISHING_CHECKLIST.md',
  'release/CODEMAGIC_SETUP.md',
  'release/LAUNCH_PLAN.md',
  'release/REPO_PUBLISH_CHECKLIST.md',
  'release/LAUNCH_DAY_CHECKLIST.md',
  'release/store-assets/README.md',
  'release/store-assets/ASSET_REQUIREMENTS.json',
  'release/store-assets/assets/README.md',
  'tools/check-assets.js',
  'tools/generate-icon.js',
  'tools/capture-screenshots.js',
  'tools/polish-screenshots.js',
  'tools/build-hosted-pages.js',
  'tools/apply-env-config.js',
  'tools/set-pages-urls.js',
  'tools/check-monetization-readiness.js',
  'tools/finalize-release.js',
  '.github/workflows/publish-hosted-pages.yml',
  'release/GITHUB_PAGES_SETUP.md',
  'release/FINAL_VALUES_QUICKSTART.md',
  'release/UPLOAD_AND_MONETIZE_GUIDE.md',
  'release/monetization/launch-config.json',
  'release/monetization/MONETIZATION_QUICKSTART.md'
];

let failed = false;
for (const rel of required) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    console.error('Missing:', rel);
    failed = true;
  }
}

if (failed) process.exit(1);
console.log('Release scaffold validation passed.');
