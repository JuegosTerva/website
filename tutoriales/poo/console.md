# Apunte Digital: La clase Console en C\#

## Visión general

Cuando programamos en C#, muchas veces necesitamos mostrar mensajes al usuario o pedirle que escriba algo. Para eso usamos `Console`, una clase que nos permite interactuar con la consola (la ventanita negra donde corre el programa). 

## ¿Qué es `Console`?

`Console` es una clase estática de C#. Eso significa que **no necesitamos crear un objeto** para usarla, sino que usamos directamente sus métodos, como `Console.WriteLine(...)`.
Pertenece al espacio de nombres `System`, así que al inicio del archivo normalmente ves:

```csharp
using System;
```

## ¿Para qué sirve?

Sirve para **leer y escribir información en la consola**, que es una forma básica de comunicación entre el programa y el usuario.

Ideal para comenzar a practicar lógica, variables, condiciones, ciclos y más.

Con `Console` puedes:

* Mostrar mensajes (como resultados o instrucciones)
* Pedirle datos al usuario
* Leer lo que el usuario escribió
* Limpiar la pantalla
* Cambiar colores del texto

## Métodos más usados de `Console`

|Método| ¿Qué hace? | Pseudocódigo | Ejemplo|
|--------|--------------|----------------|----------|
|Console.Write()| Escribe texto sin salto de línea | MOSTRAR "Hola" | Console.Write("Hola "); |
|Console.WriteLine()| Escribe texto con salto de línea | MOSTRAR-LINEA "Hola mundo" | Console.WriteLine("Hola mundo"); |
|Console.ReadLine()| Lee una línea de texto que escribe el usuario | LEER nombre | string nombre = Console.ReadLine(); |
|Console.ReadKey()| Espera una tecla del usuario | ESPERAR-TECLA | Console.ReadKey(); |
|Console.Clear()| Limpia la consola | LIMPIAR | Console.Clear(); |
|Console.ForegroundColor| Cambia el color del texto | CAMBIA-COLOR-rojo | Console.ForegroundColor = ConsoleColor.Red; |
|Console.ResetColor()| Restaura el color normal | RESTAURAR-COLOR | Console.ResetColor(); |

## Ejemplo práctico

```csharp
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine("¿Cómo te llamas?");
        string nombre = Console.ReadLine();
        
        Console.ForegroundColor = ConsoleColor.Green;
        Console.WriteLine("Hola, " + nombre + "!");
        Console.ResetColor();
    }
}
```
## Lee también

- [Documentación oficial de Console Clase (System)](https://learn.microsoft.com/es-es/dotnet/api/system.console?view=net-8.0)