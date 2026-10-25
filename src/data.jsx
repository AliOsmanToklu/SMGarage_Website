// Sitedeki tüm içerik — metinleri buradan düzenleyebilirsiniz

export const NAV = [
  ['#top', 'Anasayfa'],
  ['#hakkimizda', 'Kurumsal'],
  ['#hizmetler', 'Hizmetlerimiz'],
  ['#hesaplama', 'Tuning Hesaplama'],
  ['#galeri', 'Galeri'],
  ['#iletisim', 'İletişim'],
];

export const MARQUEE = ['Chip Tuning', 'Motor Revizyon', 'ECU Remap', 'Şanzıman Onarımı', 'DPF · EGR · AdBlue', 'Turbo & Enjektör', 'Arıza Tespit', 'Fren & Süspansiyon'];

// Randevu formundaki hizmet listesi
export const SERVICE_OPTIONS = [
  { group: 'ECU Yazılım', items: ['Chip Tuning', 'ECU Remap / Custom Map', 'Şanzıman Yazılımı', 'DPF / EGR / AdBlue'] },
  { group: 'Mekanik Onarım', items: ['Bilgisayarlı Arıza Tespit', 'Motor Revizyon / Onarım', 'Turbo & Enjektör', 'Şanzıman & Debriyaj', 'Periyodik Bakım', 'Fren & Süspansiyon'] },
];

export const SERVICES = [
  {
    tag: 'ECU', title: 'Chip Tuning', option: 'Chip Tuning',
    desc: 'Motor haritalarının dyno ölçümüyle motorunuza özel optimize edilmesi; daha fazla güç, tork ve verim.',
    chips: ['Stage 1 / Stage 2', 'Dyno raporu'],
    icon: <><rect x="18" y="18" width="28" height="28" rx="4" /><path d="M24 18v-8M32 18v-8M40 18v-8M24 54v-8M32 54v-8M40 54v-8M18 24h-8M18 32h-8M18 40h-8M54 24h-8M54 32h-8M54 40h-8" /><path d="M27 36l5-8 5 8" /></>,
  },
  {
    tag: 'ECU', title: 'ECU Remap & Custom Map', option: 'ECU Remap / Custom Map',
    desc: 'OBD ve bench yöntemiyle okuma-yazma; launch control, pops & bangs, start-stop iptali gibi özel yazılımlar.',
    chips: ['OBD / Bench', 'Custom Map'],
    icon: <><path d="M8 46h48" /><path d="M12 46V30M22 46V20M32 46V26M42 46V14M52 46V22" /><circle cx="42" cy="10" r="3" /></>,
  },
  {
    tag: 'ECU + Mekanik', title: 'DPF · EGR · AdBlue', option: 'DPF / EGR / AdBlue',
    desc: 'Partikül filtresi, EGR ve AdBlue arızalarında yazılımsal çözüm, temizlik ve mekanik onarım.',
    chips: ['DPF temizleme', 'Arıza çözümü'],
    icon: <><rect x="10" y="22" width="44" height="20" rx="6" /><path d="M18 22v20M26 22v20M34 22v20M42 22v20" /><path d="M4 32h6M54 32h6" /></>,
  },
  {
    tag: 'Teşhis', title: 'Bilgisayarlı Arıza Tespit', option: 'Bilgisayarlı Arıza Tespit',
    desc: 'Güncel diagnostik cihazlarla hata kodu okuma, canlı veri analizi ve elektrik/elektronik arıza tespiti.',
    chips: ['Hata kodu', 'Canlı veri'],
    icon: <><rect x="8" y="12" width="48" height="32" rx="4" /><path d="M14 30h8l4-8 6 14 4-6h14" /><path d="M24 52h16M32 44v8" /></>,
  },
  {
    tag: 'Mekanik', title: 'Motor Revizyon & Onarım', option: 'Motor Revizyon / Onarım',
    desc: 'Silindir kapak, conta, triger/zincir seti, yağ kaçağı ve kompresyon sorunlarında komple motor onarımı.',
    chips: ['Motor revizyon', 'Triger seti'],
    icon: <><rect x="20" y="8" width="24" height="20" rx="3" /><path d="M20 16h24M20 22h24" /><path d="M32 28v12" /><circle cx="32" cy="46" r="8" /><circle cx="32" cy="46" r="2" /></>,
  },
  {
    tag: 'Mekanik', title: 'Turbo & Enjektör', option: 'Turbo & Enjektör',
    desc: 'Turbo revizyonu, enjektör test ve temizliği, yakıt sistemi arızalarında hassas onarım.',
    chips: ['Turbo revizyon', 'Enjektör test'],
    icon: <><circle cx="28" cy="34" r="16" /><path d="M28 34l8-6M28 34l-2 10M28 34l-10-4" /><path d="M44 30h12v10H44" /></>,
  },
  {
    tag: 'Yazılım + Mekanik', title: 'Şanzıman & Debriyaj', option: 'Şanzıman & Debriyaj',
    desc: 'DSG ve otomatik şanzıman yazılımı ve bakımı, debriyaj seti, volan ve şanzıman onarımı.',
    chips: ['DSG / ZF', 'Debriyaj seti'],
    icon: <><circle cx="32" cy="32" r="10" /><path d="M32 8v8M32 48v8M8 32h8M48 32h8M15 15l6 6M43 43l6 6M15 49l6-6M43 21l6-6" /></>,
  },
  {
    tag: 'Mekanik', title: 'Bakım · Fren · Süspansiyon', option: 'Periyodik Bakım',
    desc: 'Periyodik bakım, yağ ve filtre değişimi, fren sistemi, amortisör ve ön düzen işlemleri.',
    chips: ['Periyodik bakım', 'Fren & amortisör'],
    icon: <path d="M40 8a14 14 0 0 0-13 19L9 45a5 5 0 0 0 7 7l18-18A14 14 0 0 0 52 21l-8 8-8-2-2-8 8-8a14 14 0 0 0-2-3z" />,
  },
];

