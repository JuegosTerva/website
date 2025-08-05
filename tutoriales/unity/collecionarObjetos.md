```c#
private void OnTriggerEnter2D(Collider2D collision)
{
    if (collision.CompareTag("Nido"))
    {
        Destroy(collision.gameObject);
        GameManager.instancia.SumarHuevo();
    }
    else if (collision.CompareTag("Trigo"))
    {
        Destroy(collision.gameObject);
        GameManager.instancia.SumarTrigo();
    }
}
```