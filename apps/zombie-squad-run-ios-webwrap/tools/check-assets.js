const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const manifestPath = path.join(root, 'release/store-assets/ASSET_REQUIREMENTS.json');

if (!fs.existsSync(manifestPath)) {
  console.error('Missing asset requirements manifest:', manifestPath);
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

function toArray(section) {
  if (!section) return [];
  return Array.isArray(section) ? section : [section];
}

const requiredItems = [
  ...toArray(manifest.icon),
  ...toArray(manifest.screenshots).filter(item => item.required !== false),
  ...toArray(manifest.optional).filter(item => item.required === true)
];

const optionalItems = [
  ...toArray(manifest.optional).filter(item => item.required === false)
];

const missingRequired = requiredItems.filter(item => !fs.existsSync(path.join(root, item.path)));
const missingOptional = optionalItems.filter(item => !fs.existsSync(path.join(root, item.path)));

if (missingRequired.length) {
  console.log('Missing required store assets:');
  for (const item of missingRequired) {
    console.log(`- ${item.path} (${item.description || 'required asset'})`);
  }
  if (missingOptional.length) {
    console.log('\nOptional assets not present yet:');
    for (const item of missingOptional) {
      console.log(`- ${item.path} (${item.description || 'optional asset'})`);
    }
  }
  process.exit(2);
}

console.log('Required store assets present.');
if (missingOptional.length) {
  console.log('\nOptional assets not present yet:');
  for (const item of missingOptional) {
    console.log(`- ${item.path} (${item.description || 'optional asset'})`);
  }
}
