import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TESTIMONIALS } from '../data';
import { $$ } from '../lib/utils';
import { Eyebrow } from './ui';
import { ArrowIcon, ArrowLeftIcon } from './Icons';

const SLIDE_MS = 6;

export default function Testimonials() {
  const wrapRef = useRef(null);
  const go = useRef(() => {});
  const idx = useRef(0);

  useEffect(() => {
    const wrap = wrapRef.current, slides = $$('.tslide', wrap), dots = $$('.testi__dots button', wrap);
    let timer = null;
    const runDot = () => {
      dots.forEach(d => gsap.set(d.firstChild, { scaleX: 0 }));
      timer?.kill();
      timer = gsap.to(dots[idx.current].firstChild, { scaleX: 1, duration: SLIDE_MS, ease: 'none', onComplete: () => go.current(idx.current + 1) });
    };
    go.current = n => {
      n = (n + slides.length) % slides.length;
      if (n === idx.current) return runDot();
      const out = slides[idx.current], inn = slides[n];
      gsap.to($$('.wd, footer', out), { y: -40, opacity: 0, rotateX: 40, duration: .6, stagger: .012, ease: 'power3.in', onComplete: () => out.classList.remove('is-active') });
      inn.classList.add('is-active');
      gsap.fromTo($$('.wd, footer', inn), { y: 50, opacity: 0, rotateX: -60, transformPerspective: 500 }, { y: 0, opacity: 1, rotateX: 0, duration: 1.1, stagger: .022, ease: 'expo.out', delay: .5 });
      idx.current = n;
      runDot();
    };
    const io = new IntersectionObserver(([en]) => { if (en.isIntersecting) { io.disconnect(); runDot(); } }, { threshold: .3 });
    io.observe(wrap);
    const pause = () => timer?.pause(), resume = () => timer?.resume();
    wrap.addEventListener('mouseenter', pause);
    wrap.addEventListener('mouseleave', resume);
    return () => { io.disconnect(); timer?.kill(); wrap.removeEventListener('mouseenter', pause); wrap.removeEventListener('mouseleave', resume); };
  }, []);

  return (
    <section className="testi section" id="yorumlar">
      <div className="container">
        <Eyebrow>Müşteri Yorumları</Eyebrow>
        <div className="testi__wrap" data-reveal="" ref={wrapRef}>
          <div className="testi__quote">“</div>
          <div className="testi__slides">
            {TESTIMONIALS.map((t, i) => (
              <blockquote className={`tslide${i === 0 ? ' is-active' : ''}`} key={t.name}>
                <p>{t.text.split(' ').map((w, j) => <span className="wd" key={j}>{w} </span>)}</p>
                <footer><b>{t.name}</b><span>{t.car}</span></footer>
              </blockquote>
            ))}
          </div>
          <div className="testi__nav">
            <button className="testi__btn" aria-label="Önceki" data-cursor="hover" onClick={() => go.current(idx.current - 1)}><ArrowLeftIcon /></button>
            <div className="testi__dots">
              {TESTIMONIALS.map((t, i) => <button key={t.name} aria-label={`Yorum ${i + 1}`} onClick={() => go.current(i)}><i /></button>)}
            </div>
            <button className="testi__btn" aria-label="Sonraki" data-cursor="hover" onClick={() => go.current(idx.current + 1)}><ArrowIcon /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
