import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  savePalette,
  getSavedPalettes,
  deletePalette,
  exportPalettesJson,
  importPalettesJson,
  rollRandomPalette,
  MAX_SAVED_PALETTES
} from '../src/color/palette-manager.js';

// In-memory mock storage
function createMockStorage() {
  const store = new Map();
  return {
    getItem: key => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: key => store.delete(key),
    clear: () => store.clear()
  };
}

test('palette-save: saves, retrieves, and deletes palettes correctly', () => {
  const storage = createMockStorage();
  const testPal = { bg: '#fdfbf7', surface: '#ffffff', ink: '#292524', muted: '#57534e', primary: '#4f46e5', accent: '#c2410c' };

  const res = savePalette('Kahve Köşesi', testPal, storage);
  assert.equal(res.success, true);
  assert.ok(res.entry.id);

  const list = getSavedPalettes(storage);
  assert.equal(list.length, 1);
  assert.equal(list[0].name, 'Kahve Köşesi');
  assert.equal(list[0].palette.primary, '#4f46e5');

  const delRes = deletePalette(res.entry.id, storage);
  assert.equal(delRes, true);
  assert.equal(getSavedPalettes(storage).length, 0);
});

test('palette-save: enforces MAX_SAVED_PALETTES limit of 50', () => {
  const storage = createMockStorage();
  const dummy = { bg: '#ffffff', ink: '#000000', primary: '#123456' };

  for (let i = 0; i < MAX_SAVED_PALETTES; i++) {
    const res = savePalette(`Palet ${i}`, dummy, storage);
    assert.equal(res.success, true);
  }

  assert.equal(getSavedPalettes(storage).length, 50);

  // 51st palette must be rejected
  const overflow = savePalette('51. Palet', dummy, storage);
  assert.equal(overflow.success, false);
  assert.ok(overflow.error.includes('Limit'));
  assert.equal(getSavedPalettes(storage).length, 50);
});

test('palette-save: exports and imports palettes with strict JSON validation', () => {
  const storage = createMockStorage();
  savePalette('Palet A', { bg: '#ffffff', ink: '#111111', primary: '#222222' }, storage);
  savePalette('Palet B', { bg: '#f0f0f0', ink: '#333333', primary: '#444444' }, storage);

  const jsonStr = exportPalettesJson(storage);
  assert.ok(jsonStr.includes('Palet A'));
  assert.ok(jsonStr.includes('Palet B'));

  // Import into a new empty storage
  const storage2 = createMockStorage();
  const importRes = importPalettesJson(jsonStr, storage2);
  assert.equal(importRes.success, true);
  assert.equal(importRes.count, 2);
  assert.equal(getSavedPalettes(storage2).length, 2);

  // Rejection of invalid JSON
  assert.equal(importPalettesJson('{ not valid json }', storage2).success, false);

  // Rejection of invalid color format
  const badColors = JSON.stringify([{ name: 'Kötü', palette: { bg: 'red', ink: 'blue' } }]);
  assert.equal(importPalettesJson(badColors, storage2).success, false);
});

test('palette-save: rollRandomPalette respects locked color roles', () => {
  const original = { bg: '#111111', ink: '#222222', primary: '#abcdef', accent: '#444444', muted: '#555555' };
  const locked = ['primary', 'bg'];

  const rolled = rollRandomPalette(original, locked);
  assert.equal(rolled.primary, '#abcdef', 'Locked primary color must not change');
  assert.equal(rolled.bg, '#111111', 'Locked bg color must not change');
});
