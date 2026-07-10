---
title: "Aleatoriedad"
date: 2026-04-23
categoria: "Criptografía"
descripcion: "En esta clase exploramos qué significa realmente la aleatoriedad en criptografía, las propiedades que debe cumplir y por qué los ordenadores no pueden generarla de forma natural."
curso: "Introducción a la Criptografía"
curso_slug: "introduccion-criptografia"
modulo: "Clases"
orden: 300
duracion: "10 min"
tags: ["Criptografía"]
video: "https://youtu.be/npR4B4fLAZ4?list=PLKYfwBIKMkXdzMEfY64rQq-BLLubWVqm7"
draft: false
resumen: |
  La aleatoriedad es el cimiento invisible de la criptografía: si falla, todo lo que hay encima se derrumba.

  En esta clase veremos:
  - **Qué es la aleatoriedad**: qué significa de verdad en cripto, las propiedades que debe cumplir y por qué un ordenador no puede generarla de forma natural.
  - **TRNG, PRNG y CSPRNG**: cómo funciona cada tipo de generador, sus diferencias y limitaciones.
  - **La importancia de la semilla**: por qué la calidad del seed es crítica.
  - **El riesgo real**: cómo una mala aleatoriedad puede comprometer incluso el cifrado más seguro.
permalink: "/cursos/introduccion-criptografia/3-aleatoriedad/"
---
### Enlaces

- **Fundamentos**
    - [Wikipedia: Aleatoriedad](https://en.wikipedia.org/wiki/Randomness)
        - Define el concepto de aleatoriedad como la ausencia de patrones predecibles, fundamental para la seguridad en sistemas criptográficos.

- **Generadores**
    - [Wikipedia: TRNG](https://en.wikipedia.org/wiki/Hardware_random_number_generator)
        - Describe los True Random Number Generators, que obtienen aleatoriedad a partir de fenómenos físicos impredecibles.
    - [Wikipedia: PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator)
        - Explica los Pseudorandom Number Generators, algoritmos deterministas que generan secuencias aparentemente aleatorias a partir de una semilla.
    - [Wikipedia: CSPRNG](https://en.wikipedia.org/wiki/Cryptographically_secure_pseudorandom_number_generator)
        - Introduce los generadores pseudoaleatorios criptográficamente seguros, diseñados para resistir ataques y cumplir requisitos de seguridad.

- **Casos reales**
    - [Unaaldia: Fallo en generación de números aleatorios en Debian](https://unaaldia.hispasec.com/2008/05/graves-problemas-en-el-algoritmo-que-genera-los-numeros-aleatorios-en-debian.html)
        - Explica un fallo crítico en Debian que redujo drásticamente la entropía de los números aleatorios, comprometiendo claves criptográficas.
    - [Segu-Info: Ps3 Hackeada](https://blog.segu-info.com.ar/2012/10/ps3-hackeada-de-nuevo.html?m=0)
        - Describe cómo un uso incorrecto de valores aleatorios permitió comprometer el sistema de firma digital de la PlayStation 3.
    - [Medium: Análisis técnico del fallo ECDSA en PS3](https://deeprnd.medium.com/decoding-the-playstation-3-hack-unraveling-the-ecdsa-random-generator-flaw-e9074a51b831)
        - Profundiza en el fallo del generador aleatorio en ECDSA que permitió recuperar claves privadas.
    - [Coindesk: Vulnerabilidad en generación de claves en Android](https://www.coindesk.com/es/markets/2013/08/16/google-patches-android-flaw-that-led-to-bitcoin-heist)
        - Describe un fallo en Android que provocó generación débil de claves, facilitando el robo de bitcoins.

- **Libros**
    - [Crypto101 by lvh (gratuito)](https://www.crypto101.io)
        - Es un libro introductorio de criptografía dirigido principalmente a programadores y profesionales de seguridad, disponible gratuitamente en formato web y PDF.
    - [Serious Cryptography, 2nd Edition by Jean-Philippe Aumasson (≈ $50)](https://nostarch.com/serious-cryptography-2nd-edition)
        - Es una introducción práctica a la criptografía moderna, centrada en entender cómo funcionan realmente los algoritmos y sistemas criptográficos utilizados en la práctica.
