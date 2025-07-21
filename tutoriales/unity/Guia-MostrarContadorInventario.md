# Guía: Mostrar contadorHuevos con UI Toolkit

## Crear un archivo USS (estilos)

1. Crea una carpeta llamada UI.


2. Dentro, haz clic derecho > Create > UI Toolkit > StyleSheet → nómbralo InventarioStyle.uss.


3. Edita el USS con este contenido:

```
#labelHuevos {
    font-size: 24px;
    color: white;
    unity-font-style: bold;
    margin-left: 10px;
    margin-top: 10px;
}
```


## Crear un archivo UXML (interfaz visual)

1. En la misma carpeta UI, clic derecho > Create > UI Toolkit > UI Document → nómbralo InventarioUI.uxml.

2. Ábrelo y agrega un Label con estos valores:

```
Name: labelHuevos
Text: Huevos: 0
```

3. Asócialo al archivo InventarioStyle.uss en la sección de estilos (abajo del inspector).

## Crear el UIDocument en la escena

1. Crea un GameObject vacío → nómbralo UIManager.

2. Agrégale el componente UIDocument.

3. Asigna el InventarioUI.uxml al campo Source Asset.

## Crear el script ContadorHuevosUI.cs

1. En tu carpeta de scripts, crea el script ContadorHuevosUI.cs y ponle esto:

```
using UnityEngine;
using UnityEngine.UIElements;

public class ContadorHuevosUI : MonoBehaviour
{
    private Label labelHuevos;
    private int huevosPrevios = -1;

    void OnEnable()
    {
        var root = GetComponent<UIDocument>().rootVisualElement;
        labelHuevos = root.Q<Label>("labelHuevos");
    }

    void Update()
    {
        if (GameManager.contadorHuevos != huevosPrevios)
        {
            huevosPrevios = GameManager.contadorHuevos;
            labelHuevos.text = $"Huevos: {huevosPrevios}";
        }
    }
}
```

2. Asigna este script al mismo GameObject donde está el UIDocument (tu UIManager).

## Asegúrate de tener esto en tu GameManager

```
public class GameManager : MonoBehaviour
{
    public static int contadorHuevos = 0;

    // Aumentar huevos (ejemplo):
    public static void AgregarHuevo()
    {
        contadorHuevos++;
    }
}
```