/* Guardia_Rev v3 · application : connexion obligatoire, cours, QCM, cartes à répétition espacée, exercices,
   XP, niveaux et badges, profils avec photo, classement, défis entre étudiants, entraînements, lexique,
   recherche et partiel blanc. Réalisé par Titan_gp1. */
(function(){
'use strict';
const VERSION='4.0.0';
const CFG=window.GR_CONFIG||{};
const DOMAIN=(CFG.domain||'guardiaschool.fr').toLowerCase();
const META={isr:['server','#2563eb'],supervision:['activity','#d97706'],fondamentaux:['lock','#0d9488'],devsecops:['terminal','#16a34a'],web:['code','#ea580c'],incident:['alert','#7c3aed'],anglais:['languages','#db2777']};
const SUBJECTS=(window.GR&&window.GR.subjects)||[];
SUBJECTS.forEach(s=>{s.fiche=s.fiche||[];s.cards=s.cards||[];s.exos=s.exos||[];
  const m=META[s.id]||['book','#475569'];s.ic=m[0];s.col=m[1];
  s.quiz=(s.quiz||[]).map((q,i)=>({...q,id:s.id+'-'+i,sid:s.id}))});
const QINDEX=new Map();SUBJECTS.forEach(s=>s.quiz.forEach(q=>QINDEX.set(q.id,q)));
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=$('#root');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const subj=id=>SUBJECTS.find(s=>s.id===id);
const emailOk=e=>new RegExp('^[^\\s@]+@'+DOMAIN.replace(/\./g,'\\.')+'$','i').test(String(e||'').trim());
/* Adresses bannies : empreinte SHA-256 de l'email (en minuscules) comparée à la liste de config.js. */
const BLOCKED=new Set((CFG.blocked||[]).map(h=>String(h).toLowerCase()));
async function isBlocked(e){if(!BLOCKED.size)return false;try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(String(e||'').trim().toLowerCase()));
  return BLOCKED.has([...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join(''))}catch(_){return false}}
const BLOCKED_MSG='Inscription et connexion impossibles avec cette adresse.';
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const fold=s=>String(s||'').normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
const _tmp=document.createElement('div');
const plain=h=>{_tmp.innerHTML=h;return (_tmp.textContent||'').replace(/\s+/g,' ').trim()};
const pad2=n=>String(n).padStart(2,'0');
const dayKey=(d=new Date())=>d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());
const addDays=(k,n)=>{const [y,m,d]=k.split('-').map(Number);return dayKey(new Date(y,m-1,d+n))};
const daysBetween=(a,b)=>{const p=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};return Math.round((p(b)-p(a))/864e5)};
const plural=(n,w,ws)=>n+' '+(n>1?(ws||w+'s'):w);
const fmt=n=>Number(n||0).toLocaleString('fr-FR');
const millis=t=>t&&typeof t.toMillis==='function'?t.toMillis():(+t||0);
const ago=t=>{const s=Math.round((Date.now()-t)/1000);if(!t||s<0)return '';if(s<60)return 'à l\'instant';if(s<3600)return 'il y a '+Math.round(s/60)+' min';if(s<86400)return 'il y a '+Math.round(s/3600)+' h';return 'il y a '+plural(Math.round(s/86400),'jour')};

function toast(msg,kind){const box=$('#toasts');if(!box)return;const t=document.createElement('div');t.className='toast'+(kind?' '+kind:'');t.textContent=msg;box.appendChild(t);setTimeout(()=>t.remove(),3800)}

/* ================= Icônes (Lucide, licence ISC) ================= */
const IC={
  home:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  grad:'<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',
  zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  book:'<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>',
  bookOpen:'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  user:'<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  server:'<rect width="20" height="8" x="2" y="2" rx="2" ry="2"/><rect width="20" height="8" x="2" y="14" rx="2" ry="2"/><line x1="6" x2="6.01" y1="6" y2="6"/><line x1="6" x2="6.01" y1="18" y2="18"/>',
  activity:'<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
  lock:'<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  terminal:'<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
  code:'<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  alert:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  languages:'<path d="m5 8 6 6"/><path d="m4 14 6-6 2-3"/><path d="M2 5h12"/><path d="M7 2h1"/><path d="m22 22-5-10-5 10"/><path d="M14 18h6"/>',
  check:'<path d="M20 6 9 17l-5-5"/>',
  x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  flame:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  calendar:'<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
  target:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  layers:'<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/>',
  circleCheck:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',
  rotate:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  moon:'<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>',
  menu:'<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
  arrow:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  chevron:'<path d="m9 18 6-6-6-6"/>',
  printer:'<path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/>',
  network:'<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
  plug:'<path d="M12 22v-5"/><path d="M9 8V2"/><path d="M15 8V2"/><path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z"/>',
  list:'<path d="M3 12h.01"/><path d="M3 18h.01"/><path d="M3 6h.01"/><path d="M8 12h13"/><path d="M8 18h13"/><path d="M8 6h13"/>',
  eye:'<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>',
  eyeOff:'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>',
  trophy:'<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  swords:'<polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5"/><line x1="13" x2="19" y1="19" y2="13"/><line x1="16" x2="20" y1="16" y2="20"/><line x1="19" x2="21" y1="21" y2="19"/><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5"/><line x1="5" x2="9" y1="14" y2="18"/><line x1="7" x2="4" y1="17" y2="20"/><line x1="3" x2="5" y1="19" y2="21"/>',
  award:'<path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"/><circle cx="12" cy="8" r="6"/>',
  crown:'<path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z"/><path d="M5 21h14"/>',
  camera:'<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
  trash:'<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>'
};
const ic=(n,c='')=>`<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]||''}</svg>`;
const GLOGO='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
const LOGO='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M17.5 7.5A7 7 0 1 0 19 13h-7"/></svg>';
const subjIco=(s,size=44)=>`<span class="subj-ico" style="--c:${s.col};width:${size}px;height:${size}px">${ic(s.ic,size<36?'sm':'')}</span>`;
const tic=(name,col)=>`<span class="t-ic" style="background:color-mix(in srgb,${col} 18%,transparent);color:${col}">${ic(name)}</span>`;

/* ================= Niveaux, XP et badges ================= */
const LV_T=n=>50*n*(n-1); /* XP pour atteindre le niveau n : 0, 100, 300, 600, 1000, 1500… */
const TITLES=[[20,'RSSI'],[15,'Expert sécurité'],[11,'Pentester'],[8,'Analyste N2'],[5,'Analyste N1'],[3,'Stagiaire SOC'],[1,'Script kiddie']];
function levelOf(xp){xp=Math.max(0,xp||0);let n=1;while(xp>=LV_T(n+1))n++;const a=LV_T(n),b=LV_T(n+1);
  return {n,title:(TITLES.find(t=>n>=t[0])||[0,''])[1],cur:xp-a,need:b-a,left:b-xp,pct:Math.round(100*(xp-a)/(b-a))}}
const AVC=['#2563eb','#7c3aed','#db2777','#ea580c','#0d9488','#16a34a','#b45309','#0891b2'];
const avColor=k=>{let h=0;for(const c of String(k||''))h=(h*31+c.charCodeAt(0))>>>0;return AVC[h%AVC.length]};
const initials=n=>String(n||'?').trim().split(/[\s._-]+/).filter(Boolean).map(w=>w[0]).join('').slice(0,2).toUpperCase()||'?';
const okPhoto=a=>typeof a==='string'&&/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/.test(a);
function avatar(p,s=40){return `<span class="av" style="--s:${s}px;--av:${avColor(p&&(p.id||p.pseudo))}">${p&&okPhoto(p.avatar)?`<img src="${p.avatar}" alt="">`:esc(initials(p&&p.pseudo))}</span>`}
function ringAv(p,s=52,xp){const L=levelOf(xp!=null?xp:(p&&p.xp));return `<span class="ring" style="--s:${s}px;--p:${L.pct}">${avatar(p,s)}<span class="lvl" aria-label="Niveau ${L.n}">${L.n}</span></span>`}

/* ================= Comptes ================= */
const FR_ERR={
  'auth/invalid-credential':'Email ou mot de passe incorrect.','auth/invalid-login-credentials':'Email ou mot de passe incorrect.',
  'auth/wrong-password':'Email ou mot de passe incorrect.','auth/user-not-found':'Aucun compte avec cet email.',
  'auth/email-already-in-use':'Un compte existe déjà avec cet email. Connectez-vous.','auth/weak-password':'Mot de passe trop faible : 8 caractères minimum.',
  'auth/invalid-email':'Adresse email invalide.','auth/too-many-requests':'Trop de tentatives. Patientez quelques minutes.',
  'auth/network-request-failed':'Pas de connexion réseau.','auth/unauthorized-domain':'Ce site n\'est pas encore autorisé dans Firebase (domaines autorisés).',
  'auth/account-exists-with-different-credential':'Un compte existe déjà avec cet email : connectez-vous avec votre mot de passe.',
  'permission-denied':'Accès refusé par le serveur.'};
const fr=e=>{const m=FR_ERR[e&&e.code];return new Error(m||(e&&e.message)||'Erreur inconnue.')};
function checkSignup(email,pw,pseudo){
  email=String(email||'').trim().toLowerCase();
  if(!emailOk(email))throw new Error('Utilisez votre adresse école : prenom.nom@'+DOMAIN);
  if(String(pw||'').length<8)throw new Error('Le mot de passe doit faire au moins 8 caractères.');
  pseudo=String(pseudo||'').trim();
  if(!/^[\p{L}0-9 _.-]{2,24}$/u.test(pseudo))throw new Error('Le prénom affiché doit faire 2 à 24 caractères.');
  return {email,pseudo};
}

async function firebaseBackend(fb){
  const SDK='https://www.gstatic.com/firebasejs/10.12.2/';
  const [A,U,F]=await Promise.all(['firebase-app.js','firebase-auth.js','firebase-firestore.js'].map(f=>import(SDK+f)));
  const app=A.initializeApp(fb),auth=U.getAuth(app),db=F.getFirestore(app);auth.languageCode='fr';
  const udoc=uid=>F.doc(db,'users',uid),pdoc=uid=>F.doc(db,'profiles',uid),profs=F.collection(db,'profiles'),chs=F.collection(db,'challenges');
  const verify=async u=>{try{await U.sendEmailVerification(u,{url:new URL('connexion.html',location.href).href})}
    catch(e){if(/continue-uri|unauthorized/.test(e.code||''))await U.sendEmailVerification(u);else throw e}};
  const asUser=u=>u?{id:u.uid,email:(u.email||'').toLowerCase(),name:u.displayName||'',verified:!!u.emailVerified}:null;
  const row=d=>({id:d.id,...d.data()});
  return {
    mode:'firebase',
    onAuth:cb=>U.onAuthStateChanged(auth,u=>cb(asUser(u))),
    async signUp(email,pw,pseudo){const r=await U.createUserWithEmailAndPassword(auth,email,pw);
      await U.updateProfile(r.user,{displayName:pseudo});await verify(r.user);return asUser(r.user)},
    async signIn(email,pw){const r=await U.signInWithEmailAndPassword(auth,email,pw);return asUser(r.user)},
    async google(){const p=new U.GoogleAuthProvider();p.setCustomParameters({hd:DOMAIN,prompt:'select_account'});
      try{return asUser((await U.signInWithPopup(auth,p)).user)}catch(e){if(e.code==='auth/popup-blocked'){await U.signInWithRedirect(auth,p);return null}throw e}},
    async reload(){if(!auth.currentUser)return null;await U.reload(auth.currentUser);await auth.currentUser.getIdToken(true);return asUser(auth.currentUser)},
    resend:()=>verify(auth.currentUser),
    reset:e=>U.sendPasswordResetEmail(auth,e),
    signOut:()=>U.signOut(auth),
    setName:n=>auth.currentUser?U.updateProfile(auth.currentUser,{displayName:n}):null,
    async load(uid){const s=await F.getDoc(udoc(uid));return s.exists()?s.data():null},
    async save(uid,data){await F.setDoc(udoc(uid),{...data,updatedAt:F.serverTimestamp()},{merge:true})},
    async getProfile(uid){const s=await F.getDoc(pdoc(uid));return s.exists()?row(s):null},
    async saveProfile(uid,d,create){const now=F.serverTimestamp();await F.setDoc(pdoc(uid),{...d,updatedAt:now,...(create?{createdAt:now}:{})},{merge:true})},
    async top(n){return (await F.getDocs(F.query(profs,F.orderBy('xp','desc'),F.limit(n)))).docs.map(row)},
    async countPlayers(){return (await F.getCountFromServer(profs)).data().count},
    async rankOf(xp){return (await F.getCountFromServer(F.query(profs,F.where('xp','>',xp)))).data().count+1},
    async challenges(uid){const [a,b]=await Promise.all([F.getDocs(F.query(chs,F.where('to','==',uid),F.limit(50))),F.getDocs(F.query(chs,F.where('from','==',uid),F.limit(50)))]);
      return [...a.docs,...b.docs].map(d=>{const x=row(d);x.created=millis(x.createdAt);x.done=millis(x.doneAt);return x})},
    async createChallenge(d){await F.addDoc(chs,{...d,toScore:null,toTime:null,status:'pending',createdAt:F.serverTimestamp(),doneAt:null})},
    async answerChallenge(id,d){await F.updateDoc(F.doc(db,'challenges',id),{...d,status:'done',doneAt:F.serverTimestamp()})},
    async deleteChallenge(id){await F.deleteDoc(F.doc(db,'challenges',id))},
    async remove(uid){await F.deleteDoc(pdoc(uid));await F.deleteDoc(udoc(uid));await U.deleteUser(auth.currentUser)}
  };
}
/* Mode local (développement) : comptes, profils et défis gardés dans ce navigateur. */
function localBackend(){
  let cb=null;
  const users=()=>store.get('gr-users',{}),setUsers=u=>store.set('gr-users',u);
  const profs=()=>store.get('gr-profiles',{}),setProfs=p=>store.set('gr-profiles',p);
  const chals=()=>store.get('gr-chals',[]),setChals=c=>store.set('gr-chals',c);
  const hash=async(pw,salt)=>{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+':'+pw));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('')};
  const cur=()=>{const e=store.get('gr-session',null),u=users()[e];return u?{id:e,email:e,name:u.pseudo,verified:true}:null};
  const emit=()=>cb&&cb(cur());
  const E=code=>Object.assign(new Error(code),{code});
  return {
    mode:'local',
    onAuth(f){cb=f;setTimeout(emit,0)},
    async signUp(email,pw,pseudo){const U=users();if(U[email])throw E('auth/email-already-in-use');
      const salt=crypto.getRandomValues(new Uint32Array(4)).join('-');U[email]={salt,h:await hash(pw,salt),pseudo};setUsers(U);store.set('gr-session',email);emit();return cur()},
    async signIn(email,pw){const u=users()[email];if(!u||u.h!==await hash(pw,u.salt))throw E('auth/invalid-credential');store.set('gr-session',email);emit();return cur()},
    async reload(){return cur()},async resend(){},
    async reset(){throw new Error('En mode local, la réinitialisation par email n\'existe pas : créez un nouveau compte.')},
    async signOut(){localStorage.removeItem('gr-session');emit()},
    async setName(){},
    async load(uid){return store.get('gr-data-'+uid,null)},
    async save(uid,data){store.set('gr-data-'+uid,Object.assign(store.get('gr-data-'+uid,{}),data))},
    async getProfile(uid){const p=profs()[uid];return p?{id:uid,...p}:null},
    async saveProfile(uid,d,create){const P=profs();P[uid]=Object.assign(P[uid]||{},d,{updatedAt:Date.now()},create?{createdAt:Date.now()}:{});setProfs(P)},
    async top(n){return Object.entries(profs()).map(([id,p])=>({id,...p})).sort((a,b)=>b.xp-a.xp).slice(0,n)},
    async countPlayers(){return Object.keys(profs()).length},
    async rankOf(xp){return Object.values(profs()).filter(p=>p.xp>xp).length+1},
    async challenges(uid){return chals().filter(c=>c.to===uid||c.from===uid).map(c=>({...c,created:c.createdAt,done:c.doneAt||0}))},
    async createChallenge(d){const C=chals();C.push({...d,id:'c'+Date.now()+Math.random().toString(16).slice(2,6),toScore:null,toTime:null,status:'pending',createdAt:Date.now(),doneAt:null});setChals(C)},
    async answerChallenge(id,d){const C=chals();const c=C.find(x=>x.id===id);if(c)Object.assign(c,d,{status:'done',doneAt:Date.now()});setChals(C)},
    async deleteChallenge(id){setChals(chals().filter(c=>c.id!==id))},
    async remove(uid){const U=users();delete U[uid];setUsers(U);const P=profs();delete P[uid];setProfs(P);localStorage.removeItem('gr-data-'+uid);localStorage.removeItem('gr-session');emit()}
  };
}

