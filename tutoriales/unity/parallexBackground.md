Tutorial paso a paso para implementar un parallax background horizontal en Unity 2D, ideal para plataformas 

# ¿Qué es un Parallax Background?

Es una técnica visual donde los fondos se mueven más lento que los objetos en primer plano, creando una sensación de profundidad.

## Requisitos Previos

- Unity
- [Pixel Advebture Pack de Florassence](https://florassence.itch.io/pixel-adventure-pack)

## Guía paso a paso

### Prepara tu proyecto

### Crea tu Player

### Prepara tus capas

1. Prepara tus capas de fondo

1. Crea un GameObject vacío y nómbralo ParallaxManager


2. Arrastra tus imágenes de fondo a la escena como hijos del ParallaxManager


3. Asegúrate de que estén ordenadas por profundidad, del fondo al frente:

Cielo (más atrás, menor movimiento)

Montañas

Árboles (más cerca, mayor movimiento)



4. Ajusta el Sorting Layer o Order in Layer para que se vean correctamente.

### Crea el script ParallaxEfecto.cs

using UnityEngine;

public class ParallaxEfecto : MonoBehaviour
{
    public Transform camara;              // Cámara principal
    public float velocidadParallax = 0.5f; // Cuánto se mueve esta capa
    private Vector3 posicionInicial;

    void Start()
    {
        posicionInicial = transform.position;
    }

    void Update()
    {
        float distancia = camara.position.x * velocidadParallax;
        transform.position = new Vector3(posicionInicial.x + distancia, posicionInicial.y, posicionInicial.z);
    }
}


### Asigna el script a tus capas

1. Agrega el script ParallaxEfecto.cs a cada GameObject de fondo.


2. En el Inspector:

Arrastra tu Main Camera al campo Camara

Ajusta el velocidadParallax para cada capa:

Cielo: 0.1

Montañas: 0.3

Árboles: 0.5

Suelo (si lo deseas): 0.8



> 💡 Entre menor el valor, más lejos parece estar.

### Prueba

Ejecuta la escena y mueve al personaje o la cámara. Verás que los fondos se mueven a distintas velocidades dando el efecto de profundidad.

### Scroll infinito



