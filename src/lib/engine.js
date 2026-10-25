// Devir saati geometrisi ve hero'daki "motor" durumu (gauge, canvas ve intro paylaşır)
export const G = { cx: 200, cy: 200, max: 8000, a0: -135, sweep: 270, red: 6500 };
export const ang = rpm => G.a0 + (rpm / G.max) * G.sweep;
export const polar = (r, deg) => {
  const a = deg * Math.PI / 180;
  return [G.cx + r * Math.sin(a), G.cy - r * Math.cos(a)];
};
export const arc = (r, d0, d1) => {
  const [x0, y0] = polar(r, d0), [x1, y1] = polar(r, d1);
  return `M${x0} ${y0} A${r} ${r} 0 ${d1 - d0 > 180 ? 1 : 0} 1 ${x1} ${y1}`;
};

export const engine = {
  rpm: 0,
  target: 900,
  live: false,
  revving: false,
  render: () => {},
  mouse: { x: .5, y: .5 },
};
