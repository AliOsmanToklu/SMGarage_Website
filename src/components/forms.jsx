import { useState } from 'react';
import { openWhatsApp } from '../config';
import { WhatsappIcon } from './Icons';

export const validateContact = v => {
  const err = {};
  if (!v.kvkk) err.kvkk = true;
  return err;
};

// Form → doğrulama → WhatsApp'ta hazır mesaj
export function useWhatsAppForm(initial, validate, toMessage) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [sentUrl, setSentUrl] = useState(null);

  const bind = key => ({
    value: values[key],
    onChange: e => {
      const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
      setValues(s => ({ ...s, [key]: v }));
      if (errors[key]) setErrors(er => ({ ...er, [key]: false }));
    },
  });

  const submit = e => {
    e.preventDefault();
    const err = validate(values);
    setErrors({});
    if (Object.keys(err).length) { setErrors(err); return; }
    setSentUrl(openWhatsApp(toMessage(values)));
  };

  return { values, setValues, errors, sentUrl, bind, submit };
}

export const WhatsAppSent = ({ url }) => (
  <div className="form-ok" role="status">
    {url && <><b>WhatsApp bağlantısı hazır.</b>
    <span>Mesajı göndermek için WhatsApp'ta <strong>Gönder</strong>'e basın.</span>
    <a className="form-ok__link" href={url} target="_blank" rel="noopener"><WhatsappIcon />WhatsApp açılmadıysa tekrar deneyin</a></>}
  </div>
);
