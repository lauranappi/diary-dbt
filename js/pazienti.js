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
  pl.innerHTML='<div class="card"><div class="skel skel-riga" style="width:45%"></div><div class="skel skel-riga"></div></div>'
             +'<div class="card"><div class="skel skel-riga" style="width:38%"></div><div class="skel skel-riga"></div></div>';
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
  currentPatient={code:code,profile:row.data?.profile||{},entries:row.data?.entries||{},fogli:row.data?.fogli||{}};
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
  // la disposizione e' definita nel CSS (#pat-stats): qui non si tocca
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
    // superficie neutra per tutti: il colore lo porta il numero e una
    // barretta laterale, cosi' funziona anche in tema scuro
    const accent=c.danger&&c.v>0?'#C85250':c.warn&&c.v>0?'#B98230':c.ok?'var(--teal)':'var(--border-l)';
    sg.innerHTML+='<div class="sc pat-stat-card" style="box-shadow:inset 3px 0 0 '+accent+', var(--shadow-sm)"><div class="sv" style="color:'+col+'">'+c.v+'</div><div class="sl">'+c.l+'</div></div>';
  });
}

function last14(){const r=[];for(let i=13;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);r.push(dk(d))}return r}

let patRange=7;
function setPatRange(n,btn){
  patRange=n;
  // il periodo ora governa tutta la scheda, non solo i grafici
  // stessa funzione che disegna la panoramica all'apertura: usarne
  // un'altra produceva un impaginato diverso al cambio periodo
  // Ridisegna TUTTE le schede: se ne resta fuori una, quella mostra ancora
  // il periodo precedente finche' non la si riapre.
  setTimeout(()=>{
    const renderers=[
      typeof renderPatientOverview==='function' ? renderPatientOverview : renderPatientStats,
      typeof renderPatientHistory==='function' ? renderPatientHistory : null,
      typeof renderPatientSkillsAndActs==='function' ? renderPatientSkillsAndActs : null,
      typeof renderPatientPlanner==='function' ? renderPatientPlanner : null,
      typeof renderPatientFogli==='function' ? renderPatientFogli : null
    ];
    renderers.forEach(fn=>{
      if(!fn) return;
      try{ fn(); }catch(e){ console.warn('ridisegno scheda paziente', fn.name, e); }
    });
  }, 0);
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

  mkP('pc4',[{name:'Pensieri suicidari',data:sv('sp')},{name:'Azione (0/1)',data:tv('sa')}],['#D8845C','#B71C1C']);
  mkP('pc5',[{name:'Intenzione autoles.',data:sv('ai')},{name:'Azione (0/1)',data:tv('aa')}],['#D8845C','#880E4F']);
  mkP('pc6',[{name:'Intenzione alcol',data:sv('alci')},{name:'Intenzione CBD',data:sv('cbdi')}],['#FFA726','#66BB6A']);
  mkP('pc1',[{name:'Serenità',data:sv('ser')},{name:'Gioia',data:sv('gio')}],['#26A69A','#FFA726']);
  mkP('pc2',[{name:'Tristezza',data:sv('tri')},{name:'Paura',data:sv('pau')},{name:'Rabbia',data:sv('rab')}],['#42A5F5','#D8845C','#D8845C']);
  mkP('pc3',[{name:'Vergogna',data:sv('ver')},{name:'Colpa',data:sv('col')},{name:'Vuoto',data:sv('vuo')},{name:'Sof. emotiva',data:sv('se')}],['#9E9E9E','#757575','#424242','#26A69A']);
  renderChart('cEmoEat',[{name:'Em.eating',data:sv('ee')}],['#E0A23A']);
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
  if(positive) return val>=4?'#1B4B4A':val>=2?'#26A69A':val>=1?'#E0A23A':'#bbb';
  return val>=4?'#C85250':val>=3?'#E0A23A':val>=1?'#1B4B4A':'#bbb';
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
    html+='<div class="pat-section"><div class="pat-section-body">';
    html+='<div class="pat-sub" style="color:#C85250">⚠ Comportamenti e sostanze</div>';
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
        const bg=isDanger?"var(--red-l)":val==="Sì"?"var(--teal-ll)":"var(--surface-2)";
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
    html+='</div></div>';
  }

  // SEZIONE 2: emozioni
  const emoScales=['ser','gio','pau','rab','tri','ver','col','vuo','sf','se','abb','fid'];
  const emoRows=emoScales.filter(k2=>s[k2]!=null);
  if(emoRows.length){
    html+='<div class="modal-section"><div class="pat-sub">Emozioni e benessere</div>';
    html+='<div class="modal-grid">';
    emoRows.forEach(k2=>{html+=mkScaleRow(SCALE_LABELS[k2],s[k2],k2);});
    html+='</div></div>';
  }

  // SEZIONE 3: testi liberi
  const otherTx=['rim','att','note'];
  const otherTxRows=otherTx.filter(k2=>tx[k2]&&tx[k2].trim());
  if(otherTxRows.length){
    html+='<div class="modal-section"><div class="pat-sub">Note</div>';
    otherTxRows.forEach(k2=>{html+='<div class="modal-text-row"><div class="ms-label">'+TEXT_LABELS[k2]+'</div><div class="ms-text">'+tx[k2]+'</div></div>';});
    html+='</div></div>';
  }

  // SEZIONE 4: abilità DBT
  const sk=d.skills||{};
  const skUsed=Object.keys(sk).filter(k2=>sk[k2]);
  if(skUsed.length){
    html+='<div class="modal-section"><div class="pat-sub">Abilità DBT usate</div><div class="modal-chips">';
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
    html+='<div class="modal-section"><div class="pat-sub">Piano giornata</div>';
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
  // il periodo scelto vale per tutte le schede: riallinea i pulsanti
  setTimeout(()=>{
    document.querySelectorAll('#pat-range .chart-range-btn').forEach(b=>{
      const n=parseInt((b.getAttribute('onclick')||'').replace(/\D+/g,''))||0;
      b.classList.toggle('active', n===patRange);
    });
  },0);
  document.querySelectorAll('.pat-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.pat-tab-content').forEach(c=>c.classList.remove('active'));
  if(btn)btn.classList.add('active');
  document.getElementById('ptab-'+tab).classList.add('active');
  if(tab==='trend')renderPatientCharts();
  if(tab==='abilita')renderPatientSkillsAndActs();
  if(tab==='sessioni'){sessInit();sessRender();}
  if(tab==='giornata')renderPatientPlanner();
  if(tab==='storico')renderPatientHistory();
  if(tab==='fogli')renderPatientFogli();
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
    const bg=isDanger?'var(--red-l)':isWarn?'var(--amber-l)':isOk?'#EDFAF4':'var(--surface)';
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
  sg.innerHTML='';   // il conteggio ora sta nell'intestazione qui sotto


  // ── Media del periodo: resoconto immediato ──────────────────────────
  const mKeys = weekKeys;
  const nGG = mKeys.length;

  const avgS = k2 => {
    const v = mKeys.map(k=>entries[k]?.scales?.[k2]).filter(x=>x!=null);
    return v.length ? Math.round((v.reduce((x,y)=>x+y,0)/v.length)*10)/10 : null;
  };
  const aggT = k2 => {
    const v = mKeys.map(k=>entries[k]?.toggles?.[k2]).filter(x=>x);
    if(!v.length) return null;
    const si = v.filter(x=>x==='Sì').length;
    return { val: si>0 ? 'Sì' : 'No', gg: si };
  };

  // 'rap' (rapporti occasionali) non e' un'intensita' da mediare:
  // si riporta come si'/no con il numero di giornate.
  const CRIT=['sp','ai','alci','cbdi','atti'];
  const EMO =['ser','gio','pau','rab','tri','ver','col','vuo','sf','se','abb','fid'];
  const TOG =['sa','aa','ee','farm'];

  // Scale "negative": 0 e' neutro, qualunque valore sopra e' arancione,
  // da 4 in su rosso. Scale "positive" (serenita', gioia, fiducia): al
  // contrario, un valore alto e' verde e uno basso preoccupa.
  const lvlNeg = v => v>=4 ? 'danger' : v>0 ? 'warn' : 'neutral';
  const lvlPos = v => v>=3.5 ? 'ok' : v>=2 ? 'warn' : 'danger';
  const POSITIVE = ['ser','gio','fid'];

  const tile = (label,val,max,lvl) => {
    const pct = Math.min(100, (val/(max||5))*100);
    const col = lvl==='danger'?'#C85250':lvl==='warn'?'#B98230':lvl==='neutral'?'var(--muted)':'var(--teal)';
    return '<div class="avg-tile">'
      +'<div class="avg-top"><span class="avg-lbl">'+label+'</span><span class="avg-val" style="color:'+col+'">'+val+'</span></div>'
      +'<div class="avg-bar"><i style="width:'+pct+'%;background:'+col+'"></i></div>'
      +'</div>';
  };

  let html='';
  html+='<div class="pat-section">';
  html+='<div class="pat-section-head pat-head-row">'
        +'<span>Media del periodo — '+rangeLabel+'</span>'
        +'<span class="pat-head-count">'+nGG+' <small>giornate compilate</small></span>'
      +'</div>';
  html+='<div class="pat-section-body">';

  // 2. Comportamenti: prima i valori presenti, gli zero raggruppati in fondo
  const critAttivi=CRIT.filter(k2=>avgS(k2)!=null && avgS(k2)>0).sort((a,b)=>avgS(b)-avgS(a));
  const critZero  =CRIT.filter(k2=>avgS(k2)===0);
  if(critAttivi.length){
    html+='<div class="pat-sub" style="color:#C85250">Comportamenti e sostanze</div>';
    html+='<div class="avg-grid">';
    critAttivi.forEach(k2=>{ const v=avgS(k2); html+=tile(SCALE_LABELS[k2],v,5,lvlNeg(v)); });
    html+='</div>';
  }
  const togRows=TOG.map(k2=>({k2,r:aggT(k2)})).filter(x=>x.r);
  const rapGG = mKeys.filter(k=>(entries[k]?.scales?.rap||0)>0).length;
  if(togRows.length || nGG){
    html+='<div class="avg-chips">';
    html+='<span class="avg-chip '+(rapGG?'warn':'muted')+'">Rapporti occasionali: <strong>'
         +(rapGG? 'Sì ('+rapGG+' gg)' : 'No')+'</strong></span>';
    togRows.forEach(({k2,r})=>{
      // Per i farmaci il "Sì" e' una buona notizia: aderenza alla terapia.
      // Per tutti gli altri e' il contrario.
      let cls;
      if(k2==='farm'){
        cls = r.val==='Sì' ? 'ok' : 'warn';
      } else if(r.val==='Sì'){
        cls = (k2==='sa'||k2==='aa') ? 'danger' : 'warn';
      } else {
        cls = 'muted';
      }
      html+='<span class="avg-chip '+cls+'">'+TOG_LABELS[k2]+': <strong>'+r.val+(r.gg?' ('+r.gg+' gg)':'')+'</strong></span>';
    });
    html+='</div>';
  }
  if(critZero.length){
    html+='<div class="avg-zero">A zero: '+critZero.map(k2=>SCALE_LABELS[k2]).join(' · ')+'</div>';
  }

  // 3. Emozioni ordinate per intensita'
  // prima le negative alte, poi le positive (dove conta il valore basso)
  const emoAttive=EMO.filter(k2=>avgS(k2)!=null).sort((a,b)=>{
    const pa=POSITIVE.includes(a), pb=POSITIVE.includes(b);
    if(pa!==pb) return pa?1:-1;
    return pa ? avgS(a)-avgS(b) : avgS(b)-avgS(a);
  });
  if(emoAttive.length){
    html+='<div class="pat-sub">Emozioni e benessere</div>';
    html+='<div class="avg-grid">';
    emoAttive.forEach(k2=>{ const v=avgS(k2);
      // 'se' e' sofferenza emotiva e 'abb' e' abbandonare la terapia:
      // erano classificate per errore fra le positive.
      html+=tile(SCALE_LABELS[k2], v, 5, POSITIVE.includes(k2)?lvlPos(v):lvlNeg(v));
    });
    html+='</div>';
  }

  // 4. Abilita'
  const skCount={};
  mKeys.forEach(k=>{
    const sk=entries[k]?.skills||{};
    Object.keys(sk).filter(x=>sk[x]).forEach(x=>{ skCount[x]=(skCount[x]||0)+1; });
  });
  const skTop=Object.entries(skCount).sort((x,y)=>y[1]-x[1]).slice(0,10);
  if(skTop.length){
    html+='<div class="pat-sub">Abilità più usate</div><div class="avg-chips">';
    skTop.forEach(([skid,n])=>{
      const parts=skid.replace(/^sk_/,'').split('_');
      html+='<span class="avg-chip ok">'+parts.slice(1).join(' ')+' <strong>'+n+'</strong></span>';
    });
    html+='</div>';
  }

  html+='</div></div>';

  // ── Piano di crisi: documento unico, sempre visibile in panoramica ──
  const pc = (currentPatient.fogli||{}).pianoCrisi || {};
  const PC_ETICHETTE = {
    segnali:'Segnali di allarme',
    a1:'Abilità 1', a2:'Abilità 2', a3:'Abilità 3', a4:'Abilità 4',
    p1:'Persona 1', p2:'Persona 2', p3:'Persona 3',
    numeri:'Numeri utili', motivi:'Motivi per resistere'
  };
  const pcRighe = Object.keys(PC_ETICHETTE)
    .filter(k => pc[k] && String(pc[k]).trim())
    .map(k => '<div class="foglio-riga"><strong>'+PC_ETICHETTE[k]+':</strong> '+pc[k]+'</div>');

  if(pcRighe.length){
    html+='<div class="pat-section" style="margin-top:1rem">'
       +'<div class="pat-section-head" style="background:var(--red-l);color:#C85250">Piano di crisi</div>'
       +'<div class="pat-section-body">'+pcRighe.join('')+'</div></div>';
  }

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
  const keys=patKeys(entries,true);          // segue il periodo scelto
  const el=document.getElementById('pat-planner-view');
  const vuoto='<div class="planner-empty"><img class="vuoto-ill" src="illustrazioni/vuoti/vuoto-attivita.svg" alt="" width="160" height="160">Nessuna giornata pianificata in questo periodo.</div>';
  el.innerHTML='';
  if(!keys.length){ el.innerHTML=vuoto; return; }

  const slots=[
    {id:'mattina',    icona:'🌅', nome:'Mattina'},
    {id:'pomeriggio', icona:'☀️', nome:'Pomeriggio'},
    {id:'sera',       icona:'🌙', nome:'Sera'}
  ];

  let out='';
  keys.forEach(k=>{
    const plan=entries[k]?.planner;
    if(!plan || !Object.values(plan).some(a=>a&&a.length>0)) return;
    const tot=slots.reduce((n,s2)=>n+((plan[s2.id]||[]).length),0);

    out+='<div class="planner-day">'
       +'<div class="planner-day-head">'
         +'<span class="planner-day-date">'+fmtL(k)+'</span>'
         +'<span class="planner-day-count">'+tot+' '+(tot===1?'attività':'attività')+'</span>'
       +'</div>'
       +'<div class="planner-day-body">';

    slots.forEach(s2=>{
      const items=(plan&&plan[s2.id])||[];
      out+='<div class="planner-slot'+(items.length?'':' vuoto')+'">'
         +'<div class="planner-slot-name"><span>'+s2.icona+'</span>'+s2.nome+'</div>'
         +'<div class="planner-slot-items">'
         +(items.length
            ? items.map(x=>'<span class="planner-chip">'+x+'</span>').join('')
            : '<span class="planner-none">—</span>')
         +'</div></div>';
    });

    out+='</div></div>';
  });

  el.innerHTML = out || vuoto;
}



