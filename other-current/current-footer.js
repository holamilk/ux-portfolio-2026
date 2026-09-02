(function () {
    function attachConfettiTrail(container, canvas) {
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const precisePointer = window.matchMedia('(pointer: fine)').matches;
        if (!container || !canvas || reducedMotion || !precisePointer || window.innerWidth <= 768) return;

        const context = canvas.getContext('2d');
        const particles = [];
        const colors = ['#ffffff', '#ffd6d6', '#ffa8a8', '#ffeb99', '#fff3cc', '#ffe6f0'];

        function resize() {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
        }

        container.addEventListener('pointermove', function (event) {
            const rect = canvas.getBoundingClientRect();
            for (let index = 0; index < 2; index += 1) {
                particles.push({
                    x: event.clientX - rect.left,
                    y: event.clientY - rect.top,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.7) * 4 - 1,
                    size: Math.random() * 6 + 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    alpha: 1,
                    decay: Math.random() * 0.02 + 0.015
                });
            }
        });

        function animate() {
            context.clearRect(0, 0, canvas.width, canvas.height);
            for (let index = particles.length - 1; index >= 0; index -= 1) {
                const particle = particles[index];
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vy += 0.08;
                particle.alpha -= particle.decay;
                if (particle.alpha <= 0) {
                    particles.splice(index, 1);
                    continue;
                }
                context.globalAlpha = particle.alpha;
                context.fillStyle = particle.color;
                context.fillRect(particle.x, particle.y, particle.size, particle.size * 0.6);
            }
            context.globalAlpha = 1;
            requestAnimationFrame(animate);
        }

        resize();
        window.addEventListener('resize', resize, { passive: true });
        requestAnimationFrame(animate);
    }

    function injectFooter() {
        if (document.getElementById('confetti-footer')) return;

        const passwordGate = document.getElementById('passwordGate');
        const ibmUnlocked = sessionStorage.getItem('ibm_unlocked') === 'true' || localStorage.getItem('ibm_unlocked') === 'true';
        if (passwordGate && !ibmUnlocked) return;

        const inCaseStudies = location.pathname.includes('/case-studies-current/');
        const pagePrefix = inCaseStudies ? '../other-current/' : '';
        const footer = document.createElement('footer');
        footer.id = 'confetti-footer';
        document.documentElement.classList.add('has-current-footer');
        footer.innerHTML = `
            <canvas id="confetti-canvas" aria-hidden="true"></canvas>
            <div class="current-footer-inner">
                <div class="current-footer-brand">
                    <img src="../assets/logos/personal-white.png" alt="Ankita Chakrabarty">
                    <span class="current-footer-name">Ankita Chakrabarty</span>
                    <span class="current-footer-tagline">connecting people before pixels</span>
                </div>
                <div class="current-footer-groups">
                    <div class="current-footer-group">
                        <span class="current-footer-label">say hello</span>
                        <a href="https://www.linkedin.com/in/ankitachakrabarty/" target="_blank" rel="noopener noreferrer">linkedin</a>
                        <a href="mailto:ankita.ch2005@gmail.com" target="_blank" rel="noopener noreferrer">email</a>
                    </div>
                    <div class="current-footer-group">
                        <span class="current-footer-label">menu</span>
                        <a href="${pagePrefix}index-current.html">work</a>
                        <a href="${pagePrefix}about-current.html">about</a>
                        <a href="${pagePrefix}testimonials-copy-current.html">testimonials</a>
                        <a href="${pagePrefix}contact-copy-current.html">contact</a>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(footer);

        const canvas = footer.querySelector('#confetti-canvas');
        attachConfettiTrail(footer, canvas);
    }

    window.attachConfettiTrail = attachConfettiTrail;
    window.injectFooter = injectFooter;
})();