(function(){
  // Inject shared slide CSS
  try {
    try {
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'auto';
      }
    } catch (e) {}

    const css = `
      .transition-slide { transition: transform 1400ms cubic-bezier(0.2, 0.8, 0.2, 1); will-change: transform; }
      .pre-slide-right { transform: translateX(100%); }
      .pre-slide-left { transform: translateX(-100%); }
      html, body { backface-visibility: hidden; }
      header.case-nav .nav-right a { display: inline-block; transition: color 0.2s ease, transform 0.2s ease; }
      header.case-nav .nav-right a:hover { transform: scale(1.06); }
      header.case-nav .back-to-work { transition: background 0.2s ease, padding-left 0.2s ease, padding-right 0.2s ease, transform 0.2s ease; }
      header.case-nav .back-to-work:hover { transform: scale(1.03); transform-origin: left center; }
      main.case-content h2.section-heading {
        font-family: 'Poppins', sans-serif !important;
        font-style: normal !important;
        font-weight: 500 !important;
        font-size: clamp(24px, 2vw, 32px) !important;
        line-height: 1.24 !important;
        color: #8F0A0A !important;
        letter-spacing: -0.01em;
      }
      .case-study-end-strip {
        display: grid;
        grid-template-columns: 1fr 1fr;
        align-items: end;
        gap: 28px;
        width: min(1240px, calc(100vw - 120px));
        min-height: 74px;
        margin: 26px auto 34px;
        padding: 18px 0 6px;
        border-top: 1px solid #e4e4e4;
      }
      .case-study-end-strip-col {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .case-study-end-strip-col.is-next {
        align-items: flex-end;
        text-align: right;
      }
      .case-study-end-strip-link {
        color: #282828;
        text-decoration: none;
        display: inline-flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
        transition: color 0.2s ease, transform 0.2s ease;
      }
      .case-study-end-strip-col.is-next .case-study-end-strip-link {
        align-items: flex-end;
      }
      .case-study-end-strip-link:hover {
        color: #631B17;
      }
      .case-study-end-strip-kicker {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;
        font-weight: 400;
        letter-spacing: 0.08em;
        color: #8c8c8c;
        text-transform: uppercase;
      }
      .case-study-end-strip-title {
        font-family: 'Orpheus Pro', serif;
        font-style: italic;
        font-weight: 400;
        font-size: clamp(14px, 2vw, 24px);
        line-height: 1.12;
        letter-spacing: -0.01em;
        transition: transform 0.2s ease;
        transform-origin: left center;
      }
      .case-study-end-strip-col.is-next .case-study-end-strip-title {
        transform-origin: right center;
      }
      .case-study-end-strip-link:hover .case-study-end-strip-title {
        transform: scale(1.04);
      }
      .case-study-strip-arrow {
        width: 16px;
        height: 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      .case-study-strip-arrow svg {
        width: 13px;
        height: 13px;
      }
      .case-sidebar-arrow-nav {
        margin-top: 20px;
        display: flex;
        gap: 8px;
      }
      .case-sidebar-arrow-link {
        position: relative;
        width: 30px;
        height: 30px;
        border-radius: 999px;
        border: 1px solid rgba(99, 27, 23, 0.26);
        color: #5d5d5d;
        background: #ffffff;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s ease, color 0.2s ease, transform 0.2s ease;
      }
      .case-sidebar-arrow-link:hover {
        background: #631B17;
        color: #ffffff;
        border-color: rgba(99, 27, 23, 0.62);
        transform: scale(1.04);
      }
      .case-sidebar-arrow-link::after {
        content: attr(data-hover);
        position: absolute;
        top: calc(100% + 8px);
        left: 50%;
        transform: translateX(-50%);
        font-size: 11px;
        font-weight: 300;
        letter-spacing: 0.01em;
        color: #4f4f4f;
        background: #ffffff;
        border: 1px solid #e2e2e2;
        border-radius: 999px;
        padding: 3px 8px;
        white-space: nowrap;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.16s ease;
      }
      .case-sidebar-arrow-link:hover::after {
        opacity: 1;
      }
      @media (max-width: 1100px) {
        .case-study-end-strip {
          width: calc(100vw - 32px);
          margin: 22px auto 28px;
          grid-template-columns: 1fr;
          gap: 16px;
          min-height: 0;
        }
        .case-study-end-strip-col.is-next {
          align-items: flex-start;
          text-align: left;
        }
        .case-study-end-strip-col.is-next .case-study-end-strip-link {
          align-items: flex-start;
        }
        .case-sidebar-arrow-nav { display: none; }
      }
    `;
    const s = document.createElement('style');
    s.type = 'text/css';
    s.appendChild(document.createTextNode(css));
    document.head.appendChild(s);
  } catch (e) {}

  // Consume pageTransition flag and animate the page itself
  try {
    const tRaw = sessionStorage.getItem('pageTransition');
    if (!tRaw) return;
    const t = JSON.parse(tRaw);
    if (t && (t.direction === 'from-right' || t.direction === 'from-left')) {
      const cls = t.direction === 'from-right' ? 'pre-slide-right' : 'pre-slide-left';
      document.body.classList.add('transition-slide');
      document.body.classList.add(cls);
      // remove the pre-slide class on next frame to trigger transition
      requestAnimationFrame(() => {
        document.body.classList.remove(cls);
      });
      // clear the flag
      sessionStorage.removeItem('pageTransition');
      // indicate we ran a transition to avoid rerunning the curtain
      try { window.__pageTransitionRan = true; } catch (e) {}
    }
  } catch (e) {}
})();

