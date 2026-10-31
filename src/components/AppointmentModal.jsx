import { useEffect, useRef } from 'react';
import { buildMessage } from '../config';
import { SERVICE_OPTIONS } from '../data';
import { useDialogFocus } from '../lib/dialog';
import { Check, FloatField, Logo } from './ui';
import { WhatsappIcon } from './Icons';
import { useWhatsAppForm, validateContact, WhatsAppSent } from './forms';

const EMPTY = { name: '', vehicle: '', year: '', service: SERVICE_OPTIONS[0].items[0], date: '', message: '', kvkk: false };
const today = () => new Date().toISOString().slice(0, 10);

const toMessage = v => buildMessage('randevu almak istiyorum.', [
  ['Ad Soyad', v.name],
  ['Araç', v.vehicle],
  ['Model Yılı', v.year],
  ['Hizmet', v.service],
  ['Tercih Edilen Tarih', v.date && v.date.split('-').reverse().join('.')],
  ['Not', v.message],
]);

export default function AppointmentModal({ open, preset, onClose }) {
  const rootRef = useRef(null);
  const { values, setValues, errors, sentUrl, bind, submit } = useWhatsAppForm(EMPTY, validateContact, toMessage);

  // Hizmet kartından / hesaplayıcıdan gelen ön seçimler
  useEffect(() => {
    if (open && preset) setValues(v => ({ ...v, ...(preset.service && { service: preset.service }), ...(preset.vehicle && { vehicle: preset.vehicle }) }));
  }, [open, preset, setValues]);

  useDialogFocus(open, rootRef, onClose);

  if (!open) return null;

  return (
    <div className="modal is-open" ref={rootRef} role="dialog" aria-modal="true" aria-label="Randevu formu">
      <div className="modal__bg" onClick={onClose} />
      <div className="modal__box" data-lenis-prevent="">
        <button className="modal__close" aria-label="Kapat" data-cursor="hover" onClick={onClose}><span /><span /></button>
        <div className="modal__head">
          <Logo className="modal__logo" alt="SM Garage" />
          <div className="eyebrow"><span className="line" />WhatsApp ile Randevu</div>
          <h3>Randevunuzu <em>oluşturun</em></h3>
        </div>
        <form className={`modal__form${sentUrl ? ' is-sent' : ''}`} noValidate onSubmit={submit}>
          <FloatField label="Ad Soyad (isteğe bağlı)" autoComplete="name" {...bind('name')} />
          <div className="row2">
            <FloatField label="Araç Marka / Model" {...bind('vehicle')} />
            <FloatField label="Model Yılı" inputMode="numeric" {...bind('year')} />
          </div>
          <div className="row2">
            <label className="field"><span>Hizmet</span>
              <select {...bind('service')}>
                {SERVICE_OPTIONS.map(g => (
                  <optgroup label={g.group} key={g.group}>{g.items.map(o => <option key={o}>{o}</option>)}</optgroup>
                ))}
              </select>
            </label>
            <label className="field"><span>Tercih Edilen Tarih</span><input type="date" min={today()} {...bind('date')} /></label>
          </div>
          <FloatField label="Mesajınız" textarea rows={3} {...bind('message')} />
          <p className="form-notice">Bilgileriniz WhatsApp'ta bir mesaj olarak hazırlanır; göndermeyi orada siz seçersiniz. WhatsApp kendi koşullarına göre veri işleyebilir. <a href="#/gizlilik" target="_blank" rel="noopener">Gizlilik ve KVKK aydınlatma metni</a></p>
          <Check checked={values.kvkk} onChange={bind('kvkk').onChange} error={errors.kvkk}>Yazdığım bilgilerin WhatsApp'a aktarılacağını anladım ve devam etmek istiyorum.</Check>
          <button className="btn btn--primary btn--lg btn--wa" type="submit"><span>WhatsApp ile Randevu Al</span><WhatsappIcon /></button>
          <WhatsAppSent url={sentUrl} />
        </form>
      </div>
    </div>
  );
}
