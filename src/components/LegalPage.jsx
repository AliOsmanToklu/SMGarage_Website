import { useEffect } from 'react';
import { CONTACT } from '../config';
import { RecoveryPage } from './Feedback';

const pages = {
  gizlilik: {
    title: 'Gizlilik ve KVKK aydınlatma metni',
    body: <>
      <h2>İletişim ve randevu talepleri</h2>
      <p>Formlara yazdığınız bilgiler tarayıcınızda bir WhatsApp mesajı olarak hazırlanır. WhatsApp açıldıktan sonra mesajı göndermeyi siz seçersiniz. Bu site form verilerini kendi sunucusuna kaydetmez. Mesajınıza yalnızca talebinizi yanıtlamak için gerekli bilgileri yazın; sağlık veya başka hassas bilgileri göndermeyin.</p>
      <p>WhatsApp üzerinden gönderdiğiniz bilgiler WhatsApp ve hizmet sağlayıcıları tarafından kendi koşulları kapsamında işlenebilir ve yurt dışına aktarılabilir. WhatsApp kullanmak istemiyorsanız <a href={`tel:${CONTACT.tel}`}>telefon</a> veya <a href={`mailto:${CONTACT.email}`}>e-posta</a> ile ulaşabilirsiniz.</p>
      <h2>Site kullanımı</h2>
      <p>Siteyi sunan altyapı, bağlantı ve güvenlik amacıyla IP adresi gibi teknik kayıtlar oluşturabilir. Saklama süresi, alıcılar ve hukuki sebepler işletme ve barındırma yapılandırması doğrulandıktan sonra bu metne eklenmelidir.</p>
      <h2>Başvuru ve haklarınız</h2>
      <p>Kişisel verilerinize ilişkin taleplerinizi <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> adresine veya aşağıdaki iletişim adresine iletebilirsiniz. 6698 sayılı Kanun'un 11. maddesindeki haklarınız saklıdır.</p>
      <p>{CONTACT.address.join(', ')} · <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></p>
      <p className="legal__notice">Yayından önce işletmenin tam yasal unvanı, veri sorumlusu bilgisi, işleme amaçları ve hukuki sebepleri, alıcılar, aktarım dayanakları, saklama süreleri ve başvuru yöntemi doğrulanarak bu metin tamamlanmalıdır.</p>
    </>,
  },
  kosullar: {
    title: 'Kullanım koşulları',
    body: <>
      <p>Bu site, SM Garage hizmetleri hakkında genel bilgi ve iletişim imkânı sunar. Sitedeki bilgiler bireysel teknik değerlendirme veya bağlayıcı fiyat teklifi yerine geçmez.</p>
      <p>Randevu talebinin gönderilmesi, randevunun veya hizmetin onaylandığı anlamına gelmez. İşlem kapsamını, fiyatı ve teslim süresini işe başlamadan önce işletmeyle görüşün.</p>
      <p>Araç yazılımı veya parçalarında yapılan değişiklikler garanti, sigorta, muayene ve trafik mevzuatı bakımından sonuç doğurabilir. Aracınıza uygunluğu ve uygulanabilir şartları işlem öncesinde görüşün.</p>
      <p>Üçüncü taraf bağlantıları kendi hizmet sağlayıcılarının koşullarına tabidir. Kanundan doğan tüketici haklarınız saklıdır.</p>
      <p className="legal__notice">Yayından önce işletmenin yasal unvanı ve kayıt bilgileri ile gerçek hizmet ve sözleşme koşulları doğrulanmalıdır.</p>
    </>,
  },
  cerezler: {
    title: 'Çerez politikası',
    body: <>
      <p>Bu uygulamanın mevcut kodunda analiz, reklam veya tercih çerezi, izleme betiği ya da üçüncü taraf içerik gömmesi bulunmuyor. Bu nedenle uygulama şu anda isteğe bağlı çerezler için bir tercih afişi göstermiyor. Sunucu ve CDN yapılandırması ayrıca doğrulanmalıdır.</p>
      <p>WhatsApp, Instagram ve harita bağlantılarını açarsanız ilgili sağlayıcı kendi çerezlerini ve politikalarını kullanabilir. Bu bağlantılar tıklanmadan üçüncü taraf içerik yüklemez.</p>
      <p>Analiz, reklam veya diğer zorunlu olmayan çerezler eklenmeden önce bunların amacı ve süresi açıklanmalı, gerekli hallerde önceden seçim yapılabilen ve geri alınabilen bir rıza mekanizması kurulmalıdır.</p>
      <p>Sorularınız için <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> adresine yazabilirsiniz.</p>
    </>,
  },
  iade: {
    title: 'İptal ve iade',
    body: <>
      <p>Bu sitede ödeme alınmaz; WhatsApp üzerinden gönderilen talep tek başına satın alma veya kesin randevu oluşturmaz. Bir talebi veya randevuyu değiştirmek ya da iptal etmek için <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a> numarasından veya <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> adresinden bize ulaşın.</p>
      <p>Hizmet, parça, ön ödeme ve varsa iptal veya iade koşulları işlem öncesinde yazılı teklifinizde belirtilmelidir. Uygulanabilir mevzuattan doğan cayma, ayıplı hizmet ve diğer tüketici haklarınız saklıdır.</p>
      <p className="legal__notice">Yayından önce işletme, kendi iptal ve iade uygulamasını ve varsa ücretlerini doğrulayıp açıkça bu sayfaya eklemelidir.</p>
    </>,
  },
};

export default function LegalPage({ page }) {
  const content = pages[page];
  useEffect(() => {
    window.scrollTo(0, 0);
    document.getElementById('top')?.focus({ preventScroll: true });
  }, [page]);
  if (!content) return <RecoveryPage />;
  return <main id="top" className="legal-page" tabIndex={-1}><div className="container legal__inner">
    <a className="legal__back" href="/#top">← Ana sayfaya dön</a>
    <h1>{content.title}</h1>{content.body}
  </div></main>;
}
