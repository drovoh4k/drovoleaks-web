---
title: "Hidden Key"
date: 2026-04-14
categoria: "Criptografía"
descripcion: "Reto de crypto: la clave está escondida en los metadatos EXIF de una imagen y descifra un fichero con AES-CBC."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
lenguaje: "Python"
tags: ["Criptografía", "Python", "Hack4u CTF"]
video: "https://youtu.be/8-Qblzk4Yis"
draft: false
resumen: |
  Un reto de crypto donde la clave está escondida a plena vista: en los metadatos de una imagen.

  En el vídeo veremos:
  - **La clave oculta**: cómo `exiftool` revela un comentario EXIF con la clave secreta.
  - **Identificar el cifrado**: el fichero cifrado empieza por un `IV`, señal de AES en modo CBC.
  - **Un repaso a AES**: sus modos de operación (ECB, CBC, CTR, GCM) y las rondas del cifrado (SubBytes, ShiftRows, MixColumns, AddRoundKey).
  - **El descifrado**: juntamos clave e IV en CyberChef y sacamos la flag con AES-CBC.
recursos:
  - label: "Descargar challenge"
    file: "challenge/Hidden_Key.zip"
permalink: "/writeups/ctfs/hack4u-ctf/crypto/hidden-key/"
---
### Enlaces

- **Cifrado AES**
    - [Wikipedia: Cifrado AES](https://es.wikipedia.org/wiki/Advanced_Encryption_Standard)
        - Estándar de cifrado simétrico ampliamente utilizado para proteger datos mediante bloques y claves de longitud definida; destaca por su seguridad, eficiencia y uso extendido en sistemas modernos.

- **Herramientas**
    - [Exiftool](https://exiftool.org)
        - Herramienta muy completa para leer, editar y escribir metadatos en archivos como imágenes, audio, vídeo o documentos; es especialmente útil para analizar información EXIF, IPTC y XMP.

    - [CyberChef](https://gchq.github.io/CyberChef)
        - Herramienta web que permite convertir, analizar y manipular datos (como texto, cifrados o codificaciones) de forma sencilla sin necesidad de programar.

### Documentos
- [diagrama_clase.excalidraw](resources/diagrama_clase.excalidraw)
