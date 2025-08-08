# switch

Elige entre múltiples caminos según el valor de una variable.

## Pseudocódigo

```
SEGUN variable HACER

    CASO valor1:
        // instrucciones para valor1
        SALIR

    CASO valor2:
        // instrucciones para valor2
        SALIR

    CASO valor3:
        // instrucciones para valor3
        Salir

    DE OTRO MODO:
        // instrucciones si no coincide ningún caso
        SALIR
FIN SEGUN
```

# Estructura

```C#
switch (expresion)
{
    case valor1:
        // Instrucciones si expresion == valor1
        break;

    case valor2:
        // Instrucciones si expresion == valor2
        break;

    case valor3:
        // Instrucciones si expresion == valor3
        break;

    default:
        // Instrucciones si ningún caso coincide
        break;
}

```

# Ejemplos

<!-- tres ejemplos -->

## Menú de operaciones en calculadora

**Pseudocódigo:**

```
MOSTRAR "Elige una operación: 1) Suma 2) Resta"
LEER opcion
LEER a
LEER b

SEGUN opcion HACER
    CASO 1:
        MOSTRAR "Resultado: " + (a + b)
        SALIR
    CASO 2:
        MOSTRAR "Resultado: " + (a - b)
        SALIR
    DE OTRO MODO:
        MOSTRAR "Opción inválida"
        SALIR
FIN SEGUN
```

**C#:**

```csharp
Console.WriteLine("Elige una operación: 1) Suma 2) Resta");
int opcion = int.Parse(Console.ReadLine());

Console.WriteLine("Ingresa el primer número:");
int a = int.Parse(Console.ReadLine());

Console.WriteLine("Ingresa el segundo número:");
int b = int.Parse(Console.ReadLine());

switch (opcion)
{
    case 1:
        Console.WriteLine("Resultado: " + (a + b));
        break;
    case 2:
        Console.WriteLine("Resultado: " + (a - b));
        break;
    default:
        Console.WriteLine("Opción inválida");
        break;
}
```

## Revisión de resultado `a + b = c`

**Pseudocódigo:**

```
LEER a
LEER b
LEER c

SEGUN (a + b == c) HACER
    CASO true:
        MOSTRAR "Correcto"
        SALIR

    CASO false:
        MOSTRAR "Incorrecto"
        SALIR

FIN SEGUN
```

**C#:**

```csharp
int a = 3;
int b = 5;
int c = 8;

switch (a + b == c)
{
    case true:
        Console.WriteLine("Correcto");
        break;
    case false:
        Console.WriteLine("Incorrecto");
        break;
}
```

> En este caso, el `switch` trabaja con una **expresión booleana**.

## Cambiar color según número (más visual)

**Pseudocódigo:**

```
LEER color

SEGUN color HACER
    CASO "rojo":
        MOSTRAR "Elegiste pasión"
        SALIR

    CASO "azul":
        MOSTRAR "Elegiste calma"
        SALIR

    CASO "verde":
        MOSTRAR "Elegiste naturaleza"
        SALIR

    DE OTRO MODO:
        MOSTRAR "Color no reconocido"
        SALIR
        
FIN SEGUN
```

**C#:**

```csharp
string color = "azul";

switch (color)
{
    case "rojo":
        Console.WriteLine("Elegiste pasión");
        break;
    case "azul":
        Console.WriteLine("Elegiste calma");
        break;
    case "verde":
        Console.WriteLine("Elegiste naturaleza");
        break;
    default:
        Console.WriteLine("Color no reconocido");
        break;
}
```

## Para saber más...

- [Tipos de datos](ApuntesDigitales/programacion/tiposDatos/tiposDatos.md).

<!-- documentación oficial -->