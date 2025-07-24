# Desafío: Guerrero

Vas a crear un programa en consola que simule el entrenamiento de un guerrero.
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

1. Crea una carpeta para guardar tu proyecto. Recuerda no usar espacios o símbolos[^1] en el nombre. Usa letras, los números son opcionales.

2. Abre la consola en esta carpeta.

	> 📌 Nota: <br/>
	> Si estás en Windows usa Git Bash para los comandos.

1. Crea un nuevo proyecto en tu computadora usando el comando `dotnet new console` 

3. Usa el comando `git init` para inicializar git.

1. Crea un repositorio público en GitHub en blanco, recuerda no usar espacios o símbolos en el nombre. Usa letras, los números son opcionales. **NO** crees un ReadMe o un gitignore, eso lo haremos más adelante.

3. Pega el enlace del repositorio en la plataforma eStudy. 🧑🏻‍💻 

5. Copia el enlace HTTP de tu repositorio.
	
	![Es el el enlace de Quick Setup](git/assets/quicksetuop.png)

4. Usa el comando `git remote add origin URL` para enlazarlo con tu repositorio en línea.

	> 👀 Reemplaza URL con el enlace que acabas de copiar.

5. Crea un archivo `.gitignore`[^2] usando el comando `touch .gitignore`.

	![imagen señalando el boton de pegar](imagenes/gitignoreReferencia.png)

9. Abre el archivo, puedes usar el Block de Notas, y pega el contenido de [este gitignore](https://gist.github.com/takekazuomi/10955889)

6. Usa el comando `git add .` para respaldar tu proyecto.

7. Haz un commit usando el comando `git commit -m "TU-MENSAJE"`

8. Sube tu commit con el comando `git push origin TU-RAMA`

	> 💭 Recuerda que en Windows puedes ver el nombre de tu rama entre paréntesis.

	[Foto de Git Bash]: #

### 📝 Elabora tu pseudocódigo

1. Usa el comando `touch pseudocodigo.md` para crear un archivo llamado pseudocodigo tipo Markdown[^3].

2. Analiza el problema y declara tus variables.

	**Por ejemplo:**
	`energia (int) ← 100`

	> Yo usé seis variables.

3. 

<!-- footnotes -->
[^1]: Por símbolos nos referimos a caracteres especiales como `@`, `#`, `!`, `?`, `%`, etc. Evítalos para que no haya problemas al compilar, guardar o abrir tu proyecto.

[^2]: Este archivo le dice a Git qué archivos o carpetas **no** debe guardar en el repositorio. Sirve para evitar subir cosas innecesarias, como archivos temporales, configuraciones locales o carpetas que genera el compilador.

[^3]: Es un lenguaje de marcado ligero que te permite escribir texto con formato (como negritas, cursivas, listas, enlaces, etc.) de forma simple y rápida. [Aquí hay un acordeón.](markdown-cheat-sheet.md)
