import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { buildMessage } from '../config';
import { SERVICE_OPTIONS } from '../data';
import { scroll } from '../lib/scroll';
import { Check, FloatField, Logo } from './ui';
import { WhatsappIcon } from './Icons';
import { useWhatsAppForm, validateContact, WhatsAppSent } from './forms';

const EMPTY = { name: '', phone: '', vehicle: '', year: '', service: SERVICE_OPTIONS[0].items[0], date: '', message: '', kvkk: false };
const today = () => new Date().toISOString().slice(0, 10);

const toMessage = v => buildMessage('randevu almak istiyorum.', [
  ['Ad Soyad', v.name],
  ['Telefon', v.phone],
  ['Araç', v.vehicle],
  ['Model Yılı', v.year],
  ['Hizmet', v.service],
  ['Tercih Edilen Tarih', v.date && v.date.split('-').reverse().join('.')],
  ['Not', v.message],
]);

export default function AppointmentModal({ open, preset, onClose }) {
  const rootRef = useRef(null);
  const mounted = useRef(false);
  const { values, setValues, errors, sentUrl, bind, submit } = useWhatsAppForm(EMPTY, validateContact, toMessage);

  // Hizmet kartından / hesaplayıcıdan gelen ön seçimler
  useEffect(() => {
    if (open && preset) setValues(v => ({ ...v, ...(preset.service && { service: preset.service }), ...(preset.vehicle && { vehicle: preset.vehicle }) }));
  }, [open, preset, setValues]);

  // useEffect (layout değil): mobil menünün scroll.start()'ından sonra çalışsın
  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    const root = rootRef.current;
    const q = s => root.querySelectorAll(s);
    if (open) {
      scroll.stop();
      root.setAttribute('aria-hidden', 'false');
      gsap.timeline({ defaults: { ease: 'expo.out' } })
        .set(root, { visibility: 'visible' })
        .to(q('.modal__bg'), { opacity: 1, duration: .5, ease: 'power2.out' })
        .fromTo(q('.modal__box'), { clipPath: 'circle(0% at 50% 50%)', scale: .9 }, { clipPath: 'circle(150% at 50% 50%)', scale: 1, duration: 1.2, ease: 'expo.inOut' }, 0)
        .from([...q('.modal__head > *'), ...q('.modal__form > *:not(.form-ok)')], { y: 40, opacity: 0, duration: 1, stagger: .06 }, .5);
      const onKey = e => e.key === 'Escape' && onClose();
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    gsap.timeline({ onComplete: () => { gsap.set(root, { visibility: 'hidden' }); root.setAttribute('aria-hidden', 'true'); } })
      .to(q('.modal__box'), { clipPath: 'circle(0% at 50% 50%)', scale: .9, duration: .8, ease: 'expo.inOut' })
      .to(q('.modal__bg'), { opacity: 0, duration: .4 }, .4);
    scroll.start();
  }, [open, onClose]);

  return (
    <div className="modal" ref={rootRef} aria-hidden="true" role="dialog" aria-modal="true" aria-label="Randevu formu">
      <div className="modal__bg" onClick={onClose} />
      <div className="modal__box" data-lenis-prevent="">
        <button className="modal__close" aria-label="Kapat" data-cursor="hover" onClick={onClose}><span /><span /></button>
        <div className="modal__head">
          <Logo className="modal__logo" alt="SM Garage" />
          <div className="eyebrow"><span className="line" />WhatsApp ile Randevu</div>
          <h3>Randevunuzu <em>oluşturun</em></h3>
        </div>
        <form className={`modal__form${sentUrl ? ' is-sent' : ''}`} noValidate onSubmit={e => submit(e, onClose)}>
          <div className="row2">
            <FloatField label="Ad Soyad" autoComplete="name" error={errors.name} {...bind('name')} />
            <FloatField label="Telefon" type="tel" autoComplete="tel" error={errors.phone} {...bind('phone')} />
          </div>
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
          <Check checked={values.kvkk} onChange={bind('kvkk').onChange} error={errors.kvkk}>KVKK aydınlatma metnini okudum, kabul ediyorum.</Check>
          <button className="btn btn--primary btn--lg btn--wa" type="submit"><span>WhatsApp ile Randevu Al</span><WhatsappIcon /></button>
          <WhatsAppSent url={sentUrl} />
        </form>
      </div>
    </div>
  );
}
