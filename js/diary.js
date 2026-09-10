// Riporta la pagina in cima. Su iOS la posizione puo' essere ripristinata
// in modo asincrono dopo il cambio pagina, quindi insistiamo su piu' fronti
// e in piu' momenti.
function scrollPageTop(){
  const els = [document.scrollingElement, document.documentElement, document.body,
               document.querySelector('.main'), document.getElementById('app')];
  els.forEach(el => { if(el && el.scrollTop) el.scrollTop = 0; });
  window.scrollTo(0,0);
}

// ════════════════════════════════════════════════════════════════
// DIARY — Scale, toggle, form, salvataggio
// ════════════════════════════════════════════════════════════════
// ── SCALES / TOGGLES ──
function sel(b,on){
  if(on){b.classList.add('on');b.style.background='var(--dc-hero)';b.style.borderColor='var(--dc-hero)';b.style.color='var(--dc-hero-ink)';}
  else{b.classList.remove('on');b.style.background='';b.style.borderColor='';b.style.color='';}
}
function mkScale(id,max){
  const el=document.getElementById('s-'+id);if(!el)return;el.innerHTML='';
  for(let i=0;i<=max;i++){const b=document.createElement('button');b.className='sb';b.textContent=i;b.onclick=()=>{el.querySelectorAll('.sb').forEach(x=>sel(x,false));sel(b,true)};el.appendChild(b)}
}
function mkScaleRap(){
  const el=document.getElementById('s-rap');if(!el)return;el.innerHTML='';
  for(let i=0;i<=5;i++){const b=document.createElement('button');b.className='sb';b.textContent=i===5?'5+':i;b.dataset.v=i;b.onclick=()=>{el.querySelectorAll('.sb').forEach(x=>sel(x,false));sel(b,true)};el.appendChild(b)}
}
function mkToggle(id){
  const el=document.getElementById('t-'+id);if(!el)return;el.innerHTML='';
  ['Sì','No'].forEach(v=>{const b=document.createElement('button');b.className='tb';b.textContent=v;b.dataset.v=v;b.onclick=()=>{el.querySelectorAll('.tb').forEach(x=>sel(x,false));sel(b,true)};el.appendChild(b)});
}
function buildScales(){
  S5.concat(SCBDI).forEach(id=>mkScale(id,5));
  TG.forEach(id=>mkToggle(id));
  mkScaleRap();
}
function mkSkills(){
  const c=document.getElementById('skwrap');if(!c)return;
  const oggi=today();
  const d=allData[oggi]||{};
  let out='';
  let totale=0, fatte=0;
  SKG.forEach(g=>{
    const icona=(typeof GRUPPO_ICONA!=='undefined'&&GRUPPO_ICONA[g.g])||'strumenti-generali';
    let righe='';
    g.it.forEach(item=>{
      totale++;
      const sid='sk_'+g.g+'_'+item;
      const on=!!(d.skills&&d.skills[sid]);
      if(on) fatte++;
      const tick=on?'<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 7L5 10L11 3" stroke="#14201F" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>':'';
      righe+='<button onclick="toggleSkillMobile(\''+sid+'\')" style="display:flex;align-items:center;gap:14px;padding:13px 0;cursor:pointer;border:0;background:transparent;width:100%;text-align:left">'
        +'<span style="width:24px;height:24px;border-radius:8px;flex:none;display:flex;align-items:center;justify-content:center;background:'+(on?'var(--dc-senape)':'var(--dc-cella)')+'">'+tick+'</span>'
        +'<span style="font-size:15px;font-weight:'+(on?600:500)+';color:var(--dc-ink)">'+item+'</span>'
      +'</button>';
    });
    out += '<div style="display:flex;flex-direction:column;gap:10px;margin-bottom:22px">'
      +'<div style="display:flex;align-items:center;gap:12px">'
        +'<img src="illustrazioni/miniature/'+icona+'.svg" width="34" height="34" style="border-radius:12px;flex:none" alt="">'
        +'<span style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--dc-terra)">'+g.g+'</span>'
      +'</div>'
      +'<div class="card" style="padding:8px 18px">'+righe+'</div>'
    +'</div>';
  });
  c.innerHTML=out;
  const conta=document.getElementById('ski-conta');
  if(conta) conta.textContent=fatte+' su '+totale+' spuntate oggi';
}
function toggleSkillMobile(sid){
  const oggi=today();
  if(!allData[oggi]) allData[oggi]={scales:{},toggles:{},texts:{}};
  if(!allData[oggi].skills) allData[oggi].skills={};
  allData[oggi].skills[sid]=!allData[oggi].skills[sid];
  svLS(); if(typeof pushChan==='function')pushChan();
  mkSkills();
}

