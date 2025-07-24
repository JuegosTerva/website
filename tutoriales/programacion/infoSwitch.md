# switch

Elige entre múltiples caminos según el valor de una variable.

## Pseudocódigo

```
Segun variable hacer

    Caso valor1:
        // instrucciones para valor1
        Salir

    Caso valor2:
        // instrucciones para valor2
        Salir

    Caso valor3:
        // instrucciones para valor3
        Salir

    De Otro Modo:
        // instrucciones si no coincide ningún caso
FinSegun
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
Mostrar "Elige una operación: 1) Suma 2) Resta"
Leer opcion
Leer a
Leer b

switch(opcion)
    caso 1:
        Mostrar "Resultado: " + (a + b)
    caso 2:
        Mostrar "Resultado: " + (a - b)
    default:
        Mostrar "Opción inválida"
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
Leer a
Leer b
Leer c

switch(a + b == c)
    caso verdadero:
        Mostrar "Correcto"
    caso falso:
        Mostrar "Incorrecto"
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
Leer color
switch(color)
    caso "rojo":
        Mostrar "Elegiste pasión"
    caso "azul":
        Mostrar "Elegiste calma"
    caso "verde":
        Mostrar "Elegiste naturaleza"
    default:
        Mostrar "Color no reconocido"
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
