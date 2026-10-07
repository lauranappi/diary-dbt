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
 {id:'m-abilita', mod:'mind', t:'Diario delle abilità nucleari di mindfulness', sub:'Diario delle abilità nucleari di mindfulness',
  intro:'Foglio 2C: scegli l’abilità che hai praticato, descrivi come l’hai fatta, cosa hai vissuto (corpo, emozioni, pensieri) e come stai ora.',
  c:[_C('ab','Quale abilità hai praticato?',['Mente saggia','Osserva','Descrivi','Partecipa','In modo non giudicante','Facendo una cosa per volta','In modo efficace']),
     _A('come','Come hai praticato l’abilità?'),
     _A('esp','Descrivi la tua esperienza: sensazioni corporee, emozioni e pensieri mentre praticavi'),
     _A('ora','Qual è la tua esperienza ora, dopo aver usato l’abilità?'),
     _A('sagge','Cose sagge che hai fatto oggi')]},
 {id:'m-piacevoli', mod:'mind', t:'Diario degli eventi piacevoli', sub:'Diario degli eventi piacevoli',
  intro:'Foglio 8: nota un evento piacevole mentre accade, restando nel presente, e descrivi corpo, emozioni, pensieri e come ti senti ora.',
  c:[_A('ev','Qual era l’esperienza?'),
     _R('cons','Eri consapevole delle sensazioni piacevoli mentre l’evento accadeva?',['Sì','No']),
     _A('corpo','Nel dettaglio, cosa ha provato il tuo corpo durante questa esperienza?'),
     _A('emo','Descrivi le tue emozioni e i tuoi pensieri mentre vivevi questa esperienza'),
     _A('ora','Quali sono le tue sensazioni ora, dopo aver vissuto questa esperienza?')]},
 {id:'m-spiacevoli', mod:'mind', t:'Diario degli eventi spiacevoli', sub:'Diario degli eventi spiacevoli',
  intro:'Foglio 9: nota un evento spiacevole mentre accade, restando nel presente, e descrivi corpo, emozioni, pensieri e come ti senti ora.',
  c:[_A('ev','Qual era l’esperienza?'),
     _R('cons','Eri consapevole delle sensazioni spiacevoli mentre l’evento accadeva?',['Sì','No']),
     _A('corpo','Nel dettaglio, cosa ha provato il tuo corpo durante questa esperienza?'),
     _A('emo','Descrivi le tue emozioni e i tuoi pensieri mentre vivevi questa esperienza'),
     _A('ora','Quali sono le tue sensazioni ora, dopo aver vissuto questa esperienza?')]},
 {id:'m-fare-essere', mod:'mind', t:'Diario della mindfulness dell’essere e del fare', sub:'Diario della mindfulness dell’essere e del fare',
  intro:'Foglio 7A: quando ti senti esausta, sopraffatta o disorientata, riporta l’attenzione solo a questo momento e descrivi cosa hai vissuto.',
  c:[_A('esp','Qual è stata l’esperienza (es. mi sento sopraffatta da ciò che devo fare)?'),
     _A('unica','Qual è stata l’unica attività, in un unico momento, su cui hai potuto portare l’attenzione?'),
     _A('corpo','Come si è sentito il tuo corpo nel fare una cosa per volta?'),
     _A('prat','Descrivi la tua esperienza di pratica delle abilità'),
     _A('ora','Qual è la tua esperienza adesso, dopo aver usato le abilità?'),
     _A('sagge','Cose sagge che hai fatto oggi')]},
 {id:'m-sentiero', mod:'mind', t:'Sentiero di mezzo', sub:'Osservare se stessi nel sentiero di mezzo',
  intro:'Foglio 10A: renditi conto di dove ti poni rispetto all\u2019equilibrio, scegli un dilemma e decidi una o due cose specifiche da fare nella prossima settimana.',
  c:[_C('dilemma','Per quale dilemma della mente saggia lavori? (uno solo)',['Mente razionale / mente emotiva','Mente del fare / mente del nulla-da-fare','Desiderio vivo di cambiare il momento / accettazione radicale di ciò che è','Abnegazione / indulgenza verso di sé']),
     _H('Dove ti poni'),
     _A('dove','Verso quale estremo sei troppo sbilanciata, la maggior parte del tempo?'),
     _H('Cosa fai in eccesso e in difetto'),
     _A('troppo','Cosa fai troppo? Descrivilo in modo dettagliato'),
     _A('poco','Cosa fai troppo poco?'),
     _H('Controlla i fatti'),
     _A('fatti','Riscrivi le due risposte in modo aderente ai fatti, senza giudizi (\u201cbuono\u201d, \u201ccattivo\u201d) né interpretazioni'),
     _H('Per la prossima settimana'),
     _A('azioni','Una (o al massimo due) cose molto specifiche da fare per avvicinarti all\u2019equilibrio'),
     _H('Alla fine della settimana'),
     _A('fatto','Descrivi cosa hai fatto'),
     _T('efficacia','Quanto è stato efficace? Da 1 (per nulla) a 5 (molto)'),
     _A('sagge','Elenca le cose sagge che hai fatto questa settimana')]},
 {id:'m-gentilezza', mod:'mind', t:'Amorevole gentilezza', sub:'Amorevole gentilezza',
  intro:'Foglio 6: segna verso chi hai praticato l’amorevole gentilezza, le frasi usate e cosa è aumentato in te.',
  c:[_C('per','Verso chi hai praticato?',['Me stessa','Una persona cara','Un’amica o un amico','Qualcuno con cui ero arrabbiata','Una persona difficile','Un nemico','Tutti gli esseri umani','Altro']),
     _A('frasi','Quali frasi hai usato (i desideri gentili che hai inviato)?'),
     _C('aum','Praticare ha aumentato, anche solo un poco, verso quella persona:',['Sentimenti di cura o calore','Amore','Compassione','Senso di connessione profonda','Saggezza','Felicità','Senso di valore personale']),
     _A('comp','Descrivi come l’abilità ti ha (o non ti ha) aiutata a diventare più compassionevole'),
     _A('sagge','Cose sagge che hai fatto oggi')]},
 // ── TOLLERANZA DELLA SOFFERENZA ──
 {id:'t-stop', mod:'tol', t:'Praticare l’abilità STOP', sub:'Praticare l’abilità STOP',
  intro:'Foglio 2: descrivi una situazione di crisi, i passaggi di STOP che hai fatto, l’esito e quanto è stata efficace.',
  c:[_A('ev','Evento scatenante la sofferenza (chi, cosa, quando, dove): cosa ha generato la crisi?'),
     _T('comp','Comportamento che hai cercato di interrompere'),
     _S('prima','Livello di sofferenza prima (0-100)'),
     _H('Passaggi di STOP'),
     _A('s','Stop: cosa hai fatto?'), _A('t','Fai un passo indietro: cosa hai fatto?'),
     _A('o','Osserva: cosa hai fatto?'), _A('p','Procedi con consapevolezza: cosa hai fatto?'),
     _A('esito','Descrivi l’esito della pratica dell’abilità'),
     _S('dopo','Livello di sofferenza dopo (0-100)'),
     _R('eff','Quanto è stata efficace nel farti tollerare la sofferenza senza peggiorare la situazione? (1 = non ho retto nemmeno un minuto, 5 = ho tollerato e resistito agli impulsi)',['1','2','3','4','5'])]},
 {id:'t-impulso', mod:'tol', t:'Pro e contro dell’agire sulla base dell’impulso indotto dalla crisi', sub:'Pro e contro dell’agire sulla base dell’impulso indotto dalla crisi',
  intro:'Foglio 3: descrivi il comportamento problematico, elenca pro e contro dell’agire e del resistere, poi scegli con la mente saggia.',
  c:[_T('comp','Comportamento problematico che stai cercando di interrompere'),
     _H('Agire sulla base dell’impulso indotto dalla crisi'), _A('a-pro','Pro'), _A('a-contro','Contro'),
     _H('Resistere all’impulso indotto dalla crisi'), _A('r-pro','Pro'), _A('r-contro','Contro'),
     _A('term','Quali pro e contro sono a breve termine (solo per oggi) e quali a lungo termine?'),
     _A('dec','Chiedi alla mente saggia: preferisci trascorrere una buona giornata o vivere bene? Quale comportamento scegli?')]},
 {id:'t-crisi', mod:'tol', t:'Abilità di sopravvivenza alla crisi', sub:'Abilità di sopravvivenza alla crisi',
  intro:'Foglio 1: descrivi l’evento critico, spunta le abilità di sopravvivenza alla crisi che hai usato, le conseguenze e l’efficacia.',
  c:[_A('ev','Evento scatenante la sofferenza (chi, cosa, quando, dove): cosa ha generato la crisi?'),
     _S('prima','Livello di sofferenza prima (0-100)'),
     _C('ab','Abilità che hai usato',['STOP','Pro e contro','TIP','Distraiti con ACCETTA','Autoconsolati','MIGLIORA il momento presente']),
     _A('desc','Descrivi come hai usato ciascuna abilità'),
     _A('cons','Descrivi le conseguenze dell’aver usato le abilità'),
     _S('dopo','Livello di sofferenza dopo (0-100)'),
     _R('eff','Quanto sono state efficaci nel farti tollerare la sofferenza senza peggiorare la situazione? (1 = non ho retto nemmeno un minuto, 5 = ho tollerato e resistito agli impulsi)',['1','2','3','4','5'])]},
 {id:'t-accettazione', mod:'tol', t:'Accettazione radicale', sub:'Accettazione radicale',
  intro:'Foglio 9: individua cosa devi accettare, controlla fatti e giudizi, pratica l’accettazione radicale e valuta quanto accetti prima e dopo.',
  c:[_H('Fatti un’idea di cosa devi accettare'),
     _T('imp1','Una cosa molto importante che devo accettare radicalmente'),
     _R('imp1v','Accettazione (0 = negazione/ribellione completa, 5 = in pace con questa cosa)',['0','1','2','3','4','5']),
     _T('imp2','Un’altra cosa molto importante che devo accettare'),
     _R('imp2v','Accettazione (0-5)',['0','1','2','3','4','5']),
     _T('men1','Una cosa meno importante che faccio fatica ad accettare questa settimana'),
     _R('men1v','Accettazione (0-5)',['0','1','2','3','4','5']),
     _T('men2','Un’altra cosa meno importante che faccio fatica ad accettare'),
     _R('men2v','Accettazione (0-5)',['0','1','2','3','4','5']),
     _H('Rivedi la tua lista'),
     _A('fatti','Controlla fatti, interpretazioni e giudizi: riscrivi ogni punto aderente ai fatti e privo di giudizi'),
     _H('Pratica l’accettazione radicale'),
     _T('scelta1','Punto scelto tra le cose molto importanti'),
     _T('scelta2','Punto scelto tra le cose meno importanti'),
     _C('es','Cosa hai praticato?',['Stavo mettendo in dubbio o combattendo la realtà','Ho ricordato a me stessa che la realtà è quella che è','Ho considerato le cause dei fatti e le ho accettate senza giudicare','Ho praticato l’accettazione con tutta me stessa (mente, corpo, spirito)','Ho praticato l’azione opposta','Ho fatto i conti con eventi che sembravano inaccettabili','Mi sono presa cura delle sensazioni corporee','Mi sono permessa di sentire disappunto, tristezza o dolore','Ho riconosciuto che la vita può essere degna anche con la sofferenza','Ho fatto un pro e contro accettazione versus rifiuto','Altro']),
     _R('dopo','Il tuo grado di accettazione dopo la pratica (0-5)',['0','1','2','3','4','5'])]},
 {id:'t-bodyscan', mod:'tol', t:'Meditazione body scan: diario', sub:'Prima e dopo, giorno per giorno',
  intro:'Pratica quando puoi. Annota come l\u2019hai fatta e come stavi prima e dopo.',
  c:[_R('come','Come hai praticato?',['Da sola','Con una registrazione','Con un video','Guidata da una persona']),
     _T('tempo','Per quanto tempo? (minuti)'), _A('esp','Descrivi la tua esperienza'),
     _H('Prima'), _R('tol1','Tolleranza della sofferenza (0 = non ce la faccio, 5 = ce la farò)',['0','1','2','3','4','5']),
     _S('neg1','Intensità emozione negativa (0-100)'), _S('pos1','Intensità emozione positiva (0-100)'),
     _H('Dopo'), _R('tol2','Tolleranza della sofferenza (0-5)',['0','1','2','3','4','5']),
     _S('neg2','Intensità emozione negativa (0-100)'), _S('pos2','Intensità emozione positiva (0-100)'),
     _A('conc','Conclusioni o domande sulla pratica')]},
 {id:'t-pensieri', mod:'tol', t:'Mindfulness dei pensieri del momento', sub:'Mindfulness dei pensieri del momento',
  intro:'Foglio 12: osserva i tuoi pensieri (anche positivi o neutri), segna le strategie usate per lasciarli andare e valuta quanto hanno aiutato.',
  c:[_A('pens','Quale pensiero hai osservato? (descrivilo così come si è presentato; prima dì: “il pensiero … sta attraversando la mia mente”)'),
     _C('str','Quali strategie hai usato?',['Dire i pensieri a voce alta (veloce, lento, con voce diversa, cantati)','Rilassare viso e corpo accettando i pensieri come sensazioni del cervello','Immaginare cosa farei se smettessi di credere a tutto ciò che credo','Ripetermi cosa farei se non considerassi i pensieri dei fatti','Praticare l’amore per i miei pensieri','Portare la mente sulle sensazioni evitate per paura che fossero catastrofiche','Lasciare andare e venire i pensieri come il respiro','Etichettare il pensiero come pensiero','Chiedermi da dove viene il pensiero','Fare un passo indietro dalla mente, come in cima a una montagna','Alternare osservazione delle sensazioni fisiche e dei pensieri','Immaginare i pensieri su un nastro, un fiume, un treno, foglie, nuvole, ali o porte','Altro']),
     _A('strd','Descrivi le strategie usate'),
     _R('eff','Quanto sono state efficaci nell’aiutarti a essere più mindful e meno impulsiva? (1 = non efficaci, 3 = abbastanza, 5 = molto)',['1','2','3','4','5'])]},
 {id:'t-miglioramomento', mod:'tol', t:'MIGLIORA il momento presente', sub:'MIGLIORA il momento presente',
  intro:'Foglio 7: descrivi la situazione di crisi, spunta i passaggi di MIGLIORA che hai usato, l’esito e quanto sono stati efficaci.',
  c:[_A('ev','Evento scatenante la sofferenza (chi, cosa, quando, dove): cosa ha generato la crisi?'),
     _S('prima','Livello di sofferenza prima (0-100)'),
     _C('ab','Passaggi che hai usato',['Immaginazione','Significato','Preghiera','Attività rilassanti','Piccoli passi','Breve riposo','Autoincoraggiamento']),
     _A('desc','Descrivi cosa hai fatto'),
     _A('esito','Descrivi l’esito della pratica dell’abilità'),
     _S('dopo','Livello di sofferenza dopo (0-100)'),
     _R('eff','Quanto è stata efficace nel farti tollerare la sofferenza senza peggiorare la situazione? (1 = non ho retto nemmeno un minuto, 5 = ho tollerato e resistito agli impulsi)',['1','2','3','4','5'])]},
 // ── EFFICACIA INTERPERSONALE ──
 {id:'i-priorita', mod:'inter', t:'Chiarire le priorità', sub:'Chiarire le priorità nelle situazioni interpersonali',
  intro:'Foglio 3: descrivi la situazione che ti crea un problema, cosa vuoi in termini di obiettivi, relazione e rispetto di te, e metti in ordine le tue priorità.',
  c:[_A('ev','Evento scatenante: chi ha fatto che cosa a chi? Con quali conseguenze? Cosa è problematico per te? (controlla i fatti)'),
     _H('Le mie volontà e desideri in questa situazione'),
     _A('obi','Obiettivi: quali risultati specifici vuoi? Cosa vuoi che la persona faccia, smetta di fare o accetti?'),
     _A('rel','Relazione: come vuoi che l’altra persona si senta e cosa vuoi che pensi di te per il modo in cui gestisci la conversazione?'),
     _A('rsp','Rispetto di sé: come vuoi sentirti e cosa vuoi pensare di te per il modo in cui gestisci la conversazione?'),
     _H('Le mie priorità (1 molto importante, 2 intermedia, 3 poco importante)'),
     _R('p-obi','Obiettivi',['1','2','3']), _R('p-rel','Relazione',['1','2','3']), _R('p-rsp','Rispetto di sé',['1','2','3']),
     _A('con','Squilibri e conflitti tra le priorità che rendono difficile essere efficace in questa situazione')]},
 {id:'i-monitor', mod:'inter', t:'Monitorare le abilità interpersonali', sub:'Monitorare l’utilizzo delle abilità di efficacia interpersonale',
  intro:'Foglio 5: ogni volta che usi (o potresti usare) le abilità interpersonali, annota la situazione, obiettivi e priorità e spunta cosa hai detto o fatto tra DEAR MAN, GIVE e FAST.',
  c:[_A('ev','Evento scatenante: chi ha fatto che cosa a chi? Con quali conseguenze?'),
     _H('Obiettivi in questa situazione'),
     _A('obi','Obiettivi: che risultato vuoi ottenere?'),
     _A('rel','Aspetto relazionale: cosa vuoi che l’altro provi per te?'),
     _A('rsp','Rispetto personale: come vuoi sentirti?'),
     _H('Le mie priorità (1 molto importante, 2 intermedia, 3 poco importante)'),
     _R('p-obi','Obiettivi',['1','2','3']), _R('p-rel','Relazione',['1','2','3']), _R('p-rsp','Rispetto di sé',['1','2','3']),
     _A('con','Ci sono conflitti tra le priorità che rendono difficile essere efficace?'),
     _H('Cosa ho detto o fatto'),
     _C('dear','DEAR MAN (ottenere ciò che voglio)',['Ho Descritto la situazione','Ho Espresso emozioni e opinioni','Ho Affermato','Ho Rinforzato','Ho Negoziato','Sono stato Mindful','Ho fatto il “disco rotto”','Ho ignorato gli attacchi','Ho agito in modo sicuro']),
     _A('dear-n','Cosa hai detto o fatto, in concreto (DEAR MAN)?'),
     _C('give','GIVE (mantenere la relazione)',['Sono stato Gentile','Ho agito senza minacce','Ho agito senza attacchi','Ho agito senza giudizi','Mi sono mostrato Interessato','Ho Validato','Sono stato Educato']),
     _A('give-n','Cosa hai detto o fatto, in concreto (GIVE)?'),
     _C('fast','FAST (mantenere il rispetto di sé)',['Sono stata Franca','Sono stata Assertiva','Ho seguito i miei valori','Sono stata Trasparente']),
     _A('fast-n','Cosa hai detto o fatto, in concreto (FAST)?'),
     _A('eff','Quanto è stata efficace l’interazione?')]},
 {id:'i-chiedere', mod:'inter', t:'Quanto chiedere?', sub:'Il gioco della moneta: farsi un’idea di quanto risolutamente chiedere o dire no',
  intro:'Foglio 6: per ogni voce segna le domande a cui rispondi sì (una moneta da 10 cent ciascuna), somma e correggi in mente saggia; il totale indica quanto risolutamente chiedere o dire no.',
  c:[_T('cosa','Cosa vuoi chiedere o a cosa vuoi dire no?'),
     _H('Decidere quanto risolutamente chiedere (una moneta per ogni sì)'),
     _C('ch','Spunta le domande a cui rispondi sì',['Capacità: questa persona è in grado di darmi quello che voglio?','Priorità: è più importante il mio obiettivo della relazione?','Rispetto di sé: chiedere mi farà sentire più competente e sicura?','Diritto: l’altro deve darmi ciò che chiedo (legge o codice morale)?','Autorità: posso dire all’altra persona cosa deve fare?','Relazione: è appropriato alla relazione chiedere ciò che chiedo?','Obiettivi: chiedere è giusto rispetto ai miei obiettivi di lungo termine?','Reciprocità: do altrettanto di quel che chiedo?','Esercizio a casa: so ciò che voglio e agisco supportata dai fatti?','Tempestività: è un buon momento per chiedere?']),
     _T('ch-tot','Totale delle monete (corretto ± per la mente saggia)'),
     _R('ch-liv','Quanto risolutamente chiedere',['0-10 cent: non chiedo, non acconsento','20: acconsento in modo indiretto, accetto un no','30: acconsento in modo diretto, accetto un no','40: provo a chiedere, accetto un no','50: chiedo gentilmente, accetto un no','60: chiedo con fiducia, accetto un no','70: chiedo con fiducia, controbatto a un no','80: chiedo con fermezza, controbatto a un no','90: chiedo con fermezza, insisto, negozio','1 euro: chiedo e non accetto un rifiuto']),
     _H('Decidere quanto risolutamente dire no (una moneta per ogni no)'),
     _C('no','Spunta le domande a cui rispondi no',['Capacità: posso dare all’altro ciò che mi chiede?','Priorità: la relazione è più importante della cosa che mi chiede?','Rispetto di sé: dire di no mi farà sentire male con me stessa?','Diritto: mi viene richiesto (legge o codice morale) di fare ciò che chiede?','Autorità: l’altra persona è nella posizione di dirmi cosa devo fare?','Relazione: la richiesta è appropriata alla relazione?','Obiettivi: nel lungo periodo mi pentirò di aver detto no?','Reciprocità: l’altra persona ha fatto molto per me?','Esercizio a casa: so a cosa sto dicendo no (è chiaro cosa viene richiesto)?','Tempestività: devo aspettare un momento prima di dire no?']),
     _T('no-tot','Totale delle monete (corretto ± per la mente saggia)'),
     _R('no-liv','Quanto risolutamente dire no',['0-10 cent: faccio ciò che gli altri vogliono senza che lo chiedano','20: non mi lamento, lo faccio con piacere','30: lo faccio anche se non mi fa piacere','40: lo faccio ma mostro che preferirei evitarlo','50: dico che preferirei non farlo, ma lo faccio di buon grado','60: dico no con aria sicura, ma riconsidero','70: dico no con aria sicura, cerco di non dire sì','80: rifiuto con fermezza, cerco di non dire sì','90: rifiuto con fermezza, resisto, negozio, continuo a provare','1 euro: non lo faccio'])]},
 {id:'i-validare', mod:'inter', t:'Validare gli altri', sub:'Validare gli altri',
  intro:'Foglio 12: annota le volte in cui hai usato (o potevi usare) la validazione, i tipi praticati, frasi invalidanti e validanti, e una situazione concreta con il suo esito.',
  c:[_C('tipi','Tipi di validazione praticati di proposito',['Ho prestato attenzione','Ho rispecchiato ciò che è stato detto o fatto, restando disponibile a correggermi','Sono stata sensibile a ciò che è stato espresso in modo non verbale','Ho esplicitato il senso di ciò che veniva sentito, fatto o detto, date le cause','Ho riconosciuto e agito in base a ciò che aveva valore','Mi sono comportata in modo autentico ed egualitario']),
     _H('Una frase invalidante e due validanti rivolte ad altri'),
     _T('f1','Frase invalidante'), _T('f2','Frase validante 1'), _T('f3','Frase validante 2'),
     _A('giud','Una situazione in cui nell’ultima settimana ti sei astenuta dal giudizio verso qualcuno'),
     _H('Una situazione in cui hai usato la validazione nell’ultima settimana'),
     _A('sit','Descrivi la situazione'),
     _T('chi','Chi era la persona che hai validato?'),
     _A('cosa','Cosa hai fatto o detto, con esattezza, per validarla?'),
     _A('esito','Qual è stato l’esito?'),
     _A('dopo','Come ti sei sentita in seguito?'),
     _A('diverso','Vorresti dire o fare qualcosa di diverso la prossima volta? Cosa?')]},
 {id:'i-autoval', mod:'inter', t:'Validazione di sé', sub:'Validazione di sé e rispetto di sé',
  intro:'Foglio 13: annota le volte in cui hai usato (o potevi usare) l’autovalidazione, frasi autoinvalidanti e autovalidanti, e le strategie usate nella settimana.',
  c:[_H('Una frase autoinvalidante e due autovalidanti rivolte a te'),
     _T('f1','Frase autoinvalidante'), _T('f2','Frase autovalidante 1'), _T('f3','Frase autovalidante 2'),
     _A('inval','Una situazione in cui ti sei sentita invalidata nella scorsa settimana'),
     _C('str','Strategie usate durante la settimana',['Ho controllato i fatti per vedere se le mie risposte erano valide','Li ho controllati con qualcuno di fiducia per validare ciò che è valido','Ho riconosciuto quando le mie risposte non avevano senso né validità','Mi sono adoperata per cambiare pensieri, commenti o azioni senza validità (ho smesso di lamentarmi)','Ho lasciato cadere le affermazioni autogiudicanti (azione opposta)','Mi sono ricordata che ogni comportamento è causato e che faccio del mio meglio','Sono stata compassionevole con me stessa, mi sono autoconsolata','Ho ammesso che fa male essere invalidata, anche quando gli altri hanno ragione','Ho riconosciuto quando le mie reazioni avevano senso e validità','Mi sono ricordata che essere invalidata di rado è una catastrofe','Ho descritto le mie esperienze a persone di supporto','Ho vissuto il dolore di un’invalidazione traumatica e la sofferenza che ha creato','Ho praticato l’accettazione radicale di persone invalidanti nella mia vita']),
     _A('esito','Qual è stato l’esito?')]},
 {id:'i-dialettica', mod:'inter', t:'Praticare la dialettica', sub:'Praticare la dialettica',
  intro:'Foglio 11: descrivi due situazioni in cui hai praticato la dialettica, quali abilità hai usato, com’è stato e che effetto ha avuto.',
  c:[_H('Situazione 1'),
     _A('s1','Situazione (chi, che cosa, quando, dove)'),
     _C('ab1','Abilità usate',['Ho guardato entrambi i lati della medaglia','Sono stata consapevole della mia connessione','Ho accolto il cambiamento','Mi sono ricordata che influenzo gli altri e che gli altri influenzano me']),
     _A('e1','Descrivi l’esperienza di usare l’abilità'),
     _C('ef1','Ha influito in questi modi, anche solo un poco',['Ha ridotto la sofferenza','Ha fatto diminuire la reattività','Ha rinforzato la connessione','Ha aumentato la felicità','Ha aumentato la saggezza','Ha aumentato il sentimento di validità personale','Ha ridotto gli screzi con altre persone','Ha migliorato le relazioni']),
     _T('alt1','Altri esiti'),
     _H('Situazione 2'),
     _A('s2','Situazione (chi, che cosa, quando, dove)'),
     _C('ab2','Abilità usate',['Ho guardato entrambi i lati della medaglia','Sono stata consapevole della mia connessione','Ho accolto il cambiamento','Mi sono ricordata che influenzo gli altri e che gli altri influenzano me']),
     _A('e2','Descrivi l’esperienza di usare l’abilità'),
     _C('ef2','Ha influito in questi modi, anche solo un poco',['Ha ridotto la sofferenza','Ha fatto diminuire la reattività','Ha rinforzato la connessione','Ha aumentato la felicità','Ha aumentato la saggezza','Ha aumentato il sentimento di validità personale','Ha ridotto gli screzi con altre persone','Ha migliorato le relazioni']),
     _T('alt2','Altri esiti')]},
 // ── REGOLAZIONE EMOTIVA ──
 {id:'r-funzioni', mod:'reg', t:'Capire cosa fanno le emozioni per me', sub:'Capire cosa fanno le emozioni per me',
  intro:'Foglio 2: scegli una reazione emotiva recente e descrivi evento, motivazione all’azione, comunicazione agli altri e a te stessa (se l’evento era un’altra emozione, fai un secondo foglio per quella).',
  c:[_T('emo','Nome dell’emozione'), _S('int','Intensità (0-100)'),
     _H('Evento scatenante'),
     _A('evento','Cosa ha scatenato questa emozione?'),
     _H('Motivazione all’azione'),
     _A('mot','Quale azione mi stava motivando e preparando a fare la mia emozione? C’era un problema che mi stava portando a risolvere, superare o evitare? Al servizio di quale funzione o obiettivo era?'),
     _H('Comunicazione agli altri'),
     _A('espr','Com’erano la mia espressione facciale, la postura, i gesti, le parole, le azioni?'),
     _A('msg','Che messaggio ha mandato agli altri la mia emozione, anche senza volerlo?'),
     _A('infl','Come ha influenzato gli altri? Cosa hanno detto o fatto in risposta alla mia espressione emotiva o alle mie azioni?'),
     _H('Comunicazione a me stessa'),
     _A('dice','Cosa mi ha detto la mia emozione?'),
     _A('verifica','Quali fatti potrei controllare per essere sicura che il messaggio fosse corretto?'),
     _A('verificati','Quali fatti ho controllato?')]},
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
 {id:'r-azione-opposta', mod:'reg', t:'Azione opposta', sub:'Cambiare le emozioni con l’azione opposta',
  intro:'Foglio 7: scegli un’emozione dolorosa che vuoi cambiare, verifica se è giustificata dai fatti e, se non lo è, fai l’azione opposta alle tue spinte, fino in fondo.',
  c:[_T('emo','Nome dell’emozione'), _S('prima','Intensità prima (0-100)'), _S('dopo','Intensità dopo (0-100)'),
     _A('evento','Evento scatenante: chi, cosa, quando, dove? Cosa ha generato l’emozione?'),
     _H('L’emozione è giustificata? Corrisponde ai fatti? È efficace?'),
     _A('fgiust','Fatti che giustificano l’emozione'), _A('fnong','Fatti che non la giustificano'),
     _R('giust','Quale casella ti sembra più corretta?',['Giustificata (vai al problem solving)','Non giustificata (continua)']),
     _A('spinte','Spinte all’azione: cosa sento di voler fare o dire?'),
     _A('op','Azione opposta: quali sono le azioni opposte alle mie spinte? Cosa non sto facendo a causa dell’emozione? Descrivi cosa e come, per farla fino in fondo.'),
     _A('cosa','COSA ho fatto, nel dettaglio'),
     _A('come','COME l’ho fatto: linguaggio del corpo, espressioni del viso, postura, gesti e pensieri'),
     _A('sec','Quali effetti secondari ha avuto l’azione opposta su di me (umore, altre emozioni, comportamenti, pensieri, memoria, corpo)?')]},
 {id:'r-problem-solving', mod:'reg', t:'Problem solving', sub:'Usare il problem solving per cambiare le emozioni',
  intro:'Foglio 8: scegli un evento scatenante che può essere cambiato, trasformalo in un problema e percorri i sette passi del problem solving.',
  c:[_T('emo','Nome dell’emozione'), _S('prima','Intensità prima (0-100)'), _S('dopo','Intensità dopo (0-100)'),
     _H('1. Qual è il problema?'),
     _A('prob','Descrivi il problema che ha scatenato le emozioni. Cosa rende la situazione un problema?'),
     _H('2. Controlla i fatti'),
     _A('fatti','Cosa hai fatto per essere sicura dei fatti?'),
     _A('riscritto','Riscrivi il problema in modo che, se serve, corrisponda ai fatti'),
     _H('3. Obiettivo a breve termine'),
     _A('obi','Qual è un obiettivo realistico a breve termine? Cosa deve succedere perché tu pensi di aver fatto progressi?'),
     _H('4. Brainstorming delle soluzioni'),
     _A('idee','Elenca più soluzioni e strategie che puoi, senza valutarle'),
     _H('5. Le due idee migliori'),
     _T('s1','Soluzione 1'), _A('s1pro','Pro della soluzione 1'), _A('s1con','Contro della soluzione 1'),
     _T('s2','Soluzione 2'), _A('s2pro','Pro della soluzione 2'), _A('s2con','Contro della soluzione 2'),
     _H('6. Scegli e metti in pratica'),
     _A('scelta','Soluzione scelta'),
     _A('passi','Passi necessari (uno per riga)'),
     _A('fatto','Quali passi hai fatto, e cos’è successo?'),
     _H('7. Obiettivo raggiunto?'),
     _A('esito','Hai raggiunto l’obiettivo? Se sì, descrivilo; se no, cosa puoi fare dopo?'),
     _A('nuovo','C’è ora un nuovo problema da risolvere? Se sì, descrivilo e dì come pensi di risolverlo.')]},
 {id:'r-vulnerabilita', mod:'reg', t:'ABC PLEASE: ridurre la vulnerabilità', sub:'Passaggi progressivi per la riduzione della vulnerabilità emotiva',
  intro:'Foglio 9: per ogni abilità di riduzione della vulnerabilità (A, B, C e PLEASE), annota se l’hai usata durante la settimana e descrivi cosa hai fatto.',
  c:[_H('A — Accumulare emozioni positive: a breve termine'),
     _C('gpiac','Giorni in cui hai fatto cose piacevoli',['Lun','Mar','Mer','Gio','Ven','Sab','Dom']),
     _A('piac','Descrivi'),
     _H('A — A lungo termine: costruire una vita degna di essere vissuta'),
     _A('valori','Su quali valori vuoi lavorare e con quali obiettivi?'),
     _A('lungo','Obiettivi a lungo termine'),
     _A('evitare','Evitare di evitare'),
     _H('A — Consapevolezza delle esperienze positive del momento'),
     _A('attenz','Come hai concentrato (e riorientato) l’attenzione sulle esperienze positive?'),
     _A('preocc','Come ti sei distratta dalle preoccupazioni quando arrivavano?'),
     _H('B — Diventare brava nella mastery'),
     _C('gmast','Giorni con attività che danno senso di realizzazione ed efficacia',['Lun','Mar','Mer','Gio','Ven','Sab','Dom']),
     _A('mast','Descrivi'),
     _C('gdiff','Giorni in cui hai fatto qualcosa di difficile ma possibile',['Lun','Mar','Mer','Gio','Ven','Sab','Dom']),
     _A('diff','Descrivi'),
     _H('C — Giocare d’anticipo'),
     _A('sit','Situazione che suscita emozioni indesiderate'),
     _A('imm','Come hai immaginato di affrontarla con efficacia?'),
     _A('nuovi','Come hai immaginato di far fronte a nuovi problemi che potrebbero sorgere?'),
     _H('PLEASE'),
     _A('pl','Mi sono presa cura del corpo (dolori, malattie)?'),
     _A('ea','Ho mangiato cibo equilibrato?'),
     _A('as','Ho evitato le sostanze?'),
     _A('sl','Ho un sonno equilibrato?'),
     _A('ex','Ho fatto esercizio fisico?')]},
 {id:'r-valori', mod:'reg', t:'Dai valori ad azioni', sub:'Passare dai valori ad azioni specifiche',
  intro:'Foglio 11: dall’evitamento ai valori, dai valori agli obiettivi e ai piccoli passi d’azione, in sette passi, fino a fare un passo adesso.',
  c:[_H('Passo 1. Evitare l’evitamento'),
     _S('past','Quanto hai evitato di impegnarti per una vita degna di essere vissuta: in passato (0-100)'),
     _S('now','E adesso (0-100)'),
     _C('ragioni','Ragioni per cui hai evitato',['Disperazione','Caparbietà','Troppa difficoltà','Altro']),
     _A('piano','Piano d’azione per evitare l’evitamento dell’impegno'),
     _H('Passo 2. Valori importanti per te'),
     _A('valori','I miei valori importanti'),
     _H('Passo 3. Un valore o una priorità su cui lavorare adesso'),
     _T('v1','Valore 1'), _R('v1imp','Importanza del valore 1 (1-5)',['1','2','3','4','5']), _R('v1pri','Priorità del valore 1 (1-5)',['1','2','3','4','5']),
     _T('v2','Valore 2'), _R('v2imp','Importanza del valore 2 (1-5)',['1','2','3','4','5']), _R('v2pri','Priorità del valore 2 (1-5)',['1','2','3','4','5']),
     _A('fatti','Controlla i fatti: sono davvero i tuoi valori, non quelli degli altri o vecchie idee in cui non credi?'),
     _T('scelto','Valore su cui lavorare adesso'),
     _H('Passo 4. Obiettivi associati a questo valore'),
     _A('obiettivi','Due o tre obiettivi specifici'),
     _H('Passo 5. Un obiettivo su cui lavorare adesso'),
     _T('obi','Obiettivo scelto'),
     _H('Passo 6. Piccoli passi d’azione'),
     _A('passi','Passi d’azione, in ordine (scomponi quelli troppo grandi)'),
     _H('Passo 7. Fai un passo adesso'),
     _A('fatto','Descrivi quello che hai fatto'),
     _A('dopo','Descrivi quello che accade dopo'),
     _H('Ricordati: costruisci relazioni con gli altri'),
     _A('relaz','Relazioni, o relazioni problematiche, su cui vuoi lavorare'),
     _A('obirel','Su quali obiettivi puoi lavorare adesso?'),
     _A('micro','Micro-obiettivi tramite un’azione'),
     _A('farerel','Fai qualcosa in questo momento: cosa hai fatto, e cos’è successo dopo?')]},
 {id:'r-mastery', mod:'reg', t:'Mastery e gestire in anticipo', sub:'Diventa bravo nella mastery e gestisci in anticipo',
  intro:'Foglio 12: pianifica e annota le attività per la padronanza e descrivi le situazioni problematiche future e come immagini di affrontarle con efficacia.',
  c:[_T('giorno','Giorno'),
     _H('Diventare brava nella mastery'),
     _A('piano','Attività pianificate per diventare brava nella mastery'),
     _A('svolte','Attività svolte per diventare brava nella mastery'),
     _H('Gestire in anticipo: situazione 1'),
     _A('sit1','Futura situazione problematica'),
     _A('imm1','Come immagino di affrontarla efficacemente?'),
     _R('ut1','Utile?',['Sì','No']),
     _H('Gestire in anticipo: situazione 2'),
     _A('sit2','Futura situazione problematica'),
     _A('imm2','Come immagino di affrontarla efficacemente?'),
     _R('ut2','Utile?',['Sì','No'])]},
 {id:'r-sonno', mod:'reg', t:'Igiene del sonno', sub:'Foglio di pratica dell’igiene del sonno',
  intro:'Foglio 14B: per ogni giorno annota ore di sonno, tempo a letto, cosa hai fatto nelle 4 ore prima di dormire, le strategie usate e la rimuginazione prima e dopo.',
  c:[_T('giorno','Giorno'),
     _T('ore','Ore di sonno'),
     _T('letto','Tempo passato a letto durante il giorno (ore e minuti)'),
     _A('quattro','Mangiare, bere, fare esercizio nelle 4 ore prima di andare a dormire'),
     _S('inizio','Inizio: intensità delle emozioni e della rimuginazione (0-100, 0 se nessuna)'),
     _A('strat','Strategie usate per addormentarti (o riaddormentarti)'),
     _S('fine','Fine: intensità delle emozioni e della rimuginazione (0-100)'),
     _S('util','Utilità generale delle strategie (0-100)')]},
 {id:'r-incubi', mod:'reg', t:'Incubi: dopo il risveglio', sub:'Per affrontare gli incubi notturni',
  intro:'Foglio 14A: descrivi un sogno angosciante con tutti i dettagli sensoriali, riscrivilo cambiandolo prima che accada qualcosa di brutto, poi annota le ripetizioni con rilassamento. Per incubi frequenti o molto pesanti parlane con la terapeuta.',
  c:[_H('Parte 1. Il sogno angosciante'),
     _A('sogno','Nel mio sogno... (vista, olfatto, suoni, sapori; sentimenti, immagini e pensieri; cosa sembrano dire su di te; quando inizia e quando finisce)'),
     _H('Parte 2. Modificare il sogno'),
     _A('nuovo','Nel mio sogno, modificato da me... (stessi dettagli sensoriali; il cambiamento arriva prima che accada qualcosa di brutto a te o ad altri)'),
     _H('Parte 3. Ripetizione modificata del sogno con rilassamento'),
     _T('giorno','Giorno'),
     _A('momento','In che momento del giorno hai ricordato il sogno, l’hai cambiato e ti sei rilassata?'),
     _S('emo','Intensità delle emozioni negative (0-100)'),
     _S('incubo','Intensità dell’incubo di questa mattina (0-100, 0 se nessun incubo)')]},
 {id:'r-miti', mod:'reg', t:'Miti sulle emozioni', sub:'Miti e convinzioni comuni sulle emozioni',
  intro:'Foglio 3: confuta ciascun mito in modo che abbia senso per te, anche riscrivendo con parole tue le risposte già date.',
  c:[_A('mito','Mito scelto (tra i 20 del foglio, per esempio «Le emozioni dolorose non sono importanti e dovrebbero essere ignorate», oppure un altro mito tuo)'),
     _A('confuta','Confutalo con parole tue')]},
 {id:'r-mind-emozioni', mod:'reg', t:'Mindfulness dell’emozione', sub:'Mindfulness delle emozioni del momento',
  intro:'Foglio 15: descrivi una situazione che ti ha provocato un’emozione e spunta le strategie di mindfulness delle emozioni che hai messo in pratica.',
  c:[_T('emo','Nome dell’emozione'), _S('prima','Intensità prima (0-100)'), _S('dopo','Intensità dopo (0-100)'),
     _A('sit','Descrivi una situazione che ti ha provocato un’emozione'),
     _C('strat','Strategie che hai messo in pratica',['Fare un passo indietro e prendere nota dell’emozione','Viverla come un’onda che va e viene','Lasciare andare i giudizi sull’emozione','Notare in che parte del corpo si sente','Restare con le sensazioni fisiche il più a lungo possibile','Osservare quanto ci mette ad andarsene','Ricordare che criticarla non aiuta','Aprirmi alle emozioni non desiderate','Immaginarla come una nuvola nel cielo','Notare l’impellenza ad agire','Evitare di agire sotto l’influsso dell’emozione','Ricordare che ci sono momenti con emozioni diverse','Accettazione radicale dell’emozione','Provare ad amare le mie emozioni']),
     _T('altro','Altro'),
     _A('comm','Commenti e descrizioni delle esperienze')]},
 {id:'r-risolvere', mod:'reg', t:'Quando le abilità non funzionano', sub:'Risolvere i problemi delle abilità di regolazione emotiva',
  intro:'Foglio 16: quando un’abilità non funziona, percorri le sei domande in ordine, segui le istruzioni e annota se ti hanno aiutata, finché non trovi una soluzione.',
  c:[_T('emo','Nome dell’emozione'), _S('prima','Intensità prima (0-100)'), _S('dopo','Intensità dopo (0-100)'),
     _T('ab','Abilità che stavi cercando di usare e che non sembrava utile'),
     _H('1. Sono biologicamente più vulnerabile?'),
     _R('q1','Risposta (No: prossima domanda; Forse: ripassa PLEASE; Sì: lavora su PLEASE, valuta i farmaci)',['No','Forse','Sì']),
     _R('u1','È stato utile?',['No','Sì','Non l’ho fatto']),
     _H('2. Ho usato l’abilità correttamente?'),
     _R('q2','Risposta (Forse: rileggi le istruzioni, chiedi indicazioni e riprova)',['Sì','Forse']),
     _R('u2','È stato utile?',['No','Sì','Non l’ho fatto']),
     _H('3. Trovo rinforzi alle mie emozioni (e forse non voglio davvero cambiarle)?'),
     _R('q3','Risposta (Forse: ripassa Scheda 3; Sì: pro e contro del cambiare le emozioni)',['No','Forse','Sì']),
     _R('u3','È stato utile?',['No','Sì','Non l’ho fatto']),
     _H('4. Sto investendo il tempo e le energie che la regolazione emotiva richiede?'),
     _R('q4','Risposta (No: accettazione radicale e disponibilità, partecipazione ed efficacia, problem solving per trovare tempo)',['Sì','No']),
     _R('u4','È stato utile?',['No','Sì','Non l’ho fatto']),
     _H('5. Le emozioni sono troppo intense per usare le abilità in questo momento?'),
     _R('q5','Risposta (Sì: risolvi il problema se puoi; altrimenti occupati delle sensazioni fisiche; se è troppo estremo, abilità TIP)',['No','Sì']),
     _R('u5','È stato utile?',['No','Sì','Non l’ho fatto']),
     _H('6. I miti sulle emozioni mi stanno intralciando?'),
     _R('q6','Risposta (Sì: non giudicare, controlla i fatti e confuta i miti)',['No','Sì']),
     _R('u6','È stato utile?',['No','Sì','Non l’ho fatto'])]},
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
  fgMostraLista(def);
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

function fgMostraForm(def, entry){
  const body = fgCorpo(); if(!body) return;
  body.innerHTML = '';
  body.scrollTop = 0;
  const ro = fgSolaLettura();
  const w = document.createElement('div'); w.className = 'fg-wrap';
  const dati = (entry && entry.v) || {};
  const campi = {};
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
  ind.addEventListener('click', function(){ fgMostraLista(def); });
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
