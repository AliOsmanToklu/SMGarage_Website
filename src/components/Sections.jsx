import { asset } from '../lib/utils';
import { GALLERY, MARQUEE, SERVICES, STATS, STEPS } from '../data';
import { Eyebrow, Lines, useAppointment } from './ui';
import { ArrowIcon, CheckIcon, WrenchPath } from './Icons';

export function Marquee() {
  // iki kopya: xPercent -50 ile kesintisiz döngü
  const row = copy => MARQUEE.flatMap(t => [<span key={`${copy}${t}`}>{t}</span>, <i key={`${copy}${t}-i`}>✦</i>]);
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track" id="marquee">{row('a')}{row('b')}</div>
    </div>
  );
}

const ABOUT_TEXT = 'Modern bir araç hem yazılımıyla hem mekaniğiyle yaşar. ECU; enjektör, turbo ve EGR gibi bileşenleri yöneten aracın beynidir, ama sağlıklı çalışması için motorun, şanzımanın ve yürüyen aksamın da kusursuz olması gerekir. SM Garage olarak arızayı bilgisayarla tespit ediyor, mekanik onarımı uzman ustalarımızla yapıyor, gerektiğinde yazılımı motorunuza özel olarak yeniden kalibre ediyoruz.';

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
              <text x="200" y="262" className="chip-sub">SM-TUNE v4</text>
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
          <Lines lines={['Yazılımda usta,', <em key="e">mekanikte uzman.</em>]} />
          <p className="about__scrub" id="aboutScrub">
            {ABOUT_TEXT.split(' ').map((w, i) => <span className="w" key={i}>{w} </span>)}
          </p>
          <ul className="about__list">
            {['ECU yazılım: orijinal dosya yedeği & tam geri dönüş', 'Mekanik onarım: motor, şanzıman, turbo, fren & süspansiyon', 'Bilgisayarlı arıza tespit: doğru teşhis, gereksiz masraf yok']
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
            <Lines lines={[<>Hizmet<em>lerimiz</em></>]} />
          </div>
          <div className="services__progress"><span id="svcCur">01</span><i><b id="svcBar" /></i><span>{String(SERVICES.length).padStart(2, '0')}</span></div>
        </div>
        <div className="services__track" id="svcTrack">
          {SERVICES.map((s, i) => (
            <article className="svc" data-tilt="" key={s.title}>
              <div className="svc__glow" />
              <span className="svc__num">{String(i + 1).padStart(2, '0')}</span>
              <div className="svc__icon"><svg viewBox="0 0 64 64">{s.icon}</svg></div>
              <span className="svc__tag">{s.tag}</span>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <ul>{s.chips.map(c => <li key={c}>{c}</li>)}</ul>
              <button className="svc__more" data-cursor="hover" onClick={() => openAppointment({ service: s.option })}>Randevu Al →</button>
            </article>
          ))}
          <article className="svc svc--cta">
            <h3>Aracınız için en doğru çözümü birlikte bulalım.</h3>
            <button className="btn btn--primary btn--lg magnetic" data-cursor="hover" onClick={() => openAppointment()}><span>Ücretsiz Danışın</span></button>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Stats() {
  return (
    <section className="stats section" id="performans">
      <div className="stats__bg" aria-hidden="true" />
      <div className="container">
        <div className="stats__head">
          <Eyebrow>Rakamlarla SM Garage</Eyebrow>
          <Lines lines={['SM Garage ile', <em key="e">yüksek performans.</em>]} />
        </div>
        <div className="stats__grid">
          {STATS.map(s => (
            <div className="stat" data-reveal="" key={s.title}>
              <svg className="stat__ring" viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" /><circle className="p" cx="60" cy="60" r="52" data-pct={s.pct} /></svg>
              <div className="stat__val"><b data-count={s.count} data-prefix={s.prefix} data-suffix={s.suffix}>0</b></div>
              <h4>{s.title}</h4><p>{s.text}</p>
            </div>
          ))}
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
        <Lines lines={['4 adımda', <em key="e">güvenli servis.</em>]} />
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

export function Gallery() {
  return (
    <section className="gallery section" id="galeri">
      <div className="container">
        <div className="gallery__head">
          <div>
            <Eyebrow>Galeri</Eyebrow>
            <Lines lines={['Atölyeden', <em key="e">kareler.</em>]} />
          </div>
          <p data-reveal="">Dyno odası, yazılım istasyonu ve mekanik atölyemizden seçilmiş çalışmalar.</p>
        </div>
        <div className="gallery__grid">
          {GALLERY.map(g => (
            <figure className={`g${g.tall ? ' g--tall' : ''}`} data-reveal-clip="" data-cursor="view" key={g.img}>
              <div className="g__img" style={{ backgroundImage: `url('${asset(g.img)}')` }} />
              <div className="g__ph" aria-hidden="true"><svg viewBox="0 0 64 64"><path d={WrenchPath} /></svg></div>
              <figcaption><span>{g.label}</span><b lang={g.en ? 'en' : undefined}>{g.title}</b></figcaption>
            </figure>
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
        <Lines className="cta__title" lines={['Gaza basmaya', <em key="e">hazır mısın?</em>]} />
        <button className="cta__btn magnetic" data-cursor="hover" onClick={() => openAppointment()}>
          <span className="cta__btn-txt">Randevu<br />Al</span>
          <svg viewBox="0 0 200 200" className="cta__btn-ring">
            <defs><path id="circ" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" /></defs>
            <text><textPath href="#circ">SM GARAGE • ECU YAZILIM • MEKANİK ONARIM • </textPath></text>
          </svg>
        </button>
      </div>
    </section>
  );
}
