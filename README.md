# Site Atölyesi

Tarayıcıda çalışan, ücretsiz bir web sitesi tasarım ve yapım atölyesi. Arayüz Türkçe, İngilizce, Rusça ve İspanyolca.

- **Site Üretici:** Ziyaretçi işletme bilgilerini (ad, sektör, slogan, iletişim), renk ve stil tercihini girer. Site ona hazır bir web sitesi üretir: tasarım, metinler ve HTML/CSS. Sonuç canlı önizlenir ve `.zip` olarak indirilir.
- **Tasarım Araç Kutusu:** Renk paleti üretici, font eşleştirme, bölüm/metin şablonları ve kopyalanabilir kod parçaları.

Yapay zekâ API'si ve sunucu yoktur. Bütün üretim tarayıcıda kural ve şablonla yapılır. Ücretli servis kullanılmaz.

## Yayın (tek tık)

- `main` dalına her push, GitHub Actions ile siteyi GitHub Pages'e yayınlar.
- Elle yayın için `yayinla.cmd` dosyasına çift tıkla (derler, test eder, push eder) ya da GitHub'da **Actions → Deploy → Run workflow** butonunu kullan.
- Adres: https://elifzmen203-cloud.github.io/site-atolyesi/

## Geliştirme

```bash
npm install
npm run dev
npm run build
npm test
```

Geliştirme kuralları: [PROJE_KURALLARI.md](PROJE_KURALLARI.md). Bu proje ElifOS döngü modunda (web tipi) geliştirilir; görevler, kararlar ve defter ElifOS vault'undadır.
