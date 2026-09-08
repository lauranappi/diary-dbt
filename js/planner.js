// ════════════════════════════════════════════════════════════════
// PLANNER — Pianificazione giornata
// ════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════
// PLANNER (chip-based)
// ══════════════════════════════════════════
const PLANNER_SLOTS=['mattina','pomeriggio','sera'];
let plannerData={mattina:[],pomeriggio:[],sera:[]};
let currentPickSlot='mattina';
let currentCatTab='vista';

function selectSlot(slot){
  currentPickSlot=slot;
  document.getElementById('act-step-slot').style.display='none';
  document.getElementById('act-step-pick').style.display='block';
  // l'intestazione "Attivita'" e' sorella dei due passi, non dentro il
  // primo: senza questo restava visibile insieme al titolo "Scegli le
  // attivita'", mostrando due titoli insieme.
  const hero=document.querySelector('#page-attivita > .page-hero');
  if(hero) hero.style.display='none';
  const slotLabels={mattina:'Mattina',pomeriggio:'Pomeriggio',sera:'Sera'};
  document.getElementById('pick-slot-label').textContent=slotLabels[slot];
  const sotto=document.getElementById('dc-scegli-sotto');
  if(sotto) sotto.textContent = ({mattina:'Mattina',pomeriggio:'Pomeriggio',sera:'Sera'})[slot]||'';
  const mieBtn=document.querySelector('#cat-tabs .act-tab[onclick*="mie"]');
  if(mieBtn)switchCatTab('mie',mieBtn);
}

function backToSlots(){
  document.getElementById('act-step-pick').style.display='none';
  document.getElementById('act-step-slot').style.display='block';
  const hero=document.querySelector('#page-attivita > .page-hero');
  if(hero) hero.style.display='';
  renderPlanSummary();
}

function switchCatTab(cat,btn){
  currentCatTab=cat;
  document.querySelectorAll('#cat-tabs .act-tab').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderCatChips(cat);
}
function getCustomActs(){return profile.customActs||[];}
function saveCustomActs(arr){profile.customActs=arr;svProfile();}

function renderCatChips(cat){
  const el=document.getElementById('cat-chips-content');
  el.innerHTML='';
  if(cat==='mie'){
    const mine=getCustomActs();
    if(!mine.length){
      el.innerHTML='<div style="color:var(--muted);font-size:13px;padding:1rem 0">Nessuna attività salvata.<br>Aggiungile qui sotto e resteranno sempre disponibili.</div>';
    } else {
      const selected=plannerData[currentPickSlot]||[];
      mine.forEach(item=>{
        const wrap=document.createElement('div');wrap.style.cssText='display:flex;align-items:center;gap:4px;flex:none';
        const chip=document.createElement('button');chip.className='cat-chip'+(selected.includes(item)?' selected':'');
        chip.textContent=(selected.includes(item)?'✓ ':'')+item;
        chip.onclick=()=>toggleCatChip(item,chip);
        const del=document.createElement('button');del.textContent='×';del.title='Rimuovi';
        del.style.cssText='background:none;border:none;color:var(--muted);font-size:16px;cursor:pointer;padding:0 4px';
        del.onclick=()=>{saveCustomActs(getCustomActs().filter(a=>a!==item));renderCatChips('mie');};
        wrap.appendChild(chip);wrap.appendChild(del);el.appendChild(wrap);
      });
    }
    return;
  }
  const catData=LEISURE_CATS[cat];
  if(!catData)return;
  const selected=plannerData[currentPickSlot]||[];
  catData.items.forEach(item=>{
    const wrap=document.createElement('div');
    wrap.style.cssText='display:flex;align-items:center;gap:4px;flex:none';
    const chip=document.createElement('button');
    chip.className='cat-chip'+(selected.includes(item)?' selected':'');
    chip.textContent=(selected.includes(item)?'✓ ':'')+item;
    chip.onclick=()=>toggleCatChip(item,chip);
    const mine=getCustomActs();
    const star=document.createElement('button');
    star.title='Aggiungi alle mie attività';
    star.style.cssText='background:none;border:none;cursor:pointer;padding:0 2px;display:flex;align-items:center';
    const disegnaStella=(piena)=>{
      star.innerHTML='<svg width="14" height="14" viewBox="0 0 14 14" fill="'+(piena?'var(--dc-terra)':'none')+'">'
        +'<path d="M7 1l1.76 3.76L13 5.27l-3 2.98.7 4.25L7 10.5l-3.7 1.99.7-4.25-3-2.98 4.24-.51z" stroke="var(--dc-terra)" stroke-width="1"/></svg>';
    };
    disegnaStella(mine.includes(item));
    star.onclick=(e)=>{
      e.stopPropagation();
      const m=getCustomActs();
      const idx=m.indexOf(item);
      if(idx===-1){m.push(item);disegnaStella(true);}
      else{m.splice(idx,1);disegnaStella(false);}
      saveCustomActs(m);
    };
    wrap.appendChild(chip);wrap.appendChild(star);el.appendChild(wrap);
  });
}

function toggleCatChip(item,chip){
  const arr=plannerData[currentPickSlot]||(plannerData[currentPickSlot]=[]);
  const idx=arr.indexOf(item);
  const scelto = idx===-1;
  if(scelto){ arr.push(item); } else { arr.splice(idx,1); }
  chip.classList.toggle('selected', scelto);
  chip.textContent=(scelto?'✓ ':'')+item;
  // Il colore va scritto direttamente sull'elemento, non solo tramite
  // la classe: cosi' cambia sul momento senza passare dal ricalcolo
  // dello stile esterno, che su alcuni dispositivi arrivava in ritardo.
  chip.style.background = scelto ? 'var(--dc-hero)' : 'var(--dc-cella)';
  chip.style.color = scelto ? 'var(--dc-hero-ink)' : 'var(--dc-terra-ink)';
  updateSlotCounts();
  setTimeout(savePlanner, 0);
}

