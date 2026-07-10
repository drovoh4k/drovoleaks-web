---
title: "Maze Runner"
date: 2026-04-02
categoria: "Reversing"
descripcion: "Reto de reversing: un laberinto 10x10 escondido en el binario; se extrae el mapa, se busca un camino válido y se introduce la secuencia de movimientos."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
arquitectura: "x86-64"
plataforma: "Unix/Linux"
lenguaje: "C/C++"
tags: ["Reversing", "x86-64", "C/C++", "Hack4u CTF"]
video: "https://youtu.be/jUN0V_yDWVQ"
draft: false
resumen: |
  Un reto de reversing entretenido: dentro del binario se esconde un laberinto de 10x10 que hay que recorrer de la entrada a la salida.

  En el vídeo veremos:
  - **La lógica del laberinto**: cómo el input (U/D/L/R) mueve unas coordenadas y cada casilla se valida con un XOR (`0xA3` = camino, `0xA2` = muro).
  - **Extraer el mapa**: volcamos los bytes del laberinto desde el binario.
  - **Visualizarlo y resolverlo**: con un pequeño script (pygame) pintamos el laberinto y trazamos un camino válido de (0,0) a (9,9).
  - **La secuencia ganadora**: convertimos ese camino en la cadena de movimientos que suelta la flag.
recursos:
  - label: "Descargar challenge"
    file: "challenge/MazeRunner.zip"
permalink: "/writeups/ctfs/hack4u-ctf/reversing/maze-runner/"
---
### Scripts

- [`scripts/view_maze.py`](scripts/view_maze.py)
    - Utilizado para resolver el reto.
