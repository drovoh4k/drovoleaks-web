/* DROVOLEAKS — buscador (Fuse.js, fuzzy) + chips de filtro para los índices de
   categoría. Trabaja sobre las tarjetas ya renderizadas (.icard[data-search]),
   así funciona sin red. Fuse.js se carga desde assets/vendor/fuse.min.js.

   Contrato del DOM:
     #catindex               contenedor del índice
     .icard[data-search]     cada tarjeta, con data-* para filtrar:
         data-search         texto indexable (title + tags + meta)
         data-title, data-tags, data-dificultad, data-arquitectura,
         data-lenguaje, data-subtipo, data-fuente
     #catsearch              input de búsqueda
     .fchip[data-group][data-value]   chip de filtro
     .wsec / .wsubgroup      secciones/grupos (se ocultan si quedan vacíos)
     #resultcount            texto "N resultados"
     #noresults              bloque vacío
*/
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var root = document.getElementById("catindex");
    if (!root) return;

    var cards = Array.prototype.slice.call(root.querySelectorAll(".icard[data-search]"));
    if (!cards.length) return;

    var input = document.getElementById("catsearch");
    // Los chips viven en .filterbar, FUERA de #catindex -> buscarlos en el documento.
    var chips = Array.prototype.slice.call(document.querySelectorAll(".fchip[data-group]"));
    var countEl = document.getElementById("resultcount");
    var noResEl = document.getElementById("noresults");
    var total = cards.length;

    // Índice Fuse sobre las tarjetas.
    var records = cards.map(function (el, i) {
      return {
        i: i,
        title: el.getAttribute("data-title") || "",
        tags: el.getAttribute("data-tags") || "",
        meta: el.getAttribute("data-search") || ""
      };
    });

    var fuse = null;
    if (window.Fuse) {
      fuse = new window.Fuse(records, {
        includeScore: false,
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2,
        keys: [
          { name: "title", weight: 0.6 },
          { name: "tags", weight: 0.25 },
          { name: "meta", weight: 0.15 }
        ]
      });
    }

    var activeFilters = {}; // group -> Set(values)
    var resetBtn = document.getElementById("filterreset");

    function anyActive() {
      if (input && input.value.trim()) return true;
      for (var g in activeFilters) {
        if (activeFilters.hasOwnProperty(g) && activeFilters[g] && activeFilters[g].size) return true;
      }
      return false;
    }
    function updateReset() { if (resetBtn) resetBtn.hidden = !anyActive(); }
    function resetAll() {
      if (input) input.value = "";
      for (var g in activeFilters) {
        if (activeFilters.hasOwnProperty(g) && activeFilters[g]) activeFilters[g].clear();
      }
      chips.forEach(function (c) { c.classList.remove("on"); c.setAttribute("aria-pressed", "false"); });
      run();
      if (input) input.focus();
    }

    function chipMatch(el) {
      for (var group in activeFilters) {
        if (!activeFilters.hasOwnProperty(group)) continue;
        var set = activeFilters[group];
        if (!set.size) continue;
        var val = (el.getAttribute("data-" + group) || "").toLowerCase();
        // valores múltiples separados por "|" (p. ej. varias tags)
        var parts = val.split("|");
        var ok = false;
        set.forEach(function (v) { if (parts.indexOf(v) !== -1) ok = true; });
        if (!ok) return false;
      }
      return true;
    }

    function run() {
      var q = input ? input.value.trim() : "";
      var searchSet = null;
      if (q && fuse) {
        searchSet = {};
        fuse.search(q).forEach(function (r) { searchSet[r.item.i] = true; });
      } else if (q && !fuse) {
        // Fallback: substring simple si Fuse no cargó.
        searchSet = {};
        var ql = q.toLowerCase();
        records.forEach(function (r) {
          if ((r.title + " " + r.meta).toLowerCase().indexOf(ql) !== -1) searchSet[r.i] = true;
        });
      }

      var visible = 0;
      cards.forEach(function (el, i) {
        var ok = chipMatch(el) && (searchSet === null || searchSet[i]);
        el.style.display = ok ? "" : "none";
        if (ok) visible++;
      });

      // Ocultar secciones/subgrupos que quedan sin tarjetas visibles.
      root.querySelectorAll(".wsubgroup").forEach(function (g) {
        g.style.display = hasVisibleCard(g) ? "" : "none";
      });
      root.querySelectorAll(".wsec").forEach(function (s) {
        s.style.display = hasVisibleCard(s) ? "" : "none";
      });

      if (countEl) {
        // Concuerda el sustantivo con SU número (no con `visible`): evita
        // "1 de 63 entrada" y "1 entradas" cuando la colección tiene una sola.
        var noun = function (n) { return n === 1 ? " entrada" : " entradas"; };
        countEl.textContent = visible === total
          ? total + noun(total)
          : visible + " de " + total + noun(total);
      }
      if (noResEl) noResEl.style.display = visible === 0 ? "" : "none";
      updateReset();
      syncURL();
    }

    // Refleja búsqueda + filtros en la URL (compartible, persiste al recargar).
    // Con debounce: run() se dispara en cada tecla, pero escribir historial en
    // cada pulsación es coste inútil y Safari corta a ~100 replaceState/30 s.
    var _syncT = null;
    function syncURL() {
      if (_syncT) clearTimeout(_syncT);
      _syncT = setTimeout(writeURL, 200);
    }
    function writeURL() {
      try {
        var params = new URLSearchParams();
        if (input && input.value.trim()) params.set("q", input.value.trim());
        for (var g in activeFilters) {
          if (activeFilters.hasOwnProperty(g) && activeFilters[g] && activeFilters[g].size) {
            // Un parámetro repetido por valor: URLSearchParams codifica cada uno,
            // así un valor con coma (p. ej. un producto) ya no rompe el multi-filtro.
            activeFilters[g].forEach(function (v) { params.append(g, v); });
          }
        }
        var qs = params.toString();
        // Preserva el fragmento (#hash) presente al cargar / en enlaces.
        history.replaceState(null, "", location.pathname + (qs ? "?" + qs : "") + location.hash);
      } catch (e) {}
    }

    // Restaura estado desde la URL al cargar (?q=…&dificultad=…).
    function restoreFromURL() {
      try {
        var params = new URLSearchParams(location.search);
        var q = params.get("q");
        if (q && input) input.value = q;
        // Solo restauramos claves que sean grupos de filtro REALES (derivados de
        // los chips). Así utm_source, fbclid, gclid, ref, mc_cid… no se tratan
        // como filtros: sin este guardo, cualquier param de tracking vaciaba el
        // índice entero (ninguna tarjeta tiene ese data-atributo).
        var knownGroups = {};
        chips.forEach(function (c) { knownGroups[c.getAttribute("data-group")] = true; });
        Object.keys(knownGroups).forEach(function (key) {
          if (!params.has(key)) return;
          var vals = [];
          params.getAll(key).forEach(function (raw) {
            // compat: valores separados por coma de URLs antiguas
            raw.split(",").forEach(function (s) { if (s) vals.push(s.toLowerCase()); });
          });
          if (!vals.length) return;
          activeFilters[key] = new Set(vals);
          chips.forEach(function (c) {
            if (c.getAttribute("data-group") === key &&
                vals.indexOf((c.getAttribute("data-value") || "").toLowerCase()) !== -1) {
              c.classList.add("on");
              c.setAttribute("aria-pressed", "true");
            }
          });
        });
      } catch (e) {}
    }

    function hasVisibleCard(container) {
      var cs = container.querySelectorAll(".icard[data-search]");
      for (var i = 0; i < cs.length; i++) {
        if (cs[i].style.display !== "none") return true;
      }
      return false;
    }

    if (input) {
      input.addEventListener("input", run);
      input.addEventListener("search", run);
    }

    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var group = chip.getAttribute("data-group");
        var value = (chip.getAttribute("data-value") || "").toLowerCase();
        if (!activeFilters[group]) activeFilters[group] = new Set();
        var set = activeFilters[group];
        if (set.has(value)) { set.delete(value); chip.classList.remove("on"); }
        else { set.add(value); chip.classList.add("on"); }
        chip.setAttribute("aria-pressed", chip.classList.contains("on") ? "true" : "false");
        run();
      });
    });

    if (resetBtn) resetBtn.addEventListener("click", resetAll);

    restoreFromURL();
    run();
  });
})();
