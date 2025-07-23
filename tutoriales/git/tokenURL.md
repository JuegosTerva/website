# 🛠️ Tutorial: Actualizar la URL de `origin` con un token de GitHub

## ✅ Requisitos

* Tener un repositorio local
* Tener [tu token de GitHub (PAT)](git/tokenGitHub)
* Conocer el usuario y nombre del repositorio en GitHub

---

## Guía paso a paso

### 1. Ver la URL actual del `origin`

Abre una terminal dentro de tu repositorio y escribe:

```bash
git remote -v
```

Verás algo como:

```bash
origin  https://github.com/JuegosTerva/Mascotas.git (fetch)
origin  https://github.com/JuegosTerva/Mascotas.git (push)
```

---

### 2. Cambiar la URL para incluir el token

Forma tu nueva URL

```
https://USUARIO:TOKEN@github.com/USUARIO/REPO.git
```

Por ejemplo:

```
https://JuegosTerva:ghp_PCfIwy7vnDCRsXi3ppiszJvKvbiQAl2vbiyj@github.com/JuegosTerva/GitTutoriales.git
```

Usa este comando (reemplaza con tu URL personalizada):

```bash
git remote set-url origin NUEVAURL
```

*Este comando actualiza el remoto `origin` para que Git use el token en lugar de pedir tu contraseña.*

---

### 3. Verifica que se actualizó correctamente

```bash
git remote -v
```

Debe mostrar ahora la URL con tu token.

---

### 4. Sube tus cambios al repositorio

```bash
git push origin main
```

(usa `main` o `master`, según tu rama)