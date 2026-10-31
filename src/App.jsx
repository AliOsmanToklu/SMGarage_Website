import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { initSite } from './lib/animations';
import { AppointmentContext } from './components/ui';
import { FloatingButtons, Footer, Header, MobileMenu, Overlays, Preloader } from './components/Chrome';
import Hero from './components/Hero';
import { About, Cta, Marquee, Process, Services } from './components/Sections';
import Faq from './components/Faq';
import Contact from './components/Contact';
import AppointmentModal from './components/AppointmentModal';
import LegalPage from './components/LegalPage';
import './legal.css';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointment, setAppointment] = useState({ open: false, preset: null });
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const legal = hash.startsWith('#/') ? hash.slice(2) : null;
  useEffect(() => {
    if (!hash || legal) return;
    const id = decodeURIComponent(hash.slice(1));
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash, legal]);

  const openAppointment = useCallback((preset = null) => {
    setMenuOpen(false);
    setAppointment({ open: true, preset });
  }, []);
  const closeAppointment = useCallback(() => setAppointment(a => ({ ...a, open: false })), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Tüm bileşenler DOM'a yerleştikten sonra animasyonları başlat
  useLayoutEffect(() => initSite(), []);

  return (
    <AppointmentContext.Provider value={openAppointment}>
      <a className="skip-link" href="#top" onClick={e => { e.preventDefault(); document.getElementById('top')?.focus(); }}>Ana içeriğe geç</a>
      <Preloader />
      <Overlays />
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(o => !o)} />
      <MobileMenu open={menuOpen} onClose={closeMenu} />
      {legal ? <LegalPage page={legal} /> : <main id="top" tabIndex={-1}>
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Process />
        <Faq />
        <Cta />
        <Contact />
      </main>}
      <Footer />
      <FloatingButtons />
      <AppointmentModal open={appointment.open} preset={appointment.preset} onClose={closeAppointment} />
    </AppointmentContext.Provider>
  );
}
