# SM Garage Maslak

SM Garage'ın ECU yazılımı ve mekanik servis hizmetlerini tanıtan Türkçe web sitesi. Ziyaretçiler hizmetleri inceleyebilir, sıkça sorulan sorulara göz atabilir ve WhatsApp üzerinden randevu veya bilgi talebi hazırlayabilir.

## Özellikler

- Mobil uyumlu hizmet sayfaları ve klavye ile kullanılabilen menü, formlar ve randevu penceresi.
- İptal ve iade, çerez, gizlilik ve kullanım koşulları için taslak sayfalar.
- WhatsApp'a yönlendirme öncesinde veri aktarımı hakkında bilgilendirme.
- Docker ile statik yayın, sağlık kontrolü ve özel 404 sayfası.
- GitHub Actions ile üretim derlemesi, bağımlılık denetimi ve konteyner kontrolleri.

Formlar sunucuya gönderilmez: bilgiler tarayıcıda bir WhatsApp mesajına dönüştürülür ve kullanıcı mesajı WhatsApp'ta ayrıca gönderir. Projede uygulama sunucusu, veritabanı veya çevrimiçi ödeme altyapısı bulunmaz.

## Teknolojiler

React, Vite ve CSS ile geliştirilmiştir. Üretim derlemesi, çok aşamalı Docker imajında ayrıcalıksız Nginx kullanılarak sunulur.

## Yerel geliştirme

Gereksinim: Node.js 24 ve npm.

```bash
npm ci
npm run dev
```

Geliştirme sunucusunun adresi terminalde gösterilir. Üretim derlemesini oluşturmak ve önizlemek için:

```bash
npm run build
npm run preview
```

## Docker ile çalıştırma

Docker Engine ve Docker Compose eklentisi kurulu olmalıdır:

```bash
cp .env.example .env
docker compose up -d --build
docker compose ps
curl http://localhost:8080/healthz
```

Site varsayılan olarak `http://localhost:8080` adresinde sunulur; host portu `.env` içindeki `WEB_PORT` ile değiştirilebilir. Durdurmak için `docker compose down` kullanın. Uygulama durum tutmadığından veri hacmi gerektirmez.

AWS EC2, Application Load Balancer ve HTTPS yapılandırması için [dağıtım rehberine](DEPLOYMENT.md) bakın. Üretimde doğrudan açık HTTP portu yerine rehberdeki ağ ve TLS yapılandırmasını kullanın.

## Proje yapısı

| Yol | İçerik |
| --- | --- |
| `src/components/` | Sayfa bölümleri, formlar ve arayüz bileşenleri |
| `src/data.jsx` | Hizmet ve SSS metinleri |
| `src/config.js` | İletişim bilgileri ve WhatsApp bağlantıları |
| `src/components/LegalPage.jsx` | Taslak yasal sayfalar |
| `public/` | Logo ve statik 404 sayfası |
| `nginx/` | Üretim sunucusu yapılandırması |
| `.github/` | CI iş akışı ve Dependabot yapılandırması |

İletişim ve içerik değişiklikleri üretim derlemesine dahil edilir; değişikliklerden sonra imajı yeniden oluşturun.

## Yayın öncesi

Yasal sayfalar taslaktır. İşletme unvanı ve iletişim bilgileri, kişisel veri işleme ve aktarım koşulları, iptal ve iade uygulamaları ile logo kullanım hakları doğrulanmalı; metinler yetkin bir hukuk danışmanı tarafından incelenmelidir. Kalan maddeler ve kaynaklar [LEGAL-READINESS.md](LEGAL-READINESS.md) dosyasındadır. Erişilebilirlik için kapsamlı kullanıcı ve yardımcı teknoloji testleri de yapılmalıdır.
