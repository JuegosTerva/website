# Tutorial: Añadir panel de recursos

## 📚 Conceptos clave

- UI Toolkit

## Recursos

- [Sproud Lands UI de CupNooble](https://cupnooble.itch.io/sprout-lands-asset-pack)

## 🔄 Actualizar el repositorio

1. Abrir la terminal (o el GIT BASH) dentro de tu carpeta.

    > En el nivel donde ves una carpeta llamada `.git` y tienes tu `.gitignore`.

2. Usa el comando `git fetch`

3. Usa el comando `git status`

4. Usa el comando `git pull`

## 🧠 Guía paso a paso

### Prepara tu material

1. Descarga los recursos de Srout Lands

### Crear un archivo USS (estilos)

1. En tu proyecto de Unity crea una carpeta llamada UI.

2. Dentro, haz clic derecho > Create > UI Toolkit > StyleSheet → nómbralo InventarioStyle.uss.

3. Edita el USS con este contenido:

    ```
    #labelHuevos {
        font-size: 24px; /* cambia el tamaño de la letra */
        color: white; /* cambia el color a blanco */
        margin-left: 10px; /* margenes a la izquierda */
        margin-top: 10px; /* margenes arriba */
    }
    ```

### Crear un archivo UXML (interfaz visual)

1. En la misma carpeta UI, clic derecho > Create > UI Toolkit > UI Document → nómbralo InventarioUI.uxml.

    ![Captura de pantalla del menú para crear el UI Document](unity/assets/inventario/MenuUIDocument.png)

2. Ábrelo y agrega un nuevo `VisualElement` y renombralo `#barra-recursos`

    ![Inspector del UI Builder](unity/assets/inventario/nombreElementos.png)

3. En la Hierarchy, selecciona `#barra-recursos`. En la **Library**, arrastra un `VisualElement` al interior de `#barra-recursos`. Dale un nombre: por ejemplo, `#recursoHuevos`.

    ![Hierarchy](unity/assets/inventario/Hierarchy.png)

4. **Haz que ese `VisualElement` sea horizontal**

    * Con `#recursoHuevos` seleccionado:

      * Ve a la derecha al panel de `Inspector`.
      * En la sección **Flex**, cambia `Flex Direction` a `Row`.

      ![Flex Direction](unity/assets/inventario/flexRow.png)

3. **Agrega un VisualElement para el ícono**

    * Selecciona `#recursoHuevos`.
    * Arrastra un nuevo `VisualElement` dentro.
    * Este será tu **contenedor de imagen** (ícono).
    * Cámbiale el nombre a `#iconoHuevos`.
    * Ajusta el **tamaño** (en la pestaña *Size*): por ejemplo, `Width: 24px`, `Height: 24px`.

    ![Size](unity/assets/inventario/SizeBackground.png)


4. **Ponle imagen de fondo al ícono**

    * En la pestaña derecha, ve a **Background** → `Background Image`.
    * Si ya tienes un sprite o PNG en tu proyecto, arrástralo desde el *Project* a ese campo.
    * Si no, agrégalo a `Assets/Resources/UI/` y Unity lo reconocerá.

    ![Background](unity/assets/inventario/BackgroundUIBuilder.png)

#### 5. **Agrega un `Label` para mostrar el número**

* Arrastra un `Label` al lado derecho de `#iconoHuevos`.
* Cámbiale el texto a algo como `"0"`.
* Opcional: cámbiale el `name` a `#labelHuevos` si quieres accederlo desde código.

#### 6. **(Opcional) Aplica estilo en USS**

Crea un archivo `.uss` si no tienes uno, y usa algo como:

```css
#recursoHuevos {
    align-items: center;
    padding: 4px;
    background-color: #ddd;
    border-radius: 8px;
    margin-right: 10px;
}

#iconoHuevos {
    width: 24px;
    height: 24px;
    background-image: url("ui/huevo.png");
    background-size: cover;
    margin-right: 6px;
}

#labelHuevos {
    font-size: 14px;
    color: black;
}
```

---

## 🧠 Desde código (si lo necesitas luego)

```csharp
var labelHuevos = root.Q<Label>("labelHuevos");
labelHuevos.text = contadorHuevos.ToString();
```



3. Asócialo al archivo InventarioStyle.uss en la sección de estilos (abajo del inspector).

### Crear el UIDocument en la escena

1. Crea un `GameObject` vacío → nómbralo `UIManager`.

2. Agrégale el componente `UIDocument`.

3. Asigna el `InventarioUI.uxml` al campo `Source Asset`.

### Agrega un panel para mostrar el contador

1. En la misma carpeta UI, clic derecho > Create > UI Toolkit > Panel  → nómbralo PanelUI.

### Crear el script InventarioUI.cs

1. En tu carpeta de scripts, crea el script `InventarioUI.cs`. 

2. Importa lo básico de Unity, necesario para usar MonoBehaviour, GameObject, etc.

    `using UnityEngine;`

3. Importa lo necesario para trabajar con UI Toolkit (el sistema moderno de UI en Unity).

    `using UnityEngine.UIElements;`

### Crea tus variables

1. Una referencia privada al Label (etiqueta de texto) que vas a modificar.
 
    `private Label labelHuevos;`

2. Guarda el último valor mostrado en pantalla. Inicia en -1 para forzar la primera actualización.

    `private int huevosPrevios = -1;`

### Haz la configuración inicial de la UI:

1. Este método se llama automáticamente cuando el GameObject se activa (o entra en escena).

    `void OnEnable() {
    }`

5. Dentro del OnEnable, obtienes el rootVisualElement, que es la raíz del documento de UI asociado al objeto.

    `var root = GetComponent<UIDocument>().rootVisualElement;`

5. Busca dentro del árbol de UI un Label que tenga el nombre UXML "labelHuevos". Ese será el que vas a modificar.

    `labelHuevos = root.Q<Label>("labelHuevos");`

    ![Método On Enable](unity/assets/inventario/OnEnable.png)

### Verifica si el número de huevos cambió.

1. Este método se llama cada cuadro del juego (~60 veces por segundo).

    `void Update(){}`

6. Compara si[^2] el valor actual de huevos[^1] es diferente al último valor mostrado.

    ```c#
    if (GameManager.instancia.huevos != huevosPrevios){
        // aquí programa la actualización de la interfaz, paso siguiente
    }
    ```

6. Si cambió, actualiza el texto del Label y guarda el nuevo valor como "último conocido".

    ```c#
    huevosPrevios = GameManager.instancia.huevos;
    labelHuevos.text = $"Huevos: {huevosPrevios}";
    ```

### Asignar script

1. Asigna este script al mismo GameObject donde está el UIDocument (tu UIManager).

    ![Componente UIDocument del gameobject UIManager](unity/assets/inventario/UIDocument.png)

2. Prueba tu juego

[^1]: Una variable pública estática en GameManager, revisa [el ejercicio anterior]().
[^2]: Puedes revisar la estrucura condicional [`if/else`](programacion/infoIfElse.md).
