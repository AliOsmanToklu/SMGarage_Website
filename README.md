# SM Garage — Web Sitesi

React + Vite ile hazırlanmış, GSAP/Lenis animasyonlu tek sayfa site.

## Komutlar

```bash
npm install      # ilk kurulumda bir kez
npm run dev      # geliştirme sunucusu → http://localhost:5173
npm run build    # yayın için derler → dist/ klasörü
npm run preview  # derlenmiş siteyi yerelde önizler
```

Yayına almak için `npm run build` sonrası oluşan **`dist/`** klasörünün içeriğini hostinge yükleyin.

## Nereden ne düzenlenir?

| Ne | Dosya |
|---|---|
| Telefon, WhatsApp, adres, Instagram, saatler | `src/config.js` |
| Hizmetler, SSS, yorumlar, galeri, rakamlar, hesaplayıcı araçları | `src/data.jsx` |
| Tecrübe yılı rozeti | `src/components/Sections.jsx` → `EXPERIENCE_YEARS` |
| Logo ve fotoğraflar | `public/img/` (`logo.png`, `galeri-1.jpg` … `galeri-5.jpg`) |
| Stiller | `src/styles.css` |
| Kaydırma / açılış animasyonları | `src/lib/animations.js` |

## Randevu → WhatsApp

Randevu penceresi ve iletişim formu, doldurulan bilgileri hazır bir mesaj olarak
`config.js` içindeki WhatsApp numarasına yönlendirir. Hizmet kartlarındaki ve
tuning hesaplayıcıdaki "Randevu Al" butonları seçilen hizmeti/aracı forma otomatik doldurur.

> `_eski/` klasörü React öncesi sürümdür; ihtiyaç kalmadıysa silinebilir.
