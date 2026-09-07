// ── Archiviazione locale separata per utente ─────────────────────────────
// Le schede (PLEASE, diario emozioni, piano di crisi, catena, eventi)
// usavano chiavi generiche: sullo stesso dispositivo un account vedeva
// il contenuto lasciato da un altro. Ora ogni chiave porta il codice utente.
function ukey(name){
  return name + '__' + ((typeof profile!=='undefined' && profile.code) ? profile.code : 'anon');
}
// Una tantum: il contenuto salvato con le vecchie chiavi viene assegnato
// al primo account PAZIENTE che apre l'app, e mai a nessun altro.
(function migrateLegacyKeys(){
  try{
    if(typeof profile==='undefined' || !profile.code) return;
    if(profile.role !== 'paziente') return;
    if(localStorage.getItem('legacy_forms_owner')) return;
    ['diario_emo','piano_crisi','catena_list','ep_selected'].forEach(k=>{
      const old = localStorage.getItem(k);
      if(old !== null && localStorage.getItem(ukey(k)) === null){
        localStorage.setItem(ukey(k), old);
      }
    });
    localStorage.setItem('legacy_forms_owner', profile.code);
  }catch(e){ console.warn('migrazione schede', e); }
})();

// ════════════════════════════════════════════════════════════════
// FORMS — Diario emozioni, piano crisi, catena, eventi piacevoli
// ════════════════════════════════════════════════════════════════
// ── DIARIO EMOZIONI ──
let deIntVal=null;
function deInt(v){
  deIntVal=v;
  document.querySelectorAll('.de-int').forEach(b=>{
    const active=parseInt(b.getAttribute('data-v'))===v;
    b.style.background=active?'#E0567A':'var(--surface-2)';
    b.style.color=active?'#fff':'var(--text)';
    b.style.borderColor=active?'#E0567A':'var(--border)';
  });
}
function deSalva(){
  const entry={
    data:today(),
    emozione:document.getElementById('de-emo').value.trim(),
    intensita:deIntVal,
    evento:document.getElementById('de-evento').value.trim(),
    pensieri:document.getElementById('de-pens').value.trim(),
    messaggio:document.getElementById('de-msg').value.trim(),
    azioni:document.getElementById('de-azioni').value.trim(),
    fatti:document.getElementById('de-fatti').value.trim(),
    diverso:document.getElementById('de-diverso').value.trim(),
    id:Date.now()
  };
  const list=JSON.parse(localStorage.getItem(ukey('diario_emo'))||'[]');
  list.unshift(entry);
  localStorage.setItem(ukey('diario_emo'),JSON.stringify(list));
  deNuovo();
  deRenderLista();
}
function deNuovo(){
  ['de-emo','de-evento','de-pens','de-msg','de-azioni','de-fatti','de-diverso'].forEach(id=>{
    const el=document.getElementById(id);
    if(el)el.value='';
  });
  deIntVal=null;
  document.querySelectorAll('.de-int').forEach(b=>{b.style.background='var(--surface-2)';b.style.color='var(--text)';b.style.borderColor='var(--border)';});
}
function deRenderLista(){
  const el=document.getElementById('de-lista');if(!el)return;
  const list=JSON.parse(localStorage.getItem(ukey('diario_emo'))||'[]');
  if(!list.length){el.innerHTML='';return;}
  el.innerHTML='<div style="font-size:12px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px">Episodi salvati</div>';
  list.slice(0,10).forEach(e=>{
    const d=document.createElement('div');
    d.className='card';d.style.marginBottom='.5rem';
    d.innerHTML=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-size:13px;font-weight:700">${e.emozione||'—'} ${e.intensita!=null?'('+e.intensita+'/5)':''}</span><span style="font-size:11px;color:var(--muted)">${fmtS(e.data)}</span></div><div style="font-size:12px;color:var(--text-2);line-height:1.5">${e.evento||''}</div>`;
    el.appendChild(d);
  });
}

