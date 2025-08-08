# Apunte Digital: Clase `Random` en C\#

## Visión General

La clase `Random` forma parte de la biblioteca base de .NET, por lo tanto **no necesitas agregar un `using` especial**, solo debes asegurarte de tener este al inicio de tu programa:

```csharp
using System;
```

Para usar `Random`, normalmente se **crea un objeto** de esta clase:

```csharp
Random miAzar = new Random();
```

## ¿Qué es?

`Random` es una **clase de .NET** que permite **generar números aleatorios**. Aunque los resultados parecen aleatorios, en realidad están generados por un algoritmo y se conocen como *números pseudoaleatorios*.

## ¿Para qué sirve?

Se usa cuando se necesita **variación o azar** en un programa, por ejemplo:

* Simular dados o sorteos.
* Elegir un valor al azar de una lista.
* Generar niveles, enemigos o posiciones aleatorias en videojuegos.
* Pruebas o datos falsos para testear programas.

## Métodos más usados

| Método | ¿Qué hace? | Pseudocódigo | Ejemplo en C# |
| ------------------------ | ----------------------------------------------------------------- | ------------------------- | ------------------------------ |
| `Next()`                 | Devuelve un número entero aleatorio mayor o igual a 0.            | GENERARENTERO   | `miAzar.Next()`                |
| `Next(int max)`          | Devuelve un número entero aleatorio entre 0 (incl.) y max (excl.) | GENERARENTERO -> 10   | `miAzar.Next(10)` // 0 a 9     |
| `Next(int min, int max)` | Devuelve un entero aleatorio entre min (incl.) y max (excl.)      | GENERARENTERO -> 5-10 | `miAzar.Next(5, 11)` // 5 a 10 |
| `NextDouble()`           | Devuelve un número decimal aleatorio entre 0.0 y 1.0              | GENERARDECIMAL  | `miAzar.NextDouble()`          |

## Notas importantes

* Cada vez que creas un objeto `Random`, se inicializa con una **semilla** (número base para generar los aleatorios). Si creas muchos `Random` muy rápido (en milisegundos), pueden dar el mismo valor.
* Por eso, **usa un solo objeto `Random`** cuando necesites varios números aleatorios.

## Para saber más...

- [Tipos de datos](ApuntesDigitales/programacion/tiposDatos/tiposDatos.md).

## Documentación oficial

- [Documentación de C# sobre clase Random](https://learn.microsoft.com/es-es/dotnet/api/system.random?view=net-8.0)


