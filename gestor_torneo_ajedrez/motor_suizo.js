/*
 * MotorSuizo - nucleo independiente para gestion de torneos suizos.
 * Versión de desarrollo: 0.2.0
 *
 * IMPORTANTE:
 * - No accede al DOM ni a almacenamiento del navegador.
 * - No modifica los objetos recibidos; devuelve copias.
 * - El generador de emparejamientos suizo simplificado aún no está implementado.
 *   generarEmparejamientos() falla de forma segura hasta completar sus reglas y pruebas.
 * - No declarar este archivo apto para arbitraje oficial.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.MotorSuizo = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const VERSION = '0.2.0';
  const SCHEMA_VERSION = '1.0.0';
  const DEFAULT_CONFIG = Object.freeze({
    pairingSystem: 'SIMPLE_SWISS',
    totalRounds: null,
    initialOrder: 'alphabetical',
    initialColour: null,
    points: Object.freeze({ win: 1, draw: 0.5, loss: 0, bye: 1, forfeitWin: 1, forfeitLoss: 0, doubleForfeit: 0 }),
    tieBreaks: Object.freeze([])
  });

  const SUPPORTED_TIEBREAKS = Object.freeze([]); // Se habilitan solo al implementar fórmula y rondas no jugadas.
  const clone = value => value == null ? value : JSON.parse(JSON.stringify(value));
  const now = () => new Date().toISOString();
  const asText = value => String(value == null ? '' : value).trim();
  const normalize = value => asText(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('es');
  const ok = data => ({ ok: true, data, errors: [], warnings: [] });
  const fail = (code, message, details) => ({
    ok: false, data: null,
    errors: [{ code, message, ...(details === undefined ? {} : { details }) }],
    warnings: []
  });
  const warning = (data, code, message) => ({ ok: true, data, errors: [], warnings: [{ code, message }] });

  function assertObject(value, name) {
    return value && typeof value === 'object' && !Array.isArray(value)
      ? null : { code: 'INVALID_ARGUMENT', message: `${name} debe ser un objeto.` };
  }

  function validarParticipantesInterno(lista) {
    const errors = [];
    if (!Array.isArray(lista) || lista.length === 0) {
      return [{ code: 'INVALID_PLAYER_LIST', message: 'La lista de participantes debe contener al menos un registro.' }];
    }
    const seen = new Set();
    lista.forEach((p, i) => {
      if (!p || typeof p !== 'object' || Array.isArray(p)) {
        errors.push({ code: 'INVALID_PLAYER', message: `El participante en la posición ${i + 1} no es un objeto.` });
        return;
      }
      const id = asText(p.id);
      const name = asText(p.name);
      const category = asText(p.category);
      if (!id || !name || !category) errors.push({ code: 'INVALID_PLAYER', message: `El participante en la posición ${i + 1} requiere ID, nombre y categoría.` });
      const key = normalize(id);
      if (key && seen.has(key)) errors.push({ code: 'DUPLICATE_PLAYER_ID', message: `El ID ${id} está duplicado.` });
      if (key) seen.add(key);
    });
    return errors;
  }

  function normalizarConfiguracion(config = {}) {
    const source = config && typeof config === 'object' && !Array.isArray(config) ? config : {};
    return {
      ...clone(DEFAULT_CONFIG),
      ...clone(source),
      pairingSystem: source.pairingSystem === 'DUTCH_2026' || source.pairingSystem == null ? 'SIMPLE_SWISS' : source.pairingSystem,
      points: {
        ...clone(DEFAULT_CONFIG.points),
        ...(source.points && typeof source.points === 'object' && !Array.isArray(source.points) ? clone(source.points) : {})
      },
      tieBreaks: Array.isArray(source.tieBreaks) ? clone(source.tieBreaks) : clone(DEFAULT_CONFIG.tieBreaks)
    };
  }

  function validarConfiguracionInterna(config) {
    const errors = [];
    if (!config || typeof config !== 'object' || Array.isArray(config)) return [{ code: 'INVALID_CONFIGURATION', message: 'La configuración debe ser un objeto.' }];
    if (config.pairingSystem !== 'SIMPLE_SWISS') errors.push({ code: 'INVALID_CONFIGURATION', message: 'Esta versión admite el sistema suizo simplificado.' });
    if (config.totalRounds != null && (!Number.isInteger(config.totalRounds) || config.totalRounds < 1)) errors.push({ code: 'INVALID_CONFIGURATION', message: 'totalRounds debe ser un entero positivo.' });
    if (config.initialOrder !== 'alphabetical') errors.push({ code: 'INVALID_CONFIGURATION', message: 'initialOrder debe ser alphabetical en esta versión.' });
    if (config.initialColour != null && !['white', 'black'].includes(config.initialColour)) errors.push({ code: 'INVALID_CONFIGURATION', message: 'initialColour debe ser white, black o null.' });
    const points = config.points;
    const pointKeys = ['win', 'draw', 'loss', 'bye', 'forfeitWin', 'forfeitLoss', 'doubleForfeit'];
    if (!points || typeof points !== 'object' || Array.isArray(points)) errors.push({ code: 'INVALID_CONFIGURATION', message: 'Falta la configuración points.' });
    else pointKeys.forEach(k => {
      if (!Number.isFinite(points[k]) || points[k] < 0) errors.push({ code: 'INVALID_CONFIGURATION', message: `points.${k} debe ser un número finito no negativo.` });
    });
    if (points && Number.isFinite(points.win) && Number.isFinite(points.draw) && Number.isFinite(points.loss)) {
      if (!(points.win > points.draw && points.draw > points.loss)) errors.push({ code: 'INVALID_CONFIGURATION', message: 'La puntuación de partidas jugadas debe cumplir win > draw > loss.' });
    }
    if (config.tieBreaks != null && !Array.isArray(config.tieBreaks)) errors.push({ code: 'INVALID_CONFIGURATION', message: 'tieBreaks debe ser un arreglo.' });
    else (config.tieBreaks || []).forEach(t => {
      if (!SUPPORTED_TIEBREAKS.includes(t)) errors.push({ code: 'INVALID_TIEBREAK', message: `El desempate ${t} todavía no está implementado y no puede activarse.` });
    });
    return errors;
  }

  function sugerirRondasInterno(n) {
    if (!Number.isInteger(n) || n < 2) return null;
    // Aproximación orientativa: ceil(log2(N)); no es una regla universal.
    return Math.max(1, Math.ceil(Math.log2(n)));
  }

  function obtenerTorneo(evento, torneoId) {
    const torneo = evento.torneos.find(t => t.id === torneoId);
    return torneo || null;
  }

  function reemplazarTorneo(evento, torneoActualizado) {
    const copia = clone(evento);
    const index = copia.torneos.findIndex(t => t.id === torneoActualizado.id);
    if (index < 0) return null;
    copia.torneos[index] = clone(torneoActualizado);
    return copia;
  }

  function obtenerRondaInterna(torneo, rondaId) {
    return torneo.rondas.find(r => r.id === rondaId) || null;
  }

  function obtenerPartida(ronda, partidaId) {
    return ronda.emparejamientos.find(p => p.id === partidaId) || null;
  }

  function puntuarResultado(result, points, tipoResultado = 'jugado') {
    if (result === 'double-forfeit' || tipoResultado === 'doble_incomparecencia') {
      return { white: points.doubleForfeit, black: points.doubleForfeit, whiteOutcome: 'double_forfeit', blackOutcome: 'double_forfeit' };
    }
    if (tipoResultado === 'incomparecencia') {
      if (result === '1-0') return { white: points.forfeitWin, black: points.forfeitLoss, whiteOutcome: 'win', blackOutcome: 'loss' };
      if (result === '0-1') return { white: points.forfeitLoss, black: points.forfeitWin, whiteOutcome: 'loss', blackOutcome: 'win' };
    }
    if (result === '1-0') return { white: points.win, black: points.loss, whiteOutcome: 'win', blackOutcome: 'loss' };
    if (result === '0-1') return { white: points.loss, black: points.win, whiteOutcome: 'loss', blackOutcome: 'win' };
    if (result === '0.5-0.5') return { white: points.draw, black: points.draw, whiteOutcome: 'draw', blackOutcome: 'draw' };
    return null;
  }

  function construirClasificacion(torneo) {
    const points = torneo.configuracion.points;
    const rows = torneo.participantes.map(p => ({
      playerId: p.playerId, nombre: p.name, categoria: p.category,
      numeroEmparejamiento: p.numeroEmparejamiento,
      estado: p.estado, puntos: 0, partidasJugadas: 0,
      victorias: 0, tablas: 0, derrotas: 0,
      victoriasBlancas: 0, victoriasNegras: 0,
      byes: 0, resultadosAdministrativos: 0, doblesIncomparecencias: 0
    }));
    const byId = new Map(rows.map(r => [r.playerId, r]));
    for (const ronda of torneo.rondas) {
      if (ronda.estado === 'draft') continue;
      for (const partida of ronda.emparejamientos) {
        if (!partida.resultado) continue;
        const w = byId.get(partida.blancas), b = byId.get(partida.negras);
        if (!w || !b) continue;
        const scored = puntuarResultado(partida.resultado, points, partida.tipoResultado);
        if (!scored) continue;
        w.puntos += scored.white; b.puntos += scored.black;
        if (partida.jugado === true) {
          w.partidasJugadas++; b.partidasJugadas++;
        } else {
          w.resultadosAdministrativos++; b.resultadosAdministrativos++;
        }
        if (scored.whiteOutcome === 'double_forfeit') { w.doblesIncomparecencias++; b.doblesIncomparecencias++; }
        if (scored.whiteOutcome === 'win') { w.victorias++; w.victoriasBlancas++; }
        if (scored.whiteOutcome === 'draw') w.tablas++;
        if (scored.whiteOutcome === 'loss') w.derrotas++;
        if (scored.blackOutcome === 'win') { b.victorias++; b.victoriasNegras++; }
        if (scored.blackOutcome === 'draw') b.tablas++;
        if (scored.blackOutcome === 'loss') b.derrotas++;
      }
      for (const bye of ronda.byes) {
        const p = byId.get(bye.jugadorId);
        if (p) { p.puntos += bye.puntos; p.byes++; }
      }
    }
    rows.sort((a, b) => b.puntos - a.puntos || a.numeroEmparejamiento - b.numeroEmparejamiento);
    let position = 0;
    let lastScore = null;
    rows.forEach((r, i) => {
      if (lastScore === null || r.puntos !== lastScore) position = i + 1;
      r.posicion = position;
      lastScore = r.puntos;
    });
    return rows;
  }

  const MotorSuizo = {
    version: VERSION,
    schemaVersion: SCHEMA_VERSION,
    estadoEmparejador: 'PENDIENTE_IMPLEMENTACION_SISTEMA_SUIZO_SIMPLIFICADO',

    obtenerConfiguracionPredeterminada() { return ok(clone(DEFAULT_CONFIG)); },

    normalizarConfiguracion({ configuracion } = {}) {
      const normalized = normalizarConfiguracion(configuracion);
      const errors = validarConfiguracionInterna(normalized);
      return errors.length ? { ok: false, data: null, errors, warnings: [] } : ok(normalized);
    },

    validarParticipantes({ participantes } = {}) {
      const errors = validarParticipantesInterno(participantes);
      return errors.length ? { ok: false, data: null, errors, warnings: [] } : ok({ cantidad: participantes.length });
    },

    validarConfiguracionEvento({ configuracion } = {}) {
      const errors = validarConfiguracionInterna(configuracion);
      return errors.length ? { ok: false, data: null, errors, warnings: [] } : ok({ valida: true });
    },

    sugerirRondas({ cantidadParticipantes } = {}) {
      const n = Number(cantidadParticipantes);
      if (!Number.isInteger(n) || n < 2) return fail('INVALID_PLAYER_COUNT', 'cantidadParticipantes debe ser un entero mayor o igual a 2.');
      return warning({ cantidad: sugerirRondasInterno(n), metodo: 'ceil(log2(N))' }, 'ROUNDS_ARE_SUGGESTED', 'La cantidad es una aproximación orientativa; el organizador debe confirmarla.');
    },

    crearEvento({ id, nombre, fecha = null, sede = '', configuracion } = {}) {
      if (!asText(id) || !asText(nombre)) return fail('INVALID_EVENT', 'El evento requiere id y nombre.');
      const configNormalizada = normalizarConfiguracion(configuracion || clone(DEFAULT_CONFIG));
      const errors = validarConfiguracionInterna(configNormalizada);
      if (errors.length) return { ok: false, data: null, errors, warnings: [] };
      return ok({
        id: asText(id), nombre: asText(nombre), fecha, sede: asText(sede), estado: 'configuracion',
        configuracion: clone(configNormalizada), torneos: [],
        versionEsquema: SCHEMA_VERSION, creadoEn: now(), iniciadoEn: null
      });
    },

    actualizarConfiguracionEvento({ evento, configuracion } = {}) {
      if (!evento || !Array.isArray(evento.torneos)) return fail('INVALID_EVENT', 'Evento inválido.');
      if (evento.estado !== 'configuracion') return fail('EVENT_ALREADY_STARTED', 'La configuración queda bloqueada cuando inicia el primer torneo.');
      const configNormalizada = normalizarConfiguracion(configuracion);
      const errors = validarConfiguracionInterna(configNormalizada);
      if (errors.length) return { ok: false, data: null, errors, warnings: [] };
      const copy = clone(evento); copy.configuracion = clone(configNormalizada);
      return ok(copy);
    },

    obtenerCategorias({ evento } = {}) {
      if (!evento || !Array.isArray(evento.torneos)) return fail('INVALID_EVENT', 'Evento inválido.');
      return ok(evento.torneos.map(t => t.categoria));
    },

    crearTorneo({ evento, categoria, participantes, configuracion } = {}) {
      if (!evento || !Array.isArray(evento.torneos))
      return fail('INVALID_EVENT', 'Evento inválido.');

      if (evento.estado !== 'configuracion')
        return fail('EVENT_ALREADY_STARTED', 'No se pueden agregar categorías después de iniciar el evento.');

      const cat = asText(categoria);

      if (!cat)
        return fail('INVALID_CATEGORY', 'La categoría es obligatoria.');

      if (evento.torneos.some(t => normalize(t.categoria) === normalize(cat)))
        return fail('DUPLICATE_CATEGORY', `La categoría ${cat} ya existe.`);

      const errors = validarParticipantesInterno(participantes);

      if (errors.length)
        return { ok: false, data: null, errors, warnings: [] };

      const wrongCategory = participantes.filter(
        p => normalize(p.category) !== normalize(cat)
      );

      if (wrongCategory.length)
        return fail(
          'CATEGORY_MISMATCH',
          'Todos los participantes deben pertenecer a la categoría del torneo.',
          wrongCategory.map(p => p.id)
        );

      // Cada categoría recibe su propia configuración.
      const configTorneo = normalizarConfiguracion({
        ...clone(evento.configuracion),
        ...clone(configuracion || {}),
        points: clone(evento.configuracion.points),
        tieBreaks: clone(evento.configuracion.tieBreaks)
      });

      const configErrors = validarConfiguracionInterna(configTorneo);

      if (configErrors.length)
        return { ok: false, data: null, errors: configErrors, warnings: [] };

      if (!Number.isInteger(configTorneo.totalRounds) || configTorneo.totalRounds < 1)
        return fail(
          'INVALID_CONFIGURATION',
          `Debes establecer una cantidad válida de rondas para ${cat}.`
        );

      const torneo = {
        id: `${evento.id}-${normalize(cat).replace(/[^a-z0-9]+/g, '-')}`,
        categoria: cat,
        estado: 'configuracion',

        participantes: participantes.map(p => ({
          playerId: asText(p.id),
          name: asText(p.name),
          category: asText(p.category),
          numeroEmparejamiento: null,
          posicionInicial: null,
          estado: 'activo',
          retiroSolicitado: false,
          retiroEfectivoDesde: null,
          motivoRetiro: null
        })),

        rondas: [],
        configuracion: clone(configTorneo),
        creadoEn: now(),
        iniciadoEn: null,
        finalizadoEn: null,
        correcciones: []
      };

      const copia = clone(evento);
      copia.torneos.push(torneo);

      return ok(copia);
    },

    inicializarTorneo({ torneo } = {}) {
      if (!torneo || !Array.isArray(torneo.participantes)) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      if (torneo.estado !== 'configuracion') return fail('TOURNAMENT_ALREADY_INITIALIZED', 'El torneo ya fue inicializado.');
      const copy = clone(torneo);
      copy.participantes.sort((a, b) => normalize(a.name).localeCompare(normalize(b.name), 'es') || a.playerId.localeCompare(b.playerId));
      copy.participantes.forEach((p, i) => { p.numeroEmparejamiento = i + 1; p.posicionInicial = i + 1; });
      return ok(copy);
    },

    iniciarTorneo({ evento, torneoId } = {}) {
      if (!evento || !Array.isArray(evento.torneos)) return fail('INVALID_EVENT', 'Evento inválido.');
      const torneo = obtenerTorneo(evento, torneoId);
      if (!torneo) return fail('TOURNAMENT_NOT_FOUND', 'No se encontró el torneo solicitado.');
      if (torneo.estado !== 'configuracion') return fail('TOURNAMENT_ALREADY_STARTED', 'El torneo ya fue iniciado.');
      const config = normalizarConfiguracion(
        torneo.configuracion || evento.configuracion
      );
      const errors = validarConfiguracionInterna(config);
      if (errors.length) return { ok: false, data: null, errors, warnings: [] };
      if (!Number.isInteger(config.totalRounds) || config.totalRounds < 1) return fail('INVALID_CONFIGURATION', 'Debes establecer totalRounds antes de iniciar.');
      const initialized = this.inicializarTorneo({ torneo });
      if (!initialized.ok) return initialized;
      const updated = initialized.data;
      updated.configuracion = config;
      updated.estado = 'en_curso';
      updated.iniciadoEn = now();
      const eventCopy = reemplazarTorneo(evento, updated);
      eventCopy.estado = 'en_curso';
      eventCopy.iniciadoEn = eventCopy.iniciadoEn || now();
      return ok(eventCopy);
    },

    validarTorneo({ torneo } = {}) {
      if (!torneo || !Array.isArray(torneo.participantes) || !Array.isArray(torneo.rondas)) return fail('INVALID_TOURNAMENT', 'Estructura del torneo inválida.');
      const errors = validarParticipantesInterno(torneo.participantes.map(p => ({ id: p.playerId, name: p.name, category: p.category })));
      if (!torneo.categoria || torneo.participantes.some(p => normalize(p.category) !== normalize(torneo.categoria))) errors.push({ code: 'CATEGORY_MISMATCH', message: 'El torneo contiene participantes de otra categoría.' });
      if (torneo.estado === 'en_curso' && !torneo.configuracion) errors.push({ code: 'INVALID_CONFIGURATION', message: 'El torneo iniciado no tiene configuración congelada.' });
      return errors.length ? { ok: false, data: null, errors, warnings: [] } : ok({ valido: true });
    },

    obtenerEstadoTorneo({ torneo } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const currentRound = torneo.rondas.length ? torneo.rondas[torneo.rondas.length - 1] : null;
      return ok({ estado: torneo.estado, categoria: torneo.categoria, participantes: torneo.participantes.length, rondas: torneo.rondas.length, rondaActual: currentRound ? currentRound.numero : 0, estadoRondaActual: currentRound ? currentRound.estado : null });
    },

    generarEmparejamientos({ torneo } = {}) {
      if (!torneo || torneo.estado !== 'en_curso') return fail('TOURNAMENT_NOT_STARTED', 'El torneo debe estar iniciado.');
      return fail('DUTCH_ENGINE_NOT_READY', 'El generador Dutch 2026 está bloqueado hasta completar y validar los artículos C.04.3. No se generarán emparejamientos heurísticos ni se presentarán como oficiales.');
    },

    validarEmparejamientos({ torneo, ronda } = {}) {
      if (!torneo || !ronda) return fail('INVALID_PAIRING', 'Se requieren torneo y ronda.');
      const errors = [];
      const seen = new Set();
      const players = new Set(torneo.participantes.map(p => p.playerId));
      for (const p of ronda.emparejamientos || []) {
        if (!players.has(p.blancas) || !players.has(p.negras)) errors.push({ code: 'PLAYER_NOT_FOUND', message: `Partida ${p.id} referencia jugadores inexistentes.` });
        if (p.blancas === p.negras) errors.push({ code: 'INVALID_PAIRING', message: `Partida ${p.id} asigna el mismo jugador a ambos colores.` });
        for (const id of [p.blancas, p.negras]) {
          if (seen.has(id)) errors.push({ code: 'DUPLICATE_PLAYER_IN_ROUND', message: `El jugador ${id} aparece más de una vez.` });
          seen.add(id);
        }
      }
      for (const b of ronda.byes || []) {
        if (!players.has(b.jugadorId)) errors.push({ code: 'PLAYER_NOT_FOUND', message: `BYE ${b.id} referencia un jugador inexistente.` });
        if (seen.has(b.jugadorId)) errors.push({ code: 'DUPLICATE_PLAYER_IN_ROUND', message: `El jugador ${b.jugadorId} aparece en partida y BYE.` });
        if (Number(b.puntos) !== Number(torneo.configuracion.points.bye)) errors.push({ code: 'INVALID_BYE_POINTS', message: `El BYE ${b.id} no coincide con la puntuación configurada.` });
        const hadBye = torneo.rondas.some(old => old.numero < ronda.numero && old.byes.some(x => x.jugadorId === b.jugadorId));
        const hadFullUnplayedScore = torneo.rondas.some(old => old.numero < ronda.numero && old.emparejamientos.some(match => {
          if (match.jugado !== false) return false;
          const score = puntuarResultado(match.resultado, torneo.configuracion.points, match.tipoResultado);
          if (!score) return false;
          return (match.blancas === b.jugadorId && score.white === torneo.configuracion.points.win) || (match.negras === b.jugadorId && score.black === torneo.configuracion.points.win);
        }));
        if (hadBye || hadFullUnplayedScore) errors.push({ code: 'INELIGIBLE_BYE', message: `El jugador ${b.jugadorId} ya recibió un BYE o puntuación completa sin jugar.` });
        seen.add(b.jugadorId);
      }
      const active = torneo.participantes.filter(p => p.estado !== 'retirado' && !(p.estado === 'retiro_programado' && p.retiroEfectivoDesde != null && ronda.numero >= p.retiroEfectivoDesde));
      const activeIds = new Set(active.map(p => p.playerId));
      for (const id of activeIds) if (!seen.has(id)) errors.push({ code: 'UNPAIRED_ACTIVE_PLAYER', message: `El participante activo ${id} no tiene partida ni BYE.` });
      for (const id of seen) if (!activeIds.has(id)) errors.push({ code: 'INACTIVE_PLAYER_PAIRED', message: `El participante ${id} no debe emparejarse en la ronda ${ronda.numero}.` });
      const expectedByes = active.length % 2;
      if ((ronda.byes || []).length !== expectedByes) errors.push({ code: 'INVALID_BYE_COUNT', message: `Se esperaba ${expectedByes} BYE(s) para ${active.length} participantes activos.` });
      const previousOpponents = new Set();
      for (const old of torneo.rondas) if (old.numero < ronda.numero) for (const match of old.emparejamientos) {
        if (match.jugado === true) previousOpponents.add([match.blancas, match.negras].sort().join('|'));
      }
      for (const match of ronda.emparejamientos || []) {
        const key = [match.blancas, match.negras].sort().join('|');
        if (previousOpponents.has(key)) errors.push({ code: 'REPEATED_OPPONENT', message: `Los jugadores ${match.blancas} y ${match.negras} ya disputaron una partida.` });
      }
      return errors.length ? { ok: false, data: null, errors, warnings: [] } : ok({ valido: true, participantesAsignados: seen.size });
    },

    confirmarRonda({ torneo, rondaId } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const ronda = obtenerRondaInterna(torneo, rondaId);
      if (!ronda) return fail('ROUND_NOT_FOUND', 'No se encontró la ronda.');
      if (ronda.estado !== 'draft') return fail('ROUND_ALREADY_CONFIRMED', 'Solo se puede confirmar una ronda en borrador.');
      const validation = this.validarEmparejamientos({ torneo, ronda });
      if (!validation.ok) return validation;
      const copy = clone(torneo); const target = obtenerRondaInterna(copy, rondaId);
      target.estado = 'confirmed'; target.confirmadaEn = now();
      return ok(copy);
    },

    obtenerRonda({ torneo, rondaId } = {}) {
      const ronda = torneo && obtenerRondaInterna(torneo, rondaId);
      return ronda ? ok(clone(ronda)) : fail('ROUND_NOT_FOUND', 'No se encontró la ronda.');
    },

    obtenerSiguienteRonda({ torneo } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const last = torneo.rondas[torneo.rondas.length - 1];
      if (last && last.estado !== 'closed') return fail('ROUND_NOT_CLOSED', 'La ronda anterior todavía no está cerrada.');
      const next = torneo.rondas.length + 1;
      if (next > torneo.configuracion.totalRounds) return fail('NO_MORE_ROUNDS', 'Ya se alcanzó el total de rondas configurado.');
      return ok({ numero: next });
    },

    registrarResultado({ torneo, rondaId, partidaId, resultado, jugado = true } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      if (!['1-0', '0-1', '0.5-0.5'].includes(resultado)) return fail('INVALID_RESULT', 'Resultado permitido: 1-0, 0-1 o 0.5-0.5.');
      const copy = clone(torneo); const ronda = obtenerRondaInterna(copy, rondaId);
      if (!ronda) return fail('ROUND_NOT_FOUND', 'No se encontró la ronda.');
      if (ronda.estado !== 'confirmed') return fail('INVALID_ROUND_STATE', 'Solo se capturan resultados en rondas confirmadas.');
      const partida = obtenerPartida(ronda, partidaId);
      if (!partida) return fail('MATCH_NOT_FOUND', 'No se encontró la partida.');
      if (partida.resultado != null) return fail('RESULT_ALREADY_REGISTERED', 'La partida ya tiene resultado.');
      partida.resultado = resultado;
      partida.jugado = Boolean(jugado);
      partida.tipoResultado = jugado ? 'jugado' : 'administrativo';
      partida.registradoEn = now();
      return ok(copy);
    },

    registrarIncomparecencia({ torneo, rondaId, partidaId, jugadorAusente } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const ronda = obtenerRondaInterna(torneo, rondaId);
      const partida = ronda && obtenerPartida(ronda, partidaId);
      if (!partida) return fail('MATCH_NOT_FOUND', 'No se encontró la partida.');
      if (![partida.blancas, partida.negras].includes(jugadorAusente)) return fail('INVALID_PLAYER', 'El jugador ausente no pertenece a esta partida.');
      const result = jugadorAusente === partida.blancas ? '0-1' : '1-0';
      const registered = this.registrarResultado({ torneo, rondaId, partidaId, resultado: result, jugado: false });
      if (!registered.ok) return registered;
      const copy = registered.data; const target = obtenerPartida(obtenerRondaInterna(copy, rondaId), partidaId);
      target.tipoResultado = 'incomparecencia'; target.jugadorAusente = jugadorAusente;
      return ok(copy);
    },

    registrarDobleIncomparecencia({ torneo, rondaId, partidaId } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const ronda = obtenerRondaInterna(torneo, rondaId);
      const partida = ronda && obtenerPartida(ronda, partidaId);
      if (!partida) return fail('MATCH_NOT_FOUND', 'No se encontró la partida.');
      if (partida.resultado != null) return fail('RESULT_ALREADY_REGISTERED', 'La partida ya tiene resultado.');
      const copy = clone(torneo); const target = obtenerPartida(obtenerRondaInterna(copy, rondaId), partidaId);
      if (obtenerRondaInterna(copy, rondaId).estado !== 'confirmed') return fail('INVALID_ROUND_STATE', 'La ronda debe estar confirmada.');
      target.resultado = 'double-forfeit'; target.jugado = false; target.tipoResultado = 'doble_incomparecencia'; target.registradoEn = now();
      return ok(copy);
    },

    corregirResultado({ torneo, partidaId, nuevoResultado, motivo, autorizadoPor, nuevoTipoResultado } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      if (!['1-0', '0-1', '0.5-0.5', 'double-forfeit'].includes(nuevoResultado)) {
        return fail('INVALID_RESULT', 'Resultado de corrección no permitido.');
      }
      if (!asText(motivo) || !asText(autorizadoPor)) {
        return fail('UNAUTHORIZED_CORRECTION', 'La corrección requiere motivo y persona autorizada.');
      }

      const tiposPermitidos = ['jugado', 'incomparecencia', 'doble_incomparecencia', 'administrativo'];
      if (nuevoTipoResultado && !tiposPermitidos.includes(nuevoTipoResultado)) {
        return fail('INVALID_RESULT_TYPE', 'Tipo de resultado de corrección no permitido.');
      }

      const copy = clone(torneo);
      let found = null;

      for (const ronda of copy.rondas) {
        const match = obtenerPartida(ronda, partidaId);
        if (match) {
          found = { ronda, match };
          break;
        }
      }

      if (!found || found.ronda.estado !== 'closed') {
        return fail('MATCH_NOT_FOUND', 'Solo se corrigen partidas de rondas cerradas.');
      }

      const partida = found.match;
      const resultadoAnterior = partida.resultado;
      const tipoAnterior = partida.tipoResultado || (partida.jugado ? 'jugado' : 'administrativo');
      const ausenteAnterior = partida.jugadorAusente || null;

      let tipoNuevo = nuevoTipoResultado;

      if (!tipoNuevo) {
        if (nuevoResultado === 'double-forfeit') {
          tipoNuevo = 'doble_incomparecencia';
        } else if (tipoAnterior === 'incomparecencia' || tipoAnterior === 'doble_incomparecencia') {
          tipoNuevo = 'incomparecencia';
        } else if (tipoAnterior === 'administrativo') {
          tipoNuevo = 'administrativo';
        } else {
          tipoNuevo = 'jugado';
        }
      }

      if (tipoNuevo === 'doble_incomparecencia' && nuevoResultado !== 'double-forfeit') {
        return fail('INVALID_RESULT_TYPE', 'La doble incomparecencia requiere el resultado double-forfeit.');
      }

      if (tipoNuevo === 'incomparecencia' && !['1-0', '0-1'].includes(nuevoResultado)) {
        return fail('INVALID_RESULT_TYPE', 'La incomparecencia individual requiere un ganador.');
      }

      if (tipoNuevo === 'jugado' && nuevoResultado === 'double-forfeit') {
        return fail('INVALID_RESULT_TYPE', 'Una partida jugada no puede tener resultado de doble incomparecencia.');
      }

      partida.resultado = nuevoResultado;
      partida.tipoResultado = tipoNuevo;
      partida.jugado = tipoNuevo === 'jugado';

      if (tipoNuevo === 'incomparecencia') {
        partida.jugadorAusente = nuevoResultado === '1-0' ? partida.negras : partida.blancas;
      } else {
        delete partida.jugadorAusente;
      }

      if (!Array.isArray(copy.correcciones)) copy.correcciones = [];

      copy.correcciones.push({
        id: `COR-${copy.correcciones.length + 1}`,
        partidaId,
        resultadoAnterior,
        resultadoNuevo: nuevoResultado,
        tipoAnterior,
        tipoNuevo,
        jugadorAusenteAnterior: ausenteAnterior,
        jugadorAusenteNuevo: partida.jugadorAusente || null,
        motivo: asText(motivo),
        autorizadoPor: asText(autorizadoPor),
        fecha: now()
      });

      return ok(copy);
    },

    retirarParticipante({ torneo, playerId, motivo } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const copy = clone(torneo); const p = copy.participantes.find(x => x.playerId === playerId);
      if (!p) return fail('PLAYER_NOT_FOUND', 'No se encontró al participante.');
      if (p.estado === 'retirado' || p.retiroSolicitado) return fail('PLAYER_ALREADY_WITHDRAWN', 'El participante ya tiene un retiro registrado.');
      const draft = copy.rondas.find(r => r.estado === 'draft');
      p.retiroSolicitado = true;
      p.retiroEfectivoDesde = draft ? draft.numero : copy.rondas.length + 1;
      p.motivoRetiro = asText(motivo);
      // Un borrador no confirmado queda invalidado; el retiro se programa para la siguiente ronda no confirmada.
      if (draft) copy.rondas = copy.rondas.filter(r => r.id !== draft.id);
      p.estado = 'retiro_programado';
      return ok(copy);
    },

    cerrarRonda({ torneo, rondaId } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const copy = clone(torneo); const ronda = obtenerRondaInterna(copy, rondaId);
      if (!ronda) return fail('ROUND_NOT_FOUND', 'No se encontró la ronda.');
      if (ronda.estado !== 'confirmed') return fail('INVALID_ROUND_STATE', 'Solo se puede cerrar una ronda confirmada.');
      const pending = ronda.emparejamientos.filter(p => p.resultado == null);
      if (pending.length) return fail('ROUND_HAS_PENDING_RESULTS', `Hay ${pending.length} partida(s) sin resultado.`);
      ronda.estado = 'closed'; ronda.cerradaEn = now();
      const closedCount = copy.rondas.filter(r => r.estado === 'closed').length;
      if (closedCount === copy.configuracion.totalRounds) { copy.estado = 'finalizado'; copy.finalizadoEn = now(); }
      return ok(copy);
    },

    calcularEstadisticas({ torneo } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const standings = construirClasificacion(torneo);
      return ok({ participantes: standings.length, puntosTotales: standings.reduce((s, p) => s + p.puntos, 0), partidasRegistradas: torneo.rondas.reduce((n, r) => n + r.emparejamientos.filter(p => p.resultado != null).length, 0), byesAsignados: torneo.rondas.reduce((n, r) => n + r.byes.length, 0), retirados: torneo.participantes.filter(p => p.estado === 'retirado').length });
    },

    obtenerEstadisticasJugador({ torneo, playerId } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const row = construirClasificacion(torneo).find(p => p.playerId === playerId);
      return row ? ok(row) : fail('PLAYER_NOT_FOUND', 'No se encontró al participante.');
    },

    obtenerHistorialColores({ torneo, playerId } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const colors = [];
      for (const r of torneo.rondas) if (r.estado !== 'draft') for (const p of r.emparejamientos) {
        if (p.jugado !== true) continue;
        if (p.blancas === playerId) colors.push({ ronda: r.numero, color: 'white' });
        if (p.negras === playerId) colors.push({ ronda: r.numero, color: 'black' });
      }
      return ok(colors);
    },

    obtenerHistorialRivales({ torneo, playerId } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const history = [];
      for (const r of torneo.rondas) if (r.estado !== 'draft') for (const p of r.emparejamientos) {
        if (p.blancas === playerId) history.push({ ronda: r.numero, rivalId: p.negras, partidaId: p.id, jugado: p.jugado });
        else if (p.negras === playerId) history.push({ ronda: r.numero, rivalId: p.blancas, partidaId: p.id, jugado: p.jugado });
      }
      return ok(history);
    },

    obtenerHistorialBYE({ torneo, playerId } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      return ok(torneo.rondas.filter(r => r.estado !== 'draft').flatMap(r => r.byes.filter(b => b.jugadorId === playerId).map(b => ({ ronda: r.numero, ...clone(b) }))));
    },

    obtenerHistorial({ torneo } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      return ok({ rondas: clone(torneo.rondas), correcciones: clone(torneo.correcciones || []) });
    },

    obtenerHistorialPartida({ torneo, partidaId } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      for (const ronda of torneo.rondas) { const partida = obtenerPartida(ronda, partidaId); if (partida) return ok({ ronda: ronda.numero, partida: clone(partida) }); }
      return fail('MATCH_NOT_FOUND', 'No se encontró la partida.');
    },

    obtenerHistorialCambios({ torneo } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      return ok({ correcciones: clone(torneo.correcciones || []), retiros: torneo.participantes.filter(p => p.retiroSolicitado || p.estado === 'retirado').map(p => ({ playerId: p.playerId, motivo: p.motivoRetiro, efectivoDesde: p.retiroEfectivoDesde })) });
    },

    calcularClasificacion({ torneo } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      return ok(construirClasificacion(torneo));
    },

    calcularDesempates({ torneo, playerId } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      if (!torneo.configuracion.tieBreaks.length) return ok({ playerId, criterios: [], valores: {} });
      return fail('INVALID_TIEBREAK', 'La configuración contiene desempates no disponibles en esta versión.');
    },

    obtenerDesempatesDisponibles() { return ok(clone(SUPPORTED_TIEBREAKS)); },

    validarDesempates({ desempates } = {}) {
      if (!Array.isArray(desempates)) return fail('INVALID_TIEBREAK', 'desempates debe ser un arreglo.');
      const errors = desempates.filter(t => !SUPPORTED_TIEBREAKS.includes(t)).map(t => ({ code: 'INVALID_TIEBREAK', message: `Desempate no implementado: ${t}` }));
      return errors.length ? { ok: false, data: null, errors, warnings: [] } : ok({ validos: desempates });
    },

    reconstruirTorneo({ torneo } = {}) {
      if (!torneo) return fail('INVALID_TOURNAMENT', 'Torneo inválido.');
      const integrity = this.validarIntegridadHistorial({ torneo });
      if (!integrity.ok) return integrity;
      return ok({ torneo: clone(torneo), clasificacion: construirClasificacion(torneo) });
    },

    validarIntegridadHistorial({ torneo } = {}) {
      if (!torneo || !Array.isArray(torneo.rondas)) return fail('INTEGRITY_ERROR', 'Torneo o historial inválido.');
      const errors = [];
      const known = new Set(torneo.participantes.map(p => p.playerId));
      const roundNumbers = new Set();
      for (const r of torneo.rondas) {
        if (roundNumbers.has(r.numero)) errors.push({ code: 'INTEGRITY_ERROR', message: `NÃºmero de ronda duplicado: ${r.numero}.` });
        roundNumbers.add(r.numero);
        if (!Array.isArray(r.emparejamientos) || !Array.isArray(r.byes)) { errors.push({ code: 'INTEGRITY_ERROR', message: `Estructura inválida en ronda ${r.numero}.` }); continue; }
        const validation = this.validarEmparejamientos({ torneo, ronda: r });
        if (!validation.ok) errors.push(...validation.errors);
        for (const p of r.emparejamientos) {
          if (!known.has(p.blancas) || !known.has(p.negras)) errors.push({ code: 'INTEGRITY_ERROR', message: `Partida ${p.id} contiene referencias desconocidas.` });
          if (p.resultado != null && !['1-0', '0-1', '0.5-0.5', 'double-forfeit'].includes(p.resultado)) errors.push({ code: 'INTEGRITY_ERROR', message: `Resultado inválido en ${p.id}.` });
          if (r.estado === 'closed' && p.resultado == null) errors.push({ code: 'INTEGRITY_ERROR', message: `Ronda cerrada con partida pendiente: ${p.id}.` });
        }
      }
      return errors.length ? { ok: false, data: null, errors, warnings: [] } : ok({ integro: true });
    }
  };

  return Object.freeze(MotorSuizo);
});