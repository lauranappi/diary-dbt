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
  if(x){ x.d = 1; x.ts = Date.now(); x.n = ''; x.pp = []; x.ll = [];
    piList('gn:' + id).forEach(function(p){ piRemove('gn:' + id, p.id); });
    piSave(); }
}
function grOggi(){ const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); }
function grDataLunga(g){
  const d = new Date(g + 'T12:00:00');
  return isNaN(d) ? g : d.toLocaleDateString('it-IT', {weekday:'long', day:'numeric', month:'long', year:'numeric'});
}
var GR_MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
function grP2(n){ return (n < 10 ? '0' : '') + n; }
function grAnno(a){ a = parseInt(a, 10); return a < 100 ? 2000 + a : a; }
// forme in cui una data si puo' cercare: "lunedi 5 ottobre 2026", 5/10/2026, 05/10, 2026-10-05...
function grDateCercabili(g){
  const d = String(g || '').split('-'); if(d.length !== 3) return '';
  const a = d[0], m = parseInt(d[1], 10), n = parseInt(d[2], 10);
  return ' ' + [grNorm(grDataLunga(g)), n + '/' + m + '/' + a, grP2(n) + '/' + grP2(m) + '/' + a, n + '/' + m, grP2(n) + '/' + grP2(m), g].join(' ') + ' ';
}
// intervalli scritti nella barra: "dal 5/10 al 12/10", "5/10 - 12/10/2026", "dal 5 al 12 ottobre"
function grIntervallo(q){
  const t = grNorm(q), anno = new Date().getFullYear();
  let m = t.match(/(?:dal\s+)?(\d{1,2})[\/.](\d{1,2})(?:[\/.](\d{2,4}))?\s*(?:-|al|fino al|a)\s*(\d{1,2})[\/.](\d{1,2})(?:[\/.](\d{2,4}))?/);
  let da, a;
  if(m){
    const a2 = grAnno(m[6] || m[3] || anno), a1 = grAnno(m[3] || m[6] || anno);
    da = a1 + '-' + grP2(+m[2]) + '-' + grP2(+m[1]); a = a2 + '-' + grP2(+m[5]) + '-' + grP2(+m[4]);
  } else {
    m = t.match(new RegExp('(?:dal\\s+)?(\\d{1,2})\\s*(?:-|al|fino al)\\s*(\\d{1,2})\\s+(' + GR_MESI.join('|') + ')(?:\\s+(\\d{4}))?'));
    if(!m) return null;
    const mm = GR_MESI.indexOf(m[3]) + 1, y = m[4] || anno;
    da = y + '-' + grP2(mm) + '-' + grP2(+m[1]); a = y + '-' + grP2(mm) + '-' + grP2(+m[2]);
  }
  if(da > a){ const x = da; da = a; a = x; }
  return {da: da, a: a, resto: t.replace(m[0], ' ')};
}
function grModNome(m){ const x = GR_MOD.filter(function(y){ return y[0] === m; })[0]; return x ? x[1] : ''; }
function grNorm(t){ return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, ''); }

// L'ambito non si sceglie: lo ricava l'app dalle schede collegate e dai numeri di pagina.
const GR_SCHEDA_MOD = {dearman:'inter', give:'inter', fast:'inter', abc:'reg', please:'reg',
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
function grAmbitiPP(pp){ return grAmbiti(pp, (pp || []).map(function(y){ return y.l; }).filter(Boolean)); }
function grNormItem(x){
  if(!x.pp) x.pp = (x.p || x.t) ? [{p: x.p || '', t: x.t || ''}] : [];
  // vecchi collegamenti separati: diventano righe di pagina con il collegamento
  const ll = (x.ll && x.ll.length) ? x.ll : (x.l ? [x.l] : []);
  if(ll.length){
    const gia = x.pp.map(function(y){ return y.l; });
    ll.forEach(function(l){ if(gia.indexOf(l) === -1) x.pp.push({p: '', t: grNomeCollegamento(l) || l, l: l}); });
  }
  x.ll = [];
  if(!x.mm) x.mm = x.m ? [x.m] : grAmbitiPP(x.pp);
  return x;
}
// il vecchio campo "Appunto" diventa un post-it (una volta sola)
function grMigraNota(x){
  if(x && x.n){ piUpsert('gn:' + x.id, null, x.n, 0); x.n = ''; grSalva(x); }
}
function grPostitTesto(x){ return piList('gn:' + x.id).map(function(p){ return p.t; }).join(' '); }
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
  FG_FOGLI.forEach(function(f){ c.push({k:'fg:' + f.id, n:f.t, tipo:'Foglio vuoto', extra:f.t}); });
  if(typeof SCHEDA_TITOLI !== 'undefined') Object.keys(SCHEDA_TITOLI).forEach(function(k){ c.push({k:'sc:' + k, n:SCHEDA_TITOLI[k], tipo:'Scheda'}); });
  (window.GUIDE_INDEX || []).forEach(function(e){
    c.push({k:'sk:' + e.id, n:e.name, tipo:'Teoria', extra:'abilità ' + e.badge + ' ' + e.desc});
  });
  return c;
}

