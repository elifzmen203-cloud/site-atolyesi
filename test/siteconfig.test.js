import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createDefaultSiteConfig,
  loadDraft,
  saveDraft,
  getSiteConfig,
  updateSiteConfig,
  resetSiteConfig,
  addSection,
  removeSection,
  moveSection,
  updateSection,
  toBuildSiteConfig,
  DRAFT_STORAGE_KEY
} from '../src/state/siteConfig.js';

function createMockStorage() {
  const store = new Map();
  return {
    getItem: key => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: key => store.delete(key),
    clear: () => store.clear()
  };
}

test('siteConfig: creates rich default configuration for various sectors', () => {
  const cafeConfig = createDefaultSiteConfig('cafe', 'tr');
  assert.equal(cafeConfig.sector, 'cafe');
  assert.ok(cafeConfig.name);
  assert.ok(cafeConfig.sections.length >= 4);
  assert.equal(cafeConfig.sections[0].type, 'hero');

  const lawyerConfig = createDefaultSiteConfig('lawyer', 'en');
  assert.equal(lawyerConfig.sector, 'lawyer');
  assert.ok(lawyerConfig.sections.length >= 4);
});

test('siteConfig: manages sections (add, update, remove, reorder)', () => {
  resetSiteConfig('cafe', 'tr');
  const initialCount = getSiteConfig().sections.length;

  // Add section
  const newSec = addSection('gallery', 'Yeni Galeri', 'Fotoğraflarımız');
  assert.ok(newSec.id);
  assert.equal(getSiteConfig().sections.length, initialCount + 1);

  // Update section
  updateSection(newSec.id, { variant: 'cards', title: 'Güncellenmiş Galeri' });
  const updatedSec = getSiteConfig().sections.find(s => s.id === newSec.id);
  assert.equal(updatedSec.title, 'Güncellenmiş Galeri');
  assert.equal(updatedSec.variant, 'cards');

  // Move section (reorder)
  const currentSections = getSiteConfig().sections;
  const lastIndex = currentSections.length - 1;
  const targetId = currentSections[lastIndex].id;

  const moved = moveSection(lastIndex, 0);
  assert.equal(moved, true);
  assert.equal(getSiteConfig().sections[0].id, targetId);

  // Remove section
  const removed = removeSection(newSec.id);
  assert.equal(removed, true);
  assert.equal(getSiteConfig().sections.find(s => s.id === newSec.id), undefined);
});

test('siteConfig: persists and loads draft across storage (wizard -> studio continuity)', () => {
  const storage = createMockStorage();

  // Load initial draft into storage
  const loaded = loadDraft(storage, 'tr');
  assert.ok(loaded.name);

  // Modify draft
  updateSiteConfig({ name: 'Elif Atölyesi', slogan: 'Özel Tasarım' });
  saveDraft(storage);

  const rawSaved = storage.getItem(DRAFT_STORAGE_KEY);
  assert.ok(rawSaved);
  assert.ok(rawSaved.includes('Elif Atölyesi'));

  // Load from same storage in a new context
  const reloaded = loadDraft(storage, 'tr');
  assert.equal(reloaded.name, 'Elif Atölyesi');
  assert.equal(reloaded.slogan, 'Özel Tasarım');
});

test('siteConfig: converts cleanly to buildSite rawConfig', () => {
  resetSiteConfig('restaurant', 'tr');
  updateSiteConfig({ name: 'Lezzet Durağı' });

  const rawConfig = toBuildSiteConfig();
  assert.equal(rawConfig.name, 'Lezzet Durağı');
  assert.equal(rawConfig.sector, 'restaurant');
  assert.ok(Array.isArray(rawConfig.sections));
  assert.ok(rawConfig.sections.includes('hero'));
});
