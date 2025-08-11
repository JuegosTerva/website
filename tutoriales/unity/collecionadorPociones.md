# Coleccionador de pociones

## Guía paso a paso.

### Clona el proyecto

### Guarda tu escena

1. Guardar escena en la carpeta de escenas.

### Crea tu player
2. Añade un `Empty Gameobject` y lo nombras `Player`.
**Añade un sprite**
3. Le añades un componente `Sprite Renderer`.
4. Selecciona la imagen en el proyecto y modifica sus componentes en el inspector, en `pixeles por unit` pon `32`.

5. Asegurate de que esté cortada en el `Editor de sprites`.

6. Selecciona al `Player` para verlo en el inspector y arrastra el sprite hasta el parámetro `Sprite` del componente `Sprite Renderer`

	**Rigidbody 2D**

3. Añade un componente Rigidbody 2D

4. Modifica también su gravedad en `Gravity Scale` a `0`, ya que no queremos que lo afecte la gravedad.

5. en `Constraints` congela la rotación con `Freeze Rotation` `Z`.

	**Movimiento del jugador**

8. Para darle movimiento a nuestro jugador, vamos a usar el Input System. Añade el componente `Player Input`.

10. Añade el script `MovimientoJugador.cs`.

9. En `Behavior` selecciona `Invoke Unity Events`.

10. En `Events` despliega `Player` y en `Move` añade a la list con el símbolo +.

	![referencia de player input](unity/assets/ColeccionadorPociones/PlayerInput01.png)

11. En objeto arrastra el Player desde la Hierarchy.

12. En `Function` selecciona `Moverse`

	![referencia de player input](unity/assets/ColeccionadorPociones/PlayerInputFunction.png)