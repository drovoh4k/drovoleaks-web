# frozen_string_literal: true
#
# Inyecta width/height + loading="lazy" + decoding="async" en las <img> del
# cuerpo renderizado, leyendo las dimensiones reales del fichero. Reserva el
# hueco de cada imagen antes de cargarla → elimina el CLS (Cumulative Layout
# Shift) sin tocar el markdown a mano.
#
# - Si la <img> ya trae width Y height, no se toca (respeta lo que puso el autor).
# - Si trae solo width, se calcula el height proporcional (mantiene su tamaño).
# - Si no trae ninguno, se ponen las dimensiones intrínsecas del fichero.
# - Lee PNG/JPEG/GIF/WebP en Ruby puro (sin gemas extra). Remotas o ilegibles: se saltan.
#
# El build de CI usa `bundle exec jekyll build` (no safe-mode), así que este
# plugin se ejecuta también en producción.

module ImageDims
  module_function

  # Devuelve [w, h] o nil.
  def size(path)
    return nil unless File.file?(path)
    File.open(path, "rb") do |f|
      head = f.read(32) || ""
      if head[0, 8].bytes == [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] # PNG
        return head[16, 8].unpack("N2")
      elsif head[0, 3] == "GIF"
        return head[6, 4].unpack("v2")
      elsif head[0, 2].bytes == [0xFF, 0xD8] # JPEG
        return jpeg_size(f)
      elsif head[0, 4] == "RIFF" && head[8, 4] == "WEBP"
        return webp_size(head)
      end
    end
    nil
  rescue StandardError
    nil
  end

  def jpeg_size(f)
    f.seek(2)
    loop do
      byte = f.read(1)
      return nil unless byte
      next unless byte.getbyte(0) == 0xFF
      marker = f.read(1)
      return nil unless marker
      m = marker.getbyte(0)
      next if m == 0xFF # relleno
      # SOF markers que llevan las dimensiones (excluye DHT/DAC/RST/SOS…)
      if (0xC0..0xCF).include?(m) && ![0xC4, 0xC8, 0xCC].include?(m)
        f.read(3) # length(2) + precision(1)
        dims = f.read(4)
        return nil unless dims
        h, w = dims.unpack("n2") # el SOF trae [alto, ancho]
        return [w, h]            # homogeneizado a [ancho, alto], como PNG/GIF
      else
        len = f.read(2)
        return nil unless len
        f.seek(len.unpack1("n") - 2, IO::SEEK_CUR)
      end
    end
  rescue StandardError
    nil
  end

  # Parsea las dimensiones reales de WebP con los 32 bytes ya leídos en `head`
  # (los tres subformatos caben en ese margen). Devuelve [ancho, alto] o nil.
  def webp_size(head)
    case head[12, 4]
    when "VP8X" # extendido: canvas (w-1, h-1) en 24-bit little-endian desde el offset 24
      w = 1 + head[24, 3].unpack("C3").each_with_index.sum { |b, i| b << (8 * i) }
      h = 1 + head[27, 3].unpack("C3").each_with_index.sum { |b, i| b << (8 * i) }
      [w, h]
    when "VP8L" # lossless: 14+14 bits tras la firma 0x2F (offset 21)
      b = head[21, 4].unpack("C4")
      [1 + (((b[1] & 0x3F) << 8) | b[0]),
       1 + (((b[3] & 0x0F) << 10) | (b[2] << 2) | (b[1] >> 6))]
    when "VP8 " # lossy: ancho/alto (14 bits) tras la firma, offsets 26 y 28
      [head[26, 2].unpack1("v") & 0x3FFF, head[28, 2].unpack1("v") & 0x3FFF]
    end
  rescue StandardError
    nil
  end
end

Jekyll::Hooks.register %i[documents pages], :post_render do |doc|
  next unless doc.output_ext == ".html"
  src_dir = File.dirname(doc.path)
  site_src = doc.site.source

  doc.output = doc.output.gsub(/<img\b[^>]*>/i) do |tag|
    begin
      m = tag.match(/\bsrc\s*=\s*["']([^"']+)["']/i)
      next tag unless m
      src = m[1]
      next tag if src =~ %r{\A(https?:)?//} || src.start_with?("data:")

      # resolver ruta física del fichero
      file = if src.start_with?("/")
               File.join(site_src, src.sub(%r{\A/}, ""))
             else
               File.join(src_dir, src)
             end
      # normaliza cualquier baseurl al inicio
      file = File.join(site_src, src.sub(%r{\A/}, "")) unless File.file?(file)
      next tag unless File.file?(file)

      wh = ImageDims.size(file)
      next tag unless wh
      iw, ih = wh
      next tag unless iw && ih && iw > 0 && ih > 0

      has_w = tag =~ /\bwidth\s*=/i
      has_h = tag =~ /\bheight\s*=/i
      out = tag

      if has_w && has_h
        # nada que reservar
      elsif has_w && !has_h
        wattr = tag[/\bwidth\s*=\s*["']?(\d+)/i, 1]
        if wattr
          h = (wattr.to_i * ih.to_f / iw).round
          out = out.sub(/<img\b/i, %(<img height="#{h}"))
        end
      else
        out = out.sub(/<img\b/i, %(<img width="#{iw}" height="#{ih}"))
      end

      # lazy + async si no los trae
      out = out.sub(/<img\b/i, '<img loading="lazy"') unless out =~ /\bloading\s*=/i
      out = out.sub(/<img\b/i, '<img decoding="async"') unless out =~ /\bdecoding\s*=/i
      out
    rescue StandardError
      tag
    end
  end
end
