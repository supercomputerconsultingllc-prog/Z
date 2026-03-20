const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const gamePath = path.resolve(root, '../zombie-squad-run/index.html');
const outRoot = path.join(root, 'release/store-assets/assets/screenshots/iphone');
const chrome = process.env.CHROME_BIN || 'google-chrome';
const width = 1290;
const height = 2796;

const scenes = [
  ['title', '01-title-screen.png'],
  ['action', '02-mid-run-action.png'],
  ['wall', '03-wall-encounter.png'],
  ['shop', '04-upgrade-shop.png'],
  ['revive', '05-revive-or-high-wave.png']
];

fs.mkdirSync(outRoot, { recursive: true });

for (const [scene, fileName] of scenes) {
  const url = `file://${gamePath}?scene=${encodeURIComponent(scene)}&capture=1`;
  const output = path.join(outRoot, fileName);
  console.log(`Capturing ${scene} -> ${output}`);
  execFileSync(chrome, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    `--window-size=${width},${height}`,
    `--screenshot=${output}`,
    url
  ], { stdio: 'inherit' });
}

console.log('\nScreenshot export completed.');
