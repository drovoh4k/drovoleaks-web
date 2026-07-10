# Cómo añadir contenido

La regla de oro: **añadir contenido = crear UN `index.md` con front matter**. Los
índices, contadores, buscador, filtros, páginas de tag, RSS y novedades se generan
solos. No se toca ninguna tabla ni ningún listado a mano.

## La forma rápida: `bin/nueva-entrada`

```bash
bin/nueva-entrada <tipo> <ruta-relativa> ["Título"]
```

`<tipo>` ∈ `writeup · curso · masterclass · tutorial · vulnerabilidad · varios`.

Ejemplos:

```bash
bin/nueva-entrada writeup crackmes/crackmes.one/mi-reto "Mi Reto"
bin/nueva-entrada vulnerabilidad cve-2027-1234 "CVE-2027-1234 (FooBug)"
bin/nueva-entrada curso introduccion-reversing/4-windows/4.1-pe "Formato PE"
bin/nueva-entrada tutorial debugging/anti-debug "Trucos anti-debug"
```

Esto crea el *page bundle* (`index.md` + carpetas de assets `challenge/`,
`scripts/`, `resources/`…) con el **front matter y el `permalink` correctos**.
Luego editas el `index.md`, pones `draft: false` y listo.

> El `permalink` **debe** reflejar la ruta física de la carpeta para que los
> enlaces relativos a los assets (`challenge/x.zip`, `resources/img.png`) sigan
> funcionando. `bin/nueva-entrada` ya lo pone por ti; si creas la carpeta a mano,
> copia el `permalink` de la plantilla correspondiente en `_templates/`.

## A mano

1. Crea `content/_<coleccion>/<ruta>/index.md` (todo el contenido vive bajo
   `content/`; colecciones: `content/_writeups`, `content/_cursos`,
   `content/_masterclass`, `content/_vulnerabilidades`, `content/_varios`).
2. Copia el front matter desde `_templates/<tipo>.md`.
3. Pon `permalink: /<coleccion-sin-guión-bajo>/<ruta>/` (igual que la carpeta).
4. Mete los assets en subcarpetas de la propia entrada y enlázalos con rutas
   relativas.

## Front matter mínimo por tipo

**Común a todo:** `title`, `date` (YYYY-MM-DD), `categoria`, `descripcion`,
`tags` (lista), `video` (URL), `draft` (bool), `permalink`, `categoria_slug`.
`recursos:` es una lista de `{label, url}` o `{label, file, pass?}`.

| Tipo | Campos propios (además de los comunes) |
|---|---|
| **writeup** | `subtipo` (crackme·ctf), `fuente`, `evento` (solo CTF), `dificultad`, `arquitectura`, `plataforma`, `lenguaje` |
| **curso** (clase) | `curso`, `curso_slug`, `modulo`, `orden` (número que ordena), `duracion` |
| **masterclass** | `nivel`, `duracion` |
| **tutorial** | `tema` — se guarda **dentro de Varios** (`categoria_slug: varios`, en `/varios/tutoriales/…`) |
| **vulnerabilidad** | `cve`, `alias`, `producto`, `impacto` |
| **varios** | `tema`, `herramientas` (lista) |

> Los **tutoriales** no son una categoría propia: viven integrados en **Varios**.
> `bin/nueva-entrada tutorial …` los crea bajo `/varios/tutoriales/…` con
> `categoria_slug: varios`, y se distinguen por su `tema`.

Ejemplo mínimo (writeup):

```yaml
---
title: "Mi Reto"
date: 2026-07-04
categoria: Reversing
descripcion: "Crackme sencillo de comprobación de clave."
tags: ["Reversing", "x86-64"]
video: "https://youtu.be/XXXX"
draft: false
categoria_slug: writeups
subtipo: crackme
fuente: crackmes.one
dificultad: Fácil
arquitectura: x86-64
plataforma: "Unix/Linux"
lenguaje: "C/C++"
permalink: /writeups/crackmes/crackmes.one/mi-reto/
recursos:
  - label: "Reto original"
    url: "https://crackmes.one/…"
  - label: "Descargar challenge"
    file: "challenge/reto.zip"
    pass: "crackmes.one"
---

## 📦 Recursos
Aquí va el writeup…
```

## Cursos: cómo se estructuran

- Cada **clase** es un doc de la colección `content/_cursos` con `curso_slug`,
  `modulo` y `orden`. La **landing** del curso (`content/cursos/<curso_slug>.md`) las
  agrupa por módulo, en orden. Para un curso nuevo, crea también su landing (copia
  una existente en `content/cursos/` y cambia `curso`, `curso_slug`, `objetivo`, `playlist`…).

## Vulnerabilidades con lab

- Añade los ficheros del lab en una carpeta `demo/` (o `PoC/`) dentro de la
  entrada y enlázalos desde el cuerpo. Como el `permalink` coincide con la ruta
  de la carpeta, los enlaces relativos (`demo/start.sh`) funcionan sin tocarlos.

## Categorías, colores e iconos

Todo se define en `_data/categorias.yml` (label, slug, icono, color de acento,
descripción, filtros). Cambiar un color o un icono ahí se propaga a nav, home,
índices y breadcrumb.

## Probar en local

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

Los `draft: true` **no** se publican. Al guardar un `index.md` nuevo, la entrada
aparece sola en su índice, buscador, filtros, tags, RSS y novedades.

## Panel de administración (jekyll-admin)

Con el servidor local arrancado tienes un **panel web** para editar el contenido
sin tocar los ficheros a mano:

```bash
bundle exec jekyll serve      # y abre:
#   http://localhost:4000/admin
```

Desde ahí puedes:

- **Editar entradas** (Collections → writeups / cursos / masterclass /
  vulnerabilidades / varios): navega por las carpetas hasta el `index.md`, y
  edita el título, el **front matter** (panel *Metadata*: `resumen`, `dificultad`,
  `tags`…) y el cuerpo con vista previa. Ideal para **rellenar los `resumen:`
  que están en `RELLENAR`**.
- **Editar `_data/categorias.yml`** en *Data Files* (colores, iconos, filtros).
- Subir/gestionar assets en *Static Files* y ver la config en *Configuration*.

> ⚠️ **Para entradas NUEVAS sigue usando `bin/nueva-entrada`.** El botón
> *“New document”* del panel crea un `.md` **plano**, no un *page bundle* con su
> carpeta y su `permalink` correcto. El panel es para **editar** lo que ya existe;
> el scaffolder es para **crear**.

El panel es **solo local** (server-side): no se despliega y `jekyll build`
(producción/CI) lo ignora por completo, así que no afecta al sitio publicado.
