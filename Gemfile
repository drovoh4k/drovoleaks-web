source "https://rubygems.org"

# Jekyll 4.2 line keeps compatibility with older Ruby (uses jekyll-sass-converter 2.x).
# CI (Actions) runs on Ruby 3.x; this pin works there too.
gem "jekyll", "~> 4.2.2"

group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"        # RSS -> /feed.xml
  gem "jekyll-sitemap", "~> 1.4"      # /sitemap.xml
end

# Rouge is bundled with Jekyll, pinned here for reproducible highlighting CSS.
gem "rouge", "~> 3.30"

# Ruby 3.0+ dropped webrick from stdlib; needed by `jekyll serve`.
gem "webrick", "~> 1.8"

# ── Compatibilidad multi-Ruby ────────────────────────────────────────────────
# El build local usa Ruby 2.6; el deploy (CI) usa Ruby 3.3. Fijar las versiones
# viejas para ambos rompía el `bundle install` de CI (ffi 1.15.5 no es la de 3.x),
# así que los pines de 2.6 se aplican SOLO en Ruby antiguo. En Ruby 3.x se
# resuelven las modernas (con binarios precompilados para linux, sin compilar).
if RUBY_VERSION < "3.0"
  gem "ffi", "~> 1.15.5"         # ffi 1.16+ exige Ruby >= 3.0
  gem "public_suffix", "~> 4.0"  # public_suffix 5.x exige Ruby >= 3.0
end

# Convertidor Sass de jekyll-sass-converter 2.x; 2.4 compila en 2.6 y en 3.3.
gem "sassc", "~> 2.4"

# Windows / JRuby niceties (harmless elsewhere).
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]
