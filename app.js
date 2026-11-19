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

  // hero carousel: 3 slides, crossfade, auto-advance 6.5s. Stops on hover/focus/touch, when the tab is hidden or the hero is off-screen, and for reduced motion.
  const hero = d.querySelector('[data-hero]');
  if (hero) {
    const slides = [...hero.querySelectorAll('[data-slide]')];
    const dots = [...hero.querySelectorAll('[data-hero-go]')];
    const num = hero.querySelector('[data-hero-n]');
    const nameEl = hero.querySelector('[data-hero-name]');
    const toggle = hero.querySelector('[data-hero-toggle]');
    const track = hero.querySelector('[data-hero-track]');
    let names = []; try { names = JSON.parse(hero.dataset.names || '[]'); } catch (e) {}
    const motionOk = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let i = 0, timer = 0, userPaused = !motionOk, hold = false, seen = true;
    const go = (n) => {
      i = (n + slides.length) % slides.length;
      slides.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.setAttribute('aria-hidden', String(k !== i)); });
      dots.forEach((b, k) => { if (k === i) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      if (num) num.textContent = String(i + 1);
      if (nameEl && names[i]) nameEl.textContent = names[i];
    };
    const stop = () => { clearInterval(timer); timer = 0; };
    const run = () => { stop(); if (!userPaused && !hold && seen && !d.hidden) timer = setInterval(() => go(i + 1), 6500); };
    dots.forEach((b) => b.addEventListener('click', () => { go(+b.dataset.heroGo); run(); }));
    if (toggle) {
      const sync = () => { toggle.setAttribute('aria-pressed', String(userPaused)); toggle.setAttribute('aria-label', userPaused ? toggle.dataset.play : toggle.dataset.pause); };
      sync();
      toggle.addEventListener('click', () => { userPaused = !userPaused; sync(); run(); });
    }
    hero.addEventListener('mouseenter', () => { hold = true; run(); });
    hero.addEventListener('mouseleave', () => { hold = false; run(); });
    hero.addEventListener('focusin', () => { hold = true; run(); });
    hero.addEventListener('focusout', () => { hold = false; run(); });
    let x0 = null, y0 = 0;
    track.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; hold = true; run(); }, { passive: true });
    track.addEventListener('touchend', (e) => {
      if (x0 !== null) { const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(i + (dx < 0 ? 1 : -1)); }
      x0 = null; hold = false; run();
    });
    d.addEventListener('visibilitychange', run);
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { seen = es[0].isIntersecting; run(); }).observe(hero);
    run();
  }

  const els = d.querySelectorAll('[data-reveal]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -6% 0px' });
    els.forEach((el) => io.observe(el));
  } else els.forEach((el) => el.classList.add('in'));

  // product page v4: square photo track (swipe on phones, grid on desktop) with counter, colour buttons jump to that colour's first photo, phone buy bar
  const pdp = d.querySelector('[data-pdp]');
  if (pdp) {
    const track = pdp.querySelector('[data-pg-track]');
    const slides = track ? [...track.querySelectorAll('.pg-slide')] : [];
    const nEl = pdp.querySelector('[data-pg-n]');
    const barEl = pdp.querySelector('[data-pg-bar]');
    const colorBtns = [...pdp.querySelectorAll('.colors button')];
    const colorName = pdp.querySelector('[data-color-name]');
    const smooth = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    const swipe = () => track && track.scrollWidth > track.clientWidth + 4;
    const setN = (k) => { if (nEl) nEl.textContent = String(k + 1); if (barEl) barEl.style.transform = 'scaleX(' + ((k + 1) / slides.length) + ')'; };
    if (track && slides.length) {
      setN(0);
      let raf = 0;
      track.addEventListener('scroll', () => { if (raf) return; raf = requestAnimationFrame(() => { raf = 0; if (swipe()) setN(Math.round(track.scrollLeft / track.clientWidth)); }); }, { passive: true });
    }
    const goColor = (c) => {
      const s = slides.find((x) => x.dataset.color === c);
      if (!s) return;
      if (swipe()) track.scrollTo({ left: s.offsetLeft, behavior: smooth });
      else s.scrollIntoView({ behavior: smooth, block: 'nearest' });
    };
    colorBtns.forEach((b) => b.addEventListener('click', () => {
      colorBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      if (colorName) colorName.textContent = b.dataset.kr;
      goColor(b.dataset.color);
    }));
    const bb = d.querySelector('[data-buybar]');
    const cta = pdp.querySelector('[data-cta]');
    const ft = d.querySelector('.site-footer');
    if (bb && cta && 'IntersectionObserver' in window) {
      let ctaIn = false, ftIn = false;
      const upd = () => { const on = !ctaIn && !ftIn; bb.classList.toggle('on', on); if (on) bb.removeAttribute('inert'); else bb.setAttribute('inert', ''); };
      new IntersectionObserver((es) => { ctaIn = es[0].isIntersecting; upd(); }).observe(cta);
      if (ft) new IntersectionObserver((es) => { ftIn = es[0].isIntersecting; upd(); }).observe(ft);
    }
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
