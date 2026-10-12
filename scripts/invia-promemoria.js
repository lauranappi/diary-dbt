// Manda il promemoria push a chi ha attivato le notifiche e non ha ancora
// compilato il diario di oggi. Gira ogni 15 minuti da GitHub Actions
// (.github/workflows/promemoria.yml).
const webpush = require('web-push');

const { SUPABASE_URL, SUPABASE_SERVICE_KEY, VAPID_PUBLIC, VAPID_PRIVATE } = process.env;
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !VAPID_PUBLIC || !VAPID_PRIVATE) {
  console.error('Mancano i secrets: SUPABASE_URL, SUPABASE_SERVICE_KEY, VAPID_PUBLIC, VAPID_PRIVATE.');
  process.exit(1);
}
webpush.setVapidDetails('https://lauranappi.github.io/diary-dbt/', VAPID_PUBLIC, VAPID_PRIVATE);

const H = {
  apikey: SUPABASE_SERVICE_KEY,
  Authorization: 'Bearer ' + SUPABASE_SERVICE_KEY,
  'Content-Type': 'application/json'
};
const FINESTRA_MIN = 180;   // se l'ora e' passata da piu' di 3 ore non si manda piu'

// data (AAAA-MM-GG) e minuti dall'inizio del giorno nel fuso della persona
function adesso(fuso) {
  let parti;
  try {
    parti = new Intl.DateTimeFormat('en-CA', {
      timeZone: fuso, year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    }).formatToParts(new Date());
  } catch (e) {
    return adesso('Europe/Rome');
  }
  const v = {};
  parti.forEach(p => { v[p.type] = p.value; });
  return { oggi: v.year + '-' + v.month + '-' + v.day, min: Number(v.hour) * 60 + Number(v.minute) };
}

async function main() {
  const r = await fetch(SUPABASE_URL + '/rest/v1/push_iscrizioni?attivo=eq.true&select=*', { headers: H });
  if (!r.ok) { console.error('Lettura iscrizioni fallita', r.status, await r.text()); process.exit(1); }
  const righe = await r.json();
  let inviate = 0, saltate = 0, rimosse = 0;

  for (const it of righe) {
    const t = adesso(it.fuso || 'Europe/Rome');
    const [hh, mm] = String(it.ora || '21:00').split(':').map(Number);
    const target = hh * 60 + (mm || 0);
    const scaduto = t.min >= target && t.min < target + FINESTRA_MIN;
    if (!scaduto || it.ultimo_invio === t.oggi || it.compilato_il === t.oggi) { saltate++; continue; }
    try {
      await webpush.sendNotification(it.subscription, JSON.stringify({
        title: 'Diary Card DBT',
        body: 'Non dimenticare di compilare la tua diary card di oggi! \u{1F4D3}'
      }), { TTL: 3600 });
      await fetch(SUPABASE_URL + '/rest/v1/push_iscrizioni?endpoint=eq.' + encodeURIComponent(it.endpoint), {
        method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' }, body: JSON.stringify({ ultimo_invio: t.oggi })
      });
      inviate++;
    } catch (e) {
      if (e.statusCode === 404 || e.statusCode === 410) {
        await fetch(SUPABASE_URL + '/rest/v1/push_iscrizioni?endpoint=eq.' + encodeURIComponent(it.endpoint), { method: 'DELETE', headers: H });
        rimosse++;
      } else {
        console.error('Invio fallito', e.statusCode || '', e.body || e.message);
      }
    }
  }
  console.log('Iscrizioni: ' + righe.length + ' · inviate: ' + inviate + ' · saltate: ' + saltate + ' · rimosse: ' + rimosse);
}
main().catch(e => { console.error(e); process.exit(1); });
