// ════════════════════════════════════════════════════════════════
// FOGLI DI LAVORO COMPILABILI — un motore, tante schede
// ════════════════════════════════════════════════════════════════
// Ogni foglio e' una definizione (campi in parole nostre, ispirati alle
// schede del manuale). Si compila, si salva con la data su questo
// dispositivo e viaggia verso la terapeuta insieme agli altri fogli
// (vedi raccogliFogli in forms.js). Chiave di archiviazione: fg_<id>.

function _T(k,l,ph){ return {k:k,l:l,tipo:'t',ph:ph||''}; }
function _A(k,l,ph){ return {k:k,l:l,tipo:'a',ph:ph||''}; }
function _S(k,l){ return {k:k,l:l,tipo:'s'}; }
function _C(k,l,o){ return {k:k,l:l,tipo:'c',o:o}; }
function _R(k,l,o){ return {k:k,l:l,tipo:'r',o:o}; }
function _H(h){ return {h:h}; }

const FG_FOGLI = [
 // ── MINDFULNESS ──
 {id:'m-abilita', mod:'mind', t:'Diario delle abilità di mindfulness', sub:'Quale abilità, cosa hai notato',
  intro:'Dopo una pratica, anche breve, scrivi come è andata.',
  c:[_C('ab','Quali abilità hai praticato?',['Mente saggia','Osservare','Descrivere','Partecipare','Non giudicare','Una cosa per volta','Efficacia']),
     _A('cosa','Cosa stavi facendo?'), _A('nota','Cosa hai notato? (corpo, pensieri, emozioni)'),
     _S('util','Quanto è stata utile? (0-100)'), _A('dopo','Cosa proverai la prossima volta?')]},
 {id:'m-piacevoli', mod:'mind', t:'Diario di un evento piacevole', sub:'Esserci mentre accade',
  intro:'Scegli un momento piacevole di oggi e descrivilo con attenzione.',
  c:[_T('ev','Cosa è successo?'), _R('pres','Eri presente mentre accadeva?',['Sì, molto','In parte','Poco']),
     _A('corpo','Cosa sentivi nel corpo?'), _A('emo','Che emozioni c’erano?'),
     _A('pens1','Che pensieri avevi durante?'), _A('pens2','Che pensieri hai adesso, ripensandoci?')]},
 {id:'m-spiacevoli', mod:'mind', t:'Diario di un evento spiacevole', sub:'Osservare senza fuggire',
  intro:'Scegli un momento difficile di oggi e descrivilo senza giudicarti.',
  c:[_T('ev','Cosa è successo?'), _R('pres','Eri presente mentre accadeva?',['Sì, molto','In parte','Poco']),
     _A('corpo','Cosa sentivi nel corpo?'), _A('emo','Che emozioni c’erano?'),
     _A('pens1','Che pensieri avevi durante?'), _A('pens2','Che pensieri hai adesso, ripensandoci?')]},
 {id:'m-fare-essere', mod:'mind', t:'Mente del fare e mente dell’essere', sub:'Cercare l’equilibrio',
  intro:'La mente del fare risolve, organizza, agisce. La mente dell’essere sente e sta. Serve l’equilibrio.',
  c:[_T('sit','Situazione'), _R('quale','Quale mente prevaleva?',['Del fare','Dell’essere','Un mix']),
     _A('segnale','Da cosa te ne sei accorta?'), _A('bil','Cosa hai fatto per bilanciare?'), _A('esito','Com’è andata?')]},
 {id:'m-sentiero', mod:'mind', t:'Sentiero di mezzo', sub:'Due cose vere insieme',
  intro:'Cerca il punto di incontro tra due posizioni che sembrano opposte.',
  c:[_T('sit','Situazione'), _T('polo1','Primo polo (es. cedere sempre)'), _T('polo2','Secondo polo (es. non cedere mai)'),
     _A('vero','Cosa c’è di vero in entrambi?'), _A('passo','Un passo verso il centro'), _A('esito','Com’è andata?')]},
 {id:'m-gentilezza', mod:'mind', t:'Amorevole gentilezza', sub:'Auguri a te e agli altri',
  intro:'Rivolgi frasi di buon augurio a te, a una persona cara, a una persona neutra, a una difficile.',
  c:[_C('per','Per chi hai praticato?',['Me stessa','Una persona cara','Una persona neutra','Una persona difficile']),
     _A('frasi','Quali frasi hai usato?'), _A('sent','Cosa hai sentito?')]},

 // ── TOLLERANZA DELLA SOFFERENZA ──
 {id:'t-stop', mod:'tol', t:'Abilità STOP', sub:'Fermarsi prima di agire',
  intro:'S: Stop, fermati. T: Fai un passo indietro. O: Osserva. P: Procedi con consapevolezza.',
  c:[_T('sit','Cosa stava succedendo?'), _T('imp','Quale impulso avevi?'),
     _A('stop','Come ti sei fermata?'), _A('oss','Cosa hai osservato (dentro e fuori)?'),
     _A('proc','Come hai proseguito?'), _S('int','Intensità dell’impulso dopo (0-100)')]},
 {id:'t-impulso', mod:'tol', t:'Pro e contro dell’agire sull’impulso', sub:'Confronto a quattro celle',
  intro:'Prima di agire sull’impulso della crisi, metti a confronto le conseguenze.',
  c:[_T('imp','Qual è l’impulso?'),
     _H('Agire sull’impulso'), _A('a-pro','Vantaggi'), _A('a-contro','Svantaggi'),
     _H('Tollerare e resistere'), _A('t-pro','Vantaggi'), _A('t-contro','Svantaggi'),
     _T('dec','Cosa decidi?')]},
 {id:'t-crisi', mod:'tol', t:'Diario delle abilità di crisi', sub:'Cosa hai usato e se ha aiutato',
  intro:'Segna quali abilità hai usato in un momento di crisi e quanto sono servite.',
  c:[_T('crisi','Cosa è successo?'), _S('prima','Intensità della sofferenza prima (0-100)'),
     _C('ab','Abilità usate',['STOP','Pro e contro','TIP: temperatura','TIP: esercizio intenso','TIP: respirazione','TIP: rilassamento muscolare','Distrarsi (ACCETTA)','Autoconsolazione','MIGLIORA il momento']),
     _S('dopo','Intensità dopo (0-100)'), _A('funz','Cosa ha funzionato di più?')]},
 {id:'t-accettazione', mod:'tol', t:'Accettazione radicale', sub:'Passo dopo passo',
  intro:'Accettare non significa approvare: significa smettere di combattere contro ciò che è già successo.',
  c:[_A('cosa','Cosa devo accettare?'), _A('osta','Cosa mi impedisce di accettarlo?'),
     _A('cause','Cosa so delle cause che l’hanno prodotto?'),
     _A('corpo','Cosa faccio con il corpo? (mani aperte, abbozzare un sorriso, respiro)'),
     _S('acc','Quanto riesco ad accettare ora? (0-100)')]},
 {id:'t-bodyscan', mod:'tol', t:'Meditazione body scan: diario', sub:'Prima e dopo, giorno per giorno',
  intro:'Pratica quando puoi. Annota come l\u2019hai fatta e come stavi prima e dopo.',
  c:[_R('come','Come hai praticato?',['Da sola','Con una registrazione','Con un video','Guidata da una persona']),
     _T('tempo','Per quanto tempo? (minuti)'), _A('esp','Descrivi la tua esperienza'),
     _H('Prima'), _R('tol1','Tolleranza della sofferenza (0 = non ce la faccio, 5 = ce la farò)',['0','1','2','3','4','5']),
     _S('neg1','Intensità emozione negativa (0-100)'), _S('pos1','Intensità emozione positiva (0-100)'),
     _H('Dopo'), _R('tol2','Tolleranza della sofferenza (0-5)',['0','1','2','3','4','5']),
     _S('neg2','Intensità emozione negativa (0-100)'), _S('pos2','Intensità emozione positiva (0-100)'),
     _A('conc','Conclusioni o domande sulla pratica')]},
 {id:'t-pensieri', mod:'tol', t:'Mindfulness dei pensieri', sub:'Pensieri come eventi',
  intro:'Un pensiero è un evento della mente, non un fatto: osservalo passare.',
  c:[_A('pens','Quale pensiero ti ha preso?'),
     _C('come','Come lo hai osservato?',['Nuvola che passa','Onda che sale e scende','Foglia sul fiume','Treno che parte','Parole su uno schermo']),
     _A('eff','Che effetto ha avuto?')]},
 {id:'t-miglioramomento', mod:'tol', t:'MIGLIORA il momento presente', sub:'Rendere sopportabile l’adesso',
  intro:'Quando non puoi cambiare la situazione, puoi migliorare il momento.',
  c:[_T('sit','Situazione'),
     _C('ab','Abilità usate',['Immaginazione','Significato','Preghiera / apertura','Rilassamento','Piccoli passi','Riposo','Autoincoraggiamento']),
     _A('desc','Come le hai usate?'), _S('dopo','Sofferenza dopo (0-100)')]},

 // ── EFFICACIA INTERPERSONALE ──
 {id:'i-priorita', mod:'inter', t:'Chiarire le priorità', sub:'Obiettivo, relazione, rispetto di sé',
  intro:'Prima di una conversazione difficile, capisci cosa conta di più.',
  c:[_T('sit','Situazione e persona'), _A('obi','Cosa voglio ottenere?'),
     _S('i-obi','Importanza dell’obiettivo (0-100)'), _S('i-rel','Importanza della relazione (0-100)'), _S('i-se','Importanza del rispetto di me (0-100)'),
     _A('cosa','Cosa conta di più oggi?')]},
 {id:'i-monitor', mod:'inter', t:'Monitorare le abilità interpersonali', sub:'Cosa hai usato, com’è andata',
  intro:'Dopo una conversazione, annota cosa hai usato.',
  c:[_T('sit','Situazione'), _T('chi','Con chi?'),
     _C('ab','Abilità usate',['DEAR MAN','GIVE','FAST','Validazione','Dialettica']),
     _R('ott','Hai ottenuto ciò che volevi?',['Sì','In parte','No']), _A('div','Cosa farai in modo diverso?')]},
 {id:'i-chiedere', mod:'inter', t:'Quanto chiedere?', sub:'Decidere se e con che forza',
  intro:'Non sempre conviene chiedere con la stessa forza: pesa la situazione.',
  c:[_T('cosa','Cosa vorresti chiedere o rifiutare?'), _S('imp','Importanza per te (0-100)'),
     _S('prob','Probabilità che la risposta sia sì (0-100)'), _A('dir','È un tuo diritto o dipende dall’altra persona?'),
     _R('dec','Cosa decidi?',['Chiedo con decisione','Chiedo con delicatezza','Non chiedo','Rimando'])]},
 {id:'i-validare', mod:'inter', t:'Validare gli altri', sub:'Mostrare che capisci',
  intro:'Validare è dire che ciò che l’altra persona sente ha senso, senza per forza essere d’accordo.',
  c:[_T('chi','Chi?'), _A('prov','Cosa provava, secondo te?'), _A('come','Come l’hai validata?'), _A('risp','Come ha risposto?')]},
 {id:'i-autoval', mod:'inter', t:'Validazione di sé', sub:'Prendersi sul serio',
  intro:'Riconosci le tue emozioni come comprensibili, dato quello che è successo.',
  c:[_A('prov','Cosa hai provato?'), _A('senso','Perché ha senso che tu lo provi?'),
     _A('frasi','Cosa potresti dirti di gentile?'), _A('serve','Di cosa hai bisogno ora?')]},
 {id:'i-dialettica', mod:'inter', t:'Praticare la dialettica', sub:'Due verità insieme',
  intro:'Due cose opposte possono essere vere nello stesso momento.',
  c:[_T('sit','Situazione'), _A('a','Una posizione'), _A('b','La posizione opposta'),
     _A('vero','Cosa c’è di vero in entrambe?'), _A('sintesi','Una sintesi possibile')]},

 // ── REGOLAZIONE EMOTIVA ──
 {id:'r-funzioni', mod:'reg', t:'Capire cosa fanno le emozioni per me', sub:'Messaggio, motivazione, comunicazione',
  intro:'Le emozioni servono: capire a cosa serve aiuta a non combatterle.',
  c:[_T('emo','Emozione'), _A('msg','Che messaggio mi dà?'), _A('mot','A cosa mi spinge?'), _A('com','Cosa comunica agli altri?')]},
 {id:'r-osserva', mod:'reg', t:'Osservare e descrivere le emozioni', sub:'Il modello completo, dall\u2019evento agli effetti',
  intro:'Scegli una reazione emotiva recente e ricostruiscila pezzo per pezzo. Se l\u2019evento che l\u2019ha scatenata era un\u2019altra emozione, fai un foglio anche per quella.',
  c:[_T('emo','Come si chiama l\u2019emozione?'), _S('int','Intensità (0-100)'),
     _A('vuln','Cosa era successo prima, rendendoti più vulnerabile?'),
     _A('evento','Evento scatenante: cosa è successo nei minuti prima? Solo i fatti.'),
     _A('interp','Interpretazione: pensieri, convinzioni, supposizioni'),
     _A('corpo','Corpo: cosa senti o hai sentito nel viso e nel corpo?'),
     _A('imp','Impulsi ad agire: cosa ti veniva da fare o da dire?'),
     _A('esprc','Espressione del corpo: viso, postura, gesti'),
     _A('espr','Espressione con le parole: cosa hai detto, e come?'),
     _A('azioni','Azioni: cosa hai fatto?'),
     _A('dopo','Effetti dopo: su mente, corpo e comportamento')]},
 {id:'r-azione-opposta', mod:'reg', t:'Azione opposta', sub:'Agire al contrario dell’impulso',
  intro:'Si usa quando l’emozione non corrisponde ai fatti o non è utile.',
  c:[_T('emo','Emozione'), _A('imp','Quale impulso ho?'), _R('fatti','Corrisponde ai fatti?',['Sì','In parte','No']),
     _A('op','Azione opposta scelta'), _R('tot','L’hai fatta con tutta te stessa?',['Sì','In parte','No']),
     _S('dopo','Come ti senti dopo (0-100 intensità)')]},
 {id:'r-problem-solving', mod:'reg', t:'Problem solving', sub:'Dal problema al piano',
  intro:'Quando l’emozione corrisponde ai fatti, cambia la situazione.',
  c:[_A('prob','Qual è il problema?'), _A('fatti','Fatti, senza interpretazioni'), _A('obi','Cosa voglio ottenere?'),
     _A('idee','Idee di soluzione (anche stravaganti)'), _A('scelta','Soluzione scelta e perché'),
     _A('piano','Piano: cosa, quando, come'), _A('esito','Com’è andata?')]},
 {id:'r-vulnerabilita', mod:'reg', t:'ABC: ridurre la vulnerabilità', sub:'Accumulare, padronanza, anticipare',
  intro:'A: accumula emozioni positive. B: costruisci padronanza. C: affronta in anticipo.',
  c:[_A('a','A — Cosa ho fatto di piacevole oggi?'), _A('b','B — Cosa ho fatto che mi dà senso di padronanza?'),
     _A('c','C — Quale situazione difficile mi aspetta e come mi preparo?')]},
 {id:'r-valori', mod:'reg', t:'Dai valori ad azioni', sub:'Una piccola azione, oggi',
  intro:'Un valore è una direzione, non un traguardo: scegli un’azione piccola che ci vada incontro.',
  c:[_C('val','Valori che sento vicini',['Affetto','Onestà','Libertà','Crescita','Creatività','Salute','Giustizia','Famiglia','Amicizia','Lavoro che ha senso','Curiosità','Pace','Coraggio','Gentilezza','Autonomia','Spiritualità','Equilibrio','Fiducia','Lealtà','Avventura','Responsabilità','Serenità','Apprendimento','Natura','Contributo agli altri','Intimità','Rispetto','Autenticità','Gioco e leggerezza','Stabilità','Bellezza']),
     _A('perche','Perché conta per me?'), _A('az','Azione piccola per questa settimana'), _T('quando','Quando?'), _A('esito','Com’è andata?')]},
 {id:'r-mastery', mod:'reg', t:'Mastery e gestire in anticipo', sub:'Sfida giusta e preparazione',
  intro:'Fai ogni giorno qualcosa di un po’ difficile ma fattibile; prepara le situazioni che temi.',
  c:[_T('att','Attività che mi mette alla prova'), _S('dif','Difficoltà (0-100)'),
     _H('Gestire in anticipo'), _A('sit','Situazione difficile che mi aspetta'),
     _A('imm','Come mi immagino di affrontarla?'), _A('abil','Quali abilità userò?')]},
 {id:'r-sonno', mod:'reg', t:'Igiene del sonno', sub:'Routine della sera e del mattino',
  intro:'Dormire a orari regolari protegge dalla vulnerabilità emotiva.',
  c:[_T('letto','A che ora sei andata a letto?'), _T('sveglia','A che ora ti sei svegliata?'),
     _C('hab','Cosa hai fatto?',['Niente caffeina dopo pranzo','Schermi spenti prima di dormire','Routine rilassante','Camera buia e fresca','Orari regolari']),
     _S('qual','Qualità del sonno (0-100)')]},
 {id:'r-incubi', mod:'reg', t:'Incubi: dopo il risveglio', sub:'Calmarsi e reimmaginare',
  intro:'Questo foglio è un appoggio. Per incubi frequenti o molto pesanti parlane con la terapeuta.',
  c:[_A('sog','Cosa è successo nel sogno? (quanto basta)'),
     _C('fatto','Cosa hai fatto al risveglio?',['Respiro lento','Acceso la luce','Bevuto acqua','Mi sono orientata nella stanza','Ho chiamato qualcuno','Altro']),
     _A('nuovo','Come vorresti che finisse, immaginandolo diversamente?'), _S('dopo','Come ti senti ora (0-100)')]},
 {id:'r-miti', mod:'reg', t:'Miti sulle emozioni', sub:'Idee che peggiorano le cose',
  intro:'Convinzioni come «non dovrei sentirmi così» rendono le emozioni più dolorose.',
  c:[_A('mito','Quale idea sulle emozioni ti ha fatto soffrire?'), _A('vero','Quanto è vera, davvero?'), _A('alt','Una versione più utile')]},
 {id:'r-mind-emozioni', mod:'reg', t:'Mindfulness dell’emozione', sub:'Starci come un’onda',
  intro:'Osserva l’emozione senza respingerla né aggrapparti.',
  c:[_T('emo','Quale emozione?'), _A('corpo','Dove la senti nel corpo?'), _S('int','Intensità adesso (0-100)'),
     _A('passa','Cosa succede se la lasci salire e scendere?')]},
 {id:'r-risolvere', mod:'reg', t:'Quando le abilità non funzionano', sub:'Capire cosa è andato storto',
  intro:'Non è un fallimento: è un dato su cosa cambiare.',
  c:[_T('ab','Quale abilità?'), _C('perche','Cosa è successo?',['Ero troppo attivata','Non ricordavo i passaggi','Non ci credevo','Non avevo il momento','Ho smesso presto','Altro']),
     _A('cosa','Cosa cambi la prossima volta?')]}
];

