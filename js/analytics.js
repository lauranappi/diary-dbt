let storicoRange = 7;   // 7 giorni per default (0 = tutti)
function setStoricoRange(n, btn){
  storicoRange = n;
  document.querySelectorAll('#storico-range .chart-range-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderHist();
}

// ════════════════════════════════════════════════════════════════
// ANALYTICS — Storico, Trend, Attività, Home, Suggerimenti
// ════════════════════════════════════════════════════════════════
// ── STORICO ──
function avg(keys,f){const v=keys.map(k=>allData[k]?.scales?.[f]).filter(x=>x!=null);if(!v.length)return'—';return(v.reduce((a,b)=>a+b,0)/v.length).toFixed(1)}
function buildFlags(d){
  if(!d)return'';const flags=[];
  const s=d.scales||{},t=d.toggles||{},tx=d.texts||{};
  if(t.sa==='Sì')flags.push({cls:'flag-danger',label:'⚠ Azione suicidaria'});
  if(s.sp>=3)flags.push({cls:'flag-danger',label:'Pensieri suic. '+s.sp});
  if(t.aa==='Sì')flags.push({cls:'flag-danger',label:'⚠ Azione autolesività'});
  if(s.ai>=3)flags.push({cls:'flag-warn',label:'Autolesività '+s.ai});
  if(tx.alcu&&tx.alcu.trim())flags.push({cls:'flag-warn',label:'◔ '+tx.alcu});
  if(tx.cbdu&&tx.cbdu.trim())flags.push({cls:'flag-info',label:'❀ CBD: '+tx.cbdu});
  if(t.ee==='Sì')flags.push({cls:'flag-warn',label:'Emotional eating'});
  if(s.rap>0)flags.push({cls:'flag-info',label:'Rapporti: '+s.rap});
  if(t.farm==='Sì')flags.push({cls:'flag-ok',label:'◆ Farmaci'});
  return flags.map(f=>'<span class="flag '+f.cls+'">'+f.label+'</span>').join('');
}
function renderHist(){
  let keys=Object.keys(allData).filter(k=>!isDayEmpty(allData[k])).sort();
  if(storicoRange!==0){
    const cutoff=new Date();
    cutoff.setDate(cutoff.getDate()-(storicoRange-1));
    const cutoffStr=dk(cutoff);
    keys=keys.filter(k=>k>=cutoffStr);
  }
  keys=keys.reverse().slice(0,60);
  const sg=document.getElementById('sgrid');sg.innerHTML='';
  const cF=(fn)=>keys.filter(k=>fn(allData[k])).length;
  const nSuic=cF(d=>d.toggles?.sa==='Sì'),nAuto=cF(d=>d.toggles?.aa==='Sì');
  const nAlcol=cF(d=>d.texts?.alcu?.trim()),nCbd=cF(d=>d.texts?.cbdu?.trim());
  const nEe=cF(d=>d.toggles?.ee==='Sì');
  const nRap=keys.reduce((acc,k)=>{const v=allData[k]?.scales?.rap;return acc+(v>0?v:0)},0);
  // Giorni saltati: solo fra quelli compilati in cui la risposta e' 'No'.
  // I giorni senza diary non si contano: non sappiamo cosa sia successo.
  const nFarmSalt=cF(d=>d.toggles?.farm==='No');
  // Wide giorni compilati
  const wideEl=document.createElement('div');
  wideEl.style.cssText='grid-column:1/-1;background:var(--teal-ll);border:1.5px solid var(--teal-l);border-radius:var(--rs);padding:14px 18px;display:flex;align-items:center;justify-content:space-between;margin-bottom:4px';
  wideEl.innerHTML='<div><div style="font-size:13px;font-weight:700;color:var(--teal-d)">📅 Giorni compilati</div></div><span style="font-size:32px;font-weight:800;color:var(--teal)">'+keys.length+'</span>';
  sg.appendChild(wideEl);
  // Pairs
  const pairs=[
    [{icon:'🚨',l:'Az. suicidarie',v:nSuic,danger:nSuic>0},{icon:'🩹',l:'Az. autolesività',v:nAuto,danger:nAuto>0}],
    [{icon:'🍷',l:'Giorni alcol',v:nAlcol,warn:nAlcol>0},{icon:'🌿',l:'Giorni CBD',v:nCbd,warn:nCbd>0}],
    [{icon:'🍽',l:'Emotional eating',v:nEe,warn:nEe>0},{icon:'💊',l:'Farmaci saltati',v:nFarmSalt,warn:nFarmSalt>0,ok:nFarmSalt===0}],
    [{icon:'♥',l:'Rapporti occ.',v:nRap,neutral:true},{icon:'✨',l:'Abilità DBT',v:keys.reduce((acc,k)=>acc+Object.keys(allData[k].skills||{}).filter(s=>allData[k].skills[s]).length,0),ok:true}]
  ];
  pairs.forEach(pair=>{
    pair.forEach(c=>{
      const isDanger=c.danger&&c.v>0,isWarn=c.warn&&c.v>0,isOk=c.ok&&c.v>0;
      const bg=isDanger?'var(--red-l)':isWarn?'#FEF6E4':isOk?'#EDFAF4':'var(--surface)';
      const border=isDanger?'#EFC0BF':isWarn?'#F0D898':isOk?'#A8DFC7':'var(--border-l)';
      const col=isDanger?'#C85250':isWarn?'#7A5010':isOk?'#0A6647':'var(--text-2)';
      const div=document.createElement('div');div.className='sc';
      div.style.cssText='background:'+bg+';border:1.5px solid '+border+';border-radius:var(--rs);padding:10px 8px;text-align:center';
      div.innerHTML='<div style="font-size:18px;margin-bottom:4px">'+c.icon+'</div><div class="sv" style="color:'+col+';font-size:22px">'+c.v+'</div><div class="sl" style="font-size:11px;line-height:1.3">'+c.l+'</div>';
      sg.appendChild(div);
    });
  });
  const hl=document.getElementById('hlist');hl.innerHTML='';
  if(!keys.length){hl.innerHTML='<div style="color:#aaa;font-size:14px;padding:1rem 0">Nessun giorno compilato ancora.</div>';return}
  keys.forEach(k=>{
    const d=allData[k];const item=document.createElement('div');item.className='hi';
    const flags=buildFlags(d);
    item.innerHTML='<div style="flex:1"><div class="hd">'+fmtS(k)+'</div><div class="flags">'+flags+'</div></div><span style="color:#ccc;font-size:22px;flex-shrink:0">›</span>';
    item.onclick=()=>showDaySummary(k,d);
    hl.appendChild(item);
  });
}

// ── TREND ──
function last7(){const r=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);r.push(dk(d))}return r}
let trendRange=7;
function setTrendRange(n,btn){
  trendRange=n;
  document.querySelectorAll('#trend-range .chart-range-btn').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  renderTrend();
}
function renderTrend(){
  const allKeys=Object.keys(allData).filter(k=>!isDayEmpty(allData[k])).sort();
  let keys;
  if(trendRange===0){
    keys=allKeys;
  } else {
    // Filter by real calendar range (last N days), not last N entries
    const cutoff=new Date();
    cutoff.setDate(cutoff.getDate()-(trendRange-1));
    const cutoffStr=dk(cutoff);
    keys=allKeys.filter(k=>k>=cutoffStr);
    // Fallback: if no entries in the calendar window, show last N entries
    if(!keys.length) keys=allKeys.slice(-trendRange);
  }
  if(!keys.length)return;
  const labels=keys.map(k=>new Date(k+'T12:00:00').toLocaleDateString('it-IT',{weekday:'short',day:'numeric'}));

  // Destroy existing charts
  ['cSuic1','cSuic2','cSost','cEmoPos','cEmoNeg1','cEmoNeg2','cEmoEat'].forEach(id=>{
    const el=document.getElementById(id);
    if(el&&el._apexCharts){el._apexCharts.destroy();el._apexCharts=null;}
  });

  const BASE_OPTS={
    chart:{type:'area',height:200,toolbar:{show:false},zoom:{enabled:false},fontFamily:'-apple-system,BlinkMacSystemFont,"SF Pro Text",sans-serif',animations:{enabled:true,speed:400}},
    stroke:{curve:'smooth',width:2.5},
    fill:{type:'gradient',gradient:{shadeIntensity:.8,opacityFrom:.35,opacityTo:.02,stops:[0,100]}},
    grid:{borderColor:'rgba(120,160,155,.1)',strokeDashArray:3,xaxis:{lines:{show:false}},padding:{bottom:0}},
    xaxis:{categories:labels,labels:{style:{fontSize:'10px',colors:'rgba(120,140,135,.7)'},rotate:0,trim:false},axisBorder:{show:false},axisTicks:{show:false},tooltip:{enabled:false}},
    yaxis:{min:0,max:5,tickAmount:5,labels:{style:{fontSize:'10px',colors:'rgba(120,140,135,.7)'},formatter:v=>Math.round(v)}},
    tooltip:{theme:'dark',x:{show:true},shared:true,intersect:false,style:{fontSize:'12px'}},
    legend:{position:'bottom',fontSize:'11px',fontWeight:500,markers:{width:8,height:8,radius:8},itemMargin:{horizontal:6,vertical:0},offsetY:0},
    markers:{size:0,hover:{size:5,sizeOffset:2}},
    dataLabels:{enabled:false},
  };

  function mkApex(id,series,colors,ymax){
    const el=document.getElementById(id);if(!el)return;
    const opts={...BASE_OPTS,series,colors,
      yaxis:{...BASE_OPTS.yaxis,max:ymax||5},
      chart:{...BASE_OPTS.chart,id}
    };
    const chart=new ApexCharts(el,opts);
    chart.render();
    el._apexCharts=chart;
  }

  function sv(f){return keys.map(k=>allData[k]?.scales?.[f]??null);}
  function tv(f){return keys.map(k=>{const d=allData[k];if(!d)return null;return d.toggles?.[f]==='Sì'?1:0});}

  mkApex('cSuic1',[{name:'Pensieri suicidari',data:sv('sp')},{name:'Azione suicidaria',data:tv('sa')}],['#EF5350','#B71C1C']);
  mkApex('cSuic2',[{name:'Intenzione autolesività',data:sv('ai')},{name:'Azione autolesività',data:tv('aa')}],['#EC407A','#880E4F']);
  mkApex('cSost',[{name:'Intenzione alcol',data:sv('alci')},{name:'Intenzione CBD',data:sv('cbdi')}],['#FFA726','#66BB6A']);
  mkApex('cEmoEat',[{name:'Emotional eating',data:tv('ee')}],['#FF7043'],1);
  mkApex('cEmoPos',[{name:'Serenità',data:sv('ser')},{name:'Gioia',data:sv('gio')}],['#26A69A','#FFA726']);
  mkApex('cEmoNeg1',[{name:'Tristezza',data:sv('tri')},{name:'Paura',data:sv('pau')},{name:'Rabbia',data:sv('rab')}],['#42A5F5','#EC407A','#EF5350']);
  mkApex('cEmoNeg2',[{name:'Vergogna',data:sv('ver')},{name:'Colpa',data:sv('col')},{name:'Vuoto',data:sv('vuo')},{name:'Sof. emotiva',data:sv('se')}],['#9E9E9E','#757575','#424242','#26A69A']);
}

