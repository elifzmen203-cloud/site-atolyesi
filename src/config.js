/**
 * Site ayarları (gelir). Buraya yalnız HERKESE AÇIK kimlikler yazılır; bunlar gizli bilgi değildir,
 * her sitenin kaynak kodunda görünür. Parola, API anahtarı ya da token buraya yazılmaz.
 *
 * Boş bırakılan özellik sitede hiç görünmez ve hiçbir dış kod yüklemez.
 */
export const SITE_CONFIG = {
  // Google AdSense yayıncı kimliği, ör. 'ca-pub-1234567890123456'.
  // Doluysa AdSense betiği yüklenir. Çerez onay penceresi AdSense panelindeki
  // "Gizlilik ve mesajlaşma" bölümünden açılır (Google'ın onaylı ücretsiz CMP'si).
  adsenseClient: 'ca-pub-7539312948961348',

  // AdSense'te oluşturulan reklam birimi kimlikleri (isteğe bağlı). Boşsa o alan çıkmaz.
  // top: sayfanın en üstü, bottom: sayfanın en altı. İkisi de araçların ve butonların dışındadır.
  adSlots: { top: '', bottom: '' },

  // "Bana kahve ısmarla" sayfasının adresi (Buy Me a Coffee, Patreon vb.). Boşken buton görünmez.
  donateUrl: 'https://buymeacoffee.com/elifzmen20t',
  donateUsd: 1,

  // İletişim sayfası (#/iletisim). Boş bırakılan kanal görünmez.
  // contactEmail sitede herkese açık görünür; buraya yalnız bu iş için açılmış bir adres yazılır.
  contactEmail: 'kotosucuk@gmail.com',
  issuesUrl: 'https://github.com/elifzmen203-cloud/site-atolyesi/issues'
};
