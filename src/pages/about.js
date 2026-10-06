import { t } from '../i18n/index.js';

export function renderAboutPage() {
  const container = document.createElement('div');
  container.className = 'container';

  container.innerHTML = `
    <header style="margin-bottom: 2.5rem;">
      <h1 data-i18n="about.title">${t('about.title')}</h1>
      <p class="page-lead" data-i18n="about.subtitle">${t('about.subtitle')}</p>
    </header>

    <div class="info-grid">
      <article class="info-card">
        <h3 data-i18n="about.card1.title">${t('about.card1.title')}</h3>
        <p data-i18n="about.card1.desc">${t('about.card1.desc')}</p>
      </article>

      <article class="info-card">
        <h3 data-i18n="about.card2.title">${t('about.card2.title')}</h3>
        <p data-i18n="about.card2.desc">${t('about.card2.desc')}</p>
      </article>

      <article class="info-card">
        <h3 data-i18n="about.card3.title">${t('about.card3.title')}</h3>
        <p data-i18n="about.card3.desc">${t('about.card3.desc')}</p>
      </article>

      <article class="info-card">
        <h3 data-i18n="about.card4.title">${t('about.card4.title')}</h3>
        <p data-i18n="about.card4.desc">${t('about.card4.desc')}</p>
      </article>
    </div>

    <div style="display: flex; flex-wrap: wrap; gap: 0.75rem;">
      <a href="#/" class="btn btn-primary" data-i18n="nav.generator">${t('nav.generator')}</a>
      <a href="#/iletisim" class="btn btn-outline" data-i18n="nav.contact">${t('nav.contact')}</a>
    </div>
  `;

  return container;
}
