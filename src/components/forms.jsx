import { useState } from 'react';
import { openWhatsApp } from '../config';
import { WhatsappIcon } from './Icons';
import { useToast } from './Feedback';

export const localDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

export const validateContact = v => {
  const err = {};
  if (!v.kvkk) err.kvkk = true;
  if (v.year && (!/^\d{4}$/.test(v.year) || Number(v.year) < 1886 || Number(v.year) > new Date().getFullYear() + 1)) err.year = 'Geçerli bir model yılı girin (ör. 2020).';
  if (v.date && v.date < localDate()) err.date = 'Bugün veya daha sonraki bir tarih seçin.';
  return err;
};

// Form → doğrulama → WhatsApp'ta hazır mesaj
export function useWhatsAppForm(initial, validate, toMessage) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sentUrl, setSentUrl] = useState(null);
  const toast = useToast();

  const bind = key => ({
    value: values[key],
    onChange: e => {
      const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      const next = { ...values, [key]: v };
      setValues(next);
      setSentUrl(null);
      if (errors[key]) setErrors(er => ({ ...er, [key]: validate(next)[key] || false }));
    },
    onBlur: () => {
      if (key === 'year' || key === 'date') setErrors(er => ({ ...er, [key]: validate(values)[key] || false }));
    },
  });

  const submit = e => {
    e.preventDefault();
    const form = e.currentTarget;
    const err = validate(values);
    setErrors({});
    if (Object.keys(err).length) {
      setErrors(err);
      requestAnimationFrame(() => form.querySelector('[aria-invalid="true"]')?.focus());
      return;
    }
    setSentUrl(openWhatsApp(toMessage(values)));
    toast('WhatsApp bağlantısı hazır. Mesajı orada gönderebilirsiniz.');
  };

  return { values, setValues, errors, sentUrl, bind, submit };
}

export const WhatsAppSent = ({ url }) => (
  <div className="form-ok">
    {url && <><b>WhatsApp bağlantısı hazır.</b>
    <span>Mesajı göndermek için WhatsApp'ta <strong>Gönder</strong>'e basın.</span>
    <a className="form-ok__link" href={url} target="_blank" rel="noopener"><WhatsappIcon />WhatsApp açılmadıysa tekrar deneyin</a></>}
  </div>
);