function buildSkills(){mkSkills()}

// ── FORM GET/SET ──
function getForm(){
  const d={scales:{},toggles:{},texts:{},skills:{}};
  S5.concat(SCBDI).forEach(id=>{const s=document.querySelector('#s-'+id+' .sb.on');d.scales[id]=s?+s.textContent:null});
  const rapBtn=document.querySelector('#s-rap .sb.on');d.scales['rap']=rapBtn?+rapBtn.dataset.v:null;
  TG.forEach(id=>{const s=document.querySelector('#t-'+id+' .tb.on');d.toggles[id]=s?s.dataset.v:null});
  TX.forEach(id=>{const el=document.getElementById('tx-'+id);d.texts[id]=el?el.value:''});
  TX_INPUT.forEach(id=>{const el=document.getElementById('tx-'+id);if(el)d.texts[id]=el.value});
  document.querySelectorAll('.sk-chip.on').forEach(b=>{d.skills[b.dataset.sk]=true});
  return d;
}
function setForm(data){
  clearForm();if(!data)return;
  S5.concat(SCBDI).forEach(id=>{if(data.scales&&data.scales[id]!=null)document.querySelectorAll('#s-'+id+' .sb').forEach(b=>{if(+b.textContent===data.scales[id])sel(b,true)})});
  if(data.scales&&data.scales.rap!=null)document.querySelectorAll('#s-rap .sb').forEach(b=>{if(+b.dataset.v===data.scales.rap)sel(b,true)});
  TG.forEach(id=>{if(data.toggles&&data.toggles[id])document.querySelectorAll('#t-'+id+' .tb').forEach(b=>{if(b.dataset.v===data.toggles[id])sel(b,true)})});
  TX.concat(TX_INPUT).forEach(id=>{const el=document.getElementById('tx-'+id);if(el)el.value=data.texts&&data.texts[id]?data.texts[id]:''});
  document.querySelectorAll('.sk-chip').forEach(b=>{if(data.skills&&data.skills[b.dataset.sk])sel(b,true)});
}
function clearForm(){
  document.querySelectorAll('.sb,.tb,.sk-chip').forEach(b=>sel(b,false));
  TX.concat(TX_INPUT).forEach(id=>{const el=document.getElementById('tx-'+id);if(el)el.value=''});
}

// ── SAVE / NAV ──
async function saveDay(){
  const key=dk(cur);
  const existing=allData[key]||{};
  const currentData=getForm();
  const hasData=Object.values(currentData.scales||{}).some(v=>v!=null)
    ||Object.values(currentData.toggles||{}).some(v=>v!=null)
    ||Object.values(currentData.texts||{}).some(v=>v&&v.trim())
    ||Object.keys(currentData.skills||{}).length>0;
  if(!hasData&&Object.keys(existing).length>0){
    showToast('t1');showToast('t2');
    return;
  }
  allData[key]={...existing,...currentData};
  if(existing.planner)allData[key].planner=existing.planner;
  allData[key].savedAt=new Date().toISOString();
  svLS();updPill(key);showToast('t1');showToast('t2');
  if(channel)await pushChan();
}
function showToast(id){
  const t=document.getElementById(id);if(!t)return;
  t.classList.add('show');
  clearTimeout(t._nascondi);
  t._nascondi = setTimeout(()=>t.classList.remove('show'), 2200);
}

