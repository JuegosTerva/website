# <i class="bi bi-git"></i> Subir al reposiorio de GitHub

## 1. Guarda cambios en tu staging area:

```bash
git add .
```

Esto agrega todos los archivos modificados (puedes usar `git add archivo.txt` si solo quieres uno).

---

## 2. Crea un *commit* (una foto de tus cambios):

```bash
git commit -m "TU-MENSAJE"
```

Ejemplo:

```bash
git commit -m "Agregué pantalla de inicio"
```

---

## 3. Sube tus cambios al repositorio remoto en GitHub:

```bash
git push origin TU-RAMA
```

> Reemplaza `TU-RAMA` con el nombre de tu rama (como `master` o `dev` o `main`).

---

## Si es la primera vez que subes:

Verifica que el repositorio remoto esté configurado:

```bash
git remote -v
```

Si **no aparece nada**, agrégalo:

```bash
git remote add origin https://github.com/usuario/repositorio.git
```

