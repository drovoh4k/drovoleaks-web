---
title: "Caesar Reloaded"
date: 2026-04-09
categoria: "Criptografía"
descripcion: "Reto de crypto de calentamiento: un cifrado César que se rompe por fuerza bruta de rotaciones con CyberChef."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
lenguaje: "Python"
tags: ["Criptografía", "Python", "Hack4u CTF"]
video: "https://youtu.be/-BHfRB1pNaQ"
draft: false
resumen: |
  Un reto de crypto de calentamiento: un cifrado César, el clásico desplazamiento de letras del abecedario.

  En el vídeo veremos:
  - **Qué es el cifrado César**: cómo cada letra se desplaza un número fijo de posiciones.
  - **La solución**: fuerza bruta de las rotaciones en CyberChef, filtrando por el prefijo `Hack4u`, hasta dar con el desplazamiento correcto (19).
recursos:
  - label: "Descargar challenge"
    file: "challenge/CaesarReloaded.zip"
permalink: "/writeups/ctfs/hack4u-ctf/crypto/caesar-reloaded/"
---
### Enlaces

- **Cifrado César**
    - [Wikipedia: Cifrado César](https://en.wikipedia.org/wiki/Caesar_cipher)
        - Cifrado por sustitución donde cada letra se desplaza un número fijo de posiciones en el alfabeto.
    - [CesarCipher.org: Caesar Cipher Tutorial -  Complete Beginner's Guide with Examples](https://caesarcipher.org/learn/caesar-cipher-tutorial-complete-beginners-guide-with-examples)
        - Tutorial completo del cifrado César con ejemplos, implementación y explicación de por qué es vulnerable a fuerza bruta.

- **Herramientas**
    - [CyberChef](https://gchq.github.io/CyberChef)
        - Herramienta web que permite convertir, analizar y manipular datos (como texto, cifrados o codificaciones) de forma sencilla sin necesidad de programar.
