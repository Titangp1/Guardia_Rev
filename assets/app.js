/* Guardia_Rev · application : connexion obligatoire, cours, QCM, cartes à répétition espacée, exercices,
   révisions du jour, entraînements interactifs, lexique, recherche et partiel blanc. Réalisé par Titan_gp1. */
(function(){
'use strict';
const VERSION='2.1.0';
const CFG=window.GR_CONFIG||{};
const DOMAIN=(CFG.domain||'guardiaschool.fr').toLowerCase();
const META={isr:['server','#1d6fd1'],supervision:['activity','#a77d2f'],fondamentaux:['lock','#0f766e'],devsecops:['terminal','#15803d'],web:['code','#ea580c'],incident:['alert','#7c3aed'],anglais:['languages','#db2777']};
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
/* Adresses bannies : on compare l'empreinte SHA-256 de l'email (en minuscules) à la liste de config.js. */
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

function toast(msg){const box=$('#toasts');if(!box)return;const t=document.createElement('div');t.className='toast';t.textContent=msg;box.appendChild(t);setTimeout(()=>t.remove(),3600)}

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
  eyeOff:'<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>'
};
const ic=(n,c='')=>`<svg class="ico ${c}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]||''}</svg>`;
const GLOGO='<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
const LOGO='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M17.5 7.5A7 7 0 1 0 19 13h-7"/></svg>';
const subjIco=(s,size=38)=>`<span class="subj-ico" style="background:${s.col};width:${size}px;height:${size}px">${ic(s.ic,size<34?'sm':'')}</span>`;

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
  const doc=uid=>F.doc(db,'users',uid);
  /* Après validation, la page Firebase propose « Continuer » pour revenir sur le site. */
  const verify=async u=>{try{await U.sendEmailVerification(u,{url:location.origin+location.pathname})}
    catch(e){if(/continue-uri|unauthorized/.test(e.code||''))await U.sendEmailVerification(u);else throw e}};
  const asUser=u=>u?{id:u.uid,email:(u.email||'').toLowerCase(),name:u.displayName||'',verified:!!u.emailVerified}:null;
  return {
    mode:'firebase',
    onAuth:cb=>U.onAuthStateChanged(auth,u=>cb(asUser(u))),
    async signUp(email,pw,pseudo){const r=await U.createUserWithEmailAndPassword(auth,email,pw);
      await U.updateProfile(r.user,{displayName:pseudo});await verify(r.user);return asUser(r.user)},
    async signIn(email,pw){const r=await U.signInWithEmailAndPassword(auth,email,pw);return asUser(r.user)},
    /* hd : Google propose directement les comptes de l'école ; le domaine est revérifié après la connexion. */
    async google(){const p=new U.GoogleAuthProvider();p.setCustomParameters({hd:DOMAIN,prompt:'select_account'});
      try{return asUser((await U.signInWithPopup(auth,p)).user)}catch(e){if(e.code==='auth/popup-blocked'){await U.signInWithRedirect(auth,p);return null}throw e}},
    async reload(){if(!auth.currentUser)return null;await U.reload(auth.currentUser);await auth.currentUser.getIdToken(true);return asUser(auth.currentUser)},
    resend:()=>verify(auth.currentUser),
    reset:e=>U.sendPasswordResetEmail(auth,e),
    signOut:()=>U.signOut(auth),
    async load(uid){const s=await F.getDoc(doc(uid));return s.exists()?s.data():null},
    async save(uid,data){await F.setDoc(doc(uid),{...data,updatedAt:F.serverTimestamp()},{merge:true})},
    async remove(uid){await F.deleteDoc(doc(uid));await U.deleteUser(auth.currentUser)}
  };
}
function localBackend(){
  let cb=null;
  const users=()=>store.get('gr-users',{}),setUsers=u=>store.set('gr-users',u);
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
    async load(uid){return store.get('gr-data-'+uid,null)},
    async save(uid,data){store.set('gr-data-'+uid,Object.assign(store.get('gr-data-'+uid,{}),data))},
    async remove(uid){const U=users();delete U[uid];setUsers(U);localStorage.removeItem('gr-data-'+uid);localStorage.removeItem('gr-session');emit()}
  };
}

/* ================= État et progression ================= */
const S={api:null,user:null,ready:false,data:{progress:{}},authView:'login',authMsg:null,saving:null,onKey:null,menu:false};
function prog(){S.data.progress=S.data.progress||{};return S.data.progress}
function sp(id){const p=prog();p[id]=p[id]||{};const x=p[id];x.wrong=x.wrong||[];x.exos=x.exos||[];x.read=x.read||[];x.srs=x.srs||{};
  if(x.known&&x.known.length){x.known.forEach(i=>{if(!x.srs[i])x.srs[i]={b:3,due:addDays(dayKey(),3)}});delete x.known}return x}
function glob(k,d){const p=prog();if(p[k]==null)p[k]=d;return p[k]}
function saveSoon(){clearTimeout(S.saving);S.saving=setTimeout(async()=>{if(!S.user||!S.user.verified)return;
  try{await S.api.save(S.user.id,{pseudo:S.user.name||'',progress:prog()})}catch(e){console.error(e);toast('Progression non enregistrée : '+fr(e).message)}},700)}
function bump(n=1){const a=glob('_act',{}),k=dayKey();a[k]=(a[k]||0)+n;
  const keys=Object.keys(a).sort();if(keys.length>120)keys.slice(0,keys.length-120).forEach(x=>delete a[x]);saveSoon()}
function streak(){const a=glob('_act',{});let d=dayKey(),n=0;if(!a[d])d=addDays(d,-1);while(a[d]){n++;d=addDays(d,-1)}return n}

/* Répétition espacée (boîtes de Leitner) : intervalle en jours selon la boîte. */
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

async function boot(){
  /* En développement (localhost avec ?local), on peut forcer le mode local pour tester sans compte Firebase. */
  const forceLocal=/^(localhost|127\.0\.0\.1)$/.test(location.hostname)&&/[?&]local(=|&|$)/.test(location.search);
  try{S.api=CFG.firebase&&!forceLocal?await firebaseBackend(CFG.firebase):localBackend()}
  catch(e){console.error(e);root.innerHTML=`<div class="auth"><div class="card auth-card"><h1>Guardia_Rev</h1><div class="msg err">Le service de connexion ne répond pas. Vérifiez votre connexion et rechargez la page.</div></div></div>`;return}
  S.api.onAuth(async u=>{
    if(u&&!emailOk(u.email)){await S.api.signOut();S.authMsg={k:'err',t:'Seules les adresses @'+DOMAIN+' sont acceptées.'};return}
    if(u&&await isBlocked(u.email)){await S.api.signOut();S.authMsg={k:'err',t:BLOCKED_MSG};return}
    S.user=u;S.data={progress:{}};
    if(u&&u.verified){try{S.data=(await S.api.load(u.id))||{progress:{}}}catch(e){console.error(e);toast('Impossible de charger votre progression.')}}
    S.ready=true;render();
  });
  window.addEventListener('hashchange',()=>{S.menu=false;render();window.scrollTo(0,0)});
  document.addEventListener('keydown',onKey);
}

