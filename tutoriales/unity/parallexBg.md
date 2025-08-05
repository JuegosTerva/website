Tutorial paso a paso para implementar un parallax background horizontal en Unity 2D, ideal para plataformas 

# ¿Qué es un Parallax Background?

Es una técnica visual donde los fondos se mueven más lento que los objetos en primer plano, creando una sensación de profundidad.

## Requisitos Previos

- Unity
- [Pixel Adventure Pack de Florassence](https://florassence.itch.io/pixel-adventure-pack)

## 🧠 Guía paso a paso

### 💻 Prepara tu repositorio

1. Crea un proyecto 2D en Unity. Recuerda no usar espacios o símbolos[^1] en el nombre. Usa letras, los números son opcionales.

    ![Crear proyecto 2D](unity/assets/crearProyecto2D.png)

1. Abre la consola en la carpeta, donde ves la carpeta `Assets`.

    > 📌 Nota: <br/>
    > Si estás en Windows usa Git Bash.

    ![carpeta donde ves `Assets`](git/assets/carpetaUnity.png)

3. Usa el comando `git init` para inicializar git.

    ![git init](git/assets/gitInit.png)

1. Crea un repositorio público en GitHub en blanco, recuerda **no** usar espacios o símbolos[^1] en el nombre. Usa letras, los números son opcionales. **NO** crees un ReadMe o un gitignore, eso lo haremos más adelante.

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

### 📂 Prepara tu proyecto

1. Crea carpetas para tus `Sprites`, `Background`, `Scripts`.

2. Elimina el InputPlayer.

    ![Input Player](unity/assets/parallexBg/InputIcon.md)

3. Importa las imágenes necesarias. 

    ![Proyecto](unity/assets/parallexBg/assets.md)

### Crea tu Player

1. Crea un `Empty Object` y nombralo `Player`

2. Añade los componentes: `Rigidbody 2D`, `Sprite Renderer`, `Capsule Collider 2D`, `PlayerInput`

    ![Componentes Player](unity/assets/parallexBg/componentesPlayer.md)

3. Crea el script `MovimientoPlayer.cs`

### Prepara tus capas

1. Prepara tus capas de fondo

1. Crea un `GameObject` vacío y nómbralo `ParallaxManager`

2. Arrastra tus imágenes de fondo a la escena como hijos del `ParallaxManager`

3. Asegúrate de que estén ordenadas por profundidad, del fondo al frente:

    - Cielo (más atrás, menor movimiento)

    - Montañas

    - Árboles (más cerca, mayor movimiento)

4. Ajusta el Sorting Layer para que se vean correctamente.

### Script ParallaxEfecto.cs

1. En la carpeta de scripts crea uno llamado `ParallexEfecto.cs`

    #### Variables

2. Define `camara` como un  `Transform` que se usará como referencia para el efecto parallax. Se asigna desde el editor de Unity.
 
    ```csharp
    public Transform cam;
    ```

2. Define `parallaxFactor` como `float` para saber qué tanto se mueve este fondo comparado con la cámara. 

    * Valores:

      * `0` → fondo fijo
      * `0.5` → efecto parallax típico
      * `1` → fondo se mueve igual que la cámara

    ```csharp
    public float parallaxFactor;
    ```
 
3. Define `inicioX` como `float` para guardar la posición `x` **original** del objeto al iniciar el juego.

    ```csharp
    private float inicioX;
    ```

4. Define `anchoSprite` como `float` para guardar el **ancho** del sprite para saber cuándo hay que hacerlo infinito.

    ```csharp
    private float spriteWidth;
    ```

    #### Método `Start()`

1. Guarda la posición `x` actual del objeto donde se encuentra en script en `inicioX`.

    ```csharp
    inicioX = transform.position.x;
    ```

2. Obten el ancho total del sprite (en Unity el `bounds.size.x`) para saber cuánto mide en pantalla.

    ```csharp
        anchoSprite = GetComponent<SpriteRenderer>().bounds.size.x;
    ```

    #### Método `Update()`

3. El efecto parallax depende del movimiento de la cámara en tiempo real, por eso en cada frame se calcula cuánto se ha movido la cámara.

    Define `temp` como `float`. Si el `parallaxFactor` es `1` (el fondo se mueve igual que la cámara), `temp = 0`. Si el `parallaxFactor` es `0.5`, entonces `temp` acumula la diferencia.

    ```csharp
    float temp = (cam.position.x * (1 - parallaxFactor));
    ```

4. Calcula la distancia de cuánto se ha movido la cámara.

    Define `dist` como `float` y almacena el desplazamiento horizontal que debe tener este fondo, proporcional al movimiento de la cámara.

    ```csharp
    float dist = (cam.position.x * parallaxFactor);
    ```

5. Mueve el fondo horizontalmente.
    
    El fondo no sigue directamente a la cámara: se mueve por `dist`.
    Crea un nuevo vector de 3 dimensiones.

    ```csharp
    transform.position = new Vector3(inicioX + dist, transform.position.y, transform.position.z);
    ```

6. Programa el scroll infinito.

    Si `temp` se aleja mucho hacia la derecha, significa que la cámara "ya se fue", entonces adelantamos `inicioX` para colocar este fondo **más adelante**, como si fuera otro. Sino si `temp` se aleja a la izquierda, hacemos lo contrario.

    Así el fondo **se repite infinitamente** sin necesidad de instanciar nuevos objetos.

    ```csharp
    if (temp > inicioX + spriteWidth) inicioX += spriteWidth;
    else if (temp < inicioX - spriteWidth) inicioX -= spriteWidth;
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