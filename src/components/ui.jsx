import { createContext, useContext, useId } from 'react';
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
  const errorId = useId();
  return (
    <div>
      <label className={`field field--float${error ? ' is-error' : ''}`}>
        <Tag placeholder=" " aria-invalid={!!error} aria-describedby={error ? errorId : undefined} {...props} />
        <span>{label}</span>
      </label>
      {error && <span id={errorId} className="field-error" role="alert">{error}</span>}
    </div>
  );
};

export const Check = ({ checked, onChange, error, children }) => {
  const errorId = useId();
  return <div>
    <label className={`check${error ? ' is-error' : ''}`}>
      <input type="checkbox" checked={checked} onChange={onChange} required aria-invalid={!!error} aria-describedby={error ? errorId : undefined} />
      <i aria-hidden="true" /><span>{children}</span>
    </label>
    {error && <span className="check-error" id={errorId} role="alert">Devam etmek için bu kutuyu işaretleyin.</span>}
  </div>;
};
