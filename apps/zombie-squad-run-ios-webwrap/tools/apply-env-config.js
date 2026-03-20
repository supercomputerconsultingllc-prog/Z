const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const envPath = path.join(root, '.env');
const capacitorPath = path.join(root, 'capacitor.config.json');

if (!fs.existsSync(envPath)) {
  console.error('Missing .env file. Copy .env.example to .env and fill in values first.');
  process.exit(1);
}

const env = Object.fromEntries(
  fs.readFileSync(envPath, 'utf8')
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
    .map(line => {
      const i = line.indexOf('=');
      return [line.slice(0, i), line.slice(i + 1)];
    })
);

const appId = env.APP_ID;
const appName = env.APP_NAME || 'Zombie Squad Run';

if (!appId || appId.includes('REPLACE_WITH_REAL_APP_ID')) {
  console.error('APP_ID is missing or still a placeholder in .env');
  process.exit(2);
}

const config = JSON.parse(fs.readFileSync(capacitorPath, 'utf8'));
config.appId = appId;
config.appName = appName;
fs.writeFileSync(capacitorPath, JSON.stringify(config, null, 2) + '\n');
console.log(`Updated capacitor.config.json with appId=${appId} appName=${appName}`);
