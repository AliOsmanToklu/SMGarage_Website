import { MARQUEE, SERVICES, STEPS } from '../data';
import { Eyebrow, Lines, useAppointment } from './ui';
import { ArrowIcon, CheckIcon } from './Icons';
import '../craft.css';

export function Marquee() {
  const row = MARQUEE.flatMap(t => [<span key={t}>{t}</span>, <i key={`${t}-i`}>/</i>]);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" id="marquee">{row}</div>
    </div>
  );
}

const ABOUT_TEXT = 'Aracınızın bakım ve onarım ihtiyaçlarını değerlendiriyor, arıza tespiti, mekanik onarım ve ECU yazılımı alanlarında hizmet sunuyoruz. İşlem kapsamı aracın durumuna göre belirlenir.';

// Tecrübe yılı: değer girilince (örn. 15) rozet otomatik görünür
const EXPERIENCE_YEARS = null;

export function About() {
  return (
    <section className="about section" id="hakkimizda">
      <div className="section__num" aria-hidden="true">01</div>
      <div className="container about__inner">
        <div className="about__visual" data-reveal-clip="">
          <div className="about__card">
            <svg className="about__circuit" viewBox="0 0 400 480" aria-hidden="true">
              <g className="circuit">
                <path d="M20 60 H140 V140 H260" /><path d="M20 120 H90 V220 H200" /><path d="M380 80 H300 V160 H240" />
                <path d="M380 220 H320 V300 H220" /><path d="M40 420 H140 V340 H200" /><path d="M360 440 H280 V360 H230" />
                <path d="M200 20 V100" /><path d="M200 460 V380" />
              </g>
              <g className="circuit-nodes">
                {[[20, 60], [20, 120], [380, 80], [380, 220], [40, 420], [360, 440], [200, 20], [200, 460]].map(([cx, cy]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="5" />)}
              </g>
              <rect className="chip" x="140" y="170" width="120" height="140" rx="10" />
              <g className="chip-pins"><path d="M140 190h-14M140 210h-14M140 230h-14M140 250h-14M140 270h-14M140 290h-14M260 190h14M260 210h14M260 230h14M260 250h14M260 270h14M260 290h14" /></g>
              <text x="200" y="235" className="chip-label">ECU</text>
              <text x="200" y="262" className="chip-sub">SM GARAGE</text>
            </svg>
            {EXPERIENCE_YEARS && (
              <div className="about__year">
                <b data-count={EXPERIENCE_YEARS} data-suffix="+">0</b>
                <span>Yıllık<br />Tecrübe</span>
              </div>
            )}
          </div>
        </div>
        <div className="about__content">
          <Eyebrow>SM Garage Hakkında</Eyebrow>
          <Lines lines={['Yazılım ve mekanik', <em key="e">bir arada.</em>]} />
          <p className="about__scrub" id="aboutScrub">
            {ABOUT_TEXT.split(' ').map((w, i) => <span className="w" key={i}>{w} </span>)}
          </p>
          <ul className="about__list">
            {['ECU yazılım ve araç değerlendirmesi', 'Motor, şanzıman, turbo, fren ve süspansiyon işlemleri', 'Bilgisayarlı arıza tespiti ve mekanik kontrol']
              .map(t => <li data-reveal="" key={t}><CheckIcon />{t}</li>)}
          </ul>
          <a href="#hizmetler" className="link-arrow" data-reveal="" data-cursor="hover">Hizmetlerimizi keşfet <ArrowIcon /></a>
        </div>
      </div>
    </section>
  );
}

export function Services() {
  const openAppointment = useAppointment();
  return (
    <section className="services" id="hizmetler">
      <div className="services__pin">
        <div className="services__head container">
          <div>
            <Eyebrow>ECU Yazılım & Mekanik Onarım</Eyebrow>
            <Lines lines={['Aracınız için', <em key="e">hizmetler.</em>]} />
          </div>
          <p className="services__intro">İhtiyacınız olan işlemi seçin; araç ve hizmet detaylarını randevu talebinizde paylaşın.</p>
        </div>
        <div className="services__track" id="svcTrack">
          {SERVICES.map((s, i) => (
            <article className="svc" key={s.title}>
              <span className="svc__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div className="svc__icon" aria-hidden="true"><svg viewBox="0 0 64 64">{s.icon}</svg></div>
              <span className="svc__tag">{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul>{s.chips.map(c => <li key={c}>{c}</li>)}</ul>
              <button className="svc__more" data-cursor="hover" onClick={() => openAppointment({ service: s.option })} aria-label={`${s.title} için randevu alın`}>Randevu alın →</button>
            </article>
          ))}
          <article className="svc svc--cta">
            <div><span className="svc__tag">Bir sorunuz mu var?</span><h3>Aracınızın ihtiyacını birlikte değerlendirelim.</h3></div>
            <button className="btn btn--primary btn--lg" onClick={() => openAppointment()}><span>Randevu alın</span></button>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="process section" id="surec">
      <div className="section__num" aria-hidden="true">03</div>
      <div className="container">
        <Eyebrow>Nasıl Çalışıyoruz?</Eyebrow>
        <Lines lines={['4 adımda', <em key="e">servis süreci.</em>]} />
        <div className="process__list" id="processList">
          <div className="process__line"><i id="processFill" /></div>
          {STEPS.map(([title, text], i) => (
            <div className="step" key={title}>
              <div className="step__dot"><span>{String(i + 1).padStart(2, '0')}</span></div>
              <div className="step__body"><h4>{title}</h4><p>{text}</p></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Cta() {
  const openAppointment = useAppointment();
  return (
    <section className="cta" id="cta">
      <div className="cta__lines" aria-hidden="true"><i /><i /><i /><i /><i /></div>
      <div className="container cta__inner">
        <Lines className="cta__title" lines={['Aracınız için', <em key="e">randevu alın.</em>]} />
        <button className="cta__btn magnetic" data-cursor="hover" onClick={() => openAppointment()}>
          <span className="cta__btn-txt">Randevu alın</span>
          <svg viewBox="0 0 200 200" className="cta__btn-ring">
            <defs><path id="circ" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
            <text><textPath href="#circ">SM GARAGE • ECU YAZILIM • MEKANİK ONARIM • </textPath></text>
          </svg>
        </button>
      </div>
    </section>
  );
}