let thRows={};   // righe delle pazienti caricate dalla Home

// ── HOME TERAPEUTA ───────────────────────────────────────────────────────
// Panoramica di cio' che il terapeuta puo' fare: stato delle pazienti,
// segnalazioni recenti e accesso rapido al materiale di consultazione.
async function buildTherapistHome(){
  const box=document.getElementById('terap-home');
  if(!box) return;

  const now=new Date(), hh=now.getHours();
  const saluto = hh<5?'Notte insonne':hh<12?'Buongiorno':hh<17?'Buon pomeriggio':hh<21?'Buona sera':'Buonanotte';
  const nome = profile.nome ? ', '+profile.nome : '';
  const fascia = hh<5?'notte':hh<12?'mattino':hh<17?'giorno':hh<21?'sera':'notte';

  box.innerHTML =
    '<div class="home-hero page-hero" data-time="'+fascia+'">'
      +'<div class="hero-mesh"></div><div class="hero-grain"></div>'
      +'<div style="position:relative">'
        +'<div style="display:flex;align-items:flex-start;gap:12px">'
          +'<div style="flex:1;min-width:0">'
            +'<div style="font-size:24px;font-weight:800;letter-spacing:-.02em">'+saluto+nome+'</div>'
            +'<div style="opacity:.85;margin-top:2px">'+now.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})+'</div>'
          +'</div>'
          +'<button onclick="refreshTherapistHome(this)" class="hero-btn">↻ Aggiorna</button>'
        +'</div>'
        +'<div class="hero-user">'
          +'<div>'
            +'<div class="hero-user-label">Il tuo username</div>'
            +'<div class="hero-user-code">'+(profile.code||'—')+'</div>'
            +'<div class="hero-user-hint">Comunicalo alle tue pazienti per collegarvi</div>'
          +'</div>'
          +'<button class="hero-btn" onclick="copiaUsername(this)">Copia</button>'
        +'</div>'
      +'</div></div>'
    +'<div id="th-stats" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:8px;margin-bottom:1rem">'
      +'<div class="pat-stat-card"><div class="sl">Caricamento…</div></div></div>'
    +'<div id="th-alerts"></div>'
    +'<div class="pat-sub">Accesso rapido</div>'
    +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px">'
      +'<button class="strumenti-card" onclick="goPage(\'pazienti\',this)" style="text-align:left"><div style="font-size:22px">👥</div><div style="font-weight:700;margin-top:4px">Le mie pazienti</div><div style="font-size:12px;color:var(--muted)">Diari, trend e note</div></button>'
      +'<button class="strumenti-card" onclick="goPage(\'guida\',this)" style="text-align:left"><div style="font-size:22px">📖</div><div style="font-weight:700;margin-top:4px">Guida DBT</div><div style="font-size:12px;color:var(--muted)">Moduli e concetti</div></button>'

    +'</div>';

  // dati reali delle pazienti
  try{
    const url=SUPA_URL+'/rest/v1/diary_data?select=code,data,updated_at&data->profile->>terapeutaCode=eq.'+encodeURIComponent(profile.code);
    const r=await fetch(url,{headers:getAuthHeaders()});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const rows=await r.json();
    thRows={}; rows.forEach(x=>{ thRows[x.code]=x; });   // servono per aprire la scheda

    const oggi=dk(new Date());
    const set7=new Date(); set7.setDate(set7.getDate()-6);
    const da7=dk(set7);

    let compilateOggi=0, segnalazioni=[];
    rows.forEach(row=>{
      const p=row.data?.profile||{}, e=row.data?.entries||{};
      if(e[oggi] && !isDayEmpty(e[oggi])) compilateOggi++;
      Object.keys(e).filter(k=>k>=da7).forEach(k=>{
        const t=e[k]?.toggles||{};
        if(t.sa==='Sì'||t.aa==='Sì'){
          segnalazioni.push({nome:p.nome||row.code, giorno:k, code:row.code,
            tipo:t.sa==='Sì'?'azione suicidaria':'autolesività'});
        }
      });
    });

    document.getElementById('th-stats').innerHTML =
       '<div class="pat-stat-card" style="box-shadow:inset 3px 0 0 var(--teal), var(--shadow-sm)"><div><div class="sv">'+rows.length+'</div><div class="sl">Pazienti</div></div></div>'
      +'<div class="pat-stat-card" style="box-shadow:inset 3px 0 0 '+(compilateOggi?'var(--teal)':'var(--border-l)')+', var(--shadow-sm)"><div><div class="sv">'+compilateOggi+'</div><div class="sl">Hanno compilato oggi</div></div></div>'
      +'<div class="pat-stat-card" style="box-shadow:inset 3px 0 0 '+(segnalazioni.length?'#C85250':'var(--border-l)')+', var(--shadow-sm)"><div><div class="sv" style="color:'+(segnalazioni.length?'#C85250':'var(--text)')+'">'+segnalazioni.length+'</div><div class="sl">Segnalazioni (7 gg)</div></div></div>';

    const al=document.getElementById('th-alerts');
    if(segnalazioni.length){
      let hh2='<div class="pat-section"><div class="pat-section-head" style="background:var(--red-l);color:#C85250">⚠ Da rivedere — ultimi 7 giorni</div><div class="pat-section-body">';
      segnalazioni.slice(0,8).forEach(x=>{
        // la riga apre direttamente la scheda di quella paziente
        hh2+='<div class="modal-row th-alert" style="border-radius:8px;margin-bottom:4px;background:var(--surface-2);cursor:pointer" '
           +'onclick="openPatientFromHome(\''+x.code+'\')">'
           +'<span style="font-weight:600">'+x.nome+' <span style="opacity:.5">›</span></span>'
           +'<strong style="color:#C85250">'+x.tipo+' · '+fmtL(x.giorno)+'</strong></div>';
      });
      hh2+='</div></div>';
      al.innerHTML=hh2;
    } else {
      al.innerHTML='';
    }
  }catch(err){
    document.getElementById('th-stats').innerHTML=
      '<div class="pat-stat-card" style="grid-column:1/-1"><div class="sl">Dati non disponibili: '+err.message+'</div></div>';
  }
}


