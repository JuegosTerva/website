```
public float velocidad = 5f;
    Rigidbody2D rb;
    public Vector2 entrada;
    public Animator animator;
    public GameObject preFabTrigo;
```

```
public void SembrarTrigo(InputAction.CallbackContext contexto){
     if(contexto.started) {
        Instantiate(preFabTrigo ,transform.position, Quaternion.identity);
     }  
    }
```