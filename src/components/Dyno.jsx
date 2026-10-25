import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { clamp, fmt } from '../lib/utils';
import { Eyebrow, Lines } from './ui';

const D = { x0: 56, x1: 580, y0: 340, y1: 24, r0: 1000, r1: 5000, hpMax: 220 };
const shape = s => { const v = Math.pow(s, .7) * (1 - .35 * Math.pow(s, 4)); return .22 + .78 * v / .733; };
const stockHp = r => 150 * shape((r - D.r0) / (D.r1 - D.r0));
const tunedHp = r => { const s = (r - D.r0) / (D.r1 - D.r0); return stockHp(r) * (1.2 + .1 * Math.sin(Math.PI * s)); };
const X = r => D.x0 + (r - D.r0) / (D.r1 - D.r0) * (D.x1 - D.x0);
const Y = hp => D.y0 - hp / D.hpMax * (D.y0 - D.y1);
const pathFor = fn => {
  let d = '';
  for (let i = 0; i <= 120; i++) { const r = D.r0 + (D.r1 - D.r0) * i / 120; d += `${i ? 'L' : 'M'}${X(r).toFixed(1)} ${Y(fn(r)).toFixed(1)}`; }
  return d;
};
const STOCK = pathFor(stockHp), TUNED = pathFor(tunedHp), AREA = TUNED + `L${D.x1} ${D.y0}L${D.x0} ${D.y0}Z`;
const HP_LINES = [0, 50, 100, 150, 200], RPM_LINES = [1000, 2000, 3000, 4000, 5000];

export default function Dyno() {
  const chartRef = useRef(null), svgRef = useRef(null), clipS = useRef(null), clipT = useRef(null);
  const cross = useRef(null), dotS = useRef(null), dotT = useRef(null), vRpm = useRef(null), vStock = useRef(null), vTuned = useRef(null);
  const ready = useRef(false);

  const setDyno = r => {
    r = clamp(r, D.r0, D.r1);
    const x = X(r), s = stockHp(r), t = tunedHp(r);
    cross.current.setAttribute('x1', x); cross.current.setAttribute('x2', x);
    dotS.current.setAttribute('cx', x); dotS.current.setAttribute('cy', Y(s));
    dotT.current.setAttribute('cx', x); dotT.current.setAttribute('cy', Y(t));
    vRpm.current.textContent = fmt(r);
    vStock.current.textContent = `${Math.round(s)} HP`;
    vTuned.current.textContent = `${Math.round(t)} HP`;
  };

  // Ekrana gelince: eğriler çizilir, tarayıcı çizgisi soldan sağa geçer
  useEffect(() => {
    const chart = chartRef.current;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const o = { r: D.r0 };
      chart.classList.add('is-hover');
      gsap.timeline({ onComplete: () => { ready.current = true; chart.classList.remove('is-hover'); setDyno(3800); } })
        .to(clipS.current, { attr: { width: 600 }, duration: 1.8, ease: 'power2.inOut' })
        .to(clipT.current, { attr: { width: 600 }, duration: 2.2, ease: 'power2.inOut' }, .5)
        .to(o, { r: D.r1, duration: 2.2, ease: 'power2.inOut', onUpdate: () => setDyno(o.r) }, .5);
    }, { rootMargin: '0px 0px -30% 0px' });
    io.observe(chart);
    return () => io.disconnect();
  }, []);

  const onMove = e => {
    if (!ready.current) return;
    const pt = svgRef.current.createSVGPoint();
    pt.x = e.clientX; pt.y = e.clientY;
    const p = pt.matrixTransform(svgRef.current.getScreenCTM().inverse());
    setDyno(D.r0 + (p.x - D.x0) / (D.x1 - D.x0) * (D.r1 - D.r0));
    chartRef.current.classList.add('is-hover');
  };
  const onLeave = () => ready.current && chartRef.current.classList.remove('is-hover');

  return (
    <section className="dyno section" id="dyno">
      <div className="section__num" aria-hidden="true">02</div>
      <div className="container dyno__inner">
        <div className="dyno__content">
          <Eyebrow>Dyno Ölçüm</Eyebrow>
          <Lines lines={['Tahmin değil,', <em key="e">ölçüm.</em>]} />
          <p data-reveal="">Her yazılım işlemi öncesi ve sonrası aracınız dinamometrede ölçülür. Grafik üzerinde gezinerek farkı kendiniz görün.</p>
          <div className="dyno__legend" data-reveal="">
            <span className="l l--stock"><i />Orijinal</span>
            <span className="l l--tuned"><i />SM Stage 1</span>
          </div>
          <div className="dyno__read" data-reveal="">
            <div><span>Devir</span><b ref={vRpm}>—</b></div>
            <div><span>Orijinal</span><b ref={vStock}>—</b></div>
            <div><span>Stage 1</span><b ref={vTuned} className="accent">—</b></div>
          </div>
        </div>
        <div className="dyno__chart" data-reveal-clip="" data-cursor="hover" ref={chartRef} onPointerMove={onMove} onPointerLeave={onLeave}>
          <svg viewBox="0 0 600 380" ref={svgRef}>
            <defs>
              <linearGradient id="dArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ff2d3d" stopOpacity=".35" />
                <stop offset="1" stopColor="#ff2d3d" stopOpacity="0" />
              </linearGradient>
              <clipPath id="cS"><rect ref={clipS} x="0" y="0" width="0" height="380" /></clipPath>
              <clipPath id="cT"><rect ref={clipT} x="0" y="0" width="0" height="380" /></clipPath>
            </defs>
            <g className="dyno__grid">
              {HP_LINES.map(hp => (
                <g key={hp}><line x1={D.x0} x2={D.x1} y1={Y(hp)} y2={Y(hp)} /><text x={D.x0 - 10} y={Y(hp) + 4} textAnchor="end">{hp}</text></g>
              ))}
              {RPM_LINES.map(r => (
                <g key={r}><line x1={X(r)} x2={X(r)} y1={D.y1} y2={D.y0} /><text x={X(r)} y={D.y0 + 22} textAnchor="middle">{r}</text></g>
              ))}
              <text x={D.x1} y={D.y0 + 38} textAnchor="end">RPM</text>
              <text x={D.x0 - 10} y="12" textAnchor="end">HP</text>
            </g>
            <path d={AREA} fill="url(#dArea)" clipPath="url(#cT)" />
            <path d={STOCK} className="dyno__stock" clipPath="url(#cS)" />
            <path d={TUNED} className="dyno__tuned" filter="url(#glow)" clipPath="url(#cT)" />
            <line ref={cross} className="dyno__cross" y1="20" y2="340" />
            <circle ref={dotS} r="5" className="dyno__dot dyno__dot--s" />
            <circle ref={dotT} r="6" className="dyno__dot dyno__dot--t" />
          </svg>
        </div>
      </div>
    </section>
  );
}
