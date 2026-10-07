// Sottotitoli come nel documento di design
const DC_SOTTO_MODULO = {"tol": "Quando la crisi è già in corso", "reg": "Ridurre la vulnerabilità", "inter": "Chiedere, dire no, restare in relazione", "mind": "Tornare a un momento per volta", "gen": "Piano di crisi, analisi della catena"};
const DC_SOTTO_EMO = {"epau": "Quando la minaccia è reale e concreta", "erab": "Quando un obiettivo importante è bloccato", "etri": "Quando c'è una perdita", "ecol": "Quando ho agito contro un mio valore", "egel": "Quando rischio di perdere una relazione", "einv": "Quando altri hanno ciò che mi manca", "ever": "Quando l'esclusione è un rischio vero"};
const PF_STAR_SVG='<svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.2l2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z" stroke-width="2" stroke-linejoin="round"/></svg>';
const DC_CHEV = '<svg width="11" height="19" viewBox="0 0 11 19" fill="none" class="dc-chev"><path d="M2.5 2.5L8 9.5L2.5 16.5" stroke="#1B4B4A" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Miniature disegnate: sostituiscono le emoji nelle intestazioni.
const MINIATURA_MODULO = {
  tol:'illustrazioni/miniature/modulo-tolleranza.svg',
  reg:'illustrazioni/miniature/modulo-regolazione.svg',
  inter:'illustrazioni/miniature/modulo-interpersonale.svg',
  mind:'illustrazioni/miniature/modulo-mindfulness.svg',
  gen:'illustrazioni/miniature/strumenti-generali.svg',
  dip:'illustrazioni/miniature/modulo-dipendenze.svg'
};
const MINIATURA_EMOZIONE = {
  epau:'illustrazioni/miniature/emo-paura.svg',
  erab:'illustrazioni/miniature/emo-rabbia.svg',
  etri:'illustrazioni/miniature/emo-tristezza.svg',
  ecol:'illustrazioni/miniature/emo-colpa.svg',
  egel:'illustrazioni/miniature/emo-gelosia.svg',
  einv:'illustrazioni/miniature/emo-invidia.svg',
  ever:'illustrazioni/miniature/emo-vergogna.svg'
};

// Ogni abilita' che ha una scheda dedicata la richiama da qui: e' il
// modo per non avere lo stesso contenuto in due posti del menu.
// FOGLI DI LAVORO: solo le schede che si COMPILANO. Stanno in cima al
// modulo perche' sono la parte operativa.
const SCHEDE_PER_MODULO = {
  tol:   [{page:'pianocrisi', label:'Piano di crisi'}],
  reg:   [{page:'please',     label:'Checklist PLEASE'},
          {page:'fatti',      label:'Controlla i fatti'},
          {page:'diarioemo',  label:'Diario delle emozioni'},
          {page:'eventi',     label:'Lista attività piacevoli'}],
  inter: [{page:'dearman',    label:'Generatore copione DEAR MAN'}],
  gen:   [{page:'catena',     label:'Analisi della catena'},
          {page:'procontro',  label:"Pro e contro dell'usare le abilità"}]
};

// SCHEDE DI SOLA LETTURA: restano agganciate alla loro abilita' e si aprono
// nella finestra quando si tocca l'abilita' stessa.
const SCHEDA_LETTURA = {
  'GIVE':              'give',
  'FAST':              'fast',
  'ABC':               'abc',
  'SENTIERO DI MEZZO': 'sentiero'
};

