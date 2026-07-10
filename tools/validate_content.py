#!/usr/bin/env python3
"""Valida el front matter de las entradas antes de publicar (puerta de calidad).

Comprueba, para cada `content/_<coleccion>/**/index.md`:
  - Campos obligatorios presentes (title, date, categoria, descripcion, permalink).
  - `permalink` == ruta física de la carpeta (requisito para que los enlaces
    relativos a assets funcionen).
  - Vocabulario controlado: los campos con enum (categoria, dificultad,
    arquitectura, plataforma, lenguaje, subtipo, nivel) solo usan valores conocidos.
    Así "AMD64" y "x86-64" no acaban siendo dos filtros para lo mismo. Para añadir
    un valor nuevo, se amplía la lista de abajo a propósito.
  - Entradas NO borrador: sin placeholders (`RELLENAR`, `date_placeholder: true`).

Sin dependencias (no usa PyYAML). Salida !=0 si hay errores. Uso:
    python3 tools/validate_content.py
"""
from __future__ import annotations
import re
import sys
import pathlib

COLLECTIONS = ["writeups", "cursos", "masterclass", "vulnerabilidades", "varios", "papers"]
# Obligatorios en todas las colecciones.
REQUIRED = ["title", "date", "descripcion", "permalink"]
# `categoria` es obligatoria salvo en vulnerabilidades/papers (usan cve/producto o arxiv).
REQUIRED_CATEGORIA = {"writeups", "cursos", "masterclass", "varios"}

# ── Vocabulario controlado (enums cerrados). Ampliar a propósito. ────────────
ENUMS = {
    "categoria":    {"Reversing", "Criptografía", "Pwn", "Malware", "Web", "Forense", "Hardware", "Misc"},
    "dificultad":   {"Muy Fácil", "Fácil", "Media", "Difícil", "Muy Difícil"},
    "arquitectura": {"x86", "x86-64", "ARM", "ARM64", "MIPS", "RISC-V", "PowerPC", "Multi", "N/A"},
    "plataforma":   {"Unix/Linux", "Windows", "macOS", "Android", "iOS", "Nintendo64", "Multi", "N/A"},
    "lenguaje":     {"C/C++", "C", "Python", "Assembly", "Rust", "Go", "Java", "C#", "JavaScript", "Multi", "N/A"},
    "subtipo":      {"crackme", "ctf"},
    "nivel":        {"Principiante", "Intermedio", "Avanzado"},
}

_KV = re.compile(r'^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$')


def parse_front_matter(text):
    """Devuelve (dict de escalares top-level, texto_completo) o (None, text)."""
    if not text.startswith("---"):
        return None, text
    lines = text.split("\n")
    if lines[0].strip() != "---":
        return None, text
    end = next((i for i in range(1, len(lines)) if lines[i].strip() == "---"), None)
    if end is None:
        return None, text
    data = {}
    for ln in lines[1:end]:
        if ln[:1] in (" ", "\t") or not ln.strip():
            continue  # continuación de lista / block scalar
        m = _KV.match(ln)
        if not m:
            continue
        key, val = m.group(1), m.group(2).strip()
        if val and val[0] in "[|>&":  # lista inline / block scalar: no es escalar simple
            data[key] = None
            continue
        val = val.strip('"').strip("'")
        data[key] = val
    return data, text


def expected_permalink(path: pathlib.Path, root: pathlib.Path, coll: str) -> str:
    rel = path.parent.relative_to(root / "content" / ("_" + coll)).as_posix()
    return f"/{coll}/{rel}/"


def main(argv):
    root = pathlib.Path(__file__).resolve().parent.parent
    errors = []
    for coll in COLLECTIONS:
        base = root / "content" / ("_" + coll)
        if not base.exists():
            continue
        for path in sorted(base.rglob("index.md")):
            rel = path.relative_to(root)
            text = path.read_text(encoding="utf-8")
            fm, _ = parse_front_matter(text)
            if fm is None:
                errors.append(f"{rel}: sin front matter")
                continue
            is_draft = str(fm.get("draft", "")).lower() == "true"

            req_fields = list(REQUIRED)
            if coll in REQUIRED_CATEGORIA:
                req_fields.append("categoria")
            for req in req_fields:
                if not fm.get(req):
                    errors.append(f"{rel}: falta campo obligatorio '{req}'")

            pl = fm.get("permalink")
            if pl:
                exp = expected_permalink(path, root, coll)
                if pl != exp:
                    errors.append(f"{rel}: permalink '{pl}' != ruta de carpeta '{exp}'")

            for field, allowed in ENUMS.items():
                v = fm.get(field)
                if v and v not in allowed:
                    errors.append(f"{rel}: {field}='{v}' fuera del vocabulario {sorted(allowed)}")

            if not is_draft:
                if "RELLENAR" in text:
                    errors.append(f"{rel}: contiene 'RELLENAR' sin rellenar (o márcala draft: true)")
                if re.search(r"^\s*date_placeholder:\s*true", text, re.M):
                    errors.append(f"{rel}: date_placeholder: true en entrada publicada")

    if errors:
        print(f"✗ {len(errors)} problema(s) de contenido:\n")
        for e in errors:
            print(f"  - {e}")
        return 1
    print("✓ Contenido válido: front matter, permalinks y vocabulario correctos.")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
