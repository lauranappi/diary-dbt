// ════════════════════════════════════════════════════════════════
// RICERCA E PREFERITI — per consultare la guida dal telefono
// ════════════════════════════════════════════════════════════════
// Usa window.GUIDE_INDEX, costruito da renderGuide(). I preferiti
// restano su questo dispositivo (localStorage), come i post-it.

function pfKey(){
  const code = (typeof profile !== 'undefined' && profile && profile.code) ? profile.code : 'anon';
  return 'dbt_pref_' + code;
}
function pfLista(){
  try{
    const a = JSON.parse(localStorage.getItem(pfKey()) || '[]');
    return Array.isArray(a) ? a : [];
  }catch(e){ return []; }
}
function pfSalva(a){
  try{ localStorage.setItem(pfKey(), JSON.stringify(a)); }catch(e){ /* storage non disponibile */ }
}
function pfE(id){ return pfLista().indexOf(id) !== -1; }
function pfToggle(id){
  const a = pfLista();
  const i = a.indexOf(id);
  if(i === -1) a.push(id); else a.splice(i, 1);
  pfSalva(a);
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
function rcCerca(q){
  const parole = rcNorm(q).split(/\s+/).filter(Boolean);
  if(!parole.length || !window.GUIDE_INDEX) return [];
  const out = [];
  window.GUIDE_INDEX.forEach(function(e){
    const titolo = rcNorm(e.badge + ' ' + e.name + ' ' + e.desc);
    const tutto = titolo + ' ' + rcNorm(e.testo) + ' ' + rcNorm(e.modTitolo);
    if(!parole.every(function(w){ return tutto.indexOf(w) !== -1; })) return;
    // chi ha tutte le parole nel titolo viene prima
    const punti = parole.every(function(w){ return titolo.indexOf(w) !== -1; }) ? 0 : 1;
    out.push({e:e, p:punti});
  });
  out.sort(function(a, b){ return a.p - b.p; });
  if(!out.length && parole.length > 1){
    // nessuna scheda con tutte le parole: mostra quelle con almeno una, prima chi ne ha di piu'
    window.GUIDE_INDEX.forEach(function(e){
      const tutto = rcNorm(e.badge + ' ' + e.name + ' ' + e.desc + ' ' + e.testo + ' ' + e.modTitolo);
      const n = parole.filter(function(w){ return tutto.indexOf(w) !== -1; }).length;
      if(n) out.push({e:e, p:-n});
    });
    out.sort(function(a, b){ return a.p - b.p; });
  }
  return out.map(function(x){ return x.e; });
}

function rcApri(e){
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
    c.textContent = e.badge;
    c.title = e.name;
    c.addEventListener('click', function(){ rcApri(e); });
    riga.appendChild(c);
  });
  wrap.appendChild(riga);
}

// ── montaggio: chiamato da renderGuide() quando la guida e' costruita ──
function ricercaMount(){
  const contenuto = document.getElementById('guida-content');
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
  campo.appendChild(inp);
  zona.appendChild(campo);
  const pref = document.createElement('div'); pref.id = 'guida-preferiti'; pref.className = 'pf-wrap';
  const ris = document.createElement('div'); ris.id = 'guida-risultati'; ris.className = 'rc-risultati'; ris.style.display = 'none';
  zona.appendChild(pref); zona.appendChild(ris);
  contenuto.parentElement.insertBefore(zona, contenuto);
  pfAggiornaStelle();
  pfRenderChip();
}
