---
title: "RSA Weak"
date: 2026-04-11
categoria: "Criptografía"
descripcion: "Reto de crypto: un RSA con primos demasiado pequeños que se rompe factorizando el módulo n para reconstruir la clave privada."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
lenguaje: "Python"
tags: ["Criptografía", "Python", "Hack4u CTF"]
video: "https://youtu.be/9II3JaKqPdM"
draft: false
resumen: |
  Un reto de crypto que demuestra que RSA solo es tan fuerte como sus números: aquí, unos primos minúsculos lo condenan.

  En el vídeo veremos:
  - **Cómo funciona RSA**: claves pública y privada, y por qué su seguridad se apoya en lo difícil que es factorizar números grandes.
  - **El punto débil**: `n` es tan pequeño que se factoriza en un instante.
  - **Reconstruir la clave privada**: factorizamos `n` con `sympy`, calculamos φ y derivamos `d` con el inverso modular.
  - **El descifrado**: con `d` reconstruida, desciframos el mensaje y sacamos la flag.
recursos:
  - label: "Descargar challenge"
    file: "challenge/RSA_Weak.zip"
permalink: "/writeups/ctfs/hack4u-ctf/crypto/rsa-weak/"
---
### Enlaces

- **Cifrado RSA**
    - [Wikipedia: Cifrado RSA](https://es.wikipedia.org/wiki/RSA)
        - Cifrado de clave pública que utiliza una clave para cifrar y otra distinta para descifrar, basado en la dificultad de factorizar números grandes.

- **Herramientas**
    - [CyberChef](https://gchq.github.io/CyberChef)
        - Herramienta web que permite convertir, analizar y manipular datos (como texto, cifrados o codificaciones) de forma sencilla sin necesidad de programar.

### Documentos
- [diagrama_clase.excalidraw](resources/diagrama_clase.excalidraw)

### Scripts

- [`scripts/solve.py`](scripts/solve.py)
    - Utilizado para resolver el reto.
