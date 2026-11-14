/* Juegos Terva · Gestor de torneos · interfaz 0.3.0 */
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
    const out=[]; let row=[], field='', quoted=false;
    for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];
      if(c==='"'&&quoted&&n==='"'){field+='"';i++;}
      else if(c==='"') quoted=!quoted;
      else if(c===','&&!quoted){row.push(field);field='';}
      else if((c==='\n'||c==='\r')&&!quoted){if(c==='\r'&&n==='\n')i++;row.push(field);if(row.some(x=>x.trim()))out.push(row);row=[];field='';}
      else field+=c;
    }
    row.push(field);if(row.some(x=>x.trim()))out.push(row);return out;
  }
  $('templateCsv').addEventListener('click',e=>{e.preventDefault();download('plantilla_participantes.csv','id,nombre,categoria\nAJ-001,Ana López,Infantil\nAJ-002,Luis Pérez,Infantil\n','text/csv;charset=utf-8');});
  $('exportCsv').addEventListener('click',()=>download('padron_participantes.csv','id,nombre,categoria\n'+state.players.map(p=>[p.id,p.name,p.category].map(csvCell).join(',')).join('\n'),'text/csv;charset=utf-8'));
  $('roundPlayerSearch').addEventListener('input',()=>{if(activeTournamentId&&tournament())renderAdmin();});
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
  $('exportStandings').addEventListener('click',()=>{
    const t=tournament();if(!t)return;
    const rows=M.calcularClasificacion({torneo:t}).data||[];
    download(`clasificacion_${slug(t.categoria)}.csv`,'posicion,id,nombre,puntos,buchholz,buchholz_corte_1,sonneborn_berger,progresivo,victorias\n'+rows.map(p=>[p.posicion,p.playerId,p.nombre,p.puntos,p.buchholz,p.buchholzCut1,p.sonnebornBerger,p.progressive,p.wins].map(csvCell).join(',')).join('\n'),'text/csv;charset=utf-8');
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
      rows.push([i+1,white.playerId,white.name,'Blancas',black.playerId,black.name,m.resultado||'Pendiente']);
      rows.push([i+1,black.playerId,black.name,'Negras',white.playerId,white.name,m.resultado||'Pendiente']);
    });
    (r.byes||[]).forEach(b=>{
      const p=participant(b.jugadorId);
      rows.push(['BYE',p.playerId,p.name,'BYE','','',`BYE (${b.puntos} punto${Number(b.puntos)===1?'':'s'})`]);
    });
    const header=['Mesa','ID','Participante','Color','ID rival','Rival','Resultado'];
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
  function activePlayers(t, roundNo){return t.participantes.filter(p=>p.estado!=='retirado'&&!(p.estado==='retiro_programado'&&p.retiroEfectivoDesde!=null&&roundNo>=p.retiroEfectivoDesde));}
  function scoreMap(t){const rows=M.calcularClasificacion({torneo:t}).data||[];return new Map(rows.map(r=>[r.playerId,Number(r.puntos)||0]));}
  function hasPlayed(t,a,b){return t.rondas.some(r=>r.estado!=='draft'&&r.emparejamientos.some(m=>m.jugado===true&&((m.blancas===a&&m.negras===b)||(m.blancas===b&&m.negras===a))));}
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
    let pairs;
    if(no===1){
      const sorted=pool.slice().sort((a,b)=>a.numeroEmparejamiento-b.numeroEmparejamiento);
      const half=sorted.length/2;
      pairs=Array.from({length:half},(_,i)=>({a:sorted[i],b:sorted[i+half]}));
    } else {
      pairs=pairRemaining(pool.slice().sort((a,b)=>(scores.get(b.playerId)||0)-(scores.get(a.playerId)||0)||a.numeroEmparejamiento-b.numeroEmparejamiento),scores,t);
      if(!pairs)return say('No se encontró una combinación completa sin repetir rivales. La ronda no fue creada; será necesaria una revisión manual.');
    }
    const round={id:uid('ronda'),numero:no,estado:'draft',emparejamientos:pairs.map((pair,i)=>({id:uid('partida'),mesa:i+1,...chooseColors(t,pair.a.playerId,pair.b.playerId,no),resultado:null,tipoResultado:null,jugado:null})),byes:bye?[{id:uid('bye'),jugadorId:bye.playerId,puntos:t.configuracion.points.bye}]:[],creadaEn:new Date().toISOString()};
    const validation=M.validarEmparejamientos({torneo:t,ronda:round});
    if(!validation.ok)return say('El motor rechazó la ronda: '+validation.errors.map(x=>x.message).join(' '));
    t.rondas.push(round); activeRoundId=round.id; save(`Ronda ${no} generada como borrador. Revisa mesas y colores antes de confirmarla.`);
  }
  function confirmRound(){
    const t=tournament(),r=t?.rondas.find(x=>x.id===activeRoundId);if(!t||!r)return;
    const check=M.validarEmparejamientos({torneo:t,ronda:r});
    if(!check.ok)return say(check.errors.map(x=>x.message).join(' '));
    if(!confirm(`¿Confirmar la ronda ${r.numero}? Después podrás capturar resultados.`))return;
    const res=M.confirmarRonda({torneo:t,rondaId:r.id});if(!res.ok)return say(res.errors.map(x=>x.message).join(' '));
    replaceTournament(res.data);save(`Ronda ${r.numero} confirmada. Ya puedes capturar resultados.`);
  }
  function recordResult(matchId,value){
    if(!value)return;
    const t=tournament(),r=t?.rondas.find(x=>x.id===activeRoundId);if(!t||!r)return;
    const res=M.registrarResultado({torneo:t,rondaId:r.id,partidaId:matchId,resultado:value});
    if(!res.ok)return say(res.errors.map(x=>x.message).join(' '));
    replaceTournament(res.data);save('Resultado registrado.');
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
    $('roundList').innerHTML=t.rondas.length?t.rondas.map(r=>`<article class="round-card ${r.id===activeRoundId?'round-card-current':''}"><div class="round-card-heading"><h4>Ronda ${r.numero}</h4><span class="state-pill ${r.estado==='closed'?'state-success':r.estado==='confirmed'?'state-warning':'state-neutral'}">${r.estado==='closed'?'Cerrada':r.estado==='confirmed'?'En captura':'Borrador'}</span></div><div class="round-card-stats"><div><strong>${r.emparejamientos.length}</strong><span>Mesas</span></div><div><strong>${r.emparejamientos.filter(m=>m.resultado!=null).length}/${r.emparejamientos.length}</strong><span>Resultados</span></div></div><button class="button button-secondary" type="button" data-round="${r.id}">Ver ronda →</button></article>`).join(''):'<p class="muted">Aún no se han generado rondas.</p>';
    const r=t.rondas.find(x=>x.id===activeRoundId)||t.rondas[t.rondas.length-1]||null;
    if(r){activeRoundId=r.id;$('currentRoundPanel').hidden=false;$('currentRoundTitle').textContent=`Ronda ${r.numero}`;$('currentRoundStatus').textContent=r.estado==='draft'?'Borrador: revisa los emparejamientos y confirma la ronda.':r.estado==='confirmed'?'Captura los resultados de todas las mesas.':'Ronda cerrada.';
      $('roundActions').innerHTML=(r.estado==='draft'?'<button class="button button-primary" type="button" data-round-action="confirm">Confirmar ronda</button>':r.estado==='confirmed'?'<button class="button button-primary" type="button" data-round-action="close">Cerrar ronda</button>':'<span class="state-pill state-success">Cerrada</span>')+' <button class="button button-secondary" type="button" data-round-action="export">Exportar ronda CSV ↓</button>';
      const roundQuery=norm($('roundPlayerSearch')?.value||'');
      const allMatches=r.emparejamientos.map((m,i)=>{
        const white=playerById(m.blancas)||{id:m.blancas,name:m.blancas};
        const black=playerById(m.negras)||{id:m.negras,name:m.negras};
        const found=!roundQuery||norm(`${white.id} ${white.name} ${black.id} ${black.name}`).includes(roundQuery);
        return {m,i,white,black,found};
      });
      const visibleMatches=allMatches.filter(x=>x.found);
      $('matchesTable').innerHTML=visibleMatches.map(({m,i,white,black})=>`<tr class="${roundQuery?'is-search-match':''}"><td>${i+1}</td><td><strong>${esc(white.id)}</strong></td><td>${esc(white.name)}</td><td><strong>${esc(black.id)}</strong></td><td>${esc(black.name)}</td><td><strong>${resultText(m.resultado)}</strong></td><td>${r.estado==='confirmed'&&m.resultado==null?`<select data-match="${m.id}"><option value="">Seleccionar</option><option value="1-0">1–0</option><option value="0-1">0–1</option><option value="0.5-0.5">½–½</option></select>`:m.resultado==null?'Pendiente':'Capturado'}</td></tr>`).join('')||`<tr><td colspan="7" class="empty-cell">${roundQuery?'No se encontró ese ID en las partidas de esta ronda.':'Sin partidas.'}</td></tr>`;
      const visibleByes=(r.byes||[]).filter(b=>{const p=playerById(b.jugadorId)||{id:b.jugadorId,name:b.jugadorId};return !roundQuery||norm(`${p.id} ${p.name}`).includes(roundQuery);});
      $('byeList').innerHTML=visibleByes.length?`<p class="notice notice-info">BYE: ${visibleByes.map(b=>{const p=playerById(b.jugadorId)||{id:b.jugadorId,name:b.jugadorId};return `${esc(p.id)} · ${esc(p.name)}`}).join(', ')} · ${visibleByes[0].puntos} punto(s)</p>`:'';
      $('roundSearchStatus').textContent=roundQuery?`${visibleMatches.length} mesa(s) coincidente(s)${visibleByes.length?' · BYE encontrado':''}`:`${r.emparejamientos.length} mesas`;

      $('pairingNotice').textContent='Los emparejamientos son orientativos del suizo simplificado. Verifica la lista antes de confirmar.';
    } else {$('currentRoundPanel').hidden=true;}
    const standings=M.calcularClasificacion({torneo:t}).data||[];
    $('standingsCount').textContent=`${standings.length} participantes en la clasificación`;
    $('standingsTable').innerHTML=standings.map(p=>`<tr><td><strong>${p.posicion}</strong></td><td>${esc(p.playerId)}</td><td>${esc(p.nombre)}</td><td><strong>${fmt(p.puntos)}</strong></td><td>${fmt(p.buchholz)}</td><td>${fmt(p.buchholzCut1)}</td><td>${fmt(p.sonnebornBerger)}</td><td>${fmt(p.progressive)}</td><td>${p.wins}</td></tr>`).join('')||'<tr><td colspan="9">La clasificación aparecerá aquí.</td></tr>';
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
