---
title: "Branchless Branching"
date: 2026-06-06
categoria: "Reversing"
descripcion: "Crackme en ensamblador que elimina los saltos condicionales con cmov y jmp rax; la clave se deriva del usuario con una tabla de sustitución."
subtipo: "crackme"
fuente: "crackmes.one"
dificultad: "Media"
arquitectura: "x86-64"
plataforma: "Unix/Linux"
lenguaje: "Assembly"
tags: ["Reversing", "x86-64", "Assembly", "crackmes.one"]
video: "https://youtu.be/d5vR14x-qN8"
draft: false
resumen: |
  Branchless es un crackme de Linux escrito a mano en ensamblador que elimina por completo los saltos condicionales.

  Lo que lo hace especial:
  - **Control de flujo sin saltos**: en lugar de `je` o `jne`, guarda punteros a función en la pila y elige el siguiente bloque en runtime con `cmov` + `jmp rax`.
  - **La lógica del reto**: pide un username y un password, y deriva una clave del primero con una tabla de sustitución de 32 caracteres.
  - **Verificación diferida**: compara la clave contra el password sin cortar el bucle aunque falle un byte — el veredicto se acumula y se difiere hasta el final.
recursos:
  - label: "Reto original"
    url: "https://crackmes.one/crackme/68692679aadb6eeafb398fdf"
  - label: "Descargar challenge"
    file: "challenge/BranchlessBranching.zip"
    pass: "crackmes.one"
permalink: "/writeups/crackmes/crackmes.one/branchless-branching/"
---
### Enlaces

- **Assembly**
    - [FelixCloutier: x86 and amd64 instruction reference](https://www.felixcloutier.com/x86)
        - Referencia rápida para consultar instrucciones assembly durante el desensamblado. Suficiente para resolver crackmes; para trabajo serio, consultar el manual oficial [Intel® 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).

- **Syscalls**
    - Syscall [`execve`](https://man7.org/linux/man-pages/man2/execve.2.html) (`man 2 execve`)
        - Ejecuta un nuevo programa, reemplazando la imagen del proceso actual por la del ejecutable indicado. Recibe la ruta del programa, sus argumentos y las variables de entorno.

    - Syscall [`read`](https://man7.org/linux/man-pages/man2/read.2.html) (`man 2 read`)
        - Lee datos desde un file descriptor y los copia en un buffer proporcionado por el programa. Devuelve el número de bytes leídos, `0` si se ha llegado al final del fichero, o `-1` si ocurre un error.

    - Syscall [`write`](https://man7.org/linux/man-pages/man2/write.2.html) (`man 2 write`)
        - Escribe datos desde un buffer en un file descriptor. Devuelve el número de bytes escritos o `-1` si ocurre un error. Es la alternativa de bajo nivel a funciones como `fwrite` o `fprintf`.

    - Función [`exit`](https://man7.org/linux/man-pages/man3/exit.3.html) (`man 3 exit`)
        - Termina el proceso de forma normal y devuelve un código de salida al sistema operativo. Antes de finalizar, ejecuta las funciones registradas con `atexit` y vacía/cierra los streams abiertos de la libc.

### Scripts

- [`scripts/keygen.py`](scripts/keygen.py)
    - Script que genera keys válidas para cierto username.
