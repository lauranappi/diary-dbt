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
  if(on){b.classList.add('on');b.style.background='#1A7A6E';b.style.borderColor='#1A7A6E';b.style.color='#fff';}
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
  const c=document.getElementById('skwrap');c.innerHTML='';
  SKG.forEach(g=>{
    const gd=document.createElement('div');
    gd.innerHTML='<div class="sgt">'+g.g+'</div>';
    const grid=document.createElement('div');grid.style.cssText='display:flex;flex-wrap:wrap;gap:8px;margin-bottom:10px';
    g.it.forEach(item=>{
      const sid='sk_'+g.g+'_'+item;
      const btn=document.createElement('button');btn.className='sk-chip';btn.dataset.sk=sid;btn.textContent=item;
      btn.onclick=()=>{if(btn.classList.contains('on'))sel(btn,false);else sel(btn,true)};
      grid.appendChild(btn);
    });
    gd.appendChild(grid);c.appendChild(gd);
  });
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
function showToast(id){const t=document.getElementById(id);if(!t)return;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}

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
  if(name==='oggi'){setForm(allData[dk(cur)]||null);updDL();}

  // La barra superiore ha senso solo dove esiste una barra data da mostrare
  // memoria della pagina da cui si arriva, per il tasto Indietro
  if(window._curPage && window._curPage!==name) window._prevPage=window._curPage;
  window._curPage=name;

  const showTopheader=name==='oggi'||name==='attivita'||name==='abilita';
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
  if(name==='storico'){renderHist();switchStoricoTab('storico');}
  if(name==='abilita'){updDL();updAbiPill();renderActTab();}
  if(name==='attivita'){buildSuggest();curPlan=new Date();plannerData={mattina:[],pomeriggio:[],sera:[]};updPlanDL();renderPlanner();}
  if(name==='pazienti')renderPatients();
  if(name==='please'){renderPlease();}
  if(name==='diarioemo'){deRenderLista();}
  if(name==='pianocrisi'){pcCarica();}
  if(name==='catena'){caRenderLista();}
  if(name==='eventi'){epRender();}
  if(name==='guida'){setTimeout(()=>{renderGuide();renderEmozioni();},50);}
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



function goBack(){ goPage(window._prevPage || 'strumenti'); }


// Doppio tocco su Home = ricarica l'app (prende il codice aggiornato).
// Un tocco solo si comporta come sempre: porta alla Home.
let _homeTapAt = 0;
function tapHome(el){
  const now = Date.now();
  if(now - _homeTapAt < 600){
    _homeTapAt = 0;
    const t = document.createElement('div');
    t.className = 'tap-toast';
    t.textContent = 'Aggiornamento…';
    document.body.appendChild(t);
    requestAnimationFrame(()=>t.classList.add('on'));
    setTimeout(()=>window.location.reload(), 260);
    return;
  }
  _homeTapAt = now;
  goPage('home', el);
}


// ── SOLA CONSULTAZIONE PER IL TERAPEUTA ──────────────────────────────────
// Le schede e le abilita' sono materiale di riferimento: il terapeuta le
// legge, non le compila. I suoi dati non finirebbero da nessuna parte utile.
const PAGINE_CONSULTAZIONE = ['please','diarioemo','pianocrisi','catena','eventi',
                              'dearman','give','fast','abc','sentiero','guida','abilita',
                              'oggi','attivita'];

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
  const isNav = oc => /gopage|goback|togglesisection|switchpattab|toggleguide|togglesk|apri|open/.test(oc);
  const scrive = txt => /salva|aggiungi|genera|elimina|rimuovi|nuovo|nuova|azzera|reset|segna|svuota/.test(txt);

  page.querySelectorAll('[onclick]').forEach(el=>{
    const oc=(el.getAttribute('onclick')||'').toLowerCase();
    const txt=(el.textContent||'').toLowerCase();
    if(isNav(oc)) return;                       // indietro, sezioni, link interni
    if(el.tagName==='BUTTON' && scrive(txt)){   // comandi che scrivono: via
      el.style.display='none';
    } else {                                    // il resto resta visibile ma inerte
      el.style.pointerEvents='none';
      el.style.opacity='.85';
    }
  });

  if(!page.querySelector('.readonly-note')){
    const n=document.createElement('div');
    n.className='readonly-note';
    n.textContent='Sola consultazione — in modalità terapeuta queste schede non si compilano.';
    const hero=page.querySelector('.page-hero');
    if(hero && hero.nextSibling) page.insertBefore(n, hero.nextSibling);
    else page.insertBefore(n, page.firstChild);
  }
}