/* ================= Connexion (obligatoire) ================= */
function brandBlock(){return `<div class="brand" style="padding:0"><span class="brand-mark">${LOGO}</span><span><b>Guardia_Rev</b><small>Révisions des partiels · GCS1</small></span></div>`}
function msgBlock(){const m=S.authMsg;return `<div class="msg ${m?m.k:''}" id="authMsg" role="alert" ${m?'':'hidden'}>${m?esc(m.t):''}</div>`}
function showMsg(k,t){S.authMsg={k,t};const m=$('#authMsg');if(m){m.className='msg '+k;m.textContent=t;m.hidden=false}else renderAuth()}
function renderAuth(){
  const v=S.authView,demo=S.api.mode==='local';
  if(S.user&&!S.user.verified){
    root.innerHTML=`<div class="auth"><form class="card auth-card fade" id="verifyForm">${brandBlock()}
      <div><h1>Vérifiez votre email</h1><p class="muted" style="margin-top:6px">Un lien de confirmation a été envoyé à <b style="color:var(--ink)">${esc(S.user.email)}</b>. Ouvrez-le (pensez aux spams), puis revenez ici.</p></div>
      ${msgBlock()}<button class="btn primary lg" type="submit">J'ai confirmé mon email</button>
      <div class="row spread"><button class="linkbtn" type="button" id="resend">Renvoyer l'email</button><button class="linkbtn" type="button" id="out">Changer de compte</button></div></form></div>`;
    $('#verifyForm').onsubmit=async e=>{e.preventDefault();const u=await S.api.reload();if(u&&u.verified){S.user=u;S.authMsg=null;try{S.data=(await S.api.load(u.id))||{progress:{}}}catch(_){}render()}else{S.authMsg={k:'err',t:'Email pas encore confirmé. Cliquez sur le lien reçu puis réessayez.'};renderAuth()}};
    $('#resend').onclick=async()=>{try{await S.api.resend();S.authMsg={k:'ok',t:'Email renvoyé.'}}catch(e){S.authMsg={k:'err',t:fr(e).message}}renderAuth()};
    $('#out').onclick=()=>S.api.signOut();return;
  }
  root.innerHTML=`<div class="auth"><div class="card auth-card fade">${brandBlock()}
    <div><h1>${v==='signup'?'Créer un compte':v==='reset'?'Mot de passe oublié':'Se connecter'}</h1>
    <p class="muted small" style="margin-top:4px">Accès réservé aux étudiants Guardia : adresse <b>@${esc(DOMAIN)}</b> obligatoire.</p></div>
    ${v!=='reset'?`<div class="seg" role="tablist"><button type="button" role="tab" aria-selected="${v==='login'}" data-v="login">Connexion</button><button type="button" role="tab" aria-selected="${v==='signup'}" data-v="signup">Créer un compte</button></div>`:''}
    ${msgBlock()}
    <form id="authForm" class="grid" novalidate>
      ${v==='signup'?`<div class="field"><label for="pseudo">Prénom affiché</label><input class="input" id="pseudo" autocomplete="given-name" required maxlength="24" placeholder="Prénom"></div>`:''}
      <div class="field"><label for="email">Email école</label><input class="input" id="email" type="email" autocomplete="email" required placeholder="prenom.nom@${esc(DOMAIN)}"></div>
      ${v!=='reset'?`<div class="field"><label for="pw">Mot de passe</label><div class="pw"><input class="input" id="pw" type="password" autocomplete="${v==='signup'?'new-password':'current-password'}" required minlength="8"><button type="button" id="pwT" aria-label="Afficher le mot de passe" aria-pressed="false">${ic('eye')}</button></div>${v==='signup'?'<span class="hint2">8 caractères minimum.</span>':''}</div>`:''}
      <button class="btn primary lg" type="submit" id="go">${v==='signup'?'Créer mon compte':v==='reset'?'Envoyer le lien':'Se connecter'}</button>
    </form>
    ${v!=='reset'&&S.api.google?`<div class="or">ou</div><button class="btn lg" type="button" id="gBtn">${GLOGO}Continuer avec Google (compte école)</button>`:''}
    <div class="row spread">${v==='login'?'<button class="linkbtn" type="button" data-v="reset">Mot de passe oublié ?</button>':'<button class="linkbtn" type="button" data-v="login">Retour à la connexion</button>'}
      <button class="btn ghost icon" type="button" id="themeA" aria-label="Changer de thème" title="Changer de thème">${ic(isDark()?'sun':'moon')}</button></div>
    ${demo?`<div class="msg" style="background:var(--gold-soft);font-size:12.5px"><b>Mode local</b> : le serveur de comptes n'est pas branché. Votre compte reste dans ce navigateur.</div>`:''}
  </div></div>`;
  $$('[data-v]').forEach(b=>b.onclick=()=>{S.authView=b.dataset.v;S.authMsg=null;renderAuth()});
  $('#themeA').onclick=()=>{toggleTheme();renderAuth()};
  const g=$('#gBtn');if(g)g.onclick=async()=>{g.disabled=true;S.authMsg=null;try{await S.api.google()}catch(err){if(err.code!=='auth/popup-closed-by-user'&&err.code!=='auth/cancelled-popup-request')showMsg('err',fr(err).message);g.disabled=false}};
  const em=$('#email');em.addEventListener('blur',()=>{if(em.value&&!emailOk(em.value))showMsg('err','Seules les adresses @'+DOMAIN+' sont acceptées.')});
  const pt=$('#pwT');if(pt)pt.onclick=()=>{const i=$('#pw'),show=i.type==='password';i.type=show?'text':'password';pt.setAttribute('aria-pressed',String(show));pt.setAttribute('aria-label',show?'Masquer le mot de passe':'Afficher le mot de passe');pt.innerHTML=ic(show?'eyeOff':'eye');i.focus()};
  $('#authForm').onsubmit=async e=>{e.preventDefault();const go=$('#go'),lbl=go.textContent;go.disabled=true;go.textContent=v==='signup'?'Création du compte…':v==='reset'?'Envoi…':'Connexion…';
    try{
      if(v==='signup'){const c=checkSignup(em.value,$('#pw').value,$('#pseudo').value);if(await isBlocked(c.email))throw new Error(BLOCKED_MSG);S.authMsg=null;await S.api.signUp(c.email,$('#pw').value,c.pseudo)}
      else if(v==='reset'){if(!emailOk(em.value))throw new Error('Indiquez votre adresse @'+DOMAIN+'.');await S.api.reset(em.value.trim().toLowerCase());S.authView='login';S.authMsg={k:'ok',t:'Si ce compte existe, un lien de réinitialisation vient d\'être envoyé.'};renderAuth()}
      else{if(!emailOk(em.value))throw new Error('Seules les adresses @'+DOMAIN+' sont acceptées.');if(await isBlocked(em.value))throw new Error(BLOCKED_MSG);S.authMsg=null;await S.api.signIn(em.value.trim().toLowerCase(),$('#pw').value)}
    }catch(err){showMsg('err',(err.code?fr(err):err).message);go.disabled=false;go.textContent=lbl}};
}

/* ================= Mise en page ================= */
function isDark(){const d=document.documentElement;return d.dataset.theme?d.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches}
function toggleTheme(){const d=document.documentElement;d.dataset.theme=isDark()?'light':'dark';try{localStorage.setItem('gr-theme',d.dataset.theme)}catch(e){}}
function route(){const h=(location.hash||'#/').slice(2).split('/').map(x=>{try{return decodeURIComponent(x)}catch(e){return x}});return {page:h[0]||'',id:h[1]||'',sub:h[2]||'',extra:h[3]||''}}
const PAGES=[['','home','Tableau de bord'],['revisions','clock','Révisions du jour'],['partiel','grad','Partiel blanc'],['entrainements','zap','Entraînements'],['lexique','book','Lexique']];
function layout(inner,r){
  const due=totalDue(),wrong=totalWrong(),name=S.user.name||S.user.email.split('@')[0];
  const nav=PAGES.map(([p,i,l])=>`<a href="#/${p}" ${r.page===p?'aria-current="page"':''}>${ic(i)}<span>${l}</span>${p==='revisions'&&(due+wrong)?`<span class="count">${due+wrong}</span>`:''}</a>`).join('');
  const subs=SUBJECTS.map(s=>`<a href="#/m/${s.id}" ${r.page==='m'&&r.id===s.id?'aria-current="page"':''}><span class="dot" style="background:${s.col}"></span><span>${esc(s.name)}</span><span class="pct">${stats(s).pct}%</span></a>`).join('');
  const bn=[['','home','Accueil'],['revisions','clock','Réviser'],['partiel','grad','Partiel'],['entrainements','zap','Entraîner']];
  return `<a class="skip" href="#main" id="skip">Aller au contenu</a><div class="app ${S.menu?'open':''}" id="app">
    <header class="mtop"><button class="btn ghost icon" id="menuBtn" aria-label="Menu">${ic('menu')}</button><a class="brand" href="#/"><span class="brand-mark">${LOGO}</span><b>Guardia_Rev</b></a><button class="btn ghost icon" data-search aria-label="Rechercher">${ic('search')}</button></header>
    <aside class="side" aria-label="Navigation">
      <a class="brand" href="#/"><span class="brand-mark">${LOGO}</span><span><b>Guardia_Rev</b><small>Révisions · GCS1</small></span></a>
      <button class="searchbtn" data-search>${ic('search','sm')}<span>Rechercher…</span><kbd>Ctrl K</kbd></button>
      <nav class="nav">${nav}</nav>
      <div class="nav-h">Matières</div><nav class="nav">${subs}</nav>
      <div class="side-foot"><a href="#/compte" class="avatar" title="Mon compte" style="text-decoration:none">${esc(name.slice(0,1).toUpperCase())}</a>
        <a href="#/compte" class="who" style="text-decoration:none;color:inherit"><b>${esc(name)}</b><span>${esc(S.user.email)}</span></a>
        <button class="btn ghost icon" id="themeB" aria-label="Changer de thème" title="Changer de thème">${ic(isDark()?'sun':'moon')}</button></div>
    </aside>
    ${S.menu?'<div class="scrim" id="scrim"></div>':''}
    <nav class="bnav" aria-label="Navigation principale">${bn.map(([p,i,l])=>`<a href="#/${p}" ${r.page===p?'aria-current="page"':''}>${ic(i)}<span>${l}</span>${p==='revisions'&&(due+wrong)?`<span class="count" aria-label="${due+wrong} à revoir">${due+wrong}</span>`:''}</a>`).join('')}<button type="button" id="bMenu" aria-label="Ouvrir le menu des matières">${ic('menu')}<span>Matières</span></button></nav>
    <main class="main ${S.fadeOn?'fade':''}" id="main" tabindex="-1">${inner}<footer class="credit">Guardia_Rev v${VERSION} · Réalisé par <b>Titan_gp1</b> · ${S.api.mode==='local'?'mode local':'progression synchronisée'}</footer></main>
  </div>`;
}
const AFTER=[];
function render(){
  if(!S.ready)return;
  if(!S.user||!S.user.verified){renderAuth();return}
  S.onKey=null;const r=route();let html;S.fadeOn=S.lastHash!==location.hash;S.lastHash=location.hash;
  try{
    if(r.page==='m'){const s=subj(r.id);html=s?pageSubject(s,r.sub||'cours',r.extra):notFound()}
    else if(r.page==='revisions')html=pageRevisions();
    else if(r.page==='partiel')html=pagePartiel();
    else if(r.page==='entrainements')html=pageDrills(r.id);
    else if(r.page==='lexique')html=pageLexique(r.id);
    else if(r.page==='compte')html=pageAccount();
    else html=pageHome();
  }catch(e){console.error(e);html=notFound()}
  root.innerHTML=layout(html,r);
  $('#themeB').onclick=()=>{toggleTheme();render()};
  $('#menuBtn').onclick=$('#bMenu').onclick=()=>{S.menu=!S.menu;render();if(S.menu){const a=$('.side .nav a');if(a)a.focus()}};
  $('#skip').onclick=e=>{e.preventDefault();$('#main').focus()};
  if(S.fadeOn&&S.rendered&&!S.menu)$('#main').focus({preventScroll:true});S.rendered=true;
  const sc=$('#scrim');if(sc)sc.onclick=()=>{S.menu=false;render()};
  $$('[data-search]').forEach(b=>b.onclick=openPalette);
  AFTER.splice(0).forEach(f=>f());
}
function notFound(){return `<section class="card pad"><h1>Page introuvable</h1><p style="margin-top:8px"><a href="#/">Retour au tableau de bord</a></p></section>`}
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
  const all=SUBJECTS.map(stats),avg=all.length?Math.round(all.reduce((a,b)=>a+b.pct,0)/all.length):0;
  const due=totalDue(),wrong=totalWrong(),st=streak(),act=glob('_act',{}),today=act[dayKey()]||0;
  const exam=glob('_settings',{}).examDate,left=exam?daysBetween(dayKey(),exam):null;
  const days=[...Array(14)].map((_,i)=>addDays(dayKey(),i-13)),max=Math.max(5,...days.map(d=>act[d]||0));
  const weak=SUBJECTS.map((s,i)=>({s,st:all[i]})).sort((a,b)=>a.st.pct-b.st.pct);
  const next=weak.find(w=>w.st.rd<w.st.nf)||weak[0];
  const todo=[];
  if(due)todo.push(['#/revisions','layers',`${plural(due,'carte')} à revoir aujourd'hui`,'Répétition espacée : 5 minutes suffisent']);
  if(wrong)todo.push(['#/revisions','rotate',`${plural(wrong,'question ratée','questions ratées')} à refaire`,'Les QCM se souviennent de vos erreurs']);
  if(next){const i=sp(next.s.id).read.length<next.s.fiche.length?next.s.fiche.findIndex((_,k)=>!sp(next.s.id).read.includes(k)):0;
    todo.push([`#/m/${next.s.id}/cours/${Math.max(0,i)}`,'bookOpen',`Lire : ${next.s.fiche[Math.max(0,i)]?.t||'la fiche'}`,`${next.s.name} · votre matière la moins avancée (${next.st.pct} %)`])}
  todo.push(['#/entrainements/sousreseaux','network','Entraînement sous-réseaux','Masque, réseau, broadcast : à savoir faire sans calculatrice']);
  todo.push(['#/partiel','grad','Partiel blanc chronométré','Questions mélangées de toutes les matières']);
  return `
  <section class="head">
    <div><h1>Bonjour ${esc(S.user.name||'')}</h1>
    <p class="lede">${left!=null&&left>=0?`Plus que <b>${plural(left,'jour')}</b> avant les partiels.`:'Cours, QCM corrigés, cartes et exercices construits à partir de nos cours et des anciens sujets.'}</p></div>
    <div class="row">${exam?'':'<a class="btn" href="#/compte">'+ic('calendar','sm')+'Date des partiels</a>'}<a class="btn primary" href="#/revisions">${ic('clock','sm')}Réviser maintenant</a></div>
  </section>
  <section class="grid g4">
    <div class="card kpi"><div class="k-top">${ic('flame','sm')}Série</div><b>${plural(st,'jour')}</b><span class="s">${st?'Ne cassez pas la série !':'Révisez aujourd\'hui pour la lancer'}</span></div>
    <div class="card kpi"><div class="k-top">${ic('activity','sm')}Aujourd'hui</div><b>${today}</b><span class="s">réponses et cartes</span></div>
    <div class="card kpi"><div class="k-top">${ic('layers','sm')}À revoir</div><b>${due+wrong}</b><span class="s">${plural(due,'carte')} · ${plural(wrong,'erreur')}</span></div>
    <div class="card kpi"><div class="k-top">${ic('target','sm')}Maîtrise</div><b>${avg} %</b><div class="progress" style="margin-top:8px"><i style="width:${avg}%"></i></div></div>
  </section>
  <section class="grid g2">
    <div class="card"><div class="pad-sm row spread" style="border-bottom:1px solid var(--border)"><h3>À faire maintenant</h3></div>
      ${todo.map(([h,i,t,s])=>`<a class="todo" href="${h}"><span class="t-ico">${ic(i,'sm')}</span><span class="t-txt"><b>${esc(t)}</b><span>${esc(s)}</span></span>${ic('chevron','sm')}</a>`).join('')}</div>
    <div class="card pad"><div class="row spread"><h3>Activité sur 14 jours</h3><span class="badge">${days.reduce((n,d)=>n+(act[d]||0),0)} au total</span></div>
      <div class="week" aria-label="Activité des 14 derniers jours">${days.map(d=>`<i class="${act[d]?'':'z'}" style="height:${Math.max(4,Math.round(100*(act[d]||0)/max))}%" title="${d} : ${act[d]||0}"></i>`).join('')}</div>
      <div class="row spread small muted" style="margin-top:6px"><span>il y a 13 j</span><span>aujourd'hui</span></div>
      <p class="small muted" style="margin-top:12px">Raccourcis : <kbd>Ctrl</kbd> <kbd>K</kbd> recherche · <kbd>A</kbd>–<kbd>D</kbd> répondre · <kbd>Entrée</kbd> valider · <kbd>Espace</kbd> retourner une carte.</p></div>
  </section>
  <section><div class="row spread" style="margin-bottom:10px"><h2>Matières</h2><span class="muted small">${SUBJECTS.length} matières</span></div>
  <div class="grid g3">${SUBJECTS.map(subjCard).join('')}</div></section>`;
}
function subjCard(s){const st=stats(s);return `<a class="card subj" href="#/m/${s.id}">
  <div class="row spread">${subjIco(s)}<span class="badge ${st.pct>=75?'ok':st.pct>=40?'gold':''}">${st.pct} %</span></div>
  <div><h3>${esc(s.name)}</h3><p style="margin-top:4px">${esc(s.short)}</p></div>
  <div class="progress"><i style="width:${st.pct}%;background:${s.col}"></i></div>
  <div class="meta"><span>${st.rd}/${st.nf} fiches lues</span><span>QCM ${st.runs?st.best+' %':'—'}</span><span>${st.mast}/${st.nc} cartes</span></div></a>`}

