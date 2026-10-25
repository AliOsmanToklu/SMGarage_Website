// Lenis örneğine uygulamanın her yerinden erişim
export const scroll = {
  lenis: null,
  to(target) {
    if (target == null) return;
    if (this.lenis) return this.lenis.scrollTo(target, { offset: target === 0 ? 0 : -70, duration: 1.8 });
    const top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  },
  stop() { this.lenis?.stop(); },
  start() { this.lenis?.start(); },
};