/* ================= État et progression ================= */
const S={api:null,user:null,ready:false,data:{progress:{}},authView:'login',authMsg:null,saving:null,onKey:null,menu:false,
  me:null,meExists:false,soc:{top:null,count:null,rank:null,chals:null,t:0,loading:false},players:{}};
function prog(){S.data.progress=S.data.progress||{};return S.data.progress}
function sp(id){const p=prog();p[id]=p[id]||{};const x=p[id];x.wrong=x.wrong||[];x.exos=x.exos||[];x.read=x.read||[];x.srs=x.srs||{};x.given=x.given||[];
  if(x.known&&x.known.length){x.known.forEach(i=>{if(!x.srs[i])x.srs[i]={b:3,due:addDays(dayKey(),3)}});delete x.known}return x}
function glob(k,d){const p=prog();if(p[k]==null)p[k]=d;return p[k]}
function xpTotal(){return Math.max(0,Math.round(prog()._xp||0))}
function myProfile(){const me=S.me||{};return {id:S.user.id,pseudo:me.pseudo||S.user.name||S.user.email.split('@')[0],avatar:me.avatar||'',bio:me.bio||'',group:me.group||'',hidden:!!me.hidden,xp:xpTotal()}}
function profileDoc(){const m=myProfile();return {pseudo:m.pseudo.slice(0,24),avatar:okPhoto(m.avatar)?m.avatar:'',bio:m.bio.slice(0,80),group:m.group.slice(0,20),hidden:m.hidden,xp:m.xp,level:levelOf(m.xp).n,streak:streak(),badges:earnedBadges()}}
function saveSoon(){clearTimeout(S.saving);S.saving=setTimeout(saveNow,700)}
async function saveNow(){if(!S.user||!S.user.verified)return;const uid=S.user.id;
  try{await S.api.save(uid,{pseudo:myProfile().pseudo,progress:prog()})}catch(e){console.error(e);toast('Progression non enregistrée : '+fr(e).message)}
  try{await S.api.saveProfile(uid,profileDoc(),!S.meExists);S.meExists=true}catch(e){console.error('profil',e)}}
function addXp(n,why,quiet){if(!n)return;const p=prog(),before=levelOf(xpTotal()).n;p._xp=xpTotal()+n;const L=levelOf(p._xp);
  if(L.n>before)toast(`Niveau ${L.n} atteint : ${L.title} !`,'xp');else if(!quiet&&why)toast(`+${n} XP · ${why}`,'xp');saveSoon()}
function bump(n=1){const a=glob('_act',{}),k=dayKey(),first=!a[k];a[k]=(a[k]||0)+n;
  const keys=Object.keys(a).sort();if(keys.length>120)keys.slice(0,keys.length-120).forEach(x=>delete a[x]);
  const st=streak();prog()._bestStreak=Math.max(prog()._bestStreak||0,st);
  if(first)addXp(10*Math.min(st,7),st>1?`Série de ${st} jours`:'Première révision du jour');saveSoon()}
function streak(){const a=glob('_act',{});let d=dayKey(),n=0;if(!a[d])d=addDays(d,-1);while(a[d]){n++;d=addDays(d,-1)}return n}
function giveOnce(sid,key,n,why){const p=sp(sid);if(p.given.includes(key))return;p.given.push(key);addXp(n,why)}
const INT=[0,1,2,4,8,16];
function cardState(sid,i){return sp(sid).srs[i]||null}
function dueList(sid){const s=subj(sid),t=dayKey();return s.cards.map((_,i)=>i).filter(i=>{const c=cardState(sid,i);return c&&c.due<=t})}
function newList(sid){return subj(sid).cards.map((_,i)=>i).filter(i=>!cardState(sid,i))}
function mastered(sid){return Object.values(sp(sid).srs).filter(c=>c.b>=3).length}
function totalDue(){return SUBJECTS.reduce((n,s)=>n+dueList(s.id).length,0)}
function totalWrong(){return SUBJECTS.reduce((n,s)=>n+sp(s.id).wrong.filter(id=>QINDEX.has(id)).length,0)}
function stats(s){const p=sp(s.id);const nq=s.quiz.length,nc=s.cards.length,ne=s.exos.length,nf=s.fiche.length;
  const best=p.quizBest||0,mast=mastered(s.id),ex=p.exos.length,rd=p.read.filter(i=>i<nf).length;
  const pct=Math.round(100*((nq?best/100:0)*.4+(nc?mast/nc:0)*.3+(ne?ex/ne:0)*.15+(nf?rd/nf:0)*.15));
  return {best,runs:p.quizRuns||0,mast,ex,rd,nq,nc,ne,nf,pct,wrong:p.wrong.filter(id=>QINDEX.has(id)).length,due:dueList(s.id).length}}
/* XP de départ pour les comptes créés avant le système d'XP. */
function retroXp(){let x=0;SUBJECTS.forEach(s=>{const p=sp(s.id);x+=p.read.length*15+p.exos.length*40+mastered(s.id)*5+(p.quizRuns||0)*20});
  const d=glob('_drills',{});Object.values(d).forEach(v=>x+=(v.ok||0)*5);x+=glob('_partiels',[]).length*40;return Math.min(x,9000)}

const BADGES=[
 ['first','Premier pas','Gagner ses premiers XP','zap',()=>xpTotal()>0],
 ['streak3','Régulier','3 jours de révision d\'affilée','flame',()=>(prog()._bestStreak||0)>=3],
 ['streak7','Inarrêtable','7 jours de révision d\'affilée','flame',()=>(prog()._bestStreak||0)>=7],
 ['perfect','Sans faute','100 % à un QCM d\'au moins 10 questions','target',()=>!!prog()._perfect],
 ['cards100','Mémoire vive','100 cartes révisées','layers',()=>(prog()._cardReviews||0)>=100],
 ['reader','Rat de bibliothèque','Toutes les sections d\'une matière lues','bookOpen',()=>SUBJECTS.some(s=>s.fiche.length&&sp(s.id).read.length>=s.fiche.length)],
 ['subnet','Masque d\'or','10 sous-réseaux calculés sans erreur','network',()=>((glob('_drills',{}).sousreseaux||{}).ok||0)>=10],
 ['ports','Annuaire vivant','20 ports trouvés','plug',()=>((glob('_drills',{}).ports||{}).ok||0)>=20],
 ['partiel','Prêt pour le jour J','80 % ou plus à un partiel blanc de 20 questions','grad',()=>glob('_partiels',[]).some(h=>h.pct>=80&&h.n>=20)],
 ['duel1','Premier sang','Gagner un défi','swords',()=>(prog()._duelWins||0)>=1],
 ['duel5','Gladiateur','Gagner 5 défis','trophy',()=>(prog()._duelWins||0)>=5],
 ['lvl5','Analyste','Atteindre le niveau 5','award',()=>levelOf(xpTotal()).n>=5],
 ['lvl10','Pentester en herbe','Atteindre le niveau 10','crown',()=>levelOf(xpTotal()).n>=10]];
function earnedBadges(){return BADGES.filter(b=>{try{return b[4]()}catch(e){return false}}).map(b=>b[0])}

/* ================= Social : profils, classement, défis ================= */
async function ensureProfile(){
  try{S.me=await S.api.getProfile(S.user.id)}catch(e){console.error(e);S.me=null}
  S.meExists=!!S.me;
  if(!S.me)S.me={id:S.user.id,pseudo:(S.user.name||S.user.email.split('@')[0]).slice(0,24),avatar:'',bio:'',group:'',hidden:false};
  if(!S.meExists){try{await S.api.saveProfile(S.user.id,profileDoc(),true);S.meExists=true}catch(e){console.error('création du profil',e)}}
}
function loadSocial(force){const so=S.soc;if(so.loading||(!force&&Date.now()-so.t<30000))return;so.loading=true;const uid=S.user.id;
  Promise.all([S.api.top(100).catch(()=>null),S.api.countPlayers().catch(()=>null),S.api.rankOf(xpTotal()).catch(()=>null),S.api.challenges(uid).catch(()=>null)])
  .then(([top,count,rank,chals])=>{so.top=top||so.top||[];so.count=count;so.rank=rank;so.chals=chals||so.chals||[];so.t=Date.now();so.loading=false;
    (so.top||[]).forEach(p=>S.players[p.id]=p);settleDuels();
    if(['accueil','classement','defis','joueur'].includes(PAGE))render()})
  .catch(()=>{so.loading=false})}
function duelOutcome(c,meFrom){const a=meFrom?c.fromScore:c.toScore,b=meFrom?c.toScore:c.fromScore;if(a!==b)return a>b?'win':'lose';
  const ta=meFrom?c.fromTime:c.toTime,tb=meFrom?c.toTime:c.fromTime;return ta===tb?'draw':(ta<tb?'win':'lose')}
/* Résultats des défis envoyés : XP et victoires attribués une seule fois. */
function settleDuels(){const uid=S.user.id,seen=glob('_duelsSeen',[]);let changed=false;
  (S.soc.chals||[]).forEach(c=>{if(c.from!==uid||c.status!=='done'||seen.includes(c.id))return;seen.push(c.id);changed=true;
    const r=duelOutcome(c,true);if(r==='win'){prog()._duelWins=(prog()._duelWins||0)+1;addXp(70,'Défi gagné contre '+c.toName)}
    else toast(r==='draw'?`Égalité avec ${c.toName}.`:`${c.toName} a gagné votre défi (${c.toScore}/${c.qids.length}).`)});
  if(seen.length>200)seen.splice(0,seen.length-200);if(changed)saveSoon()}
function incoming(){const uid=S.user.id;return (S.soc.chals||[]).filter(c=>c.to===uid&&c.status==='pending')}
function freshTop(){const me=myProfile();return (S.soc.top||[]).map(p=>p.id===me.id?{...p,...me}:p).sort((a,b)=>b.xp-a.xp)}
function playersList(){const uid=S.user.id;return (S.soc.top||[]).filter(p=>p.id!==uid&&!p.hidden)}

async function boot(){
  /* Mode local de développement : ?local sur localhost, mémorisé pour la session (les liens entre pages le perdent). */
  const lh=/^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  if(lh&&/[?&]local(=|&|$)/.test(location.search))try{sessionStorage.setItem('gr-local','1')}catch(e){}
  let forceLocal=false;try{forceLocal=lh&&sessionStorage.getItem('gr-local')==='1'}catch(e){}
  try{S.api=CFG.firebase&&!forceLocal?await firebaseBackend(CFG.firebase):localBackend()}
  catch(e){console.error(e);root.innerHTML=`<div class="loading"><div class="card pad" style="max-width:420px"><h2>Guardia_Rev</h2><p class="msg err" style="margin-top:12px">Le service de connexion ne répond pas. Vérifiez votre connexion et rechargez la page.</p></div></div>`;return}
  try{const m=sessionStorage.getItem('gr-authmsg');if(m){S.authMsg=JSON.parse(m);sessionStorage.removeItem('gr-authmsg')}}catch(e){}
  S.api.onAuth(async u=>{
    const deny=async t=>{await S.api.signOut();S.authMsg={k:'err',t};try{sessionStorage.setItem('gr-authmsg',JSON.stringify(S.authMsg))}catch(e){}if(PAGE!=='connexion')location.replace(U.login)};
    if(u&&!emailOk(u.email)){await deny('Seules les adresses @'+DOMAIN+' sont acceptées.');return}
    if(u&&await isBlocked(u.email)){await deny(BLOCKED_MSG);return}
    S.user=u;
    if(PAGE==='connexion'){if(u&&u.verified){location.replace(safeNext(qp('next')));return}S.ready=true;renderAuth();return}
    if(!u||!u.verified){location.replace(S.loggingOut?U.login:U.login+'?next='+encodeURIComponent(here()));return}
    S.data={progress:{}};S.me=null;S.soc={top:null,count:null,rank:null,chals:null,t:0,loading:false};
    try{S.data=(await S.api.load(u.id))||{progress:{}}}catch(e){console.error(e);toast('Impossible de charger votre progression.')}
    if(prog()._xp==null)prog()._xp=retroXp();
    await ensureProfile();loadSocial(true);
    S.ready=true;render();
  });
  document.addEventListener('keydown',onKey);
  window.addEventListener('beforeunload',e=>{if(QZ&&!QZ.done&&QZ.answers.length){e.preventDefault();e.returnValue=''}});
}

/* ================= Connexion (obligatoire) ================= */
function brandBlock(){return `<div class="brand" style="padding:0"><span class="brand-mark">${LOGO}</span><span><b>Guardia_Rev</b><small>Révisions des partiels · GCS1</small></span></div>`}
function msgBlock(){const m=S.authMsg;return `<div class="msg ${m?m.k:''}" id="authMsg" role="alert" ${m?'':'hidden'}>${m?esc(m.t):''}</div>`}
function showMsg(k,t){S.authMsg={k,t};const m=$('#authMsg');if(m){m.className='msg '+k;m.textContent=t;m.hidden=false}else renderAuth()}
function authArt(){return `<aside class="auth-art" aria-hidden="true"><div class="brand" style="color:#fff"><span class="brand-mark" style="background:rgba(255,255,255,.16)">${LOGO}</span><span><b>Guardia_Rev</b><small style="color:rgba(255,255,255,.75)">GCS1 · Guardia Cybersecurity School</small></span></div>
  <div style="display:grid;gap:16px"><h2>Révise. Progresse. Défie ta promo.</h2><p>Cours, QCM corrigés et anciens partiels, cartes à répétition espacée, XP, classement et duels entre étudiants.</p></div>
  <ul><li><span class="ic">${ic('bookOpen')}</span>7 matières, plus de 200 questions de QCM</li><li><span class="ic">${ic('trophy')}</span>XP, niveaux, badges et classement de la promo</li><li><span class="ic">${ic('swords')}</span>Défie un camarade sur les mêmes questions</li></ul></aside>`}
