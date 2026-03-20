const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const workspace = path.resolve(root, '..');
const source = path.join(workspace, 'zombie-squad-run');
const webDir = path.join(root, 'web');

fs.mkdirSync(webDir, { recursive: true });

for (const file of ['index.html', 'manifest.webmanifest']) {
  fs.copyFileSync(path.join(source, file), path.join(webDir, file));
}

console.log('Prepared web assets in', webDir);
