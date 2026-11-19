/* Guardia_Rev · Anglais (cyber vocabulary, grammar, presentations). */
window.GR=window.GR||{subjects:[]};
GR.subjects.push({
id:'anglais', name:'Anglais cyber', icon:'EN', color:'linear-gradient(140deg,#d1456f,#8f2246)',
exam:'Anglais · oral et écrit',
short:'Vocabulaire de la cybersécurité, réponse à incident, grammaire utile (past simple, present perfect, comparatifs, modaux) et expressions pour présenter.',
intro:'Basé sur nos présentations (Phishing Incident Case Study, Physical Pentester, VoidGuard Security) et nos textes (Sandy Hook, « Let me be clear »).',
fiche:[
{t:'Cybersecurity vocabulary',h:`
<div class="tbl"><table><tr><th>English</th><th>Français</th></tr>
<tr><td>a threat · a vulnerability · a risk</td><td>une menace · une vulnérabilité · un risque</td></tr>
<tr><td>an attacker · a hacker · a threat actor</td><td>un attaquant · un pirate · un acteur malveillant</td></tr>
<tr><td>a breach · a data leak</td><td>une violation / intrusion · une fuite de données</td></tr>
<tr><td>phishing · a fake email · the bait</td><td>hameçonnage · un faux mail · l'appât</td></tr>
<tr><td>to click on a link · to type a password</td><td>cliquer sur un lien · saisir un mot de passe</td></tr>
<tr><td>credentials</td><td>identifiants</td></tr>
<tr><td>two-step login · multi-factor authentication (MFA)</td><td>double authentification</td></tr>
<tr><td>a firewall · an antivirus · encryption</td><td>un pare-feu · un antivirus · le chiffrement</td></tr>
<tr><td>to encrypt · to decrypt</td><td>chiffrer · déchiffrer</td></tr>
<tr><td>malware · ransomware · a stealer</td><td>logiciel malveillant · rançongiciel · un voleur d'informations</td></tr>
<tr><td>a backdoor</td><td>une porte dérobée</td></tr>
<tr><td>a penetration test (pentest) · a pentester</td><td>un test d'intrusion · un testeur d'intrusion</td></tr>
<tr><td>social engineering</td><td>ingénierie sociale</td></tr>
<tr><td>lock picking · badge cloning</td><td>crochetage · copie de badge</td></tr>
<tr><td>a letter of authorisation</td><td>une lettre d'autorisation</td></tr>
<tr><td>incident response · to contain · to report</td><td>réponse à incident · confiner · signaler / déclarer</td></tr>
<tr><td>evidence (uncountable) · logs</td><td>des preuves · des journaux</td></tr>
<tr><td>the Data Protection Officer (DPO)</td><td>le délégué à la protection des données</td></tr>
<tr><td>GDPR</td><td>RGPD</td></tr>
<tr><td>a deadline · within 72 hours</td><td>une échéance · sous 72 heures</td></tr>
<tr><td>to be fired · to be caught</td><td>être licencié · se faire prendre</td></tr>
<tr><td>a salary · a skill · a job</td><td>un salaire · une compétence · un emploi</td></tr></table></div>
<div class="trap"><b>Faux amis</b> : <i>actually</i> = en fait (pas « actuellement » = currently) ; <i>eventually</i> = finalement ; <i>sensible</i> = raisonnable (sensitive = sensible) ; <i>library</i> = bibliothèque ; <i>to attend</i> = assister à ; <i>formation</i> ≠ training.</div>`},
{t:'Past simple vs present perfect',h:`
<h3>Past simple : action terminée à un moment précis du passé</h3>
<p>Verbe + <b>-ed</b> ou forme irrégulière ; marqueurs : <i>yesterday, in 2012, last year, ago, when…</i></p>
<pre><code>On December 14, 2012, a man entered the school.
In 1996, a man killed 16 children. One year later, the UK banned handguns.
I didn't know how, so I got caught.     (négation : didn't + base verbale)
Did the student click on the link?     (question : did + base verbale)</code></pre>
<h3>Present perfect : lien avec le présent, moment non précisé</h3>
<p><b>have/has + participe passé</b> ; marqueurs : <i>already, yet, ever, never, just, since, for</i>.</p>
<pre><code>The attackers have stolen the data.     (résultat visible maintenant)
We have just blocked the account.
Have you ever done a pentest?
School shootings have continued since 2012.</code></pre>
<div class="trap">❌ <i>I have seen him yesterday</i> → ✅ <i>I saw him yesterday</i> (moment précis = past simple).</div>
<h3>Verbes irréguliers fréquents</h3>
<p>be – was/were – been · go – went – gone · get – got – got · know – knew – known · steal – stole – stolen · take – took – taken · send – sent – sent · find – found – found · think – thought – thought · catch – caught – caught · throw – threw – thrown · leave – left – left · say – said – said · make – made – made · break – broke – broken.</p>`},
{t:'Comparatives, modals, connectors',h:`
<h3>Comparatifs et superlatifs</h3>
<ul><li>Adjectif court : <i>fast → faster → the fastest</i> ; <i>big → bigger → the biggest</i> ; <i>easy → easier</i>.</li>
<li>Adjectif long : <i>expensive → more expensive → the most expensive</i>.</li>
<li>Irréguliers : <i>good → better → the best</i> ; <i>bad → worse → the worst</i>.</li>
<li>Égalité : <i>as rare as</i> ; « deux tragédies, deux réactions très différentes » : <i>two similar tragedies, but two very different reactions</i>.</li></ul>
<h3>Modaux</h3>
<ul><li><b>must</b> : obligation forte (<i>You must stay 100% legal</i>) · <b>mustn't</b> : interdiction.</li>
<li><b>have to</b> : obligation extérieure · <b>don't have to</b> : pas obligé.</li>
<li><b>should</b> : conseil (<i>The university should use two-step login</i>).</li>
<li><b>can / could</b> : capacité, possibilité · <b>may / might</b> : probabilité.</li></ul>
<h3>Connecteurs</h3>
<p>First, then, after that, finally · because, so, therefore · however, but, although · for example, such as · in addition, moreover · to conclude, in short.</p>`},
{t:'Writing a professional email or report',h:`
<pre><code>Subject: Security incident – finance mailbox (update 1)

Dear Ms Martin,

I am writing to inform you that an employee's account was compromised this morning.
At 8:32, an attacker logged in from an unknown device and created a forwarding rule.
We have already blocked the account and reset the password.
We recommend enabling two-step login for all staff as soon as possible.

Please let me know if you have any questions.

Best regards,
Alex Martin
Junior Security Analyst</code></pre>
<ul><li>Ouvrir : <i>Dear Mr / Ms + nom</i> (formel), <i>Hi Lucas</i> (informel). Fermer : <i>Best regards, Kind regards</i>.</li>
<li>Annoncer le but : <i>I am writing to inform you / to ask about…</i></li>
<li>Ce qui est fait : <i>We have already…</i> (present perfect) ; ce qui est prévu : <i>We will… / We are going to…</i></li>
<li>Recommander : <i>We recommend + -ing</i> ou <i>We recommend that you…</i>, <i>You should…</i></li>
<li>Rester prudent : <i>It seems that… / It is likely that… / We cannot confirm yet that…</i></li></ul>
<h3>Verbes utiles</h3>
<p>to breach (pénétrer, violer), to leak (fuiter), to hack into (pirater), to steal credentials, to spoof (usurper), to patch (corriger), to update, to back up (sauvegarder), to restore, to monitor (surveiller), to detect, to block, to report, to warn, to train staff.</p>`},
{t:'Giving a presentation',h:`
<ul><li><b>Introduce</b> : <i>Good morning everyone. Today, we're going to talk about… Our presentation is divided into four parts.</i></li>
<li><b>Move on</b> : <i>Let's move on to… Now, Lucas is going to explain… As you can see on this slide…</i></li>
<li><b>Give your opinion</b> : <i>In our opinion… We think that… We decided to… because…</i></li>
<li><b>Compare</b> : <i>On the one hand… on the other hand…</i></li>
<li><b>Conclude</b> : <i>To sum up… What we take away is… Thank you for your attention. Do you have any questions?</i></li>
<li><b>Answer a question</b> : <i>That's a good question. Could you repeat, please? I'm not sure, but I think…</i></li></ul>
<h3>Rappels de nos présentations</h3>
<ul><li><b>Phishing case study</b> : « One click. 4,300 people exposed. » Faute partagée (student small share, IT department biggest share, Dean medium share) ; stop the practice attack ; close the door then raise the alarm ; report within 72 hours under the GDPR ; one rule: two-step login for everyone.</li>
<li><b>Physical pentester</b> : a security expert paid to break into buildings legally, with a letter of authorisation ; observe → plan → get in → report ; skills: technical, human (social engineering), professional ; « the weakest point is often the human ».</li>
<li><b>VoidGuard Security (2189)</b> : secure comms between Earth and Mars, 4–24 min delay, no galactic police, old isolated systems.</li></ul>`}
],
cards:[
['credentials','identifiants (login + mot de passe)'],
['a breach','une violation / une intrusion (de données)'],
['a threat','une menace'],
['a vulnerability','une vulnérabilité, une faille'],
['to encrypt','chiffrer'],
['a backdoor','une porte dérobée'],
['social engineering','l\'ingénierie sociale'],
['evidence','des preuves (indénombrable : <i>some evidence</i>, pas <i>an evidence</i>)'],
['two-step login','la double authentification (MFA)'],
['to contain an incident','confiner / contenir un incident'],
['actually','en fait (faux ami : « actuellement » = currently)'],
['eventually','finalement (faux ami)'],
['GDPR','RGPD (General Data Protection Regulation)'],
['steal – stole – ?','<b>stolen</b>'],
['catch – caught – ?','<b>caught</b>'],
['throw – ? – thrown','<b>threw</b>'],
['Past simple ou present perfect : « In 2013, a law ___ (fail) in the Senate. »','<b>failed</b> (date précise = past simple)'],
['« We ___ just ___ (block) the account. »','<b>have</b> just <b>blocked</b> (present perfect)'],
['Comparatif de « good » et « bad » ?','better / the best · worse / the worst'],
['Donner un conseil avec un modal ?','<b>should</b> : <i>You should enable two-step login.</i>'],
['Annoncer la partie suivante d\'une présentation ?','<i>Let\'s move on to… / Now, X is going to explain…</i>'],
['Conclure une présentation ?','<i>To sum up… Thank you for your attention. Any questions?</i>'],
['a deadline','une échéance, une date limite'],
['lock picking','le crochetage de serrures'],
['to patch','corriger (appliquer un correctif)'],
['to back up · a backup','sauvegarder · une sauvegarde'],
['to leak · a leak','fuiter · une fuite'],
['to spoof','usurper (une adresse, une identité)'],
['to monitor','surveiller, superviser'],
['Formule pour annoncer le but d\'un email formel ?','<i>I am writing to inform you that…</i>'],
['Formule de fin d\'email professionnel ?','<i>Best regards / Kind regards</i>'],
['« Nous recommandons d\'activer… » en anglais ?','<i>We recommend enabling…</i> (recommend + -ing)'],
['Rester prudent sur un fait non confirmé ?','<i>It seems that… / We cannot confirm yet that…</i>'],
['currently','actuellement (≠ actually)'],
['a supplier','un fournisseur'],
['an invoice','une facture'],
['bank details','coordonnées bancaires']
],
quiz:[
{q:'Choose the correct form: "On December 14, 2012, a man ___ the school."',o:['has entered','entered','enters','was enter'],a:[1],e:'Date précise → past simple.'},
{q:'Choose the correct form: "The attackers ___ the data. Now it is online."',o:['stole','have stolen','has stolen','steal'],a:[1],e:'Résultat visible maintenant, sans date → present perfect ; sujet pluriel → have.'},
{q:'"Credentials" means:',o:['des diplômes','des identifiants','des crédits','des certificats SSL'],a:[1],e:'Login + password = credentials.'},
{q:'Which word is a false friend?',o:['firewall','actually','password','malware'],a:[1],e:'Actually = en fait. « Actuellement » se dit currently.'},
{q:'Choose the correct sentence:',o:['We have an evidence.','We have some evidence.','We have evidences.','We have a evidences.'],a:[1],e:'Evidence est indénombrable : some evidence, a piece of evidence.'},
{q:'Choose the best word: "The university ___ use two-step login for everyone." (advice)',o:['should','must not','might not','didn\'t'],a:[0],e:'Should exprime un conseil.'},
{q:'Superlative of "bad":',o:['the baddest','the worse','the worst','the most bad'],a:[2],e:'bad – worse – the worst.'},
{q:'Comparative of "expensive":',o:['expensiver','more expensive','most expensive','the expensivest'],a:[1],e:'Adjectif long → more + adjectif.'},
{q:'"Social engineering" means:',o:['le génie civil','l\'ingénierie sociale (manipuler les personnes)','les réseaux sociaux','la programmation'],a:[1],e:'Exploiter la confiance ou le stress des humains pour obtenir un accès.'},
{q:'Past participle of "steal":',o:['stealed','stole','stolen','stealt'],a:[2],e:'steal – stole – stolen.'},
{q:'Which phrase is used to move to the next part of a presentation?',o:['Let\'s move on to…','I am agree.','To sum up…','Nice to meet you.'],a:[0],e:'To sum up sert à conclure ; « I am agree » est une erreur (I agree).'},
{q:'"Did the student ___ on the link?"',o:['clicked','click','clicks','clicking'],a:[1],e:'Après did, base verbale.'},
{q:'In the GDPR, a data breach must be reported:',o:['within 24 hours','within 72 hours','within one week','never'],a:[1],e:'Within 72 hours to the supervisory authority (CNIL in France).'},
{q:'A physical pentester carries a "letter of authorisation" to:',o:['open doors','prove the intrusion is legal and ordered by the client','pay the guards','clone badges'],a:[1],e:'It shows they are not a burglar but a contracted tester.'},
{q:'Choose the correct form: "I ___ him yesterday."',o:['have seen','saw','have saw','seen'],a:[1],e:'Yesterday = moment précis → past simple.'},
{q:'"We recommend ___ two-step login."',o:['enable','to enabling','enabling','enabled'],a:[2],e:'recommend + verbe en -ing (ou recommend that you enable).'},
{q:'Best opening for a formal email to a manager you don\'t know:',o:['Hey!','Dear Ms Martin,','Yo Martin','Hi guys,'],a:[1],e:'Dear + Mr/Ms + nom de famille.'},
{q:'"Une facture" in English is:',o:['a facture','an invoice','a bill of lading','a receipt only'],a:[1],e:'Invoice (facture) ; receipt = reçu.'},
{q:'"Les coordonnées bancaires" in English:',o:['bank coordinates','bank details','bank address','bank points'],a:[1],e:'Bank details (ou bank account details).'},
{q:'Choose the correct sentence:',o:['We have already blocked the account.','We already have block the account.','We have blocked already the account yesterday.','We blocked already the account.'],a:[0],e:'have + already + participe passé ; pas de « yesterday » avec le present perfect.'},
{q:'"To patch a system" means:',o:['le réparer physiquement','lui appliquer un correctif','le débrancher','le peindre'],a:[1],e:'A patch = un correctif de sécurité.'},
{q:'Which sentence is the most cautious?',o:['The attacker is Dutch.','It seems that the attacker used a VPN in Amsterdam.','The attacker is definitely an AI.','Amsterdam attacked us.'],a:[1],e:'It seems that… exprime une hypothèse, pas un fait.'},
{q:'"Actuellement, nous analysons les logs" =',o:['Actually, we are analysing the logs.','Currently, we are analysing the logs.','Eventually, we analyse the logs.','Actual, we analyse logs.'],a:[1],e:'Actuellement = currently ; actually = en fait.'}
],
exos:[
{t:'Write an incident summary',pts:'entraînement',q:`<p>Write 5–6 sentences in English to explain the ORION incident to a manager: what happened, what is sure, what you recommend.</p>`,r:`
<p><i>This morning, an employee from the finance department received a fake Microsoft email. She clicked on the link and typed her password. A few minutes later, an attacker logged in to her mailbox from an unknown device and created a rule to forward emails about invoices and payments. He then asked a supplier to change the bank details. Fortunately, the supplier called us and no money has been lost. We recommend blocking the account, enabling two-step login for everyone and checking every bank detail change by phone.</i></p>
<p>À vérifier : past simple pour la chronologie, present perfect pour le résultat (<i>no money has been lost</i>), connecteurs (this morning, a few minutes later, then, fortunately), modal/verbe de recommandation.</p>`},
{t:'Present a cyber job',pts:'entraînement',q:`<p>Prepare a 1-minute introduction for a presentation about a cybersecurity job (structure: greeting, topic, plan, transition).</p>`,r:`
<p><i>Good morning everyone. My name is Alex and today I'm going to present a rare job in cybersecurity: the physical penetration tester. My presentation is divided into four parts. First, I'll explain what a physical pentester is. Then, I'll describe a typical mission, step by step. After that, we'll look at the skills you need. Finally, I'll talk about the pros, the cons and the salary. So, let's start with a simple question: what is a physical pentester?</i></p>`}
]
});
