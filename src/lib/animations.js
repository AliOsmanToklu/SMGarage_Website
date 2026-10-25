/* =========================================================
   Site geneli animasyonlar — GSAP + ScrollTrigger + Lenis
   App ilk render'dan sonra initSite() çağırır.
   ========================================================= */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { scroll } from './scroll';
import { engine, G } from './engine';
import { $, $$, isTouch, prefersReduced, clamp, countUp } from './utils';

gsap.registerPlugin(ScrollTrigger);

export function initSite() {
  const touch = isTouch(), reduce = prefersReduced();
  const cleanups = [];
  const on = (target, ev, fn, opts) => {
    target.addEventListener(ev, fn, opts);
    cleanups.push(() => target.removeEventListener(ev, fn, opts));
  };
  let mm;

  const ctx = gsap.context(() => {
    /* ---------- Smooth scroll ---------- */
    if (!reduce) {
      const lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      scroll.lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      const raf = t => lenis.raf(t * 1000);
      gsap.ticker.add(raf);
      gsap.ticker.lagSmoothing(0);
      lenis.stop();
      cleanups.push(() => { gsap.ticker.remove(raf); lenis.destroy(); scroll.lenis = null; });
    }
    on(document, 'click', e => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const el = id === '#top' ? 0 : $(id);
      if (el === null) return;
      e.preventDefault();
      scroll.to(el);
    });

    /* ---------- Cursor ---------- */
    if (!touch) {
      const cur = $('.cursor'), ring = $('.cursor__ring'), dot = $('.cursor__dot'), label = $('.cursor__label');
      const q = (el, p, d, e) => gsap.quickTo(el, p, { duration: d, ease: e });
      const rx = q(ring, 'x', .55, 'power3'), ry = q(ring, 'y', .55, 'power3');
      const dx = q(dot, 'x', .12), dy = q(dot, 'y', .12);
      const lx = q(label, 'x', .55, 'power3'), ly = q(label, 'y', .55, 'power3');
      on(window, 'mousemove', e => {
        cur.classList.add('is-on');
        rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); lx(e.clientX); ly(e.clientY);
      });
      const labels = { view: 'İncele', rev: 'Devirle' };
      on(document, 'mouseover', e => {
        const t = e.target.closest('[data-cursor], a, button, select, input, textarea, label');
        cur.classList.remove('is-hover', 'is-label');
        if (!t) return;
        if (labels[t.dataset.cursor]) { label.textContent = labels[t.dataset.cursor]; cur.classList.add('is-label'); }
        else cur.classList.add('is-hover');
      });
      on(document, 'mousedown', () => gsap.to(ring, { scale: .7, duration: .2 }));
      on(document, 'mouseup', () => gsap.to(ring, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)' }));

      /* ---------- Magnetic buttons ---------- */
      $$('.magnetic').forEach(el => {
        const strength = el.classList.contains('cta__btn') ? .45 : .32;
        on(el, 'mousemove', e => {
          const r = el.getBoundingClientRect();
          gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: .6, ease: 'power3.out' });
        });
        on(el, 'mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, .35)' }));
      });

      /* ---------- 3D tilt cards ---------- */
      $$('[data-tilt]').forEach(card => {
        const tx = gsap.quickTo(card, 'rotationX', { duration: .8, ease: 'power3' }), ty = gsap.quickTo(card, 'rotationY', { duration: .8, ease: 'power3' });
        gsap.set(card, { transformPerspective: 1000 });
        on(card, 'mousemove', e => {
          const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
          ty((px - .5) * 16); tx((.5 - py) * 16);
          card.style.setProperty('--mx', `${px * 100}%`); card.style.setProperty('--my', `${py * 100}%`);
        });
        on(card, 'mouseleave', () => { tx(0); ty(0); });
      });

      /* ---------- Hero mouse parallax ---------- */
      const vx = gsap.quickTo('.hero__visual', 'x', { duration: 1.2, ease: 'power3' }), vy = gsap.quickTo('.hero__visual', 'y', { duration: 1.2, ease: 'power3' });
      const bx = gsap.quickTo('.hero__bigtext', 'x', { duration: 1.6, ease: 'power3' });
      const gx = gsap.quickTo('.hero__glow', 'x', { duration: 2, ease: 'power3' }), gy = gsap.quickTo('.hero__glow', 'yPercent', { duration: 2, ease: 'power3' });
      on($('#hero'), 'mousemove', e => {
        const m = engine.mouse;
        m.x = e.clientX / innerWidth; m.y = e.clientY / innerHeight;
        vx((m.x - .5) * 30); vy((m.y - .5) * 30);
        bx((m.x - .5) * -80);
        gx((m.x - .5) * 160); gy(-50 + (m.y - .5) * 20);
      });
    }

    // Butonlardaki dolgu efekti fareden başlasın
    $$('.btn').forEach(b => {
      const set = e => { const r = b.getBoundingClientRect(); b.style.setProperty('--x', `${e.clientX - r.left}px`); b.style.setProperty('--y', `${e.clientY - r.top}px`); };
      on(b, 'mouseenter', set); on(b, 'mouseleave', set);
    });

    /* ---------- Preloader → hero intro ---------- */
    const heroChars = $$('.hero__title .ch');
    gsap.set('.preloader__logo img', { clipPath: 'inset(0% 100% 0% 0%)', scale: 1.15, filter: 'blur(8px)' });
    gsap.set(heroChars, { yPercent: 120, rotateX: -90, opacity: 0, transformOrigin: '50% 100%', transformPerspective: 600 });
    gsap.set(['.hero__eyebrow', '.hero__lead', '.hero__ctas > *', '.hero__mini > div', '.hero__scroll'], { y: 40, opacity: 0 });
    gsap.set('.hero__visual', { scale: .6, rotate: -60, opacity: 0 });
    gsap.set('.hero__badge', { scale: 0, opacity: 0 });
    gsap.set('.gauge__brand', { opacity: 0, y: 10 });
    gsap.set('.hero__bigtext', { xPercent: 20, opacity: 0 });
    gsap.set(['.gauge__ticks line', '.gauge__nums text'], { opacity: 0 });

    const counter = { v: 0 }, countEl = $('#loadCount');
    gsap.timeline({ defaults: { ease: 'expo.out' } })
      .to('.preloader__logo img', { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.inOut' })
      .to('.preloader__shine', { left: '130%', duration: 1.1, ease: 'power2.inOut' }, 1)
      .to(counter, {
        v: 100, duration: 2, ease: 'power2.inOut',
        onUpdate: () => { countEl.textContent = Math.round(counter.v); gsap.set('.preloader__bar i', { scaleX: counter.v / 100 }); },
      }, .2)
      .to('.preloader__logo img', { scale: .85, opacity: 0, filter: 'blur(10px)', duration: .7, ease: 'expo.in' }, '+=.15')
      .to(['.preloader__bar', '.preloader__meta'], { opacity: 0, duration: .4 }, '<.2')
      .add(() => { initScroll(); heroIntro(); })
      .to('.preloader__panel--a', { yPercent: -100, duration: 1.3, ease: 'expo.inOut' }, '-=.05')
      .to('.preloader__panel--b', { yPercent: 100, duration: 1.3, ease: 'expo.inOut' }, '<')
      .add(() => {
        gsap.set('#preloader', { display: 'none' });
        document.body.classList.remove('is-loading');
        scroll.start();
      });

    function heroIntro() {
      gsap.timeline({ delay: .45, defaults: { ease: 'expo.out' } })
        .to(heroChars, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.5, stagger: .035 })
        .to('.hero__eyebrow', { y: 0, opacity: 1, duration: 1.2 }, .1)
        .to('.hero__bigtext', { xPercent: 0, opacity: 1, duration: 2.4 }, 0)
        .to('.hero__visual', { scale: 1, rotate: 0, opacity: 1, duration: 2 }, .2)
        .to('.gauge__ticks line', { opacity: 1, duration: .3, stagger: .015 }, .6)
        .to('.gauge__nums text', { opacity: 1, duration: .5, stagger: .06 }, .9)
        .to('.gauge__brand', { opacity: .9, y: 0, duration: 1.2 }, 1.2)
        // marş: 0 → kırmızı bölge → rölanti
        .to(engine, { rpm: G.max, duration: 1.1, ease: 'power2.in', onUpdate: () => engine.render() }, 1.1)
        .to(engine, { rpm: 900, duration: 1.4, ease: 'power3.out', onUpdate: () => engine.render(), onComplete: () => { engine.live = true; } })
        .to(['.hero__lead', '.hero__ctas > *'], { y: 0, opacity: 1, duration: 1.2, stagger: .1 }, .7)
        .to('.hero__mini > div', { y: 0, opacity: 1, duration: 1.2, stagger: .1 }, 1)
        .add(() => $$('.hero__mini [data-count]').forEach(countUp), 1.1)
        .to('.hero__badge', { scale: 1, opacity: 1, duration: 1.2, stagger: .2, ease: 'back.out(2)' }, 2)
        .to('.hero__scroll', { y: 0, opacity: 1, duration: 1 }, 2.2);
      gsap.to('.hero__badge--a', { y: -16, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 });
      gsap.to('.hero__badge--b', { y: 14, duration: 3.1, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 });
    }

    /* ---------- Kaydırmaya bağlı animasyonlar ---------- */
    function initScroll() {
      mm = gsap.matchMedia();
      const header = $('#header'), bar = $('.scroll-progress i'), totop = $('#totop'), totopP = $('#totopP');
      // Native scroll olayı: ScrollTrigger.refresh() sırasındaki geçici 0 konumundan etkilenmez
      let lastY = window.scrollY, ticking = false;
      const updateChrome = () => {
        ticking = false;
        const y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight, p = max > 0 ? y / max : 0;
        const menuOpen = document.body.classList.contains('menu-open');
        header.classList.toggle('is-scrolled', y > 60);
        header.classList.toggle('is-hidden', y > 500 && y > lastY + 2 && !menuOpen);
        if (y < lastY - 2) header.classList.remove('is-hidden');
        lastY = y;
        gsap.set(bar, { scaleX: p });
        totop.classList.toggle('is-visible', y > 700);
        totopP.style.strokeDashoffset = 132 * (1 - p);
      };
      on(window, 'scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(updateChrome); } }, { passive: true });
      updateChrome();

      const navLinks = $$('.nav__links a');
      navLinks.forEach(a => {
        const id = a.getAttribute('href'), sec = id === '#top' ? $('#hero') : $(id);
        if (!sec) return;
        ScrollTrigger.create({
          trigger: sec, start: 'top 50%', end: 'bottom 50%',
          onToggle: s => { if (s.isActive) { navLinks.forEach(x => x.classList.remove('is-active')); a.classList.add('is-active'); } },
        });
      });

      gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })
        .to('.hero__content', { y: -160, opacity: 0, ease: 'none' }, 0)
        .to('.gauge', { scale: .8, rotate: 25, opacity: .2, ease: 'none' }, 0)
        .to('.hero__bigtext', { yPercent: -60, ease: 'none' }, 0)
        .to('.hero__grid', { yPercent: 30, ease: 'none' }, 0);

      // kayan şerit — kaydırma hızına tepki verir
      const mq = gsap.to('#marquee', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
      const skew = gsap.quickTo('#marquee', 'skewX', { duration: .5, ease: 'power3' });
      let skewT;
      ScrollTrigger.create({
        start: 0, end: 'max',
        onUpdate: s => {
          const v = s.getVelocity();
          gsap.to(mq, { timeScale: (v < 0 ? -1 : 1) * (1 + Math.abs(v) / 250), duration: .2, overwrite: true });
          gsap.to(mq, { timeScale: v < 0 ? -1 : 1, duration: 1.4, delay: .2 });
          skew(clamp(v / -120, -12, 12));
          clearTimeout(skewT); skewT = setTimeout(() => skew(0), 120);
        },
      });
      gsap.fromTo('.marquee', { rotate: -4 }, { rotate: 1, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });

      $$('[data-lines]').forEach(el => {
        gsap.from($$('.line-mask > span', el), {
          yPercent: 115, skewY: 7, duration: 1.4, stagger: .12, ease: 'expo.out',
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      gsap.set('[data-reveal]', { y: 60, opacity: 0 });
      ScrollTrigger.batch('[data-reveal]', {
        start: 'top 90%',
        onEnter: els => gsap.to(els, { y: 0, opacity: 1, duration: 1.2, stagger: .1, ease: 'expo.out', overwrite: true }),
      });

      $$('[data-reveal-clip]').forEach(el => {
        const inner = el.querySelector('.g__img, .about__card, svg');
        const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } });
        tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 26px)' }, { clipPath: 'inset(0% 0% 0% 0% round 26px)', duration: 1.6, ease: 'expo.inOut' });
        if (inner) tl.from(inner, { scale: 1.35, duration: 2, ease: 'expo.out' }, .3);
      });

      $$('.section__num').forEach(n => gsap.fromTo(n, { yPercent: 40 }, { yPercent: -40, ease: 'none', scrollTrigger: { trigger: n.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

      $$('[data-count]').filter(el => !el.closest('.hero')).forEach(el => {
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => countUp(el) });
      });

      /* About */
      $$('.circuit path').forEach(p => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
      gsap.timeline({ scrollTrigger: { trigger: '.about', start: 'top 70%', end: 'center 40%', scrub: 1 } })
        .to('.circuit path', { strokeDashoffset: 0, stagger: .08, ease: 'none' })
        .from('.circuit-nodes circle', { scale: 0, transformOrigin: 'center', stagger: .05 }, 0)
        .from('.chip, .chip-pins, .chip-label, .chip-sub', { opacity: 0, scale: .7, transformOrigin: '200px 240px', stagger: .1 }, .2);
      gsap.to('.chip', { filter: 'drop-shadow(0 0 18px rgba(255,45,61,.9))', duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
      gsap.to('.about__visual', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
      gsap.to('#aboutScrub .w', { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#aboutScrub', start: 'top 82%', end: 'bottom 48%', scrub: true } });

      /* Hizmetler: sabitlenen yatay kaydırma (masaüstü) */
      mm.add('(min-width: 901px)', () => {
        const track = $('#svcTrack'), cur = $('#svcCur'), barEl = $('#svcBar'), cards = $$('.svc');
        const total = cards.filter(c => !c.classList.contains('svc--cta')).length;
        const dist = () => track.scrollWidth - innerWidth + 40;
        const skewTo = gsap.quickTo(cards, 'skewX', { duration: .6, ease: 'power3' });
        let t;
        gsap.to(track, {
          x: () => -dist(), ease: 'none',
          scrollTrigger: {
            trigger: '.services', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
            onUpdate: s => {
              gsap.set(barEl, { scaleX: s.progress });
              cur.textContent = String(Math.min(total, 1 + Math.floor(s.progress * total))).padStart(2, '0');
              skewTo(clamp(s.getVelocity() / -400, -6, 6));
              clearTimeout(t); t = setTimeout(() => skewTo(0), 100);
            },
          },
        });
        gsap.from(cards, { x: 300, opacity: 0, rotateY: -25, duration: 1.6, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.services', start: 'top 60%' } });
      });

      /* İstatistik halkaları */
      $$('.stat__ring .p').forEach(c => {
        const L = 2 * Math.PI * 52, pct = +c.dataset.pct;
        gsap.set(c, { strokeDasharray: L, strokeDashoffset: L });
        gsap.to(c, { strokeDashoffset: L * (1 - pct / 100), duration: 2.4, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } });
      });

      /* Süreç çizelgesi */
      const steps = $$('.step');
      mm.add('(min-width: 1101px)', () => {
        gsap.to('#processFill', {
          scaleX: 1, ease: 'none',
          scrollTrigger: {
            trigger: '#processList', start: 'top 75%', end: 'bottom 55%', scrub: 1,
            onUpdate: s => steps.forEach((st, i) => st.classList.toggle('is-on', s.progress >= i / (steps.length - 1) - .02)),
          },
        });
      });
      mm.add('(max-width: 1100px)', () => {
        steps.forEach(st => ScrollTrigger.create({ trigger: st, start: 'top 70%', onEnter: () => st.classList.add('is-on'), onLeaveBack: () => st.classList.remove('is-on') }));
      });
      gsap.from(steps, { y: 80, opacity: 0, duration: 1.3, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '#processList', start: 'top 85%' } });

      $$('.g__img').forEach(img => gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

      gsap.from('.cta__btn', { scale: 0, rotate: -180, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.cta', start: 'top 70%' } });

      const giant = $('#giant');
      gsap.fromTo(giant, { '--fill': '0%' }, { '--fill': '100%', ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
      gsap.from(giant, { yPercent: 60, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

      document.fonts?.ready.then(() => ScrollTrigger.refresh());
    }
  });

  return () => {
    cleanups.forEach(fn => fn());
    mm?.revert();
    ctx.revert();
  };
}
