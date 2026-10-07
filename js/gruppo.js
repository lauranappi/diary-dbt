// ════════════════════════════════════════════════════════════════
// DIARIO DEL GRUPPO — le pagine viste in gruppo, da ripassare
// ════════════════════════════════════════════════════════════════
// Le inserisce chi usa l'app: data dell'incontro, numero di pagina del
// manuale, titolo, modulo, appunto e (facoltativo) il collegamento a una
// abilita', un foglio o una scheda dell'app. Restano privati: stanno
// nello stesso archivio dei post-it (chiave grp:pagine) e quindi
// seguono la sincronizzazione privata, mai la riga della terapeuta.

const GR_CHIAVE = 'grp:pagine';
const GR_MOD = [['mind','Mindfulness'],['tol','Tolleranza'],['reg','Regolazione emotiva'],['inter','Interpersonale'],['gen','Generale']];

function grTutte(){ const a = piAll(); return a[GR_CHIAVE] || (a[GR_CHIAVE] = []); }
// un incontro puo' avere piu' pagine (pp) e piu' collegamenti (ll); i vecchi
// elementi con una sola pagina (p, t, l) vengono letti nello stesso formato
function grSalva(item){
  const l = grTutte();
  const i = l.findIndex(function(x){ return x.id === item.id; });
  item.ts = Date.now();
  if(i === -1) l.unshift(item); else l[i] = item;
  piSave();
}
function grElimina(id){
  const x = grTutte().find(function(y){ return y.id === id; });
  if(x){ x.d = 1; x.ts = Date.now(); x.n = ''; x.pp = []; x.ll = []; piSave(); }
}
function grOggi(){ const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function grDataLunga(g){
  const d = new Date(g + 'T12:00:00');
  return isNaN(d) ? g : d.toLocaleDateString('it-IT', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
}
function grModNome(m){ const x = GR_MOD.filter(function(y){ return y[0] === m; })[0]; return x ? x[1] : ''; }
function grNorm(t){ return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

// L'ambito non si sceglie: lo ricava l'app dalle schede collegate e dai numeri di pagina.
const GR_SCHEDA_MOD = {dearman:'inter', give:'inter', fast:'inter', abc:'reg', sentiero:'mind', please:'reg',
  diarioemo:'reg', fatti:'reg', procontro:'gen', pianocrisi:'tol', catena:'gen', eventi:'reg'};
function grModPerPagina(n){
  n = parseInt(n, 10);
  if(!(n > 0)) return '';
  if(n <= 44) return 'gen';        // introduzione, obiettivi, teoria
  if(n <= 112) return 'mind';
  if(n <= 199) return 'inter';
  if(n <= 316) return 'reg';
  if(n <= 420) return 'tol';
  return '';
}
function grModPerCollegamento(l){
  const p = String(l || '').split(':'), t = p[0];
  if(t === 'fg' || t === 'fe'){ const d = fgDef(p[1]); return d ? d.mod : ''; }
  if(t === 'sc') return GR_SCHEDA_MOD[p.slice(1).join(':')] || '';
  if(t === 'sk'){ const e = (window.GUIDE_INDEX || []).filter(function(y){ return y.id === p.slice(1).join(':'); })[0]; return e ? e.mod : ''; }
  return {cf:'reg', pc:'gen', de:'reg', ca:'gen'}[t] || '';
}
// ambiti ordinati per frequenza: schede collegate e pagine pesano uguale
function grAmbiti(pp, ll){
  const conta = {};
  (pp || []).forEach(function(y){ const m = grModPerPagina(y.p); if(m) conta[m] = (conta[m] || 0) + 1; });
  (ll || []).forEach(function(l){ const m = grModPerCollegamento(l); if(m) conta[m] = (conta[m] || 0) + 1; });
  return Object.keys(conta).sort(function(a, b){ return conta[b] - conta[a]; });
}
function grAmbitiNomi(mm){ return (mm || []).map(grModNome).filter(Boolean).join(', '); }
function grNormItem(x){
  if(!x.pp) x.pp = (x.p || x.t) ? [{p: x.p || '', t: x.t || ''}] : [];
  if(!x.ll) x.ll = x.l ? [x.l] : [];
  if(!x.mm) x.mm = x.m ? [x.m] : grAmbiti(x.pp, x.ll);
  return x;
}
function grLista(){ return grTutte().filter(function(x){ return !x.d; }).map(grNormItem); }
function grRiepilogoPagine(x){
  const nums = x.pp.map(function(y){ return y.p; }).filter(Boolean);
  return nums.length ? (nums.length > 1 ? 'pp. ' : 'p. ') + nums.join(', ') : 'incontro';
}
function grTitoli(x){ return x.pp.map(function(y){ return y.t; }).filter(Boolean).join(' · '); }
// catalogo per la ricerca dei collegamenti: prima i fogli GIA' COMPILATI
// (uno per uno, con data e anteprima), poi fogli vuoti, schede e abilita'
function grLeggi(k){ try{ const a = JSON.parse(localStorage.getItem(ukey(k)) || '[]'); return Array.isArray(a) ? a : []; }catch(e){ return []; } }
function grDataCompilato(q){
  const d = new Date(q);
  return isNaN(d) ? '' : d.toLocaleDateString('it-IT', {day:'numeric', month:'short', year:'numeric'});
}
function grCompilati(){
  const c = [];
  function agg(k, nome, quando, anteprima){
    const dt = grDataCompilato(quando);
    c.push({k:k, n:nome + (dt ? ' · ' + dt : '') + (anteprima ? ' · ' + String(anteprima).slice(0, 40) : ''), tipo:'Compilato', extra:nome + ' ' + (anteprima || '') + ' ' + dt});
  }
  FG_FOGLI.forEach(function(f){
    fgLista(f.id).forEach(function(e){
      const prima = f.c.filter(function(x){ return !x.h && (x.tipo === 't' || x.tipo === 'a') && e.v && e.v[x.k]; })[0];
      agg('fe:' + f.id + ':' + e.id, f.t, e.ts, prima ? e.v[prima.k] : '');
    });
  });
  grLeggi('cf_fogli').forEach(function(d){ agg('cf:' + d.id, 'Controlla i fatti', d.data, d['cf-emozione']); });
  grLeggi('pc2_fogli').forEach(function(d){ agg('pc:' + d.id, 'Pro e contro delle abilità', d.data, d['pc2-situazione']); });
  grLeggi('diario_emo').forEach(function(d){ agg('de:' + d.id, 'Diario delle emozioni', d.data, d.emozione); });
  grLeggi('catena_list').forEach(function(d){ agg('ca:' + d.id, 'Analisi della catena', d.data, d.comportamento); });
  return c;
}
function grCatalogo(){
  const c = grCompilati();
  FG_FOGLI.forEach(function(f){ c.push({k:'fg:' + f.id, n:f.t + ' (foglio vuoto)', tipo:'Foglio', extra:f.t}); });
  if(typeof SCHEDA_TITOLI !== 'undefined') Object.keys(SCHEDA_TITOLI).forEach(function(k){ c.push({k:'sc:' + k, n:SCHEDA_TITOLI[k], tipo:'Scheda'}); });
  (window.GUIDE_INDEX || []).forEach(function(e){ c.push({k:'sk:' + e.id, n:e.name, tipo:'Abilità', extra:e.badge + ' ' + e.desc}); });
  return c;
}

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
  w.appendChild(grEl('p', 'fg-intro', 'Le pagine che avete visto in gruppo, da ripassare quando vuoi. Aggiungile tu: un incontro può avere più pagine e più schede collegate.'));
  const nuovo = grEl('button', 'fg-btn fg-pri', '+ Aggiungi un incontro');
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
        if(mod && x.mm.indexOf(mod) === -1) return false;
        const hay = grNorm([x.pp.map(function(y){ return y.p + ' ' + y.t; }).join(' '), x.n, grAmbitiNomi(x.mm)].join(' '));
        return parole.every(function(p){ return hay.indexOf(p) !== -1; });
      }).sort(function(a, b){ return (b.g || '').localeCompare(a.g || '') || (b.ts - a.ts); });
      if(!l.length){ ris.appendChild(grEl('div', 'fg-intro', 'Nessun incontro trovato.')); return; }
      let ultimo = null;
      l.forEach(function(x){
        if(x.g !== ultimo){ ultimo = x.g; ris.appendChild(grEl('div', 'fg-sez', grDataLunga(x.g))); }
        const r = grEl('button', 'fg-riga'); r.type = 'button'; r.setAttribute('data-nav', '');
        r.appendChild(grEl('span', 'fg-riga-data', grRiepilogoPagine(x) + (grAmbitiNomi(x.mm) ? ' · ' + grAmbitiNomi(x.mm) : '')));
        r.appendChild(grEl('span', 'fg-riga-ant', grTitoli(x) || (x.n ? x.n : '(senza titolo)')));
        r.addEventListener('click', function(){ grVista(x); });
        ris.appendChild(r);
      });
    }
    cerca.addEventListener('input', disegna);
    disegna();
  } else {
    w.appendChild(grEl('div', 'fg-intro', 'Ancora nessun incontro. Dopo il prossimo gruppo, aggiungi le pagine che avete visto.')).style.marginTop = '16px';
  }
  body.appendChild(w);
}

