---
title: "Matryoshka"
date: 2026-05-23
categoria: "Reversing"
descripcion: "Crackme que anida binarios: cada capa descifra con XOR un ELF nuevo y lo ejecuta en memoria, hasta llegar al binario final."
subtipo: "crackme"
fuente: "crackmes.one"
dificultad: "Media"
arquitectura: "x86-64"
plataforma: "Unix/Linux"
lenguaje: "C/C++"
tags: ["Reversing", "x86-64", "C/C++", "crackmes.one"]
video: "https://youtu.be/hzmK41pv35E"
draft: false
resumen: |
  Matryoshka es un crackme de Linux que esconde un binario dentro de otro, como las muñecas rusas que le dan nombre: cada capa descifra y ejecuta la siguiente.

  En el vídeo veremos:
  - **El mecanismo de anidamiento**: cada nivel descifra con XOR un ELF embebido, lo crea como fichero anónimo en memoria (`memfd_create`) y lo ejecuta como hijo con `execve`.
  - **La clave de cada capa**: cómo se deriva del argumento que le pasas (un byte al que se le resta `0x57`).
  - **Extracción dinámica**: en vez de reimplementar cada descifrado, volcamos el binario ya descifrado desde memoria con un script de GDB (breakpoint + dump).
  - **Las tres capas**: avanzamos nivel a nivel con IDA, pwndbg y CyberChef hasta el binario final.
recursos:
  - label: "Reto original"
    url: "https://crackmes.one/crackme/68ff42b82d267f28f69b78c8"
  - label: "Descargar challenge"
    file: "challenge/Matryoshka.zip"
    pass: "crackmes.one"
permalink: "/writeups/crackmes/crackmes.one/matryoshka/"
---
### Enlaces

- **Assembly**
    - [FelixCloutier: x86 and amd64 instruction reference](https://www.felixcloutier.com/x86)
        - Referencia rápida para consultar instrucciones assembly durante el desensamblado. Suficiente para resolver crackmes; para trabajo serio, consultar el manual oficial [Intel® 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).

- **Ficheros / streams**
    - Syscall [`memfd_create`](https://man7.org/linux/man-pages/man2/memfd_create.2.html) (`man 2 memfd_create`)
        - Crea un fichero anónimo en memoria y devuelve un file descriptor asociado. Útil para trabajar con un "fichero" temporal sin escribirlo en disco.

    - Función [`ftruncate`](https://man7.org/linux/man-pages/man3/ftruncate.3p.html) (`man 3 ftruncate`)
        - Cambia el tamaño de un fichero asociado a un file descriptor. Aquí se usa para ajustar el tamaño del fichero creado con `memfd_create`.

    - Función [`fdopen`](https://man7.org/linux/man-pages/man3/fdopen.3p.html) (`man 3 fdopen`)
        - Asocia un `FILE*` de la libc a un file descriptor ya existente. Permite usar funciones de alto nivel como `fwrite`, `fgets` o `fprintf` sobre un descriptor abierto previamente.

    - Función [`fileno`](https://man7.org/linux/man-pages/man3/fileno.3.html) (`man 3 fileno`)
        - Devuelve el file descriptor asociado a un stream `FILE*`. Es la operación inversa práctica de `fdopen`.

    - Función [`fwrite`](https://man7.org/linux/man-pages/man3/fwrite.3p.html) (`man 3 fwrite`)
        - Escribe datos binarios desde un buffer en un stream `FILE*`. Útil para escribir una cantidad concreta de bytes, no necesariamente una cadena terminada en `\0`.

    - Función [`rewind`](https://man7.org/linux/man-pages/man3/rewind.3p.html) (`man 3 rewind`)
        - Coloca el indicador de posición de un stream al principio del fichero. Equivale a volver al offset inicial del stream.

- **Cadenas / formateo**
    - Función [`sprintf`](https://man7.org/linux/man-pages/man3/sprintf.3p.html) (`man 3 sprintf`)
        - Escribe texto formateado en un buffer en memoria. Funciona como `printf`, pero guarda el resultado en una cadena en lugar de imprimirlo por `stdout`.

- **Ejecución de programas**
    - Función [`execve`](https://man7.org/linux/man-pages/man3/exec.3.html) (`man 3 execve`)
        - Ejecuta un programa reemplazando la imagen del proceso actual mediante la familia `exec` (`execl`, `execle`, `execlp`, `execv`, `execvp`, `execvpe`). Relevante en explotación porque permite lanzar binarios o shells desde un proceso controlado.

- **GDB scripting**
    - [GDB Documentation: Command Files](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Command-Files.html)
        - Documentación oficial sobre scripts clásicos de GDB basados en comandos: automatizar breakpoints, ejecutar comandos al iniciar, examinar memoria o lanzar el programa con argumentos.

    - [GDB Documentation: Extending GDB using Python](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Python.html)
        - Documentación oficial sobre el uso de Python dentro de GDB: crear comandos personalizados, automatizar debugging y extender el comportamiento de GDB con scripts más complejos.

    - [GDB Documentation: Python API](https://sourceware.org/gdb/current/onlinedocs/gdb.html/Python-API.html)
        - Referencia de la API de Python expuesta por GDB. Útil para scripts avanzados que interactúen con registros, memoria, símbolos, breakpoints o el estado del programa debuggeado.

### Scripts

- [`scripts/extractor.gdb`](scripts/extractor.gdb)
    - Script que automatiza la extracción de la key y el dumpeo del proceso hijo. Ejecutar con:
        ```
        gdb -x extractor.gdb ./matryoshka
        ```
