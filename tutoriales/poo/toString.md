#  Apunte Digital: Método `.ToString()` en C\#

## ¿Qué hace?

El método `.ToString()` convierte un valor numérico (como un `int`, `double`, etc.) en una **cadena de texto (string)**.

Es muy útil cuando necesitas mostrar números en pantalla, unirlos con otros textos o almacenarlos como texto.

---

## Sintaxis

Se usa así: `variable.ToString()`
El resultado es una **cadena** con el valor de la variable.

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

```csharp
int numero = 123;
string texto = numero.ToString();
```

## Ejemplos

```csharp
int edad = 25;
string edadTexto = edad.ToString();

Console.WriteLine("Tienes " + edadTexto + " años.");
```

**Salida:**

```
Tienes 25 años.
```

---

```csharp
int puntos = 100;
Console.WriteLine("Puntos: " + puntos.ToString());
```

**Salida:**

```
Puntos: 100
```

---

### |-- Casos de uso comunes

✅ Mostrar un número en pantalla con `Console.WriteLine` o en una interfaz.

✅ Concatenar un número con otros textos (por ejemplo, en un mensaje o un archivo).

✅ Guardar un número como texto en una base de datos o archivo plano.

✅ En UI de videojuegos o apps, mostrar puntajes, cantidades, niveles, etc.

---

¿Te gustaría que lo convierta en un formato para Notion, PDF o presentación?
