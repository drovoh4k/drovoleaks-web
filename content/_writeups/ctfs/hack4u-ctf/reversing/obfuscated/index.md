---
title: "Obfuscated"
date: 2026-04-02
categoria: "Reversing"
descripcion: "Reto de reversing: un binario con anti-debugging (ptrace + SIGTRAP) que se saltan modificando RIP en GDB para leer la flag directamente de la comparación."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
arquitectura: "x86-64"
plataforma: "Unix/Linux"
lenguaje: "C/C++"
tags: ["Reversing", "x86-64", "C/C++", "Hack4u CTF"]
video: "https://youtu.be/WHkIqbRcsKw"
draft: false
resumen: |
  Un reto de reversing con un par de trampas anti-debugging que hay que sortear para llegar a la flag.

  En el vídeo veremos:
  - **El anti-debugging**: detecta el debugger de dos formas — `ptrace(PTRACE_TRACEME)` y un handler de la señal `SIGTRAP` que salta al poner un breakpoint.
  - **Saltar la protección**: en vez de parchear, modificamos `RIP` en tiempo de ejecución con GDB para esquivar la rama de "debugger detected".
  - **Ignorar el código ofuscado**: en lugar de analizar la función de validación, ponemos un breakpoint en la comparación final.
  - **Leer la flag**: la comparación revela la clave esperada directamente en los registros.
recursos:
  - label: "Descargar challenge"
    file: "challenge/Obfuscated.zip"
permalink: "/writeups/ctfs/hack4u-ctf/reversing/obfuscated/"
---


