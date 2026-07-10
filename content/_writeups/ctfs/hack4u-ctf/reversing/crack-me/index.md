---
title: "CrackMe"
date: 2026-04-02
categoria: "Reversing"
descripcion: "Reto de reversing muy sencillo: la contraseña se compara con strcmp contra un valor hardcodeado, revelable con ltrace, parcheo o un breakpoint."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
arquitectura: "x86-64"
plataforma: "Unix/Linux"
lenguaje: "C/C++"
tags: ["Reversing", "x86-64", "C/C++", "Hack4u CTF"]
video: "https://youtu.be/FF4Oo5t6DtE"
draft: false
resumen: |
  El reto de reversing más sencillo de la CTF, ideal para empezar: un crackme que compara tu contraseña con una cadena fija.

  En el vídeo veremos tres formas de resolverlo:
  - **Con `ltrace`**: el trazado de librerías muestra el `strcmp` comparando tu input con la contraseña real.
  - **Parcheando el binario**: invertir el salto condicional en IDA para que acepte cualquier entrada.
  - **Con un breakpoint**: parar en el `strcmp` en GDB y leer directamente la contraseña esperada.
recursos:
  - label: "Descargar challenge"
    file: "challenge/CrackMe.zip"
permalink: "/writeups/ctfs/hack4u-ctf/reversing/crack-me/"
---


