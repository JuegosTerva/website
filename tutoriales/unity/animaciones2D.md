# Tutorial: Animaciones en Unity 2D

## 🖥️ Requisitos previos

- Player con movimiento en cuatro direcciones
- Sprites de Sproud Lands

## 🧠 Guía paso a paso

### 💻 Prepara tu proyecto
1. **Abre tu proyecto de Unity 2D.**

2. Crea una carpeta llamada `Animaciones` dentro de tu carpeta `Assets` para mantener todo organizado.

3. Asegúrate de tener los **sprites** del personaje.

### Crear una animación

1. Arrastra todos los sprites **al mismo tiempo** al objeto `Sprite` en la `Hierarchy`.
2. Unity te pedirá guardar una animación. Guárdala en `Assets/Animations` como `Player_Walk.anim`.
3. Unity también creará automáticamente un `Animator Controller`, llamado `Player_Walk.controller`.

### Verifica el Animator

1. Selecciona el objeto `Player`.
2. En el `Inspector`, asegúrate de que el componente `Animator` tenga asignado el controlador correcto (`Player_Walk.controller`).
3. Haz clic en la pestaña `Animator` (arriba) para abrir el gráfico de estados.
4. Verás un estado llamado `Player_Walk`, que es la animación que se reproducirá por defecto.

### Probar la animación

1. Da Play al juego.
2. Deberías ver la animación de caminar reproducirse en bucle.

 
### Crear más animaciones (Idle, Jump, etc.)

1. Crea otras animaciones repitiendo el paso 3 pero usando otros sprites (ej: `idle_1`, `idle_2`).
2. Guarda como `Player_Idle.anim`, etc.

 
### Añadir transiciones entre animaciones

1. Abre el `Animator`.
2. Haz clic derecho sobre un estado y selecciona `Make Transition`, luego arrástralo a otro estado.
3. Haz clic en la flecha de la transición.
4. En el `Inspector`, añade una condición:

   * Clic en `+` (se añade un parámetro como `isWalking`).
   * Crea ese parámetro en el Animator (`Animator > Parameters > + > Bool`).

 
### Controlar animaciones por código

```csharp
public class PlayerController : MonoBehaviour
{
    Animator animator;

    void Start()
    {
        animator = GetComponent<Animator>();
    }

    void Update()
    {
        float move = Input.GetAxis("Horizontal");

        if (move != 0)
        {
            animator.SetBool("isWalking", true);
        }
        else
        {
            animator.SetBool("isWalking", false);
        }
    }
}
```

Este código hace que el personaje cambie de `Idle` a `Walk` si presionas izquierda o derecha.
