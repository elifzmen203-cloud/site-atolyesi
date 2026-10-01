import { SECTORS } from './templates/sectors.js';
import { getLayoutStyles } from './layouts.js';

export function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const DEFAULT_PALETTES = {
  warm: { bg: '#faf8f5', surface: '#ffffff', ink: '#2d241e', muted: '#6b5e55', primary: '#b45309', accent: '#f59e0b', border: '#e8e1d7' },
  ocean: { bg: '#f8fafc', surface: '#ffffff', ink: '#0f172a', muted: '#475569', primary: '#0284c7', accent: '#06b6d4', border: '#e2e8f0' },
  forest: { bg: '#f7faf7', surface: '#ffffff', ink: '#142817', muted: '#4c6451', primary: '#2d6a4f', accent: '#52b788', border: '#e1ede4' },
  slate: { bg: '#f8fafc', surface: '#ffffff', ink: '#1e293b', muted: '#64748b', primary: '#3b82f6', accent: '#6366f1', border: '#e2e8f0' },
  sunset: { bg: '#fffbf9', surface: '#ffffff', ink: '#2a1a1f', muted: '#735760', primary: '#e11d48', accent: '#fb923c', border: '#fce7e1' },
  berry: { bg: '#faf7fc', surface: '#ffffff', ink: '#261733', muted: '#68577a', primary: '#7c3aed', accent: '#ec4899', border: '#eddff7' }
};

const DEFAULT_FONT_PAIRS = {
  modern: {
    heading: "'Poppins', sans-serif",
    body: "'Inter', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&display=swap'
  },
  classic: {
    heading: "'Playfair Display', serif",
    body: "'Source Sans 3', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@400;600&display=swap'
  },
  bold: {
    heading: "'Montserrat', sans-serif",
    body: "'Merriweather', serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700&family=Montserrat:wght@700;800&display=swap'
  },
  editorial: {
    heading: "'DM Serif Display', serif",
    body: "'DM Sans', sans-serif",
    googleUrl: 'https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=DM+Serif+Display&display=swap'
  }
};

