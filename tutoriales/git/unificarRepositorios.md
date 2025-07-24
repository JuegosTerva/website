# Unificar repositorios haciendo merge de `master` en `main`

Esto copia el contenido de `master` hacia `main`.

## Te cambias a la rama main

```bash
git checkout main
```

## Asegúrate de tener la versión más reciente

```bash         
git pull                   
```

## Haces el merge de master en main
```bash
git merge master           
```

Si hay conflictos, Git te los va a marcar y te tocará resolverlos manualmente. 

## Guarda los cambios

```bash
git add .
git commit -m "Merge de master en main"
```

# 📌 Recomendación

Si estás trabajando tú sola o si quieres unificar las cosas, podrías considerar dejar solo una rama principal (por ejemplo, `main`) y borrar la otra:

```bash
git branch -d master       # Borra localmente la rama master (después de hacer merge)
git push origin --delete master  # Borra la rama master del remoto
```

⚠️ Asegúrate de no borrar nada si no estás segura de que ya está todo fusionado.

