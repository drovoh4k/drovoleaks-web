---
title: "JumpJumpJump"
date: 2026-02-06
categoria: "Reversing"
descripcion: "Crackme cuya comprobación no pide una contraseña fija, sino que la suma de los valores ASCII de tu entrada dé un total concreto, con el detalle del salto de línea que añade fgets."
subtipo: "crackme"
fuente: "crackmes.one"
dificultad: "Fácil"
arquitectura: "x86-64"
plataforma: "Unix/Linux"
lenguaje: "C/C++"
tags: ["Reversing", "x86-64", "C/C++", "crackmes.one"]
video: "https://youtu.be/ccpKL1ffWss"
draft: false
resumen: |
  Un crackme de Linux "un poco tricky" en el que la contraseña no es un valor fijo: se valida sumando los valores ASCII de tu entrada.

  En el vídeo veremos:
  - **La comprobación de longitud**: por qué el salto `jbe` (jump below equal) revela que la longitud se trata como número sin signo.
  - **La suma ASCII**: el reto exige que los bytes de tu input sumen exactamente 1000, con el detalle de que `fgets` guarda el salto de línea (valor 10), así que tus caracteres deben sumar 990.
  - **La flag generada**: cómo el propio binario construye la flag con una secuencia aritmética de caracteres.
  - **El exploit**: automatizamos el envío de un input válido con pwntools.
recursos:
  - label: "Reto original"
    url: "https://crackmes.one/crackme/5c1a939633c5d41e58e005d1"
  - label: "Descargar challenge"
    file: "challenge/JumpJumpJump.zip"
    pass: "crackmes.one"
permalink: "/writeups/crackmes/crackmes.one/jump-jump-jump/"
---
### Enlaces

- **Assembly**
    - [FelixCloutier: x86 and amd64 instruction reference](https://www.felixcloutier.com/x86)
        - Referencia rápida para consultar instrucciones assembly.
        - Aunque para la resolución de los challenges de este repositorio es más que suficiente, es solo para tener una referencia.
        - Para cualquier proyecto serio, consultar documentación oficial como, por ejemplo, el [Intel® 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).

- **Funciones de fichero**
    - Función [`fgets`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/fgets-fgetws) (`man fgets`)
        - Lee una línea (o hasta `n-1` caracteres) desde un `FILE*` y la guarda en un buffer, incluyendo el `\n` si aparece antes del límite.
    - Función [`puts`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/puts-putws) (`man puts`)
        - Escribe una cadena en `stdout` seguida automáticamente de un salto de línea (`\n`).
    - Función [`putchar`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/putchar-putwchar) (`man putchar`)
        - Escribe un único carácter en `stdout` (equivalente práctico a `fputc(c, stdout)`).

- **Funciones de strings**
    - Función [`strlen`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/strlen-wcslen-mbslen-mbslen-l-mbstrlen-mbstrlen-l) (`man strlen`)
        - Devuelve la longitud de una cadena terminada en `\0` (sin contar el byte nulo final).
    - Función [`printf`](https://learn.microsoft.com/es-es/cpp/c-runtime-library/reference/printf-printf-l-wprintf-wprintf-l) (`man printf`)
        - Imprime texto formateado en `stdout` según una cadena de formato, sustituyendo especificadores (`%d`, `%s`, `%x`, etc.) por valores de argumentos.

- **Explotación**
    - [Libreria de Python PwnTools](https://docs.pwntools.com/en/stable)
        - Documentación oficial de la libreria PwnTools.
        - Muy utilizada para crear exploits ya nos simplifica muchos procesos comunes mientras creamos un exploit, en este caso llamar a un proceso con ciertos argumentos, en otros casos abrir una conexión con un server o realizar ciertas manipulaciones de bytes, etc.

### Snippets

- Prueba rápida sobre la generación del flag con Python
    ```
    nums = [33] # empieza en '!'

    for i in range(1, 10):
        nums.append(nums[-1] + i + 1)

    print(nums)
    ```
    ```
    help(chr)
    ```
    ```
    print(''.join(chr(n) for n in nums))
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
