# Estructuras de control

*Sigue cada enlace para más información.*

| Estructura | C# / Java                     |  Pseudocódigo             |
| ---------- | ----------------------------- |  ------------------------ |
| [`if`](programacion/infoIfElse.md)     | `if (cond) { ... }` |  `SI condición ENTONCES ...`   |
| [`else`](programacion/infoIfElse.md)     | `else { ... }`|  `SINO ...`  |
| [`for`](programacion/infoFor.md)      | `for (int i = 0; i < n; i++)` | `PARA i DESDE 1 HASTA n` |
| [`while`](programacion/infoWhile.md)    | `while (cond) { ... }`        | `MIENTRAS condición HACER`    |
| [`switch`](programacion/infoSwitch.md)   | `switch (x) { case 1: ... }`  | `SEGÚN x HACER ...`      |
| [`do while`](programacion/infoWhile.md)    | `do { // instrucciones} while (condición);` | `REPETIR instrucciones HASTA QUE condición` |

# Preguntas clave 

Aquí hay una lista de **preguntas clave** que puedes usar al resolver un problema para decidir **qué estructura de control necesitas**:

## 🔄 ¿Necesito repetir algo?

**Sí:** → Usa una **estructura de repetición (ciclo / bucle)**

**No:** → Probablemente solo necesites una **estructura secuencial o condicional**

## 📌 ¿Cuántas veces debe repetirse?

**¿Un número conocido de veces?**
  → Usa un **`for`**
  (Ej. imprimir los números del 1 al 10)

**¿Hasta que se cumpla una condición?**
  → Usa un **`while`** o **`do while`**

**¿Debe ejecutarse al menos una vez, aunque la condición no se cumpla?**
  → Usa un **`do while`**

## 🔀 ¿Necesito tomar decisiones?

**Sí:** → Usa una **estructura condicional (if, else, switch...)**

## 📋 ¿Cuántas opciones posibles tengo?

**¿Solo dos caminos posibles?**
  → Usa **`if` / `else`**

**¿Muchas opciones con base en un solo valor?**
  → Usa **`switch`**

## 🔁 ¿Voy a salir del ciclo bajo ciertas condiciones?

**¿Necesito salir del ciclo si algo sucede?**
  → Usa `break` dentro de un ciclo `while`, `for`, etc.

**¿Necesito saltar a la siguiente iteración si algo sucede?**
  → Usa `continue`

## 🔂 ¿Estoy anidando condiciones o ciclos?

Considera usar estructuras **anidadas** (por ejemplo, un `if` dentro de un `for`, o un `for` dentro de otro `for` para trabajar con tablas o matrices).
