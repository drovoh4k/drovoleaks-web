---
title: "Python Bytecode"
date: 2026-04-02
categoria: "Reversing"
descripcion: "Reto de reversing: un módulo .pyc de Python 3.13 que se descompila con PyLingual e invierte su función de scramble para recuperar la clave."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
lenguaje: "Python"
tags: ["Reversing", "Python", "Hack4u CTF"]
video: "https://youtu.be/tOOPi4g2JfI"
draft: false
resumen: |
  Un reto de reversing muy sencillo sobre bytecode de Python compilado (`.pyc`), pensado para practicar la descompilación.

  En el vídeo veremos:
  - **Descompilar un `.pyc` de Python 3.13**: por qué herramientas clásicas como pycdc fallan y cómo PyLingual sí lo descompila.
  - **La lógica de validación**: la contraseña se pasa por una función de "scramble" y se compara con un valor esperado, como si fuera un hash.
  - **Invertir el algoritmo**: escribimos la función inversa (`chr` en vez de `ord`, con la operación contraria) y la aplicamos al valor esperado para recuperar la flag.
recursos:
  - label: "Descargar challenge"
    file: "challenge/PythonBytecode.zip"
permalink: "/writeups/ctfs/hack4u-ctf/reversing/python-bytecode/"
---
### Scripts

- [`scripts/unscramble.py`](scripts/unscramble.py)
    - Utilizado para resolver el reto.
