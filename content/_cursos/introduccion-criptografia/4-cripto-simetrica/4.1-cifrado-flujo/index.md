---
title: "Criptografía simétrica: Cifrado en flujo"
date: 2026-06-02
categoria: "Criptografía"
descripcion: "En esta clase introducimos las bases del cifrado de flujo dentro de la criptografía simétrica, pero el foco estará en analizar algoritmos reales a bajo nivel."
curso: "Introducción a la Criptografía"
curso_slug: "introduccion-criptografia"
modulo: "Clases"
orden: 401
duracion: "19 min"
tags: ["Criptografía"]
video: "https://youtu.be/ewXne11cUP0?list=PLKYfwBIKMkXdzMEfY64rQq-BLLubWVqm7"
draft: false
resumen: |
  Las bases del cifrado en flujo, pero con el foco puesto en destripar algoritmos reales a bajo nivel.

  En esta clase veremos:
  - **Qué es un keystream**: cómo se genera a partir de una clave, nonce o contador, y por qué se combina con el mensaje mediante XOR.
  - **RC4, Salsa20 y ChaCha20 paso a paso**: cómo inicializan su estado interno, cómo generan el flujo de clave y qué operaciones usan para mezclar los datos.
  - **Por qué RC4 está roto**: qué diferencias de diseño lo condenan mientras Salsa20 y ChaCha20 siguen siendo referentes modernos.
recursos:
  - label: "Slides de la clase (PDF)"
    file: "resources/PPT_clase.pdf"
permalink: "/cursos/introduccion-criptografia/4-cripto-simetrica/4.1-cifrado-flujo/"
---
### Enlaces

- **Fundamentos**
    - [Wikipedia: Cifrado simétrico](https://en.wikipedia.org/wiki/Symmetric-key_algorithm)
        - Explica los algoritmos de clave simétrica, en los que la misma clave se utiliza tanto para cifrar como para descifrar la información.
    - [Wikipedia: Cifrador de flujo](https://en.wikipedia.org/wiki/Stream_cipher)
        - Introduce el concepto de cifrador de flujo, un tipo de cifrado simétrico que genera una secuencia pseudoaleatoria de bits o bytes, llamada keystream, que se combina con el mensaje mediante XOR.

- **RC4**
    - [Wikipedia: RC4](https://en.wikipedia.org/wiki/RC4)
        - Describe RC4, un cifrador de flujo ampliamente utilizado en el pasado en protocolos como WEP, WPA y TLS. Actualmente se considera inseguro debido a múltiples sesgos estadísticos y vulnerabilidades criptográficas.
    - [RFC 7465: Prohibiting RC4 Cipher Suites](https://datatracker.ietf.org/doc/html/rfc7465)
        - Documento del IETF que prohíbe el uso de suites criptográficas basadas en RC4 en TLS. Es un ejemplo claro de cómo un algoritmo muy usado puede quedar obsoleto cuando se descubren debilidades prácticas.

- **Salsa20**
    - [Wikipedia: Salsa20](https://en.wikipedia.org/wiki/Salsa20)
        - Explica Salsa20, un cifrador de flujo moderno diseñado por Daniel J. Bernstein. Está basado en operaciones ARX, es decir, suma modular, rotación y XOR, y destaca por su eficiencia y resistencia criptográfica.
    - [Salsa20 specification — Daniel J. Bernstein](https://cr.yp.to/snuffle/spec.pdf)
        - Especificación técnica original de Salsa20. Describe su estructura interna, el uso de clave, nonce y contador, y cómo se genera el flujo pseudoaleatorio utilizado para cifrar.

- **ChaCha**
    - [Wikipedia: ChaCha](https://en.wikipedia.org/wiki/Salsa20#ChaCha_variant)
        - Introduce ChaCha, una variante de Salsa20 que modifica la función de mezcla interna para mejorar la difusión y el rendimiento en ciertas plataformas.
    - [Wikipedia: ChaCha20-Poly1305](https://en.wikipedia.org/wiki/ChaCha20-Poly1305)
        - Describe la combinación de ChaCha20 como cifrador de flujo y Poly1305 como mecanismo de autenticación. Esta construcción permite proporcionar confidencialidad e integridad al mismo tiempo.
    - [RFC 8439: ChaCha20 and Poly1305 for IETF Protocols](https://www.rfc-editor.org/rfc/rfc8439.html)
        - Define ChaCha20 y Poly1305 para su uso en protocolos de Internet. Es una referencia fundamental para entender ChaCha20-Poly1305, una construcción moderna de cifrado autenticado.

- **Libros**
    - [Crypto101 by lvh (gratuito)](https://www.crypto101.io)
        - Es un libro introductorio de criptografía dirigido principalmente a programadores y profesionales de seguridad, disponible gratuitamente en formato web y PDF.
    - [Serious Cryptography, 2nd Edition by Jean-Philippe Aumasson (≈ $50)](https://nostarch.com/serious-cryptography-2nd-edition)
        - Es una introducción práctica a la criptografía moderna, centrada en entender cómo funcionan realmente los algoritmos y sistemas criptográficos utilizados en la práctica.

### Documentos

- [Pseudocódigos: RC4.pseudo, Salsa20.pseudo y ChaCha20.pseudo](resources/pseudocodes/)
    - Pseudocódigos de los algoritmos explicados.

### Demos

- [Demos: RC4.py, Salsa20.py y ChaCha20.py](demos/)
    - Demos en Python de los algoritmos explicados.
    - Requisitos:
        ```
        python3 -m venv .venv
        source .venv/bin/activate
        pip install -r requirements.txt
        ```
