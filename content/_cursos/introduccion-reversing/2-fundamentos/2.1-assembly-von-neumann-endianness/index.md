---
title: "Assembly, Von Neumann y Endianness"
date: 2026-01-26
categoria: "Reversing"
descripcion: "En esta clase construimos la base mínima para que cuando empieces a desensamblar no sientas que estás leyendo \"jeroglíficos\": entenderás qué es Assembly, por qué cada CPU tiene el suyo, el modelo m…"
curso: "Introducción al Reversing"
curso_slug: "introduccion-reversing"
modulo: "2 · Fundamentos"
orden: 201
duracion: "33 min"
tags: ["Reversing"]
video: "https://youtu.be/dd5_Q4qnBaY?list=PLKYfwBIKMkXfVvUFICiRm-qYUkprfUAL0"
draft: false
resumen: |
  La base mínima para que, cuando empieces a desensamblar, no sientas que estás leyendo "jeroglíficos".

  En esta clase veremos:
  - **Qué es Assembly**: qué es realmente el lenguaje ensamblador y por qué cada CPU tiene el suyo.
  - **El modelo Von Neumann**: el modelo mental de CPU/RAM sobre el que se ejecuta todo el código.
  - **Endianness**: little vs big endian, con una demo práctica para verlo en memoria.
permalink: "/cursos/introduccion-reversing/2-fundamentos/2.1-assembly-von-neumann-endianness/"
---
### Enlaces

- **Manuales de arquitectura**
    - [Intel® 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html)
    - [AVR® Instruction Set Manual](https://ww1.microchip.com/downloads/en/devicedoc/AVR-Instruction-Set-Manual-DS40002198A.pdf)
    - [V850ES/SJ3 User's Manual](https://www.renesas.com/en/products/v850es-sj3)

- **ISA y assembly**
    - [CPU Simulator](https://cpuvisualsimulator.github.io)
    - [Stack Overflow: Are instruction set and assembly language the same thing?](https://stackoverflow.com/questions/5382130/are-instruction-set-and-assembly-language-the-same-thing)

- **Endianness**
    - [GeeksForGeeks: What is Endianness? Big-Endian & Little-Endian](https://www.geeksforgeeks.org/dsa/little-and-big-endian-mystery)

- **Compilación**
    - [Compiling a C Program: Behind the Scenes](https://www.geeksforgeeks.org/c/compiling-a-c-program-behind-the-scenes)

### Documentos

- [diagrama_clase.excalidraw](resources/diagrama_clase.excalidraw)

    - **Modelo de Von Neumann**
    <p align="center">
        <img src="resources/modelo_VonNeumann.png" alt="Modelo de Von Neumann" width="350" />
    </p>

    - **Organización de la memoria**
    <p align="center">
        <img src="resources/organizacion_memoria.png" alt="Organización de la memoria" width="350" />
    </p>

    - **Endianness**
    <p align="center">
        <img src="resources/endianness.png" alt="Endianness" width="350" />
    </p>

### Snippets

- Script para demo de ISA (`demo_isa.c`)
    - Código
        ```c
        #include <stdint.h>

        __attribute__((noinline))
        uint32_t add32(uint32_t a, uint32_t b) {
            return a + b;
        }
        ```
    - Compilación
        ```sh
        gcc -m64 -O2 -S -masm=intel demo_isa.c -o demo_x86_64.s
        ```
        ```sh
        avr-gcc -mmcu=atmega328p -Os -S demo_isa.c -o demo_avr.s
        ```

- Script para demo endianness (`demo_endian.c`)
    - Código
        ```c
        #include <stdio.h>
        #include <stdint.h>

        int main() {
            uint32_t x = 0x12345678;
            unsigned char *p = (unsigned char*)&x;

            for (int i = 0; i < 4; i++) {
                printf("%02x ", p[i]);
            }
            puts("");
            return 0;
        }
        ```

    - Compilación
        ```sh
        gcc -O0 demo_endian.c -o demo_endian
        ```