// Dalla Home si entra direttamente nella scheda della paziente:
// openPatient ha bisogno della riga completa, non del solo codice.
function openPatientFromHome(code){
  const row = thRows[code];
  goPage('pazienti');
  setTimeout(()=>{
    if(row) openPatient(code,row);
  }, 60);
}


// Ricarica i dati delle pazienti senza uscire dalla Home.
async function refreshTherapistHome(btn){
  if(btn){ btn.disabled=true; btn.textContent='Aggiorno…'; }
  try{
    await buildTherapistHome();   // ridisegna con i dati appena scaricati
  }catch(e){
    console.warn('aggiornamento home terapeuta', e);
    if(btn){ btn.disabled=false; btn.textContent='↻ Riprova'; }
  }
}


// Copia l'username negli appunti: e' il dato che serve dare alle pazienti.
function copiaUsername(btn){
  const code = profile.code || '';
  if(!code) return;
  const done = () => {
    const prima = btn.textContent;
    btn.textContent = 'Copiato ✓';
    btn.classList.add('ok');
    setTimeout(()=>{ btn.textContent = prima; btn.classList.remove('ok'); }, 1800);
  };
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(done).catch(()=>fallback());
  } else fallback();

  function fallback(){
    // Safari senza permessi sugli appunti: selezione manuale
    const t=document.createElement('textarea');
    t.value=code; document.body.appendChild(t); t.select();
    try{ document.execCommand('copy'); done(); }catch(e){ alert('Username: '+code); }
    document.body.removeChild(t);
  }
}


