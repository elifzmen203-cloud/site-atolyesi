export function hexToRgb(hex) {
  let clean = hex.replace(/^#/, '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
    return { r: 59, g: 91, b: 219 }; // fallback
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

export function rgbToHex(r, g, b) {
  const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = v => clamp(v).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsl(r, g, b) {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;

  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h = h * 60;
  }

  return { h, s, l };
}

export function hslToRgb(h, s, l) {
  const hue2rgb = (p, q, t) => {
    let tNorm = t;
    if (tNorm < 0) tNorm += 1;
    if (tNorm > 1) tNorm -= 1;
    if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
    if (tNorm < 1 / 2) return q;
    if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
    return p;
  };

  const hNorm = ((h % 360) + 360) % 360 / 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

export function relativeLuminance(r, g, b) {
  const sRGB = [r, g, b].map(val => {
    const c = val / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
}

export function contrastRatio(colorA, colorB) {
  const rgbA = typeof colorA === 'string' ? hexToRgb(colorA) : colorA;
  const rgbB = typeof colorB === 'string' ? hexToRgb(colorB) : colorB;

  const l1 = relativeLuminance(rgbA.r, rgbA.g, rgbA.b);
  const l2 = relativeLuminance(rgbB.r, rgbB.g, rgbB.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

export function getWcagRating(ratio) {
  return {
    ratio,
    aaNormal: ratio >= 4.5,
    aaaNormal: ratio >= 7.0,
    aaLarge: ratio >= 3.0,
    aaaLarge: ratio >= 4.5,
    badge: ratio >= 7.0 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3.0 ? 'AA (Büyük)' : 'Yetersiz'
  };
}

export function generatePalette(baseHex = '#3b5bdb', rule = 'complementary') {
  const baseRgb = hexToRgb(baseHex);
  const { h, s } = rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b);

  let primaryH = h;
  let accentH = (h + 180) % 360;

  if (rule === 'analogous') {
    accentH = (h + 40) % 360;
  } else if (rule === 'triadic') {
    accentH = (h + 120) % 360;
  } else if (rule === 'monochrome') {
    accentH = h;
  }

  // 1. Primary: based on input color
  const primaryRgb = hslToRgb(primaryH, Math.max(0.4, Math.min(0.85, s)), 0.45);
  const primary = rgbToHex(primaryRgb.r, primaryRgb.g, primaryRgb.b);

  // 2. Accent: rule based
  const accentLightness = rule === 'monochrome' ? 0.65 : 0.52;
  const accentSat = rule === 'monochrome' ? Math.max(0.2, s * 0.7) : Math.max(0.5, Math.min(0.9, s));
  const accentRgb = hslToRgb(accentH, accentSat, accentLightness);
  const accent = rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b);

  // 3. Background: very subtle tint of primary hue, high lightness
  const bgRgb = hslToRgb(primaryH, 0.12, 0.98);
  const bg = rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b);

  // 4. Ink: very dark tone of primary hue for natural harmony
  const inkRgb = hslToRgb(primaryH, 0.25, 0.12);
  const ink = rgbToHex(inkRgb.r, inkRgb.g, inkRgb.b);

  // 5. Muted: balanced medium-low contrast
  const mutedRgb = hslToRgb(primaryH, 0.15, 0.42);
  const muted = rgbToHex(mutedRgb.r, mutedRgb.g, mutedRgb.b);

  return [
    { name: 'bg', label: 'Zemin (bg)', hex: bg },
    { name: 'ink', label: 'Yazı (ink)', hex: ink },
    { name: 'primary', label: 'Birincil (primary)', hex: primary },
    { name: 'accent', label: 'Vurgu (accent)', hex: accent },
    { name: 'muted', label: 'İkincil Yazı (muted)', hex: muted }
  ];
}
