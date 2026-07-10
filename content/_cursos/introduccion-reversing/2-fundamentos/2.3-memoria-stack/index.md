---
title: "Memoria y Stack"
date: 2026-03-04
categoria: "Reversing"
descripcion: "En esta clase exploramos cómo funciona realmente la memoria de un proceso, revisando la memoria virtual, el memory layout y el funcionamiento del stack, incluyendo stack frames y calling convention…"
curso: "Introducción al Reversing"
curso_slug: "introduccion-reversing"
modulo: "2 · Fundamentos"
orden: 203
duracion: "54 min"
tags: ["Reversing"]
video: "https://youtu.be/ymEry_MtvqY?list=PLKYfwBIKMkXfVvUFICiRm-qYUkprfUAL0"
draft: false
resumen: |
  Cómo funciona realmente la memoria de un proceso, la pieza que sostiene todo lo que verás al desensamblar.

  En esta clase veremos:
  - **Memoria virtual**: cómo el sistema le da a cada proceso su propio espacio de direcciones.
  - **Memory layout**: cómo se organizan las regiones de memoria de un proceso (code, data, heap, stack...).
  - **El stack**: su funcionamiento, los stack frames y las calling conventions (cdecl) que estructuran cada función.
permalink: "/cursos/introduccion-reversing/2-fundamentos/2.3-memoria-stack/"
---
### Enlaces

- **Virtual Memory vs Physical Memory**
    - [GeeksForGeeks: Virtual Memory in Operating System](https://www.geeksforgeeks.org/operating-systems/virtual-memory-in-operating-system)
        - Explica qué es la memoria virtual y cómo el sistema operativo crea un espacio de direcciones independiente para cada proceso.
        - Ayuda a entender por qué las direcciones que vemos en reversing no corresponden directamente con la RAM física.
    - [OsDev: Paging](https://wiki.osdev.org/Paging)
        - Describe el mecanismo de paginación que permite traducir direcciones virtuales a direcciones físicas mediante páginas de memoria.
        - Es útil para entender cómo el hardware y el sistema operativo implementan la memoria virtual.
    - [OsDev: Page Tables](https://wiki.osdev.org/Page_Tables)
        - Explica cómo funcionan las tablas de páginas, las estructuras que almacenan el mapeo entre memoria virtual y memoria física.
        - También muestra cómo se gestionan permisos de memoria y aislamiento entre procesos.
    - [GeeksForGeeks: Segmentation](https://www.geeksforgeeks.org/operating-systems/segmentation-in-operating-system)
        - Introduce el modelo de segmentación de memoria usado históricamente en arquitecturas x86.
        - Ayuda a comprender cómo se dividía la memoria en regiones lógicas antes del uso generalizado de la paginación.

- **Memory Layout**
    - [GeeksForGeeks: Memory Layout of C Programs](https://www.geeksforgeeks.org/c/memory-layout-of-c-program)
        - Describe cómo se organiza la memoria de un programa en ejecución en secciones como `.text`, `.data`, `.bss`, heap y stack.
        - Este modelo ayuda a visualizar dónde viven el código, las variables y las estructuras dinámicas durante la ejecución.

- **El stack**
    - [GeeksForGeeks: Stack Data Structure](https://www.geeksforgeeks.org/dsa/stack-data-structure)
        - Explica la estructura de datos stack y el modelo LIFO (Last In First Out). 
        - Este concepto es la base para entender cómo funciona el stack de un programa a nivel de ejecución.
    - [GeeksForGeeks: Stack Frame in Computer Organization](https://www.geeksforgeeks.org/computer-organization-architecture/stack-frame-in-computer-organization)
        - Describe qué es un stack frame y cómo cada llamada a función crea su propia estructura dentro del stack.
        - Esto permite organizar variables locales, direcciones de retorno y el estado de ejecución.

- **Calling convention**
    - [GeekForGeek: Calling Conventions in C/C++](https://www.geeksforgeeks.org/cpp/calling-conventions-in-c-cpp)
        - Explica las reglas que definen cómo se pasan argumentos, cómo se devuelve un valor y cómo se gestiona el stack durante una llamada a función.
        - Estas convenciones permiten que funciones compiladas por distintos módulos o compiladores puedan interactuar correctamente.

### Documentos

- [diagrama_clase.excalidraw](resources/diagrama_clase.excalidraw)

    - **Repaso**
    <p align="center">
        <img src="resources/0-intro/hasta_ahora.png" alt="Hasta ahora" width="300" />
    </p>

    - **Espacio de direcciones virtual**
    <p align="center">
        <img src="resources/1-virtual-address-space/virtual_address_space.png" alt="Virtual Address Space" width="600" />
    </p>

    - **Paginación y segmentación**
    <p align="center">
        <img src="resources/1-virtual-address-space/paginacion.png" alt="Paginación" width="250" />
        <img src="resources/1-virtual-address-space/segmentacion.png" alt="Segmentación" width="296" />
    </p>

    - **Memory layout**
    <p align="center">
        <img src="resources/2-memory-layout/memory_layout.png" alt="Memory Layout" width="450" />
    </p>

    - **El stack**
    <p align="center">
        <img src="resources/3-stack/stack_estructura.png" alt="Stack: Estructura" width="200" />
        <img src="resources/3-stack/stack_representaciones.png" alt="Stack: Representaciones" width="350" />
    </p>

    - **Stack frame**
    <p align="center">
        <img src="resources/3-stack/stack_frame.png" alt="Stack: Frame" width="800" />
    </p>

    - **Calling convention**
    <p align="center">
        <img src="resources/4-calling-convention/calling_convention.png" alt="Calling Convention" width="600" />
    </p>

### Demos

- Demo sobre memoria y stack
    - Código
        - [demos/demo.c](demos/demo.c)
    - Compilación
        ```sh
        gcc -m32 -fno-pie -no-pie -O0 demo.c -o demo
        ```
