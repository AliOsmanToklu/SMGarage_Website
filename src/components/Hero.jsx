import { useAppointment } from './ui';
import { ArrowIcon } from './Icons';

export default function Hero() {
  const openAppointment = useAppointment();
  return (
    <section className="hero" id="hero">
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__eyebrow"><span className="line" />Maslak · İstanbul</p>
          <h1 className="hero__title">ECU yazılım<br /><span>ve mekanik</span><br />servis.</h1>
          <p className="hero__lead">Arıza tespiti, bakım ve ECU yazılımı için aracınızı birlikte değerlendirelim.</p>
          <div className="hero__ctas">
            <button className="btn btn--primary btn--lg" onClick={() => openAppointment()}><span>Randevu alın</span><ArrowIcon /></button>
            <a href="#hizmetler" className="btn btn--ghost btn--lg"><span>Hizmetleri inceleyin</span></a>
          </div>
          <div className="hero__mini"><div><b>01</b><span>Arıza tespiti</span></div><div><b>02</b><span>ECU yazılım</span></div><div><b>03</b><span>Mekanik onarım</span></div></div>
        </div>
        <div className="hero__visual hero__diagram" aria-hidden="true">
          <svg viewBox="0 0 500 500" fill="none">
            <circle cx="250" cy="250" r="200" /><circle cx="250" cy="250" r="150" />
            <path d="M50 250H450M250 50V450M109 109L391 391M391 109L109 391" />
            <rect x="175" y="175" width="150" height="150" rx="12" />
            <path d="M195 175V150M225 175V150M255 175V150M285 175V150M195 325V350M225 325V350M255 325V350M285 325V350M175 195H150M175 225H150M175 255H150M175 285H150M325 195H350M325 225H350M325 255H350M325 285H350" />
            <text x="250" y="258" textAnchor="middle">ECU</text>
          </svg>
          <span className="hero__diagram-label">SM GARAGE / SERVİS</span>
        </div>
      </div>
    </section>
  );
}
