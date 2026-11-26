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
<li>Préparer les questions « Prouvez-le » : pour chaque affirmation, la pièce qui la soutient.</li></ul>`},
{t:'ORION V2 : nouvelles pièces et chronologie argumentée',h:`
<p>Après la V1, le responsable de l'établissement demande : <i>ce que l'on peut réellement affirmer, ce qui reste incertain et quelles vérifications faire en priorité</i>. Pas une liste de toutes les attaques possibles : un <b>raisonnement</b>. On garde la V1 et on explique ce qui change.</p>
<h3>Les pièces 7 à 9</h3>
<div class="tbl"><table><tr><th>Pièce</th><th>Ce qu'elle apporte</th><th>Ce qu'elle ne permet pas de conclure</th></tr>
<tr><td>7 · 09 h 35 · support</td><td>Deux connexions <b>légitimes</b> d'autres salariés ont la même localisation (Amsterdam).</td><td>La localisation seule ne prouve plus rien ; on ne sait pas si ce service a été utilisé pour la connexion Finance de 08 h 32.</td></tr>
<tr><td>8 · 09 h 40 · rectification</td><td>Règle de transfert créée à 08 h 36 <b>confirmée</b> ; deux transferts (FIN-044 à 08 h 41, FIN-045 à 08 h 52) <b>bloqués</b>.</td><td>Rien sur les autres messages, la consultation de la boîte ou des téléchargements.</td></tr>
<tr><td>9 · 09 h 50 · Finance</td><td>Le message demandait un remboursement sur un <b>nouvel IBAN</b> ; à 09 h 08 le fournisseur n'avait rien payé.</td><td>Les opérations ultérieures et les autres partenaires ne sont pas encore vérifiés.</td></tr></table></div>
<h3>1. Une chaîne d'événements, pas une liste d'horaires</h3>
<ul><li>Pour chaque événement : l'<b>heure</b> (ou l'intervalle), la <b>pièce</b> et sa nature (trace technique, déclaration, compte rendu), ce qu'il <b>établit vraiment</b>, le lien supposé avec les autres.</li>
<li>L'heure d'un <b>signalement</b> n'est pas l'heure de l'<b>action</b> signalée.</li>
<li>Scénario en enchaînement <code>Événement → Événement → Événement</code>, chaque flèche qualifiée : <b>lien établi</b> / <b>lien supposé</b> / <b>lien à vérifier</b>. Repérer au moins deux causalités pas encore démontrées (deux faits qui se suivent ne sont pas forcément liés).</li></ul>
<h3>2. Mettre l'hypothèse principale en concurrence</h3>
<p>Une hypothèse principale + <b>deux alternatives crédibles</b> (elles peuvent ne porter que sur un point : origine de la connexion, façon d'obtenir l'accès, périmètre des données). Tableau : éléments qui la soutiennent · éléments qui la fragilisent · <b>vérification qui permet de départager</b> · niveau de confiance justifié.</p>
<div class="key">Bien analyser, ce n'est pas changer d'avis sur tout : c'est savoir ce qu'il faut <b>réviser</b> et ce qu'il faut <b>conserver</b>.</div>
<h3>3. Documentation n'est pas preuve</h3>
<p>Vérifier trois affirmations (accès au compte, circulation des données, tentative de fraude) avec au moins <b>deux sources professionnelles</b> : Cybermalveillance.gouv.fr (piratage de boîte mail, fraude au faux ordre de virement), Microsoft Learn (compte de messagerie compromis dans Microsoft 365). Colonnes : ce que les pièces établissent · ce que la documentation explique · ce qui reste à vérifier.</p>
<div class="trap">Une source externe explique un <b>mécanisme</b>. Elle ne prouve pas qu'il s'est produit chez Orion : décrire les règles de transfert malveillantes ne démontre pas qu'un message précis est sorti de la boîte.</div>
<h3>4. Trois investigations prioritaires</h3>
<p>L'équipe informatique ne traite que trois demandes. « Vérifier les logs » est trop vague : pour chaque demande, préciser <b>quoi, à qui</b>, l'incertitude levée, le résultat qui <b>renforcerait</b> et celui qui <b>affaiblirait</b> l'hypothèse. Justifier : pourquoi avant les autres ? quelle décision en dépend ? Ajouter une investigation <b>reportée</b> et pourquoi. On n'invente jamais les résultats.</p>
<h3>5 et 6. Relecture croisée et note de situation</h3>
<ul><li>Une autre équipe relit : une conclusion bien soutenue, une affirmation qui va trop loin, une alternative ou une information manquante. Chaque remarque renvoie à une phrase et à une pièce ; on répond par ce qu'on corrige, ce qu'on garde et pourquoi.</li>
<li><b>Note de situation de 200 mots maximum</b> pour le responsable : que s'est-il passé ? sur quoi repose l'analyse ? conséquences connues ? principales incertitudes ? vérifications prioritaires ? Un niveau de confiance <b>par conclusion</b>, pas un seul pour tout le dossier.</li>
<li>Bilan : « Entre V1 et V2, nous avons conservé…, modifié… et retiré…, parce que… ». On ne réécrit pas la V1.</li>
<li>Point d'avancement : <b>2 minutes</b> (conclusion, principal changement depuis la V1, première demande d'investigation) puis questions à n'importe quel membre.</li></ul>`},
{t:'L\'IA dans la chaîne d\'attaque (séance 2)',h:`
<p>Le fil rouge reste « <b>Prouvez-le.</b> » et s'enrichit d'une question : « <b>Qui vous l'a dit ?</b> ». Une analyse n'est jamais figée : la vraie question n'est pas « avions-nous raison ? » mais « avions-nous de bonnes raisons de conclure cela avec ce que nous savions ? ».</p>
<h3>Ce que l'IA change… et ce qu'elle ne change pas</h3>
<div class="tbl"><table><tr><th>L'IA peut aider l'attaquant à</th><th>Ce qui ne disparaît pas</th></tr>
<tr><td>Rechercher et profiler une cible, écrire ou améliorer un message d'ingénierie sociale, changer de langue ou de ton, produire du code, automatiser, traiter beaucoup de données, répéter à grande échelle.</td><td>Une cible, des actifs, des vulnérabilités, des vecteurs, des actions, des objectifs, des impacts. Un phishing reste un phishing, une fraude reste une fraude, même si une IA a aidé.</td></tr></table></div>
<p>L'IA <b>amplifie</b> des capacités existantes : <b>vitesse, volume, personnalisation, coût</b>, parfois qualité. Pour l'ANSSI, aucune IA générative n'a démontré qu'elle pouvait mener <b>seule</b> toutes les étapes d'une attaque. Éviter les deux excès : « l'IA ne change rien » et « l'IA fait tout toute seule ».</p>
<div class="trap">Un email parfaitement écrit ne prouve pas qu'une IA l'a produit, et un email plein de fautes ne prouve pas le contraire.</div>
<h3>Deepfake : détecter ou vérifier ?</h3>
<p>Un <b>hypertrucage</b> (deepfake) est un contenu audio, photo ou vidéo créé ou modifié par IA (voix, visage, scène). Indices possibles : visage qui bouge mal, lèvres décalées, lumière incohérente, son étrange, demande urgente ou inhabituelle. Mais <b>un indice n'est pas une preuve</b>.</p>
<div class="key">Plutôt que « ce contenu est-il généré par IA ? » (souvent impossible à trancher), demander « <b>puis-je vérifier que cette personne est à l'origine de la demande ?</b> » : rappeler sur le numéro habituel, passer par un autre canal ou une personne connue, appliquer la procédure de validation.</div>
<h3>Une IA de défense peut se tromper</h3>
<p>Elle aide à trier les alertes, résumer, regrouper, repérer des anomalies. Mais une synthèse claire et professionnelle peut être fausse. Avant de reprendre une affirmation : <b>sur quoi repose-t-elle ?</b> <b>fait ou interprétation ?</b> <b>puis-je la vérifier ?</b> <b>quel niveau de confiance</b> (tiré des éléments, pas du ton de l'outil) ?</p>
<ul><li>Bonne utilisation : <code>IA → piste → vérification → source → conclusion</code>, pas <code>IA → réponse → copier-coller</code>. Si l'outil écrit « Selon l'ANSSI… », il faut retrouver la publication, le passage et le contexte.</li>
<li><b>Biais d'automatisation</b> : on fait trop confiance à une réponse rapide, technique et chiffrée. Un « confiance : 92 % » ne vaut rien sans savoir ce qu'il mesure, sur quelles données, comment il est calculé et quelles sont les limites du système.</li></ul>
<h3>Grille de contrôle (humain ou IA)</h3>
<div class="tbl"><table><tr><th>Question</th><th>À vérifier</th></tr>
<tr><td>Quelle est l'affirmation ?</td><td>La formuler précisément</td></tr>
<tr><td>Quelle preuve est fournie ?</td><td>Trace, document, source</td></tr>
<tr><td>Puis-je retrouver cette preuve ?</td><td>Vérification indépendante</td></tr>
<tr><td>Existe-t-il une autre explication ?</td><td>Hypothèse alternative</td></tr>
<tr><td>Quel est mon niveau de confiance ?</td><td>Faible / Moyen / Élevé</td></tr></table></div>
<h3>Décider, et le coût d'une décision</h3>
<p>On décide souvent avec des faits incomplets : la question devient « avons-nous assez d'éléments pour décider ? ». Toute mesure a un coût (bloquer un compte empêche de travailler, suspendre les paiements perturbe l'activité…) : une décision doit être <b>justifiée, proportionnée, priorisée</b>.</p>
<p><b>Trois relations IA et cyber</b> (ANSSI) : faire face à l'IA des attaquants ; faire de la cyber <b>avec</b> l'IA ; <b>sécuriser l'IA</b> elle-même (données, modèle, infrastructure, chaîne logicielle).</p>`},
{t:'ORION V3 : pièces 10 à 14, audit de l\'IA et décisions',h:`
<p>V1 : première analyse · V2 : approfondir et demander des investigations · <b>V3 : exploiter les résultats, réévaluer et décider</b>. La V3 s'ajoute dans le même document, la V2 n'est pas réécrite. Elle sert de support au briefing.</p>
<h3>Les nouvelles pièces</h3>
<div class="tbl"><table><tr><th>Pièce</th><th>Contenu</th><th>Piège</th></tr>
<tr><td>10 · 10 h 12</td><td>Email très personnalisé « Marc, Direction financière » depuis une adresse <b>externe</b> : liste des remboursements en attente et IBAN, avant 11 h, sans passer par le dossier partagé. Marc et le dossier Fournex existent.</td><td>« Le français est trop bon, c'est forcément de l'IA » n'est pas une preuve.</td></tr>
<tr><td>11 · 10 h 21</td><td>Message vocal à la voix de Marc, depuis un numéro <b>qui n'est pas le sien</b>, urgent, « ne rappelle pas Fournex ».</td><td>« Si la voix est identique, c'est forcément un deepfake » : non démontré.</td></tr>
<tr><td>12 · 10 h 28</td><td>Synthèse d'un assistant IA du SOC : groupe criminel néerlandais, exfiltration de données financières, deepfake, score de <b>92 %</b> sans explication.</td><td>Mélange faits, interprétations et affirmations contredites.</td></tr>
<tr><td>13 · 10 h 42</td><td>Une <b>même session</b> de 08 h 32 à 08 h 56 : accès à la boîte, création de la règle, recherche « Fournex », lecture du message de remboursement de 4 800 €, envoi au fournisseur. La collaboratrice n'a ni utilisé ce terminal ni créé la règle. Aucun autre transfert automatique abouti.</td><td>On ne sait toujours pas si des données ont été copiées ou téléchargées autrement.</td></tr>
<tr><td>14 · 10 h 48</td><td>Aucun virement vers le nouvel IBAN, aucun autre fournisseur ni compte touché. Marc (rappelé sur son vrai numéro) n'a envoyé ni l'email ni le vocal ; un webinaire public de 45 min avec sa voix existe.</td><td>Qu'un enregistrement public existe ne prouve pas qu'il a servi.</td></tr></table></div>
<h3>Auditer la synthèse de l'IA, affirmation par affirmation</h3>
<p>Classer chaque phrase : <b>Confirmée / Plausible / Non démontrée / Contredite</b>, avec la pièce utilisée et jusqu'où on peut conclure. Par exemple :</p>
<ul><li>« Identifiants obtenus par phishing » : <b>fortement soutenu</b> (pièces 1 à 3 et 13).</li>
<li>« Objectif financier » : <b>fortement soutenu</b> (règle sur Facture/IBAN/Paiement, faux IBAN, demande de la pièce 10).</li>
<li>« Groupe criminel aux Pays-Bas » : <b>non démontré</b> (la pièce 7 montre que cette localisation est aussi celle de connexions légitimes).</li>
<li>« Données exfiltrées grâce à la règle » : <b>contredit</b> pour les transferts automatiques (bloqués), et non démontré pour le reste.</li>
<li>« Le vocal est un deepfake » : <b>plausible</b>, pas démontré.</li></ul>
<h3>L'échelle pour le rôle de l'IA</h3>
<p><b>Possible → Plausible → Fortement soutenu → Démontré</b>, pour trois hypothèses : l'email a été écrit avec une IA ; le vocal a été généré par IA ; l'attaquant utilise l'IA dans la campagne. Questions clés : l'accès à la boîte et la lecture du dossier Fournex suffisent-ils à expliquer la personnalisation <b>sans IA</b> ? Marc n'étant pas l'auteur du vocal, est-ce <b>automatiquement</b> un deepfake ?</p>
<div class="key">Conclusion défendable : « l'utilisation de l'IA est <b>plausible</b>, mais elle n'est <b>pas démontrée</b> », à condition d'expliquer ce qu'on sait, ce qu'on suppose et ce qu'il faudrait obtenir pour monter d'un niveau.</div>
<h3>Exploiter les investigations, puis décider</h3>
<ul><li>Montrer : une investigation qui a eu sa réponse, une réponse partielle, une question toujours ouverte, et « la nouvelle information qui modifie le plus notre analyse est… parce que… ».</li>
<li><b>Trois décisions maximum</b>, chacune avec : décision · pourquoi maintenant · risque si on ne fait rien.</li></ul>
<h3>Le briefing de fin de séance (4 min + 2 min de questions)</h3>
<div class="tbl"><table><tr><th>Partie</th><th>Durée</th></tr>
<tr><td>Situation : que pensons-nous qu'il s'est passé ?</td><td>≈ 40 s</td></tr>
<tr><td>Les trois éléments déterminants (pas cinq, pas dix)</td><td>≈ 50 s</td></tr>
<tr><td>Ce que l'on sait vraiment du rôle de l'IA</td><td>≈ 50 s</td></tr>
<tr><td>Nos trois décisions</td><td>≈ 1 min 20</td></tr>
<tr><td>« La principale information qui nous manque encore est…, parce que… »</td><td>≈ 20 s</td></tr></table></div>
<p>Tout le monde parle, sans lire un texte ; n'importe qui peut être interrogé. Critères : clarté, preuves, gestion de l'incertitude, décision, maîtrise collective.</p>`},
{t:'Séance 3 : de l\'analyse à la décision, et la soutenance',h:`
<h3>Fait, conclusion, risque, recommandation, décision</h3>
<ul><li><b>Fait</b> : directement établi par les informations disponibles.</li>
<li><b>Conclusion d'analyse</b> : ce que plusieurs éléments permettent raisonnablement de déduire.</li>
<li><b>Risque</b> : une conséquence négative qui peut se produire ou se poursuivre.</li>
<li><b>Recommandation</b> : l'action proposée par l'analyste pour réduire ce risque.</li>
<li><b>Décision</b> : le choix de la personne qui a l'autorité. <b>L'analyste recommande, le décideur décide.</b></li></ul>
<p>Chaîne attendue : <code>Élément observé → Conclusion → Risque → Recommandation</code>. Une recommandation doit <b>découler de l'analyse</b>, pas d'une « bonne pratique » générale. Question à toujours se poser : <i>quel élément de notre analyse justifie cette action ?</i></p>
<h3>Prioriser : trois horizons</h3>
<div class="tbl"><table><tr><th>Horizon</th><th>But</th><th>Question</th></tr>
<tr><td><b>Immédiat</b></td><td>Réduire un risque actif</td><td>Que se passe-t-il si on attend encore une heure ?</td></tr>
<tr><td><b>Court terme</b></td><td>Comprendre le périmètre, stabiliser, contrôler, revenir à un fonctionnement maîtrisé</td><td>Que faire une fois le danger immédiat traité ?</td></tr>
<tr><td><b>Après l'incident</b></td><td>Éviter que ça recommence (procédure, contrôle, formation, configuration, retour d'expérience)</td><td>Est-ce de l'amélioration durable plutôt que de l'urgence ?</td></tr></table></div>
<div class="trap">« Si tout est prioritaire, rien n'est prioritaire. » Former tout le personnel au phishing est utile, mais ce n'est pas la première décision quand un compte est encore utilisable par l'attaquant.</div>
<p>Pour chaque action : quel risque réduit-elle ? ce risque est-il <b>actif</b> ? que se passe-t-il si on attend ? quel est son <b>coût</b> (activité bloquée, ressources, utilisateurs gênés, délais) ?</p>
<h3>Une recommandation précise</h3>
<p>Formule : <b>Nous recommandons à [acteur] de [action précise], [quand], afin de [risque réduit], car [élément de l'analyse].</b></p>
<p>Exemple : « Nous recommandons à la DSI de révoquer immédiatement les sessions actives du compte Finance et de réinitialiser ses accès, afin d'empêcher la poursuite d'une utilisation non autorisée. » À éviter : « améliorer la sécurité », « vérifier les logs », « sensibiliser les salariés ».</p>
<p><b>Décider sans tout savoir</b> : attendre la certitude est aussi un risque. Ne pas savoir si une IA a servi n'empêche pas de protéger un compte dont l'usage frauduleux est fortement établi. Demander : <i>cette information manquante changerait-elle notre décision ?</i></p>
<h3>Du dossier au briefing management</h3>
<p>Ne pas raconter l'enquête pièce par pièce. Dire « les traces techniques montrent que la même session a recherché puis consulté les informations Fournex avant l'envoi du message frauduleux » plutôt que « dans la pièce 13, à 08 h 38… ». Devant chaque information : « <b>Et alors ?</b> » ; si elle ne change ni la compréhension, ni la confiance, ni le risque, ni une recommandation, elle prend peu de place.</p>
<h3>Le deck : 10 à 15 slides</h3>
<p>Une slide = un message, porté par le titre (« La compromission du compte Finance est fortement établie » plutôt que « Analyse de la connexion »). Peu de texte, preuves visibles, niveaux de confiance distincts, sources traçables. Commencer par écrire <b>les titres seuls</b> : leur suite doit déjà raconter l'analyse.</p>
<p>Structure possible : titre · synthèse exécutive (3 messages) · situation · déroulement · qualification · éléments déterminants · incertitudes · rôle de l'IA · impacts et risques · 3 recommandations · plan d'action (immédiat / court terme / après) · conclusion et décision attendue. Logique : <code>Situation → Preuves → Analyse → Risques → Décisions</code>.</p>
<h3>La soutenance finale</h3>
<ul><li><b>15 minutes</b> de briefing + <b>5 à 10 minutes</b> de questions individuelles. Chacun parle ; on répartit la parole, <b>pas la compréhension</b>.</li>
<li>Posture d'analystes juniors face à des managers : « Nous pouvons établir que… », « Notre niveau de confiance est élevé parce que… », « À ce stade, nous ne pouvons pas démontrer que… ». « Nous ne savons pas encore » est acceptable, inventer une réponse ne l'est pas.</li>
<li>Découpage conseillé : situation et qualification (≈ 2 min), 3 à 5 éléments déterminants (≈ 3 min), savoir et incertitudes (≈ 2 min), rôle de l'IA (≈ 2 min), impacts et risques (≈ 2 min), 3 recommandations (≈ 3 min), conclusion (≈ 1 min).</li>
<li>Critères : clarté, rigueur, preuves, esprit critique (y compris face à l'IA), priorisation, aide à la décision, posture, maîtrise individuelle et collective.</li></ul>
<h3>Supports du cours (Notion)</h3>
<ul><li><a href="https://tall-carp-eae.notion.site/S-ance-1-Comprendre-et-qualifier-une-menace-cyber-3eff9484baa2805d9b3cfb54f013d2ae" target="_blank" rel="noopener">Séance 1 : comprendre et qualifier une menace cyber</a> · <a href="https://tall-carp-eae.notion.site/Mission-ORION-3eff9484baa280bab6dbdb85eaa57fbc" target="_blank" rel="noopener">Mission ORION S1</a> · <a href="https://tall-carp-eae.notion.site/Mission-ORION-Approfondir-et-d-fendre-votre-analyse-3f0f9484baa28040a096ecc9a2799f03" target="_blank" rel="noopener">ORION V2</a></li>
<li><a href="https://tall-carp-eae.notion.site/S-ance-2-Analyser-et-v-rifier-quand-l-IA-entre-dans-la-cha-ne-d-attaque-3f1f9484baa2804589d0ef72e8908eed" target="_blank" rel="noopener">Séance 2 : quand l'IA entre dans la chaîne d'attaque</a> · <a href="https://tall-carp-eae.notion.site/Mission-ORION-S2-1-2-D-cider-quand-l-IA-brouille-l-analyse-3f1f9484baa280b8808ce2a456132aa2" target="_blank" rel="noopener">ORION S2 1/2</a> · <a href="https://tall-carp-eae.notion.site/Mission-ORION-S2-2-2-Nouvelles-informations-et-pr-paration-du-briefing-3f1f9484baa280d8bb47cb3155deeff9" target="_blank" rel="noopener">ORION S2 2/2</a></li>
<li><a href="https://tall-carp-eae.notion.site/S-ance-3-D-cider-prioriser-et-pr-parer-le-briefing-final-3f3f9484baa280b0b88ffc341db42fbf" target="_blank" rel="noopener">Séance 3 : décider, prioriser et préparer le briefing</a> · <a href="https://tall-carp-eae.notion.site/Mission-ORION-Pr-parer-la-soutenance-finale-de-vendredi-3f2f9484baa280cf9c02c71a790f0667" target="_blank" rel="noopener">Préparer la soutenance finale</a></li></ul>`}
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
['Quel en-tête révèle l\'adresse de réponse réelle d\'un mail ?','Reply-To (à comparer avec From).'],
['Les trois liens possibles sur une flèche de la chronologie ORION ?','Lien <b>établi</b>, lien <b>supposé</b>, lien <b>encore à vérifier</b>.'],
['Heure d’un signalement et heure de l’action ?','Ce n’est pas la même chose : on signale souvent après coup.'],
['Pourquoi la localisation Amsterdam ne prouve-t-elle plus grand-chose (pièce 7) ?','Deux connexions légitimes d’autres salariés ont la même localisation.'],
['Une documentation Microsoft ou Cybermalveillance prouve-t-elle ce qui s’est passé chez Orion ?','Non : elle explique un mécanisme, elle ne prouve pas qu’il s’est produit.'],
['Format de la note de situation de la V2 ?','200 mots max, 5 questions : que s’est-il passé, sur quoi, conséquences, incertitudes, vérifications prioritaires.'],
['Les deux questions fil rouge du module ?','« Prouvez-le. » puis, en séance 2, « Qui vous l’a dit ? »'],
['Ce que l’IA modifie dans une attaque ?','Vitesse, volume, personnalisation, coût, parfois qualité. Elle amplifie, elle ne rend pas l’attaque autonome.'],
['Face à un vocal suspect du directeur : détecter l’IA ou vérifier ?','Vérifier l’identité et la demande par un autre canal (numéro habituel, procédure) plutôt que chercher à prouver le deepfake.'],
['Bonne chaîne d’usage d’une IA en analyse ?','IA → piste → vérification → source → conclusion.'],
['Qu’est-ce que le biais d’automatisation ?','Faire trop confiance à une réponse rapide, technique ou chiffrée parce qu’elle vient d’un outil.'],
['L’échelle de confiance sur le rôle de l’IA ?','Possible → Plausible → Fortement soutenu → Démontré.'],
['Les 4 statuts pour auditer une affirmation de l’IA ?','Confirmée, Plausible, Non démontrée, Contredite.'],
['Les trois horizons d’action ?','Immédiat (risque actif), court terme (stabiliser, comprendre), après l’incident (éviter la récidive).'],
['Formule d’une recommandation précise ?','Nous recommandons à [acteur] de [action], [quand], afin de [risque réduit], car [élément de l’analyse].'],
['Qui recommande, qui décide ?','L’analyste recommande, le décideur décide.'],
['Format de la soutenance finale ORION ?','15 min de briefing + 5 à 10 min de questions individuelles, deck de 10 à 15 slides, tout le monde parle.']
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
{q:'Un fournisseur reçoit une demande de changement d\'IBAN. Quelle vérification est la plus sûre ?',o:['Répondre au mail pour demander confirmation','Appeler le numéro indiqué dans le mail','Rappeler au numéro habituel, connu avant la demande','Vérifier l\'orthographe du mail'],a:[2],e:'Répondre au mail ou appeler le numéro du mail revient à parler à l\'attaquant.'},
{q:'Pièce 8 : deux transferts vers l’adresse externe ont été bloqués. Que peut-on conclure ?',o:['Aucune donnée n’a quitté la boîte','Ces deux transferts automatiques n’ont pas abouti, sans rien dire du reste (consultation, téléchargements)','Les données ont été exfiltrées','La règle n’existait pas'],a:[1],e:'L’extrait ne porte que sur ces deux tentatives : on ne généralise pas.',src:'ORION V2'},
{q:'Dans la chronologie, deux événements qui se suivent de près sont…',o:['forcément liés','à qualifier : lien établi, supposé ou à vérifier','à supprimer','toujours sans rapport'],a:[1],e:'La succession dans le temps n’est pas une preuve de causalité.',src:'ORION V2'},
{q:'Combien d’investigations prioritaires l’équipe peut-elle demander pour la V2 ?',o:['Une','Trois','Toutes celles qu’elle veut','Dix'],a:[1],e:'Trois demandes précises, plus une investigation reportée avec sa raison.',src:'ORION V2'},
{q:'Laquelle est une demande d’investigation recevable ?',o:['Vérifier les logs','Améliorer la sécurité','Demander au service messagerie la liste des messages lus ou téléchargés depuis la session de 08 h 32, pour savoir si des données Finance ont été récupérées','Sensibiliser les salariés'],a:[2],e:'Une demande précise : quoi, à qui, et ce que le résultat changerait.',src:'ORION V2'},
{q:'Un email au français parfait prouve-t-il l’usage d’une IA ?',o:['Oui','Non, et des fautes ne prouvent pas non plus l’absence d’IA','Oui si le message est personnalisé','Seulement en anglais'],a:[1],e:'La qualité d’écriture est au mieux un indice.',src:'ORION séance 2'},
{q:'Selon l’ANSSI, une IA générative peut-elle aujourd’hui mener seule toute une cyberattaque ?',o:['Oui','Non, aucune ne l’a démontré : elle amplifie surtout des capacités humaines','Seulement pour le phishing','Seulement les attaques par déni de service'],a:[1],e:'Éviter « l’IA ne change rien » comme « l’IA fait tout ».',src:'ORION séance 2'},
{q:'Un outil affiche « Confiance : 92 % ». Que faut-il savoir avant d’utiliser ce chiffre ? (plusieurs réponses)',o:['Ce qu’il mesure','Sur quelles données il est calculé','Comment il est calculé et ses limites','La couleur de l’interface'],a:[0,1,2],e:'Un nombre précis donne une impression de certitude qui n’est pas forcément justifiée.',src:'ORION séance 2'},
{q:'Marc n’est pas l’auteur du message vocal (pièce 14). Le vocal est donc…',o:['forcément un deepfake','frauduleux, mais son mode de fabrication (IA ou non) reste à démontrer','authentique','sans importance'],a:[1],e:'Ne pas être l’auteur ne dit pas comment l’enregistrement a été produit.',src:'ORION V3'},
{q:'« L’attaque vient d’un groupe criminel néerlandais » (synthèse IA, pièce 12) est :',o:['Confirmée','Plausible','Non démontrée','Évidente'],a:[2],e:'La localisation Amsterdam est partagée par des connexions légitimes (pièce 7) : rien n’établit l’origine.',src:'ORION V3'},
{q:'Dans l’ordre des horizons, que fait-on en premier ?',o:['Former tout le personnel','Réduire le risque actif (ex. révoquer les sessions du compte compromis)','Changer de messagerie','Rédiger le retour d’expérience'],a:[1],e:'Immédiat = risque actif ; la formation relève de l’après-incident.',src:'ORION séance 3'},
{q:'Combien de recommandations prioritaires présenter au management ?',o:['Une','Trois maximum','Dix','Toutes les bonnes pratiques'],a:[1],e:'« Si tout est prioritaire, rien n’est prioritaire. »',src:'ORION séance 3'},
{q:'Quel titre de slide est le meilleur ?',o:['Analyse de la connexion','Pièce 3','La compromission du compte Finance est fortement établie','Slide 4'],a:[2],e:'Une slide = un message, porté par le titre.',src:'ORION séance 3'},
{q:'Pendant les questions de la soutenance, on ne connaît pas une information. On répond :',o:['On invente une réponse plausible','« Nous ne savons pas encore » en expliquant ce qu’on sait et ce qu’il faudrait vérifier','On renvoie à un autre membre','On change de sujet'],a:[1],e:'Ne jamais inventer une réponse quand l’information n’est pas disponible.',src:'ORION soutenance'}
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
<li><b>Sécuriser les preuves</b> (en-têtes, journaux, audio original) et évaluer l'obligation de notifier la CNIL sous 72 h. Sinon : impossible d'établir les faits, de porter plainte ou de respecter le RGPD.</li></ol>`},
{t:'Auditer la synthèse de l\'assistant IA (pièce 12)',pts:'ORION V3',q:`<p>L'assistant IA du SOC affirme : groupe cybercriminel aux Pays-Bas ; identifiants obtenus par phishing ; données financières exfiltrées par la règle de transfert ; objectif financier ; vocal de 10 h 21 probablement deepfake ; l'attaquant utilise l'IA. Score : 92 %. Classez chaque affirmation (confirmée, plausible, non démontrée, contredite) avec la pièce utilisée, puis dites ce que vaut le score.</p>`,r:`
<div class="tbl"><table><tr><th>Affirmation</th><th>Statut</th><th>Pièces</th><th>Jusqu'où conclure</th></tr>
<tr><td>Groupe criminel aux Pays-Bas</td><td>Non démontrée</td><td>3, 7</td><td>La localisation est partagée par des connexions légitimes ; aucune attribution possible.</td></tr>
<tr><td>Identifiants obtenus par phishing</td><td>Fortement soutenue</td><td>1, 2, 3, 13</td><td>Saisie déclarée du mot de passe, puis session inconnue que l'utilisatrice n'a pas ouverte.</td></tr>
<tr><td>Données exfiltrées par la règle</td><td>Contredite pour les transferts automatiques</td><td>8, 13</td><td>Les deux transferts ont été bloqués ; une récupération par un autre moyen reste <b>non démontrée</b>.</td></tr>
<tr><td>Objectif financier</td><td>Fortement soutenue</td><td>4, 5, 9, 10</td><td>Règle sur Facture/IBAN/Paiement, faux IBAN, demande de coordonnées bancaires.</td></tr>
<tr><td>Vocal = deepfake</td><td>Plausible</td><td>11, 14</td><td>Marc n'en est pas l'auteur et sa voix est publique, mais rien n'authentifie la fabrication.</td></tr>
<tr><td>L'attaquant utilise l'IA</td><td>Plausible, non démontrée</td><td>10, 11, 13</td><td>La lecture du dossier Fournex suffit à expliquer la personnalisation sans IA.</td></tr></table></div>
<p><b>Le score de 92 %</b> n'est pas exploitable tel quel : on ne sait ni ce qu'il mesure (la synthèse entière ? une phrase ?), ni sur quelles données il repose, ni comment il est calculé, ni ses limites. Un chiffre précis donne une fausse impression de certitude ; le niveau de confiance doit venir des pièces.</p>`},
{t:'Formuler trois recommandations priorisées',pts:'ORION séance 3',q:`<p>Le directeur demande : « Que devons-nous faire maintenant, ensuite, et qu'est-ce qui peut attendre ? » Proposez trois recommandations précises (acteur, action, quand, risque réduit, élément de l'analyse) et classez-les par horizon.</p>`,r:`
<ol><li><b>Immédiat</b> : nous recommandons à la DSI de révoquer immédiatement les sessions actives du compte Finance, de réinitialiser son mot de passe et de supprimer la règle de transfert, afin d'empêcher toute nouvelle action frauduleuse, car une session inconnue a été utilisée de 08 h 32 à 08 h 56 (pièce 13).</li>
<li><b>Immédiat / court terme</b> : nous recommandons au service Finance de geler tout changement de coordonnées bancaires et de valider chaque paiement fournisseur par rappel sur un numéro connu, dès aujourd'hui, afin d'éviter un virement vers un faux IBAN, car un faux IBAN puis une demande de liste d'IBAN ont été envoyés (pièces 5, 9, 10, 11).</li>
<li><b>Court terme</b> : nous recommandons à la DSI de vérifier ce que la session a consulté ou téléchargé et de contrôler les autres comptes Finance, cette semaine, afin de mesurer le périmètre réel des données exposées, car seules les tentatives de transfert automatique sont connues (pièces 8, 13).</li></ol>
<p><b>Après l'incident</b> (pas prioritaire aujourd'hui) : authentification multifacteur pour tous, sensibilisation au phishing et aux faux vocaux, procédure écrite de validation des changements d'IBAN.</p>`}
]
});
