# DROVOLEAKS — sitio web

Sitio **Jekyll estático** del canal [@drovoh4k](https://www.youtube.com/@drovoh4k):
writeups, cursos, masterclass, tutoriales, análisis de vulnerabilidades y varios.
Todo el contenido vive en `index.md` con front matter; **los índices, contadores,
buscador, filtros, páginas de tag, RSS y novedades se generan solos**.

## Arranque rápido

```bash
bundle install
bundle exec jekyll serve      # http://localhost:4000
```

Añadir una entrada:

```bash
bin/nueva-entrada writeup crackmes/crackmes.one/mi-reto "Mi Reto"
```

Ver [`CONTRIBUTING.md`](CONTRIBUTING.md) para el detalle de cada tipo.

## Cómo está montado

| Pieza | Dónde | Qué hace |
|---|---|---|
| Categorías | `_data/categorias.yml` | Fuente única de las 6 categorías: label, slug, icono, color, descripción y filtros. Nav, home, índices y breadcrumb salen de aquí. |
| Colecciones | `content/_writeups/ content/_cursos/ content/_masterclass/ content/_vulnerabilidades/ content/_varios/` | Todo el contenido bajo `content/` (`collections_dir`). Una colección por categoría (`output: true`). Cada entrada es un *page bundle* (`index.md` + assets). |
| Landings de curso | `content/cursos/<slug>.md` | Página por curso; agrupa sus clases por módulo, en orden. |
| Layouts | `_layouts/` | `default` (sidebar + topbar + footer), `home`, `categoria`, `curso`, `entry`, `tag`. |
| Includes | `_includes/` | `sidebar`, `topbar`, `icons`, `item-card`, `fecha`, `head-seo` (OG/Twitter/JSON-LD), `video-id`, `comments` (giscus). |
| Páginas | `pages/` | Índices de categoría, `feed.xml`, `empieza.html` (ruta), `legal.html`, `404.html`. `robots.txt` en la raíz. |
| Diseño | `assets/css/main.css` + `assets/css/fonts.css` | Tokens, tema claro/oscuro, responsive. Fuentes **auto-alojadas** (`assets/fonts/`, subset latin), sin Google Fonts. |
| JS | `assets/js/app.js` (tema, nav, copiar, modales, visores, progreso de curso, scrollspy), `search.js` (buscador + filtros de categoría, estado en URL) | Vanilla, sin frameworks. |
| Buscador | `search.js` + Fuse.js | Buscador y filtros dentro de cada índice de categoría (fuzzy, sobre las tarjetas). |
| Plugins | `_plugins/` | `image_dims` (width/height anti-CLS), `tag_pages` (`/tags/<slug>/`), `resource_hash` (SHA-256 de mirrors), `drafts` (excluye borradores en prod). |
| RSS | jekyll-feed | `/feed.xml` global (agregado) + un feed por colección. |
| Deploy + CI | `.github/workflows/deploy.yml` | En `pull_request`: valida (`order_frontmatter --check`, `validate_content.py`, html-proofer). En `main`: build + deploy (Ruby 3.3). |
| Normalizar/validar | `tools/order_frontmatter.py`, `tools/validate_content.py` | Orden canónico del front matter + validación de vocabulario, permalinks y placeholders. |

## Decisiones de diseño

- **Permalink = ruta física de la carpeta.** Cada entrada fija su `permalink`
  igual a la ruta de su carpeta, así Jekyll copia los assets al mismo prefijo y
  los **enlaces relativos** del cuerpo (`challenge/x.zip`, `resources/img.png`)
  siguen funcionando sin tocarlos.
- **Sin tablas-índice a mano.** Los antiguos índices markdown se sustituyen por
  listados derivados del front matter (contadores, agrupación, filtros).
- **Tema sin FOUC.** Claro por defecto; la elección del usuario se persiste en
  `localStorage`. Un script inline en `#app` aplica el tema antes de pintar.
- **Accesibilidad.** Contraste AA (tokens del brief), foco visible, navegación por
  teclado, `prefers-reduced-motion`, saltar al contenido.
- **Rendimiento.** Fuentes con `display=swap`, imágenes `loading="lazy"`, JS
  diferido, sin frameworks pesados.

## Deploy en GitHub Pages

1. Sube el repo a GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. `git push` a `main` dispara `.github/workflows/deploy.yml`.
4. (Opcional) Escribe tu dominio en `CNAME` (ahora vacío) y en `url:` de
   `_config.yml`.

## Build local con Ruby 2.6

El `Gemfile` fija Jekyll 4.2 y algunas gemas (`ffi`, `public_suffix`, `sassc`,
`google-protobuf`) a versiones compatibles con el Ruby del sistema en macOS. En
CI se usa Ruby 3.3, donde esas mismas versiones también resuelven.