// ── PIANO CRISI ──
function pcCarica(){
  const d=JSON.parse(localStorage.getItem(ukey('piano_crisi'))||'{}');
  ['segnali','a1','a2','a3','a4','p1','p2','p3','numeri','motivi'].forEach(k=>{
    const el=document.getElementById('pc-'+k);
    if(el&&d[k])el.value=d[k];
  });
}
function pcSalva(){
  const d={};
  ['segnali','a1','a2','a3','a4','p1','p2','p3','numeri','motivi'].forEach(k=>{
    const el=document.getElementById('pc-'+k);
    if(el)d[k]=el.value;
  });
  localStorage.setItem(ukey('piano_crisi'),JSON.stringify(d));
  const t=document.getElementById('pc-toast');
  if(t){t.style.display='block';setTimeout(()=>t.style.display='none',2000);}
}

// ── CATENA COMPORTAMENTALE ──
function caSalva(){
  const entry={
    data:today(),
    comportamento:document.getElementById('ca-comp').value.trim(),
    vulnerabilita:document.getElementById('ca-vuln').value.trim(),
    evento:document.getElementById('ca-evento').value.trim(),
    catena:document.getElementById('ca-catena').value.trim(),
    conseguenze:document.getElementById('ca-cons').value.trim(),
    intervento:document.getElementById('ca-inter').value.trim(),
    id:Date.now()
  };
  const list=JSON.parse(localStorage.getItem(ukey('catena_list'))||'[]');
  list.unshift(entry);
  localStorage.setItem(ukey('catena_list'),JSON.stringify(list));
  caNuovo();
  caRenderLista();
}
function caNuovo(){
  ['ca-comp','ca-vuln','ca-evento','ca-catena','ca-cons','ca-inter'].forEach(id=>{
    const el=document.getElementById(id);if(el)el.value='';
  });
}
function caRenderLista(){
  const el=document.getElementById('ca-lista');if(!el)return;
  const list=JSON.parse(localStorage.getItem(ukey('catena_list'))||'[]');
  if(!list.length){el.innerHTML='';return;}
  el.innerHTML='<div style="font-size:12px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:10px">Analisi salvate</div>';
  list.slice(0,5).forEach(e=>{
    const d=document.createElement('div');
    d.className='card';d.style.marginBottom='.5rem';
    d.innerHTML=`<div style="display:flex;justify-content:space-between;margin-bottom:6px"><span style="font-size:13px;font-weight:700">${e.comportamento||'—'}</span><span style="font-size:11px;color:var(--muted)">${fmtS(e.data)}</span></div><div style="font-size:12px;color:var(--text-2)">${e.evento||''}</div>`;
    el.appendChild(d);
  });
}

// ── EVENTI PIACEVOLI ──
const EP_LIST=['Andare al cinema','Correre o camminare','Ascoltare musica','Passare una serata con amici','Cucinare','Fare esercizio fisico','Leggere','Fare escursionismo','Dipingere o disegnare','Fare yoga o meditazione','Andare in bicicletta','Ballare','Suonare uno strumento','Scrivere (diario, poesie)','Fare un bagno rilassante','Andare in spiaggia','Guardare un film','Pranzare fuori','Fare fotografie','Viaggiare','Giocare con un animale','Comprare qualcosa per te','Fare un massaggio','Visitare un museo','Stare in natura','Curare le piante','Cantare','Fare artigianato','Fare un picnic','Accendere candele','Guardare le stelle','Meditare','Dormire quanto ti serve','Farsi la manicure','Preparare una ricetta nuova','Guardare una serie TV','Chiamare una persona cara','Scrivere lettere o messaggi belli','Fare puzzle','Andare a un concerto'];

