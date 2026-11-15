/* Juegos Terva · Gestor de torneos · interfaz 0.4.0 */
(() => {
  'use strict';
  const M = window.MotorSuizo;
  if (!M) { alert('No se encontró motor_suizo.js. Coloca ambos archivos en la misma carpeta.'); return; }
  const KEY = 'juegosTerva.gestorAjedrez.v03';
  const $ = id => document.getElementById(id);
  const clone = x => JSON.parse(JSON.stringify(x));
  const norm = s => String(s ?? '').trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
  const uid = prefix => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
  let state = loadState();
  let activeTournamentId = null;
  let activeRoundId = null;
  let editingPlayerId = null;

  function loadState() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
      return { players: Array.isArray(parsed.players) ? parsed.players : [], event: parsed.event || null };
    } catch { return { players: [], event: null }; }
  }
  function save(message='Cambios guardados en este dispositivo.') {
    localStorage.setItem(KEY, JSON.stringify(state));
    renderAll();
    if (message) say(message);
  }
  function say(message) { $('appStatus').textContent = message; }
  function esc(s) { return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function csvCell(v) { return `"${String(v ?? '').replace(/"/g,'""')}"`; }
  function download(name, content, type='text/plain;charset=utf-8') {
    const blob = new Blob([content], {type});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download=name; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }
  function categories() { return [...new Set(state.players.map(p=>p.category.trim()).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'es')); }
  function playerById(id) { return state.players.find(p=>p.id===id); }
  function tournament() { return state.event?.torneos.find(t=>t.id===activeTournamentId) || null; }
  function resultText(r) { return r==='1-0'?'1–0':r==='0-1'?'0–1':r==='0.5-0.5'?'½–½':r==='double-forfeit'?'0–0':'Pendiente'; }
  function statusLabel(t) { return t.estado==='configuracion'?'Por iniciar':t.estado==='en_curso'?'En curso':'Finalizado'; }
  function show(id) { document.querySelector(id)?.scrollIntoView({behavior:'smooth',block:'start'}); }

  // Padrón
  $('playerForm').addEventListener('submit', e => {
    e.preventDefault();
    if (state.event) { say('El padrón queda bloqueado cuando se crea el evento.'); return; }
    const id=$('playerId').value.trim(), name=$('playerName').value.trim(), category=$('playerCategory').value.trim();
    if (!id||!name||!category) return;
    if (state.players.some(p=>norm(p.id)===norm(id) && p.id!==editingPlayerId)) { say(`El ID ${id} ya existe.`); return; }
    if (editingPlayerId) {
      const p=playerById(editingPlayerId); if (p) Object.assign(p,{id,name,category});
      editingPlayerId=null; $('playerSubmit').textContent='＋ Agregar participante';
    } else state.players.push({id,name,category});
    $('playerForm').reset(); save('Participante guardado.');
  });
  $('playersTable').addEventListener('click', e => {
    const b=e.target.closest('button[data-action]'); if(!b || state.event) return;
    const p=playerById(b.dataset.id); if(!p) return;
    if (b.dataset.action==='edit') {
      editingPlayerId=p.id; $('playerId').value=p.id; $('playerName').value=p.name; $('playerCategory').value=p.category;
      $('playerSubmit').textContent='Guardar cambios'; $('playerName').focus();
    } else if (b.dataset.action==='delete' && confirm(`¿Eliminar a ${p.name} del padrón?`)) {
      state.players=state.players.filter(x=>x.id!==p.id); save('Participante eliminado.');
    }
  });
  $('playerSearch').addEventListener('input',renderPlayers);
  $('categoryFilter').addEventListener('change',renderPlayers);
  $('importCsvBtn').addEventListener('click',()=>$('csvFile').click());
  $('csvFile').addEventListener('change', async e=>{
    if(state.event) return say('No puedes modificar el padrón después de crear el evento.');
    const f=e.target.files[0]; if(!f)return;
    const text=await f.text(); const rows=parseCSV(text);
    if(rows.length<2) return say('El CSV no contiene filas de participantes.');
    const headers=rows[0].map(norm);
    const find=(...names)=>headers.findIndex(h=>names.includes(h));
    const iId=find('id','clave','matricula','matrícula'), iName=find('nombre','name','participante'), iCat=find('categoria','categoría','category');
    if([iId,iName,iCat].some(i=>i<0)) return say('El CSV debe incluir encabezados: id, nombre, categoria.');
    let added=0, skipped=0;
    for(const row of rows.slice(1)) {
      const p={id:(row[iId]||'').trim(),name:(row[iName]||'').trim(),category:(row[iCat]||'').trim()};
      if(!p.id||!p.name||!p.category||state.players.some(x=>norm(x.id)===norm(p.id))) {skipped++;continue;}
      state.players.push(p);added++;
    }
    e.target.value=''; save(`Importación terminada: ${added} agregados, ${skipped} omitidos.`);
  });
  
function parseCSV(text) {
  let source = String(text || '').replace(/^\uFEFF/, '');

  // Detectar si Excel indicó el separador en la primera línea
  const separatorMatch = source.match(/^sep=([,;\t])\r?\n/i);
  let delimiter = separatorMatch ? separatorMatch[1] : ',';

  if (separatorMatch) {
    source = source.slice(separatorMatch[0].length);
  } else {
    // Detectar automáticamente coma, punto y coma o tabulador
    const counts = { ',': 0, ';': 0, '\t': 0 };
    let quoted = false;

    for (let i = 0; i < source.length; i++) {
      const c = source[i];

      if (c === '"' && quoted && source[i + 1] === '"') {
        i++;
      } else if (c === '"') {
        quoted = !quoted;
      } else if (!quoted && (c === '\n' || c === '\r')) {
        break;
      } else if (!quoted && c in counts) {
        counts[c]++;
      }
    }

    delimiter = Object.keys(counts).sort(
      (a, b) => counts[b] - counts[a]
    )[0];
  }

  const out = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    const n = source[i + 1];

    if (c === '"' && quoted && n === '"') {
      field += '"';
      i++;
    } else if (c === '"') {
      quoted = !quoted;
    } else if (c === delimiter && !quoted) {
      row.push(field);
      field = '';
    } else if ((c === '\n' || c === '\r') && !quoted) {
      if (c === '\r' && n === '\n') i++;
      row.push(field);
      if (row.some(x => x.trim())) out.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }

  row.push(field);
  if (row.some(x => x.trim())) out.push(row);

  return out;
}

  $('templateCsv').addEventListener('click',e=>{e.preventDefault();download('plantilla_participantes.csv','id,nombre,categoria\nAJ-001,Ana López,Infantil\nAJ-002,Luis Pérez,Infantil\n','text/csv;charset=utf-8');});
  $('exportCsv').addEventListener('click',()=>download('padron_participantes.csv','id,nombre,categoria\n'+state.players.map(p=>[p.id,p.name,p.category].map(csvCell).join(',')).join('\n'),'text/csv;charset=utf-8'));
  $('roundPlayerSearch').addEventListener('input',()=>{if(activeTournamentId&&tournament())renderAdmin();});
  $('roundCaptureFilter').addEventListener('change',()=>{if(activeTournamentId&&tournament())renderAdmin();});
  $('pairingReviewPanel').addEventListener('click',e=>{const b=e.target.closest('[data-pair-review]');if(b)handlePairReview(b.dataset.pairReview);});
  $('generatePhysicalDistribution').addEventListener('click',buildPhysicalDistribution);
  $('exportPhysicalDistribution').addEventListener('click',exportPhysicalDistributionCsv);
  $('physicalSearch').addEventListener('input',renderPhysicalDistribution);
  $('exportStandings').addEventListener('click',exportStandingsCsv);

  // Preparación del evento
  $('eventForm').addEventListener('submit',e=>{
    e.preventDefault();
    if(state.event) return say('Ya existe un evento activo. Respalda o finaliza ese evento antes de crear otro.');
    const cats=categories();
    if(!state.players.length||!cats.length) return say('Agrega participantes con categoría antes de crear el evento.');
    const pts={win:+$('ptsWin').value,draw:+$('ptsDraw').value,loss:+$('ptsLoss').value,bye:+$('ptsBye').value,forfeitWin:+$('ptsWin').value,forfeitLoss:+$('ptsLoss').value,doubleForfeit:0};
    const config={pairingSystem:'SIMPLE_SWISS',initialOrder:'alphabetical',initialColour:null,points:pts,tieBreaks:[]};
    const eventResult=M.crearEvento({id:uid('evento'),nombre:$('eventName').value.trim(),fecha:$('eventDate').value||null,sede:$('eventVenue').value.trim(),configuracion:config});
    if(!eventResult.ok) return say(eventResult.errors.map(x=>x.message).join(' '));
    let ev=eventResult.data;
    for(const cat of cats) {
      const selected=state.players.filter(p=>p.category===cat).map(p=>({id:p.id,name:p.name,category:p.category}));
      const rounds=+$(`rounds-${slug(cat)}`)?.value || Math.max(1,Math.ceil(Math.log2(selected.length)));
      const r=M.crearTorneo({evento:ev,categoria:cat,participantes:selected,configuracion:{totalRounds:rounds}});
      if(!r.ok) return say(r.errors.map(x=>x.message).join(' '));
      ev=r.data;
    }
    ev.distribucionFisica = null;
    state.event=ev; save('Evento creado. Ya puedes iniciar cada categoría desde el panel del torneo.');
    show('#torneo');
  });

  function slug(s){return norm(s).replace(/[^a-z0-9]+/g,'-');}
  function renderAll(){renderPlayers();renderSetup();renderDashboard();if(activeTournamentId&&tournament())renderAdmin();}
  function renderPlayers(){
    const cats=categories(), q=norm($('playerSearch').value), filter=$('categoryFilter').value;
    $('statPlayers').textContent=state.players.length;
    $('statCategories').textContent=cats.length;
    $('statMissing').textContent=state.players.filter(p=>!p.name||!p.id||!p.category).length;
    $('rosterCount').textContent=`${state.players.length} registros`;
    $('categoryFilter').innerHTML='<option value="">Todas las categorías</option>'+cats.map(c=>`<option ${filter===c?'selected':''} value="${esc(c)}">${esc(c)}</option>`).join('');
    $('categorySuggestions').innerHTML=cats.map(c=>`<option value="${esc(c)}">`).join('');
    const list=state.players.filter(p=>(!filter||p.category===filter)&&(!q||norm(p.id+' '+p.name+' '+p.category).includes(q)));
    $('playersTable').innerHTML=list.length?list.map(p=>`<tr><td>${esc(p.id)}</td><td>${esc(p.name)}</td><td>${esc(p.category)}</td><td>${state.event?'<span class="muted">Bloqueado</span>':`<button class="button button-ghost" data-action="edit" data-id="${esc(p.id)}" type="button">Editar</button> <button class="button button-ghost" data-action="delete" data-id="${esc(p.id)}" type="button">Eliminar</button>`}</td></tr>`).join(''):'<tr><td colspan="4" class="empty-cell"><span>♟</span><strong>Sin participantes</strong><small>Agrega registros o importa un CSV.</small></td></tr>';
    $('rosterFooter').textContent=`Mostrando ${list.length} de ${state.players.length} participantes`;
    $('playerForm').querySelectorAll('input,button').forEach(x=>x.disabled=!!state.event);
    $('importCsvBtn').disabled=!!state.event;
    $('rosterState').textContent=state.event?'Padrón bloqueado':'Padrón editable';
  }
  function renderSetup(){
    const cats=categories();
    $('categoryCount').textContent=`${cats.length} categorías`;
    $('categorySetup').innerHTML=cats.length?cats.map(c=>`<label class="category-select-item"><span><strong>${esc(c)}</strong><small>${state.players.filter(p=>p.category===c).length} participantes</small></span><span class="check-visual">✓</span></label>`).join(''):'<p class="muted">Agrega participantes al padrón para detectar las categorías.</p>';
    $('roundSetup').innerHTML=cats.length?cats.map(c=>{const n=state.players.filter(p=>p.category===c).length;const sug=Math.max(1,Math.ceil(Math.log2(Math.max(2,n))));return `<div class="round-config-row"><span><strong>${esc(c)}</strong><small>${n} participantes · ${sug} rondas sugeridas (orientativo)</small></span><label class="field-inline"><span>Rondas</span><input id="rounds-${slug(c)}" type="number" min="1" max="30" value="${sug}" ${state.event?'disabled':''}></label></div>`;}).join(''):'<p class="muted">No hay categorías configuradas.</p>';
    const locked=!!state.event;
    $('eventForm').querySelectorAll('input,button').forEach(x=>x.disabled=locked);
    ['ptsWin','ptsDraw','ptsLoss','ptsBye'].forEach(id=>$(id).disabled=locked);
    $('eventState').textContent=locked?'Evento creado':'Preparación';
    $('createEvent').textContent=locked?'Evento creado':'Crear evento y categorías →';
    $('eventMessage').textContent=locked?'La configuración está bloqueada para proteger los torneos ya creados.':'';
  }
  function renderDashboard(){
    const ev=state.event, ts=ev?.torneos||[];
    $('statTournaments').textContent=ts.length;
    $('statEventPlayers').textContent=ts.reduce((s,t)=>s+t.participantes.length,0);
    $('statRunning').textContent=ts.filter(t=>t.estado==='en_curso').length;
    $('statFinished').textContent=ts.filter(t=>t.estado==='finalizado').length;
    $('tournamentState').textContent=ev?(ev.estado==='finalizado'?'Finalizado':'Evento creado'):'Sin evento';
    $('eventBanner').innerHTML=ev?`<div><span class="eyebrow">EVENTO ACTUAL</span><h3>${esc(ev.nombre)}</h3><p>${esc(ev.fecha||'Fecha no definida')} · ${esc(ev.sede||'Sede no definida')}</p></div><span class="banner-chess">♜</span>`:'<div><span class="eyebrow">EVENTO ACTUAL</span><h3>Aún no hay un evento creado</h3><p>Configura el evento para comenzar.</p></div><span class="banner-chess">♜</span>';
    $('tournamentCards').innerHTML=ts.length?ts.map(t=>{
      const closed=t.rondas.filter(r=>r.estado==='closed').length, current=t.rondas[t.rondas.length-1];
      const totalMatches=current?.emparejamientos.length||0, done=current?.emparejamientos.filter(m=>m.resultado!=null).length||0;
      const pct=totalMatches?Math.round(done/totalMatches*100):0;
      const standings=M.calcularClasificacion({torneo:t}).data||[];
      return `<article class="category-card"><div class="category-card-top"><span class="category-symbol symbol-blue">♟</span><span class="state-pill ${t.estado==='finalizado'?'state-final':t.estado==='en_curso'?'state-success':'state-neutral'}">${statusLabel(t)}</span></div><h3>${esc(t.categoria)}</h3><p>${t.participantes.length} participantes · ${closed}/${t.configuracion.totalRounds} rondas cerradas</p><div class="progress-track"><span style="width:${t.estado==='finalizado'?100:pct}%"></span></div><div class="progress-meta"><span>${current?`${done} de ${totalMatches} resultados`:'Sin rondas'}</span><strong>${current?pct+'%':'—'}</strong></div><button class="button button-primary button-full" type="button" data-open-tournament="${esc(t.id)}">${t.estado==='configuracion'?'Preparar categoría':'Administrar categoría'} →</button></article>`;
    }).join(''):'<p class="muted">Todavía no hay categorías para mostrar.</p>';
    $('physicalDistributionPanel').hidden=!ev;
    renderPhysicalControls();
    renderPhysicalDistribution();
  }
  $('tournamentCards').addEventListener('click',e=>{const b=e.target.closest('[data-open-tournament]');if(!b)return;activeTournamentId=b.dataset.openTournament;activeRoundId=null;renderAdmin();$('categoryAdmin').hidden=false;show('#categoryAdmin');});
  $('backToCategories').addEventListener('click',()=>{$('categoryAdmin').hidden=true;activeTournamentId=null;});
  $('generateRound').addEventListener('click',()=>{const t=tournament();if(!t)return;if(t.estado==='configuracion')startTournament(t.id);else generateRound();});
  $('roundList').addEventListener('click',e=>{const b=e.target.closest('[data-round]');if(!b)return;activeRoundId=b.dataset.round;renderAdmin();});
  $('matchesTable').addEventListener('change',e=>{
    const s=e.target.closest('select[data-match]');if(!s)return;
    recordResult(s.dataset.match,s.value);
  });
  $('roundActions').addEventListener('click',e=>{
    const b=e.target.closest('button[data-round-action]');if(!b)return;
    if(b.dataset.roundAction==='confirm')confirmRound();
    if(b.dataset.roundAction==='close')closeRound();
    if(b.dataset.roundAction==='export')exportRoundCsv();
  });
  function exportRoundCsv(){
    const t=tournament();
    if(!t)return say('No hay una categoría seleccionada.');
    const r=t.rondas.find(x=>x.id===activeRoundId)||t.rondas[t.rondas.length-1];
    if(!r)return say('No hay una ronda para exportar.');
    const participant=id=>t.participantes.find(p=>p.playerId===id)||{playerId:id,name:id};
    const rows=[];
    (r.emparejamientos||[]).forEach((m,i)=>{
      const white=participant(m.blancas), black=participant(m.negras);
      rows.push([i+1,white.playerId,white.name,'Blancas',black.playerId,black.name,resultText(m.resultado)]);
      rows.push([i+1,black.playerId,black.name,'Negras',white.playerId,white.name,resultText(m.resultado)]);
    });
    (r.byes||[]).forEach(b=>{
      const p=participant(b.jugadorId);
      rows.push(['BYE',p.playerId,p.name,'BYE','','',`BYE (${b.puntos} punto${Number(b.puntos)===1?'':'s'})`]);
    });
    const header=['Partida','ID','Participante','Color','ID rival','Rival','Resultado'];
    const csv='\uFEFF'+[header,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n');
    download(`ronda_${String(r.numero).padStart(2,'0')}_${slug(t.categoria)}.csv`,csv,'text/csv;charset=utf-8');
    say(`Se exportó la ronda ${r.numero} de ${t.categoria}.`);
  }
  function exportStandingsCsv(){
    const t=tournament();
    if(!t)return say('No hay una categoría seleccionada.');
    const standings=M.calcularClasificacion({torneo:t}).data||[];
    const header=['Posición','ID','Participante','Puntos','Buchholz','Buchholz -1','Sonneborn-Berger','Progresivo','Victorias'];
    const rows=standings.map(p=>[p.posicion,p.playerId,p.nombre,p.puntos,p.buchholz,p.buchholzCut1,p.sonnebornBerger,p.progressive,p.wins]);
    const csv='\uFEFF'+[header,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n');
    download(`clasificacion_${slug(t.categoria)}.csv`,csv,'text/csv;charset=utf-8');
    say(`Se exportó la clasificación completa: ${standings.length} participantes de ${t.categoria}.`);
  }
  function fmt(n){return Number(n||0).toFixed(2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');}
  function activePlayers(t, roundNo) {
  return t.participantes.filter(p =>
    (p.ingresoDesdeRonda == null || roundNo >= p.ingresoDesdeRonda) &&
    p.estado !== 'retirado' &&
    !(p.estado === 'retiro_programado' &&
      p.retiroEfectivoDesde != null &&
      roundNo >= p.retiroEfectivoDesde)
  );
  }
  function scoreMap(t){const rows=M.calcularClasificacion({torneo:t}).data||[];return new Map(rows.map(r=>[r.playerId,Number(r.puntos)||0]));}
  // Una pareja queda registrada desde que se confirma la ronda.
function hasPlayed(t, a, b) {
  return t.rondas.some(r =>
    r.estado !== 'draft' &&
    r.emparejamientos.some(m =>
      (m.blancas === a && m.negras === b) ||
      (m.blancas === b && m.negras === a)
    )
  );
}
  function chooseColors(t,a,b,roundNo){
    const history=id=>M.obtenerHistorialColores({torneo:t,playerId:id}).data||[];
    const ha=history(a), hb=history(b);
    const balance=id=>{const h=history(id);return h.filter(x=>x.color==='white').length-h.filter(x=>x.color==='black').length;};
    const ba=balance(a),bb=balance(b);
    let aWhite;
    if(ba!==bb) aWhite=ba<bb;
    else {
      const lastA=ha.at(-1)?.color,lastB=hb.at(-1)?.color;
      if(lastA==='white'&&lastB!=='white') aWhite=false;
      else if(lastB==='white'&&lastA!=='white') aWhite=true;
      else aWhite=(roundNo%2===1);
    }
    return aWhite?{blancas:a,negras:b}:{blancas:b,negras:a};
  }
  function pairRemaining(list, scores, t) {
    if(!list.length)return [];
    const first=list[0], rest=list.slice(1);
    const candidates=rest.map((p,i)=>({p,i,diff:Math.abs((scores.get(first.playerId)||0)-(scores.get(p.playerId)||0)),seed:Math.abs(first.numeroEmparejamiento-p.numeroEmparejamiento)}))
      .filter(x=>!hasPlayed(t,first.playerId,x.p.playerId))
      .sort((a,b)=>a.diff-b.diff||a.seed-b.seed||a.i-b.i);
    for(const c of candidates){
      const remaining=rest.filter((_,i)=>i!==c.i);
      const tail=pairRemaining(remaining,scores,t);
      if(tail)return [{a:first,b:c.p},...tail];
    }
    return null;
  }
  
function addLateParticipant() {
  addLateParticipants([{
    id: $('latePlayerId').value.trim(),
    name: $('latePlayerName').value.trim()
  }], 'manual');
}

function addLateParticipants(records, source = 'manual') {
  const t = tournament();

  if (!t) return say('Primero selecciona una categoría.');

  if (t.estado === 'finalizado') {
    return say('Esta categoría ya finalizó. No se pueden agregar participantes.');
  }

  const clean = (records || [])
    .map(p => ({
      id: String(p.id || '').trim(),
      name: String(p.name || '').trim()
    }))
    .filter(p => p.id && p.name);

  if (!clean.length) {
    return say('No se encontraron registros completos con ID y nombre.');
  }

  const known = new Set(state.players.map(p => norm(p.id)));
  const unique = [];
  let skipped = 0;

  for (const p of clean) {
    const key = norm(p.id);

    if (known.has(key)) {
      skipped++;
      continue;
    }

    known.add(key);
    unique.push(p);
  }

  if (!unique.length) {
    return say(`No se agregó ningún participante: ${skipped} ID(s) ya existían o estaban duplicados.`);
  }

  const last = t.rondas[t.rondas.length - 1] || null;
  const draft = last && last.estado === 'draft' ? last : null;
  const canReplaceDraft = draft &&
    draft.emparejamientos.every(m => m.resultado == null);

  const names = unique.length === 1
    ? unique[0].name
    : `${unique.length} participantes`;

  if (canReplaceDraft && !confirm(
    `La ronda ${draft.numero} todavía es un borrador sin resultados. Se volverán a generar sus emparejamientos para incluir ${names}. ¿Continuar?`
  )) return;

  const nextRound = t.estado === 'configuracion'
    ? 1
    : (canReplaceDraft ? draft.numero : t.rondas.length + 1);

  let seed = t.participantes.reduce(
    (max, p) => Math.max(max, Number(p.numeroEmparejamiento) || 0), 0
  );

  for (const p of unique) {
    seed++;

    state.players.push({
      id: p.id,
      name: p.name,
      category: t.categoria
    });

    t.participantes.push({
      playerId: p.id,
      name: p.name,
      category: t.categoria,
      numeroEmparejamiento: seed,
      posicionInicial: seed,
      estado: 'activo',
      retiroSolicitado: false,
      retiroEfectivoDesde: null,
      motivoRetiro: null,
      ingresoDesdeRonda: nextRound
    });
  }

  const extended = nextRound > t.configuracion.totalRounds;

  if (extended) {
    t.configuracion.totalRounds = nextRound;
  }

  if (canReplaceDraft) {
    t.rondas = t.rondas.filter(r => r.id !== draft.id);
    activeRoundId = null;
  }

  if (source === 'manual') {
    $('lateParticipantForm').reset();
  }

  const detail = canReplaceDraft
    ? `Se regenerará la ronda ${nextRound} para incluirlos.`
    : `Participarán desde la ronda ${nextRound}; las partidas y resultados existentes permanecen intactos.`;

  save(
    `${unique.length} participante(s) agregado(s) a ${t.categoria}. ` +
    `${detail}${extended ? ' Se amplió el torneo una ronda.' : ''} ` +
    `${skipped ? `${skipped} registro(s) omitidos por ID duplicado.` : ''}`
  );

  if (canReplaceDraft) generateRound();
}

  function generateRound(){
    const t=tournament();if(!t)return;
    if(t.estado!=='en_curso')return say('Primero debes iniciar esta categoría.');
    const next=M.obtenerSiguienteRonda({torneo:t});if(!next.ok)return say(next.errors[0].message);
    const no=next.data.numero, players=activePlayers(t,no);
    if(players.length<2)return say('No hay suficientes participantes activos para generar una ronda.');
    const scores=scoreMap(t);
    let bye=null, pool=players.slice();
    if(pool.length%2){
      const byeCandidates=pool.filter(p=>!(M.obtenerHistorialBYE({torneo:t,playerId:p.playerId}).data||[]).length)
        .sort((a,b)=>(scores.get(a.playerId)||0)-(scores.get(b.playerId)||0)||b.numeroEmparejamiento-a.numeroEmparejamiento);
      let found=null;
      for(const candidate of byeCandidates){
        const attempt=pairRemaining(pool.filter(p=>p.playerId!==candidate.playerId),scores,t);
        if(attempt){found={candidate,pairs:attempt};break;}
      }
      if(!found)return say('No se encontró un emparejamiento completo sin repetir rivales ni asignar un BYE repetido. Revisa manualmente la ronda; no se generó nada.');
      bye=found.candidate; pool=pool.filter(p=>p.playerId!==bye.playerId);
    }
    let pairs=[];
    let review=null;
    if(no===1){
      const sorted=pool.slice().sort((a,b)=>a.numeroEmparejamiento-b.numeroEmparejamiento);
      const half=sorted.length/2;
      // Conserva el criterio de la primera ronda actual: primera mitad contra segunda mitad.
      // La cola se organiza en el mismo orden en que se revisarán esas parejas.
      const reviewQueue=Array.from({length:half},(_,i)=>[sorted[i].playerId,sorted[i+half].playerId]).flat();
      review={activa:true,completa:false,pendientes:reviewQueue,omitidos:[],confirmadas:0,creadaEn:new Date().toISOString()};
    } else {
      pairs=pairRemaining(pool.slice().sort((a,b)=>(scores.get(b.playerId)||0)-(scores.get(a.playerId)||0)||a.numeroEmparejamiento-b.numeroEmparejamiento),scores,t);
      if(!pairs)return say('No se encontró una combinación completa sin repetir rivales. La ronda no fue creada; será necesaria una revisión manual.');
    }
    const round={
      id:uid('ronda'),numero:no,estado:'draft',
      emparejamientos:pairs.map((pair,i)=>({id:uid('partida'),mesa:i+1,...chooseColors(t,pair.a.playerId,pair.b.playerId,no),resultado:null,tipoResultado:null,jugado:null})),
      byes:bye?[{id:uid('bye'),jugadorId:bye.playerId,puntos:t.configuracion.points.bye}]:[],
      ...(review?{revisionPareos:review}:{}),
      creadaEn:new Date().toISOString()
    };
    if(!review){
      const validation=M.validarEmparejamientos({torneo:t,ronda:round});
      if(!validation.ok)return say('El motor rechazó la ronda: '+validation.errors.map(x=>x.message).join(' '));
    }
    t.rondas.push(round); activeRoundId=round.id;
    save(no===1?'Primera ronda generada. Confirma las parejas una por una; las confirmadas quedarán bloqueadas.':`Ronda ${no} generada como borrador. Revisa los emparejamientos antes de confirmar.`);
  }

  function handlePairReview(action){
    const t=tournament(),r=t?.rondas.find(x=>x.id===activeRoundId);
    if(!t||!r||r.estado!=='draft'||!r.revisionPareos?.activa)return;
    const review=r.revisionPareos, queue=review.pendientes;
    if(queue.length<2)return say('No hay una pareja pendiente para revisar.');
    const colors=chooseColors(t,queue[0],queue[1],r.numero);
    if(action==='confirm'){
      const match={id:uid('partida'),mesa:r.emparejamientos.length+1,blancas:colors.blancas,negras:colors.negras,resultado:null,tipoResultado:null,jugado:null};
      r.emparejamientos.push(match);
      review.pendientes=queue.slice(2);
      review.confirmadas=(review.confirmadas||0)+1;
    } else if(action==='skip-white'||action==='skip-black'){
      if(queue.length<=2)return say('Ya no hay otro contrincante disponible. Confirma esta última pareja.');
      const skippedId=action==='skip-white'?colors.blancas:colors.negras;
      review.omitidos=review.omitidos||[];
      if(review.omitidos.includes(skippedId))return say('Este jugador ya fue pasado una vez durante la revisión. Confirma la pareja disponible.');
      review.omitidos.push(skippedId);
      review.pendientes=queue.filter(id=>id!==skippedId).concat(skippedId);
    }
    if(review.pendientes.length===0)review.completa=true;
    save(action==='confirm'?'Pareja confirmada y bloqueada.':`Jugador ${action==='skip-white'?'de blancas':'de negras'} pasó al final de la fila.`);
  }

$('lateParticipantForm').addEventListener('submit', e => {
  e.preventDefault();
  addLateParticipant();
});

$('lateImportCsvBtn').addEventListener('click', () => {
  $('lateCsvFile').click();
});

$('lateCsvFile').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const rows = parseCSV(await file.text());

    if (rows.length < 2) {
      throw new Error('El CSV no contiene filas de participantes.');
    }

    const headers = rows[0].map(norm);
    const col = (...names) => headers.findIndex(h => names.includes(h));

    const idCol = col('id', 'clave', 'matricula', 'participante_id');
    const nameCol = col('nombre', 'name', 'participante');

    if (idCol < 0 || nameCol < 0) {
      throw new Error('El CSV debe incluir encabezados id y nombre.');
    }

    const records = rows.slice(1).map(row => ({
      id: (row[idCol] || '').trim(),
      name: (row[nameCol] || '').trim()
    }));

    addLateParticipants(records, 'CSV');

  } catch (err) {
    say('No se pudo importar el CSV: ' + err.message);
  }

  e.target.value = '';
});

  function confirmRound(){
    const t=tournament(),r=t?.rondas.find(x=>x.id===activeRoundId);if(!t||!r)return;
    if(r.revisionPareos?.activa && (r.revisionPareos.pendientes||[]).length) return say('Termina de revisar todas las parejas antes de confirmar la ronda.');
    const check=M.validarEmparejamientos({torneo:t,ronda:r});
    if(!check.ok)return say(check.errors.map(x=>x.message).join(' '));
    if(!confirm(`¿Confirmar la ronda ${r.numero}? Después podrás capturar resultados.`))return;
    const res=M.confirmarRonda({torneo:t,rondaId:r.id});if(!res.ok)return say(res.errors.map(x=>x.message).join(' '));
    replaceTournament(res.data);save(`Ronda ${r.numero} confirmada. Ya puedes capturar resultados.`);
  }
  function recordResult(matchId,value){
    if(!value)return;
    const t=tournament(),r=t?.rondas.find(x=>x.id===activeRoundId);if(!t||!r)return;
    const res=value==='double-forfeit'
      ? M.registrarDobleIncomparecencia({torneo:t,rondaId:r.id,partidaId:matchId})
      : M.registrarResultado({torneo:t,rondaId:r.id,partidaId:matchId,resultado:value});
    if(!res.ok)return say(res.errors.map(x=>x.message).join(' '));
    replaceTournament(res.data);save(value==='double-forfeit'?'Doble incomparecencia registrada: 0–0.':'Resultado registrado.');
  }
  function closeRound(){
    const t=tournament(),r=t?.rondas.find(x=>x.id===activeRoundId);if(!t||!r)return;
    const pending=r.emparejamientos.filter(m=>m.resultado==null).length;
    if(pending)return say(`Faltan ${pending} resultados. No se puede cerrar la ronda.`);
    if(!confirm(`¿Cerrar definitivamente la ronda ${r.numero}?`))return;
    const res=M.cerrarRonda({torneo:t,rondaId:r.id});if(!res.ok)return say(res.errors.map(x=>x.message).join(' '));
    replaceTournament(res.data);save(`Ronda ${r.numero} cerrada.`);
  }
  function replaceTournament(updated){
    const ev=clone(state.event),i=ev.torneos.findIndex(x=>x.id===updated.id);if(i>=0)ev.torneos[i]=updated;
    if(ev.torneos.every(x=>x.estado==='finalizado'))ev.estado='finalizado';
    state.event=ev;
  }
  function renderAdmin(){
    const t=tournament();if(!t)return;
    $('adminCategoryName').textContent=t.categoria;
    $('adminCategoryMeta').textContent=`${t.participantes.length} participantes · ${t.configuracion.totalRounds} rondas · ${statusLabel(t)}`;
    $('generateRound').disabled=t.estado!=='en_curso'||t.rondas.length>=t.configuracion.totalRounds||(t.rondas.length>0&&t.rondas[t.rondas.length-1].estado!=='closed');
    if(t.estado==='configuracion'){
      $('roundHint').textContent='Inicia la categoría para generar la primera ronda.';
      $('generateRound').textContent='Iniciar categoría';
      $('generateRound').disabled=false;

    } else {
      $('generateRound').textContent='＋ Generar siguiente ronda';

      const last=t.rondas[t.rondas.length-1];
      $('roundHint').textContent=last?`Última ronda: ${last.numero} · ${last.estado==='closed'?'cerrada':last.estado==='confirmed'?'en captura':'borrador'}`:'Genera la primera ronda.';
    }
    $('roundList').innerHTML=t.rondas.length?t.rondas.map(r=>`<article class="round-card ${r.id===activeRoundId?'round-card-current':''}"><div class="round-card-heading"><h4>Ronda ${r.numero}</h4><span class="state-pill ${r.estado==='closed'?'state-success':r.estado==='confirmed'?'state-warning':'state-neutral'}">${r.estado==='closed'?'Cerrada':r.estado==='confirmed'?'En captura':'Borrador'}</span></div><div class="round-card-stats"><div><strong>${r.emparejamientos.length}</strong><span>Parejas</span></div><div><strong>${r.emparejamientos.filter(m=>m.resultado!=null).length}/${r.emparejamientos.length}</strong><span>Resultados</span></div></div><button class="button button-secondary" type="button" data-round="${r.id}">Ver ronda →</button></article>`).join(''):'<p class="muted">Aún no se han generado rondas.</p>';
    const r=t.rondas.find(x=>x.id===activeRoundId)||t.rondas[t.rondas.length-1]||null;
    if(r){
      activeRoundId=r.id;
      $('currentRoundPanel').hidden=false;
      $('currentRoundTitle').textContent=`Ronda ${r.numero}`;
      $('currentRoundStatus').textContent=r.estado==='draft'?'Borrador: revisa los emparejamientos y confirma la ronda.':r.estado==='confirmed'?'Captura los resultados de todas las mesas.':'Ronda cerrada.';
      const reviewPending=(r.revisionPareos?.pendientes||[]).length;
      const reviewDone=!r.revisionPareos?.activa || reviewPending===0;
      $('roundActions').innerHTML=(r.estado==='draft'?`<button class="button button-primary" type="button" data-round-action="confirm" ${reviewDone?'':'disabled'}>Confirmar ronda</button>`:r.estado==='confirmed'?'<button class="button button-primary" type="button" data-round-action="close">Cerrar ronda</button>':'<span class="state-pill state-success">Cerrada</span>')+' <button class="button button-secondary" type="button" data-round-action="export">Exportar ronda CSV ↓</button>';
      renderPairingReview(t,r);
      const roundQuery=norm($('roundPlayerSearch')?.value||'');
      const captureFilter=$('roundCaptureFilter')?.value||'all';
      const allMatches=r.emparejamientos.map((m,i)=>{
        const white=t.participantes.find(p=>p.playerId===m.blancas)||{playerId:m.blancas,name:m.blancas};
        const black=t.participantes.find(p=>p.playerId===m.negras)||{playerId:m.negras,name:m.negras};
        const found=(!roundQuery||norm(`${white.playerId} ${white.name} ${black.playerId} ${black.name}`).includes(roundQuery)) &&
          (captureFilter==='all'||(captureFilter==='pending'?m.resultado==null:m.resultado!=null));
        return {m,i,white,black,found};
      });
      const visibleMatches=allMatches.filter(x=>x.found);
      $('matchesTable').innerHTML=visibleMatches.map(({m,i,white,black})=>`<tr class="${roundQuery?'is-search-match':''}"><td>${i+1}</td><td><strong>${esc(white.playerId)}</strong></td><td>${esc(white.name)}</td><td><strong>${esc(black.playerId)}</strong></td><td>${esc(black.name)}</td><td><strong>${resultText(m.resultado)}</strong></td><td>${r.estado==='confirmed'&&m.resultado==null?`<select data-match="${m.id}"><option value="">Seleccionar</option><option value="1-0">1–0</option><option value="0-1">0–1</option><option value="0.5-0.5">½–½</option><option value="double-forfeit">0–0 · Ambos ausentes</option></select>`:m.resultado==null?'Pendiente':'Capturado'}</td></tr>`).join('')||`<tr><td colspan="7" class="empty-cell">${roundQuery?'No se encontró ese ID o resultado en esta ronda.':'No hay partidas que coincidan con el filtro.'}</td></tr>`;
      const visibleByes=(r.byes||[]).filter(b=>{const p=t.participantes.find(x=>x.playerId===b.jugadorId)||{playerId:b.jugadorId,name:b.jugadorId};return !roundQuery||norm(`${p.playerId} ${p.name}`).includes(roundQuery);});
      $('byeList').innerHTML=visibleByes.length?`<p class="notice notice-info">BYE: ${visibleByes.map(b=>{const p=t.participantes.find(x=>x.playerId===b.jugadorId)||{playerId:b.jugadorId,name:b.jugadorId};return `${esc(p.playerId)} · ${esc(p.name)}`}).join(', ')} · ${visibleByes[0].puntos} punto(s)</p>`:'';
      const captured=r.emparejamientos.filter(m=>m.resultado!=null).length;
      const pending=r.emparejamientos.length-captured;
      $('roundSearchStatus').textContent=`${captured} capturadas · ${pending} pendientes · ${visibleMatches.length} visibles`;
      $('pairingNotice').textContent=r.revisionPareos?.activa
        ? `Primera ronda: ${r.emparejamientos.length} parejas confirmadas y bloqueadas; ${reviewPending} participantes por revisar.`
        : 'Los emparejamientos son orientativos del suizo simplificado. Verifica la lista antes de confirmar.';
    } else {
      $('currentRoundPanel').hidden=true;
      $('pairingReviewPanel').hidden=true;
    }
    const standings=M.calcularClasificacion({torneo:t}).data||[];
    $('standingsCount').textContent=`${standings.length} participantes en la clasificación`;
    $('standingsTable').innerHTML=standings.map(p=>`<tr><td><strong>${p.posicion}</strong></td><td>${esc(p.playerId)}</td><td>${esc(p.nombre)}</td><td><strong>${fmt(p.puntos)}</strong></td><td>${fmt(p.buchholz)}</td><td>${fmt(p.buchholzCut1)}</td><td>${fmt(p.sonnebornBerger)}</td><td>${fmt(p.progressive)}</td><td>${p.wins}</td></tr>`).join('')||'<tr><td colspan="9">La clasificación aparecerá aquí.</td></tr>';
  }
  function renderPairingReview(t,r){
    const panel=$('pairingReviewPanel');
    const review=r.revisionPareos;
    if(r.numero!==1 || !review?.activa || r.estado!=='draft'){
      panel.hidden=true;panel.innerHTML='';return;
    }
    panel.hidden=false;
    const q=review.pendientes||[];
    if(q.length===0){
      panel.innerHTML=`<div class="pairing-review-head"><div><h3>Revisión de primera ronda</h3><p>La revisión de parejas terminó. Confirma la ronda para habilitar la captura.</p></div><span class="state-pill state-success">Completa</span></div><p class="muted">${r.emparejamientos.length} parejas confirmadas y bloqueadas.</p>`;
      return;
    }
    if(q.length===1){
      panel.innerHTML='<div class="notice notice-warning"><strong>Revisión incompleta:</strong> quedó un participante sin pareja. No confirmes esta ronda; revisa el BYE y el padrón.</div>';
      return;
    }
    const colors=chooseColors(t,q[0],q[1],r.numero);
    const white=t.participantes.find(p=>p.playerId===colors.blancas)||{playerId:colors.blancas,name:colors.blancas};
    const black=t.participantes.find(p=>p.playerId===colors.negras)||{playerId:colors.negras,name:colors.negras};
    const skipped=review.omitidos||[];
    const skippedNames=skipped.map(id=>{const p=t.participantes.find(x=>x.playerId===id);return p?`${p.name} (${p.playerId})`:id;});
    const canSkip=q.length>2;
    panel.innerHTML=`
      <div class="pairing-review-head"><div><p class="eyebrow">REVISIÓN MANUAL · PRIMERA RONDA</p><h3>Pareja ${r.emparejamientos.length+1}</h3><p>${r.emparejamientos.length} parejas confirmadas · ${q.length} participantes en fila</p></div><span class="state-pill state-warning">Sin confirmar</span></div>
      <div class="pairing-review-players">
        <div class="pairing-player"><span class="piece-label">♔ Blancas</span><strong>${esc(white.name)}</strong><small>${esc(white.playerId)}</small></div>
        <div class="pairing-player"><span class="piece-label">♚ Negras</span><strong>${esc(black.name)}</strong><small>${esc(black.playerId)}</small></div>
      </div>
      <div class="pairing-review-actions">
        <button class="button button-primary" type="button" data-pair-review="confirm">✓ Confirmar pareja</button>
        <button class="button button-secondary" type="button" data-pair-review="skip-white" ${!canSkip||skipped.includes(colors.blancas)?'disabled':''}>Pasar blancas al final</button>
        <button class="button button-secondary" type="button" data-pair-review="skip-black" ${!canSkip||skipped.includes(colors.negras)?'disabled':''}>Pasar negras al final</button>
      </div>
      <p class="muted">Al confirmar, esta pareja queda bloqueada. Si pasas a un jugador, irá al final de la fila y no podrá volver a pasarse durante esta revisión. ${canSkip?'':'Solo quedan estos dos jugadores: debes confirmar esta pareja.'}</p>
      ${skippedNames.length?`<p class="pairing-skipped-list"><strong>Pasados al final:</strong> ${skippedNames.map(esc).join(' · ')}</p>`:''}`;
  }

  function renderPhysicalControls(){
    const ev=state.event,host=$('physicalRoundSelections');
    if(!ev){host.innerHTML='<p class="muted">No hay evento activo.</p>';return;}
    const saved=ev.distribucionFisica?.seleccion||{};
    host.innerHTML=(ev.torneos||[]).map(t=>{
      const available=(t.rondas||[]).filter(r=>r.estado==='confirmed'||r.estado==='closed');
      if(!available.length)return `<label class="physical-round-choice"><strong>${esc(t.categoria)}</strong><span class="muted">Sin ronda confirmada o cerrada</span></label>`;
      const hasSaved=Object.prototype.hasOwnProperty.call(saved,t.id);
      const selected=hasSaved?saved[t.id]:available[available.length-1].id;
      return `<label class="physical-round-choice"><strong>${esc(t.categoria)}</strong><select data-physical-tournament="${esc(t.id)}"><option value="" ${selected===''?'selected':''}>No incluir esta categoría</option>${available.map(r=>`<option value="${esc(r.id)}" ${r.id===selected?'selected':''}>Ronda ${r.numero} · ${r.estado==='closed'?'Cerrada':'En captura'}</option>`).join('')}</select></label>`;
    }).join('')||'<p class="muted">No hay categorías en este evento.</p>';
  }

  function buildPhysicalDistribution(){
    const ev=state.event;if(!ev)return say('No hay evento activo.');
    const selects=[...$('physicalRoundSelections').querySelectorAll('select[data-physical-tournament]')];
    const groups=[];const selection={};const byes=[];
    for(const select of selects){
      const t=ev.torneos.find(x=>x.id===select.dataset.physicalTournament);if(!t)continue;
      selection[t.id]=select.value||'';
      if(!select.value)continue;
      const r=t.rondas.find(x=>x.id===select.value);if(!r)continue;
      groups.push({t,r,matches:r.emparejamientos||[]});
      (r.byes||[]).forEach(b=>{
        const p=t.participantes.find(x=>x.playerId===b.jugadorId);
        byes.push({categoria:t.categoria,ronda:r.numero,playerId:b.jugadorId,nombre:p?.name||b.jugadorId,puntos:b.puntos});
      });
    }
    if(!groups.length)return say('Selecciona al menos una ronda confirmada o cerrada.');
    const ordered=[];const max=Math.max(0,...groups.map(g=>g.matches.length));
    for(let i=0;i<max;i++)for(const g of groups){
      const m=g.matches[i];if(!m)continue;
      const white=g.t.participantes.find(p=>p.playerId===m.blancas)||{playerId:m.blancas,name:m.blancas};
      const black=g.t.participantes.find(p=>p.playerId===m.negras)||{playerId:m.negras,name:m.negras};
      ordered.push({categoria:g.t.categoria,torneoId:g.t.id,rondaId:g.r.id,ronda:g.r.numero,partidaId:m.id,blancas:m.blancas,blancasNombre:white.name,negras:m.negras,negrasNombre:black.name,resultado:m.resultado||null});
    }
    const assignments=ordered.map((m,i)=>({...m,mesa:i<100?Math.floor(i/4)+1:null,tablero:i<100?(i%4)+1:null}));
    ev.distribucionFisica={version:1,creadaEn:new Date().toISOString(),capacidadMesas:25,tablerosPorMesa:4,seleccion:selection,asignaciones:assignments,byes};
    save(`Distribución mixta generada: ${Math.min(100,assignments.length)} de ${assignments.length} partidas ubicadas en las 25 mesas.`);
  }

  function renderPhysicalDistribution(){
    const ev=state.event,dist=ev?.distribucionFisica;
    const result=$('physicalDistributionResult'),summary=$('physicalDistributionSummary'),exportBtn=$('exportPhysicalDistribution');
    if(!dist){result.innerHTML='<p class="muted">Todavía no hay una distribución generada.</p>';summary.textContent='Selecciona una ronda confirmada o cerrada de cada categoría que jugará en esta jornada.';exportBtn.disabled=true;return;}
    exportBtn.disabled=!(dist.asignaciones||[]).length;
    const q=norm($('physicalSearch')?.value||'');
    const assigned=(dist.asignaciones||[]).filter(x=>x.mesa!=null).length;
    const overflow=(dist.asignaciones||[]).length-assigned;
    const byeList=dist.byes||[];
    summary.textContent=`${assigned} partidas ubicadas de ${dist.asignaciones.length} · ${overflow} sin mesa por superar la capacidad de 100 tableros · ${byeList.length} BYE(s) fuera de la distribución. Generada: ${new Date(dist.creadaEn).toLocaleString('es-MX')}.`;
    const visible=(dist.asignaciones||[]).filter(m=>!q||norm([m.categoria,m.ronda,m.blancas,m.blancasNombre,m.negras,m.negrasNombre].join(' ')).includes(q));
    result.innerHTML=`<table><thead><tr><th>Mesa</th><th>Tablero</th><th>Categoría</th><th>Ronda</th><th>ID blancas</th><th>Blancas</th><th>ID negras</th><th>Negras</th></tr></thead><tbody>${visible.map(m=>`<tr><td>${m.mesa??'Sin asignar'}</td><td>${m.tablero??'—'}</td><td>${esc(m.categoria)}</td><td>${m.ronda}</td><td><strong>${esc(m.blancas)}</strong></td><td>${esc(m.blancasNombre)}</td><td><strong>${esc(m.negras)}</strong></td><td>${esc(m.negrasNombre)}</td></tr>`).join('')||'<tr><td colspan="8" class="empty-cell">No hay partidas que coincidan con la búsqueda.</td></tr>'}</tbody></table>`+
      (byeList.length?`<div class="physical-byes"><strong>BYE (sin tablero)</strong><p>${byeList.map(b=>`${esc(b.categoria)} · R${b.ronda} · ${esc(b.playerId)} ${esc(b.nombre)} (${fmt(b.puntos)} pts)`).join(' | ')}</p></div>`:'');
  }

  function exportPhysicalDistributionCsv(){
    const dist=state.event?.distribucionFisica;if(!dist)return say('Primero genera una distribución.');
    const header=['Mesa','Tablero','Categoría','Ronda','ID','Participante','Color','ID rival','Rival','Resultado'];
    const rows=[];
    dist.asignaciones.forEach(m=>{
      const location=m.mesa==null?'Sin asignar':m.mesa;
      const board=m.tablero==null?'':m.tablero;
      rows.push([location,board,m.categoria,m.ronda,m.blancas,m.blancasNombre,'Blancas',m.negras,m.negrasNombre,resultText(m.resultado)]);
      rows.push([location,board,m.categoria,m.ronda,m.negras,m.negrasNombre,'Negras',m.blancas,m.blancasNombre,resultText(m.resultado)]);
    });
    dist.byes.forEach(b=>rows.push(['','',b.categoria,b.ronda,b.playerId,b.nombre,'BYE','','',`BYE (${b.puntos})`]));
    const csv='\uFEFF'+[header,...rows].map(row=>row.map(csvCell).join(',')).join('\r\n');
    download(`distribucion_mesas_${new Date().toISOString().slice(0,10)}.csv`,csv,'text/csv;charset=utf-8');
    say('Se exportó la distribución general de mesas.');
  }

  function startTournament(id){
    const ev=state.event;const r=M.iniciarTorneo({evento:ev,torneoId:id});
    if(!r.ok)return say(r.errors.map(x=>x.message).join(' '));
    state.event=r.data;activeTournamentId=id;save('Categoría iniciada. Genera la primera ronda.');
  }
  $('backupData').addEventListener('click',()=>download(`respaldo_torneo_${new Date().toISOString().slice(0,10)}.json`,JSON.stringify({version:1,exportedAt:new Date().toISOString(),...state},null,2),'application/json'));
  $('restoreFile').addEventListener('change',async e=>{
    const f=e.target.files[0];if(!f)return;
    try{const data=JSON.parse(await f.text());const candidate=data.state||data;
      if(!Array.isArray(candidate.players)||!(candidate.event===null||candidate.event&&Array.isArray(candidate.event.torneos)))throw new Error('Estructura de respaldo no reconocida.');
      if(!confirm('Restaurar este respaldo reemplazará los datos actuales de este navegador. ¿Continuar?'))return;
      state={players:candidate.players,event:candidate.event};activeTournamentId=null;activeRoundId=null;save('Respaldo restaurado correctamente.');
    }catch(err){say('No se pudo restaurar el respaldo: '+err.message);}
    e.target.value='';
  });

  // Dashboard y navegación
  document.querySelectorAll('.main-nav .nav-link').forEach(a=>a.addEventListener('click',()=>{
    document.querySelectorAll('.main-nav .nav-link').forEach(x=>x.classList.remove('is-active'));a.classList.add('is-active');
  }));
  renderAll();
})();
