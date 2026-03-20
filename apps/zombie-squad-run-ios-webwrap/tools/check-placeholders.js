const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const files = [
  'capacitor.config.json',
  'release/store-assets/app-store-metadata.json',
  'release/CODEMAGIC_SETUP.md',
  'release/APP_PUBLISHING_CHECKLIST.md'
];

const badMarkers = [
  'com.yourcompany.',
  'example.com',
  'support@example.com',
  'you@example.com',
  'YOUR_TEAM_ID',
  'YOUR_ISSUER_ID',
  'YOUR_KEY_ID',
  'BASE64_KEY_HERE'
];

let found = [];
for (const rel of files) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  const text = fs.readFileSync(full, 'utf8');
  for (const marker of badMarkers) {
    if (text.includes(marker)) {
      found.push({ rel, marker });
    }
  }
}

if (found.length) {
  console.log('Placeholder values still present:');
  for (const item of found) console.log(`- ${item.rel}: ${item.marker}`);
  process.exit(2);
}

console.log('No placeholder values detected in checked release files.');