/* ================= Matière ================= */
function pageSubject(s,tab,extra){
  const st=stats(s);
  const tabs=[['cours','bookOpen','Cours',s.fiche.length],['qcm','circleCheck','QCM',s.quiz.length],['cartes','layers','Cartes',s.cards.length],['exos','pencil','Exercices',s.exos.length]];
  let body;if(tab==='qcm')body=quizView(s);else if(tab==='cartes')body=cardsView(s);else if(tab==='exos')body=exosView(s);else body=ficheView(s,extra);
  return `<section class="card pad grid" style="gap:14px">
    <div class="head"><div class="row" style="gap:14px;flex-wrap:nowrap">${subjIco(s,44)}<div><p class="eyebrow" style="margin:0">${esc(s.exam||'Matière')}</p><h1>${esc(s.name)}</h1></div></div>
      <div class="row"><span class="badge ${st.pct>=75?'ok':'blue'}">${st.pct} % maîtrisé</span>${tab==='cours'?`<button class="btn sm no-print" id="print">${ic('printer','sm')}Imprimer</button>`:''}</div></div>
    ${s.intro?`<p class="muted">${s.intro}</p>`:''}
    <nav class="tabs">${tabs.map(([k,i,l,n])=>`<a href="#/m/${s.id}/${k}" ${tab===k?'aria-current="page"':''}>${ic(i,'sm')}${l}<span class="badge" style="height:18px;padding:0 6px">${n}</span></a>`).join('')}</nav>
  </section>${body}`+(AFTER.push(()=>{const p=$('#print');if(p)p.onclick=()=>window.print()}),'');
}

/* ---------- Cours ---------- */
function ficheView(s,extra){
  const p=sp(s.id);
  AFTER.push(()=>{
    $$('.toc a').forEach(a=>a.onclick=e=>{e.preventDefault();const t=document.getElementById(a.dataset.t);if(t)t.scrollIntoView({behavior:'smooth'})});
    $$('[data-read]').forEach(b=>b.onclick=()=>{const i=+b.dataset.read,set=new Set(p.read);if(set.has(i))set.delete(i);else{set.add(i);bump()}p.read=[...set];saveSoon();
      const y=window.scrollY;render();window.scrollTo(0,y)});
    if(extra!==''){const t=document.getElementById(s.id+'-f'+extra);if(t)setTimeout(()=>t.scrollIntoView({block:'start'}),30)}
  });
  return `<div class="fiche">
    <nav class="card toc no-print" aria-label="Sommaire"><div class="small muted" style="padding:4px 8px 6px;font-weight:600">${p.read.length}/${s.fiche.length} sections lues</div>
      ${s.fiche.map((f,i)=>`<a href="#" data-t="${s.id}-f${i}" class="${p.read.includes(i)?'read':''}"><span class="tick">${p.read.includes(i)?ic('check','sm'):''}</span>${esc(f.t)}</a>`).join('')}</nav>
    <div>${s.fiche.map((f,i)=>`<article class="card pad sec" id="${s.id}-f${i}"><h2><span class="num" aria-hidden="true">${pad2(i+1)}</span>${esc(f.t)}</h2>${f.h}
      <div class="sec-foot"><button class="btn sm ${p.read.includes(i)?'':'primary'}" data-read="${i}">${p.read.includes(i)?ic('check','sm')+'Lu':'Marquer comme lu'}</button></div></article>`).join('')}
    <div class="card pad row spread no-print" style="margin-top:14px"><span>Fiche lue ? Passez à la pratique.</span><span class="row"><a class="btn" href="#/m/${s.id}/cartes">${ic('layers','sm')}Cartes</a><a class="btn primary" href="#/m/${s.id}/qcm">${ic('circleCheck','sm')}Faire le QCM</a></span></div></div>
  </div>`;
}

