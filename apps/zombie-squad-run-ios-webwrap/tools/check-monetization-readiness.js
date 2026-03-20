const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'release/monetization/launch-config.json');
const metadataPath = path.join(root, 'release/store-assets/app-store-metadata.json');
const privacyPath = path.resolve(root, '../zombie-squad-run/release/PRIVACY.md');

if (!fs.existsSync(configPath)) {
  console.error('Missing monetization config:', configPath);
  process.exit(1);
}

const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
const privacy = fs.readFileSync(privacyPath, 'utf8');
const issues = [];
const notes = [];

if (!config.launchModel) issues.push('launchModel is missing');
if (!['paid-upfront', 'free', 'free-later'].includes(config.launchModel)) issues.push(`unsupported launchModel: ${config.launchModel}`);
if (config.launchModel === 'paid-upfront' && !config.paidPriceTier) issues.push('paidPriceTier should be set for paid-upfront launch');
if (config.launchModel !== 'paid-upfront' && !config.futureMonetization.includes('rewarded-revive')) notes.push('Consider adding rewarded-revive to futureMonetization for a free launch plan.');
if (!config.reviewNotes || !config.reviewNotes.length) issues.push('reviewNotes should not be empty');
if (config.rewardedRevivePlanned && !/ads|analytics|crash reporting|cloud saves|account systems|in-app purchases/i.test(privacy)) {
  notes.push('Rewarded revive is planned. Update privacy policy before live ad SDK integration.');
}
if (!metadata.supportUrl || metadata.supportUrl.includes('REPLACE_')) issues.push('supportUrl is still placeholder in metadata');
if (!metadata.privacyUrl || metadata.privacyUrl.includes('REPLACE_')) issues.push('privacyUrl is still placeholder in metadata');
if (!metadata.reviewNotes || !metadata.reviewNotes.length) issues.push('metadata reviewNotes should be populated');

console.log('Monetization readiness summary:');
console.log(`- launch model: ${config.launchModel}`);
console.log(`- paid price tier: ${config.paidPriceTier || 'not set'}`);
console.log(`- rewarded revive planned: ${config.rewardedRevivePlanned ? 'yes' : 'no'}`);
console.log(`- future monetization: ${(config.futureMonetization || []).join(', ') || 'none listed'}`);

if (issues.length) {
  console.log('\nBlocking issues:');
  for (const issue of issues) console.log(`- ${issue}`);
}
if (notes.length) {
  console.log('\nNotes:');
  for (const note of notes) console.log(`- ${note}`);
}

if (issues.length) process.exit(2);
console.log('\nMonetization readiness check passed.');
