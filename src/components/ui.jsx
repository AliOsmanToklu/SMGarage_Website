import { createContext, useContext } from 'react';
import { asset } from '../lib/utils';

// Randevu penceresini her yerden açmak için: openAppointment({ service, vehicle })
export const AppointmentContext = createContext(() => {});
export const useAppointment = () => useContext(AppointmentContext);

export const Logo = ({ className = 'logo', alt = 'SM Garage — Araç Bakım Onarım Servisi', ...rest }) => (
  <img src={asset('img/logo.png')} alt={alt} width="378" height="163" className={className} {...rest} />
);

export const Eyebrow = ({ children, reveal = true }) => (
  <div className="eyebrow" {...(reveal && { 'data-reveal': '' })}><span className="line" />{children}</div>
);

// Her satır maskeli olarak alttan kayarak gelir (animations.js → [data-lines])
export const Lines = ({ as: Tag = 'h2', className = 'title', lines }) => (
  <Tag className={className} data-lines="">
    {lines.map((line, i) => <span className="line-mask" key={i}><span>{line}</span></span>)}
  </Tag>
);

export const Split = ({ text, className }) => (
  <span className={className}>
    {[...text].map((c, i) => <span className="ch" key={i}>{c}</span>)}
  </span>
);

export const FloatField = ({ label, error, textarea, ...props }) => {
  const Tag = textarea ? 'textarea' : 'input';
  return (
    <label className={`field field--float${error ? ' is-error' : ''}`}>
      <Tag placeholder=" " {...props} />
      <span>{label}</span>
    </label>
  );
};

export const Check = ({ checked, onChange, error, children }) => (
  <label className={`check${error ? ' is-error' : ''}`}>
    <input type="checkbox" checked={checked} onChange={onChange} />
    <i />{children}
  </label>
);
