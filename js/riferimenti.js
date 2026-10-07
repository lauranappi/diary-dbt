// ════════════════════════════════════════════════════════════════
// RIFERIMENTI AL MANUALE — scheda / foglio di lavoro e pagina stampata
// ════════════════════════════════════════════════════════════════
// Dice dove si trova ogni pagina dell'app nel manuale (es. "Scheda 4A, p. 54")
// e rende il riferimento cercabile. Le chiavi sono modulo-tipo-numero:
// M Mindfulness, R Regolazione emotiva, T Tolleranza della sofferenza,
// I Efficacia interpersonale, G Parte generale; S scheda, F foglio di lavoro.
const RF_PAG = {"G-F1": 27, "G-S1A": 10, "G-S5": 14, "I-F11": 189, "I-F12": 192, "I-F13": 193, "I-F3": 173, "I-F5": 175, "I-F6": 176, "I-S11": 140, "I-S12": 143, "I-S13": 145, "I-S15": 150, "I-S16": 151, "I-S16A": 152, "I-S17": 155, "I-S18": 156, "I-S2A": 119, "I-S4": 124, "I-S5": 125, "I-S5A": 127, "I-S6": 128, "I-S6A": 129, "I-S7": 130, "I-S8": 7, "M-F10A": 106, "M-F2C": 81, "M-F6": 97, "M-F7A": 99, "M-F8": 101, "M-F9": 103, "M-S10": 74, "M-S1A": 46, "M-S3": 50, "M-S3A": 51, "M-S4": 53, "M-S4A": 54, "M-S5": 60, "M-S5A": 61, "M-S8": 70, "M-S9": 71, "R-F11": 296, "R-F12": 301, "R-F14A": 304, "R-F14B": 307, "R-F15": 311, "R-F16": 312, "R-F2": 275, "R-F3": 279, "R-F4": 281, "R-F5": 285, "R-F7": 288, "R-F8": 289, "R-F9": 293, "R-S10": 231, "R-S11": 232, "R-S12": 241, "R-S14": 247, "R-S15": 248, "R-S16": 249, "R-S17": 252, "R-S18": 253, "R-S19": 256, "R-S20": 257, "R-S20A": 258, "R-S20B": 259, "R-S22": 264, "R-S23": 265, "R-S24": 1, "R-S3": 210, "R-S4": 211, "R-S4A": 212, "R-S5": 213, "R-S6": 214, "R-S8": 228, "R-S8A": 229, "T-F1": 369, "T-F12": 399, "T-F12A": 400, "T-F2": 372, "T-F2A": 373, "T-F3": 374, "T-F3A": 375, "T-F6C": 385, "T-F7": 386, "T-F9": 394, "T-S11": 342, "T-S11A": 343, "T-S11B": 344, "T-S13": 346, "T-S14": 347, "T-S14A": 348, "T-S15": 350, "T-S15A": 351, "T-S17": 357, "T-S17A": 358, "T-S18": 359, "T-S18A": 360, "T-S19": 361, "T-S2": 325, "T-S20": 362, "T-S21": 363, "T-S3": 326, "T-S4": 327, "T-S5": 328, "T-S6": 329, "T-S6A": 330, "T-S6B": 332, "T-S6C": 332, "T-S7": 333, "T-S8": 334, "T-S8A": 335, "T-S9": 336, "T-S9A": 337};
const RF_SK = {"tcrisi": ["T-S2", "T-S3"], "stop": ["T-S4"], "procontro": ["T-S5"], "tip": ["T-S6"], "tacqua": ["T-S6A"], "trilass": ["T-S6B"], "triform": ["T-S6C"], "accept": ["T-S7"], "sensi": ["T-S8"], "tbody": ["T-S8A"], "migliora": ["T-S9"], "tsensoriale": ["T-S9A"], "autoincor": ["T-S9"], "disponibilita": ["T-S13"], "sorriso": ["T-S14", "T-S14A"], "accrad": ["T-S11", "T-S11A", "T-S11B"], "mpensieri": ["T-S15", "T-S15A"], "mdefin": ["M-S1A"], "mstati": ["M-S3"], "msaggio": ["M-S3A"], "mcosa": ["M-S4"], "mcome": ["M-S5", "M-S5A"], "mrespiro": ["M-S4A"], "mfareessere": ["M-S9"], "mamorev": ["M-S8"], "isentiero": ["M-S10"], "memozioni": ["R-S22"], "rperche": ["R-S3"], "rdescrivi": ["R-S5", "R-S6"], "rmiti": ["R-S4", "R-S4A"], "rcheck": ["R-S8", "R-S8A"], "razione": ["R-S10", "R-S11"], "rplease": ["R-S20"], "rsonno": ["R-S20B"], "rincubi": ["R-S20A"], "rabc": ["R-S14"], "rmastery": ["R-S19"], "rproblem": ["R-S12"], "rvalori": ["R-S17", "R-S18"], "restreme": ["R-S23"], "rrisolvi": ["R-S24"], "rpositivo": ["R-S15", "R-S17"], "ipriorita": ["I-S4"], "dearman": ["I-S5", "I-S5A"], "ifermezza": ["I-S8"], "give": ["I-S6", "I-S6A"], "fast": ["I-S7"], "idialettica": ["I-S15", "I-S16", "I-S16A"], "ivalida": ["I-S17", "I-S18"], "imiti": ["I-S2A"], "itrova": ["I-S11"], "imindf": ["I-S12"], "ichiudi": ["I-S13"], "dastinenza": ["T-S17", "T-S17A"], "dmente": ["T-S18", "T-S18A"], "dcomunita": ["T-S19"], "dponti": ["T-S20"], "dribellione": ["T-S21"], "gopzioni": ["G-S1A"], "gbiosoc": ["G-S5"]};
const RF_FG = {"m-abilita": ["M-F2C"], "m-piacevoli": ["M-F8"], "m-spiacevoli": ["M-F9"], "m-fare-essere": ["M-F7A"], "m-sentiero": ["M-F10A"], "m-gentilezza": ["M-F6"], "t-stop": ["T-F2", "T-F2A"], "t-impulso": ["T-F3", "T-F3A"], "t-crisi": ["T-F1"], "t-accettazione": ["T-F9"], "t-bodyscan": ["T-F6C"], "t-pensieri": ["T-F12", "T-F12A"], "t-miglioramomento": ["T-F7"], "i-priorita": ["I-F3"], "i-monitor": ["I-F5"], "i-chiedere": ["I-F6"], "i-validare": ["I-F12"], "i-autoval": ["I-F13"], "i-dialettica": ["I-F11"], "r-funzioni": ["R-F2"], "r-osserva": ["R-F4"], "r-azione-opposta": ["R-F7"], "r-problem-solving": ["R-F8"], "r-vulnerabilita": ["R-F9"], "r-valori": ["R-F11"], "r-mastery": ["R-F12"], "r-sonno": ["R-F14B"], "r-incubi": ["R-F14A"], "r-miti": ["R-F3"], "r-mind-emozioni": ["R-F15"], "r-risolvere": ["R-F16"]};
const RF_SC = {"fatti": ["R-S8", "R-F5"], "procontro": ["G-F1"], "dearman": ["I-S5"], "give": ["I-S6"], "fast": ["I-S7"], "abc": ["R-S14", "R-S15"], "please": ["R-S20"], "eventi": ["R-S16"]};
const RF_MOD = {M:'Mindfulness', R:'Regolazione emotiva', T:'Tolleranza della sofferenza', I:'Efficacia interpersonale', G:'Parte generale'};
function rfVoce(k){
  const p = k.split('-'), mod = p[0], tipo = p[1].charAt(0) === 'S' ? 'Scheda' : 'Foglio di lavoro', n = p[1].slice(1);
  return {mod: mod, nome: RF_MOD[mod], tipo: tipo, n: n, pag: RF_PAG[k] || 0};
}
function rfLista(tipo, id){
  const m = {sk: RF_SK, fg: RF_FG, sc: RF_SC}[tipo]; return (m && m[id]) || [];
}
// "Mindfulness · Scheda 4A, p. 54" (piu' voci: "Schede 5, 6 · pp. 100, 101")
function rfTesto(tipo, id, senzaModulo){
  const l = rfLista(tipo, id).map(rfVoce); if(!l.length) return '';
  const mods = []; l.forEach(function(v){ if(mods.indexOf(v.nome) === -1) mods.push(v.nome); });
  const tipi = {}; l.forEach(function(v){ (tipi[v.tipo] = tipi[v.tipo] || []).push(v); });
  const parti = Object.keys(tipi).map(function(t){
    const vv = tipi[t], plurale = vv.length > 1;
    const nome = t === 'Scheda' ? (plurale ? 'Schede ' : 'Scheda ') : (plurale ? 'Fogli di lavoro ' : 'Foglio di lavoro ');
    return nome + vv.map(function(v){ return v.n; }).join(', ');
  });
  const pp = l.filter(function(v){ return v.pag; }).map(function(v){ return v.pag; });
  const pagine = pp.length ? (pp.length > 1 ? ', pp. ' + pp.join(', ') : ', p. ' + pp[0]) : '';
  return (senzaModulo ? '' : mods.join(' / ') + ' · ') + parti.join(' e ') + pagine;
}
// testo per la ricerca: "scheda 4a foglio di lavoro 4a pag 54 pagina 54 p 54 mindfulness"
function rfCerca(tipo, id){
  const l = rfLista(tipo, id).map(rfVoce); if(!l.length) return '';
  return l.map(function(v){ return [v.nome, v.tipo, v.n, v.tipo + ' ' + v.n, v.pag ? 'p ' + v.pag + ' pag ' + v.pag + ' pagina ' + v.pag + ' pp ' + v.pag : ''].join(' '); }).join(' ');
}