function chDay(d){
  // Only auto-save if on diary page to avoid overwriting data from abilita navigation
  const onOggi=document.getElementById('page-oggi')?.classList.contains('active');
  if(onOggi){
    const currentData=getForm();
    const hasData=Object.values(currentData.scales||{}).some(v=>v!=null)
      ||Object.values(currentData.toggles||{}).some(v=>v!=null)
      ||Object.values(currentData.texts||{}).some(v=>v&&v.trim())
      ||Object.keys(currentData.skills||{}).length>0;
    if(hasData){
      const key=dk(cur);
      const existing=allData[key]||{};
      allData[key]={...existing,...currentData};
      if(existing.planner)allData[key].planner=existing.planner;
      allData[key].savedAt=new Date().toISOString();
      svLS();updPill(key);
    }
  }
  const nd=new Date(cur);nd.setDate(nd.getDate()+d);if(isFut(nd))return;
  cur=nd;updDL();setForm(allData[dk(cur)]||null);
  // chDay (le freccette) e dcDiary (titolo "Oggi"/"Ieri" e striscia dei
  // giorni) sono due funzioni nate in momenti diversi: la prima non
  // chiamava mai la seconda, quindi il titolo restava fermo su "Oggi"
  // qualunque giorno si selezionasse con le frecce.
  if(typeof dcDiary==='function') dcDiary();
  if(document.getElementById('page-abilita')?.classList.contains('active')){updAbiPill();renderActTab();}
}
function updDL(){
  const k=dk(cur);
  document.getElementById('dlabel').textContent=fmtL(cur);
  document.getElementById('dsub').textContent=k===today()?'':k;
  document.getElementById('nxtBtn').disabled=isFut(new Date(cur.getTime()+86400000));
  updPill(k);
}
function updPill(k){
  const p=document.getElementById('dayPill');
  if(allData[k]&&!isDayEmpty(allData[k])){p.className='pill saved';p.textContent='✓ Compilata';}
  else{p.className='pill unsaved';p.textContent='Non compilata';}
}

