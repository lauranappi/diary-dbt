// Chiavi filtrate sul periodo scelto (patRange), a giorni di calendario:
// stessa logica del selettore 7/14/tutti della vista paziente.
function patKeys(entries, recentFirst){
  let ks = Object.keys(entries).filter(k=>!isDayEmpty(entries[k])).sort();
  if(patRange !== 0){
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (patRange - 1));
    const cutoffStr = dk(cutoff);
    ks = ks.filter(k => k >= cutoffStr);
  }
  return recentFirst ? ks.reverse() : ks;
}

// ════════════════════════════════════════════════════════════════
// PAZIENTI — Vista terapeuta, tab paziente
// ════════════════════════════════════════════════════════════════
// ── PAZIENTI (terapeuta) ──
let currentPatient=null;
let patCharts={};

async function renderPatients(){
  document.getElementById('pat-detail-view').style.display='none';
  document.getElementById('pat-list-view').style.display='block';
  const myUser=document.getElementById('pat-myusername');
  if(myUser)myUser.textContent=profile.code||'—';
  const pl=document.getElementById('patients-list');
  const countEl=document.getElementById('pat-count');
  pl.innerHTML='<div style="text-align:center;padding:2rem;color:var(--muted)">Caricamento pazienti...</div>';
  try{
    const url=SUPA_URL+'/rest/v1/diary_data?select=code,data,updated_at&data->profile->>terapeutaCode=eq.'+encodeURIComponent(profile.code);
    console.log('Querying patients for terapeuta:',profile.code,'URL:',url);
    const r=await fetch(url,{
      headers:getAuthHeaders()
    });
    if(!r.ok){pl.innerHTML='<div style="color:var(--red);padding:1rem">Errore '+r.status+'</div>';return;}
    const rows=await r.json();
    if(!rows.length){
      pl.innerHTML='<div style="text-align:center;padding:2rem 1rem;color:var(--muted);background:var(--surface);border:1px dashed var(--border);border-radius:var(--r);line-height:1.6">Nessuna paziente ti ha ancora aggiunto come terapeuta.<br><br><span style="font-size:12px">Comunica il tuo username (<strong style="color:var(--teal)">'+profile.code+'</strong>) alle tue pazienti.</span></div>';
      if(countEl)countEl.textContent='0 pazienti';
      return;
    }
    if(countEl)countEl.textContent=rows.length+' '+(rows.length===1?'paziente':'pazienti');
    pl.innerHTML='';
    rows.forEach(row=>{
      const p=row.data?.profile||{};
      const entries=row.data?.entries||{};
      const numDays=Object.keys(entries).filter(k=>!isDayEmpty(entries[k])).length;
      const lastUpdate=row.updated_at?new Date(row.updated_at):null;
      const lastStr=lastUpdate?lastUpdate.toLocaleDateString('it-IT',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}):'mai';
      const card=document.createElement('div');
      card.className='patient-card';
      card.onclick=()=>openPatient(row.code,row);
      card.innerHTML='<div><div class="patient-name">'+(p.nome||'?')+' '+(p.cognome||'')+'</div><div class="patient-meta">@'+row.code+' • '+numDays+' giorni • aggiornato '+lastStr+'</div></div><div style="color:var(--muted);font-size:22px">›</div>';
      pl.appendChild(card);
    });
  }catch(e){pl.innerHTML='<div style="color:var(--red);padding:1rem">Errore: '+e.message+'</div>';}
}

async function openPatient(code,row){
  currentPatient={code:code,profile:row.data?.profile||{},entries:row.data?.entries||{}};
  document.getElementById('pat-list-view').style.display='none';
  document.getElementById('pat-detail-view').style.display='block';
  window.scrollTo({top:0,behavior:'smooth'});
  const p=currentPatient.profile;
  document.getElementById('pat-detail-name').textContent=(p.nome||'?')+' '+(p.cognome||'');
  document.getElementById('pat-detail-meta').textContent='@'+code+' • '+Object.keys(currentPatient.entries).filter(k=>!isDayEmpty(currentPatient.entries[k])).length+' giorni compilati';
  profile.patientNotes=profile.patientNotes||{};
  document.getElementById('pat-notes').value=profile.patientNotes[code]||'';
  renderPatientOverview();
}

function closePatient(){
  document.getElementById('pat-detail-view').style.display='none';
  document.getElementById('pat-list-view').style.display='block';
  currentPatient=null;
  Object.values(patCharts).forEach(c=>{if(c)try{c.destroy()}catch(e){}});
  patCharts={};
}