function renderAuth(){
  const v=S.authView,demo=S.api.mode==='local';
  if(S.user&&!S.user.verified){
    root.innerHTML=`<div class="auth">${authArt()}<div class="auth-main"><form class="card auth-card fade" id="verifyForm">${brandBlock()}
      <div><h1>Vérifiez votre email</h1><p class="muted" style="margin-top:6px">Un lien de confirmation a été envoyé à <b style="color:var(--ink)">${esc(S.user.email)}</b>. Ouvrez-le (pensez aux spams), puis revenez ici.</p></div>
      ${msgBlock()}<button class="btn primary lg" type="submit">J'ai confirmé mon email</button>
      <div class="row spread"><button class="linkbtn" type="button" id="resend">Renvoyer l'email</button><button class="linkbtn" type="button" id="out">Changer de compte</button></div></form></div></div>`;
    $('#verifyForm').onsubmit=async e=>{e.preventDefault();const u=await S.api.reload();if(u&&u.verified){location.replace(safeNext(qp('next')))}
      else{S.authMsg={k:'err',t:'Email pas encore confirmé. Cliquez sur le lien reçu puis réessayez.'};renderAuth()}};
    $('#resend').onclick=async()=>{try{await S.api.resend();S.authMsg={k:'ok',t:'Email renvoyé.'}}catch(e){S.authMsg={k:'err',t:fr(e).message}}renderAuth()};
    $('#out').onclick=()=>S.api.signOut();return;
  }
  root.innerHTML=`<div class="auth">${authArt()}<div class="auth-main"><div class="card auth-card fade">${brandBlock()}
    <div><h1>${v==='signup'?'Créer un compte':v==='reset'?'Mot de passe oublié':'Se connecter'}</h1>
    <p class="muted small" style="margin-top:5px">Accès réservé aux étudiants Guardia : adresse <b>@${esc(DOMAIN)}</b> obligatoire.</p></div>
    ${v!=='reset'?`<div class="seg" role="tablist"><button type="button" role="tab" aria-selected="${v==='login'}" data-v="login">Connexion</button><button type="button" role="tab" aria-selected="${v==='signup'}" data-v="signup">Créer un compte</button></div>`:''}
    ${msgBlock()}
    <form id="authForm" class="grid" novalidate style="gap:13px">
      ${v==='signup'?`<div class="field"><label for="pseudo">Prénom affiché</label><input class="input" id="pseudo" autocomplete="given-name" required maxlength="24" placeholder="Prénom"></div>`:''}
      <div class="field"><label for="email">Email école</label><input class="input" id="email" type="email" autocomplete="email" required placeholder="prenom.nom@${esc(DOMAIN)}"></div>
      ${v!=='reset'?`<div class="field"><label for="pw">Mot de passe</label><div class="pw"><input class="input" id="pw" type="password" autocomplete="${v==='signup'?'new-password':'current-password'}" required minlength="8"><button type="button" id="pwT" aria-label="Afficher le mot de passe" aria-pressed="false">${ic('eye')}</button></div>${v==='signup'?'<span class="hint2">8 caractères minimum.</span>':''}</div>`:''}
      <button class="btn primary lg" type="submit" id="go">${v==='signup'?'Créer mon compte':v==='reset'?'Envoyer le lien':'Se connecter'}</button>
    </form>
    ${v!=='reset'&&S.api.google?`<div class="or">ou</div><button class="btn lg" type="button" id="gBtn">${GLOGO}Continuer avec Google (compte école)</button>`:''}
    <div class="row spread">${v==='login'?'<button class="linkbtn" type="button" data-v="reset">Mot de passe oublié ?</button>':'<button class="linkbtn" type="button" data-v="login">Retour à la connexion</button>'}
      <button class="btn ghost icon" type="button" id="themeA" aria-label="Changer de thème" title="Changer de thème">${ic(isDark()?'sun':'moon')}</button></div>
    ${demo?`<div class="msg" style="background:var(--xp-soft);color:var(--xp-ink);font-size:12.5px"><b>Mode local</b> : comptes, profils et défis gardés dans ce navigateur.</div>`:''}
  </div></div></div>`;
  $$('[data-v]').forEach(b=>b.onclick=()=>{S.authView=b.dataset.v;S.authMsg=null;renderAuth()});
  $('#themeA').onclick=()=>{toggleTheme();renderAuth()};
  const pt=$('#pwT');if(pt)pt.onclick=()=>{const i=$('#pw'),show=i.type==='password';i.type=show?'text':'password';pt.setAttribute('aria-pressed',String(show));pt.setAttribute('aria-label',show?'Masquer le mot de passe':'Afficher le mot de passe');pt.innerHTML=ic(show?'eyeOff':'eye');i.focus()};
  const g=$('#gBtn');if(g)g.onclick=async()=>{g.disabled=true;S.authMsg=null;try{await S.api.google()}catch(err){if(err.code!=='auth/popup-closed-by-user'&&err.code!=='auth/cancelled-popup-request')showMsg('err',fr(err).message);g.disabled=false}};
  const em=$('#email');em.addEventListener('blur',()=>{if(em.value&&!emailOk(em.value))showMsg('err','Seules les adresses @'+DOMAIN+' sont acceptées.')});
  $('#authForm').onsubmit=async e=>{e.preventDefault();const go=$('#go'),lbl=go.textContent;go.disabled=true;go.textContent=v==='signup'?'Création du compte…':v==='reset'?'Envoi…':'Connexion…';
    try{
      if(v==='signup'){const c=checkSignup(em.value,$('#pw').value,$('#pseudo').value);if(await isBlocked(c.email))throw new Error(BLOCKED_MSG);S.authMsg=null;await S.api.signUp(c.email,$('#pw').value,c.pseudo)}
      else if(v==='reset'){if(!emailOk(em.value))throw new Error('Indiquez votre adresse @'+DOMAIN+'.');await S.api.reset(em.value.trim().toLowerCase());S.authView='login';S.authMsg={k:'ok',t:'Si ce compte existe, un lien de réinitialisation vient d\'être envoyé.'};renderAuth()}
      else{if(!emailOk(em.value))throw new Error('Seules les adresses @'+DOMAIN+' sont acceptées.');if(await isBlocked(em.value))throw new Error(BLOCKED_MSG);S.authMsg=null;await S.api.signIn(em.value.trim().toLowerCase(),$('#pw').value)}
    }catch(err){showMsg('err',(err.code?fr(err):err).message);go.disabled=false;go.textContent=lbl}};
}

