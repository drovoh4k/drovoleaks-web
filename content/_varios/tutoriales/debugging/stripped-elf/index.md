---
title: "Debuggear binarios stripped con GDB"
date: 2026-01-19
categoria: "Reversing"
descripcion: "¿Te ha pasado que haces el típico `breakpoint main` con GDB y un día, con \"un binario aparentemente normal\", te suelta un `Function not defined`?"
tema: "Debugging"
tags: ["Reversing", "Debugging"]
video: "https://youtu.be/aR6MLN2pR0g"
draft: false
resumen: |
  ¿Te ha pasado que haces el típico `breakpoint main` con GDB y un día, con "un binario aparentemente normal", te suelta un `Function not defined`? No es culpa tuya: lo más probable es que estés delante de un ELF stripped.

  En este vídeo veremos:
  - **Cómo identificarlo**: reconocer un ELF stripped sin ejecutarlo (`file`, `nm`, `readelf`).
  - **Qué cambia al strippear**: la `.symtab` desaparece; la `.dynsym` suele quedarse.
  - **3 formas de debuggearlo**:
      - Ir al Entry Point y reconocer el arranque hasta `__libc_start_main`.
      - Breakpoint pending en `__libc_start_main` y saltar a `main` vía RDI.
      - El workflow recomendado: IDA + base address para poner breakpoints por dirección rápidamente.
permalink: "/varios/tutoriales/debugging/stripped-elf/"
---
### Enlaces

- **Herramientas**
    - `man gdb`
        - Manual oficial de GDB: ejecución, breakpoints y control del debugging.
        - Útil para consultar sintaxis/opciones y qué se puede inspeccionar (registros, memoria, stack, etc.).
        - `pwndbg` es una capa de abstracción; la gran mayoría de comandos funcionan exactamente igual que en `gdb`.
    - `man nm`
        - Útil para ver símbolos del binario (cuando existen).
        - Te ayuda a confirmar rápidamente si un binario "tiene nombres" (como main) o si está stripped / no exporta lo que esperas.
    - `man readelf`
        - Permite inspeccionar la estructura interna de un ELF de manera estática.

- **`__libc_start_main`**
    - [Linux Standard Base Core Specification: __libc_start_main](https://refspecs.linuxbase.org/LSB_5.0.0/LSB-Core-generic/LSB-Core-generic/baselib---libc-start-main-.html)
        - Referencia "formal" (tipo especificación) sobre la función y su rol en el arranque
        - Buen recurso si quieres una explicación más normativa/estándar.
    - [Stackoverflow: What is __libc_start_main and _start?](https://stackoverflow.com/questions/62709030/what-is-libc-start-main-and-start)
        - Respuesta del foro Stackoverflow con una explicación más práctica

- **Entorno**
    - [Curso Introducción al Reversing GRATUITO - Clase 2: Montando el entorno](/cursos/introduccion-reversing/1-introduccion/1.2-montando-entorno/)
        - Si no tienes un entorno Linux listo, en esta clase te explico cómo tener tu entorno preparado, tanto un entorno Linux como uno Windows.

- **ELF**
    - [The 101 of ELF files on Linux: Understanding and Analysis](https://linux-audit.com/elf-binaries-on-linux-understanding-and-analysis)
        - Buen punto de partida para aprender/repasar secciones típicas, headers y el modelo mental de ELF.
        - Útil para comprender mejor las secciones `.symtab` y `.dynsym`.

### Snippets

- Compilación con símbolos
    ```
    gcc -O0 -g -fno-omit-frame-pointer -o demo demo.c
    ```

- Strip
    ```
    strip --strip-all demo -o demo_stripped
    ```

### Scripts

- [demo.c](resources/demo.c)
    - Código fuente utilizado durante el video.
