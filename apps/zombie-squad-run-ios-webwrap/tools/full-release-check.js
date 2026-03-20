const { execSync } = require('child_process');

let failed = false;

function run(cmd, failureMessage) {
  console.log(`\n> ${cmd}`);
  try {
    execSync(cmd, { stdio: 'inherit' });
  } catch (error) {
    failed = true;
    if (failureMessage) {
      console.error(`\n${failureMessage}`);
    }
  }
}

run('node tools/validate-release.js', 'Release scaffold validation failed.');
run('node tools/check-placeholders.js', 'Placeholder check failed. Fix placeholders before shipping.');
run('node tools/prepare-web.js', 'Web asset preparation failed.');
run('node tools/check-assets.js', 'Asset check failed. Add the required icon and screenshots before shipping.');
run('node tools/make-release-bundle.js', 'Release bundle generation failed.');
run('node tools/print-next-steps.js');

if (failed) {
  console.error('\nFull release check failed. Resolve the errors above before shipping.');
  process.exit(1);
}

console.log('\nFull release check completed successfully.');
