---
title: "Introducción a MIPS"
date: 2026-02-12
categoria: "Reversing"
descripcion: "Esta clase es una base sólida de MIPS orientada a reversing."
nivel: "Principiante"
duracion: "52 min"
tags: ["MIPS", "Assembly", "Reversing"]
video: "https://youtu.be/o9_JzxD1X1o"
draft: false
resumen: |
  Una base sólida de MIPS orientada a reversing. El contexto lo justifica: muchos dispositivos IoT, routers y firmwares usan esta arquitectura, así que analizando binarios embebidos acabarás enfrentándote a ella.

  En esta clase veremos:
  - **Filosofía RISC**: simplicidad, instrucciones de longitud fija y un diseño pensado para la eficiencia y el pipeline.
  - **Arquitectura y registros**: los segmentos de datos y de código y el modelo de registros, clave para entender funciones reales.
  - **Entorno práctico**: compilar (big/little endian), ejecutar con QEMU y debuggear con GDB para tener tu propio laboratorio.
  - **Instrucciones esenciales**: movimiento, aritmética y lógica, saltos (incluido el delay slot) y syscalls.
recursos:
  - label: "CheatSheet MIPS32 (PDF)"
    file: "resources/documentos/CheatSheet_InstructionSet_MIPS32.pdf"
permalink: "/masterclass/introduccion-mips/"
---
### Enlaces

- **Instruction set**
    - [MIPS32 Architecture For Programmers Volume II: The MIPS32 Instruction Set](https://www.cs.cornell.edu/courses/cs3410/2008fa/MIPS_Vol2.pdf)
        - Documentación oficial para consultar las instrucciones assembly de la arquitectura MIPS.
    - [Training basic MIPS: Instruction Set](https://training.mips.com/basic_mips/PDF/Instruction_Set.pdf)
        - Documento de formación básica de MIPS donde habla del instruction set.

- **Syscalls**
    - [W3challs: Syscalls MIPS o32](https://syscalls.w3challs.com/?arch=mips_o32)
        - Referencia rápida para consultar las llamadas de sistema.

### Documentos

- [diagrama_clase.excalidraw](resources/material_clase/diagrama_clase.excalidraw)

    - **Arquitectura**
    <p align="center">
        <img src="resources/material_clase/imgs/arquitectura.png" alt="Arquitectura" width="600" />
    </p>

    - **RISC vs CISC**
    <p align="center">
        <img src="resources/material_clase/imgs/RISC_vs_CISC.png" alt="RISC VS CISC" width="600" />
    </p>

    - **Registros**
    <p align="center">
        <img src="resources/material_clase/imgs/registros.png" alt="Registros" width="600" />
    </p>

    - **Instrucciones de movimiento**
    <p align="center">
        <img src="resources/material_clase/imgs/instrucciones_Movimiento.png" alt="Instrucciones de movimiento" width="450" />
    </p>

    - **Instrucciones aritméticas / lógicas**
    <p align="center">
        <img src="resources/material_clase/imgs/instrucciones_Arith.png" alt="Instrucciones aritméticas / lógicas" width="450" />
    </p>

    - **Instrucciones de control de flujo**
    <p align="center">
        <img src="resources/material_clase/imgs/instrucciones_ControlFlujo.png" alt="Instrucciones de control de flujo" width="700" />
    </p>

    - **Syscalls**
    <p align="center">
        <img src="resources/material_clase/imgs/syscall.png" alt="System Calls" width="500" />
    </p>

### Snippets

- Instalar herramientas compilación / ejecución / debug
    ```
    sudo apt install gcc-mips-linux-gnu gcc-mipsel-linux-gnu
    sudo apt install qemu-system-mips qemu-user-static
    sudo apt install gdb-multiarch
    ```

- Compilar y ejecutar manualmente
    - Big endian
        ```
        mips-linux-gnu-as demo.s -o demo.o
        mips-linux-gnu-ld demo.o -o demo
        ```
        ```
        chmod +x demo
        qemu-mips ./demo
        ```
    - Little endian
        ```
        mipsel-linux-gnu-as demo.s -o demo.o
        mipsel-linux-gnu-ld demo.o -o demo
        ```
        ```
        chmod +x demo
        qemu-mipsel ./demo
        ```

- Debugear binario
    ```
    qemu-mips -g 1234 ./demo
    ```
    ```
    pwndbg demo
    set show-compact-regs on
    target remote :1234
    ```

### Demos

- Makefile para compilación
    - [demos/Makefile](resources/demos/Makefile)

- Demo inicial para aprender a compilar y ejecutar
    - [demos/hello_world.s](resources/demos/hello_world.s)

- Demos sobre categorías de instrucciones
    - [demos/movement.s](resources/demos/movement.s)
    - [demos/arith.s](resources/demos/arith.s)
    - [demos/flow.s](resources/demos/flow.s)
    - [demos/syscalls.s](resources/demos/syscalls.s)
