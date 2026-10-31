# SM Garage web sitesi

React ve Vite ile hazırlanmış statik bir Türkçe servis sitesi. İletişim ve randevu formları bilgileri tarayıcıda bir WhatsApp mesajına dönüştürür; site bir veritabanına veya uygulama sunucusuna form verisi göndermez.

## Yerel geliştirme

Node.js 24 kullanın:

```bash
npm ci
npm run dev
npm run build
npm run preview
```

İletişim bilgileri `src/config.js`, hizmet ve SSS içeriği `src/data.jsx`, yasal sayfalar `src/components/LegalPage.jsx` içindedir. Değişiklikler üretim derlemesine dahil edilir.

## Yayın öncesi

Yasal sayfalar taslaktır. İşletme bilgileri, veri işleme, iade koşulları ve logo hakları doğrulanıp hukuk danışmanı tarafından incelenmeden yayınlamayın. Ayrıntılar ve kaynaklar [LEGAL-READINESS.md](LEGAL-READINESS.md) dosyasındadır. Örnek yorumlar, doğrulanmamış performans verileri ve eksik galeri fotoğrafları gösterilmez.

Docker ve AWS üzerinde HTTPS ile yayınlama adımları için [DEPLOYMENT.md](DEPLOYMENT.md) dosyasına bakın.