// ── FOGLI DI LAVORO DELLA PAZIENTE ───────────────────────────────────────
// Arrivano dal campo "fogli" sincronizzato dal dispositivo della paziente.
const FOGLI_ETICHETTE = {
  controllaFatti: {nome:'Controlla i fatti', icona:'🔍'},
  proContro:      {nome:"Pro e contro dell'usare le abilità", icona:'⚖️'},
  diarioEmozioni: {nome:'Diario delle emozioni', icona:'💗'},
  catena:         {nome:'Analisi della catena', icona:'🔗'}
};

function fogliRiassunto(tipo, d){
  if(tipo==='controllaFatti'){
    const int = d['cf-int-prima'] ? d['cf-int-prima']+(d['cf-int-dopo']?' → '+d['cf-int-dopo']:'') : '';
    return [ d['cf-emozione'] ? '<strong>'+d['cf-emozione']+'</strong>'+(int?' · intensità '+int:'') : '',
             d['cf-evento'] ? 'Evento: '+d['cf-evento'] : '',
             d['cf-evento-fatti'] ? 'Fatti: '+d['cf-evento-fatti'] : '',
             d['cf-interpretazioni'] ? 'Interpretazioni: '+d['cf-interpretazioni'] : '',
             d['cf-alternative'] ? 'Alternative: '+d['cf-alternative'] : '',
             d['cf-minaccia'] ? 'Minaccia: '+d['cf-minaccia'] : '',
             d['cf-catastrofe'] ? 'Catastrofe: '+d['cf-catastrofe'] : '',
             d['cf-affrontare'] ? 'Come affrontarla: '+d['cf-affrontare'] : '',
             d.corrisponde!=null ? 'Corrisponde ai fatti: <strong>'+d.corrisponde+'/5</strong>' : '',
             d['cf-verifica'] ? 'Verifica: '+d['cf-verifica'] : ''
           ].filter(Boolean);
  }
  if(tipo==='proContro'){
    return [ d['pc2-situazione'] ? '<strong>'+d['pc2-situazione']+'</strong>' : '',
             d['pc2-obiettivo'] ? 'Obiettivo: '+d['pc2-obiettivo'] : '',
             d['pc2-usare-pro'] ? 'Usare le abilità — pro: '+d['pc2-usare-pro'] : '',
             d['pc2-usare-contro'] ? 'Usare le abilità — contro: '+d['pc2-usare-contro'] : '',
             d['pc2-non-pro'] ? 'Non usarle — pro: '+d['pc2-non-pro'] : '',
             d['pc2-non-contro'] ? 'Non usarle — contro: '+d['pc2-non-contro'] : ''
           ].filter(Boolean);
  }
  // diario emozioni / catena: struttura libera
  return Object.keys(d)
    .filter(k=>!['id','data','ts'].includes(k) && d[k] && typeof d[k]==='string')
    .map(k=>d[k]);
}

