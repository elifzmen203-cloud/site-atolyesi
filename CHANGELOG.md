# Değişiklik kaydı

## 2026-10-01 · v2 Tur 4 (Antigravity) — Sihirbaz, Serbest Atölye, Küçük Animasyonlar ve Ara Denetim Düzeltmeleri
- **Ara Denetim 3 Düzeltmeleri:**
  - Renk seçici kasma düzeltmesi: `tools.js` içinde `input` olayında tam sekme yeniden çizimi kaldırıldı, sürüklerken yalnızca DOM swatch ve hex metin elemanları güncelleniyor; tam çizim yalnızca `change` olayında yapılıyor.
  - XSS koruması: Palet adı `escapeHtml` ile kaçışlandı; JSON içe aktarımında HTML etiketleri (`<[^>]*>`) temizleniyor (`test/palette-save.test.js`).
  - Okunurluk optimizasyonu: `.sky-transition` 60s katmanının z-index değeri 5'e çekildi, maksimum opaklığı 0.16–0.18 aralığına indirilerek 60 saniyelik gün doğumu/batımı renk geçişi sırasında sayfanın tüm içeriğinin kesintisiz okunabilirliği sağlandı.
  - Düzeltilen metinler: "Uygula" butonu toast bildirimi `tools.appliedToGen` yapıldı; gömülü hata ve varsayılan palet metinleri `t()` ile TR/EN/RU/ES dil dosyalarına taşındı.
  - 360 px uyumluluğu: `#cat-sleep-toggle` mobil ekranlar için responsive olarak ayarlandı.
- **Sihirbaz (`#/sihirbaz` - v2-5):**
  - 5 adımlı interaktif oluşturucu (İşletme Adı & Slogan > 10 Sektör Seçimi > Hazır Tema Seçimi > Bölüm Seçimi ve Varyantları > Canlı Önizleme ve İndir).
  - İlerleme çubuğu, Geri/İleri butonları, klavye desteği (Enter / Arrow tuşları), Atölyeye doğrudan geçiş ve ZIP indirme.
- **Serbest Atölye (`#/atolye` - v2-5):**
  - Bölüm ekleme, silme ve yukarı/aşağı butonları veya sürükle-bırak (drag & drop) ile sıralama.
  - Metin doğrudan düzenleme (başlık ve alt başlık/içerik).
  - Bölüm varyantı seçimi (hero ortalı/sol; hizmetler kart/liste; galeri ızgara/kartlar).
  - Bölüm zemin stili (varsayılan, açık kart, vurgulu).
  - Anlık güncellenen çoklu cihaz canlı iframe önizlemesi (Masaüstü, Tablet, Mobil).
- **Ortak Durum Yönetimi (`src/state/siteConfig.js`):**
  - Sihirbaz ve Serbest Atölye arasında tam çift yönlü durum senkronizasyonu; taslak `localStorage`'a otomatik kaydedilir (`sa.v2Draft`); `test/siteconfig.test.js` ile test edildi.
- **Küçük Animasyonlar & Konfeti (v2-6):**
  - Buton basışlarında yumuşak yaylanma (`:active { transform: scale(0.96); }`), sayfalar arası geçişlerde yumuşak belirme animasyonu (`pageFadeIn`).
  - ZIP hazır olunca sıfır bağımlılıklı canvas konfeti patlaması (`src/mascot/confetti.js`) ve kedi Tatlım'ın sevinç kutlaması ("🎉 mrr!").
  - `prefers-reduced-motion` ile tüm animasyonların ve konfetinin erişilebilir şekilde kapatılması.
- **Çeviri ve Test:**
  - Tüm yeni özellikler TR, EN, RU, ES dillerinde eksiksiz eklendi; koda gömülü Türkçe karakter sıfır; `npm test` 29/29 geçti, `npm run build` 0 hata.