function goPage(name,btn){
  document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.ni,.bn-btn').forEach(b=>b.classList.remove('active'));
  document.getElementById('page-'+name).classList.add('active');
  if(btn)btn.classList.add('active');
  const bnb=document.getElementById('bn-'+name);if(bnb)bnb.classList.add('active');
  const nib=document.querySelector('.ni[onclick*="\''+name+'\'"]');if(nib)nib.classList.add('active');
  // hide topheader on settings, pazienti
  // topheader visibility handled above per page
  scrollPageTop();   // subito in cima, prima di popolare la pagina
  if(name==='oggi'){setForm(allData[dk(cur)]||null);updDL();if(typeof dcDiary==='function')dcDiary();}

  // La barra superiore ha senso solo dove esiste una barra data da mostrare
  // memoria della pagina da cui si arriva, per il tasto Indietro
  if(window._curPage && window._curPage!==name) window._prevPage=window._curPage;
  if(name==='strumenti') name='guida';   // pagina rimossa: si va alla Guida
  window._curPage=name;
  document.body.dataset.pagina = name;
  // il colore della fascia di sistema segue lo sfondo di <html>,
  // non del body: la marcatura serve li'
  document.documentElement.dataset.pagina = name;
  // iOS colora la fascia dell'orologio con theme-color: sulla Home il
  // blocco petrolio arriva fin lassu', quindi la fascia deve essere verde.
  // In standalone iOS la fascia di sistema usa il colore fissato
  // all'installazione: cambiarla a ogni pagina non ha effetto, quindi
  // resta petrolio ovunque (coerente con l'intestazione della Home).
  if(typeof setThemeColor==='function') setThemeColor('#1B4B4A');

  const showTopheader=false; // .topheader e' display:none per sempre in dc.css: nessuna pagina deve piu' riservare i 74px per lui
  // Al terapeuta la barra dei giorni non serve: consulta, non compila.
  const terap = (typeof profile!=='undefined' && profile.role==='terapeuta');
  document.getElementById('topheader').style.display=(showTopheader && !terap)?'':'none';
  if(terap) document.body.classList.add('no-topheader');
  document.body.classList.toggle('no-topheader',!showTopheader);
  document.getElementById('datebar-diary').style.display=name==='oggi'?'flex':'none';
  document.getElementById('datebar-plan').style.display=name==='attivita'?'flex':'none';
  document.getElementById('datebar-abi').style.display=name==='abilita'?'flex':'none';
  // hide sidebar header on guida
  const sidebarEl=document.getElementById('sidebar');
  if(sidebarEl)sidebarEl.style.display=name==='guida'?'none':'';
  if(name==='home')buildHome();
  if(name==='storico'){renderHist();switchStoricoTab('storico');if(typeof renderDesktopStorico==='function'){try{renderDesktopStorico();}catch(e){const bx=document.getElementById('desktop-storico');if(bx)bx.innerHTML='<div style="background:#F7E7DC;color:#C1714A;padding:16px;border-radius:16px;font-size:12px;white-space:pre-wrap">ERRORE renderDesktopStorico: '+e.message+'\n'+e.stack+'</div>';}}}
  if(name==='abilita'){updDL();updAbiPill();renderActTab();mkSkills();if(typeof renderDesktopAbilita==='function')renderDesktopAbilita();}
  if(name==='attivita'){buildSuggest();curPlan=new Date();plannerData={mattina:[],pomeriggio:[],sera:[]};updPlanDL();renderPlanner();}
  if(name==='pazienti')renderPatients();
  if(name==='please'){renderPlease();}
  if(name==='diarioemo'){deRenderLista();}
  if(name==='pianocrisi'){pcCarica();}
  if(name==='catena'){caRenderLista();}
  if(name==='eventi'){epRender();}
  if(name==='guida'){setTimeout(()=>{
    try{renderGuide();}catch(e){document.getElementById('guida-content').innerHTML='<div style="background:#F7E7DC;color:#C1714A;padding:16px;border-radius:16px;font-size:12px;white-space:pre-wrap">ERRORE renderGuide: '+e.message+'\n'+e.stack+'</div>';}
    try{renderEmozioni();}catch(e){document.getElementById('emozioni-content').innerHTML='<div style="background:#F7E7DC;color:#C1714A;padding:16px;border-radius:16px;font-size:12px;white-space:pre-wrap">ERRORE renderEmozioni: '+e.message+'\n'+e.stack+'</div>';}
  },50);}
  if(name==='fogli'){setTimeout(()=>{
    try{renderFogli();}catch(e){document.getElementById('fogli-content').innerHTML='<div style="background:#F7E7DC;color:#C1714A;padding:16px;border-radius:16px;font-size:12px;white-space:pre-wrap">ERRORE renderFogli: '+e.message+'\n'+e.stack+'</div>';}
  },50);}
  if(name==='emozioni-lista'){setTimeout(()=>{
    try{renderEmozioni();}catch(e){document.getElementById('emozioni-content').innerHTML='<div style="background:#F7E7DC;color:#C1714A;padding:16px;border-radius:16px;font-size:12px;white-space:pre-wrap">ERRORE renderEmozioni: '+e.message+'\n'+e.stack+'</div>';}
  },50);}
  if(name==='dearman'){/* nothing needed */}

  // I renderer sopra cambiano l'altezza della pagina, e iOS puo' ripristinare
  // la posizione precedente subito dopo: riallineiamo a rendering concluso e
  // ancora poco dopo.
  requestAnimationFrame(scrollPageTop);
  setTimeout(scrollPageTop, 80);
  setTimeout(scrollPageTop, 250);

  // dopo il rendering: se e' il terapeuta, la pagina diventa consultabile
  setTimeout(()=>applyReadOnlyForTerapeuta(name), 60);
}





// Doppio tocco su Home = ricarica l'app (prende il codice aggiornato).
// Un tocco solo si comporta come sempre: porta alla Home.
let _homeTapAt = 0;
function tapHome(el){
  const now = Date.now();
  if(now - _homeTapAt < 600){
    _homeTapAt = 0;
    // freccina che ruota al posto del pallino sotto "Home", non un
    // avviso di testo che galleggia sopra il resto della pagina
    const btn = document.getElementById('bn-home');
    if(btn){
      btn.classList.add('caricando');
      const ico = btn.querySelector('.bn-icon');
      if(ico) ico.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none">'
        +'<path d="M12.5 7A5.5 5.5 0 1 1 9.9 2.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'
        +'<path d="M12.5 2.5v3.2h-3.2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>'
        +'</svg>';
    }
    setTimeout(()=>window.location.reload(), 480);
    return;
  }
  _homeTapAt = now;
  goPage('home', el);
}


