# Apunte Digital: Tipo de dato `int`

## ¿Qué es un `int`?

El tipo de dato `int` (de *integer*) representa **números enteros**, es decir, sin decimales. Sirve para contar cosas, llevar puntuaciones, representar vidas, niveles, monedas, etc.

## ¿Dónde se usa en videojuegos?

Algunos ejemplos comunes:

* Vidas del jugador: `3`
* Puntos acumulados: `1240`
* Nivel actual: `5`
* Cantidad de enemigos: `10`

El tipo `int` es ideal para representar **cosas que puedes contar** y que cambian durante el juego.

## Características del `int`

* Solo guarda **números enteros** (positivos o negativos).
* Ocupa poca memoria.
* Permite operaciones matemáticas como suma, resta, multiplicación y división.
* Se usa para **condiciones** y **controles de flujo**, como bucles y decisiones.

## Ejemplos

### Declarar una variable llamada `vida`

**Pseudocódigo**

```plaintext
    DEFINE vida COMO ENTERO
```

**Código**

```C#
    int vida;
```

### Declarar una variable llamada `fuerza` e inicializarla con 10

**Pseudocódigo**

```plaintext
    DEFINE fuerza COMO ENTERO ← 10
```

**Código**

```C#
    int fuerza = 10;
```

### Saber si un número es par o impar

**Pseudocódigo**

```plaintext
INICIO PROGRAMA

    DEFINE num COMO ENTERO
    DEFINE residuo COMO ENTERO

    LEER num

    residuo ← num % 2 
    SI residuo ES IGUAL A 0 ENTONCES
        MOSTRAR "Es un número par"
    SINO
        MOSTRAR "El número es impar"
    FIN SINO

FIN PROGRAMA
```

> **También se usó:** [MOSTRAR/LEER](poo/console.md), [Módulo (%)](programacion/operadoresAritmeticos.md), la [estructura condicional `if`](programacion/infoIfElse.md), [operadores de comparación](programacion/operadoresComparacion.md).

**Código**

```C#
using System;

int num =0;
int residuo = 0;

num = Int32.Parse(Console.ReadLine());

residuo = num % 2;

if(residuo == 0){
    Console.WriteLine("Es numero par");
}else{
    Console.WriteLine("El numero es impar");
}
```

## 🧭 Buenas prácticas al usar `int`

* Usa nombres descriptivos para tus variables (`vidas`, `puntos`, `enemigos_vencidos`).
* Inicializa siempre tus variables con un valor (por ejemplo: `int puntos = 0`).
* Evita dividir enteros si necesitas decimales (para eso, usa `float` o `double`).

# 🧮 Métodos comunes con `int` en C\#

| 🛠️ **Método**      | ❓ **¿Qué hace?**                                    | 💻 **Pseudocódigo**             | 💬 **Código en C#**                       | 🎮 **Ejemplo en videojuegos**                                  |
| ------------------- | --------------------------------------------------- | ------------------------------- | ----------------------------------------- | -------------------------------------------------------------- |
| `int.Parse()`       | Convierte un texto a número entero (`string → int`) | `edad ← "18"` | `int edad = int.Parse("18");` | Leer la edad del jugador desde un cuadro de texto.|
| `ToString()`        | Convierte un número entero a texto (`int → string`) | `texto ← puntos`     | `string texto = puntos.ToString();`       | Mostrar los puntos en una etiqueta de UI.                      |
| `Math.Abs()`        | Devuelve el valor absoluto (sin signo negativo)     | `valor ← ABS(-3)`               | `int valor = Math.Abs(-3);`               | Calcular cuánto daño recibió el jugador (aunque sea negativo). |
| `Math.Max(a, b)`    | Devuelve el mayor de dos valores                    | `mayor ← MAX(vidas1, vidas2)`   | `int mayor = Math.Max(vidas1, vidas2);`   | Saber qué jugador tiene más vidas.                             |
| `Math.Min(a, b)`    | Devuelve el menor de dos valores                    | `menor ← MIN(tiempo1, tiempo2)` | `int menor = Math.Min(tiempo1, tiempo2);` | Mostrar quién tardó menos en completar un nivel.               |
| `Convert.ToInt32()` | Convierte valores (texto, booleano, etc.) a `int`   | `numero ← CONVERTIR("42")`      | `int numero = Convert.ToInt32("42");`     | Leer un valor desde un archivo o entrada de usuario.           |

## Para saber más...

- [Operadores Aritméticos](ApuntesDigitales/programacion/operadores/operadoresAritmeticos.md).