function renderPatientStats(){
  if(!currentPatient)return;
  const sg=document.getElementById('pat-stats');sg.innerHTML='';
  const entries=currentPatient.entries;
  const keys=patKeys(entries,true);
  const cF=fn=>keys.filter(k=>fn(entries[k])).length;
  const nSuic=cF(d=>d.toggles?.sa==='Sì');
  const nAuto=cF(d=>d.toggles?.aa==='Sì');
  const nAlcol=cF(d=>d.texts?.alcu?.trim());
  const nCbd=cF(d=>d.texts?.cbdu?.trim());
  const nEe=cF(d=>d.toggles?.ee==='Sì');
  const nRap=keys.reduce((acc,k)=>{const v=entries[k]?.scales?.rap;return acc+(v>0?v:0)},0);
  const totSkills=keys.reduce((acc,k)=>{const sk=entries[k]?.skills||{};return acc+Object.keys(sk).filter(s=>sk[s]).length},0);
  [
    {l:'Giorni compilati',v:keys.length,neutral:true},
    {l:'Azioni suicidarie',v:nSuic,danger:nSuic>0},
    {l:'Azioni autolesività',v:nAuto,danger:nAuto>0},
    {l:'Giorni con alcol',v:nAlcol,warn:nAlcol>0},
    {l:'Giorni con CBD',v:nCbd,warn:nCbd>0},
    {l:'Emotional eating',v:nEe,warn:nEe>0},
    {l:'Rapporti occ.',v:nRap,neutral:true},
    {l:'Abilità DBT',v:totSkills,ok:totSkills>0}
  ].forEach(c=>{
    const col=c.danger?'#C85250':c.warn?'#7A5010':c.ok?'#0A6647':'var(--text)';
    const bg=c.danger&&c.v>0?'var(--red-l)':c.warn&&c.v>0?'#FEF6E4':'var(--surface)';
    sg.innerHTML+='<div class="sc" style="background:'+bg+';border:1px solid '+(c.danger&&c.v>0?'#EFC0BF':c.warn&&c.v>0?'#F0D898':'var(--border-l)')+'"><div class="sv" style="color:'+col+'">'+c.v+'</div><div class="sl">'+c.l+'</div></div>';
  });
}

function last14(){const r=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);r.push(dk(d))}return r}

