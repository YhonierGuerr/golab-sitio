/* =========================================================
   GO-LAB — Panel de administración (modo demostración)
   Guarda en localStorage. Listo para migrar a Supabase
   (ver GUIA-BASE-DE-DATOS.md).
   ========================================================= */
(function () {
    'use strict';
    var cfg = window.GOLAB_CONFIG || {};
    var hasSupabase = !!(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY);

    function $(id) { return document.getElementById(id); }
    function esc(s) {
        return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
        });
    }
    function fmtDate(iso) {
        try { return new Date(iso).toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }); }
        catch (e) { return iso || ''; }
    }
    function read(key) { try { return JSON.parse(localStorage.getItem(key) || '[]'); } catch (e) { return []; } }
    function write(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

    /* ---------- Tema ---------- */
    var root = document.documentElement;
    var tg = $('themeToggle');
    if (tg) tg.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        root.setAttribute('data-theme', next);
        try { localStorage.setItem('golab-theme', next); } catch (e) {}
    });

    /* ---------- Autenticación (demo) ---------- */
    var loginView = $('loginView'), appView = $('appView');
    function isAuthed() { try { return sessionStorage.getItem('golab_auth') === '1'; } catch (e) { return false; } }
    function showApp() {
        loginView.hidden = true; appView.hidden = false;
        renderBanner(); renderClients(); renderLeads();
    }
    function showLogin() { appView.hidden = true; loginView.hidden = false; var p = $('pwd'); if (p) p.focus(); }

    $('loginForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var val = $('pwd').value;
        var ok = hasSupabase ? false : (val === (cfg.DEMO_PASSWORD || 'golab2026'));
        if (hasSupabase) {
            $('loginErr').textContent = 'Supabase está configurado: el login real se activa al conectar el SDK (ver guía).';
            return;
        }
        if (ok) { try { sessionStorage.setItem('golab_auth', '1'); } catch (e) {} showApp(); }
        else { $('loginErr').textContent = 'Contraseña incorrecta.'; }
    });
    $('logoutBtn').addEventListener('click', function () {
        try { sessionStorage.removeItem('golab_auth'); } catch (e) {}
        $('pwd').value = ''; showLogin();
    });

    function renderBanner() {
        var b = $('modeBanner');
        var info = '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>';
        if (hasSupabase) {
            b.innerHTML = info + '<span><strong>Supabase detectado.</strong> Falta activar la sincronización en el código (un paso técnico). Por ahora se muestran los datos locales. Sigue <a href="GUIA-BASE-DE-DATOS.md">la guía</a>.</span>';
        } else {
            b.innerHTML = info + '<span><strong>Modo demostración:</strong> los datos se guardan solo en este navegador/dispositivo. Para una base de datos real en la nube (con acceso desde cualquier lugar) conecta Supabase — ver <a href="GUIA-BASE-DE-DATOS.md">GUIA-BASE-DE-DATOS.md</a>.</span>';
        }
    }

    /* ---------- Tabs ---------- */
    document.querySelectorAll('.tab').forEach(function (t) {
        t.addEventListener('click', function () {
            document.querySelectorAll('.tab').forEach(function (x) { x.classList.toggle('is-active', x === t); });
            var tab = t.getAttribute('data-tab');
            $('tabClientes').hidden = tab !== 'clientes';
            $('tabLeads').hidden = tab !== 'leads';
        });
    });

    /* ---------- Clientes ---------- */
    var CL = 'golab-clients';
    function getClients() { return read(CL); }
    function setClients(arr) { write(CL, arr); updateCounts(); }

    function clientCard(c) {
        var meta = [];
        if (c.contact) meta.push('👤 ' + esc(c.contact));
        if (c.phone) meta.push('📞 <a href="tel:' + esc(c.phone) + '">' + esc(c.phone) + '</a>');
        if (c.email) meta.push('✉ <a href="mailto:' + esc(c.email) + '">' + esc(c.email) + '</a>');
        var wa = c.phone ? c.phone.replace(/[^0-9]/g, '') : '';
        return '<div class="row-card">'
            + '<div class="row-card__main">'
            + '<div class="row-card__title">' + esc(c.company) + (c.type ? ' <span class="pill-type">' + esc(c.type) + '</span>' : '') + '</div>'
            + (meta.length ? '<div class="row-card__meta">' + meta.join('') + '</div>' : '')
            + (c.notes ? '<div class="row-card__notes">' + esc(c.notes) + '</div>' : '')
            + '</div>'
            + '<div class="row-card__actions">'
            + (wa ? '<a class="icon-btn icon-btn--wa" href="https://wa.me/' + esc(wa) + '" target="_blank" rel="noopener" title="WhatsApp"><svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.74-.86-2-.95-.27-.1-.46-.15-.65.15-.2.3-.75.94-.92 1.13-.17.2-.34.22-.63.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.65-1.58-.9-2.16-.24-.57-.48-.5-.65-.5h-.56c-.2 0-.5.07-.77.37-.26.3-1.01.99-1.01 2.41 0 1.42 1.04 2.8 1.18 2.99.15.2 2.05 3.12 4.96 4.38 2.91 1.26 2.91.84 3.43.79.52-.05 1.74-.71 1.98-1.4.25-.69.25-1.28.17-1.4-.07-.13-.27-.2-.56-.35z"/></svg></a>' : '')
            + '<button class="icon-btn" data-edit="' + esc(c.id) + '" title="Editar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>'
            + '<button class="icon-btn icon-btn--danger" data-del="' + esc(c.id) + '" title="Eliminar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>'
            + '</div></div>';
    }

    function renderClients() {
        var q = ($('clientSearch').value || '').trim().toLowerCase();
        var list = getClients();
        if (q) list = list.filter(function (c) { return (c.company + ' ' + (c.contact || '') + ' ' + (c.email || '') + ' ' + (c.notes || '')).toLowerCase().indexOf(q) > -1; });
        var box = $('clientRows');
        if (!list.length) {
            box.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg><p>' + (q ? 'Sin resultados para tu búsqueda.' : 'Aún no tienes clientes. Agrega el primero con “+ Agregar cliente”.') + '</p></div>';
        } else {
            box.innerHTML = list.map(clientCard).join('');
        }
        updateCounts();
    }

    function updateCounts() {
        $('countClients').textContent = getClients().length;
        $('countLeads').textContent = read('golab-leads').length;
    }

    /* Modal cliente */
    var modal = $('clientModal');
    function openClient(c) {
        $('clientModalTitle').textContent = c ? 'Editar cliente' : 'Nuevo cliente';
        $('cId').value = c ? c.id : '';
        $('cCompany').value = c ? c.company || '' : '';
        $('cContact').value = c ? c.contact || '' : '';
        $('cType').value = c ? c.type || 'Empresa' : 'Empresa';
        $('cPhone').value = c ? c.phone || '' : '';
        $('cEmail').value = c ? c.email || '' : '';
        $('cNotes').value = c ? c.notes || '' : '';
        modal.hidden = false;
        $('cCompany').focus();
    }
    function closeClient() { modal.hidden = true; }
    modal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeClient(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeClient(); });

    $('addClient').addEventListener('click', function () { openClient(null); });

    $('clientForm').addEventListener('submit', function (e) {
        e.preventDefault();
        var id = $('cId').value;
        var list = getClients();
        var data = {
            company: $('cCompany').value.trim(),
            contact: $('cContact').value.trim(),
            type: $('cType').value,
            phone: $('cPhone').value.trim(),
            email: $('cEmail').value.trim(),
            notes: $('cNotes').value.trim()
        };
        if (!data.company) return;
        if (id) {
            for (var i = 0; i < list.length; i++) if (list[i].id === id) { data.id = id; data.createdAt = list[i].createdAt; list[i] = data; break; }
        } else {
            data.id = 'cli_' + Date.now();
            data.createdAt = new Date().toISOString();
            list.unshift(data);
        }
        setClients(list);
        closeClient();
        renderClients();
    });

    $('clientRows').addEventListener('click', function (e) {
        var ed = e.target.closest('[data-edit]'), dl = e.target.closest('[data-del]');
        if (ed) {
            var c = getClients().filter(function (x) { return x.id === ed.getAttribute('data-edit'); })[0];
            if (c) openClient(c);
        } else if (dl) {
            if (confirm('¿Eliminar este cliente? Esta acción no se puede deshacer.')) {
                setClients(getClients().filter(function (x) { return x.id !== dl.getAttribute('data-del'); }));
                renderClients();
            }
        }
    });
    $('clientSearch').addEventListener('input', renderClients);

    /* ---------- Solicitudes (leads del formulario) ---------- */
    function leadCard(l) {
        var meta = [];
        if (l.email) meta.push('✉ <a href="mailto:' + esc(l.email) + '">' + esc(l.email) + '</a>');
        if (l.phone) meta.push('📞 <a href="tel:' + esc(l.phone) + '">' + esc(l.phone) + '</a>');
        if (l.service) meta.push('🛠 ' + esc(l.service));
        meta.push('🕒 ' + esc(fmtDate(l.date)));
        return '<div class="row-card">'
            + '<div class="row-card__main">'
            + '<div class="row-card__title">' + esc(l.name || 'Sin nombre') + '</div>'
            + '<div class="row-card__meta">' + meta.join('') + '</div>'
            + (l.message ? '<div class="row-card__notes">“' + esc(l.message) + '”</div>' : '')
            + '</div>'
            + '<div class="row-card__actions">'
            + '<button class="icon-btn" data-tocli="' + esc(l.id) + '" title="Convertir en cliente"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg></button>'
            + '<button class="icon-btn icon-btn--danger" data-dellead="' + esc(l.id) + '" title="Eliminar"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg></button>'
            + '</div></div>';
    }
    function renderLeads() {
        var q = ($('leadSearch').value || '').trim().toLowerCase();
        var list = read('golab-leads');
        if (q) list = list.filter(function (l) { return ((l.name || '') + ' ' + (l.email || '') + ' ' + (l.service || '') + ' ' + (l.message || '')).toLowerCase().indexOf(q) > -1; });
        var box = $('leadRows');
        if (!list.length) {
            box.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 4h16v12H5.17L4 17.17z"/></svg><p>' + (q ? 'Sin resultados.' : 'Aún no hay solicitudes. Las que lleguen por el formulario de contacto aparecerán aquí.') + '</p></div>';
        } else {
            box.innerHTML = list.map(leadCard).join('');
        }
        updateCounts();
    }
    $('leadRows').addEventListener('click', function (e) {
        var conv = e.target.closest('[data-tocli]'), del = e.target.closest('[data-dellead]');
        if (conv) {
            var l = read('golab-leads').filter(function (x) { return x.id === conv.getAttribute('data-tocli'); })[0];
            if (l) openClient({ id: '', company: l.name || '', contact: l.name || '', type: 'Empresa', phone: l.phone || '', email: l.email || '', notes: (l.service ? 'Interesado en: ' + l.service + '. ' : '') + (l.message || '') });
        } else if (del) {
            if (confirm('¿Eliminar esta solicitud?')) {
                write('golab-leads', read('golab-leads').filter(function (x) { return x.id !== del.getAttribute('data-dellead'); }));
                renderLeads();
            }
        }
    });
    $('leadSearch').addEventListener('input', renderLeads);

    /* ---------- Exportar CSV ---------- */
    function toCSV(rows, headers) {
        var lines = [headers.map(function (h) { return h.label; }).join(',')];
        rows.forEach(function (r) {
            lines.push(headers.map(function (h) {
                var v = r[h.key] == null ? '' : String(r[h.key]);
                return '"' + v.replace(/"/g, '""') + '"';
            }).join(','));
        });
        return lines.join('\n');
    }
    function download(name, text) {
        var blob = new Blob(['﻿' + text], { type: 'text/csv;charset=utf-8;' });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob); a.download = name; a.click();
        setTimeout(function () { URL.revokeObjectURL(a.href); }, 500);
    }
    $('exportClients').addEventListener('click', function () {
        download('clientes-golab.csv', toCSV(getClients(), [
            { key: 'company', label: 'Empresa/Institución' }, { key: 'type', label: 'Tipo' }, { key: 'contact', label: 'Contacto' },
            { key: 'phone', label: 'Teléfono' }, { key: 'email', label: 'Correo' }, { key: 'notes', label: 'Notas' }, { key: 'createdAt', label: 'Creado' }
        ]));
    });
    $('exportLeads').addEventListener('click', function () {
        download('solicitudes-golab.csv', toCSV(read('golab-leads'), [
            { key: 'name', label: 'Nombre' }, { key: 'email', label: 'Correo' }, { key: 'phone', label: 'Teléfono' },
            { key: 'service', label: 'Servicio' }, { key: 'message', label: 'Mensaje' }, { key: 'date', label: 'Fecha' }
        ]));
    });

    /* ---------- Inicio ---------- */
    if (isAuthed()) showApp(); else showLogin();
})();
