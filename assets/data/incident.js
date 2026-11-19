/* Guardia_Rev · Analyse de la menace et gestion d'incident (projet ORION). */
window.GR=window.GR||{subjects:[]};
GR.subjects.push({
id:'incident', name:'Analyse de menace & gestion d\'incident', icon:'CTI', color:'linear-gradient(140deg,#7a4bd1,#4a2a8f)',
exam:'Projet ORION · analyse et restitution',
short:'Faits / hypothèses / incertitudes, niveau de confiance, phishing et compromission de messagerie, fraude à l\'IBAN, décisions et RGPD.',
intro:'La méthode du projet ORION : qualifier un incident à partir de pièces, distinguer ce qui est établi de ce qui est supposé, et toujours pouvoir répondre à « Prouvez-le ».',
fiche:[
{t:'La méthode d\'analyse',h:`
<p>Face à un incident, l'analyste ne cherche pas tout de suite à tout résoudre. Il qualifie la situation en séparant :</p>
<ul><li><b>Faits établis</b> : directement prouvés par une pièce (un journal, un message, un témoignage vérifié). Exemple : « une session inconnue s'est connectée à 08 h 32 depuis un nouveau terminal ».</li>
<li><b>Hypothèses</b> : explications possibles, appuyées par des éléments, mais non démontrées. Exemple : « les identifiants ont été volés par la fausse page ».</li>
<li><b>Incertitudes</b> : ce qu'on ne sait pas encore (origine exacte, autres comptes touchés, exfiltration…).</li>
<li><b>Vérifications</b> : comment lever chaque incertitude (journaux, en-têtes de mail, appel au fournisseur…).</li></ul>
<p>Chaque conclusion importante reçoit un <b>niveau de confiance</b> : <b>faible / moyen / élevé</b>, justifié par les éléments.</p>
<div class="key"><b>La question à se poser à chaque phrase</b> : « Qu'est-ce qui me permet d'affirmer cela ? ». Si la réponse est « rien de précis », ce n'est pas un fait.</div>
<p>Échelle utilisée au débrief : <b>possible → plausible → fortement soutenu → démontré</b>. Un score d'outil (« 92 % IA ») n'est pas une preuve si l'on ne sait pas ce qu'il mesure.</p>`},
{t:'La qualification',h:`
<p>Qualifier, c'est répondre à :</p>
<ul><li><b>Type de menace</b> : ex. compromission d'un compte de messagerie après hameçonnage, utilisée pour une <b>fraude à l'IBAN</b> (BEC, Business Email Compromise).</li>
<li><b>Actifs concernés</b> : compte et boîte mail Finance, coordonnées bancaires des fournisseurs, identité d'un dirigeant, réputation.</li>
<li><b>Impacts observés</b> (déjà constatés) et <b>impacts possibles</b> (financier, fuite de données, atteinte à l'image, juridique).</li>
<li><b>Acteur</b> : profil plausible (cybercriminel opportuniste, groupe organisé, interne) et <b>motivation</b> (financière, espionnage, idéologique, nuisance). Rester prudent : une localisation de connexion (Amsterdam) peut venir d'un VPN ou d'un service distant et ne désigne pas un auteur.</li></ul>
<h3>Le scénario ORION en bref</h3>
<ol><li>08 h 14 : faux mail « Microsoft 365 Security », urgence (« suspendu à 09 h 00 »), expéditeur et lien hors domaines Microsoft.</li>
<li>08 h 27 : la collaboratrice saisit adresse et mot de passe ; Outlook redemande ensuite la connexion.</li>
<li>08 h 32 : connexion réussie depuis un terminal inconnu.</li>
<li>08 h 36 : règle de transfert vers l'extérieur des mails contenant « Facture », « IBAN », « Paiement ».</li>
<li>08 h 56 / 09 h 08 : faux changement d'IBAN envoyé à un fournisseur, qui appelle pour vérifier.</li>
<li>Plus tard : faux mail et faux message vocal imitant le directeur financier (usurpation, IA possible mais non démontrée).</li></ol>`},
{t:'Les indices du phishing',h:`
<ul><li><b>Urgence</b> et menace (« votre compte sera bloqué dans 24 h »).</li>
<li><b>Autorité usurpée</b> (Microsoft, service informatique, directeur).</li>
<li>Adresse d'expéditeur ou <b>domaine du lien</b> qui ne correspond pas à l'organisation (typosquatting : micr0soft-secure.com).</li>
<li>Demande d'identifiants, de paiement ou de changement de coordonnées bancaires.</li>
<li>Fautes, mise en forme inhabituelle, pièce jointe inattendue.</li></ul>
<p>Variantes : <b>spear phishing</b> (ciblé), <b>whaling</b> (cible un dirigeant), <b>smishing</b> (SMS), <b>vishing</b> (appel vocal, éventuellement voix clonée par IA), <b>fraude au président</b>.</p>
<p>Signes de compromission d'une boîte mail : connexion depuis un terminal/pays inhabituel, <b>règles de transfert ou de suppression créées</b>, messages envoyés à l'insu de l'utilisateur, demandes répétées de reconnexion (jeton révoqué ou session volée).</p>`},
{t:'Analyser un email suspect',h:`
<p>Le nom affiché (« Microsoft 365 Security ») se falsifie librement ; il faut regarder les <b>en-têtes</b> (dans Outlook : Fichier › Propriétés ; dans Gmail : Afficher l'original).</p>
<ul><li><b>From</b> (adresse réelle), <b>Reply-To</b> (une adresse de réponse différente est un signal), <b>Return-Path</b>.</li>
<li><b>Received</b> : les serveurs traversés, du plus récent (en haut) au plus ancien ; l'IP d'origine est vers le bas.</li>
<li><b>SPF</b> : le serveur d'envoi est-il autorisé par le domaine ? (enregistrement DNS TXT). <b>DKIM</b> : signature cryptographique du message par le domaine. <b>DMARC</b> : politique du domaine si SPF/DKIM échouent (none, quarantine, reject) et rapports.</li>
<li>Résultat dans <code>Authentication-Results: spf=fail dkim=none dmarc=fail</code> : message très probablement usurpé.</li>
<li>Les <b>liens</b> : survoler pour voir l'URL réelle ; domaine proche (typosquatting), raccourcisseur, IP brute. Analyser une URL ou une pièce jointe dans un service comme VirusTotal (sans cliquer).</li></ul>
<div class="trap">Un mail peut passer SPF et DKIM et être malveillant : il suffit qu'il vienne d'un domaine de l'attaquant (micr0soft-support.com) ou d'une <b>vraie boîte compromise</b>, comme le faux IBAN envoyé depuis la boîte Finance dans ORION.</div>`},
{t:'Les pièges de l\'analyse',h:`
<ul><li><b>Biais de confirmation</b> : ne retenir que les indices qui vont dans le sens de sa première idée. Parade : chercher activement ce qui contredirait l'hypothèse.</li>
<li><b>Attribution hâtive</b> : « connexion depuis Amsterdam donc groupe néerlandais », « vocal parfait donc IA ». Une localisation ou un style ne désignent pas un auteur.</li>
<li><b>Confondre corrélation et causalité</b> : deux événements proches dans le temps ne sont pas forcément liés.</li>
<li><b>Faire confiance à un outil sans savoir ce qu'il mesure</b> (score « 92 % IA »).</li>
<li><b>Confondre absence de preuve et preuve d'absence</b> : « aucune exfiltration confirmée » ne veut pas dire « aucune exfiltration ».</li></ul>
<p>Formulations utiles : « les éléments disponibles <b>indiquent</b> », « nous <b>estimons</b> avec une confiance moyenne », « <b>rien ne permet à ce stade</b> d'affirmer ».</p>`},
{t:'Réagir : contenir, éradiquer, restaurer',h:`
<p>Cycle de réponse à incident (NIST) : <b>Préparation → Détection et analyse → Confinement, éradication, restauration → Retour d'expérience</b>.</p>
<h3>Décisions prioritaires dans ORION</h3>
<ol><li><b>Couper l'accès de l'attaquant</b> : révoquer toutes les sessions, changer le mot de passe, <b>supprimer la règle de transfert</b>, activer la <b>MFA</b> (A2F). Risque si on ne le fait pas : l'attaquant continue de lire et d'écrire.</li>
<li><b>Verrouiller les paiements sensibles</b> : aucun changement d'IBAN sans <b>rappel au numéro habituel</b> (pas celui du mail) ; prévenir le fournisseur et la banque. Risque : un virement détourné.</li>
<li><b>Préserver les preuves</b> : en-têtes des mails, journaux de connexion et d'audit, enregistrement audio original. Risque : ne jamais pouvoir trancher.</li></ol>
<p>Ensuite : vérifier les autres comptes (même campagne ?), chercher le mail de phishing chez les autres destinataires et le supprimer, bloquer le domaine malveillant, sensibiliser.</p>
<div class="trap">Ne pas « couper tout le réseau » par réflexe : l'action doit être proportionnée à ce qui est établi. Ne pas effacer les traces en voulant nettoyer.</div>`},
{t:'Obligations : RGPD, CNIL, ANSSI',h:`
<ul><li><b>RGPD</b> (article 33) : en cas de violation de données personnelles présentant un risque, notification à la <b>CNIL dans les 72 heures</b> après en avoir pris connaissance. On peut notifier <b>en plusieurs étapes</b> (notification initiale puis compléments).</li>
<li>Article 34 : si le risque est <b>élevé</b> pour les personnes, il faut aussi les informer.</li>
<li>Tenir un registre interne des violations, même non notifiées.</li>
<li>Déposer plainte en cas d'escroquerie ; signaler sur <b>cybermalveillance.gouv.fr</b> ; ressources et alertes du <b>CERT-FR (ANSSI)</b>.</li>
<li>Sources fiables pour étayer une analyse : ANSSI / CERT-FR, CNIL, cybermalveillance.gouv.fr, MITRE ATT&amp;CK, Microsoft (documentation de sécurité).</li></ul>`},
{t:'Restituer à un décideur',h:`
<p>Le briefing final s'adresse à un <b>responsable non spécialiste</b> : il doit comprendre en une minute et pouvoir décider.</p>
<ul><li><b>Synthèse exécutive</b> d'abord : ce qui est établi, ce qu'on évalue, ce qu'il faut décider aujourd'hui.</li>
<li>Une <b>chronologie</b> courte avec la source et le niveau de chaque événement.</li>
<li>Séparer visuellement <b>établi / supposé / inconnu</b>.</li>
<li>Des <b>décisions numérotées</b>, chacune avec le risque si on ne la prend pas.</li>
<li>Expliquer chaque terme technique avec une image simple ; une idée par diapositive.</li>
<li>Préparer les questions « Prouvez-le » : pour chaque affirmation, la pièce qui la soutient.</li></ul>`}
],
cards:[
['Fait vs hypothèse ?','Un fait est prouvé par une pièce ; une hypothèse est une explication soutenue par des éléments mais non démontrée.'],
['Les 3 niveaux de confiance ?','Faible, moyen, élevé.'],
['La question à se poser pour chaque affirmation ?','« Qu\'est-ce qui me permet d\'affirmer cela ? » (Prouvez-le).'],
['Qu\'est-ce qu\'une fraude à l\'IBAN / BEC ?','Usurper une messagerie professionnelle pour faire modifier des coordonnées bancaires et détourner un paiement.'],
['Signe typique d\'une boîte mail compromise ?','Une règle de transfert/suppression créée à l\'insu de l\'utilisateur, une connexion depuis un terminal inconnu.'],
['4 indices d\'un mail de phishing ?','Urgence, autorité usurpée, domaine incohérent, demande d\'identifiants ou de paiement.'],
['Spear phishing ? Whaling ? Vishing ?','Phishing ciblé · ciblant un dirigeant · par appel vocal.'],
['Première décision face à un compte mail compromis ?','Couper l\'accès : révoquer les sessions, changer le mot de passe, supprimer la règle, activer la MFA.'],
['Comment vérifier une demande de changement d\'IBAN ?','Rappeler le fournisseur au numéro habituel, jamais celui indiqué dans le mail.'],
['Pourquoi préserver les preuves ?','Pour pouvoir établir les faits, attribuer et porter plainte.'],
['Délai de notification RGPD à la CNIL ?','72 heures après la prise de connaissance (notification possible en plusieurs étapes).'],
['Les phases de la réponse à incident (NIST) ?','Préparation ; détection et analyse ; confinement, éradication, restauration ; retour d\'expérience.'],
['Une connexion depuis Amsterdam prouve-t-elle l\'origine de l\'attaquant ?','Non : VPN, proxy ou service distant ; c\'est un indice, pas une attribution.'],
['Un score « 92 % généré par IA » est-il une preuve ?','Non, si l\'on ne sait pas ce que l\'outil mesure : c\'est au mieux un indice.'],
['Mesure qui rend un mot de passe volé inutile ?','L\'authentification multifacteur (MFA / A2F).'],
['SPF ?','Enregistrement DNS qui liste les serveurs autorisés à envoyer des mails pour un domaine.'],
['DKIM ?','Signature cryptographique du message par le domaine expéditeur.'],
['DMARC ?','Politique du domaine (none, quarantine, reject) quand SPF/DKIM échouent, avec rapports.'],
['Biais de confirmation ?','Ne retenir que les indices qui confirment sa première hypothèse.'],
['« Aucune exfiltration confirmée » = « aucune exfiltration » ?','Non : absence de preuve n\'est pas preuve d\'absence.'],
['Quel en-tête révèle l\'adresse de réponse réelle d\'un mail ?','Reply-To (à comparer avec From).']
],
quiz:[
{q:'« La collaboratrice a saisi son mot de passe sur la page du lien » (déclaré au support). C\'est :',o:['Un fait établi par sa déclaration','Une hypothèse sans fondement','Une incertitude','Une attribution'],a:[0],e:'C\'est un fait déclaratif, appuyé par la pièce 2. Que cette saisie soit à l\'origine de la session de 08 h 32 reste une déduction (très probable).'},
{q:'« L\'attaquant est un groupe criminel basé aux Pays-Bas. » Quel niveau de confiance ?',o:['Élevé','Moyen','Faible'],a:[2],e:'Une géolocalisation de connexion ne désigne pas un auteur (VPN, relais).'},
{q:'Quel type d\'attaque est le plus probable dans ORION ?',o:['Ransomware','Compromission de messagerie par phishing, à but financier (fraude à l\'IBAN)','Déni de service','Attaque physique'],a:[1],e:'Phishing → session illégitime → règle de transfert → faux IBAN : schéma typique de BEC.'},
{q:'Quels éléments sont des signes de compromission de la boîte Finance ?',o:['Connexion réussie depuis un terminal inconnu','Création d\'une règle de transfert vers l\'externe','Un fournisseur qui rappelle pour vérifier','Un message envoyé au fournisseur à l\'insu de la collaboratrice'],a:[0,1,3],e:'L\'appel du fournisseur est un bon réflexe, pas un signe de compromission.'},
{q:'Quelles sont les actions prioritaires pour contenir l\'incident ?',o:['Révoquer les sessions et changer le mot de passe','Supprimer la règle de transfert','Couper tout le réseau de l\'école','Verrouiller les changements d\'IBAN'],a:[0,1,3],e:'Les actions doivent être proportionnées ; couper tout le réseau n\'est pas justifié par les faits.'},
{q:'Pourquoi conserver l\'enregistrement original du message vocal ?',o:['Pour le publier','Pour pouvoir analyser son origine et prouver l\'usurpation','Ce n\'est pas utile','Pour l\'envoyer au fournisseur'],a:[1],e:'Préserver les preuves permet de trancher (IA ou non, même acteur ou non) et d\'appuyer une plainte.'},
{q:'Quel est le délai de notification d\'une violation de données à la CNIL ?',o:['24 heures','72 heures','7 jours','1 mois'],a:[1],e:'Article 33 du RGPD : 72 h, avec possibilité de compléter ensuite.'},
{q:'Quel indice NE caractérise PAS un mail de phishing ?',o:['Un sentiment d\'urgence','Un lien vers un domaine inconnu','Un expéditeur connu, sur le domaine habituel, sans demande particulière','Une demande d\'identifiants'],a:[2],e:'Les trois autres sont des signaux classiques.'},
{q:'Quelle mesure aurait le plus limité l\'attaque, même après la saisie du mot de passe ?',o:['Un antivirus plus récent','L\'authentification multifacteur','Un écran plus grand','Changer de navigateur'],a:[1],e:'Avec la MFA, le mot de passe seul ne suffit pas à ouvrir une session.'},
{q:'Dans un briefing à la direction, que faut-il présenter en premier ?',o:['Les journaux bruts','Une synthèse : établi, évalué, décisions à prendre','La liste des outils utilisés','L\'historique de l\'entreprise'],a:[1],e:'Le décideur doit comprendre vite et savoir quoi décider.'},
{q:'Le vishing désigne :',o:['Un phishing par SMS','Un phishing par appel ou message vocal','Un virus','Un pare-feu'],a:[1],e:'Voice phishing. Le smishing est par SMS.'},
{q:'Dans la réponse à incident, l\'étape qui consiste à empêcher l\'attaquant de continuer s\'appelle :',o:['Préparation','Confinement','Retour d\'expérience','Attribution'],a:[1],e:'Puis viennent éradication et restauration.'},
{q:'Un mail affiche « Authentication-Results: spf=fail; dmarc=fail ». Qu\'en conclure ?',o:['Le mail est authentique','Le serveur d\'envoi n\'est pas autorisé par le domaine affiché : usurpation probable','La pièce jointe est saine','Le destinataire est piraté'],a:[1],e:'C\'est un indice fort d\'usurpation du domaine expéditeur.'},
{q:'Le faux IBAN d\'ORION a été envoyé depuis la vraie boîte Finance. SPF et DKIM :',o:['échouent forcément','passent probablement, car le mail part du vrai serveur de l\'école','n\'existent pas pour Microsoft 365','bloquent le message'],a:[1],e:'SPF/DKIM authentifient le domaine, pas l\'intention : une boîte compromise envoie des mails « authentiques ».'},
{q:'Quel enregistrement indique quels serveurs peuvent envoyer des mails pour un domaine ?',o:['MX','SPF','PTR','CNAME'],a:[1],e:'SPF est un enregistrement TXT dans le DNS du domaine. MX indique où recevoir les mails.'},
{q:'« La connexion vient d\'Amsterdam, l\'attaquant est donc néerlandais. » Quel piège ?',o:['Biais de confirmation / attribution hâtive','Absence de preuve','Faux négatif','Aucun piège'],a:[0],e:'VPN, proxy, serveur loué : la géolocalisation d\'une IP ne désigne pas un auteur.'},
{q:'Quelle formulation convient à une hypothèse non démontrée ?',o:['« Il est certain que l\'IA a été utilisée »','« Nous estimons, avec une confiance faible, que le vocal a pu être généré par IA »','« L\'IA a fait le coup »','« Aucune IA n\'a été utilisée »'],a:[1],e:'On sépare clairement le supposé de l\'établi et on donne le niveau de confiance.'},
{q:'Un fournisseur reçoit une demande de changement d\'IBAN. Quelle vérification est la plus sûre ?',o:['Répondre au mail pour demander confirmation','Appeler le numéro indiqué dans le mail','Rappeler au numéro habituel, connu avant la demande','Vérifier l\'orthographe du mail'],a:[2],e:'Répondre au mail ou appeler le numéro du mail revient à parler à l\'attaquant.'}
],
exos:[
{t:'Grille d\'analyse V1',pts:'entraînement',q:`<p>À partir des pièces 1 à 6 d'ORION (mail « Microsoft 365 Security » à 08 h 14, saisie du mot de passe déclarée à 08 h 27, connexion réussie depuis un nouveau terminal à 08 h 32, règle de transfert « Facture / IBAN / Paiement » à 08 h 36, appel d'un fournisseur qui a reçu une demande de changement d'IBAN à 09 h 08 ; à 09 h 20 aucun chiffrement, aucune exfiltration confirmée, aucun autre compte touché), remplissez : faits, hypothèse privilégiée et éléments, qualification, incertitudes, vérifications, conclusion en 5 lignes.</p>`,r:`
<p><b>Faits établis</b> : mail frauduleux reçu (expéditeur et lien hors domaines Microsoft) ; identifiants saisis sur la page (déclaration) ; connexion réussie depuis un terminal inconnu ; règle de transfert créée ; demande de changement d'IBAN envoyée depuis l'adresse de la collaboratrice ; aucun virement à ce stade.</p>
<p><b>Hypothèse privilégiée</b> (confiance élevée) : vol d'identifiants par phishing, puis prise de contrôle de la boîte pour une <b>fraude à l'IBAN</b>. Éléments : enchaînement chronologique en 22 minutes, mots-clés financiers de la règle, demande au fournisseur.</p>
<p><b>Qualification</b> : compromission de messagerie (BEC) ; acteur : cybercriminel à motivation <b>financière</b> (confiance élevée sur la motivation, faible sur l'identité) ; actifs : compte M365 Finance, données fournisseurs et bancaires ; impacts observés : compte compromis, tentative de fraude ; possibles : virement détourné, fuite de factures, rebond sur d'autres comptes, atteinte à l'image.</p>
<p><b>Incertitudes</b> : origine exacte de la connexion ; mails déjà transférés ou téléchargés ? autres destinataires du phishing ? autres comptes compromis ?</p>
<p><b>Vérifications</b> : journaux de connexion et d'audit M365 (IP, user-agent, actions) ; suivi des messages (transferts effectifs) ; recherche du mail chez les autres utilisateurs ; en-têtes du mail ; contrôle des paiements récents avec la banque.</p>
<p><b>Conclusion pour un responsable</b> : « Un pirate a volé le mot de passe d'une collaboratrice de la comptabilité avec un faux mail Microsoft. Il a utilisé sa messagerie pour tenter de faire changer les coordonnées bancaires d'un fournisseur. Aucun argent n'est parti grâce au fournisseur qui a appelé. Nous bloquons l'accès du pirate, sécurisons les paiements et vérifions qu'aucun autre compte n'est touché. »</p>`},
{t:'Décider et justifier',pts:'entraînement',q:`<p>La direction vous donne 3 minutes. Proposez trois décisions, dans l'ordre, chacune avec le risque si elle n'est pas prise.</p>`,r:`
<ol><li><b>Couper l'accès à la boîte Finance</b> (révocation des sessions, nouveau mot de passe, suppression de la règle, MFA). Sinon : l'attaquant continue à lire et envoyer des mails au nom de l'école.</li>
<li><b>Verrouiller les paiements</b> : aucun changement d'IBAN sans rappel au numéro habituel ; prévenir le fournisseur et la banque. Sinon : un virement détourné, très difficile à récupérer.</li>
<li><b>Sécuriser les preuves</b> (en-têtes, journaux, audio original) et évaluer l'obligation de notifier la CNIL sous 72 h. Sinon : impossible d'établir les faits, de porter plainte ou de respecter le RGPD.</li></ol>`}
]
});
