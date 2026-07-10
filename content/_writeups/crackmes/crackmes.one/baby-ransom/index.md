---
title: "Baby Ransom"
date: 2026-01-30
categoria: "Reversing"
descripcion: "Crackme tipo ransomware que cifra ficheros con un XOR derivado de rand() con semilla fija; se descifran recuperando la semilla."
subtipo: "crackme"
fuente: "crackmes.one"
dificultad: "Fácil"
arquitectura: "x86-64"
plataforma: "Unix/Linux"
lenguaje: "C/C++"
tags: ["Reversing", "x86-64", "C/C++", "crackmes.one"]
video: "https://youtu.be/PFo9DwZ-beg"
draft: false
resumen: |
  Un crackme estilo ransomware: cifra los ficheros de un directorio y hay que revertir el proceso para recuperarlos.

  En el vídeo veremos:
  - **Comportamiento tipo ransomware**: recorre un directorio (`opendir`/`readdir`) y cifra cada fichero, dejándolo con extensión `.pablos`.
  - **Cifrado con `rand()`**: el keystream sale de `rand()` con una semilla fija (`0xDEADBEEF`), no de una clave de verdad.
  - **La recuperación**: replicamos el PRNG, regeneramos el keystream y deshacemos el XOR para descifrar los ficheros.
recursos:
  - label: "Reto original"
    url: "https://crackmes.one/crackme/5ec1a37533c5d449d91ae535"
  - label: "Descargar challenge"
    file: "challenge/BabyRansom.zip"
    pass: "crackmes.one"
permalink: "/writeups/crackmes/crackmes.one/baby-ransom/"
---
### Enlaces

