import { SECTORS } from '../generator/templates/sectors.js';

export function getCopyTemplates(sectorKey = 'cafe', lang = 'tr') {
  const safeLang = ['tr', 'en', 'ru', 'es'].includes(lang) ? lang : 'tr';
  const sector = SECTORS[sectorKey] ? SECTORS[sectorKey][safeLang] : SECTORS.cafe[safeLang];

  return {
    heroHeadlines: [
      sector.slogan,
      `${sector.aboutTitle} — ${sector.servicesTitle}`,
      `${sector.services[0]} & ${sector.services[1]}`
    ],
    ctas: [
      sector.heroCta,
      sector.contactTitle,
      sector.servicesTitle
    ],
    aboutSentences: [
      sector.aboutText,
      sector.slogan,
      ...sector.faq.map(f => `${f.q}: ${f.a}`)
    ],
    services: sector.services
  };
}
