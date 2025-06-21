using System;

//crear mis variables
int fecha;
string nombre;
float edad;

//Leer de la consola información para guardarla en mis variables.

//nombre
Console.WriteLine("Ingresa tu nombre:"); // escribe en la consola
nombre = Console.ReadLine(); //leer de la consola

//fecha Entero
Console.WriteLine("Ingresa tu año de nacimiento:"); // escribe en la consola
fecha = int.Parse(Console.ReadLine());

//edad
Console.WriteLine("Ingresa tu edad (edad.meses)");
edad = float.Parse(Console.ReadLine());

Console.WriteLine("Listo, terminé de leer."); // escribe en la consola
Console.WriteLine("Tus datos son:"); // escribe en la consola
Console.WriteLine($"Tú nombre es {nombre}"); // escribe en la consola