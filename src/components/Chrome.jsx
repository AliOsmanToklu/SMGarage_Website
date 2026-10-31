import { useRef } from 'react';
import { CONTACT, whatsappUrl } from '../config';
import { NAV } from '../data';
import { useDialogFocus } from '../lib/dialog';
import { asset } from '../lib/utils';
import { Logo, useAppointment } from './ui';
import { InstagramIcon, MailIcon, PhoneIcon, WhatsappIcon } from './Icons';

export function Preloader() {
  return (
    <div className="preloader" id="preloader" aria-hidden="true">
      <div className="preloader__panel preloader__panel--a" />
      <div className="preloader__panel preloader__panel--b" />
      <div className="preloader__inner">
        <div className="preloader__logo"><img src={asset('img/logo.png')} alt="" width="378" height="163" /><i className="preloader__shine" /></div>
        <div className="preloader__bar"><i /></div>
        <div className="preloader__meta">
          <span>MOTOR ISINIYOR</span>
          <span className="preloader__count"><b id="loadCount">0</b>%</span>
        </div>
      </div>
    </div>
  );
}

export function Overlays() {
  return (
    <>
      <div className="cursor" aria-hidden="true"><div className="cursor__ring" /><div className="cursor__dot" /><span className="cursor__label" /></div>
      <div className="scroll-progress" aria-hidden="true"><i /></div>
      <div className="noise" aria-hidden="true" />
    </>
  );
}

export function Header({ menuOpen, onToggleMenu }) {
  const openAppointment = useAppointment();
  return (
    <header className="header" id="header">
      <div className="topbar">
        <div className="container topbar__inner">
          <div className="topbar__info">
            <a href={`tel:${CONTACT.tel}`}><PhoneIcon />{CONTACT.phone} · {CONTACT.person}</a>
            <a href={`mailto:${CONTACT.email}`}><MailIcon />{CONTACT.email}</a>
            <span className="topbar__hours"><i className="dot-live" />{CONTACT.hours}</span>
          </div>
          <div className="topbar__social">
            <a href={CONTACT.instagramUrl} target="_blank" rel="noopener" aria-label={`Instagram @${CONTACT.instagram}`}><InstagramIcon /></a>
            <a href={whatsappUrl()} target="_blank" rel="noopener" aria-label="WhatsApp"><WhatsappIcon /></a>
          </div>
        </div>
      </div>
      <nav className="nav">
        <div className="container nav__inner">
          <a href="#top" className="logo" data-cursor="hover" aria-label="SM Garage anasayfa"><Logo className="" /></a>
          <ul className="nav__links">
            {NAV.map(([href, text]) => <li key={href}><a href={href} data-text={text}>{text}</a></li>)}
          </ul>
          <button className="btn btn--primary btn--sm magnetic" data-cursor="hover" onClick={() => openAppointment()}><span>Randevu Al</span></button>
          <button className={`burger${menuOpen ? ' is-open' : ''}`} aria-label={menuOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={menuOpen} aria-controls="mmenu" onClick={onToggleMenu}>
            <span /><span /><span />
          </button>
        </div>
      </nav>
    </header>
  );
}

export function MobileMenu({ open, onClose }) {
  const openAppointment = useAppointment();
  const ref = useRef(null);
  useDialogFocus(open, ref, onClose);

  if (!open) return null;

  return (
    <div className="mmenu is-open" id="mmenu" ref={ref} role="dialog" aria-modal="true" aria-label="Menü">
      <div className="mmenu__bg" />
      <button className="mmenu__close" onClick={onClose}>Menüyü kapat</button>
      <ul className="mmenu__links">
        {NAV.map(([href, text], i) => (
          <li key={href}><a href={href} onClick={onClose}><em>{String(i + 1).padStart(2, '0')}</em>{text === 'Tuning Hesaplama' ? 'Hesaplama' : text}</a></li>
        ))}
      </ul>
      <div className="mmenu__foot">
        <a href={`tel:${CONTACT.tel}`}>{CONTACT.phone} · {CONTACT.person}</a>
        <button className="btn btn--primary" onClick={() => openAppointment()}><span>Randevu Al</span></button>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          <a href="#top" className="logo" aria-label="SM Garage anasayfa"><Logo className="" /></a>
          <ul className="footer__links">
            {NAV.map(([href, text]) => <li key={href}><a href={href}>{text}</a></li>)}
          </ul>
        </div>
        <div className="footer__giant" aria-hidden="true"><span id="giant">SM GARAGE</span></div>
        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} SM Garage. Tüm hakları saklıdır.</span>
          <span>ECU Yazılım · Mekanik Onarım · <a href={CONTACT.instagramUrl} target="_blank" rel="noopener">@{CONTACT.instagram}</a></span>
        </div>
        <nav className="legal-links" aria-label="Yasal bilgiler">
          <a href="#/gizlilik">Gizlilik ve KVKK</a><a href="#/kosullar">Kullanım koşulları</a><a href="#/cerezler">Çerez politikası</a><a href="#/iade">İptal ve iade</a>
        </nav>
      </div>
    </footer>
  );
}

export function FloatingButtons() {
  return (
    <>
      <a href="#top" className="totop" id="totop" aria-label="Yukarı çık">
        <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="21" className="totop__bg" /><circle cx="24" cy="24" r="21" className="totop__p" id="totopP" /><path d="M24 31V17M18 23l6-6 6 6" className="totop__arr" /></svg>
      </a>
      <a href={whatsappUrl('Merhaba SM Garage, bilgi almak istiyorum.')} target="_blank" rel="noopener" className="wa" aria-label="WhatsApp ile yaz" data-cursor="hover"><WhatsappIcon /></a>
    </>
  );
}
