---
title: "Criptografía clásica"
date: 2026-03-24
categoria: "Criptografía"
descripcion: "En esta clase introducimos la criptografía clásica, viendo los primeros sistemas de cifrado, los tipos básicos como sustitución y transposición, cómo funcionan cifrados como César y Vigenère, y por…"
curso: "Introducción a la Criptografía"
curso_slug: "introduccion-criptografia"
modulo: "Clases"
orden: 200
duracion: "18 min"
tags: ["Criptografía"]
video: "https://youtu.be/c6PDx-LqvTU?list=PLKYfwBIKMkXdzMEfY64rQq-BLLubWVqm7"
draft: false
resumen: |
  Un viaje a los orígenes del cifrado: los primeros sistemas, cómo funcionan y por qué acabaron cayendo.

  En esta clase veremos:
  - **Los primeros sistemas de cifrado**: de dónde parte todo y qué problema intentaban resolver.
  - **Sustitución y transposición**: los dos tipos básicos sobre los que se construyen los cifrados clásicos.
  - **César y Vigenère**: cómo funcionan por dentro dos de los cifrados más conocidos.
  - **Por qué son vulnerables**: los ataques que terminan rompiendo estos sistemas.
permalink: "/cursos/introduccion-criptografia/2-cripto-clasica/"
---
### Enlaces

- **Fundamentos**
    - [Wikipedia: Criptografía clásica](https://en.wikipedia.org/wiki/Classical_cipher)
        - Introduce los cifrados clásicos utilizados antes de la criptografía moderna, basados en transformaciones manuales como sustitución y transposición.
    - [Wikipedia: Cifrado substitución](https://en.wikipedia.org/wiki/Substitution_cipher)
        - Describe los cifrados de sustitución, donde cada símbolo del mensaje se reemplaza por otro siguiendo una regla determinada.
    - [Wikipedia: Cifrado transposición](https://en.wikipedia.org/wiki/Transposition_cipher)
        - Explica los cifrados de transposición, en los que las letras del mensaje se reordenan sin cambiar su identidad.
    - [Inventive HQ: Classical Ciphers Explained - From Caesar to Enigma](https://inventivehq.com/blog/classical-ciphers-explained-caesar-to-enigma)
        - Explica los cifrados clásicos desde sustitución hasta sistemas más complejos, mostrando cómo evolucionaron y por qué eran vulnerables.

- **Cifrado César**
    - [Wikipedia: Cifrado César](https://en.wikipedia.org/wiki/Caesar_cipher)
        - Cifrado por sustitución donde cada letra se desplaza un número fijo de posiciones en el alfabeto.
    - [Wikipedia: Key Space](https://en.wikipedia.org/wiki/Key_space_(cryptography))
        - Define el espacio de claves como el conjunto de todas las claves posibles que puede usar un sistema criptográfico, y explica por qué su tamaño determina la resistencia frente a ataques por fuerza bruta.
    - [CesarCipher.org: Caesar Cipher Tutorial -  Complete Beginner's Guide with Examples](https://caesarcipher.org/learn/caesar-cipher-tutorial-complete-beginners-guide-with-examples)
        - Tutorial completo del cifrado César con ejemplos, implementación y explicación de por qué es vulnerable a fuerza bruta.

- **Cifrado Vigenère**
    - [Wikipedia: Cifrado Vigenère](https://en.wikipedia.org/wiki/Vigen%C3%A8re_cipher)
        - Cifrado polialfabético que usa múltiples desplazamientos controlados por una clave.
    - [Wikipedia: Análisis Frecuencias](https://en.wikipedia.org/wiki/Frequency_analysis)
        - Técnica usada para romper cifrados detectando patrones estadísticos del lenguaje.
    - [Wikipedia: Método de Kasiski](https://en.wikipedia.org/wiki/Kasiski_examination)
        - Usado para estimar la longitud de la clave en cifrados polialfabéticos.
    - [Wikipedia: Índice de Coincidencia](https://en.wikipedia.org/wiki/Index_of_coincidence)
        - Medida estadística usada para detectar periodicidad en textos cifrados.
    - [Blog of Osanda: Breaking the Vigenère Cipher](https://osandamalith.com/2015/05/02/breaking-the-vigenere-cipher)
        - Explica cómo romper el cifrado Vigenère y por qué la repetición de la clave introduce vulnerabilidades.

- **Libros**
    - [Crypto101 by lvh (gratuito)](https://www.crypto101.io)
        - Es un libro introductorio de criptografía dirigido principalmente a programadores y profesionales de seguridad, disponible gratuitamente en formato web y PDF.
    - [Serious Cryptography, 2nd Edition by Jean-Philippe Aumasson (≈ $50)](https://nostarch.com/serious-cryptography-2nd-edition)
        - Es una introducción práctica a la criptografía moderna, centrada en entender cómo funcionan realmente los algoritmos y sistemas criptográficos utilizados en la práctica.

### Demos

- Demo del cifrado César
    - [demos/demo_cesar.py](demos/demo_cesar.py)

- Demo del cifrado Vigenère
    - [demos/demo_vigenere.py](demos/demo_vigenere.py)
