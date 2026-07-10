# frozen_string_literal: true
#
# Genera un índice navegable (listado de ficheros) para las CARPETAS de assets
# que el contenido enlaza pero que no tienen index propio. En un hosting estático
# (GitHub Pages) una URL de carpeta sin index.html da 404; este plugin crea ese
# index con la lista de ficheros, así el enlace del autor (p. ej. `[Demos](demos/)`
# o `[PoC](PoC)`) funciona de verdad y deja de romperse.
#
# Solo genera para carpetas realmente enlazadas desde el markdown de una entrada,
# así que el nº de páginas creadas es acotado.

module DrovoDirIndex
  LINK_RE = /(?:\]\(|href=["'])([^)"'#?\s]+)/.freeze

  class Generator < Jekyll::Generator
    safe false
    priority :low

    def generate(site)
      seen = {}
      site.collections.each_value do |coll|
        coll.docs.each do |doc|
          # drafts.rb (en producción) marca los borradores published:false; no
          # generamos su índice de carpeta (expondría la lista de ficheros de una
          # entrada aún no publicada). En local sigue generándose para previsualizar.
          next if doc.data["published"] == false
          pl = doc.data["permalink"]
          next unless pl
          dir = File.dirname(doc.path)
          doc.content.to_s.scan(LINK_RE) do |m|
            href = m[0]
            next if href =~ %r{\A(?:[a-z]+:|//|/|#)}i # externo/absoluto/anchor
            next if href.include?("..")               # no escapar de la carpeta de la entrada
            target = File.expand_path(File.join(dir, href))
            next unless File.directory?(target)
            next if File.exist?(File.join(target, "index.html")) || File.exist?(File.join(target, "index.md"))
            next if seen[target]
            seen[target] = true

            url = (pl.chomp("/") + "/" + href).squeeze("/")
            url = url.chomp("/") + "/"
            site.pages << DirIndexPage.new(site, target, url, href.chomp("/"))
          end
        end
      end
    end
  end

  class DirIndexPage < Jekyll::Page
    def initialize(site, abs_dir, url, label)
      @site = site
      @base = site.source
      @dir = url
      @basename = "index"
      @ext = ".html"
      @name = "index.html"
      process(@name)

      files = Dir.glob(File.join(abs_dir, "**", "*"))
                 .select { |f| File.file?(f) }
                 .map { |f| f.sub(%r{\A#{Regexp.escape(abs_dir)}/?}, "") }
                 .reject { |f| f == "index.html" }
                 .sort
      items = files.map { |f| %(<li><a href="#{f}">#{f}</a></li>) }.join("\n")

      @content = <<~HTML
        <div class="itemwrap acc-fwd">
          <p class="sec-eye">índice de carpeta</p>
          <h1 class="h2">#{label}/</h1>
          <div class="prose">
            <p>Ficheros disponibles en esta carpeta:</p>
            <ul>
        #{items}
            </ul>
          </div>
        </div>
      HTML

      @data = { "layout" => "default", "title" => "#{label}/", "permalink" => url }
    end
  end
end