// ── ATTIVITÀ ──
let currentActTab='dbt';
function switchAbiTab(tab,btn){
  document.querySelectorAll('#page-abilita .act-tab').forEach(b=>b.classList.remove('active'));
  if(btn)btn.classList.add('active');
  const guida=document.getElementById('abt-tab-guida');
  const oggi=document.getElementById('abt-tab-oggi');
  if(guida)guida.style.display=tab==='guida'?'block':'none';
  if(oggi)oggi.style.display=tab==='oggi'?'block':'none';
  if(tab==='oggi')renderActTab();
}
function switchActTab(tab,btn){
  currentActTab=tab;
  document.querySelectorAll('.act-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderActTab();
}
function renderActTab(){
  const c=document.getElementById('act-content');c.innerHTML='';
  if(currentActTab==='dbt'){
    DBT_SKILLS.forEach(sk=>{
      const triedT=triedToday('dbt_'+sk.id);
      const div=document.createElement('div');div.className='dbt-skill-card';
      const btnText=triedT?'✓ Provato oggi — tocca per annullare':'Prova adesso';
      const btnCls=triedT?'dbt-tried-btn':'dbt-try-btn';
      div.innerHTML='<div class="dbt-skill-header" onclick="toggleSkillCard(\'dbt-body-'+sk.id+'\')"><div class="dbt-skill-icon" style="background:'+sk.color+';font-weight:700;color:var(--teal-d);font-size:13px">'+sk.icon+'</div><div class="dbt-skill-info"><div class="dbt-skill-name">'+sk.name+'</div><div class="dbt-skill-desc">'+sk.desc+'</div></div><span style="color:#ccc;font-size:20px;flex-shrink:0;margin-left:8px">›</span></div><div class="dbt-skill-body" id="dbt-body-'+sk.id+'">'+sk.steps.map((s,i)=>'<div class="dbt-step"><div class="dbt-step-num">'+(i+1)+'</div><div class="dbt-step-text">'+s+'</div></div>').join('')+'<button class="'+btnCls+'" onclick="markActTried(\'dbt_'+sk.id+'\',this)">'+btnText+'</button></div>';
      c.appendChild(div);
    });
  } else {
    const cat=LEISURE_CATS[currentActTab];
    if(!cat)return;
    const wrap=document.createElement('div');
    wrap.innerHTML='<div class="leisure-cat-title">'+cat.label+'</div><div style="font-size:11px;color:var(--muted);margin-bottom:10px">Tocca un\'attività se l\'hai provata oggi.</div>';
    const grid=document.createElement('div');grid.className='leisure-grid';
    cat.items.forEach(item=>{
      const key='leisure_'+currentActTab+'_'+item;
      const triedT=triedToday(key);
      const d=document.createElement('div');
      d.className='leisure-item'+(triedT?' tried':'');
      d.textContent=(triedT?'✓ ':'')+item;
      d.onclick=()=>markActTried(key,d);
      grid.appendChild(d);
    });
    wrap.appendChild(grid);c.appendChild(wrap);
  }
}
function toggleSkillCard(id){
  const el=document.getElementById(id);
  el.classList.toggle('open');
}
function triedInLast7Days(key){
  const t=actTried[key];
  if(!t)return false;
  const dates=Array.isArray(t)?t:[t];
  return dates.some(d=>{
    const diff=(new Date()-new Date(d+'T12:00:00'))/86400000;
    return diff>=0&&diff<=7;
  });
}
function triedToday(key){
  const t=actTried[key];
  if(!t)return false;
  const dates=Array.isArray(t)?t:[t];
  return dates.includes(today());
}
function markActTried(key,el){
  const t=today();
  const cur=actTried[key];
  let arr=Array.isArray(cur)?[...cur]:cur?[cur]:[];
  if(arr.includes(t)){
    // Toggle OFF for today (keep older entries)
    arr=arr.filter(d=>d!==t);
    if(arr.length)actTried[key]=arr;
    else delete actTried[key];
  } else {
    arr.push(t);
    actTried[key]=arr;
  }
  svLS();pushChan();
  renderActTab();
}

// ── HOME ──
function buildHome(){
  const now=new Date();
  const h=now.getHours();
  const name=profile.nome||'';
  const greeting=h<5?'Notte insonne'+( name?', '+name:'')+' 🌙':h<12?'Buongiorno'+( name?', '+name:'')+'!':h<17?'Buon pomeriggio'+( name?', '+name:'')+'!':h<21?'Buona sera'+( name?', '+name:'')+' 🌅':'Buonanotte'+( name?', '+name:'')+' ☾';
  const dateStr=now.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'});
  document.getElementById('home-greeting').textContent=greeting;
  // la tinta dello sfondo segue la stessa fascia oraria del saluto
  const hero=document.getElementById('home-hero');
  if(hero) hero.dataset.time = h<5?'notte':h<12?'mattino':h<17?'giorno':h<21?'sera':'notte';
  document.getElementById('home-date').textContent=dateStr;

  const k=today();
  const d=allData[k];
  const compiled=d&&!isDayEmpty(d);

  // ── Pill row ──
  const pillRow=document.getElementById('home-pill-row');
  if(pillRow){
    const pills=[];
    if(compiled) pills.push('<span style="background:rgba(255,255,255,.2);color:#fff;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;backdrop-filter:blur(4px)">✓ Compilata oggi</span>');
    else pills.push('<span style="background:rgba(255,255,255,.12);color:rgba(255,255,255,.9);padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;cursor:pointer" onclick="goPage(&apos;oggi&apos;,null)">+ Compila adesso</span>');
    // skills today
    const todaySkills=d&&d.skills?Object.keys(d.skills).filter(s=>d.skills[s]).length:0;
    if(todaySkills>0) pills.push('<span style="background:rgba(255,255,255,.15);color:#fff;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600">✨ '+todaySkills+' abilit'+(todaySkills===1?'à':'à')+'</span>');
    pillRow.innerHTML=pills.join('');
  }

  // ── Diary status card ──
  const dc=document.getElementById('home-diary-card');
  if(dc){
    if(!compiled){
      const el=document.createElement('div');
      el.style.cssText='background:linear-gradient(135deg,var(--amber-l),var(--sand));border:1.5px solid var(--amber);border-radius:var(--r);padding:1rem 1.25rem;display:flex;align-items:center;gap:12px;cursor:pointer';
      el.onclick=()=>goPage('oggi',null);
      el.innerHTML='<span style="font-size:32px">📓</span><div style="flex:1"><div style="font-size:14px;font-weight:700;color:var(--text)">Diary card di oggi non compilata</div><div style="font-size:12px;color:var(--muted);margin-top:2px">Tocca per compilare</div></div><span style="font-size:20px;color:var(--amber)">›</span>';
      dc.innerHTML='';dc.appendChild(el);
    } else {
      const s=d.scales||{};
      const hiEmo=Object.entries({Tristezza:s.tri,Rabbia:s.rab,Paura:s.pau,Vergogna:s.ver,Vuoto:s.vuo}).filter(([,v])=>v>=3).sort(([,a],[,b])=>b-a);
      let summary='';
      if(hiEmo.length) summary='Emozioni elevate: '+hiEmo.map(([n,v])=>n+' '+v).join(', ');
      else summary='Serenità '+(s.ser||'—')+' · Gioia '+(s.gio||'—');
      const el2=document.createElement('div');
      el2.style.cssText='background:var(--green-l);border:1.5px solid var(--green);border-radius:var(--r);padding:1rem 1.25rem;display:flex;align-items:center;gap:12px';
      el2.innerHTML='<span style="font-size:28px">✅</span><div style="flex:1"><div style="font-size:13px;font-weight:700;color:var(--text)">Diary compilata</div><div style="font-size:11px;color:var(--muted);margin-top:2px">'+summary+'</div></div>';
      const btn=document.createElement('button');
      btn.textContent='Modifica';
      btn.style.cssText='background:var(--green);color:#fff;border:none;border-radius:var(--rs);padding:6px 12px;font-size:12px;font-weight:700;cursor:pointer;font-family:var(--font-ui)';
      btn.onclick=()=>goPage('oggi',null);
      el2.appendChild(btn);
      dc.innerHTML='';dc.appendChild(el2);
    }
  }

    // ── Streak ──
  let streak=0;const check=new Date();check.setHours(0,0,0,0);
  while(allData[dk(check)]&&!isDayEmpty(allData[dk(check)])){streak++;check.setDate(check.getDate()-1);}
  document.getElementById('streak-num').textContent=streak;
  const streakEmoji=streak===0?'':streak<3?'🌱':streak<7?'🔥':streak<14?'⚡':'🏆';
  document.getElementById('streak-sub').textContent=streak===0?'Inizia oggi!':streak===1?'Ottimo inizio — continua domani!':streak<7?'Continua così '+streakEmoji:streak<14?'Una settimana piena! '+streakEmoji:'Streak impressionante! '+streakEmoji;

  // ── Streak dots — 7 giorni con etichetta ──
  const dotsEl=document.getElementById('streak-dots');
  const daysEl=document.getElementById('streak-days-label');
  if(dotsEl){
    dotsEl.innerHTML='';
    const dayLetters=['L','M','M','G','V','S','D'];
    for(let i=6;i>=0;i--){
      const dd=new Date();dd.setDate(dd.getDate()-i);
      const filled=!!allData[dk(dd)]&&!isDayEmpty(allData[dk(dd)]);
      const isToday=i===0;
      const wrap=document.createElement('div');
      wrap.style.cssText='display:flex;flex-direction:column;align-items:center;gap:3px';
      const dot=document.createElement('div');
      dot.style.cssText='width:'+( isToday?'14':'10')+'px;height:'+(isToday?'14':'10')+'px;border-radius:50%;background:'+(filled?'var(--teal)':isToday?'var(--amber)':'var(--border)')+';border:2px solid '+(filled?'var(--teal)':isToday?'var(--amber)':'var(--border-l)')+';transition:all .2s';
      const lbl=document.createElement('div');
      const dayIdx=dd.getDay();const adjusted=(dayIdx+6)%7;
      lbl.style.cssText='font-size:9px;color:var(--muted);font-weight:'+(isToday?'700':'400');
      lbl.textContent=isToday?'Oggi':dayLetters[adjusted];
      wrap.appendChild(dot);wrap.appendChild(lbl);
      dotsEl.appendChild(wrap);
    }
  }

  // ── Quick card subtitles ──
  const oggiSub=document.getElementById('hq-oggi-sub');
  if(oggiSub)oggiSub.textContent=compiled?'✓ Compilata':'Da compilare';
  const attSub=document.getElementById('hq-attivita-sub');
  if(attSub){
    const todayPlan=allData[k]?.planner;
    const nActs=todayPlan?Object.values(todayPlan).flat().length:0;
    attSub.textContent=nActs>0?nActs+' attivit'+(nActs===1?'à':'à'):'Pianifica';
  }
  const tSub=document.getElementById('hq-trend-sub');
  if(tSub){
    const compiledDays=Object.keys(allData).filter(k2=>{const dd=new Date(k2+'T12:00:00');return(now-dd)/86400000<=7&&!isDayEmpty(allData[k2])}).length;
    tSub.textContent=compiledDays+'/7 giorni';
  }

  // ── Mini timeline ultimi 7 giorni ──
  const tl=document.getElementById('home-timeline');
  if(tl){
    const tlWrap=document.createElement('div');
    const lbl=document.createElement('div');
    lbl.style.cssText='font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px';
    lbl.textContent='Ultimi 7 giorni';
    tlWrap.appendChild(lbl);
    const list=document.createElement('div');
    list.style.cssText='display:flex;flex-direction:column;gap:4px';
    for(let i=6;i>=0;i--){
      const dd=new Date();dd.setDate(dd.getDate()-i);
      const dk2=dk(dd);
      const entry=allData[dk2];
      const isComp=entry&&!isDayEmpty(entry);
      const isToday2=i===0;
      const label=isToday2?'Oggi':dd.toLocaleDateString('it-IT',{weekday:'short',day:'numeric'});
      const row=document.createElement('div');
      if(!isComp){
        row.style.cssText='display:flex;align-items:center;gap:10px;padding:6px 10px;border-radius:var(--rs);background:var(--surface-2);opacity:.5';
        row.innerHTML='<div style="width:8px;height:8px;border-radius:50%;background:var(--border);flex-shrink:0"></div><div style="font-size:12px;color:var(--muted);flex:1">'+label+'</div><div style="font-size:11px;color:var(--muted)">—</div>';
      } else {
        const s=entry.scales||{};
        const emos=[['😔',s.tri,'tri'],['😠',s.rab,'rab'],['😰',s.pau,'pau'],['😶',s.ver,'ver'],['😌',s.ser,'ser'],['😊',s.gio,'gio']];
        const dominant=emos.filter(([,v])=>v!=null&&v>0).sort(([,a],[,b])=>b-a)[0];
        const emoStr=dominant?dominant[0]+' '+dominant[1]:'';
        const flags=[];
        if(entry.toggles&&entry.toggles.sa==='Sì')flags.push('<span style="background:var(--red-l);color:var(--red);font-size:10px;padding:1px 6px;border-radius:8px;font-weight:700">⚠ SA</span>');
        if(entry.toggles&&entry.toggles.aa==='Sì')flags.push('<span style="background:var(--red-l);color:var(--red);font-size:10px;padding:1px 6px;border-radius:8px;font-weight:700">⚠ AA</span>');
        const nSkills=entry.skills?Object.keys(entry.skills).filter(sk=>entry.skills[sk]).length:0;
        if(nSkills>0)flags.push('<span style="background:var(--teal-l);color:var(--teal-d);font-size:10px;padding:1px 6px;border-radius:8px;font-weight:700">✨ '+nSkills+'</span>');
        row.style.cssText='display:flex;align-items:center;gap:10px;padding:7px 10px;border-radius:var(--rs);background:var(--surface);border:1px solid var(--border-l);cursor:pointer';
        row.onclick=()=>goPage('storico',null);
        row.innerHTML='<div style="width:8px;height:8px;border-radius:50%;background:var(--teal);flex-shrink:0"></div><div style="font-size:12px;font-weight:600;color:var(--text);min-width:80px">'+label+'</div><div style="font-size:11px;color:var(--muted);flex:1">'+emoStr+'</div><div style="display:flex;gap:4px">'+flags.join('')+'</div>';
      }
      list.appendChild(row);
    }
    tlWrap.appendChild(list);
    tl.innerHTML='';tl.appendChild(tlWrap);
  }

    // ── Emozioni di ieri ──
  const yDay=new Date();yDay.setDate(yDay.getDate()-1);
  const yEntry=allData[dk(yDay)];
  const yEl=document.getElementById('home-emo-yesterday');
  if(yEl&&yEntry&&!isDayEmpty(yEntry)){
    const ys=yEntry.scales||{};
    const emoMap=[
      {k:'ser',label:'Serenità',pos:true},
      {k:'gio',label:'Gioia',pos:true},
      {k:'sf',label:'Benessere',pos:true},
      {k:'tri',label:'Tristezza',pos:false},
      {k:'rab',label:'Rabbia',pos:false},
      {k:'pau',label:'Paura',pos:false},
      {k:'se',label:'Sof.em.',pos:false},
    ].filter(e=>ys[e.k]!=null&&ys[e.k]>0);
    if(emoMap.length){
      yEl.style.display='';
      let yHtml='<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.07em;margin-bottom:8px">Ieri</div>';
      yHtml+='<div style="display:flex;flex-wrap:wrap;gap:6px">';
      emoMap.forEach(e=>{
        const v=ys[e.k];
        const bg=e.pos?(v>=3?'var(--green-l)':'var(--teal-ll)'):(v>=4?'var(--red-l)':v>=3?'var(--amber-l)':'var(--surface-2)');
        const col=e.pos?(v>=3?'var(--green)':'var(--teal)'):(v>=4?'var(--red)':v>=3?'var(--amber)':'var(--text-2)');
        yHtml+='<div style="background:'+bg+';border:1px solid '+col+';border-radius:20px;padding:4px 10px;font-size:11px;font-weight:600;color:'+col+'">'+e.label+' '+v+'</div>';
      });
      yHtml+='</div>';
      yEl.innerHTML=yHtml;
    }
  }

  // ── Suggestion ──
  buildSuggest();
}

// ── SUGGEST ──
const SPOOL=[
  // PRIORITÀ 1 — Crisi acute (scala >= 4 o azioni Sì)
  {prio:1,cond:d=>(d.scales?.sp>=3||d.scales?.ai>=3),icon:'◇',
   title:'TIP — cambia la chimica del corpo',
   desc:'La tua sofferenza sembra alta. TIP può calmarti rapidamente: acqua fredda sul viso, esercizio intenso, respirazione lenta.',
   guide:'tol',skill:'tip'},
  {prio:1,cond:d=>(d.scales?.se>=4||d.scales?.sf>=4),icon:'◍',
   title:'Acqua fredda sul viso',
   desc:'Immergi il viso in acqua fredda per 15-30 sec trattenendo il fiato. Il riflesso da immersione calma il sistema nervoso in pochi secondi.',
   guide:'tol',skill:'sensi'},
  {prio:1,cond:d=>(d.scales?.rab>=4||d.scales?.ai>=3),icon:'⊘',
   title:'STOP prima di agire',
   desc:'Quando senti un forte impulso, fermarti anche solo 5 secondi può cambiare tutto. STOP — fai un passo indietro — Osserva — Procedi mindfully.',
   guide:'tol',skill:'stop'},

  // PRIORITÀ 2 — Emozioni difficili (scala 2-3)
  {prio:2,cond:d=>(d.scales?.tri>=2||d.scales?.vuo>=2),icon:'✦',
   title:'Migliora il momento presente',
   desc:'Quando tristezza o vuoto sono presenti, MIGLIORA aiuta a rendere il momento più tollerabile con 7 strategie pratiche.',
   guide:'tol',skill:'migliora'},
  {prio:2,cond:d=>(d.scales?.ver>=2||d.scales?.col>=2),icon:'◉',
   title:'Rilassamento muscolare progressivo',
   desc:'Vergogna e colpa si tengono spesso nel corpo. Il rilassamento muscolare scioglie quella tensione e riduce l\'intensità emotiva.',
   guide:'tol',skill:'tip'},
  {prio:2,cond:d=>(d.scales?.pau>=2),icon:'◐',
   title:'Respira: 5 sec dentro, 7 fuori',
   desc:'Quando hai paura, rallentare il respiro attiva il sistema parasimpatico. Inspira 5 sec, espira 7 sec. Ripeti per 5 minuti.',
   guide:'tol',skill:'tip'},
  {prio:2,cond:d=>(d.scales?.rab>=2),icon:'⊘',
   title:'Controlla i fatti della rabbia',
   desc:'La rabbia spesso nasce da interpretazioni, non dai fatti. Chiediti: la situazione è davvero come la vedo? Ci sono spiegazioni alternative?',
   guide:'reg',skill:'rcheck'},
  {prio:2,cond:d=>(d.scales?.abb>=2),icon:'♥',
   title:'È normale avere dubbi sulla terapia',
   desc:'Avere pensieri di abbandonare il percorso fa parte del percorso stesso. L\'accettazione radicale può aiutarti a stare con questo disagio.',
   guide:'tol',skill:'accrad'},
  {prio:2,cond:d=>(d.texts?.rim&&d.texts?.rim.trim()),icon:'≈',
   title:'Accettazione radicale',
   desc:'Stai rimuginando su qualcosa. L\'accettazione radicale non significa approvare — significa smettere di lottare contro ciò che non puoi cambiare ora.',
   guide:'tol',skill:'accrad'},
  {prio:2,cond:d=>((d.scales?.ser||5)<=1&&(d.scales?.gio||5)<=1),icon:'◉',
   title:'Costruisci emozioni positive oggi',
   desc:'Serenità e gioia sono molto basse. Non aspettare che le emozioni positive arrivino — costruiscile attivamente con una piccola azione piacevole.',
   guide:'reg',skill:'rpositivo'},

  // PRIORITÀ 3 — Stato discreto, suggerimenti di crescita
  {prio:3,cond:d=>((d.scales?.ser||5)<=2||(d.scales?.gio||5)<=2),icon:'◉',
   title:'Coccola i tuoi sensi',
   desc:'Piccoli gesti sensoriali possono ricaricarti. L\'autoconsolazione attraverso i 5 sensi è semplice e immediata.',
   guide:'tol',skill:'sensi'},
  {prio:3,cond:d=>(d.scales?.fid<=2&&d.scales?.fid!=null),icon:'◐',
   title:'Mindfulness — mente saggia',
   desc:'Quando la fiducia nel cambiamento è bassa, connettiti con la tua mente saggia. Lei sa cose che la mente razionale ed emotiva da sole non vedono.',
   guide:'mind',skill:'msaggio'},

  // SUGGERIMENTI GENERALI (sempre mostrati come fallback)
  {prio:4,cond:()=>true,icon:'❀',
   title:'Cosa potresti fare di bello oggi?',
   desc:'Esplorare attività nuove costruisce la vita che vale la pena di essere vissuta. Dai un\'occhiata alle attività dei sensi o di MIGLIORA.',
   guide:'tol',skill:'sensi'},
  {prio:4,cond:()=>true,icon:'⬢',
   title:'Hai 10 minuti liberi?',
   desc:'Distrarsi non è evitare — è dare spazio alla mente. ACCETTA offre 7 strategie per spostare l\'attenzione dalla sofferenza.',
   guide:'tol',skill:'accept'},
  {prio:4,cond:()=>true,icon:'◉',
   title:'Ripassi le abilità DBT?',
   desc:'Usare le abilità anche nei momenti tranquilli le rende più accessibili quando servono davvero. Esplora la Guida DBT.',
   guide:'mind',skill:'mstati'},
  {prio:4,cond:()=>true,icon:'◐',
   title:'Un suono che ti calma',
   desc:'Musica, natura, silenzio. I suoni possono cambiare il tono emotivo di tutta una giornata. Provare per credere.',
   guide:'tol',skill:'sensi'},
  {prio:4,cond:()=>true,icon:'✦',
   title:'DEAR MAN — chiedi ciò che vuoi',
   desc:'Imparare a fare richieste e dire no efficacemente è una delle abilità più trasformative. Scopri la tecnica DEAR MAN.',
   guide:'inter',skill:'dearman'},
,
    {id:'dip',icon:'🔗',bg:'#F3E8FF',
     title:'Gestire le dipendenze',
     sub:'Abbandonare comportamenti dipendenti e gestire il craving',
     intro:'Sei dipendente quando sei incapace di interrompere un pattern di comportamento nonostante le conseguenze negative. Queste abilità aiutano a costruire e mantenere l\'astinenza, gestire il craving e prevenire le ricadute.',
     skills:[
       {id:'dastinenza',badge:'ASTINENZA',name:'Astinenza dialettica',
        desc:'Due obiettivi in tensione: impegnarsi al 100% per smettere, ma avere un piano per quando si ricade.',
        steps:[
          '<b>L\'obiettivo principale:</b> astinenza completa e permanente dal comportamento dipendente.',
          '<b>Ma se si ricade:</b> l\'obiettivo diventa minimizzare il danno e tornare all\'astinenza il prima possibile.',
          '<b>Come un atleta olimpico:</b> deve credere di poter vincere ogni gara, anche se ha perso in passato. Non si "prende una vacanza" dall\'astinenza — si è sempre astinenti o al lavoro per tornarci.',
          '<b>Programma l\'astinenza:</b> stai con persone che rinforzano la tua astinenza. Pianifica attività alternative. Annuncia pubblicamente che hai smesso.',
          '<b>Se ricadi:</b> non trasformare uno scivolone in un disastro. Chiama il tuo terapeuta. Liberati delle tentazioni. Riimpegnati al 100%.'
        ]},
       {id:'dmente',badge:'MENTE CHIARA',name:'Mente chiara — il posto più sicuro',
        desc:'Tra la mente dipendente e la mente pulita ingenua, la mente chiara è l\'equilibrio sicuro.',
        steps:[
          '<b>Mente dipendente:</b> sei sotto il controllo della dipendenza. Gli impulsi guidano pensieri, emozioni e comportamenti. Pericolosa.',
          '<b>Mente pulita ingenua:</b> sei pulita ma pensi "Non ho più un problema", "Posso controllarlo", "Mi faccio un po\'". Pericolosa quanto la mente dipendente.',
          '<b>Mente chiara:</b> sei pulita ma ricordi la mente dipendente. Accetti radicalmente che la ricaduta non è impossibile. Ti godi il successo mentre resti vigile.',
          '<b>Segnali di mente dipendente:</b> intraprendere comportamenti "irrilevanti" che in passato portavano alla dipendenza, rendere affascinante la dipendenza, mentire, isolarsi.',
          '<b>Come mantenerla:</b> goditi il successo, ma fai piani per le tentazioni. Stai con persone sobrie. Ripassa le abilità DBT regolarmente.'
        ]},
       {id:'dponti',badge:'PONTI',name:'Bruciare i ponti e costruirne di nuovi',
        desc:'Elimina le possibilità di ricaduta e crea nuove associazioni mentali contro il craving.',
        steps:[
          '<b>Bruciare i ponti:</b> impegnati in modo assoluto all\'astinenza. Poi elimina tutte le possibilità concrete di ricadere.',
          'Cancella i contatti di persone che alimentano la dipendenza. Elimina sostanze, oggetti, situazioni ad alto rischio.',
          'Dichiara apertamente a tutti di aver smesso. La trasparenza rende più difficile ricadere in segreto.',
          '<b>Costruire nuovi ponti:</b> il craving è legato a immagini vivide e odori. Costruisci immagini alternative — ogni volta che senti il craving, sostituisci mentalmente l\'immagine con qualcosa di diverso.',
          '<b>Surfa l\'impulso:</b> immagina di essere su una tavola da surf mentre cavalchi le onde del craving. Osservalo aumentare, diminuire e infine sparire. Non devi agire — devi solo sopravvivere all\'onda.'
        ]},
       {id:'dcomunita',badge:'COMUNITÀ',name:'Rinforzo della comunità',
        desc:'Costruire una rete di supporto che rinforzi i comportamenti sani invece di quelli dipendenti.',
        steps:[
          '<b>Stai con persone che supportano la tua astinenza.</b> Trascorri tempo con chi rinforza la tua sobrietà. Tieniti in contatto regolare con loro.',
          '<b>Pianifica attività alternative.</b> Sostituisci i momenti in cui di solito cedevi alla dipendenza con attività piacevoli e significative.',
          '<b>Trova un gruppo di supporto.</b> AA, NA, o altri gruppi offrono comunità, responsabilità e modelli positivi di comportamento.',
          '<b>Annuncia pubblicamente la tua intenzione.</b> Dirlo agli altri crea responsabilità sociale e rende più difficile tornare indietro in segreto.',
          '<b>Chiedi aiuto quando senti il craving.</b> Chiama il tuo terapeuta, uno sponsor, o una persona di fiducia. Non aspettare di essere già ricaduta.'
        ]},
       {id:'dribellione',badge:'RIBELLIONE',name:'Ribellione alternativa e negazione adattiva',
        desc:'Quando la dipendenza serve a ribellarsi o quando la mente non riesce a tollerare il craving.',
        steps:[
          '<b>Ribellione alternativa:</b> se usi la dipendenza per ribellarti o rompere le regole, trova modi alternativi non distruttivi. Tingiti i capelli. Tatuaggio. Esprimi opinioni impopolari. Compi atti di bontà inaspettati.',
          '<b>L\'obiettivo:</b> soddisfare il bisogno di ribellione senza compromettere i tuoi obiettivi.',
          '<b>Negazione adattiva:</b> quando la mente non riesce a tollerare il craving, non discutere con te stessa. Nega di volere quella cosa.',
          'Reinterpreta l\'impulso: "Non voglio una sigaretta, voglio uno stuzzicadenti aromatizzato." "Non voglio alcol, voglio qualcosa di dolce."',
          'Non è razionale — ma funziona perché dà alla mente qualcosa di alternativo su cui focalizzarsi mentre l\'impulso passa.'
        ]}
     ]},,
  {prio:4,cond:()=>true,icon:'◐',
   title:'Ripassi le abilità DBT?',
   desc:'Usare le abilità anche nei momenti tranquilli le rende più accessibili. Esplora la Guida DBT.',
   guide:'mind',skill:'mstati'},
  {prio:4,cond:()=>true,icon:'◐',
   title:'Un suono che ti calma',
   desc:'Musica, natura, silenzio. I suoni cambiano il tono emotivo della giornata.',
   guide:'tol',skill:'sensi'},
  {prio:4,cond:()=>true,icon:'❖',
   title:'DEAR MAN — chiedi ciò che vuoi',
   desc:'Imparare a fare richieste e dire no efficacemente è una delle abilità più trasformative.',
   guide:'inter',skill:'dearman'},
  {prio:4,cond:()=>true,icon:'◉',
   title:'Prova il mezzo sorriso',
   desc:'Il corpo comunica con la mente. Rilassa il viso e lascia che le labbra salgano leggermente.',
   guide:'tol',skill:'sorriso'},
  {prio:4,cond:()=>true,icon:'◦',
   title:'Mente saggia — cosa sa?',
   desc:'Siediti, respira e chiediti: nel profondo, cosa so che è giusto fare?',
   guide:'mind',skill:'msaggio'},
  {prio:4,cond:()=>true,icon:'▸',
   title:'Costruisci una vita degna',
   desc:'Ogni giorno un piccolo passo verso la vita che vuoi. Identifica un valore su cui lavorare.',
   guide:'gen',skill:'gvita'},
  {prio:3,cond:d=>d.scales&&(d.scales.col>=2||d.scales.ver>=2),icon:'○',
   title:'Azione opposta alla vergogna',
   desc:'Vergogna ci spinge a nasconderci. L’azione opposta è mostrarsi, non nascondersi.',
   guide:'reg',skill:'razione'},
  {prio:3,cond:d=>d.scales&&d.scales.rab>=2,icon:'⊘',
   title:'GIVE — mantieni la relazione',
   desc:'Quando sei arrabbiata con qualcuno, GIVE aiuta a gestire la situazione senza danneggiare il legame.',
   guide:'inter',skill:'give'},
  {prio:3,cond:d=>d.texts&&d.texts.alcu&&d.texts.alcu.trim(),icon:'●',
   title:'Analizza cosa ha scatenato il comportamento',
   desc:'Capire la catena di eventi che ha portato all’uso di alcol è il primo passo per cambiarlo.',
   guide:'gen',skill:'gcatena'}


];
function openDbtSkill(id){
  goPage('attivita',null);
  setTimeout(()=>{
    const t=document.querySelectorAll('.act-tab')[0];
    if(t)switchActTab('dbt',t);
    setTimeout(()=>{
      const b=document.getElementById('dbt-body-'+id);
      if(b){b.classList.add('open');b.scrollIntoView({behavior:'smooth',block:'center'});}
    },150);
  },100);
}
function switchToActTab(tab){
  const tabMap={dbt:0,vista:1,udito:2,olfatto:3,gusto:4,tatto:5,distrarsi:6,migliora:7};
  goPage('attivita',null);
  setTimeout(()=>{
    const tabs=document.querySelectorAll('.act-tab');
    const idx=tabMap[tab]||0;
    if(tabs[idx])switchActTab(tab,tabs[idx]);
  },100);
}
function buildSuggest(){
  const box=document.getElementById('home-suggest-box');if(!box)return;
  const k=today();
  const d=allData[k]||{scales:{},toggles:{},texts:{}};
  // Sort by priority: lower number = higher priority
  const matching=SPOOL.filter(s=>{try{return s.cond(d)}catch(e){return false}})
    .sort((a,b)=>(a.prio||4)-(b.prio||4));
  if(!matching.length){box.innerHTML='';return;}
  const idx=parseInt(localStorage.getItem('sg_'+k)||'0');
  const pick=matching[idx%matching.length];
  const action=pick.guide?`openGuideSkill('${pick.guide}','${pick.skill||''}')`:(pick.skill?`openDbtSkill('${pick.skill}')`:'goPage("attivita",null)');
  const rotBtn=matching.length>1?`<button style="background:none;border:none;font-size:12px;color:#7A5010;cursor:pointer;font-family:inherit;padding:4px 0;text-decoration:none;font-weight:600" onclick="rotateSuggest('${k}',${matching.length})">↻ Altro</button>`:'';
  box.innerHTML='<div class="suggest-card"><div class="s-icon">'+pick.icon+'</div><div style="flex:1"><h3>'+pick.title+'</h3><p>'+pick.desc+'</p><div style="display:flex;gap:8px;margin-top:10px;align-items:center;flex-wrap:wrap"><button class="s-btn" onclick="'+action+'">Scopri →</button>'+rotBtn+'</div></div></div>';
}
function rotateSuggest(k,total){
  localStorage.setItem('sg_'+k,String((parseInt(localStorage.getItem('sg_'+k)||'0')+1)%total));
  buildSuggest();
}

