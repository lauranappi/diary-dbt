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
  if(arr)arr.style.transform=open?'rotate(90deg)':'';
}
function renderGuide(){
  const el=document.getElementById('guida-content');
  if(!el)return;
  if(el.innerHTML.trim())return;

  const MODULES=[
    {id:'tol',icon:'🌊',bg:'#FEF0F0',
     title:'Tolleranza della sofferenza',
     sub:'Sopravvivere alle crisi senza peggiorare la situazione',
     intro:'Queste abilità servono quando provi un dolore intenso che non puoi alleviare subito, quando agiresti sulla spinta delle emozioni ma questo peggiorerebbe la situazione, o quando la mente emotiva minaccia di prendere il sopravvento. Non sono per i problemi quotidiani — sono per le crisi.',
     skills:[
       {id:'stop',badge:'STOP',name:'Interrompi la reazione impulsiva',
        desc:'Fermati prima di agire. Per ogni situazione in cui stai per reagire d\'impulso.',
        steps:[
          '<b>S — Stop.</b> Non reagire. Congelati. Non muovere un muscolo. Le emozioni vogliono farti agire senza pensare — non lasciarle.',
          '<b>T — fai un passo indieT​ro.</b> Prendi distanza fisica o mentale. Fai un respiro profondo. Non lasciare che i sentimenti ti spingano ad agire impulsivamente.',
          '<b>O — Osserva.</b> Cosa sta succedendo dentro di te (pensieri, emozioni, sensazioni) e fuori (situazione, altre persone)?',
          '<b>P — Procedi in maniera mindful.</b> Agisci con consapevolezza. Considera la situazione, le emozioni tue e altrui. Chiedi alla mente saggia: quale azione migliorerebbe la situazione? Quale la peggiorerebbe?'
        ]},
       {id:'tip',badge:'TIP',name:'Cambia la chimica del corpo',
        desc:'Per ridurre rapidamente emozioni intense che dominano la mente. Cambia la fisiologia del corpo in pochi minuti.',
        steps:[
          '<b>T — Temperatura.</b> Immergi il viso in acqua fredda (min 10°C) trattenendo il fiato per 30 secondi, oppure applica un impacco freddo sugli occhi e guance. Il "riflesso da immersione" rallenta il battito cardiaco e calma il sistema nervoso.',
          '<b>I — esercizio fisico Intenso.</b> Corri, salta, fai squat per almeno 20 minuti. Consuma l\'energia fisica accumulata dalle emozioni intense.',
          '<b>P — Placa la respirazione.</b> Respira profondamente con la pancia. Inspira per 5 secondi, espira per 7 secondi. L\'espirazione più lunga attiva il sistema parasimpatico (calma).',
          '<b>P — rilassamento muscolare Progressivo.</b> Contrai ogni gruppo muscolare per 5-6 sec inspirando, poi rilascia espirando e dì "Rilassati". Inizia dai piedi e sali fino al viso.',
          '⚠ <b>Attenzione:</b> consulta il medico prima di usare TIP se hai problemi cardiaci, prendi farmaci betabloccanti, o hai disturbi alimentari.'
        ]},
       {id:'procontro',badge:'PRO/CONTRO',name:'Valuta pro e contro',
        desc:'Quando senti un forte impulso a fare qualcosa di potenzialmente dannoso, fai una lista prima.',
        steps:[
          '<b>Scrivi i pro</b> del cedere all\'impulso: cosa otterresti nel breve termine?',
          '<b>Scrivi i contro</b> del cedere all\'impulso: quali sarebbero le conseguenze a lungo termine?',
          '<b>Scrivi i pro</b> del resistere all\'impulso: cosa guadagneresti?',
          '<b>Scrivi i contro</b> del resistere: cosa ti costerebbe?',
          'Conserva la lista con te. Rileggila quando senti l\'impulso. Ricorda le conseguenze passate di quando hai ceduto impulsivamente.'
        ]},
       {id:'accept',badge:'ACCETTA',name:'Distrarsi con mente saggia',
        desc:'Sette strategie per spostare l\'attenzione dalla sofferenza senza negarla.',
        steps:[
          '<b>A — Attività.</b> Fai qualcosa che assorba l\'attenzione: sport, hobby, pulizie, film. Qualsiasi cosa che occupi mente e corpo.',
          '<b>C — Contribuire.</b> Aiuta qualcun altro: chiama un\'amica, fai volontariato, scrivi un messaggio incoraggiante. Uscire da se stesse aiuta.',
          '<b>C — Confronti.</b> Confrontati con momenti in cui stavi peggio, o con persone in situazioni più difficili — non per sminuire il dolore, ma per trovare prospettiva.',
          '<b>E — Emozioni diverse.</b> Suscita emozioni opposte: commedie quando sei triste, film emozionanti quando ti senti vuota, musica che ti attiva.',
          '<b>T — Tieni le distanze.</b> Allontanati fisicamente o mentalmente dalla situazione per un po\'. Costruisci un muro immaginario. "Metti in pausa" il problema.',
          '<b>T — Thoughts (pensieri).</b> Distrai la mente: conta fino a 10, fai un puzzle, recita qualcosa a memoria, conta i colori intorno a te.',
          '<b>A — Azioni intense.</b> Qualcosa che richieda concentrazione totale: sport, videogiochi impegnativi, suonare uno strumento, cantare.'
        ]},
       {id:'sensi',badge:'5 SENSI',name:'Autoconsolati attraverso i 5 sensi',
        desc:'Usa i sensi per portare calma e conforto nel momento presente.',
        steps:[
          '<b>Vista.</b> Guarda le stelle nel cielo notturno. Osserva la natura. Guarda immagini che ti piacciono. Trova qualcosa di bello nell\'ambiente intorno a te.',
          '<b>Udito.</b> Ascolta musica che ti calma o ti piace. I suoni della natura. Il silenzio consapevole. Nota ogni suono senza giudicarlo.',
          '<b>Olfatto.</b> Odora una candela, un fiore, aria fresca. Prepara qualcosa di buono da mangiare. Il profumo ha un effetto diretto sulle emozioni.',
          '<b>Gusto.</b> Mangia o bevi qualcosa di piacevole lentamente, assaporando ogni sfumatura. Un tè caldo, del cioccolato, un frutto.',
          '<b>Tatto.</b> Fai un bagno caldo. Avvolgiti in una coperta morbida. Accarezza un animale. Il contatto fisico confortante regola il sistema nervoso.'
        ]},
       {id:'migliora',badge:'MIGLIORA',name:'Migliora il momento presente',
        desc:'Sette strategie per rendere il momento presente più tollerabile quando stai soffrendo.',
        steps:[
          '<b>M — Immagini mentali (Meaning).</b> Usa immagini mentali che ti calmano: un posto sicuro, la natura, un ricordo felice. Oppure dai un senso alla sofferenza — cosa ti sta insegnando?',
          '<b>I — Intenzione (Intention).</b> Focalizzati su un\'intenzione per il momento: "Voglio superare questa ora". Un\'intenzione piccola e concreta.',
          '<b>G — Gioia (Gentleness).</b> Sii gentile con te stessa. Pensa a cosa diresti a un\'amica nella tua situazione — dillo a te stessa.',
          '<b>L — Lasciati andare (Letting go).</b> Rilascia temporaneamente pensieri e preoccupazioni. Non devi risolvere tutto ora.',
          '<b>I — Incoraggiamento (Incentive).</b> Ricorda le ragioni per cui vale la pena andare avanti. Cosa c\'è di bello nella tua vita? Cosa ti aspetti con piacere?',
          '<b>O — Orientamento (One thing).</b> Fai una cosa sola alla volta. Concentra tutta l\'attenzione solo su questo momento, su questa attività.',
          '<b>R — Riposo e relax (Relaxation).</b> Rilassamento muscolare, respirazione lenta, musica rilassante, doccia calda, tisana.'
        ]},
       {id:'sorriso',badge:'MEZZO SORRISO',name:'Abbozzare un sorriso e mani aperte',
        desc:'Accettare la realtà attraverso il corpo — la postura e l’espressione comunicano con il cervello.',
        steps:[
          '<b>Il mezzo sorriso:</b> rilassa il viso dalla sommità del capo alla mandibola. Lascia che entrambe le estremità della bocca salgano leggermente — il minimo che ti permetta di accorgertene. Non un ghigno: labbra leggermente sollevate in un volto rilassato.',
          '<b>Mani aperte in piedi:</b> lascia cadere le braccia lungo i fianchi, mani aperte girate verso l’esterno, palmi verso l’alto, dita rilassate.',
          '<b>Mani aperte seduta:</b> sistema le mani sul grembo o sulle cosce, palmi rivolti verso l’alto, dita rilassate.',
          '<b>Quando usarlo:</b> appena ti svegli (prima di alzarti), nei momenti liberi, mentre ascolti musica, quando sei irritata, quando sei tesa.',
          '<b>Con persone difficili:</b> siediti. Respira e abbozza un sorriso. Pensa a una persona con cui sei arrabbiata. Cerca di capire cosa la rende felice o la fa soffrire. Continua finché senti un po’ di compassione e la rabbia diminuisce.',
          '💡 Ricorda: la faccia e le mani comunicano con il cervello. Il corpo è connesso alla mente — cambiare la postura cambia davvero come ci sentiamo.'
        ]},
       {id:'accrad',badge:'ACCETT. RADICALE',name:'Accettazione radicale',
        desc:'Smettere di combattere contro la realtà per uscire dalla sofferenza — non significa approvare, ma accettare i fatti così come sono.',
        steps:[
          '<b>Cos\'è:</b> accettazione radicale significa accettare completamente — con mente, cuore e corpo — la realtà così com\'è. Non è arrendersi, è smettere di lottare contro ciò che non si può cambiare ora.',
          '<b>Perché:</b> rifiutare la realtà non la cambia, ma trasforma il dolore in sofferenza. Il dolore è inevitabile; la sofferenza è opzionale.',
          '<b>Come praticarla:</b> osserva il pensiero "questa cosa non dovrebbe essere così". Nota la lotta interiore. Di\' a te stessa: "La realtà è questa, anche se non mi piace". Ripetilo finché senti un piccolo allentamento.',
          '<b>Orienta la mente:</b> ogni volta che la mente torna a combattere la realtà, riorientala gentilmente verso l\'accettazione. Non è un\'azione unica — è una pratica continua.',
          '💡 L\'accettazione porta spesso prima alla tristezza, poi a una profonda calma.'
        ]}
     ]},
    {id:'mind',icon:'🧘',bg:'#E6F5F3',
     title:'Mindfulness',
     sub:'Vivere consapevolmente nel momento presente',
     intro:'La mindfulness è la pratica di prestare attenzione intenzionalmente al momento presente, senza giudicarlo. Non è meditazione formale — puoi praticarla mentre fai qualsiasi cosa. Le abilità di mindfulness sono la base di tutta la DBT.',
     skills:[
       {id:'mstati',badge:'STATI MENTE',name:'I tre stati della mente',
        desc:'Comprendere in quale stato ti trovi aiuta a scegliere come rispondere.',
        steps:[
          '<b>Mente razionale.</b> Fredda, logica, guidata da fatti e ragione. Utile per risolvere problemi pratici. Ignora emozioni e valori — può portare a decisioni corrette ma vuote di significato.',
          '<b>Mente emotiva.</b> Calda, impulsiva, governata dai sentimenti. Le emozioni controllano pensieri e azioni. Utile per amore, creatività, connessione — pericolosa nelle crisi e per decisioni importanti.',
          '<b>Mente saggia.</b> L\'integrazione delle due. Conosce sia i fatti sia le emozioni, e sa quando seguire l\'una o l\'altra. È la voce interiore più profonda e "giusta". Puoi accedervi con la pratica della mindfulness.',
          '💡 Come trovare la mente saggia: fai un respiro profondo. Chiediti: "Nel profondo, so cosa è giusto fare?" Aspetta la risposta che sale dal centro, non dalla testa né dal cuore.'
        ]},
       {id:'mcosa',badge:'COSA',name:'Osservare, Descrivere, Partecipare',
        desc:'Le tre abilità del "cosa" — cosa fare quando pratichi la mindfulness.',
        steps:[
          '<b>Osservare.</b> Nota l\'esperienza senza aggrapparti ad essa o respingerla. I pensieri sono come nuvole che passano, le emozioni come onde. Osserva senza reagire. "Sto notando una sensazione di tensione."',
          '<b>Descrivere.</b> Metti in parole l\'esperienza — "Sto avendo il pensiero che...", "Sento una stretta al petto". Descrivere crea distanza dall\'emozione e riduce la sua intensità.',
          '<b>Partecipare.</b> Buttati completamente nell\'attività del momento, senza autoconsapevolezza. Diventa una con ciò che fai — ballare, cucinare, parlare. Non osservare da fuori: entra dentro l\'esperienza.'
        ]},
       {id:'mcome',badge:'COME',name:'Non giudicare, Una cosa, Efficacia',
        desc:'Le tre abilità del "come" — come praticare la mindfulness.',
        steps:[
          '<b>Astenersi dal giudizio.</b> Osserva senza valutare come buono/cattivo, giusto/sbagliato. Invece di "questo è terribile", prova "questo è quello che sta succedendo". Nota quando giudichi e lascia andare il giudizio — senza giudicarti per aver giudicato.',
          '<b>Una cosa per volta.</b> Concentra tutta l\'attenzione sull\'attività del momento. Se la mente vaga, riportala gentilmente. Non fare più cose contemporaneamente — né fisicamente né mentalmente.',
          '<b>Essere efficaci.</b> Fai ciò che funziona nella situazione reale, non ciò che è "giusto" in assoluto o ciò che vorresti dover fare. Lascia perdere l\'orgoglio e i principi astratti — fai quello che serve per raggiungere i tuoi obiettivi.'
        ]},
       {id:'memozioni',badge:'EMOZIONI ORA',name:'Mindfulness delle emozioni del momento',
        desc:'Osservare un’emozione senza agire su di essa — cavalcare l’onda invece di esserne travolti.',
        steps:[
          '<b>Osserva l’emozione.</b> Fai un passo indietro e limitati a osservarla. Come un’onda che va e viene. Non bloccarla, non respingerla, non aggrappartici, non amplificarla.',
          '<b>Pratica la consapevolezza corporea.</b> Nota dove nel corpo senti le sensazioni dell’emozione. Sperimenta le sensazioni il più completamente possibile. Osserva quanto ci vuole perché l’emozione diminuisca.',
          '<b>Ricorda: tu non sei la tua emozione.</b> Non devi necessariamente agire su di essa. Ricorda le volte in cui ti sei sentita diversamente.',
          '<b>Pratica l’amore per la tua emozione.</b> Rispetta la tua emozione. Non giudicarla. Accettala radicalmente. Allena la tua disponibilità a sentirla.',
          '💡 Gestire emozioni estreme: se sei al punto di rottura (sofferenza estrema, mente che si spegne), prima usa TIP o ACCETTA per ridurre l’attivazione, poi torna alla mindfulness delle emozioni.'
        ]},
       {id:'mpensieri',badge:'PENSIERI ORA',name:'Mindfulness dei pensieri del momento',
        desc:'Osservare i pensieri come eventi mentali che passano — non come fatti su di te.',
        steps:[
          '<b>Osserva i tuoi pensieri</b> come onde che vanno e vengono. Senza analizzarli, senza sopprimerli, senza giudicarli. Fai un passo indietro e guardali correre fuori e dentro la mente.',
          '<b>Adotta una mente curiosa.</b> Chiediti: "Da dove arrivano i miei pensieri?" Nota che ogni pensiero che entra, esce. Non trattenere.',
          '<b>Ricorda: tu non sei i tuoi pensieri.</b> Non devi necessariamente agire su di essi. Il pensiero catastrofico è parte della mente emotiva — non è la realtà.',
          '<b>Non bloccare o sopprimere i pensieri.</b> Chiediti: "Quali sensazioni cerco di evitare con questi pensieri?" Poi sposta la mente sulle sensazioni, poi torna ai pensieri.',
          '<b>Gioca con i tuoi pensieri.</b> Ripetili ad alta voce più volte velocemente. Cantali. Immagina i pensieri come parole di un clown o come un bel colore che attraversa la mente. Prova ad amarli.'
        ]},
       {id:'mrespiro',badge:'RESPIRO',name:'Mindfulness del respiro',
        desc:'Il respiro come ancora al momento presente — un esercizio pratico in qualsiasi momento.',
        steps:[
          '<b>Posizione:</b> siediti comodamente o sdraiati. Chiudi gli occhi o abbassa lo sguardo. Rilassa le spalle.',
          '<b>Osserva il ventre:</b> quando inspiri, lascia che il ventre si sollevi. Quando espiri, nota prima il ventre, poi il petto scendere. Non forzare.',
          '<b>Nota le pause:</b> c’è una pausa naturale quando i polmoni sono pieni, e una quando sono vuoti. Osservale senza trattenerle.',
          '<b>Naso:</b> chiudi la bocca e respira dal naso. Nota la sensazione dell’aria nelle narici — più fresca in entrata, più calda in uscita.',
          '<b>Se la mente vaga:</b> è normale. Nota che sei andata altrove, e riporta gentilmente l’attenzione al respiro — senza giudicarti.',
          '<b>Durata:</b> anche solo 3-5 respirazioni consapevoli cambiano lo stato del sistema nervoso. 5-10 minuti al giorno costruiscono l’abilità nel tempo.',
          '&#x1F4A1; Non si tratta di svuotare la mente — si tratta di notare quando vaga e tornare. Questo è il muscolo che si allena.'
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
    {id:'reg',icon:'🎛️',bg:'#FEF6E4',
     title:'Regolazione emotiva',
     sub:'Capire, ridurre e gestire le emozioni intense',
     intro:'Le emozioni non sono nemiche — ci motivano, comunicano agli altri e ci danno informazioni. Il problema è quando sono troppo intense, durano troppo, o ci spingono ad azioni che peggiorano la situazione. Queste abilità aiutano a capire, accettare e modificare le emozioni.',
     skills:[
       {id:'rperche',badge:'EMOZIONI',name:'A cosa servono le emozioni',
        desc:'Prima di regolare le emozioni, è utile capire perché le proviamo.',
        steps:[
          '<b>Ci motivano all\'azione.</b> La paura ci fa fuggire dal pericolo. La rabbia ci fa difendere. La tristezza ci fa cercare conforto. Le emozioni abbreviano i tempi di reazione in situazioni importanti.',
          '<b>Comunicano agli altri.</b> Le espressioni facciali e il tono della voce trasmettono emozioni anche involontariamente. Influenzano chi ci sta intorno prima ancora che parliamo.',
          '<b>Comunicano a noi stesse.</b> Le emozioni sono segnali — ci dicono che qualcosa di importante sta succedendo. Ascoltarle (senza lasciarle controllare) è utile.',
          '⚠ <b>Attenzione:</b> le emozioni non sono fatti. "Mi sento in colpa" non significa aver sbagliato. "Ho paura" non significa che ci sia davvero un pericolo. Controlla sempre i fatti prima di agire.'
        ]},
       {id:'rcheck',badge:'CONTROLLA',name:'Controllare i fatti',
        desc:'Le emozioni rispondono ai pensieri e alle interpretazioni, non solo agli eventi reali.',
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
          '💡 L\'azione opposta deve essere <b>completa</b> — non solo esterna ma anche interna (postura, espressione, pensieri).'
        ]},
       {id:'rplease',badge:'PLEASE',name:'Ridurre la vulnerabilità emotiva',
        desc:'Prendersi cura del corpo riduce quanto facilmente le emozioni ci sopraffanno.',
        steps:[
          '<b>PL — tratta le malattie Fisiche (PHysicaL).</b> Vai dal medico. Prendi le medicine. Non ignorare sintomi fisici — il corpo influenza direttamente le emozioni.',
          '<b>E — alimentazione Equilibrata.</b> Non saltare pasti. Evita cibi che alterano l\'umore. L\'ipoglicemia rende emotivamente reattive.',
          '<b>A — evita le sostanze che Alterano la mente.</b> Alcol e droghe aumentano la reattività emotiva e interferiscono con le abilità DBT.',
          '<b>S — Sonno bilanciato.</b> Troppo poco o troppo sonno aumenta la vulnerabilità emotiva. Mantieni un ritmo regolare.',
          '<b>E — Esercizio fisico.</b> Almeno 20 minuti al giorno di attività aerobica riduce stress, ansia e reattività emotiva.'
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
        desc:'Fare cose che ti rendono competente combatte la disperazione e costruisce autostima.',
        steps:[
          'Pianifica almeno una cosa ogni giorno che ti dia un senso di realizzazione. Non deve essere grande — anche piccola.',
          'Fai piani per il successo, non per il fallimento. Inizia da qualcosa di difficile ma possibile.',
          'Aumenta gradualmente la difficoltà nel tempo. Se era troppo difficile, fai qualcosa di più semplice la prossima volta.',
          'Cerca la sfida giusta. Se troppo semplice, fai qualcosa di più impegnativo.',
          '<b>Gestisci in anticipo:</b> pensa a situazioni future che potrebbero essere difficili. Decidi quale abilità usare. Immagina di essere in quella situazione e prova mentalmente come gestirla.'
        ]},
       {id:'rproblem',badge:'PROBLEM SOLVING',name:'Problem solving — 7 passi',
        desc:'Quando un problema è reale e risolvibile, affrontarlo direttamente riduce le emozioni negative.',
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
        desc:'Costruire una vita che vale la pena di essere vissuta inizia dall’identificare cosa conta davvero.',
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
       {id:'rpositivo',badge:'POSITIVO',name:'Costruire emozioni positive',
        desc:'Non aspettare che le emozioni positive arrivino da sole — costruiscile attivamente.',
        steps:[
          '<b>Breve termine:</b> ogni giorno fai almeno una cosa piacevole. Non aspettare di "avere voglia". Scegli attività che di solito ti piacciono e falle, anche se non ne hai voglia in questo momento.',
          '<b>Lungo termine:</b> lavora verso obiettivi che ti stanno a cuore. Costruisci una vita che vale la pena di essere vissuta — relazioni, lavoro, valori, salute.',
          '<b>Sii consapevole degli eventi positivi.</b> Nota quando qualcosa di bello accade. Non allontanarla. Non dire "sì, ma...". Lascia che entri.',
          '<b>Sii consapevole delle emozioni positive.</b> Quando provi gioia, gratitudine, pace — nota di provarle. Non preoccuparti che finiscano. Stai semplicemente nell\'emozione positiva.'
        ]}
     ]},
    {id:'inter',icon:'🤝',bg:'#EEF2FF',
     title:'Efficacia interpersonale',
     sub:'Ottenere ciò che si vuole mantenendo le relazioni e il rispetto di sé',
     intro:'L\'efficacia interpersonale è la capacità di raggiungere i propri obiettivi nelle relazioni. Tre obiettivi spesso in tensione tra loro: ottenere ciò che vuoi (DEAR MAN), mantenere la relazione (GIVE), mantenere il rispetto di te stessa (FAST).',
     skills:[
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
        desc:'Come decidere quanta energia e insistenza usare nelle richieste e nel dire di no.',
        steps:[
          '<b>Fattori che aumentano la fermezza:</b> sei nel giusto. Hai chiaramente espresso le tue necessità in passato. La relazione è paritaria. L’altra persona te lo chiederebbe a sua volta.',
          '<b>Fattori che la riducono:</b> non sei sicura di essere nel giusto. Non hai comunicato chiaramente in passato. La richiesta potrebbe danneggiare la relazione. L’altra persona è in difficoltà.',
          '<b>Considera la situazione:</b> è urgente? Ci sono conseguenze serie? Hai bisogno dell’altra persona in futuro?',
          '<b>Considera la relazione:</b> quant’è importante per te? Daresti o avresti dato tu questo all’altra persona se te lo chiedesse?',
          '💡 Non esiste una risposta giusta universale. La mente saggia sa bilanciare i tuoi bisogni con la realtà della situazione.'
        ]},
       {id:'give',badge:'GIVE',name:'Mantenere le relazioni',
        desc:'Come comportarsi con gli altri per mantenere e rafforzare i legami.',
        steps:[
          '<b>G — sii Gentile.</b> Non attaccare, non minacciare, non giudicare, non mostrarti superiore. Tollera un no. Esprimi la rabbia con le parole, non con le azioni.',
          '<b>I — mostrati Interessata.</b> Ascolta davvero. Guarda negli occhi. Non interrompere. Sii curiosa del punto di vista dell\'altra persona, anche quando non sei d\'accordo.',
          '<b>V — Valida.</b> Con parole e azioni, mostra di comprendere le emozioni e il punto di vista dell\'altra persona. "Capisco che per te sia difficile." Non devi essere d\'accordo per validare.',
          '<b>E — comportati in modo Educato.</b> Usa un tono leggero quando possibile. Sorridi. Mostra interesse genuino. Evita l\'umorismo che ferisce.'
        ]},
       {id:'fast',badge:'FAST',name:'Mantenere il rispetto di sé',
        desc:'Come comportarsi per non perdere la stima di te stessa nelle relazioni.',
        steps:[
          '<b>F — sii Franca.</b> Sii giusta con te stessa e con l\'altra persona. Valida i tuoi sentimenti e desideri come validi tanto quanto quelli degli altri.',
          '<b>A — sii Assertiva.</b> Non scusarti di esistere o di avere bisogni. Non scusarti di avere opinioni. Non assumere posture di inferiorità.',
          '<b>S — Segui i tuoi valori.</b> Non rinunciare ai tuoi valori per ragioni che non sono davvero importanti. Spiega il tuo punto di vista etico e mantienilo.',
          '<b>T — sii Trasparente.</b> Non mentire, non fingere di essere d\'accordo quando non lo sei, non recitare. L\'onestà protegge il rispetto di sé a lungo termine.'
        ]},
       {id:'idialettica',badge:'DIALETTICA',name:'Pensiero dialettico',
        desc:'La dialettica è la capacità di stare nel paradosso: due cose opposte possono essere entrambe vere.',
        steps:[
          '<b>Principio 1:</b> ogni situazione ha sempre una controparte. Cerca entrambi i lati della medaglia. Cambia gli "o-o" in "sia-sia", i "sempre-mai" in "talvolta".',
          '<b>Principio 2:</b> siamo tutti in connessione. Comportati con gli altri come vorresti facessero con te. Cerca le somiglianze, non le differenze.',
          '<b>Principio 3:</b> il cambiamento è l’unica costante. Ogni momento è nuovo. Accogli il cambiamento invece di resistere.',
          '<b>Principio 4:</b> il cambiamento è transazionale. Ciò che fai influenza il tuo ambiente e viceversa. Smetti di cercare di chi sia la colpa.',
          '<b>Esempi pratici:</b> "Voglio stare da sola E voglio anche connessione." "Posso voler cambiare E aver ancora bisogno di fare meglio." Entrambe sono vere.'
        ]},
       {id:'isentiero',badge:'SENTIERO DI MEZZO',name:'Percorrere il sentiero di mezzo',
        desc:'Trovare equilibrio tra gli estremi — tra accettazione e cambiamento, tra i tuoi bisogni e quelli degli altri.',
        steps:[
          '<b>Accettazione e cambiamento insieme:</b> accettare la realtà non significa rinunciare al cambiamento. Anzi: l’accettazione è il primo passo verso il cambiamento efficace.',
          '<b>Evita gli estremi:</b> osserva dove ti poni rispetto al sentiero di mezzo. Stai andando troppo verso un estremo (troppo dipendente, troppo isolata; troppo rigida, troppo cedevole)?',
          '<b>Riprendersi dall’invalidazione:</b> quando ti senti invalidata, mantieni una posizione non difensiva. Trova ciò che ha valore nelle parole dell’altro, riconosci ciò che non ce l’ha, accetta te stessa radicalmente.',
          'Chiedi alla mente saggia: "Sto tralasciando qualcosa? Dove c’è un nocciolo di verità nell’altra posizione?"'
        ]},
       {id:'ivalida',badge:'VALIDAZIONE',name:'Come validare gli altri (e se stesse)',
        desc:'La validazione riconosce che le emozioni e i pensieri di una persona hanno senso — anche senza essere d’accordo.',
        steps:[
          '<b>Livello 1: Prestare attenzione.</b> Mostrarti presente. Contatto visivo. Non fare altro mentre ascolti. Annuisci. Rispondi con il volto.',
          '<b>Livello 2: Rispecchiare.</b> Ripeti ciò che hai sentito per verificare di aver capito. "Dunque sei arrabbiata perché... Ho capito bene?"',
          '<b>Livello 3: Leggere nella mente.</b> Cogli ciò che non viene detto — linguaggio del corpo, espressioni, contesto. Verbalizzalo con apertura alle correzioni.',
          '<b>Livello 4: Comprendere.</b> Cerca di capire come si sente e perché — data la sua storia, il suo stato, gli eventi attuali.',
          '<b>Validare se stesse:</b> riconosci le tue emozioni come valide. "Mi sento così e ha senso che mi senta così, dato quello che sta succedendo."',
          '<b>Importante:</b> validazione non significa essere d’accordo. Non validare ciò che in effetti non ha valore.'
        ]},
       {id:'imiti',badge:'CREDENZE',name:'Credenze che ostacolano le relazioni',
        desc:'Riconosci i pensieri automatici che ti impediscono di essere efficace nelle relazioni.',
        steps:[
          '"Non mi merito ciò che desidero o di cui ho bisogno." → Le tue necessità sono valide quanto quelle degli altri.',
          '"Se faccio una domanda, dimostro di essere debole." → Chiedere è un atto di rispetto — verso te stessa e verso l\'altra persona.',
          '"Rifiutare una richiesta è da egoisti." → Dire no è un diritto. Non puoi aiutare gli altri svuotandoti.',
          '"Dovrebbero sapere cosa voglio senza che io lo dica." → Gli altri non possono leggere nella tua mente. Comunicare è tuo compito.',
          '"Non posso sopportare che qualcuno si arrabbi con me." → Puoi tollerarlo. Il disappunto altrui non ti definisce.',
          '💡 Riconoscere queste credenze è già metà del lavoro. Non devi credere ai tuoi pensieri automatici.'
        ]}
     ]},
    {id:'dip',icon:'🔗',bg:'#F3E8FF',
     title:'Gestire le dipendenze',
     sub:'Abbandonare comportamenti dipendenti e gestire il craving',
     intro:'Sei dipendente quando non riesci a interrompere un pattern di comportamento nonostante le conseguenze negative. Queste abilità aiutano a costruire l’astinenza, gestire il craving e prevenire le ricadute.',
     skills:[
       {id:'dastinenza',badge:'ASTINENZA',name:'Astinenza dialettica',
        desc:'Due obiettivi in tensione: impegnarsi al 100% per smettere, ma avere un piano per quando si ricade.',
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
    {id:'gen',icon:'🔧',bg:'#F0FDF4',
     title:'Strumenti generali',
     sub:'Analisi dei comportamenti e costruzione di una vita degna di essere vissuta',
     intro:'Questi strumenti trasversali si applicano a tutte le aree della DBT. Servono a capire come funzionano i propri comportamenti e a costruire una vita allineata con i propri valori.',
     skills:[
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
       {id:'gcheck',badge:'CONTROLLA I FATTI',name:'Foglio di lavoro — Controlla i fatti',
        desc:'Usa questo schema quando senti un’emozione intensa e vuoi capire se corrisponde ai fatti.',
        steps:[
          '<b>Passo 1:</b> Qual è l’emozione che voglio cambiare? Quanto è intensa (0-5)?',
          '<b>Passo 2:</b> Qual è l’evento che l’ha attivata? Descrivi solo i fatti osservabili — senza interpretazioni.',
          '<b>Passo 3:</b> Quali sono i miei pensieri e interpretazioni? Considera almeno 2 interpretazioni alternative.',
          '<b>Passo 4:</b> Sto ipotizzando una minaccia? Qual è la probabilità reale che accada?',
          '<b>Passo 5:</b> Qual è la catastrofe che temo? Immagina di affrontarla bene.',
          '<b>Passo 6:</b> L’emozione e la sua intensità sono commisurate ai fatti? Chiedi alla mente saggia.',
          'Usa la pagina "Diario emozioni" nell’app per compilare questo schema in modo strutturato.'
        ]},
       {id:'gprocontro',badge:'PRO/CONTRO ABILITÀ',name:'Foglio di lavoro — Usare le abilità?',
        desc:'Quando non sei sicura se usare le abilità o cedere all’impulso in una situazione.',
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
        desc:'L\u2019obiettivo finale della DBT: una vita che vale la pena, basata sui propri valori.',
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
    hdr.onclick=function(){toggleGuideModule(mod.id);};
    hdr.innerHTML='<div class="guide-module-icon" style="background:'+mod.bg+'">'+mod.icon+'</div>'
      +'<div style="flex:1"><div class="guide-module-title">'+mod.title+'</div>'
      +'<div class="guide-module-sub">'+mod.sub+'</div></div>'
      +'<span class="guide-module-arrow" id="arr-'+mod.id+'">›</span>';
    mDiv.appendChild(hdr);
    const body=document.createElement('div');body.className='guide-module-body';body.id='body-'+mod.id;
    const intro=document.createElement('div');intro.className='guide-when';
    intro.innerHTML='<strong>Quando usarla:</strong> '+mod.intro;
    body.appendChild(intro);
    mod.skills.forEach(function(sk){
      const skDiv=document.createElement('div');skDiv.className='guide-skill';
      const skHdr=document.createElement('div');skHdr.className='guide-skill-header';
      skHdr.onclick=function(){toggleGuideSkill(sk.id);};
      skHdr.innerHTML='<div class="guide-skill-badge">'+sk.badge+'</div>'
        +'<div style="flex:1"><div class="guide-skill-name">'+sk.name+'</div>'
        +'<div class="guide-skill-desc">'+sk.desc+'</div></div>'
        +'<span style="color:var(--muted);font-size:18px;margin-left:8px;transition:transform .2s" id="sarr-'+sk.id+'">›</span>';
      skDiv.appendChild(skHdr);
      const steps=document.createElement('div');steps.className='guide-skill-steps';steps.id='steps-'+sk.id;
      sk.steps.forEach(function(step,i){
        const row=document.createElement('div');row.className='guide-step';
        row.innerHTML='<div class="guide-step-n">'+(i+1)+'</div><div class="guide-step-text">'+step+'</div>';
        steps.appendChild(row);
      });
      skDiv.appendChild(steps);body.appendChild(skDiv);
    });
    mDiv.appendChild(body);el.appendChild(mDiv);
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
  const k=dkD(curPlan);
  const isToday=k===today();
  document.getElementById('plan-dlabel').textContent=isToday?'Oggi':fmtL(curPlan);
  document.getElementById('planNxtBtn').disabled=new Date(curPlan.getTime()+86400000)>new Date();
  // pill
  const pill=document.getElementById('planPill');
  const d=allData[k];
  const hasP=d&&d.planner&&Object.values(d.planner).some(a=>a&&a.length>0);
  pill.className='pill '+(hasP?'saved':'unsaved');
  pill.textContent=hasP?'✓ Pianificata':'Non pianificata';
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
  const modal=document.getElementById('day-modal');
  document.getElementById('day-modal-title').textContent=new Date(k+'T12:00:00').toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
  const body=document.getElementById('day-modal-body');
  const s=d.scales||{}, t=d.toggles||{}, tx=d.texts||{};
  let html='';

  // Sezione 1: comportamenti
  const critScales=['sp','ai','alci','cbdi','rap','atti'];
  const critTog=['sa','aa','ee','farm'];
  const critTxKeys=['alcu','cbdu'];
  const csRows=critScales.filter(k2=>s[k2]!=null);
  const ctRows=critTog.filter(k2=>t[k2]);
  const cxRows=critTxKeys.filter(k2=>tx[k2]&&tx[k2].trim());
  if(csRows.length||ctRows.length||cxRows.length){
    html+='<div class="modal-section"><div class="modal-section-title" style="color:#C85250">⚠ Comportamenti e sostanze</div>';
    if(csRows.length){html+='<div class="modal-grid">';csRows.forEach(k2=>{html+=mkScaleRow(SCALE_LABELS[k2],s[k2]);});html+='</div>';}
    if(ctRows.length){html+='<div style="margin-top:8px">';ctRows.forEach(k2=>{
      const val=t[k2];
      const isDanger=val==="Sì"&&(k2==="sa"||k2==="aa");
      const color=isDanger?"var(--red)":val==="Sì"?"var(--teal)":"var(--muted)";
      const bg=isDanger?"#FEF0F0":val==="Sì"?"var(--teal-ll)":"var(--surface-2)";
      html+='<div class="modal-row" style="background:'+bg+';border-radius:8px;margin-bottom:4px"><span style="font-weight:600">'+TOG_LABELS[k2]+'</span><strong style="color:'+color+'">'+val+'</strong></div>';
    });html+='</div>';}
    if(cxRows.length){html+='<div style="margin-top:8px">';cxRows.forEach(k2=>{html+='<div class="modal-text-row"><div class="ms-label">'+TEXT_LABELS[k2]+'</div><div class="ms-text">'+tx[k2]+'</div></div>';});html+='</div>';}
    html+='</div>';
  }

  // Sezione 2: emozioni
  const emoScales=['ser','gio','pau','rab','tri','ver','col','vuo','sf','se','abb','fid'];
  const emoRows=emoScales.filter(k2=>s[k2]!=null);
  if(emoRows.length){
    html+='<div class="modal-section"><div class="modal-section-title">Emozioni e benessere</div><div class="modal-grid">';
    emoRows.forEach(k2=>{html+=mkScaleRow(SCALE_LABELS[k2],s[k2],k2);});
    html+='</div></div>';
  }

  // Sezione 3: piano giornata
  const plan=d.planner;
  const slotL={mattina:'🌅 Mattina',pomeriggio:'☀️ Pomeriggio',sera:'🌙 Sera'};
  if(plan&&Object.values(plan).some(a=>a&&a.length>0)){
    html+='<div class="modal-section"><div class="modal-section-title">Piano giornata</div>';
    ['mattina','pomeriggio','sera'].forEach(slot=>{
      const items=(plan[slot])||[];
      if(!items.length)return;
      html+='<div class="pat-planner-slot"><div class="pat-planner-slot-title">'+slotL[slot]+'</div>';
      html+='<div class="pat-planner-items">'+items.map(i=>'<span class="pat-planner-chip">'+i+'</span>').join('')+'</div></div>';
    });
    html+='</div>';
  }

  // Sezione 4: abilità
  const sk=d.skills||{};
  const skUsed=Object.keys(sk).filter(k2=>sk[k2]);
  if(skUsed.length){
    html+='<div class="modal-section"><div class="modal-section-title">Abilità DBT</div><div class="modal-chips">';
    skUsed.forEach(skid=>{const parts=skid.replace(/^sk_/,'').split('_');html+='<span class="modal-chip">'+parts.slice(1).join(' ')+'</span>';});
    html+='</div></div>';
  }

  if(!html)html='<div style="color:var(--muted);padding:2rem;text-align:center">Nessun dato compilato.</div>';
  body.innerHTML=html;
  modal.style.display='flex';
  modal.style.alignItems='center';
  modal.style.justifyContent='center';
}


function openGuideSkill(moduleId,skillId){
  goPage('guida',null);
  setTimeout(()=>{
    const body=document.getElementById('body-'+moduleId);
    const arr=document.getElementById('arr-'+moduleId);
    if(body&&!body.classList.contains('open')){
      body.classList.add('open');
      if(arr)arr.classList.add('open');
    }
    if(skillId){
      setTimeout(()=>{
        const steps=document.getElementById('steps-'+skillId);
        const sarr=document.getElementById('sarr-'+skillId);
        if(steps&&!steps.classList.contains('open')){
          steps.classList.add('open');
          if(sarr)sarr.style.transform='rotate(90deg)';
        }
        if(steps)steps.scrollIntoView({behavior:'smooth',block:'center'});
      },150);
    } else if(body){
      setTimeout(()=>body.scrollIntoView({behavior:'smooth',block:'start'}),150);
    }
  },200);
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


const PLEASE_ITEMS=[
  {id:'pl',icon:'💊',label:'Farmaci / salute fisica',desc:'Hai preso le medicine? Hai ascoltato il tuo corpo?'},
  {id:'eq',icon:'🥗',label:'Alimentazione equilibrata',desc:'Hai mangiato regolarmente senza saltare pasti?'},
  {id:'al',icon:'🚫',label:'Evitato sostanze',desc:'Hai evitato alcol e altre sostanze alteranti?'},
  {id:'so',icon:'😴',label:'Sonno bilanciato',desc:'Hai dormito in modo regolare e sufficiente?'},
  {id:'ex',icon:'🏃',label:'Esercizio fisico',desc:'Hai fatto almeno 20 minuti di attività fisica?'},
];

function renderPlease(){
  const el=document.getElementById('please-week');
  if(!el)return;
  // Get last 7 days
  const days=[];
  for(let i=0;i<=6;i++){const d=new Date();d.setDate(d.getDate()-i);days.push(d);}
  
  const stored=JSON.parse(localStorage.getItem(ukey('please_data'))||'{}');
  
  el.innerHTML='';
  
  // Summary row
  const summary=document.createElement('div');
  summary.className='card';
  summary.style.cssText='margin-bottom:1rem';
  let sumHtml='<div style="font-size:12px;font-weight:700;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:12px">Questa settimana</div><div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px">';
  PLEASE_ITEMS.forEach(item=>{
    let count=0;
    days.forEach(d=>{
      const k=dk(d);
      if(stored[k]&&stored[k][item.id])count++;
    });
    const pct=Math.round(count/7*100);
    const color=pct>=80?'var(--teal)':pct>=50?'var(--amber)':'#E24B4A';
    sumHtml+=`<div style="text-align:center"><div style="font-size:20px;margin-bottom:4px">${item.icon}</div><div style="font-size:18px;font-weight:800;color:${color}">${count}/7</div><div style="font-size:10px;color:var(--muted);line-height:1.3">${item.label}</div></div>`;
  });
  sumHtml+='</div>';
  summary.innerHTML=sumHtml;
  el.appendChild(summary);
  
  // Day by day
  days.forEach(d=>{
    const k=dk(d);
    const isToday=k===today();
    const dayData=stored[k]||{};
    const card=document.createElement('div');
    card.className='card';
    card.style.cssText='margin-bottom:.75rem;'+(isToday?'border:2px solid var(--teal)':'');
    
    const label=isToday?'Oggi':fmtS(k);
    let html=`<div style="font-size:13px;font-weight:700;color:${isToday?'var(--teal)':'var(--text)'};margin-bottom:10px">${label}</div>`;
    html+='<div style="display:flex;flex-direction:column;gap:8px">';
    
    PLEASE_ITEMS.forEach(item=>{
      const checked=!!dayData[item.id];
      html+=`<div style="display:flex;align-items:center;gap:10px;cursor:pointer" onclick="togglePlease('${k}','${item.id}')">
        <div style="width:24px;height:24px;border-radius:6px;border:2px solid ${checked?'var(--teal)':'var(--border)'};background:${checked?'var(--teal)':'transparent'};display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s">
          ${checked?'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>':''}
        </div>
        <div style="font-size:18px;flex-shrink:0">${item.icon}</div>
        <div style="flex:1"><div style="font-size:13px;font-weight:600;color:var(--text)">${item.label}</div><div style="font-size:11px;color:var(--muted)">${item.desc}</div></div>
      </div>`;
    });
    html+='</div>';
    card.innerHTML=html;
    el.appendChild(card);
  });
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
    {id:'epau',emoji:'😰',label:'Paura',color:'#E6F1FB',border:'#4A90D9',
     quando:'Quando c\'è una minaccia reale alla tua vita, salute o benessere.',
     scatenanti:'Situazioni nuove, stare sola, flashback, dover fare cose in pubblico, perseguire i propri sogni.',
     interpretazioni:'"Potrei essere ferita." "Non avrò aiuto." "Fallirò." "Perderò qualcuno."',
     fisico:'Tachicardia, mancanza di respiro, nodo in gola, tensione muscolare, sudore freddo, nausea.',
     azioni:'Fuggire, evitare, immobilizzarsi, chiedere aiuto in modo caotico.',
     opposta:'Avvicinati a ciò che temi, fallo ancora e ancora. Tieni gli occhi aperti. Postura assertiva — testa alta, spalle indietro. Respira lentamente.'
    },
    {id:'erab',emoji:'😠',label:'Rabbia',color:'#FEF0F0',border:'#EF5350',
     quando:'Un obiettivo viene bloccato, qualcuno ti attacca o minaccia, viene offesa la tua integrità.',
     scatenanti:'Impossibilità di raggiungere un obiettivo, attacchi, perdita di rispetto, dolore fisico o emotivo.',
     interpretazioni:'"Sono stata trattata ingiustamente." "Non avrebbe dovuto." "Ho ragione io."',
     fisico:'Tensione muscolare, denti serrati, pugni stretti, faccia che avvampa, senso di esplosione.',
     azioni:'Attacchi verbali, alzare la voce, sarcasmo, sbattere le porte, covare rancore.',
     opposta:'Evita con grazia invece di attaccare. Sii gentile. Immaginati comprensiva. Apri le mani, palmi verso l\'alto. Abbozza un sorriso.'
    },
    {id:'etri',emoji:'😢',label:'Tristezza',color:'#EEF2FF',border:'#4A90D9',
     quando:'Hai perso qualcosa o qualcuno. Le cose non sono andate come speravi.',
     scatenanti:'Perdita, morte, rifiuto, separazione, delusione, isolamento.',
     interpretazioni:'"Non otterrò mai ciò che voglio." "Sono inutile." "La situazione non cambierà mai."',
     fisico:'Stanchezza, letargia, vuoto nel petto, difficoltà a deglutire, mancanza di energie.',
     azioni:'Ritirarsi, evitare, stare a letto, parlare poco, darsi per vinti.',
     opposta:'Attivati invece di isolarti. Evita di evitare. Fai cose che ti diano senso di competenza. Testa alta, postura aperta. Aumenta l\'attività fisica.'
    },
    {id:'ecol',emoji:'😔',label:'Colpa',color:'#FFF8F0',border:'#FFA726',
     quando:'Quando il tuo comportamento viola davvero i tuoi valori o il tuo codice morale.',
     scatenanti:'Fare o pensare qualcosa che ritieni sbagliato. Non mantenere una promessa. Causare un danno a qualcuno.',
     interpretazioni:'"Avrei dovuto comportarmi diversamente." "Mi sono comportata male." "Devo essere incolpata."',
     fisico:'Faccia rossa e calda, tensione, nervosismo, senso di soffocamento.',
     azioni:'Chiedere perdono, scusarsi, fare regali per rimediare, piegarsi su se stessi.',
     opposta:'Se la colpa è giustificata: scusati, rimedia al danno, impegnati a non ripetere, perdonati. Se non è giustificata: non scusarti, raccogli le informazioni, postura dignitosa, valida il tuo comportamento.'
    },
    {id:'ejal',emoji:'💚',label:'Gelosia',color:'#F1F8E9',border:'#66BB6A',
     quando:'Una relazione importante è minacciata o in pericolo. Qualcuno minaccia di portarti via qualcosa di prezioso.',
     scatenanti:'Partner che dà attenzione ad altri, possibile rivale, sentirsi ignorati, scoprire tradimenti.',
     interpretazioni:'"Il mio partner non tiene più a me." "Non sono all\'altezza." "Mi lascerà." "Sono stata imbrogliata."',
     fisico:'Tachicardia, nodo in gola, muscoli tesi, sospettosità, bisogno di controllo, sentirsi feriti.',
     azioni:'Interrogatori, controllare il telefono, accuse, comportamenti appiccicosi, gelosia, inseguimenti.',
     opposta:'Smetti di spiare e controllare. Condividi invece di trattenere. Ascolta senza fare domande indagatorie. Tieni gli occhi aperti sui fatti reali. Postura aperta, mani rilassate.'
    },
    {id:'einv',emoji:'😒',label:'Invidia',color:'#FEF9E7',border:'#F9A825',
     quando:'Una persona o un gruppo ha qualcosa che vuoi o di cui hai bisogno.',
     scatenanti:'Qualcuno ottiene ciò che volevi tu. Non fare parte del gruppo giusto. Qualcuno si vanta di qualcosa.',
     interpretazioni:'"Non è giusto." "Dovrei avere anch\'io quello." "Sono inferiore." "Sono stata sfortunata."',
     fisico:'Muscoli tesi, denti stretti, dolore allo stomaco, voglia che l\'altro perda ciò che ha.',
     azioni:'Sminuire l\'altro, comportarsi in modo passivo-aggressivo, confrontarsi ossessivamente.',
     opposta:'Impedisciti di distruggere ciò che ha l\'altra persona. Pensa alle tue fortune — fai una lista. Smetti di esagerare il valore di ciò che non hai. Postura aperta, mani rilassate, respiro lento.'
    },
    {id:'ever',emoji:'😶',label:'Vergogna',color:'#F5F3FF',border:'#9E9E9E',
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
    card.style.cssText=`background:${isDark?'var(--surface-2)':emo.color};border:1.5px solid ${isDark?'var(--border)':emo.border};border-radius:var(--r);margin-bottom:10px;overflow:hidden`;
    
    const hdr=document.createElement('div');
    hdr.style.cssText='padding:14px 16px;display:flex;align-items:center;gap:10px;cursor:pointer';
    hdr.innerHTML=`<span style="font-size:26px">${emo.emoji}</span><div style="flex:1"><div style="font-size:15px;font-weight:700">${emo.label}</div></div><span id="earr-${emo.id}" style="font-size:20px;color:var(--muted);transition:transform .2s">›</span>`;
    hdr.onclick=()=>{
      const body=document.getElementById('ebody-'+emo.id);
      const arr=document.getElementById('earr-'+emo.id);
      const open=body.style.display!=='none';
      body.style.display=open?'none':'block';
      arr.style.transform=open?'':'rotate(90deg)';
    };
    card.appendChild(hdr);
    
    const body=document.createElement('div');
    body.id='ebody-'+emo.id;
    body.style.display='none';
    body.style.cssText='display:none;padding:0 16px 16px;border-top:1px solid var(--border-l)';
    
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
    
    card.appendChild(body);
    el.appendChild(card);
  });
}


