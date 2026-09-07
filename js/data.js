// ════════════════════════════════════════════════════════════════
// DATA — Costanti DBT, skill, scale
// ════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════
// DATA
// ══════════════════════════════════════════
const S5=['sp','ai','ser','gio','pau','rab','tri','ver','col','vuo','sf','se','abb','fid','atti'];
const SCBDI=['alci','cbdi'];
const TG=['sa','aa','ee','farm'];
const TX=['rim','att','note'];
const TX_INPUT=['alcu','cbdu','rap'];

const SKG=[
  {g:'Mindfulness',it:['Mente saggia','Osservare','Descrivere','Partecipare','Non giudicare','Stare focalizzato','Fare ciò che funziona']},
  {g:'Regolazione emotiva',it:['Identificare emozioni','Controllare i fatti','PLEASE','Mastery','Cope ahead','Strutturare tempo','Obiettivi a lungo termine','Azione opposta','Problem solving']},
  {g:'Efficacia interpersonale',it:['Priorità nelle relazioni','DEAR MAN','GIVE','FAST','Frasi automotivanti']},
  {g:'Tolleranza della sofferenza',it:['TIP','STOP','Distrazione/auto-consolazione','Pro e contro','Accettazione radicale','Mezzo sorriso','Disponibilità']},
  {g:'Sentiero di mezzo',it:['Rinforzi positivi','Validare se stessi','Validare qualcun altro','Pensiero dialettico','Agire dialettico']}
];

