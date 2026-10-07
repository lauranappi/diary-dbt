// ════════════════════════════════════════════════════════════════
// SINCRONIZZAZIONE PRIVATA di post-it e preferiti
// ════════════════════════════════════════════════════════════════
// Tabella Supabase `guida_personale` (una riga per utente, visibile
// solo a lui grazie alla RLS): NON passa dalla riga condivisa col
// terapeuta. Se la tabella non esiste ancora, l'app resta locale.
// Unione per elemento: vince la modifica piu' recente (campo ts).

let _gsTimer = null, _gsBusy = false, _gsAgain = false, _gsOff = false;
const GS_LAPIDE_GIORNI = 60;

function gsUid(){
  return (typeof supaSession !== 'undefined' && supaSession && supaSession.user) ? supaSession.user.id : null;
}
function gsPianifica(){
  if(_gsOff || !gsUid()) return;
  clearTimeout(_gsTimer);
  _gsTimer = setTimeout(gsSync, 1500);
}

function gsUnisciPostit(a, b){
  const out = {};
  const limite = Date.now() - GS_LAPIDE_GIORNI * 86400000;
  const chiavi = {};
  Object.keys(a || {}).concat(Object.keys(b || {})).forEach(function(k){ chiavi[k] = 1; });
  Object.keys(chiavi).forEach(function(k){
    const per = {};
    (a[k] || []).concat(b[k] || []).forEach(function(p){
      if(!p || !p.id) return;
      const x = per[p.id];
      if(!x || (p.ts || 0) > (x.ts || 0)) per[p.id] = p;
    });
    const lista = Object.keys(per).map(function(id){ return per[id]; })
      .filter(function(p){ return !(p.d && (p.ts || 0) < limite); })
      .sort(function(x, y){ return (y.ts || 0) - (x.ts || 0); });
    if(lista.length) out[k] = lista;
  });
  return out;
}
function gsUnisciPref(a, b){
  const out = {};
  [a || {}, b || {}].forEach(function(m){
    Object.keys(m).forEach(function(id){
      const v = m[id];
      if(!v) return;
      if(!out[id] || (v.ts || 0) > (out[id].ts || 0)) out[id] = v;
    });
  });
  return out;
}

async function gsSync(){
  const uid = gsUid();
  if(!uid || _gsOff) return;
  if(_gsBusy){ _gsAgain = true; return; }
  _gsBusy = true;
  try{
    const r = await fetch(SUPA_URL + '/rest/v1/guida_personale?user_id=eq.' + encodeURIComponent(uid) + '&select=data', {headers: getAuthHeaders()});
    if(r.status === 404){ _gsOff = true; return; }   // tabella non ancora creata: si resta in locale
    if(!r.ok) return;
    const rows = await r.json();
    const rem = (rows && rows[0] && rows[0].data) || {};
    const remP = rem.postit || {}, remF = rem.pref || {};
    const unito = {
      postit: gsUnisciPostit(piAll(), remP),
      pref: gsUnisciPref(pfMappa(), remF)
    };
    const cambiatoLocale = JSON.stringify(unito.postit) !== JSON.stringify(piAll())
                        || JSON.stringify(unito.pref) !== JSON.stringify(pfMappa());
    if(cambiatoLocale){
      piImpostaTutto(unito.postit);
      pfImpostaMappa(unito.pref);
      document.querySelectorAll('.pi-wrap').forEach(function(w){ piRender(w); });
      if(typeof piAggiornaTuttiIBadge === 'function') piAggiornaTuttiIBadge();
      if(typeof pfAggiornaStelle === 'function') pfAggiornaStelle();
      if(typeof pfRenderChip === 'function') pfRenderChip();
    }
    if(JSON.stringify(unito.postit) !== JSON.stringify(remP) || JSON.stringify(unito.pref) !== JSON.stringify(remF)){
      await fetch(SUPA_URL + '/rest/v1/guida_personale', {
        method: 'POST',
        headers: Object.assign({}, getAuthHeaders(), {'Prefer': 'resolution=merge-duplicates,return=minimal'}),
        body: JSON.stringify({user_id: uid, data: unito, updated_at: new Date().toISOString()})
      });
    }
  }catch(e){ /* niente rete: riprova alla prossima modifica */ }
  finally{
    _gsBusy = false;
    if(_gsAgain){ _gsAgain = false; gsPianifica(); }
  }
}

document.addEventListener('visibilitychange', function(){
  if(document.visibilityState === 'visible') gsPianifica();
});