/* ================= Mise en page ================= */
function isDark(){const t=document.documentElement.dataset.theme;return t?t==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function toggleTheme(){const d=document.documentElement;d.dataset.theme=isDark()?'light':'dark';try{localStorage.setItem('gr-theme',d.dataset.theme)}catch(e){}}
/* Le site est découpé en pages HTML : chaque page déclare son identifiant dans <body data-page="…">. */
const PAGE=(document.body&&document.body.dataset.page)||'accueil';
const QS=new URLSearchParams(location.search);
const qp=k=>QS.get(k)||'';
const TABFILE={cours:'cours',qcm:'qcm',cartes:'cartes',exos:'exercices'};
const U={home:'index.html',subjects:'matieres.html',rev:'revisions.html',lb:'classement.html',profile:'profil.html',partiel:'partiel.html',login:'connexion.html',
  sub:(id,tab)=>(TABFILE[tab]||'cours')+'.html?m='+encodeURIComponent(id),
  duels:adv=>'defis.html'+(adv?'?adv='+encodeURIComponent(adv):''),
  player:id=>'joueur.html?id='+encodeURIComponent(id)};
const SUBJECT_PAGES=['cours','qcm','cartes','exercices'];
function here(){const f=location.pathname.split('/').pop()||'index.html';const q=new URLSearchParams(location.search);q.delete('local');const qs=q.toString();return f+(qs?'?'+qs:'')+location.hash}
function safeNext(n){return /^[a-z]+\.html([?#][^\s]*)?$/i.test(n||'')&&!/^connexion\.html/i.test(n)?n:'index.html'}
function crumbs(items){return `<nav class="crumbs" aria-label="Fil d'Ariane">${items.map((it,i)=>i<items.length-1?`<a href="${it[1]}">${esc(it[0])}</a><span aria-hidden="true">/</span>`:`<span aria-current="page">${esc(it[0])}</span>`).join('')}</nav>`}
function route(){return {page:PAGE}}
function layout(inner,r){
  const due=totalDue(),wrong=totalWrong(),inc=incoming().length,me=myProfile(),L=levelOf(me.xp);
  const pages=[['accueil','index.html','home','Tableau de bord'],['revisions','revisions.html','clock','Révisions du jour',due+wrong],['matieres','matieres.html','bookOpen','Matières'],['partiel','partiel.html','grad','Partiel blanc'],['entrainements','entrainements.html','zap','Entraînements'],['lexique','lexique.html','book','Lexique']];
  const social=[['defis','defis.html','swords','Défis',inc],['classement','classement.html','trophy','Classement']];
  const link=([p,h,i,l,c])=>`<a href="${h}" ${PAGE===p?'aria-current="page"':''}>${ic(i)}<span>${l}</span>${c?`<span class="count" aria-label="${c} en attente">${c}</span>`:''}</a>`;
  const nav=pages.map(link).join('')+'</nav><div class="nav-h">Communauté</div><nav class="nav">'+social.map(link).join('');
  const subs=SUBJECTS.map(s=>`<a href="${U.sub(s.id)}" ${SUBJECT_PAGES.includes(PAGE)&&qp('m')===s.id?'aria-current="page"':''}><span class="dot" style="background:${s.col}"></span><span>${esc(s.name)}</span><span class="pct">${stats(s).pct}%</span></a>`).join('');
  const bn=[['accueil','index.html','home','Accueil'],['revisions','revisions.html','clock','Réviser',due+wrong],['defis','defis.html','swords','Défis',inc],['classement','classement.html','trophy','Classement']];
  return `<a class="skip" href="#main" id="skip">Aller au contenu</a><div class="app ${S.menu?'open':''}" id="app">
    <header class="mtop"><button class="btn ghost icon" id="menuBtn" aria-label="Menu">${ic('menu')}</button><a class="brand" href="index.html"><span class="brand-mark">${LOGO}</span><b>Guardia_Rev</b></a><button class="btn ghost icon" data-search aria-label="Rechercher">${ic('search')}</button><a href="profil.html" aria-label="Mon profil">${avatar(me,32)}</a></header>
    <aside class="side" aria-label="Navigation">
      <a class="brand" href="index.html"><span class="brand-mark">${LOGO}</span><span><b>Guardia_Rev</b><small>Révisions · GCS1</small></span></a>
      <a class="me" href="profil.html" ${PAGE==='profil'?'aria-current="page"':''}><div class="row">${ringAv(me,40)}<div style="min-width:0"><b>${esc(me.pseudo)}</b><span class="t">Niv. ${L.n} · ${esc(L.title)}</span></div></div>
        <div class="xpbar" role="progressbar" aria-label="Progression du niveau" aria-valuenow="${L.pct}" aria-valuemin="0" aria-valuemax="100"><i style="width:${L.pct}%"></i></div><div class="xpl"><span>${fmt(me.xp)} XP</span><span>${fmt(L.left)} avant niv. ${L.n+1}</span></div></a>
      <button class="searchbtn" data-search>${ic('search','sm')}<span>Rechercher…</span><kbd>Ctrl K</kbd></button>
      <nav class="nav">${nav}</nav>
      <div class="nav-h">Matières</div><nav class="nav">${subs}</nav>
      <div class="side-foot"><span>v${VERSION} · ${S.api.mode==='local'?'mode local':'synchronisé'}</span><button class="btn ghost icon" id="themeB" aria-label="Changer de thème" title="Changer de thème">${ic(isDark()?'sun':'moon')}</button></div>
    </aside>
    ${S.menu?'<div class="scrim" id="scrim"></div>':''}
    <nav class="bnav" aria-label="Navigation principale">${bn.map(([p,h,i,l,c])=>`<a href="${h}" ${PAGE===p?'aria-current="page"':''}>${ic(i)}<span>${l}</span>${c?`<span class="count">${c}</span>`:''}</a>`).join('')}<button type="button" id="bMenu" aria-label="Ouvrir le menu">${ic('menu')}<span>Menu</span></button></nav>
    <main class="main ${S.fadeOn?'fade':''}" id="main" tabindex="-1">${inner}<footer class="credit">Guardia_Rev v${VERSION} · Réalisé par <b>Titan_gp1</b></footer></main>
  </div>`;
}
const AFTER=[];
function render(){
  if(!S.ready)return;
  if(!S.user||!S.user.verified){renderAuth();return}
  if(PAGE==='connexion'){renderAuth();return}
  S.onKey=null;const r=route();let html;S.fadeOn=!S.rendered;
  try{
    if(SUBJECT_PAGES.includes(PAGE)){const s=subj(qp('m'));html=s?pageSubject(s,PAGE==='exercices'?'exos':PAGE):notFound('Cette matière n\'existe pas.')}
    else if(PAGE==='matieres')html=pageSubjects();
    else if(PAGE==='revisions')html=pageRevisions();
    else if(PAGE==='defis')html=pageDuels(qp('adv'));
    else if(PAGE==='classement')html=pageLeaderboard();
    else if(PAGE==='joueur')html=pagePlayer(qp('id'));
    else if(PAGE==='profil')html=pageProfile();
    else if(PAGE==='partiel')html=pagePartiel();
    else if(PAGE==='entrainements')html=pageDrills(qp('t'));
    else if(PAGE==='lexique')html=pageLexique(qp('m'),qp('q'));
    else html=pageHome();
  }catch(e){console.error(e);html=notFound()}
  root.innerHTML=layout(html,r);
  $('#themeB').onclick=()=>{toggleTheme();render()};
  $('#menuBtn').onclick=$('#bMenu').onclick=()=>{S.menu=!S.menu;render();if(S.menu){const a=$('.side .nav a');if(a)a.focus()}};
  $('#skip').onclick=e=>{e.preventDefault();$('#main').focus()};
  S.rendered=true;
  const sc=$('#scrim');if(sc)sc.onclick=()=>{S.menu=false;render()};
  $$('[data-search]').forEach(b=>b.onclick=openPalette);
  AFTER.splice(0).forEach(f=>{try{f()}catch(e){console.error(e)}});
}
function notFound(msg){return `<section class="card pad"><h1>Page introuvable</h1><p style="margin-top:8px">${esc(msg||'Cette page n\'existe pas ou plus.')} <a href="index.html">Retour au tableau de bord</a></p></section>`}
function onKey(e){
  const pal=$('#palette');
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();if(S.user&&S.user.verified)pal?closePalette():openPalette();return}
  if(pal){paletteKey(e);return}
  const t=e.target;if(t&&(t.tagName==='INPUT'||t.tagName==='TEXTAREA'||t.tagName==='SELECT'||t.isContentEditable))return;
  if(e.key==='/'&&S.user&&S.user.verified){e.preventDefault();openPalette();return}
  if(e.key==='Escape'&&S.menu){S.menu=false;render();return}
  if(S.onKey&&!e.ctrlKey&&!e.metaKey&&!e.altKey)S.onKey(e);
}

/* ================= Tableau de bord ================= */
function pageHome(){
  loadSocial();
  const me=myProfile(),L=levelOf(me.xp),all=SUBJECTS.map(stats),avg=all.length?Math.round(all.reduce((a,b)=>a+b.pct,0)/all.length):0;
  const due=totalDue(),wrong=totalWrong(),st=streak(),act=glob('_act',{});
  const exam=glob('_settings',{}).examDate,left=exam?daysBetween(dayKey(),exam):null;
  const so=S.soc,inc=incoming();
  const days=[...Array(14)].map((_,i)=>addDays(dayKey(),i-13)),max=Math.max(5,...days.map(d=>act[d]||0));
  const week=[...Array(7)].map((_,i)=>addDays(dayKey(),i-6));
  const weak=SUBJECTS.map((s,i)=>({s,st:all[i]})).sort((a,b)=>a.st.pct-b.st.pct);
  const next=weak.find(w=>w.st.rd<w.st.nf)||weak[0];
  const todo=[];
  if(due)todo.push(['revisions.html','layers','#2563eb',`${plural(due,'carte')} à revoir`,'Répétition espacée · +3 XP par carte']);
  if(wrong)todo.push(['revisions.html','rotate','#dc2626',`${plural(wrong,'question ratée','questions ratées')} à refaire`,'Les QCM se souviennent de vos erreurs']);
  if(inc.length)todo.push(['defis.html','swords','#7c3aed',`${plural(inc.length,'défi')} à relever`,'Un camarade vous attend']);
  if(next){const i=Math.max(0,next.s.fiche.findIndex((_,k)=>!sp(next.s.id).read.includes(k)));
    todo.push([`${U.sub(next.s.id)}#s${i}`,'bookOpen',next.s.col,`Lire : ${next.s.fiche[i]?.t||'la fiche'}`,`${next.s.name} · +15 XP`])}
  todo.push(['entrainements.html?t=sousreseaux','network','#0d9488','Entraînement sous-réseaux','Masque, réseau, broadcast · +5 XP par réponse']);
  const top5=freshTop().filter(p=>!p.hidden||p.id===me.id).slice(0,5);
  const wd=['D','L','M','M','J','V','S'];
  return `
  <section class="bento">
    <div class="card hero b3">
      <div class="row" style="gap:18px;flex-wrap:nowrap;align-items:center">${ringAv(me,76)}
        <div style="min-width:0"><div class="row" style="margin-bottom:6px"><span class="chip">${ic('award','sm')} Niveau ${L.n} · ${esc(L.title)}</span>${so.count!=null?`<span class="chip">${ic('users','sm')} ${plural(so.count,'étudiant inscrit','étudiants inscrits')}</span>`:''}</div>
        <h1>Bonjour ${esc(me.pseudo)}</h1>
        <p style="margin-top:4px">${left!=null&&left>=0?`Plus que <b>${plural(left,'jour')}</b> avant les partiels.`:'Chaque bonne réponse, carte et section lue rapporte des XP.'}</p></div></div>
      <div><div class="row spread small" style="margin-bottom:7px;font-weight:600"><span>${fmt(me.xp)} XP</span><span>${fmt(L.left)} XP avant le niveau ${L.n+1}</span></div><div class="xpbar"><i style="width:${L.pct}%"></i></div></div>
      <div class="row"><a class="btn white lg" href="revisions.html">${ic('clock','sm')}Réviser maintenant</a><a class="btn glass lg" href="defis.html">${ic('swords','sm')}Lancer un défi</a>${exam?'':`<a class="btn glass lg" href="profil.html">${ic('calendar','sm')}Date des partiels</a>`}</div>
    </div>
    <div class="card tile"><div class="t-h">${tic('flame','#f59e0b')}Série</div><div class="big">${st}<small>${st>1?'jours':'jour'}</small></div>
      <p class="small muted">${st?'Revenez demain pour la prolonger (+10 XP par jour de série).':'Révisez aujourd\'hui pour lancer votre série.'}</p>
      <div class="days">${week.map(d=>`<div><i class="${act[d]?'on':''} ${d===dayKey()?'today':''}">${act[d]?ic('check','sm'):''}</i>${wd[new Date(d+'T12:00').getDay()]}</div>`).join('')}</div></div>
    <div class="card b2"><div class="pad-sm row spread" style="border-bottom:1px solid var(--border)"><h3>À faire maintenant</h3><span class="badge xp">${ic('star','sm')} XP à gagner</span></div>
      <div style="padding:6px">${todo.slice(0,5).map(([h,i,c,t,s])=>`<a class="todo" href="${h}">${tic(i,c).replace('t-ic','t-ic')}<span class="t-txt"><b>${esc(t)}</b><span>${esc(s)}</span></span><span class="go">${ic('chevron','sm')}</span></a>`).join('')}</div></div>
    <div class="card tile"><div class="t-h">${tic('trophy','#f59e0b')}Classement</div>
      <div class="big">${so.rank?'#'+so.rank:'—'}<small>${so.count?'sur '+so.count:''}</small></div>
      <div class="mini-lb">${top5.length?top5.map((p,i)=>`<a href="${U.player(p.id)}" class="${p.id===me.id?'me-row':''}"><span class="rk">${i+1}</span>${avatar(p,26)}<span class="nm">${esc(p.pseudo)}</span><span class="xpv">${fmt(p.xp)}</span></a>`).join(''):`<p class="small muted">${so.loading||so.top==null?'Chargement…':'Personne pour l\'instant.'}</p>`}</div>
      <a class="btn sm" href="classement.html" style="margin-top:auto">Voir tout</a></div>
    <div class="card tile"><div class="t-h">${tic('swords','#7c3aed')}Défis</div>
      <div class="big">${inc.length}<small>à relever</small></div>
      <p class="small muted">Même série de questions pour les deux : le meilleur score gagne (+70 XP).</p>
      <a class="btn ${inc.length?'primary':''} sm" href="defis.html" style="margin-top:auto">${inc.length?'Relever':'Défier quelqu\'un'}</a></div>
    <div class="card tile b2"><div class="row spread"><div class="t-h">${tic('activity','#2563eb')}Activité sur 14 jours</div><span class="badge">${days.reduce((n,d)=>n+(act[d]||0),0)} actions</span></div>
      <div class="chart" aria-label="Activité des 14 derniers jours">${days.map(d=>`<i class="${act[d]?'':'z'}" style="height:${Math.max(5,Math.round(100*(act[d]||0)/max))}%" title="${d} : ${act[d]||0}"></i>`).join('')}</div></div>
    <div class="card tile"><div class="t-h">${tic('layers','#0d9488')}À revoir</div><div class="big">${due+wrong}</div><p class="small muted">${plural(due,'carte')} · ${plural(wrong,'erreur')}</p><a class="btn sm" href="revisions.html" style="margin-top:auto">Réviser</a></div>
    <div class="card tile"><div class="t-h">${tic('target','#16a34a')}Maîtrise globale</div><div class="row" style="gap:14px"><span class="pring" style="--p:${avg};--c:#16a34a"><span>${avg}%</span></span><p class="small muted">Moyenne des cours lus, QCM, cartes et exercices.</p></div></div>
  </section>
  <section><div class="section-h"><h2>Matières</h2><span class="muted small">${SUBJECTS.length} matières · ${SUBJECTS.reduce((n,s)=>n+s.quiz.length,0)} questions</span></div>
  <div class="grid g3" style="margin-top:12px">${SUBJECTS.map(subjCard).join('')}</div></section>`;
}
function subjCard(s){const st=stats(s);return `<a class="card subj" href="${U.sub(s.id)}" style="--c:${s.col}">
  <div class="row spread">${subjIco(s)}<span class="pring" style="--p:${st.pct};--c:${s.col}"><span>${st.pct}%</span></span></div>
  <div><h3>${esc(s.name)}</h3><p style="margin-top:5px">${esc(s.short)}</p></div>
  <div class="meta"><span><b>${st.rd}/${st.nf}</b> cours</span><span><b>${st.runs?st.best+'%':'—'}</b> QCM</span><span><b>${st.mast}/${st.nc}</b> cartes</span></div></a>`}

function pageSubjects(){
  const all=SUBJECTS.map(stats),tq=SUBJECTS.reduce((n,s)=>n+s.quiz.length,0),tc=SUBJECTS.reduce((n,s)=>n+s.cards.length,0),tf=SUBJECTS.reduce((n,s)=>n+s.fiche.length,0);
  return crumbs([['Accueil','index.html'],['Matières','']])+`<section class="head"><div><h1>Matières</h1><p class="lede">${SUBJECTS.length} matières, ${tf} sections de cours, ${tq} questions de QCM et ${tc} cartes. Chaque matière a son cours, son QCM, ses cartes et ses exercices type partiel.</p></div></section>
  <section class="grid g3">${SUBJECTS.map(subjCard).join('')}</section>
  <section class="card"><div class="pad-sm"><h2>Où en êtes-vous ?</h2></div><div class="tbl" style="border:0;margin:0;border-radius:0"><table><tr><th>Matière</th><th>Cours lus</th><th>Meilleur QCM</th><th>Cartes maîtrisées</th><th>Exercices</th><th>Maîtrise</th></tr>
  ${SUBJECTS.map((s,i)=>{const t=all[i];return `<tr><td><a href="${U.sub(s.id)}">${esc(s.name)}</a></td><td>${t.rd}/${t.nf}</td><td>${t.runs?t.best+' %':'—'}</td><td>${t.mast}/${t.nc}</td><td>${t.ex}/${t.ne}</td><td><b>${t.pct} %</b></td></tr>`}).join('')}</table></div></section>`;
}

/* ================= Matière ================= */
function pageSubject(s,tab){
  const st=stats(s);
  const tabs=[['cours','bookOpen','Cours',s.fiche.length],['qcm','circleCheck','QCM',s.quiz.length],['cartes','layers','Cartes',s.cards.length],['exos','pencil','Exercices',s.exos.length]];
  let body;if(tab==='qcm')body=quizView(s);else if(tab==='cartes')body=cardsView(s);else if(tab==='exos')body=exosView(s);else body=ficheView(s);
  const tabName={cours:'Cours',qcm:'QCM',cartes:'Cartes',exos:'Exercices'}[tab];
  AFTER.push(()=>{const p=$('#print');if(p)p.onclick=()=>window.print()});
  return crumbs([['Accueil','index.html'],['Matières','matieres.html'],[s.name,U.sub(s.id)],[tabName,'']])+`<section class="card pad grid subj-head" style="gap:16px;--c:${s.col}">
    <div class="head"><div class="row" style="gap:16px;flex-wrap:nowrap">${subjIco(s,52)}<div><p class="eyebrow" style="margin:0 0 4px">${esc(s.exam||'Matière')}</p><h1>${esc(s.name)}</h1></div></div>
      <div class="row"><span class="pring" style="--p:${st.pct};--c:${s.col}"><span>${st.pct}%</span></span>${tab==='cours'?`<button class="btn sm no-print" id="print">${ic('printer','sm')}Imprimer</button>`:''}</div></div>
    ${s.intro?`<p class="muted" style="max-width:80ch">${s.intro}</p>`:''}
    <nav class="tabs">${tabs.map(([k,i,l,n])=>`<a href="${U.sub(s.id,k)}" ${tab===k?'aria-current="page"':''}>${ic(i,'sm')}${l}<span class="badge">${n}</span></a>`).join('')}</nav>
  </section>${body}`;
}
function ficheView(s){
  const p=sp(s.id);
  AFTER.push(()=>{

    $$('[data-read]').forEach(b=>b.onclick=()=>{const i=+b.dataset.read,set=new Set(p.read);if(set.has(i))set.delete(i);else{set.add(i);bump();giveOnce(s.id,'r'+i,15,'Section lue')}p.read=[...set];saveSoon();
      const y=window.scrollY;render();window.scrollTo(0,y)});
    if(/^#s\d+$/.test(location.hash)&&!S.scrolled){S.scrolled=true;const t=$(location.hash);if(t)setTimeout(()=>t.scrollIntoView({block:'start'}),30)}
  });
  return `<div class="fiche">
    <nav class="card toc no-print" aria-label="Sommaire"><div class="small muted" style="padding:4px 9px 8px;font-weight:600">${p.read.length}/${s.fiche.length} sections lues</div>
      ${s.fiche.map((f,i)=>`<a href="#s${i}" class="${p.read.includes(i)?'read':''}"><span class="tick">${p.read.includes(i)?ic('check','sm'):''}</span>${esc(f.t)}</a>`).join('')}</nav>
    <div>${s.fiche.map((f,i)=>`<article class="card pad sec" id="s${i}"><h2><span class="num" aria-hidden="true">${pad2(i+1)}</span>${esc(f.t)}</h2>${f.h}
      <div class="sec-foot"><button class="btn sm ${p.read.includes(i)?'':'primary'}" data-read="${i}">${p.read.includes(i)?ic('check','sm')+'Lu':'Marquer comme lu · +15 XP'}</button></div></article>`).join('')}
    <div class="card pad row spread no-print" style="margin-top:16px"><span>Fiche lue ? Passez à la pratique.</span><span class="row"><a class="btn" href="${U.sub(s.id,'cartes')}">${ic('layers','sm')}Cartes</a><a class="btn primary" href="${U.sub(s.id,'qcm')}">${ic('circleCheck','sm')}Faire le QCM</a></span></div></div>
  </div>`;
}

/* ================= QCM (et moteur des défis) ================= */
let QZ=null;
function startQuiz(list,o){QZ={page:PAGE,list:list.map(q=>({...q,order:shuffle(q.o.map((_,i)=>i))})),i:0,answers:[],picked:new Set(),done:false,ctx:o.ctx,title:o.title||'QCM',timer:o.timer||0,t0:Date.now(),retry:!!o.retry,duel:o.duel||null,xp0:xpTotal()}}
const blind=z=>z.ctx==='partiel'||z.ctx==='duel';
function quizView(s){
  const ctx='subject:'+s.id;if(QZ&&QZ.ctx===ctx)return quizBody();
  const st=stats(s),wrong=sp(s.id).wrong.map(id=>QINDEX.get(id)).filter(Boolean);
  AFTER.push(()=>{$$('[data-n]').forEach(b=>b.onclick=()=>{startQuiz(shuffle(s.quiz).slice(0,+b.dataset.n),{ctx,title:'QCM · '+s.name});render()});
    const w=$('#qWrongS');if(w)w.onclick=()=>{startQuiz(shuffle(wrong),{ctx,title:'Mes erreurs · '+s.name,retry:true});render()}});
  return `<section class="card pad grid">
    <div class="head"><div><h2>QCM · ${esc(s.name)}</h2><p class="muted" style="margin-top:5px">${s.quiz.length} questions, ordre aléatoire. Certaines ont <b>plusieurs bonnes réponses</b>, comme au partiel. +10 XP par bonne réponse.</p></div>
      ${st.runs?`<span class="badge ${st.best>=80?'ok':'gold'}">Meilleur score ${st.best} %</span>`:''}</div>
    <div class="row">${[10,20].filter(n=>n<s.quiz.length).map(n=>`<button class="btn" data-n="${n}">${n} questions</button>`).join('')}<button class="btn primary" data-n="${s.quiz.length}">Toutes (${s.quiz.length})</button>
      ${wrong.length?`<button class="btn xp" id="qWrongS">${ic('rotate','sm')}Mes erreurs (${wrong.length})</button>`:''}</div>
  </section>`;
}
function quizBody(){
  const z=QZ;if(z.done)return quizResult();
  const q=z.list[z.i],multi=q.a.length>1,ans=z.answers[z.i];
  AFTER.push(bindQuiz);
  return `<section class="card pad q">
    <div class="row spread"><span class="row"><span class="badge blue">Question ${z.i+1} / ${z.list.length}</span>${q.src?`<span class="badge gold">${esc(q.src)}</span>`:''}${z.ctx!=='subject:'+q.sid?`<span class="badge">${esc(subj(q.sid).name)}</span>`:''}${z.timer?'<span class="badge timer" id="qTimer"></span>':''}</span>
      <button class="btn ghost sm" id="qQuit">${ic('x','sm')}Quitter</button></div>
    <div class="progress"><i style="width:${100*z.i/z.list.length}%"></i></div>
    <div class="q-text">${esc(q.q)}</div>
    ${q.code?`<pre><code>${esc(q.code)}</code></pre>`:''}
    ${multi?`<div class="hint">Plusieurs réponses possibles : cochez toutes les bonnes puis validez.</div>`:''}
    <div class="opts">${q.order.map((oi,k)=>{const cls=ans?(q.a.includes(oi)?'good':(ans.picked.includes(oi)?'wrong':'')):(z.picked.has(oi)?'sel':'');
      return `<button class="opt ${cls}" data-o="${oi}" ${ans?'disabled':''}><span class="l">${'ABCDEF'[k]}</span><span>${esc(q.o[oi])}</span>${ans&&q.a.includes(oi)?ic('check','mark')+'<span class="sr">(bonne réponse)</span>':ans&&ans.picked.includes(oi)?ic('x','mark')+'<span class="sr">(votre réponse, fausse)</span>':''}</button>`}).join('')}</div>
    ${ans?`<div class="expl ${ans.ok?'ok':'bad'}"><b>${ans.ok?'Bonne réponse · +10 XP.':'Pas tout à fait.'}</b> ${esc(q.e||'')}</div>
      <div class="row" style="justify-content:flex-end"><span class="muted small">Entrée ↵</span><button class="btn primary" id="qNext">${z.i+1<z.list.length?'Question suivante':'Voir le résultat'}${ic('arrow','sm')}</button></div>`
      :(multi?`<div class="row" style="justify-content:flex-end"><button class="btn primary" id="qValid" ${z.picked.size?'':'disabled'}>Valider</button></div>`:'')}
  </section>`;
}
function bindQuiz(){
  const z=QZ;if(!z||z.done)return;const q=z.list[z.i];
  $('#qQuit').onclick=()=>{if(z.answers.length&&!confirm(z.ctx==='duel'?'Abandonner ce défi ? Il ne sera pas envoyé.':'Quitter ce QCM ? Les réponses données sont perdues.'))return;QZ=null;clearInterval(TT);render()};
  $$('.opt').forEach(b=>b.onclick=()=>choose(+b.dataset.o));
  const v=$('#qValid');if(v)v.onclick=answer;
  const n=$('#qNext');if(n)n.onclick=nextQ;
  S.onKey=e=>{const k=e.key.toLowerCase();const idx='abcdef'.indexOf(k)>=0?'abcdef'.indexOf(k):'123456'.indexOf(k);
    if(idx>=0&&idx<q.order.length&&!z.answers[z.i]){e.preventDefault();choose(q.order[idx])}
    else if(e.key==='Enter'){e.preventDefault();if(z.answers[z.i])nextQ();else if(z.picked.size&&q.a.length>1)answer()}};
  if(z.timer)tickTimer();
}
function choose(oi){const z=QZ,q=z.list[z.i];if(z.answers[z.i])return;if(q.a.length>1){z.picked.has(oi)?z.picked.delete(oi):z.picked.add(oi);render()}else{z.picked=new Set([oi]);answer()}}
function answer(){const z=QZ,q=z.list[z.i],picked=[...z.picked];const ok=picked.length===q.a.length&&picked.every(p=>q.a.includes(p));z.answers[z.i]={picked,ok};bump();if(ok)addXp(10,'',true);
  if(blind(z)){nextQ();return}render()}
function nextQ(){const z=QZ;z.i++;z.picked=new Set();if(z.i>=z.list.length)finishQuiz();render();window.scrollTo(0,0)}
let TT=null;
function tickTimer(){clearInterval(TT);if(!QZ||!QZ.timer)return;const upd=()=>{if(!QZ||QZ.done){clearInterval(TT);return}
  const left=Math.max(0,QZ.timer*60-Math.floor((Date.now()-QZ.t0)/1000));const e=$('#qTimer');if(e)e.innerHTML=`${ic('clock','sm')} ${Math.floor(left/60)}:${pad2(left%60)}`;
  if(left<=0){clearInterval(TT);finishQuiz();render();toast('Temps écoulé !')}};upd();TT=setInterval(upd,1000)}
function finishQuiz(){const z=QZ;if(z.done)return;z.done=true;clearInterval(TT);
  const good=z.answers.filter(a=>a&&a.ok).length,pct=Math.round(100*good/z.list.length);z.score={good,pct};z.time=Math.max(1,Math.round((Date.now()-z.t0)/1000));
  z.list.forEach((q,i)=>{const p=sp(q.sid),w=new Set(p.wrong);(z.answers[i]&&z.answers[i].ok)?w.delete(q.id):w.add(q.id);p.wrong=[...w]});
  if(z.ctx.startsWith('subject:')&&!z.retry){const p=sp(z.ctx.slice(8));p.quizRuns=(p.quizRuns||0)+1;if(z.list.length>=5)p.quizBest=Math.max(p.quizBest||0,pct)}
  if(z.list.length>=5)addXp(20,'QCM terminé',true);
  if(pct===100&&z.list.length>=10){prog()._perfect=true;addXp(50,'Sans faute !')}
  if(z.ctx==='partiel'){const h=glob('_partiels',[]);h.unshift({at:Date.now(),pct,n:z.list.length});h.splice(12);addXp(30,'Partiel blanc terminé',true)}
  if(z.ctx==='duel')finishDuel(z);
  saveSoon()}
function finishDuel(z){const d=z.duel,uid=S.user.id,me=myProfile();addXp(30,'',true);
  if(d.mode==='new'){z.duelRes={state:'sending',opp:d.toName};
    S.api.createChallenge({from:uid,fromName:me.pseudo,to:d.to,toName:d.toName,sid:d.sid,qids:z.list.map(q=>q.id),fromScore:z.score.good,fromTime:z.time})
      .then(()=>{z.duelRes.state='sent';toast('Défi envoyé à '+d.toName);loadSocial(true);if(QZ===z)render()})
      .catch(e=>{z.duelRes.state='error';z.duelRes.err=fr(e).message;if(QZ===z)render()})}
  else{const c=d.c,fake={...c,toScore:z.score.good,toTime:z.time},r=duelOutcome(fake,false);z.duelRes={state:r,opp:c.fromName,oppScore:c.fromScore,oppTime:c.fromTime};
    glob('_duelsSeen',[]).push(c.id);if(r==='win'){prog()._duelWins=(prog()._duelWins||0)+1;addXp(70,'Défi gagné')}
    S.api.answerChallenge(c.id,{toScore:z.score.good,toTime:z.time}).then(()=>loadSocial(true)).catch(e=>toast('Résultat non enregistré : '+fr(e).message))}}
function quizResult(){
  const z=QZ,{good,pct}=z.score,mention=pct>=90?'Excellent':pct>=75?'Très bien':pct>=50?'Encore un effort':'À retravailler';
  const wrongQs=z.list.filter((q,i)=>!(z.answers[i]&&z.answers[i].ok)),gain=xpTotal()-z.xp0;
  const by={};z.list.forEach((q,i)=>{by[q.sid]=by[q.sid]||[0,0];by[q.sid][1]++;if(z.answers[i]&&z.answers[i].ok)by[q.sid][0]++});
  AFTER.push(()=>{$('#qAgain').onclick=()=>{QZ=null;render()};
    const w=$('#qWrong');if(w)w.onclick=()=>{startQuiz(shuffle(wrongQs),{ctx:z.ctx.startsWith('subject:')?z.ctx:'errors',title:'Mes erreurs',retry:true});render();scrollTo(0,0)}});
  const dr=z.duelRes;let duelBox='';
  if(dr){const m={sending:['Envoi du défi…',''],sent:[`Défi envoyé à ${esc(dr.opp)} : il verra votre résultat après avoir joué.`,'blue'],error:['Défi non envoyé : '+esc(dr.err||''),'bad'],
      win:[`Victoire contre ${esc(dr.opp)} (${dr.oppScore}/${z.list.length}) · +70 XP`,'ok'],lose:[`${esc(dr.opp)} gagne (${dr.oppScore}/${z.list.length}, ${dr.oppTime} s)`,'bad'],draw:[`Égalité parfaite avec ${esc(dr.opp)}`,'gold']}[dr.state];
    duelBox=`<span class="badge ${m[1]}" style="height:auto;padding:7px 14px;white-space:normal">${ic('swords','sm')} ${m[0]}</span>`}
  return `<section class="card pad result">
    <p class="eyebrow">${esc(z.title)}</p><div class="score" style="color:${pct>=75?'var(--ok)':pct>=50?'var(--xp-ink)':'var(--bad)'}">${pct} %</div><h2>${mention}</h2>
    <p class="muted">${good} bonne${good>1?'s':''} réponse${good>1?'s':''} sur ${z.list.length} · ${z.time} s</p>
    ${gain>0?`<span class="xp-gain">${ic('star','sm')} +${gain} XP</span>`:''}${duelBox}
    <div class="row" style="justify-content:center">${wrongQs.length?`<button class="btn xp" id="qWrong">${ic('rotate','sm')}Refaire mes ${wrongQs.length} erreurs</button>`:''}<button class="btn primary" id="qAgain">${z.ctx==='duel'?'Retour aux défis':'Nouveau QCM'}</button></div>
    ${Object.keys(by).length>1?`<div class="tbl" style="width:100%;text-align:left"><table><tr><th>Matière</th><th>Score</th></tr>${Object.entries(by).map(([sid,[g,t]])=>`<tr><td>${esc(subj(sid).name)}</td><td><b>${g}/${t}</b> <span class="muted">(${Math.round(100*g/t)} %)</span></td></tr>`).join('')}</table></div>`:''}
    <div class="review"><h3 style="margin-top:8px">Correction détaillée</h3>${z.list.map((q,i)=>{const a=z.answers[i];return `<div class="it">
      <div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="badge ${a&&a.ok?'ok':'bad'}">${a&&a.ok?'Juste':'Faux'}</span><b>${esc(q.q)}</b></div>
      <p class="small" style="margin-top:6px">Réponse : <b>${q.a.map(x=>esc(q.o[x])).join(' · ')}</b>${a&&!a.ok&&a.picked.length?` <span class="muted">(vous : ${a.picked.map(x=>esc(q.o[x])).join(' · ')})</span>`:''}</p>
      ${q.e?`<p class="small muted" style="margin-top:4px">${esc(q.e)}</p>`:''}</div>`}).join('')}</div>
  </section>`;
}

/* ================= Cartes (répétition espacée) ================= */
let FC=null;
function buildDeck(sids,cram){let due=[],fresh=[];
  sids.forEach(sid=>{const s=subj(sid);if(cram){s.cards.forEach((_,i)=>due.push({sid,i}));return}
    dueList(sid).forEach(i=>due.push({sid,i}));newList(sid).forEach(i=>fresh.push({sid,i}))});
  return shuffle(due).concat(shuffle(fresh).slice(0,cram?0:(sids.length>1?10:15)))}
function rate(ok){const it=FC.items[FC.i];const p=sp(it.sid),c=p.srs[it.i]||{b:0};
  if(ok){c.b=Math.min(5,c.b+1);c.due=addDays(dayKey(),INT[c.b])}else{c.b=1;c.due=dayKey();FC.items.push(it);FC.again++}
  p.srs[it.i]=c;FC.i++;FC.flip=false;FC.done++;prog()._cardReviews=(prog()._cardReviews||0)+1;bump();addXp(ok?3:1,'',true);render()}
function cardsBody(back){
  const it=FC.items[FC.i];
  if(!it)return `<section class="card pad result"><div class="score" style="color:var(--ok)">${ic('circleCheck','xl')}</div><h2>Session terminée</h2>
    <p class="muted">${plural(FC.done,'carte')} révisée${FC.done>1?'s':''}. Elles reviendront au bon moment : demain, dans 2 jours, 4 jours…</p>
    <div class="row" style="justify-content:center"><button class="btn" id="cCram">Tout revoir quand même</button><a class="btn primary" href="${back}">Terminer</a></div></section>`;
  const s=subj(it.sid),c=s.cards[it.i],st=cardState(it.sid,it.i);
  return `<section class="card pad grid">
    <div class="row spread"><span class="row"><span class="badge blue">${FC.i+1} / ${FC.items.length}</span>${st?`<span class="badge">Boîte ${st.b}</span>`:'<span class="badge gold">Nouvelle</span>'}${FC.multi?`<span class="badge">${esc(s.name)}</span>`:''}</span>
      <button class="btn ghost sm" id="cQuit">${ic('x','sm')}Quitter</button></div>
    <div class="card-wrap"><div class="flash ${FC.flip?'flip':''}" id="flash" tabindex="0" role="button" aria-label="Retourner la carte">
      <div class="face"><small>Question</small><div>${c[0]}</div></div>
      <div class="face back"><small>Réponse</small><div>${c[1]}</div></div></div></div>
    <p class="muted small" style="text-align:center">${FC.flip?'Vous saviez ? <kbd>1</kbd> à revoir · <kbd>2</kbd> je savais':'Cliquez ou <kbd>Espace</kbd> pour retourner la carte'}</p>
    <div class="row" style="justify-content:center"><button class="btn lg" id="cNo" ${FC.flip?'':'disabled'}>${ic('rotate','sm')}À revoir</button><button class="btn primary lg" id="cYes" ${FC.flip?'':'disabled'}>${ic('check','sm')}Je savais · +3 XP</button></div>
  </section>`;
}
function bindCards(){
  const f=$('#flash');if(f)f.onclick=()=>{FC.flip=!FC.flip;render()};
  const y=$('#cYes');if(y)y.onclick=()=>rate(true);const n=$('#cNo');if(n)n.onclick=()=>rate(false);
  const q=$('#cQuit');if(q)q.onclick=()=>{FC=null;render()};
  const cr=$('#cCram');if(cr)cr.onclick=()=>{FC={...FC,items:buildDeck(FC.sids,true),i:0,flip:false,done:0,again:0};render()};
  S.onKey=e=>{if(!FC||!FC.items[FC.i])return;if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!FC.flip){FC.flip=true;render()}else rate(true)}
    else if(FC.flip&&(e.key==='1'||e.key==='ArrowLeft'))rate(false);else if(FC.flip&&(e.key==='2'||e.key==='ArrowRight'))rate(true)};
}
function boxesHtml(sids){const b=[0,0,0,0,0,0];let fresh=0;sids.forEach(sid=>subj(sid).cards.forEach((_,i)=>{const c=cardState(sid,i);c?b[c.b]++:fresh++}));
  return `<div class="boxes"><div><b>${fresh}</b>nouvelles</div><div><b>${b[1]+b[0]}</b>boîte 1</div><div><b>${b[2]}</b>boîte 2</div><div><b>${b[3]+b[4]}</b>boîtes 3-4</div><div><b>${b[5]}</b>maîtrisées</div></div>`}
function cardsView(s){
  if(FC&&FC.key===s.id){AFTER.push(bindCards);return cardsBody(U.sub(s.id,'cartes'))}
  const due=dueList(s.id).length,nw=newList(s.id).length;
  AFTER.push(()=>{$('#cStart').onclick=()=>{FC={key:s.id,sids:[s.id],items:buildDeck([s.id],false),i:0,flip:false,done:0,again:0};if(!FC.items.length)FC.items=buildDeck([s.id],true);render()}});
  return `<section class="card pad grid">
    <div><h2>Cartes · ${esc(s.name)}</h2><p class="muted" style="margin-top:5px">Répétition espacée : une carte sue revient de plus en plus tard (1, 2, 4, 8, 16 jours) ; une carte ratée revient tout de suite.</p></div>
    ${boxesHtml([s.id])}
    <div class="row"><button class="btn primary lg" id="cStart">${ic('layers','sm')}${due||nw?`Commencer (${due} à revoir · ${Math.min(nw,15)} nouvelles)`:'Tout revoir'}</button><a class="btn lg" href="lexique.html?m=${s.id}">${ic('list','sm')}Voir la liste</a></div>
  </section>`;
}

/* ================= Exercices ================= */
function exosView(s){
  const p=sp(s.id);
  AFTER.push(()=>{$$('[data-exo]').forEach(b=>b.onclick=()=>{const i=+b.dataset.exo,set=new Set(p.exos);if(set.has(i))set.delete(i);else{set.add(i);bump();giveOnce(s.id,'e'+i,40,'Exercice maîtrisé')}p.exos=[...set];saveSoon();const y=scrollY;render();scrollTo(0,y)});
    $$('textarea[data-draft]').forEach(t=>{const k='gr-draft-'+S.user.id+'-'+t.dataset.draft;t.value=store.get(k,'');t.oninput=()=>store.set(k,t.value)})});
  return `<section class="card pad-sm tip" style="margin:0">${ic('pencil','sm')} Rédigez votre réponse (elle reste dans ce navigateur), <b>puis</b> ouvrez le corrigé. Un exercice maîtrisé rapporte 40 XP.</section>
  ${s.exos.map((x,i)=>`<section class="card pad exo">
    <div class="row spread"><h3><span class="num" aria-hidden="true">${pad2(i+1)}</span>${esc(x.t)}</h3><span class="row">${x.src?`<span class="badge gold">${esc(x.src)}</span>`:''}${x.pts?`<span class="badge">${esc(x.pts)}</span>`:''}${p.exos.includes(i)?'<span class="badge ok">Maîtrisé</span>':''}</span></div>
    <div>${x.q}</div>
    <textarea data-draft="${s.id}-${i}" placeholder="Votre réponse…" aria-label="Votre réponse"></textarea>
    <details><summary>Voir le corrigé</summary><div class="sec">${x.r}</div></details>
    <div class="row" style="justify-content:flex-end"><button class="btn sm ${p.exos.includes(i)?'':'primary'}" data-exo="${i}">${p.exos.includes(i)?'Annuler « maîtrisé »':'Je maîtrise cet exercice'}</button></div>
  </section>`).join('')}`;
}

/* ================= Révisions du jour ================= */
function pageRevisions(){
  if(QZ)return crumbs([['Accueil','index.html'],['Révisions du jour','revisions.html'],[QZ.title,'']])+`<section class="head"><div><h1>${esc(QZ.title)}</h1></div></section>`+quizBody();
  if(FC&&FC.key==='_all'){AFTER.push(bindCards);return crumbs([['Accueil','index.html'],['Révisions du jour','revisions.html'],['Cartes','']])+`<section class="head"><div><h1>Cartes à revoir</h1></div></section>`+cardsBody('revisions.html')}
  const due=totalDue(),wrong=totalWrong(),nw=SUBJECTS.reduce((n,s)=>n+newList(s.id).length,0);
  const wrongQs=SUBJECTS.flatMap(s=>sp(s.id).wrong.map(id=>QINDEX.get(id)).filter(Boolean));
  AFTER.push(()=>{$('#rCards').onclick=()=>{const ids=SUBJECTS.map(s=>s.id);FC={key:'_all',multi:true,sids:ids,items:buildDeck(ids,false),i:0,flip:false,done:0,again:0};render()};
    const w=$('#rWrong');if(w)w.onclick=()=>{startQuiz(shuffle(wrongQs).slice(0,30),{ctx:'errors',title:'Mes erreurs',retry:true});render()};
    $('#rExpress').onclick=()=>{startQuiz(shuffle(SUBJECTS.flatMap(s=>s.quiz)).slice(0,10),{ctx:'errors',title:'QCM express'});render()}});
  return crumbs([['Accueil','index.html'],['Révisions du jour','']])+`<section class="head"><div><h1>Révisions du jour</h1><p class="lede">Un quart d'heure par jour vaut mieux qu'une nuit blanche la veille : les cartes et les erreurs reviennent quand il faut.</p></div></section>
  <section class="bento">
    <div class="card tile b2"><div class="t-h">${tic('layers','#2563eb')}Cartes à revoir</div><div class="big">${due}</div>
      <p class="small muted">${due?'Cartes dont la date de révision est arrivée, toutes matières.':'Rien d\'échu aujourd\'hui. '+(nw?nw+' nouvelles cartes à découvrir.':'')}</p>
      <div class="row" style="margin-top:auto"><button class="btn primary" id="rCards">${due?'Réviser maintenant':'Découvrir 10 nouvelles cartes'}</button></div></div>
    <div class="card tile"><div class="t-h">${tic('rotate','#dc2626')}Mes erreurs</div><div class="big">${wrong}</div>
      <p class="small muted">Questions ratées. Une bonne réponse les retire de la liste.</p><button class="btn xp" id="rWrong" style="margin-top:auto" ${wrong?'':'disabled'}>Refaire mes erreurs</button></div>
    <div class="card tile"><div class="t-h">${tic('zap','#7c3aed')}QCM express</div><div class="big">10</div>
      <p class="small muted">Dix questions au hasard, toutes matières, correction immédiate.</p><button class="btn" id="rExpress" style="margin-top:auto">Lancer</button></div>
    <div class="card tile b4"><h3>Répartition des cartes</h3>${boxesHtml(SUBJECTS.map(s=>s.id))}</div>
  </section>`;
}

/* ================= Défis entre étudiants ================= */
let DF={to:'',sid:'all',n:10};
function pageDuels(pre){
  if(QZ)return crumbs([['Accueil','index.html'],['Défis','defis.html'],[QZ.title,'']])+`<section class="head"><div><h1>${esc(QZ.title)}</h1>${QZ.done?'':'<p class="muted" style="margin-top:5px">Pas de correction avant la fin. Le temps départage les égalités.</p>'}</div></section>`+quizBody();
  loadSocial();
  const uid=S.user.id,so=S.soc,me=myProfile(),players=playersList();
  if(pre&&players.some(p=>p.id===pre))DF.to=pre;
  if(DF.to&&!players.some(p=>p.id===DF.to))DF.to='';
  const all=so.chals||[],inc=all.filter(c=>c.to===uid&&c.status==='pending'),sent=all.filter(c=>c.from===uid&&c.status==='pending'),
    done=all.filter(c=>c.status==='done').sort((a,b)=>(b.done||b.created)-(a.done||a.created)).slice(0,20);
  const wins=prog()._duelWins||0,played=done.length;
  AFTER.push(()=>{const t=$('#dTo'),s=$('#dSid');if(t)t.onchange=e=>DF.to=e.target.value;if(s)s.onchange=e=>DF.sid=e.target.value;
    const go=$('#dGo');if(go)go.onclick=()=>{if(!DF.to){toast('Choisissez un adversaire.');return}const opp=players.find(p=>p.id===DF.to);
      const pool=DF.sid==='all'?SUBJECTS.flatMap(x=>x.quiz):subj(DF.sid).quiz;
      startQuiz(shuffle(pool).slice(0,DF.n),{ctx:'duel',title:'Défi contre '+opp.pseudo,duel:{mode:'new',to:opp.id,toName:opp.pseudo,sid:DF.sid}});render();scrollTo(0,0)};
    $$('[data-play]').forEach(b=>b.onclick=()=>{const c=inc.find(x=>x.id===b.dataset.play);if(!c)return;const list=c.qids.map(id=>QINDEX.get(id)).filter(Boolean);
      if(!list.length){toast('Ces questions n\'existent plus.');return}startQuiz(list,{ctx:'duel',title:'Défi de '+c.fromName,duel:{mode:'answer',c}});render();scrollTo(0,0)});
    $$('[data-del]').forEach(b=>b.onclick=async()=>{if(!confirm(b.dataset.msg))return;try{await S.api.deleteChallenge(b.dataset.del);loadSocial(true)}catch(e){toast(fr(e).message)}})});
  const card=(c,kind)=>{const meFrom=c.from===uid,opp=S.players[meFrom?c.to:c.from]||{id:meFrom?c.to:c.from,pseudo:meFrom?c.toName:c.fromName},n=c.qids.length,sname=c.sid==='all'?'Toutes matières':(subj(c.sid)||{name:'?'}).name;
    let mid,foot;
    if(kind==='inc'){mid=`<div class="vs">? – ?<small>${n} questions</small></div>`;foot=`<span class="small muted">${esc(sname)} · ${ago(c.created)} · score caché jusqu'à votre réponse</span><span class="row"><button class="btn ghost sm" data-del="${c.id}" data-msg="Refuser ce défi ?">Refuser</button><button class="btn primary sm" data-play="${c.id}">${ic('swords','sm')}Relever</button></span>`}
    else if(kind==='sent'){mid=`<div class="vs">${c.fromScore} – ?<small>en attente</small></div>`;foot=`<span class="small muted">${esc(sname)} · envoyé ${ago(c.created)}</span><button class="btn ghost sm" data-del="${c.id}" data-msg="Annuler ce défi ?">Annuler</button>`}
    else{const r=duelOutcome(c,meFrom),a=meFrom?c.fromScore:c.toScore,b=meFrom?c.toScore:c.fromScore;
      mid=`<div class="vs" style="color:${r==='win'?'var(--ok)':r==='lose'?'var(--bad)':'var(--xp-ink)'}">${a} – ${b}<small>${r==='win'?'Victoire':r==='lose'?'Défaite':'Égalité'}</small></div>`;
      foot=`<span class="small muted">${esc(sname)} · ${ago(c.done||c.created)} · ${meFrom?c.fromTime:c.toTime} s contre ${meFrom?c.toTime:c.fromTime} s</span><a class="btn sm" href="${U.duels(opp.id)}">Revanche</a>`}
    return `<div class="card"><div class="duel"><div class="side-p">${avatar(me,40)}<div style="min-width:0"><b>Vous</b><span>Niv. ${levelOf(me.xp).n}</span></div></div>${mid}
      <a class="side-p r" href="${U.player(opp.id)}" style="text-decoration:none;color:inherit"><div style="min-width:0"><b>${esc(opp.pseudo)}</b><span>${opp.xp!=null?'Niv. '+levelOf(opp.xp).n:'Joueur'}</span></div>${avatar(opp,40)}</a></div><div class="duel-foot">${foot}</div></div>`};
  return crumbs([['Accueil','index.html'],['Défis','']])+`<section class="head"><div><h1>Défis</h1><p class="lede">Défiez un camarade sur une série de questions tirée au hasard : il reçoit exactement les mêmes. Meilleur score gagne, le temps départage. +30 XP par défi joué, +70 XP en cas de victoire.</p></div>
    <div class="row"><span class="badge xp">${ic('trophy','sm')} ${plural(wins,'victoire')}</span><span class="badge">${plural(played,'défi terminé','défis terminés')}</span></div></section>
  <section class="card pad grid" style="gap:14px"><h2>Lancer un défi</h2>
    ${players.length?`<div class="row" style="align-items:flex-end;gap:12px">
      <div class="field" style="flex:1;min-width:200px"><label for="dTo">Adversaire</label><select class="select" id="dTo"><option value="">Choisir un étudiant…</option>${players.map(p=>`<option value="${esc(p.id)}" ${DF.to===p.id?'selected':''}>${esc(p.pseudo)}${p.group?' · '+esc(p.group):''} · niv. ${levelOf(p.xp).n}</option>`).join('')}</select></div>
      <div class="field" style="flex:1;min-width:200px"><label for="dSid">Matière</label><select class="select" id="dSid"><option value="all">Toutes les matières</option>${SUBJECTS.map(s=>`<option value="${s.id}" ${DF.sid===s.id?'selected':''}>${esc(s.name)}</option>`).join('')}</select></div>
      <button class="btn primary lg" id="dGo">${ic('swords','sm')}Jouer et envoyer (10 questions)</button></div>`
      :`<p class="muted">${so.top==null?'Chargement des joueurs…':'Aucun autre étudiant inscrit pour l\'instant. Invitez votre promo !'}</p>`}
  </section>
  ${inc.length?`<section class="grid"><div class="section-h"><h2>À relever <span class="badge bad">${inc.length}</span></h2></div>${inc.map(c=>card(c,'inc')).join('')}</section>`:''}
  ${sent.length?`<section class="grid"><div class="section-h"><h2>En attente de réponse</h2></div>${sent.map(c=>card(c,'sent')).join('')}</section>`:''}
  <section class="grid"><div class="section-h"><h2>Historique</h2></div>${done.length?done.map(c=>card(c,'done')).join(''):`<div class="card empty">Aucun défi terminé pour l'instant.</div>`}</section>`;
}

/* ================= Classement et joueurs ================= */
function pageLeaderboard(){
  loadSocial();
  const so=S.soc,me=myProfile(),list=freshTop().filter(p=>!p.hidden||p.id===me.id);
  const pod=[list[1],list[0],list[2]];
  return crumbs([['Accueil','index.html'],['Classement','']])+`<section class="head"><div><h1>Classement</h1><p class="lede">Les XP s'obtiennent en révisant : bonnes réponses, cartes, cours lus, exercices, entraînements et défis.</p></div>
    <div class="row"><span class="badge blue">${ic('users','sm')} ${so.count!=null?plural(so.count,'étudiant inscrit','étudiants inscrits'):'…'}</span><span class="badge xp">${ic('trophy','sm')} Votre rang : ${so.rank?'#'+so.rank:'—'}</span></div></section>
  ${list.length?`<section class="card pad"><div class="podium">${pod.map((p,i)=>{if(!p)return '<div></div>';const rk=[2,1,3][i];return `<a class="p${rk}" href="${U.player(p.id)}">${rk===1?`<span class="crown">${ic('crown','lg')}</span>`:''}${ringAv(p,rk===1?78:62)}<span class="nm">${esc(p.pseudo)}</span><span class="badge xp">${fmt(p.xp)} XP</span><div class="step">${rk}</div></a>`}).join('')}</div></section>
  <section class="card lb">${list.map((p,i)=>`<a class="lb-row ${p.id===me.id?'mine':''}" href="${U.player(p.id)}"><span class="rk">${i+1}</span>
    <span class="who">${avatar(p,38)}<span style="min-width:0"><b>${esc(p.pseudo)}${p.id===me.id?' (vous)':''}</b><span>Niv. ${levelOf(p.xp).n} · ${esc(levelOf(p.xp).title)}${p.group?' · '+esc(p.group):''}</span></span></span>
    <span class="xpv">${fmt(p.xp)} XP</span>${p.id!==me.id?`<span class="act btn sm" data-duel="${esc(p.id)}">${ic('swords','sm')}Défier</span>`:'<span class="act"></span>'}</a>`).join('')}</section>`
  :`<section class="card empty">${so.top==null?'Chargement du classement…':'Personne dans le classement pour l\'instant.'}</section>`}`
  +(AFTER.push(()=>$$('[data-duel]').forEach(b=>b.onclick=e=>{e.preventDefault();e.stopPropagation();location.href=U.duels(b.dataset.duel)})),'');
}
function pagePlayer(id){
  const me=myProfile();if(!id)return notFound('Aucun joueur indiqué.');if(id===me.id){location.replace('profil.html');return ''}
  let p=S.players[id];
  if(!p){S.api.getProfile(id).then(x=>{S.players[id]=x||{id,pseudo:'Joueur introuvable',xp:0,missing:true};render()}).catch(()=>{S.players[id]={id,pseudo:'Joueur introuvable',xp:0,missing:true};render()});
    return `<section class="card empty"><div class="spin" style="margin:0 auto"></div></section>`}
  if(p.missing)return `<section class="card pad"><h1>Joueur introuvable</h1><p style="margin-top:8px"><a href="classement.html">Retour au classement</a></p></section>`;
  const L=levelOf(p.xp),earned=new Set(p.badges||[]);
  return crumbs([['Accueil','index.html'],['Classement','classement.html'],[p.pseudo,'']])+`<section class="card pad grid" style="gap:20px"><div class="profile-head">${ringAv(p,104)}<div style="min-width:0;flex:1"><p class="eyebrow">${esc(L.title)}</p><h1>${esc(p.pseudo)}</h1>
    <p class="muted" style="margin-top:4px">${[p.group,p.bio].filter(Boolean).map(esc).join(' · ')||'Étudiant GCS1'}</p>
    <div class="stat-row" style="margin-top:14px"><div><b>${L.n}</b><span>niveau</span></div><div><b>${fmt(p.xp)}</b><span>XP</span></div><div><b>${p.streak||0}</b><span>jours de série</span></div><div><b>${earned.size}</b><span>badges</span></div></div></div>
    <a class="btn primary lg" href="${U.duels(p.id)}">${ic('swords','sm')}Défier ${esc(p.pseudo)}</a></div></section>
  <section class="card pad grid"><h2>Badges</h2>${badgesHtml(earned)}</section>`;
}
function badgesHtml(earned){return `<div class="badges">${BADGES.map(b=>`<div class="bdg ${earned.has(b[0])?'':'locked'}"><span class="bi">${ic(b[3],'lg')}</span><b>${esc(b[1])}</b><span>${esc(b[2])}</span>${earned.has(b[0])?'':'<span class="sr">(non obtenu)</span>'}</div>`).join('')}</div>`}

/* ================= Profil ================= */
async function processPhoto(file){
  if(!file||!/^image\/(jpeg|png|webp|gif)$/.test(file.type))throw new Error('Choisissez une image JPEG, PNG ou WebP.');
  if(file.size>10e6)throw new Error('Image trop lourde (10 Mo maximum).');
  const url=URL.createObjectURL(file);
  try{const img=await new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error('Image illisible.'));i.src=url});
    const N=192,c=document.createElement('canvas');c.width=c.height=N;const x=c.getContext('2d');const m=Math.min(img.naturalWidth,img.naturalHeight);
    x.drawImage(img,(img.naturalWidth-m)/2,(img.naturalHeight-m)/2,m,m,0,0,N,N);
    let d=c.toDataURL('image/webp',.82);if(!d.startsWith('data:image/webp'))d=c.toDataURL('image/jpeg',.85);if(d.length>110000)d=c.toDataURL('image/jpeg',.6);
    if(d.length>118000)throw new Error('Image trop détaillée, essayez-en une autre.');return d}
  finally{URL.revokeObjectURL(url)}}
