import { PRESET_THEMES } from '../themes/presets.js';

const STORAGE_KEY = 'sa.savedPalettes';
export const MAX_SAVED_PALETTES = 50;

/**
 * Rolls a random harmonious palette.
 * Unlocked roles are replaced by colors from randomly sampled harmonious themes.
 * @param {Object} currentPalette - { bg, surface, ink, muted, primary, accent }
 * @param {Array<string>} [lockedRoles] - Array of roles that must not be changed (e.g. ['primary'])
 * @param {Function} [rng] - Optional custom random generator
 */
export function rollRandomPalette(currentPalette = {}, lockedRoles = [], rng = Math.random) {
  const randomIndex = Math.floor(rng() * PRESET_THEMES.length);
  const candidate = PRESET_THEMES[randomIndex].palette;

  const result = Object.assign({}, candidate);

  if (Array.isArray(lockedRoles)) {
    for (const role of lockedRoles) {
      if (currentPalette[role]) {
        result[role] = currentPalette[role];
      }
    }
  }

  return result;
}

/**
 * Retrieves saved palettes from localStorage.
 * @returns {Array<Object>}
 */
export function getSavedPalettes(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

/**
 * Saves a palette to storage with a limit of MAX_SAVED_PALETTES (50).
 */
export function savePalette(name, palette, storage = (typeof localStorage !== 'undefined' ? localStorage : null), defaultName = 'Palette') {
  if (!storage) return { success: false, error: 'Storage unavailable', errorCode: 'storageUnavailable' };

  const current = getSavedPalettes(storage);
  if (current.length >= MAX_SAVED_PALETTES) {
    return { success: false, error: 'Limit reached (max 50)', errorCode: 'limitReached' };
  }

  const safeName = (name && name.trim()) ? name.trim().slice(0, 50) : `${defaultName} ${current.length + 1}`;

  const newEntry = {
    id: 'pal_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    name: safeName,
    palette: Object.assign({}, palette),
    createdAt: new Date().toISOString()
  };

  current.push(newEntry);
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(current));
    return { success: true, entry: newEntry };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}

/**
 * Deletes a saved palette by id.
 */
export function deletePalette(id, storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!storage) return false;
  const current = getSavedPalettes(storage);
  const filtered = current.filter(p => p.id !== id);
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Exports saved palettes as formatted JSON.
 */
export function exportPalettesJson(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  const items = getSavedPalettes(storage);
  return JSON.stringify(items, null, 2);
}

/**
 * Safely imports palettes from JSON string.
 * Validates data types and color hex format.
 */
export function importPalettesJson(jsonStr, storage = (typeof localStorage !== 'undefined' ? localStorage : null), defaultName = 'Imported') {
  if (!storage) return { success: false, error: 'Storage unavailable', errorCode: 'storageUnavailable' };

  let data;
  try {
    data = JSON.parse(jsonStr);
  } catch (err) {
    return { success: false, error: 'Invalid JSON format', errorCode: 'invalidJson' };
  }

  if (!Array.isArray(data)) {
    return { success: false, error: 'Root JSON must be an array', errorCode: 'notArray' };
  }

  const hexRegex = /^#[0-9a-fA-F]{6}$/;
  const validEntries = [];

  for (const item of data) {
    if (!item || typeof item !== 'object') continue;
    if (!item.palette || typeof item.palette !== 'object') continue;

    const p = item.palette;
    if (
      hexRegex.test(p.bg) &&
      hexRegex.test(p.ink) &&
      hexRegex.test(p.primary)
    ) {
      const cleanName = typeof item.name === 'string' && item.name.trim()
        ? item.name.replace(/<[^>]*>/g, '').trim().slice(0, 50) || defaultName
        : defaultName;

      validEntries.push({
        id: 'pal_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
        name: cleanName,
        palette: {
          bg: p.bg,
          surface: hexRegex.test(p.surface) ? p.surface : '#ffffff',
          ink: p.ink,
          muted: hexRegex.test(p.muted) ? p.muted : '#57534e',
          primary: p.primary,
          accent: hexRegex.test(p.accent) ? p.accent : '#ea580c'
        },
        createdAt: new Date().toISOString()
      });
    }
  }

  if (validEntries.length === 0) {
    return { success: false, error: 'No valid palettes found in JSON', errorCode: 'emptyValid' };
  }

  const existing = getSavedPalettes(storage);
  const remainingSlots = Math.max(0, MAX_SAVED_PALETTES - existing.length);
  const toAdd = validEntries.slice(0, remainingSlots);

  const combined = existing.concat(toAdd);
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(combined));
    return { success: true, count: toAdd.length };
  } catch (err) {
    return { success: false, error: String(err) };
  }
}
