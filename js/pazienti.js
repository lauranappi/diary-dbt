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
      card.className='dc-riga';
      card.onclick=()=>openPatient(row.code,row);
      card.innerHTML='<div class="dc-riga-testo"><span class="dc-riga-tit">'+(p.nome||'?')+' '+(p.cognome||'')+'</span><span class="dc-riga-sub">@'+row.code+' • '+numDays+' giorni • aggiornato '+lastStr+'</span></div>'
        +'<svg width="11" height="19" viewBox="0 0 11 19" fill="none" style="flex:none"><path d="M2.5 2.5L8 9.5L2.5 16.5" stroke="var(--dc-muted)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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
    chart:{type:'area',height:150,toolbar:{show:false},zoom:{enabled:false},fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',animations:{enabled:true,speed:400},dropShadow:{enabled:false}},
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

  mkP('pc4',[{name:'Pensieri suicidari',data:sv('sp')},{name:'Azione (0/1)',data:tv('sa')}],['#C1714A','#123534']);
  mkP('pc5',[{name:'Intenzione autoles.',data:sv('ai')},{name:'Azione (0/1)',data:tv('aa')}],['#C1714A','#123534']);
  mkP('pc6',[{name:'Intenzione alcol',data:sv('alci')},{name:'Intenzione CBD',data:sv('cbdi')}],['#F5CE47','#1B4B4A']);
  mkP('pc1',[{name:'Serenità',data:sv('ser')},{name:'Gioia',data:sv('gio')}],['#1B4B4A','#F5CE47']);
  mkP('pc2',[{name:'Tristezza',data:sv('tri')},{name:'Paura',data:sv('pau')},{name:'Rabbia',data:sv('rab')}],['#1B4B4A','#C1714A','#8A4A30']);
  mkP('pc3',[{name:'Vergogna',data:sv('ver')},{name:'Colpa',data:sv('col')},{name:'Vuoto',data:sv('vuo')},{name:'Sof. emotiva',data:sv('se')}],['#8FB5B0','#2A6866','#123534','#C1714A']);
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
    item.innerHTML='<div style="flex:1"><div class="hd">'+fmtS(k)+'</div><div class="flags">'+flags+'</div></div>'
      +'<svg width="11" height="19" viewBox="0 0 11 19" fill="none" style="flex:none"><path d="M2.5 2.5L8 9.5L2.5 16.5" stroke="var(--dc-muted)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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

function scaleColor(val,positive){
  if(positive) return val>=4?'#1B4B4A':val>=2?'#4E7B79':val>=1?'#F5CE47':'#C6DAD7';
  return val>=4?'#C1714A':val>=3?'#F5CE47':val>=1?'#1B4B4A':'#C6DAD7';
}
const POSITIVE_SCALES=new Set(['ser','gio','fid','sf','atti']);


function showPatientDay(k){
  const entries=currentPatient.entries;
  const d=entries[k];if(!d)return;
  const modal=document.getElementById('scheda-modal');
  document.getElementById('scheda-title').textContent='Diary del '+fmtL(k);
  const body=document.getElementById('scheda-body');
  const s=d.scales||{};
  const t=d.toggles||{};
  const tx=d.texts||{};

  const kicker=testo=>'<span class="dc-thome-kicker">'+testo+'</span>';
  const card=(titolo,contenuto)=>'<div style="background:var(--dc-surface);border-radius:26px;padding:20px;display:flex;flex-direction:column;gap:16px;margin-bottom:12px">'
    +kicker(titolo)+contenuto+'</div>';
  const barra=(nome,val,max,colore)=>{
    const pct=Math.min(100,(val/max)*100);
    return '<div style="display:flex;align-items:center;gap:10px">'
      +'<span style="font-size:13px;font-weight:500;width:120px;flex:none;color:var(--dc-ink)">'+nome+'</span>'
      +'<span style="flex:1;height:8px;border-radius:999px;background:var(--dc-line);position:relative;overflow:hidden">'
      +'<i style="position:absolute;left:0;top:0;bottom:0;width:'+pct+'%;border-radius:999px;background:'+colore+'"></i></span>'
      +'<span style="font-size:12px;font-weight:700;color:var(--dc-terra-ink);width:20px;text-align:right;flex:none">'+val+'</span>'
      +'</div>';
  };
  const testoLibero=(etichetta,valore)=>'<div><div class="dc-thome-kicker" style="margin-bottom:4px">'+etichetta+'</div>'
    +'<div style="font-size:14px;color:var(--dc-ink);line-height:1.5">'+valore+'</div></div>';

  let html='';

  // ── Comportamenti e sostanze ──
  const critScales=['sp','ai','alci','cbdi','rap','atti'];
  const critTog=['sa','aa','ee','farm'];
  const critTxKeys=['alcu','cbdu','rap'];
  const critScaleRows=critScales.filter(k2=>s[k2]!=null);
  const critTogRows=critTog.filter(k2=>t[k2]);
  const critTxRows=critTxKeys.filter(k2=>tx[k2]&&tx[k2].trim());
  if(critScaleRows.length||critTogRows.length||critTxRows.length){
    let c='<div style="display:flex;flex-direction:column;gap:11px">';
    critScaleRows.forEach(k2=>{c+=barra(SCALE_LABELS[k2],s[k2],5,scaleColor(s[k2],POSITIVE_SCALES.has(k2)));});
    c+='</div>';
    if(critTogRows.length){
      c+='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:2px">';
      critTogRows.forEach(k2=>{
        const val=t[k2];
        const isDanger=val==='Sì'&&(k2==='sa'||k2==='aa');
        const bg=isDanger?'var(--dc-cella)':val==='Sì'?'var(--dc-petrolio-chiaro)':'var(--dc-bg)';
        const fg=isDanger?'var(--dc-terracotta)':val==='Sì'?'var(--dc-petrolio)':'var(--dc-muted)';
        c+='<span style="background:'+bg+';color:'+fg+';font-size:12.5px;font-weight:600;padding:9px 14px;border-radius:999px">'+TOG_LABELS[k2]+': '+val+'</span>';
      });
      c+='</div>';
    }
    critTxRows.forEach(k2=>{ c+='<div style="margin-top:8px">'+testoLibero(TEXT_LABELS[k2],tx[k2])+'</div>'; });
    html+=card('Comportamenti e sostanze', c);
  }

  // ── Emozioni e benessere ──
  const emoScales=['ser','gio','pau','rab','tri','ver','col','vuo','sf','se','abb','fid'];
  const emoRows=emoScales.filter(k2=>s[k2]!=null);
  if(emoRows.length){
    let c='<div style="display:flex;flex-direction:column;gap:11px">';
    emoRows.forEach(k2=>{c+=barra(SCALE_LABELS[k2],s[k2],5,scaleColor(s[k2],POSITIVE_SCALES.has(k2)));});
    c+='</div>';
    html+=card('Emozioni e benessere', c);
  }

  // ── Note ──
  const otherTx=['rim','att','note'];
  const otherTxRows=otherTx.filter(k2=>tx[k2]&&tx[k2].trim());
  if(otherTxRows.length){
    let c='<div style="display:flex;flex-direction:column;gap:14px">';
    otherTxRows.forEach(k2=>{ c+=testoLibero(TEXT_LABELS[k2],tx[k2]); });
    c+='</div>';
    html+=card('Note', c);
  }

  // ── Abilità DBT usate ──
  const sk=d.skills||{};
  const skUsed=Object.keys(sk).filter(k2=>sk[k2]);
  if(skUsed.length){
    let c='<div style="display:flex;flex-wrap:wrap;gap:8px">';
    skUsed.forEach(skid=>{
      const parts=skid.replace(/^sk_/,'').split('_');
      c+='<span style="background:var(--dc-cella);color:var(--dc-terra-ink);font-size:12.5px;font-weight:600;padding:9px 14px;border-radius:999px">'+parts.slice(1).join(' ')+'</span>';
    });
    c+='</div>';
    html+=card('Abilità DBT usate', c);
  }

  // ── Piano giornata ──
  const plan=d.planner;
  const slotLabels={mattina:'Mattina',pomeriggio:'Pomeriggio',sera:'Sera'};
  const hasPlanner=plan&&Object.values(plan).some(a=>a&&a.length>0);
  if(hasPlanner){
    let c='<div style="display:flex;flex-direction:column;gap:14px">';
    ['mattina','pomeriggio','sera'].forEach(slot=>{
      const items=(plan[slot])||[];
      if(!items.length)return;
      c+='<div><div class="dc-thome-kicker" style="margin-bottom:8px">'+slotLabels[slot]+'</div>'
        +'<div style="display:flex;flex-wrap:wrap;gap:8px">'
        +items.map(x=>'<span style="background:var(--dc-cella);color:var(--dc-terra-ink);font-size:12.5px;font-weight:600;padding:9px 14px;border-radius:999px">'+x+'</span>').join('')
        +'</div></div>';
    });
    c+='</div>';
    html+=card('Piano giornata', c);
  }

  if(!html)html='<div style="text-align:center;padding:2rem 1rem;color:var(--dc-muted)">Nessun dato compilato.</div>';
  body.innerHTML='<div style="padding:0 22px 26px">'+html+'</div>';
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}



function buildFlagsData(d){
  if(!d)return'';const flags=[];
  const s=d.scales||{},t=d.toggles||{},tx=d.texts||{};
  if(t.sa==='Sì')flags.push({cls:'flag-danger',label:'Az. suicidaria'});
  if(s.sp>=3)flags.push({cls:'flag-danger',label:'Pensieri suic. '+s.sp});
  if(t.aa==='Sì')flags.push({cls:'flag-danger',label:'Az. autolesività'});
  if(s.ai>=3)flags.push({cls:'flag-warn',label:'Autoles. '+s.ai});
  if(s.se>=3)flags.push({cls:'flag-warn',label:'Sof.em. '+s.se});
  if(tx.alcu&&tx.alcu.trim())flags.push({cls:'flag-warn',label:tx.alcu});
  if(tx.cbdu&&tx.cbdu.trim())flags.push({cls:'flag-info',label:'CBD'});
  if(t.ee==='Sì')flags.push({cls:'flag-warn',label:'Em. eating'});
  if(s.rap>0)flags.push({cls:'flag-info',label:'Rapporti: '+s.rap});
  if(t.farm==='No')flags.push({cls:'flag-warn',label:'Farmaci saltati'});
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



function renderPatientOverview(){
  if(!currentPatient)return;
  const entries=currentPatient.entries;
  const sg=document.getElementById('pat-stats');
  const flagsEl=document.getElementById('pat-flags-today');
  sg.innerHTML='';

  const mKeys=patKeys(entries,false);
  if(!mKeys.length){
    flagsEl.innerHTML='<div style="color:var(--dc-muted);padding:2rem;text-align:center">Nessun giorno compilato.</div>';
    return;
  }

  const avgS = k => {
    const v=mKeys.map(x=>entries[x]?.scales?.[k]).filter(x=>x!=null);
    return v.length ? v.reduce((a,b)=>a+b,0)/v.length : 0;
  };
  const contaSi = k => mKeys.filter(x=>entries[x]?.toggles?.[k]==='Sì').length;

  // ── "Emozioni · media del periodo": sette scale fisse, come nel documento ──
  const EMO7=[['se','Sofferenza emotiva'],['tri','Tristezza'],['vuo','Vuoto'],['rab','Rabbia'],
              ['pau','Paura'],['ser','Serenità'],['gio','Gioia']];
  let emoHtml='';
  EMO7.forEach(([k,nome])=>{
    const v=avgS(k);
    const pct=Math.min(100,(v/5)*100);
    const colore = v>=3 ? 'var(--dc-terra)' : 'var(--dc-hero)';
    emoHtml+='<div style="display:flex;align-items:center;gap:10px">'
      +'<span style="font-size:13px;font-weight:500;width:96px;flex:none;color:var(--dc-ink)">'+nome+'</span>'
      +'<span style="flex:1;height:8px;border-radius:999px;background:var(--dc-line);position:relative;overflow:hidden">'
      +'<i style="position:absolute;left:0;top:0;bottom:0;width:'+pct+'%;border-radius:999px;background:'+colore+'"></i></span>'
      +'<span style="font-size:12px;font-weight:700;color:var(--dc-terra-ink);width:22px;text-align:right;flex:none">'+v.toFixed(1)+'</span>'
      +'</div>';
  });

  // ── "Comportamenti · sì/no nel periodo": quattro conteggi fissi ──
  const SINO4=[['sa','Azione suicidaria'],['aa','Azione autolesività'],['ee','Emotional eating'],['farm','Farmaci saltati']];
  let sinoHtml='';
  SINO4.forEach(([k,nome])=>{
    const n=contaSi(k);
    const colore = n===0 ? 'var(--dc-muted)' : 'var(--dc-terra)';
    sinoHtml+='<div style="background:var(--dc-bg);border-radius:18px;padding:14px;display:flex;flex-direction:column;gap:3px">'
      +'<span style="font-size:23px;font-weight:800;letter-spacing:-.03em;line-height:1;color:'+colore+'">'+n+'</span>'
      +'<span style="font-size:11.5px;font-weight:500;color:var(--dc-muted);line-height:1.3">'+nome+'</span>'
      +'</div>';
  });

  // ── "Abilità più usate": le prime cinque per conteggio nel periodo ──
  const skCount={};
  mKeys.forEach(k=>{
    const sk=entries[k]?.skills||{};
    Object.keys(sk).filter(x=>sk[x]).forEach(x=>{ skCount[x]=(skCount[x]||0)+1; });
  });
  const skTop=Object.entries(skCount).sort((a,b)=>b[1]-a[1]).slice(0,5)
    .map(([skid])=>skid.replace(/^sk_/,'').split('_').slice(1).join(' '));
  let abilitaHtml=skTop.map(nome=>
    '<span style="background:var(--dc-cella);color:var(--dc-terra-ink);font-size:12.5px;font-weight:600;padding:9px 14px;border-radius:999px">'+nome+'</span>'
  ).join('');

  // ── Piano di crisi: nessuna data salvata nella struttura vera
  //    (pcSalva, forms.js) - si puo' solo dire se e' compilato o no.
  const pc=(currentPatient.fogli||{}).pianoCrisi||{};
  const pcCompilato = pc.segnali||pc.a1||pc.a2||pc.a3||pc.a4||pc.p1||pc.p2||pc.p3||pc.motivi;

  let html='<div style="display:flex;flex-direction:column;gap:12px">';
  html+='<div style="background:var(--dc-surface);border-radius:26px;padding:20px;display:flex;flex-direction:column;gap:16px">'
      +'<span style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--dc-terra)">Emozioni · media del periodo</span>'
      +'<div style="display:flex;flex-direction:column;gap:11px">'+emoHtml+'</div></div>';
  html+='<div style="background:var(--dc-surface);border-radius:26px;padding:20px;display:flex;flex-direction:column;gap:16px">'
      +'<span style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--dc-terra)">Comportamenti · sì/no nel periodo</span>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'+sinoHtml+'</div></div>';
  if(skTop.length){
    html+='<div style="background:var(--dc-surface);border-radius:26px;padding:20px;display:flex;flex-direction:column;gap:16px">'
        +'<span style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--dc-terra)">Abilità più usate</span>'
        +'<div style="display:flex;flex-wrap:wrap;gap:8px">'+abilitaHtml+'</div></div>';
  }
  html+='<div onclick="apriCrisiPaziente()" style="background:var(--dc-hero);border-radius:26px;padding:20px;display:flex;align-items:center;gap:12px;cursor:pointer">'
      +'<div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0">'
      +'<span style="font-size:15.5px;font-weight:800;letter-spacing:-.02em;color:var(--dc-hero-ink)">Piano di crisi</span>'
      +'<span style="font-size:12.5px;color:var(--dc-line)">'+(pcCompilato?'Compilato':'Non ancora compilato')+'</span></div>'
      +'<svg width="11" height="19" viewBox="0 0 11 19" fill="none" style="flex:none"><path d="M2.5 2.5L8 9.5L2.5 16.5" stroke="var(--dc-senape)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      +'</div>';
  html+='</div>';

  flagsEl.innerHTML=html;
}

// Apre il Piano di crisi di QUESTA paziente in sola lettura - non il
// modulo di modifica del terapeuta (che leggerebbe i suoi dati, non
// quelli della paziente). Popola il pannello direttamente, senza
// passare dal meccanismo di openScheda() che sposta una pagina vera.
function apriCrisiPaziente(){
  const pc=(currentPatient.fogli||{}).pianoCrisi||{};
  const nome=(currentPatient.profile.nome||'')+' '+(currentPatient.profile.cognome||'');
  // Struttura vera (pcSalva, forms.js): segnali, a1-a4, p1-p3 (testo
  // libero, non nome+telefono separati), motivi - nessuna data salvata.
  const compilato = pc.segnali || pc.a1 || pc.a2 || pc.a3 || pc.a4 || pc.p1 || pc.p2 || pc.p3 || pc.motivi;

  const riga=(etichetta,valore)=>{
    if(!valore || !String(valore).trim()) return '';
    return '<div style="margin-bottom:14px"><div class="dc-thome-kicker" style="margin-bottom:4px">'+etichetta+'</div>'
      +'<div style="font-size:14px;color:var(--dc-ink);line-height:1.5">'+valore+'</div></div>';
  };

  let corpo='';
  if(!compilato){
    corpo='<div style="text-align:center;padding:2rem 1rem;color:var(--dc-muted)">'+nome+' non ha ancora compilato un piano di crisi.</div>';
  } else {
    corpo += riga('Segnali di allarme', pc.segnali);
    const abilita=[pc.a1,pc.a2,pc.a3,pc.a4].filter(x=>x&&x.trim());
    if(abilita.length){
      corpo += '<div style="margin-bottom:14px"><div class="dc-thome-kicker" style="margin-bottom:4px">Abilità che funzionano</div>';
      abilita.forEach((a,i)=>{ corpo += '<div style="font-size:14px;color:var(--dc-ink);line-height:1.6">'+(i+1)+'. '+a+'</div>'; });
      corpo += '</div>';
    }
    const persone=[pc.p1,pc.p2,pc.p3].filter(x=>x&&x.trim());
    if(persone.length){
      corpo += '<div style="margin-bottom:14px"><div class="dc-thome-kicker" style="margin-bottom:4px">Persone da chiamare</div>';
      persone.forEach(p=>{ corpo += '<div style="font-size:14px;color:var(--dc-ink);line-height:1.6">'+p+'</div>'; });
      corpo += '</div>';
    }
    corpo += riga('Motivi per resistere', pc.motivi);
  }

  const modal=document.getElementById('scheda-modal');
  const body=document.getElementById('scheda-body');
  document.getElementById('scheda-title').textContent='Piano di crisi · '+nome;
  body.innerHTML='<div style="padding:0 22px 26px">'+corpo+'</div>';
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}


function renderPatientSkillsAndActs(){
  if(!currentPatient)return;
  const entries=currentPatient.entries;
  const keys=patKeys(entries,true);
  const nGG=keys.length||1;

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
  const sorted=Object.entries(skillCount).sort((a,b)=>b[1]-a[1]);
  if(!sorted.length){
    skillEl.innerHTML='<div style="color:var(--dc-muted);font-size:13px;padding:14px 0">Nessuna abilità registrata.</div>';
    return;
  }
  skillEl.innerHTML=sorted.map(([name,count])=>{
    const pct=Math.min(100,(count/nGG)*100);
    return '<div style="display:flex;align-items:center;gap:12px;padding:14px 0">'
      +'<span style="font-size:14px;font-weight:600;color:var(--dc-ink);flex:1;line-height:1.3">'+name+'</span>'
      +'<span style="flex:none;width:78px;height:7px;border-radius:999px;background:var(--dc-line);position:relative;overflow:hidden">'
      +'<i style="position:absolute;left:0;top:0;bottom:0;width:'+pct+'%;border-radius:999px;background:var(--dc-hero)"></i></span>'
      +'<span style="font-size:12px;font-weight:700;color:var(--dc-terra-ink);width:34px;text-align:right;flex:none">'+count+'/'+nGG+'</span>'
      +'</div>';
  }).join('');
}


function renderPatientPlanner(){
  if(!currentPatient)return;
  const entries=currentPatient.entries;
  const el=document.getElementById('pat-planner-view');
  const vuoto='<div class="planner-empty"><img class="vuoto-ill" src="illustrazioni/vuoti/vuoto-attivita.svg" alt="" width="160" height="160">Nessuna giornata pianificata in questo periodo.</div>';
  el.innerHTML='';

  const keys=patKeys(entries,true);
  const konPiano=keys.filter(k=>{
    const plan=entries[k]?.planner;
    return plan && Object.values(plan).some(a=>a&&a.length>0);
  });
  if(!konPiano.length){ el.innerHTML=vuoto; return; }

  const FASCE=[['mattina','Mattina'],['pomeriggio','Pomeriggio'],['sera','Sera']];
  let html='';
  konPiano.forEach(k=>{
    const plan=entries[k].planner;
    let fasceHtml='';
    FASCE.forEach(([id,nome])=>{
      const voci=(plan[id]||[]);
      if(!voci.length) return;
      fasceHtml+='<div style="padding:14px 18px;border-bottom:1px solid var(--dc-line)">'
        +'<span class="dc-thome-kicker">'+nome+'</span>'
        +'<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:8px">'
        +voci.map(a=>'<span style="background:var(--dc-cella);color:var(--dc-terra-ink);font-size:12.5px;font-weight:600;padding:9px 14px;border-radius:999px">'+a+'</span>').join('')
        +'</div></div>';
    });
    if(!fasceHtml) return;
    html+='<div style="font-size:12px;font-weight:700;color:var(--dc-muted);letter-spacing:.04em;text-transform:uppercase;margin:18px 0 8px">'+fmtL(k)+'</div>'
      +'<div style="background:var(--dc-surface);border-radius:26px;overflow:hidden;margin-bottom:10px">'+fasceHtml+'</div>';
  });
  el.innerHTML = html || vuoto;
}


let thRows={};   // righe delle pazienti caricate dalla Home

// ── HOME TERAPEUTA ───────────────────────────────────────────────────────
// Struttura letterale dal documento del progetto: solo nome e i due
// numeri dentro l'intestazione, scheda username separata, "Segnalazioni"
// come etichetta semplice col conteggio - niente saluto/data/schede
// triple/sezione rossa/accesso rapido, che nel documento non ci sono.
async function buildTherapistHome(){
  const box=document.getElementById('terap-home');
  if(!box) return;

  const cognome = profile.cognome ? ' '+profile.cognome : '';

  box.innerHTML =
    '<div class="dc-desk-hero" id="terap-home-hero">'
      +'<img src="illustrazioni/decorative/deco-tratti-chiaro.svg" alt="" style="position:absolute;right:-26px;top:20px;width:190px;opacity:.35;pointer-events:none">'
      +'<svg class="dc-onda" viewBox="0 0 390 40" preserveAspectRatio="none"><path d="M0 13C52 33 104 3 156 13C208 23 260 -1 312 8C342 13 368 19 390 15V41H0V13Z"></path></svg>'
      +'<div style="position:relative;display:flex;align-items:flex-start;gap:12px">'
        +'<div style="flex:1;min-width:0">'
          +'<h2 class="dc-thero-nome">Dott.ssa'+cognome+'</h2>'
          +'<div class="dc-thero-numeri">'
            +'<div class="dc-thero-num"><span id="th-n-pazienti">—</span><span>pazienti</span></div>'
            +'<div class="dc-thero-num"><span id="th-n-oggi">—</span><span>hanno compilato oggi</span></div>'
          +'</div>'
        +'</div>'
        +'<button class="dc-hero-imp" onclick="goPage(\'impostazioni\',null)" aria-label="Impostazioni">'
          +'<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="2.6" stroke="#FFFFFF" stroke-width="2"/><circle cx="9" cy="9" r="6.6" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="3.2 3.4"/></svg>'
        +'</button>'
      +'</div>'
    +'</div>'
    +'<div style="padding:16px 20px 0">'
    +'<div class="dc-thome-username">'
      +'<div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0">'
        +'<span class="dc-thome-kicker">Il tuo username</span>'
        +'<span class="dc-thome-user">'+(profile.code||'—')+'</span>'
        +'<span class="dc-thome-hint">Comunicalo alle pazienti in prima seduta.</span>'
      +'</div>'
    +'</div>'
    +'<div style="display:flex;align-items:baseline;gap:8px;margin-top:6px">'
      +'<span class="dc-thome-kicker" style="flex:1">Segnalazioni · 7 giorni</span>'
      +'<span style="font-size:12px;font-weight:500;color:var(--dc-muted);opacity:.7" id="th-n-segnalazioni"></span>'
    +'</div>'
    +'<div id="th-alerts" style="display:flex;flex-direction:column;gap:10px;margin-top:10px"></div>'
    +'<button onclick="goPage(\'pazienti\',null)" class="dc-thome-btn">Tutte le pazienti</button>'
    +'</div>';

  try{
    const url=SUPA_URL+'/rest/v1/diary_data?select=code,data,updated_at&data->profile->>terapeutaCode=eq.'+encodeURIComponent(profile.code);
    const r=await fetch(url,{headers:getAuthHeaders()});
    if(!r.ok) throw new Error('HTTP '+r.status);
    const rows=await r.json();
    thRows={}; rows.forEach(x=>{ thRows[x.code]=x; });

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

    document.getElementById('th-n-pazienti').textContent=rows.length;
    document.getElementById('th-n-oggi').textContent=compilateOggi;
    const contaEl=document.getElementById('th-n-segnalazioni');
    if(contaEl)contaEl.textContent=segnalazioni.length+(segnalazioni.length===1?' riga':' righe');

    const al=document.getElementById('th-alerts');
    al.innerHTML='';
    segnalazioni.slice(0,8).forEach(x=>{
      const row=document.createElement('div');
      row.className='dc-thome-seg';
      row.onclick=()=>openPatientFromHome(x.code);
      row.innerHTML='<span class="dc-thome-seg-dot"></span>'
        +'<div style="display:flex;flex-direction:column;gap:3px;flex:1;min-width:0">'
        +'<span class="dc-thome-seg-nome">'+x.nome+'</span>'
        +'<span class="dc-thome-seg-cosa">'+x.tipo+' · '+fmtL(x.giorno)+'</span></div>';
      al.appendChild(row);
    });
  }catch(err){
    document.getElementById('th-n-pazienti').textContent='—';
    document.getElementById('th-alerts').innerHTML='<div style="color:var(--red);padding:.5rem 0;font-size:13px">Dati non disponibili: '+err.message+'</div>';
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
async 


// Copia l'username negli appunti: e' il dato che serve dare alle pazienti.



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

  const chevron='<svg width="11" height="19" viewBox="0 0 11 19" fill="none" style="flex:none"><path d="M2.5 2.5L8 9.5L2.5 16.5" stroke="var(--dc-muted)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  window._fogliTerapCache=[];
  let out='<div style="display:flex;flex-direction:column;gap:18px">';
  giorni.forEach(giorno=>{
    const voci = perGiorno[giorno].sort((a,b)=>new Date(b.quando)-new Date(a.quando));
    out+='<div style="display:flex;flex-direction:column;gap:10px">';
    out+='<span class="dc-thome-kicker">'+fmtL(giorno)+'</span>';
    voci.forEach(({tipo,d})=>{
      const et=FOGLI_ETICHETTE[tipo];
      const righe=fogliRiassunto(tipo,d);
      const anteprima=(righe[0]||'').replace(/<\/?strong>/g,'');
      const idx=window._fogliTerapCache.length;
      window._fogliTerapCache.push({tipo,nome:et.nome,giorno,righe});
      out+='<div class="dc-riga" onclick="apriFoglioTerap('+idx+')">'
        +'<div class="dc-riga-testo"><span class="dc-riga-tit">'+et.nome+'</span><span class="dc-riga-sub" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+anteprima+'</span></div>'
        +chevron+'</div>';
    });
    out+='</div>';
  });
  out+='</div>';
  el.innerHTML = out;
}

// Apre il foglio di questa paziente in sola lettura, riusando le
// stesse righe gia' formattate da fogliRiassunto() per l'anteprima.
function apriFoglioTerap(idx){
  const voce=window._fogliTerapCache[idx];
  if(!voce)return;
  const modal=document.getElementById('scheda-modal');
  document.getElementById('scheda-title').textContent=voce.nome+' · '+fmtL(voce.giorno);
  const body=document.getElementById('scheda-body');
  const corpo=voce.righe.map(r=>'<div style="font-size:14px;color:var(--dc-ink);line-height:1.6;margin-bottom:12px">'+r+'</div>').join('');
  body.innerHTML='<div style="padding:0 22px 26px">'+(corpo||'<div style="text-align:center;padding:2rem 1rem;color:var(--dc-muted)">Nessun contenuto.</div>')+'</div>';
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}