function pageProfile(){
  const me=myProfile(),L=levelOf(me.xp),earned=new Set(earnedBadges()),set=glob('_settings',{}),so=S.soc;
  AFTER.push(()=>{
    const file=$('#pPhoto');file.onchange=async()=>{const f=file.files[0];if(!f)return;try{const d=await processPhoto(f);S.me.avatar=d;saveSoon();toast('Photo mise à jour.');render()}catch(e){toast(e.message)}};
    const rm=$('#pRm');if(rm)rm.onclick=()=>{S.me.avatar='';saveSoon();render()};
    $('#pForm').onsubmit=async e=>{e.preventDefault();const n=$('#pName').value.trim();
      if(!/^[\p{L}0-9 _.-]{2,24}$/u.test(n)){toast('Le pseudo doit faire 2 à 24 caractères (lettres, chiffres, espace, point, tiret).');return}
      Object.assign(S.me,{pseudo:n,group:$('#pGroup').value.trim().slice(0,20),bio:$('#pBio').value.trim().slice(0,80),hidden:!$('#pShow').checked});
      try{await S.api.setName(n)}catch(_){} await saveNow();loadSocial(true);toast('Profil enregistré.');render()};
    $('#pBio').oninput=e=>$('#pBioN').textContent=e.target.value.length;
    $('#aOut').onclick=async()=>{QZ=null;FC=null;S.loggingOut=true;await S.api.signOut()};
    $('#aDate').onchange=e=>{set.examDate=e.target.value||null;if(!set.examDate)delete set.examDate;saveSoon();toast(set.examDate?'Date des partiels enregistrée.':'Date effacée.')};
    $('#aReset').onclick=()=>{if(confirm('Effacer votre progression (QCM, cartes, exercices, série) ? Vos XP et badges sont conservés. Action définitive.')){const keep={_xp:prog()._xp,_duelWins:prog()._duelWins,_duelsSeen:prog()._duelsSeen,_bestStreak:prog()._bestStreak,_perfect:prog()._perfect,_cardReviews:prog()._cardReviews};S.data.progress=keep;saveSoon();FC=null;QZ=null;toast('Progression effacée.');render()}};
    const pw=$('#aPw');if(pw)pw.onclick=async()=>{try{await S.api.reset(S.user.email);toast('Lien envoyé à '+S.user.email)}catch(e){toast(fr(e).message)}};
    $('#aDel').onclick=async()=>{if(!confirm('Supprimer définitivement votre compte, votre profil et votre progression ?'))return;try{await S.api.remove(S.user.id);toast('Compte supprimé.')}catch(e){toast(e.code==='auth/requires-recent-login'?'Par sécurité, déconnectez-vous puis reconnectez-vous avant de supprimer le compte.':fr(e).message)}}});
  return crumbs([['Accueil','index.html'],['Mon profil','']])+`<section class="card pad grid subj-head" style="gap:20px;--c:#2563eb"><div class="profile-head">${ringAv(me,104)}<div style="min-width:0;flex:1"><p class="eyebrow">${esc(L.title)}</p><h1>${esc(me.pseudo)}</h1>
    <p class="muted" style="margin-top:4px">${esc(S.user.email)}${me.group?' · '+esc(me.group):''}</p>
    <div class="xpbar" style="margin-top:14px;max-width:420px"><i style="width:${L.pct}%"></i></div><p class="small muted" style="margin-top:6px">${fmt(me.xp)} XP · ${fmt(L.left)} XP avant le niveau ${L.n+1}</p>
    <div class="stat-row" style="margin-top:14px"><div><b>${L.n}</b><span>niveau</span></div><div><b>${so.rank?'#'+so.rank:'—'}</b><span>rang${so.count?' / '+so.count:''}</span></div><div><b>${streak()}</b><span>jours de série</span></div><div><b>${earned.size}/${BADGES.length}</b><span>badges</span></div><div><b>${prog()._duelWins||0}</b><span>défis gagnés</span></div></div></div></div></section>
  <section class="grid g2">
    <form class="card pad grid" id="pForm" style="gap:16px"><h2>Mon profil</h2>
      <div class="photo-edit">${avatar(me,72)}<div class="grid" style="gap:8px"><label class="btn" for="pPhoto" style="cursor:pointer">${ic('camera','sm')}${okPhoto(me.avatar)?'Changer la photo':'Ajouter une photo'}</label>
        <input type="file" id="pPhoto" accept="image/jpeg,image/png,image/webp" class="sr">${okPhoto(me.avatar)?`<button type="button" class="btn ghost sm danger" id="pRm">${ic('trash','sm')}Retirer</button>`:''}<span class="hint2 small muted">Recadrée en carré 192 px, visible par les étudiants connectés.</span></div></div>
      <div class="field"><label for="pName">Pseudo affiché</label><input class="input" id="pName" value="${esc(me.pseudo)}" maxlength="24" required></div>
      <div class="field"><label for="pGroup">Groupe</label><input class="input" id="pGroup" value="${esc(me.group)}" maxlength="20" placeholder="ex. B1-4"></div>
      <div class="field"><label for="pBio">Bio <span class="muted small">(<span id="pBioN">${me.bio.length}</span>/80)</span></label><input class="input" id="pBio" value="${esc(me.bio)}" maxlength="80" placeholder="ex. Team blue, fan de Wazuh"></div>
      <label class="switch"><input type="checkbox" id="pShow" ${me.hidden?'':'checked'}> Apparaître dans le classement et pouvoir être défié</label>
      <div class="row" style="justify-content:flex-end"><button class="btn primary" type="submit">Enregistrer</button></div></form>
    <div class="card pad grid" style="gap:16px;align-content:start"><h2>Réglages</h2>
      <div class="field"><label for="aDate">${ic('calendar','sm')} Date des partiels</label><input class="input" type="date" id="aDate" value="${esc(set.examDate||'')}" style="max-width:220px"><span class="hint2">Affiche un compte à rebours sur le tableau de bord.</span></div>
      <div class="row">${S.api.mode==='firebase'?`<button class="btn" id="aPw">Changer de mot de passe</button>`:''}<button class="btn" id="aOut">${ic('logout','sm')}Se déconnecter</button></div>
      <div style="border-top:1px solid var(--border);padding-top:14px" class="row"><button class="btn" id="aReset">${ic('rotate','sm')}Effacer ma progression</button><button class="btn danger" id="aDel">${ic('trash','sm')}Supprimer mon compte</button></div></div>
  </section>
  <section class="card pad grid"><div class="row spread"><h2>Badges</h2><span class="badge xp">${earned.size}/${BADGES.length}</span></div>${badgesHtml(earned)}</section>
  <section class="card pad"><h2>Progression par matière</h2>
    <div class="tbl"><table><tr><th>Matière</th><th>Cours lus</th><th>Meilleur QCM</th><th>Cartes maîtrisées</th><th>Exercices</th><th>Erreurs</th></tr>${SUBJECTS.map(s=>{const t=stats(s);return `<tr><td><a href="${U.sub(s.id)}">${esc(s.name)}</a></td><td>${t.rd}/${t.nf}</td><td>${t.runs?t.best+' %':'—'}</td><td>${t.mast}/${t.nc}</td><td>${t.ex}/${t.ne}</td><td>${t.wrong}</td></tr>`}).join('')}</table></div></section>`;
}

