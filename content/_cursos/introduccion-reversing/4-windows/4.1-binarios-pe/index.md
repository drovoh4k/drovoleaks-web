---
title: "Binarios PE"
date: 2026-08-21
categoria: "Reversing"
descripcion: "En esta clase vemos qué es exactamente un .exe y el formato PE, la arquitectura básica de Windows (user mode, kernel mode y el camino WinAPI → ntdll → syscall), cómo un fichero en disco se convierte en…"
curso: "Introducción al Reversing"
curso_slug: "introduccion-reversing"
modulo: "4 · Windows"
orden: 401
duracion: "60 min"
tags: ["Reversing"]
video: "https://youtu.be/N-rRobHD2js?list=PLKYfwBIKMkXfVvUFICiRm-qYUkprfUAL0"
draft: false
resumen: |
  El PE es el formato de todo binario que analizas en Windows: entender su anatomía y quién habla con quién es el punto de partida de la ruta Windows.

  En esta clase veremos:
  - **Qué es un `.exe`**: el formato PE y su estructura interna (DOS header, NT headers, section table, secciones) y los campos del Optional Header que sí importan.
  - **Arquitectura de Windows**: user mode y kernel mode, y el camino `WinAPI` → `kernelbase.dll` → `ntdll.dll` → `syscall`.
  - **De fichero a proceso**: proceso e hilo, la secuencia de carga, el concepto de módulo y por qué el ASLR te impide anclarte a direcciones absolutas.
  - **Resolución de funciones externas**: enlazado estático y dinámico, la IAT, `LoadLibrary`/`GetProcAddress` y el sufijo A/W con los wide strings UTF-16.
permalink: "/cursos/introduccion-reversing/4-windows/4.1-binarios-pe/"
---
### Enlaces

