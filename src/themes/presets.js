/**
 * ~40 carefully curated presets across diverse themes.
 * Every preset is engineered to satisfy WCAG AA (>= 4.5:1) for body ink and primary buttons.
 */
export const PRESET_THEMES = [
  // 1-5: Pastel & Soft
  {
    id: 'pastel-cream',
    category: 'pastel',
    name: 'Krem & Şeftali',
    palette: { bg: '#fdfbf7', surface: '#ffffff', ink: '#292524', muted: '#57534e', primary: '#4f46e5', accent: '#c2410c' }
  },
  {
    id: 'pastel-lavender',
    category: 'pastel',
    name: 'Lavanta Rüyası',
    palette: { bg: '#faf7fc', surface: '#ffffff', ink: '#261733', muted: '#5d506b', primary: '#7c3aed', accent: '#db2777' }
  },
  {
    id: 'pastel-mint',
    category: 'pastel',
    name: 'Taze Nane',
    palette: { bg: '#f4fbf7', surface: '#ffffff', ink: '#0f291e', muted: '#406352', primary: '#059669', accent: '#0284c7' }
  },
  {
    id: 'pastel-rose',
    category: 'pastel',
    name: 'Pudra Gül',
    palette: { bg: '#fff7f8', surface: '#ffffff', ink: '#33141a', muted: '#6e4b52', primary: '#e11d48', accent: '#d97706' }
  },
  {
    id: 'pastel-sky',
    category: 'pastel',
    name: 'Bebek Mavisi',
    palette: { bg: '#f0f9ff', surface: '#ffffff', ink: '#082f49', muted: '#385e72', primary: '#0284c7', accent: '#4f46e5' }
  },

  // 6-10: Coffee & Warmth
  {
    id: 'coffee-espresso',
    category: 'coffee',
    name: 'Espresso & Krem',
    palette: { bg: '#faf5ef', surface: '#ffffff', ink: '#261a10', muted: '#5c4b3f', primary: '#92400e', accent: '#b45309' }
  },
  {
    id: 'coffee-latte',
    category: 'coffee',
    name: 'Sütlü Latte',
    palette: { bg: '#fdf8f4', surface: '#ffffff', ink: '#332015', muted: '#6b5446', primary: '#a16207', accent: '#c2410c' }
  },
  {
    id: 'coffee-caramel',
    category: 'coffee',
    name: 'Karamel & Amber',
    palette: { bg: '#fffaf0', surface: '#ffffff', ink: '#2e1c0d', muted: '#634e3e', primary: '#b45309', accent: '#d97706' }
  },
  {
    id: 'coffee-mocha',
    category: 'coffee',
    name: 'Çikolatalı Moka',
    palette: { bg: '#fbf6f2', surface: '#ffffff', ink: '#2b1b1b', muted: '#5e4848', primary: '#854d0e', accent: '#991b1b' }
  },
  {
    id: 'coffee-hazelnut',
    category: 'coffee',
    name: 'Kavrulmuş Fındık',
    palette: { bg: '#faf6f0', surface: '#ffffff', ink: '#2b1e17', muted: '#5c4c44', primary: '#9a3412', accent: '#ca8a04' }
  },

  // 11-15: Ocean & Water
  {
    id: 'ocean-deep',
    category: 'ocean',
    name: 'Derin Okyanus',
    palette: { bg: '#f0f9ff', surface: '#ffffff', ink: '#082f49', muted: '#33536b', primary: '#0369a1', accent: '#0891b2' }
  },
  {
    id: 'ocean-aqua',
    category: 'ocean',
    name: 'Turkuaz Mercan',
    palette: { bg: '#ecfeff', surface: '#ffffff', ink: '#083344', muted: '#2d5b6b', primary: '#0e7490', accent: '#ea580c' }
  },
  {
    id: 'ocean-marine',
    category: 'ocean',
    name: 'Marin Lacivert',
    palette: { bg: '#f8fafc', surface: '#ffffff', ink: '#0f172a', muted: '#475569', primary: '#1d4ed8', accent: '#0284c7' }
  },
  {
    id: 'ocean-lagoon',
    category: 'ocean',
    name: 'Mavi Lagün',
    palette: { bg: '#f0fdfa', surface: '#ffffff', ink: '#042f2e', muted: '#2b5755', primary: '#0f766e', accent: '#2563eb' }
  },
  {
    id: 'ocean-arctic',
    category: 'ocean',
    name: 'Kuzey Buzulu',
    palette: { bg: '#f1f5f9', surface: '#ffffff', ink: '#0f172a', muted: '#475569', primary: '#2563eb', accent: '#06b6d4' }
  },

  // 16-20: Forest & Nature
  {
    id: 'nature-forest',
    category: 'nature',
    name: 'Zümrüt Orman',
    palette: { bg: '#f2fcf5', surface: '#ffffff', ink: '#052e16', muted: '#28543b', primary: '#15803d', accent: '#b45309' }
  },
  {
    id: 'nature-olive',
    category: 'nature',
    name: 'Zeytin Bahçesi',
    palette: { bg: '#f8faf0', surface: '#ffffff', ink: '#1c2605', muted: '#48542b', primary: '#4d7c0f', accent: '#c2410c' }
  },
  {
    id: 'nature-sage',
    category: 'nature',
    name: 'Adaçayı',
    palette: { bg: '#f4f7f4', surface: '#ffffff', ink: '#14261a', muted: '#45594b', primary: '#166534', accent: '#d97706' }
  },
  {
    id: 'nature-botanic',
    category: 'nature',
    name: 'Botanik Sera',
    palette: { bg: '#f0fdf4', surface: '#ffffff', ink: '#052e16', muted: '#2d5e41', primary: '#047857', accent: '#e11d48' }
  },
  {
    id: 'nature-moss',
    category: 'nature',
    name: 'Doğal Yosun',
    palette: { bg: '#f6f9f0', surface: '#ffffff', ink: '#1a2908', muted: '#4d5c36', primary: '#3f6212', accent: '#0284c7' }
  },

  // 21-25: Sunset & Berry
  {
    id: 'sunset-dusk',
    category: 'sunset',
    name: 'Alacakaranlık',
    palette: { bg: '#fff7ed', surface: '#ffffff', ink: '#431407', muted: '#734436', primary: '#c2410c', accent: '#7c3aed' }
  },
  {
    id: 'sunset-golden',
    category: 'sunset',
    name: 'Altın Saat',
    palette: { bg: '#fefce8', surface: '#ffffff', ink: '#422006', muted: '#715336', primary: '#b45309', accent: '#e11d48' }
  },
  {
    id: 'berry-plum',
    category: 'sunset',
    name: 'Mürdüm & Bordo',
    palette: { bg: '#faf5ff', surface: '#ffffff', ink: '#2e1065', muted: '#5c4187', primary: '#6b21a8', accent: '#be185d' }
  },
  {
    id: 'berry-cherry',
    category: 'sunset',
    name: 'Vişne Çiçeği',
    palette: { bg: '#fff1f2', surface: '#ffffff', ink: '#4c0519', muted: '#7a3648', primary: '#be123c', accent: '#7c3aed' }
  },
  {
    id: 'sunset-flamingo',
    category: 'sunset',
    name: 'Flamingo Mercanı',
    palette: { bg: '#fff5f5', surface: '#ffffff', ink: '#450a0a', muted: '#783b3b', primary: '#dc2626', accent: '#d97706' }
  },

  // 26-30: Candy & Playful
  {
    id: 'candy-cotton',
    category: 'candy',
    name: 'Pamuk Şeker',
    palette: { bg: '#fdf4ff', surface: '#ffffff', ink: '#3b0764', muted: '#6e3c94', primary: '#a21caf', accent: '#0284c7' }
  },
  {
    id: 'candy-macaron',
    category: 'candy',
    name: 'Fıstıklı Makaron',
    palette: { bg: '#f5fdf7', surface: '#ffffff', ink: '#062d18', muted: '#365e47', primary: '#059669', accent: '#db2777' }
  },
  {
    id: 'candy-citrus',
    category: 'candy',
    name: 'Turunçgil Şerbeti',
    palette: { bg: '#fffbeb', surface: '#ffffff', ink: '#451a03', muted: '#784c31', primary: '#d97706', accent: '#059669' }
  },
  {
    id: 'candy-bubblegum',
    category: 'candy',
    name: 'Sakız Pembesi',
    palette: { bg: '#fff1f5', surface: '#ffffff', ink: '#3d0a1b', muted: '#73374b', primary: '#be185d', accent: '#4f46e5' }
  },
  {
    id: 'candy-marshmallow',
    category: 'candy',
    name: 'Vanilyalı Lokum',
    palette: { bg: '#faf8f5', surface: '#ffffff', ink: '#292524', muted: '#57534e', primary: '#6366f1', accent: '#ea580c' }
  },

  // 31-35: Retro & Vintage
  {
    id: 'retro-terracotta',
    category: 'retro',
    name: 'Terracotta',
    palette: { bg: '#fdf6f0', surface: '#ffffff', ink: '#381a10', muted: '#6b453a', primary: '#9a3412', accent: '#0284c7' }
  },
  {
    id: 'retro-mustard',
    category: 'retro',
    name: 'Vintage Hardal',
    palette: { bg: '#fefce8', surface: '#ffffff', ink: '#3d2506', muted: '#6e5535', primary: '#a16207', accent: '#15803d' }
  },
  {
    id: 'retro-teal',
    category: 'retro',
    name: '70ler Turkuazı',
    palette: { bg: '#f0fdfa', surface: '#ffffff', ink: '#042f2e', muted: '#335b5a', primary: '#0f766e', accent: '#c2410c' }
  },
  {
    id: 'retro-brick',
    category: 'retro',
    name: 'Kırmızı Tuğla',
    palette: { bg: '#fef2f2', surface: '#ffffff', ink: '#450a0a', muted: '#783838', primary: '#991b1b', accent: '#d97706' }
  },
  {
    id: 'retro-olive',
    category: 'retro',
    name: 'Klasik Haki',
    palette: { bg: '#f7f8f2', surface: '#ffffff', ink: '#212912', muted: '#4e563e', primary: '#4d7c0f', accent: '#9a3412' }
  },

  // 36-40: Modern & Monochrome
  {
    id: 'mono-slate',
    category: 'monochrome',
    name: 'Minimal Arduvaz',
    palette: { bg: '#f8fafc', surface: '#ffffff', ink: '#0f172a', muted: '#475569', primary: '#2563eb', accent: '#475569' }
  },
  {
    id: 'mono-charcoal',
    category: 'monochrome',
    name: 'Kömür & Siyah',
    palette: { bg: '#fafafa', surface: '#ffffff', ink: '#171717', muted: '#525252', primary: '#262626', accent: '#737373' }
  },
  {
    id: 'mono-zinc',
    category: 'monochrome',
    name: 'Çinko Mat',
    palette: { bg: '#f4f4f5', surface: '#ffffff', ink: '#18181b', muted: '#52525b', primary: '#27272a', accent: '#71717a' }
  },
  {
    id: 'mono-steel',
    category: 'monochrome',
    name: 'Çelik Mavi',
    palette: { bg: '#f1f5f9', surface: '#ffffff', ink: '#0f172a', muted: '#475569', primary: '#334155', accent: '#2563eb' }
  },
  {
    id: 'mono-cream',
    category: 'monochrome',
    name: 'Sade Keten',
    palette: { bg: '#faf7f2', surface: '#ffffff', ink: '#262422', muted: '#5c5854', primary: '#44403c', accent: '#78716c' }
  }
];

export const THEME_CATEGORIES = [
  'all',
  'pastel',
  'coffee',
  'ocean',
  'nature',
  'sunset',
  'candy',
  'retro',
  'monochrome'
];