// ── SOLA CONSULTAZIONE PER IL TERAPEUTA ──────────────────────────────────
// Le schede e le abilita' sono materiale di riferimento: il terapeuta le
// legge, non le compila. I suoi dati non finirebbero da nessuna parte utile.
const PAGINE_CONSULTAZIONE = ['please','diarioemo','pianocrisi','catena','eventi',
                              'dearman','give','fast','abc','sentiero','guida','abilita','oggi','fatti','procontro'];

function applyReadOnlyForTerapeuta(name){
  if(typeof profile==='undefined' || profile.role!=='terapeuta') return;
  if(!PAGINE_CONSULTAZIONE.includes(name)) return;
  const page = document.getElementById('page-'+name);
  if(!page) return;

  page.classList.add('readonly-mode');

  // campi non modificabili
  page.querySelectorAll('input,textarea,select').forEach(el=>{
    if(el.type==='checkbox'||el.type==='radio') el.disabled=true;
    else el.readOnly=true;
  });

  // Tutto cio' che e' cliccabile viene neutralizzato, tranne la navigazione:
  // le caselle di PLEASE e le voci delle attivita' piacevoli non sono campi
  // ma elementi con un onclick, quindi non bastava disabilitare i campi.
  const isNav = oc => /gopage|goback|openscheda|closescheda|togglesisection|switchpattab|toggleguide|toggleguidemodule|toggleguideskill|togglesk|apri|open/.test(oc);
  const scrive = txt => /salva|aggiungi|genera|elimina|rimuovi|nuovo|nuova|azzera|reset|segna|svuota/.test(txt);

  // I comandi del Diary agganciano l'azione con b.onclick=... da codice,
  // quindi non hanno l'attributo onclick nel markup: cercarlo non bastava.
  // Marchiamo solo la navigazione e lascia che sia il CSS a disattivare
  // tutto il resto, indipendentemente da come e' agganciato il gestore.
  page.querySelectorAll('[onclick]').forEach(el=>{
    const oc=(el.getAttribute('onclick')||'').toLowerCase();
    if(isNav(oc)) el.setAttribute('data-nav','');
  });
  // i collegamenti ai fogli di lavoro si marcano da soli alla creazione:
  // qui garantiamo che restino attivi anche se generati dopo
  page.querySelectorAll('.guide-scheda-link,.guide-module-header,.guide-skill-header')
      .forEach(el=>el.setAttribute('data-nav',''));
  page.querySelectorAll('button').forEach(b=>{
    if(b.hasAttribute('data-nav')) return;
    const txt=(b.textContent||'').toLowerCase();
    if(scrive(txt)) b.style.display='none';     // comandi che scrivono: via
  });

  if(!page.querySelector('.readonly-note')){
    const n=document.createElement('div');
    n.className='readonly-note';
    n.textContent='Sola consultazione — in modalità terapeuta queste schede non si compilano.';
    const hero=page.querySelector('.page-hero,.dc-desk-hero');
    if(hero && hero.nextSibling) page.insertBefore(n, hero.nextSibling);
    else page.insertBefore(n, page.firstChild);
  }
}