function grCorpo(){ return document.getElementById('gruppo-content'); }
function grMostraPagina(){
  if(!(window.GUIDE_INDEX && window.GUIDE_INDEX.length) && typeof renderGuide === 'function'){ try{ renderGuide(); }catch(e){} }
  grMostraLista('', '');
}

function grEl(tag, cls, testo){ const e = document.createElement(tag); if(cls) e.className = cls; if(testo != null) e.textContent = testo; return e; }

function grMostraLista(q, mod){
  const body = grCorpo(); if(!body) return;
  body.innerHTML = ''; window.scrollTo(0, 0);
  const w = grEl('div', 'fg-wrap');
  w.appendChild(grEl('p', 'fg-intro', 'Le pagine che avete visto in gruppo, da ripassare quando vuoi. Aggiungile tu: scrivendo il titolo puoi anche cercare e collegare una scheda o un foglio.'));
  const nuovo = grEl('button', 'fg-btn fg-pri', '+ Aggiungi un incontro');
  nuovo.type = 'button';
  nuovo.addEventListener('click', function(){ grForm(null); });
  w.appendChild(nuovo);

  const tutte = grLista();
  if(tutte.length){
    const cerca = grEl('input', 'fg-in'); cerca.type = 'search'; cerca.placeholder = 'Cerca per pagina, titolo, appunto o data…'; cerca.value = q || '';
    const cercaW = ccCampoCerca(cerca, 'cerca-gruppo'); cercaW.style.marginTop = '16px';
    w.appendChild(cercaW);
    const ris = grEl('div', 'gr-ris'); w.appendChild(ris);
    function disegna(){
      ris.innerHTML = '';
      const iv = grIntervallo(cerca.value);
      const parole = (iv ? iv.resto : grNorm(cerca.value)).split(/\s+/).filter(Boolean);
      const l = tutte.filter(function(x){
        if(iv && ((x.g || '') < iv.da || (x.g || '') > iv.a)) return false;
        const hay = ' ' + grNorm([x.pp.map(function(y){ return y.p + ' ' + y.t; }).join(' '), x.n || '', grPostitTesto(x), grAmbitiNomi(x.mm)].join(' ')) + grDateCercabili(x.g);
        return parole.every(function(p){ return /\d\/\d|^\d{4}-/.test(p) ? hay.indexOf(' ' + p + ' ') !== -1 || hay.indexOf(' ' + p) !== -1 && /^\d{4}-/.test(p) : hay.indexOf(p) !== -1; });
      }).sort(function(a, b){ return (b.g || '').localeCompare(a.g || '') || (b.ts - a.ts); });
      if(!l.length){ ris.appendChild(grEl('div', 'fg-intro', 'Nessun incontro trovato.')); return; }
      let ultimo = null;
      l.forEach(function(x){
        if(x.g !== ultimo){ ultimo = x.g; ris.appendChild(grEl('div', 'fg-sez', grDataLunga(x.g))); }
        const r = grEl('button', 'fg-riga'); r.type = 'button'; r.setAttribute('data-nav', '');
        r.appendChild(grEl('span', 'fg-riga-data', grRiepilogoPagine(x) + (grAmbitiNomi(x.mm) ? ' · ' + grAmbitiNomi(x.mm) : '')));
        r.appendChild(grEl('span', 'fg-riga-ant', grTitoli(x) || '(senza titolo)'));
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
  if(typeof _schedaAperta !== 'undefined' && _schedaAperta && typeof closeScheda === 'function') closeScheda();
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
// i post-it fatti nella scheda/foglio collegato (stessa chiave usata dentro la scheda)
function grChiavePostit(l){
  const p = String(l || '').split(':'), t = p[0], id = p.slice(1).join(':');
  if(t === 'sc' || t === 'sk' || t === 'fg') return t + ':' + id;
  if(t === 'fe') return 'fg:' + p[1];
  return {cf:'sc:fatti', pc:'sc:procontro', de:'sc:diarioemo', ca:'sc:catena'}[t] || '';
}
// scheda dell'app <-> pagina teorica/foglio della guida che trattano lo stesso argomento
const GR_GRUPPI = [
  ['sc:fatti','sk:rcheck'], ['sc:procontro','sk:procontro','fg:t-impulso'],
  ['sc:dearman','sk:dearman','fg:i-monitor'], ['sc:give','sk:give','fg:i-monitor'], ['sc:fast','sk:fast','fg:i-monitor'],
  ['sc:abc','sk:rabc','fg:r-vulnerabilita'], ['sk:isentiero','fg:m-sentiero'], ['sc:please','sk:rplease'],
  ['fg:t-crisi','sk:tcrisi'], ['sc:eventi','sk:rpositivo'],
  ['fg:m-abilita','sk:mcosa','sk:mcome'], ['fg:m-fare-essere','fg:m-piacevoli','fg:m-spiacevoli','sk:mfareessere'],
  ['fg:t-stop','sk:stop'], ['fg:t-accettazione','sk:accrad'], ['fg:t-bodyscan','sk:tbody'],
  ['fg:t-pensieri','sk:mpensieri'], ['fg:t-miglioramomento','sk:migliora'],
  ['fg:i-chiedere','sk:ifermezza'], ['fg:i-validare','fg:i-autoval','sk:ivalida'], ['fg:i-dialettica','sk:idialettica'],
  ['fg:r-funzioni','sk:rperche'], ['fg:r-osserva','sk:rdescrivi'], ['fg:i-priorita','sk:ipriorita'], ['fg:r-risolvere','sk:rrisolvi'], ['fg:m-gentilezza','sk:mamorev'], ['fg:r-mind-emozioni','sk:memozioni'], ['fg:r-azione-opposta','sk:razione'],
  ['fg:r-problem-solving','sk:rproblem'], ['fg:r-valori','sk:rvalori'], ['fg:r-mastery','sk:rmastery'],
  ['fg:r-sonno','sk:rsonno'], ['fg:r-incubi','sk:rincubi'], ['fg:r-miti','sk:rmiti']
];
// titolo del blocco: dice a cosa servono quei post-it (compilare la scheda, oppure appunti di teoria dal gruppo)
function grTitoloBlocco(k){
  const t = k.split(':')[0], n = grNomeChiave(k);
  if(t === 'sc' || t === 'fg') return 'Come compilarla · ' + n;
  if(t === 'sk') return 'Dal gruppo, teoria · ' + n;
  return n;
}
// schede/fogli da compilare collegati a una pagina di teoria (id della pagina della guida)
function grSchedeDa(skId){
  const gr = GR_GRUPPI.filter(function(x){ return x.indexOf('sk:' + skId) !== -1; })[0] || [];
  // le schede di sola lettura (ABC, GIVE, FAST) non si compilano
  const LETTURA = ['sc:abc', 'sc:give', 'sc:fast'];
  return gr.filter(function(k){ return k.indexOf('sk:') !== 0 && LETTURA.indexOf(k) === -1; }).map(function(k){
    const t = k.split(':')[0], id = k.split(':').slice(1).join(':');
    return {k:k, nome:grNomeChiave(k), apri:function(){ if(t === 'fg') fgApri(id); else openScheda(id); }};
  });
}
// vero se la scheda/foglio vive gia' dentro una pagina di teoria
function grHaTeoria(k){
  return GR_GRUPPI.some(function(x){ return x.indexOf(k) !== -1 && x.some(function(y){ return y.indexOf('sk:') === 0; }); });
}
function grNomeChiave(k){
  const p = k.split(':'), id = p.slice(1).join(':');
  if(p[0] === 'sc') return (typeof SCHEDA_TITOLI !== 'undefined' && SCHEDA_TITOLI[id]) || id;
  if(p[0] === 'fg'){ const d = fgDef(id); return d ? d.t : id; }
  if(p[0] === 'sk'){ const e = (window.GUIDE_INDEX || []).filter(function(y){ return y.id === id; })[0]; return e ? e.name : id; }
  return id;
}
// chiavi dei post-it dello stesso argomento (compresa quella data)
function grChiaviCorrelate(k){
  const gr = GR_GRUPPI.filter(function(g){ return g.indexOf(k) !== -1; })[0];
  return gr ? gr.slice() : (k ? [k] : []);
}
// blocchi dei post-it "fratelli" non vuoti, per mostrare tutto su un argomento
function grBlocchiCorrelati(k){
  return grChiaviCorrelate(k).filter(function(x){ return x !== k && piList(x).length; }).map(function(x){
    const b = piMount(x, grTitoloBlocco(x)); b.classList.add('gr-rel'); b.style.margin = '12px 0 4px'; return b;
  });
}
function grNomeCollegamento(l){
  const c = grCatalogo().filter(function(x){ return x.k === l; })[0];
  return c ? c.n : '';
}

// un incontro esistente si apre in lettura; "Modifica" per cambiarlo
function grVista(x){
  grNormItem(x); grMigraNota(x);
  const body = grCorpo(); if(!body) return;
  body.innerHTML = ''; window.scrollTo(0, 0);
  const w = grEl('div', 'fg-wrap');
  w.appendChild(grEl('div', 'fg-sez', grDataLunga(x.g)));
  if(grAmbitiNomi(x.mm)) w.appendChild(grEl('div', 'fg-riga-data', grAmbitiNomi(x.mm)));
  const mostrati = {};   // ogni gruppo di post-it si vede una volta sola, anche con piu' pagine collegate
  x.pp.forEach(function(y){
    w.appendChild(grEl('h3', 'gr-tit', (y.p ? 'p. ' + y.p : 'Pagina') + (y.t ? ' · ' + y.t : '')));
    const nome = y.l ? grNomeCollegamento(y.l) : '';
    if(y.l && nome){
      const ap = grEl('button', 'fg-btn gr-apri', (/^(sc|cf|pc|de|ca):/.test(y.l) ? 'Apri la scheda: ' : /^(fg|fe):/.test(y.l) ? 'Apri il foglio: ' : 'Apri: ') + nome); ap.type = 'button';
      ap.addEventListener('click', function(){ grApriCollegamento(y.l); });
      w.appendChild(ap);
      const k = grChiavePostit(y.l);
      grChiaviCorrelate(k).filter(function(c){ return piList(c).length && !mostrati[c]; }).forEach(function(c){
        mostrati[c] = 1;
        w.appendChild(piMount(c, grTitoloBlocco(c)));
      });
    }
  });
  w.appendChild(piMount('gn:' + x.id, 'Appunti presi in gruppo'));
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
  const body = grCorpo(); if(!body) return;
  body.innerHTML = ''; window.scrollTo(0, 0);
  const w = grEl('div', 'fg-wrap');
  if(x){ grNormItem(x); grMigraNota(x); }
  const nuovoId = 'g' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5);
  const dati = x || {id: nuovoId, g: grOggi(), pp: []};
  function campo(label, el){ const b = grEl('div', 'fg-campo'); b.appendChild(grEl('label', 'fg-lab', label)); b.appendChild(el); w.appendChild(b); return el; }

  const g = grEl('input', 'fg-in fg-data'); g.type = 'date'; g.value = dati.g || grOggi(); campo('Data dell’incontro', g);

  // una riga per pagina: numero + titolo. Scrivendo il titolo si cercano
  // schede, fogli (anche gia' compilati) e abilita': toccandone una la riga
  // si collega, altrimenti resta il testo libero.
  const righe = [];
  const boxPagine = grEl('div', 'gr-pagine');
  const cat = grCatalogo();
  let piu = null;
  function aggiungiRiga(p, t, l){
    const r = grEl('div', 'gr-pag');
    const np = grEl('input', 'fg-in gr-pag-n'); np.type = 'text'; np.inputMode = 'numeric'; np.placeholder = 'Pag.'; np.value = p || '';
    const nt = grEl('input', 'fg-in gr-pag-t'); nt.type = 'search'; nt.placeholder = 'Titolo, o cerca scheda / foglio…'; nt.value = t || '';
    nt.setAttribute('autocomplete', 'off');
    const rm = grEl('button', 'gr-pag-x', '×'); rm.type = 'button'; rm.setAttribute('aria-label', 'Togli questa pagina');
    const riga = {np: np, nt: nt, l: l || ''};
    const sotto = grEl('div', 'gr-pag-sotto');
    const ris = grEl('div', 'gr-coll-ris');
    const chip = grEl('button', 'fg-chip on gr-link'); chip.type = 'button';
    chip.addEventListener('click', function(){ riga.l = ''; disegnaChip(); aggiornaAmbito(); });
    function disegnaChip(){
      if(riga.l){ chip.textContent = 'Collegata: ' + (grNomeCollegamento(riga.l) || riga.l) + '  ×'; chip.style.display = ''; }
      else chip.style.display = 'none';
    }
    function suggerisci(){
      ris.innerHTML = '';
      const parole = grNorm(nt.value).split(/\s+/).filter(Boolean);
      if(!parole.length) return;
      const usati = righe.map(function(y){ return y.l; });
      const trovati = cat.filter(function(c){
        if(usati.indexOf(c.k) !== -1) return false;
        const hay = grNorm(c.n + ' ' + c.tipo + ' ' + (c.extra || ''));
        return parole.every(function(q){ return hay.indexOf(q) !== -1; });
      });
      trovati.slice(0, 6).forEach(function(c){
        const b = grEl('button', 'fg-riga'); b.type = 'button'; b.setAttribute('data-nav', '');
        b.appendChild(grEl('span', 'fg-riga-data', c.tipo));
        b.appendChild(grEl('span', 'fg-riga-ant', c.n));
        b.addEventListener('click', function(){
          riga.l = c.k; nt.value = c.n.split(' · ')[0];
          ris.innerHTML = ''; disegnaChip(); aggiornaAmbito();
        });
        ris.appendChild(b);
      });
      if(trovati.length > 6) ris.appendChild(grEl('div', 'fg-intro', 'Altri ' + (trovati.length - 6) + '… scrivi di più per restringere.'));
    }
    nt.addEventListener('input', function(){ if(riga.l && grNorm(nt.value).length < 2) { riga.l = ''; disegnaChip(); } suggerisci(); });
    rm.addEventListener('click', function(){
      if(righe.length === 1){ np.value = ''; nt.value = ''; nt.dispatchEvent(new Event('input')); riga.l = ''; ris.innerHTML = ''; disegnaChip(); aggiornaAmbito(); return; }
      righe.splice(righe.indexOf(riga), 1); r.remove(); aggiornaAmbito();
    });
    r.appendChild(np); r.appendChild(ccCampoCerca(nt, 'titolo-pagina')); r.appendChild(rm);
    sotto.appendChild(r); sotto.appendChild(chip); sotto.appendChild(ris);
    disegnaChip();
    righe.push(riga);
    if(piu) boxPagine.insertBefore(sotto, piu); else boxPagine.appendChild(sotto);
    return np;
  }
  (dati.pp.length ? dati.pp : [{p: '', t: '', l: ''}]).forEach(function(y){ aggiungiRiga(y.p, y.t, y.l); });
  piu = grEl('button', 'fg-btn gr-piu', '+ Un’altra pagina'); piu.type = 'button';
  piu.addEventListener('click', function(){ aggiungiRiga('', '', '').focus(); });
  boxPagine.appendChild(piu);
  campo('Pagine del manuale', boxPagine);

  const ambito = grEl('div', 'gr-ambito');
  w.appendChild(ambito);
  function aggiornaAmbito(){
    const mm = grAmbitiPP(righe.map(function(r){ return {p: r.np.value, l: r.l}; }));
    ambito.textContent = mm.length ? 'Ambito: ' + grAmbitiNomi(mm) : '';
    ambito.style.display = mm.length ? '' : 'none';
  }
  w.addEventListener('input', aggiornaAmbito);
  aggiornaAmbito();

  // gli appunti sono i post-it, gli stessi del resto dell'app
  w.appendChild(piMount('gn:' + dati.id, 'Appunti presi in gruppo'));

  function raccogli(){ return righe.map(function(r){ return {p: r.np.value.trim(), t: r.nt.value.trim(), l: r.l}; }).filter(function(y){ return y.p || y.t || y.l; }); }
  const az = grEl('div', 'fg-azioni');
  az.appendChild(grEl('span')).style.flex = '1';
  const ann = grEl('button', 'fg-btn', 'Annulla'); ann.type = 'button';
  ann.addEventListener('click', function(){
    if(x) grVista(x);
    else { piList('gn:' + dati.id).forEach(function(p){ piRemove('gn:' + dati.id, p.id); }); grMostraLista('', ''); }
  });
  const sv = grEl('button', 'fg-btn fg-pri', 'Salva'); sv.type = 'button';
  sv.addEventListener('click', function(){
    const pp = raccogli();
    if(!pp.length && !piList('gn:' + dati.id).length){ righe[0].np.focus(); return; }
    const item = {id: dati.id, g: g.value || grOggi(), pp: pp, mm: grAmbitiPP(pp), n: '', ll: []};
    grSalva(item);
    grVista(item);
  });
  az.appendChild(ann); az.appendChild(sv);
  w.appendChild(az);
  body.appendChild(w);
  if(!x) setTimeout(function(){ righe[0].np.focus(); }, 80);
}