// ════════════════════════════════════════════════════════════════
// GUIDA DBT — Schede e guide
// ════════════════════════════════════════════════════════════════
// ── GUIDA DBT ──
function toggleGuideModule(id){
  const body=document.getElementById('body-'+id);
  const arr=document.getElementById('arr-'+id);
  if(!body)return;
  const open=body.classList.toggle('open');
  if(arr)arr.classList.toggle('open',open);
}
function toggleGuideSkill(id){
  const steps=document.getElementById('steps-'+id);
  const arr=document.getElementById('sarr-'+id);
  if(!steps)return;
  const open=steps.classList.toggle('open');
  if(arr)arr.style.transform=open?'rotate(180deg)':'';
}
function renderGuide(){
  const el=document.getElementById('guida-content');
  if(!el)return;
  if(el.innerHTML.trim())return;

  const MODULES=[
    {id:'tol',icon:'🌊',bg:'#F8E8DF',
     title:'Tolleranza della sofferenza',
     sub:'Sopravvivere alle crisi senza peggiorare la situazione',
     intro:'Queste abilità servono quando provi un dolore intenso che non puoi alleviare subito, quando agiresti sulla spinta delle emozioni ma questo peggiorerebbe la situazione, o quando la mente emotiva minaccia di prendere il sopravvento. Non sono per i problemi quotidiani — sono per le crisi.',
     skills:[
       {id:'tcrisi',badge:'CRISI',name:'Sopravvivere alla crisi: quando usarle',
        desc:'A cosa servono le abilità di crisi e quando (non) usarle.',
        steps:[
          '<b>A cosa servono.</b> Aiutano a restare a galla quando il dolore, gli impulsi o le emozioni sono troppo forti e la situazione non si può sistemare subito. L\'obiettivo è attraversare il momento senza peggiorarlo, non risolvere tutto.',
          '<b>Sei in crisi quando</b> la situazione è molto stressante, dura poco e ti mette sotto pressione perché si risolva subito.',
          '<b>Usale quando</b> il dolore è intenso e non passa in fretta; quando agire sull\'onda dell\'emozione peggiorerebbe le cose; quando la mente emotiva sta prendendo il comando; quando le emozioni sono fortissime ma ciò che le ha provocate non si può cambiare adesso.',
          '<b>Non usarle per</b> i problemi di ogni giorno, per risolvere tutta la vita o per renderla degna di essere vissuta: per quello servono le altre abilità.',
          '<b>Le abilità:</b> STOP, pro e contro, TIP (cambiare la chimica del corpo), distrarsi con mente saggia ACCETTA, autoconsolarsi con i 5 sensi, migliorare il momento.',
          '&#x1F4D6; Manuale: Tolleranza della sofferenza, Schede 1-3.'
        ]},
       {id:'stop',badge:'STOP',name:'Interrompi la reazione impulsiva',
        desc:'Fermati prima di reagire d\'impulso.',
        steps:[
          '<b>S — Stop.</b> Non reagire. Congelati. Non muovere un muscolo. Le emozioni vogliono farti agire senza pensare — non lasciarle.',
          '<b>T — fai un passo indieTro.</b> Prendi distanza fisica o mentale. Fai un respiro profondo. Non lasciare che i sentimenti ti spingano ad agire impulsivamente.',
          '<b>O — Osserva.</b> Cosa sta succedendo dentro di te (pensieri, emozioni, sensazioni) e fuori (situazione, altre persone)?',
          '<b>P — Procedi in maniera mindful.</b> Agisci con consapevolezza. Considera la situazione, le emozioni tue e altrui. Chiedi alla mente saggia: quale azione migliorerebbe la situazione? Quale la peggiorerebbe?'
        ]},
       {id:'tip',badge:'TIP',name:'Cambia la chimica del corpo',
        desc:'Cambia la fisiologia del corpo in pochi minuti.',
        steps:[
          '<b>T — Temperatura.</b> Immergi il viso in acqua fredda (min 10°C) trattenendo il fiato per 30 secondi, oppure applica un impacco freddo sugli occhi e guance. Il "riflesso da immersione" rallenta il battito cardiaco e calma il sistema nervoso.',
          '<b>I — esercizio fisico Intenso.</b> Corri, salta, fai squat per almeno 20 minuti. Consuma l\'energia fisica accumulata dalle emozioni intense.',
          '<b>P — Placa la respirazione.</b> Respira profondamente con la pancia. Inspira per 5 secondi, espira per 7 secondi. L\'espirazione più lunga attiva il sistema parasimpatico (calma).',
          '<b>P — rilassamento muscolare Progressivo.</b> Contrai ogni gruppo muscolare per 5-6 sec inspirando, poi rilascia espirando e dì "Rilassati". Inizia dai piedi e sali fino al viso.',
          '⚠ <b>Attenzione:</b> consulta il medico prima di usare TIP se hai problemi cardiaci, prendi farmaci betabloccanti, o hai disturbi alimentari.'
        ]},
       {id:'procontro',badge:'PRO/CONTRO',name:'Valuta pro e contro',
        desc:'Prima di agire d\'impulso, fai una lista.',
        steps:[
          '<b>Scrivi i pro</b> del cedere all\'impulso: cosa otterresti nel breve termine?',
          '<b>Scrivi i contro</b> del cedere all\'impulso: quali sarebbero le conseguenze a lungo termine?',
          '<b>Scrivi i pro</b> del resistere all\'impulso: cosa guadagneresti?',
          '<b>Scrivi i contro</b> del resistere: cosa ti costerebbe?',
          'Conserva la lista con te. Rileggila quando senti l\'impulso. Ricorda le conseguenze passate di quando hai ceduto impulsivamente.'
        ]},
       {id:'accept',badge:'ACCETTA',name:'Distrarsi con mente saggia',
        desc:'Sette strategie per distrarti senza negare il dolore.',
        steps:[
          '<b>A — Attività.</b> Fai qualcosa che assorba l\'attenzione: una passeggiata, un film, pulire una stanza, un gioco, una telefonata a qualcuno.',
          '<b>C — Contribuisci al benessere altrui.</b> Aiuta qualcuno: un messaggio gentile, un piccolo favore, volontariato. Uscire da te stessa dà respiro.',
          '<b>C — Confronti.</b> Metti il momento in prospettiva: com\'era quando stavi peggio, o come altri affrontano cose simili. Non per sminuire il dolore.',
          '<b>E — Emozioni diverse.</b> Provoca un\'emozione opposta a quella di adesso: una commedia, musica che ti smuove, una vecchia lettera. Scegli qualcosa che accende davvero un\'altra emozione.',
          '<b>T — Tieni lontano.</b> Metti il problema da parte per un po\': immagina un muro, o di riporre il dolore in una scatola sul tavolo. È una pausa, non una negazione per sempre.',
          '<b>A — AlTri pensieri.</b> Occupa la mente con altro: conta i colori di un quadro, ripeti le parole di una canzone, un puzzle, un cruciverba.',
          '<b>A — altre sensAzioni.</b> Dai al corpo una sensazione forte ma sicura: stringere una pallina, musica a volume alto, una doccia fredda o un bagno caldo, uscire sotto la pioggia.'
        ]},
       {id:'sensi',badge:'5 SENSI',name:'Autoconsolati attraverso i 5 sensi',
        desc:'Calma e conforto attraverso i cinque sensi.',
        steps:[
          '<b>Vista.</b> Guarda le stelle nel cielo notturno. Osserva la natura. Guarda immagini che ti piacciono. Trova qualcosa di bello nell\'ambiente intorno a te.',
          '<b>Udito.</b> Ascolta musica che ti calma o ti piace. I suoni della natura. Il silenzio consapevole. Nota ogni suono senza giudicarlo.',
          '<b>Olfatto.</b> Odora una candela, un fiore, aria fresca. Prepara qualcosa di buono da mangiare. Il profumo ha un effetto diretto sulle emozioni.',
          '<b>Gusto.</b> Mangia o bevi qualcosa di piacevole lentamente, assaporando ogni sfumatura. Un tè caldo, del cioccolato, un frutto.',
          '<b>Tatto.</b> Fai un bagno caldo. Avvolgiti in una coperta morbida. Accarezza un animale. Il contatto fisico confortante regola il sistema nervoso.'
        ]},
       {id:'migliora',badge:'MIGLIORA',name:'Migliora il momento presente',
        desc:'Sette strategie per rendere il momento più tollerabile.',
        steps:[
          '<b>IM — IMmaginazione.</b> Immagina scene che calmano: una stanza segreta dentro di te dove non entra ciò che ti ferisce, le emozioni dolorose che scorrono via come acqua, un ricordo felice rivissuto.',
          '<b>SI — SIgnificato.</b> Cerca uno scopo o un senso nella situazione dolorosa, o un aspetto positivo da tenere a mente.',
          '<b>G — PreGhiera.</b> Apri il cuore a qualcosa di più grande di te (come lo chiami tu) o alla tua mente saggia, e chiedi la forza di sopportare.',
          '<b>L — riLassamento.</b> Un bagno caldo, un massaggio al collo, yoga, respiri profondi, un\'espressione del viso più morbida.',
          '<b>PI — PIccoli passi.</b> Una cosa per volta: resta in quello che stai facendo, porta l\'attenzione sulle sensazioni del corpo.',
          '<b>O — breve ripOso.</b> Concediti una mini-vacanza dalle responsabilità: una pausa dal lavoro, un pomeriggio al parco, telefono spento per un giorno.',
          '<b>RA — AutoincoRAggiamento.</b> Parlati con gentilezza: "Ce la posso fare", "Passerà anche questo", "Sto facendo del mio meglio". Prepara in anticipo frasi che ti servono nelle crisi.'
        ]},
       {id:'tacqua',badge:'ACQUA FREDDA',name:'Acqua fredda: il riflesso da immersione',
        desc:'Calma il corpo in pochi minuti quando l\'emozione è fortissima.',
        steps:[
          '<b>Perché funziona.</b> Viso nell\'acqua fredda con il respiro trattenuto: il corpo reagisce come in un\'immersione. Il battito rallenta e questo aiuta a regolare l\'emozione. L\'effetto può iniziare dopo 15-30 secondi.',
          '<b>Come.</b> Riempi una bacinella di acqua fredda (non ghiacciata), oppure appoggia sugli occhi e sulle guance un sacchetto chiuso con acqua fredda. Trattieni il respiro per qualche secondo.',
          '<b>Stai ferma.</b> Funziona meglio seduta e tranquilla: muoverti o farti distrarre ne riduce l\'effetto.',
          '<b>Quando usarla.</b> Emozioni molto forti e dolorose, oppure quando l\'impulso a farti del male o a fare qualcosa di pericoloso è fortissimo.',
          '⚠ <b>Attenzione:</b> l\'acqua molto fredda rallenta il cuore. Se hai problemi cardiaci o altre condizioni, se prendi farmaci per il battito o betabloccanti, parlane prima con il medico. Non usare acqua ghiacciata se il freddo ti dà reazioni negative.'
        ]},
       {id:'trilass',badge:'RILASSAMENTO',name:'Rilassamento muscolare progressivo',
        desc:'Contrai e rilascia i muscoli, uno alla volta, per sciogliere la tensione.',
        steps:[
          '<b>Prepara il luogo.</b> Le prime volte scegli un posto tranquillo e dedicaci tempo. Mettiti comoda, sdraiata o seduta, allenta ciò che stringe e non incrociare le braccia o le gambe.',
          '<b>Contrai.</b> Tendi una parte del corpo mentre inspiri e senti la rigidità per 5-6 secondi.',
          '<b>Rilascia.</b> Espirando lascia andare di colpo e ripeti piano nella mente "Rilassati". Osserva per 10-15 secondi come cambiano le sensazioni, poi passa alla parte successiva.',
          '<b>Procedi per gradi.</b> All\'inizio lavora sui singoli muscoli (sono 16), poi sui gruppi medi, poi su quelli grandi. Alla fine puoi tendere e sciogliere tutto il corpo insieme: prima rigida come un robot, poi morbida come una bambola di pezza.',
          '<b>Se arriva l\'ansia o il giudizio.</b> Osserva i pensieri e lasciali andare, riporta l\'attenzione all\'esercizio. Se l\'ansia sale, respira con la pancia: inspira contando fino a 5, espira contando fino a 7.',
          '<b>Allenati.</b> Più lo pratichi (anche 3-4 volte al giorno, all\'inizio), più in fretta riuscirai a rilassarti quando serve davvero.'
        ]},
       {id:'triform',badge:'RIFORMULA',name:'Riformulare i pensieri',
        desc:'Sostituisci i pensieri che ti agitano con frasi che ti aiutano, abbinandole al respiro.',
        steps:[
          '<b>1 — Evento.</b> Scrivi la situazione che di solito ti fa stare male e su cui vuoi essere meno reattiva.',
          '<b>2 — Cosa mi dico.</b> Chiediti quali pensieri e interpretazioni hai su quell\'evento e scrivili (es. "non ce la farò mai", "sono fuori controllo").',
          '<b>3 — Una lettura diversa.</b> Riguarda la situazione in modo che contraddica quei pensieri. Scrivi quante più frasi efficaci riesci a trovare.',
          '<b>4 — Allenati a freddo.</b> Quando l\'evento non c\'è, immaginalo. Inspirando ripeti una frase che ti sostiene, espirando dì "Rilassati" e sciogli i muscoli.',
          '<b>5 — Ripeti.</b> Continua finché diventa naturale.',
          '<b>6 — Usala quando serve.</b> Nella situazione vera, applica la frase e il rilassamento insieme.'
        ]},
       {id:'tbody',badge:'BODY SCAN',name:'Meditazione body scan',
        desc:'Porta l\'attenzione, parte per parte, in tutto il corpo.',
        steps:[
          '<b>Posizione.</b> Seduta o sdraiata, senza gambe incrociate, braccia in una posizione comoda. Occhi socchiusi. Se sei sdraiata puoi mettere un cuscino sotto le ginocchia.',
          '<b>Respiro.</b> Fai qualche respiro profondo finché ti senti più a tuo agio. Poi immagina che il respiro segua la tua attenzione.',
          '<b>Parti dal piede sinistro.</b> Porta l\'attenzione alle dita, poi all\'arco e al tallone. Chiediti con curiosità: "Che cosa sento qui?". Nota calore, freddo, peso, contatto.',
          '<b>Sali lentamente.</b> Caviglia, polpaccio, ginocchio, coscia; poi ripeti con la gamba destra. Continua con bacino, schiena, addome, torace, braccia e mani, spalle, collo, viso e testa, restando un po\' su ogni zona.',
          '<b>Se la mente vaga,</b> è normale: nota dove è andata e riportala con gentilezza alla parte del corpo in cui eri.'
        ]},
       {id:'tsensoriale',badge:'SENSORIALE',name:'Consapevolezza sensoriale guidata',
        desc:'Domande brevi per tornare al corpo e al momento presente.',
        steps:[
          '<b>Prepara.</b> Mettiti in una posizione comoda e restaci. Puoi registrare le domande con la tua voce, leggerle da sola o chiedere a qualcuno di farle.',
          '<b>Una domanda alla volta,</b> con circa 5 secondi di pausa. Ascolta cosa senti, senza giudicare.',
          '<b>Esempi di domande sul corpo:</b> senti il respiro che muove la pancia? senti la pianta dei piedi? un braccio ti sembra più pesante dell\'altro? senti un cambio di temperatura dell\'aria sulla pelle?',
          '<b>Esempi di immaginazione piacevole:</b> come ti sentiresti a galleggiare nell\'acqua calda? su una nuvola? come una bambola di pezza?',
          '<b>Quando usarla.</b> Quando la testa corre e vuoi tornare al presente, o per prepararti al rilassamento.'
        ]},
       {id:'sorriso',badge:'MEZZO SORRISO',name:'Abbozzare un sorriso e mani aperte',
        desc:'Accetta la realtà attraverso postura ed espressione.',
        steps:[
          '<b>Il mezzo sorriso:</b> rilassa il viso dalla sommità del capo alla mandibola. Lascia che entrambe le estremità della bocca salgano leggermente — il minimo che ti permetta di accorgertene. Non un ghigno: labbra leggermente sollevate in un volto rilassato.',
          '<b>Mani aperte in piedi:</b> lascia cadere le braccia lungo i fianchi, mani aperte girate verso l’esterno, palmi verso l’alto, dita rilassate.',
          '<b>Mani aperte seduta:</b> sistema le mani sul grembo o sulle cosce, palmi rivolti verso l’alto, dita rilassate.',
          '<b>Quando usarlo:</b> appena ti svegli (prima di alzarti), nei momenti liberi, mentre ascolti musica, quando sei irritata, quando sei tesa.',
          '<b>Con persone difficili:</b> siediti. Respira e abbozza un sorriso. Pensa a una persona con cui sei arrabbiata. Cerca di capire cosa la rende felice o la fa soffrire. Continua finché senti un po’ di compassione e la rabbia diminuisce.',
          '<b>Nota.</b> Ricorda: la faccia e le mani comunicano con il cervello. Il corpo è connesso alla mente — cambiare la postura cambia davvero come ci sentiamo.'
        ]},
       {id:'disponibilita',badge:'DISPONIBILITÀ',name:'Disponibilità al posto dell\'ostinazione',
       desc:'Quando ti accorgi di rifiutare il momento, di irrigidirti o di voler tenere tutto sotto controllo.',
       steps:[
         '<b>Disponibilità</b> è essere pronta a entrare e partecipare pienamente al vivere la vita: fare proprio ciò che è necessario in ogni situazione, senza trascinare i piedi.',
         '<b>Ostinazione</b> è il contrario: rifiutarsi di tollerare il momento, rifiutare i cambiamenti necessari, arrendersi, insistere nel tenere il controllo, provare a risolvere ogni situazione.',
         '<b>1. Osserva l\'ostinazione.</b> Etichettala. Fanne esperienza.',
         '<b>2. Accetta radicalmente</b> che in questo momento senti — e forse agisci — l\'ostinazione. Non puoi combattere l\'ostinazione con l\'ostinazione.',
         '<b>3. Orienta la mente</b> verso l\'accettazione e la disponibilità.',
         '<b>4. Abbozza un mezzo sorriso</b> e assumi una postura che esprima disponibilità: mani aperte, spalle morbide.',
         '<b>5. Quando l\'ostinazione è inamovibile</b>, chiediti qual è la minaccia che senti, e torna al passo 1.'
       ]},
      {id:'autoincor',badge:'AUTOINCORAGGIAMENTO',name:'Frasi che ti sostengono',
       desc:'Per i momenti in cui pensi di non farcela.',
       steps:[
         'Sostieni te stessa come faresti con una persona a cui vuoi bene: «Vai! Sei grande!», «Ce la posso fare».',
         'Ricorda che la crisi ha una fine: «Passerà anche questo», «Non durerà per sempre», «Ne verrò fuori».',
         'Riconosci ciò che stai facendo: «Sto facendo il meglio che posso».',
         'Riformula i pensieri che pesano di più. Esempio dal manuale: «Il fatto che non sia venuto a prendermi non significa che non mi ami».',
         'Scrivi le frasi che funzionano per te e tienile pronte: nel momento di crisi non si inventano.'
       ]},
      {id:'accrad',badge:'ACCETT. RADICALE',name:'Accettazione radicale',
        desc:'Smettere di lottare contro ciò che non puoi cambiare.',
        steps:[
          '<b>Cos\'è:</b> accettazione radicale significa accettare completamente — con mente, cuore e corpo — la realtà così com\'è. Non è arrendersi, è smettere di lottare contro ciò che non si può cambiare ora.',
          '<b>Perché:</b> rifiutare la realtà non la cambia, ma trasforma il dolore in sofferenza. Il dolore è inevitabile; la sofferenza è opzionale.',
          '<b>Come praticarla:</b> osserva il pensiero "questa cosa non dovrebbe essere così". Nota la lotta interiore. Di\' a te stessa: "La realtà è questa, anche se non mi piace". Ripetilo finché senti un piccolo allentamento.',
          '<b>Orienta la mente:</b> ogni volta che la mente torna a combattere la realtà, riorientala gentilmente verso l\'accettazione. Non è un\'azione unica — è una pratica continua.',
          '<b>Nota.</b> L\'accettazione porta spesso prima alla tristezza, poi a una profonda calma.'
        ]}
     ]},
    {id:'mind',icon:'🧘',bg:'#EEF4F3',
     title:'Mindfulness',
     sub:'Vivere consapevolmente nel momento presente',
     intro:'La mindfulness è la pratica di prestare attenzione intenzionalmente al momento presente, senza giudicarlo. Non è meditazione formale — puoi praticarla mentre fai qualsiasi cosa. Le abilità di mindfulness sono la base di tutta la DBT.',
     skills:[
       {id:'mdefin',badge:'COS’È',name:'Cos’è la mindfulness',
        desc:'Tre idee: presenza, niente giudizio, niente attaccamento.',
        steps:[
          '<b>Presenza.</b> Vivere intenzionalmente nel momento presente, uscendo dal pilota automatico e dalle abitudini per esserci davvero.',
          '<b>Senza giudicare né rifiutare.</b> Noti le conseguenze e distingui ciò che aiuta da ciò che fa male, ma lasci andare valutazioni, evitamento e soppressione di ciò che c’è.',
          '<b>Senza attaccarti.</b> Partecipi a ogni momento nuovo, senza aggrapparti al passato né correre al futuro.',
          '<b>Praticarla.</b> Si può fare ovunque, mentre fai qualsiasi cosa: basta portare l’attenzione al presente, di proposito, senza giudizio.',
          '<b>Meditare.</b> È praticare da ferma (seduta, in piedi o sdraiata). Puoi focalizzare l’attenzione (respiro, corpo, emozioni, pensieri) oppure aprirla a tutto ciò che arriva.',
          '<b>Altre forme.</b> Preghiera contemplativa, movimento consapevole (yoga, arti marziali, danza), camminare o fare escursioni con attenzione.'
        ]},
       {id:'mstati',badge:'STATI MENTE',name:'I tre stati della mente',
        desc:'Capire in quale stato mentale ti trovi.',
        steps:[
          '<b>Mente razionale.</b> Fredda, logica, guidata da fatti e ragione. Utile per risolvere problemi pratici. Ignora emozioni e valori — può portare a decisioni corrette ma vuote di significato.',
          '<b>Mente emotiva.</b> Calda, impulsiva, governata dai sentimenti. Le emozioni controllano pensieri e azioni. Utile per amore, creatività, connessione — pericolosa nelle crisi e per decisioni importanti.',
          '<b>Mente saggia.</b> L\'integrazione delle due. Conosce sia i fatti sia le emozioni, e sa quando seguire l\'una o l\'altra. È la voce interiore più profonda e "giusta". Puoi accedervi con la pratica della mindfulness.',
          '<b>Nota.</b> Come trovare la mente saggia: fai un respiro profondo. Chiediti: "Nel profondo, so cosa è giusto fare?" Aspetta la risposta che sale dal centro, non dalla testa né dal cuore.'
        ]},
       {id:'mfareessere',badge:'FARE / ESSERE',name:'Mente del fare e mente dell\'essere',
        desc:'Bilanciare l\'agire per obiettivi con lo stare nel presente.',
        steps:[
          '<b>Mente del fare.</b> Discrimina, è ambiziosa e orientata agli obiettivi. I pensieri sembrano fatti sul mondo e l\'attenzione va al problem solving e al raggiungere lo scopo.',
          '<b>Mente dell\'essere.</b> È curiosa e senza niente da fare, orientata al presente. I pensieri sono sensazioni della mente e conta l\'unicità di ogni momento, lasciando andare gli obiettivi.',
          '<b>Mente saggia.</b> Sta in equilibrio tra le due: è il sentiero di mezzo.',
          '<b>Mezzi efficaci.</b> Nella mente saggia lasci andare il bisogno di ottenere a tutti i costi l\'obiettivo e proprio così ti dedichi pienamente a raggiungerlo. Aumenti la consapevolezza mentre sei impegnata in ciò che fai.',
          '<b>Come usarla.</b> Quando noti che sei troppo nel fare (sempre a risolvere) o troppo nell\'essere (ferma, senza concludere), prova a spostarti verso l\'altra: è l\'esercizio dei fogli sugli eventi piacevoli e spiacevoli.',
          '&#x1F4D6; Manuale: Mindfulness, Scheda 9.'
        ]},
       {id:'mcosa',badge:'COSA',name:'Osservare, Descrivere, Partecipare',
        desc:'Cosa fare quando pratichi la mindfulness.',
        steps:[
          '<b>Osservare.</b> Nota l\'esperienza senza aggrapparti ad essa o respingerla. I pensieri sono come nuvole che passano, le emozioni come onde. Osserva senza reagire. "Sto notando una sensazione di tensione."',
          '<b>Descrivere.</b> Metti in parole l\'esperienza — "Sto avendo il pensiero che...", "Sento una stretta al petto". Descrivere crea distanza dall\'emozione e riduce la sua intensità.',
          '<b>Partecipare.</b> Buttati completamente nell\'attività del momento, senza autoconsapevolezza. Diventa una con ciò che fai — ballare, cucinare, parlare. Non osservare da fuori: entra dentro l\'esperienza.'
        ]},
       {id:'mcome',badge:'COME',name:'Non giudicare, Una cosa, Efficacia',
        desc:'Come praticare la mindfulness.',
        steps:[
          '<b>Astenersi dal giudizio.</b> Osserva senza valutare come buono/cattivo, giusto/sbagliato. Invece di "questo è terribile", prova "questo è quello che sta succedendo". Nota quando giudichi e lascia andare il giudizio — senza giudicarti per aver giudicato.',
          '<b>Una cosa per volta.</b> Concentra tutta l\'attenzione sull\'attività del momento. Se la mente vaga, riportala gentilmente. Non fare più cose contemporaneamente — né fisicamente né mentalmente.',
          '<b>Essere efficaci.</b> Fai ciò che funziona nella situazione reale, non ciò che è "giusto" in assoluto o ciò che vorresti dover fare. Lascia perdere l\'orgoglio e i principi astratti — fai quello che serve per raggiungere i tuoi obiettivi.'
        ]},
       {id:'memozioni',badge:'EMOZIONI ORA',name:'Mindfulness delle emozioni del momento',
        desc:'Osserva l\'emozione senza agire su di essa.',
        steps:[
          '<b>Osserva l’emozione.</b> Fai un passo indietro e limitati a osservarla. Come un’onda che va e viene. Non bloccarla, non respingerla, non aggrappartici, non amplificarla.',
          '<b>Pratica la consapevolezza corporea.</b> Nota dove nel corpo senti le sensazioni dell’emozione. Sperimenta le sensazioni il più completamente possibile. Osserva quanto ci vuole perché l’emozione diminuisca.',
          '<b>Ricorda: tu non sei la tua emozione.</b> Non devi necessariamente agire su di essa. Ricorda le volte in cui ti sei sentita diversamente.',
          '<b>Pratica l’amore per la tua emozione.</b> Rispetta la tua emozione. Non giudicarla. Accettala radicalmente. Allena la tua disponibilità a sentirla.',
          '<b>Nota.</b> Gestire emozioni estreme: se sei al punto di rottura (sofferenza estrema, mente che si spegne), prima usa TIP o ACCETTA per ridurre l’attivazione, poi torna alla mindfulness delle emozioni.'
        ]},
       {id:'mpensieri',badge:'PENSIERI ORA',name:'Mindfulness dei pensieri del momento',
        desc:'I pensieri come eventi che passano, non fatti.',
        steps:[
          '<b>Osserva i tuoi pensieri</b> come onde che vanno e vengono. Senza analizzarli, senza sopprimerli, senza giudicarli. Fai un passo indietro e guardali correre fuori e dentro la mente.',
          '<b>Adotta una mente curiosa.</b> Chiediti: "Da dove arrivano i miei pensieri?" Nota che ogni pensiero che entra, esce. Non trattenere.',
          '<b>Ricorda: tu non sei i tuoi pensieri.</b> Non devi necessariamente agire su di essi. Il pensiero catastrofico è parte della mente emotiva — non è la realtà.',
          '<b>Non bloccare o sopprimere i pensieri.</b> Chiediti: "Quali sensazioni cerco di evitare con questi pensieri?" Poi sposta la mente sulle sensazioni, poi torna ai pensieri.',
          '<b>Gioca con i tuoi pensieri.</b> Ripetili ad alta voce più volte velocemente. Cantali. Immagina i pensieri come parole di un clown o come un bel colore che attraversa la mente. Prova ad amarli.'
        ]},
       {id:'mrespiro',badge:'RESPIRO',name:'Mindfulness del respiro',
        desc:'Il respiro come ancora al momento presente.',
        steps:[
          '<b>Posizione:</b> siediti comodamente o sdraiati. Chiudi gli occhi o abbassa lo sguardo. Rilassa le spalle.',
          '<b>Osserva il ventre:</b> quando inspiri, lascia che il ventre si sollevi. Quando espiri, nota prima il ventre, poi il petto scendere. Non forzare.',
          '<b>Nota le pause:</b> c’è una pausa naturale quando i polmoni sono pieni, e una quando sono vuoti. Osservale senza trattenerle.',
          '<b>Naso:</b> chiudi la bocca e respira dal naso. Nota la sensazione dell’aria nelle narici — più fresca in entrata, più calda in uscita.',
          '<b>Se la mente vaga:</b> è normale. Nota che sei andata altrove, e riporta gentilmente l’attenzione al respiro — senza giudicarti.',
          '<b>Durata:</b> anche solo 3-5 respirazioni consapevoli cambiano lo stato del sistema nervoso. 5-10 minuti al giorno costruiscono l’abilità nel tempo.',
          '&#x1F4A1; Non si tratta di svuotare la mente — si tratta di notare quando vaga e tornare. Questo è il muscolo che si allena.'
        ]},
       {id:'mamorev',badge:'GENTILEZZA',name:'Praticare l\'amorevole gentilezza',
        desc:'Aumentare affetto e compassione, prima verso di sé.',
        steps:[
          '<b>Cos\'è.</b> Una pratica di mindfulness per far crescere amore e compassione: prima verso se stessa, poi verso le persone care, gli amici, chi ti ha fatto arrabbiare, chi è in difficoltà e infine tutti gli esseri viventi. Protegge dal giudizio, dalla cattiveria e dall\'ostilità, verso di te e verso gli altri.',
          '<b>Come funziona.</b> È simile a una preghiera: mandi buoni desideri a una persona recitandoli nella mente, concentrandoti sul significato di ogni parola.',
          '<b>1 — Scegli la persona.</b> Parti da te. Se è troppo difficile, scegli qualcuno che ami già. Non scegliere chi non vorresti trattare con gentilezza.',
          '<b>2 — Mettiti comoda.</b> Seduta, in piedi o sdraiata, respira piano e a fondo, con i palmi aperti, e porta la persona al centro della mente.',
          '<b>3 — Ripeti le frasi</b> lentamente, per esempio «Che io possa essere felice», «Che io possa essere in pace», «Che io possa stare in salute», «Che io possa essere al sicuro». Se arrivano pensieri che distraggono, notali e riporta gentilmente la mente alle frasi. Continua finché ti senti immersa nella gentilezza.',
          '<b>4 — Allarga il cerchio</b> gradualmente: cari, amici, persone con cui sei arrabbiata, persone difficili, nemici, tutti gli esseri viventi. Cambia solo il soggetto: «Che Marco possa essere in pace».',
          '&#x1F4D6; Manuale: Mindfulness, Scheda 8.'
        ]},
       {id:'msaggio',badge:'MENTE SAGGIA',name:'Come praticare la mente saggia',
        desc:'Esercizi concreti per accedere alla propria mente saggia.',
        steps:[
          '<b>Respira con la mente saggia.</b> Inspira e scendi con l\'attenzione al centro del corpo. All\'espirazione, focalizzati sulla parola "saggia". Ripeti finché senti stabilità.',
          '<b>Domanda alla pietra nel lago.</b> Immagina di essere una pietra che affonda lentamente in un lago calmo. Raggiungi il fondo — un luogo tranquillo. Chiediti cosa sa la mente saggia in questo momento.',
          '<b>Allarga la consapevolezza.</b> Siedi in silenzio. Nota tutti i pensieri, le emozioni e le sensazioni. Espandi la consapevolezza finché riesci a tenerli tutti insieme senza identificarti con nessuno.',
          '<b>Chiediti nel quotidiano:</b> "Cosa sa la mia mente saggia su questa situazione?" Aspetta la risposta — di solito arriva come un senso di certezza tranquilla, non come urlo.'
        ]}
     ]},
    {id:'reg',icon:'🎛️',bg:'#FCF2D6',
     title:'Regolazione emotiva',
     sub:'Capire, ridurre e gestire le emozioni intense',
     intro:'Le emozioni non sono nemiche — ci motivano, comunicano agli altri e ci danno informazioni. Il problema è quando sono troppo intense, durano troppo, o ci spingono ad azioni che peggiorano la situazione. Queste abilità aiutano a capire, accettare e modificare le emozioni.',
     skills:[
       {id:'rperche',badge:'EMOZIONI',name:'A cosa servono le emozioni',
        desc:'Perché proviamo le emozioni, prima di regolarle.',
        steps:[
          '<b>Ci motivano all\'azione.</b> La paura ci fa fuggire dal pericolo. La rabbia ci fa difendere. La tristezza ci fa cercare conforto. Le emozioni abbreviano i tempi di reazione in situazioni importanti.',
          '<b>Comunicano agli altri.</b> Le espressioni facciali e il tono della voce trasmettono emozioni anche involontariamente. Influenzano chi ci sta intorno prima ancora che parliamo.',
          '<b>Comunicano a noi stesse.</b> Le emozioni sono segnali — ci dicono che qualcosa di importante sta succedendo. Ascoltarle (senza lasciarle controllare) è utile.',
          '⚠ <b>Attenzione:</b> le emozioni non sono fatti. "Mi sento in colpa" non significa aver sbagliato. "Ho paura" non significa che ci sia davvero un pericolo. Controlla sempre i fatti prima di agire.'
        ]},
       {id:'rdescrivi',badge:'DESCRIVI',name:'Modello per descrivere le emozioni',
        desc:'Le parti di un\'emozione, dall\'evento alle conseguenze.',
        steps:[
          '<b>Perché descriverla.</b> Per cambiare un\'emozione bisogna prima saperla vedere. Il modello la scompone in parti, così puoi notare cosa succede e dove intervenire.',
          '<b>Prima dell\'evento: fattori di vulnerabilità.</b> Cosa è successo prima che ti ha reso più fragile (poco sonno, fame, litigi, malessere)?',
          '<b>Evento stimolo.</b> Cosa ha fatto partire l\'emozione? Solo i fatti, nei pochi minuti prima. Un\'emozione può essere a sua volta lo stimolo di un\'altra (la paura che accende la rabbia verso se stessi): in quel caso descrivi prima la prima.',
          '<b>Interpretazione.</b> Pensieri, convinzioni, supposizioni e valutazioni su quell\'evento.',
          '<b>Cambiamenti biologici e vissuto.</b> Cosa senti nel corpo e nel viso, e quali impulsi ad agire ti vengono (cosa vorresti fare o dire).',
          '<b>Espressione.</b> Viso e corpo (espressione, postura, gesti), parole (cosa hai detto) e azioni (cosa hai fatto).',
          '<b>Nome e intensità.</b> Dai un nome all\'emozione e una intensità da 0 a 100.',
          '<b>Conseguenze.</b> Cosa è successo dopo: altre emozioni (emozioni secondarie), comportamenti, pensieri.',
          '<b>Trovare le parole.</b> Il manuale ha elenchi di parole per dieci famiglie di emozioni: rabbia, disgusto, invidia, paura, gelosia, felicità, amore, tristezza, vergogna, colpa. Se non sai come chiamare quello che senti, parti da lì.',
          '&#x1F4D6; Manuale: Regolazione emotiva, Schede 5 e 6.'
        ]},
       {id:'rmiti',badge:'MITI',name:'Miti sulle emozioni',
        desc:'Convinzioni comuni che rendono le emozioni più difficili, e come rispondere.',
        steps:[
          '<b>"C’è un modo giusto di sentirsi in ogni situazione."</b> Le emozioni dipendono dalla storia, dal corpo e dal contesto: persone diverse sentono cose diverse.',
          '<b>"Far vedere che sto male è debolezza."</b> Dirlo è comunicare. Spesso è proprio ciò che permette di ricevere aiuto.',
          '<b>"Le emozioni negative sono cattive."</b> Sono dolorose, non cattive: ti avvisano di qualcosa.',
          '<b>"Essere emotivi vuol dire essere fuori controllo."</b> Sentire molto e scegliere cosa fare possono stare insieme.',
          '<b>"Come mi sento dice com’è la realtà."</b> Le emozioni sono informazioni, non fatti: controlla i fatti.',
          '<b>"Dovrei fare ciò che mi sento di fare."</b> Seguire l’impulso non è libertà. Libertà è poter scegliere l’azione.',
          '<b>"Io sono le mie emozioni."</b> Ciò che provi cambia e passa: non ti definisce.',
          '<b>"Le emozioni dolorose vanno ignorate."</b> Ignorarle di solito le fa crescere. Ascoltarle aiuta a capire cosa serve.',
          '<b>Nota.</b> Prova a scrivere con un post-it la tua risposta ai miti in cui ti riconosci di più.'
        ]},
       {id:'rcheck',badge:'CONTROLLA',name:'Controllare i fatti',
        desc:'Le emozioni rispondono ai pensieri, non solo ai fatti.',
        steps:[
          '<b>Identifica l\'emozione</b> che vuoi cambiare. Come si chiama? Quanto è intensa (0-5)?',
          '<b>Identifica l\'evento scatenante.</b> Cosa è successo esattamente? Descrivi i fatti puri, senza interpretazioni.',
          '<b>Controlla le interpretazioni.</b> Stai assumendo cose che non sai per certo? Stai leggendo la mente degli altri? Considera interpretazioni alternative.',
          '<b>Valuta la minaccia.</b> Stai ipotizzando una catastrofe? Qual è la probabilità reale che accada?',
          '<b>L\'emozione corrisponde ai fatti?</b> Se sì: agisci o accetta. Se no: agisci in modo <b>opposto</b> a ciò che l\'emozione ti spinge a fare.'
        ]},
       {id:'razione',badge:'AZIONE OPP.',name:'Azione opposta',
        desc:'Quando un\'emozione non corrisponde ai fatti, agire in modo opposto riduce l\'emozione stessa.',
        steps:[
          '<b>Paura ingiustificata:</b> avvicinati all\'oggetto temuto invece di fuggire. Fai la cosa che temi (in modo sicuro). Ripeti finché la paura diminuisce.',
          '<b>Tristezza/depressione:</b> agisci invece di isolarti. Esci. Partecipa ad attività. Alzati. Muoviti. Non aspettare di "avere voglia" — agisci e la voglia arriva dopo.',
          '<b>Rabbia ingiustificata:</b> evita la persona o la situazione temporaneamente. Immagina comprensione per l\'altra persona. Fai qualcosa di gentile.',
          '<b>Vergogna/colpa ingiustificate:</b> non nasconderti o scusarti. Fai ciò di cui ti vergogni (se non è realmente sbagliato). Condividi con persone di fiducia.',
          '<b>Nota.</b> L\'azione opposta deve essere <b>completa</b> — non solo esterna ma anche interna (postura, espressione, pensieri).'
        ]},
       {id:'rplease',badge:'PLEASE',name:'Ridurre la vulnerabilità emotiva',
        desc:'Cura del corpo, meno vulnerabilità emotiva.',
        steps:[
          '<b>PL — tratta le malattie Fisiche (PHysicaL).</b> Vai dal medico. Prendi le medicine. Non ignorare sintomi fisici — il corpo influenza direttamente le emozioni.',
          '<b>E — alimentazione Equilibrata.</b> Non saltare pasti. Evita cibi che alterano l\'umore. L\'ipoglicemia rende emotivamente reattive.',
          '<b>A — evita le sostanze che Alterano la mente.</b> Alcol e droghe aumentano la reattività emotiva e interferiscono con le abilità DBT.',
          '<b>S — Sonno bilanciato.</b> Troppo poco o troppo sonno aumenta la vulnerabilità emotiva. Mantieni un ritmo regolare.',
          '<b>E — Esercizio fisico.</b> Almeno 20 minuti al giorno di attività aerobica riduce stress, ansia e reattività emotiva.'
        ]},
       {id:'rsonno',badge:'SONNO',name:'Igiene del sonno',
        desc:'Cosa fare per dormire meglio, e cosa fare quando non dormi.',
        steps:[
          '<b>Orari regolari.</b> Vai a letto e svegliati alla stessa ora, anche nel fine settimana. Pisolini di giorno non oltre i 10 minuti.',
          '<b>Il letto è per dormire.</b> Evita di usarlo di giorno per tv, telefono o lettura.',
          '<b>La sera.</b> Niente caffeina, nicotina, alcol, pasti pesanti o sport intenso a ridosso del sonno.',
          '<b>La stanza.</b> Buia, silenziosa, fresca ma comoda. Se serve: mascherina, tappi, rumore bianco, ventilatore o coperta.',
          '<b>Se non ti addormenti entro mezz’ora-un’ora,</b> chiediti come stai: tranquilla, ansiosa o in rimuginio? Non drammatizzare: stare sveglia non è una catastrofe e anche riposare a occhi chiusi fa bene.',
          '<b>Se sei tranquilla ma sveglia:</b> alzati, vai in un’altra stanza e fai qualcosa di calmo, magari uno spuntino leggero. Torna a letto quando senti sonno.',
          '<b>Se sei ansiosa o rimugini:</b> torna a letto e respira piano (inspira contando 5, espira contando 7), oppure prova il conto alla rovescia: a ogni espirazione dì mentalmente 9, poi 8, fino a 0, poi riparti da 8, e così via fino a 1.',
          '<b>Pensieri notturni.</b> Porta l’attenzione alle sensazioni del corpo (il rimuginio spesso è una fuga da ciò che senti) e ricordati che sono "pensieri di mezzanotte": di giorno li vedrai in modo diverso.'
        ]},
       {id:'rincubi',badge:'INCUBI',name:'Lavorare sugli incubi ricorrenti',
        desc:'Riscrivere un incubo e ripeterlo con il finale nuovo.',
        steps:[
          '<b>Prima prepara il terreno.</b> Pratica rilassamento, immaginazione piacevole e abilità di tolleranza, per essere pronta a lavorare sull’incubo.',
          '<b>Scegli un incubo ricorrente</b> che puoi affrontare adesso. Se non ti senti pronta, rimanda.',
          '<b>Scrivilo,</b> con vista, odori, suoni, e anche con i pensieri e le emozioni che hai nel sogno.',
          '<b>Scegli un finale diverso,</b> che cambi la storia prima dell’evento brutto e ti lasci in pace al risveglio. Può essere anche straordinario (per esempio avere un potere che ti mette al sicuro).',
          '<b>Scrivi l’incubo completo</b> con il nuovo finale.',
          '<b>Ripetilo ogni sera.</b> Visualizza il sogno intero con il cambiamento, poi fai il rilassamento. Puoi ripeterlo anche di giorno.',
          '⚠ <b>Attenzione:</b> se gli incubi riguardano esperienze molto dolorose, meglio farlo insieme alla terapeuta.'
        ]},
       {id:'rabc',badge:'ABC',name:'Il sistema ABC — panoramica',
        desc:'Le tre aree principali della regolazione emotiva a lungo termine.',
        steps:[
          '<b>A — Accumula emozioni positive.</b> A breve termine: fai ogni giorno almeno una cosa piacevole. A lungo termine: costruisci una vita che vale la pena di essere vissuta, lavorando verso i tuoi valori.',
          '<b>B — diventa Bravo nella mastery.</b> Fai cose che ti fanno sentire competente ed efficace. Aumenta gradualmente la difficoltà. Cerca sfide possibili — non troppo facili, non impossibili.',
          '<b>C — gestisci in anticipazione le situazioni emotive.</b> Identifica situazioni che potrebbero scatenare emozioni difficili. Prepara un piano in anticipo. Prova mentalmente come gestirla.',
          '<b>PLEASE</b> — vedi la skill dedicata: prendersi cura del corpo riduce la vulnerabilità emotiva.'
        ]},
       {id:'rmastery',badge:'MASTERY',name:'Diventare bravi nella mastery',
        desc:'Ti rende competente e costruisce autostima.',
        steps:[
          'Pianifica almeno una cosa ogni giorno che ti dia un senso di realizzazione. Non deve essere grande — anche piccola.',
          'Fai piani per il successo, non per il fallimento. Inizia da qualcosa di difficile ma possibile.',
          'Aumenta gradualmente la difficoltà nel tempo. Se era troppo difficile, fai qualcosa di più semplice la prossima volta.',
          'Cerca la sfida giusta. Se troppo semplice, fai qualcosa di più impegnativo.',
          '<b>Gestisci in anticipo:</b> pensa a situazioni future che potrebbero essere difficili. Decidi quale abilità usare. Immagina di essere in quella situazione e prova mentalmente come gestirla.'
        ]},
       {id:'rproblem',badge:'PROBLEM SOLVING',name:'Problem solving — 7 passi',
        desc:'Affrontare direttamente un problema reale e risolvibile.',
        steps:[
          '<b>Passo 1:</b> Analizza e descrivi la situazione problematica in modo specifico.',
          '<b>Passo 2:</b> Controlla i fatti. Sei sicura di avere inquadrato correttamente il problema?',
          '<b>Passo 3:</b> Identifica il tuo obiettivo. Cosa deve succedere o cambiare per sentirti soddisfatta?',
          '<b>Passo 4:</b> Brainstorming — genera più soluzioni possibili senza scartare nessuna a priori.',
          '<b>Passo 5:</b> Scegli la soluzione migliore. Elenca pro e contro se sei indecisa.',
          '<b>Passo 6:</b> Agisci! Sperimenta la soluzione passo per passo.',
          '<b>Passo 7:</b> Valuta i risultati. Ha funzionato? Bene! No? Torna al passo 5 e scegline un’altra.'
        ]},
       {id:'rvalori',badge:'VALORI',name:'Identifica i tuoi valori',
        desc:'Cosa conta davvero per te.',
        steps:[
          '<b>Perché i valori:</b> le emozioni positive a lungo termine nascono da una vita allineata con ciò che per te è importante. Non da ciò che vuoi tu, ma da ciò che ti dà significato.',
          '<b>Passo 1:</b> Chiediti: "Nella mia mente saggia, cosa è davvero importante per me?" Esempi: relazioni, far parte di un gruppo, salute, lavoro significativo, crescita personale, creatività, integrità.',
          '<b>Passo 2:</b> Scegli un valore su cui lavorare adesso. Cosè realmente importante per te, in questo momento?',
          '<b>Passo 3:</b> Identifica obiettivi concreti legati a quel valore. Cosa puoi fare perché quel valore diventi parte della tua vita?',
          '<b>Passo 4:</b> Identifica piccoli passi concreti. Cosa devi fare primo? Poi? Poi ancora?',
          '<b>Passo 5:</b> Fai il primo passo adesso — anche piccolo. "Evita di evitare" è il principio chiave.'
        ]},
       {id:'restreme',badge:'EMOZIONI ESTREME',name:'Gestire emozioni estreme',
        desc:'Quando la sofferenza è così alta da rendere impossibile usare le abilità normali.',
        steps:[
          '<b>Riconosci il punto di rottura:</b> sofferenza estrema, mente sopraffatta, impossibilità di focalizzarsi su altro, cervello che smette di elaborare, incapacità di usare abilità complesse.',
          '<b>Step 1 — Sopravvivenza alla crisi:</b> usa TIP (acqua fredda, esercizio intenso, respiro lento), ACCETTA per distrarti, autoconsolati con i 5 sensi, MIGLIORA il momento.',
          '<b>Step 2 — Torna alla mindfulness:</b> dopo aver ridotto l’attivazione, pratica la mindfulness delle emozioni del momento. Osserva l’emozione come un’onda.',
          '<b>Step 3 — Abilità di regolazione emotiva:</b> solo quando sei più stabile, torna a usare le abilità più complesse (controlla i fatti, azione opposta ecc.).',
          '⚠ Non cercare di usare abilità complesse al punto di rottura — non funzionerà e ti farà sentire più in fallimento. Prima calma il sistema nervoso.'
        ]},
       {id:'rrisolvi',badge:'NON FUNZIONA',name:'Quando le abilità non funzionano',
        desc:'Cinque controlli per capire perché non stai migliorando.',
        steps:[
          '<b>1 — Controlla la tua sensibilità biologica.</b> Sei più vulnerabile del solito? Hai malattie o disagi fisici non curati, squilibri nel mangiare, nel sonno, nell\'esercizio, con le sostanze? Hai preso le medicine prescritte? Lavora sulle abilità PLEASE e riprova.',
          '<b>2 — Controlla le abilità.</b> Hai provato un\'abilità che poteva funzionare? Hai seguito le istruzioni alla lettera? Ripassa, prova altre abilità, chiedi aiuto al terapeuta e riprova.',
          '<b>3 — Controlla i rinforzi.</b> Le tue emozioni comunicano qualcosa di importante, ti motivano, confermano chi sei o ti fanno stare bene? Se sì: allenati a comunicare con le abilità interpersonali, cerca nuovi motivi che ti spingano, pratica l\'autovalidazione e fai un pro e contro del cambiare le emozioni.',
          '<b>4 — Controlla l\'impegno.</b> Stai dedicando abbastanza tempo ed energie? Se no: pro e contro del lavorare sodo sulle abilità, accettazione radicale e disponibilità, partecipare e agire con efficacia.',
          '<b>5 — Controlla se sei sovraccarica.</b> Sei troppo scossa per usare abilità complicate? Se il problema si può risolvere subito, fai problem solving; altrimenti mindfulness delle emozioni del momento. Se è troppo forte per ragionare, passa alle abilità di crisi.',
          '&#x1F4D6; Manuale: Regolazione emotiva, Scheda 24.'
        ]},
       {id:'rpositivo',badge:'POSITIVO',name:'Costruire emozioni positive',
        desc:'Costruisci attivamente le emozioni positive.',
        steps:[
          '<b>Breve termine:</b> ogni giorno fai almeno una cosa piacevole. Non aspettare di "avere voglia". Scegli attività che di solito ti piacciono e falle, anche se non ne hai voglia in questo momento.',
          '<b>Lungo termine:</b> lavora verso obiettivi che ti stanno a cuore. Costruisci una vita che vale la pena di essere vissuta — relazioni, lavoro, valori, salute.',
          '<b>Sii consapevole degli eventi positivi.</b> Nota quando qualcosa di bello accade. Non allontanarla. Non dire "sì, ma...". Lascia che entri.',
          '<b>Sii consapevole delle emozioni positive.</b> Quando provi gioia, gratitudine, pace — nota di provarle. Non preoccuparti che finiscano. Stai semplicemente nell\'emozione positiva.'
        ]}
     ]},
    {id:'inter',icon:'🤝',bg:'#EEF4F3',
     title:'Efficacia interpersonale',
     sub:'Ottenere ciò che si vuole mantenendo le relazioni e il rispetto di sé',
     intro:'L\'efficacia interpersonale è la capacità di raggiungere i propri obiettivi nelle relazioni. Tre obiettivi spesso in tensione tra loro: ottenere ciò che vuoi (DEAR MAN), mantenere la relazione (GIVE), mantenere il rispetto di te stessa (FAST).',
     skills:[
       {id:'ipriorita',badge:'OBIETTIVI',name:'Chiarire gli obiettivi interpersonali',
        desc:'Tre obiettivi in ogni situazione: risultato, relazione, rispetto di sé.',
        steps:[
          '<b>Efficacia negli obiettivi:</b> ottenere ciò che vuoi da un\'altra persona (un tuo diritto, che faccia qualcosa, dire di no, risolvere un conflitto, farti prendere sul serio). Chiediti: quale risultato voglio da questa discussione? Cosa devo fare per ottenerlo?',
          '<b>Efficacia nelle relazioni:</b> mantenere e migliorare il rapporto. Chiediti: come voglio che l\'altra persona si senta verso di me quando finiamo? Cosa devo fare per mantenere questo clima?',
          '<b>Efficacia nel rispetto di sé:</b> restare in linea con i tuoi valori e sentirti capace. Chiediti: come voglio sentirmi con me stessa alla fine? Cosa devo fare per sentirmi così?',
          '<b>Le priorità.</b> Spesso i tre obiettivi tirano in direzioni diverse: decidi quanto conta ciascuno in quella situazione, perché da questo dipende quali abilità usare.',
          '&#x1F4D6; Manuale: Efficacia interpersonale, Scheda 4.'
        ]},
       {id:'dearman',badge:'DEAR MAN',name:'Ottenere ciò che vuoi',
        desc:'Una sequenza per fare richieste o dire no in modo efficace.',
        steps:[
          '<b>D — Descrivi.</b> Descrivi la situazione attuale. Attieniti ai fatti puri. "Mi avevi detto che saresti tornata per cena, ma sei arrivata alle 23."',
          '<b>E — Esprimi.</b> Esprimi le tue emozioni e opinioni. "Quando succede, mi preoccupo." Non dare per scontato che gli altri sappiano come ti senti.',
          '<b>A — Afferma.</b> Chiedi ciò che vuoi o di\' no chiaramente. "Preferirei che tu mi avvisassi quando pensi di fare tardi." Usa "Vorrei" non "Tu dovresti".',
          '<b>R — Rinforza.</b> Spiega le conseguenze positive del soddisfare la tua richiesta. "Sarei molto più tranquilla." Rinforza l\'altra persona anche dopo.',
          '<b>M — sii Mindful.</b> Mantieni la concentrazione sull\'obiettivo. Non distrarti da attacchi, cambi di argomento o provocazioni. Ripeti la richiesta serenamente se necessario.',
          '<b>A — Agisci in modo sicuro.</b> Comportati con sicurezza, anche se non la senti. Contatto visivo, voce calma, postura dritta.',
          '<b>N — Negozia.</b> Sii disposta a dare per ricevere. Chiedi all\'altra persona cosa farebbe. Proponi soluzioni alternative.'
        ]},
       {id:'ifermezza',badge:'FERMEZZA',name:'Quanto devo essere ferma?',
        desc:'Quanta energia usare in una richiesta o un no.',
        steps:[
          '<b>Fattori che aumentano la fermezza:</b> sei nel giusto. Hai chiaramente espresso le tue necessità in passato. La relazione è paritaria. L’altra persona te lo chiederebbe a sua volta.',
          '<b>Fattori che la riducono:</b> non sei sicura di essere nel giusto. Non hai comunicato chiaramente in passato. La richiesta potrebbe danneggiare la relazione. L’altra persona è in difficoltà.',
          '<b>Considera la situazione:</b> è urgente? Ci sono conseguenze serie? Hai bisogno dell’altra persona in futuro?',
          '<b>Considera la relazione:</b> quant’è importante per te? Daresti o avresti dato tu questo all’altra persona se te lo chiedesse?',
          '<b>Nota.</b> Non esiste una risposta giusta universale. La mente saggia sa bilanciare i tuoi bisogni con la realtà della situazione.'
        ]},
       {id:'give',badge:'GIVE',name:'Mantenere le relazioni',
        desc:'Mantenere e rafforzare i legami.',
        steps:[
          '<b>G — sii Gentile.</b> Non attaccare, non minacciare, non giudicare, non mostrarti superiore. Tollera un no. Esprimi la rabbia con le parole, non con le azioni.',
          '<b>I — mostrati Interessata.</b> Ascolta davvero. Guarda negli occhi. Non interrompere. Sii curiosa del punto di vista dell\'altra persona, anche quando non sei d\'accordo.',
          '<b>V — Valida.</b> Con parole e azioni, mostra di comprendere le emozioni e il punto di vista dell\'altra persona. "Capisco che per te sia difficile." Non devi essere d\'accordo per validare.',
          '<b>E — comportati in modo Educato.</b> Usa un tono leggero quando possibile. Sorridi. Mostra interesse genuino. Evita l\'umorismo che ferisce.'
        ]},
       {id:'fast',badge:'FAST',name:'Mantenere il rispetto di sé',
        desc:'Non perdere la stima di te nelle relazioni.',
        steps:[
          '<b>F — sii Franca.</b> Sii giusta con te stessa e con l\'altra persona. Valida i tuoi sentimenti e desideri come validi tanto quanto quelli degli altri.',
          '<b>A — sii Assertiva.</b> Non scusarti di esistere o di avere bisogni. Non scusarti di avere opinioni. Non assumere posture di inferiorità.',
          '<b>S — Segui i tuoi valori.</b> Non rinunciare ai tuoi valori per ragioni che non sono davvero importanti. Spiega il tuo punto di vista etico e mantienilo.',
          '<b>T — sii Trasparente.</b> Non mentire, non fingere di essere d\'accordo quando non lo sei, non recitare. L\'onestà protegge il rispetto di sé a lungo termine.'
        ]},
       {id:'idialettica',badge:'DIALETTICA',name:'Pensiero dialettico',
        desc:'Stare nel paradosso: due cose opposte, entrambe vere.',
        steps:[
          '<b>Principio 1:</b> ogni situazione ha sempre una controparte. Cerca entrambi i lati della medaglia. Cambia gli "o-o" in "sia-sia", i "sempre-mai" in "talvolta".',
          '<b>Principio 2:</b> siamo tutti in connessione. Comportati con gli altri come vorresti facessero con te. Cerca le somiglianze, non le differenze.',
          '<b>Principio 3:</b> il cambiamento è l’unica costante. Ogni momento è nuovo. Accogli il cambiamento invece di resistere.',
          '<b>Principio 4:</b> il cambiamento è transazionale. Ciò che fai influenza il tuo ambiente e viceversa. Smetti di cercare di chi sia la colpa.',
          '<b>Esempi pratici:</b> "Voglio stare da sola E voglio anche connessione." "Posso voler cambiare E aver ancora bisogno di fare meglio." Entrambe sono vere.'
        ]},
       {id:'isentiero',badge:'SENTIERO DI MEZZO',name:'Percorrere il sentiero di mezzo',
        desc:'Equilibrio tra accettazione e cambiamento.',
        steps:[
          '<b>Accettazione e cambiamento insieme:</b> accettare la realtà non significa rinunciare al cambiamento. Anzi: l’accettazione è il primo passo verso il cambiamento efficace.',
          '<b>Evita gli estremi:</b> osserva dove ti poni rispetto al sentiero di mezzo. Stai andando troppo verso un estremo (troppo dipendente, troppo isolata; troppo rigida, troppo cedevole)?',
          '<b>Riprendersi dall’invalidazione:</b> quando ti senti invalidata, mantieni una posizione non difensiva. Trova ciò che ha valore nelle parole dell’altro, riconosci ciò che non ce l’ha, accetta te stessa radicalmente.',
          'Chiedi alla mente saggia: "Sto tralasciando qualcosa? Dove c’è un nocciolo di verità nell’altra posizione?"'
        ]},
       {id:'ivalida',badge:'VALIDAZIONE',name:'Come validare gli altri (e se stesse)',
        desc:'Riconoscere che i pensieri altrui hanno senso.',
        steps:[
          '<b>Livello 1: Prestare attenzione.</b> Mostrarti presente. Contatto visivo. Non fare altro mentre ascolti. Annuisci. Rispondi con il volto.',
          '<b>Livello 2: Rispecchiare.</b> Ripeti ciò che hai sentito per verificare di aver capito. "Dunque sei arrabbiata perché... Ho capito bene?"',
          '<b>Livello 3: Leggere nella mente.</b> Cogli ciò che non viene detto — linguaggio del corpo, espressioni, contesto. Verbalizzalo con apertura alle correzioni.',
          '<b>Livello 4: Comprendere.</b> Cerca di capire come si sente e perché — data la sua storia, il suo stato, gli eventi attuali.',
          '<b>Validare se stesse:</b> riconosci le tue emozioni come valide. "Mi sento così e ha senso che mi senta così, dato quello che sta succedendo."',
          '<b>Importante:</b> validazione non significa essere d’accordo. Non validare ciò che in effetti non ha valore.'
        ]},
       {id:'imiti',badge:'CREDENZE',name:'Credenze che ostacolano le relazioni',
        desc:'I pensieri automatici che ti ostacolano nelle relazioni.',
        steps:[
          '"Non mi merito ciò che desidero o di cui ho bisogno." → Le tue necessità sono valide quanto quelle degli altri.',
          '"Se faccio una domanda, dimostro di essere debole." → Chiedere è un atto di rispetto — verso te stessa e verso l\'altra persona.',
          '"Rifiutare una richiesta è da egoisti." → Dire no è un diritto. Non puoi aiutare gli altri svuotandoti.',
          '"Dovrebbero sapere cosa voglio senza che io lo dica." → Gli altri non possono leggere nella tua mente. Comunicare è tuo compito.',
          '"Non posso sopportare che qualcuno si arrabbi con me." → Puoi tollerarlo. Il disappunto altrui non ti definisce.',
          '<b>Nota.</b> Riconoscere queste credenze è già metà del lavoro. Non devi credere ai tuoi pensieri automatici.'
        ]},
       {id:'itrova',badge:'TROVARE PERSONE',name:'Trovare le persone giuste e piacere loro',
        desc:'Come costruire nuove amicizie, un passo concreto alla volta.',
        steps:[
          '<b>Ricorda.</b> Ogni persona merita affetto. Trovare amicizie però può richiedere impegno.',
          '<b>Cerca persone vicine.</b> Stare spesso negli stessi posti e farsi notare aiuta a piacersi: gruppi, corsi, lavoro, luoghi che frequenti.',
          '<b>Cerca persone simili.</b> Interessi e valori in comune facilitano il legame. Essere d\'accordo con tutti non ti rende più simpatica, ma i punti in comune aiutano.',
          '<b>Allena la conversazione.</b> Fai domande e rispondi dando qualcosa in più del minimo. Le chiacchiere leggere contano. Racconta di te quanto l\'altra persona. Non interrompere e lascia spazio.',
          '<b>Dì cosa ti piace, con misura.</b> Apprezza in modo sincero e specifico. Niente adulazione, niente complimenti per ottenere favori, e non troppi.',
          '<b>Prepara argomenti.</b> Osserva, leggi, prova esperienze nuove: avrai più cose di cui parlare.'
        ]},
       {id:'imindf',badge:'CON GLI ALTRI',name:'Essere presenti con le persone',
        desc:'Le amicizie durano di più quando siamo davvero lì.',
        steps:[
          '<b>Osserva.</b> Presta attenzione a chi hai davanti con curiosità. Non fare più cose insieme e non preparare già cosa dirai. Stai sull\'altra persona, non su di te. Nota i giudizi e lasciali andare.',
          '<b>Descrivi.</b> Usa parole che descrivono, non che giudicano. Non supporre cosa pensa di te senza verificare i fatti: nessuno vede dentro la testa di un altro. Dai il beneficio del dubbio.',
          '<b>Partecipa.</b> Buttati nell\'interazione, segui il flusso invece di controllarlo, sii dentro la conversazione o l\'attività del gruppo.'
        ]},
       {id:'ichiudi',badge:'CHIUDERE RELAZIONI',name:'Quando e come chiudere una relazione',
        desc:'Decidere con la mente saggia, mai con quella emotiva.',
        steps:[
          '<b>Distruttiva o interferente?</b> Una relazione distruttiva rovina la sicurezza, l\'autostima o la serenità tua o dell\'altra persona. Una interferente ti ostacola negli obiettivi, nel godere della vita o nelle altre relazioni.',
          '<b>Decidi in mente saggia.</b> Mai in mente emotiva.',
          '<b>Se la relazione è importante e non distruttiva,</b> e c\'è speranza, prova prima il problema solving per ripararla.',
          '<b>Prepara con anticipo.</b> Allenati a risolvere i problemi e a chiudere prima che sia tardi. Sii diretta: usa DEAR MAN, GIVE e FAST.',
          '<b>Se ami la persona sbagliata,</b> pratica l\'azione opposta all\'amore.',
          '⚠ <b>Prima di tutto la tua sicurezza.</b> Se subisci abusi gravi o la tua vita è a rischio, chiama il 1522 (numero antiviolenza, gratuito) o un centro antiviolenza vicino a te, per costruire un piano di sicurezza con professioniste. Ci sono anche i centri della rete D.i.Re (direcontrolaviolenza.it).'
        ]}
     ]},
    {id:'dip',icon:'🔗',bg:'#F6EFE3',
     title:'Gestire le dipendenze',
     sub:'Abbandonare comportamenti dipendenti e gestire il craving',
     intro:'Sei dipendente quando non riesci a interrompere un pattern di comportamento nonostante le conseguenze negative. Queste abilità aiutano a costruire l’astinenza, gestire il craving e prevenire le ricadute.',
     skills:[
       {id:'dastinenza',badge:'ASTINENZA',name:'Astinenza dialettica',
        desc:'Impegnarsi al 100%, con un piano per la ricaduta.',
        steps:[
          '<b>Obiettivo principale:</b> astinenza completa e permanente.',
          '<b>Se si ricade:</b> minimizzare il danno e tornare all’astinenza il prima possibile.',
          'Come un atleta olimpico: crede di poter vincere anche se ha perso in passato. Non ci sono vacanze dall’astinenza.',
          '<b>Programma:</b> stai con chi rinforza la tua astinenza. Pianifica attività alternative. Annuncia pubblicamente di aver smesso.',
          '<b>Se ricadi:</b> non trasformare uno scivolone in un disastro. Chiama il terapeuta. Liberati delle tentazioni. Reimpegnati.'
        ]},
       {id:'dmente',badge:'MENTE CHIARA',name:'Mente chiara',
        desc:'Il posto più sicuro tra mente dipendente e mente pulita ingenua.',
        steps:[
          '<b>Mente dipendente:</b> sei controllata dagli impulsi. Pericolosa.',
          '<b>Mente pulita ingenua:</b> pensi "Non ho più un problema". Pericolosa quanto la dipendente.',
          '<b>Mente chiara:</b> sei pulita ma ricordi la mente dipendente. Ti godi il successo restando vigile.',
          '<b>Segnali di mente dipendente:</b> comportamenti che portavano alla dipendenza, mentire, isolarsi.',
          'Goditi il successo, ma pianifica le tentazioni. Ripassa le abilità DBT.'
        ]},
       {id:'dponti',badge:'PONTI',name:'Bruciare i ponti e costruirne di nuovi',
        desc:'Elimina le possibilità di ricaduta e crea nuove associazioni contro il craving.',
        steps:[
          'Impegnati in modo assoluto. Poi elimina tutte le possibilità di ricadere.',
          'Cancella i contatti di persone che alimentano la dipendenza.',
          'Dichiara apertamente a tutti di aver smesso.',
          'Costruisci immagini alternative da richiamare quando senti il craving.',
          '<b>Surfa l’impulso:</b> cavalca le onde del craving come su una tavola. Osservalo aumentare e sparire.'
        ]},
       {id:'dcomunita',badge:'COMUNITÀ',name:'Rinforzo della comunità',
        desc:'Costruire una rete di supporto che rinforzi i comportamenti sani.',
        steps:[
          'Trascorri tempo con persone che supportano la tua astinenza.',
          'Pianifica attività alternative ai momenti di rischio.',
          'Trova un gruppo di supporto: AA, NA o altri.',
          'Annuncia pubblicamente la tua intenzione.',
          'Chiama il terapeuta o una persona di fiducia quando senti il craving.'
        ]},
       {id:'dribellione',badge:'RIBELLIONE',name:'Ribellione alternativa',
        desc:'Per quando la dipendenza serve a ribellarsi.',
        steps:[
          'Trova modi non distruttivi di ribellarti: tingiti i capelli, esprimi opinioni impopolari, compi atti di bontà inaspettati.',
          '<b>Negazione adattiva:</b> quando la mente non regge il craving, nega di volerlo.',
          'Reinterpreta l’impulso: "Non voglio alcol, voglio qualcosa di dolce." Funziona mentre l’impulso passa.'
        ]}
     ]},
    {id:'gen',icon:'🔧',bg:'#DCE8E6',
     title:'Strumenti generali',
     sub:'Analisi dei comportamenti e costruzione di una vita degna di essere vissuta',
     intro:'Questi strumenti trasversali si applicano a tutte le aree della DBT. Servono a capire come funzionano i propri comportamenti e a costruire una vita allineata con i propri valori.',
     skills:[
       {id:'gopzioni',badge:'OPZIONI',name:'Quattro modi di rispondere a un problema',
        desc:'Quando la vita ti mette davanti un problema, cosa puoi fare?',
        steps:[
          '<b>1 — Risolvere il problema.</b> Cambi la situazione, oppure la eviti, la lasci andare o ne trai il meglio possibile. Ti servono le abilità di efficacia interpersonale e il problem solving.',
          '<b>2 — Sentirti meglio rispetto al problema.</b> Cambi (o regoli) la tua risposta emotiva. Ti servono le abilità di regolazione emotiva.',
          '<b>3 — Tollerare il problema.</b> Accetti sia il problema sia la tua reazione, per ora. Ti servono tolleranza della sofferenza e mindfulness.',
          '<b>4 — Restare infelice.</b> È un’opzione anche questa: quella in cui non usi abilità, e a volte le cose peggiorano.',
          '<b>Come usarle.</b> Davanti a un problema chiediti: sto cercando di risolverlo, di sentirmi meglio, di sopportarlo, o sto restando bloccata? Poi scegli l’abilità del modulo giusto.'
        ]},
       {id:'gbiosoc',badge:'BIOSOCIALE',name:'Perché è così difficile gestire emozioni e azioni',
        desc:'La teoria biosociale: sensibilità di partenza più ambiente.',
        steps:[
          '<b>La parte biologica: emozioni.</b> Alcune persone nascono più sensibili: colgono segnali emotivi sottili, provano emozioni più spesso, più forti e più a lungo. Le emozioni possono sembrare arrivare dal nulla e pesare come macigni.',
          '<b>La parte biologica: impulsi.</b> Per alcune persone è più difficile frenare gli impulsi e agire dopo aver pensato. L’umore può rendere difficile organizzarsi per i propri obiettivi.',
          '<b>Un ambiente invalidante</b> dice che le tue emozioni sono sbagliate, esagerate o strane, oppure le ignora. Spesso chi lo fa sta facendo del suo meglio: non sapeva come validare, era sotto stress o temeva di peggiorare le cose. A volte è solo poco adatto a te: un tulipano in un giardino di rose.',
          '<b>Un ambiente inefficace</b> può rinforzare le emozioni e le azioni fuori controllo (si cede quando esplodi) oppure chiede di cambiare senza spiegare come.',
          '<b>Cosa ne segue.</b> Non è un difetto di carattere: è un incontro tra una sensibilità di partenza e l’ambiente in cui sei cresciuta. E le abilità si possono imparare.'
        ]},
       {id:'gcatena',badge:'CATENA',name:'Analisi della catena comportamentale',
        desc:'Capire cosa scatena un comportamento problematico e dove intervenire.',
        steps:[
          '<b>Cos\u2019\u00e8:</b> una sequenza passo-passo di eventi, pensieri, emozioni e azioni che porta a un comportamento problematico.',
          '<b>Passo 1:</b> Descrivi il comportamento problematico in modo specifico.',
          '<b>Passo 2:</b> Fattore di vulnerabilit\u00e0. Cosa ti rendeva pi\u00f9 vulnerabile? (Poco sonno, fame, conflitto, stanchezza...)',
          '<b>Passo 3:</b> Evento scatenante. Cosa ha innescato la catena?',
          '<b>Passo 4:</b> Mappa la catena: pensieri, emozioni, azioni passo per passo fino al comportamento problematico.',
          '<b>Passo 5:</b> Conseguenze immediate e a lungo termine.',
          '<b>Passo 6:</b> Punti di intervento. Dove nella catena avresti potuto fare diversamente? Quale abilit\u00e0 usare?',
          '\U0001f4a1 Non serve a colpevolizzarti \u2014 serve a capire e pianificare come fare meglio.'
        ]},
       {id:'gprocontro',badge:'PRO/CONTRO ABILITÀ',name:'Foglio di lavoro — Usare le abilità?',
        desc:'Usare le abilità o cedere all\'impulso?',
        steps:[
          '<b>Descrivi la situazione:</b> cosa sta succedendo? Qual è il tuo obiettivo?',
          '<b>PRO del praticare le abilità:</b> cosa otterresti a breve e lungo termine?',
          '<b>CONTRO del praticare le abilità:</b> cosa ti costerebbe ora?',
          '<b>PRO del NON praticarle:</b> cosa otterresti cedendo all’impulso?',
          '<b>CONTRO del NON praticarle:</b> quali sarebbero le conseguenze?',
          '<b>Decisione:</b> cosa hai deciso di fare? La tua mente saggia è d’accordo?',
          'Usa questa struttura ogni volta che senti di voler rinunciare alle abilità.'
        ]},
       {id:'gvita',badge:'VITA DEGNA',name:'Costruire una vita degna di essere vissuta',
        desc:'Una vita che vale la pena, sui tuoi valori.',
        steps:[
          'Una vita degna di essere vissuta \u00e8 diversa per ognuno. Non perfetta \u2014 ma con abbastanza significato, connessione e soddisfazione da valere la pena.',
          '<b>Identifica i tuoi valori:</b> cosa \u00e8 davvero importante per te? Relazioni? Lavoro? Creativit\u00e0? Salute? Integrit\u00e0?',
          '<b>Identifica gli ostacoli:</b> comportamenti problematici, emozioni intense, relazioni difficili.',
          '<b>Usa tutte le abilit\u00e0 DBT</b> ogni giorno, non solo nelle crisi.',
          '<b>Piccoli passi ogni giorno</b> verso la vita che vuoi. L\u2019accumulo nel tempo crea cambiamento.',
          '\U0001f4a1 La DBT non \u00e8 solo per le crisi \u2014 \u00e8 per costruire una vita che senti tua.'
        ]}
     ]}
  ];

    MODULES.forEach(function(mod){
    const mDiv=document.createElement('div');mDiv.className='guide-module';
    const hdr=document.createElement('div');hdr.className='guide-module-header';
    hdr.onclick=function(){apriModuloPagina(mod.id);};
    const miniMod = MINIATURA_MODULO[mod.id];
    hdr.className='dc-riga';
    hdr.innerHTML=(miniMod ? '<img class="dc-riga-ill" src="'+miniMod+'" alt="">' : '')
      +'<div class="dc-riga-testo">'
        +'<span class="dc-riga-tit">'+mod.title+'</span>'
        +'<span class="dc-riga-sub">'+(DC_SOTTO_MODULO[mod.id]||mod.sub)+'</span>'
      +'</div>'
      +'<span id="arr-'+mod.id+'">'+DC_CHEV+'</span>';
    mDiv.appendChild(hdr);
    const body=document.createElement('div');body.className='guide-module-body';body.id='body-'+mod.id;
    // segna il modulo, per aggiungere i suoi fogli di lavoro a fine elenco
    body.dataset.modulo = mod.id;
    const intro=document.createElement('div');intro.className='guide-when';
    intro.innerHTML='<strong>Quando usarla:</strong> '+mod.intro;
    body.appendChild(intro);
    mod.skills.forEach(function(sk){
      const skDiv=document.createElement('div');skDiv.className='guide-skill';
      const skHdr=document.createElement('div');skHdr.className='guide-skill-header';
      const pagLettura = SCHEDA_LETTURA[sk.badge];
      if(pagLettura){
        // scheda di sola lettura: si apre nella finestra, senza espandere
        skHdr.setAttribute('data-nav','');
        skHdr.addEventListener('click', function(ev){
          ev.preventDefault(); ev.stopPropagation();
          openScheda(pagLettura);
        });
      } else {
        skHdr.onclick=function(){toggleGuideSkill(sk.id);};
      }
      skHdr.innerHTML='<div class="guide-skill-badge">'+sk.badge+'</div>'
        +'<div class="guide-skill-name" style="flex:1">'+sk.name+'</div>'
        +'<button type="button" class="pf-star" data-nav data-sk="'+sk.id+'" aria-label="Aggiungi ai preferiti" aria-pressed="false">'+PF_STAR_SVG+'</button>'
        +'<svg width="19" height="11" viewBox="0 0 19 11" fill="none" id="sarr-'+sk.id+'" style="flex:none;transition:transform .18s ease"><path d="M2.5 2.5L9.5 8L16.5 2.5" stroke="var(--dc-muted)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      skDiv.appendChild(skHdr);
      const steps=document.createElement('div');steps.className='guide-skill-steps';steps.id='steps-'+sk.id;
      if(!pagLettura){
        sk.steps.forEach(function(step,i){
          const row=document.createElement('div');row.className='guide-step';
          row.innerHTML='<div class="guide-step-n">'+(i+1)+'</div><div class="guide-step-text">'+step+'</div>';
          steps.appendChild(row);
        });
        // la scheda da compilare sta dentro la teoria, non in una lista a parte
        if(typeof grSchedeDa==='function'){
          const sd=grSchedeDa(sk.id);
          if(sd.length){
            const bx=document.createElement('div');bx.className='guide-compila';
            const tt=document.createElement('div');tt.className='guide-schede-titolo';tt.textContent='Compila la scheda';
            bx.appendChild(tt);
            sd.forEach(function(s){
              const b=document.createElement('button');b.type='button';b.className='guide-scheda-link';b.setAttribute('data-nav','');
              b.textContent=s.nome;
              b.addEventListener('click',function(ev){ev.preventDefault();ev.stopPropagation();s.apri();});
              bx.appendChild(b);
            });
            steps.appendChild(bx);
          }
        }
        // post-it: appunti personali presi durante i gruppi (js/postit.js)
        if(typeof piMount==='function'){ steps.appendChild(piMount('sk:'+sk.id,'Appunti dal gruppo')); if(typeof grBlocchiCorrelati==='function') grBlocchiCorrelati('sk:'+sk.id).forEach(function(b){ steps.appendChild(b); }); }
      }
      skDiv.appendChild(steps);body.appendChild(skDiv);
    });
    // anche sul modulo intero (e per le schede di sola lettura, che si aprono in finestra)
    if(typeof piMount==='function') body.appendChild(piMount('mod:'+mod.id,'Appunti sul modulo'));
    mDiv.appendChild(body);el.appendChild(mDiv);
  });
  if(typeof piAggiornaTuttiIBadge==='function') piAggiornaTuttiIBadge();
  // indice di ricerca e preferiti (js/ricerca.js)
  window.GUIDE_INDEX=[];
  MODULES.forEach(function(mod){
    mod.skills.forEach(function(sk){
      window.GUIDE_INDEX.push({mod:mod.id,modTitolo:mod.title,id:sk.id,badge:sk.badge,name:sk.name,desc:sk.desc||'',
        testo:(sk.steps||[]).join(' ').replace(/<[^>]*>/g,' ')});
    });
  });
  if(typeof ricercaMount==='function') ricercaMount();

  // Fogli di lavoro in cima al modulo: sono la parte operativa, chi apre
  // il modulo di solito cerca quelli prima della teoria.
  Object.keys(SCHEDE_PER_MODULO).forEach(function(modId){
    const body=document.getElementById('body-'+modId);
    if(!body) return;
    const wrap=document.createElement('div');
    wrap.className='guide-schede-modulo';
    wrap.innerHTML='<div class="guide-schede-titolo">Fogli di lavoro</div>';
    const senzaTeoria=SCHEDE_PER_MODULO[modId].filter(function(sc){
      return !(typeof grHaTeoria==='function' && grHaTeoria(sc.fg?'fg:'+sc.fg:'sc:'+sc.page));
    });
    if(!senzaTeoria.length) return;
    wrap.firstChild.textContent='Altri fogli di lavoro';
    senzaTeoria.forEach(function(sc){
      const b=document.createElement('button');
      b.type='button';
      b.className='guide-scheda-link';
      // aprire una scheda e' navigazione: resta attivo anche in sola
      // consultazione (modalita' terapeuta)
      b.setAttribute('data-nav','');
      b.textContent=sc.label;
      b.addEventListener('click', function(ev){
        ev.preventDefault(); ev.stopPropagation();
        if(sc.fg) fgApri(sc.fg); else openScheda(sc.page);
      });
      wrap.appendChild(b);
    });
    // dopo l'introduzione "Quando usarla", prima delle abilita':
    // prima si capisce a cosa serve il modulo, poi si apre un foglio
    const intro = body.querySelector('.guide-when');
    if(intro && intro.nextSibling) body.insertBefore(wrap, intro.nextSibling);
    else if(intro) body.appendChild(wrap);
    else body.insertBefore(wrap, body.firstChild);
  });

}

