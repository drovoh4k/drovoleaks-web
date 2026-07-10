# frozen_string_literal: true
#
# En PRODUCCIÓN (JEKYLL_ENV=production, como en el deploy de CI) las entradas con
# `draft: true` NO se publican: se marcan `published: false` para que no generen
# página, ni entren en el sitemap/feeds. En local (jekyll serve) sí se ven, para
# poder previsualizarlas.
#
# Cierra una fuga real: un `draft: true` olvidado publicaría, p. ej., un análisis de
# CVE a medias. Antes solo se filtraban de los listados, pero la página seguía viva.
#
# Generator (no hook :post_init) para tener el front matter ya leído; prioridad alta
# para correr antes que otros generadores (p. ej. el de páginas de tag).

module DrovoDrafts
  class Generator < Jekyll::Generator
    safe false
    priority :highest

    def generate(site)
      return unless ENV["JEKYLL_ENV"] == "production"
      site.collections.each_value do |coll|
        coll.docs.each do |doc|
          doc.data["published"] = false if doc.data["draft"] == true
        end
      end
    end
  end
end
