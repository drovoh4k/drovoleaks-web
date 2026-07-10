#!/usr/bin/env python3
"""Normaliza el ORDEN del front matter de las entradas (page bundles).

Objetivo: que editar en jekyll-admin sea predecible. jekyll-admin dibuja el panel
"Metadata" en el mismo orden en que aparecen las claves en el fichero, así que si
todas las entradas de un tipo comparten el mismo orden, el editor se ve siempre
igual: primero los campos compactos y estructurados, y al final los bloques de
texto largo (resumen, recursos) para que no partan el formulario.

NO reserializa YAML: reordena los BLOQUES de texto crudo de cada clave top-level,
así que los block scalars (`resumen: |`) y las listas se conservan byte a byte.
Solo cambia el orden de las claves y elimina `categoria_slug` (que ya lo aporta
`_config.yml` defaults, es ruido en el editor).

Uso:
    python3 tools/order_frontmatter.py            # aplica a _writeups/.. _varios
    python3 tools/order_frontmatter.py --check    # no escribe; sale !=0 si algo cambiaría
"""
from __future__ import annotations
import re
import sys
import pathlib

# Orden canónico global. Cada tipo solo tiene sus propias claves, así que una
# única lista sirve para todos: al filtrar por presencia, cada entrada queda
# agrupada de forma lógica (identidad → clasificación → medios/estado → texto).
ORDER = [
    # identidad
    "title", "date", "categoria", "descripcion",
    # clasificación · writeup
    "subtipo", "fuente", "evento", "evento_orden", "dificultad", "arquitectura", "plataforma", "lenguaje",
    # clasificación · masterclass
    "nivel",
    # clasificación · curso
    "curso", "curso_slug", "modulo", "orden",
    # clasificación · vulnerabilidad
    "cve", "alias", "producto", "impacto",
    # clasificación · varios
    "tema", "herramientas",
    # clasificación · paper
    "arxiv", "estado",
    # duración (curso / masterclass)
    "duracion",
    # medios y estado
    "tags", "video", "draft", "date_placeholder",
    # texto largo (al final, para no partir el formulario)
    "resumen", "recursos",
    # mecánico (nunca se edita a mano)
    "permalink",
]
DROP = {"categoria_slug"}  # redundante: lo fija _config.yml defaults

_RANK = {k: i for i, k in enumerate(ORDER)}
_KEY_RE = re.compile(r"^([A-Za-z_][A-Za-z0-9_]*):")
COLLECTIONS = ["content/_writeups", "content/_cursos", "content/_masterclass",
               "content/_vulnerabilidades", "content/_varios", "content/_papers"]


def _split_frontmatter(text: str):
    """Devuelve (fm_lines, body_str) o None si no hay front matter al inicio."""
    if not text.startswith("---"):
        return None
    lines = text.split("\n")
    if lines[0].strip() != "---":
        return None
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        return None
    return lines[1:end], "\n".join(lines[end + 1:])


def _blocks(fm_lines):
    """Agrupa las líneas del front matter por clave top-level (columna 0).

    Las líneas indentadas / en blanco / de continuación (listas, block scalars)
    se adhieren al bloque de su clave. Devuelve [(key, [lines]), ...]."""
    out = []
    cur = None
    for ln in fm_lines:
        m = _KEY_RE.match(ln)
        if m:
            cur = [m.group(1), [ln]]
            out.append(cur)
        elif cur is not None:
            cur[1].append(ln)
        else:
            # Línea antes de la primera clave (no debería pasar); la preservamos
            # al frente con una clave centinela que se ordena primero.
            cur = ["\x00", [ln]]
            out.append(cur)
    return out


def reorder_fm_text(text: str) -> str:
    """Devuelve el fichero con el front matter reordenado (o igual si ya lo está)."""
    split = _split_frontmatter(text)
    if not split:
        return text
    fm_lines, body = split
    blocks = [b for b in _blocks(fm_lines) if b[0] not in DROP]
    # Orden estable: claves conocidas por su rango; desconocidas y centinela al
    # final / principio conservando su orden original (sorted es estable).
    def rank(b):
        if b[0] == "\x00":
            return -1
        return _RANK.get(b[0], len(ORDER) + 1)
    ordered = sorted(blocks, key=rank)
    new_fm = [line for _, lines in ordered for line in lines]
    return "---\n" + "\n".join(new_fm) + "\n---\n" + body


def iter_entries(root: pathlib.Path):
    for col in COLLECTIONS:
        yield from (root / col).rglob("index.md")


def main(argv):
    check = "--check" in argv
    root = pathlib.Path(__file__).resolve().parent.parent
    changed = []
    for path in sorted(iter_entries(root)):
        original = path.read_text(encoding="utf-8")
        updated = reorder_fm_text(original)
        if updated != original:
            changed.append(path.relative_to(root))
            if not check:
                path.write_text(updated, encoding="utf-8")
    if check:
        for c in changed:
            print(f"cambiaría: {c}")
        print(f"\n{len(changed)} fichero(s) fuera de orden." if changed else "Todo en orden.")
        return 1 if changed else 0
    for c in changed:
        print(f"reordenado: {c}")
    print(f"\n{len(changed)} fichero(s) reordenados." if changed else "Nada que reordenar (ya estaba).")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
