# Proje kuralları (Site Atölyesi)

ElifOS döngüsünde bu repoda çalışan asistanlar (Claude, Antigravity) için kurallar. Karar: ElifOS `decisions/ADR-008-web-dongusu-site-atolyesi.md`.

## Teknik çerçeve
- **Yığın:** Vite + düz JavaScript (ES modülleri) + CSS. Çerçeve (React vb.) gerekmedikçe eklenmez.
- **Yalnız statik site:** Sunucu, veritabanı ve API anahtarı yoktur. Bütün üretim tarayıcıda yapılır.
- **Ücretli servis yok:** Ücretli API, ücretli font ya da ücretli CDN kullanılmaz. Fontlar sisteme ya da Google Fonts'a dayanır. Zip için `jszip` npm paketi kullanılır.
- **Bağımlılık:** Az ve bilinen paketler kullanılır. Her yeni paket `CHANGELOG.md`'de gerekçesiyle yazılır.
- **Yayın:** `vite.config.js` içinde `base: '/site-atolyesi/'` olur. Yayını `.github/workflows/deploy.yml` (GitHub Pages, `actions/deploy-pages`) yapar. Tetikleyiciler: `push: main` ve `workflow_dispatch`.

## Dil desteği (i18n)
- Diller: `tr` (varsayılan), `en`, `ru`, `es`. Bütün arayüz metinleri `src/i18n/<dil>.json` dosyalarındadır, kodda sabit metin olmaz.
- Dört dosya aynı anahtarları taşır. Bunu `npm test` denetler; eksik anahtar varsa test kırılır.
- Site Üretici'nin ürettiği sitenin metinleri de seçilen dilde üretilir.
- Seçilen dil `localStorage`'da hatırlanır, `<html lang>` güncellenir.

## Kalite
- `npm run build` 0 hata vermelidir. `npm test` (Node'un yerleşik `node --test`'i ya da Vitest) geçmelidir.
- Testlerin kapsadığı yerler: i18n anahtar eşitliği, üretici çıktısının geçerli HTML iskeleti olması, palet üreticinin geçerli renk vermesi, zip içeriği.
- Erişilebilirlik: anlamlı başlık sırası, `label`'lı form alanları, klavyeyle kullanım, yeterli kontrast.
- Mobil uyum 360 px genişlikte bozulmaz.
- Testi geçirmek için beklenti silinmez ya da zayıflatılmaz.

## Git
- Yalnız `main` dalı vardır. Commit öneki `[antigravity]` ya da `[claude]` olur, örnek: `[antigravity] feat: palet üretici`.
- Her turun sonunda `git push origin main` yapılır; push yayını tetikler.
- Force push, rebase, geçmişi yeniden yazma ve yeni remote eklemek yasaktır.
- `node_modules/` ve `dist/` git'e girmez.
- Gizli bilgi (token, parola) asla commit'lenmez.

## Kayıt
- Her uygulama turunda `CHANGELOG.md`'ye kısa bir kayıt eklenir: tarih, tur, yapılanlar, bilinen eksikler.
