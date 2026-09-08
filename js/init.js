// ════════════════════════════════════════════════════════════════
// INIT — Inizializzazione app, SW, pull-to-refresh, UI helpers
// ════════════════════════════════════════════════════════════════
// ── INIT ──
ldLS();
initTheme();

// Listen for auth state changes
supabase.auth.onAuthStateChange((event,session)=>{
  supaSession=session;
});

// Check existing session
supabase.auth.getSession().then(({data:{session}})=>{
  supaSession=session;
  if(session){
    loadUserData(session.user);
  } else {
    showLoginScreen();
    selectRole('paziente');
  }
});

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{navigator.serviceWorker.register('sw.js').catch(()=>{})});
}

// ── USER MENU ──
function openUserMenu(){
  const name=(profile.nome||'')+(profile.cognome?' '+profile.cognome:'');
  document.getElementById('umenu-name').textContent=name||'—';
  document.getElementById('umenu-role').textContent=profile.role==='terapeuta'?'Terapeuta':'Paziente';
  document.getElementById('user-menu-overlay').classList.add('open');
  setTimeout(()=>document.getElementById('user-menu-sheet').classList.add('open'),10);
}
function closeUserMenu(){
  document.getElementById('user-menu-sheet').classList.remove('open');
  setTimeout(()=>document.getElementById('user-menu-overlay').classList.remove('open'),260);
}

// ── STORICO TABS ──
function switchStoricoTab(tab){
  document.getElementById('storico-panel').style.display=tab==='storico'?'':'none';
  document.getElementById('trend-panel').style.display=tab==='trend'?'':'none';
  // I due selettori di periodo ora stanno prima delle linguette, come nel
  // prototipo: si mostra solo quello del pannello attivo.
  document.getElementById('storico-range').style.display=tab==='storico'?'':'none';
  document.getElementById('trend-range').style.display=tab==='trend'?'':'none';
  document.getElementById('stab-storico').className='storico-tab'+(tab==='storico'?' active':'');
  document.getElementById('stab-trend').className='storico-tab'+(tab==='trend'?' active':'');
  if(tab==='trend') renderTrend();
}

// ── SIDEBAR COLLAPSIBLE ──
function toggleSiSection(id,hdr){
  const body=document.getElementById(id);
  const arrow=hdr.querySelector('.si-arrow');
  const isOpen=body.classList.contains('open');
  body.classList.toggle('open',!isOpen);
  if(arrow)arrow.style.transform=isOpen?'':'rotate(180deg)';
}




// ── THEME COLOR helper ────────────────────────────────────────────────────
function setThemeColor(color){
  let m = document.querySelector('meta[name="theme-color"]');
  if(m) m.content = color;
}

