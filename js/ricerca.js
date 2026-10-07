// ════════════════════════════════════════════════════════════════
// RICERCA E PREFERITI — per consultare la guida dal telefono
// ════════════════════════════════════════════════════════════════
// Usa window.GUIDE_INDEX, costruito da renderGuide(). I preferiti
// restano su questo dispositivo (localStorage), come i post-it.

function pfCode(){
  return (typeof profile !== 'undefined' && profile && profile.code) ? profile.code : 'anon';
}
// mappa { id: {on:true/false, ts} } : il ts serve a sincronizzare anche le stelle tolte
function pfKey(){ return 'dbt_pref2_' + pfCode(); }
function pfMappa(){
  try{
    const r = localStorage.getItem(pfKey());
    if(r){ const m = JSON.parse(r); if(m && typeof m === 'object' && !Array.isArray(m)) return m; }
    // migrazione dal vecchio formato (semplice elenco di id)
    const vecchio = JSON.parse(localStorage.getItem('dbt_pref_' + pfCode()) || '[]');
    const m = {};
    if(Array.isArray(vecchio)) vecchio.forEach(function(id, i){ m[id] = {on:true, ts:1 + i}; });
    return m;
  }catch(e){ return {}; }
}
function pfImpostaMappa(m){
  try{ localStorage.setItem(pfKey(), JSON.stringify(m)); }catch(e){ /* storage non disponibile */ }
}
function pfLista(){
  const m = pfMappa();
  return Object.keys(m).filter(function(id){ return m[id] && m[id].on; })
    .sort(function(a, b){ return m[a].ts - m[b].ts; });
}
function pfE(id){ const m = pfMappa(); return !!(m[id] && m[id].on); }
function pfToggle(id){
  const m = pfMappa();
  m[id] = {on: !(m[id] && m[id].on), ts: Date.now()};
  pfImpostaMappa(m);
  if(typeof gsPianifica === 'function') gsPianifica();
  pfAggiornaStelle();
  pfRenderChip();
}
function pfAggiornaStelle(){
  document.querySelectorAll('.pf-star').forEach(function(b){
    const on = pfE(b.dataset.sk);
    b.classList.toggle('on', on);
    b.setAttribute('aria-pressed', on ? 'true' : 'false');
    b.setAttribute('aria-label', on ? 'Togli dai preferiti' : 'Aggiungi ai preferiti');
  });
}

// la stella non deve aprire o chiudere l'abilita': intercetta il tocco in cattura
document.addEventListener('click', function(ev){
  const b = ev.target.closest && ev.target.closest('.pf-star');
  if(!b) return;
  ev.preventDefault(); ev.stopPropagation();
  pfToggle(b.dataset.sk);
}, true);

// ── ricerca ──
function rcNorm(t){
  return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}
