# Gestor de Torneo de Ajedrez — integración 0.2.0

**MotorSuizo:** 0.2.0  
**Esquema de datos:** 1.1.0  
**Estado:** integración inicial de torneos independientes por categoría. El emparejador Dutch y los desempates siguen pendientes.

> No utilizar esta versión para generar pareos de un torneo real. `generarEmparejamientos()` permanece bloqueado intencionalmente. No se presenta ningún algoritmo heurístico como Sistema Dutch ni se afirma aprobación o certificación FIDE.

## Archivos

- `gestor_torneo_ajedrez_integrado.html`: aplicación web con padrón y sección de preparación de torneos.
- `motor_suizo.js`: lógica de negocio independiente.
- `test_motor_suizo.js`: pruebas automatizadas de la lógica implementada.

Mantén los tres archivos en la misma carpeta. Abre el HTML en Chrome.

## Qué hace esta integración

1. Conserva el padrón existente con los campos ID, nombre y categoría.
2. No cambia el formato CSV ni la clave de almacenamiento del padrón (`gestorAjedrezMVP_v1`).
3. Permite preparar un evento a partir de las categorías presentes en el padrón.
4. Crea un torneo independiente por categoría.
5. Permite establecer una cantidad de rondas distinta para cada categoría. La sugerencia se calcula con `ceil(log2(N))` y es solo orientativa.
6. Copia los participantes al crear cada torneo. Las modificaciones posteriores del padrón no actualizan retroactivamente esa copia.
7. Guarda el evento y los torneos en otra clave de almacenamiento (`gestorAjedrezTorneos_v1`), separada del padrón.
8. Permite iniciar cada categoría por separado. Al iniciarla, se congela su configuración.

Las categorías con menos de dos participantes se omiten al crear los torneos, porque no pueden formar un torneo suizo normal.

## Configuración por torneo

`crearTorneo` acepta ahora `configuracion` opcional. Esa configuración pertenece a la categoría y prevalece sobre la configuración general del evento.

```js
const configSub12 = {
  pairingSystem: 'DUTCH_2026',
  totalRounds: 5,
  initialOrder: 'alphabetical',
  initialColour: null,
  points: { win: 1, draw: 0.5, loss: 0, bye: 1 },
  tieBreaks: []
};

const resultado = MotorSuizo.crearTorneo({
  evento,
  categoria: 'Sub-12',
  participantes: participantesSub12,
  configuracion: configSub12
});
```

Cada torneo conserva su propio `configuracion.totalRounds`. Es válido que Sub-12 tenga 5 rondas y Sub-16 tenga 7.

## API relevante

- `obtenerConfiguracionPredeterminada()`
- `crearEvento({ id, nombre, fecha, sede, configuracion })`
- `crearTorneo({ evento, categoria, participantes, configuracion })`
- `inicializarTorneo({ torneo })`
- `iniciarTorneo({ evento, torneoId })`
- `sugerirRondas({ cantidadParticipantes })`
- `obtenerCategorias({ evento })`
- `obtenerEstadoTorneo({ torneo })`

Las demás funciones administrativas del motor permanecen documentadas en el código y conservan el contrato `{ ok, data, errors, warnings }`.

## Almacenamiento

- Padrón: `gestorAjedrezMVP_v1`.
- Evento y torneos: `gestorAjedrezTorneos_v1`.

Son datos separados. Esta integración todavía no incluye un centro de copias de seguridad/restauración completo; conserva copias manuales de tus datos antes de trabajar con información real.

## Limitaciones actuales

1. El generador Dutch está bloqueado con `DUTCH_ENGINE_NOT_READY`.
2. No se generan rondas ni emparejamientos desde la interfaz.
3. No hay desempates habilitados.
4. La pantalla actual prepara e inicia torneos por categoría, pero aún no incluye captura de resultados ni clasificación visible.
5. No se han ejecutado pruebas manuales en todos los navegadores ni pruebas de estrés con el padrón completo de 253 participantes.
6. No hay aprobación, aval, certificación ni validación oficial por FIDE u otra autoridad ajedrecística.

## Pruebas

Con Node.js instalado, desde la carpeta de los archivos ejecuta:

```bash
node --check motor_suizo.js
node test_motor_suizo.js
```

Las pruebas verifican el núcleo administrativo y que dos categorías puedan conservar cantidades de rondas distintas (por ejemplo, 3 y 5), incluso al iniciar ambas.
