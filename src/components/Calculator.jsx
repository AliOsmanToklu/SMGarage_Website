import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { CARS } from '../data';
import { Eyebrow, Lines, useAppointment } from './ui';

const pulse = el => el && gsap.fromTo(el, { scale: .96, borderColor: '#ff7a1a' }, { scale: 1, borderColor: 'rgba(255,255,255,.16)', duration: .8, ease: 'elastic.out(1,.5)' });
const tweenNum = (el, to, suffix = '') => {
  const o = { v: 0 };
  gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v) + suffix; } });
};

export default function Calculator() {
  const openAppointment = useAppointment();
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [engineName, setEngineName] = useState('');
  const modelSel = useRef(null), engineSel = useRef(null), rows = useRef(null);

  const models = brand ? Object.keys(CARS[brand]) : [];
  const engines = brand && model ? CARS[brand][model] : [];
  const car = engines.find(e => e[0] === engineName);

  useEffect(() => { if (brand) pulse(modelSel.current); }, [brand]);
  useEffect(() => { if (model) pulse(engineSel.current); }, [model]);

  // Seçim yapılınca çubuklar dolar, sayılar artar
  useEffect(() => {
    if (!car) return;
    const [, hp, nm, hp1, nm1] = car, maxHp = hp1 * 1.12, maxNm = nm1 * 1.12;
    const q = s => rows.current.querySelector(s);
    const ctx = gsap.context(() => {
      gsap.fromTo(q('.b-hp-s'), { scaleX: 0 }, { scaleX: hp / maxHp, duration: 1.4, ease: 'expo.out', delay: .1 });
      gsap.fromTo(q('.b-hp-t'), { scaleX: 0 }, { scaleX: hp1 / maxHp, duration: 1.8, ease: 'expo.out', delay: .3 });
      gsap.fromTo(q('.b-nm-s'), { scaleX: 0 }, { scaleX: nm / maxNm, duration: 1.4, ease: 'expo.out', delay: .2 });
      gsap.fromTo(q('.b-nm-t'), { scaleX: 0 }, { scaleX: nm1 / maxNm, duration: 1.8, ease: 'expo.out', delay: .4 });
      tweenNum(q('.v-hp-s'), hp, ' HP'); tweenNum(q('.v-hp-t'), hp1, ' HP');
      tweenNum(q('.v-nm-s'), nm, ' Nm'); tweenNum(q('.v-nm-t'), nm1, ' Nm');
      const gains = [[q('.g-hp'), hp1 - hp], [q('.g-nm'), nm1 - nm]];
      gains.forEach(([el, to]) => {
        const o = { v: 0 };
        gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => { el.textContent = `+${Math.round(o.v)}`; } });
      });
      gsap.fromTo(gains.map(g => g[0]), { scale: .4, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, stagger: .1, ease: 'back.out(3)', delay: .6 });
    }, rows);
    return () => ctx.revert();
  }, [car]);

  return (
    <section className="calc section" id="hesaplama">
      <div className="container">
        <div className="calc__head">
          <Eyebrow>Chip Tuning Hesaplama</Eyebrow>
          <Lines lines={['Aracınız ne kadar', <em key="e">güçlenebilir?</em>]} />
        </div>
        <div className="calc__box" data-reveal="">
          <div className="calc__form">
            <label className="field">
              <span>Marka</span>
              <select value={brand} onChange={e => { setBrand(e.target.value); setModel(''); setEngineName(''); }}>
                <option value="">Marka seçin</option>
                {Object.keys(CARS).map(b => <option key={b}>{b}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Model</span>
              <select ref={modelSel} value={model} disabled={!models.length} onChange={e => { setModel(e.target.value); setEngineName(''); }}>
                <option value="">{brand ? 'Model seçin' : 'Önce marka seçin'}</option>
                {models.map(m => <option key={m}>{m}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Motor</span>
              <select ref={engineSel} value={engineName} disabled={!engines.length} onChange={e => setEngineName(e.target.value)}>
                <option value="">{model ? 'Motor seçin' : 'Önce model seçin'}</option>
                {engines.map(e => <option key={e[0]}>{e[0]}</option>)}
              </select>
            </label>
            <p className="calc__note">* Değerler tahminidir; kesin sonuç dyno ölçümü ile belirlenir.</p>
          </div>
          <div className={`calc__result${car ? ' has-data' : ''}`}>
            <div className="calc__empty">
              <svg viewBox="0 0 64 64"><circle cx="32" cy="36" r="20" /><path d="M32 36l10-12" /></svg>
              <span>Sonuçları görmek için aracınızı seçin</span>
            </div>
            <div className="calc__rows" ref={rows}>
              {[['Güç (HP)', 'hp'], ['Tork (Nm)', 'nm']].map(([label, k]) => (
                <div className="crow" key={k}>
                  <div className="crow__label">{label}</div>
                  <div className="crow__bars">
                    <div className="bar bar--s"><i className={`b-${k}-s`} /><span className={`v-${k}-s`}>0</span></div>
                    <div className="bar bar--t"><i className={`b-${k}-t`} /><span className={`v-${k}-t`}>0</span></div>
                  </div>
                  <div className={`crow__gain g-${k}`}>+0</div>
                </div>
              ))}
              <div className="calc__legend"><span className="l l--stock"><i />Orijinal</span><span className="l l--tuned"><i />SM Stage 1</span></div>
              <button className="btn btn--primary" data-cursor="hover"
                onClick={() => openAppointment({ service: 'Chip Tuning', vehicle: `${brand} ${model} ${engineName}` })}>
                <span>Bu araç için randevu al</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
