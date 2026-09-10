// ════════════════════════════════════════════════════════════════
// CONFIG — Supabase URL/KEY, stato globale
// ════════════════════════════════════════════════════════════════
// ══════════════════════════════════════════
// STATE
// ══════════════════════════════════════════
// ── SUPABASE CONFIG (hardcoded - anon key is safe to expose) ──
const SUPA_URL = 'https://lwachxuvvxdmuxurzjhp.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3YWNoeHV2dnhkbXV4dXJ6amhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2NDIyODIsImV4cCI6MjA5NTIxODI4Mn0.xyZz19eHKmonlpszCCui61rHikzg05QfjMChbtDjlMM';

let cur=new Date(), allData={}, profile={}, settings={}, actTried={}, lastPushTs=0;
let channel=null;


// Chiave data in ORA LOCALE. toISOString() converte in UTC: alle 00:30
// italiane restituiva ancora il giorno precedente, falsando streak e
// salvataggi notturni.
const dk=d=>{
  const x = d instanceof Date ? d : new Date(d);
  const p = n => String(n).padStart(2,'0');
  return x.getFullYear() + '-' + p(x.getMonth()+1) + '-' + p(x.getDate());
};
const today=()=>dk(new Date());
const isFut=d=>{const t=new Date();t.setHours(0,0,0,0);const x=new Date(d);x.setHours(0,0,0,0);return x>t};
function fmtL(d){const dd=d instanceof Date?d:new Date(d+'T12:00:00');if(dk(dd)===today())return'Oggi';return dd.toLocaleDateString('it-IT',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
function fmtS(d){return new Date(d+'T12:00:00').toLocaleDateString('it-IT',{weekday:'short',day:'numeric',month:'short'})}



// ── STORAGE ──
// Load profile (which user is logged in) - SHARED across all users
function ldProfile(){
  try{
    const r=localStorage.getItem('dbt_profile');
    if(r){const p=JSON.parse(r);profile=p.profile||{};settings=p.settings||{};channel=p.channel||null;}
  }catch(e){profile={};settings={};channel=null;}
}
function svProfile(){localStorage.setItem('dbt_profile',JSON.stringify({profile,settings,channel}))}

// Load data SPECIFIC to this user (by code)
function ldData(){
  if(!profile.code){allData={};actTried={};return;}
  try{
    const r=localStorage.getItem('dbt_user_'+profile.code);
    if(r){const p=JSON.parse(r);allData=p.data||{};actTried=p.actTried||{};lastPushTs=p.lastPushTs||0;}
    else{allData={};actTried={};lastPushTs=0;}
  }catch(e){allData={};actTried={};lastPushTs=0;}
}
function svData(){
  if(!profile.code)return;
  localStorage.setItem('dbt_user_'+profile.code,JSON.stringify({data:allData,actTried,lastPushTs}));
}

// Combined load on startup
function ldLS(){
  ldProfile();
  ldData();
}
// Combined save
function svLS(){
  svProfile();
  svData();
}

