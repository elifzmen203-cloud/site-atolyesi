import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, isWcagAa, isWcagAaa, ensureWcagAa } from '../src/color/contrast.js';

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Tema değerleri doğrudan base.css'ten okunur; CSS değişirse test de onu denetler.
const css = fs.readFileSync(
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../src/styles/base.css'), 'utf-8');
function readVars(selector) {
  const start = css.indexOf(`${selector} {`);
  const block = css.slice(start, css.indexOf('}', start));
  const vars = {};
  for (const m of block.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})/g)) vars[m[1]] = m[2];
  return vars;
}
function theme(v) {
  return {
    bg: v.bg, surface: v.surface, ink: v.ink, muted: v.muted,
    primary: v['primary-fill'], primaryInk: v['primary-ink'], link: v.primary, accent: v.accent,
    soft: Object.entries(v).filter(([k]) => k.startsWith('soft-')).map(([, hex]) => hex)
  };
}
export const APP_THEMES = { day: theme(readVars(':root')), night: theme(readVars('[data-mode="night"]')) };

test('contrast: theme links and text on pastel surfaces pass WCAG AA', () => {
  for (const [name, t] of Object.entries(APP_THEMES)) {
    assert.ok(t.soft.length >= 8, `${name}: pastel soft-* tokens exist`);
    assert.ok(isWcagAa(t.link, t.bg), `${name} link/bg ${contrastRatio(t.link, t.bg)} must be >= 4.5`);
    assert.ok(isWcagAa(t.link, t.surface), `${name} link/surface ${contrastRatio(t.link, t.surface)} must be >= 4.5`);
    for (const soft of t.soft) {
      assert.ok(isWcagAa(t.ink, soft), `${name} ink on ${soft}: ${contrastRatio(t.ink, soft)} must be >= 4.5`);
    }
  }
});

test('contrast: day theme text/background pairs pass WCAG AA >= 4.5:1', () => {
  const t = APP_THEMES.day;
  assert.ok(isWcagAa(t.ink, t.bg), `Day ink/bg ratio ${contrastRatio(t.ink, t.bg)} must be >= 4.5`);
  assert.ok(isWcagAa(t.ink, t.surface), `Day ink/surface ratio ${contrastRatio(t.ink, t.surface)} must be >= 4.5`);
  assert.ok(isWcagAa(t.muted, t.surface), `Day muted/surface ratio ${contrastRatio(t.muted, t.surface)} must be >= 4.5`);
  assert.ok(isWcagAa(t.primaryInk, t.primary), `Day primary-ink/primary ratio ${contrastRatio(t.primaryInk, t.primary)} must be >= 4.5`);
  assert.ok(isWcagAa(t.accent, t.surface), `Day accent/surface ratio ${contrastRatio(t.accent, t.surface)} must be >= 4.5`);
});

test('contrast: night theme text/background pairs pass WCAG AA >= 4.5:1', () => {
  const t = APP_THEMES.night;
  assert.ok(isWcagAa(t.ink, t.bg), `Night ink/bg ratio ${contrastRatio(t.ink, t.bg)} must be >= 4.5`);
  assert.ok(isWcagAa(t.ink, t.surface), `Night ink/surface ratio ${contrastRatio(t.ink, t.surface)} must be >= 4.5`);
  assert.ok(isWcagAa(t.muted, t.surface), `Night muted/surface ratio ${contrastRatio(t.muted, t.surface)} must be >= 4.5`);
  assert.ok(isWcagAa(t.primaryInk, t.primary), `Night primary-ink/primary ratio ${contrastRatio(t.primaryInk, t.primary)} must be >= 4.5`);
  assert.ok(isWcagAa(t.accent, t.surface), `Night accent/surface ratio ${contrastRatio(t.accent, t.surface)} must be >= 4.5`);
});

test('contrast: ensureWcagAa automatically fixes low contrast by adjusting lightness', () => {
  // A low contrast yellow (#ffeb3b, ratio ~1.17 on white)
  const weakYellow = '#ffeb3b';
  const fixed = ensureWcagAa(weakYellow, '#ffffff', 4.5);
  const ratio = contrastRatio(fixed, '#ffffff');
  assert.ok(ratio >= 4.5, `Fixed color ${fixed} should have ratio >= 4.5, got ${ratio}`);
});
