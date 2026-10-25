// İşletme bilgileri — sitenin her yerinde buradan okunur
export const CONTACT = {
  phone: '0542 573 14 80',
  tel: '+905425731480',
  person: 'Serger Sönmez',
  whatsapp: '905425731480',
  email: 'info@smgarage.com.tr',
  instagram: 'smgaragemaslak',
  instagramUrl: 'https://www.instagram.com/smgaragemaslak/',
  youtubeUrl: '#',
  address: ['Maslak Atatürk Oto Sanayi Sitesi 2. Kısım', '10. Sokak, Parçacılar İş Merkezi No: 8', 'Sarıyer / İstanbul'],
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('Maslak Atatürk Oto Sanayi Sitesi 2.Kısım 10.Sokak Parçacılar İş Merkezi No:8 Sarıyer İstanbul'),
  hours: 'Pzt – Cmt · 08:00 – 19:00',
};

export const whatsappUrl = text =>
  `https://wa.me/${CONTACT.whatsapp}` + (text ? `?text=${encodeURIComponent(text)}` : '');

// Form alanlarından okunaklı bir WhatsApp mesajı oluşturur (boş alanlar atlanır)
export function buildMessage(intro, fields) {
  const lines = [`Merhaba SM Garage, ${intro}`, ''];
  fields.forEach(([label, value]) => {
    if (value && String(value).trim()) lines.push(`*${label}:* ${String(value).trim()}`);
  });
  return lines.join('\n');
}

// Yeni sekmede WhatsApp açar; tarayıcı engellerse aynı sekmede yönlendirir
export function openWhatsApp(text) {
  const url = whatsappUrl(text);
  const win = window.open(url, '_blank');
  if (win) win.opener = null;
  else window.location.href = url;
  return url;
}
