// Sitedeki tüm içerik — metinleri buradan düzenleyebilirsiniz

export const NAV = [
  ['#top', 'Anasayfa'],
  ['#hakkimizda', 'Kurumsal'],
  ['#hizmetler', 'Hizmetlerimiz'],
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
    desc: 'Araç ve motor durumuna göre motor haritalarının değerlendirilmesi ve kalibrasyonu.',
    chips: ['Stage 1 / Stage 2', 'Dyno raporu'],
    icon: <><rect x="18" y="18" width="28" height="28" rx="4" /><path d="M24 18v-8M32 18v-8M40 18v-8M24 54v-8M32 54v-8M40 54v-8M18 24h-8M18 32h-8M18 40h-8M54 24h-8M54 32h-8M54 40h-8" /><path d="M27 36l5-8 5 8" /></>,
  },
  {
    tag: 'ECU', title: 'ECU Remap & Custom Map', option: 'ECU Remap / Custom Map',
    desc: 'OBD ve bench yöntemleriyle ECU okuma, yazma ve araç ihtiyaçlarına göre kalibrasyon.',
    chips: ['OBD / Bench', 'Custom Map'],
    icon: <><path d="M8 46h48" /><path d="M12 46V30M22 46V20M32 46V26M42 46V14M52 46V22" /><circle cx="42" cy="10" r="3" /></>,
  },
  {
    tag: 'ECU + Mekanik', title: 'DPF · EGR · AdBlue', option: 'DPF / EGR / AdBlue',
    desc: 'Partikül filtresi, EGR ve AdBlue sistemlerinde arıza tespiti, temizlik ve onarım.',
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

export const STATS = [];

export const STEPS = [
  ['Arıza Tespit & Ön Kontrol', 'Talebiniz ve aracınızın durumu değerlendirilir; gerekli kontroller belirlenir.'],
  ['Teklif & Onay', 'İşe başlamadan önce işlem kapsamını, parçaları ve maliyeti görüşün.'],
  ['Onarım & Yazılım', 'Onaylanan işlemler araç ve hizmetin ihtiyaçlarına göre yürütülür.'],
  ['Kontrol & Teslim', 'İşlemler ve teslim koşulları hakkında bilgi alabilirsiniz.'],
];

// Fotoğraflar yalnızca kullanım hakları doğrulandıktan sonra eklenmelidir.
export const GALLERY = [];

// Yorumlar yalnızca gerçekliği ve yayın izni doğrulandıktan sonra eklenmelidir.
export const TESTIMONIALS = [];

export const FAQ = [
  ['Chip tuning motora zarar verir mi?', 'Yazılım değişiklikleri aracın mekanik durumuna, garanti koşullarına ve kullanımına göre riskler taşıyabilir. İşlem öncesinde aracınızı ve seçenekleri değerlendirmek için bizimle görüşün.'],
  ['Orijinal yazılıma geri dönebilir miyim?', 'Geri dönüş imkânı araç ve işlem türüne bağlıdır. İşlem öncesinde yedekleme ve geri dönüş koşullarını sorun.'],
  ['İşlem ne kadar sürer?', 'Süre, aracın durumuna ve yapılacak işlemlere göre değişir. Randevu öncesinde bizimle görüşebilirsiniz.'],
  ['Sadece mekanik onarım da yapıyor musunuz?', 'Evet. Periyodik bakımdan motor revizyonuna, şanzıman ve turbo onarımından fren ve süspansiyona kadar tüm mekanik işlemleri yapıyoruz.'],
  ['Chip tuning yakıt tüketimini nasıl etkiler?', 'Tüketim araç, kalibrasyon ve sürüş koşullarına bağlıdır; belirli bir tasarruf garanti edilemez.'],
];

// Hesaplayıcıya yalnızca doğrulanmış veriler eklenmelidir.
export const CARS = {};
