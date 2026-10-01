# Değişiklik kaydı

## 2026-10-01 · Tur 2 (Antigravity)
- **Paketler:** `vite` (hızlı statik derleme ve geliştirme ortamı), `jszip` (tarayıcıda ve test ortamında .zip arşivi paketleme).
- **Yönlendirme & Altyapı:** Hash router (`#/`, `#/araclar`, `#/nasil`, `#/gizlilik`), Vite yapılandırması (`base: '/site-atolyesi/'`), GitHub Pages CI/CD iş akışı (`.github/workflows/deploy.yml`), Windows tek tık yayın betiği (`yayinla.cmd`).
- **Dil Desteği (i18n):** TR, EN, RU, ES dillerinde tam eşit anahtarlı sözlükler, `localStorage` dil tercihi kalıcılığı, dinamik `<html lang>` güncellemesi.
- **Site Üretici:** Canlı iframe önizlemeli form, 10 sektör × 4 dil içerik şablonları, 4 yerleşim stili (minimal, modern, classic, bold), XSS kaçışlamalı tek sayfa HTML5 + CSS + dilde README.txt üretimi, tek tıkla .ZIP indirme.
- **Tasarım Araç Kutusu:** WCAG 2.1 uyumlu kontrast hesaplayıcı ve 4 uyum kurallı renk paleti üretici, 8 Google Fonts eşleşmesi, sektörel metin şablonları, kopyalanabilir buton/kart/menü/footer kod parçaları.
- **Testler:** 8 test takımı (i18n anahtar eşitliği, 10 sektör × 4 dil HTML5 iskelet doğrulaması, XSS güvenliği, renk matematiği, WCAG kontrastı, zip paket içeriği); `npm test` ve `npm run build` 0 hata ile geçiyor.
- **Bilinen Eksikler:** Yok; tur 3'te Claude canlı yayın ve Actions teyidini yapacak.

## 2026-10-01 · hazırlık (Claude)
- Repo iskeleti: README, PROJE_KURALLARI, .gitignore. Kod henüz yok; döngü tur 2'de Antigravity yazacak.
