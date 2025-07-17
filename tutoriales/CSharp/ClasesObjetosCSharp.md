# Clases y objetos

**Problema para resolver:** Queremos modelar una mascota. Cada mascota tiene un nombre, edad y tipo (perro, gato, etc), sonido. Debe poder hacer acciones como emitir sonido y mostrar su información.

Esta guía te ayudará a resolver la actividad paso a paso.

## 📚 Conceptos clave

1. Clases y objetos

> 💡 **Sugerencia** <br/>
> Revisa todo el documento antes de realizar el ejercicio.

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

1. Crea un repositorio público en GitHub, recuerda no usar espacios o símbolos en el nombre. Usa letras, los números son opcionales.

3. Pega el enlace del repositorio en la plataforma eStudy. 🧑🏻‍💻 

5. Copia el enlace HTTP de tu repositorio.
	
	![Es el botón verde que dice <>Code](assetsClasesObjetos/btnCode.png)

4. Usa el comando `git remote add origin URL` para enlazarlo con tu repositorio en línea.

	> Reemplaza URL con el enlace que acabas de copiar.

5. Crea un archivo `.gitignore`[^2] usando el comando `touch .gitignore`.

9. Abre el archivo, puedes usar el Block de Notas, y pega el contenido de [este gitignore](https://gist.github.com/takekazuomi/10955889)

6. Usa el comando `git add .` para respaldar tu proyecto.

7. Haz un commit usando el comando `git commit -m "TU-MENSAJE"`

8. Sube tu commit con el comando `git push origin TU-RAMA`

	> Recuerda que en Windows puedes ver el nombre de tu rama entre paréntesis.

	[Foto de Git Bash]: #

### 📝 Elabora tu pseudocódigo

11. Usa el comando `touch pseudocodigo.md` para crear un archivo llamado pseudocodigo tipo Markdown[^3].

11. Abre [la plantilla del pseudocódigo](pseudocodigoClasesObjetos.md).

	> Revisa el [ejemplo del pseudocódigo](https://github.com/JuegosTerva/ProductoNAtural/blob/a4e9a5686954d881f259e7e50e4fc1b7ea54e7a1/pseudocodigo.md), revisa [los enlaces de ayuda](#enlaces).

	1. Define la clase.  

		Recuerda usar las etiquetas de INICIO FIN

	2. Crea tus variables, ¿qué tipo de variables necesita cada atributo (características)?

	3. C

	[TIPOS DE DATOS]: #

	3. Crea tu constructor.

		> Aquí es donde creas la plantilla.

		> Recuerda usar las etiquetas de INICIO FIN

11. Sube tu pseudocódigo a la plataforma. 🧑🏻‍💻

12. Actualiza tu repositorio. Puedes guiarte de los pasos 6 a 8.

## 🧪 Resultado Esperado



# 📌 Enlaces de ayuda{#enlaces}

- Puedes ver un ejemplo de un programa resuelve el problema: *Queremos modelar una producto. Cada producto tiene un nombre, dias de vida y tipo (fruta o vegetal). Debe poder hacer acciones como  mostrar su información.* [Repositorio de Ejemplo](https://github.com/JuegosTerva/ProductoNAtural)

- [CheatSheet de Git (imagen PNG)](GitCheatSheet.png)

[^1]: Por símbolos nos referimos a caracteres especiales como `@`, `#`, `!`, `?`, `%`, etc. Evítalos para que no haya problemas al compilar, guardar o abrir tu proyecto.

[^2]: Este archivo le dice a Git qué archivos o carpetas **no** debe guardar en el repositorio. Sirve para evitar subir cosas innecesarias, como archivos temporales, configuraciones locales o carpetas que genera el compilador.

[^3]: Es un lenguaje de marcado ligero que te permite escribir texto con formato (como negritas, cursivas, listas, enlaces, etc.) de forma simple y rápida. [Aquí hay un acordeón.](markdown-cheat-sheet.md)