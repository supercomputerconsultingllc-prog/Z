const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit', cwd: root });
}

if (!fs.existsSync(envPath)) {
  console.error('Missing .env file. Copy .env.example to .env and fill in final values first.');
  process.exit(1);
}

run('node tools/apply-env-config.js');
run('node tools/build-hosted-pages.js');
try {
  run('node tools/set-pages-urls.js');
} catch (error) {
  console.log('\nPages URL stamping skipped or still incomplete. Add PAGES_BASE_URL or GITHUB_OWNER/GITHUB_REPO in .env when ready.');
}
run('node tools/generate-icon.js');
run('node tools/capture-screenshots.js');
run('node tools/polish-screenshots.js');
run('node tools/check-placeholders.js');
run('node tools/check-assets.js');
run('node tools/validate-release.js');
run('node tools/make-release-bundle.js');
run('node tools/check-monetization-readiness.js');
run('node tools/print-next-steps.js');

console.log('\nFinal release prep completed.');
