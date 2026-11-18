// FEEL INDIA site behaviour: product gallery + colour switch, shop filter. Works without JS too (all photos visible).
(() => {
  const pdp = document.querySelector('[data-pdp]');
  if (pdp) {
    const main = pdp.querySelector('.main img');
    const thumbs = [...pdp.querySelectorAll('.thumbs button')];
    const colorBtns = [...pdp.querySelectorAll('.colors button')];
    const colorName = pdp.querySelector('[data-color-name]');
    const show = (btn) => {
      thumbs.forEach((t) => t.setAttribute('aria-current', String(t === btn)));
      main.src = btn.dataset.src;
      main.alt = btn.dataset.alt;
      main.className = btn.dataset.kind;
      main.removeAttribute('width');
      main.removeAttribute('height');
    };
    thumbs.forEach((t) => t.addEventListener('click', () => show(t)));
    const pick = (b, focusFirst) => {
      colorBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      if (colorName) colorName.textContent = b.dataset.kr;
      let first = null;
      thumbs.forEach((t) => {
        const on = t.dataset.color === b.dataset.color;
        t.hidden = !on;
        if (on && !first) first = t;
      });
      if (first && focusFirst !== false) show(first);
    };
    colorBtns.forEach((b) => b.addEventListener('click', () => pick(b)));
    if (colorBtns.length > 1) pick(colorBtns[0], false);
  }

  const bar = document.querySelector('[data-filter-bar]');
  if (bar) {
    const btns = [...bar.querySelectorAll('button')];
    const cards = [...document.querySelectorAll('.shop [data-line]')];
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.filter;
      cards.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.line === f); });
    }));
  }
})();
