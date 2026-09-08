// ════════════════════════════════════════════════════════════════
// AUTH — Client Supabase, login, logout, sessione
// ════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════
// SUPABASE AUTH
// ══════════════════════════════════════════
const supabase = window.supabase.createClient(SUPA_URL, SUPA_KEY);
let supaSession = null;

function getAuthHeaders(){
  const token = supaSession?.access_token || SUPA_KEY;
  return {
    'apikey': SUPA_KEY,
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  };
}

async function doLogin(){
  const email = document.getElementById('ob-email').value.trim();
  const pwd = document.getElementById('ob-password').value;
  const msg = document.getElementById('ob-login-msg');
  if(!email||!pwd){msg.style.color='var(--red)';msg.textContent='Inserisci email e password.';return;}
  msg.style.color='var(--muted)';msg.textContent='Accesso in corso...';
  const {data,error} = await supabase.auth.signInWithPassword({email,password:pwd});
  if(error){msg.style.color='var(--red)';msg.textContent=error.message==='Invalid login credentials'?'Email o password errati.':(error.message||'Errore sconosciuto');return;}
  supaSession=data.session;
  await loadUserData(data.user);
}

async function doRegister(){
  const nome = document.getElementById('ob-nome').value.trim();
  const cognome = document.getElementById('ob-cognome').value.trim();
  const email = document.getElementById('ob-reg-email').value.trim();
  const pwd = document.getElementById('ob-reg-password').value;
  const username = document.getElementById('ob-username').value.trim().toLowerCase();
  const pcode = document.getElementById('ob-pcode').value.trim().toLowerCase()||null;
  const role = document.querySelector('.ob-role-btn.selected')?.id==='rb-terapeuta'?'terapeuta':'paziente';
  const msg = document.getElementById('ob-reg-msg');

  if(!nome||!email||!pwd||!username){msg.style.color='var(--red)';msg.textContent='Compila tutti i campi obbligatori.';return;}
  const vErr=validateUsername(username);
  if(vErr){msg.style.color='var(--red)';msg.textContent=vErr;return;}
  if(pwd.length<6){msg.style.color='var(--red)';msg.textContent='Password minimo 6 caratteri.';return;}

  msg.style.color='var(--muted)';msg.textContent='Controllo username...';
  const chk=await checkUsernameAvailable(username);
  if(!chk.ok){msg.style.color='var(--red)';msg.textContent='Errore di rete.';return;}
  if(chk.taken){msg.style.color='var(--red)';msg.textContent='Username già in uso.';return;}

  msg.textContent='Creazione account...';
  const {data,error}=await supabase.auth.signUp({email,password:pwd});
  if(error){msg.style.color='var(--red)';msg.textContent=error.message;return;}
  supaSession=data.session;

  // Create profile in diary_data
  profile={nome,cognome,code:username,role,terapeutaCode:pcode,therapistNotes:{},patientNotes:{}};
  allData={};actTried={};channel=username;
  const payload={
    code:username,
    user_id:data.user.id,
    data:{entries:{},actTried:{},profile:{nome,cognome,role,terapeutaCode:pcode},therapistNotes:{},patientNotes:{},ts:Date.now()},
    updated_at:new Date().toISOString()
  };
  const r=await fetch(SUPA_URL+'/rest/v1/diary_data',{
    method:'POST',
    headers:{...getAuthHeaders(),'Prefer':'resolution=merge-duplicates,return=minimal'},
    body:JSON.stringify(payload)
  });
  if(!r.ok&&r.status!==201){msg.style.color='var(--red)';msg.textContent='Errore salvataggio profilo.';return;}
  svLS();
  msg.style.color='var(--teal)';msg.textContent='✓ Account creato!';
  setTimeout(()=>{enterApp();},400);
}

async function doResetPassword(){
  const email=document.getElementById('ob-email').value.trim();
  const msg=document.getElementById('ob-login-msg');
  if(!email){msg.style.color='var(--red)';msg.textContent='Inserisci prima la tua email.';return;}
  const {error}=await supabase.auth.resetPasswordForEmail(email);
  if(error){msg.style.color='var(--red)';msg.textContent=error.message;return;}
  msg.style.color='var(--teal)';msg.textContent='✓ Email di reset inviata!';
}

