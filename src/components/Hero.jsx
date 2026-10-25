import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { G, ang, arc, polar, engine } from '../lib/engine';
import { fmt, isTouch, prefersReduced } from '../lib/utils';
import { Logo, Split, useAppointment } from './ui';
import { ArrowIcon } from './Icons';

/* ---------- Devir saati ---------- */
const TICKS = [];
const NUMS = [];
for (let v = 0; v <= G.max; v += 250) {
  const major = v % 1000 === 0, [x1, y1] = polar(144, ang(v)), [x2, y2] = polar(major ? 122 : 134, ang(v));
  TICKS.push({ v, x1, y1, x2, y2, cls: `${major ? 'major' : ''} ${v >= G.red ? 'red' : ''}`.trim() });
  if (major) {
    const [x, y] = polar(104, ang(v));
    NUMS.push({ v, x, y, red: v >= 7000 });
  }
}
const TRACK = arc(160, ang(0), ang(G.max));
const RED = arc(160, ang(G.red), ang(G.max));

function Gauge() {
  const fillRef = useRef(null), needleRef = useRef(null), rpmRef = useRef(null), hpRef = useRef(null), boxRef = useRef(null);
  const [touch] = useState(isTouch);

  useEffect(() => {
    const fill = fillRef.current, len = fill.getTotalLength();
    fill.style.strokeDasharray = len;
    fill.style.strokeDashoffset = len;
    engine.render = () => {
      const r = engine.rpm;
      gsap.set(needleRef.current, { rotation: ang(r), svgOrigin: '200 200' });
      fill.style.strokeDashoffset = len * (1 - r / G.max);
      rpmRef.current.textContent = fmt(Math.round(r / 10) * 10);
      hpRef.current.textContent = Math.round(286 * Math.sin(Math.min(r / 6200, 1) * Math.PI / 2) * (r > 6200 ? 1 - (r - 6200) / 9000 : 1));
      const shake = r > 6000 ? (r - 6000) / 2000 * 2.2 : 0;
      gsap.set(boxRef.current, { x: (Math.random() - .5) * shake, y: (Math.random() - .5) * shake });
    };
    engine.render();
    const tick = time => {
      if (!engine.live) return;
      if (engine.revving) {
        engine.target = engine.rpm > 7300 ? 7000 + Math.random() * 300 : 7600; // devir sınırlayıcı
        engine.rpm += (engine.target - engine.rpm) * .075;
      } else {
        engine.target = 880 + Math.sin(time * 9) * 25 + Math.random() * 20;
        engine.rpm += (engine.target - engine.rpm) * .045;
      }
      engine.render();
    };
    gsap.ticker.add(tick);
    return () => { gsap.ticker.remove(tick); engine.render = () => {}; };
  }, []);

  const handlers = touch
    ? { onClick: () => { engine.revving = !engine.revving; } }
    : { onMouseEnter: () => { engine.revving = true; }, onMouseLeave: () => { engine.revving = false; } };

  return (
    <div className="hero__visual" id="gauge" data-cursor="rev" {...handlers}>
      <div className="gauge" ref={boxRef}>
        <svg className="gauge__svg" viewBox="0 0 400 400">
          <defs>
            <linearGradient id="gArc" x1="0" y1="1" x2="1" y2="0">
              <stop offset="0" stopColor="#ff7a1a" />
              <stop offset="1" stopColor="#ff1f3d" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <circle cx="200" cy="200" r="190" className="gauge__bezel" />
          <path className="gauge__track" d={TRACK} />
          <path className="gauge__red" d={RED} />
          <path className="gauge__fill" d={TRACK} filter="url(#glow)" ref={fillRef} />
          <g id="gTicks" className="gauge__ticks">
            {TICKS.map(t => <line key={t.v} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} className={t.cls || undefined} />)}
          </g>
          <g id="gNums" className="gauge__nums">
            {NUMS.map(n => <text key={n.v} x={n.x} y={n.y} className={n.red ? 'red' : undefined}>{n.v / 1000}</text>)}
          </g>
          <g className="gauge__needle" ref={needleRef}>
            <path d="M196 200 L200 52 L204 200 Z" />
            <circle cx="200" cy="200" r="16" className="gauge__hub" />
            <circle cx="200" cy="200" r="6" className="gauge__hubdot" />
          </g>
        </svg>
        <Logo className="gauge__brand" alt="" />
        <div className="gauge__readout">
          <div className="gauge__rpm"><b ref={rpmRef}>0</b><span>RPM ×1</span></div>
          <div className="gauge__hp"><b ref={hpRef}>0</b><span>HP</span></div>
        </div>
        <div className="gauge__hint">{touch ? 'Devirlemek için dokun' : 'Devirlemek için üzerine gel'}</div>
      </div>
      <div className="hero__badge hero__badge--a"><span>ECU Stage 1</span><b>+%30</b></div>
      <div className="hero__badge hero__badge--b"><span>Mekanik</span><b>Tam Servis</b></div>
    </div>
  );
}

