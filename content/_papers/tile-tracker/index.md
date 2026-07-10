---
title: "Tile: el rastreador que te rastrea a ti"
date: 2026-07-02
descripcion: "Primer análisis del protocolo de los rastreadores Tile: rastreo por Bluetooth, una clave que nunca cambia y un modo antiacoso roto a propósito."
arxiv: "2510.00350"
tags: ["Privacidad", "BLE", "Tracking", "Android"]
video: "https://youtu.be/xn99qfm9Wak"
draft: false
resumen: |
  Primer análisis de seguridad exhaustivo del protocolo de los rastreadores **Tile**. Mediante ingeniería inversa de la app Android, los autores demuestran que el sistema incumple buena parte de las garantías que promete.

  Los hallazgos principales:
  - **Vigilancia permanente**: los servidores de Tile pueden conocer en todo momento la ubicación de todos los usuarios y sus tags.
  - **Rastreo por cualquiera**: un adversario sin privilegios puede seguir a una persona por sus anuncios Bluetooth.
  - **Antirrobo roto**: el modo *Anti-Theft* y su mecanismo de "responsabilidad" se pueden subvertir con facilidad.

  El resultado: el mismo aparato que sirve para encontrar tus llaves sirve, exactamente igual, para encontrarte a ti.
permalink: "/papers/tile-tracker/"
---
