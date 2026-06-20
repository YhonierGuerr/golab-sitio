/* =========================================================
   SysLog Tecnología — JavaScript principal
   ========================================================= */
(function () {
    'use strict';

    /* ---------- Tema claro / oscuro ----------
       El tema inicial ya lo fija un script inline en <head> para evitar
       el destello de contenido (FOUC). Aquí solo gestionamos el botón. */
    var root = document.documentElement;
    var themeToggle = document.getElementById('themeToggle');

    function applyMeta(theme) {
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', theme === 'dark' ? '#0E0F12' : '#FF6B00');
    }
    applyMeta(root.getAttribute('data-theme') || 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', function () {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', next);
            applyMeta(next);
            try { localStorage.setItem('golab-theme', next); } catch (e) {}
        });
    }

    /* ---------- Menú móvil ---------- */
    var navToggle = document.getElementById('navToggle');
    var navMenu = document.getElementById('navMenu');

    function closeMenu() {
        if (!navMenu) return;
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
    }

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            var open = navMenu.classList.toggle('is-open');
            navToggle.classList.toggle('is-open', open);
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            navToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
        });
        navMenu.addEventListener('click', function (e) {
            if (e.target.closest('.nav__link')) closeMenu();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') closeMenu();
        });
    }

    /* ---------- Header con sombra al hacer scroll ---------- */
    var header = document.getElementById('header');
    var toTop = document.getElementById('toTop');

    function onScroll() {
        var y = window.scrollY || window.pageYOffset;
        if (header) header.classList.toggle('is-scrolled', y > 8);
        if (toTop) toTop.classList.toggle('is-visible', y > 600);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (toTop) {
        toTop.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- Animaciones al hacer scroll (reveal) ----------
       Pestaña visible  -> IntersectionObserver anima al entrar en pantalla.
       Pestaña oculta / sin IO -> se muestra todo al instante (sin transición),
       porque en segundo plano el compositor pausa las transiciones CSS.
       En cualquier caso, el contenido SIEMPRE termina visible. */
    var revealEls = document.querySelectorAll('.reveal');

    function revealInstant() { root.classList.add('reveal-instant'); }

    function revealInView() {
        revealEls.forEach(function (el) {
            var r = el.getBoundingClientRect();
            if (r.top < window.innerHeight * 0.95 && r.bottom > 0) el.classList.add('is-visible');
        });
    }

    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(function (el) { io.observe(el); });

        // Render en segundo plano: muestra todo ya, sin animación.
        if (document.hidden) revealInstant();

        // Si una pestaña oculta pasa a visible, revela lo que esté a la vista.
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) revealInView();
        });

        // Red de seguridad: si tras 10s algo sigue oculto, hazlo visible.
        setTimeout(function () {
            revealEls.forEach(function (el) { el.classList.add('is-visible'); });
        }, 10000);
    } else {
        revealInstant();
    }

    /* ---------- Contadores animados (estadísticas) ---------- */
    var counters = document.querySelectorAll('.stat__num');

    function formatNum(n) {
        try { return n.toLocaleString('es-CO'); } catch (e) { return '' + n; }
    }

    function animateCounter(el) {
        var target = parseInt(el.getAttribute('data-count'), 10) || 0;
        var prefix = el.getAttribute('data-prefix') || '';
        // Si no se puede animar (pestaña oculta, sin rAF, movimiento reducido), muestra el valor final.
        var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (document.hidden || reduce || !window.requestAnimationFrame) {
            el.textContent = prefix + formatNum(target);
            return;
        }
        var dur = 1600, start = null;
        function tick(now) {
            if (start === null) start = now;
            var p = Math.min((now - start) / dur, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = prefix + formatNum(Math.round(target * eased));
            if (p < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + formatNum(target);
        }
        requestAnimationFrame(tick);
    }

    if (counters.length) {
        if ('IntersectionObserver' in window) {
            var cObs = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        animateCounter(entry.target);
                        cObs.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.4 });
            counters.forEach(function (el) { cObs.observe(el); });
            // Failsafe: si en 9s algún contador sigue en 0, fíjalo a su valor final.
            setTimeout(function () {
                counters.forEach(function (el) {
                    if (el.textContent === '0') {
                        el.textContent = (el.getAttribute('data-prefix') || '') + formatNum(parseInt(el.getAttribute('data-count'), 10) || 0);
                    }
                });
            }, 9000);
        } else {
            counters.forEach(animateCounter);
        }
    }

    /* ---------- Scrollspy: enlace activo del nav ---------- */
    var sections = document.querySelectorAll('main section[id]');
    var navLinks = document.querySelectorAll('.nav__link');

    if ('IntersectionObserver' in window && sections.length) {
        var spy = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var id = entry.target.getAttribute('id');
                    navLinks.forEach(function (link) {
                        link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
                    });
                }
            });
        }, { threshold: 0.5, rootMargin: '-20% 0px -55% 0px' });
        sections.forEach(function (s) { spy.observe(s); });
    }

    /* ---------- Mapa: carga bajo demanda (mejora la velocidad) ---------- */
    var mapFacade = document.getElementById('mapFacade');
    if (mapFacade) {
        mapFacade.addEventListener('click', function () {
            var src = mapFacade.getAttribute('data-map');
            var iframe = document.createElement('iframe');
            iframe.title = 'Mapa de ubicación';
            iframe.src = src;
            iframe.width = '100%';
            iframe.height = '220';
            iframe.style.border = '0';
            iframe.loading = 'lazy';
            iframe.referrerPolicy = 'no-referrer-when-downgrade';
            iframe.allowFullscreen = true;
            mapFacade.replaceWith(iframe);
        });
    }

    /* ---------- Año dinámico en el footer ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ---------- Validación y envío del formulario ---------- */
    var form = document.getElementById('contactForm');
    var note = document.getElementById('formNote');

    function setNote(msg, type) {
        if (!note) return;
        note.textContent = msg;
        note.className = 'form-note' + (type ? ' ' + type : '');
    }

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var valid = true;
            var required = form.querySelectorAll('[required]');

            required.forEach(function (field) {
                var ok = field.value.trim() !== '';
                if (field.type === 'email') {
                    ok = ok && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
                }
                field.classList.toggle('invalid', !ok);
                if (!ok && valid) field.focus();
                if (!ok) valid = false;
            });

            if (!valid) {
                setNote('Por favor revisa los campos marcados.', 'error');
                return;
            }

            // Arma un mensaje y lo abre por WhatsApp.
            var name = form.name.value.trim();
            var service = form.service.value || 'un servicio';
            var msg = form.message.value.trim();
            var text = 'Hola, soy ' + name + '. Estoy interesado en ' + service + '. ' + msg;
            var wa = 'https://wa.me/573128565662?text=' + encodeURIComponent(text);

            // Guarda el lead (visible en el Panel). En modo demo se almacena en este navegador;
            // al conectar Supabase, este mismo lead irá a la base de datos en la nube.
            try {
                var leads = JSON.parse(localStorage.getItem('golab-leads') || '[]');
                leads.unshift({
                    id: 'lead_' + Date.now(),
                    name: name,
                    email: form.email.value.trim(),
                    phone: form.phone.value.trim(),
                    service: form.service.value || '',
                    message: msg,
                    date: new Date().toISOString()
                });
                localStorage.setItem('golab-leads', JSON.stringify(leads.slice(0, 500)));
            } catch (e) {}

            setNote('¡Gracias! Guardamos tu solicitud y te redirigimos a WhatsApp…', 'success');
            form.reset();
            setTimeout(function () { window.open(wa, '_blank', 'noopener'); }, 900);
        });

        form.addEventListener('input', function (e) {
            if (e.target.classList.contains('invalid')) e.target.classList.remove('invalid');
        });
    }

    /* ---------- Catálogo de equipos ---------- */
    (function initCatalog() {
        var grid = document.getElementById('catalogGrid');
        if (!grid || !window.GOLAB_CATALOG) return;
        var data = window.GOLAB_CATALOG;
        var categories = window.GOLAB_CATEGORIES || [];
        var searchInput = document.getElementById('catalogSearch');
        var filtersEl = document.getElementById('catalogFilters');
        var emptyEl = document.getElementById('catalogEmpty');
        var modal = document.getElementById('productModal');
        var state = { cat: 'Todos', q: '' };

        function esc(s) {
            return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
                return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
            });
        }

        var ICONS = {
            'Redes': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><path d="M6 6h.01M6 18h.01"/></svg>',
            'CCTV': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
            'Computadores': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
            'Servidores': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="6" rx="2"/><rect x="3" y="11" width="18" height="6" rx="2"/><path d="M7 6h.01M7 14h.01M12 19v2"/></svg>',
            'Accesorios': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="m3.3 7 8.7 5 8.7-5M12 22V12"/></svg>'
        };
        function iconFor(cat) { return ICONS[cat] || ICONS['Accesorios']; }
        function stockClass(s) { s = (s || '').toLowerCase(); if (s.indexOf('agot') > -1) return 'is-out'; if (s.indexOf('pedido') > -1) return 'is-low'; return 'is-in'; }
        function media(p) {
            if (p.img) return '<img src="' + esc(p.img) + '" alt="' + esc(p.name) + '" loading="lazy">';
            return '<span class="catalog-card__icon">' + iconFor(p.category) + '</span>';
        }
        function cardHTML(p) {
            return '<button class="catalog-card" type="button" data-id="' + esc(p.id) + '">'
                + '<span class="catalog-card__media cat--' + esc(p.category) + '">' + media(p) + '</span>'
                + '<span class="catalog-card__body">'
                + '<span class="tag">' + esc(p.category) + '</span>'
                + '<span class="catalog-card__name">' + esc(p.name) + '</span>'
                + '<span class="catalog-card__model">' + esc(p.model) + '</span>'
                + '<span class="catalog-card__foot"><span class="catalog-card__stock ' + stockClass(p.stock) + '">' + esc(p.stock || '') + '</span><span class="catalog-card__more">Ver detalle →</span></span>'
                + '</span></button>';
        }
        function render() {
            var q = state.q.trim().toLowerCase();
            var list = data.filter(function (p) {
                var okCat = state.cat === 'Todos' || p.category === state.cat;
                var okQ = !q || (p.name + ' ' + p.model + ' ' + p.category).toLowerCase().indexOf(q) > -1;
                return okCat && okQ;
            });
            grid.innerHTML = list.map(cardHTML).join('');
            if (emptyEl) emptyEl.hidden = list.length > 0;
        }

        // Chips de filtro por categoría
        var cats = ['Todos'].concat(categories);
        if (filtersEl) {
            filtersEl.innerHTML = cats.map(function (c, i) {
                return '<button class="catalog-chip' + (i === 0 ? ' is-active' : '') + '" type="button" data-cat="' + esc(c) + '">' + esc(c) + '</button>';
            }).join('');
            filtersEl.addEventListener('click', function (e) {
                var b = e.target.closest('.catalog-chip'); if (!b) return;
                state.cat = b.getAttribute('data-cat');
                filtersEl.querySelectorAll('.catalog-chip').forEach(function (x) { x.classList.toggle('is-active', x === b); });
                render();
            });
        }
        if (searchInput) searchInput.addEventListener('input', function () { state.q = searchInput.value; render(); });

        // Modal de detalle
        var lastFocus = null;
        function findProduct(id) { for (var i = 0; i < data.length; i++) { if (data[i].id === id) return data[i]; } return null; }
        function openModal(p) {
            var mediaEl = document.getElementById('modalMedia');
            mediaEl.className = 'modal__media cat--' + p.category;
            mediaEl.innerHTML = media(p);
            document.getElementById('modalCat').textContent = p.category;
            document.getElementById('modalTitle').textContent = p.name;
            document.getElementById('modalModel').textContent = 'Modelo: ' + p.model;
            document.getElementById('modalDesc').textContent = p.desc || '';
            document.getElementById('modalSpecs').innerHTML = (p.specs || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');
            var stockEl = document.getElementById('modalStock');
            stockEl.textContent = p.stock || '';
            stockEl.className = 'modal__stock ' + stockClass(p.stock);
            var msg = 'Hola, quiero agendar un pedido del siguiente equipo:\n• ' + p.name + ' (' + p.model + ')\n¿Me confirman disponibilidad y precio?';
            document.getElementById('modalWhats').href = 'https://wa.me/573128565662?text=' + encodeURIComponent(msg);
            lastFocus = document.activeElement;
            modal.hidden = false;
            document.body.style.overflow = 'hidden';
            var closeBtn = modal.querySelector('.modal__close');
            if (closeBtn) closeBtn.focus();
        }
        function closeModal() {
            modal.hidden = true;
            document.body.style.overflow = '';
            if (lastFocus && lastFocus.focus) lastFocus.focus();
        }
        grid.addEventListener('click', function (e) {
            var card = e.target.closest('.catalog-card'); if (!card) return;
            var p = findProduct(card.getAttribute('data-id')); if (p) openModal(p);
        });
        if (modal) {
            modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeModal(); });
            document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
        }

        render();
    })();
})();