/* ---------- QCM ---------- */
let QZ=null;
function startQuiz(list,o){QZ={list:list.map(q=>({...q,order:shuffle(q.o.map((_,i)=>i))})),i:0,answers:[],picked:new Set(),done:false,ctx:o.ctx,title:o.title||'QCM',timer:o.timer||0,t0:Date.now(),retry:!!o.retry,subjects:o.subjects||null}}
function quizView(s){
  const ctx='subject:'+s.id;if(QZ&&QZ.ctx===ctx)return quizBody();
  const st=stats(s),wrong=sp(s.id).wrong.map(id=>QINDEX.get(id)).filter(Boolean);
  AFTER.push(()=>{$$('[data-n]').forEach(b=>b.onclick=()=>{startQuiz(shuffle(s.quiz).slice(0,+b.dataset.n),{ctx,title:'QCM · '+s.name});render()});
    const w=$('#qWrongS');if(w)w.onclick=()=>{startQuiz(shuffle(wrong),{ctx,title:'Mes erreurs · '+s.name,retry:true});render()}});
  return `<section class="card pad grid">
    <div class="head"><div><h2>QCM · ${esc(s.name)}</h2><p class="muted" style="margin-top:4px">${s.quiz.length} questions, ordre aléatoire. Certaines ont <b>plusieurs bonnes réponses</b>, comme au partiel.</p></div>
      ${st.runs?`<span class="badge ${st.best>=80?'ok':'gold'}">Meilleur score ${st.best} %</span>`:''}</div>
    <div class="row">${[10,20].filter(n=>n<s.quiz.length).map(n=>`<button class="btn" data-n="${n}">${n} questions</button>`).join('')}<button class="btn primary" data-n="${s.quiz.length}">Toutes (${s.quiz.length})</button>
      ${wrong.length?`<button class="btn gold" id="qWrongS">${ic('rotate','sm')}Mes erreurs (${wrong.length})</button>`:''}</div>
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
    ${ans?`<div class="expl ${ans.ok?'ok':'bad'}"><b>${ans.ok?'Bonne réponse.':'Pas tout à fait.'}</b> ${q.e||''}</div>
      <div class="row" style="justify-content:flex-end"><span class="muted small">Entrée ↵</span><button class="btn primary" id="qNext">${z.i+1<z.list.length?'Question suivante':'Voir le résultat'}${ic('arrow','sm')}</button></div>`
      :(multi?`<div class="row" style="justify-content:flex-end"><button class="btn primary" id="qValid" ${z.picked.size?'':'disabled'}>Valider</button></div>`:'')}
  </section>`;
}
function bindQuiz(){
  const z=QZ;if(!z||z.done)return;const q=z.list[z.i];
  $('#qQuit').onclick=()=>{if(z.answers.length&&!confirm('Quitter ce QCM ? Les réponses données sont perdues.'))return;QZ=null;clearInterval(TT);render()};
  $$('.opt').forEach(b=>b.onclick=()=>choose(+b.dataset.o));
  const v=$('#qValid');if(v)v.onclick=answer;
  const n=$('#qNext');if(n)n.onclick=nextQ;
  S.onKey=e=>{const k=e.key.toLowerCase();const idx='abcdef'.indexOf(k)>=0?'abcdef'.indexOf(k):'123456'.indexOf(k);
    if(idx>=0&&idx<q.order.length&&!z.answers[z.i]){e.preventDefault();choose(q.order[idx])}
    else if(e.key==='Enter'){e.preventDefault();if(z.answers[z.i])nextQ();else if(z.picked.size&&q.a.length>1)answer()}};
  if(z.timer)tickTimer();
}
function choose(oi){const z=QZ,q=z.list[z.i];if(z.answers[z.i])return;if(q.a.length>1){z.picked.has(oi)?z.picked.delete(oi):z.picked.add(oi);render()}else{z.picked=new Set([oi]);answer()}}
function answer(){const z=QZ,q=z.list[z.i],picked=[...z.picked];const ok=picked.length===q.a.length&&picked.every(p=>q.a.includes(p));z.answers[z.i]={picked,ok};bump();
  if(z.ctx==='partiel'){nextQ();return}render()}
function nextQ(){const z=QZ;z.i++;z.picked=new Set();if(z.i>=z.list.length)finishQuiz();render();window.scrollTo(0,0)}
let TT=null;
function tickTimer(){clearInterval(TT);if(!QZ||!QZ.timer)return;const upd=()=>{if(!QZ||QZ.done){clearInterval(TT);return}
  const left=Math.max(0,QZ.timer*60-Math.floor((Date.now()-QZ.t0)/1000));const e=$('#qTimer');if(e)e.innerHTML=`${ic('clock','sm')} ${Math.floor(left/60)}:${pad2(left%60)}`;
  if(left<=0){clearInterval(TT);finishQuiz();render();toast('Temps écoulé !')}};upd();TT=setInterval(upd,1000)}
function finishQuiz(){const z=QZ;if(z.done)return;z.done=true;clearInterval(TT);
  const good=z.answers.filter(a=>a&&a.ok).length,pct=Math.round(100*good/z.list.length);z.score={good,pct};
  z.list.forEach((q,i)=>{const p=sp(q.sid),w=new Set(p.wrong);(z.answers[i]&&z.answers[i].ok)?w.delete(q.id):w.add(q.id);p.wrong=[...w]});
  if(z.ctx.startsWith('subject:')&&!z.retry){const p=sp(z.ctx.slice(8));p.quizRuns=(p.quizRuns||0)+1;if(z.list.length>=5)p.quizBest=Math.max(p.quizBest||0,pct)}
  if(z.ctx==='partiel'){const h=glob('_partiels',[]);h.unshift({at:Date.now(),pct,n:z.list.length});h.splice(12)}
  saveSoon()}
function quizResult(){
  const z=QZ,{good,pct}=z.score,mention=pct>=90?'Excellent':pct>=75?'Très bien':pct>=50?'Encore un effort':'À retravailler';
  const wrongQs=z.list.filter((q,i)=>!(z.answers[i]&&z.answers[i].ok));
  const by={};z.list.forEach((q,i)=>{by[q.sid]=by[q.sid]||[0,0];by[q.sid][1]++;if(z.answers[i]&&z.answers[i].ok)by[q.sid][0]++});
  AFTER.push(()=>{$('#qAgain').onclick=()=>{QZ=null;render()};
    const w=$('#qWrong');if(w)w.onclick=()=>{startQuiz(shuffle(wrongQs),{ctx:z.ctx==='partiel'?'errors':z.ctx,title:'Mes erreurs',retry:true});if(z.ctx==='partiel')location.hash='#/revisions';render()}});
  return `<section class="card pad result">
    <p class="eyebrow">${esc(z.title)}</p><div class="score" style="color:${pct>=75?'var(--ok)':pct>=50?'var(--gold)':'var(--bad)'}">${pct} %</div><h2>${mention}</h2>
    <p class="muted">${good} bonne${good>1?'s':''} réponse${good>1?'s':''} sur ${z.list.length}</p>
    <div class="row" style="justify-content:center">${wrongQs.length?`<button class="btn gold" id="qWrong">${ic('rotate','sm')}Refaire mes ${wrongQs.length} erreurs</button>`:''}<button class="btn primary" id="qAgain">Nouveau QCM</button></div>
    ${Object.keys(by).length>1?`<div class="tbl" style="width:100%;text-align:left"><table><tr><th>Matière</th><th>Score</th></tr>${Object.entries(by).map(([sid,[g,t]])=>`<tr><td>${esc(subj(sid).name)}</td><td><b>${g}/${t}</b> <span class="muted">(${Math.round(100*g/t)} %)</span></td></tr>`).join('')}</table></div>`:''}
    <div class="review"><h3 style="margin-top:8px">Correction détaillée</h3>${z.list.map((q,i)=>{const a=z.answers[i];return `<div class="it">
      <div class="row" style="flex-wrap:nowrap;align-items:flex-start"><span class="badge ${a&&a.ok?'ok':'bad'}">${a&&a.ok?'Juste':'Faux'}</span><b>${esc(q.q)}</b></div>
      <p class="small" style="margin-top:6px">Réponse : <b>${q.a.map(x=>esc(q.o[x])).join(' · ')}</b>${a&&!a.ok&&a.picked.length?` <span class="muted">(vous : ${a.picked.map(x=>esc(q.o[x])).join(' · ')})</span>`:''}</p>
      ${q.e?`<p class="small muted" style="margin-top:4px">${q.e}</p>`:''}</div>`}).join('')}</div>
  </section>`;
}

/* ---------- Cartes (répétition espacée) ---------- */
let FC=null;
function buildDeck(sids,cram){let due=[],fresh=[];
  sids.forEach(sid=>{const s=subj(sid);if(cram){s.cards.forEach((_,i)=>due.push({sid,i}));return}
    dueList(sid).forEach(i=>due.push({sid,i}));newList(sid).forEach(i=>fresh.push({sid,i}))});
  return shuffle(due).concat(shuffle(fresh).slice(0,cram?0:(sids.length>1?10:15)))}
