// FEEL INDIA site behaviour v2: header over hero, phone menu, scroll reveal, product gallery + colour switch, shop filter.
// Everything works without JS (all photos visible, menu links repeated in the footer).
(() => {
  const d = document;
  const hdr = d.querySelector('.site-header.over');
  if (hdr) {
    const on = () => hdr.classList.toggle('solid', window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
  }

  const openBtn = d.querySelector('[data-menu-btn]');
  const closeBtn = d.querySelector('[data-menu-close]');
  const sheet = d.getElementById('menu');
  if (openBtn && sheet) {
    const set = (open) => {
      openBtn.setAttribute('aria-expanded', String(open));
      d.body.classList.toggle('menu-open', open);
      if (open) (sheet.querySelector('.menu-links a') || closeBtn).focus(); else openBtn.focus();
    };
    openBtn.addEventListener('click', () => set(true));
    if (closeBtn) closeBtn.addEventListener('click', () => set(false));
    d.addEventListener('keydown', (e) => { if (e.key === 'Escape' && d.body.classList.contains('menu-open')) set(false); });
  }

  const els = d.querySelectorAll('[data-reveal]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add('in'));

  const pdp = d.querySelector('[data-pdp]');
  if (pdp) {
    const main = pdp.querySelector('.main img');
    const thumbs = [...pdp.querySelectorAll('.thumbs button')];
    const colorBtns = [...pdp.querySelectorAll('.colors button')];
    const colorName = pdp.querySelector('[data-color-name]');
    const show = (btn) => {
      thumbs.forEach((t) => t.setAttribute('aria-current', String(t === btn)));
      main.removeAttribute('srcset'); main.removeAttribute('sizes');
      main.src = btn.dataset.src;
      main.alt = btn.dataset.alt;
      main.className = btn.dataset.kind;
      main.style.objectPosition = btn.dataset.pos || '';
      main.removeAttribute('width'); main.removeAttribute('height');
    };
    thumbs.forEach((t) => t.addEventListener('click', () => show(t)));
    const pick = (b, showFirst) => {
      colorBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      if (colorName) colorName.textContent = b.dataset.kr;
      let first = null;
      thumbs.forEach((t) => { const on = t.dataset.color === b.dataset.color; t.hidden = !on; if (on && !first) first = t; });
      if (first && showFirst !== false) show(first);
    };
    colorBtns.forEach((b) => b.addEventListener('click', () => pick(b)));
    if (colorBtns.length > 1) pick(colorBtns[0], false);
  }

  const bar = d.querySelector('[data-filter-bar]');
  if (bar) {
    const btns = [...bar.querySelectorAll('button')];
    const cards = [...d.querySelectorAll('.shop [data-line]')];
    btns.forEach((b) => b.addEventListener('click', () => {
      btns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      const f = b.dataset.filter;
      cards.forEach((c) => { c.hidden = !(f === 'all' || c.dataset.line === f); });
    }));
  }
})();