async function loadUserData(user){
  const r=await fetch(SUPA_URL+'/rest/v1/diary_data?select=*',{headers:getAuthHeaders()});
  if(!r.ok){
    // Auth error — sign out and show login
    await supabase.auth.signOut();
    showLoginScreen();return;
  }
  const rows=await r.json();
  // Find row matching this specific user by user_id
  let row=rows.find(r=>r.user_id===user.id);
  if(!row){
    // No matching record — could be old account without user_id
    // Sign out and show login so user can re-register or link account
    await supabase.auth.signOut();
    supaSession=null;
    showLoginScreen();
    document.getElementById('ob-login-msg').style.color='var(--amber)';
    document.getElementById('ob-login-msg').textContent='Account non trovato. Registrati o contatta l\'amministratore.';
    return;
  }
  const remote=row.data;
  if(remote&&remote.profile){
    profile={
      nome:remote.profile.nome||'',
      cognome:remote.profile.cognome||'',
      code:row.code,
      role:remote.profile.role||'paziente',
      terapeutaCode:remote.profile.terapeutaCode||null,
      customActs:remote.profile.customActs||[],
      therapistNotes:remote.therapistNotes||{},
      patientNotes:remote.patientNotes||{}
    };
    // Merge remote entries with local — keep most recent by savedAt
    // but always preserve planner and skills from whichever version has them
    const localData=allData||{};
    const remoteEntries=remote.entries||{};
    const merged={...remoteEntries};
    Object.keys(localData).forEach(k=>{
      const loc=localData[k];const rem=remoteEntries[k];
      if(!rem){merged[k]=loc;}
      else{
        const lts=loc.savedAt?new Date(loc.savedAt).getTime():0;
        const rts=rem.savedAt?new Date(rem.savedAt).getTime():0;
        const base=lts>rts?loc:rem;
        const other=lts>rts?rem:loc;
        // Always preserve planner and skills from whichever has them
        merged[k]={...base};
        if(!merged[k].planner&&other.planner)merged[k].planner=other.planner;
        if((!merged[k].skills||!Object.keys(merged[k].skills).length)&&other.skills)merged[k].skills=other.skills;
      }
    });
    allData=merged;
    actTried=remote.actTried||actTried||{};
    channel=row.code;
  }
  svLS();
  // Re-render active page after remote data loads
  setTimeout(()=>{
    const attEl=document.getElementById('page-attivita');
    const guidaEl=document.getElementById('page-guida');
    if(attEl&&attEl.classList.contains('active'))renderPlanner();
    if(guidaEl&&guidaEl.classList.contains('active')){
      const gc=document.getElementById('guida-content');
      if(gc)gc.innerHTML=''; // force re-render
      renderGuide();
    }
  },500);
  enterApp();
}

function showLoginScreen(){
  document.getElementById('onboard').style.display='flex';
  document.getElementById('app').style.display='none';
  setThemeColor('#1A7A6E');
  document.documentElement.classList.add('login-mode');
  document.documentElement.classList.remove('app-mode');
  document.getElementById('ob-login').style.display='block';
  document.getElementById('ob-register').style.display='none';
}

function enterApp(){
  document.getElementById('onboard').style.display='none';
  document.getElementById('app').style.display='flex';
  setThemeColor('#1B4B4A');   // si atterra sulla Home, che ha l'intestazione petrolio
  document.documentElement.classList.remove('login-mode');
  document.documentElement.classList.add('app-mode');
  initApp();
}

async function doLogout(){
  if(confirm('Esci dal profilo?')){
    await supabase.auth.signOut();
    supaSession=null;
    profile={};channel=null;
    svProfile();
    location.reload();
  }
}




// ── Onboarding / role selection ──
// ── ONBOARDING ──
function selectRole(r){
  profile.role=r;
  document.getElementById('rb-paziente').classList.toggle('selected',r==='paziente');
  document.getElementById('rb-terapeuta').classList.toggle('selected',r==='terapeuta');
  // Paziente: show optional therapist username field
  const pwrap=document.getElementById('ob-pcode-wrap');
  if(pwrap)pwrap.style.display=r==='paziente'?'block':'none';
}
function validateUsername(u){
  if(!u)return 'Scegli uno username.';
  if(u.length<3)return 'Minimo 3 caratteri.';
  if(u.length>30)return 'Massimo 30 caratteri.';
  if(!/^[a-z0-9._-]+$/.test(u))return 'Solo lettere minuscole, numeri, punti, trattini.';
  if(/^[._-]/.test(u)||/[._-]$/.test(u))return 'Non può iniziare o finire con punto/trattino.';
  return null;
}

async function checkUsernameAvailable(username){
  try{
    const r=await fetch(SUPA_URL+'/rest/v1/diary_data?code=eq.'+encodeURIComponent(username)+'&select=code',{
      headers:getAuthHeaders()
    });
    if(!r.ok)return {ok:false,error:'Errore di rete: '+r.status};
    const rows=await r.json();
    return {ok:true,taken:rows.length>0};
  }catch(e){return {ok:false,error:'Errore di rete'};}
}

