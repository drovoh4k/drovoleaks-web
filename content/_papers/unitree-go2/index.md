---
title: "Unitree Go2: los 10 pecados del perro robot"
date: 2026-06-24
descripcion: "10 fallos encadenables en el perro robot Unitree Go2: de una clave AES hardcodeada y un SSH con clave 123 a volcar el firmware por USB."
arxiv: "2512.06387"
tags: ["IoT", "BLE", "Android", "Hardware", "Reversing"]
video: "https://youtu.be/9US--L_1xDo"
draft: false
resumen: |
  Primera auditoría de seguridad completa del perro robot **Unitree Go2**. Mediante ingeniería inversa del APK, sniffing BLE y sondeo de hardware, los investigadores encadenan **10 fallos** que permiten secuestrar el robot y tomar el control físico total, incluso desde la otra punta del mundo.

  Algunos de los más graves:
  - **Clave AES hardcodeada**: idéntica en todas las unidades.
  - **SSH con contraseña `123`**: acceso directo al sistema.
  - **TLS que acepta cualquier certificado**: interceptar las comunicaciones se vuelve trivial.
  - **Relay local sin autenticación**: control sin credenciales dentro de la red.
  - **Firmware volcable por USB**: extracción completa del firmware con acceso físico.

  Y lo interesante no es lo sofisticados que son los fallos, sino lo simples: los más graves solo pedían abrir el código y mirar.
permalink: "/papers/unitree-go2/"
---
