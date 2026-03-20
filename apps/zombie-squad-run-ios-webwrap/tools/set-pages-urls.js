const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const metadataPath = path.join(root, 'release/store-assets/app-store-metadata.json');
const envPath = path.join(root, '.env');

let localEnv = {};
if (fs.existsSync(envPath)) {
  localEnv = Object.fromEntries(
    fs.readFileSync(envPath, 'utf8')
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(line => {
        const i = line.indexOf('=');
        return [line.slice(0, i), line.slice(i + 1)];
      })
  );
}

const repoUrl = process.env.GITHUB_REPOSITORY_URL || localEnv.GITHUB_REPOSITORY_URL || '';
const owner = process.env.GITHUB_OWNER || localEnv.GITHUB_OWNER || '';
const repo = process.env.GITHUB_REPO || localEnv.GITHUB_REPO || '';

function fail(msg) {
  console.error(msg);
  process.exit(1);
}

let baseUrl = process.env.PAGES_BASE_URL || localEnv.PAGES_BASE_URL || '';
if (!baseUrl) {
  if (owner && repo) {
    baseUrl = `https://${owner}.github.io/${repo}`;
  } else if (repoUrl) {
    const m = repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?$/i);
    if (m) baseUrl = `https://${m[1]}.github.io/${m[2]}`;
  }
}

if (!baseUrl) fail('Missing PAGES_BASE_URL, or provide GITHUB_OWNER and GITHUB_REPO.');
baseUrl = baseUrl.replace(/\/$/, '');

const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
metadata.supportUrl = `${baseUrl}/support/`;
metadata.privacyUrl = `${baseUrl}/privacy/`;
fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2) + '\n');
console.log(`Updated metadata URLs to ${metadata.supportUrl} and ${metadata.privacyUrl}`);
