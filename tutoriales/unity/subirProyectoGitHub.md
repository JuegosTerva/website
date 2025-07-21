### 💻 Prepara tu proyecto

1. Crea un proyecto Local en Unity. Recuerda no usar espacios o símbolos[^1] en el nombre. Usa letras, los números son opcionales.

2. Abre la consola en esta carpeta.

	> 📌 Nota: <br/>
	> Si estás en Windows usa Git Bash para los comandos.

3. Usa el comando `git init` para inicializar git.

1. Crea un repositorio público en GitHub, recuerda no usar espacios o símbolos en el nombre. Usa letras, los números son opcionales.

5. Copia el enlace HTTP de tu repositorio.
	
	![Es el botón verde que dice <Code>](imagenes/btnCode.png)

4. Usa el comando `git remote add origin URL` para enlazarlo con tu repositorio en línea.

	> 👀 Reemplaza URL con el enlace que acabas de copiar.

5. Crea un archivo `.gitignore`[^2] usando el comando `touch .gitignore`.

	![imagen señalando el boton de pegar](imagenes/gitignoreReferencia.png)

9. Abre el archivo, puedes usar el Block de Notas, y pega el contenido de [este gitignore](https://github.com/github/gitignore/blob/main/Unity.gitignore)

6. Usa el comando `git add .` para respaldar tu proyecto.

7. Haz un commit usando el comando `git commit -m "TU-MENSAJE"`

8. Sube tu commit con el comando `git push origin TU-RAMA`

	> 💭 Recuerda que en Windows puedes ver el nombre de tu rama entre paréntesis.

	[Foto de Git Bash]: #