(function(){
  // Shared case-study end strip and sidebar arrows.
  if (!location.pathname.includes('/case-studies/')) return;

  const file = decodeURIComponent(location.pathname.split('/').pop() || '').toLowerCase();
  const routes = {
    'ibm-internship-2.html': {
      next: { href: 'lindström-internship-1.html', title: 'Lindstrom eShop', hover: 'next case study', kicker: 'Next' }
    },
    'lindström-internship-1.html': {
      prev: { href: 'ibm-internship-2.html', title: 'IBM Enterprise UX', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'bd-client-2-copy.html', title: 'BD x SCADpro', hover: 'next case study', kicker: 'Next' }
    },
    'bd-client-2-copy.html': {
      prev: { href: 'lindström-internship-1.html', title: 'Lindstrom eShop', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'cvs-client-1.html', title: 'CVS Pharmacy', hover: 'next case study', kicker: 'Next' }
    },
    'bd-client-2.html': {
      prev: { href: 'lindström-internship-1.html', title: 'Lindstrom eShop', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'cvs-client-1.html', title: 'CVS Pharmacy', hover: 'next case study', kicker: 'Next' }
    },
    'cvs-client-1.html': {
      prev: { href: 'bd-client-2-copy.html', title: 'BD x SCADpro', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'cocreate-client-3.html', title: 'Co-Create Schools', hover: 'next case study', kicker: 'Next' }
    },
    'cocreate-client-3.html': {
      prev: { href: 'cvs-client-1.html', title: 'CVS Pharmacy', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'canopy-passion-1 copy.html', title: 'Canopy', hover: 'next case study', kicker: 'Next' }
    },
    'canopy-passion-1 copy.html': {
      prev: { href: 'cocreate-client-3.html', title: 'Co-Create Schools', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'acclio-passion-2.html', title: 'Acclio', hover: 'next case study', kicker: 'Next' }
    },
    'canopy-passion-1.html': {
      prev: { href: 'cocreate-client-3.html', title: 'Co-Create Schools', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'acclio-passion-2.html', title: 'Acclio', hover: 'next case study', kicker: 'Next' }
    },
    'acclio-passion-2.html': {
      prev: { href: 'canopy-passion-1 copy.html', title: 'Canopy', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'oatland-passion-3 copy.html', title: 'Oatland', hover: 'next case study', kicker: 'Next' }
    },
    'acclio-passion-2-copy.html': {
      prev: { href: 'canopy-passion-1 copy.html', title: 'Canopy', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'oatland-passion-3 copy.html', title: 'Oatland', hover: 'next case study', kicker: 'Next' }
    },
    'oatland-passion-3 copy.html': {
      prev: { href: 'acclio-passion-2.html', title: 'Acclio', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'portfolio-passion-4.html', title: 'My Portfolio', hover: 'next case study', kicker: 'Next' }
    },
    'oatland-passion-3.html': {
      prev: { href: 'acclio-passion-2.html', title: 'Acclio', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'portfolio-passion-4.html', title: 'My Portfolio', hover: 'next case study', kicker: 'Next' }
    },
    'portfolio-passion-4.html': {
      prev: { href: 'oatland-passion-3 copy.html', title: 'Oatland', hover: 'prev case study', kicker: 'Previous' },
      next: { href: 'playground copy.html', title: 'Playground', hover: 'view playground', kicker: 'View Playground' }
    }
  };

  const route = routes[file];
  if (!route) return;

  function leftArrowSvg(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12" aria-hidden="true"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>';
  }

  function rightArrowSvg(){
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="12" height="12" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
  }

  function injectSidebarArrows(){
    const sidebar = document.querySelector('.case-sidebar');
    const links = sidebar && sidebar.querySelector('.sidebar-links');
    if (!sidebar || !links || sidebar.querySelector('.case-sidebar-arrow-nav')) return;

    const nav = document.createElement('div');
    nav.className = 'case-sidebar-arrow-nav';
    nav.setAttribute('aria-label', 'Case study quick navigation');

    const html = [];
    if (route.prev && route.prev.href) {
      html.push('<a class="case-sidebar-arrow-link is-prev" href="' + route.prev.href + '" data-hover="' + (route.prev.hover || 'prev case study') + '" aria-label="Previous case study" title="' + (route.prev.hover || 'prev case study') + '">' + leftArrowSvg() + '</a>');
    }
    if (route.next && route.next.href) {
      const nextHover = route.next.hover || 'next case study';
      html.push('<a class="case-sidebar-arrow-link is-next" href="' + route.next.href + '" data-hover="' + nextHover + '" aria-label="Next destination" title="' + nextHover + '">' + rightArrowSvg() + '</a>');
    }

    nav.innerHTML = html.join('');
    if (!nav.innerHTML) return;

    sidebar.appendChild(nav);
  }

  function injectEndStrip(){
    if (document.querySelector('.case-study-end-strip')) return;

    const pageContainer = document.querySelector('.page-container');
    if (!pageContainer || !pageContainer.parentNode) return;

    const strip = document.createElement('nav');
    strip.className = 'case-study-end-strip';
    strip.setAttribute('aria-label', 'Case study navigation');

    const html = [];
    if (route.prev && route.prev.href) {
      html.push('<div class="case-study-end-strip-col is-prev">');
      html.push('<a class="case-study-end-strip-link is-prev" href="' + route.prev.href + '" aria-label="Previous case study" title="' + (route.prev.hover || 'prev case study') + '">');
      html.push('<span class="case-study-end-strip-kicker"><span class="case-study-strip-arrow" aria-hidden="true">' + leftArrowSvg() + '</span><span>' + (route.prev.kicker || 'Previous') + '</span></span>');
      html.push('<span class="case-study-end-strip-title">' + (route.prev.title || '') + '</span>');
      html.push('</a>');
      html.push('</div>');
    } else if (route.next && route.next.href) {
      html.push('<div class="case-study-end-strip-col is-spacer" aria-hidden="true"></div>');
    }

    if (route.next && route.next.href) {
      html.push('<div class="case-study-end-strip-col is-next">');
      html.push('<a class="case-study-end-strip-link is-next" href="' + route.next.href + '" aria-label="Next destination" title="' + (route.next.hover || 'next case study') + '">');
      html.push('<span class="case-study-end-strip-kicker"><span>' + (route.next.kicker || 'Next') + '</span><span class="case-study-strip-arrow" aria-hidden="true">' + rightArrowSvg() + '</span></span>');
      html.push('<span class="case-study-end-strip-title">' + (route.next.title || '') + '</span>');
      html.push('</a>');
      html.push('</div>');
    }

    strip.innerHTML = html.join('');
    if (!strip.innerHTML) return;

    pageContainer.insertAdjacentElement('afterend', strip);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      injectSidebarArrows();
      injectEndStrip();
    }, { once: true });
  } else {
    injectSidebarArrows();
    injectEndStrip();
  }
})();

