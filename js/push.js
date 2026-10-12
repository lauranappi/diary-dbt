// ══════════════════════════════════════════════════════════════════
// Promemoria push: funzionano anche con l'app chiusa.
// Il telefono si iscrive alle notifiche, l'iscrizione e l'orario vanno su
// Supabase (tabella push_iscrizioni) e un'azione programmata su GitHub
// manda la notifica all'ora scelta, se il diario di oggi e' ancora vuoto.
// ══════════════════════════════════════════════════════════════════
const PN_VAPID_PUBLIC = 'BDpFExFmNo1KYFbt1RvO1UjnRUPOQzCmvYnpieofkM8tTh7uK0eMLgiaGVOHp9f7ld0YUPa_Y_ms734tbnajyqs';

function pnSupportato(){
  return ('serviceWorker' in navigator) && ('PushManager' in window) && ('Notification' in window);
}
function pnB64(b64){
  const pad = '='.repeat((4 - b64.length % 4) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  const out = new Uint8Array(raw.length);
  for(let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
  return out;
}
function pnOggi(){ return dk(new Date()); }
function pnStato(msg, errore){
  const el = document.getElementById('notif-stato');
  if(!el) return;
  el.textContent = msg || '';
  el.style.color = errore ? 'var(--terra, #C1714A)' : '';
  el.style.display = msg ? '' : 'none';
}
async function pnIscrizione(crea){
  // se il service worker non e' pronto non si resta in attesa all'infinito
  const reg = await Promise.race([navigator.serviceWorker.ready, new Promise(function(_, no){ setTimeout(function(){ no(new Error('service worker non pronto')); }, 6000); })]);
  let s = await reg.pushManager.getSubscription();
  if(!s && crea){
    s = await reg.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: pnB64(PN_VAPID_PUBLIC)});
  }
  return s;
}
function pnRiga(s, attivo){
  const riga = {
    endpoint: s.endpoint,
    user_id: supaSession.user.id,
    subscription: s.toJSON(),
    ora: (typeof settings !== 'undefined' && settings.notifTime) || '21:00',
    fuso: (Intl.DateTimeFormat().resolvedOptions().timeZone) || 'Europe/Rome',
    attivo: !!attivo,
    updated_at: new Date().toISOString()
  };
  // se oggi il diario e' gia' compilato, il server non deve mandare nulla
  if(typeof allData !== 'undefined' && typeof isDayEmpty === 'function' && !isDayEmpty(allData[pnOggi()])) riga.compilato_il = pnOggi();
  return riga;
}
// attiva o aggiorna l'iscrizione (anche al cambio dell'orario)
async function pnAggiorna(attivo){
  if(attivo === undefined) attivo = !!(typeof settings !== 'undefined' && settings.notifOn);
  if(!pnSupportato()){
    if(attivo) pnStato('Per ricevere il promemoria anche con l’app chiusa, aggiungi l’app alla schermata Home (Condividi, poi “Aggiungi a Home”) e riaprila da lì.', true);
    return false;
  }
  if(!attivo){
    try{
      const s = await pnIscrizione(false);
      if(s && typeof supaSession !== 'undefined' && supaSession && supaSession.user){
        await fetch(SUPA_URL + '/rest/v1/push_iscrizioni?endpoint=eq.' + encodeURIComponent(s.endpoint), {method: 'DELETE', headers: getAuthHeaders()});
      }
      if(s) await s.unsubscribe();
    }catch(e){ console.warn('[PUSH] disattivazione', e); }
    pnStato('');
    return true;
  }
  if(Notification.permission !== 'granted') return false;
  if(typeof supaSession === 'undefined' || !supaSession || !supaSession.user){
    pnStato('Accedi per attivare il promemoria anche con l’app chiusa.', true);
    return false;
  }
  try{
    const s = await pnIscrizione(true);
    const r = await fetch(SUPA_URL + '/rest/v1/push_iscrizioni?on_conflict=endpoint', {
      method: 'POST',
      headers: Object.assign({}, getAuthHeaders(), {'Prefer': 'resolution=merge-duplicates,return=minimal'}),
      body: JSON.stringify(pnRiga(s, true))
    });
    if(!r.ok){
      const t = await r.text();
      console.error('[PUSH] salvataggio', r.status, t);
      pnStato(r.status === 404 || /push_iscrizioni/.test(t)
        ? 'Manca la tabella su Supabase: esegui supabase/promemoria_push.sql.'
        : 'Non riesco a salvare il promemoria (errore ' + r.status + ').', true);
      return false;
    }
    pnStato('Attivo anche con l’app chiusa, alle ' + ((settings.notifTime) || '21:00') + '.');
    return true;
  }catch(e){
    console.error('[PUSH]', e);
    pnStato('Non riesco ad attivare il promemoria: ' + (e && e.message ? e.message : e), true);
    return false;
  }
}
// diario di oggi compilato: il server non manda il promemoria
async function pnSegnaCompilato(){
  try{
    if(!pnSupportato() || !(settings && settings.notifOn) || !supaSession || !supaSession.user) return;
    const s = await pnIscrizione(false);
    if(!s) return;
    await fetch(SUPA_URL + '/rest/v1/push_iscrizioni?endpoint=eq.' + encodeURIComponent(s.endpoint), {
      method: 'PATCH', headers: Object.assign({}, getAuthHeaders(), {'Prefer': 'return=minimal'}),
      body: JSON.stringify({compilato_il: pnOggi()})
    });
  }catch(e){ console.warn('[PUSH] compilato', e); }
}
// notifica di prova, solo su questo dispositivo
function pnProva(){
  if(!('Notification' in window)){ pnStato('Questo browser non supporta le notifiche.', true); return; }
  Notification.requestPermission().then(function(p){
    if(p !== 'granted'){ pnStato('Notifiche non consentite: attivale dalle impostazioni del telefono.', true); return; }
    if(typeof showDiaryNotification === 'function') showDiaryNotification();
    pnStato('Notifica di prova inviata. Se non la vedi, controlla le impostazioni del telefono.');
  });
}