## 2026-10-01 · v2 Tur 2 (Antigravity) — Pastel tema, Gece/Gündüz, Kedi Tatlım, Palet Araçları
- **Pastel Arayüz (v2-1):** Yumuşak krem zemin, şeftali, lavanta ve nane vurgu renkleri; yuvarlak Google Fonts Nunito tipografisi; büyük köşe yuvarlaklığı ve yumuşak gölgeler; `[data-mode="night"]` altında koyu pastel gece paleti; WCAG 2.1 AA (>= 4.5:1) tüm metin ve zemin çiftlerinde sağlandı (`src/color/contrast.js`, `test/contrast.test.js`).
- **Gece / Gündüz Döngüsü (v2-2):** Yerel saate bağlı otomatik geçiş (08:00–19:59 gündüz, 20:00–07:59 gece); elle seçim butonu kaldırıldı/yok; 60 saniyelik gökyüzü renk geçişi animasyonu (`TRANSITION_DURATION = 60000`, gündoğumu/günbatımı); non-blocking katman (`pointer-events: none`); prefers-reduced-motion desteği; zamanlayıcı ve dinleyiciler `initApp()` içinde tek seferlik kuruldu (`src/theme/daynight.js`, `test/daynight.test.js`).
- **Kedi Maskot Tatlım (v2-3):** Saf durum makineli (8 durum: yürü, otur, yalan, mırla, nişan al, zıpla, uyu, gerin) SVG kedi maskot; hareketsiz imleç veya dokunulan noktaya kuyruk sallayarak nişan alıp yay şeklinde zıplama; tıklamaları ve form kontrollerini engellemez (`pointer-events: none`); rAF ve `visibilitychange` ile sekme gizlenince durur; kenarda uyut/uyandır butonu (`localStorage` kalıcı); gece esneme/uyku modu; ad tüm dillerde "Tatlım" olarak korundu (`src/mascot/cat.js`, `src/mascot/cat-machine.js`, `test/cat-machine.test.js`).
- **Palet ve Renk Araçları (v2-4):** 40 hazır preset tema (pastel, şeker, orman, okyanus, vb.) hepsi WCAG AA uyumlu; her rol (bg, ink, primary, accent, muted) için renk seçici; renk kilidi destekli "Zar at" (uyumlu rastgele palet); kontrast uyarı banner'ı ve tek tıkla otomatik ton korumalı açıklık düzeltme ("Kontrastı Düzelt"); "Paletlerim" bölümü (isimle kaydet, sil, 50 palet sınırı, JSON dışa/içe aktarım doğrulama) (`src/themes/presets.js`, `src/color/palette-manager.js`, `test/themes.test.js`, `test/palette-save.test.js`).
- **Çeviri ve Uyumluluk:** Tüm yeni özellik metinleri TR/EN/RU/ES dil dosyalarına eksiksiz eklendi; koda gömülü Türkçe karakter sıfır; `npm test` 24/24 geçti, `npm run build` 0 hata.

## 2026-10-01 · düzeltme (Claude, döngü sonrası, Elif isteği)
- **Kasma ve tıklanamama:** Dil her değiştiğinde `initApp()` dinleyicileri yeniden ekliyordu. Sayıları ikiye katlanıyor ve her biri sayfayla önizlemeyi baştan üretiyordu. Artık dinleyiciler bir kez kuruluyor, dil değişince yalnız DOM çiziliyor (`main.js`).
- **Önizleme:** Her alan hem `input` hem `change` olayında siteyi iki kez üretiyordu. Artık yazı alanları 300 ms gecikmeyle, seçim kutuları anında ve tek olayla güncelleniyor (`form.js`).
- **Renk seçici:** Sürüklerken her adımda bütün sekme yeniden çiziliyordu. Artık bırakınca (`change`) çiziliyor (`tools.js`).
- **Çeviri:** Palet ve kontrast etiketleri, font kategorileri, kod parçası başlıkları ve önizlemeleri, aria etiketleri ve hata bildirimi dil dosyalarına taşındı (35 yeni anahtar × 4 dil).
- **Test:** `test/hardcoded-text.test.js`. Arayüz dosyalarında koda gömülü Türkçe metni ve dil dosyasında olmayan `t()` anahtarlarını yakalar.

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
