const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const releaseDir = path.join(root, 'release');
const monetizationPath = path.join(releaseDir, 'monetization', 'launch-config.json');
const metadataPath = path.join(releaseDir, 'store-assets', 'app-store-metadata.json');
const capConfigPath = path.join(root, 'capacitor.config.json');
const packetDir = path.join(releaseDir, 'submission-packet');
const packetPath = path.join(packetDir, 'APP_STORE_SUBMISSION_PACKET.md');

fs.mkdirSync(packetDir, { recursive: true });

const monetization = JSON.parse(fs.readFileSync(monetizationPath, 'utf8'));
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
const capConfig = JSON.parse(fs.readFileSync(capConfigPath, 'utf8'));

const screenshotRawDir = path.join(root, metadata.screenshotSet.raw);
const screenshotPolishedDir = path.join(root, metadata.screenshotSet.polished);
const rawShots = fs.existsSync(screenshotRawDir) ? fs.readdirSync(screenshotRawDir).filter((f) => f.endsWith('.png')).sort() : [];
const polishedShots = fs.existsSync(screenshotPolishedDir) ? fs.readdirSync(screenshotPolishedDir).filter((f) => f.endsWith('.png')).sort() : [];

const lines = [
  '# App Store Submission Packet',
  '',
  'Generated automatically from the current repo state.',
  '',
  '## App identity',
  `- App name: ${capConfig.appName}`,
  `- Bundle ID: ${capConfig.appId}`,
  `- Primary category: ${metadata.primaryCategory}`,
  `- Secondary category: ${metadata.secondaryCategory}`,
  '',
  '## Store listing copy',
  `- Name: ${metadata.name}`,
  `- Subtitle: ${metadata.subtitle}`,
  `- Short description: ${metadata.shortDescription}`,
  `- Promotional text: ${metadata.promotionalText}`,
  `- Keywords: ${(metadata.keywords || []).join(', ')}`,
  '',
  '## Public URLs',
  `- Support URL: ${metadata.supportUrl}`,
  `- Privacy URL: ${metadata.privacyUrl}`,
  '',
  '## Launch monetization',
  `- Launch model: ${monetization.launchModel}`,
  `- Paid price tier: ${monetization.paidPriceTier || 'not set'}`,
  `- Rewarded revive planned later: ${monetization.rewardedRevivePlanned ? 'yes' : 'no'}`,
  `- Future monetization: ${(monetization.futureMonetization || []).join(', ') || 'none listed'}`,
  '',
  '## Review notes',
  ...((metadata.reviewNotes || []).map((note) => `- ${note}`)),
  '',
  '## Screenshot inventory',
  `- Raw screenshots: ${rawShots.length}`,
  ...rawShots.map((name) => `  - ${name}`),
  `- Polished screenshots: ${polishedShots.length}`,
  ...polishedShots.map((name) => `  - ${name}`),
  '',
  '## Included release artifacts',
  '- release/store-assets/assets/icon/app-icon-1024.png',
  `- ${metadata.screenshotSet.raw}`,
  `- ${metadata.screenshotSet.polished}`,
  '- release/hosted-pages/',
  '- release/monetization/launch-config.json',
  '- codemagic.yaml',
  '',
  '## Submission readiness summary',
  '- Confirm support and privacy URLs are publicly live.',
  '- Confirm bundle ID matches the App Store Connect app record.',
  '- Confirm pricing in App Store Connect matches the launch config.',
  '- Confirm screenshots match the shipped build UI.',
  '- Confirm App Privacy answers match the actual shipped build.',
  ''
];

fs.writeFileSync(packetPath, `${lines.join('\n')}\n`);
console.log('Wrote submission packet to', packetPath);
