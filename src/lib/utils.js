import gsap from 'gsap';

export const $ = (s, c = document) => c.querySelector(s);
export const $$ = (s, c = document) => [...c.querySelectorAll(s)];
export const isTouch = () => matchMedia('(hover: none), (pointer: coarse)').matches;
export const prefersReduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
export const fmt = n => Math.round(n).toLocaleString('tr-TR');
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const asset = path => `${import.meta.env.BASE_URL}${path}`;

export function countUp(el) {
  const end = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '', o = { v: 0 };
  gsap.to(o, { v: end, duration: 2.2, ease: 'power3.out', onUpdate: () => { el.textContent = pre + fmt(o.v) + suf; } });
}
