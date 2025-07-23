# Tipos de datos

> Enfocado a desarrollo de videojuegos

Cuando haces un juego, usas tipos de datos todo el tiempo. Por ejemplo:

- La vida del jugador podría ser un entero.

- La posición en el mapa puede ser un número real.

- El nombre del personaje es una cadena de texto.

- Si el enemigo está vivo o muerto, se representa con un booleano.

Entonces los **tipos de datos** son una forma de decirle a la computadora **qué tipo de información vamos a guardar** o usar en una variable. 

## Ejemplo con analogía

Imagina que tienes un archivador y cada cajon guarda diferente información, es como si etiquetaras cada caja para saber qué tiene adentro: números, texto, verdadero/falso, etc.

## ¿Porque es importante?

En programación, cada dato necesita tener un tipo, para que el programa sepa:

- Cuánta memoria usar.

- Qué operaciones puede hacer con ese dato.

## Tipos de datos:

> 🎮 Recuerda que está enfocado a desarrollo de videojuegos

|Tipo de dato|¿Qué guarda?|Ejemplo|
|----|---|---|
|int|Números enteros|5, -20, 100|
|float| Números reales |3.14, -0.5|
|char| Un solo carácter| 'a', 'Z', '%'|
|string|Cadena de caracteres| "Hola", "123"|
|bool| Valores lógicos| true, false|

## Enteros `int`

Representa números enteros sin decimales.

**Uso común**

Puedes usarlos para almacenar puntuación, vida, cantidad de enemigos, contador de monedas, etc.

**Ejemplo:**

`int vida = 100;`

`int puntos = 250;`
## Números reales `float`

Representa números reales (con punto decimal).

**Uso común**

Puedes usarlo para posiciones de una dimension, velocidades, rotaciones, tiempos, etc.

**Ejemplo:**

`float velocidad = 5.5f;`
`float tiempoRestante = 12.3f;`

## Booleanos bool

Solo puede ser true o false.

**Uso común**

Sirve para saber si algo está activo/inactivo, vivo/muerto, encendido/apagado, etc.

**Ejemplo:**

`bool estaSaltando = false;`

`bool nivelCompletado = true;`

## Cadenas de texto `string`

Guarda textos o palabras.

**Usos m´as com´unes**

Se usa para nombres de personajes, diálogos, mensajes en pantalla, etc.

**Ejemplo:**

 
`string nombreJugador = "Claudia";`

`string mensaje = "¡Game Over!";`


## Vector3 de Unity

Es un tipo nativo de Unity, muy usado en videojuegos 3D. Esta formado por 3 floats. Puede representar una posición, dirección o escala con tres dimenciones (x, y, z).

**Usos comunes**

Para mover al personaje dentro del juego.

**Ejemplo:**

`Vector3 posicion = new Vector3(0f, 5f, 10f);`


## Vector2 de Unity

Es un tipo nativo de Unity, muy usado en videojuegos 2D. Esta formado por 2 floats. Es similar a Vector3, pero con dos dimensiones (x, y).

**Usos comunes**
Para mover un personaje en un juego 2D.

**Ejemplo:**

`Vector2 direccion = new Vector2(1f, 0f);`


## GameObject de Unity

Representa cualquier objeto en la escena del juego.

**Usos comunes**

Puedes manipularlo, activarlo, destruirlo, modificar cualquiera de sus componentes etc.

**Ejemplo:**

```c#
public GameObject enemigo;
enemigo.SetActive(false);
```
