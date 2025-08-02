# Tutorial: Crear un NPC que se mueva por una zona y genere otros GameObjects

## Objetivo:
Tu reto: crear una gallinita (NPC) que camine dentro de una zona específica y que, cada cierto tiempo, ponga un huevito (GameObject). ¡La idea es que puedas tener varias gallinas haciendo lo mismo!

## 🔧 Requisitos previos

* Proyecto Unity 2D *La granja*.
* Scripts `MovimientoPorZona.cs` y `Ponedora.cs` en `Assets/Scripts/`.
* Un sprite para el NPC (por ejemplo, una gallina).
* Un sprite para el huevo.

## Guía paso a paso

### Preparar la zona de movimiento

1. Haz clic derecho en el `Hierarchy` → **Create Empty**.
2. Nómbralo `ZonaGallina`.
3. Agrega un componente **Box Collider 2D** (marca **Is Trigger**).
4. Ajusta el **tamaño** y posición del collider para delimitar el área.

### Crear el NPC

1. Haz clic derecho en `Hierarchy` → **Create Empty** → nómbralo `GallinaNPC`.
2. Añade el componente `Sprite Renderer` y asigna el sprite de la gallina.

   ![`Sprite Renderer`](unity/assets/gallinaNPC.png)

4. Añade los siguientes componentes:

   * `Rigidbody 2D` (marca **Body Type = Kinematic** y desactiva `Use Gravity`).
   * `Circle Collider 2D`

   ![`Sprite Renderer`](unity/assets/nuevosComponentesGallina.png)

### Crear script `Movimiento por zona.cs`

Este script hace que un personaje se mueva solo dentro de un área definida. Cada cierto tiempo, elige un punto aleatorio dentro de esa zona y se mueve hacia allá.

1. Crea las **variables públicas y privadas**

Vamos a necesitar estas variables:

* `zonaMovimiento`: un `Transform` que representa el área dentro de la cual el NPC puede moverse.
* `velocidad`: qué tan rápido se mueve el NPC.
* `rangoDetencion`: cuán cerca debe estar del destino para "detenerse".
* `tiempoEspera`: cada cuánto tiempo se elige un nuevo destino.

```csharp
public Transform zonaMovimiento;
public float velocidad = 2f;
public float rangoDetencion = 0.1f;
public float tiempoEspera = 2f;
```
* `objetivo`: la posición hacia la que el NPC está yendo.
* `moviendo`: indica si el NPC debe seguir moviéndose o detenerse.

```csharp
private Vector3 objetivo;
private bool moviendo = true;
```

2. **`Start()`: configuración inicial**

* `IEnumerator MovimientoPorTiempo()` es la coroutine que repetirá indefinidamente con el tiempo de espera.

```csharp
private void Start()
{
    StartCoroutine(MovimientoPorTiempo());
}

private IEnumerator MovimientoPorTiempo()
{
    // Ejecuta una vez inmediatamente
    ElegirNuevoDestino();

    while (true)
    {
        yield return new WaitForSeconds(tiempoEspera);
        ElegirNuevoDestino();
    }
}
```

3. **`Update()`: se mueve hacia el destino**

* Si `moviendo` es `true`, se mueve hacia el objetivo con `Vector3.MoveTowards`.
* Si ya está suficientemente cerca (`rangoDetencion`), deja de moverse hasta que tenga otro punto nuevo.

```csharp
private void Update()
{
    if (moviendo)
    {
        transform.position = Vector3.MoveTowards(transform.position, objetivo, velocidad * Time.deltaTime);

        if (Vector3.Distance(transform.position, objetivo) < rangoDetencion)
        {
            moviendo = false;
        }
    }
}
```

4. **`ElegirNuevoDestino()`: escoge una posición aleatoria dentro de la zona**

* Calcula un punto aleatorio dentro del área (`zonaMovimiento`).
* Usa la posición como centro y la escala como el tamaño del área.
* Conserva la `z` actual para que el NPC no suba o baje en 2D.
* Activa el movimiento hacia ese nuevo destino.

