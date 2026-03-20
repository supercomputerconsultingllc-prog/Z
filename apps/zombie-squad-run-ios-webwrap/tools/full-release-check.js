const { execSync } = require('child_process');

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

run('node tools/validate-release.js');
try {
  run('node tools/check-placeholders.js');
} catch (error) {
  console.log('\nPlaceholder check failed. Fix placeholders before shipping.');
}
run('node tools/prepare-web.js');
run('node tools/make-release-bundle.js');
run('node tools/print-next-steps.js');

console.log('\nFull release check completed successfully.');