- **Assembly**
    - [FelixCloutier: x86 and amd64 instruction reference](https://www.felixcloutier.com/x86)
        - Referencia rápida para consultar instrucciones assembly.
        - Aunque para la resolución de los challenges de este repositorio es más que suficiente, es solo para tener una referencia.
        - Para cualquier proyecto serio, consultar documentación oficial como, por ejemplo, el [Intel® 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).

- **Funciones de fichero**
    - Función [`fopen`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/fopen-wfopen) (`man fopen`)
        - Abre un archivo y devuelve un `FILE*` asociado al modo indicado (lectura/escritura/append, etc.)
    - Función [`fclose`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/fclose-fcloseall) (`man fclose`)
        - Cierra un `FILE*`, vacía buffers pendientes y libera los recursos asociados al stream.
    - Función [`remove`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/remove-wremove) (`man remove`)
        - Elimina un archivo (o ruta) del sistema de ficheros; falla si no existe o no hay permisos.
    - Función [`feof`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/feof) (`man feof`)
        - Indica si el indicador de "fin de archivo" (EOF) está activado para un `FILE*` (normalmente tras intentar leer y no poder).
    - Función [`getc`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/getc-getwc) (`man getc`)
        - Lee el siguiente carácter de un stream `FILE*` y avanza el puntero de lectura (devuelve EOF si no puede leer).
    - Función [`fputc`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/fputc-fputwc) (`man fputc`)
        - Escribe un carácter en un stream `FILE*` y avanza el puntero de escritura (devuelve EOF en error).

- **Funciones de strings**
    - Función [`strlen`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/strlen-wcslen-mbslen-mbslen-l-mbstrlen-mbstrlen-l) (`man strlen`)
        - Devuelve la longitud de una cadena terminada en `\0` (sin contar el byte nulo final).
    - Función [`strcmp`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/strcmp-wcscmp-mbscmp) (`man strcmp`)
        - Compara dos cadenas lexicográficamente y devuelve `<0`, `0` o `>0` según el orden.
    - Función [`strcat`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/strcat-wcscat-mbscat) (`man strcat`)
        - Concatena (añade) la segunda cadena al final de la primera, asumiendo que hay espacio suficiente.

- **Funciones de directorios**
    - Función [`opendir`](https://man7.org/linux/man-pages/man3/opendir.3.html) (`man opendir`)
        - Abre un directorio y devuelve un DIR* para poder iterar sus entradas.
    - Función [`readdir`](https://man7.org/linux/man-pages/man3/readdir.3.html) y fichero [`sys_types.h`](https://man7.org/linux/man-pages/man0/sys_types.h.0p.html) (`man readdir` y `man sys_types.h`)
        - Devuelve la siguiente entrada del directorio (struct `dirent*`) avanzando el iterador interno del `DIR*`.
    - Función [`closedir`](https://man7.org/linux/man-pages/man3/closedir.3.html) (`man closedir`)
        - Cierra el `DIR*` liberando los recursos asociados a la iteración del directorio.

- **Metadatos de ficheros**
    - Función [`stat`](https://man7.org/linux/man-pages/man3/stat.3type.html) (`man 3 stat`)
        - Obtiene metadatos de una ruta (tamaño, permisos, tipo, timestamps, etc.) rellenando una `struct stat`.

- **Explotación**
    - [Libreria de Python PwnTools](https://docs.pwntools.com/en/stable)
        - Documentación oficial de la libreria PwnTools.
        - Muy utilizada para crear exploits ya nos simplifica muchos procesos comunes mientras creamos un exploit, en este caso llamar a un proceso con ciertos argumentos, en otros casos abrir una conexión con un server o realizar ciertas manipulaciones de bytes, etc.

- **Aleatoriedad**
    - [GeeksForGeeks: rand() and srand() in C++](https://www.geeksforgeeks.org/cpp/rand-and-srand-in-ccpp)
        - Artículo donde se explica el funcionamiento de `rand()` y `srand()` con ejemplos.
    - [ChunkBase: Seed Map](https://www.chunkbase.com/apps/seed-map)
        - Visualizador de mapas a partir de una semilla en Minecraft.
        - Útil para entender el concepto de semilla y como afecta a la pseudoaleatoriedad.

- **glibc: directorios (código fuente)**
    - Definición función [`opendir`](https://elixir.bootlin.com/glibc/glibc-2.42.9000/source/include/dirent.h#L18)
    - Definición estructura [`DIR`](https://elixir.bootlin.com/glibc/glibc-2.42.9000/source/dirent/dirent.h#L127)
    - Definición estructura [`dirstream`](https://elixir.bootlin.com/glibc/glibc-2.42.9000/source/sysdeps/unix/sysv/linux/dirstream.h#L30)
    - Definición estructura [`dirent`](https://elixir.bootlin.com/glibc/glibc-2.42.9000/source/bits/dirent.h#L23)

- **glibc: stat (código fuente)**
    - Definición estructura [`stat`](https://elixir.bootlin.com/glibc/glibc-2.42.9000/source/bits/stat.h#L31)
    - [File types](https://elixir.bootlin.com/glibc/glibc-2.42.9000/source/bits/stat.h#L65)

### Snippets

- Estructura `dirent` para IDA
    ```c
    struct dirent {
        uint64_t        d_ino;
        int64_t         d_off;
        unsigned short  d_reclen;
        unsigned char   d_type;
        char            d_name[256];
    };
    ```

- Enum de file types para IDA
    ```c
    enum __oct S_IF
    {
        S_IFDIR = 040000,  ///< Directory
        S_IFCHR = 020000,  ///< Character device
        S_IFBLK = 060000,  ///< Block device
        S_IFREG = 0100000, ///< Regular file
        S_IFIFO = 010000,  ///< FIFO
    };
    ```

- Creación entorno virtual Python
    ```sh
    python3 -m venv .venv
    source .venv/bin/activate
    ```
    ```sh
    pip install pwntools
    ```

### Scripts

- [`scripts/exploit.py`](scripts/exploit.py)
    - Utilizado para automatizar la explotación del binario.
