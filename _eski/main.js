/* =========================================================
   SM GARAGE — animasyon & etkileşim
   GSAP 3 + ScrollTrigger + Lenis
   ========================================================= */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const isTouch = matchMedia('(hover: none), (pointer: coarse)').matches;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => Math.round(n).toLocaleString('tr-TR');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  $('#yr').textContent = new Date().getFullYear();

  if (!window.gsap || !window.ScrollTrigger) {
    document.documentElement.classList.add('no-anim');
    document.body.classList.remove('is-loading');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll ---------- */
  let lenis = null;
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.25, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  const scrollTo = target => {
    if (lenis) return lenis.scrollTo(target, { offset: target === 0 ? 0 : -70, duration: 1.8 });
    window.scrollTo({ top: target === 0 ? 0 : target.getBoundingClientRect().top + scrollY - 70, behavior: 'smooth' });
  };
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const el = id === '#top' ? 0 : $(id);
    if (el === null) return;
    e.preventDefault();
    if (menuOpen) toggleMenu(false);
    scrollTo(el);
  }));

  /* ---------- Text splitting ---------- */
  $$('[data-split]').forEach(el => {
    el.innerHTML = [...el.textContent].map(c => c === ' ' ? ' ' : `<span class="ch">${c}</span>`).join('');
  });
  $$('[data-lines]').forEach(el => {
    el.innerHTML = el.innerHTML.split(/<br\s*\/?>/i).map(l => `<span class="line-mask"><span>${l.trim()}</span></span>`).join('');
  });
  const scrub = $('#aboutScrub');
  scrub.innerHTML = scrub.textContent.trim().split(/\s+/).map(w => `<span class="w">${w}</span>`).join(' ');
  $$('.tslide p').forEach(p => {
    p.innerHTML = p.textContent.trim().split(/\s+/).map(w => `<span class="wd">${w}</span>`).join(' ');
  });

  /* ---------- Cursor ---------- */
  if (!isTouch) {
    const cur = $('.cursor'), ring = $('.cursor__ring'), dot = $('.cursor__dot'), label = $('.cursor__label');
    const rx = gsap.quickTo(ring, 'x', { duration: .55, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: .55, ease: 'power3' });
    const dx = gsap.quickTo(dot, 'x', { duration: .12 }), dy = gsap.quickTo(dot, 'y', { duration: .12 });
    const lx = gsap.quickTo(label, 'x', { duration: .55, ease: 'power3' }), ly = gsap.quickTo(label, 'y', { duration: .55, ease: 'power3' });
    addEventListener('mousemove', e => { cur.classList.add('is-on'); rx(e.clientX); ry(e.clientY); dx(e.clientX); dy(e.clientY); lx(e.clientX); ly(e.clientY); });
    const labels = { view: 'İncele', rev: 'Devirle' };
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor], a, button, select, input, textarea, label');
      cur.classList.remove('is-hover', 'is-label');
      if (!t) return;
      const kind = t.dataset.cursor;
      if (labels[kind]) { label.textContent = labels[kind]; cur.classList.add('is-label'); }
      else cur.classList.add('is-hover');
    });
    document.addEventListener('mousedown', () => gsap.to(ring, { scale: .7, duration: .2 }));
    document.addEventListener('mouseup', () => gsap.to(ring, { scale: 1, duration: .5, ease: 'elastic.out(1,.4)' }));
  }

  /* ---------- Magnetic buttons + fill origin ---------- */
  if (!isTouch) {
    $$('.magnetic').forEach(el => {
      const strength = el.classList.contains('cta__btn') ? .45 : .32;
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * strength, y: (e.clientY - r.top - r.height / 2) * strength, duration: .6, ease: 'power3.out' });
      });
      el.addEventListener('mouseleave', () => gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, .35)' }));
    });
  }
  $$('.btn').forEach(b => {
    const set = e => { const r = b.getBoundingClientRect(); b.style.setProperty('--x', `${e.clientX - r.left}px`); b.style.setProperty('--y', `${e.clientY - r.top}px`); };
    b.addEventListener('mouseenter', set); b.addEventListener('mouseleave', set);
  });

  /* =========================================================
     RPM GAUGE
     ========================================================= */
  const G = { cx: 200, cy: 200, max: 8000, a0: -135, sweep: 270, red: 6500 };
  const ang = rpm => G.a0 + (rpm / G.max) * G.sweep;
  const polar = (r, deg) => { const a = deg * Math.PI / 180; return [G.cx + r * Math.sin(a), G.cy - r * Math.cos(a)]; };
  const arc = (r, d0, d1) => { const [x0, y0] = polar(r, d0), [x1, y1] = polar(r, d1); return `M${x0} ${y0} A${r} ${r} 0 ${d1 - d0 > 180 ? 1 : 0} 1 ${x1} ${y1}`; };
  $('#gTrack').setAttribute('d', arc(160, ang(0), ang(G.max)));
  $('#gRed').setAttribute('d', arc(160, ang(G.red), ang(G.max)));
  const gFill = $('#gFill');
  gFill.setAttribute('d', arc(160, ang(0), ang(G.max)));
  const fillLen = gFill.getTotalLength();
  gFill.style.strokeDasharray = fillLen;
  gFill.style.strokeDashoffset = fillLen;
  const NS = 'http://www.w3.org/2000/svg';
  for (let v = 0; v <= G.max; v += 250) {
    const major = v % 1000 === 0, [x1, y1] = polar(144, ang(v)), [x2, y2] = polar(major ? 122 : 134, ang(v));
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', x1); l.setAttribute('y1', y1); l.setAttribute('x2', x2); l.setAttribute('y2', y2);
    l.setAttribute('class', `${major ? 'major' : ''} ${v >= G.red ? 'red' : ''}`);
    $('#gTicks').appendChild(l);
    if (major) {
      const [tx, ty] = polar(104, ang(v)), t = document.createElementNS(NS, 'text');
      t.setAttribute('x', tx); t.setAttribute('y', ty); t.textContent = v / 1000;
      if (v >= 7000) t.setAttribute('class', 'red');
      $('#gNums').appendChild(t);
    }
  }
  const needle = $('#gNeedle'), rpmEl = $('#rpmVal'), hpEl = $('#hpVal'), gaugeBox = $('.gauge');
  const engine = { rpm: 0, target: 900, live: false, revving: false };
  const renderGauge = () => {
    const r = engine.rpm;
    gsap.set(needle, { rotation: ang(r), svgOrigin: '200 200' });
    gFill.style.strokeDashoffset = fillLen * (1 - r / G.max);
    rpmEl.textContent = fmt(Math.round(r / 10) * 10);
    hpEl.textContent = Math.round(286 * Math.sin(Math.min(r / 6200, 1) * Math.PI / 2) * (r > 6200 ? 1 - (r - 6200) / 9000 : 1));
    const shake = r > 6000 ? (r - 6000) / 2000 * 2.2 : 0;
    gsap.set(gaugeBox, { x: (Math.random() - .5) * shake, y: (Math.random() - .5) * shake });
  };
  gsap.ticker.add((time) => {
    if (!engine.live) return;
    if (engine.revving) {
      engine.target = engine.rpm > 7300 ? 7000 + Math.random() * 300 : 7600; // rev limiter
      engine.rpm += (engine.target - engine.rpm) * .075;
    } else {
      engine.target = 880 + Math.sin(time * 9) * 25 + Math.random() * 20;
      engine.rpm += (engine.target - engine.rpm) * .045;
    }
    renderGauge();
  });
  const gaugeWrap = $('#gauge');
  if (isTouch) gaugeWrap.addEventListener('click', () => { engine.revving = !engine.revving; });
  else {
    gaugeWrap.addEventListener('mouseenter', () => { engine.revving = true; });
    gaugeWrap.addEventListener('mouseleave', () => { engine.revving = false; });
  }
  if (isTouch) $('.gauge__hint').textContent = 'Devirlemek için dokun';

  /* =========================================================
     HERO CANVAS — speed streaks & embers
     ========================================================= */
  const cv = $('#heroCanvas'), ctx = cv.getContext('2d');
  let W = 0, H = 0, DPR = 1, streaks = [], embers = [], heroVisible = true;
  const mouse = { x: .5, y: .5 };
  const resizeCanvas = () => {
    DPR = Math.min(devicePixelRatio || 1, 2);
    W = cv.offsetWidth; H = cv.offsetHeight;
    cv.width = W * DPR; cv.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const n = Math.round(W / 16);
    streaks = Array.from({ length: n }, () => newStreak(true));
    embers = Array.from({ length: Math.round(W / 22) }, () => newEmber(true));
  };
  const newStreak = init => ({
    x: init ? Math.random() * W : W + Math.random() * 200,
    y: Math.random() * H,
    len: 40 + Math.random() * 220,
    v: 2 + Math.random() * 7,
    a: .05 + Math.random() * .35,
    hot: Math.random() < .22
  });
  const newEmber = init => ({
    x: Math.random() * W,
    y: init ? Math.random() * H : H + 20,
    r: .6 + Math.random() * 2.2,
    vy: .3 + Math.random() * 1.4,
    vx: (Math.random() - .5) * .6,
    life: Math.random() * Math.PI * 2
  });
  const drawCanvas = () => {
    if (!heroVisible) return;
    ctx.clearRect(0, 0, W, H);
    const boost = 1 + engine.rpm / 1400;
    ctx.lineCap = 'round';
    for (const s of streaks) {
      s.x -= s.v * boost;
      if (s.x + s.len < 0) Object.assign(s, newStreak(false));
      const g = ctx.createLinearGradient(s.x, 0, s.x + s.len * Math.min(boost, 2.6), 0);
      const c = s.hot ? '255,60,50' : '255,255,255';
      g.addColorStop(0, `rgba(${c},${s.a})`); g.addColorStop(1, `rgba(${c},0)`);
      ctx.strokeStyle = g; ctx.lineWidth = s.hot ? 1.6 : 1;
      ctx.beginPath(); ctx.moveTo(s.x, s.y + (mouse.y - .5) * 30); ctx.lineTo(s.x + s.len * Math.min(boost, 2.6), s.y + (mouse.y - .5) * 30); ctx.stroke();
    }
    ctx.globalCompositeOperation = 'lighter';
    for (const e of embers) {
      e.life += .05; e.y -= e.vy * (1 + boost * .25); e.x += e.vx + Math.sin(e.life) * .4 + (mouse.x - .5) * .8;
      if (e.y < -20) Object.assign(e, newEmber(false));
      const flick = .45 + Math.sin(e.life * 3) * .35;
      ctx.fillStyle = `rgba(255,${100 + Math.round(Math.random() * 60)},40,${flick})`;
      ctx.shadowColor = '#ff4a1a'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = 'source-over';
  };
  resizeCanvas();
  addEventListener('resize', () => { clearTimeout(resizeCanvas.t); resizeCanvas.t = setTimeout(resizeCanvas, 150); });
  if (!reduce) gsap.ticker.add(drawCanvas); else drawCanvas();
  new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; }).observe($('#hero'));

  // mouse parallax
  if (!isTouch) {
    const vx = gsap.quickTo('.hero__visual', 'x', { duration: 1.2, ease: 'power3' }), vy = gsap.quickTo('.hero__visual', 'y', { duration: 1.2, ease: 'power3' });
    const bx = gsap.quickTo('.hero__bigtext', 'x', { duration: 1.6, ease: 'power3' });
    const gx = gsap.quickTo('.hero__glow', 'x', { duration: 2, ease: 'power3' }), gy = gsap.quickTo('.hero__glow', 'yPercent', { duration: 2, ease: 'power3' });
    $('#hero').addEventListener('mousemove', e => {
      mouse.x = e.clientX / innerWidth; mouse.y = e.clientY / innerHeight;
      vx((mouse.x - .5) * 30); vy((mouse.y - .5) * 30);
      bx((mouse.x - .5) * -80);
      gx((mouse.x - .5) * 160); gy(-50 + (mouse.y - .5) * 20);
    });
  }

  /* =========================================================
     PRELOADER → HERO INTRO
     ========================================================= */
  const heroChars = $$('.hero__title .ch');
  gsap.set('.preloader__logo img', { clipPath: 'inset(0% 100% 0% 0%)', scale: 1.15, filter: 'blur(8px)' });
  gsap.set(heroChars, { yPercent: 120, rotateX: -90, opacity: 0, transformOrigin: '50% 100%', transformPerspective: 600 });
  gsap.set(['.hero__eyebrow', '.hero__lead', '.hero__ctas > *', '.hero__mini > div', '.hero__scroll'], { y: 40, opacity: 0 });
  gsap.set('.hero__visual', { scale: .6, rotate: -60, opacity: 0 });
  gsap.set('.hero__badge', { scale: 0, opacity: 0 });
  gsap.set('.gauge__brand', { opacity: 0, y: 10 });
  gsap.set('.hero__bigtext', { xPercent: 20, opacity: 0 });
  gsap.set(['#gTicks line', '#gNums text'], { opacity: 0 });

  const counter = { v: 0 }, countEl = $('#loadCount');
  const pre = gsap.timeline({ defaults: { ease: 'expo.out' } });
  pre.to('.preloader__logo img', { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.inOut' })
    .to('.preloader__shine', { left: '130%', duration: 1.1, ease: 'power2.inOut' }, 1)
    .to(counter, {
      v: 100, duration: 2, ease: 'power2.inOut',
      onUpdate: () => { countEl.textContent = Math.round(counter.v); gsap.set('.preloader__bar i', { scaleX: counter.v / 100 }); }
    }, .2)
    .to('.preloader__logo img', { scale: .85, opacity: 0, filter: 'blur(10px)', duration: .7, ease: 'expo.in' }, '+=.15')
    .to(['.preloader__bar', '.preloader__meta'], { opacity: 0, duration: .4 }, '<.2')
    .add(() => { initScroll(); heroIntro(); })
    .to('.preloader__panel--a', { yPercent: -100, duration: 1.3, ease: 'expo.inOut' }, '-=.05')
    .to('.preloader__panel--b', { yPercent: 100, duration: 1.3, ease: 'expo.inOut' }, '<')
    .add(() => {
      $('#preloader').remove();
      document.body.classList.remove('is-loading');
      lenis && lenis.start();
    });

  function heroIntro() {
    const tl = gsap.timeline({ delay: .45, defaults: { ease: 'expo.out' } });
    tl.to(heroChars, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.5, stagger: .035 })
      .to('.hero__eyebrow', { y: 0, opacity: 1, duration: 1.2 }, .1)
      .to('.hero__bigtext', { xPercent: 0, opacity: 1, duration: 2.4 }, 0)
      .to('.hero__visual', { scale: 1, rotate: 0, opacity: 1, duration: 2, ease: 'expo.out' }, .2)
      .to('#gTicks line', { opacity: 1, duration: .3, stagger: .015 }, .6)
      .to('#gNums text', { opacity: 1, duration: .5, stagger: .06 }, .9)
      .to('.gauge__brand', { opacity: .9, y: 0, duration: 1.2 }, 1.2)
      // ignition sweep: 0 → redline → idle
      .to(engine, { rpm: G.max, duration: 1.1, ease: 'power2.in', onUpdate: renderGauge }, 1.1)
      .to(engine, { rpm: 900, duration: 1.4, ease: 'power3.out', onUpdate: renderGauge, onComplete: () => { engine.live = true; } })
      .to(['.hero__lead', '.hero__ctas > *'], { y: 0, opacity: 1, duration: 1.2, stagger: .1 }, .7)
      .to('.hero__mini > div', { y: 0, opacity: 1, duration: 1.2, stagger: .1 }, 1)
      .add(() => $$('.hero__mini [data-count]').forEach(countUp), 1.1)
      .to('.hero__badge', { scale: 1, opacity: 1, duration: 1.2, stagger: .2, ease: 'back.out(2)' }, 2)
      .to('.hero__scroll', { y: 0, opacity: 1, duration: 1 }, 2.2);
    gsap.to('.hero__badge--a', { y: -16, duration: 2.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 });
    gsap.to('.hero__badge--b', { y: 14, duration: 3.1, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 3 });
  }

  function countUp(el) {
    const end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', o = { v: 0 };
    gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = pre + fmt(o.v) + suf; } });
  }

  /* =========================================================
     SCROLL-DRIVEN ANIMATIONS
     ========================================================= */
  function initScroll() {
    const mm = gsap.matchMedia();

    // header / progress / back-to-top
    const header = $('#header'), bar = $('.scroll-progress i'), totop = $('#totop'), totopP = $('#totopP');
    let lastY = 0;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: self => {
        const y = self.scroll(), p = self.progress;
        header.classList.toggle('is-scrolled', y > 60);
        header.classList.toggle('is-hidden', y > 500 && y > lastY && !menuOpen);
        lastY = y;
        gsap.set(bar, { scaleX: p });
        totop.classList.toggle('is-visible', y > 700);
        totopP.style.strokeDashoffset = 132 * (1 - p);
      }
    });

    // active nav link
    $$('.nav__links a').forEach(a => {
      const id = a.getAttribute('href'), sec = id === '#top' ? $('#hero') : $(id);
      if (!sec) return;
      ScrollTrigger.create({ trigger: sec, start: 'top 50%', end: 'bottom 50%', onToggle: s => s.isActive && ($$('.nav__links a').forEach(x => x.classList.remove('is-active')), a.classList.add('is-active')) });
    });

    // hero scroll-out
    gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true } })
      .to('.hero__content', { y: -160, opacity: 0, ease: 'none' }, 0)
      .to('.gauge', { scale: .8, rotate: 25, opacity: .2, ease: 'none' }, 0)
      .to('.hero__bigtext', { yPercent: -60, ease: 'none' }, 0)
      .to('.hero__grid', { yPercent: 30, ease: 'none' }, 0);

    // marquee loop that reacts to scroll velocity
    const mq = gsap.to('#marquee', { xPercent: -50, duration: 28, ease: 'none', repeat: -1 });
    const skew = gsap.quickTo('#marquee', 'skewX', { duration: .5, ease: 'power3' });
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: s => {
        const v = s.getVelocity();
        gsap.to(mq, { timeScale: (v < 0 ? -1 : 1) * (1 + Math.abs(v) / 250), duration: .2, overwrite: true });
        gsap.to(mq, { timeScale: v < 0 ? -1 : 1, duration: 1.4, delay: .2 });
        skew(clamp(v / -120, -12, 12));
        clearTimeout(s._t); s._t = setTimeout(() => skew(0), 120);
      }
    });
    gsap.fromTo('.marquee', { rotate: -4 }, { rotate: 1, ease: 'none', scrollTrigger: { trigger: '.marquee', start: 'top bottom', end: 'bottom top', scrub: true } });

    // masked line titles
    $$('[data-lines]').forEach(el => {
      gsap.from($$('.line-mask > span', el), {
        yPercent: 115, skewY: 7, duration: 1.4, stagger: .12, ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });

    // generic fade-up reveals (batched for natural stagger)
    gsap.set('[data-reveal]', { y: 60, opacity: 0 });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      onEnter: els => gsap.to(els, { y: 0, opacity: 1, duration: 1.2, stagger: .1, ease: 'expo.out', overwrite: true })
    });

    // clip-path image reveals
    $$('[data-reveal-clip]').forEach(el => {
      const inner = el.querySelector('.g__img, .about__card, svg');
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } });
      tl.fromTo(el, { clipPath: 'inset(100% 0% 0% 0% round 26px)' }, { clipPath: 'inset(0% 0% 0% 0% round 26px)', duration: 1.6, ease: 'expo.inOut' });
      if (inner) tl.from(inner, { scale: 1.35, duration: 2, ease: 'expo.out' }, .3);
    });

    // section numbers parallax
    $$('.section__num').forEach(n => gsap.fromTo(n, { yPercent: 40 }, { yPercent: -40, ease: 'none', scrollTrigger: { trigger: n.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    // scroll counters (outside hero)
    $$('[data-count]').filter(el => !el.closest('.hero')).forEach(el => {
      ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => countUp(el) });
    });

    /* --- About --- */
    $$('.circuit path').forEach(p => { const L = p.getTotalLength(); gsap.set(p, { strokeDasharray: L, strokeDashoffset: L }); });
    gsap.timeline({ scrollTrigger: { trigger: '.about', start: 'top 70%', end: 'center 40%', scrub: 1 } })
      .to('.circuit path', { strokeDashoffset: 0, stagger: .08, ease: 'none' })
      .from('.circuit-nodes circle', { scale: 0, transformOrigin: 'center', stagger: .05 }, 0)
      .from('.chip, .chip-pins, .chip-label, .chip-sub', { opacity: 0, scale: .7, transformOrigin: '200px 240px', stagger: .1 }, .2);
    gsap.to('.chip', { filter: 'drop-shadow(0 0 18px rgba(255,45,61,.9))', duration: 1.4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.about__visual', { yPercent: -10, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.to('#aboutScrub .w', { opacity: 1, stagger: .1, ease: 'none', scrollTrigger: { trigger: '#aboutScrub', start: 'top 82%', end: 'bottom 48%', scrub: true } });

    /* --- Services: pinned horizontal scroll (desktop) --- */
    mm.add('(min-width: 901px)', () => {
      const track = $('#svcTrack'), cur = $('#svcCur'), barEl = $('#svcBar'), cards = $$('.svc');
      const total = cards.filter(c => !c.classList.contains('svc--cta')).length;
      const dist = () => track.scrollWidth - innerWidth + 40;
      const skewTo = gsap.quickTo(cards, 'skewX', { duration: .6, ease: 'power3' });
      gsap.to(track, {
        x: () => -dist(), ease: 'none',
        scrollTrigger: {
          trigger: '.services', start: 'top top', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
          onUpdate: s => {
            gsap.set(barEl, { scaleX: s.progress });
            cur.textContent = String(Math.min(total, 1 + Math.floor(s.progress * total))).padStart(2, '0');
            skewTo(clamp(s.getVelocity() / -400, -6, 6));
            clearTimeout(s._t); s._t = setTimeout(() => skewTo(0), 100);
          }
        }
      });
      gsap.from(cards, { x: 300, opacity: 0, rotateY: -25, duration: 1.6, stagger: .08, ease: 'expo.out', scrollTrigger: { trigger: '.services', start: 'top 60%' } });
    });

    /* --- Stats rings --- */
    $$('.stat__ring .p').forEach(c => {
      const L = 2 * Math.PI * 52, pct = +c.dataset.pct;
      gsap.set(c, { strokeDasharray: L, strokeDashoffset: L });
      gsap.to(c, { strokeDashoffset: L * (1 - pct / 100), duration: 2.4, ease: 'power3.out', scrollTrigger: { trigger: c, start: 'top 88%' } });
    });

    /* --- Dyno draw-in with sweeping scanner --- */
    ScrollTrigger.create({ trigger: '.dyno__chart', start: 'top 70%', once: true, onEnter: dynoIntro });

    /* --- Process timeline --- */
    const steps = $$('.step');
    mm.add('(min-width: 1101px)', () => {
      gsap.to('#processFill', {
        scaleX: 1, ease: 'none',
        scrollTrigger: {
          trigger: '#processList', start: 'top 75%', end: 'bottom 55%', scrub: 1,
          onUpdate: s => steps.forEach((st, i) => st.classList.toggle('is-on', s.progress >= i / (steps.length - 1) - .02))
        }
      });
    });
    mm.add('(max-width: 1100px)', () => {
      steps.forEach(st => ScrollTrigger.create({ trigger: st, start: 'top 70%', onEnter: () => st.classList.add('is-on'), onLeaveBack: () => st.classList.remove('is-on') }));
    });
    gsap.from(steps, { y: 80, opacity: 0, duration: 1.3, stagger: .15, ease: 'expo.out', scrollTrigger: { trigger: '#processList', start: 'top 85%' } });

    /* --- Gallery parallax inside tiles --- */
    $$('.g__img').forEach(img => gsap.fromTo(img, { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } }));

    /* --- CTA title / button scale --- */
    gsap.from('.cta__btn', { scale: 0, rotate: -180, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.cta', start: 'top 70%' } });

    /* --- Footer giant fill --- */
    const giant = $('#giant');
    gsap.fromTo(giant, { '--fill': '0%' }, { '--fill': '100%', ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.from(giant, { yPercent: 60, ease: 'none', scrollTrigger: { trigger: '.footer', start: 'top bottom', end: 'bottom bottom', scrub: true } });

    document.fonts && document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------- 3D tilt cards ---------- */
  if (!isTouch) {
    $$('[data-tilt]').forEach(card => {
      const rx = gsap.quickTo(card, 'rotationX', { duration: .8, ease: 'power3' }), ry = gsap.quickTo(card, 'rotationY', { duration: .8, ease: 'power3' });
      gsap.set(card, { transformPerspective: 1000 });
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        ry((px - .5) * 16); rx((.5 - py) * 16);
        card.style.setProperty('--mx', `${px * 100}%`); card.style.setProperty('--my', `${py * 100}%`);
      });
      card.addEventListener('mouseleave', () => { rx(0); ry(0); });
    });
  }

  /* =========================================================
     DYNO CHART
     ========================================================= */
  const dyn = { x0: 56, x1: 580, y0: 340, y1: 24, r0: 1000, r1: 5000, hpMax: 220 };
  const shape = s => { const v = Math.pow(s, .7) * (1 - .35 * Math.pow(s, 4)); return .22 + .78 * v / .733; };
  const stockHp = r => 150 * shape((r - dyn.r0) / (dyn.r1 - dyn.r0)) / 1.0;
  const tunedHp = r => { const s = (r - dyn.r0) / (dyn.r1 - dyn.r0); return stockHp(r) * (1.2 + .1 * Math.sin(Math.PI * s)); };
  const X = r => dyn.x0 + (r - dyn.r0) / (dyn.r1 - dyn.r0) * (dyn.x1 - dyn.x0);
  const Y = hp => dyn.y0 - hp / dyn.hpMax * (dyn.y0 - dyn.y1);
  const pathFor = fn => { let d = ''; for (let i = 0; i <= 120; i++) { const r = dyn.r0 + (dyn.r1 - dyn.r0) * i / 120; d += `${i ? 'L' : 'M'}${X(r).toFixed(1)} ${Y(fn(r)).toFixed(1)}`; } return d; };
  (() => {
    const grid = $('#dGrid');
    for (let hp = 0; hp <= 200; hp += 50) {
      grid.insertAdjacentHTML('beforeend', `<line x1="${dyn.x0}" x2="${dyn.x1}" y1="${Y(hp)}" y2="${Y(hp)}"/><text x="${dyn.x0 - 10}" y="${Y(hp) + 4}" text-anchor="end">${hp}</text>`);
    }
    for (let r = 1000; r <= 5000; r += 1000) {
      grid.insertAdjacentHTML('beforeend', `<line x1="${X(r)}" x2="${X(r)}" y1="${dyn.y1}" y2="${dyn.y0}"/><text x="${X(r)}" y="${dyn.y0 + 22}" text-anchor="middle">${r}</text>`);
    }
    grid.insertAdjacentHTML('beforeend', `<text x="${dyn.x1}" y="${dyn.y0 + 38}" text-anchor="end">RPM</text><text x="${dyn.x0 - 10}" y="12" text-anchor="end">HP</text>`);
    const defs = $('#dynoSvg defs');
    defs.insertAdjacentHTML('beforeend', `<clipPath id="cS"><rect id="cSr" x="0" y="0" width="0" height="380"/></clipPath><clipPath id="cT"><rect id="cTr" x="0" y="0" width="0" height="380"/></clipPath>`);
    $('#dStockPath').setAttribute('d', pathFor(stockHp));
    $('#dTunedPath').setAttribute('d', pathFor(tunedHp));
    $('#dAreaPath').setAttribute('d', pathFor(tunedHp) + `L${dyn.x1} ${dyn.y0}L${dyn.x0} ${dyn.y0}Z`);
    $('#dStockPath').setAttribute('clip-path', 'url(#cS)');
    $('#dTunedPath').setAttribute('clip-path', 'url(#cT)');
    $('#dAreaPath').setAttribute('clip-path', 'url(#cT)');
  })();
  const dCross = $('#dCross'), dDotS = $('#dDotS'), dDotT = $('#dDotT'), dChart = $('.dyno__chart');
  const setDyno = r => {
    r = clamp(r, dyn.r0, dyn.r1);
    const x = X(r), s = stockHp(r), t = tunedHp(r);
    dCross.setAttribute('x1', x); dCross.setAttribute('x2', x);
    dDotS.setAttribute('cx', x); dDotS.setAttribute('cy', Y(s));
    dDotT.setAttribute('cx', x); dDotT.setAttribute('cy', Y(t));
    $('#dRpm').textContent = fmt(r);
    $('#dStock').textContent = Math.round(s) + ' HP';
    $('#dTuned').textContent = Math.round(t) + ' HP';
  };
  let dynoReady = false;
  function dynoIntro() {
    const o = { r: dyn.r0 };
    dChart.classList.add('is-hover');
    gsap.timeline({ onComplete: () => { dynoReady = true; dChart.classList.remove('is-hover'); setDyno(3800); } })
      .to('#cSr', { attr: { width: 600 }, duration: 1.8, ease: 'power2.inOut' })
      .to('#cTr', { attr: { width: 600 }, duration: 2.2, ease: 'power2.inOut' }, .5)
      .to(o, { r: dyn.r1, duration: 2.2, ease: 'power2.inOut', onUpdate: () => setDyno(o.r) }, .5);
  }
  const svgPt = $('#dynoSvg').createSVGPoint();
  dChart.addEventListener('pointermove', e => {
    if (!dynoReady) return;
    svgPt.x = e.clientX; svgPt.y = e.clientY;
    const p = svgPt.matrixTransform($('#dynoSvg').getScreenCTM().inverse());
    setDyno(dyn.r0 + (p.x - dyn.x0) / (dyn.x1 - dyn.x0) * (dyn.r1 - dyn.r0));
    dChart.classList.add('is-hover');
  });
  dChart.addEventListener('pointerleave', () => dynoReady && dChart.classList.remove('is-hover'));

  /* =========================================================
     CHIP TUNING CALCULATOR  [motor, hp, nm, stage1 hp, stage1 nm]
     ========================================================= */
  const CARS = {
    'Audi': { 'A3 8V': [['1.6 TDI 110 HP', 110, 250, 140, 310], ['1.5 TFSI 150 HP', 150, 250, 180, 320]], 'A4 B9': [['2.0 TDI 150 HP', 150, 320, 190, 400]] },
    'BMW': { '3 Serisi F30': [['320d 184 HP', 184, 380, 225, 450], ['320i 184 HP', 184, 270, 230, 350]], '5 Serisi G30': [['520d 190 HP', 190, 400, 230, 470]] },
    'Fiat': { 'Egea': [['1.3 Multijet 95 HP', 95, 200, 120, 260], ['1.6 Multijet 120 HP', 120, 320, 150, 380]], 'Doblo': [['1.6 Multijet 105 HP', 105, 290, 135, 350]] },
    'Ford': { 'Focus 3': [['1.5 TDCi 120 HP', 120, 270, 150, 330], ['1.0 EcoBoost 125 HP', 125, 170, 150, 230]], 'Transit Custom': [['2.0 EcoBlue 130 HP', 130, 385, 165, 440]] },
    'Hyundai': { 'i20': [['1.4 CRDi 90 HP', 90, 240, 110, 280]], 'Tucson': [['1.6 CRDi 136 HP', 136, 320, 165, 380]] },
    'Mercedes-Benz': { 'C Serisi W205': [['C200d 160 HP', 160, 360, 195, 430], ['C220d 170 HP', 170, 400, 210, 470]] },
    'Renault': { 'Clio 4': [['1.5 dCi 90 HP', 90, 220, 115, 270]], 'Megane 4': [['1.5 dCi 110 HP', 110, 260, 135, 310], ['1.3 TCe 140 HP', 140, 240, 165, 290]] },
    'Toyota': { 'Hilux': [['2.4 D-4D 150 HP', 150, 400, 180, 460]] },
    'Volkswagen': { 'Golf 7': [['1.6 TDI 115 HP', 115, 250, 140, 310], ['2.0 TDI 150 HP', 150, 340, 190, 410], ['1.4 TSI 125 HP', 125, 200, 155, 260]], 'Passat B8': [['1.6 TDI 120 HP', 120, 250, 145, 310], ['2.0 TDI 150 HP', 150, 340, 190, 410], ['2.0 TDI 190 HP', 190, 400, 230, 470]] }
  };
  const cBrand = $('#cBrand'), cModel = $('#cModel'), cEngine = $('#cEngine'), cResult = $('#cResult');
  const opts = (sel, list, ph) => {
    sel.innerHTML = `<option value="">${ph}</option>` + list.map(v => `<option>${v}</option>`).join('');
    sel.disabled = !list.length;
    if (list.length) gsap.fromTo(sel, { scale: .96, borderColor: '#ff7a1a' }, { scale: 1, borderColor: 'rgba(255,255,255,.16)', duration: .8, ease: 'elastic.out(1,.5)' });
  };
  opts(cBrand, Object.keys(CARS), 'Marka seçin');
  cBrand.addEventListener('change', () => {
    opts(cModel, cBrand.value ? Object.keys(CARS[cBrand.value]) : [], cBrand.value ? 'Model seçin' : 'Önce marka seçin');
    opts(cEngine, [], 'Önce model seçin');
    cResult.classList.remove('has-data');
  });
  cModel.addEventListener('change', () => {
    opts(cEngine, cModel.value ? CARS[cBrand.value][cModel.value].map(e => e[0]) : [], cModel.value ? 'Motor seçin' : 'Önce model seçin');
    cResult.classList.remove('has-data');
  });
  const tweenNum = (el, to, suffix = '') => { const o = { v: 0 }; gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } }); };
  cEngine.addEventListener('change', () => {
    const e = CARS[cBrand.value]?.[cModel.value]?.find(x => x[0] === cEngine.value);
    if (!e) { cResult.classList.remove('has-data'); return; }
    const [, hp, nm, hp1, nm1] = e, maxHp = hp1 * 1.12, maxNm = nm1 * 1.12;
    cResult.classList.add('has-data');
    gsap.fromTo('#bHpS', { scaleX: 0 }, { scaleX: hp / maxHp, duration: 1.4, ease: 'expo.out', delay: .1 });
    gsap.fromTo('#bHpT', { scaleX: 0 }, { scaleX: hp1 / maxHp, duration: 1.8, ease: 'expo.out', delay: .3 });
    gsap.fromTo('#bNmS', { scaleX: 0 }, { scaleX: nm / maxNm, duration: 1.4, ease: 'expo.out', delay: .2 });
    gsap.fromTo('#bNmT', { scaleX: 0 }, { scaleX: nm1 / maxNm, duration: 1.8, ease: 'expo.out', delay: .4 });
    tweenNum($('#vHpS'), hp, ' HP'); tweenNum($('#vHpT'), hp1, ' HP');
    tweenNum($('#vNmS'), nm, ' Nm'); tweenNum($('#vNmT'), nm1, ' Nm');
    tweenNum($('#gHp'), hp1 - hp); tweenNum($('#gNm'), nm1 - nm);
    setTimeout(() => { $('#gHp').textContent = `+${hp1 - hp}`; $('#gNm').textContent = `+${nm1 - nm}`; }, 1650);
    gsap.fromTo(['#gHp', '#gNm'], { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, stagger: .1, ease: 'back.out(3)', delay: .6 });
  });

  /* =========================================================
     TESTIMONIALS
     ========================================================= */
  const slides = $$('.tslide'), dotsWrap = $('#tDots');
  let tIdx = 0, tTimer = null;
  slides.forEach((_, i) => dotsWrap.insertAdjacentHTML('beforeend', `<button aria-label="Yorum ${i + 1}"><i></i></button>`));
  const dots = $$('button', dotsWrap);
  const runDot = () => {
    dots.forEach(d => gsap.set(d.firstChild, { scaleX: 0 }));
    tTimer && tTimer.kill();
    tTimer = gsap.to(dots[tIdx].firstChild, { scaleX: 1, duration: 6, ease: 'none', onComplete: () => goSlide(tIdx + 1) });
  };
  const goSlide = (n) => {
    n = (n + slides.length) % slides.length;
    if (n === tIdx) return runDot();
    const out = slides[tIdx], inn = slides[n];
    gsap.to($$('.wd, footer', out), { y: -40, opacity: 0, rotateX: 40, duration: .6, stagger: .012, ease: 'power3.in', onComplete: () => out.classList.remove('is-active') });
    inn.classList.add('is-active');
    gsap.fromTo($$('.wd, footer', inn), { y: 50, opacity: 0, rotateX: -60, transformPerspective: 500 }, { y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: .022, ease: 'expo.out', delay: .5 });
    tIdx = n;
    runDot();
  };
  $('#tNext').addEventListener('click', () => goSlide(tIdx + 1));
  $('#tPrev').addEventListener('click', () => goSlide(tIdx - 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goSlide(i)));
  $('.testi__wrap').addEventListener('mouseenter', () => tTimer && tTimer.pause());
  $('.testi__wrap').addEventListener('mouseleave', () => tTimer && tTimer.resume());
  ScrollTrigger.create({ trigger: '.testi', start: 'top 70%', once: true, onEnter: runDot });

  /* =========================================================
     FAQ
     ========================================================= */
  $$('.qa').forEach(qa => {
    $('.qa__q', qa).addEventListener('click', () => {
      const open = qa.classList.contains('is-open');
      $$('.qa.is-open').forEach(o => { o.classList.remove('is-open'); gsap.to($('.qa__a', o), { height: 0, duration: .7, ease: 'expo.out' }); });
      if (!open) {
        qa.classList.add('is-open');
        gsap.to($('.qa__a', qa), { height: 'auto', duration: .9, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
        gsap.fromTo($('.qa__a p', qa), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .8, delay: .1, ease: 'expo.out' });
      }
    });
  });

  /* =========================================================
     MOBILE MENU
     ========================================================= */
  let menuOpen = false;
  const burger = $('#burger'), mmenu = $('#mmenu');
  const menuTl = gsap.timeline({ paused: true, defaults: { ease: 'expo.inOut' } })
    .set(mmenu, { visibility: 'visible' })
    .fromTo('.mmenu__bg', { clipPath: 'circle(0% at 90% 4%)' }, { clipPath: 'circle(150% at 90% 4%)', duration: 1.1 })
    .fromTo('.mmenu__links a', { yPercent: 110 }, { yPercent: 0, duration: 1, stagger: .06, ease: 'expo.out', immediateRender: true }, .45)
    .fromTo('.mmenu__foot', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, .8);
  function toggleMenu(state = !menuOpen) {
    menuOpen = state;
    burger.classList.toggle('is-open', state);
    $('#header').classList.remove('is-hidden');
    if (state) { menuTl.timeScale(1).play(); lenis && lenis.stop(); }
    else { menuTl.timeScale(1.6).reverse(); lenis && lenis.start(); }
  }
  burger.addEventListener('click', () => toggleMenu());

  /* =========================================================
     APPOINTMENT MODAL
     ========================================================= */
  const modal = $('#modal');
  const dateIn = $('#apptDate');
  dateIn.min = new Date().toISOString().slice(0, 10);
  let modalTl = null;
  const openModal = () => {
    if (menuOpen) toggleMenu(false);
    lenis && lenis.stop();
    modal.setAttribute('aria-hidden', 'false');
    modalTl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      .set(modal, { visibility: 'visible' })
      .to('.modal__bg', { opacity: 1, duration: .5, ease: 'power2.out' })
      .fromTo('.modal__box', { clipPath: 'circle(0% at 50% 50%)', scale: .9 }, { clipPath: 'circle(150% at 50% 50%)', scale: 1, duration: 1.2, ease: 'expo.inOut' }, 0)
      .from(['.modal__head > *', '.modal__form > *:not(.form-ok)'], { y: 40, opacity: 0, duration: 1, stagger: .06 }, .5);
  };
  const closeModal = () => {
    if (!modalTl) return;
    gsap.timeline({ onComplete: () => { gsap.set(modal, { visibility: 'hidden' }); modal.setAttribute('aria-hidden', 'true'); lenis && lenis.start(); $('#apptForm').classList.remove('is-sent'); } })
      .to('.modal__box', { clipPath: 'circle(0% at 50% 50%)', scale: .9, duration: .8, ease: 'expo.inOut' })
      .to('.modal__bg', { opacity: 0, duration: .4 }, .4);
    modalTl = null;
  };
  $$('.js-open-modal').forEach(b => b.addEventListener('click', openModal));
  $('#modalClose').addEventListener('click', closeModal);
  $('#modalBg').addEventListener('click', closeModal);
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); if (menuOpen) toggleMenu(false); } });

  /* ---------- Forms (demo: sunucu bağlantısı eklenecek) ---------- */
  const handleForm = (form, after) => form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('[required]', form).forEach(inp => {
      const wrap = inp.closest('.field, .check');
      const bad = inp.type === 'checkbox' ? !inp.checked : !inp.value.trim();
      wrap.classList.remove('is-error'); void wrap.offsetWidth;
      if (bad) { wrap.classList.add('is-error'); ok = false; }
    });
    if (!ok) return;
    form.classList.add('is-sent');
    setTimeout(() => { form.reset(); after && after(); setTimeout(() => form.classList.remove('is-sent'), 900); }, 3200);
  });
  handleForm($('#contactForm'));
  handleForm($('#apptForm'), closeModal);
  $$('.field input, .field textarea, .check input').forEach(i => i.addEventListener('input', () => i.closest('.field, .check').classList.remove('is-error')));
})();