(function(){
  // Short brand-colored "wand flick" burst near the case-study title.
  if (!location.pathname.includes('/case-studies/')) return;

  const path = location.pathname.toLowerCase();
  if (path.includes('playground')) return;
  let palette = null;

  const isIbmCase = path.includes('ibm');

  if (isIbmCase) {
    palette = ['#006699'];
  } else if (path.includes('lindstr')) {
    palette = ['#003F72', '#E52330'];
  } else if (path.includes('cvs')) {
    palette = ['#CC0000'];
  } else if (path.includes('bd-client-2')) {
    palette = ['#044ED7', '#FF6E00'];
  } else if (path.includes('acclio')) {
    palette = ['#C37E03'];
  } else if (path.includes('oatland')) {
    palette = ['#689D8A', '#9BB98E'];
  } else if (path.includes('canopy')) {
    palette = ['#0F4E2E', '#CE8835', '#C45932'];
  }

  if (!palette || palette.length === 0) return;

  function initEntryConfetti(){
    if (!document.body || document.getElementById('entry-confetti-canvas')) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'entry-confetti-canvas';
    canvas.style.position = 'fixed';
    canvas.style.inset = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '2500';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    const particles = [];
    const start = performance.now();
    const emitMs = 700;
    const maxMs = 2400;
    let seedAngle = -1.2;

    function resize(){
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    function getOrigin(){
      const title = document.querySelector('.case-title');
      if (!title) return { x: width * 0.28, y: Math.min(height * 0.28, 240) };
      const r = title.getBoundingClientRect();
      return {
        // place the spurt just left of the title, in the gutter between sidebar and content
        x: Math.max(24, r.left - 72),
        y: Math.max(24, r.top + Math.min(r.height * 0.5, 40))
      };
    }

    function spawn(origin, count){
      for (let i = 0; i < count; i++) {
        seedAngle += 0.35;
        const ang = seedAngle + (Math.random() - 0.5) * 0.45;
        const speed = 1.2 + Math.random() * 1.6;
        particles.push({
          x: origin.x + (Math.random() - 0.5) * 8,
          y: origin.y + (Math.random() - 0.5) * 8,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed - 1.2,
          swirl: 0.012 + Math.random() * 0.02,
          size: 2 + Math.random() * 3.5,
          rot: Math.random() * Math.PI * 2,
          rotV: (Math.random() - 0.5) * 0.22,
          color: palette[Math.floor(Math.random() * palette.length)],
          created: performance.now(),
          life: 700 + Math.random() * 900
        });
      }
    }

    function cleanup(){
      window.removeEventListener('resize', resize);
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    }

    function tick(now){
      ctx.clearRect(0, 0, width, height);

      if (now - start <= emitMs) {
        spawn(getOrigin(), 3);
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        const age = now - p.created;
        p.x += p.vx;
        p.y += p.vy;
        p.vx += Math.sin(age * p.swirl) * 0.03;
        p.vy += 0.025;
        p.rot += p.rotV;

        const alpha = Math.max(0, 1 - (age / p.life));

        if (alpha <= 0 || p.y > height + 20 || p.x < -20 || p.x > width + 20) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }

      if ((now - start) > maxMs && particles.length === 0) {
        cleanup();
        return;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function bootEntryConfetti(){
    // IBM case: do not run on password gate; run only when unlocked content is shown.
    if (isIbmCase) {
      const unlocked = sessionStorage.getItem('ibm_unlocked') === 'true';
      if (unlocked) {
        initEntryConfetti();
      } else {
        window.addEventListener('ibmCaseUnlocked', initEntryConfetti, { once: true });
      }
      return;
    }
    initEntryConfetti();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootEntryConfetti, { once: true });
  } else {
    bootEntryConfetti();
  }
})();

(function(){
  // Desktop-only custom cursor: dark red by default, white on dark-red surfaces.
  if (!window.matchMedia || !window.matchMedia('(pointer:fine)').matches) return;

  // Set this early so the native cursor does not flash during initial animations.
  try { document.documentElement.classList.add('use-custom-cursor'); } catch (e) {}

  function initCustomCursor(){
    if (!document.body) return;
    if (document.querySelector('.custom-round-cursor')) return;

    try {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(`
      .custom-round-cursor {
        position: fixed;
        top: 0;
        left: 0;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        background: #631B17;
        pointer-events: none;
        z-index: 2147483647;
        transform: translate(-50%, -50%);
        transition: background-color 120ms ease, opacity 120ms ease;
        opacity: 0;
      }

      .use-custom-cursor,
      .use-custom-cursor * {
        cursor: none !important;
      }

      .use-custom-cursor input,
      .use-custom-cursor textarea,
      .use-custom-cursor select,
      .use-custom-cursor [contenteditable="true"] {
        cursor: text !important;
      }

      /* Password gate should not show a native text cursor or caret over the custom dot. */
      .use-custom-cursor #passwordGate input,
      .use-custom-cursor #passwordGate textarea,
      .use-custom-cursor #passwordGate [contenteditable="true"] {
        cursor: none !important;
        caret-color: transparent !important;
      }

      .use-custom-cursor #passwordGate input:focus,
      .use-custom-cursor #passwordGate textarea:focus,
      .use-custom-cursor #passwordGate [contenteditable="true"]:focus {
        caret-color: auto !important;
      }
    `));
    document.head.appendChild(style);

    const cursor = document.createElement('div');
    cursor.className = 'custom-round-cursor';
    document.body.appendChild(cursor);
    document.body.classList.add('use-custom-cursor');

    const curtainIsVisible = () => {
      const curtain = document.getElementById('curtainContainer');
      if (!curtain || !curtain.children || curtain.children.length === 0) return false;
      for (let i = 0; i < curtain.children.length; i++) {
        const op = parseFloat(getComputedStyle(curtain.children[i]).opacity || '0');
        if (op > 0.02) return true;
      }
      return false;
    };

    const updateColor = (target) => {
      if (curtainIsVisible()) {
        cursor.style.backgroundColor = '#FFFFFF';
        return;
      }
      // Turn white only when hovering actual dark red UI surfaces.
      const onDarkRed = !!(
        target &&
        target.closest &&
        target.closest('.sidebar:not(.expanded), .sidebar-header, #confetti-footer, .back-to-work, .off-clock-closing-card')
      );
      cursor.style.backgroundColor = onDarkRed ? '#FFFFFF' : '#631B17';
    };

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top = e.clientY + 'px';
      cursor.style.opacity = '1';
      updateColor(document.elementFromPoint(e.clientX, e.clientY));
    }, { passive: true });

    window.addEventListener('mouseout', () => {
      cursor.style.opacity = '0';
    }, { passive: true });

    window.addEventListener('mouseover', (e) => {
      updateColor(e.target);
    }, { passive: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCustomCursor, { once: true });
  } else {
    initCustomCursor();
  }
})();
