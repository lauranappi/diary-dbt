// ════════════════════════════════════════════════════════════════
// POST-IT — appunti personali sulle abilita' e sui moduli della guida
// ════════════════════════════════════════════════════════════════
// Servono per annotare quello che emerge durante i gruppi di skills
// training. Restano SOLO su questo dispositivo (localStorage): non
// passano dalla riga condivisa col terapeuta, cosi' sono davvero privati.
//
// Modello: { "<chiave>": [ {id, t, c, ts} ] }
//   chiave  sk:<id abilita'> | mod:<id modulo> | emo:<id emozione>
//   t = testo, c = colore (indice in PI_COLORI), ts = ultima modifica

const PI_COLORI = [
  {nome:'Giallo',  bg:'#FFE9A3'},
  {nome:'Rosa',    bg:'#F9CFCB'},
  {nome:'Menta',   bg:'#CDE8D9'},
  {nome:'Azzurro', bg:'#CFE3F3'},
  {nome:'Lilla',   bg:'#E1D6F0'},
  {nome:'Pesca',   bg:'#FAD7B8'}
];
const PI_MAX_CARATTERI = 600;

let _piCache = null, _piCacheKey = '';
function piStorageKey(){
  const code = (typeof profile !== 'undefined' && profile && profile.code) ? profile.code : 'anon';
  return 'dbt_postit_' + code;
}
function piAll(){
  const k = piStorageKey();
  if(_piCache && _piCacheKey === k) return _piCache;
  let o = {};
  try{
    const r = localStorage.getItem(k);
    if(r){ const p = JSON.parse(r); if(p && typeof p === 'object') o = p; }
  }catch(e){ o = {}; }
  _piCache = o; _piCacheKey = k;
  return o;
}
function piSave(){
  try{ localStorage.setItem(piStorageKey(), JSON.stringify(piAll())); }
  catch(e){ /* storage pieno o bloccato: i post-it restano in memoria per la sessione */ }
  if(typeof gsPianifica === 'function') gsPianifica();
}
// gli appunti eliminati restano come "lapide" (d:1) per poter sincronizzare la cancellazione
function piList(key){ return (piAll()[key] || []).filter(function(p){ return !p.d; }); }
function piImpostaTutto(o){
  _piCache = o; _piCacheKey = piStorageKey();
  try{ localStorage.setItem(_piCacheKey, JSON.stringify(o)); }catch(e){}
}

function piUpsert(key, id, testo, colore){
  const all = piAll();
  const list = all[key] || (all[key] = []);
  const ex = id ? list.find(function(p){ return p.id === id; }) : null;
  if(ex){ ex.t = testo; ex.c = colore; ex.ts = Date.now(); delete ex.d; }
  else list.unshift({id:'p' + Date.now().toString(36) + Math.random().toString(36).slice(2,6), t:testo, c:colore, ts:Date.now()});
  piSave();
}
function piRemove(key, id){
  const all = piAll();
  if(!all[key]) return;
  const p = all[key].find(function(x){ return x.id === id; });
  if(p){ p.d = 1; p.t = ''; p.ts = Date.now(); }
  piSave();
}

// ── Montaggio: restituisce il blocco "Appunti" da inserire nella pagina ──
function piMount(key, titolo){
  const wrap = document.createElement('div');
  wrap.className = 'pi-wrap';
  wrap.dataset.piKey = key;
  wrap.dataset.piTitolo = titolo || 'Appunti dai gruppi';
  piRender(wrap);
  return wrap;
}

function piRender(wrap){
  const key = wrap.dataset.piKey;
  const list = piList(key);
  wrap.innerHTML = '';

  const head = document.createElement('div');
  head.className = 'pi-head';
  const tit = document.createElement('span');
  tit.className = 'pi-titolo';
  tit.textContent = wrap.dataset.piTitolo;
  head.appendChild(tit);

  const add = document.createElement('button');
  add.type = 'button';
  add.className = 'pi-add';
  add.setAttribute('data-nav', '');
  add.setAttribute('aria-label', 'Aggiungi un post-it');
  add.textContent = '+ Post-it';
  add.addEventListener('click', function(ev){
    ev.preventDefault(); ev.stopPropagation();
    piApriEditor(key, null, wrap);
  });
  head.appendChild(add);
  wrap.appendChild(head);

  if(!list.length){
    const v = document.createElement('div');
    v.className = 'pi-vuoto';
    v.textContent = 'Nessun appunto. Tocca "+ Post-it" per scriverne uno durante il gruppo.';
    wrap.appendChild(v);
  } else {
    const grid = document.createElement('div');
    grid.className = 'pi-grid';
    list.forEach(function(p, i){
      const col = PI_COLORI[p.c] || PI_COLORI[0];
      const n = document.createElement('button');
      n.type = 'button';
      n.className = 'pi-nota pi-rot' + (i % 4);
      n.style.background = col.bg;
      n.setAttribute('data-nav', '');
      n.setAttribute('aria-label', 'Modifica post-it ' + col.nome.toLowerCase());
      const tx = document.createElement('span');
      tx.className = 'pi-testo';
      tx.textContent = p.t;
      const dt = document.createElement('span');
      dt.className = 'pi-data';
      dt.textContent = new Date(p.ts).toLocaleDateString('it-IT', {day:'numeric', month:'short'});
      n.appendChild(tx); n.appendChild(dt);
      n.addEventListener('click', function(ev){
        ev.preventDefault(); ev.stopPropagation();
        piApriEditor(key, p.id, wrap);
      });
      grid.appendChild(n);
    });
    wrap.appendChild(grid);
  }
  piAggiornaBadge(key);
}

