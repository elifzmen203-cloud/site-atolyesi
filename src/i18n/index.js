import tr from './tr.json';
import en from './en.json';
import ru from './ru.json';
import es from './es.json';

export const translations = { tr, en, ru, es };
export const SUPPORTED_LANGS = ['tr', 'en', 'ru', 'es'];
export const DEFAULT_LANG = 'tr';

const STORAGE_KEY = 'sa.lang';
let currentLang = DEFAULT_LANG;
const listeners = new Set();

export function getLang() {
  return currentLang;
}

export function detectInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGS.includes(saved)) {
      return saved;
    }
    if (typeof navigator !== 'undefined' && navigator.language) {
      const code = navigator.language.slice(0, 2).toLowerCase();
      if (SUPPORTED_LANGS.includes(code)) {
        return code;
      }
    }
  } catch (e) {
    // LocalStorage or navigator inaccessible
  }
  return DEFAULT_LANG;
}

export function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) {
    console.warn(`Unsupported language: ${lang}`);
    return;
  }
  currentLang = lang;
  try {
    localStorage.setItem(STORAGE_KEY, lang);
  } catch (e) {
    // Ignore storage quota/permission errors
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
  listeners.forEach(fn => fn(lang));
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function t(key, vars = {}) {
  const dict = translations[currentLang] || translations[DEFAULT_LANG];
  let text = dict[key];

  if (text === undefined) {
    // Fallback to default language
    text = translations[DEFAULT_LANG][key];
  }

  if (text === undefined) {
    console.warn(`[i18n] Missing key "${key}" for language "${currentLang}"`);
    return key;
  }

  // Replace {varName}
  if (vars && Object.keys(vars).length > 0) {
    return text.replace(/\{(\w+)\}/g, (match, param) => {
      return vars[param] !== undefined ? vars[param] : match;
    });
  }

  return text;
}

export function applyI18n(root = document) {
  if (!root) return;

  // Text content
  const elements = root.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key) {
      el.textContent = t(key);
    }
  });

  // Attributes: data-i18n-attr="placeholder:gen.namePlaceholder,title:app.title"
  const attrElements = root.querySelectorAll('[data-i18n-attr]');
  attrElements.forEach(el => {
    const spec = el.getAttribute('data-i18n-attr');
    if (spec) {
      spec.split(',').forEach(pair => {
        const [attr, key] = pair.split(':').map(s => s.trim());
        if (attr && key) {
          el.setAttribute(attr, t(key));
        }
      });
    }
  });
}

// Initialize immediately if in browser
if (typeof window !== 'undefined') {
  currentLang = detectInitialLang();
  if (typeof document !== 'undefined') {
    document.documentElement.lang = currentLang;
  }
}
