import { useEffect, useRef, useState } from 'react';
import { openWhatsApp } from '../config';
import { WhatsappIcon } from './Icons';

export const validateContact = v => {
  const err = {};
  if (!v.name.trim()) err.name = true;
  if (v.phone.replace(/\D/g, '').length < 10) err.phone = true;
  if (!v.kvkk) err.kvkk = true;
  return err;
};

// Form → doğrulama → WhatsApp'ta hazır mesaj
export function useWhatsAppForm(initial, validate, toMessage) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sentUrl, setSentUrl] = useState(null);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const bind = key => ({
    value: values[key],
    onChange: e => {
      const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setValues(s => ({ ...s, [key]: v }));
      if (errors[key]) setErrors(er => ({ ...er, [key]: false }));
    },
  });

  const submit = (e, after) => {
    e.preventDefault();
    const err = validate(values);
    setErrors({});
    if (Object.keys(err).length) { requestAnimationFrame(() => setErrors(err)); return; } // sallanma animasyonu her seferinde
    setSentUrl(openWhatsApp(toMessage(values)));
    timer.current = setTimeout(() => { setValues(initial); setSentUrl(null); after?.(); }, 6000);
  };

  return { values, setValues, errors, sentUrl, bind, submit };
}

export const WhatsAppSent = ({ url }) => (
  <div className="form-ok" aria-live="polite">
    <svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M14 27l8 8 16-16" /></svg>
    <b>WhatsApp açılıyor!</b>
    <span>Mesajınız hazır — WhatsApp'ta <strong>Gönder</strong>'e basmanız yeterli.</span>
    {url && <a className="form-ok__link" href={url} target="_blank" rel="noopener"><WhatsappIcon />Açılmadıysa buraya tıklayın</a>}
  </div>
);
