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

> 🎮 Recuerda que est´a enfocado a desarrollo de videojuegos

|Tipo de dato|¿Qué guarda?|Ejemplo|
|----|---|---|
|int|Números enteros|5, -20, 100|
|float| Números reales |3.14, -0.5|
|char| Un solo carácter| 'a', 'Z', '%'|
|string|Cadena de caracteres| "Hola", "123"|
|bool| Valores lógicos| true, false|

## Enteros ˋintˋ

Representa números enteros sin decimales.

**Uso común**

Puedes usarlos para almacenar puntuación, vida, cantidad de enemigos, contador de monedas, etc.

**Ejemplo:**

ˋint vida = 100;ˋ

ˋint puntos = 250;ˋ

## Números reales ˋfloatˋ

Representa números reales (con punto decimal).

**Uso común**

Puedes usarlo para posiciones de una dimensiˋon, velocidades, rotaciones, tiempos, etc.

**Ejemplo:**

ˋfloat velocidad = 5.5f;ˋ

ˋfloat tiempoRestante = 12.3f;ˋ

## Booleanos ˋboolˋ

Solo puede ser true o false.

**Uso común**

Sirve para saber si algo está activo/inactivo, vivo/muerto, encendido/apagado, etc.

**Ejemplo:**

ˋbool estaSaltando = false;ˋ

ˋbool nivelCompletado = true;ˋ

## Cadenas de texto ˋstringˋ

Guarda textos o palabras.

**Usos m´as com´unes**

Se usa para nombres de personajes, diálogos, mensajes en pantalla, etc.

**Ejemplo:**

 
`string nombreJugador = "Claudia";`

ˋstring mensaje = "¡Game Over!";ˋ


## Vector3 de Unity

- Es un tipo nativo de Unity, muy usado en videojuegos 3D.
- Esta formado por 3 floats
- Representa una posición, dirección o escala con tres dimenciones (x, y, z).

**Usos comunes**

Para mover al personaje dentro del juego.

**Ejemplo:**

Vector3 posicion = new Vector3(0f, 5f, 10f);


## Vector2 de Unity

- Es un tipo nativo de Unity, muy usado en videojuegos 2D.
- Esta formado por 2 floats
- Similar a Vector3, pero con dos dimensiones (x, y).

**Usos comunes**
Para mover un personaje en un juego 2D.

**Ejemplo:**

Vector2 direccion = new Vector2(1f, 0f);


## GameObject de Unity

Representa cualquier objeto en la escena del juego.

**Usos comunes**

Puedes manipularlo, activarlo, destruirlo, modificar cualquiera de sus componentes etc.

**Ejemplo:**

public GameObject enemigo;
enemigo.SetActive(false);
