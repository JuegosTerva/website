# Extender la clase Mascota

**Objetivo**: Identificar métodos con parámetros y retorno, y aplicar encapsulamiento.
Indicaciones:

1. Dibujen juntos un diagrama en el pizarrón o cuaderno:

Mascota
- nombre: string (privado)
- edad: int (privado)
- tipo: string (privado)
+ emitirSonido(): void
+ mostrarInfo(): void
+ getEdad(): int
+ setEdad(int nuevaEdad): void
+ calcularEdadHumana(): int


2. En equipos, escriban pseudocódigo de los métodos getEdad, setEdad, calcularEdadHumana.



Ejemplo:

Método calcularEdadHumana
  edadHumana = edad * 7
  retornar edadHumana


---

⏰ Hora 2 – Programación Guiada en C#

2.1 – Esqueleto de código (15 min)

Claudia escribe en proyector y ellos copian:

public class Mascota
{
    private string nombre;
    private int edad;
    private string tipo;

    public Mascota(string nombre, int edad, string tipo)
    {
        this.nombre = nombre;
        this.edad = edad;
        this.tipo = tipo;
    }

    public void EmitirSonido()
    {
        Console.WriteLine("¡Guau! o ¡Miau!");
    }

    public void MostrarInfo()
    {
        Console.WriteLine($"Nombre: {nombre}, Edad: {edad}, Tipo: {tipo}");
    }
}


---

2.2 – Agregar métodos con parámetros y retorno (20 min)

1. Método setEdad:

public void SetEdad(int nuevaEdad)
{
    edad = nuevaEdad;
}

2. Método getEdad:

public int GetEdad()
{
    return edad;
}

3. Método calcularEdadHumana:

public int CalcularEdadHumana()
{
    return edad * 7;
}

Explica cómo llamar cada método desde Main y qué esperar de cada uno.


---

2.3 – Ejemplo en Main (10 min)

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


---

⏰ Hora 3 – Práctica, preguntas y cierre

3.1 – Actividad práctica (30 min)

Instrucciones:

Crear 2 mascotas con diferentes edades y tipos.

Llamar todos los métodos.

Cambiar la edad de una mascota usando setEdad.

Mostrar la edad humana antes y después del cambio.



---

3.2 – Reflexión y dudas (15 min)

¿Cuál fue la parte más difícil?

¿Qué pasa si no usamos get o set?

¿Para qué sirve retornar algo?



---

3.3 – Cierre (15 min)

Reforzar la idea de acceso controlado y reutilización.

Anunciar el siguiente tema: Constructores sobrecargados o Arreglos de objetos



---

¿Te gustaría que prepare también el Kahoot con 6-8 preguntas y un PDF imprimible con la guía de pseudocódigo y el ejercicio final?