/* ---------- Kıvılcım & hız çizgileri ---------- */
function HeroCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current, ctx = cv.getContext('2d');
    let W = 0, H = 0, streaks = [], embers = [], visible = true, resizeT;
    const newStreak = init => ({ x: init ? Math.random() * W : W + Math.random() * 200, y: Math.random() * H, len: 40 + Math.random() * 220, v: 2 + Math.random() * 7, a: .05 + Math.random() * .35, hot: Math.random() < .22 });
    const newEmber = init => ({ x: Math.random() * W, y: init ? Math.random() * H : H + 20, r: .6 + Math.random() * 2.2, vy: .3 + Math.random() * 1.4, vx: (Math.random() - .5) * .6, life: Math.random() * Math.PI * 2 });
    const resize = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = cv.offsetWidth; H = cv.offsetHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      streaks = Array.from({ length: Math.round(W / 16) }, () => newStreak(true));
      embers = Array.from({ length: Math.round(W / 22) }, () => newEmber(true));
    };
    const draw = () => {
      if (!visible) return;
      const m = engine.mouse, boost = 1 + engine.rpm / 1400, stretch = Math.min(boost, 2.6), dy = (m.y - .5) * 30;
      ctx.clearRect(0, 0, W, H);
      ctx.lineCap = 'round';
      for (const s of streaks) {
        s.x -= s.v * boost;
        if (s.x + s.len < 0) Object.assign(s, newStreak(false));
        const g = ctx.createLinearGradient(s.x, 0, s.x + s.len * stretch, 0), c = s.hot ? '255,60,50' : '255,255,255';
        g.addColorStop(0, `rgba(${c},${s.a})`); g.addColorStop(1, `rgba(${c},0)`);
        ctx.strokeStyle = g; ctx.lineWidth = s.hot ? 1.6 : 1;
        ctx.beginPath(); ctx.moveTo(s.x, s.y + dy); ctx.lineTo(s.x + s.len * stretch, s.y + dy); ctx.stroke();
      }
      ctx.globalCompositeOperation = 'lighter';
      for (const e of embers) {
        e.life += .05; e.y -= e.vy * (1 + boost * .25); e.x += e.vx + Math.sin(e.life) * .4 + (m.x - .5) * .8;
        if (e.y < -20) Object.assign(e, newEmber(false));
        ctx.fillStyle = `rgba(255,${100 + Math.round(Math.random() * 60)},40,${.45 + Math.sin(e.life * 3) * .35})`;
        ctx.shadowColor = '#ff4a1a'; ctx.shadowBlur = 10;
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill();
      }
      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
    };
    const onResize = () => { clearTimeout(resizeT); resizeT = setTimeout(resize, 150); };
    resize();
    window.addEventListener('resize', onResize);
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    io.observe(cv.parentElement);
    const reduce = prefersReduced();
    if (reduce) draw(); else gsap.ticker.add(draw);
    return () => { window.removeEventListener('resize', onResize); io.disconnect(); gsap.ticker.remove(draw); };
  }, []);
  return <canvas className="hero__canvas" ref={ref} />;
}

export default function Hero() {
  const openAppointment = useAppointment();
  return (
    <section className="hero" id="hero">
      <HeroCanvas />
      <div className="hero__grid" aria-hidden="true" />
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__bigtext" aria-hidden="true">PERFORMANCE</div>

      <div className="container hero__inner">
        <div className="hero__content">
          <div className="hero__eyebrow"><span className="line" />ECU Yazılım · Mekanik Onarım</div>
          <h1 className="hero__title" aria-label="Gücü yeniden tanımla.">
            <span className="hero__row"><Split text="Gücü" /></span>
            <span className="hero__row"><Split text="Yeniden" className="stroke" /></span>
            <span className="hero__row"><Split text="Tanımla." className="accent" /></span>
          </h1>
          <p className="hero__lead">Yazılımdan motora, aracınızın her ihtiyacı tek çatı altında. Dyno ölçümlü ECU yazılım, bilgisayarlı arıza tespit ve uzman ustalarla <b>mekanik onarım</b>.</p>
          <div className="hero__ctas">
            <button className="btn btn--primary btn--lg magnetic" data-cursor="hover" onClick={() => openAppointment()}><span>Hemen Randevu Al</span><ArrowIcon /></button>
            <a href="#hesaplama" className="btn btn--ghost btn--lg magnetic" data-cursor="hover"><span>Güç Hesapla</span></a>
          </div>
          <div className="hero__mini">
            <div><b data-count="30" data-prefix="+%">0</b><span>Güç artışı</span></div>
            <div><b data-count="20" data-prefix="%">0</b><span>Yakıt tasarrufu</span></div>
            <div><b>ECU+</b><span>Mekanik tek çatı altında</span></div>
          </div>
        </div>
        <Gauge />
      </div>

      <a href="#hakkimizda" className="hero__scroll" aria-label="Aşağı kaydır"><span>Kaydır</span><i /></a>
    </section>
  );
}
