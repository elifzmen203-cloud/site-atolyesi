import { test } from 'node:test';
import assert from 'node:assert/strict';
import { contrastRatio, isWcagAa, isWcagAaa, ensureWcagAa } from '../src/color/contrast.js';

export const APP_THEMES = {
  day: {
    bg: '#fdfbf7',
    surface: '#ffffff',
    ink: '#292524',
    muted: '#57534e',
    primary: '#4f46e5',
    primaryInk: '#ffffff',
    accent: '#c2410c',
    border: '#e7e5e4'
  },
  night: {
    bg: '#18181b',
    surface: '#27272a',
    ink: '#fafaf9',
    muted: '#a8a29e',
    primary: '#818cf8',
    primaryInk: '#18181b',
    accent: '#fb923c',
    border: '#3f3f46'
  }
};

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