const DBT_SKILLS=[
  {id:'tip',name:'TIP',icon:'TIP',color:'#E6F5F3',desc:'Cambia rapidamente la chimica del corpo',steps:[
    'T — Temperatura: immergi il viso in acqua fredda (min 10°C) trattenendo il fiato per 30 sec. Oppure tieni un impacco freddo sugli occhi e guance.',
    'I — Esercizio fisico Intenso: corri, salta, fai squat per almeno 20 minuti per scaricare l\'energia emotiva accumulata.',
    'P — Placa la respirazione: inspira per 5 sec, espira per 7 sec. Ripeti per 5 minuti. L\'espirazione più lunga attiva il sistema parasimpatico.',
    'P — rilassamento muscolare Progressivo: contrai ogni gruppo muscolare per 5-6 sec poi rilascia. Inizia dai piedi e sali fino al viso.'
  ]},
  {id:'stop',name:'STOP',icon:'STP',color:'#FCEBEB',desc:'Interrompi la reazione impulsiva',steps:[
    'S — Stop: fermati. Non muovere un muscolo. Congela la situazione.',
    'T — fai un passo indieT​ro: allontanati fisicamente o mentalmente. Fai un respiro profondo.',
    'O — Osserva: cosa sta succedendo dentro e fuori di te? Quali sono i tuoi pensieri e sentimenti?',
    'P — Procedi in maniera mindful: agisci con consapevolezza. Quale azione renderebbe la situazione migliore?'
  ]},
  {id:'acqua',name:'Acqua fredda',icon:'H₂O',color:'#E6F1FB',desc:'Il riflesso da immersione calma il sistema nervoso',steps:[
    'Riempi una bacinella con acqua fredda (non ghiacciata, min 10°C).',
    'Trattieni il fiato e immergi il viso per 15-30 secondi.',
    'In alternativa: tieni un sacchetto con acqua fredda sugli occhi e guance.',
    'Siediti in tranquillità — muoversi riduce l\'efficacia.',
    'Attenzione: non usare se hai problemi cardiaci o assumi farmaci betabloccanti.'
  ]},
  {id:'migliora',name:'MIGLIORA',icon:'MIG',color:'#FFF3CD',desc:'Migliora il momento presente',steps:[
    'IMmaginazione: immagina una scena rilassante o una stanza sicura nella tua mente.',
    'SIgnificato: trova uno scopo o un significato anche nella sofferenza.',
    'PreGhiera: apri il cuore a qualcosa di più grande di te.',
    'Attività riLassanti: bagno caldo, yoga, respiro profondo.',
    'Un passo alla volta: concentrati solo su quello che stai facendo ORA.',
    'breve ripOso: concediti una vacanza mentale.',
    'AutoincoRAggiamento: "Ce la posso fare", "Passerà anche questo".'
  ]},
  {id:'rilassamento',name:'Rilassamento muscolare',icon:'REL',color:'#E6F5F3',desc:'Progressivo: 16 gruppi muscolari',steps:[
    'Assumi una posizione comoda. Allenta gli abiti.',
    'Inizia dai piedi: contrai i muscoli per 5-6 sec durante l\'inspirazione.',
    'Rilascia durante l\'espirazione, ripeti mentalmente "Rilassati".',
    'Osserva la differenza tra tensione e rilassamento per 10-15 sec.',
    'Procedi verso l\'alto: polpacci → cosce → addome → schiena → spalle → braccia → mani → collo → viso.',
    'Con la pratica puoi rilassare tutto il corpo in pochi secondi.'
  ]},
  {id:'accettazione',name:'Accettazione radicale',icon:'ACC',color:'#EEEDFE',desc:'Accettare la realtà com\'è, non come vorresti che fosse',steps:[
    'Riconosci la situazione dolorosa senza giudicarla come "ingiusta".',
    'Ricorda: accettare non significa approvare, ma smettere di lottare contro la realtà.',
    'Nota la resistenza nel corpo (tensione, rabbia) — è normale.',
    'Ripeti: "Questo sta accadendo. Non posso cambiarlo in questo momento."',
    'Orienta l\'energia verso quello che puoi fare, non verso quello che non puoi cambiare.'
  ]},
  {id:'minda',name:'Mindfulness emozioni',icon:'MND',color:'#E6F5F3',desc:'Cavalca l\'onda emotiva senza esserne travolti',steps:[
    'Fai un passo indietro e osserva l\'emozione come un\'onda che va e viene.',
    'Non bloccarla, non respingerla, non aggrappartici, non amplificarla.',
    'Nota dove la senti nel corpo. Sperimenta le sensazioni completamente.',
    'Ricorda: tu non sei la tua emozione. Non devi agire su di essa.',
    'Pratica l\'amore per la tua emozione: rispettala, accettala radicalmente.'
  ]},
  {id:'dear',name:'DEAR MAN',icon:'DM',color:'#EEF2FF',desc:'Chiedi ciò che vuoi in modo efficace',steps:[
    'D — Descrivi la situazione con i fatti puri.',
    'E — Esprimi come ti senti: "Mi sento..." (non "Tu mi fai sentire").',
    'A — Afferma ciò che vuoi chiaramente. Non aspettarti che indovinino.',
    'R — Rinforza: spiega le conseguenze positive per l\'altra persona.',
    'M — sii Mindful: mantieni il focus sull\'obiettivo anche se ti attaccano.',
    'A — Appari sicura: contatto visivo, voce calma, postura dritta.',
    'N — Negozia: sii disposta a dare per ricevere.'
  ]},
  {id:'procontro',name:'Pro e Contro',icon:'P/C',color:'#FFF3CD',desc:'Valuta prima di agire sull\'impulso',steps:[
    'Scrivi i PRO del cedere all\'impulso: cosa otterresti nel breve termine?',
    'Scrivi i CONTRO del cedere: quali conseguenze a lungo termine?',
    'Scrivi i PRO del resistere: cosa guadagneresti?',
    'Scrivi i CONTRO del resistere: cosa ti costerebbe?',
    'Conserva la lista con te e rileggila quando senti l\'impulso.'
  ]},
  {id:'please',name:'PLEASE',icon:'PLS',color:'#E6F5F3',desc:'Prenditi cura del corpo per ridurre la vulnerabilità',steps:[
    'PL — PhysicaL: vai dal medico, prendi le medicine prescritte.',
    'E — alimentazione Equilibrata: non saltare pasti.',
    'A — Astieniti da sostanze Alteranti: alcol e droghe aumentano la reattività.',
    'S — Sonno bilanciato: mantieni un ritmo regolare.',
    'E — Esercizio fisico: almeno 20 minuti al giorno.'
  ]},
  {id:'sorriso',name:'Mezzo sorriso',icon:'☺',color:'#FEF6E4',desc:'Accettare la realtà attraverso il corpo',steps:[
    'Rilassa il viso dalla sommità del capo alla mandibola.',
    'Lascia che le labbra salgano leggermente — appena percettibile.',
    'Tieni le mani aperte, palmi verso l\'alto.',
    'Praticalo appena ti svegli, nei momenti liberi, quando sei irritata.',
    'Ricorda: il corpo comunica con il cervello. Cambiare postura cambia le emozioni.'
  ]}
];