```csharp
private void ElegirNuevoDestino()
{
    Vector3 centro = zonaMovimiento.position;
    Vector3 escala = zonaMovimiento.localScale;

    float x = Random.Range(centro.x - escala.x / 2, centro.x + escala.x / 2);
    float y = Random.Range(centro.y - escala.y / 2, centro.y + escala.y / 2);
    float z = transform.position.z;

    objetivo = new Vector3(x, y, z);
    moviendo = true;
}
```

5. En el Inspector:

   * Arrastra el objeto `ZonaGallina` al campo `zonaMovimiento` en el script `MovimientoPorZona`.
   * Asegúrate que el `Sprite` esté como hijo de `GallinaNPC`.

### Crear el prefab del huevo

1. En `Hierarchy`, haz clic derecho → **2D Object → Sprite**, nómbralo `Huevo`.
2. Asigna un sprite de huevo.
3. Añade un componente `Circle Collider 2D` y `Rigidbody2D` si quieres que caiga.
4. Arrastra `Huevo` a la carpeta `Assets/Prefabs` para convertirlo en prefab.
5. Borra el objeto de la escena.

### Crear el script `Ponedora.cs`

Con este script, vamos a lograr que la `gallinaNPC` cree instancias de otro objeto **cada ciertos segundos**, **automáticamente** y de forma **infinita**, mientras la gallina esté en el juego.

1. Entender los componentes del script

   * `using UnityEngine;`: permite acceder a las funciones y clases de Unity (como MonoBehaviour, GameObject, etc.).
   * `using System.Collections;`: es necesario para usar **corutinas** (`IEnumerator`).

   ```csharp
   using UnityEngine;
   using System.Collections;
   ```
2. Declaración de la clase

   * `Ponedora` es el nombre del script, debe coincidir con el nombre del archivo.
   * Hereda de `MonoBehaviour`, lo que permite conectarlo a un GameObject en Unity.

   ```csharp
   public class Ponedora : MonoBehaviour
   ```

3. Variables públicas

* `prefabHuevo`: el objeto que se va a instanciar (como un huevo).
* `puntoDeSalida`: lugar donde aparecerá el objeto.
* `intervalo`: cada cuántos segundos aparecerá el huevo.

> Al hacerlas `public` en el Inspector podrás arrastrar y asignar estos valores visualmente.

```csharp
public GameObject prefabHuevo;
public Transform puntoDeSalida;
public float intervalo = 5f;
```

4. Iniciar el proceso con `Start()`

* El método `Start()` se ejecuta automáticamente al iniciar el juego.
* Llama a una **corutina** usando `StartCoroutine()`. Las corutinas permiten ejecutar procesos que se repiten o se pausen por tiempo sin bloquear el resto del juego.

```csharp
private void Start()
{
    StartCoroutine(PonerHuevosCadaTiempo());
}
```

5. La Coroutine

- **`IEnumerator`**: Tipo especial de función que permite pausarse (`yield return`) y continuar después.
- **`while (true)`**: crea un ciclo infinito — se seguirá ejecutando mientras el objeto exista.
- **`yield return new WaitForSeconds(intervalo);`**: espera el número de segundos definido en `intervalo`.
- **`Instantiate(...)`**: crea (instancia) una copia del prefab (`prefabHuevo`) en la posición deseada (`puntoDeSalida.position`) sin rotación (`Quaternion.identity`).

```csharp
private IEnumerator PonerHuevosCadaTiempo()
{
    while (true)
    {
        yield return new WaitForSeconds(intervalo);
        Instantiate(prefabHuevo, puntoDeSalida.position, Quaternion.identity);
    }
}
```

### Asigna la información correspondiente

1. En el Inspector del `GallinaNPC`, arrastra:

   * El prefab `Huevo` al campo `prefabHuevo`.
   * Un `Empty` hijo llamado `PuntoSalida` al campo `puntoDeSalida`, colócalo donde quieras que aparezcan los huevos (ej. bajo la gallina).



2. Probar

* Coloca al menos dos `ZonaGallina` y dos `GallinaNPC`, cada uno referenciado a su propia zona.
* Verifica que se muevan de forma independiente y que pongan huevos.
