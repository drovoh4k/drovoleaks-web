# frozen_string_literal: true
#
# Genera una página navegable por cada tag con al menos MIN_ENTRIES entradas
# (evita páginas huérfanas de un solo uso). Cada página lista las entradas de
# TODAS las colecciones que llevan ese tag, ordenadas por fecha desc.
#
# Publica también `site.data['tag_slugs']` (lista de slugs con página) para que
# las plantillas sepan qué tags enlazar y cuáles dejar como texto plano.
#
# El slug usa Jekyll::Utils.slugify (mismo modo que el filtro Liquid `| slugify`),
# así el enlace de la plantilla y la URL generada coinciden.

module DrovoTags
  COLLECTIONS = %w[writeups cursos masterclass vulnerabilidades varios papers].freeze
  MIN_ENTRIES = 2

  class Generator < Jekyll::Generator
    safe false
    priority :low

    def generate(site)
      docs = []
      COLLECTIONS.each do |c|
        coll = site.collections[c]
        docs.concat(coll.docs) if coll
      end
      docs.reject! { |d| d.data["draft"] }

      by_slug = Hash.new { |h, k| h[k] = { label: nil, docs: [] } }
      docs.each do |d|
        Array(d.data["tags"]).each do |t|
          s = Jekyll::Utils.slugify(t.to_s)
          next if s.nil? || s.empty?
          by_slug[s][:label] ||= t.to_s
          # Deduplica por documento: dos tags de una MISMA entrada que slugifican
          # igual (p. ej. "MIPS" y "mips") no deben contar dos veces y crear una
          # página de tag "huérfana" con una sola entrada.
          (by_slug[s][:docs] << d) unless by_slug[s][:docs].include?(d)
        end
      end

      slugs = []
      by_slug.sort.each do |slug, info|
        next if info[:docs].size < MIN_ENTRIES
        slugs << slug
        entries = info[:docs].uniq.sort_by { |d| d.data["date"] || Time.at(0) }.reverse
        site.pages << TagPage.new(site, slug, info[:label], entries)
      end
      site.data["tag_slugs"] = slugs
    end
  end

  class TagPage < Jekyll::Page
    def initialize(site, slug, label, entries)
      @site = site
      @base = site.source
      @dir = "tags/#{slug}"
      @basename = "index"
      @ext = ".html"
      @name = "index.html"
      process(@name)
      @data = {
        "layout" => "tag",
        "title" => "##{label}",
        "tag" => label,
        "tag_slug" => slug,
        "permalink" => "/tags/#{slug}/",
        "entries" => entries,
        "tag_count" => entries.size,
        # Meta description única por tag (si no, todas heredaban site.description y
        # Google las veía como duplicadas). head-seo.html la usa vía page.descripcion.
        "descripcion" => "#{entries.size} #{entries.size == 1 ? 'entrada etiquetada' : 'entradas etiquetadas'} como #{label} en Drovoleaks: writeups, cursos y análisis de reversing, pwn y malware.",
      }
    end
  end
end
