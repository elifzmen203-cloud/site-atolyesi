export const CODE_SNIPPETS = {
  button: {
    id: 'button',
    name: 'Butonlar (Primary, Secondary, Outline)',
    html: `<button class="btn btn-primary">Hemen Başlayın</button>
<button class="btn btn-secondary">Daha Fazla Bilgi</button>
<button class="btn btn-outline">İletişime Geçin</button>`,
    css: `.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}
.btn-primary {
  background-color: #3b5bdb;
  color: #ffffff;
}
.btn-primary:hover {
  background-color: #364fc7;
}
.btn-secondary {
  background-color: #edf2ff;
  color: #3b5bdb;
}
.btn-secondary:hover {
  background-color: #dbe4ff;
}
.btn-outline {
  background-color: transparent;
  border-color: #ced4da;
  color: #212529;
}
.btn-outline:hover {
  border-color: #3b5bdb;
  color: #3b5bdb;
}`
  },

  card: {
    id: 'card',
    name: 'İçerik Kartı',
    html: `<article class="card">
  <div class="card-visual">✦</div>
  <div class="card-body">
    <span class="card-tag">Hizmet</span>
    <h3 class="card-title">Özel Tasarım Çözümleri</h3>
    <p class="card-text">Kullanıcı deneyimini ön planda tutan, erişilebilir ve modern web tasarımları.</p>
    <a href="#" class="card-link">Detayları Gör &rarr;</a>
  </div>
</article>`,
    css: `.card {
  background: #ffffff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  max-width: 340px;
  transition: transform 0.2s ease;
}
.card:hover {
  transform: translateY(-4px);
}
.card-visual {
  height: 140px;
  background: linear-gradient(135deg, #3b5bdb 0%, #748ffc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 2.5rem;
}
.card-body {
  padding: 1.5rem;
}
.card-tag {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #3b5bdb;
  margin-bottom: 0.5rem;
}
.card-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.25rem;
  color: #1f2430;
}
.card-text {
  color: #5b6270;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}
.card-link {
  color: #3b5bdb;
  font-weight: 600;
  text-decoration: none;
}`
  },

  navbar: {
    id: 'navbar',
    name: 'Navigasyon Menüsü',
    html: `<header class="navbar">
  <div class="navbar-container">
    <a href="#" class="brand">Atölye</a>
    <nav class="nav-menu">
      <a href="#about" class="nav-item">Hakkımızda</a>
      <a href="#services" class="nav-item">Hizmetler</a>
      <a href="#contact" class="nav-item">İletişim</a>
    </nav>
    <a href="#cta" class="nav-cta">Başlayın</a>
  </div>
</header>`,
    css: `.navbar {
  background: #ffffff;
  border-bottom: 1px solid #e3dfd8;
  position: sticky;
  top: 0;
  z-index: 10;
}
.navbar-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0.75rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.brand {
  font-weight: 700;
  font-size: 1.25rem;
  color: #1f2430;
  text-decoration: none;
}
.nav-menu {
  display: flex;
  gap: 1.5rem;
}
.nav-item {
  color: #5b6270;
  text-decoration: none;
  font-size: 0.95rem;
  font-weight: 500;
}
.nav-item:hover {
  color: #3b5bdb;
}
.nav-cta {
  background: #3b5bdb;
  color: #ffffff;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}`
  },

  footer: {
    id: 'footer',
    name: 'Sayfa Altlığı (Footer)',
    html: `<footer class="site-footer">
  <div class="footer-wrap">
    <div class="footer-brand">
      <h3>Atölye</h3>
      <p>Modern ve temiz web çözümleri.</p>
    </div>
    <div class="footer-links">
      <a href="#">Gizlilik</a>
      <a href="#">Kullanım Şartları</a>
      <a href="#">İletişim</a>
    </div>
  </div>
  <div class="footer-bottom">
    <p>&copy; 2026 Atölye. Tüm hakları saklıdır.</p>
  </div>
</footer>`,
    css: `.site-footer {
  background: #1f2430;
  color: #c1c5cd;
  padding: 3rem 1.5rem 1.5rem;
}
.footer-wrap {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}
.footer-brand h3 {
  color: #ffffff;
  margin-bottom: 0.25rem;
}
.footer-links {
  display: flex;
  gap: 1.5rem;
}
.footer-links a {
  color: #a0a7b4;
  text-decoration: none;
  font-size: 0.95rem;
}
.footer-links a:hover {
  color: #ffffff;
}
.footer-bottom {
  max-width: 1000px;
  margin: 1.5rem auto 0;
  font-size: 0.85rem;
  color: #7b8392;
  text-align: center;
}`
  }
};
