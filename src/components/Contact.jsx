import { Fragment } from 'react';
import { CONTACT, buildMessage } from '../config';
import { Check, Eyebrow, FloatField, Lines } from './ui';
import { ClockIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, WhatsappIcon } from './Icons';
import { useWhatsAppForm, validateContact, WhatsAppSent } from './forms';

const EMPTY = { name: '', vehicle: '', message: '', kvkk: false };
const toMessage = v => buildMessage('bilgi almak istiyorum.', [
  ['Ad Soyad', v.name],
  ['Araç', v.vehicle],
  ['Mesaj', v.message],
]);

const Info = ({ icon, label, children }) => (
  <div className="cinfo" data-reveal="">
    <div className="cinfo__ic">{icon}</div>
    <div><span>{label}</span><b>{children}</b></div>
  </div>
);

export default function Contact() {
  const { values, errors, sentUrl, bind, submit } = useWhatsAppForm(EMPTY, validateContact, toMessage);
  return (
    <section className="contact section" id="iletisim">
      <div className="container contact__inner">
        <div className="contact__info">
          <Eyebrow>İletişim</Eyebrow>
          <Lines lines={['Bize', <em key="e">ulaşın.</em>]} />
          <Info icon={<PinIcon />} label="Adres">
            <a href={CONTACT.mapsUrl} target="_blank" rel="noopener">{CONTACT.address.map((l, i) => <Fragment key={l}>{i > 0 && <br />}{l}</Fragment>)}</a>
          </Info>
          <Info icon={<PhoneIcon />} label={`Telefon · ${CONTACT.person}`}><a href={`tel:${CONTACT.tel}`}>{CONTACT.phone}</a></Info>
          <Info icon={<InstagramIcon />} label="Instagram"><a href={CONTACT.instagramUrl} target="_blank" rel="noopener">@{CONTACT.instagram}</a></Info>
          <Info icon={<MailIcon />} label="E-posta"><a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></Info>
          <Info icon={<ClockIcon />} label="Çalışma Saatleri">{CONTACT.hours}</Info>
        </div>
        <form className={`contact__form${sentUrl ? ' is-sent' : ''}`} data-reveal="" noValidate onSubmit={submit}>
          <FloatField label="Ad Soyad (isteğe bağlı)" autoComplete="name" {...bind('name')} />
          <FloatField label="Araç Marka / Model / Yıl" {...bind('vehicle')} />
          <FloatField label="Mesajınız" textarea rows={4} {...bind('message')} />
          <p className="form-notice">Bilgileriniz WhatsApp'ta bir mesaj olarak hazırlanır; göndermeyi orada siz seçersiniz. WhatsApp kendi koşullarına göre veri işleyebilir. <a href="#/gizlilik" target="_blank" rel="noopener">Gizlilik ve KVKK aydınlatma metni</a></p>
          <Check checked={values.kvkk} onChange={bind('kvkk').onChange} error={errors.kvkk}>Yazdığım bilgilerin WhatsApp'a aktarılacağını anladım ve devam etmek istiyorum.</Check>
          <button className="btn btn--primary btn--lg btn--wa magnetic" type="submit" data-cursor="hover"><span>WhatsApp ile Gönder</span><WhatsappIcon /></button>
          <WhatsAppSent url={sentUrl} />
        </form>
      </div>
    </section>
  );
}