function chPlanDay(d){
  // Auto-save current planner if dirty
  const planData=getPlannerData();
  const hasAny=Object.values(planData).some(a=>a&&a.length>0);
  if(hasAny){
    const key=dkD(curPlan);
    if(!allData[key])allData[key]={scales:{},toggles:{},texts:{},skills:{}};
    allData[key].planner=planData;
    allData[key].savedAt=new Date().toISOString();
    svData();pushChan();
  }
  const nd=new Date(curPlan);nd.setDate(nd.getDate()+d);
  if(nd>new Date())return;
  curPlan=nd;
  renderPlanner();
}

function dkD(d){
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
}

function updPlanDL(){
  // Scriveva su 'plan-dlabel'/'planNxtBtn'/'planPill', elementi che in
  // questa pagina non sono mai esistiti: la primissima riga andava in
  // errore, e siccome l'esecuzione si ferma li', bloccava anche tutto
  // cio' che veniva chiamato subito dopo nella stessa catena.
  const k=dkD(curPlan);
  const isToday=k===today();
  const lbl=document.getElementById('planner-day-label');
  if(lbl) lbl.textContent = isToday ? new Date().toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long'}) : fmtL(curPlan);
}


function updAbiPill(){
  const k=dk(cur);
  const el=document.getElementById('abi-dlabel');
  const pill=document.getElementById('abiPill');
  const nxt=document.getElementById('abiNxtBtn');
  if(el)el.textContent=k===today()?'Oggi':fmtL(cur);
  if(nxt)nxt.disabled=isFut(new Date(cur.getTime()+86400000));
  if(pill){
    const d=allData[k];
    const hasSkill=d&&d.skills&&Object.keys(d.skills).some(s=>d.skills[s]);
    pill.className='pill '+(hasSkill?'saved':'unsaved');
    pill.textContent=hasSkill?'✓ Compilata':'Nessuna abilità';
  }
}