// ── lookup, archiviazione ──
function fgDef(id){ return FG_FOGLI.filter(function(f){ return f.id === id; })[0] || null; }
function fgChiave(id){ return ukey('fg_' + id); }
function fgLista(id){
  try{ const a = JSON.parse(localStorage.getItem(fgChiave(id)) || '[]'); return Array.isArray(a) ? a : []; }
  catch(e){ return []; }
}
function fgSalvaLista(id, lista){
  try{ localStorage.setItem(fgChiave(id), JSON.stringify(lista)); }catch(e){ /* storage non disponibile */ }
}
// tutti i fogli compilati, per la terapeuta
function fgRaccogli(){
  const out = {};
  FG_FOGLI.forEach(function(f){ const l = fgLista(f.id); if(l.length) out[f.id] = l; });
  return out;
}

// ── testo riassuntivo (anteprima e vista della terapeuta) ──
function fgEsc(t){ return String(t == null ? '' : t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
function fgRiassunto(def, v){
  v = v || {};
  const righe = [];
  def.c.forEach(function(f){
    if(f.h) return;
    const x = v[f.k];
    if(x == null || x === '' || (Array.isArray(x) && !x.length)) return;
    const val = Array.isArray(x) ? x.join(', ') : (f.tipo === 's' ? x + '/100' : x);
    righe.push('<strong>' + fgEsc(f.l) + '</strong> ' + fgEsc(val));
  });
  return righe;
}

// ── interfaccia ──
let _fgIdAperto = null;
function fgSolaLettura(){ return (typeof profile !== 'undefined' && profile && profile.role === 'terapeuta'); }
function fgCorpo(){ return document.getElementById('scheda-body'); }

function fgApri(id){
  const def = fgDef(id); if(!def) return;
  if(typeof _schedaAperta !== 'undefined' && _schedaAperta && typeof closeScheda === 'function') closeScheda();
  _fgIdAperto = id;
  document.getElementById('scheda-title').textContent = def.t;
  document.getElementById('scheda-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  // si apre subito il modulo vuoto; l'elenco dei compilati e' un link in alto
  if(fgSolaLettura()) fgMostraLista(def); else fgMostraForm(def, null, true);
}
function fgDataBreve(ts){
  return new Date(ts).toLocaleDateString('it-IT', {day:'numeric', month:'short', year:'numeric'});
}
function fgMostraLista(def){
  const body = fgCorpo(); if(!body) return;
  body.innerHTML = '';
  body.scrollTop = 0;
  const w = document.createElement('div');
  w.className = 'fg-wrap';
  const intro = document.createElement('p');
  intro.className = 'fg-intro'; intro.textContent = def.intro;
  w.appendChild(intro);
  if(!fgSolaLettura()){
    const nuovo = document.createElement('button');
    nuovo.type = 'button'; nuovo.className = 'fg-btn fg-pri'; nuovo.textContent = '+ Nuovo foglio';
    nuovo.addEventListener('click', function(){ fgMostraForm(def, null); });
    w.appendChild(nuovo);
  }
  const lista = fgLista(def.id).slice().sort(function(a, b){ return b.ts - a.ts; });
  if(lista.length){
    const t = document.createElement('div'); t.className = 'fg-sez'; t.textContent = 'Compilati';
    w.appendChild(t);
    lista.forEach(function(e){
      const r = document.createElement('button');
      r.type = 'button'; r.className = 'fg-riga'; r.setAttribute('data-nav', '');
      const prima = def.c.filter(function(f){ return !f.h && (f.tipo === 't' || f.tipo === 'a') && e.v && e.v[f.k]; })[0];
      const d = document.createElement('span'); d.className = 'fg-riga-data'; d.textContent = fgDataBreve(e.ts);
      const a = document.createElement('span'); a.className = 'fg-riga-ant'; a.textContent = prima ? e.v[prima.k] : '(vuoto)';
      r.appendChild(d); r.appendChild(a);
      r.addEventListener('click', function(){ fgMostraForm(def, e); });
      w.appendChild(r);
    });
  }
  body.appendChild(w);
  fgNote(body, def);
}
// post-it del foglio (e quelli della teoria collegata), in fondo sia all'elenco sia al modulo
function fgNote(body, def){
  if(typeof piMount === 'function'){ body.appendChild(piMount('fg:' + def.id, 'Note per compilarlo')); if(typeof grBlocchiCorrelati === 'function') grBlocchiCorrelati('fg:' + def.id).forEach(function(b){ body.appendChild(b); }); }
  const pi = body.querySelector('.pi-wrap'); if(pi) pi.style.margin = '20px 0 24px';
}

function fgMostraForm(def, entry, diretto){
  const body = fgCorpo(); if(!body) return;
  body.innerHTML = '';
  body.scrollTop = 0;
  const ro = fgSolaLettura();
  const w = document.createElement('div'); w.className = 'fg-wrap';
  const dati = (entry && entry.v) || {};
  const campi = {};
  const nComp = fgLista(def.id).length;
  if(diretto && nComp){
    const lk = document.createElement('button'); lk.type = 'button'; lk.className = 'fg-btn fg-elenco'; lk.setAttribute('data-nav', '');
    lk.textContent = 'I miei fogli compilati (' + nComp + ')';
    lk.addEventListener('click', function(){ fgMostraLista(def); });
    w.appendChild(lk);
  }
  def.c.forEach(function(f){
    if(f.h){ const h = document.createElement('div'); h.className = 'fg-sez'; h.textContent = f.h; w.appendChild(h); return; }
    const blocco = document.createElement('div'); blocco.className = 'fg-campo';
    const lab = document.createElement('label'); lab.className = 'fg-lab'; lab.textContent = f.l;
    blocco.appendChild(lab);
    let el;
    if(f.tipo === 't'){ el = document.createElement('input'); el.type = 'text'; el.value = dati[f.k] || ''; }
    else if(f.tipo === 'a'){ el = document.createElement('textarea'); el.rows = 3; el.value = dati[f.k] || ''; }
    else if(f.tipo === 's'){ el = document.createElement('input'); el.type = 'number'; el.min = 0; el.max = 100; el.inputMode = 'numeric'; el.value = dati[f.k] != null ? dati[f.k] : ''; }
    if(el){
      el.className = 'fg-in'; if(f.ph) el.placeholder = f.ph; el.disabled = ro; blocco.appendChild(el); campi[f.k] = function(){ return el.value.trim(); };
    } else {
      const sel = Array.isArray(dati[f.k]) ? dati[f.k].slice() : (dati[f.k] ? [dati[f.k]] : []);
      const multi = f.tipo === 'c';
      const riga = document.createElement('div'); riga.className = 'fg-chips';
      f.o.forEach(function(o){
        const ch = document.createElement('button'); ch.type = 'button'; ch.className = 'fg-chip'; ch.textContent = o;
        ch.setAttribute('data-nav', ''); if(sel.indexOf(o) !== -1) ch.classList.add('on');
        ch.addEventListener('click', function(){
          if(ro) return;
          const i = sel.indexOf(o);
          if(multi){ if(i === -1) sel.push(o); else sel.splice(i, 1); ch.classList.toggle('on', i === -1); }
          else { sel.length = 0; if(i === -1){ sel.push(o); } riga.querySelectorAll('.fg-chip').forEach(function(x){ x.classList.toggle('on', x === ch && i === -1); }); }
        });
        riga.appendChild(ch);
      });
      blocco.appendChild(riga);
      campi[f.k] = function(){ return multi ? sel.slice() : (sel[0] || ''); };
    }
    w.appendChild(blocco);
  });
  const az = document.createElement('div'); az.className = 'fg-azioni';
  const ind = document.createElement('button'); ind.type = 'button'; ind.className = 'fg-btn'; ind.textContent = ro ? 'Indietro' : 'Annulla';
  ind.addEventListener('click', function(){ if(diretto && typeof closeScheda === 'function') closeScheda(); else fgMostraLista(def); });
  if(entry && !ro){
    const del = document.createElement('button'); del.type = 'button'; del.className = 'fg-btn fg-del'; del.textContent = 'Elimina';
    del.addEventListener('click', function(){
      if(!del.classList.contains('conferma')){ del.classList.add('conferma'); del.textContent = 'Eliminare davvero?'; return; }
      fgSalvaLista(def.id, fgLista(def.id).filter(function(x){ return x.id !== entry.id; }));
      fgTomb('fg_' + def.id, entry.id);
      if(typeof sincronizzaFogli === 'function') sincronizzaFogli();
      fgMostraLista(def);
    });
    az.appendChild(del);
  }
  const sp = document.createElement('span'); sp.style.flex = '1'; az.appendChild(sp);
  az.appendChild(ind);
  if(!ro){
    const sv = document.createElement('button'); sv.type = 'button'; sv.className = 'fg-btn fg-pri'; sv.textContent = 'Salva';
    sv.addEventListener('click', function(){
      const v = {};
      Object.keys(campi).forEach(function(k){
        const x = campi[k]();
        if(x === '' || (Array.isArray(x) && !x.length)) return;
        v[k] = (def.c.filter(function(f){ return f.k === k; })[0] || {}).tipo === 's' ? Math.max(0, Math.min(100, +x)) : x;
      });
      if(!Object.keys(v).length){ fgMostraLista(def); return; }
      const lista = fgLista(def.id);
      if(entry){ const e = lista.filter(function(x){ return x.id === entry.id; })[0]; if(e){ e.v = v; e.m = Date.now(); } }
      else lista.push({id:'f' + Date.now().toString(36) + Math.random().toString(36).slice(2, 5), ts:Date.now(), v:v});
      fgSalvaLista(def.id, lista);
      if(typeof sincronizzaFogli === 'function') sincronizzaFogli();
      fgMostraLista(def);
    });
    az.appendChild(sv);
  }
  w.appendChild(az);
  body.appendChild(w);
  fgNote(body, def);
}

// ── collegamenti: moduli della guida e pagina "Fogli di lavoro" ──
(function(){
  const nome = {mind:'mind', tol:'tol', reg:'reg', inter:'inter'};
  FG_FOGLI.forEach(function(f){
    if(typeof SCHEDE_PER_MODULO === 'undefined') return;
    (SCHEDE_PER_MODULO[nome[f.mod]] = SCHEDE_PER_MODULO[nome[f.mod]] || []).push({fg:f.id, label:f.t});
  });
})();


// ════════════════════════════════════════════════════════════════
// RIPRISTINO DEI FOGLI DA SUPABASE
// ════════════════════════════════════════════════════════════════
// I fogli compilati partono gia' verso la riga su Supabase (raccogliFogli).
// Qui li si riporta anche SU un altro dispositivo: unione per id, e
// "lapidi" per le cancellazioni (altrimenti un foglio eliminato qui
// tornerebbe da un dispositivo che lo ha ancora).
function fgTombLista(){
  try{ const o = JSON.parse(localStorage.getItem(ukey('fogli_del')) || '{}'); return (o && typeof o === 'object') ? o : {}; }
  catch(e){ return {}; }
}
function fgTomb(lista, id){
  const o = fgTombLista(); o[lista + ':' + id] = Date.now();
  const limite = Date.now() - 90 * 86400000;
  Object.keys(o).forEach(function(k){ if(o[k] < limite) delete o[k]; });
  try{ localStorage.setItem(ukey('fogli_del'), JSON.stringify(o)); }catch(e){}
}
function fgCancellati(){ return fgTombLista(); }

function fgUnisciRemoto(remoto){
  if(!remoto || typeof remoto !== 'object') return false;
  if(typeof profile === 'undefined' || !profile || profile.role !== 'paziente') return false;
  const lapidi = fgTombLista();
  const remLapidi = remoto.cancellati || {};
  let lapidiCambiate = false;
  Object.keys(remLapidi).forEach(function(k){
    if(!lapidi[k] || remLapidi[k] > lapidi[k]){ lapidi[k] = remLapidi[k]; lapidiCambiate = true; }
  });
  if(lapidiCambiate){ try{ localStorage.setItem(ukey('fogli_del'), JSON.stringify(lapidi)); }catch(e){} }
  let cambiato = false;
  function unisci(chiave, remLista){
    if(!Array.isArray(remLista)) return;
    let loc;
    try{ loc = JSON.parse(localStorage.getItem(ukey(chiave)) || '[]'); }catch(e){ loc = []; }
    if(!Array.isArray(loc)) loc = [];
    const per = {};
    loc.forEach(function(e){ if(e && e.id != null) per[e.id] = e; });
    const senzaId = loc.filter(function(e){ return !(e && e.id != null); });
    let mod = false;
    remLista.forEach(function(e){
      if(!e || e.id == null) return;
      if(lapidi[chiave + ':' + e.id]) return;
      const l = per[e.id];
      if(!l){ per[e.id] = e; mod = true; }
      else if((e.m || 0) > (l.m || 0)){ per[e.id] = e; mod = true; }
    });
    // un elemento cancellato altrove sparisce anche qui
    Object.keys(per).forEach(function(id){ if(lapidi[chiave + ':' + id]){ delete per[id]; mod = true; } });
    if(!mod) return;
    const out = Object.keys(per).map(function(id){ return per[id]; });
    out.sort(function(a, b){ return (new Date(b.ts || b.data || 0)) - (new Date(a.ts || a.data || 0)); });
    try{ localStorage.setItem(ukey(chiave), JSON.stringify(out.concat(senzaId))); cambiato = true; }catch(e){}
  }
  unisci('cf_fogli', remoto.controllaFatti);
  unisci('pc2_fogli', remoto.proContro);
  unisci('diario_emo', remoto.diarioEmozioni);
  unisci('catena_list', remoto.catena);
  const gen = remoto.generici || {};
  // tutti i fogli noti, anche se mancano da remoto: serve a recepire le cancellazioni
  FG_FOGLI.forEach(function(f){ unisci('fg_' + f.id, gen[f.id] || []); });
  // piano di crisi: documento unico, si ripristina solo se qui e' vuoto
  try{
    const loc = JSON.parse(localStorage.getItem(ukey('piano_crisi')) || '{}');
    const rem = remoto.pianoCrisi;
    if(rem && typeof rem === 'object' && Object.keys(rem).some(function(k){ return rem[k]; }) && !Object.keys(loc).some(function(k){ return loc[k]; })){
      localStorage.setItem(ukey('piano_crisi'), JSON.stringify(rem)); cambiato = true;
    }
  }catch(e){}
  // se il pannello dei fogli e' aperto, si aggiorna
  if(cambiato && typeof _fgIdAperto !== 'undefined' && _fgIdAperto && document.getElementById('scheda-modal').classList.contains('open')){
    const body = document.getElementById('scheda-body');
    if(body && body.querySelector('.fg-wrap .fg-riga, .fg-wrap .fg-btn.fg-pri') && !body.querySelector('.fg-campo')){
      const d = fgDef(_fgIdAperto); if(d) fgMostraLista(d);
    }
  }
  return cambiato;
}

// Prima di ogni salvataggio verso Supabase si riportano qui i fogli gia' presenti,
// cosi' un dispositivo "vuoto" non cancella quelli degli altri.
async function fgPrePull(){
  try{
    if(typeof channel === 'undefined' || !channel || typeof profile === 'undefined' || profile.role !== 'paziente') return;
    const r = await fetch(SUPA_URL + '/rest/v1/diary_data?code=eq.' + encodeURIComponent(channel) + '&select=data', {headers: getAuthHeaders()});
    if(!r.ok) return;
    const rows = await r.json();
    const rem = rows && rows[0] && rows[0].data;
    if(rem && rem.fogli) fgUnisciRemoto(rem.fogli);
  }catch(e){ /* senza rete si procede col salvataggio normale */ }
}
