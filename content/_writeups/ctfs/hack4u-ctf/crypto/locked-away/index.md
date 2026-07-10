---
title: "Locked Away"
date: 2026-04-15
categoria: "Criptografía"
descripcion: "Reto de crypto sencillo: un ZIP cuya contraseña se obtiene derivando (MD5) la semilla que viene en un fichero aparte."
subtipo: "ctf"
fuente: "Hack4u CTF"
evento: "Hack4u CTF"
evento_orden: 2
dificultad: "Muy Fácil"
tags: ["Criptografía", "Hack4u CTF"]
video: "https://youtu.be/msB9mbDzYkY"
draft: false
resumen: |
  Un reto de crypto muy sencillo: un ZIP protegido y una semilla suelta que, por sí sola, no abre el archivo.

  En el vídeo veremos:
  - **Key derivation**: la contraseña del ZIP no es la semilla directamente, sino un hash de ella.
  - **La solución**: aplicamos MD5 a la semilla y con ese resultado descomprimimos el ZIP para leer la flag.
recursos:
  - label: "Descargar challenge"
    file: "challenge/Locked_Away.zip"
permalink: "/writeups/ctfs/hack4u-ctf/crypto/locked-away/"
---
### Enlaces

- **Hashing**
    - [Wikipedia: MD5](https://es.wikipedia.org/wiki/MD5)
        - Función hash criptográfica que genera un resumen de 128 bits a partir de datos de entrada; fue muy usada para verificar integridad, pero hoy se considera insegura frente a colisiones y no se recomienda para fines criptográficos.

- **Derivación de claves**
    - [Wikipedia: Key derivation Function](https://en.wikipedia.org/wiki/Key_derivation_function)
        - Función criptográfica utilizada para derivar una o varias claves secretas a partir de una contraseña, clave maestra u otro secreto compartido; mejora la seguridad al endurecer contraseñas y separar el uso de claves en distintos contextos.
