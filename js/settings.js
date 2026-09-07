// ════════════════════════════════════════════════════════════════
// SETTINGS — Impostazioni, sync, notifiche
// ════════════════════════════════════════════════════════════════
// ── IMPOSTAZIONI ──
async function saveSettings(){
  profile.nome=document.getElementById('set-nome').value.trim();
  profile.cognome=document.getElementById('set-cognome').value.trim();
  const newCode=document.getElementById('set-code').value.trim().toLowerCase();
  const oldCode=profile.code;
  if(newCode&&newCode!==oldCode){
    const vErr=validateUsername(newCode);
    if(vErr){alert(vErr);document.getElementById('set-code').value=oldCode;return;}
    const check=await checkUsernameAvailable(newCode);
    if(!check.ok){alert('Errore di rete');return;}
    if(check.taken){alert('Username "'+newCode+'" gia in uso.');document.getElementById('set-code').value=oldCode;return;}
    if(!confirm('Cambiare username in "'+newCode+'"? Comunicalo alla terapeuta.'))return;
    setSt('spin','Aggiornamento username...');
    try{
      const payload={code:newCode,data:{entries:allData,actTried:actTried,profile:{nome:profile.nome,cognome:profile.cognome,role:profile.role,terapeutaCode:profile.terapeutaCode||null,customActs:profile.customActs||[]},therapistNotes:profile.therapistNotes||{},patientNotes:profile.patientNotes||{},ts:Date.now()},updated_at:new Date().toISOString()};
      const ri=await fetch(SUPA_URL+'/rest/v1/diary_data',{method:'POST',headers:{'Content-Type':'application/json','apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY,'Prefer':'return=minimal'},body:JSON.stringify(payload)});
      if(!ri.ok&&ri.status!==201){alert('Errore: '+ri.status);return;}
      await fetch(SUPA_URL+'/rest/v1/diary_data?code=eq.'+encodeURIComponent(oldCode),{method:'DELETE',headers:getAuthHeaders()});
      localStorage.removeItem('dbt_user_'+oldCode);
      profile.code=newCode;channel=newCode;
      setSt('ok','Username aggiornato');
    }catch(e){alert('Errore: '+e.message);return;}
  }
  if(!profile.code){alert('Username mancante');return;}
  document.getElementById('set-code').value=profile.code;
  document.getElementById('sidebar-name').textContent=profile.nome+' '+profile.cognome;
  const initials=((profile.nome||'').charAt(0)+(profile.cognome||'').charAt(0)).toUpperCase()||'?';
  const av=document.getElementById('sidebar-avatar');if(av)av.textContent=initials;
  const bnav=document.getElementById('bn-avatar');if(bnav)bnav.textContent=initials;
  const bnu=document.getElementById('bn-username');if(bnu)bnu.textContent=profile.nome||'—';
  settings.notifTime=document.getElementById('notif-time').value;
  settings.notifOn=document.getElementById('notif-toggle').checked;
  if(profile.role==='paziente'){
    const tcInput=document.getElementById('set-tcode-input');
    if(tcInput)profile.terapeutaCode=tcInput.value.trim().toLowerCase()||null;
  }
  svLS();showToast('t-set');
  if(settings.notifOn)scheduleNotif();
  startAutoPull();
  await pushChan();
}
function toggleNotif(cb){
  if(cb.checked){
    if(!('Notification' in window)){alert('Notifiche non supportate su questo browser.');cb.checked=false;return}
    Notification.requestPermission().then(p=>{
      if(p==='granted'){settings.notifOn=true;svLS();scheduleNotif();}
      else{cb.checked=false;alert('Permesso notifiche negato. Attivale dalle impostazioni del browser/telefono.')}
    });
  }else{settings.notifOn=false;svLS()}
}
// doLogout moved to auth section above
function confirmReset(){
  if(confirm('Sei sicura di voler cancellare TUTTI i dati di questo profilo? Questa operazione è irreversibile.')){
    if(profile.code)localStorage.removeItem('dbt_user_'+profile.code);
    localStorage.removeItem('dbt_profile');
    location.reload();
  }
}


// ── SYNC ──
function setSt(state,msg){
  const dot=document.getElementById('sDot');if(dot)dot.className='dot'+(state?' '+state:'');
  const m=document.getElementById('sMsg');if(m)m.textContent=msg;
}
async function pushChan(){
  if(!channel)return;
  if(!SUPA_URL||!SUPA_KEY){setSt('err','Configura Supabase nelle impostazioni');return;}
  setSt('spin','Sincronizzazione...');
  try{
    lastPushTs=Date.now();
    // Try POST with upsert via Prefer header
    const payload={
      code:channel,
      data:{
        entries:allData,
        actTried:actTried,
        profile:{nome:profile.nome,cognome:profile.cognome,role:profile.role,terapeutaCode:profile.terapeutaCode||null,customActs:profile.customActs||[]},
        therapistNotes:profile.therapistNotes||{},
        patientNotes:profile.patientNotes||{},
        ts:lastPushTs
      },
      updated_at:new Date().toISOString()
    };
    // PATCH existing row
    let r=await fetch(SUPA_URL+'/rest/v1/diary_data?code=eq.'+encodeURIComponent(channel),{
      method:'PATCH',
      headers:{...getAuthHeaders(),'Prefer':'return=minimal,return=representation'},
      body:JSON.stringify({data:payload.data,updated_at:payload.updated_at})
    });
    console.log('[PUSH] status:',r.status,'channel:',channel,'uid:',supaSession?.user?.id);
    if(r.status===404||r.status===0){
      // Row doesn't exist yet — create it
      r=await fetch(SUPA_URL+'/rest/v1/diary_data',{
        method:'POST',
        headers:{...getAuthHeaders(),'Prefer':'return=minimal'},
        body:JSON.stringify(payload)
      });
    }
    // 204 = success (PATCH with no body is normal)
    if(r.ok||r.status===201||r.status===200||r.status===204)setSt('ok','Sincronizzato '+new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}));
    else{const err=await r.text();console.error('Push error:',r.status,err);setSt('err','Errore '+r.status+': '+err.slice(0,80));}
  }catch(e){setSt('err','Errore di rete')}
}
async function pullChan(){
  if(!channel){setSt('err','Nessun canale configurato.');return}
  setSt('spin','Ricezione...');
  try{
    const since=Math.floor((Date.now()-86400000)/1000);const r=await fetch('https://ntfy.sh/'+channel+'/json?poll=1&since='+since);
    if(!r.ok){setSt('err','Errore '+r.status);return}
    const text=await r.text();
    const lines=text.trim().split('\n').filter(Boolean);
    let found=null;
    for(let i=lines.length-1;i>=0;i--){
      try{const msg=JSON.parse(lines[i]);if(msg.message){const dec=JSON.parse(decodeURIComponent(atob(msg.message)));if(dec&&dec.data){found=dec;break}}}catch(e){}
    }
    if(found){allData=found.data;svLS();setForm(allData[dk(cur)]||null);updDL();setSt('ok','Aggiornato — '+new Date().toLocaleTimeString('it-IT'));}
    else setSt('ok','Nessun dato nelle ultime 24h.');
  }catch(e){setSt('err','Errore di rete')}
}

// ── AUTO SYNC ──
let autoPullTimer=null;
function startAutoPull(){
  if(autoPullTimer)clearInterval(autoPullTimer);
  if(!channel)return;
  // pull immediately on start, then every 30s
  silentPull();
  autoPullTimer=setInterval(silentPull,30000);
}
async function silentPull(){
  if(!channel||!SUPA_URL||!SUPA_KEY)return;
  try{
    const r=await fetch(SUPA_URL+'/rest/v1/diary_data?code=eq.'+encodeURIComponent(channel)+'&select=data,updated_at',{
      headers:getAuthHeaders()
    });
    if(!r.ok){console.error('Pull error',r.status);return;}
    const rows=await r.json();
    if(!rows||!rows.length)return;
    const remote=rows[0].data;
    if(!remote||!remote.entries)return;
    const remoteTs=remote.ts||0;
    let changed=false;
    Object.keys(remote.entries).forEach(k=>{
      const local=allData[k];const r2=remote.entries[k];
      if(!local){allData[k]=r2;changed=true;}
      else{
        const lts=local.savedAt?new Date(local.savedAt).getTime():0;
        const rts=r2.savedAt?new Date(r2.savedAt).getTime():0;
        if(rts>lts){
          const merged2={...r2};
          if(!merged2.planner&&local.planner)merged2.planner=local.planner;
          if((!merged2.skills||!Object.keys(merged2.skills).length)&&local.skills)merged2.skills=local.skills;
          allData[k]=merged2;changed=true;
        }
      }
    });
    if(remote.actTried){
      Object.keys(remote.actTried).forEach(k=>{
        const localT=actTried[k];const remoteT=remote.actTried[k];
        const lArr=Array.isArray(localT)?localT:localT?[localT]:[];
        const rArr=Array.isArray(remoteT)?remoteT:remoteT?[remoteT]:[];
        const merged=[...new Set([...lArr,...rArr])];
        if(merged.length){actTried[k]=merged;changed=true;}
      });
    }
    if(changed||remoteTs>lastPushTs){
      svData();
      // Only refresh form if the user hasn't started filling it in
      const k=dk(cur);
      const live=getForm();
      const isDirty=Object.values(live.scales||{}).some(v=>v!=null)
        ||Object.values(live.toggles||{}).some(v=>v!=null)
        ||Object.values(live.texts||{}).some(v=>v&&v.trim())
        ||Object.keys(live.skills||{}).length>0;
      if(!isDirty)setForm(allData[k]||null);
      updDL();
      // Always refresh planner after pull, not just when on attivita
      const attActive=document.getElementById('page-attivita')?.classList.contains('active');
      if(attActive){
        const pickVisible=document.getElementById('act-step-pick')?.style.display==='block';
        if(pickVisible)renderPlanSummary(); else renderPlanner();
      }
      setSt('ok','Sincronizzato '+new Date().toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'}));
    }
  }catch(e){}
}

// ── NOTIFICATIONS ──
let notifTimer=null;

// Mostra la notifica via SW (o direttamente se SW non disponibile)
function showDiaryNotification(){
  const opts={
    body:'Non dimenticare di compilare la tua diary card di oggi! 📓',
    icon:'./icon-192.png',
    badge:'./icon-192.png',
    tag:'daily-reminder',
    renotify:false
  };
  if(navigator.serviceWorker&&navigator.serviceWorker.controller){
    navigator.serviceWorker.ready.then(reg=>reg.showNotification('Diary Card DBT',opts));
  } else if(Notification.permission==='granted'){
    new Notification('Diary Card DBT',opts);
  }
}

// Controlla all'apertura/riapertura dell'app se è ora di ricordare
// (fallback per quando il timer non gira perché l'app era chiusa)
function checkNotifOnOpen(){
  if(!settings.notifOn||Notification.permission!=='granted')return;
  const [hh,mm]=(settings.notifTime||'21:00').split(':').map(Number);
  const now=new Date();
  const todayKey=dk(now);
  const lastShown=localStorage.getItem('dbt_notif_shown');
  // Se è già passata l'ora impostata oggi e non abbiamo ancora mostrato la notifica
  if(now.getHours()>hh||(now.getHours()===hh&&now.getMinutes()>=mm)){
    if(lastShown!==todayKey){
      if(!allData[todayKey]||isDayEmpty(allData[todayKey])){
        showDiaryNotification();
        localStorage.setItem('dbt_notif_shown',todayKey);
      }
    }
  }
}

// Schedula il timer per oggi (funziona se l'app rimane aperta)
function scheduleNotif(){
  if(!('Notification' in window)||Notification.permission!=='granted')return;
  if(notifTimer){clearTimeout(notifTimer);notifTimer=null;}
  const [hh,mm]=(settings.notifTime||'21:00').split(':').map(Number);
  const now=new Date();
  const target=new Date();
  target.setHours(hh,mm,0,0);
  if(target<=now)target.setDate(target.getDate()+1);
  notifTimer=setTimeout(()=>{
    const todayKey=dk(new Date());
    const lastShown=localStorage.getItem('dbt_notif_shown');
    if(lastShown!==todayKey&&(!allData[todayKey]||isDayEmpty(allData[todayKey]))){
      showDiaryNotification();
      localStorage.setItem('dbt_notif_shown',todayKey);
    }
    scheduleNotif(); // riprogramma per domani
  },target-now);
}

function switchToRegister(){
  const login=document.getElementById('ob-login');
  const reg=document.getElementById('ob-register');
  login.style.animation='slideOutLeft .25s ease forwards';
  setTimeout(()=>{
    login.style.display='none';
    reg.style.display='block';
    reg.style.animation='slideInRight .25s ease forwards';
  },220);
}
function switchToLogin(){
  const login=document.getElementById('ob-login');
  const reg=document.getElementById('ob-register');
  reg.style.animation='slideOutRight .25s ease forwards';
  setTimeout(()=>{
    reg.style.display='none';
    login.style.display='block';
    login.style.animation='slideInLeft .25s ease forwards';
  },220);
}