function rate(ok){const it=FC.items[FC.i];const p=sp(it.sid),c=p.srs[it.i]||{b:0};
  if(ok){c.b=Math.min(5,c.b+1);c.due=addDays(dayKey(),INT[c.b])}else{c.b=1;c.due=dayKey();FC.items.push(it);FC.again++}
  p.srs[it.i]=c;FC.i++;FC.flip=false;FC.done++;bump();render()}
function cardsBody(back){
  const it=FC.items[FC.i];
  if(!it)return `<section class="card pad result"><div class="score" style="color:var(--ok)">${ic('circleCheck','lg')}</div><h2>Session terminée</h2>
    <p class="muted">${plural(FC.done,'carte')} révisée${FC.done>1?'s':''}. Les cartes reviendront au bon moment : demain, dans 2 jours, 4 jours…</p>
    <div class="row" style="justify-content:center"><button class="btn" id="cCram">Tout revoir quand même</button><a class="btn primary" href="${back}">Terminer</a></div></section>`;
  const s=subj(it.sid),c=s.cards[it.i],st=cardState(it.sid,it.i);
  return `<section class="card pad grid">
    <div class="row spread"><span class="row"><span class="badge blue">${FC.i+1} / ${FC.items.length}</span>${st?`<span class="badge">Boîte ${st.b}</span>`:'<span class="badge gold">Nouvelle</span>'}${FC.multi?`<span class="badge">${esc(s.name)}</span>`:''}</span>
      <button class="btn ghost sm" id="cQuit">${ic('x','sm')}Quitter</button></div>
    <div class="card-wrap"><div class="flash ${FC.flip?'flip':''}" id="flash" tabindex="0" role="button" aria-label="Retourner la carte">
      <div class="face"><small>Question</small><div>${c[0]}</div></div>
      <div class="face back"><small>Réponse</small><div>${c[1]}</div></div></div></div>
    <p class="muted small" style="text-align:center">${FC.flip?'Vous saviez ? <kbd>1</kbd> à revoir · <kbd>2</kbd> je savais':'Cliquez ou <kbd>Espace</kbd> pour retourner la carte'}</p>
    <div class="row" style="justify-content:center"><button class="btn lg" id="cNo" ${FC.flip?'':'disabled'}>${ic('rotate','sm')}À revoir</button><button class="btn primary lg" id="cYes" ${FC.flip?'':'disabled'}>${ic('check','sm')}Je savais</button></div>
  </section>`;
}
function bindCards(){
  const f=$('#flash');if(f){const flip=()=>{FC.flip=!FC.flip;render()};f.onclick=flip}
  const y=$('#cYes');if(y)y.onclick=()=>rate(true);const n=$('#cNo');if(n)n.onclick=()=>rate(false);
  const q=$('#cQuit');if(q)q.onclick=()=>{FC=null;render()};
  const cr=$('#cCram');if(cr)cr.onclick=()=>{FC={...FC,items:buildDeck(FC.sids,true),i:0,flip:false,done:0,again:0};render()};
  S.onKey=e=>{if(!FC||!FC.items[FC.i])return;if(e.key===' '||e.key==='Enter'){e.preventDefault();if(!FC.flip){FC.flip=true;render()}else rate(true)}
    else if(FC.flip&&(e.key==='1'||e.key==='ArrowLeft'))rate(false);else if(FC.flip&&(e.key==='2'||e.key==='ArrowRight'))rate(true)};
}
function boxesHtml(sids){const b=[0,0,0,0,0,0];let fresh=0;sids.forEach(sid=>subj(sid).cards.forEach((_,i)=>{const c=cardState(sid,i);c?b[c.b]++:fresh++}));
  return `<div class="boxes"><div><b>${fresh}</b>nouvelles</div><div><b>${b[1]+b[0]}</b>boîte 1</div><div><b>${b[2]}</b>boîte 2</div><div><b>${b[3]+b[4]}</b>boîtes 3-4</div><div><b>${b[5]}</b>maîtrisées</div></div>`}
function cardsView(s){
  if(FC&&FC.key===s.id){AFTER.push(bindCards);return cardsBody('#/m/'+s.id+'/cartes')}
  const due=dueList(s.id).length,nw=newList(s.id).length;
  AFTER.push(()=>{$('#cStart').onclick=()=>{FC={key:s.id,sids:[s.id],items:buildDeck([s.id],false),i:0,flip:false,done:0,again:0};if(!FC.items.length)FC.items=buildDeck([s.id],true);render()}});
  return `<section class="card pad grid">
    <div class="head"><div><h2>Cartes · ${esc(s.name)}</h2><p class="muted" style="margin-top:4px">Répétition espacée : une carte sue revient de plus en plus tard (1, 2, 4, 8, 16 jours) ; une carte ratée revient tout de suite.</p></div></div>
    ${boxesHtml([s.id])}
    <div class="row"><button class="btn primary lg" id="cStart">${ic('layers','sm')}${due||nw?`Commencer (${due} à revoir · ${Math.min(nw,15)} nouvelles)`:'Tout revoir'}</button><a class="btn lg" href="#/lexique/${encodeURIComponent(s.id)}">${ic('list','sm')}Voir la liste</a></div>
  </section>`;
}

