---
title: "El secreto detrás de rand() % 100"
date: 2026-01-21
categoria: "Reversing"
descripcion: "En C, generar un número pseudoaleatorio dentro de un rango es algo trivial, por ejemplo `rand() % 100`, devuelve un valor en [0..99]"
tema: "Assembly"
tags: ["Reversing", "Assembly"]
video: "https://youtu.be/lTQ3l8pWsa8"
draft: false
resumen: |
  En C, generar un número pseudoaleatorio dentro de un rango parece trivial: `rand() % 100` devuelve un valor en [0..99]. Pero ese "módulo" no se implementa con un `idiv` directo (es muy caro), sino con un patrón optimizado del compilador: división por constante usando multiplicación.

  En este tutorial veremos:
  - **La matemática mínima**: por qué `x % d` se puede calcular como `x - q*d`.
  - **Por qué IDIV es tan lento**: comparado con multiplicaciones y shifts.
  - **El patrón optimizado en assembly**: cómo lo genera realmente el compilador.
  - **Un mini script en Python**: interactivo, para jugar con dividendos/divisores y ver el cálculo paso a paso.
permalink: "/varios/tutoriales/assembly/random-range-number/"
---
### Enlaces

- **Assembly**
    - [FelixCloutier: x86 and amd64 instruction reference](https://www.felixcloutier.com/x86)
        - Referencia rápida para consultar instrucciones assembly.
        - Aunque para la resolución de los challenges de este repositorio es más que suficiente, es solo para tener una referencia.
        - Para cualquier proyecto serio, consultar documentación oficial como, por ejemplo, el [Intel® 64 and IA-32 Architectures Software Developer Manuals](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-sdm.html).

### Documentos

- [diagrama.excalidraw](resources/material_clase/diagrama.excalidraw)
    - Diagrama utilizado durante la clase.

- [Division by Invariant Integers using Multiplication](resources/profundizar/Division%20by%20Invariant%20Integers%20using%20Multiplication.pdf) y [Improved division by invariant integers](resources/profundizar/Improved%20division%20by%20invariant%20integers.pdf)
    - Papers donde se entra al detalle matemático de la optimización.

- [Intel Optimization Reference Manual](resources/profundizar/356477-Optimization-Reference-Manual-V2-002.pdf)
    - Documento de donde he obtenido los calculos de rendimiento de las instrucciones (concretamente página 151, tabla 7-17).

### Scripts

- [residuo_asm.py](resources/apoyo/residuo_asm.py)
    - Script interactivo para profundizar en como funciona la optimización.