function addCustomAct(){
  const inp=document.getElementById('custom-act-input');
  const val=inp.value.trim();
  if(!val)return;
  // Add to current slot
  const arr=plannerData[currentPickSlot]||(plannerData[currentPickSlot]=[]);
  if(!arr.includes(val)){arr.push(val);}
  // Save persistently to profile
  const mine=getCustomActs();
  if(!mine.includes(val)){mine.push(val);saveCustomActs(mine);}
  inp.value='';
  updateSlotCounts();
  inp.placeholder='✓ Aggiunta!';
  setTimeout(()=>{inp.placeholder='Es. chiamata con amica...';},1200);
}

function updateSlotCounts(){
  PLANNER_SLOTS.forEach(slot=>{
    const n=(plannerData[slot]||[]).length;
    const el=document.getElementById('slot-count-'+slot);
    if(el)el.textContent=n>0?n+' '+(n===1?'attività':'attività'):'';
    const btn=document.getElementById('slotbtn-'+slot);
    if(btn)btn.classList.toggle('has-items',n>0);
  });
}

function renderPlanSummary(){
  const slotLabels={mattina:'Mattina',pomeriggio:'Pomeriggio',sera:'Sera'};
  const summaryEl=document.getElementById('plan-summary');
  const bodyEl=document.getElementById('plan-summary-body');
  const hasAny=PLANNER_SLOTS.some(s=>(plannerData[s]||[]).length>0);
  summaryEl.style.display=hasAny?'block':'none';
  const emptyEl=document.getElementById('plan-empty-state');
  if(emptyEl)emptyEl.style.display=hasAny?'none':'block';
  // Come nel prototipo: i tre pulsanti Mattina/Pomeriggio/Sera si vedono
  // solo quando il piano e' vuoto. Appena c'e' qualcosa, restano solo
  // le schede col "+" dentro il riepilogo.
  const grid=document.getElementById('dc-slot-grid');
  if(grid)grid.style.display=hasAny?'none':'grid';
  if(!hasAny){bodyEl.innerHTML='';return;}
  bodyEl.innerHTML='';
  PLANNER_SLOTS.forEach(slot=>{
    const items=plannerData[slot]||[];
    const slotDiv=document.createElement('div');slotDiv.className='plan-summary-slot';

    const head=document.createElement('div');head.className='plan-summary-slot-head';
    const title=document.createElement('div');title.className='plan-summary-slot-title';
    title.textContent=slotLabels[slot];
    const piu=document.createElement('button');piu.className='plan-summary-add';
    piu.textContent='+';piu.title='Aggiungi';
    piu.onclick=()=>selectSlot(slot);
    head.appendChild(title);head.appendChild(piu);
    slotDiv.appendChild(head);

    if(!items.length){
      const vuoto=document.createElement('span');vuoto.className='plan-summary-vuoto';
      vuoto.textContent='Niente ancora';
      slotDiv.appendChild(vuoto);
    } else {
      const chips=document.createElement('div');chips.className='plan-summary-chips';
      items.forEach((item,idx)=>{
        // Come nel prototipo: la pillola intera si tocca per togliere,
        // senza una × visibile dentro.
        const chip=document.createElement('span');chip.className='plan-summary-chip';
        chip.textContent=item;
        const s=slot,ix=idx;
        chip.onclick=()=>{plannerData[s].splice(ix,1);updateSlotCounts();renderPlanSummary();savePlanner();};
        chips.appendChild(chip);
      });
      slotDiv.appendChild(chips);
    }
    bodyEl.appendChild(slotDiv);
  });
}

function removeSummaryItem(slot,idx){
  if(plannerData[slot])plannerData[slot].splice(idx,1);
  updateSlotCounts();
  renderPlanSummary();
  savePlanner();
}

function getPlannerData(){return {...plannerData};}

function setPlannerData(plan){
  plannerData={mattina:[],pomeriggio:[],sera:[]};
  if(plan){
    PLANNER_SLOTS.forEach(s=>{if(plan[s])plannerData[s]=[...plan[s]];});
  }
  updateSlotCounts();
  renderPlanSummary();
}

function clearPlanner(){
  plannerData={mattina:[],pomeriggio:[],sera:[]};
  updateSlotCounts();
  renderPlanSummary();
}

async function savePlanner(){
  const key=dkD(curPlan);
  if(!allData[key])allData[key]={scales:{},toggles:{},texts:{},skills:{}};
  const plan=getPlannerData();
  allData[key].planner=plan;
  allData[key].savedAt=new Date().toISOString();
  svData();svProfile();updPill(key);showToast('t-plan');
  if(channel)await pushChan();
}

function renderPlanner(){
  // curPlan is set by goPage or chPlanDay, don't reset here
  updPlanDL();
  const el=document.getElementById('planner-day-label');
  // label handled by updPlanDL
  const stepSlot=document.getElementById('act-step-slot');
  const stepPick=document.getElementById('act-step-pick');
  if(stepSlot)stepSlot.style.display='block';
  if(stepPick)stepPick.style.display='none';
  const key=dkD(curPlan);
  const data=allData[key];
  plannerData={mattina:[],pomeriggio:[],sera:[]};
  if(data&&data.planner){
    PLANNER_SLOTS.forEach(s=>{if(data.planner[s])plannerData[s]=[...data.planner[s]];});
  }
  updateSlotCounts();
  renderPlanSummary();
  updateSlotCounts();
  renderPlanSummary();
}

