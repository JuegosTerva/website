# Desafío: Guerrero

> <i class="bi bi-exclamation-triangle-fill" style="color: #FF6600;"></i>
 Esta guía se encuentra en proceso de construcción. La última actualización fue realizada el 26 de julio, con mejoras en la creación de carpetas.


Crear un programa en consola que simule el entrenamiento de un guerrero.
El usuario podrá elegir entre diferentes actividades (como entrenar, pelear o descansar), cada una con efectos distintos en sus estadísticas: fuerza, resistencia, energía y experiencia.

Cada acción debe tener un costo (por ejemplo, gastar energía) y consecuencias (subir stats, perder una pelea, subir de nivel, etc.).

Tu programa debe tener:

* Un **menú interactivo** con `switch` que se repita hasta que el usuario decida salir.
* Al menos **una función por actividad** (por ejemplo: `VerEstado()`, `EntrenarFuerza()`, etc.).
* Uso de **operadores aritméticos, lógicos y de comparación**.
* **Condiciones** para que el jugador suba de nivel, se agote o pierda una batalla.
* Validaciones si el usuario quiere hacer algo sin suficiente energía, o se pasa del límite.
* Que cada entrenamiento o acción permita al usuario **decidir cuántas horas quiere invertir** (con un límite razonable, como 6).
* Uso de estructuras como `for`, `if`, `do-while`, etc., dentro del flujo normal del juego.

La idea es que escribas un programa **estructurado y funcional**, pero también divertido.

## 📚 Conceptos clave

### ... sobre programación
- [Tipos de datos](programacion/tiposDatos.md)
- [Estructuras de control](programacion/estructurasControl.md)

### ... sobre C#
- [Leer o imprimir en la consola](poo/console.md)

## 🖥️ Requisitos del sistema
Para trabajar en este proyecto necesitas tener instalado lo siguiente:

1. .NET SDK (Software Development Kit)
	Incluye todo lo necesario para compilar y ejecutar programas en C#.
	👉 Puedes descargarlo desde el sitio oficial: https://dotnet.microsoft.com/download
	📺 ¿No sabes cómo instalarlo? Aquí tienes un video con el paso a paso: [Juegos Terva | Cómo instalar C#](https://youtu.be/Uo5cf4e17MY?si=dMiWRoMMWchsiLH4)

2. Editor de código
	Te recomiendo usar Sublime Text por su ligereza y facilidad de uso. Puedes descargarlo aquí:
	https://www.sublimetext.com
	
## 🧠 Guía paso a paso

 

### 💻 Prepara tu proyecto

1. Abre la consola en la carpeta raíz, donde guardas tus proyectos.

	> 📌 Nota: <br/>
	> Si estás en Windows usa Git Bash.

	![carpeta donde guardas tus proyectos](git/assets/preLayout.png)

1. Crea una carpeta para guardar tu proyecto. Usa el comando `mkdir NOMBRE-CARPETA`. Recuerda no usar espacios o símbolos[^1] en el nombre. Usa letras, los números son opcionales.

	![mkdir Guerrero](CSharp/assets/mkdirGuerrero.png)

2. Usa el comando `cd NOMBRE-CARPETA` para entrar a la carpeta

	![cd Guerrero](CSharp/assets/cdGuerrero.png)

1. Crea un nuevo proyecto en tu computadora usando el comando `dotnet new console` 

	![dotnet new console](CSharp/assets/dotnetNewConsole.png)


3. Usa el comando `git init` para inicializar git.

	![git init](CSharp/assets/gitInit.png)

1. Crea un repositorio público en GitHub en blanco, recuerda no usar espacios o símbolos en el nombre. Usa letras, los números son opcionales. **NO** crees un ReadMe o un gitignore, eso lo haremos más adelante.

3. Pega el enlace del repositorio en la plataforma eStudy. 🧑🏻‍💻 

5. Copia el enlace HTTP de tu repositorio.
	
	![Es el enlace de Quick Setup](git/assets/quicksetup.png)

4. Usa el comando `git remote add origin URL` para enlazarlo con tu repositorio en línea.

	> 👀 Reemplaza URL con el enlace que acabas de copiar.

5. Crea un archivo `.gitignore`[^2] usando el comando `touch .gitignore`.

	![imagen señalando el boton de pegar](git/assets/gitignoreReferencia.png)

9. Abre el archivo, puedes usar el Block de Notas, y pega el contenido de [este gitignore](https://gist.github.com/takekazuomi/10955889)

6. Usa el comando `git add .` para respaldar tu proyecto.

	![git add .](git/assets/gitAdd.png)

7. Haz un commit usando el comando `git commit -m "TU-MENSAJE"`

	![git commit](git/assets/gitCommit.png)

8. Sube tu commit con el comando `git push origin TU-RAMA`

	> 💭 Recuerda que en Windows puedes ver el nombre de tu rama entre paréntesis.

	![git push](git/assets/gitPush.png)

### 📝 Elabora tu pseudocódigo

1. Usa el comando `touch pseudocodigo.md` para crear un archivo llamado pseudocodigo tipo Markdown[^3].

2. Analiza el problema y declara tus variables.

	**Por ejemplo:**
	`energia (int) ← 100`

	> Yo usé seis variables.</br>
	> Con cinco variables ya puedes continuar, si necesitas más, puedes regresar y hacer los cambios que hagan falta.

	
4. ¿Cuál es la estructura que controla el juego?

	* Observa el resultado del programa[^4].

	* ¿Cuáles son las dos estructuras de control que puedes identificar?

	* ¿Necesito repetir algo?

	* ¿Cuántas veces debe repetirse? ¿Un número conocido de veces? ¿Hasta que se cumpla una condición?

	* ¿Debe ejecutarse al menos una vez, aunque la condición no se cumpla?

	> 💡 Necesitarás un booleano para controlar esta estructura, con esto completas tus seis variables.

5. Añade tu menú con un `switch`[^5].

	![Resultado en la consola del menú](CSharp/assets/guerreroAxolotlMenu.png)

	Para la primer línea yo usé[^6]:

	`MOSTRAR "----- MENÚ -----"`

7. Crea tu método para mostrar la información

  **Diseña tu juego.**
8. ¿Cuál será el costo para ganar fuerza? ¿Cuánta fuerza ganará? ¿Ganará experiencia también? Anota todos los detalles

9. ¿Cuál será el costo para entrenar resistencia? ¿Cuánta resistencia ganará? ¿Ganará experiencia también? Anota todos los detalles

10. ¿Cómo avanzará de nivel?

11. ¿Cuántas horas de sueño requiere para recuperar su energía?

<!-- footnotes -->
[^1]: Por símbolos nos referimos a caracteres especiales como `@`, `#`, `!`, `?`, `%`, etc. Evítalos para que no haya problemas al compilar, guardar o abrir tu proyecto.

[^2]: Este archivo le dice a Git qué archivos o carpetas **no** debe guardar en el repositorio. Sirve para evitar subir cosas innecesarias, como archivos temporales, configuraciones locales o carpetas que genera el compilador.

[^3]: Es un lenguaje de marcado ligero que te permite escribir texto con formato (como negritas, cursivas, listas, enlaces, etc.) de forma simple y rápida. [Aquí hay un acordeón.](markdown-cheat-sheet.md)

[^4]: Usa las preguntas guía en [estructuras de control](programacion/estructurasControl.md)

[^5]: Revisa los [apuntes digitales sobre `switch`](programacion/infoSwitch.md).

[^6]: Revisa los [apuntes digitales sobre la clase `Console`](poo/console.md).