/* ---------- Exercices ---------- */
function exosView(s){
  const p=sp(s.id);
  AFTER.push(()=>{$$('[data-exo]').forEach(b=>b.onclick=()=>{const i=+b.dataset.exo,set=new Set(p.exos);if(set.has(i))set.delete(i);else{set.add(i);bump()}p.exos=[...set];saveSoon();const y=scrollY;render();scrollTo(0,y)});
    $$('textarea[data-draft]').forEach(t=>{const k='gr-draft-'+S.user.id+'-'+t.dataset.draft;t.value=store.get(k,'');t.oninput=()=>store.set(k,t.value)})});
  return `<section class="card pad-sm tip" style="margin:0">${ic('pencil','sm')} Rédigez votre réponse dans le cadre (elle reste dans ce navigateur), <b>puis</b> ouvrez le corrigé. Les exercices <span class="badge gold">ancien partiel</span> reprennent les sujets des années précédentes.</section>
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
  if(QZ&&QZ.ctx==='errors')return `<section class="head"><div><p class="eyebrow">Révisions du jour</p><h1>Mes erreurs</h1></div></section>`+quizBody();
  if(FC&&FC.key==='_all'){AFTER.push(bindCards);return `<section class="head"><div><p class="eyebrow">Révisions du jour</p><h1>Cartes à revoir</h1></div></section>`+cardsBody('#/revisions')}
  const due=totalDue(),wrong=totalWrong(),nw=SUBJECTS.reduce((n,s)=>n+newList(s.id).length,0);
  const wrongQs=SUBJECTS.flatMap(s=>sp(s.id).wrong.map(id=>QINDEX.get(id)).filter(Boolean));
  AFTER.push(()=>{$('#rCards').onclick=()=>{const ids=SUBJECTS.map(s=>s.id);FC={key:'_all',multi:true,sids:ids,items:buildDeck(ids,false),i:0,flip:false,done:0,again:0};render()};
    const w=$('#rWrong');if(w)w.onclick=()=>{startQuiz(shuffle(wrongQs).slice(0,30),{ctx:'errors',title:'Mes erreurs',retry:true});render()};
    $('#rExpress').onclick=()=>{startQuiz(shuffle(SUBJECTS.flatMap(s=>s.quiz)).slice(0,10),{ctx:'errors',title:'QCM express'});render()}});
  return `<section class="head"><div><h1>Révisions du jour</h1><p class="lede">Un quart d'heure par jour vaut mieux qu'une nuit blanche la veille : les cartes et les erreurs reviennent quand il faut.</p></div></section>
  <section class="grid g3">
    <div class="card pad grid"><div class="row">${ic('layers')}<h3>Cartes à revoir</h3></div><b style="font-family:var(--f-display);font-size:34px">${due}</b>
      <p class="muted small">${due?'Cartes dont la date de révision est arrivée, toutes matières.':'Rien d\'échu. '+(nw?nw+' nouvelles cartes à découvrir.':'')}</p>
      <button class="btn primary" id="rCards">${due?'Réviser maintenant':'Découvrir 10 nouvelles cartes'}</button></div>
    <div class="card pad grid"><div class="row">${ic('rotate')}<h3>Mes erreurs</h3></div><b style="font-family:var(--f-display);font-size:34px">${wrong}</b>
      <p class="muted small">Questions ratées dans les QCM. Une bonne réponse les retire de la liste.</p>
      <button class="btn gold" id="rWrong" ${wrong?'':'disabled'}>Refaire mes erreurs</button></div>
    <div class="card pad grid"><div class="row">${ic('zap')}<h3>QCM express</h3></div><b style="font-family:var(--f-display);font-size:34px">10</b>
      <p class="muted small">Dix questions au hasard dans toutes les matières, avec correction immédiate.</p>
      <button class="btn" id="rExpress">Lancer</button></div>
  </section>
  <section class="card pad"><h3 style="margin-bottom:10px">Répartition des cartes</h3>${boxesHtml(SUBJECTS.map(s=>s.id))}</section>`;
}

/* ================= Partiel blanc ================= */
let PB={sel:new Set(SUBJECTS.map(s=>s.id)),n:30,timer:30};
function pagePartiel(){
  if(QZ&&QZ.ctx==='partiel')return `<section class="head"><div><p class="eyebrow">Partiel blanc</p><h1>${esc(QZ.title)}</h1></div></section>`+quizBody();
  const hist=glob('_partiels',[]);
  AFTER.push(()=>{$$('[data-ps]').forEach(c=>c.onchange=()=>{c.checked?PB.sel.add(c.dataset.ps):PB.sel.delete(c.dataset.ps);$('#pbGo').disabled=!PB.sel.size});
    $('#pbN').onchange=e=>PB.n=+e.target.value;$('#pbT').onchange=e=>PB.timer=+e.target.value;
    $('#pbGo').onclick=()=>{const pool=SUBJECTS.filter(s=>PB.sel.has(s.id)).flatMap(s=>s.quiz);
      startQuiz(shuffle(pool).slice(0,PB.n),{ctx:'partiel',title:'Partiel blanc · '+Math.min(PB.n,pool.length)+' questions',timer:PB.timer});render()}});
  return `<section class="head"><div><h1>Partiel blanc</h1><p class="lede">Questions tirées au hasard, chrono, et <b>aucune correction avant la fin</b> : comme le jour J.</p></div></section>
  <section class="card pad grid">
    <h3>Matières</h3>
    <div class="grid g3">${SUBJECTS.map(s=>`<label class="check"><input type="checkbox" data-ps="${s.id}" ${PB.sel.has(s.id)?'checked':''}><span class="dot" style="width:8px;height:8px;border-radius:3px;background:${s.col}"></span><span>${esc(s.name)} <span class="muted small">(${s.quiz.length})</span></span></label>`).join('')}</div>
    <div class="row">
      <label class="row small" style="font-weight:600">Questions <select id="pbN" class="select">${[10,20,30,40,60].map(n=>`<option ${PB.n===n?'selected':''}>${n}</option>`).join('')}</select></label>
      <label class="row small" style="font-weight:600">Durée <select id="pbT" class="select">${[[0,'sans chrono'],[10,'10 min'],[20,'20 min'],[30,'30 min'],[45,'45 min'],[60,'1 h']].map(([v,l])=>`<option value="${v}" ${PB.timer===v?'selected':''}>${l}</option>`).join('')}</select></label>
      <button class="btn primary lg" id="pbGo">${ic('grad','sm')}Commencer</button></div>
  </section>
  ${hist.length?`<section class="card pad"><h3>Mes derniers partiels blancs</h3><div class="tbl"><table><tr><th>Date</th><th>Questions</th><th>Score</th></tr>${hist.map(h=>`<tr><td>${new Date(h.at).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})}</td><td>${h.n}</td><td><b>${h.pct} %</b></td></tr>`).join('')}</table></div></section>`:''}`;
}

/* ================= Entraînements ================= */
const D={};
function drillSave(k,ok){const d=glob('_drills',{});d[k]=d[k]||{ok:0,n:0,best:0};d[k].n++;if(ok)d[k].ok++;bump()}
function pageDrills(id){
  const list=[['sousreseaux','network','Sous-réseaux','Masque, adresse réseau, broadcast, plage et nombre d\'hôtes à partir d\'une IP/CIDR.'],
    ['ports','plug','Ports','Le numéro de port de chaque service (AD, web, Squid, Wazuh…).'],
    ['osi','layers','Modèle OSI','Remettre les couches dans l\'ordre et placer chaque protocole.'],
    ['commandes','terminal','Commandes','Linux, Git, Windows, Docker, Squid : la bonne commande pour chaque tâche.']];
  const dr=glob('_drills',{});
  const head=`<section class="head"><div><h1>Entraînements</h1><p class="lede">Des exercices générés à l'infini sur ce qui tombe à coup sûr : calculs d'adressage, ports, couches OSI et commandes.</p></div></section>
  <nav class="tabs">${list.map(([k,i,l])=>`<a href="#/entrainements/${k}" ${id===k?'aria-current="page"':''}>${ic(i,'sm')}${l}</a>`).join('')}</nav>`;
  if(id==='sousreseaux')return head+drillSubnet();
  if(id==='ports')return head+drillPorts();
  if(id==='osi')return head+drillOsi();
  if(id==='commandes')return head+drillCmd();
  return head+`<section class="grid g2">${list.map(([k,i,l,d])=>{const x=dr[k];return `<a class="card subj" href="#/entrainements/${k}"><div class="row spread"><span class="subj-ico" style="background:var(--ink)">${ic(i)}</span>${x?`<span class="badge">${x.ok}/${x.n} justes</span>`:''}</div><div><h3>${l}</h3><p style="margin-top:4px">${d}</p></div></a>`}).join('')}</section>`;
}
/* --- Sous-réseaux --- */
const ip2s=n=>[n>>>24,(n>>>16)&255,(n>>>8)&255,n&255].join('.');
function genSubnet(){const r=pick(['10','172','192','192','192']);let ip,cidr;
  if(r==='10'){ip=(10<<24>>>0)+rnd(0,0xFFFFFF);cidr=pick([8,16,20,22,24,26,27])}
  else if(r==='172'){ip=((172<<24)>>>0)+((rnd(16,31))<<16)+rnd(0,0xFFFF);cidr=pick([16,20,22,23,24,25,26,28])}
  else{ip=((192<<24)>>>0)+(168<<16)+rnd(0,0xFFFF);cidr=pick([24,24,25,26,26,27,27,28,29,30])}
  ip>>>=0;const mask=cidr===0?0:(0xFFFFFFFF<<(32-cidr))>>>0,net=(ip&mask)>>>0,bc=(net|(~mask>>>0))>>>0;
  return {ip:ip2s(ip),cidr,ans:{mask:ip2s(mask),net:ip2s(net),bc:ip2s(bc),first:ip2s(net+1),last:ip2s(bc-1),hosts:String(Math.pow(2,32-cidr)-2)}}}
function drillSubnet(){
  if(!D.sub)D.sub={q:genSubnet(),checked:false,vals:{}};const z=D.sub,F=[['mask','Masque décimal'],['net','Adresse réseau'],['bc','Broadcast'],['first','Première adresse utilisable'],['last','Dernière adresse utilisable'],['hosts','Nombre d\'hôtes']];
  AFTER.push(()=>{const go=()=>{F.forEach(([k])=>z.vals[k]=$('#s-'+k).value.trim());z.checked=true;const ok=F.every(([k])=>z.vals[k]===z.q.ans[k]);drillSave('sousreseaux',ok);render()};
    const sc=$('#sCheck');if(sc)sc.onclick=go;$('#sNew').onclick=()=>{D.sub=null;render();setTimeout(()=>$('#s-mask')&&$('#s-mask').focus(),0)};
    const ss=$('#sShow');if(ss)ss.onclick=()=>{F.forEach(([k])=>z.vals[k]=z.q.ans[k]);z.checked=true;z.shown=true;render()};
    $$('.drill .input').forEach(i=>i.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();z.checked?$('#sNew').click():go()}});
    if(!z.checked)setTimeout(()=>{const f=$('#s-mask');if(f&&document.activeElement===document.body)f.focus()},0)});
  const all=z.checked&&F.every(([k])=>z.vals[k]===z.q.ans[k]);
  return `<section class="card pad drill">
    <div class="row spread"><div><p class="muted small">Adresse à analyser</p><div class="big-q">${z.q.ip}/${z.q.cidr}</div></div>${z.checked?`<span class="badge ${all&&!z.shown?'ok':'bad'}">${z.shown?'Solution affichée':all?'Tout est juste !':'Il y a des erreurs'}</span>`:''}</div>
    <div class="grid g3">${F.map(([k,l])=>{const v=z.vals[k]||'',st=z.checked?(v===z.q.ans[k]?'ok':'bad'):'';return `<div class="field"><label for="s-${k}">${l}</label><input class="input ${st}" id="s-${k}" value="${esc(v)}" inputmode="decimal" autocomplete="off" ${z.checked?'readonly':''}>${z.checked&&st==='bad'?`<span class="small" style="color:var(--ok)">→ ${z.q.ans[k]}</span>`:''}</div>`}).join('')}</div>
    <div class="row">${z.checked?'':'<button class="btn primary" id="sCheck">Vérifier</button><button class="btn ghost" id="sShow">Voir la solution</button>'}<button class="btn ${z.checked?'primary':''}" id="sNew">${ic('rotate','sm')}Nouvelle adresse</button></div>
    <details class="tip" style="margin:0"><summary style="cursor:pointer;font-weight:600">Méthode</summary><div class="sec small" style="margin-top:6px">
      <p>1. Bits hôtes = 32 − CIDR ; nombre d'adresses du bloc = 2<sup>bits hôtes</sup> ; hôtes = bloc − 2.</p>
      <p>2. Dans l'octet « coupé », le <b>pas</b> = 256 − valeur du masque dans cet octet (/26 → masque .192 → pas de 64).</p>
      <p>3. Adresse réseau = le multiple du pas juste en dessous de l'IP ; broadcast = réseau + pas − 1 ; première = réseau + 1 ; dernière = broadcast − 1.</p></div></details>
  </section>`;
}
/* --- Ports --- */
const PORTS=[['FTP (commande)',['21']],['SSH',['22']],['Telnet',['23']],['SMTP',['25']],['DNS',['53']],['DHCP (serveur)',['67']],['DHCP (client)',['68']],['HTTP',['80']],['Kerberos',['88']],['POP3',['110']],['NTP',['123']],['RPC Endpoint Mapper',['135']],['IMAP',['143']],['SNMP',['161']],['LDAP',['389']],['HTTPS',['443']],['SMB',['445']],['Kerberos (changement de mot de passe)',['464']],['Syslog',['514']],['LDAPS',['636']],['Wazuh (agent → manager)',['1514']],['Wazuh (enrôlement des agents)',['1515']],['Squid (proxy)',['3128']],['Catalogue global AD',['3268']],['MySQL',['3306']],['RDP (bureau à distance)',['3389']],['Webmin',['10000']]];
function drillPorts(){
  if(!D.port)D.port={q:pick(PORTS),ans:null,streak:0};const z=D.port,best=(glob('_drills',{}).ports||{}).best||0;
  AFTER.push(()=>{const inp=$('#pIn');const go=()=>{if(z.ans!=null){z.q=pick(PORTS.filter(p=>p!==z.q));z.ans=null;render();return}
      const v=inp.value.trim();if(!v)return;z.ans=v;const ok=z.q[1].includes(v);z.streak=ok?z.streak+1:0;drillSave('ports',ok);const d=glob('_drills',{});d.ports.best=Math.max(d.ports.best||0,z.streak);render()};
    $('#pGo').onclick=go;if(inp){inp.onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();go()}};inp.focus()}
    S.onKey=e=>{if(e.key==='Enter'&&z.ans!=null){e.preventDefault();go()}}});
  const ok=z.ans!=null&&z.q[1].includes(z.ans);
  return `<section class="card pad drill">
    <div class="row spread"><span class="row"><span class="badge blue">${ic('flame','sm')} Série ${z.streak}</span><span class="badge">Record ${best}</span></span></div>
    <p class="muted small">Quel est le port de…</p><div class="big-q" style="font-family:var(--f-display)">${esc(z.q[0])}</div>
    <div class="row"><input class="input ${z.ans!=null?(ok?'ok':'bad'):''}" id="pIn" inputmode="numeric" autocomplete="off" placeholder="ex. 443" style="width:160px" value="${z.ans!=null?esc(z.ans):''}" ${z.ans!=null?'readonly':''}>
      <button class="btn primary" id="pGo">${z.ans!=null?'Suivant':'Vérifier'}</button>
      ${z.ans!=null?`<span class="badge ${ok?'ok':'bad'}">${ok?'Juste':'Réponse : '+z.q[1].join(' ou ')}</span>`:''}</div>
  </section>
  <section class="card pad"><details><summary style="cursor:pointer;font-weight:600">Voir le tableau complet</summary><div class="tbl"><table><tr><th>Service</th><th>Port</th></tr>${PORTS.map(p=>`<tr><td>${esc(p[0])}</td><td><code>${p[1].join(', ')}</code></td></tr>`).join('')}</table></div></details></section>`;
}
/* --- OSI --- */
const OSI=['Physique','Liaison de données','Réseau','Transport','Session','Présentation','Application'];
const OSIQ=[['HTTP',7],['DNS',7],['SSH',7],['SMTP',7],['LDAP',7],['TLS (chiffrement)',6],['JPEG / encodage ASCII',6],['RPC',5],['NetBIOS (session)',5],['TCP',4],['UDP',4],['Les ports 80 et 443',4],['IP',3],['ICMP (ping)',3],['Routeur',3],['Switch',2],['Adresse MAC',2],['Ethernet',2],['VLAN (802.1Q)',2],['Câble, fibre, Wi-Fi (signal)',1],['Hub',1]];
function drillOsi(){
  if(!D.osi)D.osi={order:shuffle(OSI.map((_,i)=>i)),next:0,err:0,q:pick(OSIQ),ans:null};const z=D.osi;
  AFTER.push(()=>{$$('[data-layer]').forEach(b=>b.onclick=()=>{const i=+b.dataset.layer;if(i===z.next){z.next++;if(z.next===7){drillSave('osi',z.err===0)}}else{z.err++;b.animate&&b.animate([{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'none'}],{duration:180})}render()});
    $('#oReset').onclick=()=>{D.osi={...z,order:shuffle(OSI.map((_,i)=>i)),next:0,err:0};render()};
    $$('[data-ol]').forEach(b=>b.onclick=()=>{if(z.ans!=null){z.q=pick(OSIQ.filter(x=>x!==z.q));z.ans=null}else{z.ans=+b.dataset.ol;drillSave('osi',z.ans===z.q[1])}render()});
    const n=$('#oNext');if(n)n.onclick=()=>{z.q=pick(OSIQ.filter(x=>x!==z.q));z.ans=null;render()};
    S.onKey=e=>{if(/^[1-7]$/.test(e.key)&&z.ans==null){z.ans=+e.key;drillSave('osi',z.ans===z.q[1]);render()}else if(e.key==='Enter'&&z.ans!=null){z.q=pick(OSIQ.filter(x=>x!==z.q));z.ans=null;render()}}});
  return `<section class="grid g2">
  <div class="card pad drill"><h3>Remettre les couches dans l'ordre</h3><p class="muted small">Cliquez de la couche <b>1</b> (en bas) à la couche <b>7</b>. ${z.err?`<span style="color:var(--bad)">${plural(z.err,'erreur')}</span>`:''}</p>
    <div class="osi">${z.order.map(i=>{const done=i<z.next;return `<button class="btn ${done?'primary':''}" data-layer="${i}" ${done?'disabled':''}>${done?`<b>${i+1}</b> · `:''}${OSI[i]}</button>`}).join('')}</div>
    <div class="row spread">${z.next===7?`<span class="badge ${z.err?'gold':'ok'}">${z.err?'Terminé avec '+plural(z.err,'erreur'):'Parfait !'}</span>`:'<span></span>'}<button class="btn sm" id="oReset">${ic('rotate','sm')}Recommencer</button></div>
    <p class="small muted">Moyen mnémotechnique : « <b>P</b>our <b>L</b>e <b>R</b>éseau <b>T</b>out <b>S</b>e <b>P</b>asse <b>A</b>utomatiquement ».</p></div>
  <div class="card pad drill"><h3>À quelle couche ?</h3><div class="big-q" style="font-family:var(--f-display)">${esc(z.q[0])}</div>
    <div class="grid" style="grid-template-columns:repeat(7,1fr);gap:6px">${[1,2,3,4,5,6,7].map(n=>`<button class="btn ${z.ans!=null?(n===z.q[1]?'primary':n===z.ans?'danger':''):''}" data-ol="${n}" title="${OSI[n-1]}">${n}</button>`).join('')}</div>
    ${z.ans!=null?`<div class="row spread"><span class="badge ${z.ans===z.q[1]?'ok':'bad'}">${z.ans===z.q[1]?'Juste':'Couche '+z.q[1]}</span><span class="small muted">${z.q[1]} = ${OSI[z.q[1]-1]}</span><button class="btn primary sm" id="oNext">Suivant</button></div>`:'<p class="small muted">Touches <kbd>1</kbd> à <kbd>7</kbd>.</p>'}</div>
  </section>`;
}
/* --- Commandes --- */
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
    <div class="row spread"><span class="row"><span class="badge">${esc(z.q[0])}</span><span class="badge blue">${ic('flame','sm')} Série ${z.streak}</span></span></div>
    <div class="big-q" style="font-family:var(--f-display);font-size:20px">${esc(z.q[1])}</div>
    <div class="row" style="flex-wrap:nowrap"><input class="input ${z.ans!=null?(ok?'ok':'bad'):''}" id="cIn" autocomplete="off" spellcheck="false" placeholder="$ commande" style="flex:1;font-family:var(--f-mono)" value="${z.ans!=null?esc(z.ans):''}" ${z.ans!=null?'readonly':''}>
      <button class="btn primary" id="cGo">${z.ans!=null?'Suivant':'Vérifier'}</button></div>
    ${z.ans!=null?`<div class="expl ${ok?'ok':'bad'}">${ok?'<b>Juste.</b>':'<b>Attendu :</b>'} <code>${esc(z.q[2][0])}</code>${z.q[2].length>1?` <span class="muted small">(aussi accepté : ${z.q[2].slice(1).map(x=>'<code>'+esc(x)+'</code>').join(', ')})</span>`:''}</div>`:'<p class="small muted">La casse et les guillemets ne comptent pas.</p>'}
  </section>`;
}