export function buildSite(rawConfig = {}, lang = 'tr') {
  const safeLang = ['tr', 'en', 'ru', 'es'].includes(lang) ? lang : 'tr';
  const sectorKey = SECTORS[rawConfig.sector] ? rawConfig.sector : 'cafe';
  const sectorData = SECTORS[sectorKey][safeLang] || SECTORS.cafe[safeLang];

  const name = (rawConfig.name && rawConfig.name.trim()) || (
    safeLang === 'tr' ? 'Örnek İşletme' :
    safeLang === 'ru' ? 'Название компании' :
    safeLang === 'es' ? 'Nombre del Negocio' : 'Sample Business'
  );

  const slogan = (rawConfig.slogan && rawConfig.slogan.trim()) || sectorData.slogan;
  
  let services = [];
  if (Array.isArray(rawConfig.services) && rawConfig.services.length > 0) {
    services = rawConfig.services.filter(s => s && s.trim());
  }
  if (services.length === 0) {
    services = sectorData.services;
  }

  const contact = {
    phone: (rawConfig.contact && rawConfig.contact.phone) || '+90 555 000 00 00',
    email: (rawConfig.contact && rawConfig.contact.email) || 'iletisim@ornek.com',
    address: (rawConfig.contact && rawConfig.contact.address) || 'Kadıköy, İstanbul'
  };

  const paletteKey = rawConfig.paletteKey || 'ocean';
  const palette = Object.assign({}, DEFAULT_PALETTES[paletteKey] || DEFAULT_PALETTES.ocean, rawConfig.palette || {});

  const fontPairKey = rawConfig.fontPairKey || 'modern';
  const fontPair = Object.assign({}, DEFAULT_FONT_PAIRS[fontPairKey] || DEFAULT_FONT_PAIRS.modern, rawConfig.fonts || {});

  const layout = ['minimal', 'modern', 'classic', 'bold'].includes(rawConfig.layout) ? rawConfig.layout : 'modern';

  const activeSections = Array.isArray(rawConfig.sections) && rawConfig.sections.length > 0
    ? rawConfig.sections
    : ['hero', 'about', 'services', 'gallery', 'reviews', 'faq', 'contact'];

  // Section templates
  const sectionHtml = [];

  // 1. Hero Section
  if (activeSections.includes('hero')) {
    sectionHtml.push(`
    <header class="hero">
      <div class="container hero-inner">
        <span class="badge">${escapeHtml(name)}</span>
        <h1>${escapeHtml(slogan)}</h1>
        <p class="hero-desc">${escapeHtml(sectorData.aboutText.slice(0, 160))}...</p>
        <div class="hero-actions">
          <a href="#contact" class="btn btn-primary">${escapeHtml(sectorData.heroCta)}</a>
          <a href="#services" class="btn btn-outline">${escapeHtml(sectorData.servicesTitle)}</a>
        </div>
      </div>
    </header>`);
  }

  // 2. About Section
  if (activeSections.includes('about')) {
    sectionHtml.push(`
    <section id="about" class="section">
      <div class="container">
        <h2 class="section-title">${escapeHtml(sectorData.aboutTitle)}</h2>
        <div class="about-grid">
          <div class="about-card card">
            <p class="lead-text">${escapeHtml(sectorData.aboutText)}</p>
            <p>${escapeHtml(slogan)}</p>
          </div>
          <div class="about-visual card placeholder-visual" aria-hidden="true">
            <div class="visual-accent">✦</div>
            <div class="visual-label">${escapeHtml(name)}</div>
          </div>
        </div>
      </div>
    </section>`);
  }

  // 3. Services Section
  if (activeSections.includes('services')) {
    const serviceCards = services.map((s, idx) => `
          <div class="card service-card">
            <div class="card-icon">0${idx + 1}</div>
            <h3>${escapeHtml(s)}</h3>
            <p>${escapeHtml(sectorData.aboutText.slice(0, 100))}...</p>
          </div>`).join('\n');

    sectionHtml.push(`
    <section id="services" class="section bg-alt">
      <div class="container">
        <h2 class="section-title">${escapeHtml(sectorData.servicesTitle)}</h2>
        <div class="grid grid-3">
          ${serviceCards}
        </div>
      </div>
    </section>`);
  }

  // 4. Gallery Section (Pure CSS Gradient Cards)
  if (activeSections.includes('gallery')) {
    const galleryTitle = safeLang === 'tr' ? 'Fotoğraf Galerisi' :
      safeLang === 'ru' ? 'Галерея' :
      safeLang === 'es' ? 'Galería de Imágenes' : 'Visual Gallery';

    sectionHtml.push(`
    <section id="gallery" class="section">
      <div class="container">
        <h2 class="section-title">${escapeHtml(galleryTitle)}</h2>
        <div class="grid grid-3 gallery-grid">
          <div class="gallery-item card gradient-1" aria-label="Galeri görseli 1"><span class="gallery-badge">01</span></div>
          <div class="gallery-item card gradient-2" aria-label="Galeri görseli 2"><span class="gallery-badge">02</span></div>
          <div class="gallery-item card gradient-3" aria-label="Galeri görseli 3"><span class="gallery-badge">03</span></div>
        </div>
      </div>
    </section>`);
  }

  // 5. Reviews Section
  if (activeSections.includes('reviews')) {
    const reviewCards = sectorData.reviews.map(r => `
          <div class="card review-card">
            <div class="stars">★★★★★</div>
            <blockquote>"${escapeHtml(r.text)}"</blockquote>
            <cite>— ${escapeHtml(r.author)}</cite>
          </div>`).join('\n');

    sectionHtml.push(`
    <section id="reviews" class="section bg-alt">
      <div class="container">
        <h2 class="section-title">${escapeHtml(sectorData.reviewsTitle)}</h2>
        <div class="grid grid-3">
          ${reviewCards}
        </div>
      </div>
    </section>`);
  }

  // 6. FAQ Section
  if (activeSections.includes('faq')) {
    const faqTitle = safeLang === 'tr' ? 'Sıkça Sorulan Sorular' :
      safeLang === 'ru' ? 'Частые вопросы' :
      safeLang === 'es' ? 'Preguntas Frecuentes' : 'Frequently Asked Questions';

    const faqItems = sectorData.faq.map(item => `
          <div class="card faq-card">
            <h3>${escapeHtml(item.q)}</h3>
            <p>${escapeHtml(item.a)}</p>
          </div>`).join('\n');

    sectionHtml.push(`
    <section id="faq" class="section">
      <div class="container">
        <h2 class="section-title">${escapeHtml(faqTitle)}</h2>
        <div class="grid grid-2">
          ${faqItems}
        </div>
      </div>
    </section>`);
  }

  // 7. Contact Section
  if (activeSections.includes('contact')) {
    sectionHtml.push(`
    <section id="contact" class="section bg-alt">
      <div class="container">
        <h2 class="section-title">${escapeHtml(sectorData.contactTitle)}</h2>
        <div class="grid grid-3 contact-grid">
          <div class="card contact-card">
            <span class="contact-icon">☎</span>
            <h3>${safeLang === 'tr' ? 'Telefon' : safeLang === 'ru' ? 'Телефон' : safeLang === 'es' ? 'Teléfono' : 'Phone'}</h3>
            <p><a href="tel:${escapeHtml(contact.phone)}">${escapeHtml(contact.phone)}</a></p>
          </div>
          <div class="card contact-card">
            <span class="contact-icon">✉</span>
            <h3>${safeLang === 'tr' ? 'E-posta' : safeLang === 'ru' ? 'Почта' : safeLang === 'es' ? 'Correo' : 'Email'}</h3>
            <p><a href="mailto:${escapeHtml(contact.email)}">${escapeHtml(contact.email)}</a></p>
          </div>
          <div class="card contact-card">
            <span class="contact-icon">📍</span>
            <h3>${safeLang === 'tr' ? 'Adres' : safeLang === 'ru' ? 'Адрес' : safeLang === 'es' ? 'Dirección' : 'Location'}</h3>
            <p>${escapeHtml(contact.address)}</p>
          </div>
        </div>
      </div>
    </section>`);
  }

  // Navigation Links
  const navLinks = activeSections
    .filter(s => s !== 'hero')
    .map(s => {
      let label = s;
      if (s === 'about') label = sectorData.aboutTitle.split(' ')[0] || 'Hakkımızda';
      else if (s === 'services') label = sectorData.servicesTitle.split(' ')[0] || 'Hizmetler';
      else if (s === 'gallery') label = safeLang === 'tr' ? 'Galeri' : safeLang === 'ru' ? 'Галерея' : safeLang === 'es' ? 'Galería' : 'Gallery';
      else if (s === 'reviews') label = safeLang === 'tr' ? 'Yorumlar' : safeLang === 'ru' ? 'Отзывы' : safeLang === 'es' ? 'Opiniones' : 'Reviews';
      else if (s === 'faq') label = 'SSS / FAQ';
      else if (s === 'contact') label = safeLang === 'tr' ? 'İletişim' : safeLang === 'ru' ? 'Контакты' : safeLang === 'es' ? 'Contacto' : 'Contact';
      return `<a href="#${s}">${escapeHtml(label)}</a>`;
    }).join(' ');

  // Full HTML
  const fontLink = fontPair.googleUrl ? `<link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${fontPair.googleUrl}" rel="stylesheet">` : '';

  const html = `<!doctype html>
<html lang="${safeLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(name)} | ${escapeHtml(slogan)}</title>
  <meta name="description" content="${escapeHtml(slogan)}">
  ${fontLink}
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <nav class="site-nav">
    <div class="container nav-inner">
      <a href="#" class="brand-link">${escapeHtml(name)}</a>
      <div class="nav-links">
        ${navLinks}
      </div>
    </div>
  </nav>

  <main>
${sectionHtml.join('\n')}
  </main>

  <footer class="site-footer">
    <div class="container footer-inner">
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(name)}. ${safeLang === 'tr' ? 'Tüm hakları saklıdır.' : safeLang === 'ru' ? 'Все права защищены.' : safeLang === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
      <p class="footer-meta">${escapeHtml(contact.address)} | <a href="tel:${escapeHtml(contact.phone)}">${escapeHtml(contact.phone)}</a></p>
    </div>
  </footer>
</body>
</html>`;

  // Full CSS
  const layoutCss = getLayoutStyles(layout);
  const css = `/* Generated by Site Atölyesi */
:root {
  --bg: ${palette.bg || '#ffffff'};
  --surface: ${palette.surface || '#ffffff'};
  --ink: ${palette.ink || '#111827'};
  --muted: ${palette.muted || '#6b7280'};
  --primary: ${palette.primary || '#2563eb'};
  --accent: ${palette.accent || '#f59e0b'};
  --border: ${palette.border || '#e5e7eb'};
  --font-heading: ${fontPair.heading || 'system-ui, -apple-system, sans-serif'};
  --font-body: ${fontPair.body || 'system-ui, -apple-system, sans-serif'};
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-body);
  color: var(--ink);
  background-color: var(--bg);
  line-height: 1.6;
  font-size: 16px;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--ink);
  line-height: 1.25;
}

a {
  color: var(--primary);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* Navigation */
.site-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
}
.nav-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
}
.brand-link {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--ink);
  text-decoration: none;
}
.nav-links {
  display: flex;
  gap: 1.25rem;
  flex-wrap: wrap;
}
.nav-links a {
  color: var(--muted);
  font-size: 0.95rem;
  font-weight: 500;
}
.nav-links a:hover {
  color: var(--primary);
  text-decoration: none;
}

/* Sections */
.section {
  padding: 5rem 0;
}
.bg-alt {
  background-color: var(--surface);
}
.section-title {
  font-size: clamp(1.75rem, 3.5vw, 2.5rem);
  margin-bottom: 2.5rem;
}

/* Grid & Cards */
.grid {
  display: grid;
  gap: 1.5rem;
}
.grid-2 {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
.grid-3 {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.75rem;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.2s ease;
}
.btn-primary {
  background: var(--primary);
  color: #ffffff;
  border: 1px solid transparent;
}
.btn-primary:hover {
  opacity: 0.92;
  text-decoration: none;
}
.btn-outline {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--border);
}
.btn-outline:hover {
  border-color: var(--ink);
  text-decoration: none;
}

/* Hero elements */
.hero .badge {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.85rem;
  background: var(--border);
  color: var(--muted);
  border-radius: 50px;
  margin-bottom: 1.25rem;
}
.hero h1 {
  font-size: clamp(2.2rem, 5vw, 3.5rem);
  margin-bottom: 1.25rem;
}
.hero-desc {
  font-size: 1.15rem;
  color: var(--muted);
  margin-bottom: 2rem;
  max-width: 650px;
}
.hero-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

/* About Layout */
.about-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
.lead-text {
  font-size: 1.15rem;
  margin-bottom: 1rem;
  color: var(--ink);
}
.placeholder-visual {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  background: linear-gradient(135deg, var(--bg) 0%, var(--surface) 100%);
  border: 2px dashed var(--border);
}
.visual-accent {
  font-size: 3rem;
  color: var(--primary);
  margin-bottom: 0.5rem;
}
.visual-label {
  font-weight: 600;
  color: var(--muted);
}

/* Service & Review Cards */
.card-icon {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 0.75rem;
}
.service-card h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}
.service-card p {
  color: var(--muted);
  font-size: 0.95rem;
}

.stars {
  color: var(--accent);
  margin-bottom: 0.75rem;
  letter-spacing: 2px;
}
.review-card blockquote {
  font-style: italic;
  margin-bottom: 1rem;
  color: var(--ink);
}
.review-card cite {
  font-size: 0.9rem;
  color: var(--muted);
  font-weight: 600;
}

/* Gallery Gradients */
.gallery-item {
  height: 200px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  border-radius: 8px;
}
.gradient-1 { background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%); }
.gradient-2 { background: linear-gradient(135deg, var(--accent) 0%, var(--muted) 100%); }
.gradient-3 { background: linear-gradient(135deg, var(--bg) 0%, var(--primary) 100%); }
.gallery-badge {
  background: rgba(0, 0, 0, 0.4);
  color: #ffffff;
  padding: 0.25rem 0.65rem;
  font-size: 0.8rem;
  border-radius: 4px;
}

/* FAQ */
.faq-card h3 {
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
}
.faq-card p {
  color: var(--muted);
}

/* Contact */
.contact-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}
.contact-card h3 {
  margin-bottom: 0.5rem;
}

/* Footer */
.site-footer {
  padding: 3rem 0;
  border-top: 1px solid var(--border);
  background: var(--surface);
  color: var(--muted);
  font-size: 0.9rem;
}
.footer-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .nav-inner {
    flex-direction: column;
    height: auto;
    padding: 1rem 0;
    gap: 0.75rem;
  }
  .nav-links {
    justify-content: center;
  }
  .hero-actions {
    flex-direction: column;
  }
  .footer-inner {
    flex-direction: column;
    text-align: center;
  }
}

${layoutCss}
`;

  // Selected README text
  let readme = '';
  if (safeLang === 'tr') {
    readme = `================================================================
${name} - Web Sitesi Dosyaları
Site Atölyesi tarafından üretilmiştir (https://elifzmen203-cloud.github.io/site-atolyesi/)
================================================================

Bu arşiv aşağıdaki dosyaları içerir:
- index.html : Web sitenizin tüm içeriğini ve iskeletini barındıran ana dosya.
- style.css  : Renkler, yazı tipleri ve yerleşim kurallarını içeren stil dosyası.
- README.txt : Bu kullanım kılavuzu.

----------------------------------------------------------------
1. NASIL GÖRÜNTÜLENİR?
----------------------------------------------------------------
Herhangi bir kurulum veya sunucu gerekmez. 'index.html' dosyasına
çift tıklayarak sitenizi Chrome, Safari, Edge veya Firefox tarayıcınızda
hemen görüntüleyebilirsiniz.

----------------------------------------------------------------
2. NASIL DÜZENLENİR?
----------------------------------------------------------------
Herhangi bir metin editörü (Not Defteri, VS Code, Sublime vb.) ile
'index.html' dosyasını açıp metinleri, iletişim bilgilerini veya
bağlantıları doğrudan düzenleyebilirsiniz.
Not: Müşteri yorumları örnek metinlerdir; gerçek misafirlerinizin
yorumlarıyla güncellemenizi öneririz.

----------------------------------------------------------------
3. İNTERNETTE NASIL YAYINLANIR? (ÜCRETSİZ)
----------------------------------------------------------------
Sitenizi dünyaya açmak için tamamen ücretsiz şu yöntemleri kullanabilirsiniz:
a) GitHub Pages: Bir GitHub hesabı açıp bu dosyaları yükleyin, Ayarlar -> Pages bölümünden yayınlayın.
b) Netlify Drop: netlify.com/drop adresine gidin, zip dosyasını sürükleyip bırakın, anında canlıya alın.
c) Vercel: vercel.com üzerinden tek tıkla projenizi yayınlayabilirsiniz.
`;
  } else if (safeLang === 'ru') {
    readme = `================================================================
${name} - Файлы веб-сайта
Сгенерировано в Мастерской сайтов (https://elifzmen203-cloud.github.io/site-atolyesi/)
================================================================

В архиве содержатся:
- index.html : Главная страница со структурой и текстами.
- style.css  : Таблица стилей оформления, шрифтов и адаптивной сетки.
- README.txt : Инструкция по использованию.

1. КАК ОТКРЫТЬ?
Дважды щелкните по файлу 'index.html', чтобы просмотреть сайт в любом браузере.

2. КАК РЕДАКТИРОВАТЬ?
Откройте 'index.html' в любом текстовом редакторе (Блокнот, VS Code) и измените контакты и тексты.
Примечание: отзывы являются примерными; замените их на настоящие слова ваших клиентов.

3. КАК ОПУБЛИКОВАТЬ БЕСПЛАТНО?
- GitHub Pages: загрузите файлы в репозиторий и включите Pages в настройках.
- Netlify / Vercel: загрузите архив и получите бесплатный рабочий адрес сайта за секунды.
`;
  } else if (safeLang === 'es') {
    readme = `================================================================
${name} - Archivos del Sitio Web
Generado con el Taller de Sitios (https://elifzmen203-cloud.github.io/site-atolyesi/)
================================================================

Este paquete contiene:
- index.html : Archivo principal con la estructura semántica y textos.
- style.css  : Hoja de estilos con variables de color y diseño responsivo.
- README.txt : Guía de uso.

1. ¿CÓMO VISUALIZARLO?
Haz doble clic sobre 'index.html' para abrirlo inmediatamente en tu navegador favorito.

2. ¿CÓMO EDITARLO?
Abre 'index.html' con cualquier editor de texto para modificar datos de contacto o descripciones.
Nota: Las reseñas son ejemplos; sustitúyelas por testimonios reales de tus clientes.

3. ¿CÓMO PUBLICARLO GRATIS?
Puedes alojarlo sin coste en GitHub Pages, Netlify Drop o Vercel arrastrando estos archivos.
`;
  } else {
    readme = `================================================================
${name} - Website Package
Generated by Site Workshop (https://elifzmen203-cloud.github.io/site-atolyesi/)
================================================================

This package includes:
- index.html : The core semantic HTML document.
- style.css  : The CSS stylesheet containing your colors, fonts, and responsive layout.
- README.txt : This reference guide.

1. HOW TO VIEW
Simply double-click 'index.html' to open and preview your site in any web browser.

2. HOW TO EDIT
Open 'index.html' with any code or text editor to personalize text, phone numbers, and addresses.
Note: Testimonials in the template are placeholders; replace them with genuine client feedback.

3. HOW TO HOST FOR FREE
Publish your site online with free hosting platforms:
- GitHub Pages: Push files to a repository and enable Pages under Settings.
- Netlify Drop: Drag and drop your folder onto netlify.com/drop for instant hosting.
- Vercel: Deploy directly from your browser in seconds.
`;
  }

  return { html, css, readme };
}
