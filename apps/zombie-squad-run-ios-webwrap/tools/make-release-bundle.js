const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const workspace = path.resolve(root, '..');
const gameRoot = path.join(workspace, 'zombie-squad-run');
const out = path.join(root, 'release');

fs.mkdirSync(out, { recursive: true });

const files = [
  path.join(gameRoot, 'index.html'),
  path.join(gameRoot, 'manifest.webmanifest'),
  path.join(gameRoot, 'README.md'),
  path.join(gameRoot, 'release', 'APP_STORE_COPY.md'),
  path.join(gameRoot, 'release', 'PRIVACY.md'),
  path.join(gameRoot, 'release', 'RELEASE_CHECKLIST.md'),
  path.join(gameRoot, 'release', 'RELEASE_SUMMARY.md'),
  path.join(gameRoot, 'release', 'SUPPORT.md')
];

for (const file of files) {
  const rel = path.relative(gameRoot, file);
  const target = path.join(out, rel);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(file, target);
}

console.log('Created release bundle in', out);
