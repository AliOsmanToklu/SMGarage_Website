import { lazy, Suspense, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { initSite } from './lib/animations';
import { AppointmentContext } from './components/ui';
import { FloatingButtons, Footer, Header, MobileMenu, Overlays, Preloader } from './components/Chrome';
import Hero from './components/Hero';
import { About, Cta, Marquee, Process, Services } from './components/Sections';
import Faq from './components/Faq';
import Contact from './components/Contact';
import AppointmentModal from './components/AppointmentModal';
import { ErrorBoundary, PageSkeleton, RecoveryPage, ToastProvider } from './components/Feedback';
import './legal.css';
import './ux.css';

const LegalPage = lazy(() => import('./components/LegalPage'));

function Site() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointment, setAppointment] = useState({ open: false, preset: null });
  const appointmentTrigger = useRef(null);
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    window.addEventListener('hashchange', update);
    return () => window.removeEventListener('hashchange', update);
  }, []);
  const legal = hash.startsWith('#/') ? hash.slice(2) : null;
  const missingPath = !['/', '/index.html'].includes(window.location.pathname);
  useEffect(() => {
    if (!hash || legal) return;
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
    const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    return () => cancelAnimationFrame(frame);
  }, [hash, legal]);

  const openAppointment = useCallback((preset = null) => {
    appointmentTrigger.current = document.activeElement?.closest('.mmenu')
      ? document.querySelector('.burger') : document.activeElement;
    setMenuOpen(false);
    setAppointment({ open: true, preset });
  }, []);
  const closeAppointment = useCallback(() => setAppointment(a => ({ ...a, open: false })), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Tüm bileşenler DOM'a yerleştikten sonra animasyonları başlat
  useLayoutEffect(() => initSite(), []);

  return (
    <AppointmentContext.Provider value={openAppointment}>
      <Preloader />
      <Overlays />
      <div inert={menuOpen || appointment.open || undefined}>
      <a className="skip-link" href="#top" onClick={e => { e.preventDefault(); document.getElementById('top')?.focus(); }}>Ana içeriğe geç</a>
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(o => !o)} />
      {missingPath ? <RecoveryPage /> : legal ? <Suspense fallback={<PageSkeleton />}><LegalPage page={legal} /></Suspense> : <main id="top" tabIndex={-1}>
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
      </div>
      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <AppointmentModal open={appointment.open} preset={appointment.preset} onClose={closeAppointment} returnFocusRef={appointmentTrigger} />
    </AppointmentContext.Provider>
  );
}

export default function App() {
  return <ErrorBoundary><ToastProvider><Site /></ToastProvider></ErrorBoundary>;
}
