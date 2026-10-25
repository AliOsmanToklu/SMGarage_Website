import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FAQ } from '../data';
import { Eyebrow, Lines } from './ui';

export default function Faq() {
  const [open, setOpen] = useState(-1);
  const answers = useRef([]);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) { first.current = false; return; }
    answers.current.forEach((el, i) => {
      if (i === open) {
        gsap.to(el, { height: 'auto', duration: .9, ease: 'expo.out', onComplete: () => ScrollTrigger.refresh() });
        gsap.fromTo(el.firstChild, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .8, delay: .1, ease: 'expo.out' });
      } else {
        gsap.to(el, { height: 0, duration: .7, ease: 'expo.out' });
      }
    });
  }, [open]);

  return (
    <section className="faq section" id="sss">
      <div className="container faq__inner">
        <div>
          <Eyebrow>Sıkça Sorulanlar</Eyebrow>
          <Lines lines={['Aklınızdaki', <em key="e">sorular.</em>]} />
        </div>
        <div className="faq__list">
          {FAQ.map(([q, a], i) => (
            <div className={`qa${open === i ? ' is-open' : ''}`} data-reveal="" key={q}>
              <button className="qa__q" data-cursor="hover" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>{q}<i /></button>
              <div className="qa__a" ref={el => { answers.current[i] = el; }}><p>{a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