// ── SCHEDE A COMPARSA ────────────────────────────────────────────────────
// La pagina vera viene spostata dentro il riquadro (non copiata): così
// identificativi, campi e gestori restano quelli originali e continuano a
// funzionare. Alla chiusura torna al suo posto.
const SCHEDA_TITOLI = {
  dearman:'Copione DEAR MAN', give:'Relazione — GIVE', fast:'Rispetto di sé — FAST',
  abc:'ABC — Costruisci emozioni positive', sentiero:'Sentiero di mezzo',
  please:'Checklist PLEASE', diarioemo:'Diario delle emozioni',
  fatti:'Controlla i fatti', procontro:"Pro e contro dell'usare le abilità",
  pianocrisi:'Piano di crisi', catena:'Analisi della catena',
  eventi:'La mia lista piacevole'
};
const SCHEDA_RENDER = {
  please:()=>typeof renderPlease==='function'&&renderPlease(),
  diarioemo:()=>typeof deRenderLista==='function'&&deRenderLista(),
  pianocrisi:()=>typeof pcCarica==='function'&&pcCarica(),
  catena:()=>typeof caRenderLista==='function'&&caRenderLista(),
  eventi:()=>typeof epRender==='function'&&epRender(),
  fatti:()=>typeof cfRenderLista==='function'&&cfRenderLista(),
  procontro:()=>typeof pcbRenderLista==='function'&&pcbRenderLista()
};
let _schedaAperta=null;

function openScheda(name){
  const page=document.getElementById('page-'+name);
  const modal=document.getElementById('scheda-modal');
  const body=document.getElementById('scheda-body');
  if(!page||!modal||!body) return;
  if(_schedaAperta) closeScheda();

  page.dataset.homeParent = page.parentElement.id || '';
  page._segnaposto = document.createComment('scheda '+name);
  page.parentElement.insertBefore(page._segnaposto, page);

  body.appendChild(page);
  page.classList.add('active');
  page.style.display='block';
  document.getElementById('scheda-title').textContent = SCHEDA_TITOLI[name] || '';
  modal.classList.add('open');
  document.body.style.overflow='hidden';
  _schedaAperta=name;

  if(SCHEDA_RENDER[name]) setTimeout(SCHEDA_RENDER[name],30);
  setTimeout(()=>{ body.scrollTop=0; },20);
  if(typeof applyReadOnlyForTerapeuta==='function') setTimeout(()=>applyReadOnlyForTerapeuta(name),60);
}

function closeScheda(){
  const modal=document.getElementById('scheda-modal');
  if(!_schedaAperta){
    // Pannelli aperti a mano (piano di crisi, dettaglio giornata, fogli
    // della terapeuta) non impostano _schedaAperta: il ritorno anticipato
    // qui saltava sempre il ripristino dello scorrimento sotto.
    if(modal) modal.classList.remove('open');
    document.body.style.overflow='';
    return;
  }
  const page=document.getElementById('page-'+_schedaAperta);
  if(page && page._segnaposto && page._segnaposto.parentElement){
    page._segnaposto.parentElement.insertBefore(page, page._segnaposto);
    page._segnaposto.remove();
    page._segnaposto=null;
  }
  if(page){ page.classList.remove('active'); page.style.display='none'; }
  modal.classList.remove('open');
  document.body.style.overflow='';
  _schedaAperta=null;
}

// chiusura toccando fuori o con Esc
document.addEventListener('click', e=>{
  if(e.target && e.target.id==='scheda-modal') closeScheda();
});
document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeScheda(); });


// ════════════════════════════════════════════════════════════════
// DIARY — striscia dei giorni e passi, come nel prototipo
// Le quattro schede esistenti diventano i quattro passi.
// ════════════════════════════════════════════════════════════════
let dcPasso = 0;
const DC_PASSI = ['Comportamenti', 'Sostanze e impulsi', 'Emozioni', 'Terapia e attività'];

function dcSchede(){
  const pag = document.getElementById('page-oggi');
  return pag ? [...pag.querySelectorAll(':scope > .card')] : [];
}