let patRange=7;
function setPatRange(n,btn){
  patRange=n;
  // il periodo ora governa tutta la scheda, non solo i grafici
  setTimeout(()=>{ renderPatientStats(); renderPatientHistory(); renderPatientSkillsAndActs(); }, 0);
  document.querySelectorAll('#pat-range .chart-range-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderPatientCharts();
}
function renderPatientCharts(){
  if(!currentPatient)return;
  // Destroy existing
  ['pc1','pc2','pc3','pc4','pc5','pc6'].forEach(id=>{
    const el=document.getElementById(id);
    if(el&&el._apexCharts){el._apexCharts.destroy();el._apexCharts=null;}
  });
  const entries=currentPatient.entries;
  const allEntryKeys=Object.keys(entries).filter(k=>!isDayEmpty(entries[k])).sort();
  const keys=patKeys(entries,false);
  if(!keys.length)return;
  const labels=keys.map(k=>new Date(k+'T12:00:00').toLocaleDateString('it-IT',{day:'numeric',month:'short'}));

  const BASE={
    chart:{type:'area',height:200,toolbar:{show:false},zoom:{enabled:false},fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',animations:{enabled:true,speed:400}},
    stroke:{curve:'smooth',width:2.5},
    fill:{type:'gradient',gradient:{shadeIntensity:.8,opacityFrom:.35,opacityTo:.02,stops:[0,100]}},
    grid:{borderColor:'rgba(120,160,155,.1)',strokeDashArray:3,xaxis:{lines:{show:false}},padding:{bottom:0}},
    xaxis:{categories:labels,labels:{style:{fontSize:'9px',colors:'rgba(120,140,135,.7)'},rotate:0,trim:false},axisBorder:{show:false},axisTicks:{show:false},tooltip:{enabled:false}},
    yaxis:{min:0,max:5,tickAmount:5,labels:{style:{fontSize:'10px',colors:'rgba(120,140,135,.7)'},formatter:v=>Math.round(v)}},
    tooltip:{theme:'dark',shared:true,intersect:false,style:{fontSize:'12px'}},
    legend:{position:'bottom',fontSize:'11px',fontWeight:500,markers:{width:8,height:8,radius:8},itemMargin:{horizontal:8}},
    markers:{size:0,hover:{size:5}},
    dataLabels:{enabled:false},
  };

  function mkP(id,series,colors){
    const el=document.getElementById(id);if(!el)return;
    const chart=new ApexCharts(el,{...BASE,series,colors,chart:{...BASE.chart,id}});
    chart.render();el._apexCharts=chart;
  }

  function sv(f){return keys.map(k=>entries[k]?.scales?.[f]??null);}
  function tv(f){return keys.map(k=>{const d=entries[k];if(!d)return null;return d.toggles?.[f]==='Sì'?1:0});}

  mkP('pc4',[{name:'Pensieri suicidari',data:sv('sp')},{name:'Azione (0/1)',data:tv('sa')}],['#EF5350','#B71C1C']);
  mkP('pc5',[{name:'Intenzione autoles.',data:sv('ai')},{name:'Azione (0/1)',data:tv('aa')}],['#EC407A','#880E4F']);
  mkP('pc6',[{name:'Intenzione alcol',data:sv('alci')},{name:'Intenzione CBD',data:sv('cbdi')}],['#FFA726','#66BB6A']);
  mkP('pc1',[{name:'Serenità',data:sv('ser')},{name:'Gioia',data:sv('gio')}],['#26A69A','#FFA726']);
  mkP('pc2',[{name:'Tristezza',data:sv('tri')},{name:'Paura',data:sv('pau')},{name:'Rabbia',data:sv('rab')}],['#42A5F5','#EC407A','#EF5350']);
  mkP('pc3',[{name:'Vergogna',data:sv('ver')},{name:'Colpa',data:sv('col')},{name:'Vuoto',data:sv('vuo')},{name:'Sof. emotiva',data:sv('se')}],['#9E9E9E','#757575','#424242','#26A69A']);
  renderChart('cEmoEat',[{name:'Em.eating',data:sv('ee')}],['#FF7043']);
}

function renderPatientHistory(){
  if(!currentPatient)return;
  const entries=currentPatient.entries;
  const keys=patKeys(entries,true);
  const ph=document.getElementById('pat-hist');ph.innerHTML='';
  if(!keys.length){ph.innerHTML='<div style="color:var(--muted);padding:1rem">Nessuna giornata.</div>';return;}
  keys.forEach(k=>{
    const d=entries[k];const item=document.createElement('div');item.className='hi pat-hist-item';
    item.style.cursor='pointer';
    const flags=buildFlagsData(d);
    item.innerHTML='<div style="flex:1"><div class="hd">'+fmtS(k)+'</div><div class="flags">'+flags+'</div></div><span style="color:#ccc;font-size:22px;flex-shrink:0">›</span>';
    item.onclick=()=>showPatientDay(k);
    ph.appendChild(item);
  });
}

const SCALE_LABELS={
  sp:'Pensieri suicidari',ai:'Intenzione autolesività',ser:'Serenità',gio:'Gioia',
  pau:'Paura',rab:'Rabbia',tri:'Tristezza',ver:'Vergogna',col:'Colpa',vuo:'Vuoto',
  sf:'Sofferenza fisica',se:'Sofferenza emotiva',abb:'Abbandonare la terapia',
  fid:'Fiducia nel cambiamento',atti:'Attività piacevoli (intenzione)',
  alci:'Alcol (intenzione)',cbdi:'CBD (intenzione)',rap:'Rapporti occasionali'
};
const TOG_LABELS={sa:'Azione suicidaria',aa:'Azione autolesività',ee:'Emotional eating',farm:'Farmaci prescritti'};
const TEXT_LABELS={rim:'Rimuginio',att:'Attività piacevoli / sociali',note:'Note libere',alcu:'Uso alcol',cbdu:'Uso CBD',rap:'Rapporti occasionali (dettagli)'};

function scaleBar(val,max,color){
  if(val==null)return'';
  const pct=Math.round((val/max)*100);
  return'<div style="display:flex;align-items:center;gap:8px;margin-top:4px">'
    +'<div style="flex:1;height:8px;background:var(--border-l);border-radius:4px;overflow:hidden">'
    +'<div style="height:100%;width:'+pct+'%;background:'+color+';border-radius:4px"></div>'
    +'</div>'
    +'<span style="font-size:15px;font-weight:700;color:'+color+';min-width:18px;text-align:right">'+val+'</span>'
    +'</div>';
}
function scaleColor(val,positive){
  if(positive) return val>=4?'#1A7A6E':val>=2?'#26A69A':val>=1?'#D4882A':'#bbb';
  return val>=4?'#C85250':val>=3?'#D4882A':val>=1?'#1A7A6E':'#bbb';
}
const POSITIVE_SCALES=new Set(['ser','gio','fid','sf','atti']);
function mkScaleRow(label,val,key){
  if(val==null)return'';
  const c=scaleColor(val,POSITIVE_SCALES.has(key));
  return'<div class="modal-stat" style="flex-direction:column;align-items:flex-start;gap:2px">'
    +'<div class="ms-label">'+label+'</div>'
    +scaleBar(val,5,c)
    +'</div>';
}

function showPatientDay(k){
  const entries=currentPatient.entries;
  const d=entries[k];if(!d)return;
  const modal=document.getElementById('pat-day-modal');
  document.getElementById('pat-day-title').textContent='Diary del '+fmtL(k);
  const body=document.getElementById('pat-day-body');
  const s=d.scales||{};
  const t=d.toggles||{};
  const tx=d.texts||{};
  let html='';

  // SEZIONE 1: comportamenti critici
  const critScales=['sp','ai','alci','cbdi','rap','atti'];
  const critTog=['sa','aa','ee','farm'];
  const critTxKeys=['alcu','cbdu','rap'];
  const critScaleRows=critScales.filter(k2=>s[k2]!=null);
  const critTogRows=critTog.filter(k2=>t[k2]);
  const critTxRows=critTxKeys.filter(k2=>tx[k2]&&tx[k2].trim());
  if(critScaleRows.length||critTogRows.length||critTxRows.length){
    html+='<div class="modal-section">';
    html+='<div class="modal-section-title" style="color:#C85250">⚠ Comportamenti e sostanze</div>';
    if(critScaleRows.length){
      html+='<div class="modal-grid">';
      critScaleRows.forEach(k2=>{html+=mkScaleRow(SCALE_LABELS[k2],s[k2]);});
      html+='</div>';
    }
    if(critTogRows.length){
      html+='<div style="margin-top:8px">';
      critTogRows.forEach(k2=>{
        const val=t[k2];
        const isDanger=val==="Sì"&&(k2==="sa"||k2==="aa");
        const color=isDanger?"var(--red)":val==="Sì"?"var(--teal)":"var(--muted)";
        const bg=isDanger?"#FEF0F0":val==="Sì"?"var(--teal-ll)":"var(--surface-2)";
        html+='<div class="modal-row" style="background:'+bg+';border-radius:8px;margin-bottom:4px">'
          +'<span style="font-weight:600">'+TOG_LABELS[k2]+'</span>'
          +'<strong style="color:'+color+'">'+val+'</strong></div>';
      });
      html+='</div>';
    }
    if(critTxRows.length){
      html+='<div style="margin-top:8px">';
      critTxRows.forEach(k2=>{html+='<div class="modal-text-row"><div class="ms-label">'+TEXT_LABELS[k2]+'</div><div class="ms-text">'+tx[k2]+'</div></div>';});
      html+='</div>';
    }
    html+='</div>';
  }

  // SEZIONE 2: emozioni
  const emoScales=['ser','gio','pau','rab','tri','ver','col','vuo','sf','se','abb','fid'];
  const emoRows=emoScales.filter(k2=>s[k2]!=null);
  if(emoRows.length){
    html+='<div class="modal-section"><div class="modal-section-title">Emozioni e benessere</div>';
    html+='<div class="modal-grid">';
    emoRows.forEach(k2=>{html+=mkScaleRow(SCALE_LABELS[k2],s[k2],k2);});
    html+='</div></div>';
  }

  // SEZIONE 3: testi liberi
  const otherTx=['rim','att','note'];
  const otherTxRows=otherTx.filter(k2=>tx[k2]&&tx[k2].trim());
  if(otherTxRows.length){
    html+='<div class="modal-section"><div class="modal-section-title">Note</div>';
    otherTxRows.forEach(k2=>{html+='<div class="modal-text-row"><div class="ms-label">'+TEXT_LABELS[k2]+'</div><div class="ms-text">'+tx[k2]+'</div></div>';});
    html+='</div>';
  }

  // SEZIONE 4: abilità DBT
  const sk=d.skills||{};
  const skUsed=Object.keys(sk).filter(k2=>sk[k2]);
  if(skUsed.length){
    html+='<div class="modal-section"><div class="modal-section-title">Abilità DBT usate</div><div class="modal-chips">';
    skUsed.forEach(skid=>{
      const parts=skid.replace(/^sk_/,'').split('_');
      const item=parts.slice(1).join('_');
      html+='<span class="modal-chip">'+item+'</span>';
    });
    html+='</div></div>';
  }

  // SEZIONE 5: piano giornata
  const plan=d.planner;
  const slotLabels={mattina:'🌅 Mattina',pomeriggio:'☀️ Pomeriggio',sera:'🌙 Sera'};
  const hasPlanner=plan&&Object.values(plan).some(a=>a&&a.length>0);
  if(hasPlanner){
    html+='<div class="modal-section"><div class="modal-section-title">Piano giornata</div>';
    ['mattina','pomeriggio','sera'].forEach(slot=>{
      const items=(plan[slot])||[];
      if(!items.length)return;
      html+='<div class="pat-planner-slot"><div class="pat-planner-slot-title">'+slotLabels[slot]+'</div>';
      html+='<div class="pat-planner-items">'+items.map(i=>'<span class="pat-planner-chip">'+i+'</span>').join('')+'</div></div>';
    });
    html+='</div>';
  }

  if(!html)html='<div style="color:var(--muted);padding:2rem;text-align:center">Nessun dato compilato.</div>';
  body.innerHTML=html;
  modal.style.display='flex';
  modal.style.alignItems='center';
  modal.style.justifyContent='center';
}
function closePatientDay(){
  document.getElementById('pat-day-modal').style.display='none';
}

function buildFlagsData(d){
  if(!d)return'';const flags=[];
  const s=d.scales||{},t=d.toggles||{},tx=d.texts||{};
  if(t.sa==='Sì')flags.push({cls:'flag-danger',label:'⚠ Az. suicidaria'});
  if(s.sp>=3)flags.push({cls:'flag-danger',label:'Pensieri suic. '+s.sp});
  if(t.aa==='Sì')flags.push({cls:'flag-danger',label:'⚠ Az. autolesività'});
  if(s.ai>=3)flags.push({cls:'flag-warn',label:'Autoles. '+s.ai});
  if(s.se>=3)flags.push({cls:'flag-warn',label:'Sof.em. '+s.se});
  if(tx.alcu&&tx.alcu.trim())flags.push({cls:'flag-warn',label:'◔ '+tx.alcu});
  if(tx.cbdu&&tx.cbdu.trim())flags.push({cls:'flag-info',label:'❀ CBD'});
  if(t.ee==='Sì')flags.push({cls:'flag-warn',label:'Em. eating'});
  if(s.rap>0)flags.push({cls:'flag-info',label:'Rapporti: '+s.rap});
  if(t.farm==='No')flags.push({cls:'flag-warn',label:'◆ Farmaci saltati'});
  return flags.map(f=>'<span class="flag '+f.cls+'">'+f.label+'</span>').join('');
}

async function savePatientNotes(){
  if(!currentPatient)return;
  profile.patientNotes=profile.patientNotes||{};
  profile.patientNotes[currentPatient.code]=document.getElementById('pat-notes').value;
  svProfile();
  await pushChan();
  showToast('t-pat');
}

// ══════════════════════════════════════════
// PAT TABS (terapeuta)
// ══════════════════════════════════════════
function switchPatTab(tab,btn){
  document.querySelectorAll('.pat-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.pat-tab-content').forEach(c=>c.classList.remove('active'));
  if(btn)btn.classList.add('active');
  document.getElementById('ptab-'+tab).classList.add('active');
  if(tab==='trend')renderPatientCharts();
  if(tab==='abilita')renderPatientSkillsAndActs();
  if(tab==='sessioni'){sessInit();sessRender();}
  if(tab==='giornata')renderPatientPlanner();
  if(tab==='storico')renderPatientHistory();
}

function isDayEmpty(d){
  if(!d)return true;
  const hasScale=d.scales&&Object.values(d.scales).some(v=>v!=null&&v!==0);
  const hasToggle=d.toggles&&Object.values(d.toggles).some(v=>v==='Sì');
  const hasText=d.texts&&Object.values(d.texts).some(v=>v&&v.trim());
  const hasSkill=d.skills&&Object.keys(d.skills).some(k=>d.skills[k]);
  const hasPlan=d.planner&&Object.values(d.planner).some(a=>a&&a.length>0);
  return!hasScale&&!hasToggle&&!hasText&&!hasSkill&&!hasPlan;
}

function mkStatPair(a,b){
  function mkOne(c){
    const isDanger=c.danger&&c.v>0;
    const isWarn=c.warn&&c.v>0;
    const isOk=c.ok&&c.v>0;
    const bg=isDanger?'var(--red-l)':isWarn?'#FEF6E4':isOk?'#EDFAF4':'var(--surface)';
    const border=isDanger?'#EFC0BF':isWarn?'#F0D898':isOk?'#A8DFC7':'var(--border-l)';
    const col=isDanger?'#C85250':isWarn?'#7A5010':isOk?'#0A6647':'var(--text-2)';
    return '<div style="flex:1;background:'+bg+';border:1.5px solid '+border+';border-radius:var(--rs);padding:12px 10px;text-align:center">'
      +'<div style="font-size:20px;margin-bottom:4px">'+c.icon+'</div>'
      +'<div style="font-size:24px;font-weight:800;color:'+col+'">'+c.v+'</div>'
      +'<div style="font-size:11px;color:var(--muted);line-height:1.3;margin-top:3px">'+c.label+'</div>'
      +'</div>';
  }
  return '<div style="display:flex;gap:8px;margin-bottom:8px">'+(a?mkOne(a):'')+(b?mkOne(b):'')+'</div>';
}

function renderPatientOverview(){
  if(!currentPatient)return;
  const entries=currentPatient.entries;
  const allKeys=Object.keys(entries).sort().reverse();
  const realKeys=allKeys.filter(k=>!isDayEmpty(entries[k]));
  const sg=document.getElementById('pat-stats');
  const flagsEl=document.getElementById('pat-flags-today');
  sg.innerHTML=''; flagsEl.innerHTML='';
  if(!realKeys.length){
    flagsEl.innerHTML='<div style="color:var(--muted);padding:2rem;text-align:center">Nessun giorno compilato.</div>';
    return;
  }

  // ── 7-day summary widgets (compact, 2 per row) ──
  // finestra = periodo scelto col selettore (7 / 14 / tutti)
  const weekKeys=patKeys(entries,false);
  const rangeLabel = patRange===0 ? 'tutto lo storico' : 'ultimi '+patRange+' giorni';
  const cF=fn=>weekKeys.filter(k=>fn(entries[k])).length;
  const stats=[
    {icon:'🚨',label:'Az. suicidarie',v:cF(d=>d.toggles?.sa==='Sì'),danger:true},
    {icon:'🩹',label:'Az. autolesività',v:cF(d=>d.toggles?.aa==='Sì'),danger:true},
    {icon:'💊',label:'Int. suicidio ≥3',v:cF(d=>(d.scales?.sp||0)>=3),warn:true},
    {icon:'⚠️',label:'Int. autoles. ≥3',v:cF(d=>(d.scales?.ai||0)>=3),warn:true},
    {icon:'🍷',label:'Giorni alcol',v:cF(d=>d.texts?.alcu?.trim()),warn:true},
    {icon:'🌿',label:'Giorni CBD',v:cF(d=>d.texts?.cbdu?.trim()),warn:true},
    {icon:'🍽',label:'Emotional eating',v:cF(d=>d.toggles?.ee==='Sì'),warn:true},
    {icon:'🎯',label:'Con attività',v:cF(d=>d.planner&&Object.values(d.planner).some(a=>a&&a.length>0)),ok:true},
    {icon:'✨',label:'Abilità DBT',v:weekKeys.reduce((a,k)=>{const sk=entries[k]?.skills||{};return a+Object.keys(sk).filter(s=>sk[s]).length},0),ok:true},
    {icon:'💊',label:'Farmaci saltati',v:cF(d=>d.toggles?.farm==='No'),warn:true},
  ];
  // sort: active colored first
  stats.sort((a,b)=>{
    const w=c=>(c.danger&&c.v>0)?0:(c.warn&&c.v>0)?1:(c.ok&&c.v>0)?2:3;
    return w(a)-w(b);
  });

  // Wide giorni compilati bar
  let wHtml='<div style="width:100%;background:var(--teal-ll);border:1.5px solid var(--teal-l);border-radius:var(--rs);padding:12px 16px;display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;box-sizing:border-box">'
    +'<div><div style="font-size:13px;font-weight:700;color:var(--teal-d)">📅 Giorni compilati</div><div style="font-size:11px;color:var(--muted);margin-top:1px">'+rangeLabel+'</div></div>'
    +'<span style="font-size:30px;font-weight:800;color:var(--teal)">'+realKeys.length+'</span>'
    +'</div>';
  wHtml+='<div style="font-size:15px;font-weight:800;color:var(--text);margin-bottom:10px">📊 Riepilogo — '+rangeLabel+'</div>';
  wHtml+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:1.25rem">';
  stats.forEach(c=>{
    const bg=c.danger&&c.v>0?'var(--red-l)':c.warn&&c.v>0?'var(--amber-l)':c.ok&&c.v>0?'var(--green-l)':'var(--surface)';
    const border=c.danger&&c.v>0?'var(--red)':c.warn&&c.v>0?'var(--amber)':c.ok&&c.v>0?'var(--green)':'var(--border-l)';
    const col=c.danger&&c.v>0?'var(--red)':c.warn&&c.v>0?'var(--amber)':c.ok&&c.v>0?'var(--green)':'var(--text-2)';
    wHtml+='<div class="pat-stat-card" style="background:'+bg+';box-shadow:inset 0 0 0 1.5px '+border+', var(--shadow-sm)">'
      +'<span style="font-size:20px;flex-shrink:0">'+c.icon+'</span>'
      +'<div style="min-width:0;flex:1">'
      +'<div style="font-size:11px;color:var(--muted);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+c.label+'</div>'
      +'<div style="font-size:22px;font-weight:800;color:'+col+'">'+c.v+'</div>'
      +'</div></div>';
  });
  wHtml+='</div>';
  sg.innerHTML=wHtml;

  // ── Media del periodo (al posto della sola ultima giornata) ──
  const mKeys = weekKeys;
  const nGG = mKeys.length;

  // media di una scala sui giorni in cui e' stata compilata
  const avgS = k2 => {
    const v = mKeys.map(k=>entries[k]?.scales?.[k2]).filter(x=>x!=null);
    return v.length ? (v.reduce((x,y)=>x+y,0)/v.length) : null;
  };
  // Si/No aggregato: "No" solo se tutti i giorni sono No, altrimenti "Si"
  const aggT = k2 => {
    const v = mKeys.map(k=>entries[k]?.toggles?.[k2]).filter(x=>x);
    if(!v.length) return null;
    const si = v.filter(x=>x==='Sì').length;
    return { val: si>0 ? 'Sì' : 'No', gg: si };
  };

  let html='';
  html+='<div class="pat-section">';
  html+='<div class="pat-section-head">Media del periodo — '+rangeLabel+' · '+nGG+' giornate</div>';
  html+='<div class="pat-section-body">';

  // Comportamenti e sostanze
  const critScales=['sp','ai','alci','cbdi','rap','atti'];
  const critTog=['sa','aa','ee','farm'];
  const critScaleRows=critScales.filter(k2=>avgS(k2)!=null);
  const critTogRows=critTog.filter(k2=>aggT(k2));
  if(critScaleRows.length||critTogRows.length){
    html+='<div class="pat-sub" style="color:#C85250">⚠ Comportamenti e sostanze</div>';
    if(critScaleRows.length){
      html+='<div class="modal-grid">';
      critScaleRows.forEach(k2=>{ html+=mkScaleRow(SCALE_LABELS[k2], Math.round(avgS(k2)*10)/10); });
      html+='</div>';
    }
    if(critTogRows.length){
      html+='<div style="margin-top:8px">';
      critTogRows.forEach(k2=>{
        const r=aggT(k2), val=r.val;
        const isDanger = val==='Sì' && (k2==='sa'||k2==='aa');
        const color = isDanger?'var(--red)':val==='Sì'?'var(--teal)':'var(--muted)';
        const bg    = isDanger?'var(--red-l)':val==='Sì'?'var(--teal-ll)':'var(--surface-2)';
        const extra = r.gg>0 ? ' <span style="font-weight:600;opacity:.7;font-size:12px">('+r.gg+' gg)</span>' : '';
        html+='<div class="modal-row" style="background:'+bg+';border-radius:8px;margin-bottom:4px">'
          +'<span style="font-weight:600">'+TOG_LABELS[k2]+'</span>'
          +'<strong style="color:'+color+'">'+val+extra+'</strong></div>';
      });
      html+='</div>';
    }
  }

  // Emozioni e benessere
  const emoScales=['ser','gio','pau','rab','tri','ver','col','vuo','sf','se','abb','fid'];
  const emoRows=emoScales.filter(k2=>avgS(k2)!=null);
  if(emoRows.length){
    html+='<div class="pat-sub">Emozioni e benessere</div>';
    html+='<div class="modal-grid">';
    emoRows.forEach(k2=>{ html+=mkScaleRow(SCALE_LABELS[k2], Math.round(avgS(k2)*10)/10, k2); });
    html+='</div>';
  }

  // Abilita' piu' usate nel periodo
  const skCount={};
  mKeys.forEach(k=>{
    const sk=entries[k]?.skills||{};
    Object.keys(sk).filter(s=>sk[s]).forEach(s=>{ skCount[s]=(skCount[s]||0)+1; });
  });
  const skTop=Object.entries(skCount).sort((x,y)=>y[1]-x[1]).slice(0,12);
  if(skTop.length){
    html+='<div class="pat-sub">Abilità DBT più usate</div>';
    html+='<div class="modal-chips">';
    skTop.forEach(([skid,n])=>{
      const parts=skid.replace(/^sk_/,'').split('_');
      html+='<span class="modal-chip">'+parts.slice(1).join(' ')+' · '+n+'</span>';
    });
    html+='</div>';
  }

  html+='</div></div>';
  flagsEl.innerHTML=html;
}



function renderPatientSkillsAndActs(){
  if(!currentPatient)return;
  const entries=currentPatient.entries;
  // rispetta il selettore 7/14/tutti come le altre schede
  const keys=patKeys(entries,true);

  // Skills count
  const skillCount={};
  keys.forEach(k=>{
    const sk=entries[k]?.skills||{};
    Object.keys(sk).forEach(skid=>{
      if(!sk[skid])return;
      const parts=skid.replace(/^sk_/,'').split('_');
      const name=parts.slice(1).join(' ');
      skillCount[name]=(skillCount[name]||0)+1;
    });
  });
  const skillEl=document.getElementById('pat-skills-chips');
  skillEl.innerHTML='';
  const sorted=Object.entries(skillCount).sort((a,b)=>b[1]-a[1]);
  if(!sorted.length){skillEl.innerHTML='<div style="color:var(--muted);font-size:13px">Nessuna abilità registrata.</div>';return;}
  sorted.forEach(([name,count])=>{
    const chip=document.createElement('div');chip.className='skill-count-chip';
    chip.innerHTML='<span class="scc-n">'+count+'</span>'+name;
    skillEl.appendChild(chip);
  });

  // Activities count from planner
  const actCount={};
  keys.forEach(k=>{
    const plan=entries[k]?.planner||{};
    Object.values(plan).forEach(arr=>{
      (arr||[]).forEach(a=>{actCount[a]=(actCount[a]||0)+1;});
    });
  });
  const actEl=document.getElementById('pat-act-chips');
  actEl.innerHTML='';
  const actSorted=Object.entries(actCount).sort((a,b)=>b[1]-a[1]).slice(0,20);
  if(!actSorted.length){actEl.innerHTML='<div style="color:var(--muted);font-size:13px">Nessuna attività pianificata.</div>';return;}
  actSorted.forEach(([name,count])=>{
    const chip=document.createElement('div');chip.className='skill-count-chip';
    chip.innerHTML='<span class="scc-n">'+count+'</span>'+name;
    actEl.appendChild(chip);
  });
}

function renderPatientPlanner(){
  if(!currentPatient)return;
  const entries=currentPatient.entries;
  const keys=Object.keys(entries).sort().reverse().slice(0,7);
  const el=document.getElementById('pat-planner-view');
  el.innerHTML='';
  if(!keys.length){el.innerHTML='<div style="color:var(--muted);padding:1rem">Nessuna giornata pianificata.</div>';return;}
  keys.forEach(k=>{
    const plan=entries[k]?.planner;
    const slotLabels={mattina:'🌅 Mattina',pomeriggio:'☀️ Pomeriggio',sera:'🌙 Sera'};
    const hasAny=plan&&Object.values(plan).some(a=>a&&a.length>0);
    if(!hasAny)return;
    let html='<div style="margin-bottom:1.25rem"><div style="font-weight:700;font-size:14px;margin-bottom:8px;color:var(--text)">'+fmtS(k)+'</div>';
    ['mattina','pomeriggio','sera'].forEach(slot=>{
      const items=(plan&&plan[slot])||[];
      if(!items.length)return;
      html+='<div class="pat-planner-slot"><div class="pat-planner-slot-title">'+slotLabels[slot]+'</div>';
      html+='<div class="pat-planner-items">'+items.map(i=>'<span class="pat-planner-chip">'+i+'</span>').join('')+'</div></div>';
    });
    html+='</div>';
    el.innerHTML+=html;
  });
  if(!el.innerHTML)el.innerHTML='<div style="color:var(--muted);padding:1rem">Nessuna giornata pianificata.</div>';
}

