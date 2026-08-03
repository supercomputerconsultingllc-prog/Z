import { SAVE_KEY, SETTINGS_KEY, DEFAULT_PROFILE, DEFAULT_SETTINGS } from './config.js';

function clone(value) { return JSON.parse(JSON.stringify(value)); }

function mergeDefaults(defaults, saved) {
  if (!saved || typeof saved !== 'object') return clone(defaults);
  const merged = { ...clone(defaults), ...saved };
  for (const [key, value] of Object.entries(defaults)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      merged[key] = { ...clone(value), ...(saved[key] || {}) };
    }
  }
  return merged;
}

export function loadProfile() {
  try { return mergeDefaults(DEFAULT_PROFILE, JSON.parse(localStorage.getItem(SAVE_KEY))); }
  catch { return clone(DEFAULT_PROFILE); }
}

export function saveProfile(profile) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(profile)); return true; }
  catch { return false; }
}

export function loadSettings() {
  try { return mergeDefaults(DEFAULT_SETTINGS, JSON.parse(localStorage.getItem(SETTINGS_KEY))); }
  catch { return clone(DEFAULT_SETTINGS); }
}

export function saveSettings(settings) {
  try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); return true; }
  catch { return false; }
}

export function exportSave(profile, settings) {
  return btoa(unescape(encodeURIComponent(JSON.stringify({ version: 2, profile, settings, exportedAt: new Date().toISOString() }))));
}

export function importSave(encoded) {
  const parsed = JSON.parse(decodeURIComponent(escape(atob(encoded.trim()))));
  if (parsed.version !== 2 || !parsed.profile || !parsed.settings) throw new Error('Unsupported V2 save data.');
  const profile = mergeDefaults(DEFAULT_PROFILE, parsed.profile);
  const settings = mergeDefaults(DEFAULT_SETTINGS, parsed.settings);
  saveProfile(profile);
  saveSettings(settings);
  return { profile, settings };
}
