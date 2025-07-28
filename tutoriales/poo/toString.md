#  Apunte Digital: Método `.ToString()` en C\#

## ¿Qué hace?

El método `.ToString()` convierte un valor numérico (como un `int`, `double`, etc.) en una **cadena de texto (string)**.

Es muy útil cuando necesitas mostrar números en pantalla, unirlos con otros textos o almacenarlos como texto.

## Sintaxis

Se usa así: `variable.ToString()`
El resultado es una **cadena** con el valor de la variable.

```csharp
int numero = 123;
string texto = numero.ToString();
```

## Ejemplos mostrar una variable `edad`

**Pseudocodigo**

```markdown
INICIO

    // Declarar una variable entera llamada edad y asignarle el valor 25
    edad (ENTERO) = 25

    // Convertir el número entero edad a texto
   edadTexto (CADENA) = CONVERTIR_A_TEXTO(edad)

    // Mostrar en pantalla: "Tienes 25 años."
    MOSTRAR "Tienes " + edadTexto + " años."

FIN
```

**Código**

```csharp
int edad = 25;
string edadTexto = edad.ToString();

Console.WriteLine("Tienes " + edadTexto + " años.");
```

**Salida:**

```
Tienes 25 años.
```

## Ejemplos mostrar una variable `edad`

**Pseudocódigo**

```markdown
INICIO

    // Declarar una variable entera llamada edad y asignarle el valor 25
    puntos (ENTERO) = 100

    // Mostrar en pantalla: "Tienes 25 años."
    MOSTRAR "Puntos: " + CONVERTIR_A_TEXTO(puntos)

FIN
```

**Código**

```csharp
int puntos = 100;
Console.WriteLine("Puntos: " + puntos.ToString());
```

**Salida:**

```
Puntos: 100
```

## Casos de uso comunes

✅ Mostrar un número en pantalla con `Console.WriteLine`[^1] o en una interfaz.

✅ Concatenar un número con otros textos (por ejemplo, en un mensaje o un archivo).

✅ Guardar un número como texto en una base de datos o archivo plano.

✅ En UI de videojuegos o apps, mostrar puntajes, cantidades, niveles, etc.

[^1]: Puedes reviar la información sobre [Leer y escribir en consola](poo/console.md)