function showDaySummary(k,d){
  const modal=document.getElementById('scheda-modal');
  document.getElementById('scheda-title').textContent=new Date(k+'T12:00:00').toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const body=document.getElementById('scheda-body');
  const s=d.scales||{}, t=d.toggles||{}, tx=d.texts||{};

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

  const critScales=['sp','ai','alci','cbdi','rap','atti'];
  const critTog=['sa','aa','ee','farm'];
  const critTxKeys=['alcu','cbdu'];
  const csRows=critScales.filter(k2=>s[k2]!=null);
  const ctRows=critTog.filter(k2=>t[k2]);
  const cxRows=critTxKeys.filter(k2=>tx[k2]&&tx[k2].trim());
  if(csRows.length||ctRows.length||cxRows.length){
    let c='<div style="display:flex;flex-direction:column;gap:11px">';
    csRows.forEach(k2=>{c+=barra(SCALE_LABELS[k2],s[k2],5,scaleColor(s[k2],POSITIVE_SCALES.has(k2)));});
    c+='</div>';
    if(ctRows.length){
      c+='<div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:2px">';
      ctRows.forEach(k2=>{
        const val=t[k2];
        const isDanger=val==='Sì'&&(k2==='sa'||k2==='aa');
        const bg=isDanger?'var(--dc-cella)':val==='Sì'?'var(--dc-petrolio-chiaro)':'var(--dc-bg)';
        const fg=isDanger?'var(--dc-terracotta)':val==='Sì'?'var(--dc-petrolio)':'var(--dc-muted)';
        c+='<span style="background:'+bg+';color:'+fg+';font-size:12.5px;font-weight:600;padding:9px 14px;border-radius:999px">'+TOG_LABELS[k2]+': '+val+'</span>';
      });
      c+='</div>';
    }
    cxRows.forEach(k2=>{ c+='<div style="margin-top:8px">'+testoLibero(TEXT_LABELS[k2],tx[k2])+'</div>'; });
    html+=card('Comportamenti e sostanze', c);
  }

  const emoScales=['ser','gio','pau','rab','tri','ver','col','vuo','sf','se','abb','fid'];
  const emoRows=emoScales.filter(k2=>s[k2]!=null);
  if(emoRows.length){
    let c='<div style="display:flex;flex-direction:column;gap:11px">';
    emoRows.forEach(k2=>{c+=barra(SCALE_LABELS[k2],s[k2],5,scaleColor(s[k2],POSITIVE_SCALES.has(k2)));});
    c+='</div>';
    html+=card('Emozioni e benessere', c);
  }

  const plan=d.planner;
  const slotLabels={mattina:'Mattina',pomeriggio:'Pomeriggio',sera:'Sera'};
  if(plan&&Object.values(plan).some(a=>a&&a.length>0)){
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

  if(!html)html='<div style="text-align:center;padding:2rem 1rem;color:var(--dc-muted)">Nessun dato compilato.</div>';
  body.innerHTML='<div style="padding:0 22px 26px">'+html+'</div>';
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}

function openGuideSkill(moduleId,skillId){
  // Prima assicura che la Guida sia gia' stata costruita (renderGuide()
  // e' chiamata solo al primo arrivo su quella pagina): senza, il
  // modulo/passo cercati potrebbero non esistere ancora nel documento.
  goPage('guida',null);
  setTimeout(()=>{
    apriModuloPagina(moduleId);
    if(skillId){
      setTimeout(()=>{
        const steps=document.getElementById('steps-'+skillId);
        const sarr=document.getElementById('sarr-'+skillId);
        if(steps&&!steps.classList.contains('open')){
          steps.classList.add('open');
          if(sarr)sarr.style.transform='rotate(180deg)';
        }
        // il cambio pagina riporta in cima (anche in ritardo, su iOS): si
        // scorre alla sezione piu' volte, senza animazione, finche' resta
        const vai=()=>{
          const box=steps&&steps.closest('.guide-skill');
          if(!box) return;
          const y=box.getBoundingClientRect().top+(window.scrollY||document.body.scrollTop||0)-76;
          window.scrollTo(0,Math.max(0,y));
          if(document.body.scrollTop!==undefined && Math.abs((document.body.scrollTop||0)-y)>4) document.body.scrollTop=Math.max(0,y);
        };
        [0,120,350,800].forEach(t=>setTimeout(vai,t));
      },150);
    }
  },100);
}


const dmPriState={};
function dmPri(key,val){
  dmPriState[key]=val;
  document.querySelectorAll('.dm-pri[data-key="'+key+'"]').forEach(b=>{
    const isActive=parseInt(b.getAttribute('data-val'))===val;
    b.style.background=isActive?'var(--teal)':'var(--surface-2)';
    b.style.color=isActive?'#fff':'var(--text)';
    b.style.borderColor=isActive?'var(--teal)':'var(--border)';
  });
}
function dmGenera(){
  const chi=document.getElementById('dm-chi').value.trim();
  const D=document.getElementById('dm-d').value.trim();
  const E=document.getElementById('dm-e').value.trim();
  const A=document.getElementById('dm-a').value.trim();
  const R=document.getElementById('dm-r').value.trim();
  const N=document.getElementById('dm-n').value.trim();
  if(!D&&!E&&!A){alert('Compila almeno D, E e A per generare il copione.');return;}
  let script='';
  if(D) script+='[D — Descrivi] '+D+'\n\n';
  if(E) script+='[E — Esprimi] '+E+'\n\n';
  if(A) script+='[A — Afferma] '+A+'\n\n';
  if(R) script+='[R — Rinforza] '+R+'\n\n';
  if(N) script+='[N — Negozia] '+N;
  document.getElementById('dm-script').textContent=script.trim();
  document.getElementById('dm-output').style.display='block';
  document.getElementById('dm-output').scrollIntoView({behavior:'smooth',block:'start'});
}


function renderPlease(){
  const el=document.getElementById('please-week');
  if(!el)return;
  el.innerHTML='';

  // Griglia 5 righe (voci PLEASE) x 7 giorni, come nel prototipo:
  // ogni cella si tocca per segnare/togliere quella voce quel giorno.
  const RIGHE=[
    {id:'pl',nome:'P\u00b7L Malattie curate'},
    {id:'eq',nome:'E Mangiare bene'},
    {id:'al',nome:'A Evitare sostanze'},
    {id:'so',nome:'S Dormire abbastanza'},
    {id:'ex',nome:'E Movimento'},
  ];
  const GIORNI_LBL=['lun','mar','mer','gio','ven','sab','dom'];
  // lunedi'-domenica di questa settimana, come le etichette del prototipo
  const oggi=new Date();
  const scarto=(oggi.getDay()+6)%7; // 0=lunedi'
  const lunedi=new Date(oggi); lunedi.setDate(oggi.getDate()-scarto);
  const giorni=Array.from({length:7},(_,i)=>{const d=new Date(lunedi);d.setDate(lunedi.getDate()+i);return d;});

  const stored=JSON.parse(localStorage.getItem(ukey('please_data'))||'{}');

  const grid=document.createElement('div');
  grid.className='card';
  grid.style.cssText='display:flex;flex-direction:column;gap:14px';

  // stessa struttura delle righe (etichetta 106px + gap 6px): le sigle restano sopra le caselle
  let html='<div style="display:flex;gap:6px;align-items:center"><span style="width:106px;flex:none"></span>';
  GIORNI_LBL.forEach(g=>{
    html+='<span style="flex:1;min-width:0;text-align:center;font-size:10px;font-weight:600;letter-spacing:0;color:var(--dc-muted);opacity:.7;text-transform:uppercase">'+g.slice(0,3)+'</span>';
  });
  html+='</div>';

  RIGHE.forEach(r=>{
    html+='<div style="display:flex;align-items:center;gap:6px">';
    html+='<span style="width:106px;flex:none;font-size:12.5px;font-weight:600;color:var(--dc-ink);line-height:1.25">'+r.nome+'</span>';
    giorni.forEach(d=>{
      const k=dk(d);
      const on=!!(stored[k]&&stored[k][r.id]);
      html+='<span onclick="togglePlease(\''+k+'\',\''+r.id+'\')" style="flex:1;height:26px;border-radius:9px;cursor:pointer;background:'+(on?'var(--dc-senape)':'var(--dc-cella)')+'"></span>';
    });
    html+='</div>';
  });
  grid.innerHTML=html;
  el.appendChild(grid);

  const nota=document.createElement('div');
  nota.className='card';
  nota.style.cssText='background:var(--dc-surface-2)!important;display:flex;flex-direction:column;gap:6px';
  nota.innerHTML='<span style="font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--dc-terra)">Come si legge</span>'
    +'<span style="font-size:13.5px;line-height:1.5;color:var(--dc-ink)">Una casella per ogni giorno in cui hai curato quella voce. Le settimane con pi\u00f9 caselle vuote sono quelle in cui le emozioni salgono pi\u00f9 facilmente.</span>';
  el.appendChild(nota);
}

function togglePlease(dateKey,itemId){
  const stored=JSON.parse(localStorage.getItem(ukey('please_data'))||'{}');
  if(!stored[dateKey])stored[dateKey]={};
  stored[dateKey][itemId]=!stored[dateKey][itemId];
  localStorage.setItem(ukey('please_data'),JSON.stringify(stored));
  renderPlease();
}


function renderEmozioni(){
  const el=document.getElementById('emozioni-content');
  if(!el)return;
  el.innerHTML='';
  
  const EMOS=[
    {id:'epau',emoji:'😰',label:'Paura',color:'#EEF4F3',border:'#2A6866',
     quando:'Quando c\'è una minaccia reale alla tua vita, salute o benessere.',
     scatenanti:'Situazioni nuove, stare sola, flashback, dover fare cose in pubblico, perseguire i propri sogni.',
     interpretazioni:'"Potrei essere ferita." "Non avrò aiuto." "Fallirò." "Perderò qualcuno."',
     fisico:'Tachicardia, mancanza di respiro, nodo in gola, tensione muscolare, sudore freddo, nausea.',
     azioni:'Fuggire, evitare, immobilizzarsi, chiedere aiuto in modo caotico.',
     opposta:'Avvicinati a ciò che temi, fallo ancora e ancora. Tieni gli occhi aperti. Postura assertiva — testa alta, spalle indietro. Respira lentamente.'
    },
    {id:'erab',emoji:'😠',label:'Rabbia',color:'#F8E8DF',border:'#D8845C',
     quando:'Un obiettivo viene bloccato, qualcuno ti attacca o minaccia, viene offesa la tua integrità.',
     scatenanti:'Impossibilità di raggiungere un obiettivo, attacchi, perdita di rispetto, dolore fisico o emotivo.',
     interpretazioni:'"Sono stata trattata ingiustamente." "Non avrebbe dovuto." "Ho ragione io."',
     fisico:'Tensione muscolare, denti serrati, pugni stretti, faccia che avvampa, senso di esplosione.',
     azioni:'Attacchi verbali, alzare la voce, sarcasmo, sbattere le porte, covare rancore.',
     opposta:'Evita con grazia invece di attaccare. Sii gentile. Immaginati comprensiva. Apri le mani, palmi verso l\'alto. Abbozza un sorriso.'
    },
    {id:'etri',emoji:'😢',label:'Tristezza',color:'#EEF4F3',border:'#2A6866',
     quando:'Hai perso qualcosa o qualcuno. Le cose non sono andate come speravi.',
     scatenanti:'Perdita, morte, rifiuto, separazione, delusione, isolamento.',
     interpretazioni:'"Non otterrò mai ciò che voglio." "Sono inutile." "La situazione non cambierà mai."',
     fisico:'Stanchezza, letargia, vuoto nel petto, difficoltà a deglutire, mancanza di energie.',
     azioni:'Ritirarsi, evitare, stare a letto, parlare poco, darsi per vinti.',
     opposta:'Attivati invece di isolarti. Evita di evitare. Fai cose che ti diano senso di competenza. Testa alta, postura aperta. Aumenta l\'attività fisica.'
    },
    {id:'ecol',emoji:'😔',label:'Colpa',color:'#FCF2D6',border:'#C9714B',
     quando:'Quando il tuo comportamento viola davvero i tuoi valori o il tuo codice morale.',
     scatenanti:'Fare o pensare qualcosa che ritieni sbagliato. Non mantenere una promessa. Causare un danno a qualcuno.',
     interpretazioni:'"Avrei dovuto comportarmi diversamente." "Mi sono comportata male." "Devo essere incolpata."',
     fisico:'Faccia rossa e calda, tensione, nervosismo, senso di soffocamento.',
     azioni:'Chiedere perdono, scusarsi, fare regali per rimediare, piegarsi su se stessi.',
     opposta:'Se la colpa è giustificata: scusati, rimedia al danno, impegnati a non ripetere, perdonati. Se non è giustificata: non scusarti, raccogli le informazioni, postura dignitosa, valida il tuo comportamento.'
    },
    {id:'egel',emoji:'💚',label:'Gelosia',color:'#DCE8E6',border:'#1B4B4A',
     quando:'Una relazione importante è minacciata o in pericolo. Qualcuno minaccia di portarti via qualcosa di prezioso.',
     scatenanti:'Partner che dà attenzione ad altri, possibile rivale, sentirsi ignorati, scoprire tradimenti.',
     interpretazioni:'"Il mio partner non tiene più a me." "Non sono all\'altezza." "Mi lascerà." "Sono stata imbrogliata."',
     fisico:'Tachicardia, nodo in gola, muscoli tesi, sospettosità, bisogno di controllo, sentirsi feriti.',
     azioni:'Interrogatori, controllare il telefono, accuse, comportamenti appiccicosi, gelosia, inseguimenti.',
     opposta:'Smetti di spiare e controllare. Condividi invece di trattenere. Ascolta senza fare domande indagatorie. Tieni gli occhi aperti sui fatti reali. Postura aperta, mani rilassate.'
    },
    {id:'einv',emoji:'😒',label:'Invidia',color:'#FCF2D6',border:'#EFC03B',
     quando:'Una persona o un gruppo ha qualcosa che vuoi o di cui hai bisogno.',
     scatenanti:'Qualcuno ottiene ciò che volevi tu. Non fare parte del gruppo giusto. Qualcuno si vanta di qualcosa.',
     interpretazioni:'"Non è giusto." "Dovrei avere anch\'io quello." "Sono inferiore." "Sono stata sfortunata."',
     fisico:'Muscoli tesi, denti stretti, dolore allo stomaco, voglia che l\'altro perda ciò che ha.',
     azioni:'Sminuire l\'altro, comportarsi in modo passivo-aggressivo, confrontarsi ossessivamente.',
     opposta:'Impedisciti di distruggere ciò che ha l\'altra persona. Pensa alle tue fortune — fai una lista. Smetti di esagerare il valore di ciò che non hai. Postura aperta, mani rilassate, respiro lento.'
    },
    {id:'ever',emoji:'😶',label:'Vergogna',color:'#F5EDE1',border:'#948779',
     quando:'Potresti essere rifiutata da persone cui tieni se certe caratteristiche si venissero a sapere.',
     scatenanti:'Essere rifiutata, criticata in pubblico, fallire dove ci si sente competenti, confrontarsi con uno standard.',
     interpretazioni:'"Sono difettosa." "Non sono abbastanza." "Gli altri mi rifiuteranno."',
     fisico:'Dolore allo stomaco, senso di terrore, impulso a nascondersi o scomparire.',
     azioni:'Nascondersi, abbassare lo sguardo, postura curva, scusarsi ripetutamente.',
     opposta:'Esponi ciò di cui ti vergogni con persone di fiducia. Partecipa invece di isolarti. Testa alta, contatto visivo, postura diritta.'
    },
  ];
  
  EMOS.forEach(emo=>{
    const card=document.createElement('div');
    card.setAttribute('data-emo-card','1');
    const isDark=document.documentElement.getAttribute('data-theme')==='dark';
    // stessa anatomia delle schede dei moduli qui sopra:
    // riquadro bianco, icona in un quadrato tinto, titolo, sottotitolo, freccia
    card.className='guide-module';

    const hdr=document.createElement('div');
    hdr.className='guide-module-header';
    const miniEmo = MINIATURA_EMOZIONE[emo.id];
    hdr.className='dc-riga';
    hdr.innerHTML=(miniEmo ? '<img class="dc-riga-ill" src="'+miniEmo+'" alt="">' : '')
      +'<div class="dc-riga-testo">'
        +'<span class="dc-riga-tit">'+emo.label+'</span>'
        +'<span class="dc-riga-sub">'+(DC_SOTTO_EMO[emo.id]||emo.quando)+'</span>'
      +'</div>'
      +'<span id="earr-'+emo.id+'">'+DC_CHEV+'</span>';
    hdr.onclick=()=>{ apriEmozionePagina(emo.id); };
    card.appendChild(hdr);
    
    const body=document.createElement('div');
    body.id='ebody-'+emo.id;
    body.className='guide-module-body';
    body.style.cssText='display:none;padding:0';
    
    const rows=[
      {label:'Quando corrisponde ai fatti',val:emo.quando},
      {label:'Scatenanti tipici',val:emo.scatenanti},
      {label:'Interpretazioni tipiche',val:emo.interpretazioni},
      {label:'Sensazioni fisiche',val:emo.fisico},
      {label:'Azioni tipiche',val:emo.azioni},
      {label:'Azione opposta',val:emo.opposta,highlight:true},
    ];
    
    rows.forEach(row=>{
      const div=document.createElement('div');
      div.style.cssText=`margin-top:12px;padding:10px 12px;background:${row.highlight?'var(--surface-2)':'var(--surface)'};border-radius:var(--rs);border:1px solid var(--border-l)`;
      div.innerHTML=`<div style="font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px">${row.label}</div><div style="font-size:13px;color:var(--text);line-height:1.55">${row.val}</div>`;
      body.appendChild(div);
    });
    if(typeof piMount==='function') body.appendChild(piMount('emo:'+emo.id,'Appunti sull’emozione'));

    card.appendChild(body);
    el.appendChild(card);
  });
}

// ══════════════════════════════════════════════════════════════════
// Guardare un modulo o un'emozione e' una pagina vera, non un accordion
// dentro la lista - come nel prototipo. Il contenuto (introduzione,
// fogli di lavoro, abilita' con i passi) e' gia' tutto costruito da
// renderGuide()/renderEmozioni(): qui lo spostiamo semplicemente dentro
// la pagina, con la stessa tecnica di openScheda() - un commento
// segnaposto per sapere dove rimetterlo quando si torna indietro.
// ══════════════════════════════════════════════════════════════════
function apriModuloPagina(id){
  const body=document.getElementById('body-'+id);
  const corpo=document.getElementById('modulo-corpo');
  if(!body||!corpo) return;
  // il titolo va letto PRIMA di spostare il blocco: una volta dentro
  // la pagina nuova il fratello precedente non e' piu' la riga della
  // lista, quindi cercarlo dopo restituiva sempre niente.
  const riga=body.previousElementSibling;
  const titolo = riga ? riga.querySelector('.dc-riga-tit').textContent : '';
  body._segnaposto=document.createComment('modulo '+id);
  body.parentElement.insertBefore(body._segnaposto, body);
  corpo.appendChild(body);
  body.classList.add('open');
  body.style.display='block';
  const miniMod=MINIATURA_MODULO[id];
  document.getElementById('modulo-ill').src=miniMod||'';
  document.getElementById('modulo-ill').style.display=miniMod?'':'none';
  document.getElementById('modulo-titolo').textContent = titolo;
  goPage('modulo',null);
}
function chiudiModuloPagina(){
  document.querySelectorAll('.guide-module-body.open').forEach(body=>{
    if(body._segnaposto){
      body._segnaposto.parentElement.insertBefore(body, body._segnaposto);
      body._segnaposto.remove();
      body._segnaposto=null;
    }
    body.classList.remove('open');
    body.style.display='';
  });
  goPage('guida',null);
}

function apriEmozionePagina(id){
  const body=document.getElementById('ebody-'+id);
  const corpo=document.getElementById('emozione-corpo');
  if(!body||!corpo) return;
  const riga=body.previousElementSibling;
  const titolo = riga ? riga.querySelector('.dc-riga-tit').textContent : '';
  body._segnaposto=document.createComment('emozione '+id);
  body.parentElement.insertBefore(body._segnaposto, body);
  corpo.appendChild(body);
  body.classList.add('open');
  body.style.display='block';
  const miniEmo=MINIATURA_EMOZIONE[id];
  document.getElementById('emozione-ill').src=miniEmo||'';
  document.getElementById('emozione-ill').style.display=miniEmo?'':'none';
  document.getElementById('emozione-titolo').textContent = titolo;
  goPage('emozione',null);
}
function chiudiEmozionePagina(){
  document.querySelectorAll('[id^="ebody-"].open').forEach(body=>{
    if(body._segnaposto){
      body._segnaposto.parentElement.insertBefore(body, body._segnaposto);
      body._segnaposto.remove();
      body._segnaposto=null;
    }
    body.classList.remove('open');
    body.style.display='';
  });
  goPage('guida',null);
}

// ══════════════════════════════════════════════════════════════════
// Pagina "Fogli di lavoro": l'elenco completo di tutti i fogli
// compilabili, riusando i titoli gia' definiti in SCHEDA_TITOLI (in
// diary.js) - nessun dato duplicato.
// ══════════════════════════════════════════════════════════════════
const FOGLI_SOTTOTITOLO = {
  please:'Checklist settimanale sulla vulnerabilita\'',
  dearman:'Sette campi guidati, poi il copione',
  fatti:'Sei passi e una scala finale',
  procontro:'Griglia a quattro celle',
  diarioemo:'Voci datate con intensita\' e pensieri',
  pianocrisi:'Segnali, abilita\', persone, motivi',
  catena:'Dall\'evento alle soluzioni',
  eventi:'Elenco per categorie',
  give:'Sola lettura', fast:'Sola lettura', abc:'Sola lettura', sentiero:'Sola lettura'
};
function renderFogli(){
  const el=document.getElementById('fogli-content');
  if(!el)return;
  el.innerHTML='';
  // tutti i fogli, vecchi e nuovi, raggruppati per modulo
  const MODS=[['mind','Mindfulness'],['tol','Tolleranza della sofferenza'],['reg','Regolazione emotiva'],['inter','Efficacia interpersonale'],['gen','Generali']];
  const VECCHI_MOD={sentiero:'mind', pianocrisi:'tol', please:'reg', fatti:'reg', diarioemo:'reg', eventi:'reg', abc:'reg',
    dearman:'inter', give:'inter', fast:'inter', procontro:'gen', catena:'gen'};
  function riga(titolo,sotto,fn){
    const row=document.createElement('div');
    row.className='dc-foglio-riga';
    row.onclick=fn;
    row.innerHTML='<div class="dc-riga-testo"><span class="dc-riga-tit"></span><span class="dc-riga-sub"></span></div>'+DC_CHEV;
    row.querySelector('.dc-riga-tit').textContent=titolo;
    row.querySelector('.dc-riga-sub').textContent=sotto||'';
    return row;
  }
  MODS.forEach(function(m){
    const voci=[];
    Object.keys(SCHEDA_TITOLI).forEach(function(key){
      if((VECCHI_MOD[key]||'gen')===m[0]) voci.push(riga(SCHEDA_TITOLI[key],FOGLI_SOTTOTITOLO[key]||'',function(){ openScheda(key); }));
    });
    if(typeof FG_FOGLI!=='undefined'){
      FG_FOGLI.filter(function(f){return f.mod===m[0];}).forEach(function(f){
        voci.push(riga(f.t,f.sub,function(){ fgApri(f.id); }));
      });
    }
    if(!voci.length) return;
    const t=document.createElement('div');
    t.className='guide-schede-titolo fg-mod'; t.textContent=m[1];
    el.appendChild(t);
    voci.forEach(function(v){ el.appendChild(v); });
  });
}