function initApp(){
  if(!profile.nome){
    document.getElementById('onboard').style.display='flex';
    document.getElementById('app').style.display='none';
    return;
  }
  document.getElementById('onboard').style.display='none';
  document.getElementById('app').style.display='flex';
  // sidebar info
  document.getElementById('sidebar-name').textContent=profile.nome+' '+profile.cognome;
  const initials=((profile.nome||'').charAt(0)+(profile.cognome||'').charAt(0)).toUpperCase()||'?';
  const av=document.getElementById('sidebar-avatar');if(av)av.textContent=initials;
  const bnav=document.getElementById('bn-avatar');if(bnav)bnav.textContent=initials;
  const bnu=document.getElementById('bn-username');if(bnu)bnu.textContent=profile.nome||'—';
  document.getElementById('sidebar-role').textContent=profile.role==='terapeuta'?'Terapeuta':'Paziente';

  // ───── THERAPIST MODE: hide patient pages, show only pazienti ─────
  if(profile.role==='terapeuta'){
    // Al terapeuta nascondiamo solo le pagine legate ai SUOI dati personali:
    // diario, storico e pianificazione. Tutto il materiale di consultazione
    // (schede e abilita' DBT) resta accessibile.
    // Diary e Attivita' restano visibili ma in sola lettura (fanno da
    // riferimento): si nascondono solo Home e Storico, che mostrerebbero
    // dati personali inesistenti per il terapeuta.
    // Abilita' esce dal menu: le schede DBT stanno tutte sotto "Schede".
    const HIDE_FOR_TERAP=["'storico'","'attivita'","'abilita'"];
    const keepForTerap = oc => !HIDE_FOR_TERAP.some(p=>oc.includes(p));
    document.querySelectorAll('.ni').forEach(b=>{
      const oc=b.getAttribute('onclick')||'';
      // ripristiniamo esplicitamente le voci permesse: una versione
      // precedente poteva averle nascoste con uno stile sull'elemento
      b.style.display = keepForTerap(oc) ? '' : 'none';
    });
    // Pazienti in cima a entrambi i menu: e' il punto di partenza del lavoro
    ['.ni','.bn-btn'].forEach(sel=>{
      const items=[...document.querySelectorAll(sel)];
      const paz =items.find(b=>(b.getAttribute('onclick')||'').includes("'pazienti'"));
      const home=items.find(b=>(b.getAttribute('onclick')||'').includes("'home'"));
      // subito dopo Home, non in cima al pannello (finiva sopra il titolo)
      if(paz && home && home.parentElement===paz.parentElement) home.after(paz);
    });

    // Le sezioni restano chiuse all'avvio: si aprono al tocco.
    // Ripuliamo solo eventuali forzature lasciate da versioni precedenti.
    document.querySelectorAll('.si-body').forEach(el=>{ el.style.display=''; });
    document.getElementById('ni-pazienti').style.display='flex';
    // Hide bottom nav items, show pazienti
    document.querySelectorAll('.bn-btn').forEach(b=>{
      const oc=b.getAttribute('onclick')||'';
      b.style.display = keepForTerap(oc) ? 'flex' : 'none';
    });
    // Show pazienti in bottom nav (it doesnt exist, need to add)
    // For now just hide topheader and go directly to pazienti
    document.getElementById('topheader').style.display='none';
    setTimeout(()=>goPage('home',null),50);   // si parte dalla panoramica
  } else {
    // Patient mode: show diary
  }

  // settings fields
  document.getElementById('set-nome').value=profile.nome||'';
  document.getElementById('set-cognome').value=profile.cognome||'';
  document.getElementById('set-code').value=profile.code||'';
  if(profile.role==='paziente'){
    document.getElementById('set-tcode-row').style.display='flex';
    const tcInput=document.getElementById('set-tcode-input');
    if(tcInput)tcInput.value=profile.terapeutaCode||'';
  }
  if(settings.notifTime)document.getElementById('notif-time').value=settings.notifTime;
  if(settings.notifOn)document.getElementById('notif-toggle').checked=true;
  if(channel)document.getElementById('sync-desc').textContent='Canale: '+channel;
  // build UI
  buildScales();buildSkills();
  updDL();setForm(allData[dk(cur)]||null);
  // Start on home
  goPage('home',null);
  buildSuggest();
  if(settings.notifOn){
    scheduleNotif();
    checkNotifOnOpen();
  }
  // Ricontrolla ogni volta che l'utente torna sull'app da background
  document.addEventListener('visibilitychange',()=>{
    if(document.visibilityState==='visible'&&settings.notifOn) checkNotifOnOpen();
  });
  buildHome();
  // Auto-pull every 30 seconds if channel is set
  startAutoPull();
}