// nomi dei fogli/schede da compilare collegati a una pagina di teoria: cercando
// "controlla i fatti" o "osservare e descrivere" si trova la teoria che li contiene
function rcFogli(e){
  if(e._fogli !== undefined) return e._fogli;
  let t = '';
  try{
    if(typeof grSchedeDa === 'function'){
      grSchedeDa(e.id).forEach(function(s){
        t += ' ' + s.nome;
        if(s.k.indexOf('fg:') === 0 && typeof fgDef === 'function'){ const d = fgDef(s.k.slice(3)); if(d) t += ' ' + (d.sub || ''); }
      });
    }
  }catch(err){}
  e._fogli = t;
  return t;
}
// fogli senza una pagina di teoria nel manuale: si cercano come voci a parte
function rcLiberi(){
  if(window._rcLiberi) return window._rcLiberi;
  const l = [];
  if(typeof grHaTeoria === 'function'){
    if(typeof SCHEDA_TITOLI !== 'undefined'){
      Object.keys(SCHEDA_TITOLI).forEach(function(k){
        if(grHaTeoria('sc:' + k)) return;
        l.push({id:'sc-' + k, badge:'FOGLIO', name:SCHEDA_TITOLI[k], desc:(typeof FOGLI_SOTTOTITOLO !== 'undefined' && FOGLI_SOTTOTITOLO[k]) || '',
          modTitolo:'Foglio di lavoro', testo:'', _fogli:'', apri:function(){ openScheda(k); }});
      });
    }
    if(typeof FG_FOGLI !== 'undefined'){
      FG_FOGLI.forEach(function(f){
        if(grHaTeoria('fg:' + f.id)) return;
        l.push({id:'fg-' + f.id, badge:'FOGLIO', name:f.t, desc:f.sub || '', modTitolo:'Foglio di lavoro', testo:'', _fogli:'', apri:function(){ fgApri(f.id); }});
      });
    }
  }
  window._rcLiberi = l;
  return l;
}
function rcCerca(q){
  const parole = rcNorm(q).split(/\s+/).filter(Boolean);
  if(!parole.length || !window.GUIDE_INDEX) return [];
  const out = [];
  window.GUIDE_INDEX.concat(rcLiberi()).forEach(function(e){
    const titolo = rcNorm(e.badge + ' ' + e.name + ' ' + e.desc + ' ' + rcFogli(e));
    const tutto = titolo + ' ' + rcNorm(e.testo) + ' ' + rcNorm(e.modTitolo);
    if(!parole.every(function(w){ return tutto.indexOf(w) !== -1; })) return;
    // chi ha tutte le parole nel titolo viene prima
    const punti = parole.every(function(w){ return titolo.indexOf(w) !== -1; }) ? 0 : 1;
    out.push({e:e, p:punti});
  });
  out.sort(function(a, b){ return a.p - b.p; });
  if(!out.length && parole.length > 1){
    // nessuna scheda con tutte le parole: mostra quelle con almeno una, prima chi ne ha di piu'
    window.GUIDE_INDEX.concat(rcLiberi()).forEach(function(e){
      const tutto = rcNorm(e.badge + ' ' + e.name + ' ' + e.desc + ' ' + e.testo + ' ' + e.modTitolo + ' ' + rcFogli(e));
      const n = parole.filter(function(w){ return tutto.indexOf(w) !== -1; }).length;
      if(n) out.push({e:e, p:-n});
    });
    out.sort(function(a, b){ return a.p - b.p; });
  }
  return out.map(function(x){ return x.e; });
}

function rcApri(e){
  if(typeof e.apri === 'function'){ e.apri(); return; }
  const lettura = (typeof SCHEDA_LETTURA !== 'undefined') ? SCHEDA_LETTURA[e.badge] : null;
  if(lettura && typeof openScheda === 'function'){ openScheda(lettura); return; }
  if(typeof openGuideSkill === 'function') openGuideSkill(e.mod, e.id);
}

function rcRenderRisultati(q){
  const box = document.getElementById('guida-risultati');
  const contenuto = document.getElementById('guida-content');
  const extra = document.querySelectorAll('.dc-guida-scheda-emo, .dc-guida-scheda-fogli');
  const attivo = q.trim().length > 0;
  if(contenuto) contenuto.style.display = attivo ? 'none' : '';
  extra.forEach(function(el){ el.style.display = attivo ? 'none' : ''; });
  const chips = document.getElementById('guida-preferiti');
  if(chips) chips.style.display = attivo ? 'none' : '';
  if(!box) return;
  box.innerHTML = '';
  box.style.display = attivo ? 'flex' : 'none';
  if(!attivo) return;
  const ris = rcCerca(q);
  if(!ris.length){
    const v = document.createElement('div');
    v.className = 'rc-vuoto';
    v.textContent = 'Nessuna abilità trovata. Prova con una parola più corta, per esempio "rabbia" o "crisi".';
    box.appendChild(v);
    return;
  }
  ris.forEach(function(e){
    const r = document.createElement('button');
    r.type = 'button';
    r.className = 'rc-riga';
    r.setAttribute('data-nav', '');
    const b = document.createElement('span'); b.className = 'rc-badge'; b.textContent = e.badge;
    const t = document.createElement('span'); t.className = 'rc-testo';
    const n = document.createElement('span'); n.className = 'rc-nome'; n.textContent = e.name;
    const m = document.createElement('span'); m.className = 'rc-mod'; m.textContent = e.modTitolo;
    t.appendChild(n); t.appendChild(m);
    r.appendChild(b); r.appendChild(t);
    r.addEventListener('click', function(){ rcApri(e); });
    box.appendChild(r);
  });
}

