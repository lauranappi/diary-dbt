// Dai nomi brevi della spunta quotidiana alle abilita' della Guida.
// Le due liste usano diciture diverse ('Controllare i fatti' contro
// 'CONTROLLA'), quindi la corrispondenza va dichiarata.
const ABILITA_GUIDA = {
  "Mente saggia": "msaggio",
  "Osservare": "mcosa",
  "Descrivere": "mcosa",
  "Partecipare": "mcosa",
  "Non giudicare": "mcome",
  "Stare focalizzato": "mcome",
  "Fare ciò che funziona": "mcome",
  "Identificare emozioni": "rperche",
  "Controllare i fatti": "rcheck",
  "PLEASE": "rplease",
  "Mastery": "rmastery",
  "Cope ahead": "restreme",
  "Strutturare tempo": "rpositivo",
  "Obiettivi a lungo termine": "rvalori",
  "Azione opposta": "razione",
  "Problem solving": "rproblem",
  "Priorità nelle relazioni": "ifermezza",
  "DEAR MAN": "dearman",
  "GIVE": "give",
  "FAST": "fast",
  "Frasi automotivanti": "autoincor",
  "TIP": "tip",
  "STOP": "stop",
  "Distrazione/auto-consolazione": "accept",
  "Pro e contro": "procontro",
  "Accettazione radicale": "accrad",
  "Mezzo sorriso": "sorriso",
  "Disponibilità": "disponibilita",
  "Rinforzi positivi": "idialettica",
  "Validare se stessi": "ivalida",
  "Validare qualcun altro": "ivalida",
  "Pensiero dialettico": "idialettica",
  "Agire dialettico": "isentiero"
};
const MODULO_DI_ABILITA = {
  "msaggio": "mind",
  "mcosa": "mind",
  "mcome": "mind",
  "memozioni": "mind",
  "mpensieri": "mind",
  "mrespiro": "mind",
  "mstati": "mind",
  "rperche": "reg",
  "rcheck": "reg",
  "razione": "reg",
  "rplease": "reg",
  "rabc": "reg",
  "rmastery": "reg",
  "rproblem": "reg",
  "rvalori": "reg",
  "restreme": "reg",
  "rpositivo": "reg",
  "dearman": "inter",
  "ifermezza": "inter",
  "give": "inter",
  "fast": "inter",
  "idialettica": "inter",
  "isentiero": "inter",
  "ivalida": "inter",
  "imiti": "inter",
  "stop": "tol",
  "tip": "tol",
  "procontro": "tol",
  "accept": "tol",
  "sensi": "tol",
  "migliora": "tol",
  "sorriso": "tol",
  "accrad": "tol",
  "disponibilita": "tol",
  "autoincor": "tol"
};

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
  if(t.sa==='Sì')flags.push({cls:'flag-danger',label:'Azione suicidaria'});
  if(s.sp>=3)flags.push({cls:'flag-danger',label:'Pensieri suic. '+s.sp});
  if(t.aa==='Sì')flags.push({cls:'flag-danger',label:'Azione autolesività'});
  if(s.ai>=3)flags.push({cls:'flag-warn',label:'Autolesività '+s.ai});
  if(tx.alcu&&tx.alcu.trim())flags.push({cls:'flag-warn',label:tx.alcu});
  if(tx.cbdu&&tx.cbdu.trim())flags.push({cls:'flag-info',label:'CBD: '+tx.cbdu});
  if(t.ee==='Sì')flags.push({cls:'flag-warn',label:'Emotional eating'});
  if(s.rap>0)flags.push({cls:'flag-info',label:'Rapporti: '+s.rap});
  if(t.farm==='Sì')flags.push({cls:'flag-ok',label:'Farmaci'});
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
  wideEl.style.cssText='grid-column:1/-1;background:var(--dc-hero);border:0;border-radius:26px;padding:22px;display:flex;align-items:center;gap:18px;margin-bottom:4px';
  const totGiorni = storicoRange===0 ? keys.length : storicoRange;
  wideEl.innerHTML='<img class="dc-cerchi-storico" src="illustrazioni/decorative/deco-cerchi-chiaro.svg" alt="">'
    +'<span style="font-size:44px;font-weight:800;letter-spacing:-.04em;color:var(--dc-senape);line-height:1;position:relative">'+keys.length+'</span><span style="font-size:13.5px;font-weight:500;color:var(--dc-hero-ink);line-height:1.4;position:relative">giorni compilati<br>su '+totGiorni+'</span>';
  sg.appendChild(wideEl);
  // Pairs
  const pairs=[
    [{l:'Az. suicidarie',v:nSuic,danger:nSuic>0},{l:'Az. autolesività',v:nAuto,danger:nAuto>0}],
    [{l:'Giorni alcol',v:nAlcol,warn:nAlcol>0},{l:'Giorni CBD',v:nCbd,warn:nCbd>0}],
    [{l:'Emotional eating',v:nEe,warn:nEe>0},{l:'Farmaci saltati',v:nFarmSalt,warn:nFarmSalt>0,ok:nFarmSalt===0}],
    [{l:'Rapporti occ.',v:nRap,neutral:true},{l:'Abilità DBT',v:keys.reduce((acc,k)=>acc+Object.keys(allData[k].skills||{}).filter(s=>allData[k].skills[s]).length,0),ok:true}]
  ];
  pairs.forEach(pair=>{
    pair.forEach(c=>{
      const isDanger=c.danger&&c.v>0,isWarn=c.warn&&c.v>0,isOk=c.ok&&c.v>0;
      // Verde per le cose positive (l'assenza di un rischio, un'abilita'
      // usata), rosso per quelle negative, scuro neutro per il resto.
      const col=isDanger?'#B5473F':isWarn?'#B5473F':isOk?'#3D6B45':(c.v===0?'var(--dc-muted)':'var(--dc-ink)');
      const div=document.createElement('div');div.className='sc';
      div.style.cssText='background:var(--dc-surface);border-radius:var(--dc-radius-interno);padding:14px 16px;display:flex;flex-direction:column;align-items:center;text-align:center;gap:3px';
      div.innerHTML='<div class="sv" style="color:'+col+';font-size:24px;font-weight:800">'+c.v+'</div><div class="sl" style="font-size:11.5px;line-height:1.3">'+c.l+'</div>';
      sg.appendChild(div);
    });
  });
  const hl=document.getElementById('hlist');hl.innerHTML='';
  if(!keys.length){hl.innerHTML='<div style="color:#aaa;font-size:14px;padding:1rem 0">Nessun giorno compilato ancora.</div>';return}
  keys.forEach(k=>{
    const d=allData[k];const item=document.createElement('div');item.className='hi';
    const flags=buildFlags(d);
    item.innerHTML='<div style="flex:1"><div class="hd">'+fmtS(k)+'</div><div class="flags">'+flags+'</div></div>'
    +'<svg width="11" height="19" viewBox="0 0 11 19" fill="none" style="flex:none"><path d="M2.5 2.5L8 9.5L2.5 16.5" stroke="var(--dc-muted)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
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

  mkApex('cSuic1',[{name:'Pensieri suicidari',data:sv('sp')},{name:'Azione suicidaria',data:tv('sa')}],['#C1714A','#123534']);
  mkApex('cSuic2',[{name:'Intenzione autolesività',data:sv('ai')},{name:'Azione autolesività',data:tv('aa')}],['#C1714A','#123534']);
  mkApex('cSost',[{name:'Intenzione alcol',data:sv('alci')},{name:'Intenzione CBD',data:sv('cbdi')}],['#F5CE47','#1B4B4A']);
  mkApex('cEmoEat',[{name:'Emotional eating',data:tv('ee')}],['#F5CE47'],1);
  mkApex('cEmoPos',[{name:'Serenità',data:sv('ser')},{name:'Gioia',data:sv('gio')}],['#1B4B4A','#F5CE47']);
  mkApex('cEmoNeg1',[{name:'Tristezza',data:sv('tri')},{name:'Paura',data:sv('pau')},{name:'Rabbia',data:sv('rab')}],['#1B4B4A','#C1714A','#8A4A30']);
  mkApex('cEmoNeg2',[{name:'Vergogna',data:sv('ver')},{name:'Colpa',data:sv('col')},{name:'Vuoto',data:sv('vuo')},{name:'Sof. emotiva',data:sv('se')}],['#8FB5B0','#2A6866','#123534','#C1714A']);
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
  // Il terapeuta ha una panoramica diversa: pazienti e materiale, non il
  // proprio diario (che non compila).
  const th=document.getElementById('terap-home');
  const isTerap = typeof profile!=='undefined' && profile.role==='terapeuta';
  if(th) th.style.display = isTerap ? 'block' : 'none';
  // Nasconde ogni blocco della Home paziente quando il ruolo e' terapeuta.
  // Elenco esplicito: piu' prevedibile del selettore sui figli diretti, che
  // dipende dalla struttura del markup e cambia se si aggiunge un contenitore.
  // hidden invece di style.display: impostare display a stringa vuota
  // cancellava le disposizioni scritte nel markup (es. display:grid).
  document.querySelectorAll('#page-home > *').forEach(el=>{
    if(el.id==='terap-home') return;
    el.hidden = isTerap;
    // hidden da solo ha una specificita' bassa: se una qualsiasi regola
    // altrove imposta display su questi elementi (anche senza !important),
    // lo vince e restano visibili. Lo stile diretto vince sempre di piu'.
    el.style.display = isTerap ? 'none' : '';
  });
  if(isTerap){ buildTherapistHome(); return; }
  setTimeout(dcHome, 0);   // resa conforme al documento di design
  // renderDesktopHome() e buildSuggest() vanno nello stesso setTimeout,
  // in quest'ordine: buildSuggest() cerca #desktop-suggest-box, che
  // renderDesktopHome() crea - se girassero separati, buildSuggest()
  // arriverebbe prima che quell'elemento esista.
  setTimeout(()=>{ renderDesktopHome(); buildSuggest(); }, 0);
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
   guide:'tol',skill:'tip'},
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
const GUIDE_INFO={
  tol:  {nome:'Tolleranza',icona:'modulo-tolleranza'},
  reg:  {nome:'Regolazione emotiva',icona:'modulo-regolazione'},
  inter:{nome:'Interpersonale',icona:'modulo-interpersonale'},
  mind: {nome:'Mindfulness',icona:'modulo-mindfulness'},
  gen:  {nome:'Strumenti generali',icona:'strumenti-generali'}
};
function buildSuggest(){
  const k=today();
  const d=allData[k]||{scales:{},toggles:{},texts:{}};
  const matching=SPOOL.filter(s=>{try{return s.cond(d)}catch(e){return false}})
    .sort((a,b)=>(a.prio||4)-(b.prio||4));
  const idx=parseInt(localStorage.getItem('sg_'+k)||'0');
  const contenuto = box => {
    if(!matching.length){box.innerHTML='';box.style.display='none';return;}
    box.style.display='';
    const pick=matching[idx%matching.length];
    const gi=GUIDE_INFO[pick.guide]||{nome:'DBT',icona:'strumenti-generali'};
    const action=pick.guide?`openGuideSkill('${pick.guide}','${pick.skill||''}')`:(pick.skill?`openDbtSkill('${pick.skill}')`:'goPage("attivita",null)');
    const rotBtn=matching.length>1?'<button class="dc-skill-altro" onclick="event.stopPropagation();rotateSuggest(\''+k+'\','+matching.length+')">↻ Altro</button>':'';
    box.setAttribute('onclick', action);
    box.innerHTML =
        '<img class="dc-skill-deco" src="illustrazioni/decorative/deco-macchia-petrolio.svg" alt="">'
      +'<div class="dc-skill-riga">'
        +'<img src="illustrazioni/miniature/'+gi.icona+'.svg" width="46" height="46" class="dc-skill-icona" alt="">'
        +'<div class="dc-skill-in">'
          +'<span style="font-size:11.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#C1714A">Abilità di oggi</span>'
          +'<span style="font-family:\'Plus Jakarta Sans\',system-ui,sans-serif;font-size:18px;line-height:1.15;color:#14201F">'+pick.title+'</span>'
          +'<span class="dc-skill-desc">'+pick.desc+'</span>'
          +'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:4px">'
            +'<span style="background:#F0F5F4;color:#1B4B4A;font-size:11px;font-weight:600;padding:6px 11px;border-radius:999px">'+gi.nome+'</span>'
            +'<span style="border:1px solid #C1714A;color:#C1714A;font-size:11px;font-weight:600;padding:6px 11px;border-radius:999px">3 min</span>'
          +'</div>'
        +'</div>'
      +'</div>'
      +'<div class="dc-skill-azioni">'+rotBtn+'</div>';
  };
  const box=document.getElementById('home-suggest-box');if(box)contenuto(box);
  const boxD=document.getElementById('desktop-suggest-box');if(boxD)contenuto(boxD);
}
function rotateSuggest(k,total){
  localStorage.setItem('sg_'+k,String((parseInt(localStorage.getItem('sg_'+k)||'0')+1)%total));
  buildSuggest();
}



// ════════════════════════════════════════════════════════════════
// HOME — resa conforme al documento di design
// Riempie la struttura ricostruita: saluto, barre di ieri, abilita'
// del giorno su fondo senape, colonne dei sette giorni.
// ════════════════════════════════════════════════════════════════
function dcAbilitaOggi(){
  const box=document.getElementById('home-suggest-box');
  if(!box || typeof SKG==='undefined') return;

  // SKG e' un elenco di GRUPPI ({g, it:[...]}): va appiattito, altrimenti
  // si legge un nome che non esiste e resta sempre la stessa abilita'.
  const tutte=[];
  SKG.forEach(gr=>(gr.it||[]).forEach(nome=>tutte.push({nome, gruppo:gr.g})));
  if(!tutte.length) return;

  // rotazione giornaliera: cambia ogni giorno e resta uguale entro la giornata
  const inizioAnno=new Date(new Date().getFullYear(),0,0);
  const giorno=Math.floor((new Date()-inizioAnno)/86400000);
  const scelta=tutte[giorno % tutte.length];

  // il modulo della Guida a cui appartiene, per aprirla nel punto giusto
  const skId = ABILITA_GUIDA[scelta.nome] || '';
  const mod  = MODULO_DI_ABILITA[skId] || '';
  box.setAttribute('onclick', skId ? "apriAbilitaGuida('"+mod+"','"+skId+"')" : "goPage('guida',null)");
  box.innerHTML =
    '<img class="dc-skill-deco" src="illustrazioni/decorative/deco-macchia-petrolio.svg" alt="">'
   +'<div class="dc-skill-in">'
     +'<span style="font-size:11.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#C1714A">Abilità di oggi</span>'
     +'<span class="dc-skill-nome">'+scelta.nome+'</span>'
     +'<span class="dc-skill-desc">'+scelta.gruppo+'</span>'
   +'</div>';
}

// Apre la Guida sul modulo dell'abilita' del giorno, non in cima all'elenco.
function apriAbilitaGuida(modId, skId){
  goPage('guida',null);
  // goPage() programma un riallineamento forzato in cima alla pagina fino
  // a 250ms dopo la navigazione (contro il ripristino di scorrimento di
  // iOS). Se apriamo il modulo e vi scorriamo sopra prima di quel punto,
  // il riallineamento vince e riporta tutto in cima: bisogna agire dopo.
  setTimeout(()=>{
    const corpo=document.getElementById('body-'+modId);
    if(corpo && !corpo.classList.contains('open') && typeof toggleGuideModule==='function'){
      toggleGuideModule(modId);
    }
    const vaiEEvidenzia=()=>{
      const passi=document.getElementById('steps-'+skId);
      if(passi && !passi.classList.contains('open') && typeof toggleGuideSkill==='function'){
        toggleGuideSkill(skId);
      }
      const bersaglio = passi ? passi.closest('.guide-skill') : corpo;
      if(!bersaglio) return;
      bersaglio.scrollIntoView({behavior:'smooth', block:'center'});
      bersaglio.classList.add('dc-evidenzia');
      setTimeout(()=>bersaglio.classList.remove('dc-evidenzia'), 2000);
    };
    // apre subito, per non far vedere la pagina ferma...
    vaiEEvidenzia();
    // ...e ripete dopo l'ultimo riallineamento forzato di goPage (250ms),
    // cosi' anche sui dispositivi piu' lenti lo scorrimento giusto vince
    // sempre per ultimo.
    setTimeout(vaiEEvidenzia, 380);
  }, 300);
}

function dcHome(){
  // dcAbilitaOggi() rimossa: buildSuggest(), gia' chiamata da buildHome(),
  // sceglie in base a cosa e' successo oggi davvero, non a rotazione cieca.
  if(typeof profile!=='undefined' && profile.role==='terapeuta') return;
  const oggi = today();
  const d = allData[oggi];
  const compilata = d && !isDayEmpty(d);
  const ora = new Date().getHours();

  // intestazione
  const salEl = document.getElementById('home-date');
  const nomeEl = document.getElementById('home-greeting');
  const subEl = document.getElementById('home-pill-row');
  if(salEl) salEl.textContent = ora<5?'Notte fonda':ora<12?'Buongiorno':ora<17?'Buon pomeriggio':ora<21?'Buonasera':'Buonanotte';
  if(nomeEl) nomeEl.textContent = profile.nome || '';
  if(subEl) subEl.textContent = compilata
      ? 'La diary di oggi è compilata. Puoi rivederla quando vuoi.'
      : 'La diary di oggi non è ancora compilata. Ci vogliono due minuti.';
  const cta = document.querySelector('.dc-cta');
  if(cta) cta.textContent = compilata ? 'Rivedi la diary' : 'Compila la diary';

  // barre delle emozioni di ieri
  const yEl = document.getElementById('home-emo-yesterday');
  if(yEl){
    const ieri = new Date(); ieri.setDate(ieri.getDate()-1);
    const e = allData[dk(ieri)];
    const scale = (e && e.scales) || {};
    // Le emozioni piu' alte di ieri, non un trio fisso: cosi' la scheda
    // mostra davvero cosa e' successo invece di ripetere sempre le
    // stesse tre etichette. sp/ai restano fuori: dati delicati che
    // meritano il contesto del Diary o dello Storico, non una vista rapida.
    const ETICHETTE = {ser:'Serenità',gio:'Gioia',pau:'Paura',rab:'Rabbia',tri:'Tristezza',
      ver:'Vergogna',col:'Colpa',vuo:'Vuoto',sf:'Sofferenza fisica',se:'Sofferenza emotiva',
      abb:'Abbandonare la terapia',fid:'Fiducia nel cambiamento'};
    const righe = Object.keys(ETICHETTE)
      .map(k=>({nome:ETICHETTE[k], val: scale[k]}))
      .filter(r=>r.val!=null)
      .sort((x,y)=>y.val-x.val)
      .slice(0,3);
    yEl.innerHTML = righe.length
      ? righe.map(r=>'<div class="dc-bar-row">'
          +'<span class="dc-bar-nome">'+r.nome+'</span>'
          +'<span class="dc-bar-track"><i class="dc-bar-fill" style="width:'+((r.val/5)*100)+'%"></i></span>'
          +'<span class="dc-bar-val">'+r.val+'</span></div>').join('')
      : '<div style="font-size:12.5px;color:var(--muted)">Nessuna diary ieri.</div>';
  }

  // colonne dei sette giorni
  // Serie di giorni consecutivi compilati, terminante oggi o ieri
  // (compilare oggi non deve azzerare la serie di ieri se non l'hai
  // ancora fatto): mai calcolata finora, l'elemento restava fisso a 0.
  // Badge sulla voce Diary della barra laterale (solo se non completa)
  const badgeEl = document.getElementById('ni-badge-oggi');
  if(badgeEl){
    const scaleOk = d ? Object.values(d.scales||{}).filter(x=>x!=null).length : 0;
    const togOk = d ? Object.values(d.toggles||{}).filter(x=>x!=null).length : 0;
    const fatte = scaleOk+togOk;
    if(fatte>0 && fatte<22){ badgeEl.textContent=fatte+'/22'; badgeEl.style.display='inline-block'; }
    else { badgeEl.style.display='none'; }
  }

  const streakEl = document.getElementById('streak-num');
  if(streakEl){
    let n=0, cursore=new Date();
    if(!compilata){ cursore.setDate(cursore.getDate()-1); }
    while(true){
      const voce=allData[dk(cursore)];
      if(!voce || isDayEmpty(voce)) break;
      n++;
      cursore.setDate(cursore.getDate()-1);
    }
    streakEl.textContent=n;
  }

  const tl = document.getElementById('home-timeline');
  if(tl){
    const lettere=['L','M','M','G','V','S','D'];
    let out='<div class="dc-week">';
    for(let i=6;i>=0;i--){
      const gg=new Date(); gg.setDate(gg.getDate()-i);
      const voce=allData[dk(gg)];
      const piena=voce && !isDayEmpty(voce);
      const somma=piena ? Object.values(voce.scales||{}).filter(x=>x!=null).reduce((s,x)=>s+x,0) : 0;
      const h=piena ? Math.max(14, Math.min(44, 14 + somma*1.1)) : 8;
      const oggiQ = i===0;
      out+='<div class="dc-week-col">'
         +'<span class="dc-week-bar'+(piena?(oggiQ?' oggi':''):' vuota')+'" style="height:'+h+'px"></span>'
         +'<span class="dc-week-d">'+lettere[(gg.getDay()+6)%7]+'</span></div>';
    }
    tl.innerHTML = out+'</div>';
  }
}

// ── HOME DESKTOP ─────────────────────────────────────────────────────────
// Layout a colonne dal documento del progetto (Desktop Diary Card.dc.html):
// intestazione, scheda stato-diary + Costanza affiancate, Abilita' di oggi.
// Prima versione: rimanda alla Diary vera per la compilazione, non la
// incorpora ancora riga per riga - quella e' un lavoro a se'.
function renderDesktopHome(){
  const box=document.getElementById('desktop-home');
  if(!box) return;
  if(typeof profile!=='undefined' && profile.role==='terapeuta') return;

  const oggi=today();
  const d=allData[oggi]||{scales:{},toggles:{}};
  const compilata=allData[oggi] && !isDayEmpty(allData[oggi]);
  const ora=new Date().getHours();
  const saluto=ora<5?'Notte fonda':ora<12?'Buongiorno':ora<17?'Buon pomeriggio':ora<21?'Buonasera':'Buonanotte';

  let n=0, cursore=new Date();
  if(!compilata){ cursore.setDate(cursore.getDate()-1); }
  while(true){
    const voce=allData[dk(cursore)];
    if(!voce || isDayEmpty(voce)) break;
    n++; cursore.setDate(cursore.getDate()-1);
  }
  let record=0, correnti=0;
  Object.keys(allData).sort().forEach(k=>{
    if(allData[k] && !isDayEmpty(allData[k])){ correnti++; record=Math.max(record,correnti); }
    else { correnti=0; }
  });
  record=Math.max(record,n);

  const scaleOk=Object.values(d.scales||{}).filter(x=>x!=null).length;
  const togOk=Object.values(d.toggles||{}).filter(x=>x!=null).length;
  const fatte=scaleOk+togOk, totale=22;

  const RAPIDE=[['ser','Serenità'],['gio','Gioia'],['pau','Paura'],['rab','Rabbia'],['tri','Tristezza'],['ver','Vergogna']];
  const rapideHtml=RAPIDE.map(([k,nome])=>{
    const val=d.scales?d.scales[k]:null;
    const celle=[0,1,2,3,4,5].map(nn=>{
      const on=val===nn;
      return '<button onclick="dcDeskCella(\''+k+'\','+nn+')" style="flex:1;min-width:0;height:42px;min-height:42px;border:0;border-radius:15px;font-weight:600;cursor:pointer;background:'+(on?'var(--dc-hero)':'var(--dc-cella)')+';color:'+(on?'var(--dc-hero-ink)':'var(--dc-terra-ink)')+'">'+nn+'</button>';
    }).join('');
    return '<div style="display:flex;flex-direction:column;gap:8px"><span style="font-size:13.5px;font-weight:600;color:var(--dc-ink)">'+nome+'</span><div style="display:flex;gap:6px">'+celle+'</div></div>';
  }).join('');

  const pallini=Array.from({length:14},(_,i)=>'<span style="width:9px;height:9px;min-width:9px;flex-shrink:0;border-radius:999px;background:'+(i<Math.min(n,14)?'var(--dc-hero)':'var(--dc-line)')+'"></span>').join('');

  const gruppiHtml=SKG.map(g=>{
    const righe=g.it.map(item=>{
      const sid='sk_'+g.g+'_'+item;
      const on=!!(d.skills&&d.skills[sid]);
      const tick=on?'<svg width="12" height="12" viewBox="0 0 13 13" fill="none"><path d="M2 7L5 10L11 3" stroke="var(--dc-nero)" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round"/></svg>':'';
      return '<button onclick="dcDeskSkill(\''+sid+'\')" style="display:flex;align-items:center;gap:12px;border:0;background:transparent;padding:6px 0;cursor:pointer;text-align:left;width:100%"><span style="width:24px;height:24px;border-radius:8px;flex:none;display:flex;align-items:center;justify-content:center;background:'+(on?'var(--dc-senape)':'var(--dc-cella)')+'">'+tick+'</span><span style="font-size:14px;font-weight:'+(on?600:500)+';color:var(--dc-ink)">'+item+'</span></button>';
    }).join('');
    return '<div style="display:flex;flex-direction:column;gap:6px"><span class="dc-desk-card-kicker">'+g.g+'</span>'+righe+'</div>';
  }).join('');

  box.innerHTML =
    '<div class="dc-desk-hero">'
      +'<img src="illustrazioni/decorative/deco-ramo-chiaro.svg" alt="" class="dc-desk-hero-deco">'
      +'<svg class="dc-onda" viewBox="0 0 390 40" preserveAspectRatio="none"><path d="M0 13C52 33 104 3 156 13C208 23 260 -1 312 8C342 13 368 19 390 15V41H0V13Z"></path></svg>'
      +'<div class="dc-desk-hero-riga">'
        +'<div>'
          +'<span class="dc-desk-hero-data">'+new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'})+'</span>'
          +'<h1 class="dc-desk-hero-tit">'+saluto+(profile.nome?', '+profile.nome:'')+'</h1>'
          +'<p class="dc-desk-hero-sub">Un colpo d\'occhio sulla giornata e sugli ultimi quattordici giorni.</p>'
        +'</div>'
        +'<button class="dc-desk-hero-cta" onclick="goPage(\'oggi\',null)">'+(compilata?'Rivedi la diary':'Compila la diary')+'</button>'
      +'</div>'
    +'</div>'
    +'<div class="dc-desk-riga">'
      +'<div class="dc-desk-card" style="flex:2 1 420px">'
        +'<div style="display:flex;align-items:baseline;gap:12px;flex-wrap:wrap">'
          +'<span class="dc-desk-card-tit" style="flex:1">Diary di oggi</span>'
          +'<span style="font-size:13px;color:var(--dc-muted)">'+(fatte===0?'non iniziata':fatte+' voc'+(fatte===1?'e':'i')+' su '+totale)+'</span>'
        +'</div>'
        +'<div style="height:10px;border-radius:999px;background:var(--dc-line);overflow:hidden;margin:14px 0 18px">'
          +'<div style="height:100%;width:'+Math.max(2,(fatte/totale)*100)+'%;background:var(--dc-terracotta);border-radius:999px"></div>'
        +'</div>'
        +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:16px 20px;margin-bottom:18px">'+rapideHtml+'</div>'
        +'<button class="dc-desk-btn-secondario" onclick="goPage(\'oggi\',null)">Apri la diary completa</button>'
      +'</div>'
      +'<div class="dc-desk-card" style="flex:0 1 260px;max-width:260px">'
        +'<span class="dc-desk-card-kicker">Costanza</span>'
        +'<div style="display:flex;align-items:flex-end;gap:10px;margin:6px 0 10px">'
          +'<span class="dc-desk-streak-num">'+n+'</span>'
          +'<span style="font-size:13px;color:var(--dc-muted);padding-bottom:4px">giorni<br>di fila</span>'
        +'</div>'        +'<div style="display:flex;align-items:center;gap:4px;flex-wrap:wrap;margin-bottom:14px">'+pallini+'</div>'
        +'<span style="font-size:13px;color:var(--dc-muted);line-height:1.5">'+(record>n?'Il tuo record è '+record+' giorni.':'Questo è il tuo record.')+'</span>'
      +'</div>'
    +'</div>'
    +'<div id="desktop-suggest-box" class="dc-desk-card" onclick="goPage(\'guida\',null)" style="cursor:pointer;background:#FFFFFF"></div>'
    +'<div class="dc-desk-card" style="margin-top:1.5rem">'
      +'<span class="dc-desk-card-tit">Abilità usate oggi</span>'
      +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px 28px;margin-top:16px;max-width:900px">'+gruppiHtml+'</div>'
    +'</div>';
}


function dcDeskCella(campo, val){
  const oggi=today();
  if(!allData[oggi]) allData[oggi]={scales:{},toggles:{},texts:{}};
  if(!allData[oggi].scales) allData[oggi].scales={};
  allData[oggi].scales[campo]=Number(val);
  svLS(); if(typeof pushChan==='function')pushChan();
  renderDesktopHome(); buildSuggest();
}
function dcDeskSkill(sid){
  const oggi=today();
  if(!allData[oggi]) allData[oggi]={scales:{},toggles:{},texts:{}};
  if(!allData[oggi].skills) allData[oggi].skills={};
  allData[oggi].skills[sid]=!allData[oggi].skills[sid];
  svLS(); if(typeof pushChan==='function')pushChan();
  renderDesktopHome(); buildSuggest();
}