// Pallino col numero di appunti accanto al titolo dell'abilita'
function piAggiornaBadge(key){
  if(key.indexOf('sk:') !== 0) return;
  const id = key.slice(3);
  const arr = document.getElementById('sarr-' + id);
  if(!arr || !arr.parentElement) return;
  let b = arr.parentElement.querySelector('.pi-badge');
  const n = piList(key).length;
  if(!n){ if(b) b.remove(); return; }
  if(!b){
    b = document.createElement('span');
    b.className = 'pi-badge';
    b.setAttribute('aria-label', 'Hai degli appunti su questa abilità');
    arr.parentElement.insertBefore(b, arr);
  }
  b.textContent = n;
}

// Dopo che renderGuide() ha costruito tutto: aggiorna i badge gia' esistenti
function piAggiornaTuttiIBadge(){
  Object.keys(piAll()).forEach(piAggiornaBadge);
}

// ── Editor a comparsa (un solo elemento, riusato) ──
let _piEd = null;
function piCreaEditor(){
  const bg = document.createElement('div');
  bg.className = 'pi-sheet-bg';
  bg.innerHTML =
    '<div class="pi-sheet" role="dialog" aria-modal="true" aria-label="Post-it">'
    + '<div class="pi-sheet-nota">'
    +   '<textarea class="pi-ta" maxlength="' + PI_MAX_CARATTERI + '" placeholder="Cosa è emerso nel gruppo?" aria-label="Testo del post-it"></textarea>'
    +   '<div class="pi-conta"></div>'
    + '</div>'
    + '<div class="pi-tools" role="toolbar" aria-label="Inserisci simboli">'
    +   '<button type="button" class="pi-tool" data-ins="→ " aria-label="Freccia a destra">→</button>'
    +   '<button type="button" class="pi-tool" data-ins="↓ " aria-label="Freccia in basso">↓</button>'
    +   '<button type="button" class="pi-tool" data-ins="↳ " aria-label="Freccia a squadra">↳</button>'
    +   '<button type="button" class="pi-tool pi-tool-el" data-el="1" aria-label="Elenco puntato">• Elenco</button>'
    + '</div>'
    + '<div class="pi-colori" role="radiogroup" aria-label="Colore"></div>'
    + '<div class="pi-azioni">'
    +   '<button type="button" class="pi-btn pi-elimina">Elimina</button>'
    +   '<span style="flex:1"></span>'
    +   '<button type="button" class="pi-btn pi-annulla">Annulla</button>'
    +   '<button type="button" class="pi-btn pi-chiudi">Chiudi</button>'
    +   '<button type="button" class="pi-btn pi-modifica">Modifica</button>'
    +   '<button type="button" class="pi-btn pi-salva">Salva</button>'
    + '</div>'
    + '</div>';
  document.body.appendChild(bg);

  const colori = bg.querySelector('.pi-colori');
  PI_COLORI.forEach(function(c, i){
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'pi-dot';
    b.style.background = c.bg;
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-label', c.nome);
    b.dataset.c = i;
    colori.appendChild(b);
  });

  const ed = {bg:bg, sheet:bg.querySelector('.pi-sheet'), nota:bg.querySelector('.pi-sheet-nota'),
              ta:bg.querySelector('.pi-ta'), conta:bg.querySelector('.pi-conta'),
              del:bg.querySelector('.pi-elimina'), colore:0, key:null, id:null, wrap:null};

  function aggiornaConta(){ ed.conta.textContent = ed.ta.value.length + ' / ' + PI_MAX_CARATTERI; }
  function scegli(i){
    ed.colore = i;
    ed.nota.style.background = PI_COLORI[i].bg;
    colori.querySelectorAll('.pi-dot').forEach(function(d){
      const on = (+d.dataset.c === i);
      d.classList.toggle('on', on);
      d.setAttribute('aria-checked', on ? 'true' : 'false');
    });
  }
  ed.scegli = scegli;
  ed.aggiornaConta = aggiornaConta;

  colori.addEventListener('click', function(ev){
    const d = ev.target.closest('.pi-dot');
    if(d) scegli(+d.dataset.c);
  });
  ed.ta.addEventListener('input', aggiornaConta);

  // simboli rapidi e elenchi puntati: inseriti dove si trova il cursore
  function inserisci(txt){
    const ta = ed.ta, a = ta.selectionStart, b = ta.selectionEnd;
    ta.value = ta.value.slice(0, a) + txt + ta.value.slice(b);
    ta.selectionStart = ta.selectionEnd = a + txt.length;
    aggiornaConta(); ta.focus();
  }
  function elenco(){
    const ta = ed.ta, pos = ta.selectionStart;
    const inizio = ta.value.lastIndexOf('\n', pos - 1) + 1;
    const riga = ta.value.slice(inizio);
    if(/^• /.test(riga)){          // gia' puntata: la toglie
      ta.value = ta.value.slice(0, inizio) + ta.value.slice(inizio + 2);
      ta.selectionStart = ta.selectionEnd = Math.max(inizio, pos - 2);
    } else {
      ta.value = ta.value.slice(0, inizio) + '• ' + ta.value.slice(inizio);
      ta.selectionStart = ta.selectionEnd = pos + 2;
    }
    aggiornaConta(); ta.focus();
  }
  bg.querySelector('.pi-tools').addEventListener('pointerdown', function(ev){
    if(ev.target.closest('.pi-tool')) ev.preventDefault();   // la tastiera resta aperta
  });
  bg.querySelector('.pi-tools').addEventListener('click', function(ev){
    const t = ev.target.closest('.pi-tool'); if(!t || ed.ta.readOnly) return;
    if(t.dataset.el) elenco(); else inserisci(t.dataset.ins);
  });
  // a capo dentro un elenco: continua con il pallino; a capo su pallino vuoto: esce dall'elenco
  ed.ta.addEventListener('keydown', function(ev){
    if(ev.key !== 'Enter' || ed.ta.readOnly) return;
    const ta = ed.ta, pos = ta.selectionStart;
    const inizio = ta.value.lastIndexOf('\n', pos - 1) + 1;
    const riga = ta.value.slice(inizio, pos);
    if(!/^• /.test(riga)) return;
    ev.preventDefault();
    if(riga === '• '){
      ta.value = ta.value.slice(0, inizio) + ta.value.slice(pos);
      ta.selectionStart = ta.selectionEnd = inizio;
    } else {
      ta.value = ta.value.slice(0, pos) + '\n• ' + ta.value.slice(ta.selectionEnd);
      ta.selectionStart = ta.selectionEnd = pos + 3;
    }
    aggiornaConta();
  });
  bg.addEventListener('click', function(ev){ if(ev.target === bg) piChiudiEditor(); });
  bg.querySelector('.pi-annulla').addEventListener('click', piChiudiEditor);
  bg.querySelector('.pi-chiudi').addEventListener('click', piChiudiEditor);
  bg.querySelector('.pi-modifica').addEventListener('click', function(){
    piModalita(true);
    ed.ta.focus();
    try{ ed.ta.setSelectionRange(ed.ta.value.length, ed.ta.value.length); }catch(e){}
  });
  bg.querySelector('.pi-salva').addEventListener('click', function(){
    const t = ed.ta.value.trim();
    if(t) piUpsert(ed.key, ed.id, t, ed.colore);
    else if(ed.id) piRemove(ed.key, ed.id);   // svuotato un post-it esistente: equivale a toglierlo
    const w = ed.wrap;
    piChiudiEditor();
    if(w) piRender(w);
  });
  ed.del.addEventListener('click', function(){
    // due tocchi: il primo chiede conferma, cosi' non si perde un appunto per sbaglio
    if(!ed.del.classList.contains('conferma')){
      ed.del.classList.add('conferma');
      ed.del.textContent = 'Eliminare davvero?';
      return;
    }
    if(ed.id) piRemove(ed.key, ed.id);
    const w = ed.wrap;
    piChiudiEditor();
    if(w) piRender(w);
  });
  document.addEventListener('keydown', function(ev){
    if(ev.key === 'Escape' && bg.classList.contains('open')) piChiudiEditor();
  });
  return ed;
}

