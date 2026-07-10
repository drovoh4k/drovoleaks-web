/* DROVOLEAKS — UI: tema, navegación móvil, botón copiar en bloques de código.
   Vanilla JS, sin dependencias. El tema inicial se fija con un script inline en
   el layout (ver default.html) para evitar FOUC; aquí solo el toggle. */
(function () {
  "use strict";
  var STORAGE_KEY = "drovo-theme";

  // ── Focus trap para los modales (a11y): el Tab no escapa al fondo ─────────
  function getFocusable(box) {
    if (!box) return [];
    return Array.prototype.slice.call(box.querySelectorAll(
      'a[href],area[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'
    )).filter(function (el) { return el.offsetWidth > 0 || el.offsetHeight > 0 || el === document.activeElement; });
  }
  function trapTab(e, box) {
    if (e.key !== "Tab") return;
    var f = getFocusable(box);
    if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  // Iconos del toggle de tema: SVG monocromo (currentColor), coherente con el
  // resto de la topbar y centrado por el grid del botón. Evita el batiburrillo
  // emoji/glyph de ☀/☽ (uno se pintaba como emoji y el otro no).
  var SUN_SVG = '<svg class="thic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.2"></circle><path d="M12 2v2.2M12 19.8V22M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2 12h2.2M19.8 12H22M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"></path></svg>';
  var MOON_SVG = '<svg class="thic" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"></path></svg>';

  function app() { return document.getElementById("app"); }

  function currentTheme() {
    return app() && app().classList.contains("light") ? "light" : "dark";
  }

  function applyTheme(theme) {
    var a = app();
    if (!a) return;
    a.classList.toggle("light", theme === "light");
    var btn = document.getElementById("themebtn");
    if (btn) {
      // El icono muestra a qué modo cambiarás (luna→oscuro, sol→claro).
      btn.innerHTML = theme === "light" ? MOON_SVG : SUN_SVG;
      btn.setAttribute("aria-label", theme === "light" ? "Cambiar a modo oscuro" : "Cambiar a modo claro");
      btn.setAttribute("aria-pressed", theme === "light" ? "true" : "false");
    }
  }

  function toggleTheme() {
    var next = currentTheme() === "light" ? "dark" : "light";
    try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    applyTheme(next);
  }

  // ── Navegación móvil ──────────────────────────────────────────────────────
  // Al abrir el cajón: foco al primer enlace, cierre con Escape y focus-trap (Tab
  // no escapa al fondo), coherente con los modales. Al cerrar, foco de vuelta a la
  // hamburguesa. Sin esto, el teclado quedaba sin gestión y el foco escapaba atrás.
  var navLastFocus = null;
  function onNavKey(e) {
    if (e.key === "Escape") openNav(false);
    else if (e.key === "Tab") trapTab(e, document.getElementById("side"));
  }
  function openNav(open) {
    var a = app();
    if (a) a.classList.toggle("navopen", open);
    var hb = document.getElementById("hamb");
    if (hb) hb.setAttribute("aria-expanded", open ? "true" : "false");
    var side = document.getElementById("side");
    if (open) {
      navLastFocus = document.activeElement;
      document.addEventListener("keydown", onNavKey);
      if (side) { var f = getFocusable(side); if (f.length) f[0].focus(); }
    } else {
      document.removeEventListener("keydown", onNavKey);
      if (navLastFocus && navLastFocus.focus) navLastFocus.focus();
    }
  }

  // ── Botón copiar en cada bloque de código ────────────────────────────────
  var COPY_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2"></rect><path d="M5 15V5a2 2 0 0 1 2-2h10"></path></svg>';
  var CHECK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"></path></svg>';

  function addCopyButtons() {
    // Rouge/kramdown emiten <div class="highlight"><pre>...</pre></div> o <pre>.
    var blocks = document.querySelectorAll(".prose div.highlight, .prose figure.highlight, .prose pre");
    blocks.forEach(function (block) {
      // Evita anidar (un <pre> dentro de div.highlight ya lo cubre el div).
      if (block.tagName === "PRE" && block.closest(".highlight")) return;
      if (block.closest(".codewrap")) return;

      var wrap = document.createElement("div");
      wrap.className = "codewrap";
      block.parentNode.insertBefore(wrap, block);
      wrap.appendChild(block);

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "copybtn";
      btn.title = "Copiar";
      btn.setAttribute("aria-label", "Copiar código");
      btn.innerHTML = COPY_SVG;
      wrap.appendChild(btn);

      btn.addEventListener("click", function () {
        var code = block.querySelector("code") || block;
        var text = code.innerText.replace(/\n$/, "");
        copyText(text, btn);
      });
    });
  }

  function copyText(text, btn) {
    var done = function () {
      btn.classList.add("copied");
      btn.innerHTML = CHECK_SVG;
      announce("Código copiado");
      setTimeout(function () {
        btn.classList.remove("copied");
        btn.innerHTML = COPY_SVG;
      }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text, done); });
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    try {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    } catch (e) {}
  }

  // Región viva (visualmente oculta) para anunciar acciones como "copiar" a
  // lectores de pantalla (WCAG 4.1.3). El cambio de icono no se comunica solo.
  var liveRegion = null;
  function announce(msg) {
    if (!liveRegion) {
      liveRegion = document.createElement("div");
      liveRegion.setAttribute("role", "status");
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.style.cssText = "position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap;border:0";
      document.body.appendChild(liveRegion);
    }
    liveRegion.textContent = "";
    setTimeout(function () { liveRegion.textContent = msg; }, 30);
  }

  // Inertiza el fondo mientras un modal está abierto: aria-modal no basta para que
  // todos los lectores dejen de recorrer el contenido de detrás. Los modales viven
  // fuera de .main/.side (hijos directos de #app), así que siguen operables.
  function setBgInert(on) {
    var bg = [document.querySelector(".main"), document.getElementById("side"), document.getElementById("navscrim")];
    bg.forEach(function (el) {
      if (!el) return;
      if (on) { el.setAttribute("inert", ""); el.setAttribute("aria-hidden", "true"); }
      else { el.removeAttribute("inert"); el.removeAttribute("aria-hidden"); }
    });
  }

  // ── Modal de descarga (mirror del challenge) ─────────────────────────────
  function initDownloadModal() {
    var modal = document.getElementById("dlmodal");
    if (!modal) return;
    var fileEl = document.getElementById("dlmodal-file");
    var passWrap = document.getElementById("dlmodal-pass");
    var passVal = document.getElementById("dlmodal-passv");
    var passCopy = document.getElementById("dlmodal-passcopy");
    var hashWrap = document.getElementById("dlmodal-hash");
    var hashVal = document.getElementById("dlmodal-hashv");
    var hashCopy = document.getElementById("dlmodal-hashcopy");
    var goBtn = document.getElementById("dlmodal-go");
    var lastFocus = null;

    function openModal(href, name, pass, sha) {
      lastFocus = document.activeElement;
      fileEl.textContent = name;
      goBtn.setAttribute("href", href);
      goBtn.setAttribute("download", name);
      if (pass) { passVal.textContent = pass; passWrap.hidden = false; }
      else { passWrap.hidden = true; }
      if (sha && hashWrap) { hashVal.textContent = sha; hashWrap.hidden = false; }
      else if (hashWrap) { hashWrap.hidden = true; }
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      setBgInert(true);
      goBtn.focus();
    }
    function closeModal() {
      modal.hidden = true;
      document.body.style.overflow = "";
      setBgInert(false);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.querySelectorAll("a.js-dl-mirror").forEach(function (link) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        var name = link.getAttribute("data-name") || link.href.split("/").pop();
        openModal(link.href, decodeURIComponent(name), link.getAttribute("data-pass"), link.getAttribute("data-sha256"));
      });
    });
    modal.querySelectorAll("[data-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    // La descarga la hace el propio <a download>; cerramos justo después.
    goBtn.addEventListener("click", function () { setTimeout(closeModal, 120); });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") closeModal();
      else if (e.key === "Tab") trapTab(e, modal.querySelector(".modal__box"));
    });
    if (passCopy) passCopy.addEventListener("click", function () {
      var txt = passVal.textContent;
      var mark = function () {
        passCopy.textContent = "copiado ✓";
        announce("Contraseña copiada");
        setTimeout(function () { passCopy.textContent = "copiar"; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(mark, function () { fallbackCopy(txt, mark); });
      } else { fallbackCopy(txt, mark); }
    });
    if (hashCopy) hashCopy.addEventListener("click", function () {
      var txt = hashVal.textContent;
      var mark = function () {
        hashCopy.textContent = "copiado ✓";
        announce("Hash copiado");
        setTimeout(function () { hashCopy.textContent = "copiar"; }, 1400);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(mark, function () { fallbackCopy(txt, mark); });
      } else { fallbackCopy(txt, mark); }
    });
  }

  // ── Wiring ────────────────────────────────────────────────────────────────
  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(currentTheme());

    var tb = document.getElementById("themebtn");
    if (tb) tb.addEventListener("click", toggleTheme);

    var hb = document.getElementById("hamb");
    // En escritorio la barra está expandida por defecto: refleja el estado real
    // en aria-expanded al cargar (en móvil lo gestiona openNav y debe ser "false").
    if (hb && !(window.matchMedia && window.matchMedia("(max-width: 820px)").matches)) {
      var a0 = app();
      if (a0) hb.setAttribute("aria-expanded", a0.classList.contains("sidecollapsed") ? "false" : "true");
    }
    if (hb) hb.addEventListener("click", function () {
      if (window.matchMedia && window.matchMedia("(max-width: 820px)").matches) {
        openNav(!app().classList.contains("navopen"));      // móvil: overlay
      } else {
        var a = app();                                       // escritorio: colapsa/expande
        if (!a) return;
        var collapsed = a.classList.toggle("sidecollapsed");
        hb.setAttribute("aria-expanded", collapsed ? "false" : "true");
        try { localStorage.setItem("drovo-sidebar", collapsed ? "collapsed" : "open"); } catch (e) {}
      }
    });

    var scrim = document.getElementById("navscrim");
    if (scrim) scrim.addEventListener("click", function () { openNav(false); });

    // Por defecto el sitio es claro; no seguimos la preferencia del sistema.
    // El usuario cambia con el toggle y su elección se persiste en localStorage.

    addCopyButtons();
    initDownloadModal();
    initVideoFacade();
    initFilterToggle();
    initCodeModal();
    initMediaModal();
    initExternalLinks();
    initEntryToc();
  });

  // Los enlaces externos del cuerpo abren en pestaña nueva (no sacan al lector del
  // sitio). Los internos (PDF/excalidraw/scripts/otras clases) se dejan intactos:
  // abren su modal o navegan dentro del sitio.
  function initExternalLinks() {
    Array.prototype.forEach.call(document.querySelectorAll(".prose a[href]"), function (a) {
      if (/^https?:$/.test(a.protocol) && a.host !== location.host && !a.target) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
    });
  }

  // ── Fachada de vídeo: al pulsar, carga el iframe con autoplay (arranque limpio)
  function initVideoFacade() {
    document.querySelectorAll(".ytfacade").forEach(function (fac) {
      fac.addEventListener("click", function () {
        var id = fac.getAttribute("data-id");
        if (!id) return;
        var iframe = document.createElement("iframe");
        iframe.className = "ytframe";
        iframe.src = "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&rel=0";
        iframe.title = fac.getAttribute("data-title") || "vídeo";
        iframe.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
        iframe.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
        iframe.setAttribute("allowfullscreen", "");
        fac.replaceWith(iframe);
      });
    });
  }

  // ── Panel de filtros plegable: abierto por defecto en escritorio y plegado en
  //    móvil. El estado inicial lo fija un script inline en categoria.html (antes
  //    de pintar, sin salto); aquí solo se gestiona el clic del botón "filtrar".
  function initFilterToggle() {
    var panel = document.getElementById("filterpanel");
    var toggle = document.getElementById("filtertoggle");
    if (!panel || !toggle) return;
    toggle.addEventListener("click", function () {
      var collapsed = panel.classList.toggle("is-collapsed");
      toggle.setAttribute("aria-expanded", collapsed ? "false" : "true");
    });
  }

  // ── Visor de código: los enlaces del propio sitio a scripts / ficheros de
  //    texto (.py, .c, .sh, Makefile…) abren un modal con el código (fetch),
  //    con números de línea y resaltado (highlight.js, cargado bajo demanda).
  //    Binarios y enlaces externos se respetan.
  function initCodeModal() {
    var modal = document.getElementById("codemodal");
    if (!modal) return;
    var nameEl = document.getElementById("codemodal-name");
    var codeEl = document.getElementById("codemodal-code");
    var dlBtn = document.getElementById("codemodal-dl");
    var lastFocus = null;

    var CODE_RE = /\.(py|c|h|cc|cpp|cxx|hpp|s|asm|sh|bash|zsh|js|mjs|ts|rb|go|rs|pl|pm|lua|php|java|gdb|pseudo|txt|md|mk|cmake|make|toml|ini|cfg|conf|env|yml|yaml|json)$/i;
    var NAME_RE = /(^|\/)(Makefile|Dockerfile|CMakeLists\.txt)$/i;
    var EXT_LANG = { py: "python", c: "c", h: "c", cc: "cpp", cpp: "cpp", cxx: "cpp", hpp: "cpp", s: "x86asm", asm: "x86asm", sh: "bash", bash: "bash", zsh: "bash", js: "javascript", mjs: "javascript", ts: "typescript", rb: "ruby", go: "go", rs: "rust", pl: "perl", pm: "perl", lua: "lua", php: "php", java: "java", json: "json", yml: "yaml", yaml: "yaml", toml: "ini", ini: "ini", cfg: "ini", conf: "ini", md: "markdown", mk: "makefile", make: "makefile", cmake: "cmake" };

    function langFor(name) {
      if (/^Makefile$/i.test(name)) return "makefile";
      if (/^Dockerfile$/i.test(name)) return "dockerfile";
      return EXT_LANG[(name.split(".").pop() || "").toLowerCase()] || null;
    }

    // Carga highlight.js una sola vez, bajo demanda (misma carpeta que fuse.min.js).
    var hljsP = null;
    function ensureHljs() {
      if (window.hljs) return Promise.resolve(window.hljs);
      if (!hljsP) hljsP = new Promise(function (res, rej) {
        var fuse = document.querySelector('script[src*="fuse.min.js"]');
        var src = fuse ? fuse.src.replace(/fuse\.min\.js.*$/, "highlight.min.js") : "/assets/vendor/highlight.min.js";
        var s = document.createElement("script");
        s.src = src;
        s.onload = function () { res(window.hljs); };
        s.onerror = rej;
        document.head.appendChild(s);
      });
      return hljsP;
    }

    function esc(s) {
      return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // Parte el HTML resaltado en líneas SIN romper los <span> multilínea
    // (comentarios/strings de varias líneas): cierra y reabre los spans abiertos.
    function splitHi(htmlStr) {
      var out = [], open = [], cur = "", re = /<span\b[^>]*>|<\/span>|[^<]+/g, m;
      while ((m = re.exec(htmlStr))) {
        var tok = m[0];
        if (tok.charAt(0) === "<") {
          if (tok.charAt(1) === "/") { open.pop(); cur += tok; }
          else { open.push(tok); cur += tok; }
        } else {
          var parts = tok.split("\n");
          for (var i = 0; i < parts.length; i++) {
            cur += parts[i];
            if (i < parts.length - 1) {
              for (var k = 0; k < open.length; k++) cur += "</span>";
              out.push(cur);
              cur = open.join("");
            }
          }
        }
      }
      out.push(cur);
      return out;
    }

    // Dos columnas: una barra de números (UNA sola caja, sticky a la izquierda) y
    // la columna de código. Con un único elemento sticky el desplazamiento lateral
    // en móvil (incluido el momentum-scroll de iOS) va suave, sin tirones. Los
    // números y las líneas comparten line-height, así que quedan alineados fila a fila.
    function renderLines(htmlLines) {
      codeEl.style.setProperty("--cm-lnw", String(htmlLines.length).length + "ch");
      var nums = "", lines = "";
      for (var i = 0; i < htmlLines.length; i++) {
        nums += '<div class="cm-lnn">' + (i + 1) + "</div>";
        var ln = htmlLines[i];
        lines += '<div class="cm-line">' + (ln === "" ? " " : ln) + "</div>";
      }
      codeEl.innerHTML = '<div class="cm-gutter" aria-hidden="true">' + nums + '</div><div class="cm-lines">' + lines + "</div>";
    }

    function openCode(a) {
      lastFocus = document.activeElement;
      var url = a.href;
      var name = decodeURIComponent((a.pathname || "").split("/").pop()) || "código";
      nameEl.textContent = name;
      dlBtn.setAttribute("href", url);
      dlBtn.setAttribute("download", name);
      codeEl.innerHTML = '<div class="cm-msg">Cargando…</div>';
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      setBgInert(true);
      var closeBtn = modal.querySelector(".codemodal__close");
      if (closeBtn) closeBtn.focus();
      fetch(url).then(function (r) { if (!r.ok) throw 0; return r.text(); })
        .then(function (txt) {
          txt = txt.replace(/\s+$/, "");                 // sin líneas vacías al final
          renderLines(txt.split("\n").map(esc));          // texto plano primero (rápido)
          ensureHljs().then(function (hljs) {
            try {
              var lang = langFor(name);
              var hi = (lang && hljs.getLanguage(lang)) ? hljs.highlight(txt, { language: lang }) : hljs.highlightAuto(txt);
              renderLines(splitHi(hi.value));
            } catch (e) {}
          }).catch(function () {});
        })
        .catch(function () { codeEl.innerHTML = '<div class="cm-msg">No se pudo cargar el fichero. Usa el botón de descarga.</div>'; });
    }
    function closeCode() {
      modal.hidden = true;
      document.body.style.overflow = "";
      setBgInert(false);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var a = e.target.closest ? e.target.closest("a[href]") : null;
      // el chrome de los modales y el disparador/botón de descarga (.modal /
      // a.js-dl-mirror) no abren el visor de código (evita doble modal)
      if (!a || a.closest(".codemodal, .modal") || a.classList.contains("js-dl-mirror")) return;
      if (a.origin !== location.origin) return;                // solo ficheros del sitio
      if (a.target === "_blank" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var path = a.pathname || "";
      if (!CODE_RE.test(path) && !NAME_RE.test(path)) return;
      e.preventDefault();
      openCode(a);
    });
    modal.querySelectorAll("[data-close]").forEach(function (el) { el.addEventListener("click", closeCode); });
    document.addEventListener("keydown", function (e) {
      if (modal.hidden) return;
      if (e.key === "Escape") closeCode();
      else if (e.key === "Tab") trapTab(e, modal.querySelector(".codemodal__box"));
    });

    // Marca los enlaces de código del cuerpo con un icono visible y clicable,
    // para que se note que abren el visor (el clic lo maneja la delegación).
    var EYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.6 10-6.6S22 12 22 12s-3.6 6.6-10 6.6S2 12 2 12z"></path><circle cx="12" cy="12" r="2.6"></circle></svg>';
    Array.prototype.forEach.call(document.querySelectorAll(".prose a[href]"), function (a) {
      if (a.closest(".codemodal") || a.classList.contains("codelink")) return;
      if (a.origin !== location.origin) return;
      var p = a.pathname || "";
      if (!CODE_RE.test(p) && !NAME_RE.test(p)) return;
      a.classList.add("codelink");
      if (!a.getAttribute("title")) a.setAttribute("title", "Ver el código");
      // Envuelve el nombre del fichero y le añade el badge dentro del mismo <a>,
      // para que se rendericen como un único bloque uniforme.
      var nmSpan = document.createElement("span");
      nmSpan.className = "codelink__name";
      while (a.firstChild) nmSpan.appendChild(a.firstChild);
      a.appendChild(nmSpan);
      var badge = document.createElement("span");
      badge.className = "codelink__badge";
      badge.setAttribute("aria-hidden", "true");
      badge.innerHTML = EYE + "ver código";
      a.appendChild(badge);
    });
  }

  // ── Visor de medios: imágenes (lightbox), PDF (iframe) y excalidraw (SVG en
  //    modo lectura, no editable). Mismo chrome/estilo que el visor de código.
  function initMediaModal() {
    var modal = document.getElementById("mediamodal");
    if (!modal) return;
    var nameEl = document.getElementById("mediamodal-name");
    var bodyEl = document.getElementById("mediamodal-body");
    var dlBtn = document.getElementById("mediamodal-dl");
    var lastFocus = null;

    function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
    function fileName(url) { try { return decodeURIComponent(new URL(url, location.href).pathname.split("/").pop()) || ""; } catch (e) { return ""; } }

    function show() {
      modal.hidden = false;
      document.body.style.overflow = "hidden";
      setBgInert(true);
      var cb = modal.querySelector(".codemodal__close");
      if (cb) cb.focus();
    }
    function openMedia(type, url, name) {
      lastFocus = document.activeElement;
      var fn = fileName(url);
      nameEl.textContent = name || fn;
      dlBtn.setAttribute("href", url);
      dlBtn.setAttribute("download", fn);
      if (type === "image") {
        var im = new Image();
        im.alt = name || fn;
        im.src = url;
        bodyEl.innerHTML = "";
        bodyEl.appendChild(im);
        show();
      } else if (type === "pdf") {
        var abs = url; try { abs = new URL(url, location.href).href; } catch (e) {}
        var viewer = vendorUrl("pdfjs/web/viewer.html") + "?file=" + encodeURIComponent(abs) + "#zoom=page-width&pagemode=none";
        bodyEl.innerHTML = '<iframe title="' + esc(name || fn) + '" src="' + esc(viewer) + '" allow="fullscreen"></iframe>';
        show();
      } else if (type === "excalidraw") {
        bodyEl.innerHTML = '<div class="mm-msg">Cargando diagrama…</div>';
        show();
        renderExcalidraw(url, bodyEl);
      }
    }
    function closeMedia() {
      if (excRoot) { try { excRoot.unmount(); } catch (e) {} excRoot = null; }
      modal.hidden = true;
      bodyEl.innerHTML = "";       // libera visor (iframe) / imagen / diagrama
      document.body.style.overflow = "";
      setBgInert(false);
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    document.addEventListener("click", function (e) {
      var img = e.target.closest ? e.target.closest(".prose img") : null;
      // Si la imagen está dentro de un enlace ([![thumb](t)](full)), NO abrimos el
      // lightbox de la miniatura: dejamos que gane el <a> (imagen completa / destino).
      if (img && (img.currentSrc || img.src) && !img.closest("a[href]")) { e.preventDefault(); openMedia("image", img.currentSrc || img.src, img.getAttribute("alt") || ""); return; }
      var a = e.target.closest ? e.target.closest("a[href]") : null;
      // Excluye el chrome de los modales Y el disparador/botón del modal de descarga
      // (.modal / a.js-dl-mirror), para no abrir dos modales sobre el mismo enlace.
      if (!a || a.closest(".codemodal, .modal") || a.classList.contains("js-dl-mirror")) return;
      if (a.origin !== location.origin) return;
      if (a.target === "_blank" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var p = (a.pathname || "").toLowerCase();
      if (/\.pdf$/.test(p)) { e.preventDefault(); openMedia("pdf", a.href); }
      else if (/\.excalidraw$/.test(p)) { e.preventDefault(); openMedia("excalidraw", a.href); }
    });
    modal.querySelectorAll("[data-close]").forEach(function (el) { el.addEventListener("click", closeMedia); });

    // Botón "Ver paper completo": abre el PDF (p. ej. de arXiv) en el visor dentro
    // de la web, aunque sea de otro origen (un clic normal en un enlace externo no
    // abriría el modal). Cmd/Ctrl+clic respeta el href y abre en pestaña nueva.
    Array.prototype.forEach.call(document.querySelectorAll("a.js-pdf-view[data-pdf]"), function (a) {
      a.addEventListener("click", function (e) {
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        openMedia("pdf", a.getAttribute("data-pdf"), a.getAttribute("data-name") || "");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (!modal.hidden) {
        if (e.key === "Escape") { closeMedia(); return; }
        if (e.key === "Tab") { trapTab(e, modal.querySelector(".codemodal__box")); return; }
      }
      // Abrir el lightbox de una imagen del cuerpo con teclado (Enter/Espacio).
      if ((e.key === "Enter" || e.key === " ") && document.activeElement &&
          document.activeElement.matches && document.activeElement.matches(".prose img") &&
          !document.activeElement.closest("a[href]")) {
        e.preventDefault();
        var im = document.activeElement;
        openMedia("image", im.currentSrc || im.src, im.getAttribute("alt") || "");
      }
    });

    // Las imágenes del cuerpo pasan a ser operables por teclado (foco + botón).
    Array.prototype.forEach.call(document.querySelectorAll(".prose img"), function (img) {
      if (img.closest("a[href]")) return;   // enlazada: el <a> ya es operable; no la hacemos botón
      if (img.getAttribute("tabindex") !== null && img.getAttribute("tabindex") !== "") return;
      img.setAttribute("tabindex", "0");
      img.setAttribute("role", "button");
      if (!img.getAttribute("aria-label")) img.setAttribute("aria-label", "Ampliar imagen" + (img.alt ? ": " + img.alt : ""));
    });

    // Excalidraw embebido en modo lectura: carga la librería oficial (v0.18, ESM)
    // bajo demanda y monta el componente <Excalidraw> con viewModeEnabled, de modo
    // que se puede hacer zoom y desplazarse (rueda/arrastre en PC, pinch en móvil)
    // pero NO editar. Se usa la 0.18 porque trae las fuentes nuevas (Excalifont,
    // Nunito, Comic Shanns, Lilita One) que usan los diagramas; la 0.17 no las tenía.
    // ── Visor de PDF: visor COMPLETO de PDF.js (auto-alojado en assets/vendor/pdfjs),
    //    con barra de herramientas, zoom, ajuste al ancho y navegación. Es el mismo
    //    visor de Firefox: consistente en escritorio y móvil (arregla el zoom raro
    //    del visor nativo en iframe en el móvil).
    function vendorUrl(file) {
      var s = document.querySelector('script[src*="/assets/js/app.js"]');
      if (s) return s.src.replace(/js\/app\.js.*$/, "vendor/" + file);
      return "/assets/vendor/" + file;
    }

    var exP = null, excRoot = null;
    function ensureExcalidraw() {
      if (exP) return exP;
      if (!document.getElementById("exc-css")) {
        var l = document.createElement("link");
        l.id = "exc-css"; l.rel = "stylesheet";
        l.href = "https://cdn.jsdelivr.net/npm/@excalidraw/excalidraw@0.18.1/dist/prod/index.css";
        document.head.appendChild(l);
      }
      exP = Promise.all([
        import("https://esm.sh/react@18.3.1"),
        import("https://esm.sh/react-dom@18.3.1/client"),
        import("https://esm.sh/@excalidraw/excalidraw@0.18.1?deps=react@18.3.1,react-dom@18.3.1")
      ]).then(function (m) {
        return { React: m[0].default || m[0], createRoot: m[1].createRoot, Excalidraw: m[2].Excalidraw };
      });
      return exP;
    }
    function renderExcalidraw(url, mount) {
      // Token de la petición vigente: si el usuario cierra y abre otro diagrama
      // antes de que este resuelva, la respuesta obsoleta se descarta (no pisa el
      // diagrama nuevo ni deja una raíz de React huérfana).
      var token = (renderExcalidraw._t = {});
      Promise.all([
        ensureExcalidraw(),
        fetch(url).then(function (r) { if (!r.ok) throw 0; return r.json(); })
      ]).then(function (res) {
        if (modal.hidden || renderExcalidraw._t !== token) return;
        if (excRoot) { try { excRoot.unmount(); } catch (e) {} excRoot = null; }
        var lib = res[0], scene = res[1];
        mount.innerHTML = "";
        var host = document.createElement("div");
        host.className = "mm-exc";
        mount.appendChild(host);
        var el = lib.React.createElement(lib.Excalidraw, {
          viewModeEnabled: true,
          initialData: {
            elements: scene.elements || [],
            appState: Object.assign({}, scene.appState || {}, { viewModeEnabled: true, zenModeEnabled: false }),
            files: scene.files || {},
            scrollToContent: true
          },
          UIOptions: { canvasActions: { loadScene: false, saveToActiveFile: false, saveAsImage: false, export: false, clearCanvas: false, changeViewBackgroundColor: false } },
          excalidrawAPI: function (api) {
            // Centra y ajusta el diagrama a la vista (diferido, cuando ya midió el contenedor).
            var fit = function () { try { api.scrollToContent(api.getSceneElements(), { fitToContent: true, animate: false }); } catch (e) {} };
            setTimeout(fit, 80);
            setTimeout(fit, 500);
          }
        });
        excRoot = lib.createRoot(host);
        excRoot.render(el);
      }).catch(function () {
        if (modal.hidden || renderExcalidraw._t !== token) return;
        mount.innerHTML = '<div class="mm-msg">No se pudo cargar el visor del diagrama.<br>Usa el botón de descarga para abrirlo en excalidraw.com.</div>';
      });
    }

    // Afordancia: badge "ver PDF" / "ver diagrama" en los enlaces del cuerpo
    // (igual que el "ver código" del visor de código).
    var EYE = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.6-6.6 10-6.6S22 12 22 12s-3.6 6.6-10 6.6S2 12 2 12z"></path><circle cx="12" cy="12" r="2.6"></circle></svg>';
    Array.prototype.forEach.call(document.querySelectorAll(".prose a[href]"), function (a) {
      if (a.closest(".codemodal") || a.classList.contains("codelink")) return;
      if (a.origin !== location.origin) return;
      var p = (a.pathname || "").toLowerCase(), label = null;
      if (/\.pdf$/.test(p)) label = "ver PDF";
      else if (/\.excalidraw$/.test(p)) label = "ver diagrama";
      if (!label) return;
      a.classList.add("codelink");
      if (!a.getAttribute("title")) a.setAttribute("title", label.charAt(0).toUpperCase() + label.slice(1));
      var nm = document.createElement("span");
      nm.className = "codelink__name";
      while (a.firstChild) nm.appendChild(a.firstChild);
      a.appendChild(nm);
      var badge = document.createElement("span");
      badge.className = "codelink__badge";
      badge.setAttribute("aria-hidden", "true");
      badge.innerHTML = EYE + label;
      a.appendChild(badge);
    });
  }

  // ── Índice "Contenido" del aside: enlaza al resumen/vídeo y a las subsecciones
  //    de la sección Recursos. Solo aparece si la entrada tiene recursos.
  function initEntryToc() {
    var box = document.getElementById("entry-toc");
    if (!box) return;
    var body = document.getElementById("recursos-body");
    var heads = body ? body.querySelectorAll("h3, h4") : [];
    if (!heads.length) return;
    function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
    function slug(t) { return t.toLowerCase().trim().replace(/[^\wáéíóúñü\s-]/g, "").replace(/\s+/g, "-"); }
    var html = "";
    var top = document.getElementById("resumen") ? "resumen" : (document.getElementById("video") ? "video" : "");
    if (top) html += '<a class="tocitem tocitem--top" href="#' + top + '">Resumen y vídeo</a>';
    // "Recursos" como cabecera; las subsecciones cuelgan indentadas debajo.
    html += '<a class="tocitem tocitem--top" href="#recursos">Recursos</a>';
    Array.prototype.forEach.call(heads, function (h) {
      if (!h.id) h.id = slug(h.textContent);
      var cls = h.tagName === "H4" ? "tocitem tocitem--sub2" : "tocitem tocitem--sub";
      html += '<a class="' + cls + '" href="#' + h.id + '">' + esc(h.textContent.trim()) + "</a>";
    });
    document.getElementById("entry-toc-list").innerHTML = html;
    box.hidden = false;

    // Scrollspy: resalta el apartado visible mientras se hace scroll.
    var links = box.querySelectorAll(".tocitem");
    var targets = [];
    Array.prototype.forEach.call(links, function (a) {
      var id = a.getAttribute("href").slice(1);
      // #recursos es la SECCIÓN entera: cruza siempre la banda del observer y
      // ganaría a todas sus subsecciones. Se excluye para que el resalte sea granular.
      if (id === "recursos") return;
      var el = document.getElementById(id);
      if (el) targets.push(el);
    });
    if ("IntersectionObserver" in window && targets.length) {
      var visible = {};
      var obs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
        var pick = null;
        // De atrás hacia delante: prefiere la cabecera MÁS avanzada visible.
        for (var i = targets.length - 1; i >= 0; i--) { if (visible[targets[i].id]) { pick = targets[i].id; break; } }
        if (pick) Array.prototype.forEach.call(links, function (a) {
          a.classList.toggle("is-current", a.getAttribute("href") === "#" + pick);
        });
      }, { rootMargin: "-15% 0px -75% 0px", threshold: 0 });
      targets.forEach(function (t) { obs.observe(t); });
    }
  }

})();