/* ================= Partiel blanc ================= */
let PB={sel:new Set(SUBJECTS.map(s=>s.id)),n:30,timer:30};
function pagePartiel(){
  if(QZ)return crumbs([['Accueil','index.html'],['Partiel blanc','partiel.html'],[QZ.ctx==='partiel'?'En cours':QZ.title,'']])+`<section class="head"><div><h1>${esc(QZ.title)}</h1></div></section>`+quizBody();
  const hist=glob('_partiels',[]);
  AFTER.push(()=>{$$('[data-ps]').forEach(c=>c.onchange=()=>{c.checked?PB.sel.add(c.dataset.ps):PB.sel.delete(c.dataset.ps);$('#pbGo').disabled=!PB.sel.size});
    $('#pbN').onchange=e=>PB.n=+e.target.value;$('#pbT').onchange=e=>PB.timer=+e.target.value;
    $('#pbGo').onclick=()=>{const pool=SUBJECTS.filter(s=>PB.sel.has(s.id)).flatMap(s=>s.quiz);
      startQuiz(shuffle(pool).slice(0,PB.n),{ctx:'partiel',title:'Partiel blanc · '+Math.min(PB.n,pool.length)+' questions',timer:PB.timer});render()}});
  return crumbs([['Accueil','index.html'],['Partiel blanc','']])+`<section class="head"><div><h1>Partiel blanc</h1><p class="lede">Questions tirées au hasard, chrono, et <b>aucune correction avant la fin</b> : comme le jour J. +30 XP à la fin.</p></div></section>
  <section class="card pad grid">
    <h3>Matières</h3>
    <div class="grid g3">${SUBJECTS.map(s=>`<label class="check"><input type="checkbox" data-ps="${s.id}" ${PB.sel.has(s.id)?'checked':''}><span class="dot" style="width:9px;height:9px;border-radius:3px;background:${s.col}"></span><span>${esc(s.name)} <span class="muted small">(${s.quiz.length})</span></span></label>`).join('')}</div>
    <div class="row" style="gap:14px">
      <label class="row small" style="font-weight:600">Questions <select id="pbN" class="select">${[10,20,30,40,60].map(n=>`<option ${PB.n===n?'selected':''}>${n}</option>`).join('')}</select></label>
      <label class="row small" style="font-weight:600">Durée <select id="pbT" class="select">${[[0,'sans chrono'],[10,'10 min'],[20,'20 min'],[30,'30 min'],[45,'45 min'],[60,'1 h']].map(([v,l])=>`<option value="${v}" ${PB.timer===v?'selected':''}>${l}</option>`).join('')}</select></label>
      <button class="btn primary lg" id="pbGo">${ic('grad','sm')}Commencer</button></div>
  </section>
  ${hist.length?`<section class="card pad"><h3>Mes derniers partiels blancs</h3><div class="tbl"><table><tr><th>Date</th><th>Questions</th><th>Score</th></tr>${hist.map(h=>`<tr><td>${new Date(h.at).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})}</td><td>${h.n}</td><td><b>${h.pct} %</b></td></tr>`).join('')}</table></div></section>`:''}`;
}

