Tutorial paso a paso para implementar un parallax background horizontal en Unity 2D, ideal para plataformas 

# ¿Qué es un Parallax Background?

Es una técnica visual donde los fondos se mueven más lento que los objetos en primer plano, creando una sensación de profundidad.

## Requisitos Previos

- Unity
- [Pixel Adventure Pack de Florassence](https://florassence.itch.io/pixel-adventure-pack)

## 🧠 Guía paso a paso

### 💻 Prepara tu proyecto

1. Crea un proyecto 2D en Unity. Recuerda no usar espacios o símbolos[^1] en el nombre. Usa letras, los números son opcionales.

    ![Crear proyecto 2D](unity/assets/crearProyecto2D.png)

1. Abre la consola en la carpeta, donde ves la carpeta `Assets`.

    > 📌 Nota: <br/>
    > Si estás en Windows usa Git Bash.

    ![carpeta donde ves `Assets`](git/assets/carpetaUnity.png)

3. Usa el comando `git init` para inicializar git.

    ![git init](git/assets/gitInit.png)

1. Crea un repositorio público en GitHub en blanco, recuerda **no** usar espacios o símbolos en el nombre. Usa letras, los números son opcionales. **NO** crees un ReadMe o un gitignore, eso lo haremos más adelante.

5. Copia el enlace HTTP de tu repositorio.

    ![Es el enlace de Quick Setup](git/assets/quicksetup.png)

4. Usa el comando `git remote add origin URL` para enlazarlo con tu repositorio en línea.

    > 👀 Reemplaza URL con el enlace que acabas de copiar.

5. usando el comando `touch .gitignore`, crea un archivo `.gitignore`[^2].

![imagen señalando el boton de pegar](git/assets/gitignoreReferencia.png)

9. Abre el archivo y pega el contenido de [este gitignore](https://github.com/github/gitignore/blob/main/Unity.gitignore)

6. Usa el comando `git add .` para respaldar tu proyecto.

    ![git add .](git/assets/gitAdd.png)

7. Haz un commit usando el comando `git commit -m "TU-MENSAJE"`

![git commit](git/assets/gitCommit.png)

8. Sube tu commit con el comando `git push origin TU-RAMA`

> 💭 Recuerda que en Windows puedes ver el nombre de tu rama entre paréntesis.

![git push](git/assets/gitPush.png)

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

```c#
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
```

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



[^1]: Por símbolos nos referimos a caracteres especiales como `@`, `#`, `!`, `?`, `%`, etc. Evítalos para que no haya problemas al compilar, guardar o abrir tu proyecto.

[^2]: Este archivo le dice a Git qué archivos o carpetas **no** debe guardar en el repositorio. Sirve para evitar subir cosas innecesarias, como archivos temporales, configuraciones locales o carpetas que genera el compilador.

[^3]: Es un lenguaje de marcado ligero que te permite escribir texto con formato (como negritas, cursivas, listas, enlaces, etc.) de forma simple y rápida. [Aquí hay un acordeón.](markdown-cheat-sheet.md)