const LEISURE_CATS={
  vista:{label:'Vista',items:[
    'Guarda le stelle nel cielo notturno','Osserva la natura intorno a te',
    'Compra un fiore che trovi bello','Crea in casa un angolo bello da vedere',
    'Accendi una candela e osserva la fiamma','Arreda con oggetti che ami',
    'Osserva le persone o le vetrine','Visita un museo o galleria d\'arte',
    'Guarda un\'alba o un tramonto','Fai una passeggiata panoramica',
    'Siedi nella hall di un hotel che trovi bello','Sii consapevole di ogni cosa che guardi'
  ]},
  udito:{label:'Udito',items:[
    'Ascolta musica che trasmette calma o energia','Presta attenzione ai suoni della natura',
    'Presta attenzione ai suoni della città','Canta la tua canzone preferita',
    'Canticchia una melodia rilassante','Impara a suonare uno strumento',
    'Crea una compilation e ascoltala','Accendi la radio',
    'Sii consapevole di ogni suono'
  ]},
  olfatto:{label:'Olfatto',items:[
    'Usa una saponetta o crema che ami','Brucia incenso o candela profumata',
    'Apri una confezione di caffè e assaporane l\'aroma','Metti olio di limone sui mobili',
    'Metti pot-pourri o eucalipto in una ampolla','Siediti in auto nuova e assapora i profumi',
    'Fai bollire della cannella o prepara biscotti','Annusa delle rose',
    'Passeggia in una zona alberata','Apri la finestra e inspira i profumi'
  ]},
  gusto:{label:'Gusto',items:[
    'Mangia i tuoi cibi preferiti','Bevi un tè alle erbe o cioccolata calda',
    'Offriti un dessert','Mangia un piatto che amavi da bambina',
    'Assaggia i gusti in una gelateria','Succhia una caramella alla menta',
    'Mastica le gomme preferite','Assapora ogni boccone con attenzione',
    'Prendi una porzione di cibo speciale'
  ]},
  tatto:{label:'Tatto',items:[
    'Fai un lungo bagno caldo o una doccia','Coccola il tuo animale domestico',
    'Fai un massaggio o pediluvio','Spalmati della crema per il corpo',
    'Avvolgiti in una coperta','Metti lenzuola pulite nel letto',
    'Abbraccia qualcuno','Scorri la mano su una superficie liscia in legno o pelle',
    'Guida con i finestrini abbassati','Accoccolati su una sedia comoda',
    'Indossa una maglia piacevole','Appoggia qualcosa di fresco sulla fronte'
  ]},
  distrarsi:{label:'Distrarsi (ACCETTA)',items:[
    'Focalizza l\'attenzione su un compito importante','Noleggia un film o guarda la TV',
    'Pulisci una stanza','Trova un evento cui partecipare',
    'Gioca al computer','Esci a fare una passeggiata',
    'Naviga in internet o scrivi e-mail','Pratica dello sport',
    'Esci per pranzo o cena','Chiama un amico',
    'Ascolta della musica','Costruisci qualcosa',
    'Gioca a carte','Leggi riviste, libri, fumetti',
    'Fai parole crociate o sudoku','Trova un\'attività di volontariato',
    'Aiuta un amico o familiare','Sorprendi qualcuno con un pensiero carino',
    'Dona oggetti non indispensabili','Confronta come ti senti ora con momenti passati',
    'Leggi vecchie lettere ricevute','Guarda spettacoli che ti coinvolgono',
    'Ascolta musica che ti emozioni','Lascia la situazione da parte per un momento',
    'Allontanati con il pensiero','Blocca pensieri e immagini',
    'Conta fino a dieci','Componi dei puzzle',
    'Ripeti mentalmente le parole di una canzone','Stringi forte una palla di gomma',
    'Ascolta musica ad alto volume','Esci nella pioggia o sotto la neve',
    'Fai un bagno caldo o doccia fredda','Tieni del ghiaccio in mano o in bocca'
  ]},
  migliora:{label:'Migliora il momento',items:[
    'Immagina una scena rilassante','Immagina una stanza segreta sicura dentro di te',
    'Immagina che stia andando tutto bene','Inventa un mondo fantastico rilassante',
    'Immagina che le emozioni dolorose scorrano via','Ricorda un momento felice e rivivilo',
    'Trova uno scopo in una situazione dolorosa','Concentrati sugli aspetti positivi',
    'Ripeti mentalmente aspetti positivi','Apri il cuore a qualcosa di più grande',
    'Fai un bagno caldo o entra in vasca idromassaggio','Bevi del latte caldo',
    'Massaggia il collo e il cuoio capelluto','Pratica yoga o esercizi distensivi',
    'Respira profondamente','Concentrati solo su quello che stai facendo ORA',
    'Rimani nel presente','Sposta la mente sul momento presente',
    'Concediti una breve vacanza mentale','Mettiti a letto e tira le coperte sopra la testa',
    'Trascorri una giornata in spiaggia o nel bosco','Prendi una rivista e leggila',
    'Sostieni te stessa: "Ce la posso fare"','Ripeti: "Passerà anche questo"',
    'Ripeti: "Andrà bene"','Ripeti: "Non durerà per sempre"',
    'Prendi un\'ora di pausa da un lavoro impegnativo'
  ]}
};