function epRender(){
  const el=document.getElementById('ep-lista');if(!el)return;
  const saved=JSON.parse(localStorage.getItem(ukey('ep_selected'))||'[]');
  el.innerHTML='';
  EP_LIST.forEach((item,i)=>{
    const selected=saved.includes(item);
    const chip=document.createElement('button');
    chip.style.cssText=`padding:8px 14px;border-radius:20px;border:1.5px solid ${selected?'var(--teal)':'var(--border)'};background:${selected?'var(--teal-ll)':'var(--surface-2)'};color:${selected?'var(--teal-d)':'var(--text)'};font-size:13px;cursor:pointer;font-family:var(--font-ui);font-weight:${selected?'600':'400'}`;
    chip.textContent=item;
    chip.onclick=()=>{
      const cur=JSON.parse(localStorage.getItem(ukey('ep_selected'))||'[]');
      const idx=cur.indexOf(item);
      if(idx>=0)cur.splice(idx,1);else cur.push(item);
      localStorage.setItem(ukey('ep_selected'),JSON.stringify(cur));
      epRender();
    };
    el.appendChild(chip);
  });
}
function epSalva(){
  const selected=JSON.parse(localStorage.getItem(ukey('ep_selected'))||'[]');
  if(!selected.length){alert('Seleziona almeno una attività prima di salvare.');return;}
  const custom=getCustomActs();
  let added=0;
  selected.forEach(item=>{if(!custom.includes(item)){custom.push(item);added++;}});
  saveCustomActs(custom);
  const t=document.getElementById('ep-toast');
  if(t){t.style.display='block';t.textContent='✓ '+added+' attività aggiunte alle tue preferite';setTimeout(()=>t.style.display='none',2500);}
}


function sessRender(){
  const el=document.getElementById('sess-lista');if(!el)return;
  const key='sess_'+currentPatient?.code;
  const list=JSON.parse(localStorage.getItem(ukey(key))||'[]');
  el.innerHTML='';
  if(!list.length){el.innerHTML='<div style="color:var(--muted);font-size:13px;padding:1rem">Nessuna nota ancora.</div>';return;}
  list.slice().reverse().forEach(s=>{
    const d=document.createElement('div');
    d.className='card';d.style.marginBottom='.5rem';
    d.innerHTML=`<div style="font-size:12px;color:var(--muted);margin-bottom:6px">${s.data||''}</div>`+
      (s.temi?`<div style="font-size:13px;margin-bottom:4px"><b>Temi:</b> ${s.temi}</div>`:'')+ 
      (s.abilita?`<div style="font-size:13px;margin-bottom:4px"><b>Abilità:</b> ${s.abilita}</div>`:'')+ 
      (s.note?`<div style="font-size:13px;color:var(--text-2)">${s.note}</div>`:'');
    el.appendChild(d);
  });
}
function sessInit(){const d=document.getElementById('sess-data');if(d&&!d.value)d.value=today();}
function sessAdd(){
  if(!currentPatient)return;
  const entry={
    data:document.getElementById('sess-data').value||today(),
    temi:document.getElementById('sess-temi').value.trim(),
    abilita:document.getElementById('sess-abilita').value.trim(),
    note:document.getElementById('sess-note').value.trim(),
    id:Date.now()
  };
  const key='sess_'+currentPatient.code;
  const list=JSON.parse(localStorage.getItem(ukey(key))||'[]');
  list.push(entry);
  localStorage.setItem(ukey(key),JSON.stringify(list));
  ['sess-temi','sess-abilita','sess-note'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  sessRender();
}


function setTheme(mode){
  localStorage.setItem('theme',mode);
  applyTheme(mode);
  document.querySelectorAll('#theme-light,#theme-dark,#theme-auto').forEach(b=>{
    b.style.background='var(--surface-2)';
    b.style.borderColor='var(--border)';
    b.style.fontWeight='400';
  });
  const active=document.getElementById('theme-'+mode);
  if(active){active.style.background='var(--teal)';active.style.borderColor='var(--teal)';active.style.color='#fff';active.style.fontWeight='600';}
}
function applyTheme(mode){
  const dark=mode==='dark'||(mode==='auto'&&window.matchMedia('(prefers-color-scheme:dark)').matches);
  document.documentElement.setAttribute('data-theme',dark?'dark':'light');
}
function initTheme(){
  const mode=localStorage.getItem('theme')||'auto';
  applyTheme(mode);
  // Update button states after DOM ready
  setTimeout(()=>setTheme(mode),100);
}
// Listen to system preference changes
window.matchMedia('(prefers-color-scheme:dark)').addEventListener('change',()=>{
  if(localStorage.getItem('theme')==='auto')applyTheme('auto');
});

