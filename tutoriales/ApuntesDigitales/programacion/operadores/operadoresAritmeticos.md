# Operadores Aritméticos

## ¿Qué son?

Los **operadores aritméticos** son símbolos que indican una operación matemática entre uno o más valores (operandos). Se utilizan para realizar cálculos básicos como suma, resta, multiplicación y más.

## Lista de operadores y función

| Operador | Nombre           | Ejemplo  | Resultado   |
| -------- | ---------------- | -------- | ----------- |
| `+`      | Suma             | `3 + 2`  | `5`         |
| `-`      | Resta            | `5 - 3`  | `2`         |
| `*`      | Multiplicación   | `4 * 2`  | `8`         |
| `/`      | División         | `10 / 2` | `5`         |
| `%`      | Módulo (residuo) | `7 % 3`  | `1`         |
| `++`     | Incremento       | `x++`    | `x = x + 1` |
| `--`     | Decremento       | `x--`    | `x = x - 1` |

## Orden de evaluación

El orden en el que se evalúan los operadores aritméticos es el siguiente:

1. Paréntesis `()`
2. Multiplicación y División `* / %` (de izquierda a derecha)
3. Suma y Resta `+ -` (de izquierda a derecha)

> 📌 *Importante:* El uso de paréntesis puede cambiar el orden para forzar ciertas operaciones primero.

## Uso combinado

Puedes combinar varios operadores en una sola expresión:

```csharp
int resultado = (4 + 2) * 3 - 1;
```

> 📌 Aquí, primero se suma `4 + 2 = 6`, luego se multiplica `6 * 3 = 18` y finalmente se resta `18 - 1 = 17`.

## Errores comunes

❌ **Dividir entre cero**: provoca error de ejecución.

❌ **Usar `++` o `--` incorrectamente** (en una expresión compleja puede dar resultados inesperados).

❌ **Olvidar el orden de operaciones**, lo que puede dar resultados erróneos.

❌ **Errores de tipo**, como intentar usar operadores aritméticos con strings o tipos no numéricos sin conversión previa.

## Ejemplos

### Área de un rectángulo

**Pseudocódigo:**

```
INICIO
    DEFINE base COMO ENTERO ← 5
    DEFINE altura COMO ENTERO ← 3
    DEFINE area COMO ENTERO
    
    area ← base * altura
    Mostrar area

FIN
```

**Código en C#:**

```csharp
int base = 5;
int altura = 3;
int area = base * altura;
Console.WriteLine("Área: " + area);  // Salida: Área: 15
```

### Operación mixta

**Pseudocódigo:**

```
Inicio
    a ← 4
    b ← 2
    resultado ← (a + b) * 3 - 1
    Mostrar resultado
Fin
```

**Código en C#:**

```csharp
int a = 4;
int b = 2;
int resultado = (a + b) * 3 - 1;
Console.WriteLine("Resultado: " + resultado);  // Salida: Resultado: 17
```

### Usar módulo para saber si un número es par

**Pseudocódigo:**

```
Inicio
    número ← 7
    si número % 2 = 0 entonces
        Mostrar "Es par"
    sino
        Mostrar "Es impar"
Fin
```

**Código en C#:**

```csharp
int numero = 7;
if (numero % 2 == 0)
{
    Console.WriteLine("Es par");
}
else
{
    Console.WriteLine("Es impar");  // Salida: Es impar
}
```

## Diferencias clave que causan confusión

| Escrito  | Significado                                          | Comentario                                   |
| -------- | ---------------------------------------------------- | -------------------------------------------|
| `++a`    | Pre-incremento: suma 1 **antes** de usar el valor    | Se incrementa y luego se usa                 |
| `a++`    | Post-incremento: suma 1 **después** de usar el valor | Se usa el valor actual y luego se incrementa |
| `a += 4` | Suma 4 al valor actual de `a`                        | Equivale a `a = a + 4`                       |
| `a = +4` | Asigna el valor positivo 4 a `a`                     | No suma nada, solo pone 4                    |
| `a -= 2` | Resta 2 al valor actual de `a`                       | Equivale a `a = a - 2`                       |
| `a = -2` | Asigna directamente el valor -2 a `a`                | No es resta, es un número negativo           |

> 📌 *Tip para recordar:* </br> `a += 4` significa "aumenta `a` en 4", mientras que `a = +4` es simplemente asignar el valor 4 positivo. Lo mismo con `-`.

## Para saber más...

- [Tipos de datos](ApuntesDigitales/programacion/tiposDatos/tiposDatos.md).

<!-- documentación oficial -->