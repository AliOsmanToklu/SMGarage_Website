import { useCallback, useLayoutEffect, useState } from 'react';
import { initSite } from './lib/animations';
import { AppointmentContext } from './components/ui';
import { FloatingButtons, Footer, Header, MobileMenu, Overlays, Preloader } from './components/Chrome';
import Hero from './components/Hero';
import { About, Cta, Gallery, Marquee, Process, Services, Stats } from './components/Sections';
import Dyno from './components/Dyno';
import Calculator from './components/Calculator';
import Testimonials from './components/Testimonials';
import Faq from './components/Faq';
import Contact from './components/Contact';
import AppointmentModal from './components/AppointmentModal';

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [appointment, setAppointment] = useState({ open: false, preset: null });

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
      <Preloader />
      <Overlays />
      <Header menuOpen={menuOpen} onToggleMenu={() => setMenuOpen(o => !o)} />
      <MobileMenu open={menuOpen} onClose={closeMenu} />
      <main id="top">
        <Hero />
        <Marquee />
        <About />
        <Services />
        <Stats />
        <Dyno />
        <Calculator />
        <Process />
        <Gallery />
        <Testimonials />
        <Faq />
        <Cta />
        <Contact />
      </main>
      <Footer />
      <FloatingButtons />
      <AppointmentModal open={appointment.open} preset={appointment.preset} onClose={closeAppointment} />
    </AppointmentContext.Provider>
  );
}
