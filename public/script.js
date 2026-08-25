/* ============================================================
   Poke API — landing / docs
   JS vanilla, sin dependencias. Todo es progressive enhancement:
   la página funciona igual si este archivo no se ejecuta.
   ============================================================ */
(function () {
    'use strict';

    var API_BASE = 'https://poke-api-softdo.up.railway.app/api/v1';

    /* ---------- año del footer ---------- */
    var yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ---------- botones de copiar ---------- */

    function legacyCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();

        var ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (err) {
            ok = false;
        }
        document.body.removeChild(ta);
        return ok;
    }

    function copyText(text) {
        if (!navigator.clipboard || !window.isSecureContext) {
            return Promise.resolve(legacyCopy(text));
        }

        // La Clipboard API deja la promesa pendiente indefinidamente si el
        // documento pierde el foco, así que se corta y se usa el fallback.
        return new Promise(function (resolve) {
            var settled = false;

            function finish(value) {
                if (settled) return;
                settled = true;
                window.clearTimeout(timer);
                resolve(value);
            }

            var timer = window.setTimeout(function () {
                finish(legacyCopy(text));
            }, 1200);

            navigator.clipboard.writeText(text).then(function () {
                finish(true);
            }, function () {
                finish(legacyCopy(text));
            });
        });
    }

    function feedback(button, state) {
        var label = button.querySelector('.copy__label');
        var original = button.getAttribute('data-original-label');

        if (original === null) {
            original = label ? label.textContent : '';
            button.setAttribute('data-original-label', original);
        }

        button.setAttribute('data-copied', state === true ? 'true' : 'error');
        if (label) label.textContent = state === true ? 'Copiado' : 'Error';

        window.clearTimeout(button._copyTimer);
        button._copyTimer = window.setTimeout(function () {
            button.removeAttribute('data-copied');
            if (label) label.textContent = original;
        }, 1600);
    }

    var buttons = document.querySelectorAll('.copy[data-copy-target]');

    Array.prototype.forEach.call(buttons, function (button) {
        var target = document.getElementById(button.getAttribute('data-copy-target'));
        if (!target) {
            button.hidden = true;
            return;
        }

        button.addEventListener('click', function () {
            // textContent conserva los saltos de línea del <pre> y descarta el marcado
            copyText(target.textContent.replace(/\s+$/, '')).then(function (ok) {
                feedback(button, ok);
            });
        });
    });

    /* ---------- estado del servicio ----------
       Solo se comprueba cuando la página se sirve desde el mismo origen que
       la API (es decir, en producción). Abierta como archivo local o desde
       otro host la petición fallaría por CORS y el resultado no diría nada
       sobre la API: en ese caso se deja la etiqueta neutra del HTML.        */

    var statusEl = document.getElementById('status');
    var statusText = document.getElementById('status-text');

    var sameOrigin = false;
    try {
        sameOrigin = new URL(API_BASE).origin === window.location.origin;
    } catch (err) {
        sameOrigin = false;
    }

    if (statusEl && statusText && sameOrigin && typeof window.fetch === 'function') {
        var controller = null;
        var timer = null;

        if (typeof window.AbortController === 'function') {
            controller = new AbortController();
            timer = window.setTimeout(function () { controller.abort(); }, 8000);
        }

        window.fetch(API_BASE + '/pokemon?limit=1', {
            method: 'GET',
            signal: controller ? controller.signal : undefined
        }).then(function (response) {
            if (timer) window.clearTimeout(timer);
            if (response.ok) {
                statusEl.setAttribute('data-state', 'online');
                statusText.textContent = 'Online · producción';
            } else {
                statusEl.setAttribute('data-state', 'offline');
                statusText.textContent = 'API respondió ' + response.status;
            }
        }).catch(function () {
            if (timer) window.clearTimeout(timer);
            statusEl.setAttribute('data-state', 'offline');
            statusText.textContent = 'Sin respuesta de la API';
        });
    }
}());
