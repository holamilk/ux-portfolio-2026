(function(){
  function injectFooter(){
    if (document.getElementById('confetti-footer')) return;
    const passwordGate = document.getElementById('passwordGate');
    const ibmUnlocked = sessionStorage.getItem('ibm_unlocked') === 'true';
    if (passwordGate && !ibmUnlocked) return; // don't add footer while gate is active

    const isCase = location.pathname.includes('/case-studies/');
    if (!document.getElementById('shared-footer-hover-styles')) {
      const sharedFooterStyle = document.createElement('style');
      sharedFooterStyle.id = 'shared-footer-hover-styles';
      sharedFooterStyle.textContent = `
        #confetti-footer a.footer-interactive-link {
          display: inline-block;
          color: #ffffff;
          transform: scale(1);
          transition: color 0.2s ease, opacity 0.2s ease, transform 0.2s ease;
          transform-origin: left center;
        }

        #confetti-footer a.footer-interactive-link:hover {
          color: rgba(255,255,255,0.76);
          opacity: 1;
          transform: scale(1.06);
        }
      `;
      document.head.appendChild(sharedFooterStyle);
    }

    // create footer
    const footer = document.createElement('footer');
    footer.id = 'confetti-footer';
    footer.style.position = 'relative';
    footer.style.left = '0';
    footer.style.width = '100%';
    footer.style.height = '420px';
    footer.style.overflow = 'hidden';
    footer.style.backgroundColor = '#631B17';
    footer.style.borderTop = '1px solid #7d2621';
    footer.style.zIndex = '3000';

    footer.innerHTML = `
      <canvas id="confetti-canvas" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: block; z-index: 1;"></canvas>
      <div style="position: relative; z-index: 2; max-width: 1360px; margin: 0 auto; padding: 80px 60px; display: flex; justify-content: space-between; align-items: flex-start; height: 100%; pointer-events: none;">
        <div style="pointer-events: auto; display: flex; flex-direction: column; align-items: flex-start; text-align: left;">
          <img src="${isCase ? '../assets/logos/personal-white.png' : 'assets/logos/personal-white.png'}" alt="Ankita Chakrabarty" style="width: 88px; height: 88px; object-fit: contain; display: block; flex: 0 0 auto; margin-bottom: 14px;">
          <span style="font-family: 'Orpheus Pro', serif; font-style: italic; font-size: 32px; color: #ffffff; display: block; line-height: 1.05; margin-bottom: 8px;">Ankita Chakrabarty</span>
          <span style="font-family: 'Poppins', sans-serif; font-weight: 300; font-size: 13px; color: rgba(255,255,255,0.75); letter-spacing: 0.04em; display: block;">connecting people before pixels</span>
        </div>

        <div style="display: flex; gap: 80px; pointer-events: auto;">
            <div class="footer-link-group">
                <span style="font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.5); display: block; margin-bottom: 16px;">say hello</span>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <a class="footer-interactive-link" data-href="" href="#" id="footer-link-linkedin" target="_blank" rel="noopener noreferrer" style="text-decoration: none; font-size: 14px; font-weight: 300; pointer-events:auto;">linkedin</a>
                    <a class="footer-interactive-link" data-href="" href="#" id="footer-link-email" target="_blank" rel="noopener noreferrer" style="text-decoration: none; font-size: 14px; font-weight: 300; pointer-events:auto;">email</a>
                </div>
            </div>

            <div class="footer-link-group">
                <span style="font-family: 'Poppins', sans-serif; font-weight: 500; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.5); display: block; margin-bottom: 16px;">menu</span>
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <a class="footer-interactive-link" data-href="index.html" href="#" style="text-decoration: none; font-size: 14px; font-weight: 300; pointer-events:auto;">work</a>
                    <a class="footer-interactive-link" data-href="about.html" href="#" style="text-decoration: none; font-size: 14px; font-weight: 300; pointer-events:auto;">about</a>
                    <a class="footer-interactive-link" data-href="testimonials-copy.html" href="#" style="text-decoration: none; font-size: 14px; font-weight: 300; pointer-events:auto;">testimonials</a>
                    <a class="footer-interactive-link" data-href="contact copy.html" href="#" style="text-decoration: none; font-size: 14px; font-weight: 300; pointer-events:auto;">contact</a>
                </div>
            </div>
        </div>
      </div>
    `;

    document.body.appendChild(footer);

    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    if (!canvas || !ctx) return;

    function resize() {
      canvas.width = footer.clientWidth;
      canvas.height = footer.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let particles = [];
    let hoverSpawnCount = 3;
    const confettiColors = ['#ffffff','#ffd6d6','#ffa8a8','#ffeb99','#fff3cc','#ffe6f0'];

    footer.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const hovered = document.elementFromPoint(e.clientX, e.clientY);
      const nearLinks = !!(hovered && hovered.closest && hovered.closest('.footer-link-group, .footer-interactive-link'));
      hoverSpawnCount = nearLinks ? 1 : 3;
      for (let i = 0; i < hoverSpawnCount; i++) particles.push({ x, y, vx: (Math.random()-0.5)*4, vy:(Math.random()-0.7)*4-1, size: Math.random()*6+4, color: confettiColors[Math.floor(Math.random()*confettiColors.length)], alpha:1, decay: Math.random()*0.02+0.015, rotation: Math.random()*Math.PI*2, rotationSpeed:(Math.random()-0.5)*0.1, shape: Math.random()>0.5 ? 'rect' : 'circle' });
    });

    function animate(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      for(let i=particles.length-1;i>=0;i--){
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.08; p.alpha -= p.decay; p.rotation += p.rotationSpeed;
        if (p.alpha <= 0) { particles.splice(i,1); continue; }
        ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.rotation); ctx.globalAlpha = p.alpha; ctx.fillStyle = p.color;
        if (p.shape === 'rect') ctx.fillRect(-p.size/2, -p.size/3, p.size, p.size*0.6); else { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
        ctx.restore();
      }
      requestAnimationFrame(animate);
    }
    animate();

    function wireFooterLinks(){
      const isCaseLocal = location.pathname.includes('/case-studies/');
      const prefix = isCaseLocal ? '../' : '';
      document.querySelectorAll('#confetti-footer a[data-href]').forEach(a => { const h = a.getAttribute('data-href'); a.href = prefix + h; });
      const ln = document.getElementById('footer-link-linkedin'); if (ln) ln.href = 'https://www.linkedin.com/in/ankitachakrabarty/';
      const em = document.getElementById('footer-link-email'); if (em) em.href = 'mailto:ankita.ch2005@gmail.com';
    }
    wireFooterLinks();
  }

  window.injectFooter = injectFooter;
})();