export const STATS = [
  { count: 30, prefix: '%', pct: 30, title: 'Güç Artışı', text: "Motor tipine göre %30'a varan güç artışı." },
  { count: 20, prefix: '%', pct: 20, title: 'Yakıt Tasarrufu', text: "Doğru kalibrasyonla %20'ye varan tasarruf." },
  { count: 8, pct: 80, title: 'Hizmet Alanı', text: 'ECU yazılımdan motor, şanzıman ve fren onarımına.' },
  { count: 6, suffix: ' Gün', pct: 86, title: 'Haftada Açık', text: 'Pazartesi – Cumartesi, 08:00 – 19:00.' },
];

export const STEPS = [
  ['Arıza Tespit & Ön Kontrol', "Bilgisayarlı tarama ve mekanik kontrol yapılır; yazılım işlerinde araç dyno'da ölçülür."],
  ['Şeffaf Teklif & Onay', 'Yapılacak işlem, parça ve maliyet işe başlamadan önce sizinle paylaşılır.'],
  ['Onarım & Yazılım', 'Mekanik onarım ustalarımızca yapılır; yazılımda orijinal dosya yedeklenip kalibrasyon yapılır.'],
  ['Test & Teslim', 'Yol testi ve son kontroller yapılır; aracınız yapılan işlemlerin raporuyla teslim edilir.'],
];

// Fotoğrafları public/img/ klasörüne bu adlarla koyun
export const GALLERY = [
  { img: 'img/galeri-1.jpg', label: 'Dyno Testi', title: 'VW Golf 7 GTI', en: true, tall: true },
  { img: 'img/galeri-2.jpg', label: 'ECU Bench', title: 'BMW F30 320d', en: true },
  { img: 'img/galeri-3.jpg', label: 'Motor Revizyon', title: 'Ford Transit', en: true },
  { img: 'img/galeri-4.jpg', label: 'Şanzıman Onarımı', title: 'Audi A3 DSG', en: true },
  { img: 'img/galeri-5.jpg', label: 'Mekanik', title: 'Turbo Revizyon' },
];

