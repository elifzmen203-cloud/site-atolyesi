export function hexToRgb(hex) {
  let clean = hex.replace(/^#/, '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
    return { r: 0, g: 0, b: 0 };
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

export function isWcagAa(fg, bg, isLarge = false) {
  const ratio = contrastRatio(fg, bg);
  return ratio >= (isLarge ? 3.0 : 4.5);
}

export function isWcagAaa(fg, bg, isLarge = false) {
  const ratio = contrastRatio(fg, bg);
  return ratio >= (isLarge ? 4.5 : 7.0);
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

/**
 * Adjusts lightness of fgHex to achieve at least minRatio against bgHex,
 * while strictly preserving hue and saturation.
 */
export function ensureWcagAa(fgHex, bgHex, minRatio = 4.5) {
  if (contrastRatio(fgHex, bgHex) >= minRatio) {
    return fgHex;
  }

  const bgRgb = hexToRgb(bgHex);
  const bgLum = relativeLuminance(bgRgb.r, bgRgb.g, bgRgb.b);
  const fgRgb = hexToRgb(fgHex);
  const { h, s } = rgbToHsl(fgRgb.r, fgRgb.g, fgRgb.b);

  // If background is light (lum > 0.5), make fg darker; if dark, make fg lighter
  const shouldDarken = bgLum > 0.5;

  let bestHex = fgHex;
  let maxRatioSeen = contrastRatio(fgHex, bgHex);

  for (let step = 1; step <= 100; step++) {
    const newL = shouldDarken ? Math.max(0, 1 - (step / 100)) : Math.min(1, step / 100);
    const candidateRgb = hslToRgb(h, s, newL);
    const candidateHex = rgbToHex(candidateRgb.r, candidateRgb.g, candidateRgb.b);
    const ratio = contrastRatio(candidateHex, bgHex);

    if (ratio > maxRatioSeen) {
      maxRatioSeen = ratio;
      bestHex = candidateHex;
    }

    if (ratio >= minRatio) {
      return candidateHex;
    }
  }

  return bestHex;
}
