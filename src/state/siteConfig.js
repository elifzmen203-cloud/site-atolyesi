/**
 * Shared Site Configuration State for Site Atölyesi v2.
 * Shared between Wizard (#/sihirbaz) and Free Studio (#/atolye).
 * Automatically persists drafts to localStorage.
 */

import { SECTORS } from '../generator/templates/sectors.js';

export const DRAFT_STORAGE_KEY = 'sa.v2Draft';

export const AVAILABLE_SECTION_TYPES = ['hero', 'services', 'about', 'gallery', 'contact'];

export const SECTION_VARIANTS = {
  hero: ['center', 'left'],
  services: ['cards', 'list'],
  about: ['simple', 'stats'],
  gallery: ['grid', 'cards'],
  contact: ['simple', 'cards']
};

export const SECTION_BG_STYLES = ['default', 'surface', 'accent'];

let currentConfig = null;
const listeners = new Set();

/**
 * Creates default configuration for a given sector and language.
 */
export function createDefaultSiteConfig(sector = 'cafe', lang = 'tr') {
  const safeLang = ['tr', 'en', 'ru', 'es'].includes(lang) ? lang : 'tr';
  const sectorData = (SECTORS[sector] && SECTORS[sector][safeLang]) || SECTORS.cafe[safeLang] || SECTORS.cafe.tr;

  const defaultNames = {
    tr: 'Kahve Atölyesi',
    en: 'Coffee Workshop',
    ru: 'Мастерская кофе',
    es: 'Taller de Café'
  };

  return {
    name: defaultNames[safeLang] || 'Kahve Atölyesi',
    slogan: sectorData.slogan || 'Taze kahveler ve sıcak sohbetler',
    sector: sector,
    layout: 'modern',
    fontPairKey: 'modern',
    palette: {
      bg: '#fdfbf7',
      surface: '#ffffff',
      ink: '#292524',
      muted: '#57534e',
      primary: '#4f46e5',
      accent: '#c2410c'
    },
    sections: [
      {
        id: 'sec-hero',
        type: 'hero',
        title: defaultNames[safeLang] || 'Kahve Atölyesi',
        subtitle: sectorData.slogan || 'Taze kahveler ve sıcak sohbetler',
        variant: 'center',
        bgStyle: 'default'
      },
      {
        id: 'sec-services',
        type: 'services',
        title: sectorData.servicesTitle || 'Hizmetlerimiz',
        subtitle: (sectorData.services && sectorData.services.join(' • ')) || 'Özel Kahveler • Taze Tatlılar',
        variant: 'cards',
        bgStyle: 'surface'
      },
      {
        id: 'sec-about',
        type: 'about',
        title: sectorData.aboutTitle || 'Hakkımızda',
        subtitle: sectorData.aboutText || 'Lezzet ve samimiyeti bir araya getiriyoruz.',
        variant: 'simple',
        bgStyle: 'default'
      },
      {
        id: 'sec-gallery',
        type: 'gallery',
        title: 'Galeri',
        subtitle: 'Mekanımızdan ve lezzetlerimizden kareler',
        variant: 'grid',
        bgStyle: 'surface'
      },
      {
        id: 'sec-contact',
        type: 'contact',
        title: sectorData.contactTitle || 'İletişim',
        subtitle: '+90 555 123 4567 • Moda Caddesi No:12 Kadıköy',
        variant: 'simple',
        bgStyle: 'default'
      }
    ]
  };
}

/**
 * Loads draft from storage or creates default.
 */
export function loadDraft(storage = (typeof localStorage !== 'undefined' ? localStorage : null), lang = 'tr') {
  if (storage) {
    try {
      const raw = storage.getItem(DRAFT_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.sections)) {
          currentConfig = parsed;
          return Object.assign({}, currentConfig);
        }
      }
    } catch (e) {
      // Ignore parse failure, fall back to default
    }
  }

  currentConfig = createDefaultSiteConfig('cafe', lang);
  return Object.assign({}, currentConfig);
}