/* ================= Entraînements ================= */
const D={};
function drillSave(k,ok){const d=glob('_drills',{});d[k]=d[k]||{ok:0,n:0,best:0};d[k].n++;if(ok){d[k].ok++;addXp(5,'',true)}bump()}
function pageDrills(id){
  const list=[['sousreseaux','network','#0d9488','Sous-réseaux','Masque, réseau, broadcast, plage et nombre d\'hôtes à partir d\'une IP/CIDR.'],
    ['ports','plug','#2563eb','Ports','Le numéro de port de chaque service (AD, web, Squid, Wazuh…).'],
    ['osi','layers','#7c3aed','Modèle OSI','Remettre les couches dans l\'ordre et placer chaque protocole.'],
    ['commandes','terminal','#16a34a','Commandes','Linux, Git, Windows, Docker, Squid : la bonne commande pour chaque tâche.']];
  const dr=glob('_drills',{});
  const cur=list.find(x=>x[0]===id);
  const head=crumbs(cur?[['Accueil','index.html'],['Entraînements','entrainements.html'],[cur[3],'']]:[['Accueil','index.html'],['Entraînements','']])+`<section class="head"><div><h1>${cur?esc(cur[3]):'Entraînements'}</h1><p class="lede">Des exercices générés à l'infini sur ce qui tombe à coup sûr. +5 XP par bonne réponse.</p></div></section>
  <nav class="tabs">${list.map(([k,i,,l])=>`<a href="entrainements.html?t=${k}" ${id===k?'aria-current="page"':''}>${ic(i,'sm')}${l}</a>`).join('')}</nav>`;
  if(id==='sousreseaux')return head+drillSubnet();
  if(id==='ports')return head+drillPorts();
  if(id==='osi')return head+drillOsi();
  if(id==='commandes')return head+drillCmd();
  return head+`<section class="grid g2">${list.map(([k,i,c,l,d])=>{const x=dr[k];return `<a class="card subj" href="entrainements.html?t=${k}" style="--c:${c}"><div class="row spread"><span class="subj-ico">${ic(i)}</span>${x?`<span class="badge">${x.ok}/${x.n} justes</span>`:''}</div><div><h3>${l}</h3><p style="margin-top:5px">${d}</p></div></a>`}).join('')}</section>`;
}
const ip2s=n=>[n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join('.');
function genSubnet(){const r=pick(['10','172','192','192','192']);let ip,cidr;
  if(r==='10'){ip=(10<<24>>>0)+rnd(0,0xFFFFFF);cidr=pick([8,16,20,22,24,26,27])}
  else if(r==='172'){ip=((172<<24)>>>0)+((rnd(16,31))<<16)+rnd(0,0xFFFF);cidr=pick([16,20,22,23,24,25,26,28])}
  else{ip=((192<<24)>>>0)+(168<<16)+rnd(0,0xFFFF);cidr=pick([24,24,25,26,26,27,27,28,29,30])}
  ip>>>=0;const mask=(0xFFFFFFFF<<(32-cidr))>>>0,net=(ip&mask)>>>0,bc=(net|(~mask>>>0))>>>0;
  return {ip:ip2s(ip),cidr,ans:{mask:ip2s(mask),net:ip2s(net),bc:ip2s(bc),first:ip2s(net+1),last:ip2s(bc-1),hosts:String(Math.pow(2,32-cidr)-2)}}}
function drillSubnet(){
  if(!D.sub)D.sub={q:genSubnet(),checked:false,vals:{}};const z=D.sub,F=[['mask','Masque décimal'],['net','Adresse réseau'],['bc','Broadcast'],['first','Première adresse utilisable'],['last','Dernière adresse utilisable'],['hosts','Nombre d\'hôtes']];
  AFTER.push(()=>{const go=()=>{F.forEach(([k])=>z.vals[k]=$('#s-'+k).value.trim());z.checked=true;const ok=F.every(([k])=>z.vals[k]===z.q.ans[k]);drillSave('sousreseaux',ok);render()};
    const sc=$('#sCheck');if(sc)sc.onclick=go;$('#sNew').onclick=()=>{D.sub=null;render();setTimeout(()=>$('#s-mask')&&$('#s-mask').focus(),0)};
    const ss=$('#sShow');if(ss)ss.onclick=()=>{F.forEach(([k])=>z.vals[k]=z.q.ans[k]);z.checked=true;z.shown=true;render()};
    $$('.drill .input').forEach(i=>i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();z.checked?$('#sNew').click():go()}});
    if(!z.checked)setTimeout(()=>{const f=$('#s-mask');if(f&&(document.activeElement===document.body||document.activeElement===$('#main')))f.focus()},0)});
  const all=z.checked&&F.every(([k])=>z.vals[k]===z.q.ans[k]);
  return `<section class="card pad drill">
    <div class="row spread"><div><p class="muted small">Adresse à analyser</p><div class="big-q">${z.q.ip}/${z.q.cidr}</div></div>${z.checked?`<span class="badge ${all&&!z.shown?'ok':'bad'}">${z.shown?'Solution affichée':all?'Tout est juste · +5 XP':'Il y a des erreurs'}</span>`:''}</div>
    <div class="grid g3">${F.map(([k,l])=>{const v=z.vals[k]||'',st=z.checked?(v===z.q.ans[k]?'ok':'bad'):'';return `<div class="field"><label for="s-${k}">${l}</label><input class="input ${st}" id="s-${k}" value="${esc(v)}" inputmode="decimal" autocomplete="off" ${z.checked?'readonly':''}>${z.checked&&st==='bad'?`<span class="small" style="color:var(--ok)">→ ${z.q.ans[k]}</span>`:''}</div>`}).join('')}</div>
    <div class="row">${z.checked?'':'<button class="btn primary" id="sCheck">Vérifier</button><button class="btn ghost" id="sShow">Voir la solution</button>'}<button class="btn ${z.checked?'primary':''}" id="sNew">${ic('rotate','sm')}Nouvelle adresse</button></div>
    <details class="tip" style="margin:0"><summary style="cursor:pointer;font-weight:600">Méthode</summary><div class="sec small" style="margin-top:6px">
      <p>1. Bits hôtes = 32 − CIDR ; nombre d'adresses du bloc = 2<sup>bits hôtes</sup> ; hôtes = bloc − 2.</p>
      <p>2. Dans l'octet « coupé », le <b>pas</b> = 256 − valeur du masque dans cet octet (/26 → masque .192 → pas de 64).</p>
      <p>3. Adresse réseau = le multiple du pas juste en dessous de l'IP ; broadcast = réseau + pas − 1 ; première = réseau + 1 ; dernière = broadcast − 1.</p></div></details>
  </section>`;
}
const PORTS=[['FTP (commande)',['21']],['SSH',['22']],['Telnet',['23']],['SMTP',['25']],['DNS',['53']],['DHCP (serveur)',['67']],['DHCP (client)',['68']],['HTTP',['80']],['Kerberos',['88']],['POP3',['110']],['NTP',['123']],['RPC Endpoint Mapper',['135']],['IMAP',['143']],['SNMP',['161']],['LDAP',['389']],['HTTPS',['443']],['SMB',['445']],['Kerberos (changement de mot de passe)',['464']],['Syslog',['514']],['LDAPS',['636']],['Wazuh (agent → manager)',['1514']],['Wazuh (enrôlement des agents)',['1515']],['Squid (proxy)',['3128']],['Catalogue global AD',['3268']],['MySQL',['3306']],['RDP (bureau à distance)',['3389']],['Webmin',['10000']]];
function drillPorts(){
  if(!D.port)D.port={q:pick(PORTS),ans:null,streak:0};const z=D.port,best=(glob('_drills',{}).ports||{}).best||0;
  AFTER.push(()=>{const inp=$('#pIn');const go=()=>{if(z.ans!=null){z.q=pick(PORTS.filter(p=>p!==z.q));z.ans=null;render();return}
      const v=inp.value.trim();if(!v)return;z.ans=v;const ok=z.q[1].includes(v);z.streak=ok?z.streak+1:0;drillSave('ports',ok);const d=glob('_drills',{});d.ports.best=Math.max(d.ports.best||0,z.streak);render()};
    $('#pGo').onclick=go;if(inp){inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go()}};inp.focus()}
    S.onKey=e=>{if(e.key==='Enter'&&z.ans!=null){e.preventDefault();go()}}});
  const ok=z.ans!=null&&z.q[1].includes(z.ans);
  return `<section class="card pad drill">
    <div class="row"><span class="badge blue">${ic('flame','sm')} Série ${z.streak}</span><span class="badge">Record ${best}</span></div>
    <p class="muted small">Quel est le port de…</p><div class="big-q" style="font-family:var(--f-display)">${esc(z.q[0])}</div>
    <div class="row"><input class="input ${z.ans!=null?(ok?'ok':'bad'):''}" id="pIn" inputmode="numeric" autocomplete="off" placeholder="ex. 443" aria-label="Numéro de port" style="width:160px" value="${z.ans!=null?esc(z.ans):''}" ${z.ans!=null?'readonly':''}>
      <button class="btn primary" id="pGo">${z.ans!=null?'Suivant':'Vérifier'}</button>
      ${z.ans!=null?`<span class="badge ${ok?'ok':'bad'}">${ok?'Juste · +5 XP':'Réponse : '+z.q[1].join(' ou ')}</span>`:''}</div>
  </section>
  <section class="card pad"><details><summary style="cursor:pointer;font-weight:600">Voir le tableau complet</summary><div class="tbl"><table><tr><th>Service</th><th>Port</th></tr>${PORTS.map(p=>`<tr><td>${esc(p[0])}</td><td><code>${p[1].join(', ')}</code></td></tr>`).join('')}</table></div></details></section>`;
}
const OSI=['Physique','Liaison de données','Réseau','Transport','Session','Présentation','Application'];
const OSIQ=[['HTTP',7],['DNS',7],['SSH',7],['SMTP',7],['LDAP',7],['TLS (chiffrement)',6],['JPEG / encodage ASCII',6],['RPC',5],['NetBIOS (session)',5],['TCP',4],['UDP',4],['Les ports 80 et 443',4],['IP',3],['ICMP (ping)',3],['Routeur',3],['Switch',2],['Adresse MAC',2],['Ethernet',2],['VLAN (802.1Q)',2],['Câble, fibre, Wi-Fi (signal)',1],['Hub',1]];
function drillOsi(){
  if(!D.osi)D.osi={order:shuffle(OSI.map((_,i)=>i)),next:0,err:0,q:pick(OSIQ),ans:null};const z=D.osi;
  const nextQ2=()=>{z.q=pick(OSIQ.filter(x=>x!==z.q));z.ans=null;render()};
  AFTER.push(()=>{$$('[data-layer]').forEach(b=>b.onclick=()=>{const i=+b.dataset.layer;if(i===z.next){z.next++;if(z.next===7)drillSave('osi',z.err===0)}else z.err++;render()});
    $('#oReset').onclick=()=>{D.osi={...z,order:shuffle(OSI.map((_,i)=>i)),next:0,err:0};render()};
    $$('[data-ol]').forEach(b=>b.onclick=()=>{if(z.ans!=null)nextQ2();else{z.ans=+b.dataset.ol;drillSave('osi',z.ans===z.q[1]);render()}});
    const n=$('#oNext');if(n)n.onclick=nextQ2;
    S.onKey=e=>{if(/^[1-7]$/.test(e.key)&&z.ans==null){z.ans=+e.key;drillSave('osi',z.ans===z.q[1]);render()}else if(e.key==='Enter'&&z.ans!=null)nextQ2()}});
  return `<section class="grid g2">
  <div class="card pad drill"><h3>Remettre les couches dans l'ordre</h3><p class="muted small">Cliquez de la couche <b>1</b> (en bas) à la couche <b>7</b>. ${z.err?`<span style="color:var(--bad)">${plural(z.err,'erreur')}</span>`:''}</p>
    <div class="osi">${z.order.map(i=>{const done=i<z.next;return `<button class="btn ${done?'primary':''}" data-layer="${i}" ${done?'disabled':''}>${done?`<b>${i+1}</b> · `:''}${OSI[i]}</button>`}).join('')}</div>
    <div class="row spread">${z.next===7?`<span class="badge ${z.err?'gold':'ok'}">${z.err?'Terminé avec '+plural(z.err,'erreur'):'Parfait · +5 XP'}</span>`:'<span></span>'}<button class="btn sm" id="oReset">${ic('rotate','sm')}Recommencer</button></div>
    <p class="small muted">Moyen mnémotechnique : « <b>P</b>our <b>L</b>e <b>R</b>éseau <b>T</b>out <b>S</b>e <b>P</b>asse <b>A</b>utomatiquement ».</p></div>
  <div class="card pad drill"><h3>À quelle couche ?</h3><div class="big-q" style="font-family:var(--f-display)">${esc(z.q[0])}</div>
    <div class="grid" style="grid-template-columns:repeat(7,1fr);gap:6px">${[1,2,3,4,5,6,7].map(n=>`<button class="btn ${z.ans!=null?(n===z.q[1]?'primary':n===z.ans?'danger':''):''}" data-ol="${n}" title="${OSI[n-1]}" aria-label="Couche ${n} : ${OSI[n-1]}">${n}</button>`).join('')}</div>
    ${z.ans!=null?`<div class="row spread"><span class="badge ${z.ans===z.q[1]?'ok':'bad'}">${z.ans===z.q[1]?'Juste · +5 XP':'Couche '+z.q[1]}</span><span class="small muted">${z.q[1]} = ${OSI[z.q[1]-1]}</span><button class="btn primary sm" id="oNext">Suivant</button></div>`:'<p class="small muted">Touches <kbd>1</kbd> à <kbd>7</kbd>.</p>'}</div>
  </section>`;
}
const CMDS=[
 ['Linux','Afficher le dossier courant',['pwd']],
 ['Linux','Lister tous les fichiers (cachés compris) en format détaillé',['ls -la','ls -al','ls -l -a','ls -a -l']],
 ['Linux','Créer le dossier « projet »',['mkdir projet']],
 ['Linux','Suivre en direct le fichier /var/log/syslog',['tail -f /var/log/syslog']],
 ['Linux','Chercher « ERROR » dans app.log',['grep error app.log']],
 ['Linux','Donner les droits rwxr-x--- à script.sh',['chmod 750 script.sh']],
 ['Linux','Afficher l\'état du service squid',['systemctl status squid','sudo systemctl status squid']],
 ['Linux','Installer le paquet squid (Debian)',['apt install squid','sudo apt install squid','apt-get install squid','sudo apt-get install squid','apt install -y squid','sudo apt install -y squid']],
 ['Squid','Vérifier la syntaxe de squid.conf',['squid -k parse','sudo squid -k parse']],
 ['Squid','Recharger la configuration de Squid sans couper le service',['systemctl reload squid','sudo systemctl reload squid','squid -k reconfigure','sudo squid -k reconfigure']],
 ['Git','Initialiser un dépôt',['git init']],
 ['Git','Préparer app.py pour le prochain commit',['git add app.py']],
 ['Git','Enregistrer un commit avec le message fix',['git commit -m fix']],
 ['Git','Créer la branche develop et basculer dessus',['git switch -c develop','git checkout -b develop']],
 ['Git','Envoyer main vers origin la première fois (avec suivi)',['git push -u origin main','git push --set-upstream origin main']],
 ['Git','Récupérer et fusionner les changements distants',['git pull']],
 ['Git','Afficher l\'historique sur une ligne par commit',['git log --oneline']],
 ['Windows','Appliquer immédiatement les GPO',['gpupdate /force']],
 ['Windows','Afficher les GPO appliquées au poste et à l\'utilisateur',['gpresult /r']],
 ['Windows','Afficher la configuration IP complète',['ipconfig /all']],
 ['Windows','Redemander une adresse au serveur DHCP',['ipconfig /renew']],
 ['Réseau','Interroger le DNS sur le nom srv-ad01',['nslookup srv-ad01']],
 ['Réseau','Tester la connectivité vers 192.168.10.10',['ping 192.168.10.10']],
 ['Réseau','Scanner les services et versions de 192.168.10.20 avec nmap',['nmap -sv 192.168.10.20']],
 ['Docker','Construire l\'image « app » à partir du dossier courant',['docker build -t app .']],
 ['Docker','Lister les conteneurs en cours d\'exécution',['docker ps']],
 ['Python','Installer les dépendances listées dans requirements.txt',['pip install -r requirements.txt','python -m pip install -r requirements.txt']],
 ['Python','Créer un environnement virtuel nommé venv',['python -m venv venv','python3 -m venv venv']]
];
const normCmd=s=>String(s||'').toLowerCase().replace(/["']/g,'').replace(/\s+/g,' ').trim();
function drillCmd(){
  if(!D.cmd)D.cmd={q:pick(CMDS),ans:null,streak:0};const z=D.cmd;
  AFTER.push(()=>{const inp=$('#cIn');const go=()=>{if(z.ans!=null){z.q=pick(CMDS.filter(c=>c!==z.q));z.ans=null;render();return}
      const v=inp.value;if(!v.trim())return;z.ans=v;const ok=z.q[2].includes(normCmd(v));z.streak=ok?z.streak+1:0;drillSave('commandes',ok);render()};
    $('#cGo').onclick=go;if(inp){inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go()}};inp.focus()}
    S.onKey=e=>{if(e.key==='Enter'&&z.ans!=null){e.preventDefault();go()}}});
  const ok=z.ans!=null&&z.q[2].includes(normCmd(z.ans));
  return `<section class="card pad drill">
    <div class="row"><span class="badge">${esc(z.q[0])}</span><span class="badge blue">${ic('flame','sm')} Série ${z.streak}</span></div>
    <div class="big-q" style="font-family:var(--f-display);font-size:21px">${esc(z.q[1])}</div>
    <div class="row" style="flex-wrap:nowrap"><input class="input ${z.ans!=null?(ok?'ok':'bad'):''}" id="cIn" autocomplete="off" spellcheck="false" aria-label="Commande" placeholder="$ commande" style="flex:1;font-family:var(--f-mono)" value="${z.ans!=null?esc(z.ans):''}" ${z.ans!=null?'readonly':''}>
      <button class="btn primary" id="cGo">${z.ans!=null?'Suivant':'Vérifier'}</button></div>
    ${z.ans!=null?`<div class="expl ${ok?'ok':'bad'}">${ok?'<b>Juste · +5 XP.</b>':'<b>Attendu :</b>'} <code>${esc(z.q[2][0])}</code>${z.q[2].length>1?` <span class="muted small">(aussi accepté : ${z.q[2].slice(1).map(x=>'<code>'+esc(x)+'</code>').join(', ')})</span>`:''}</div>`:'<p class="small muted">La casse et les guillemets ne comptent pas.</p>'}
  </section>`;
}