// ÖRNEK yorumlar — yayından önce gerçek müşteri yorumlarıyla değiştirin
export const TESTIMONIALS = [
  { text: 'Stage 1 sonrası araç bambaşka oldu. Dyno raporunu görünce içim rahatladı, yakıt tüketimi de düştü.', name: 'Murat K.', car: 'VW Passat 2.0 TDI' },
  { text: 'DPF arızası için birçok yere gittim, burada tek seferde çözüldü. İşini bilen, dürüst bir ekip.', name: 'Selin A.', car: 'Ford Focus 1.5 TDCi' },
  { text: 'Motor revizyonunu söz verdikleri günde teslim ettiler. Her aşamada bilgi verdiler, araç ilk günkü gibi çalışıyor.', name: 'Emre T.', car: 'Renault Megane 1.5 dCi' },
];

export const FAQ = [
  ['Chip tuning motora zarar verir mi?', 'Doğru yapılan, motorun mekanik sınırları içinde kalan bir kalibrasyon zarar vermez. Tüm yazılımlarımız fabrika güvenlik marjları korunarak hazırlanır.'],
  ['Orijinal yazılıma geri dönebilir miyim?', 'Evet. İşlem öncesi orijinal yazılım birebir yedeklenir; dilediğiniz zaman fabrika ayarlarına dönebilirsiniz.'],
  ['İşlem ne kadar sürer?', 'Standart bir Stage 1 işlemi ölçümler dahil ortalama 2–3 saat sürer. Mekanik işlemlerde süre arızaya göre değişir.'],
  ['Sadece mekanik onarım da yapıyor musunuz?', 'Evet. Periyodik bakımdan motor revizyonuna, şanzıman ve turbo onarımından fren ve süspansiyona kadar tüm mekanik işlemleri yapıyoruz.'],
  ['Chip tuning sonrası yakıt tüketimi artar mı?', 'Normal sürüşte, özellikle dizel araçlarda, verimlilik artışı sayesinde tüketim genellikle düşer.'],
];

// Tuning hesaplayıcı: [motor, hp, nm, stage1 hp, stage1 nm] — tahmini değerler
export const CARS = {
  'Audi': { 'A3 8V': [['1.6 TDI 110 HP', 110, 250, 140, 310], ['1.5 TFSI 150 HP', 150, 250, 180, 320]], 'A4 B9': [['2.0 TDI 150 HP', 150, 320, 190, 400]] },
  'BMW': { '3 Serisi F30': [['320d 184 HP', 184, 380, 225, 450], ['320i 184 HP', 184, 270, 230, 350]], '5 Serisi G30': [['520d 190 HP', 190, 400, 230, 470]] },
  'Fiat': { 'Egea': [['1.3 Multijet 95 HP', 95, 200, 120, 260], ['1.6 Multijet 120 HP', 120, 320, 150, 380]], 'Doblo': [['1.6 Multijet 105 HP', 105, 290, 135, 350]] },
  'Ford': { 'Focus 3': [['1.5 TDCi 120 HP', 120, 270, 150, 330], ['1.0 EcoBoost 125 HP', 125, 170, 150, 230]], 'Transit Custom': [['2.0 EcoBlue 130 HP', 130, 385, 165, 440]] },
  'Hyundai': { 'i20': [['1.4 CRDi 90 HP', 90, 240, 110, 280]], 'Tucson': [['1.6 CRDi 136 HP', 136, 320, 165, 380]] },
  'Mercedes-Benz': { 'C Serisi W205': [['C200d 160 HP', 160, 360, 195, 430], ['C220d 170 HP', 170, 400, 210, 470]] },
  'Renault': { 'Clio 4': [['1.5 dCi 90 HP', 90, 220, 115, 270]], 'Megane 4': [['1.5 dCi 110 HP', 110, 260, 135, 310], ['1.3 TCe 140 HP', 140, 240, 165, 290]] },
  'Toyota': { 'Hilux': [['2.4 D-4D 150 HP', 150, 400, 180, 460]] },
  'Volkswagen': { 'Golf 7': [['1.6 TDI 115 HP', 115, 250, 140, 310], ['2.0 TDI 150 HP', 150, 340, 190, 410], ['1.4 TSI 125 HP', 125, 200, 155, 260]], 'Passat B8': [['1.6 TDI 120 HP', 120, 250, 145, 310], ['2.0 TDI 150 HP', 150, 340, 190, 410], ['2.0 TDI 190 HP', 190, 400, 230, 470]] },
};
