import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRESET_THEMES, THEME_CATEGORIES } from '../src/themes/presets.js';
import { contrastRatio, isWcagAa } from '../src/color/contrast.js';

test('themes: contains ~40 presets with valid hex colors and categories', () => {
  assert.ok(PRESET_THEMES.length >= 38, `Must contain ~40 themes, found ${PRESET_THEMES.length}`);
  const hexRegex = /^#[0-9a-fA-F]{6}$/;

  for (const theme of PRESET_THEMES) {
    assert.ok(theme.id, 'Theme must have an id');
    assert.ok(theme.name, 'Theme must have a name');
    assert.ok(THEME_CATEGORIES.includes(theme.category), `Invalid category "${theme.category}" for theme "${theme.id}"`);

    const p = theme.palette;
    for (const role of ['bg', 'surface', 'ink', 'muted', 'primary', 'accent']) {
      assert.ok(hexRegex.test(p[role]), `Color "${role}" in theme "${theme.id}" has invalid hex: "${p[role]}"`);
    }
  }
});

test('themes: all 40 presets satisfy WCAG AA (>= 4.5:1) for body text and primary buttons', () => {
  for (const theme of PRESET_THEMES) {
    const p = theme.palette;

    const inkBgRatio = contrastRatio(p.ink, p.bg);
    assert.ok(inkBgRatio >= 4.5, `Theme "${theme.id}" ink/bg ratio ${inkBgRatio} must be >= 4.5`);

    const inkSurfaceRatio = contrastRatio(p.ink, p.surface);
    assert.ok(inkSurfaceRatio >= 4.5, `Theme "${theme.id}" ink/surface ratio ${inkSurfaceRatio} must be >= 4.5`);

    const mutedSurfaceRatio = contrastRatio(p.muted, p.surface);
    assert.ok(mutedSurfaceRatio >= 4.5, `Theme "${theme.id}" muted/surface ratio ${mutedSurfaceRatio} must be >= 4.5`);

    // Primary button readability (white on primary, or black if dark theme)
    const btnWhiteRatio = contrastRatio('#ffffff', p.primary);
    const btnBlackRatio = contrastRatio('#000000', p.primary);
    const btnRatio = Math.max(btnWhiteRatio, btnBlackRatio);
    assert.ok(btnRatio >= 4.5, `Theme "${theme.id}" button text ratio ${btnRatio} must be >= 4.5`);
  }
});