/* ================= Lexique ================= */
function pageLexique(m,q){
  const sid=SUBJECTS.some(s=>s.id===m)?m:'';q=q||'';
  AFTER.push(()=>{const inp=$('#lxQ');const apply=()=>{const f=fold(inp.value);let n=0;$$('.lx').forEach(el=>{const show=(!f||el.dataset.t.includes(f));el.hidden=!show;if(show)n++});$('#lxN').textContent=n;const em=$('#lxEmpty');em.hidden=n>0;em.querySelector('b').textContent=inp.value};
    inp.oninput=apply;apply();if(!sid)inp.focus()});
  const subs=sid?[subj(sid)]:SUBJECTS;
  return crumbs([['Accueil','index.html'],['Lexique','']])+`<section class="head"><div><h1>Lexique</h1><p class="lede">Toutes les notions des cartes, avec leur réponse. Pratique pour une relecture rapide.</p></div></section>
  <section class="card pad grid">
    <div class="row"><input class="input" id="lxQ" aria-label="Filtrer le lexique" placeholder="Filtrer : port, VLAN, git push…" value="${esc(q)}" style="flex:1;min-width:200px"><span class="badge" role="status"><span id="lxN">0</span> notions</span></div>
    <p class="empty" id="lxEmpty" hidden>Aucune notion ne contient « <b></b> ». Essayez un mot plus court, ou la recherche complète (<kbd>Ctrl</kbd> <kbd>K</kbd>).</p>
    <div class="row"><a class="badge ${sid?'':'blue'}" href="lexique.html" style="text-decoration:none">Toutes</a>${SUBJECTS.map(s=>`<a class="badge ${sid===s.id?'blue':''}" href="lexique.html?m=${s.id}" style="text-decoration:none" ${sid===s.id?'aria-current="page"':''}>${esc(s.name)}</a>`).join('')}</div>
  </section>
  ${subs.map(s=>`<section class="card"><div class="pad-sm row" style="border-bottom:1px solid var(--border)">${subjIco(s,30)}<h3>${esc(s.name)}</h3></div>
    <div class="tbl" style="border:0;margin:0;border-radius:0"><table>${s.cards.map(c=>`<tr class="lx" data-t="${esc(fold(plain(c[0])+' '+plain(c[1])))}"><td style="width:42%"><b>${c[0]}</b></td><td>${c[1]}</td></tr>`).join('')}</table></div></section>`).join('')}`;
}

/* ================= Recherche (Ctrl+K) ================= */
let IDX=null;
const PAGES_IDX=[['index.html','home','Tableau de bord'],['revisions.html','clock','Révisions du jour'],['matieres.html','bookOpen','Matières'],['defis.html','swords','Défis'],['classement.html','trophy','Classement'],['profil.html','user','Mon profil'],['partiel.html','grad','Partiel blanc'],['entrainements.html','zap','Entraînements'],['lexique.html','book','Lexique']];
function buildIndex(){IDX=[];
  PAGES_IDX.forEach(([p,i,l])=>IDX.push({k:'Page',i,t:l,s:'',h:p,f:fold(l)}));
  [['sousreseaux','Sous-réseaux'],['ports','Ports'],['osi','Modèle OSI'],['commandes','Commandes']].forEach(([k,l])=>IDX.push({k:'Entraînement',i:'zap',t:'Entraînement : '+l,s:'',h:'entrainements.html?t='+k,f:fold('entrainement exercice '+l)}));
  SUBJECTS.forEach(s=>{IDX.push({k:'Matière',i:s.ic,t:s.name,s:s.short,h:U.sub(s.id),f:fold(s.name+' '+s.short)});
    s.fiche.forEach((f,i)=>{const txt=plain(f.h);IDX.push({k:'Cours · '+s.name,i:'bookOpen',t:f.t,s:'',raw:txt,h:`${U.sub(s.id)}#s${i}`,f:fold(f.t+' '+txt),tf:fold(f.t)})});
    s.cards.forEach(c=>{const a=plain(c[0]),b=plain(c[1]);IDX.push({k:'Carte · '+s.name,i:'layers',t:a,s:b,h:'lexique.html?q='+encodeURIComponent(a.slice(0,40)),f:fold(a+' '+b),tf:fold(a)})});
    s.quiz.forEach(q=>{const ans=q.a.map(x=>q.o[x]).join(' · ');IDX.push({k:'QCM · '+s.name,i:'circleCheck',t:q.q,s:'Réponse : '+ans,h:U.sub(s.id,'qcm'),f:fold(q.q+' '+ans+' '+(q.e||'')),tf:fold(q.q)})});
    s.exos.forEach(x=>IDX.push({k:'Exercice · '+s.name,i:'pencil',t:x.t,s:'',h:U.sub(s.id,'exos'),f:fold(x.t+' '+plain(x.q)),tf:fold(x.t)}))})}
function searchIdx(q){if(!IDX)buildIndex();const w=fold(q).split(/\s+/).filter(Boolean);
  const players=(S.soc.top||[]).filter(p=>!p.hidden&&p.id!==S.user.id).map(p=>({k:'Joueur',i:'user',t:p.pseudo,s:'Niv. '+levelOf(p.xp).n+' · '+fmt(p.xp)+' XP',h:U.player(p.id),f:fold(p.pseudo+' '+(p.group||''))}));
  const pool=IDX.concat(players);
  if(!w.length)return pool.filter(x=>x.k==='Page'||x.k==='Matière');
  const res=[];for(const x of pool){if(!w.every(t=>x.f.includes(t)))continue;let sc=0;const tf=x.tf||fold(x.t);w.forEach(t=>{if(tf.includes(t))sc+=3});if(x.k==='Page'||x.k==='Matière'||x.k==='Joueur')sc+=2;if(x.k.startsWith('Cours'))sc+=1;
    let s=x.s;if(x.raw&&!s){const pos=x.f.indexOf(w[0]);const a=Math.max(0,pos-50);s=(a?'…':'')+x.raw.slice(a,a+140)+'…'}res.push({...x,s,sc})}
  return res.sort((a,b)=>b.sc-a.sc).slice(0,40)}
let PAL={sel:0,res:[]};
function openPalette(){if($('#palette'))return;if(S.menu){S.menu=false;render()}const ov=document.createElement('div');ov.className='overlay';ov.id='palette';ov.setAttribute('role','dialog');ov.setAttribute('aria-label','Recherche');
  ov.innerHTML=`<div class="palette"><div class="pin">${ic('search')}<input id="palQ" placeholder="Rechercher un cours, une notion, un joueur…" autocomplete="off" spellcheck="false" aria-label="Rechercher"><kbd>Échap</kbd></div><div class="res" id="palR"></div></div>`;
  document.body.appendChild(ov);ov.onclick=e=>{if(e.target===ov)closePalette()};
  const inp=$('#palQ');inp.oninput=()=>{PAL.sel=0;drawPalette(inp.value)};drawPalette('');inp.focus()}
function closePalette(){const p=$('#palette');if(p)p.remove()}
function drawPalette(q){PAL.res=searchIdx(q);const box=$('#palR');
  box.innerHTML=PAL.res.length?PAL.res.map((x,i)=>`<a href="${x.h}" class="${i===PAL.sel?'on':''}" data-i="${i}">${ic(x.i||'search')}<span style="min-width:0"><b>${esc(x.t)}</b><span>${esc(x.k)}${x.s?' · '+esc(x.s.length>160?x.s.slice(0,160)+'…':x.s):''}</span></span></a>`).join(''):`<div class="empty">Aucun résultat pour « ${esc(q)} »</div>`;
  $$('#palR a').forEach(a=>{a.onclick=()=>closePalette();a.onmousemove=()=>{if(PAL.sel!==+a.dataset.i){PAL.sel=+a.dataset.i;$$('#palR a').forEach(b=>b.classList.toggle('on',b===a))}}})}
function paletteKey(e){if(e.key==='Escape'){e.preventDefault();closePalette();return}
  const items=$$('#palR a');if(!items.length)return;
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();PAL.sel=(PAL.sel+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items.forEach((a,i)=>a.classList.toggle('on',i===PAL.sel));items[PAL.sel].scrollIntoView({block:'nearest'})}
  else if(e.key==='Enter'){e.preventDefault();const a=items[PAL.sel];closePalette();location.href=a.getAttribute('href')}}

boot();
})();
