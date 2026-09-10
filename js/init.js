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





// ── THEME COLOR helper ────────────────────────────────────────────────────
function setThemeColor(color){
  let m = document.querySelector('meta[name="theme-color"]');
  if(m) m.content = color;
}


// ── Data di oggi nelle intestazioni verdi delle pagine desktop ──────────
document.addEventListener('DOMContentLoaded', function(){
  const testo = new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
  document.querySelectorAll('.dc-data-oggi').forEach(function(el){ el.textContent = testo; });
});
