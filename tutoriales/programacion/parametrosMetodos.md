# Métodos con parámetros

Cuando un método **necesita información para hacer su trabajo**, se la puedes **pasar entre paréntesis**, y esa información se llama **parámetro**.

Los **parámetros** son como las **entradas** de una función o método.


## Ejemplo con analogía: “hacer un jugo” 🧃

Supón que tienes un método llamado `HacerJugo`.

```csharp
void HacerJugo(string fruta)
{
    Console.WriteLine("Estoy haciendo jugo de " + fruta);
}
```

En este ejemplo:

* `string fruta` es un **parámetro**.
* Al llamar al método, le tienes que **dar un valor**, por ejemplo:

```csharp
HacerJugo("naranja");
```

Resultado:
`Estoy haciendo jugo de naranja`


## ¿Qué tipos pueden tener los parámetros?

Puedes pasar casi **cualquier tipo de dato**: `int`, `string`, `bool`, `float`, e incluso **objetos**.

```csharp
void MostrarEdad(string nombre, int edad)
{
    Console.WriteLine(nombre + " tiene " + edad + " años");
}

MostrarEdad("Ana", 22);
// Salida: Ana tiene 22 años
```

---

### ¿Cómo se escriben?

Un método con parámetros se ve así:

```csharp
tipoDeRetorno NombreDelMetodo(tipo1 nombre1, tipo2 nombre2, ...){
    
}
```

Ejemplo:

```csharp
void Saludar(string nombre)
{
    Console.WriteLine("Hola, " + nombre);
}
```