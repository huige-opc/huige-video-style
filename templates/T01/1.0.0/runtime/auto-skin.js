/* T01 automatic-edit skin, extracted unchanged from the Studio auto runtime. */
(function (root) {
  const C = EV, { el, tf } = C, k = K;
  root.HUIGE_TEMPLATE_SKINS = root.HUIGE_TEMPLATE_SKINS || {};
  root.HUIGE_TEMPLATE_SKINS.T01 = {
    win: { x: 1240, y: 150, w: 600, h: 740, r: 36, s: 1.5 },
    side: 'left', theme: 't01', cls: 'dotgrid',
    ring: () => ({ color: k.INK, width: 6, shadow: .22 }),
    bg: k.LIME,
    build: (L, i, cards) => {
      // marquee of the section's own card titles (never the demo brand text)
      const titles = [...new Set((cards || []).flatMap(c => (c.spec && c.spec.content && c.spec.content.words) || []).filter(Boolean))];
      const text = titles.slice(0, 3).join(' · ');
      return {
        rows: text ? Array.from({ length: 7 }, (_, r) => k.disp(
          L, Array(6).fill(text).join(' · '), 'rgba(11,11,13,.08)', 104, -200, -30 + r * 150
        )) : []
      };
    },
    update: (st, t, lt) => st.rows.forEach((d, i) => tf(d, {
      x: (i % 2 ? -1 : 1) * (lt * 90) - 300,
      o: 1
    }))
  };
})(window);
