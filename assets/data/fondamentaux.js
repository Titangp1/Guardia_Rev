/* Guardia_Rev · Fondamentaux de la cybersécurité (transversal à toutes les UE). */
window.GR=window.GR||{subjects:[]};
GR.subjects.push({
id:'fondamentaux', name:'Fondamentaux de la cybersécurité', icon:'SEC',
exam:'Transversal · toutes les épreuves',
short:'Triade DIC, AAA, cryptographie, hachage, certificats et PKI, attaques courantes, OWASP, MITRE ATT&CK, hygiène ANSSI.',
intro:'Les notions qui servent partout : elles expliquent pourquoi on installe une CA pour Squid, pourquoi on hache les mots de passe, pourquoi on cloisonne et pourquoi la MFA arrête le phishing.',
fiche:[
{t:'La triade DIC (CIA) et les besoins de sécurité',h:`
<p>Toute mesure de sécurité protège au moins un de ces trois critères :</p>
<div class="tbl"><table><tr><th>Critère</th><th>Définition</th><th>Exemple d'atteinte</th><th>Mesures</th></tr>
<tr><td><b>D</b>isponibilité (Availability)</td><td>L'information et le service sont accessibles quand on en a besoin.</td><td>Ransomware, DDoS, panne du contrôleur de domaine</td><td>Sauvegardes, redondance (2 DC), supervision</td></tr>
<tr><td><b>I</b>ntégrité (Integrity)</td><td>L'information n'est pas modifiée de façon non autorisée.</td><td>Faux IBAN, défacement d'un site, fichier altéré</td><td>Hachage, signature, contrôle d'accès, FIM Wazuh</td></tr>
<tr><td><b>C</b>onfidentialité (Confidentiality)</td><td>Seules les personnes autorisées accèdent à l'information.</td><td>Fuite de données, vol d'identifiants</td><td>Chiffrement, droits d'accès, MFA</td></tr></table></div>
<p>On y ajoute souvent la <b>traçabilité</b> (preuve : qui a fait quoi, quand → journaux, SIEM) et la <b>non-répudiation</b> (impossible de nier une action → signature électronique).</p>
<h3>AAA</h3>
<ul><li><b>Authentification</b> : prouver qui on est (mot de passe, carte, empreinte). Facteurs : ce que je <b>sais</b>, ce que je <b>possède</b>, ce que je <b>suis</b>. La <b>MFA</b> combine au moins deux facteurs <i>différents</i>.</li>
<li><b>Autorisation</b> : ce qu'on a le droit de faire (groupes AD, ACL Squid, règles du pare-feu).</li>
<li><b>Accounting / traçabilité</b> : enregistrer ce qui a été fait (logs).</li></ul>
<div class="trap">Identification (dire qui on est : « je suis j.martin ») ≠ authentification (le prouver : le mot de passe).</div>`},
{t:'Risque, menace, vulnérabilité',h:`
<ul><li><b>Actif</b> (bien support / bien essentiel) : ce qui a de la valeur (données, serveur, réputation).</li>
<li><b>Vulnérabilité</b> : faiblesse exploitable (logiciel non à jour, mot de passe faible, port ouvert inutile).</li>
<li><b>Menace</b> : ce qui pourrait exploiter la vulnérabilité (attaquant, erreur humaine, panne).</li>
<li><b>Risque</b> = vraisemblance × impact. On peut le <b>réduire</b> (mesure), le <b>transférer</b> (assurance), l'<b>éviter</b> (supprimer l'activité) ou l'<b>accepter</b>.</li></ul>
<p><b>CVE</b> : identifiant public d'une vulnérabilité (ex. CVE-2021-44228, Log4Shell). <b>CVSS</b> : score de gravité de 0 à 10. Une <b>0-day</b> est une faille exploitée avant qu'un correctif existe.</p>
<p><b>Surface d'attaque</b> : tout ce qui est exposé. La réduire = fermer les ports et services inutiles, cloisonner (DMZ), appliquer le moindre privilège.</p>
<p><b>Défense en profondeur</b> : plusieurs couches indépendantes (pare-feu périmétrique, interne, proxy, antivirus, MFA, supervision) pour qu'une seule défaillance ne suffise pas.</p>`},
{t:'Cryptographie : symétrique et asymétrique',h:`
<h3>Chiffrement symétrique</h3>
<p>Une <b>seule clé secrète</b> partagée pour chiffrer et déchiffrer. Rapide, utilisé pour les gros volumes. Exemples : <b>AES</b> (standard actuel, 128/256 bits), ChaCha20. Obsolètes : DES, 3DES, RC4. Problème : comment échanger la clé de façon sûre ?</p>
<h3>Chiffrement asymétrique</h3>
<p>Une <b>paire de clés</b> : une <b>clé publique</b> (diffusable) et une <b>clé privée</b> (secrète). Exemples : <b>RSA</b>, courbes elliptiques (ECDSA, ECDH).</p>
<ul><li><b>Chiffrer pour quelqu'un</b> : avec sa clé <b>publique</b> ; seul lui déchiffre avec sa clé privée → confidentialité.</li>
<li><b>Signer</b> : avec sa propre clé <b>privée</b> ; tout le monde vérifie avec la clé publique → intégrité, authenticité, non-répudiation.</li></ul>
<h3>En pratique (TLS, SSH)</h3>
<p>On combine les deux : l'asymétrique sert à <b>authentifier le serveur et établir une clé de session</b> (échange Diffie-Hellman), puis le symétrique (AES) chiffre les données. C'est le fonctionnement de HTTPS.</p>
<div class="key"><b>Chiffrer ≠ coder ≠ hacher</b> : le codage (Base64) est réversible sans clé, ce n'est pas de la sécurité ; le chiffrement est réversible <i>avec</i> la clé ; le hachage n'est pas réversible.</div>`},
{t:'Hachage et mots de passe',h:`
<p>Une <b>fonction de hachage</b> transforme une donnée de taille quelconque en une <b>empreinte de taille fixe</b>. Propriétés : <b>à sens unique</b> (on ne retrouve pas la donnée), une petite modification change tout l'empreinte, et il doit être très difficile de trouver deux données de même empreinte (<b>collision</b>).</p>
<ul><li>Sûrs : <b>SHA-256</b>, SHA-512, SHA-3. Cassés (collisions) : <b>MD5</b>, <b>SHA-1</b>.</li>
<li>Usages : vérifier l'intégrité d'un fichier (les SHA-256 des IOC de l'ancien partiel), signatures, stockage de mots de passe.</li></ul>
<h3>Stocker un mot de passe</h3>
<p>Jamais en clair ni chiffré : on stocke un <b>hash lent et salé</b> (<b>bcrypt</b>, <b>Argon2</b>, scrypt, PBKDF2). Le <b>sel</b> est une valeur aléatoire propre à chaque compte : deux mots de passe identiques donnent des hash différents et les <b>tables arc-en-ciel</b> deviennent inutiles.</p>
<p>Attaques : <b>force brute</b> (tout essayer), <b>dictionnaire</b> (mots courants), <b>password spraying</b> (un mot de passe courant sur beaucoup de comptes), <b>credential stuffing</b> (réutiliser des identifiants volés ailleurs), <b>Pass-the-Hash</b> (réutiliser le hash NTLM sans connaître le mot de passe).</p>
<div class="tip">Recommandation ANSSI : longueur avant complexité (phrase de passe), un mot de passe unique par service, un gestionnaire de mots de passe, et la MFA partout où c'est possible.</div>`},
{t:'Certificats, PKI et TLS',h:`
<p>Un <b>certificat X.509</b> lie une <b>clé publique</b> à une identité (un nom de domaine, une personne). Il contient : le sujet (CN, SAN), la clé publique, l'émetteur, les dates de validité, et la <b>signature de l'autorité de certification</b>.</p>
<p>La <b>PKI</b> (infrastructure à clés publiques) : une <b>autorité de certification (CA)</b> racine de confiance signe des certificats (souvent via des CA intermédiaires). Le navigateur fait confiance à un certificat si la <b>chaîne</b> remonte à une CA racine présente dans son magasin de confiance.</p>
<div class="key"><b>Lien avec Squid (ssl_bump)</b> : le proxy fabrique des certificats signés par <b>sa propre CA</b> (créée avec OpenSSL). Les postes ne les acceptent que parce que cette CA a été ajoutée dans leurs autorités racines de confiance <b>par GPO</b>. Sans cela, le navigateur afficherait une alerte de sécurité.</div>
<pre><code>openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \\
  -keyout squid-ca.key -out squid-ca.crt -subj "/CN=Groupe4 Proxy CA"</code></pre>
<p><b>TLS</b> (successeur de SSL) chiffre HTTP (HTTPS, port 443), mais aussi LDAPS (636), SMTPS… Versions acceptables : TLS 1.2 et 1.3 ; SSL 2/3 et TLS 1.0/1.1 sont obsolètes.</p>
<p><b>Certificat auto-signé</b> : signé par lui-même, aucune chaîne de confiance → alerte du navigateur (acceptable en labo, pas en production). <b>Let's Encrypt</b> délivre gratuitement des certificats reconnus.</p>`},
{t:'Attaques courantes',h:`
<div class="tbl"><table><tr><th>Attaque</th><th>Principe</th><th>Protection</th></tr>
<tr><td>Phishing / spear phishing</td><td>Faux message pour voler identifiants ou faire payer</td><td>Sensibilisation, MFA, filtrage mail (SPF, DKIM, DMARC)</td></tr>
<tr><td>Ransomware (rançongiciel)</td><td>Chiffre les fichiers et exige une rançon, souvent avec vol de données</td><td>Sauvegardes hors ligne, correctifs, cloisonnement, EDR</td></tr>
<tr><td>Infostealer (ex. OskiStealer)</td><td>Vole mots de passe du navigateur, cookies, portefeuilles crypto</td><td>Ne pas exécuter de pièces jointes, MFA, EDR</td></tr>
<tr><td>Man-in-the-Middle</td><td>S'intercaler entre deux parties (ARP spoofing, faux Wi-Fi)</td><td>TLS avec vérification du certificat, 802.1X</td></tr>
<tr><td>DoS / DDoS</td><td>Saturer un service pour le rendre indisponible</td><td>Filtrage, CDN anti-DDoS, limitation de débit</td></tr>
<tr><td>Force brute / spraying</td><td>Essayer beaucoup de mots de passe</td><td>Verrouillage de compte, MFA, mots de passe longs</td></tr>
<tr><td>Ingénierie sociale</td><td>Manipuler un humain (appel du « support », intrusion physique)</td><td>Procédures de vérification, sensibilisation</td></tr>
<tr><td>Élévation de privilèges</td><td>Passer d'un compte simple à administrateur</td><td>Moindre privilège, correctifs, Protected Users</td></tr>
<tr><td>Mouvement latéral</td><td>Rebondir d'une machine compromise vers les autres</td><td>Cloisonnement (VLAN, pare-feu interne), comptes admin séparés</td></tr></table></div>
<p><b>Malwares</b> : virus (s'attache à un fichier), ver (se propage seul sur le réseau), cheval de Troie (déguisé en logiciel légitime), RAT (contrôle à distance), rootkit (se cache dans le système), keylogger.</p>`},
{t:'OWASP Top 10 (sécurité web)',h:`
<p>Classement des risques les plus critiques des applications web (édition 2021) :</p>
<ol><li><b>Broken Access Control</b> : accéder aux données d'un autre (changer <code>/users/12</code> en <code>/users/13</code>, IDOR).</li>
<li><b>Cryptographic Failures</b> : données sensibles non chiffrées, algorithmes faibles.</li>
<li><b>Injection</b> : SQL, commandes, XSS. Ex. <code>' OR 1=1 --</code> dans un champ de connexion. Parade : <b>requêtes paramétrées</b>, validation et échappement.</li>
<li><b>Insecure Design</b> : faille de conception.</li>
<li><b>Security Misconfiguration</b> : identifiants par défaut, mode debug en production, listing de répertoires.</li>
<li><b>Vulnerable and Outdated Components</b> : dépendances avec CVE (→ SCA dans la CI).</li>
<li><b>Identification and Authentication Failures</b> : pas de MFA, sessions mal gérées.</li>
<li><b>Software and Data Integrity Failures</b> : mises à jour ou pipeline non vérifiés.</li>
<li><b>Security Logging and Monitoring Failures</b> : rien n'est journalisé ni surveillé.</li>
<li><b>SSRF</b> : forcer le serveur à faire des requêtes vers l'intérieur.</li></ol>
<pre><code># Vulnérable à l'injection SQL
cur.execute("SELECT * FROM users WHERE login = '" + login + "'")
# Correct : requête paramétrée
cur.execute("SELECT * FROM users WHERE login = ?", (login,))</code></pre>
<p><b>XSS</b> (Cross-Site Scripting) : injecter du JavaScript dans une page vue par d'autres. Parade : échapper les données affichées, en-tête CSP.</p>`},
{t:'Cyber Kill Chain et MITRE ATT&CK',h:`
<h3>Cyber Kill Chain (Lockheed Martin)</h3>
<ol><li><b>Reconnaissance</b> : collecter des informations (OSINT, scans).</li><li><b>Armement</b> : préparer la charge (document piégé).</li><li><b>Livraison</b> : mail, clé USB, site web.</li><li><b>Exploitation</b> : déclencher la faille.</li><li><b>Installation</b> : déposer un malware persistant.</li><li><b>Commande et contrôle (C2)</b> : le malware contacte le serveur de l'attaquant (2.56.57.108 dans l'ancien partiel).</li><li><b>Actions sur objectifs</b> : vol, chiffrement, fraude.</li></ol>
<p>Casser n'importe quel maillon arrête l'attaque.</p>
<h3>MITRE ATT&amp;CK</h3>
<p>Base de connaissance des <b>tactiques</b> (le but : Reconnaissance, Initial Access, Execution, Persistence, Privilege Escalation, Defense Evasion, Credential Access, Discovery, Lateral Movement, Collection, Command and Control, Exfiltration, Impact) et des <b>techniques</b> (le comment), avec un identifiant : <b>T1566</b> Phishing, <b>T1046</b> Network Service Discovery (scan nmap du projet), <b>T1110</b> Brute Force, <b>T1036</b> Masquerading (DLL déguisée en .jpg), <b>T1486</b> Data Encrypted for Impact (ransomware). Wazuh rattache ses alertes à ces identifiants.</p>`},
{t:'Hygiène informatique (ANSSI)',h:`
<p>Le <b>guide d'hygiène informatique de l'ANSSI</b> (42 mesures) se résume en quelques réflexes, que l'on a appliqués dans les projets :</p>
<ul><li><b>Connaître son SI</b> : inventaire, schéma réseau, dossier technique à jour.</li>
<li><b>Gérer les comptes</b> : un compte nominatif par personne, comptes d'administration séparés des comptes de bureautique, désactiver les comptes des partants.</li>
<li><b>Authentification forte</b> : mots de passe robustes, MFA, changer les mots de passe par défaut.</li>
<li><b>Mettre à jour</b> systèmes et logiciels rapidement.</li>
<li><b>Cloisonner</b> le réseau (zones, VLAN, DMZ) et filtrer les flux (moindre privilège).</li>
<li><b>Administrer de façon sécurisée</b> : poste ou bastion dédié, protocoles chiffrés (SSH, RDP avec NLA, HTTPS).</li>
<li><b>Sauvegarder</b> régulièrement, avec une copie hors ligne, et tester la restauration (règle <b>3-2-1</b> : 3 copies, 2 supports, 1 hors site).</li>
<li><b>Journaliser et superviser</b> (SIEM), synchroniser l'heure (NTP).</li>
<li><b>Sensibiliser</b> les utilisateurs et avoir une <b>procédure de gestion d'incident</b>.</li></ul>
<p>Organismes : <b>ANSSI</b> (autorité nationale), <b>CERT-FR</b> (alertes et avis), <b>CNIL</b> (données personnelles, RGPD), <b>cybermalveillance.gouv.fr</b> (assistance aux victimes).</p>`}
],
cards:[
['Que signifie DIC ?','Disponibilité, Intégrité, Confidentialité (en anglais CIA).'],
['Un faux IBAN dans un mail porte atteinte à quel critère ?','L\'<b>intégrité</b> (information modifiée), et indirectement à la confidentialité de la boîte.'],
['Un ransomware porte atteinte en premier à… ?','La <b>disponibilité</b> (et souvent la confidentialité s\'il y a exfiltration).'],
['Les trois familles de facteurs d\'authentification ?','Ce que je sais, ce que je possède, ce que je suis.'],
['Identification vs authentification ?','Identification : dire qui on est. Authentification : le prouver.'],
['Formule du risque ?','Risque = vraisemblance × impact.'],
['Qu\'est-ce qu\'une CVE ?','Un identifiant public de vulnérabilité (ex. CVE-2021-44228). Gravité notée par le CVSS sur 10.'],
['Chiffrement symétrique : principe et exemple ?','Une même clé secrète pour chiffrer et déchiffrer. Exemple : AES.'],
['Chiffrement asymétrique : principe et exemple ?','Une clé publique et une clé privée. Exemple : RSA.'],
['Pour signer un document, quelle clé utilise-t-on ?','Sa propre clé <b>privée</b> ; on vérifie avec la clé publique.'],
['Pour envoyer un message confidentiel à Alice ?','On chiffre avec la clé <b>publique</b> d\'Alice.'],
['Hachage : 3 propriétés ?','Taille fixe, à sens unique, résistance aux collisions (petit changement = empreinte totalement différente).'],
['Algorithmes de hachage cassés ?','MD5 et SHA-1. Utiliser SHA-256 ou plus.'],
['Comment stocker un mot de passe ?','Hash lent et salé : bcrypt, Argon2, scrypt, PBKDF2.'],
['À quoi sert le sel ?','Valeur aléatoire par compte : deux mêmes mots de passe donnent des hash différents, tables arc-en-ciel inutiles.'],
['Base64, c\'est du chiffrement ?','Non : un simple codage, réversible sans clé.'],
['Qu\'est-ce qu\'un certificat X.509 ?','Un document qui lie une clé publique à une identité, signé par une autorité de certification.'],
['Pourquoi le navigateur accepte-t-il les certificats de Squid ?','Parce que la CA du proxy a été installée dans les autorités racines de confiance des postes (par GPO).'],
['Versions de TLS acceptables ?','TLS 1.2 et TLS 1.3.'],
['Password spraying ?','Essayer un mot de passe courant sur de nombreux comptes (évite le verrouillage).'],
['Pass-the-Hash ?','Réutiliser le hash NTLM d\'un mot de passe pour s\'authentifier sans le connaître.'],
['Ver vs cheval de Troie ?','Le ver se propage seul ; le cheval de Troie se déguise en logiciel légitime.'],
['Parade à l\'injection SQL ?','Les requêtes paramétrées (préparées).'],
['N°1 de l\'OWASP Top 10 (2021) ?','Broken Access Control (contrôle d\'accès défaillant).'],
['Les 7 étapes de la Cyber Kill Chain ?','Reconnaissance, armement, livraison, exploitation, installation, C2, actions sur objectifs.'],
['MITRE ATT&CK T1046 ?','Network Service Discovery (scan réseau, ex. nmap).'],
['MITRE ATT&CK T1566 ?','Phishing.'],
['Règle de sauvegarde 3-2-1 ?','3 copies, sur 2 supports différents, dont 1 hors site (ou hors ligne).'],
['Rôle de l\'ANSSI ? du CERT-FR ? de la CNIL ?','ANSSI : autorité nationale de cybersécurité. CERT-FR : alertes et réponse aux incidents. CNIL : protection des données personnelles.']
],
quiz:[
{q:'Quels sont les trois critères de la triade DIC ?',o:['Disponibilité, Intégrité, Confidentialité','Détection, Isolation, Correction','Données, Identité, Chiffrement','Disponibilité, Identification, Contrôle'],a:[0],e:'En anglais : Confidentiality, Integrity, Availability (CIA).'},
{q:'Un DDoS qui rend le site de l\'école inaccessible porte atteinte à :',o:['La confidentialité','L\'intégrité','La disponibilité','La traçabilité'],a:[2],e:'Le service n\'est plus accessible quand on en a besoin.'},
{q:'Quelles combinaisons sont de vraies authentifications multifacteurs ?',o:['Mot de passe + code reçu sur le téléphone','Mot de passe + question secrète','Badge + code PIN','Empreinte digitale + mot de passe'],a:[0,2,3],e:'Mot de passe et question secrète sont deux choses que l\'on sait : un seul facteur.'},
{q:'Avec quelle clé Bob chiffre-t-il un message que seule Alice doit lire ?',o:['La clé privée de Bob','La clé publique de Bob','La clé publique d\'Alice','La clé privée d\'Alice'],a:[2],e:'Seule la clé privée d\'Alice pourra déchiffrer.'},
{q:'Pour signer numériquement un document, on utilise :',o:['Sa clé privée','Sa clé publique','La clé publique du destinataire','Une fonction de hachage seule'],a:[0],e:'On signe (le hash du document) avec sa clé privée ; tout le monde vérifie avec la clé publique.'},
{q:'Lequel est un algorithme de chiffrement symétrique ?',o:['RSA','AES','SHA-256','ECDSA'],a:[1],e:'RSA et ECDSA sont asymétriques ; SHA-256 est un hachage.'},
{q:'Quels algorithmes de hachage ne doivent plus être utilisés ?',o:['MD5','SHA-1','SHA-256','SHA-3'],a:[0,1],e:'Des collisions pratiques ont été trouvées pour MD5 et SHA-1.'},
{q:'Quelle est la bonne façon de stocker les mots de passe d\'une application ?',o:['En clair dans la base','Chiffrés avec AES','Hachés avec MD5','Hachés avec bcrypt ou Argon2, avec un sel'],a:[3],e:'Un hash lent et salé ralentit énormément les attaques par force brute.'},
{q:'« dG90bw== » est une chaîne en Base64. Est-ce du chiffrement ?',o:['Oui, sans la clé on ne peut rien lire','Non, c\'est un codage réversible sans clé','Oui, c\'est un hachage','Non, c\'est une signature'],a:[1],e:'Base64 ne protège rien : n\'importe qui le décode.'},
{q:'Dans HTTPS, à quoi sert la cryptographie asymétrique ?',o:['À chiffrer toutes les données échangées','À authentifier le serveur et établir une clé de session','À compresser la page','À rien'],a:[1],e:'Ensuite, les données sont chiffrées en symétrique (AES), beaucoup plus rapide.'},
{q:'Pourquoi le navigateur n\'affiche-t-il pas d\'alerte avec l\'inspection HTTPS de Squid ?',o:['Parce que Squid désactive TLS','Parce que la CA du proxy est installée dans les autorités de confiance des postes','Parce que le certificat est auto-signé','Parce que le site n\'est pas en HTTPS'],a:[1],e:'Les certificats générés à la volée sont signés par cette CA, déployée par GPO.'},
{q:'Un attaquant essaie « Guardia2026! » sur les 500 comptes de l\'école. C\'est :',o:['Du phishing','Du password spraying','Une injection SQL','Du DDoS'],a:[1],e:'Un mot de passe, beaucoup de comptes : on passe sous le seuil de verrouillage.'},
{q:'Quelle est la meilleure parade à l\'injection SQL ?',o:['Un pare-feu réseau','Les requêtes paramétrées','Le chiffrement du disque','Un antivirus'],a:[1],e:'Les données ne sont jamais interprétées comme du code SQL.'},
{q:'Modifier l\'URL /factures/1042 en /factures/1043 pour voir la facture d\'un autre client relève de :',o:['Injection','Broken Access Control','XSS','DDoS'],a:[1],e:'Le serveur ne vérifie pas que la ressource appartient à l\'utilisateur (IDOR).'},
{q:'Un malware qui se propage seul de machine en machine est :',o:['Un ver','Un cheval de Troie','Un keylogger','Un rootkit'],a:[0],e:'Le cheval de Troie, lui, a besoin qu\'on l\'exécute.'},
{q:'Dans la Cyber Kill Chain, le malware qui contacte 2.56.57.108 correspond à l\'étape :',o:['Reconnaissance','Livraison','Commande et contrôle (C2)','Armement'],a:[2],e:'Le poste infecté communique avec le serveur de l\'attaquant.'},
{q:'Une DLL déguisée en image .jpg correspond à quelle technique MITRE ATT&CK ?',o:['T1046 Network Service Discovery','T1036 Masquerading','T1110 Brute Force','T1486 Data Encrypted for Impact'],a:[1],e:'Masquerading : se faire passer pour quelque chose de légitime.'},
{q:'Que signifie la règle de sauvegarde 3-2-1 ?',o:['3 sauvegardes par jour, 2 par nuit, 1 par semaine','3 copies, 2 supports différents, 1 hors site','3 serveurs, 2 pare-feux, 1 bastion','3 administrateurs, 2 mots de passe, 1 MFA'],a:[1],e:'Elle permet de survivre à une panne, un sinistre ou un ransomware.'},
{q:'Quelles mesures font partie de l\'hygiène informatique recommandée par l\'ANSSI ?',o:['Séparer comptes d\'administration et comptes de bureautique','Appliquer rapidement les mises à jour','Partager un compte admin commun pour gagner du temps','Cloisonner le réseau'],a:[0,1,3],e:'Les comptes doivent être nominatifs : un compte partagé empêche toute traçabilité.'},
{q:'Risque = ?',o:['Menace + vulnérabilité','Vraisemblance × impact','Coût des mesures','Nombre de CVE'],a:[1],e:'On peut ensuite le réduire, le transférer, l\'éviter ou l\'accepter.'}
],
exos:[
{t:'Associer mesures et critères DIC',pts:'entraînement',q:`<p>Pour chaque mesure du projet ISR/Projet 2, indiquez le ou les critères DIC protégés et justifiez : a) sauvegarde quotidienne de l'AD ; b) inspection HTTPS et filtrage par catégories ; c) groupe GG-Internet ; d) surveillance d'intégrité des fichiers par Wazuh ; e) second contrôleur de domaine.</p>`,r:`
<ul><li><b>a) Sauvegarde</b> : <b>disponibilité</b> (restaurer après panne/ransomware) et <b>intégrité</b> (revenir à un état sain).</li>
<li><b>b) Inspection HTTPS + filtrage</b> : <b>confidentialité</b> (bloquer l'exfiltration, sites malveillants) et <b>intégrité</b> des postes (moins de malwares) ; avec traçabilité dans les journaux.</li>
<li><b>c) GG-Internet</b> : <b>confidentialité</b> par l'autorisation (seules les personnes prévues naviguent) ; c'est de l'AAA (autorisation).</li>
<li><b>d) FIM Wazuh</b> : <b>intégrité</b> (détecter qu'un fichier système a été modifié) et traçabilité.</li>
<li><b>e) Second DC</b> : <b>disponibilité</b> (les utilisateurs se connectent même si un DC tombe).</li></ul>`},
{t:'Expliquer HTTPS à un non-spécialiste',pts:'entraînement',q:`<p>En 6 lignes, expliquez ce qui se passe quand un salarié ouvre https://banque.fr, puis ce qui change quand le proxy Squid fait de l'inspection HTTPS.</p>`,r:`
<p><b>Sans proxy</b> : le site présente un certificat (sa « carte d'identité » signée par une autorité reconnue). Le navigateur vérifie la signature et le nom. Grâce à la cryptographie asymétrique, ils se mettent d'accord sur une clé secrète, puis tout est chiffré en AES : personne entre les deux ne peut lire ni modifier.</p>
<p><b>Avec inspection</b> : le proxy coupe la connexion en deux. Il présente au salarié un certificat qu'il fabrique, signé par la CA de l'entreprise (installée sur les postes par GPO), et ouvre sa propre connexion chiffrée vers la banque. Il voit donc le contenu en clair pour le filtrer. C'est pour cela qu'on exclut les sites sensibles (banque, santé) avec <code>ssl_bump splice</code> et qu'on informe les salariés.</p>`}
]
});