/* ================= Lexique ================= */
function pageLexique(filter){
  const sid=SUBJECTS.some(s=>s.id===filter)?filter:'';let q=sid?'':(filter||'');
  AFTER.push(()=>{const inp=$('#lxQ');const apply=()=>{const f=fold(inp.value);let n=0;$$('.lx').forEach(el=>{const show=(!f||el.dataset.t.includes(f));el.hidden=!show;if(show)n++});$('#lxN').textContent=n;const em=$('#lxEmpty');em.hidden=n>0;em.querySelector('b').textContent=inp.value};
    inp.oninput=apply;apply();if(!sid)inp.focus()});
  const subs=sid?[subj(sid)]:SUBJECTS;
  return `<section class="head"><div><h1>Lexique</h1><p class="lede">Toutes les notions des cartes, avec leur réponse. Pratique pour une relecture rapide.</p></div></section>
  <section class="card pad grid">
    <div class="row"><input class="input" id="lxQ" placeholder="Filtrer : port, VLAN, git push…" value="${esc(q)}" style="flex:1;min-width:200px"><span class="badge" role="status"><span id="lxN">0</span> notions</span></div>
    <p class="empty" id="lxEmpty" hidden>Aucune notion ne contient « <b></b> ». Essayez un mot plus court, ou la recherche complète (<kbd>Ctrl</kbd> <kbd>K</kbd>).</p>
    <div class="row"><a class="badge ${sid?'':'blue'}" href="#/lexique" style="text-decoration:none">Toutes</a>${SUBJECTS.map(s=>`<a class="badge ${sid===s.id?'blue':''}" href="#/lexique/${s.id}" style="text-decoration:none">${esc(s.name)}</a>`).join('')}</div>
  </section>
  ${subs.map(s=>`<section class="card"><div class="pad-sm row" style="border-bottom:1px solid var(--border)">${subjIco(s,28)}<h3>${esc(s.name)}</h3></div>
    <div class="tbl" style="border:0;margin:0;border-radius:0"><table>${s.cards.map(c=>`<tr class="lx" data-t="${esc(fold(plain(c[0])+' '+plain(c[1])))}"><td style="width:42%"><b>${c[0]}</b></td><td>${c[1]}</td></tr>`).join('')}</table></div></section>`).join('')}`;
}