/**
 * Saves current configuration to storage.
 */
export function saveDraft(storage = (typeof localStorage !== 'undefined' ? localStorage : null)) {
  if (!storage || !currentConfig) return false;
  try {
    storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(currentConfig));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Gets a deep copy of the current configuration.
 */
export function getSiteConfig() {
  if (!currentConfig) {
    currentConfig = loadDraft();
  }
  return JSON.parse(JSON.stringify(currentConfig));
}

function notifyListeners() {
  saveDraft();
  const copy = getSiteConfig();
  listeners.forEach(fn => {
    try {
      fn(copy);
    } catch (err) {
      // Ignore listener error
    }
  });
}

/**
 * Subscribes to configuration changes.
 * @returns {Function} unsubscribe
 */
export function onSiteConfigChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Updates partial top-level configuration properties.
 */
export function updateSiteConfig(partial = {}) {
  if (!currentConfig) currentConfig = loadDraft();
  currentConfig = Object.assign({}, currentConfig, partial);
  notifyListeners();
  return getSiteConfig();
}

/**
 * Resets configuration to default for given sector and language.
 */
export function resetSiteConfig(sector = 'cafe', lang = 'tr') {
  currentConfig = createDefaultSiteConfig(sector, lang);
  notifyListeners();
  return getSiteConfig();
}

/**
 * Adds a new section to the site configuration.
 */
export function addSection(type = 'services', title = '', subtitle = '') {
  if (!currentConfig) currentConfig = loadDraft();
  if (!AVAILABLE_SECTION_TYPES.includes(type)) type = 'services';

  const newId = `sec-${type}-${Date.now().toString(36)}`;
  const variants = SECTION_VARIANTS[type] || ['center', 'left'];

  const section = {
    id: newId,
    type,
    title: title || type.charAt(0).toUpperCase() + type.slice(1),
    subtitle: subtitle || '',
    variant: variants[0],
    bgStyle: 'default'
  };

  currentConfig.sections.push(section);
  notifyListeners();
  return section;
}

/**
 * Removes a section by id.
 */
export function removeSection(id) {
  if (!currentConfig) currentConfig = loadDraft();
  const beforeLen = currentConfig.sections.length;
  currentConfig.sections = currentConfig.sections.filter(s => s.id !== id);
  if (currentConfig.sections.length !== beforeLen) {
    notifyListeners();
    return true;
  }
  return false;
}

/**
 * Moves a section from one index to another (reordering).
 */
export function moveSection(fromIndex, toIndex) {
  if (!currentConfig) currentConfig = loadDraft();
  const list = currentConfig.sections;
  if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) {
    return false;
  }

  const [item] = list.splice(fromIndex, 1);
  list.splice(toIndex, 0, item);
  notifyListeners();
  return true;
}

/**
 * Updates a specific section's properties.
 */
export function updateSection(id, changes = {}) {
  if (!currentConfig) currentConfig = loadDraft();
  const sec = currentConfig.sections.find(s => s.id === id);
  if (!sec) return null;

  Object.assign(sec, changes);
  notifyListeners();
  return Object.assign({}, sec);
}

/**
 * Converts v2 SiteConfig into the rawConfig format supported by generator/buildSite.
 */
export function toBuildSiteConfig(config = getSiteConfig()) {
  const activeSectionKeys = config.sections.map(s => s.type);

  return {
    name: config.name,
    slogan: config.slogan,
    sector: config.sector,
    layout: config.layout || 'modern',
    fontPairKey: config.fontPairKey || 'modern',
    palette: Object.assign({}, config.palette),
    sections: activeSectionKeys,
    contact: {
      phone: (config.sections.find(s => s.type === 'contact') && config.sections.find(s => s.type === 'contact').subtitle) || '+90 555 123 4567',
      email: 'iletisim@ornek.com',
      address: 'Kadıköy, İstanbul'
    }
  };
}
