# Propiedades automáticas en C#

En C#, `get; set;` forman parte de algo llamado **propiedades automáticas**, una manera sencilla y elegante de **leer y modificar valores privados** de una clase sin escribir mucho código.

En lugar de tener que crear una variable privada con sus métodos `get` y `set`, C# lo hace por ti con una **propiedad automática**.

## Analogía: La caja con candado 🔐

Imagina que tienes una caja (objeto) que guarda información (por ejemplo, el **nombre** de una mascota).

* El **get** es la **llave** para **ver lo que hay dentro** de la caja.
* El **set** es la **llave** para **poner algo dentro** de la caja.

En propiedades automáticas, el candado (la lógica de abrir o cerrar) **ya está hecho por C#**, tú solo dices:
*"Quiero que esta caja tenga estas llaves (get y/o set)".*

## Conceptos extras para saber

1. **Clase:** Molde que define objetos (ej. Mascota).
2. **Propiedad:** Una forma controlada de exponer datos (con get/set).
3. **Campo (field):** La variable interna que guarda el valor real.
4. **Encapsulamiento:** Ocultar los detalles internos y mostrar solo lo necesario.
5. **Modificadores de acceso:** `public`, `private`, etc., definen qué se puede ver desde fuera.

## ¿Cómo se usa?

### Ejemplo 1:

**Pseudocódigo**

```pseudocodigo
Clase Mascota
    Propiedad Nombre con get y set automáticos
FinClase
```

**C\#**

```csharp
public class Mascota
{
    public string Nombre { get; set; }
}
```

**Uso:**

```csharp
Mascota m = new Mascota();
m.Nombre = "Firulais";      // set
Console.WriteLine(m.Nombre); // get
```

### Ejemplo 2:

**Pseudocodigo: Solo lectura (solo `get`)**

```pseudocodigo
Clase Reloj
    Propiedad HoraActual con solo get
FinClase
```

**C\#**

```csharp
public class Reloj
{
    public DateTime HoraActual { get; } = DateTime.Now;
}
```

**Uso:**

```csharp
Reloj r = new Reloj();
Console.WriteLine(r.HoraActual); // Solo lectura
```

### Ejemplo 3:

**Pseudocódigo: Con validación manual (propiedad completa)**

Cuando necesitas lógica personalizada (como evitar valores negativos), ya **no usas propiedad automática**, sino que defines tu campo y tus métodos manualmente.

```pseudocodigo
Clase Persona
    Campo privado edad
    Propiedad Edad con get y set con validación
FinClase
```

**C\#**

```csharp
public class Persona
{
    private int edad;

    public int Edad
    {
        get { return edad; }
        set
        {
            if (value >= 0)
                edad = value;
        }
    }
}
```

**Uso:**

```csharp
Persona p = new Persona();
p.Edad = 25;                // válido
p.Edad = -5;                // no se asigna
Console.WriteLine(p.Edad); // 25
```
## Para saber más...

- [Tipos de datos](ApuntesDigitales/programacion/tiposDatos/tiposDatos.md).

<!-- documentación oficial -->