// Campo di ricerca: niente suggerimenti di email/contatti di iOS, con la
// croce a destra per svuotarlo. Restituisce il contenitore da inserire al
// posto dell'input.
function ccCampoCerca(inp, nome){
  inp.type = 'search';
  inp.name = nome || 'cerca-app';
  inp.autocomplete = 'off';
  inp.setAttribute('autocorrect', 'off');
  inp.setAttribute('autocapitalize', 'off');
  inp.setAttribute('enterkeyhint', 'search');
  inp.setAttribute('inputmode', 'search');
  inp.setAttribute('data-1p-ignore', '');
  inp.setAttribute('data-lpignore', 'true');
  inp.spellcheck = false;
  // iOS propone email/password anche su questi campi perche' nella pagina c'e' il modulo di accesso:
  // il campo resta in sola lettura finche' non lo tocchi, cosi' Safari non lo considera un campo di accesso.
  inp.readOnly = true;
  function sblocca(){ inp.readOnly = false; }
  inp.addEventListener('pointerdown', sblocca); inp.addEventListener('touchstart', sblocca, {passive: true}); inp.addEventListener('focus', sblocca);
  inp.addEventListener('blur', function(){ setTimeout(function(){ if(document.activeElement !== inp) inp.readOnly = true; }, 300); });
  const w = document.createElement('div'); w.className = 'cc-wrap';
  const x = document.createElement('button');
  x.type = 'button'; x.className = 'cc-x'; x.setAttribute('aria-label', 'Cancella'); x.setAttribute('data-nav', '');
  x.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  function aggiorna(){ x.style.display = inp.value ? 'flex' : 'none'; }
  inp.addEventListener('input', aggiorna);
  x.addEventListener('mousedown', function(e){ e.preventDefault(); });
  x.addEventListener('click', function(){ inp.value = ''; aggiorna(); inp.dispatchEvent(new Event('input', {bubbles: true})); sblocca(); inp.focus(); });
  w.appendChild(inp); w.appendChild(x); aggiorna();
  return w;
}

// ── preferiti in cima alla guida ──
function pfRenderChip(){
  const wrap = document.getElementById('guida-preferiti');
  if(!wrap || !window.GUIDE_INDEX) return;
  const ids = pfLista();
  const abil = ids.map(function(id){
    return window.GUIDE_INDEX.filter(function(e){ return e.id === id; })[0];
  }).filter(Boolean);
  wrap.innerHTML = '';
  if(!abil.length){ wrap.style.display = 'none'; return; }
  wrap.style.display = '';
  const tit = document.createElement('div');
  tit.className = 'pf-titolo';
  tit.textContent = 'I tuoi preferiti';
  wrap.appendChild(tit);
  const riga = document.createElement('div');
  riga.className = 'pf-chips';
  abil.forEach(function(e){
    const c = document.createElement('button');
    c.type = 'button';
    c.className = 'pf-chip';
    c.setAttribute('data-nav', '');
    c.textContent = e.name;
    c.title = e.modTitolo || e.name;
    c.addEventListener('click', function(){ rcApri(e); });
    riga.appendChild(c);
  });
  wrap.appendChild(riga);
}

// ── montaggio: chiamato da renderGuide() quando la guida e' costruita ──
function ricercaMount(){
  const contenuto = document.getElementById('guida-content');
  if(typeof gsPianifica === 'function') gsPianifica();
  if(!contenuto || document.getElementById('guida-ricerca')) { pfAggiornaStelle(); pfRenderChip(); return; }
  const zona = document.createElement('div');
  zona.id = 'guida-ricerca';
  zona.className = 'rc-zona';
  const campo = document.createElement('div');
  campo.className = 'rc-campo';
  campo.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="11" cy="11" r="6.5" stroke="currentColor" stroke-width="2.4"/><path d="M16 16l4.5 4.5" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const inp = document.createElement('input');
  inp.type = 'search';
  inp.id = 'guida-cerca';
  inp.placeholder = 'Cerca: rabbia, crisi, sonno…';
  inp.setAttribute('aria-label', 'Cerca nella guida');
  inp.autocomplete = 'off';
  inp.addEventListener('input', function(){ rcRenderRisultati(inp.value); });
  campo.appendChild(ccCampoCerca(inp, 'cerca-guida'));
  zona.appendChild(campo);
  const pref = document.createElement('div'); pref.id = 'guida-preferiti'; pref.className = 'pf-wrap';
  const ris = document.createElement('div'); ris.id = 'guida-risultati'; ris.className = 'rc-risultati'; ris.style.display = 'none';
  zona.appendChild(pref); zona.appendChild(ris);
  const carta = contenuto.parentElement.querySelector('.gr-card-top');
  contenuto.parentElement.insertBefore(zona, carta || contenuto);
  pfAggiornaStelle();
  pfRenderChip();
}