function grApriCollegamento(l){
  if(!l) return;
  const p = l.split(':'), tipo = p[0];
  if(typeof closeScheda === 'function') closeScheda();
  if(tipo === 'fe'){
    const def = fgDef(p[1]); if(!def) return;
    const e = fgLista(def.id).filter(function(x){ return String(x.id) === p[2]; })[0];
    fgApri(def.id); if(e) fgMostraForm(def, e);
    return;
  }
  // fogli delle schede originali: si apre la scheda e si preme "Apri" sul foglio scelto
  const SCHEDE = {cf:['fatti','cf_fogli','#cf-lista .foglio-item'], pc:['procontro','pc2_fogli','#pc2-lista .foglio-item']};
  if(SCHEDE[tipo]){
    const lista = grLeggi(SCHEDE[tipo][1]);
    const i = lista.findIndex(function(x){ return String(x.id) === p[1]; });
    openScheda(SCHEDE[tipo][0]);
    setTimeout(function(){
      const it = document.querySelectorAll('#scheda-body ' + SCHEDE[tipo][2])[i];
      const b = it && it.querySelector('.bsec'); if(b) b.click();
    }, 160);
    return;
  }
  if(tipo === 'de'){ openScheda('diarioemo'); return; }
  if(tipo === 'ca'){ openScheda('catena'); return; }
  const id = p.slice(1).join(':');
  if(tipo === 'fg' && typeof fgApri === 'function') fgApri(id);
  else if(tipo === 'sc' && typeof openScheda === 'function') openScheda(id);
  else if(tipo === 'sk' && window.GUIDE_INDEX){
    const e = window.GUIDE_INDEX.filter(function(x){ return x.id === id; })[0];
    if(e && typeof rcApri === 'function') rcApri(e);
  }
}
function grNomeCollegamento(l){
  const c = grCatalogo().filter(function(x){ return x.k === l; })[0];
  return c ? c.n : '';
}