- **Formato PE**
    - [PE Format — Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/debug/pe-format)
        - La especificación oficial del formato: cabeceras, tabla de secciones, Data Directories y el significado exacto de cada campo.
        - Es la referencia a la que volver cuando una herramienta te enseñe un campo y no sepas qué significa.
    - [Anatomía del formato Portable Executable — deephacking](https://blog.deephacking.tech/es/posts/anatomia-del-formato-portable-executable/)
        - Recorrido en español por la estructura del PE, con el mismo orden que seguimos en la clase.
    - [PE101 — corkami](https://github.com/corkami/pics/blob/master/binary/pe101/README.md)
        - El póster visual clásico del PE: ver la cabecera entera de un vistazo ayuda a fijar la estructura.

- **Arquitectura de Windows**
    - [User mode y kernel mode — Microsoft Learn](https://learn.microsoft.com/es-es/windows-hardware/drivers/gettingstarted/user-mode-and-kernel-mode)
        - La frontera base del sistema: qué puede hacer cada modo y por qué tu binario nunca habla directamente con el kernel.
    - [Windows API index — Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/apiindex/windows-api-list)
        - El índice de la WinAPI por dominios, para localizar en qué DLL vive cada función que te encuentres.
    - [Windows System Call Tables — j00ru](https://j00ru.vexillium.org/syscalls/nt/64/)
        - Tabla de números de syscall por versión de Windows: la prueba de que ese número es interno y cambia, y de que te anclas al nombre de la API.

- **De fichero a proceso**
    - [Processes and threads — Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/procthread/processes-and-threads)
        - Los dos conceptos base: el proceso como contenedor de recursos y el hilo como lo que realmente ejecuta.
    - [Module information — Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/psapi/module-information)
        - Qué es un módulo cargado en un proceso y cómo se enumeran, que es la unidad con la que hablas en el debugger (`modulo!funcion`).
    - [`/DYNAMICBASE` (ASLR) — Microsoft Learn](https://learn.microsoft.com/en-us/cpp/build/reference/dynamicbase-use-address-space-layout-randomization)
        - La opción del linker que activa el ASLR: por qué el `ImageBase` del fichero es solo una preferencia y las direcciones cambian entre ejecuciones.

- **Resolución de funciones externas**
    - [Dynamic-link library search order — Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/dlls/dynamic-link-library-search-order)
        - Dónde busca el loader cada DLL que tu binario importa, en qué orden y qué implicaciones tiene.
    - [`GetProcAddress` — Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/api/libloaderapi/nf-libloaderapi-getprocaddress)
        - La pareja de `LoadLibrary`: cómo se resuelve una función en tiempo de ejecución y por qué esas llamadas no aparecen en la tabla de imports.
    - [Unicode in the Windows API — Microsoft Learn](https://learn.microsoft.com/en-us/windows/win32/intl/unicode-in-the-windows-api)
        - El origen del sufijo A/W y de los wide strings UTF-16 que verás en cualquier binario moderno de Windows.

### Documentos

- [diagrama_clase.excalidraw](resources/diagrama_clase.excalidraw)

    - **Fase 1: Qué es un `.exe` (el formato PE)**

        - Overview

          <p align="center">
              <img src="resources/1-Que-es-un-EXE/Overview.png" alt="Overview del formato PE" width="341">
          </p>

        - Ficheros `.EXE` y `.DLL`

          <p align="center">
              <img src="resources/1-Que-es-un-EXE/Ficheros_EXE_DLL.png" alt="Ficheros EXE y DLL" width="310">
          </p>

        - Estructura del fichero

          <p align="center">
              <img src="resources/1-Que-es-un-EXE/EstructuraFichero_Overview.png" alt="Estructura del fichero PE" width="140">
          </p>
          <p align="center">
              <img src="resources/1-Que-es-un-EXE/EstructuraFichero_DOS-Header.png" alt="DOS Header" width="500">
          </p>
          <p align="center">
              <img src="resources/1-Que-es-un-EXE/EstructuraFichero_DOS-Stub.png" alt="DOS Stub" width="498">
          </p>
          <p align="center">
              <img src="resources/1-Que-es-un-EXE/EstructuraFichero_NT-Headers.png" alt="NT Headers" width="476">
          </p>
          <p align="center">
              <img src="resources/1-Que-es-un-EXE/EstructuraFichero_Section-Table.png" alt="Section Table" width="468">
          </p>
          <p align="center">
              <img src="resources/1-Que-es-un-EXE/EstructuraFichero_Sections.png" alt="Secciones" width="439">
          </p>

        - Las secciones típicas y para qué sirven

          <p align="center">
              <img src="resources/1-Que-es-un-EXE/SeccionesTipicas.png" alt="Secciones típicas" width="500">
          </p>

        - Los campos del Optional Header que sí importan

          <p align="center">
              <img src="resources/1-Que-es-un-EXE/OptionalHeader_Overview.png" alt="Optional Header" width="279">
          </p>
          <p align="center">
              <img src="resources/1-Que-es-un-EXE/OptionalHeader_AddressOfEntryPoint.png" alt="AddressOfEntryPoint" width="362">
          </p>
          <p align="center">
              <img src="resources/1-Que-es-un-EXE/OptionalHeader_FileAlignment-SectionAlignment.png" alt="FileAlignment y SectionAlignment" width="500">
          </p>
          <p align="center">
              <img src="resources/1-Que-es-un-EXE/OptionalHeader_DataDirectories.png" alt="Data Directories" width="486">
          </p>

    - **Fase 2: Arquitectura básica de Windows**

        - Overview

          <p align="center">
              <img src="resources/2-Arquitectura-Basica-Windows/Overview.png" alt="Overview de la arquitectura de Windows" width="335">
          </p>

        - User mode y kernel mode

          <p align="center">
              <img src="resources/2-Arquitectura-Basica-Windows/UserMode-KernelMode.png" alt="User Mode y Kernel Mode" width="500">
          </p>

        - El mapa completo

          <p align="center">
              <img src="resources/2-Arquitectura-Basica-Windows/MapaCompleto.png" alt="Mapa completo" width="500">
          </p>

        - En qué nos vamos a centrar

          <p align="center">
              <img src="resources/2-Arquitectura-Basica-Windows/Importante_Overview.png" alt="En qué nos vamos a centrar" width="500">
          </p>
          <p align="center">
              <img src="resources/2-Arquitectura-Basica-Windows/Importante_WinAPI.png" alt="La capa documentada: WinAPI" width="500">
          </p>
          <p align="center">
              <img src="resources/2-Arquitectura-Basica-Windows/Importante_KernelBase.png" alt="La implementación real: kernelbase.dll" width="500">
          </p>
          <p align="center">
              <img src="resources/2-Arquitectura-Basica-Windows/Importante_NtDll.png" alt="La puerta al kernel: ntdll.dll" width="500">
          </p>
          <p align="center">
              <img src="resources/2-Arquitectura-Basica-Windows/Importante_Syscall.png" alt="La frontera: syscall" width="500">
          </p>

    - **Fase 3: De fichero a proceso (la carga en memoria)**

        - Proceso e hilo

          <p align="center">
              <img src="resources/3-De-Fichero-a-Proceso/Proceso_Hilo.png" alt="Proceso e hilo" width="417">
          </p>

        - La secuencia de carga

          <p align="center">
              <img src="resources/3-De-Fichero-a-Proceso/Secuencia_Carga.png" alt="Secuencia de carga" width="372">
          </p>

        - Módulo

          <p align="center">
              <img src="resources/3-De-Fichero-a-Proceso/Modulo.png" alt="Módulo" width="353">
          </p>

        - ImageBase y ASLR

          <p align="center">
              <img src="resources/3-De-Fichero-a-Proceso/ImageBase_ASLR.png" alt="ImageBase y ASLR" width="277">
          </p>

    - **Fase 4: Resolución de funciones externas (la IAT)**

        - De dónde viene el código ajeno

          <p align="center">
              <img src="resources/4-Resolucion-Funciones-Externas/codigo_ajeno.png" alt="De dónde viene el código ajeno" width="404">
          </p>

        - El problema: llamar a algo que aún no tiene dirección

          <p align="center">
              <img src="resources/4-Resolucion-Funciones-Externas/problema.png" alt="El problema de llamar a algo sin dirección" width="404">
          </p>

        - La solución: la tabla de imports

          <p align="center">
              <img src="resources/4-Resolucion-Funciones-Externas/tabla_imports.png" alt="La tabla de imports (IAT)" width="500">
          </p>

        - El sufijo A/W y los wide strings UTF-16

          <p align="center">
              <img src="resources/4-Resolucion-Funciones-Externas/sufijo_AW.png" alt="Sufijo A/W y wide strings UTF-16" width="404">
          </p>
