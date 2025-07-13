using UnityEngine;
using UnityEngine.InputSystem;

public class MovimientoJugador : MonoBehaviour
{
    public float velocidad = 5f;
    Rigidbody2D rb;
    public Vector2 entrada; //dirección -> entrada del usuario

    // Start is called once before the first execution of Update after the MonoBehaviour is created
    void Start()
    {
        rb = GetComponent<Rigidbody2D>();
    }

    // Update is called once per frame
    void Update()
    {
        rb.linearVelocity = entrada * velocidad;
    }

    public void Moverse(InputAction.CallbackContext contexto){
        
        Vector2 valorEntrada = contexto.ReadValue<Vector2>();

        // Determinar el eje dominante
        if (Mathf.Abs(valorEntrada.x) > Mathf.Abs(valorEntrada.y))
        {
            // Movimiento horizontal
            entrada = new Vector2(Mathf.Sign(valorEntrada.x), 0);
        }
        else if (Mathf.Abs(valorEntrada.y) > 0)
        {
            // Movimiento vertical
            entrada = new Vector2(0, Mathf.Sign(valorEntrada.y));
        }
        else
        {
            entrada = Vector2.zero;
        }
    }
}