// un incontro esistente si apre in lettura; "Modifica" per cambiarlo
function grVista(x){
  grNormItem(x);
  const body = fgCorpo(); if(!body) return;
  body.innerHTML = ''; body.scrollTop = 0;
  const w = grEl('div', 'fg-wrap');
  w.appendChild(grEl('div', 'fg-sez', grDataLunga(x.g)));
  if(grAmbitiNomi(x.mm)) w.appendChild(grEl('div', 'fg-riga-data', grAmbitiNomi(x.mm)));
  x.pp.forEach(function(y){
    w.appendChild(grEl('h3', 'gr-tit', (y.p ? 'p. ' + y.p : 'Pagina') + (y.t ? ' · ' + y.t : '')));
  });
  if(x.n) w.appendChild(grEl('div', 'gr-nota', x.n));
  const nomi = x.ll.map(function(l){ return {l:l, n:grNomeCollegamento(l)}; }).filter(function(c){ return c.n; });
  if(nomi.length){
    const t = grEl('div', 'fg-sez', 'Collegate nell’app'); w.appendChild(t);
    nomi.forEach(function(c){
      const ap = grEl('button', 'fg-btn gr-apri', c.n); ap.type = 'button';
      ap.addEventListener('click', function(){ grApriCollegamento(c.l); });
      w.appendChild(ap);
    });
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
  const dati = x ? grNormItem(x) : {g: grOggi(), pp: [], n: '', m: '', ll: []};
  function campo(label, el){ const b = grEl('div', 'fg-campo'); b.appendChild(grEl('label', 'fg-lab', label)); b.appendChild(el); w.appendChild(b); return el; }

  const g = grEl('input', 'fg-in fg-data'); g.type = 'date'; g.value = dati.g || grOggi(); campo('Data dell’incontro', g);

  // più pagine: una riga (numero + titolo) per ciascuna
  const righe = [];
  const boxPagine = grEl('div', 'gr-pagine');
  function aggiungiRiga(p, t){
    const r = grEl('div', 'gr-pag');
    const np = grEl('input', 'fg-in gr-pag-n'); np.type = 'text'; np.inputMode = 'numeric'; np.placeholder = 'Pag.'; np.value = p || '';
    const nt = grEl('input', 'fg-in gr-pag-t'); nt.type = 'text'; nt.placeholder = 'Titolo della pagina'; nt.value = t || '';
    const rm = grEl('button', 'gr-pag-x', '×'); rm.type = 'button'; rm.setAttribute('aria-label', 'Togli questa pagina');
    rm.addEventListener('click', function(){
      if(righe.length === 1){ np.value = ''; nt.value = ''; return; }
      righe.splice(righe.indexOf(riga), 1); r.remove();
    });
    r.appendChild(np); r.appendChild(nt); r.appendChild(rm);
    const riga = {np:np, nt:nt};
    righe.push(riga); if(piu) boxPagine.insertBefore(r, piu); else boxPagine.appendChild(r);
    return np;
  }
  let piu = null;
  (dati.pp.length ? dati.pp : [{p:'', t:''}]).forEach(function(y){ aggiungiRiga(y.p, y.t); });
  piu = grEl('button', 'fg-btn gr-piu', '+ Un’altra pagina'); piu.type = 'button';
  piu.addEventListener('click', function(){ aggiungiRiga('', '').focus(); });
  boxPagine.appendChild(piu);
  campo('Pagine del manuale', boxPagine);

  const ambito = grEl('div', 'gr-ambito');
  w.appendChild(ambito);

  const n = grEl('textarea', 'fg-in'); n.rows = 4; n.placeholder = 'Cosa è emerso, cosa vuoi ricordare…'; n.value = dati.n || ''; campo('Appunto', n);

  // schede collegate: si cerca per nome e se ne possono aggiungere quante si vuole
  const scelti = dati.ll.slice();
  const box = grEl('div', 'gr-coll');
  const sceltiEl = grEl('div', 'fg-chips');
  const cercaC = grEl('input', 'fg-in'); cercaC.type = 'search'; cercaC.placeholder = 'Cerca foglio o scheda…';
  const risC = grEl('div', 'gr-coll-ris');
  const cat = grCatalogo();
  function disegnaScelti(){
    sceltiEl.innerHTML = '';
    scelti.forEach(function(k){
      const c = grEl('button', 'fg-chip on', (grNomeCollegamento(k) || k) + '  ×'); c.type = 'button';
      c.addEventListener('click', function(){ scelti.splice(scelti.indexOf(k), 1); disegnaScelti(); disegnaRis(); });
      sceltiEl.appendChild(c);
    });
    sceltiEl.style.display = scelti.length ? '' : 'none';
  }
  function disegnaRis(){
    risC.innerHTML = '';
    const parole = grNorm(cercaC.value).split(/\s+/).filter(Boolean);
    if(!parole.length) return;
    const trovati = cat.filter(function(c){
      if(scelti.indexOf(c.k) !== -1) return false;
      const hay = grNorm(c.n + ' ' + c.tipo + ' ' + (c.extra || ''));
      return parole.every(function(p){ return hay.indexOf(p) !== -1; });
    });
    if(!trovati.length){ risC.appendChild(grEl('div', 'fg-intro', 'Nessun risultato.')); return; }
    trovati.slice(0, 20).forEach(function(c){
      const r = grEl('button', 'fg-riga'); r.type = 'button'; r.setAttribute('data-nav', '');
      r.appendChild(grEl('span', 'fg-riga-data', c.tipo));
      r.appendChild(grEl('span', 'fg-riga-ant', c.n));
      r.addEventListener('click', function(){ scelti.push(c.k); cercaC.value = ''; disegnaScelti(); disegnaRis(); });
      risC.appendChild(r);
    });
    if(trovati.length > 20) risC.appendChild(grEl('div', 'fg-intro', 'Altri ' + (trovati.length - 20) + '… scrivi di più per restringere.'));
  }
  cercaC.addEventListener('input', disegnaRis);
  box.appendChild(sceltiEl); box.appendChild(cercaC); box.appendChild(risC);
  disegnaScelti();
  campo('Schede e fogli compilati collegati (facoltativo)', box);

  // l'ambito si aggiorna da solo mentre scrivi pagine e colleghi schede
  function aggiornaAmbito(){
    const mm = grAmbiti(righe.map(function(r){ return {p: r.np.value}; }), scelti);
    ambito.textContent = mm.length ? 'Ambito: ' + grAmbitiNomi(mm) : '';
    ambito.style.display = mm.length ? '' : 'none';
  }
  w.addEventListener('input', aggiornaAmbito);
  w.addEventListener('click', function(){ setTimeout(aggiornaAmbito, 0); });
  aggiornaAmbito();

  const az = grEl('div', 'fg-azioni');
  az.appendChild(grEl('span')).style.flex = '1';
  const ann = grEl('button', 'fg-btn', 'Annulla'); ann.type = 'button';
  ann.addEventListener('click', function(){ if(x) grVista(x); else grMostraLista('', ''); });
  const sv = grEl('button', 'fg-btn fg-pri', 'Salva'); sv.type = 'button';
  sv.addEventListener('click', function(){
    const pp = righe.map(function(r){ return {p: r.np.value.trim(), t: r.nt.value.trim()}; }).filter(function(y){ return y.p || y.t; });
    if(!pp.length && !n.value.trim()){ righe[0].np.focus(); return; }
    const item = {
      id: x ? x.id : 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5),
      g: g.value || grOggi(), pp: pp, mm: grAmbiti(pp, scelti), n: n.value.trim(), ll: scelti.slice()
    };
    grSalva(item);
    grVista(item);
  });
  az.appendChild(ann); az.appendChild(sv);
  w.appendChild(az);
  body.appendChild(w);
  if(!x) setTimeout(function(){ righe[0].np.focus(); }, 80);
}
