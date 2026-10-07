// ════════════════════════════════════════════════════════════════
// DIARIO DEL GRUPPO — le pagine viste in gruppo, da ripassare
// ════════════════════════════════════════════════════════════════
// Le inserisce chi usa l'app: data dell'incontro, numero di pagina del
// manuale, titolo, modulo, appunto e (facoltativo) il collegamento a una
// abilita', un foglio o una scheda dell'app. Restano privati: stanno
// nello stesso archivio dei post-it (chiave grp:pagine) e quindi
// seguono la sincronizzazione privata, mai la riga della terapeuta.

const GR_CHIAVE = 'grp:pagine';
const GR_MOD = [['mind','Mindfulness'],['tol','Tolleranza'],['reg','Regolazione emotiva'],['inter','Interpersonale'],['gen','Altro']];

function grTutte(){ const a = piAll(); return a[GR_CHIAVE] || (a[GR_CHIAVE] = []); }
function grLista(){ return grTutte().filter(function(x){ return !x.d; }); }
function grSalva(item){
  const l = grTutte();
  const i = l.findIndex(function(x){ return x.id === item.id; });
  item.ts = Date.now();
  if(i === -1) l.unshift(item); else l[i] = item;
  piSave();
}
function grElimina(id){
  const x = grTutte().find(function(y){ return y.id === id; });
  if(x){ x.d = 1; x.ts = Date.now(); x.n = ''; x.t = ''; piSave(); }
}
function grOggi(){ const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function grDataLunga(g){
  const d = new Date(g + 'T12:00:00');
  return isNaN(d) ? g : d.toLocaleDateString('it-IT', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
}
function grModNome(m){ const x = GR_MOD.filter(function(y){ return y[0] === m; })[0]; return x ? x[1] : ''; }
function grNorm(t){ return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

function grApri(){
  if(typeof _schedaAperta !== 'undefined' && _schedaAperta && typeof closeScheda === 'function') closeScheda();
  document.getElementById('scheda-title').textContent = 'Diario del gruppo';
  document.getElementById('scheda-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  grMostraLista('', '');
}

function grEl(tag, cls, testo){ const e = document.createElement(tag); if(cls) e.className = cls; if(testo != null) e.textContent = testo; return e; }

function grMostraLista(q, mod){
  const body = fgCorpo(); if(!body) return;
  body.innerHTML = ''; body.scrollTop = 0;
  const w = grEl('div', 'fg-wrap');
  w.appendChild(grEl('p', 'fg-intro', 'Le pagine che avete visto in gruppo, da ripassare quando vuoi. Aggiungile tu: bastano il numero e il titolo.'));
  const nuovo = grEl('button', 'fg-btn fg-pri', '+ Aggiungi una pagina');
  nuovo.type = 'button';
  nuovo.addEventListener('click', function(){ grForm(null); });
  w.appendChild(nuovo);

  const tutte = grLista();
  if(tutte.length){
    const cerca = grEl('input', 'fg-in'); cerca.type = 'search'; cerca.placeholder = 'Cerca per pagina, titolo, appunto…'; cerca.value = q || '';
    cerca.style.marginTop = '16px';
    w.appendChild(cerca);
    const chips = grEl('div', 'fg-chips'); chips.style.marginTop = '10px';
    [['', 'Tutte']].concat(GR_MOD).forEach(function(m){
      const c = grEl('button', 'fg-chip' + (mod === m[0] ? ' on' : ''), m[1]); c.type = 'button'; c.setAttribute('data-nav', '');
      c.addEventListener('click', function(){ grMostraLista(cerca.value, m[0]); });
      chips.appendChild(c);
    });
    w.appendChild(chips);
    const ris = grEl('div', 'gr-ris'); w.appendChild(ris);
    function disegna(){
      ris.innerHTML = '';
      const parole = grNorm(cerca.value).split(/\s+/).filter(Boolean);
      const l = tutte.filter(function(x){
        if(mod && x.m !== mod) return false;
        const hay = grNorm([x.p, x.t, x.n, grModNome(x.m)].join(' '));
        return parole.every(function(p){ return hay.indexOf(p) !== -1; });
      }).sort(function(a, b){ return (b.g || '').localeCompare(a.g || '') || (b.ts - a.ts); });
      if(!l.length){ ris.appendChild(grEl('div', 'fg-intro', 'Nessuna pagina trovata.')); return; }
      let ultimo = null;
      l.forEach(function(x){
        if(x.g !== ultimo){ ultimo = x.g; ris.appendChild(grEl('div', 'fg-sez', grDataLunga(x.g))); }
        const r = grEl('button', 'fg-riga'); r.type = 'button'; r.setAttribute('data-nav', '');
        r.appendChild(grEl('span', 'fg-riga-data', (x.p ? 'p. ' + x.p : 'pagina') + (grModNome(x.m) ? ' · ' + grModNome(x.m) : '')));
        r.appendChild(grEl('span', 'fg-riga-ant', x.t || '(senza titolo)'));
        r.addEventListener('click', function(){ grVista(x); });
        ris.appendChild(r);
      });
    }
    cerca.addEventListener('input', disegna);
    disegna();
  } else {
    w.appendChild(grEl('div', 'fg-intro', 'Ancora nessuna pagina. Dopo il prossimo gruppo, aggiungi quelle che avete visto.')).style.marginTop = '16px';
  }
  body.appendChild(w);
}

function grApriCollegamento(l){
  if(!l) return;
  const i = l.indexOf(':'), tipo = l.slice(0, i), id = l.slice(i + 1);
  if(typeof closeScheda === 'function') closeScheda();
  if(tipo === 'fg' && typeof fgApri === 'function') fgApri(id);
  else if(tipo === 'sc' && typeof openScheda === 'function') openScheda(id);
  else if(tipo === 'sk' && window.GUIDE_INDEX){
    const e = window.GUIDE_INDEX.filter(function(x){ return x.id === id; })[0];
    if(e && typeof rcApri === 'function') rcApri(e);
  }
}
function grNomeCollegamento(l){
  if(!l) return '';
  const i = l.indexOf(':'), tipo = l.slice(0, i), id = l.slice(i + 1);
  if(tipo === 'fg'){ const d = fgDef(id); return d ? d.t : ''; }
  if(tipo === 'sc') return (typeof SCHEDA_TITOLI !== 'undefined' && SCHEDA_TITOLI[id]) || '';
  if(tipo === 'sk'){ const e = (window.GUIDE_INDEX || []).filter(function(x){ return x.id === id; })[0]; return e ? e.name : ''; }
  return '';
}

// una pagina esistente si apre in lettura; "Modifica" per cambiarla
function grVista(x){
  const body = fgCorpo(); if(!body) return;
  body.innerHTML = ''; body.scrollTop = 0;
  const w = grEl('div', 'fg-wrap');
  w.appendChild(grEl('div', 'fg-sez', grDataLunga(x.g)));
  w.appendChild(grEl('h3', 'gr-tit', (x.p ? 'p. ' + x.p + ' · ' : '') + (x.t || '(senza titolo)')));
  if(grModNome(x.m)) w.appendChild(grEl('div', 'fg-riga-data', grModNome(x.m)));
  if(x.n){ const n = grEl('div', 'gr-nota', x.n); w.appendChild(n); }
  const nome = grNomeCollegamento(x.l);
  if(nome){
    const ap = grEl('button', 'fg-btn fg-pri', 'Apri: ' + nome); ap.type = 'button'; ap.style.marginTop = '16px';
    ap.addEventListener('click', function(){ grApriCollegamento(x.l); });
    w.appendChild(ap);
  }
  const az = grEl('div', 'fg-azioni');
  const del = grEl('button', 'fg-btn fg-del', 'Elimina'); del.type = 'button';
  del.addEventListener('click', function(){
    if(!del.classList.contains('conferma')){ del.classList.add('conferma'); del.textContent = 'Eliminare davvero?'; return; }
    grElimina(x.id); grMostraLista('', '');
  });
  az.appendChild(del); az.appendChild(grEl('span')).style.flex = '1';
  const ind = grEl('button', 'fg-btn', 'Indietro'); ind.type = 'button'; ind.addEventListener('click', function(){ grMostraLista('', ''); });
  const mod = grEl('button', 'fg-btn fg-pri', 'Modifica'); mod.type = 'button'; mod.addEventListener('click', function(){ grForm(x); });
  az.appendChild(ind); az.appendChild(mod);
  w.appendChild(az);
  body.appendChild(w);
}

function grForm(x){
  const body = fgCorpo(); if(!body) return;
  body.innerHTML = ''; body.scrollTop = 0;
  const w = grEl('div', 'fg-wrap');
  const dati = x || {g: grOggi(), p: '', t: '', m: '', n: '', l: ''};
  function campo(label, el){ const b = grEl('div', 'fg-campo'); b.appendChild(grEl('label', 'fg-lab', label)); b.appendChild(el); w.appendChild(b); return el; }

  const g = grEl('input', 'fg-in'); g.type = 'date'; g.value = dati.g || grOggi(); campo('Data dell’incontro', g);
  const p = grEl('input', 'fg-in'); p.type = 'text'; p.inputMode = 'numeric'; p.placeholder = 'es. 281'; p.value = dati.p || ''; campo('Pagina del manuale', p);
  const t = grEl('input', 'fg-in'); t.type = 'text'; t.placeholder = 'es. Osservare e descrivere le emozioni'; t.value = dati.t || ''; campo('Titolo', t);

  let mod = dati.m || '';
  const chips = grEl('div', 'fg-chips');
  GR_MOD.forEach(function(m){
    const c = grEl('button', 'fg-chip' + (mod === m[0] ? ' on' : ''), m[1]); c.type = 'button'; c.setAttribute('data-nav', '');
    c.addEventListener('click', function(){
      mod = (mod === m[0]) ? '' : m[0];
      chips.querySelectorAll('.fg-chip').forEach(function(z){ z.classList.toggle('on', z === c && mod === m[0]); });
    });
    chips.appendChild(c);
  });
  campo('Modulo', chips);

  const n = grEl('textarea', 'fg-in'); n.rows = 4; n.placeholder = 'Cosa è emerso, cosa vuoi ricordare…'; n.value = dati.n || ''; campo('Appunto', n);

  const sel = grEl('select', 'fg-in');
  const vuota = grEl('option', null, 'Nessuno'); vuota.value = ''; sel.appendChild(vuota);
  function gruppo(nome, voci){
    if(!voci.length) return;
    const og = document.createElement('optgroup'); og.label = nome;
    voci.forEach(function(v){ const o = grEl('option', null, v[1]); o.value = v[0]; og.appendChild(o); });
    sel.appendChild(og);
  }
  gruppo('Fogli compilabili', FG_FOGLI.map(function(f){ return ['fg:' + f.id, f.t]; }));
  gruppo('Schede', Object.keys(typeof SCHEDA_TITOLI !== 'undefined' ? SCHEDA_TITOLI : {}).map(function(k){ return ['sc:' + k, SCHEDA_TITOLI[k]]; }));
  gruppo('Abilità', (window.GUIDE_INDEX || []).map(function(e){ return ['sk:' + e.id, e.name]; }));
  sel.value = dati.l || '';
  campo('Collega a una scheda dell’app (facoltativo)', sel);

  const az = grEl('div', 'fg-azioni');
  az.appendChild(grEl('span')).style.flex = '1';
  const ann = grEl('button', 'fg-btn', 'Annulla'); ann.type = 'button';
  ann.addEventListener('click', function(){ if(x) grVista(x); else grMostraLista('', ''); });
  const sv = grEl('button', 'fg-btn fg-pri', 'Salva'); sv.type = 'button';
  sv.addEventListener('click', function(){
    if(!p.value.trim() && !t.value.trim() && !n.value.trim()){ p.focus(); return; }
    const item = {
      id: x ? x.id : 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      g: g.value || grOggi(), p: p.value.trim(), t: t.value.trim(), m: mod, n: n.value.trim(), l: sel.value
    };
    grSalva(item);
    grVista(item);
  });
  az.appendChild(ann); az.appendChild(sv);
  w.appendChild(az);
  body.appendChild(w);
  if(!x) setTimeout(function(){ p.focus(); }, 80);
}
