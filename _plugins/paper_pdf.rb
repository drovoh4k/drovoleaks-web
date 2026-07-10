# frozen_string_literal: true
#
# Para los papers: si en la carpeta de la entrada hay un `paper.pdf` (copia local
# del PDF), lo expone en `page.pdf_local`. Así entry.html puede mostrar el botón
# "Ver paper completo" (que abre esa copia en el visor dentro de la web) solo
# cuando la copia existe de verdad — sin tocar el front matter a mano.

module DrovoPaperPdf
  class Generator < Jekyll::Generator
    safe false
    priority :low

    def generate(site)
      coll = site.collections["papers"]
      return unless coll
      coll.docs.each do |doc|
        pdf = File.join(File.dirname(doc.path), "paper.pdf")
        doc.data["pdf_local"] = "paper.pdf" if File.file?(pdf)
      end
    end
  end
end
