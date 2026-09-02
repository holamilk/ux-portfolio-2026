(function () {
    const currentPages = {
        home: '../other-current/index-current.html',
        about: '../other-current/about-current.html',
        testimonials: '../other-current/testimonials-copy-current.html',
        contact: '../other-current/contact-copy-current.html'
    };

    const routeNames = {
        'index.html': 'home',
        'index-current.html': 'home',
        'about.html': 'about',
        'about-current.html': 'about',
        'testimonials-copy.html': 'testimonials',
        'testimonials-copy-current.html': 'testimonials',
        'contact copy.html': 'contact',
        'contact-copy-current.html': 'contact'
    };

    const caseRoutes = {
        'ibm-internship-2.html': { next: ['lindström-internship-1.html', 'Lindstrom eShop'] },
        'lindström-internship-1.html': { prev: ['ibm-internship-2.html', 'IBM Enterprise UX'], next: ['bd-client-2-copy.html', 'BD x SCADpro'] },
        'bd-client-2-copy.html': { prev: ['lindström-internship-1.html', 'Lindstrom eShop'], next: ['cvs-client-1.html', 'CVS Pharmacy'] },
        'bd-client-2.html': { prev: ['lindström-internship-1.html', 'Lindstrom eShop'], next: ['cvs-client-1.html', 'CVS Pharmacy'] },
        'cvs-client-1.html': { prev: ['bd-client-2-copy.html', 'BD x SCADpro'], next: ['cocreate-client-3.html', 'Co-Create Schools'] },
        'cocreate-client-3.html': { prev: ['cvs-client-1.html', 'CVS Pharmacy'], next: ['canopy-passion-1 copy.html', 'Canopy'] },
        'canopy-passion-1 copy.html': { prev: ['cocreate-client-3.html', 'Co-Create Schools'], next: ['acclio-passion-2.html', 'Acclio'] },
        'canopy-passion-1.html': { prev: ['cocreate-client-3.html', 'Co-Create Schools'], next: ['acclio-passion-2.html', 'Acclio'] },
        'acclio-passion-2.html': { prev: ['canopy-passion-1 copy.html', 'Canopy'], next: ['portfolio-passion-4.html', 'My Portfolio'] },
        'acclio-passion-2-copy.html': { prev: ['canopy-passion-1 copy.html', 'Canopy'], next: ['portfolio-passion-4.html', 'My Portfolio'] },
        'oatland-passion-3 copy.html': { prev: ['acclio-passion-2.html', 'Acclio'], next: ['portfolio-passion-4.html', 'My Portfolio'] },
        'oatland-passion-3.html': { prev: ['acclio-passion-2.html', 'Acclio'], next: ['portfolio-passion-4.html', 'My Portfolio'] },
        'portfolio-passion-4.html': { prev: ['acclio-passion-2.html', 'Acclio'], next: ['playground copy.html', 'Playground'] },
        'playground copy.html': { prev: ['portfolio-passion-4.html', 'My Portfolio'] },
        'playground.html': { prev: ['portfolio-passion-4.html', 'My Portfolio'] }
    };

    const inCaseStudies = location.pathname.includes('/case-studies-current/');
    if (document.body && document.querySelector('.main-wrapper')) {
        document.body.classList.add('current-landing');
    }

    function applyPlayfairDisplay() {
        function updateRules(rules) {
            Array.from(rules || []).forEach(function (rule) {
                if (rule.cssRules) updateRules(rule.cssRules);
                if (!rule.style || !rule.style.fontFamily) return;
                if (/orpheus/i.test(rule.style.fontFamily)) {
                    rule.style.fontFamily = "'Playfair Display', Georgia, serif";
                }
            });
        }

        Array.from(document.styleSheets).forEach(function (styleSheet) {
            try {
                updateRules(styleSheet.cssRules);
            } catch (error) {}
        });
    }

    function currentHref(name) {
        const href = currentPages[name];
        return inCaseStudies ? href : href.replace('../other-current/', '');
    }

    function rewriteHref(anchor) {
        const rawHref = anchor.getAttribute('href');
        if (!rawHref || rawHref.startsWith('#') || /^(mailto:|tel:|https?:)/i.test(rawHref)) return;

        const decoded = decodeURIComponent(rawHref.split('?')[0]);
        const fileName = decoded.split('/').pop().toLowerCase();
        const routeName = routeNames[fileName];

        if (routeName) {
            const query = rawHref.includes('?') ? '?' + rawHref.split('?').slice(1).join('?') : '';
            anchor.setAttribute('href', currentHref(routeName) + query);
            return;
        }

        if (!inCaseStudies && decoded.includes('case-studies/')) {
            anchor.setAttribute('href', rawHref.replace(/(?:\.\.\/)?case-studies\//, '../case-studies-current/'));
        }
    }

    function rewriteLinks(root) {
        if (root.matches && root.matches('a[href]')) rewriteHref(root);
        if (root.querySelectorAll) root.querySelectorAll('a[href]').forEach(rewriteHref);

        const rewriteSource = function (element) {
            const source = element.getAttribute('src');
            if (source && source.startsWith('assets/')) {
                element.setAttribute('src', '../' + source);
            }
        };
        if (root.matches && root.matches('[src]')) rewriteSource(root);
        if (root.querySelectorAll) root.querySelectorAll('[src]').forEach(rewriteSource);
    }

    function capitalizeFirstLetter(element) {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let textNode = walker.nextNode();
        while (textNode) {
            if (/[a-z]/i.test(textNode.nodeValue)) {
                textNode.nodeValue = textNode.nodeValue.replace(/[a-z]/i, function (letter) {
                    return letter.toUpperCase();
                });
                return;
            }
            textNode = walker.nextNode();
        }
    }

    function capitalizeUiText(root) {
        const selector = 'nav a, nav a span, .back-to-work, .nav-right a, .sidebar-nav a, .sidebar-links a, .current-footer-group a, h1, h2, h3, h4, h5, h6, label, .page-lead, .hero-lead, [class*="title"], [class*="heading"], [class*="subtitle"], [class*="label"], [class*="tag"]';
        if (root.matches && root.matches(selector)) capitalizeFirstLetter(root);
        if (root.querySelectorAll) root.querySelectorAll(selector).forEach(capitalizeFirstLetter);
    }

    function initAutoScrollers() {
        if (document.getElementById('current-auto-scroll-styles')) return;

        const style = document.createElement('style');
        style.id = 'current-auto-scroll-styles';
        style.textContent = `
            .current-auto-scroll {
                overflow-x: auto !important;
                overflow-y: hidden !important;
                scrollbar-color: #8b8b8b #e7e7e7;
                scrollbar-width: auto;
            }
            .current-auto-scroll::-webkit-scrollbar { height: 8px; }
            .current-auto-scroll::-webkit-scrollbar-track {
                background: #e7e7e7;
                border-radius: 999px;
            }
            .current-auto-scroll::-webkit-scrollbar-thumb {
                background: #8b8b8b;
                border-radius: 999px;
            }
            .overview-carousel.current-auto-scroll,
            .evaluation-framework-scroll.current-auto-scroll,
            .website-strip.current-auto-scroll,
            .archive-carousel.current-auto-scroll,
            .eshop-screen-stack.current-auto-scroll {
                overflow-x: auto !important;
                scrollbar-color: #8b8b8b #e7e7e7;
                scrollbar-width: auto;
            }
            .current-auto-scroll-track {
                animation: none !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const containers = Array.from(document.querySelectorAll('.off-clock-marquee, .carousel-container, .hero-first-image:has(> .hero-scroll-track), .redesign-strip, .overview-carousel, .evaluation-framework-scroll, .website-strip, .archive-carousel, .eshop-screen-stack'));

        containers.forEach(function (container) {
            if (!inCaseStudies && container.closest('.bottom-right-panel')) return;
            const track = container.querySelector(':scope > .off-clock-marquee-track, :scope > .carousel-track, :scope > .hero-scroll-track, :scope > .redesign-track, :scope > .overview-carousel-track, :scope > .website-track, :scope > .archive-track');
            if (!track) {
                if (container.matches('.evaluation-framework-scroll, .eshop-screen-stack')) {
                    container.classList.add('current-auto-scroll');
                }
                return;
            }
            if (track.dataset.nativeAutoScroll === 'true') return;

            const trackStyle = getComputedStyle(track);
            const duration = Math.max(1, parseFloat(trackStyle.animationDuration) || 30);
            const reverse = trackStyle.animationDirection === 'reverse';
            let interacting = false;
            let resumeTimer = 0;
            let previousTime = 0;
            let reverseReady = false;

            track.dataset.nativeAutoScroll = 'true';
            container.classList.add('current-auto-scroll');
            track.classList.add('current-auto-scroll-track');

            function pauseForInteraction() {
                interacting = true;
                window.clearTimeout(resumeTimer);
            }

            function resumeAfterInteraction() {
                window.clearTimeout(resumeTimer);
                resumeTimer = window.setTimeout(function () {
                    interacting = false;
                }, 900);
            }

            container.addEventListener('pointerdown', pauseForInteraction);
            window.addEventListener('pointerup', resumeAfterInteraction, { passive: true });
            container.addEventListener('touchstart', pauseForInteraction, { passive: true });
            container.addEventListener('touchend', resumeAfterInteraction, { passive: true });
            container.addEventListener('wheel', function () {
                pauseForInteraction();
                resumeAfterInteraction();
            }, { passive: true });

            function tick(time) {
                const loopWidth = track.scrollWidth / 2;
                if (reverse && !reverseReady && loopWidth > 0) {
                    container.scrollLeft = loopWidth;
                    reverseReady = true;
                }

                const pausedByControl = container.classList.contains('paused');
                if (!reducedMotion && !interacting && !pausedByControl && previousTime && loopWidth > 0) {
                    const distance = loopWidth / duration * Math.min(50, time - previousTime) / 1000;
                    container.scrollLeft += reverse ? -distance : distance;
                    if (reverse && container.scrollLeft <= 0) container.scrollLeft += loopWidth;
                    if (!reverse && container.scrollLeft >= loopWidth) container.scrollLeft -= loopWidth;
                }

                previousTime = time;
                requestAnimationFrame(tick);
            }

            requestAnimationFrame(tick);
        });
    }

    function initHeader() {
        const header = document.querySelector('header.case-nav');
        const nav = header && header.querySelector('.nav-right');
        if (!header || !nav || header.querySelector('.current-nav-toggle')) return;

        nav.id = nav.id || 'currentPrimaryNav';
        const toggle = document.createElement('button');
        toggle.className = 'current-nav-toggle';
        toggle.type = 'button';
        toggle.setAttribute('aria-label', 'Open navigation');
        toggle.setAttribute('aria-controls', nav.id);
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '<span class="current-nav-toggle-lines" aria-hidden="true"></span>';
        header.appendChild(toggle);

        toggle.addEventListener('click', function () {
            const isOpen = header.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', String(isOpen));
            toggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
        });

        nav.addEventListener('click', function () {
            header.classList.remove('nav-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Open navigation');
        });
    }

    function arrowSvg(direction) {
        const points = direction === 'left' ? '12 19 5 12 12 5' : '12 5 19 12 12 19';
        const line = direction === 'left' ? '<line x1="19" y1="12" x2="5" y2="12"></line>' : '<line x1="5" y1="12" x2="19" y2="12"></line>';
        return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + line + '<polyline points="' + points + '"></polyline></svg>';
    }

    function injectCaseNavigation() {
        if (!inCaseStudies) return;
        const fileName = decodeURIComponent(location.pathname.split('/').pop()).toLowerCase();
        const route = caseRoutes[fileName];
        const pageContainer = document.querySelector('.page-container');
        if (!route || !pageContainer) return;

        const sidebar = document.querySelector('.case-sidebar');
        if (sidebar && !sidebar.querySelector('.case-sidebar-arrow-nav')) {
            const sidebarNav = document.createElement('nav');
            sidebarNav.className = 'case-sidebar-arrow-nav';
            sidebarNav.setAttribute('aria-label', 'Case study quick navigation');
            const sidebarLinks = [];

            if (route.prev) {
                sidebarLinks.push('<a class="case-sidebar-arrow-link" href="' + route.prev[0] + '" data-hover="Prev case study" aria-label="Previous case study" title="Previous case study">' + arrowSvg('left') + '</a>');
            }
            if (route.next) {
                const nextLabel = fileName === 'portfolio-passion-4.html' ? 'View playground' : 'Next case study';
                sidebarLinks.push('<a class="case-sidebar-arrow-link" href="' + route.next[0] + '" data-hover="' + nextLabel + '" aria-label="' + nextLabel + '" title="' + nextLabel + '">' + arrowSvg('right') + '</a>');
            }

            sidebarNav.innerHTML = sidebarLinks.join('');
            if (sidebarNav.childElementCount) sidebar.appendChild(sidebarNav);
        }

        if (document.querySelector('.case-study-end-strip')) return;

        const strip = document.createElement('nav');
        strip.className = 'case-study-end-strip';
        strip.setAttribute('aria-label', 'Case study navigation');
        const columns = [];

        if (route.prev) {
            columns.push('<div class="case-study-end-strip-col is-prev"><a class="case-study-end-strip-link" href="' + route.prev[0] + '"><span class="case-study-end-strip-kicker">' + arrowSvg('left') + ' Previous</span><span class="case-study-end-strip-title">' + route.prev[1] + '</span></a></div>');
        } else {
            columns.push('<div aria-hidden="true"></div>');
        }

        if (route.next) {
            columns.push('<div class="case-study-end-strip-col is-next"><a class="case-study-end-strip-link" href="' + route.next[0] + '"><span class="case-study-end-strip-kicker">Next ' + arrowSvg('right') + '</span><span class="case-study-end-strip-title">' + route.next[1] + '</span></a></div>');
        }

        strip.innerHTML = columns.join('');
        pageContainer.insertAdjacentElement('afterend', strip);
    }

    function initCaseSidebar() {
        if (!inCaseStudies) return;
        const links = Array.from(document.querySelectorAll('.case-sidebar .sidebar-links a[href^="#"]'));
        if (!links.length) return;

        const items = links.map(function (link) {
            const id = decodeURIComponent(link.getAttribute('href').slice(1));
            return { link: link, section: document.getElementById(id) };
        }).filter(function (item) {
            return item.section;
        });
        if (!items.length) return;

        function setActive(activeLink) {
            items.forEach(function (item) {
                const isActive = item.link === activeLink;
                item.link.classList.toggle('active', isActive);
                if (isActive) item.link.setAttribute('aria-current', 'location');
                else item.link.removeAttribute('aria-current');
            });
        }

        function updateFromScroll() {
            const marker = 190;
            let activeItem = items[0];
            items.forEach(function (item) {
                if (item.section.getBoundingClientRect().top <= marker) activeItem = item;
            });
            setActive(activeItem.link);
        }

        let frame = 0;
        window.addEventListener('scroll', function () {
            if (frame) return;
            frame = requestAnimationFrame(function () {
                frame = 0;
                updateFromScroll();
            });
        }, { passive: true });

        items.forEach(function (item) {
            item.link.addEventListener('click', function () {
                setActive(item.link);
            });
        });

        updateFromScroll();
    }

    function styleHookCallouts() {
        if (!inCaseStudies) return;
        const hookCallouts = document.querySelectorAll('.hook-callout');
        if (!hookCallouts.length) return;

        const path = location.pathname.toLowerCase();
        let brand = '#631B17';
        if (path.includes('ibm')) brand = '#006699';
        else if (path.includes('lindstr')) brand = '#003F72';
        else if (path.includes('bd-client-2')) brand = '#C75A00';
        else if (path.includes('cvs')) brand = '#A6192E';
        else if (path.includes('cocreate')) brand = '#123A72';
        else if (path.includes('canopy')) brand = '#0F4E2E';
        else if (path.includes('acclio')) brand = '#8C5C00';
        else if (path.includes('portfolio')) brand = '#631B17';
        else if (path.includes('oatland')) brand = '#4F7A6B';

        if (!document.getElementById('current-hook-callout-brand-style')) {
            const style = document.createElement('style');
            style.id = 'current-hook-callout-brand-style';
            style.textContent = `
                .hook-callout {
                    background: var(--hook-brand, #631B17) !important;
                    color: #ffffff !important;
                    font-family: 'Ubuntu', sans-serif !important;
                    font-style: italic !important;
                    font-weight: 300 !important;
                }
            `;
            document.head.appendChild(style);
        }

        hookCallouts.forEach(function (node) {
            node.style.setProperty('--hook-brand', brand);
        });
    }

    function normalizeCaseCornerRadius() {
        if (!inCaseStudies) return;
        if (document.getElementById('current-case-radius-style')) return;

        const style = document.createElement('style');
        style.id = 'current-case-radius-style';
        style.textContent = `
            :root {
                --case-unified-radius: 12px;
            }

            .hook-callout {
                border-radius: var(--case-unified-radius) !important;
            }

            .page-container .img-placeholder,
            .page-container .image-placeholder,
            .page-container .image-frame,
            .page-container .image-card,
            .page-container .visual-card,
            .page-container .visual-tile,
            .page-container .overview-image,
            .page-container .research-image,
            .page-container .process-image,
            .page-container figure,
            .page-container video,
            .page-container iframe,
            .page-container .hook-callout,
            .page-container img:not([class*="logo"]):not([class*="icon"]):not([class*="avatar"]):not([class*="flag"]) {
                border-radius: var(--case-unified-radius) !important;
            }

            .page-container [class*="pill"],
            .page-container [class*="dot"],
            .page-container [class*="circle"],
            .page-container [class*="avatar"],
            .page-container [class*="badge"] {
                border-radius: 999px !important;
            }
        `;
        document.head.appendChild(style);
    }

    function initCaseEntryConfetti() {
        if (!inCaseStudies || window.matchMedia('(max-width: 480px)').matches) return;
        if (document.getElementById('entry-confetti-canvas')) return;

        const path = location.pathname.toLowerCase();
        if (path.includes('playground')) return;
        let palette = null;
        if (path.includes('ibm')) palette = ['#006699'];
        else if (path.includes('lindstr')) palette = ['#003F72', '#E52330'];
        else if (path.includes('cvs')) palette = ['#CC0000'];
        else if (path.includes('bd-client-2')) palette = ['#044ED7', '#FF6E00'];
        else if (path.includes('acclio')) palette = ['#C37E03'];
        else if (path.includes('oatland')) palette = ['#689D8A', '#9BB98E'];
        else if (path.includes('canopy')) palette = ['#0F4E2E', '#CE8835', '#C45932'];
        else if (path.includes('cocreate')) palette = ['#631B17', '#D9A441'];
        else if (path.includes('portfolio')) palette = ['#631B17', '#E60000', '#D4A017'];
        if (!palette) return;

        const canvas = document.createElement('canvas');
        canvas.id = 'entry-confetti-canvas';
        canvas.setAttribute('aria-hidden', 'true');
        canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2500;';
        document.body.appendChild(canvas);

        const context = canvas.getContext('2d');
        const particles = [];
        const start = performance.now();
        const emitDuration = 700;
        const maxDuration = 2400;
        let width = 0;
        let height = 0;
        let seedAngle = -1.2;

        function resize() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        function origin() {
            const title = document.querySelector('.case-title');
            if (!title) return { x: width * 0.28, y: Math.min(height * 0.28, 240) };
            const rect = title.getBoundingClientRect();
            return {
                x: Math.max(24, rect.left - 72),
                y: Math.max(24, rect.top + Math.min(rect.height * 0.5, 40))
            };
        }

        function spawn(point) {
            for (let index = 0; index < 3; index += 1) {
                seedAngle += 0.35;
                const angle = seedAngle + (Math.random() - 0.5) * 0.45;
                const speed = 1.2 + Math.random() * 1.6;
                particles.push({
                    x: point.x + (Math.random() - 0.5) * 8,
                    y: point.y + (Math.random() - 0.5) * 8,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1.2,
                    swirl: 0.012 + Math.random() * 0.02,
                    size: 2 + Math.random() * 3.5,
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.22,
                    color: palette[Math.floor(Math.random() * palette.length)],
                    created: performance.now(),
                    life: 700 + Math.random() * 900
                });
            }
        }

        function cleanup() {
            window.removeEventListener('resize', resize);
            canvas.remove();
        }

        function tick(now) {
            context.clearRect(0, 0, width, height);
            if (now - start <= emitDuration) spawn(origin());

            for (let index = particles.length - 1; index >= 0; index -= 1) {
                const particle = particles[index];
                const age = now - particle.created;
                const alpha = Math.max(0, 1 - age / particle.life);
                particle.x += particle.vx;
                particle.y += particle.vy;
                particle.vx += Math.sin(age * particle.swirl) * 0.03;
                particle.vy += 0.025;
                particle.rotation += particle.rotationSpeed;

                if (alpha <= 0 || particle.y > height + 20 || particle.x < -20 || particle.x > width + 20) {
                    particles.splice(index, 1);
                    continue;
                }

                context.save();
                context.translate(particle.x, particle.y);
                context.rotate(particle.rotation);
                context.globalAlpha = alpha;
                context.fillStyle = particle.color;
                context.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 0.6);
                context.restore();
            }

            if (now - start > maxDuration && particles.length === 0) {
                cleanup();
                return;
            }
            requestAnimationFrame(tick);
        }

        resize();
        window.addEventListener('resize', resize, { passive: true });
        requestAnimationFrame(tick);
    }

    function bootCaseEntryConfetti() {
        if (location.pathname.toLowerCase().includes('ibm')) {
            if (sessionStorage.getItem('ibm_unlocked') === 'true') initCaseEntryConfetti();
            else window.addEventListener('ibmCaseUnlocked', initCaseEntryConfetti, { once: true });
            return;
        }
        initCaseEntryConfetti();
    }

    document.addEventListener('click', function (event) {
        const anchor = event.target.closest && event.target.closest('a[href]');
        if (!anchor) return;
        rewriteHref(anchor);

        const isPlainClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
        if (anchor.id === 'backToWorkBtn' && isPlainClick) {
            event.preventDefault();
            event.stopImmediatePropagation();
            try {
                sessionStorage.setItem('pageTransition', JSON.stringify({ direction: 'from-left' }));
            } catch (error) {}
            location.href = anchor.href;
        }
    }, true);

    document.addEventListener('DOMContentLoaded', function () {
        applyPlayfairDisplay();
        rewriteLinks(document);
        capitalizeUiText(document);
        initAutoScrollers();
        initHeader();
        injectCaseNavigation();
        initCaseSidebar();
        normalizeCaseCornerRadius();
        styleHookCallouts();
        bootCaseEntryConfetti();

        const observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === 1) {
                        rewriteLinks(node);
                        capitalizeUiText(node);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();