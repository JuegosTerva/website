# Extender la clase Mascota

**Objetivo**: Identificar métodos con parámetros y retorno, y aplicar encapsulamiento.


Esta guía te ayudará a resolver la actividad paso a paso.

## 📚 Conceptos clave

1. [Tipos de datos | Guía](programacion/tiposDatos.md)

1. Clases y Objetos

2. [Métodos con parámetros | Guía](programacion/parametrosMetodos.md)

## 🧠 Guía paso a paso

## Prepara tu proyecto

1. Abre la terminal o el Git Bash dentro de la carpeta de tu proyecto.

	> Recuerda usar el Git Bash para los comandos

2. Usa ˋgit fetchˋ para traer la información nueva del repositorio remoto.

	> A veces los comandos no muestran resultados, eso quiere decir que no hay errores y se pudo correr el comando sin problemas.

3. Usa ˋgit statusˋ para ver el estado actual de tu repositorio.

4. Si no tienes cambios en el repositorio local, y te sugiere que hagas un pull, entonces haz ˋgit pullˋ

5. Si te dice que no hay cambios, continua con el siguiente paso.

## Dibuja un diagrama en el cuaderno:

Mascota

- nombre: string (privado)
- edad: int (privado)
- tipo: string (privado)
+ emitirSonido(): void
+ mostrarInfo(): void
+ getEdad(): int
   -> obtiene la edad
+ setEdad(int nuevaEdad): void
   -> solicitad entrada al usuario
+ calcularEdadHumana(): int
   -> multiplica por 7

Puedes seguir el siguiente ejemplo:
![ejemplo de diagrama de una clase](https://www.juegosterva.com/tutoriales/imagenes/clasesyobjetos.jpg)

1. Sube una captura de pantalla a la plataforma.


## Pseudocódigo

2. En parejas o individual, modifiquen su pseudocódigo agregando los métodos getEdad, setEdad, calcularEdadHumana.

Ejemplo:

```
Método calcularEdadHumana
  edadHumana = edad * 7
  retornar edadHumana
```

## Programación en C#

3. Usa como base el código de la práctica pasada.

2. Agregar método `setEdad`. [Ejemplo de método con parámetros.](../programacion/parametrosMetodos.md)

3. Explica cómo llamar cada método desde Main y qué esperar de cada uno.

2. Ejemplo en Main 

```c#
class Program
{
    static void Main(string[] args)
    {
        Mascota m = new Mascota("Firulais", 3, "perro");
        m.MostrarInfo();
        Console.WriteLine("Edad humana: " + m.CalcularEdadHumana());

        m.SetEdad(5);
        Console.WriteLine("Nueva edad: " + m.GetEdad());
    }
}
```

4. Crear 2 mascotas con diferentes edades y tipos.

5. Llamar todos los métodos. 

6. Cambiar la edad de una mascota usando setEdad.

7. Mostrar la edad humana antes y después del cambio.

8. Responde en la plataforma

-   ¿Cuál fue la parte más difícil?

- ¿Qué pasa si no usamos get o set?

- ¿Para qué sirve retornar algo?

