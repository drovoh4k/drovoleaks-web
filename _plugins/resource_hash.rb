# frozen_string_literal: true
#
# Añade a cada recurso de tipo fichero (`recursos:` con `file:`) su huella SHA-256
# y su tamaño, leyendo el fichero real en build. Se muestran en el modal de descarga
# para dar INTEGRIDAD verificable de los binarios/zips que el lector ejecuta.
#
# Se implementa como Generator (no como hook :post_init) porque necesita el front
# matter ya leído. Se guarda como `bytes` (no `size`): en Liquid `.size` es reservado.

require "digest"

module DrovoResourceHash
  class Generator < Jekyll::Generator
    safe false
    priority :normal

    def generate(site)
      site.collections.each_value do |coll|
        coll.docs.each do |doc|
          res = doc.data["recursos"]
          next unless res.is_a?(Array)
          dir = File.dirname(doc.path)
          res.each do |r|
            next unless r.is_a?(Hash) && r["file"]
            f = File.join(dir, r["file"].to_s)
            next unless File.file?(f)
            r["sha256"] = Digest::SHA256.file(f).hexdigest
            r["bytes"] = File.size(f)
          end
        end
      end
    end
  end
end
