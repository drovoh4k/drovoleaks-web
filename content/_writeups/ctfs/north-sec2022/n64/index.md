---
title: "The Legend of Shiitakoin"
date: 2026-02-18
categoria: "Reversing"
descripcion: "Un crackme atípico de la NorthSec 2022: una ROM de Nintendo 64 (MIPS) que se resuelve entre emulador y Ghidra, cumpliendo las comprobaciones de cada fase para sacar las flags."
subtipo: "ctf"
fuente: "Northsec2022"
evento: "NorthSec2022"
evento_orden: 1
dificultad: "Fácil"
arquitectura: "MIPS"
plataforma: "Nintendo64"
lenguaje: "C/C++"
tags: ["Reversing", "MIPS", "C/C++", "Northsec2022"]
video: "https://youtu.be/8qLSEwAOrdU"
draft: false
resumen: |
  Un crackme fuera de lo común: en vez de un binario de Linux, la NorthSec 2022 publicó una ROM de Nintendo 64 (MIPS) que hay que entender por dentro.

  En el vídeo veremos:
  - **El montaje**: ejecutar la ROM en el emulador Project64 y reversear el ELF MIPS (con símbolos) en Ghidra.
  - **Reconstruir estructuras**: recrear la estructura del mando (`button` frente a `trigger`, el flanco de subida) y el array de `input_bytes` para que el pseudocódigo tenga sentido.
  - **Superar cada fase**: encontrar entre todo el "ruido" las comparaciones simples que hay que cumplir para que cada stage valide y suelte su flag.
  - **La fase oculta**: saltar a un stage inalcanzable parcheando el salto en memoria con el debugger integrado.
recursos:
  - label: "Reto original"
    url: "https://github.com/fresh-eggs/n64-northsec-2022"
  - label: "Descargar challenge"
    file: "challenge/legend_of_shiitakoin.zip"
permalink: "/writeups/ctfs/north-sec2022/n64/"
---
### Enlaces

- **Mando (N64)**
    - [ultra64: `nuContDataGetEx`](https://ultra64.ca/files/documentation/online-manuals/functions_reference_manual_2.0i/nusys/nuContDataGetEx.html)
        - Función encargada de leer los datos del mando y guardarlos en una estructura `NUContData`.
    - [Github n64sdkmod: nusys/nusys.h - `NUContData`](https://github.com/ModernN64SDKArchives/n64sdkmod/blob/master/packages/libnusys/usr/include/n64/nusys/nusys.h#L522)
        - Estructura que almacena el estado del mando, incluyendo la trigger data.
    - [Github n64sdkmod - PR/os_cont.h - `Buttons`](https://github.com/ModernN64SDKArchives/n64sdkmod/blob/d27d200a34b5b4f6dcde092153fdc67157b8a8ae/packages/n64sdk/usr/include/n64/PR/os_cont.h#L121)
        - Defines de las máscaras de bits de los diferentes botones.

- **Herramientas**
    - [Project64](https://www.pj64-emu.com)
        - Emulador gratuito y opensource para ejecutar las ROMs de Nintendo64 en PC.
    - [Plugin Ghidra: N64LoaderWV](https://github.com/zeroKilo/N64LoaderWV)
        - Plugin para Ghidra que permite cargar ROMs de Nintendo 64 (.z64, .n64, .v64) correctamente, ajustando la endianness y mapeando secciones de RAM/ROM/boot.

- **Referencia**
    - [GeeksforGeeks: Structure Member Alignment, Padding and Data Packing](https://www.geeksforgeeks.org/c/structure-member-alignment-padding-and-data-packing)
        - Explicación sobre como el compilador de C organiza los miembros de una estructura mediante alineación y relleno para que cada dato quede en direcciones óptimas para la CPU.
    - [Arquitectura de la Nintendo 64](https://www.copetti.org/es/writings/consoles/nintendo-64)
        - Análisis técnico y detallado de la arquitectura interna de la consola Nintendo 64.
        - Explica cómo están diseñados y funcionan su CPU, memoria, gráficos, audio, sistema operativo y otros subsistemas.
        - También incluye decisiones de diseño y limitaciones que la hacen única dentro de las consolas de su generación.

### Documentos

- Diagramas utilizados durante el video para entender la diferencia entre button y trigger

    - **Button**
    <p align="center">
        <img src="resources/diagrama_button.png" alt="Diagrama Button" width="500" />
    </p>

    - **Trigger**
    <p align="center">
        <img src="resources/diagrama_trigger.png" alt="Diagrama Trigger" width="500" />
    </p>
