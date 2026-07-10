---
title: "Binarios ELF"
date: 2026-04-07
categoria: "Reversing"
descripcion: "En esta clase exploramos qué son los binarios ELF, cómo están estructurados internamente (header, secciones y segmentos), cómo se cargan y mapean en memoria, cómo funciona el enlazado dinámico con…"
curso: "Introducción al Reversing"
curso_slug: "introduccion-reversing"
modulo: "3 · Linux"
orden: 301
duracion: "36 min"
tags: ["Reversing"]
video: "https://youtu.be/v6gtt4S2LGw?list=PLKYfwBIKMkXfVvUFICiRm-qYUkprfUAL0"
draft: false
resumen: |
  El ELF es el formato de todo binario que analizas en Linux: entender su anatomía es entender cómo vive un programa.

  En esta clase veremos:
  - **Qué es un ELF**: el formato y su estructura interna (header, secciones y segmentos).
  - **Carga en memoria**: cómo se mapea el binario cuando se ejecuta.
  - **Enlazado dinámico**: cómo funcionan la GOT y la PLT para resolver funciones de librerías.
  - **Syscalls**: cómo un proceso se comunica con el kernel.
permalink: "/cursos/introduccion-reversing/3-linux/3.1-binarios-elf/"
---
### Enlaces

- **Estructura y Formato ELF**
    - [`man elf`](https://man7.org/linux/man-pages/man5/elf.5.html)
        - Documentación técnica oficial que define el formato de archivos ejecutables, de objetos y librerías compartidas en sistemas tipo Unix.
    - [Medium: Basics of ELF (Executable and Linkable Format) file](https://medium.com/@ajmewal/basics-of-elf-executable-and-linkable-format-file-88a516877356)
        - Introducción a las secciones fundamentales del archivo (header, secciones y segmentos) para comprender cómo se almacena el código y los datos.
    - [dev.to: Understanding the Basics of ELF Files on Linux](https://dev.to/bytehackr/understanding-the-basics-of-elf-files-on-linux-61c)
        - Guía detallada sobre la estructura interna del formato ELF y su rol en el ecosistema de Linux.

- **Ejecución y Gestión de Memoria**
    - [wxdublin.gitbooks.io: Programm in Memory](https://wxdublin.gitbooks.io/deep-into-linux-and-beyond/content/address_space.html)
        - Análisis de cómo se mapea un binario en la memoria RAM (stack, heap, data y text) durante su ejecución.

- **Enlazado Dinámico (GOT y PLT)**
    - [Medium: GOT vs PLT in Binary Analysis](https://can-ozkan.medium.com/got-vs-plt-in-binary-analysis-888770f9cc5a)
        - Estudio sobre el redireccionamiento de funciones en tiempo de ejecución y cómo interactúan estas tablas para resolver símbolos externos.
    - [Stack Overflow: Why does the PLT exist in addition to the GOT, instead of just using the GOT?](https://stackoverflow.com/questions/43048932/why-does-the-plt-exist-in-addition-to-the-got-instead-of-just-using-the-got)
        - Discusión técnica sobre la necesidad de separar el código ejecutable (PLT) de los datos modificables (GOT) para permitir el lazy binding.

- **Syscalls**
    - [W3challs: Systemcalls](https://syscalls.w3challs.com)
        - Tabla de referencia para identificar números de llamadas al sistema y sus argumentos según la arquitectura.
    - [System Calls in Linux](https://linuxhandbook.com/system-calls)
        - Explicación de la interfaz entre las aplicaciones de usuario y el kernel, detallando cómo se solicitan servicios de bajo nivel.

### Documentos

- [diagrama_clase.excalidraw](resources/diagrama_clase.excalidraw)

    - **Introducción**
    <p align="center">
        <img src="resources/0-intro/Userland_VS_Kernel.png" alt="Definición" width="300" />
    </p>

    - **Formato ELF**
    <p align="center">
        <img src="resources/1-ELF/Definicion.png" alt="Definición ELF" width="300">
    </p>
    <p align="center">
        <img src="resources/1-ELF/Estructura_Interna.png" alt="Estructura Interna ELF" width="500">
    </p>
    <p align="center">
        <img src="resources/1-ELF/Program-Section_Header_Table.png" alt="Program/Section Header Table" width="500">
    </p>

    - **Carga y mapeo en memoria**
    <p align="center">
        <img src="resources/2-CargaMapeo/Contexto.png" alt="Contexto carga ELF" width="350">
    </p>
    <p align="center">
        <img src="resources/2-CargaMapeo/Secuencia_Carga.png" alt="Secuencia de carga" width="300">
    </p>
    <p align="center">
        <img src="resources/2-CargaMapeo/Memory_Layout.png" alt="Memory Layout" width="500">
    </p>
    <p align="center">
        <img src="resources/2-CargaMapeo/DynamicLinking_Contexto.png" alt="Dynamic Linking Contexto" width="600">
    </p>
    <p align="center">
        <img src="resources/2-CargaMapeo/DynamicLinking_LazyBinding.png" alt="Dynamic Linking Lazy Binding" width="600">
    </p>

    - **Syscall**
    <p align="center">
        <img src="resources/3-Syscalls/Contexto.png" alt="Syscalls Contexto" width="450">
    </p>
    <p align="center">
        <img src="resources/3-Syscalls/Mecanismo.png" alt="Syscalls Mecanismo" width="400">
    </p>