// Un post-it esistente si apre in sola lettura; "Modifica" abilita la scrittura.
function piModalita(modifica){
  if(!_piEd) return;
  _piEd.ta.readOnly = !modifica;
  _piEd.sheet.classList.toggle('pi-vista', !modifica);
  _piEd.del.classList.remove('conferma');
  _piEd.del.textContent = 'Elimina';
}
function piApriEditor(key, id, wrap){
  if(!_piEd) _piEd = piCreaEditor();
  const ed = _piEd;
  ed.key = key; ed.id = id; ed.wrap = wrap;
  const p = id ? piList(key).find(function(x){ return x.id === id; }) : null;
  ed.ta.value = p ? p.t : '';
  ed.scegli(p ? (p.c || 0) : Math.floor(Math.random() * PI_COLORI.length));
  ed.aggiornaConta();
  ed.del.style.display = p ? '' : 'none';
  ed.del.classList.remove('conferma');
  ed.del.textContent = 'Elimina';
  ed.bg.classList.add('open');
  document.body.classList.add('pi-aperto');
  piModalita(!p);
  if(!p) setTimeout(function(){ ed.ta.focus(); }, 60);
}
function piChiudiEditor(){
  if(!_piEd) return;
  _piEd.bg.classList.remove('open');
  document.body.classList.remove('pi-aperto');
  _piEd.key = _piEd.id = _piEd.wrap = null;
}
