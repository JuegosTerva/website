# Jugador con movimiento horizontal

## Requisitos Previos

- [Pixel Adventure Pack de Florassence](https://florassence.itch.io/pixel-adventure-pack)

## 🧠 Guía paso a paso


### Prepara tu proyecto

1. Crea carpetas para tus `Sprites`, `Background`, `Scripts`, `Animaciones`, .

2. Elimina el InputPlayer. Aqui vamos a aprender a crearlo desde cero.

    ![Input Player](unity/assets/parallexBg/InputIcon.md)

3. Importa las imágenes necesarias. 

    ![Proyecto](unity/assets/parallexBg/assets.md)

### Estructura de objetos

1. Crea un Gameobject vacio y llamalo `Player`.

2. Añade los componentes `Sprite Renderer`, `Rigidbody 2D`, `Player Input`.

    > Recuerda quitar la gravedad

### Script para movimiento en X y salto con Input System

1. Crea un script `PlayerMovimiento.cs` 

```csharp
using UnityEngine;

public class PlayerMovimiento : MonoBehaviour
{
    public float velocidad = 5f;
    public float fuerzaSalto = 7f;
    public Transform sueloCheck;
    public LayerMask capaSuelo;

    private Rigidbody2D rb;
    private float direccionX;
    private bool enSuelo;

    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    void Update()
    {
        // Verifica si está tocando el suelo
        enSuelo = Physics2D.OverlapCircle(sueloCheck.position, 0.1f, capaSuelo);

        // Aplica el movimiento en X
        rb.velocity = new Vector2(direccionX * velocidad, rb.velocity.y);
    }

    // Método llamado desde el PlayerInput (eventos)
    public void Movimiento(UnityEngine.InputSystem.InputAction.CallbackContext context)
    {
        direccionX = context.ReadValue<float>();
    }

    public void Salto(UnityEngine.InputSystem.InputAction.CallbackContext context)
    {
        if (context.performed && enSuelo)
        {
            rb.velocity = new Vector2(rb.velocity.x, fuerzaSalto);
        }
    }
}
```

### Configurar Player Input (Input System)

1. Selecciona tu GameObject `Player`
2. Agrega el componente **Player Input**
3. En el campo **Behavior**, elige `Invoke Unity Events`
4. En **Events > Player Actions**, expande:

   * `Mover`: asigna `Movimiento` del script `PlayerMovimiento`
   * `Saltar`: asigna `Salto`

> Asegúrate de que tu `InputActions` tenga una acción `Mover` (tipo `Value` - `Axis`) y una `Saltar` (tipo `Button`).

### `sueloCheck`

Para saber si el personaje puede saltar:

1. Crea un **vacío** como hijo del `Player`, llámalo `SueloCheck`
2. Posiciónalo justo **debajo de los pies**
3. En el inspector de `PlayerMovimiento.cs`, arrástralo al campo `sueloCheck`
4. Crea un **Layer llamado "Suelo"**, asígnalo a tu piso, y marca ese Layer en `capaSuelo` del script