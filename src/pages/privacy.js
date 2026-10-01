import { t } from '../i18n/index.js';

export function renderPrivacyPage() {
  const container = document.createElement('div');
  container.className = 'container';

  container.innerHTML = `
    <header style="margin-bottom: 2.5rem;">
      <h1 data-i18n="privacy.title">${t('privacy.title')}</h1>
      <p class="page-lead" data-i18n="privacy.subtitle">${t('privacy.subtitle')}</p>
    </header>

    <div class="info-grid">
      <article class="info-card">
        <h3 data-i18n="privacy.card1.title">${t('privacy.card1.title')}</h3>
        <p data-i18n="privacy.card1.desc">${t('privacy.card1.desc')}</p>
      </article>

      <article class="info-card">
        <h3 data-i18n="privacy.card2.title">${t('privacy.card2.title')}</h3>
        <p data-i18n="privacy.card2.desc">${t('privacy.card2.desc')}</p>
        <p><a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer">${t('privacy.adsLink')}</a></p>
      </article>

      <article class="info-card">
        <h3 data-i18n="privacy.card3.title">${t('privacy.card3.title')}</h3>
        <p data-i18n="privacy.card3.desc">${t('privacy.card3.desc')}</p>
      </article>

      <article class="info-card">
        <h3 data-i18n="privacy.card4.title">${t('privacy.card4.title')}</h3>
        <p data-i18n="privacy.card4.desc">${t('privacy.card4.desc')}</p>
      </article>
    </div>
  `;

  return container;
}