/* ================= Recherche (Ctrl+K) ================= */
let IDX=null;
function buildIndex(){IDX=[];
  PAGES.forEach(([p,i,l])=>IDX.push({k:'Page',i,t:l,s:'',h:'#/'+p,f:fold(l)}));
  IDX.push({k:'Page',i:'user',t:'Mon compte',s:'Date des partiels, progression, déconnexion',h:'#/compte',f:fold('mon compte parametres date partiels')});
  [['sousreseaux','Sous-réseaux'],['ports','Ports'],['osi','Modèle OSI'],['commandes','Commandes']].forEach(([k,l])=>IDX.push({k:'Entraînement',i:'zap',t:'Entraînement : '+l,s:'',h:'#/entrainements/'+k,f:fold('entrainement exercice '+l)}));
  SUBJECTS.forEach(s=>{IDX.push({k:'Matière',i:s.ic,t:s.name,s:s.short,h:'#/m/'+s.id,f:fold(s.name+' '+s.short)});
    s.fiche.forEach((f,i)=>{const txt=plain(f.h);IDX.push({k:'Cours · '+s.name,i:'bookOpen',t:f.t,s:'',raw:txt,h:`#/m/${s.id}/cours/${i}`,f:fold(f.t+' '+txt),tf:fold(f.t)})});
    s.cards.forEach(c=>{const a=plain(c[0]),b=plain(c[1]);IDX.push({k:'Carte · '+s.name,i:'layers',t:a,s:b,h:'#/lexique/'+encodeURIComponent(a.slice(0,40)),f:fold(a+' '+b),tf:fold(a)})});
    s.quiz.forEach(q=>{const ans=q.a.map(x=>q.o[x]).join(' · ');IDX.push({k:'QCM · '+s.name,i:'circleCheck',t:q.q,s:'Réponse : '+ans,h:'#/m/'+s.id+'/qcm',f:fold(q.q+' '+ans+' '+(q.e?plain(q.e):'')),tf:fold(q.q)})});
    s.exos.forEach((x,i)=>IDX.push({k:'Exercice · '+s.name,i:'pencil',t:x.t,s:'',h:'#/m/'+s.id+'/exos',f:fold(x.t+' '+plain(x.q)),tf:fold(x.t)}))})}
function searchIdx(q){if(!IDX)buildIndex();const w=fold(q).split(/\s+/).filter(Boolean);if(!w.length)return IDX.filter(x=>x.k==='Page'||x.k==='Matière');
  const res=[];for(const x of IDX){if(!w.every(t=>x.f.includes(t)))continue;let sc=0;const tf=x.tf||fold(x.t);w.forEach(t=>{if(tf.includes(t))sc+=3});if(x.k==='Page'||x.k==='Matière')sc+=2;if(x.k.startsWith('Cours'))sc+=1;
    let s=x.s;if(x.raw&&!s){const pos=x.f.indexOf(w[0]);const a=Math.max(0,pos-50);s=(a?'…':'')+x.raw.slice(a,a+140)+'…'}res.push({...x,s,sc})}
  return res.sort((a,b)=>b.sc-a.sc).slice(0,40)}
let PAL={sel:0,res:[]};
function openPalette(){if($('#palette'))return;S.menu=false;const ov=document.createElement('div');ov.className='overlay';ov.id='palette';ov.setAttribute('role','dialog');ov.setAttribute('aria-label','Recherche');
  ov.innerHTML=`<div class="palette"><div class="pin">${ic('search')}<input id="palQ" placeholder="Rechercher un cours, une notion, une question…" autocomplete="off" spellcheck="false"><kbd>Échap</kbd></div><div class="res" id="palR"></div></div>`;
  document.body.appendChild(ov);ov.onclick=e=>{if(e.target===ov)closePalette()};
  const inp=$('#palQ');inp.oninput=()=>{PAL.sel=0;drawPalette(inp.value)};drawPalette('');inp.focus()}
function closePalette(){const p=$('#palette');if(p)p.remove()}
function drawPalette(q){PAL.res=searchIdx(q);const box=$('#palR');
  box.innerHTML=PAL.res.length?PAL.res.map((x,i)=>`<a href="${x.h}" class="${i===PAL.sel?'on':''}" data-i="${i}">${ic(x.i||'search')}<span style="min-width:0"><b>${esc(x.t)}</b><span>${esc(x.k)}${x.s?' · '+esc(x.s.length>160?x.s.slice(0,160)+'…':x.s):''}</span></span></a>`).join(''):`<div class="empty">Aucun résultat pour « ${esc(q)} »</div>`;
  $$('#palR a').forEach(a=>{a.onclick=()=>closePalette();a.onmousemove=()=>{if(PAL.sel!==+a.dataset.i){PAL.sel=+a.dataset.i;$$('#palR a').forEach(b=>b.classList.toggle('on',b===a))}}})}
function paletteKey(e){if(e.key==='Escape'){e.preventDefault();closePalette();return}
  const items=$$('#palR a');if(!items.length)return;
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();PAL.sel=(PAL.sel+(e.key==='ArrowDown'?1:-1)+items.length)%items.length;items.forEach((a,i)=>a.classList.toggle('on',i===PAL.sel));items[PAL.sel].scrollIntoView({block:'nearest'})}
  else if(e.key==='Enter'){e.preventDefault();const a=items[PAL.sel];closePalette();if(location.hash===a.getAttribute('href'))render();else location.hash=a.getAttribute('href')}}

/* ================= Compte ================= */
function pageAccount(){
  const set=glob('_settings',{}),dr=glob('_drills',{});
  AFTER.push(()=>{$('#aOut').onclick=async()=>{QZ=null;FC=null;await S.api.signOut()};
    $('#aDate').onchange=e=>{set.examDate=e.target.value||null;if(!set.examDate)delete set.examDate;saveSoon();toast(set.examDate?'Date des partiels enregistrée.':'Date effacée.')};
    $('#aReset').onclick=()=>{if(confirm('Effacer toute votre progression (QCM, cartes, exercices, série) ? Cette action est définitive.')){S.data.progress={};saveSoon();FC=null;QZ=null;toast('Progression effacée.');render()}};
    const pw=$('#aPw');if(pw)pw.onclick=async()=>{try{await S.api.reset(S.user.email);toast('Lien envoyé à '+S.user.email)}catch(e){toast(fr(e).message)}};
    $('#aDel').onclick=async()=>{if(!confirm('Supprimer définitivement votre compte et votre progression ?'))return;try{await S.api.remove(S.user.id);toast('Compte supprimé.')}catch(e){toast(e.code==='auth/requires-recent-login'?'Par sécurité, déconnectez-vous puis reconnectez-vous avant de supprimer le compte.':fr(e).message)}}});
  return `<section class="head"><div><h1>${esc(S.user.name||'Mon compte')}</h1><p class="muted" style="margin-top:4px">${esc(S.user.email)} · ${S.api.mode==='local'?'progression dans ce navigateur (mode local)':'progression synchronisée sur tous vos appareils'}</p></div>
    <button class="btn" id="aOut">${ic('logout','sm')}Se déconnecter</button></section>
  <section class="grid g2">
    <div class="card pad grid"><h3>${ic('calendar','sm')} Date des partiels</h3><p class="muted small">Affiche un compte à rebours sur le tableau de bord.</p><input class="input" type="date" id="aDate" value="${esc(set.examDate||'')}" style="max-width:220px"></div>
    <div class="card pad grid"><h3>${ic('zap','sm')} Entraînements</h3><div class="tbl" style="margin:0"><table>${[['sousreseaux','Sous-réseaux'],['ports','Ports'],['osi','OSI'],['commandes','Commandes']].map(([k,l])=>`<tr><td>${l}</td><td>${dr[k]?`${dr[k].ok}/${dr[k].n} justes`:'—'}</td></tr>`).join('')}</table></div></div>
  </section>
  <section class="card pad"><h3>Progression par matière</h3>
    <div class="tbl"><table><tr><th>Matière</th><th>Fiches lues</th><th>Meilleur QCM</th><th>Cartes maîtrisées</th><th>Exercices</th><th>Erreurs</th></tr>${SUBJECTS.map(s=>{const t=stats(s);return `<tr><td><a href="#/m/${s.id}">${esc(s.name)}</a></td><td>${t.rd}/${t.nf}</td><td>${t.runs?t.best+' %':'—'}</td><td>${t.mast}/${t.nc}</td><td>${t.ex}/${t.ne}</td><td>${t.wrong}</td></tr>`}).join('')}</table></div></section>
  <section class="card pad row">${S.api.mode==='firebase'?`<button class="btn" id="aPw">Changer de mot de passe</button>`:''}<button class="btn" id="aReset">${ic('rotate','sm')}Effacer ma progression</button><button class="btn danger" id="aDel">Supprimer mon compte</button></section>`;
}

boot();
})();
