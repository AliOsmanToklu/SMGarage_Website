import { useState } from 'react';
import { FAQ } from '../data';
import { Eyebrow, Lines } from './ui';

export default function Faq() {
  const [open, setOpen] = useState(-1);
  return (
    <section className="faq section" id="sss">
      <div className="container faq__inner">
        <div><Eyebrow>Sıkça Sorulanlar</Eyebrow><Lines lines={['Aklınızdaki', <em key="e">sorular.</em>]} /></div>
        <div className="faq__list">
          {FAQ.map(([q, a], i) => (
            <div className={`qa${open === i ? ' is-open' : ''}`} key={q}>
              <button className="qa__q" aria-expanded={open === i} aria-controls={`answer-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>{q}<i aria-hidden="true" /></button>
              <div className="qa__a" id={`answer-${i}`} hidden={open !== i}><p>{a}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
