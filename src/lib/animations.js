/* Keep essential navigation responsive without delaying content or hijacking scroll. */
export function initSite() {
  document.body.classList.remove('is-loading');
  const header = document.querySelector('#header');
  const top = document.querySelector('#totop');
  const update = () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 60);
    top?.classList.toggle('is-visible', window.scrollY > 700);
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
  return () => window.removeEventListener('scroll', update);
}
