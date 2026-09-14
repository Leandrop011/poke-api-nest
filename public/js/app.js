/* ═══════════════════════════════════════════════════════════════════
   Poke API · Documentación interactiva
   Vanilla JS, sin dependencias. Todo el contenido de ENDPOINTS está
   extraído del código fuente del proyecto (controllers, DTOs, service,
   pipes y main.ts).
   ═══════════════════════════════════════════════════════════════════ */
(function () {
    'use strict';

    /** Prefijo global definido en main.ts → app.setGlobalPrefix('api/v1') */
    var BASE = '/api/v1';

    /* ═══════════════════════════════════════════════════════════════
       DEFINICIÓN DE ENDPOINTS
       ═══════════════════════════════════════════════════════════════ */
    var ENDPOINTS = [
        {
            id: 'get-pokemon-list',
            group: 'pokemon',
            method: 'GET',
            path: BASE + '/pokemon',
            title: 'Listar pokémon (paginado)',
            navText: '/pokemon',
            description: 'Devuelve los pokémon ordenados de forma ascendente por <code>numPokemon</code>. ' +
                'La respuesta excluye el campo <code>__v</code> mediante <code>select(\'-__v\')</code>. ' +
                'Si no se envían query params se aplican los valores por defecto del servicio: ' +
                '<strong>limit 5</strong> y <strong>offset 0</strong>.',
            note: {
                type: 'warn',
                title: 'Sobre el límite por defecto.',
                html: 'El servicio inyecta <code>default_limit</code> desde las variables de entorno en su ' +
                    'constructor, pero <code>findAll</code> no lo usa: aplica <code>limit(limit ?? 5)</code> y ' +
                    '<code>skip(offset ?? 0)</code> con valores fijos. Por eso el límite efectivo sin query ' +
                    'params es <strong>5</strong>, independientemente de <code>DEFAULT_LIMIT</code>.'
            },
            pathParams: [],
            queryParams: [
                {
                    name: 'limit',
                    type: 'number',
                    required: false,
                    rules: ['@IsOptional', '@IsNumber', '@IsPositive', '@Min(1)'],
                    desc: 'Cantidad máxima de registros a devolver. Por defecto 5.',
                    placeholder: '10'
                },
                {
                    name: 'offset',
                    type: 'number',
                    required: false,
                    rules: ['@IsOptional', '@IsNumber', '@IsPositive'],
                    desc: 'Registros a saltar antes de empezar a devolver. Por defecto 0. Debe ser positivo: enviar <code>0</code> explícitamente devuelve 400.',
                    placeholder: '5'
                }
            ],
            body: null,
            responseStatus: 200,
            responseExample: [
                { _id: '67a1f4c8d2e91b0012a34b01', name: 'bulbasaur', numPokemon: 1 },
                { _id: '67a1f4c8d2e91b0012a34b02', name: 'ivysaur', numPokemon: 2 },
                { _id: '67a1f4c8d2e91b0012a34b03', name: 'venusaur', numPokemon: 3 }
            ],
            errors: [
                { code: 400, when: '<code>limit</code> u <code>offset</code> no son números positivos.' },
                { code: 400, when: 'Se envía un query param no declarado en el DTO (p. ej. <code>?page=2</code>).' }
            ]
        },

        {
            id: 'get-pokemon-one',
            group: 'pokemon',
            method: 'GET',
            path: BASE + '/pokemon/{term}',
            title: 'Buscar un pokémon por término',
            navText: '/pokemon/{term}',
            description: 'Búsqueda flexible. El servicio prueba en este orden: ' +
                '<strong>1)</strong> si <code>term</code> es numérico busca por <code>numPokemon</code>; ' +
                '<strong>2)</strong> si no hubo resultado y es un MongoID válido busca por <code>_id</code>; ' +
                '<strong>3)</strong> si sigue sin haber resultado busca por <code>name</code>, ' +
                'normalizando el término a minúsculas y recortando espacios.',
            pathParams: [
                {
                    name: 'term',
                    type: 'string',
                    required: true,
                    desc: 'Número de pokédex, MongoID o nombre.',
                    placeholder: 'pikachu'
                }
            ],
            queryParams: [],
            body: null,
            responseStatus: 200,
            responseExample: { _id: '67a1f4c8d2e91b0012a34b19', name: 'pikachu', numPokemon: 25, __v: 0 },
            errors: [
                { code: 404, when: 'No hay coincidencia por número, MongoID ni nombre. Mensaje: <code>Pokemon with id, name or numPokemon "x",not found</code>.' }
            ]
        },

        {
            id: 'post-pokemon',
            group: 'pokemon',
            method: 'POST',
            path: BASE + '/pokemon',
            title: 'Crear un pokémon',
            navText: '/pokemon',
            description: 'Inserta un nuevo documento en la colección. El <code>name</code> se convierte a ' +
                'minúsculas antes de guardarse. Ambos campos tienen índice único en el esquema, así que ' +
                'duplicar <code>name</code> o <code>numPokemon</code> devuelve 400.',
            pathParams: [],
            queryParams: [],
            body: {
                required: true,
                fields: [
                    {
                        name: 'numPokemon',
                        type: 'number',
                        required: true,
                        rules: ['@IsInt', '@IsPositive', '@Min(1)'],
                        desc: 'Número de pokédex. Entero positivo, mínimo 1. Único.'
                    },
                    {
                        name: 'name',
                        type: 'string',
                        required: true,
                        rules: ['@IsString', '@MinLength(1)'],
                        desc: 'Nombre del pokémon. Mínimo 1 carácter. Único, se almacena en minúsculas.'
                    }
                ],
                example: { numPokemon: 152, name: 'chikorita' }
            },
            responseStatus: 201,
            responseExample: { name: 'chikorita', numPokemon: 152, _id: '67a1f4c8d2e91b0012a34c88', __v: 0 },
            errors: [
                { code: 400, when: 'Falta un campo obligatorio o no cumple las validaciones del DTO.' },
                { code: 400, when: 'Se envía una propiedad no declarada: <code>property x should not exist</code>.' },
                { code: 400, when: 'Duplicado (error 11000 de Mongo): <code>Pokemon exist in db {"name":"chikorita"}</code>.' },
                { code: 500, when: 'Cualquier otro fallo: <code>Cant operation pokemon - Check server logs.</code>' }
            ]
        },

        {
            id: 'patch-pokemon',
            group: 'pokemon',
            method: 'PATCH',
            path: BASE + '/pokemon/{term}',
            title: 'Actualizar un pokémon',
            navText: '/pokemon/{term}',
            description: 'Localiza el pokémon con la misma búsqueda flexible que <code>GET /pokemon/{term}</code> ' +
                'y aplica los campos recibidos. El DTO es un <code>PartialType</code> del de creación, así que ' +
                'todos los campos son opcionales pero mantienen sus mismas validaciones. Si llega ' +
                '<code>name</code>, se normaliza a minúsculas y se recortan los espacios.',
            note: {
                type: 'info',
                title: 'Qué devuelve exactamente.',
                html: 'El servicio responde con <code>{ ...pokemon.toJSON(), ...updatePokemonDto }</code>: ' +
                    'el documento tal y como estaba antes de la actualización, con los campos enviados ' +
                    'sobrescritos encima. Es el resultado esperado, pero no es una relectura de la base de datos.'
            },
            pathParams: [
                {
                    name: 'term',
                    type: 'string',
                    required: true,
                    desc: 'Número de pokédex, MongoID o nombre del pokémon a actualizar.',
                    placeholder: '152'
                }
            ],
            queryParams: [],
            body: {
                required: true,
                fields: [
                    {
                        name: 'numPokemon',
                        type: 'number',
                        required: false,
                        rules: ['@IsInt', '@IsPositive', '@Min(1)'],
                        desc: 'Opcional. Nuevo número de pokédex.'
                    },
                    {
                        name: 'name',
                        type: 'string',
                        required: false,
                        rules: ['@IsString', '@MinLength(1)'],
                        desc: 'Opcional. Nuevo nombre.'
                    }
                ],
                example: { name: 'chikorita-shiny' }
            },
            responseStatus: 200,
            responseExample: { _id: '67a1f4c8d2e91b0012a34c88', name: 'chikorita-shiny', numPokemon: 152, __v: 0 },
            errors: [
                { code: 404, when: 'No existe ningún pokémon para ese <code>term</code>.' },
                { code: 400, when: 'El body no cumple las validaciones o incluye campos no declarados.' },
                { code: 400, when: 'El nuevo <code>name</code> o <code>numPokemon</code> ya existe en otro documento.' },
                { code: 500, when: 'Cualquier otro fallo al actualizar.' }
            ]
        },

        {
            id: 'delete-pokemon',
            group: 'pokemon',
            method: 'DELETE',
            path: BASE + '/pokemon/{id}',
            title: 'Eliminar un pokémon',
            navText: '/pokemon/{id}',
            description: 'Elimina el documento con ese <code>_id</code>. A diferencia del resto de rutas, aquí ' +
                '<strong>solo se acepta un MongoID</strong>: un pipe personalizado (<code>ParseMongoIdPipe</code>) ' +
                'valida el formato antes de llegar al servicio. La eliminación se hace con una única consulta ' +
                '<code>deleteOne</code>, sin buscar primero.',
            note: {
                type: 'warn',
                title: 'No acepta nombre ni número.',
                html: 'Pasar <code>pikachu</code> o <code>25</code> aquí devuelve <code>400 · is not a valid MongoID.</code> ' +
                    'Obtén primero el <code>_id</code> con <code>GET /api/v1/pokemon/{term}</code>.'
            },
            pathParams: [
                {
                    name: 'id',
                    type: 'MongoID',
                    required: true,
                    desc: 'ObjectId de 24 caracteres hexadecimales.',
                    placeholder: '67a1f4c8d2e91b0012a34c88'
                }
            ],
            queryParams: [],
            body: null,
            responseStatus: 200,
            responseExample: { status: 'OK' },
            errors: [
                { code: 400, when: 'El <code>id</code> no tiene formato de MongoID: <code>abc is not a valid MongoID.</code>' },
                { code: 400, when: 'El MongoID es válido pero no existe: <code>Pokemon with id: \'...\' not found.</code>' }
            ]
        },

        {
            id: 'get-seed',
            group: 'seed',
            method: 'GET',
            path: BASE + '/seed',
            title: 'Poblar la base de datos',
            navText: '/seed',
            description: 'Vacía la colección y la repuebla con los <strong>100 primeros pokémon</strong> ' +
                'obtenidos de <code>pokeapi.co/api/v2/pokemon?limit=100</code>. La petición HTTP se hace a ' +
                'través de un adaptador propio sobre Axios. El <code>numPokemon</code> se deriva del ' +
                'penúltimo segmento de la URL de cada resultado, y los 100 documentos se insertan en una ' +
                'única operación <code>insertMany</code>.',
            note: {
                type: 'danger',
                title: 'Operación destructiva.',
                html: 'Lo primero que hace es <code>deleteMany({})</code>: <strong>borra todos los documentos ' +
                    'de la colección</strong>, incluidos los que hayas creado a mano, antes de reinsertar los 100 ' +
                    'de PokeAPI. Es un endpoint pensado para desarrollo y no está protegido por autenticación.'
            },
            destructive: true,
            pathParams: [],
            queryParams: [],
            body: null,
            responseStatus: 200,
            responseType: 'text',
            responseExample: 'SEED EXECUTED',
            errors: [
                { code: 500, when: 'Falla la llamada a PokeAPI o la inserción en la base de datos.' }
            ]
        }
    ];

    /* ═══════════════════════════════════════════════════════════════
       UTILIDADES
       ═══════════════════════════════════════════════════════════════ */

    var $  = function (sel, ctx) { return (ctx || document).querySelector(sel); };
    var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

    /** Escapa caracteres con significado en HTML. */
    function esc(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    /**
     * Resaltado de sintaxis JSON hecho a mano: se serializa, se escapa
     * y luego se envuelve cada token en un span con su clase.
     */
    function highlightJson(value) {
        var json;
        try {
            json = JSON.stringify(value, null, 2);
        } catch (e) {
            return esc(String(value));
        }
        if (json === undefined) return esc(String(value));

        return esc(json).replace(
            /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false)\b|\bnull\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
            function (match) {
                var cls = 'tok-num';
                if (/^"/.test(match)) {
                    cls = /:$/.test(match) ? 'tok-key' : 'tok-str';
                } else if (/^(true|false)$/.test(match)) {
                    cls = 'tok-bool';
                } else if (/^null$/.test(match)) {
                    cls = 'tok-null';
                }
                return '<span class="' + cls + '">' + match + '</span>';
            }
        );
    }

    /** Pinta la ruta resaltando los {placeholders}. */
    function renderPath(path) {
        return esc(path).replace(/\{(\w+)\}/g, function (_, name) {
            return '<span class="param">{' + name + '}</span>';
        });
    }

    function statusClass(code) {
        if (!code) return 'status--err';
        if (code < 300) return 'status--2xx';
        if (code < 400) return 'status--3xx';
        if (code < 500) return 'status--4xx';
        return 'status--5xx';
    }

    function formatBytes(n) {
        if (n < 1024) return n + ' B';
        if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
        return (n / (1024 * 1024)).toFixed(2) + ' MB';
    }

    /* ═══════════════════════════════════════════════════════════════
       RENDER DE TARJETAS
       ═══════════════════════════════════════════════════════════════ */

    function renderParamTable(title, params) {
        if (!params.length) return '';

        var rows = params.map(function (p) {
            var tag = p.required
                ? '<span class="tag tag--req">requerido</span>'
                : '<span class="tag tag--opt">opcional</span>';
            var rules = (p.rules || []).map(function (r) {
                return '<span class="tag">' + esc(r) + '</span>';
            }).join('');

            return '<tr>' +
                '<td class="mono accent">' + esc(p.name) + '</td>' +
                '<td class="mono">' + esc(p.type) + '</td>' +
                '<td>' + tag + '</td>' +
                '<td>' + p.desc + (rules ? '<div style="margin-top:6px">' + rules + '</div>' : '') + '</td>' +
                '</tr>';
        }).join('');

        return '<div class="block">' +
            '<h4 class="block__title">' + esc(title) + '</h4>' +
            '<div class="table-wrap"><table class="table"><thead><tr>' +
            '<th>Nombre</th><th>Tipo</th><th></th><th>Descripción</th>' +
            '</tr></thead><tbody>' + rows + '</tbody></table></div>' +
            '</div>';
    }

    function renderErrors(errors) {
        if (!errors || !errors.length) return '';
        var rows = errors.map(function (e) {
            return '<tr>' +
                '<td><span class="status ' + statusClass(e.code) + '">' + e.code + '</span></td>' +
                '<td>' + e.when + '</td>' +
                '</tr>';
        }).join('');

        return '<div class="block">' +
            '<h4 class="block__title">Errores</h4>' +
            '<div class="table-wrap"><table class="table" style="min-width:380px">' +
            '<thead><tr><th>Código</th><th>Motivo</th></tr></thead>' +
            '<tbody>' + rows + '</tbody></table></div>' +
            '</div>';
    }

    function renderNote(note) {
        if (!note) return '';
        return '<div class="callout callout--' + note.type + '">' +
            '<strong>' + esc(note.title) + '</strong> ' + note.html +
            '</div>';
    }

    function renderPlaygroundFields(ep) {
        var html = '';
        var fields = '';

        ep.pathParams.forEach(function (p) {
            fields += '<div class="field">' +
                '<label class="field__label" for="' + ep.id + '-path-' + p.name + '">' +
                    esc(p.name) +
                    '<span class="field__hint">parámetro de ruta</span>' +
                '</label>' +
                '<input class="input" id="' + ep.id + '-path-' + p.name + '" type="text" ' +
                    'data-kind="path" data-name="' + esc(p.name) + '" ' +
                    'placeholder="' + esc(p.placeholder || '') + '" autocomplete="off" spellcheck="false">' +
                '</div>';
        });

        ep.queryParams.forEach(function (p) {
            fields += '<div class="field">' +
                '<label class="field__label" for="' + ep.id + '-query-' + p.name + '">' +
                    esc(p.name) +
                    '<span class="field__hint">query · opcional</span>' +
                '</label>' +
                '<input class="input" id="' + ep.id + '-query-' + p.name + '" type="number" min="1" ' +
                    'data-kind="query" data-name="' + esc(p.name) + '" ' +
                    'placeholder="' + esc(p.placeholder || '') + '" autocomplete="off">' +
                '</div>';
        });

        if (ep.body) {
            fields += '<div class="field field--full">' +
                '<label class="field__label" for="' + ep.id + '-body">' +
                    'Request body' +
                    '<span class="field__hint">application/json</span>' +
                '</label>' +
                '<textarea class="textarea" id="' + ep.id + '-body" data-kind="body" spellcheck="false">' +
                    esc(JSON.stringify(ep.body.example, null, 2)) +
                '</textarea>' +
                '</div>';
        }

        if (fields) html += '<div class="fields">' + fields + '</div>';
        return html;
    }

    function renderEndpoint(ep) {
        var verb = ep.method.toLowerCase();

        // Ejemplo de request body
        var bodyBlock = '';
        if (ep.body) {
            bodyBlock = renderParamTable('Request body', ep.body.fields) +
                '<div class="block">' +
                    '<h4 class="block__title">Ejemplo de request</h4>' +
                    '<pre class="code"><code>' + highlightJson(ep.body.example) + '</code></pre>' +
                '</div>';
        }

        // Ejemplo de response
        var responseCode = ep.responseType === 'text'
            ? esc(ep.responseExample)
            : highlightJson(ep.responseExample);

        var responseBlock = '<div class="block">' +
            '<h4 class="block__title">' +
                'Respuesta · ' + ep.responseStatus +
                (ep.responseType === 'text' ? ' · text/plain' : ' · application/json') +
            '</h4>' +
            '<pre class="code"><code>' + responseCode + '</code></pre>' +
            '</div>';

        return '' +
        '<article class="endpoint glass" id="' + ep.id + '">' +
            '<header class="endpoint__head">' +
                '<span class="verb verb--' + verb + '">' + ep.method + '</span>' +
                '<span class="endpoint__path">' + renderPath(ep.path) + '</span>' +
                '<p class="endpoint__title">' + esc(ep.title) + '</p>' +
            '</header>' +

            '<div class="endpoint__body">' +
                '<p class="endpoint__desc">' + ep.description + '</p>' +
                renderNote(ep.note) +
                renderParamTable('Parámetros de ruta', ep.pathParams) +
                renderParamTable('Query params', ep.queryParams) +
                bodyBlock +
                responseBlock +
                renderErrors(ep.errors) +

                '<div class="play" data-endpoint="' + ep.id + '">' +
                    '<h4 class="play__head">Playground</h4>' +
                    renderPlaygroundFields(ep) +
                    '<div class="play__actions">' +
                        '<button class="btn ' + (ep.destructive ? 'btn--danger' : 'btn--run') + '" data-run>' +
                            (ep.destructive ? 'Ejecutar seed' : 'Enviar petición') +
                        '</button>' +
                        '<button class="btn btn--ghost btn--sm" data-clear>Limpiar</button>' +
                        '<code class="play__url" data-url>' + esc(ep.path) + '</code>' +
                    '</div>' +
                    '<div data-result></div>' +
                '</div>' +
            '</div>' +
        '</article>';
    }

    /* ═══════════════════════════════════════════════════════════════
       NAVEGACIÓN
       ═══════════════════════════════════════════════════════════════ */

    function renderNavItem(ep) {
        return '<li>' +
            '<a class="nav__link" href="#' + ep.id + '">' +
                '<span class="nav__verb verb--' + ep.method.toLowerCase() + '">' + ep.method + '</span>' +
                '<span class="nav__text">' + esc(ep.navText) + '</span>' +
            '</a>' +
        '</li>';
    }

    /* ═══════════════════════════════════════════════════════════════
       PLAYGROUND
       ═══════════════════════════════════════════════════════════════ */

    /** Construye la URL final a partir de los inputs del playground. */
    function buildUrl(ep, root) {
        var url = ep.path;
        var missing = [];

        ep.pathParams.forEach(function (p) {
            var input = $('[data-kind="path"][data-name="' + p.name + '"]', root);
            var value = input ? input.value.trim() : '';
            if (!value) {
                missing.push(p.name);
                return;
            }
            url = url.replace('{' + p.name + '}', encodeURIComponent(value));
        });

        var qs = [];
        ep.queryParams.forEach(function (p) {
            var input = $('[data-kind="query"][data-name="' + p.name + '"]', root);
            var value = input ? input.value.trim() : '';
            if (value !== '') qs.push(encodeURIComponent(p.name) + '=' + encodeURIComponent(value));
        });
        if (qs.length) url += '?' + qs.join('&');

        return { url: url, missing: missing };
    }

    function showResult(container, html) {
        container.innerHTML = html;
    }

    function renderResponse(meta, bodyHtml) {
        return '<div class="response">' +
            '<div class="response__meta">' + meta + '</div>' +
            '<pre class="response__body"><code>' + bodyHtml + '</code></pre>' +
        '</div>';
    }

    function execute(ep, root) {
        var resultBox = $('[data-result]', root);
        var button = $('[data-run]', root);

        var built = buildUrl(ep, root);

        if (built.missing.length) {
            showResult(resultBox, renderResponse(
                '<span class="status status--err">Falta un dato</span>',
                'Rellena el parámetro de ruta: ' + esc(built.missing.join(', '))
            ));
            return;
        }

        // Body: se valida el JSON antes de enviarlo para dar un error claro
        var payload = null;
        if (ep.body) {
            var textarea = $('[data-kind="body"]', root);
            var raw = textarea ? textarea.value.trim() : '';
            if (raw) {
                try {
                    payload = JSON.parse(raw);
                } catch (err) {
                    showResult(resultBox, renderResponse(
                        '<span class="status status--err">JSON inválido</span>',
                        esc(err.message)
                    ));
                    return;
                }
            }
        }

        // El endpoint de seed borra toda la colección: se confirma antes
        if (ep.destructive) {
            var ok = window.confirm(
                'GET /api/v1/seed elimina TODOS los pokémon de la base de datos ' +
                'y vuelve a insertar los 100 de PokeAPI.\n\n¿Continuar?'
            );
            if (!ok) return;
        }

        var options = { method: ep.method, headers: {} };
        if (payload !== null) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(payload);
        }

        button.classList.add('is-loading');
        button.disabled = true;
        showResult(resultBox, '');

        var started = performance.now();

        fetch(built.url, options)
            .then(function (res) {
                return res.text().then(function (text) {
                    return { res: res, text: text };
                });
            })
            .then(function (payloadRes) {
                var elapsed = Math.round(performance.now() - started);
                var res = payloadRes.res;
                var text = payloadRes.text;

                var bodyHtml;
                var contentType = res.headers.get('content-type') || '';

                if (text === '') {
                    bodyHtml = '<span class="tok-punct">(respuesta sin cuerpo)</span>';
                } else if (contentType.indexOf('application/json') !== -1) {
                    try {
                        bodyHtml = highlightJson(JSON.parse(text));
                    } catch (e) {
                        bodyHtml = esc(text);
                    }
                } else {
                    // p. ej. GET /api/v1/seed devuelve text/plain
                    bodyHtml = '<span class="tok-str">' + esc(text) + '</span>';
                }

                var meta =
                    '<span class="status ' + statusClass(res.status) + '">' +
                        res.status + ' ' + esc(res.statusText || '') +
                    '</span>' +
                    '<span class="metric">' + elapsed + ' ms</span>' +
                    '<span class="metric">' + formatBytes(new Blob([text]).size) + '</span>' +
                    '<span class="spacer"></span>' +
                    '<span class="mono">' + esc(ep.method + ' ' + built.url) + '</span>';

                showResult(resultBox, renderResponse(meta, bodyHtml));
            })
            .catch(function (err) {
                var elapsed = Math.round(performance.now() - started);
                var meta =
                    '<span class="status status--err">Error de red</span>' +
                    '<span class="metric">' + elapsed + ' ms</span>' +
                    '<span class="spacer"></span>' +
                    '<span class="mono">' + esc(ep.method + ' ' + built.url) + '</span>';

                showResult(resultBox, renderResponse(
                    meta,
                    esc(err.message) + '\n\nLa petición no llegó a completarse. Comprueba que la API esté levantada.'
                ));
            })
            .then(function () {
                button.classList.remove('is-loading');
                button.disabled = false;
            });
    }

    /** Mantiene visible la URL que se va a llamar mientras se escribe. */
    function refreshUrlPreview(ep, root) {
        var target = $('[data-url]', root);
        if (!target) return;

        var url = ep.path;
        ep.pathParams.forEach(function (p) {
            var input = $('[data-kind="path"][data-name="' + p.name + '"]', root);
            var value = input ? input.value.trim() : '';
            if (value) url = url.replace('{' + p.name + '}', value);
        });

        var qs = [];
        ep.queryParams.forEach(function (p) {
            var input = $('[data-kind="query"][data-name="' + p.name + '"]', root);
            var value = input ? input.value.trim() : '';
            if (value !== '') qs.push(p.name + '=' + value);
        });
        if (qs.length) url += '?' + qs.join('&');

        target.textContent = url;
    }

    function wirePlayground(ep) {
        var root = $('.play[data-endpoint="' + ep.id + '"]');
        if (!root) return;

        $('[data-run]', root).addEventListener('click', function () {
            execute(ep, root);
        });

        $('[data-clear]', root).addEventListener('click', function () {
            $$('.input', root).forEach(function (i) { i.value = ''; });
            var textarea = $('[data-kind="body"]', root);
            if (textarea && ep.body) textarea.value = JSON.stringify(ep.body.example, null, 2);
            $('[data-result]', root).innerHTML = '';
            refreshUrlPreview(ep, root);
        });

        $$('.input', root).forEach(function (input) {
            input.addEventListener('input', function () { refreshUrlPreview(ep, root); });
        });

        // Enter en un input lanza la petición
        $$('.input', root).forEach(function (input) {
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    execute(ep, root);
                }
            });
        });

        refreshUrlPreview(ep, root);
    }

    /* ═══════════════════════════════════════════════════════════════
       INTERACCIONES GENERALES
       ═══════════════════════════════════════════════════════════════ */

    function wireCopyButtons() {
        $$('[data-copy]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var target = $(btn.getAttribute('data-copy'));
                if (!target) return;
                var text = target.textContent;
                var done = function () {
                    var original = btn.textContent;
                    btn.textContent = 'Copiado';
                    setTimeout(function () { btn.textContent = original; }, 1400);
                };

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(done).catch(function () {});
                } else {
                    // Fallback para contextos sin clipboard API (http sin TLS)
                    var tmp = document.createElement('textarea');
                    tmp.value = text;
                    document.body.appendChild(tmp);
                    tmp.select();
                    try { document.execCommand('copy'); done(); } catch (e) {}
                    document.body.removeChild(tmp);
                }
            });
        });
    }

    function wireMobileNav() {
        var toggle = $('#navToggle');
        var sidebar = $('#sidebar');
        var scrim = $('#navScrim');

        function close() {
            sidebar.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.setAttribute('aria-label', 'Abrir navegación');
            scrim.hidden = true;
        }
        function open() {
            sidebar.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
            toggle.setAttribute('aria-label', 'Cerrar navegación');
            scrim.hidden = false;
        }

        toggle.addEventListener('click', function () {
            if (sidebar.classList.contains('is-open')) close(); else open();
        });
        scrim.addEventListener('click', close);
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') close();
        });
        $$('.nav__link').forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.matchMedia('(max-width: 860px)').matches) close();
            });
        });
    }

    /** Resalta en la nav la sección visible. */
    function wireScrollSpy() {
        var links = $$('.nav__link');
        var map = {};
        var targets = [];

        links.forEach(function (link) {
            var id = link.getAttribute('href').slice(1);
            var el = document.getElementById(id);
            if (el) {
                map[id] = link;
                targets.push(el);
            }
        });

        if (!('IntersectionObserver' in window) || !targets.length) return;

        var visible = {};
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                visible[entry.target.id] = entry.isIntersecting ? entry.intersectionRatio : 0;
            });

            var best = null;
            var bestRatio = 0;
            Object.keys(visible).forEach(function (id) {
                if (visible[id] > bestRatio) { bestRatio = visible[id]; best = id; }
            });

            if (best) {
                links.forEach(function (l) { l.classList.remove('is-active'); });
                if (map[best]) map[best].classList.add('is-active');
            }
        }, { rootMargin: '-10% 0px -60% 0px', threshold: [0, 0.25, 0.5, 1] });

        targets.forEach(function (t) { observer.observe(t); });
    }

    /** Comprobación de estado: una lectura mínima contra el listado. */
    function checkHealth() {
        var dot = $('#healthDot');
        var text = $('#healthText');
        var started = performance.now();

        fetch(BASE + '/pokemon?limit=1')
            .then(function (res) {
                var elapsed = Math.round(performance.now() - started);
                if (res.ok) {
                    dot.classList.add('dot--ok');
                    text.textContent = 'API operativa · ' + elapsed + ' ms';
                } else {
                    dot.classList.add('dot--down');
                    text.textContent = 'API responde ' + res.status;
                }
            })
            .catch(function () {
                dot.classList.add('dot--down');
                text.textContent = 'API no alcanzable';
            });
    }

    /* ═══════════════════════════════════════════════════════════════
       ARRANQUE
       ═══════════════════════════════════════════════════════════════ */

    function init() {
        var pokemon = ENDPOINTS.filter(function (e) { return e.group === 'pokemon'; });
        var seed    = ENDPOINTS.filter(function (e) { return e.group === 'seed'; });

        $('#listPokemon').innerHTML = pokemon.map(renderEndpoint).join('');
        $('#listSeed').innerHTML    = seed.map(renderEndpoint).join('');
        $('#navPokemon').innerHTML  = pokemon.map(renderNavItem).join('');
        $('#navSeed').innerHTML     = seed.map(renderNavItem).join('');

        // Base URL real desde la que se está sirviendo la página
        $('#urlCurrent').textContent = window.location.origin + BASE;

        ENDPOINTS.forEach(wirePlayground);
        wireCopyButtons();
        wireMobileNav();
        wireScrollSpy();
        checkHealth();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
