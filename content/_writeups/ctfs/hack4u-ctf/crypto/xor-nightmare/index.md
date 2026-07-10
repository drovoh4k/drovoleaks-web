---
title: "XOR Nightmare"
date: 2026-04-12
categoria: "Criptografía"
descripcion: "Reto de crypto: un cifrado XOR de clave repetida que se rompe con un ataque de texto conocido a partir del prefijo de la flag."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
lenguaje: "Python"
tags: ["Criptografía", "Python", "Hack4u CTF"]
video: "https://youtu.be/9PFDm5aM_sU"
draft: false
resumen: |
  Un reto de crypto que enseña por qué un XOR con clave repetida no es cifrado de verdad.

  En el vídeo veremos:
  - **El XOR de clave repetida**: cómo la clave se repite a lo largo del texto, dejando patrones.
  - **El ataque de texto conocido**: como todas las flags empiezan por `Hack4u`, hacemos XOR de esos bytes contra el cifrado para recuperar la clave.
  - **El descifrado**: con la clave ya recuperada, deshacemos el XOR en CyberChef y obtenemos la flag.
recursos:
  - label: "Descargar challenge"
    file: "challenge/XOR_Nightmare.zip"
permalink: "/writeups/ctfs/hack4u-ctf/crypto/xor-nightmare/"
---
### Enlaces

- **Cifrado XOR**
    - [Wikipedia: Cifrado XOR](https://es.wikipedia.org/wiki/Cifrado_XOR)
        - Método de cifrado que aplica la operación XOR entre los datos y una clave; es simple y rápido, aunque su seguridad depende por completo de cómo se utilice la clave.

- **Herramientas**
    - [CyberChef](https://gchq.github.io/CyberChef)
        - Herramienta web que permite convertir, analizar y manipular datos (como texto, cifrados o codificaciones) de forma sencilla sin necesidad de programar.

### Scripts

- [`scripts/solve.py`](scripts/solve.py)
    - Utilizado para resolver el reto.
