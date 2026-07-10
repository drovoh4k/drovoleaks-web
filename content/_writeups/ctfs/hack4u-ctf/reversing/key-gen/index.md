---
title: "KeyGen"
date: 2026-04-02
categoria: "Reversing"
descripcion: "Reto de reversing tipo keygen: un serial con cuatro grupos hex ligados por operaciones (XOR, suma, rotación); se invierten las condiciones para generar seriales válidos."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
arquitectura: "x86-64"
plataforma: "Unix/Linux"
lenguaje: "C/C++"
tags: ["Reversing", "x86-64", "C/C++", "Hack4u CTF"]
video: "https://youtu.be/52DClDmOvbA"
draft: false
resumen: |
  Un reto de reversing de tipo keygen: hay que entender cómo se valida un serial y escribir un generador que produzca claves válidas.

  En el vídeo veremos:
  - **El formato del serial**: cuatro grupos de 4 dígitos hex separados por guiones (`XXXX-XXXX-XXXX-XXXX`).
  - **Las condiciones que ligan los grupos**: `K2 = K1 ^ 0xDE`, `K3 + K2 = 0x1337`, `K4` es `K3` rotado, y un bit concreto de `K1` debe estar activo.
  - **El keygen**: fijado `K1` por fuerza bruta, derivamos el resto de grupos y generamos tantos seriales válidos como queramos con pwntools.
recursos:
  - label: "Descargar challenge"
    file: "challenge/KeyGen.zip"
permalink: "/writeups/ctfs/hack4u-ctf/reversing/key-gen/"
---
### Scripts

- [`scripts/keygen.py`](scripts/keygen.py)
    - Utilizado para resolver el reto.