function renderPatientFogli(){
  if(!currentPatient) return;
  const el=document.getElementById('pat-fogli-view');
  if(!el) return;
  const fogli = currentPatient.fogli || {};
  const vuoto = '<div class="planner-empty"><img class="vuoto-ill" src="illustrazioni/vuoti/vuoto-fogli.svg" alt="" width="160" height="160">Nessun foglio di lavoro compilato in questo periodo.</div>';

  // raggruppa per giorno, rispettando il periodo scelto
  const perGiorno = {};
  Object.keys(FOGLI_ETICHETTE).forEach(tipo=>{
    (fogli[tipo]||[]).forEach(d=>{
      const quando = d.data || d.ts;
      if(!quando) return;
      const giorno = dk(new Date(quando));
      if(patRange!==0){
        const limite=new Date(); limite.setDate(limite.getDate()-(patRange-1));
        if(giorno < dk(limite)) return;
      }
      (perGiorno[giorno] = perGiorno[giorno] || []).push({tipo, d, quando});
    });
  });

  const giorni = Object.keys(perGiorno).sort().reverse();
  if(!giorni.length){ el.innerHTML = vuoto; return; }

  let out='';
  giorni.forEach(giorno=>{
    const voci = perGiorno[giorno].sort((a,b)=>new Date(b.quando)-new Date(a.quando));
    out+='<div class="planner-day">'
       +'<div class="planner-day-head">'
         +'<span class="planner-day-date">'+fmtL(giorno)+'</span>'
         +'<span class="planner-day-count">'+voci.length+' '+(voci.length===1?'foglio':'fogli')+'</span>'
       +'</div><div class="planner-day-body">';
    voci.forEach(({tipo,d,quando})=>{
      const et=FOGLI_ETICHETTE[tipo];
      const ora=new Date(quando).toLocaleTimeString('it-IT',{hour:'2-digit',minute:'2-digit'});
      out+='<div class="foglio-blocco">'
         +'<div class="foglio-blocco-tit">'+et.icona+' '+et.nome+' <span>'+ora+'</span></div>'
         +fogliRiassunto(tipo,d).map(r=>'<div class="foglio-riga">'+r+'</div>').join('')
         +'</div>';
    });
    out+='</div></div>';
  });
  el.innerHTML = out;
}
