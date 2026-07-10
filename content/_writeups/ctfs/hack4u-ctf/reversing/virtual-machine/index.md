---
title: "Virtual Machine"
date: 2026-04-02
categoria: "Reversing"
descripcion: "Reto de reversing: una máquina virtual a medida que valida la clave ejecutando su propio bytecode; se escribe un desensamblador para recuperarla."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Fácil"
arquitectura: "x86-64"
plataforma: "Unix/Linux"
lenguaje: "C/C++"
tags: ["Reversing", "x86-64", "C/C++", "Hack4u CTF"]
video: "https://youtu.be/oBf4T2T_8GI"
draft: false
resumen: |
  El reto de reversing más completo de la CTF: un binario que implementa su propia máquina virtual y valida la clave ejecutando bytecode.

  En el vídeo veremos:
  - **Identificar la VM**: el binario imprime su bytecode y un set de instrucciones (load, xor, cmp, jne, input, halt) con sus opcodes.
  - **Escribir un desensamblador**: un parser en Python que traduce los bytes a instrucciones legibles.
  - **Encontrar el patrón**: cada byte de la clave se compara tras un XOR con `0xAA` (170), y ese patrón se repite.
  - **Recuperar la clave**: deshacemos el XOR sobre cada valor cargado para reconstruir la flag.
recursos:
  - label: "Descargar challenge"
    file: "challenge/VirtualMachine.zip"
permalink: "/writeups/ctfs/hack4u-ctf/reversing/virtual-machine/"
---
### Scripts

- [`scripts/parser.py`](scripts/parser.py)
    - Utilizado para resolver el reto.
