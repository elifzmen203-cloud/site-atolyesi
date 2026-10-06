import { t } from '../i18n/index.js';
import { SITE_CONFIG } from '../config.js';

// Boş bırakılan iletişim kanalı (config.js) sayfada hiç görünmez.
function card(titleKey, descKey, href, linkText, external = true) {
  const target = external ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `
    <article class="info-card">
      <h3 data-i18n="${titleKey}">${t(titleKey)}</h3>
      <p data-i18n="${descKey}">${t(descKey)}</p>
      <p><a href="${href}"${target}>${linkText}</a></p>
    </article>
  `;
}

export function renderContactPage() {
  const container = document.createElement('div');
  container.className = 'container';

  const { contactEmail, issuesUrl, donateUrl } = SITE_CONFIG;
  const cards = [
    contactEmail && card('contact.email.title', 'contact.email.desc', `mailto:${contactEmail}`, contactEmail, false),
    issuesUrl && card('contact.issues.title', 'contact.issues.desc', issuesUrl, t('contact.issues.link')),
    donateUrl && card('contact.coffee.title', 'contact.coffee.desc', donateUrl, t('contact.coffee.link'))
  ].filter(Boolean);

  container.innerHTML = `
    <header style="margin-bottom: 2.5rem;">
      <h1 data-i18n="contact.title">${t('contact.title')}</h1>
      <p class="page-lead" data-i18n="contact.subtitle">${t('contact.subtitle')}</p>
    </header>

    <div class="info-grid">${cards.join('')}</div>

    <p style="color: var(--muted);" data-i18n="contact.note">${t('contact.note')}</p>
  `;

  return container;
}
