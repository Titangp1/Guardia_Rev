/* Guardia_Rev · application (connexion obligatoire, fiches, QCM, cartes, exercices, partiel blanc).
   Réalisé par Titan_gp1. */
(function(){
'use strict';
const VERSION='1.0.0';
const CFG=window.GR_CONFIG||{};
const DOMAIN=(CFG.domain||'guardiaschool.fr').toLowerCase();
const SUBJECTS=(window.GR&&window.GR.subjects)||[];
SUBJECTS.forEach(s=>{s.fiche=s.fiche||[];s.cards=s.cards||[];s.exos=s.exos||[];s.quiz=(s.quiz||[]).map((q,i)=>({...q,id:s.id+'-'+i}))});
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=$('#root');
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
const subj=id=>SUBJECTS.find(s=>s.id===id);
const emailOk=e=>new RegExp('^[^\\s@]+@'+DOMAIN.replace(/\./g,'\\.')+'$','i').test(String(e||'').trim());
const store={get(k,d){try{const v=localStorage.getItem(k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

function toast(msg){const box=$('#toasts');if(!box)return;const t=document.createElement('div');t.className='toast';t.textContent=msg;box.appendChild(t);setTimeout(()=>t.remove(),3800)}

/* ================= Comptes ================= */
const FR_ERR={
  'auth/invalid-credential':'Email ou mot de passe incorrect.','auth/invalid-login-credentials':'Email ou mot de passe incorrect.',
  'auth/wrong-password':'Email ou mot de passe incorrect.','auth/user-not-found':'Aucun compte avec cet email.',
  'auth/email-already-in-use':'Un compte existe déjà avec cet email. Connectez-vous.','auth/weak-password':'Mot de passe trop faible : 8 caractères minimum.',
  'auth/invalid-email':'Adresse email invalide.','auth/too-many-requests':'Trop de tentatives. Patientez quelques minutes.',
  'auth/network-request-failed':'Pas de connexion réseau.','permission-denied':'Accès refusé par le serveur.'};
const fr=e=>{const m=FR_ERR[e&&e.code];return new Error(m||(e&&e.message)||'Erreur inconnue.')};
function checkSignup(email,pw,pseudo){
  email=String(email||'').trim().toLowerCase();
  if(!emailOk(email))throw new Error('Utilisez votre adresse école : prenom.nom@'+DOMAIN);
  if(String(pw||'').length<8)throw new Error('Le mot de passe doit faire au moins 8 caractères.');
  pseudo=String(pseudo||'').trim();
  if(!/^[\p{L}0-9 _.-]{2,24}$/u.test(pseudo))throw new Error('Le prénom affiché doit faire 2 à 24 caractères.');
  return {email,pseudo};
}

/* Mode Firebase : vrai serveur, email vérifié obligatoire. */
async function firebaseBackend(fb){
  const SDK='https://www.gstatic.com/firebasejs/10.12.2/';
  const [A,U,F]=await Promise.all(['firebase-app.js','firebase-auth.js','firebase-firestore.js'].map(f=>import(SDK+f)));
  const app=A.initializeApp(fb),auth=U.getAuth(app),db=F.getFirestore(app);auth.languageCode='fr';
  const doc=uid=>F.doc(db,'users',uid);
  const asUser=u=>u?{id:u.uid,email:(u.email||'').toLowerCase(),name:u.displayName||'',verified:!!u.emailVerified}:null;
  return {
    mode:'firebase',
    onAuth:cb=>U.onAuthStateChanged(auth,u=>cb(asUser(u))),
    async signUp(email,pw,pseudo){const r=await U.createUserWithEmailAndPassword(auth,email,pw);
      await U.updateProfile(r.user,{displayName:pseudo});await U.sendEmailVerification(r.user);return asUser(r.user)},
    async signIn(email,pw){const r=await U.signInWithEmailAndPassword(auth,email,pw);return asUser(r.user)},
    async reload(){if(!auth.currentUser)return null;await U.reload(auth.currentUser);await auth.currentUser.getIdToken(true);return asUser(auth.currentUser)},
    resend:()=>U.sendEmailVerification(auth.currentUser),
    reset:e=>U.sendPasswordResetEmail(auth,e),
    signOut:()=>U.signOut(auth),
    async load(uid){const s=await F.getDoc(doc(uid));return s.exists()?s.data():null},
    async save(uid,data){await F.setDoc(doc(uid),{...data,updatedAt:F.serverTimestamp()},{merge:true})},
    async remove(uid){await F.deleteDoc(doc(uid));await U.deleteUser(auth.currentUser)}
  };
}

/* Mode local : en attendant Firebase. Les comptes restent dans ce navigateur (mot de passe haché SHA-256 + sel). */
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
    async reload(){return cur()},
    async resend(){},
    async reset(){throw new Error('En mode local, la réinitialisation par email n\'existe pas : créez un nouveau compte.')},
    async signOut(){localStorage.removeItem('gr-session');emit()},
    async load(uid){return store.get('gr-data-'+uid,null)},
    async save(uid,data){store.set('gr-data-'+uid,Object.assign(store.get('gr-data-'+uid,{}),data))},
    async remove(uid){const U=users();delete U[uid];setUsers(U);localStorage.removeItem('gr-data-'+uid);localStorage.removeItem('gr-session');emit()}
  };
}

const S={api:null,user:null,ready:false,data:{progress:{}},authView:'login',authMsg:null,saving:null};
function prog(){S.data.progress=S.data.progress||{};return S.data.progress}
function saveSoon(){clearTimeout(S.saving);S.saving=setTimeout(async()=>{if(!S.user||!S.user.verified)return;
  try{await S.api.save(S.user.id,{pseudo:S.user.name||'',progress:prog()})}catch(e){console.error(e);toast('Progression non enregistrée : '+fr(e).message)}},600)}

async function boot(){
  try{S.api=CFG.firebase?await firebaseBackend(CFG.firebase):localBackend()}
  catch(e){console.error(e);root.innerHTML=`<div class="auth"><div class="glass auth-card"><h1>Guardia_Rev</h1><div class="msg err">Le service de connexion ne répond pas. Vérifiez votre connexion et rechargez la page.</div></div></div>`;return}
  S.api.onAuth(async u=>{
    if(u&&!emailOk(u.email)){await S.api.signOut();S.authMsg={k:'err',t:'Seules les adresses @'+DOMAIN+' sont acceptées.'};return}
    S.user=u;S.data={progress:{}};
    if(u&&u.verified){try{S.data=(await S.api.load(u.id))||{progress:{}}}catch(e){console.error(e);toast('Impossible de charger votre progression.')}}
    S.ready=true;render();
  });
  window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0)});
}

/* ================= Écran de connexion (obligatoire) ================= */
function renderAuth(){
  const demo=S.api.mode==='local';
  const v=S.authView;
  if(S.user&&!S.user.verified){
    root.innerHTML=`<div class="auth"><form class="glass auth-card" id="verifyForm">
      ${brandBlock()}
      <h1>Vérifiez votre email</h1>
      <p class="muted">Un lien de confirmation a été envoyé à <b>${esc(S.user.email)}</b>. Ouvrez-le (pensez aux spams), puis revenez ici.</p>
      ${msgBlock()}
      <button class="btn primary big" type="submit">J'ai confirmé mon email</button>
      <div class="row" style="justify-content:space-between"><button class="linkbtn" type="button" id="resend">Renvoyer l'email</button><button class="linkbtn" type="button" id="out">Changer de compte</button></div>
    </form></div>`;
    $('#verifyForm').onsubmit=async e=>{e.preventDefault();const u=await S.api.reload();if(u&&u.verified){S.user=u;S.authMsg=null;try{S.data=(await S.api.load(u.id))||{progress:{}}}catch(_){}render()}else{S.authMsg={k:'err',t:'Email pas encore confirmé. Cliquez sur le lien reçu puis réessayez.'};renderAuth()}};
    $('#resend').onclick=async()=>{try{await S.api.resend();S.authMsg={k:'ok',t:'Email renvoyé.'}}catch(e){S.authMsg={k:'err',t:fr(e).message}}renderAuth()};
    $('#out').onclick=()=>S.api.signOut();
    return;
  }
  root.innerHTML=`<div class="auth"><div class="glass auth-card">
    ${brandBlock()}
    <div><h1>${v==='signup'?'Créer un compte':v==='reset'?'Mot de passe oublié':'Se connecter'}</h1>
    <p class="muted small" style="margin:4px 0 0">Accès réservé aux étudiants Guardia : adresse <b>@${esc(DOMAIN)}</b> obligatoire.</p></div>
    ${v!=='reset'?`<div class="seg" role="tablist"><button type="button" role="tab" aria-selected="${v==='login'}" data-v="login">Connexion</button><button type="button" role="tab" aria-selected="${v==='signup'}" data-v="signup">Créer un compte</button></div>`:''}
    ${msgBlock()}
    <form id="authForm" class="grid" novalidate>
      ${v==='signup'?`<div class="field"><label for="pseudo">Prénom affiché</label><input id="pseudo" autocomplete="given-name" required maxlength="24" placeholder="Tristan"></div>`:''}
      <div class="field"><label for="email">Email école</label><input id="email" type="email" autocomplete="email" required placeholder="prenom.nom@${esc(DOMAIN)}"></div>
      ${v!=='reset'?`<div class="field"><label for="pw">Mot de passe</label><input id="pw" type="password" autocomplete="${v==='signup'?'new-password':'current-password'}" required minlength="8">${v==='signup'?'<span class="hint">8 caractères minimum.</span>':''}</div>`:''}
      <button class="btn primary big" type="submit" id="go">${v==='signup'?'Créer mon compte':v==='reset'?'Envoyer le lien':'Se connecter'}</button>
    </form>
    <div class="row" style="justify-content:space-between">
      ${v==='login'?'<button class="linkbtn" type="button" data-v="reset">Mot de passe oublié ?</button>':'<button class="linkbtn" type="button" data-v="login">Retour à la connexion</button>'}
      <button class="btn ghost icon" type="button" id="themeA" aria-label="Changer de thème" title="Changer de thème">${ICON.theme}</button>
    </div>
    ${demo?`<div class="demo-banner"><b>Mode local</b> : le serveur de comptes n'est pas encore branché. Votre compte et votre progression restent dans ce navigateur.</div>`:''}
  </div></div>`;
  $$('[data-v]').forEach(b=>b.onclick=()=>{S.authView=b.dataset.v;S.authMsg=null;renderAuth()});
  $('#themeA').onclick=toggleTheme;
  const em=$('#email');em.addEventListener('blur',()=>{if(em.value&&!emailOk(em.value))showMsg('err','Seules les adresses @'+DOMAIN+' sont acceptées.')});
  $('#authForm').onsubmit=async e=>{e.preventDefault();const go=$('#go');go.disabled=true;
    try{
      if(v==='signup'){const c=checkSignup(em.value,$('#pw').value,$('#pseudo').value);S.authMsg=null;await S.api.signUp(c.email,$('#pw').value,c.pseudo)}
      else if(v==='reset'){if(!emailOk(em.value))throw new Error('Indiquez votre adresse @'+DOMAIN+'.');await S.api.reset(em.value.trim().toLowerCase());S.authView='login';S.authMsg={k:'ok',t:'Si ce compte existe, un lien de réinitialisation vient d\'être envoyé.'};renderAuth()}
      else{if(!emailOk(em.value))throw new Error('Seules les adresses @'+DOMAIN+' sont acceptées.');S.authMsg=null;await S.api.signIn(em.value.trim().toLowerCase(),$('#pw').value)}
    }catch(err){showMsg('err',(err.code?fr(err):err).message);go.disabled=false}};
}
function showMsg(k,t){S.authMsg={k,t};const m=$('#authMsg');if(m){m.className='msg '+k;m.textContent=t;m.hidden=false}else renderAuth()}
function msgBlock(){const m=S.authMsg;return `<div class="msg ${m?m.k:''}" id="authMsg" role="alert" ${m?'':'hidden'}>${m?esc(m.t):''}</div>`}
function brandBlock(){return `<div class="brand" style="margin:0"><span class="brand-mark">${ICON.logo}</span><span><b>Guardia_Rev</b><small>Révisions des partiels · GCS1</small></span></div>`}

/* ================= Application ================= */
const ICON={
  logo:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round"><path d="M17.5 7.5A7 7 0 1 0 19 13h-7"/></svg>',
  theme:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16z" fill="currentColor"/></svg>'
};
function toggleTheme(){const d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;d.dataset.theme=dark?'light':'dark';try{localStorage.setItem('gr-theme',d.dataset.theme)}catch(e){}}

function route(){const h=(location.hash||'#/').slice(2).split('/');return {page:h[0]||'',id:h[1]||'',sub:h[2]||''}}
function shell(inner,cur){
  const nav=[['','Accueil'],['matieres','Matières'],['partiel','Partiel blanc'],['compte','Mon compte']];
  return `<div class="page">
  <header class="topbar glass">
    <a class="brand" href="#/"><span class="brand-mark">${ICON.logo}</span><span><b>Guardia_Rev</b><small>Révisions des partiels · GCS1</small></span></a>
    <nav class="nav" aria-label="Pages">${nav.map(([p,l])=>`<a href="#/${p}" ${cur===p?'aria-current="page"':''}>${l}</a>`).join('')}</nav>
    <div class="top-actions"><span class="chip" title="${esc(S.user.email)}">${esc(S.user.name||S.user.email.split('@')[0])}</span><button class="btn ghost icon" id="themeB" aria-label="Changer de thème" title="Changer de thème">${ICON.theme}</button></div>
  </header>
  <main class="grid">${inner}</main>
  <footer class="credit">Guardia_Rev v${VERSION} · Réalisé par <b>Titan_gp1</b> · ${S.api.mode==='local'?'mode local':'compte synchronisé'}</footer>
  </div>`;
}
function render(){
  if(!S.ready)return;
  if(!S.user||!S.user.verified){renderAuth();return}
  const r=route();let html,cur=r.page;
  try{
    if(r.page==='matieres')html=pageSubjects();
    else if(r.page==='m'){const s=subj(r.id);html=s?pageSubject(s,r.sub||'fiche'):pageNotFound();cur='matieres'}
    else if(r.page==='partiel')html=pagePartiel();
    else if(r.page==='compte')html=pageAccount();
    else html=pageHome();
  }catch(e){console.error(e);html=pageNotFound()}
  root.innerHTML=shell(html,cur);
  $('#themeB').onclick=toggleTheme;
  const after=AFTER.splice(0);after.forEach(f=>f());
}
const AFTER=[];
function pageNotFound(){return `<section class="glass pad"><h1>Page introuvable</h1><p><a href="#/">Retour à l'accueil</a></p></section>`}

/* ---------- Statistiques ---------- */
function subjStats(s){const p=prog()[s.id]||{};const quizBest=p.quizBest||0;const known=(p.known||[]).length;const exos=(p.exos||[]).length;
  const nq=s.quiz.length,nc=s.cards.length,ne=s.exos.length;
  const pct=Math.round(100*((nq?quizBest/100:0)*0.5+(nc?known/nc:0)*0.25+(ne?exos/ne:0)*0.25));
  return {quizBest,known,exos,nq,nc,ne,pct,quizRuns:p.quizRuns||0}}
function totals(){return SUBJECTS.reduce((a,s)=>(a.q+=s.quiz.length,a.c+=s.cards.length,a.e+=s.exos.length,a.f+=s.fiche.length,a),{q:0,c:0,e:0,f:0})}

/* ---------- Accueil ---------- */
function pageHome(){
  const t=totals();
  const all=SUBJECTS.map(subjStats),avg=all.length?Math.round(all.reduce((a,b)=>a+b.pct,0)/all.length):0;
  const weakest=SUBJECTS.map((s,i)=>({s,p:all[i].pct})).sort((a,b)=>a.p-b.p)[0];
  return `
  <section class="glass pad hero">
    <div>
      <p class="eyebrow">Premiers partiels · GCS1</p>
      <h1>Bonjour ${esc(S.user.name||'')}, on <em>révise</em> ?</h1>
      <p class="lede">Fiches de cours, QCM corrigés, flashcards et exercices type partiel, construits à partir de nos cours et des anciens sujets.</p>
      <div class="row"><a class="btn primary big" href="#/matieres">Choisir une matière</a><a class="btn gold big" href="#/partiel">Lancer un partiel blanc</a></div>
    </div>
    <div class="glass pad" style="border-radius:22px">
      <p class="eyebrow">Ma progression</p>
      <b style="font-family:var(--f-display);font-size:44px">${avg}%</b>
      <div class="bar" style="margin:8px 0 12px"><i style="width:${avg}%"></i></div>
      ${weakest?`<p class="small muted" style="margin:0">À travailler en priorité : <a href="#/m/${weakest.s.id}">${esc(weakest.s.name)}</a> (${weakest.p}%)</p>`:''}
    </div>
  </section>
  <section class="glass pad stats">
    <div class="stat"><b>${SUBJECTS.length}</b><span>matières</span></div>
    <div class="stat"><b>${t.q}</b><span>questions de QCM</span></div>
    <div class="stat"><b>${t.c}</b><span>flashcards</span></div>
    <div class="stat"><b>${t.e}</b><span>exercices corrigés</span></div>
  </section>
  <section class="grid cols-3">${SUBJECTS.map(subjCard).join('')}</section>
  <section class="glass pad">
    <h2>Méthode conseillée</h2>
    <ol>
      <li><b>Lire la fiche</b> d'une matière en entier (10 à 20 minutes).</li>
      <li><b>Flashcards</b> : passer les cartes jusqu'à toutes les connaître.</li>
      <li><b>QCM</b> : viser 80 % et plus, relire l'explication de chaque erreur.</li>
      <li><b>Exercices type partiel</b> : rédiger sa réponse <i>avant</i> d'ouvrir le corrigé.</li>
      <li><b>Partiel blanc</b> chronométré la veille de l'épreuve.</li>
    </ol>
  </section>`;
}
function subjCard(s){const st=subjStats(s);return `<a class="glass subj" href="#/m/${s.id}">
  <span class="subj-ico" style="background:${s.color}">${esc(s.icon)}</span>
  <h3>${esc(s.name)}</h3><p>${esc(s.short)}</p>
  <div class="row small muted"><span>${s.fiche.length} fiches</span>·<span>${st.nq} QCM</span>·<span>${st.nc} cartes</span>·<span>${st.ne} exos</span></div>
  <div class="bar"><i style="width:${st.pct}%"></i></div><span class="small muted">${st.pct}% maîtrisé${st.quizRuns?` · meilleur QCM ${st.quizBest}%`:''}</span></a>`}
function pageSubjects(){return `<section class="glass pad"><p class="eyebrow">Toutes les matières</p><h1>Matières</h1><p class="lede">Chaque matière contient une fiche de cours, un QCM, des flashcards et des exercices type partiel.</p></section>
  <section class="grid cols-3">${SUBJECTS.map(subjCard).join('')}</section>`}

/* ---------- Matière ---------- */
function pageSubject(s,tab){
  const tabs=[['fiche','Fiche de cours'],['qcm','QCM'],['cartes','Flashcards'],['exos','Exercices type partiel']];
  let body='';
  if(tab==='qcm')body=quizView(s);else if(tab==='cartes')body=cardsView(s);else if(tab==='exos')body=exosView(s);else body=ficheView(s);
  return `<section class="glass pad">
    <div class="row"><span class="subj-ico" style="background:${s.color}">${esc(s.icon)}</span><div><p class="eyebrow" style="margin:0">${esc(s.exam||'Matière')}</p><h1>${esc(s.name)}</h1></div></div>
    ${s.intro?`<p class="lede" style="margin-bottom:0">${s.intro}</p>`:''}
    <nav class="tabs">${tabs.map(([k,l])=>`<a href="#/m/${s.id}/${k}" ${tab===k?'aria-current="page"':''}>${l}</a>`).join('')}</nav>
  </section>${body}`;
}
function ficheView(s){
  AFTER.push(()=>$$('.toc a').forEach(a=>a.onclick=e=>{e.preventDefault();const t=document.getElementById(a.dataset.t);if(t)t.scrollIntoView({behavior:'smooth'})}));
  return `<div class="fiche">
    <nav class="glass toc" aria-label="Sommaire">${s.fiche.map((f,i)=>`<a href="#" data-t="${s.id}-f${i}">${i+1}. ${esc(f.t)}</a>`).join('')}</nav>
    <div>${s.fiche.map((f,i)=>`<article class="glass pad sec" id="${s.id}-f${i}"><h2>${i+1}. ${esc(f.t)}</h2>${f.h}</article>`).join('')}
    <div class="glass pad row" style="justify-content:space-between;margin-top:14px"><span>Fiche lue ? Testez-vous.</span><span class="row"><a class="btn" href="#/m/${s.id}/cartes">Flashcards</a><a class="btn primary" href="#/m/${s.id}/qcm">Faire le QCM</a></span></div></div>
  </div>`;
}

/* ---------- QCM ---------- */
let QZ=null;
function startQuiz(list,opts){QZ={list:list.map(q=>{const order=shuffle(q.o.map((_,i)=>i));return {...q,order}}),i:0,answers:[],picked:new Set(),done:false,subjectId:opts.subjectId||null,title:opts.title||'QCM',timer:opts.timer||0,t0:Date.now(),back:opts.back}}
function quizView(s){
  if(!QZ||QZ.subjectId!==s.id||QZ.partiel||QZ.free){
    return `<section class="glass pad grid" style="justify-items:start">
      <h2>QCM · ${esc(s.name)}</h2>
      <p class="muted" style="margin:0">${s.quiz.length} questions disponibles, posées dans un ordre aléatoire. Certaines ont <b>plusieurs bonnes réponses</b>, comme au partiel.</p>
      <div class="row">${[10,20].filter(n=>n<s.quiz.length).map(n=>`<button class="btn" data-n="${n}">${n} questions</button>`).join('')}<button class="btn primary" data-n="${s.quiz.length}">Toutes (${s.quiz.length})</button></div>
    </section>`+(AFTER.push(()=>$$('[data-n]').forEach(b=>b.onclick=()=>{startQuiz(shuffle(s.quiz).slice(0,+b.dataset.n),{subjectId:s.id,title:'QCM · '+s.name});render()})),'');
  }
  return quizBody();
}
function quizBody(){
  const z=QZ;if(z.done)return quizResult();
  const q=z.list[z.i],multi=q.a.length>1,ans=z.answers[z.i];
  AFTER.push(bindQuiz);
  const elapsed=z.timer?`<span class="chip timer" id="qTimer"></span>`:'';
  return `<section class="glass pad q">
    <div class="q-head"><span class="chip">Question ${z.i+1} / ${z.list.length}</span>${q.src?`<span class="chip">${esc(q.src)}</span>`:''}${elapsed}<button class="btn ghost small" id="qQuit">Abandonner</button></div>
    <div class="bar"><i style="width:${100*z.i/z.list.length}%"></i></div>
    <div class="q-text">${esc(q.q)}</div>
    ${q.code?`<pre><code>${esc(q.code)}</code></pre>`:''}
    ${multi?`<div class="multi-hint">Plusieurs réponses possibles : cochez toutes les bonnes puis validez.</div>`:''}
    <div class="opts">${q.order.map((oi,k)=>{const cls=ans?(q.a.includes(oi)?'good':(ans.picked.includes(oi)?'wrong':'')):(z.picked.has(oi)?'sel':'');
      return `<button class="opt ${cls}" data-o="${oi}" ${ans?'disabled':''}><span class="l">${'ABCDEF'[k]}</span><span>${esc(q.o[oi])}</span></button>`}).join('')}</div>
    ${ans?`<div class="expl ${ans.ok?'ok':'bad'}"><b>${ans.ok?'Bonne réponse.':'Pas tout à fait.'}</b> ${q.e||''}</div>
      <div class="row" style="justify-content:flex-end"><button class="btn primary" id="qNext">${z.i+1<z.list.length?'Question suivante':'Voir le résultat'}</button></div>`
      :(multi?`<div class="row" style="justify-content:flex-end"><button class="btn primary" id="qValid" ${z.picked.size?'':'disabled'}>Valider</button></div>`:'')}
  </section>`;
}
function bindQuiz(){
  const z=QZ;if(!z)return;const q=z.list[z.i];
  const quit=$('#qQuit');if(quit)quit.onclick=()=>{QZ=null;render()};
  $$('.opt').forEach(b=>b.onclick=()=>{const oi=+b.dataset.o;
    if(q.a.length>1){z.picked.has(oi)?z.picked.delete(oi):z.picked.add(oi);render()}
    else{z.picked=new Set([oi]);answer()}});
  const v=$('#qValid');if(v)v.onclick=answer;
  const n=$('#qNext');if(n){n.onclick=()=>{z.i++;z.picked=new Set();if(z.i>=z.list.length)finishQuiz();render()};n.focus()}
  if(z.timer)tickTimer();
}
function answer(){const z=QZ,q=z.list[z.i],picked=[...z.picked];const ok=picked.length===q.a.length&&picked.every(p=>q.a.includes(p));z.answers[z.i]={picked,ok};render()}
let TT=null;
function tickTimer(){clearInterval(TT);const el=$('#qTimer');if(!el||!QZ)return;const upd=()=>{if(!QZ||QZ.done){clearInterval(TT);return}
  const left=Math.max(0,QZ.timer*60-Math.floor((Date.now()-QZ.t0)/1000));const e=$('#qTimer');if(e)e.textContent=`⏱ ${Math.floor(left/60)}:${String(left%60).padStart(2,'0')}`;
  if(left<=0){clearInterval(TT);finishQuiz();render();toast('Temps écoulé !')}};upd();TT=setInterval(upd,1000)}
function finishQuiz(){const z=QZ;if(z.done)return;z.done=true;clearInterval(TT);
  const good=z.answers.filter(a=>a&&a.ok).length,pct=Math.round(100*good/z.list.length);z.score={good,pct};
  if(z.subjectId){const p=prog()[z.subjectId]=prog()[z.subjectId]||{};p.quizRuns=(p.quizRuns||0)+1;if(z.list.length>=5)p.quizBest=Math.max(p.quizBest||0,pct);
    p.wrong=[...new Set([...(p.wrong||[]).filter(id=>!z.list.some((q,i)=>q.id===id&&z.answers[i]&&z.answers[i].ok)),...z.list.filter((q,i)=>!(z.answers[i]&&z.answers[i].ok)).map(q=>q.id)])];saveSoon()}
  if(z.partiel){const h=prog()._partiels=prog()._partiels||[];h.unshift({at:Date.now(),pct,n:z.list.length,subjects:z.partielSubjects});h.splice(10);saveSoon()}
}
function quizResult(){
  const z=QZ,{good,pct}=z.score,mention=pct>=90?'Excellent':pct>=75?'Très bien':pct>=50?'Encore un effort':'À retravailler';
  AFTER.push(()=>{const a=$('#qAgain');if(a)a.onclick=()=>{const subjectId=z.subjectId;QZ=null;if(z.partiel){location.hash='#/partiel';render()}else{location.hash='#/m/'+subjectId+'/qcm';render()}};
    const w=$('#qWrong');if(w)w.onclick=()=>{const wrong=z.list.filter((q,i)=>!(z.answers[i]&&z.answers[i].ok));startQuiz(wrong,{subjectId:z.subjectId,title:'Mes erreurs'});if(z.partiel||z.free)QZ.free=true;render()}});
  return `<section class="glass pad result">
    <p class="eyebrow">${esc(z.title)}</p><div class="score">${pct}%</div><h2>${mention}</h2>
    <p class="muted">${good} bonne${good>1?'s':''} réponse${good>1?'s':''} sur ${z.list.length}</p>
    <div class="row" style="justify-content:center">${good<z.list.length?'<button class="btn gold" id="qWrong">Refaire mes erreurs</button>':''}<button class="btn primary" id="qAgain">Nouveau QCM</button></div>
    <div class="review"><h3>Correction détaillée</h3>${z.list.map((q,i)=>{const a=z.answers[i];return `<div class="it">
      <div class="row"><span class="chip ${a&&a.ok?'ok':'bad'}">${a&&a.ok?'Juste':'Faux'}</span><b>${esc(q.q)}</b></div>
      <p class="small" style="margin:6px 0 0">Réponse : <b>${q.a.map(x=>esc(q.o[x])).join(' · ')}</b>${a&&!a.ok&&a.picked.length?` <span class="muted">(vous : ${a.picked.map(x=>esc(q.o[x])).join(' · ')})</span>`:''}</p>
      ${q.e?`<p class="small muted" style="margin:4px 0 0">${q.e}</p>`:''}</div>`}).join('')}</div>
  </section>`;
}

/* ---------- Flashcards ---------- */
let FC=null;
function cardsView(s){
  const p=prog()[s.id]=prog()[s.id]||{};p.known=p.known||[];
  if(!FC||FC.sid!==s.id){const unknown=s.cards.map((_,i)=>i).filter(i=>!p.known.includes(i));FC={sid:s.id,deck:shuffle(unknown.length?unknown:s.cards.map((_,i)=>i)),i:0,flip:false}}
  const known=p.known.length,total=s.cards.length;
  AFTER.push(()=>{const f=$('#flash');if(f){const flip=()=>{FC.flip=!FC.flip;f.classList.toggle('flip',FC.flip)};f.onclick=flip;f.onkeydown=e=>{if(e.key===' '||e.key==='Enter'){e.preventDefault();flip()}}}
    const mark=k=>{const idx=FC.deck[FC.i];const set=new Set(p.known);k?set.add(idx):set.delete(idx);p.known=[...set];saveSoon();FC.i++;FC.flip=false;render()};
    const y=$('#cYes');if(y)y.onclick=()=>mark(true);const n=$('#cNo');if(n)n.onclick=()=>mark(false);
    const r=$('#cRestart');if(r)r.onclick=()=>{FC=null;render()};const z=$('#cReset');if(z)z.onclick=()=>{p.known=[];saveSoon();FC=null;render()}});
  const head=`<div class="row" style="justify-content:space-between"><span class="chip ok">${known} / ${total} connues</span><button class="btn ghost small" id="cReset">Tout remettre à zéro</button></div><div class="bar"><i style="width:${100*known/total}%"></i></div>`;
  if(FC.i>=FC.deck.length)return `<section class="glass pad grid">${head}<div class="result"><div class="score">✓</div><h2>Paquet terminé</h2><p class="muted">${known===total?'Vous connaissez toutes les cartes de cette matière.':'Relancez pour revoir les cartes encore inconnues.'}</p><button class="btn primary" id="cRestart">Recommencer</button></div></section>`;
  const c=s.cards[FC.deck[FC.i]];
  return `<section class="glass pad grid">${head}
    <p class="muted small" style="margin:0;text-align:center">Carte ${FC.i+1} / ${FC.deck.length} · cliquez (ou Espace) pour retourner</p>
    <div class="card-wrap"><div class="flash" id="flash" tabindex="0" role="button" aria-label="Retourner la carte">
      <div class="face glass"><small>Question</small><div>${c[0]}</div></div>
      <div class="face back glass"><small>Réponse</small><div>${c[1]}</div></div>
    </div></div>
    <div class="row" style="justify-content:center"><button class="btn" id="cNo">À revoir</button><button class="btn primary" id="cYes">Je savais</button></div>
  </section>`;
}

/* ---------- Exercices ---------- */
function exosView(s){
  const p=prog()[s.id]=prog()[s.id]||{};p.exos=p.exos||[];
  AFTER.push(()=>{$$('[data-exo]').forEach(b=>b.onclick=()=>{const i=+b.dataset.exo,set=new Set(p.exos);set.has(i)?set.delete(i):set.add(i);p.exos=[...set];saveSoon();render()});
    $$('textarea[data-draft]').forEach(t=>{const k='gr-draft-'+S.user.id+'-'+t.dataset.draft;t.value=store.get(k,'');t.oninput=()=>store.set(k,t.value)})});
  return `<section class="glass pad"><p class="muted" style="margin:0">Rédigez votre réponse dans le cadre (elle reste enregistrée dans ce navigateur), <b>puis</b> ouvrez le corrigé pour comparer. Les exercices marqués <span class="chip">ancien partiel</span> reprennent des sujets des années précédentes.</p></section>
  ${s.exos.map((x,i)=>`<section class="glass pad exo">
    <div class="row" style="justify-content:space-between"><h3>${i+1}. ${esc(x.t)}</h3><span class="row">${x.src?`<span class="chip">${esc(x.src)}</span>`:''}${x.pts?`<span class="chip">${esc(x.pts)}</span>`:''}</span></div>
    <div>${x.q}</div>
    <textarea data-draft="${s.id}-${i}" placeholder="Votre réponse…" aria-label="Votre réponse"></textarea>
    <details><summary>Voir le corrigé</summary><div>${x.r}</div></details>
    <div class="row" style="justify-content:flex-end"><button class="btn ${p.exos.includes(i)?'':'primary'}" data-exo="${i}">${p.exos.includes(i)?'✓ Maîtrisé (annuler)':'Je maîtrise cet exercice'}</button></div>
  </section>`).join('')}`;
}

/* ---------- Partiel blanc ---------- */
let PB={sel:new Set(SUBJECTS.map(s=>s.id)),n:30,timer:30};
function pagePartiel(){
  if(QZ&&(QZ.partiel||QZ.free))return `<section class="glass pad"><p class="eyebrow">Partiel blanc</p><h1>${esc(QZ.title)}</h1></section>`+quizBody();
  const hist=(prog()._partiels||[]);
  AFTER.push(()=>{$$('[data-ps]').forEach(c=>c.onchange=()=>{c.checked?PB.sel.add(c.dataset.ps):PB.sel.delete(c.dataset.ps);$('#pbGo').disabled=!PB.sel.size});
    $('#pbN').onchange=e=>PB.n=+e.target.value;$('#pbT').onchange=e=>PB.timer=+e.target.value;
    $('#pbGo').onclick=()=>{const pool=SUBJECTS.filter(s=>PB.sel.has(s.id)).flatMap(s=>s.quiz.map(q=>({...q,src:s.name})));
      startQuiz(shuffle(pool).slice(0,PB.n),{title:'Partiel blanc · '+PB.n+' questions',timer:PB.timer});QZ.partiel=true;QZ.partielSubjects=[...PB.sel];render()}});
  return `<section class="glass pad grid">
    <div><p class="eyebrow">Conditions d'examen</p><h1>Partiel blanc</h1><p class="lede">Questions tirées au hasard dans les matières choisies, avec un chrono. Pas d'explication avant la fin : comme le jour J.</p></div>
    <div class="grid cols-3">${SUBJECTS.map(s=>`<label class="row glass" style="padding:12px 14px;border-radius:16px;cursor:pointer"><input type="checkbox" data-ps="${s.id}" ${PB.sel.has(s.id)?'checked':''}> <span>${esc(s.name)} <span class="muted small">(${s.quiz.length})</span></span></label>`).join('')}</div>
    <div class="row">
      <label class="row">Questions <select id="pbN" class="btn">${[10,20,30,40,60].map(n=>`<option ${PB.n===n?'selected':''}>${n}</option>`).join('')}</select></label>
      <label class="row">Durée <select id="pbT" class="btn">${[[0,'sans chrono'],[10,'10 min'],[20,'20 min'],[30,'30 min'],[45,'45 min'],[60,'1 h']].map(([v,l])=>`<option value="${v}" ${PB.timer===v?'selected':''}>${l}</option>`).join('')}</select></label>
      <button class="btn primary big" id="pbGo">Commencer</button>
    </div>
    ${hist.length?`<div><h3>Mes derniers partiels blancs</h3><div class="tbl"><table><tr><th>Date</th><th>Questions</th><th>Score</th></tr>${hist.map(h=>`<tr><td>${new Date(h.at).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'})}</td><td>${h.n}</td><td><b>${h.pct}%</b></td></tr>`).join('')}</table></div></div>`:''}
  </section>`;
}
/* En partiel blanc, l'explication n'apparaît qu'à la fin : on passe directement à la suite. */
const _answer=answer;
answer=function(){_answer();if(QZ&&QZ.partiel&&!QZ.done){QZ.i++;QZ.picked=new Set();if(QZ.i>=QZ.list.length)finishQuiz();render()}};

/* ---------- Compte ---------- */
function pageAccount(){
  AFTER.push(()=>{$('#aOut').onclick=async()=>{QZ=null;FC=null;await S.api.signOut()};
    $('#aReset').onclick=()=>{if(confirm('Effacer toute votre progression (QCM, cartes, exercices) ? Cette action est définitive.')){S.data.progress={};saveSoon();FC=null;toast('Progression effacée.');render()}};
    $('#aPw').onclick=async()=>{try{await S.api.reset(S.user.email);toast('Lien de changement de mot de passe envoyé à '+S.user.email)}catch(e){toast(fr(e).message)}};
    $('#aDel').onclick=async()=>{if(!confirm('Supprimer définitivement votre compte et votre progression ?'))return;try{await S.api.remove(S.user.id);toast('Compte supprimé.')}catch(e){toast(e.code==='auth/requires-recent-login'?'Par sécurité, déconnectez-vous puis reconnectez-vous avant de supprimer le compte.':fr(e).message)}}});
  return `<section class="glass pad grid" style="max-width:640px">
    <p class="eyebrow">Mon compte</p><h1>${esc(S.user.name||'Mon compte')}</h1>
    <div class="tbl"><table><tr><th>Email</th><td>${esc(S.user.email)}</td></tr><tr><th>Stockage</th><td>${S.api.mode==='local'?'Ce navigateur uniquement (mode local)':'Compte en ligne (Firebase), synchronisé sur tous vos appareils'}</td></tr></table></div>
    <h3>Progression par matière</h3>
    <div class="tbl"><table><tr><th>Matière</th><th>Meilleur QCM</th><th>Cartes</th><th>Exos</th></tr>${SUBJECTS.map(s=>{const t=subjStats(s);return `<tr><td>${esc(s.name)}</td><td>${t.quizRuns?t.quizBest+'%':'—'}</td><td>${t.known}/${t.nc}</td><td>${t.exos}/${t.ne}</td></tr>`}).join('')}</table></div>
    <div class="row"><button class="btn primary" id="aOut">Se déconnecter</button>${S.api.mode==='firebase'?'<button class="btn" id="aPw">Changer de mot de passe</button>':'<span hidden id="aPw"></span>'}<button class="btn" id="aReset">Effacer ma progression</button><button class="btn danger" id="aDel">Supprimer mon compte</button></div>
  </section>`;
}

boot();
})();