function dcVaiPasso(n){
  const schede = dcSchede();
  if(!schede.length) return;
  dcPasso = Math.max(0, Math.min(schede.length-1, n));
  schede.forEach((c,idx)=>{
    c.classList.toggle('dc-passo-off', idx!==dcPasso);
    const etichetta = c.previousElementSibling;
    if(etichetta && etichetta.classList.contains('dc-kicker-diary')){
      etichetta.classList.toggle('dc-passo-off', idx!==dcPasso);
    }
  });

  const barra = document.getElementById('dc-passi');
  if(barra){
    barra.innerHTML = schede.map((_,idx)=>
      '<span class="dc-passo'+(idx===dcPasso?' on':(idx<dcPasso?' fatto':''))+'" onclick="dcVaiPasso('+idx+')"></span>'
    ).join('');
  }
  const tit = document.getElementById('dc-passo-tit');
  const conta = document.getElementById('dc-passo-conta');
  if(tit) tit.textContent = DC_PASSI[dcPasso] || '';
  if(conta) conta.textContent = (dcPasso+1)+' di '+schede.length;

  // Il pulsante principale cambia etichetta e azione da solo, come nel
  // prototipo: "Avanti" sui primi passi, "Salva giornata" sull'ultimo -
  // non due gruppi di pulsanti separati che si scambiano di posto.
  const ultimoPasso = dcPasso === schede.length - 1;
  const cta = document.getElementById('dc-cta-passo');
  if(cta) cta.textContent = (window.innerWidth>=701 || ultimoPasso) ? '⤓ Salva giornata' : 'Avanti';
  const indietro = document.getElementById('dc-indietro');
  if(indietro){ indietro.disabled = dcPasso === 0; indietro.classList.toggle('spenta', dcPasso === 0); }
  window.scrollTo(0,0);
}

function dcStriscia(){
  const el = document.getElementById('dc-strip');
  if(!el) return;
  let out = '';
  const nGiorni = window.innerWidth>=701 ? 16 : 10;
  for(let i=nGiorni-1;i>=0;i--){
    const gg = new Date(); gg.setDate(gg.getDate()-i);
    const k = dk(gg);
    const voce = allData[k];
    const piena = voce && !isDayEmpty(voce);
    const sel = k === dk(cur);
    const dow = ['dom','lun','mar','mer','gio','ven','sab'][gg.getDay()];
    out += '<button class="dc-giorno'+(sel?' sel':'')+'" onclick="goDay(\''+k+'\')">'
        +  '<span class="dc-giorno-dow">'+dow+'</span>'
        +  '<span class="dc-giorno-num">'+gg.getDate()+'</span>'
        +  '<span class="dc-giorno-dot'+(piena?' piena':'')+'"></span>'
        +  '</button>';
  }
  el.innerHTML = out;
  const attivo = el.querySelector('.dc-giorno.sel');
  if(attivo) attivo.scrollIntoView({inline:'center', block:'nearest'});
}

function goDay(k){
  // Prima spostava una variabile 'curDay' separata da 'cur': il titolo
  // cambiava ma i dati mostrati restavano quelli del giorno precedente,
  // perche' salvataggio e caricamento leggono solo 'cur'.
  cur = new Date(k);
  setForm(allData[dk(cur)]||null);
  if(typeof updDL==='function') updDL();
  dcDiary();
}

function dcDiary(){
  const t = document.getElementById('dc-giorno-tit');
  const d = document.getElementById('dc-giorno-data');
  const gg = cur;   // 'cur' e' l'unica variabile del giorno corrente: la usano anche salvataggio e caricamento
  const oggiQ = dk(gg) === today();
  const ieriD = new Date(); ieriD.setDate(ieriD.getDate()-1);
  if(t) t.textContent = 'Diary di ' + (oggiQ ? 'oggi' : (dk(gg)===dk(ieriD) ? 'ieri' : gg.toLocaleDateString('it-IT',{weekday:'long'})));
  if(d) d.textContent = gg.toLocaleDateString('it-IT',{day:'numeric',month:'long',year:'numeric'});
  const succ = document.getElementById('dc-succ');
  if(succ){ succ.disabled = oggiQ; succ.classList.toggle('spenta', oggiQ); }
  dcStriscia();
  dcVaiPasso(dcPasso);
}


// Il pulsante principale del passo: avanza, o salva se e' l'ultimo -
// stessa etichetta dinamica del prototipo, non due pulsanti diversi.
function dcAzionePasso(){
  if(window.innerWidth>=701){ if(typeof saveDay==='function') saveDay(); return; }
  const schede = dcSchede();
  if(dcPasso === schede.length - 1){ if(typeof saveDay==='function') saveDay(); }
  else { dcVaiPasso(dcPasso+1); }
}
