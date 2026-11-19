/* Guardia_Rev · Techniques d'administration & supervision ISR / Techniques de sécurisation ISR. */
window.GR=window.GR||{subjects:[]};
GR.subjects.push({
id:'supervision', name:'Administration, sécurisation & supervision ISR', icon:'SOC', color:'linear-gradient(140deg,#a8833f,#6e5220)',
exam:'Partiel · Partie 2 et épreuve « Sécurisation ISR »',
short:'Règles OPNsense, PowerShell AD, GPO de sécurité, Squid et inspection HTTPS, Wazuh, SIEM, IDS, rapport d\'incident.',
intro:'La partie « pratique » des anciens sujets : remplir une matrice de flux, expliquer un script PowerShell, corriger des failles AD par GPO, écrire une configuration Squid, analyser des logs Wazuh et rédiger un rapport d\'incident.',
fiche:[
{t:'Règles de pare-feu OPNsense',h:`
<p>Sur OPNsense, une règle s'écrit sur l'<b>interface d'entrée</b> du trafic : le trafic initié par les clients arrive sur l'interface <b>CLT/LAN</b>, la règle y est donc placée en <b>direction IN</b>. Les règles sont lues de haut en bas ; la première qui correspond gagne ; tout ce qui n'est pas autorisé est bloqué (deny par défaut). Le pare-feu est <b>stateful</b> : la réponse d'une connexion autorisée revient automatiquement.</p>
<h3>Matrice type (clients → AD/DNS, web interne, Internet)</h3>
<div class="tbl"><table><tr><th>Interface</th><th>Source</th><th>Destination</th><th>Protocole</th><th>Port</th><th>Dir.</th><th>Description</th></tr>
<tr><td>CLT</td><td>CLT net</td><td>IP du serveur AD</td><td>TCP/UDP</td><td>88</td><td>IN</td><td>Accès AD – Kerberos</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>IP du serveur AD</td><td>TCP/UDP</td><td>389 (636 LDAPS)</td><td>IN</td><td>Accès AD – LDAP</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>IP du serveur AD</td><td>TCP</td><td>135 + 49152-65535</td><td>IN</td><td>Accès AD – RPC</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>IP du serveur AD</td><td>TCP/UDP</td><td>53</td><td>IN</td><td>Résolution DNS</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>IP du reverse proxy</td><td>TCP</td><td>80</td><td>IN</td><td>Site web interne – HTTP</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>any (!réseaux internes)</td><td>TCP</td><td>80</td><td>IN</td><td>Accès web externe – HTTP</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>any (!réseaux internes)</td><td>TCP</td><td>443</td><td>IN</td><td>Accès web externe – HTTPS</td></tr></table></div>
<p>Pour un poste réellement membre du domaine, on ajoute souvent : <b>SMB 445</b> (GPO/SYSVOL), <b>NTP 123/UDP</b> (Kerberos tolère 5 min d'écart d'horloge), <b>464</b> (changement de mot de passe Kerberos), <b>3268</b> (catalogue global).</p>
<div class="key"><b>Astuce</b> : utiliser des <b>alias</b> OPNsense (ex. <code>AD_PORTS</code>, <code>RFC1918</code>) rend les règles lisibles ; pour « Internet », la destination est souvent « invert » d'un alias des réseaux privés, afin que la règle web n'ouvre pas les autres zones.</div>`},
{t:'Provisionnement AD en PowerShell',h:`
<pre><code>Import-Csv "Utilisateurs.csv" | ForEach-Object {
    New-ADUser -Name $_.Nom \`
        -GivenName $_.Prenom \`
        -SamAccountName $_.Login \`
        -AccountPassword (ConvertTo-SecureString "MotDePasseTemp" -AsPlainText -Force) \`
        -Path "OU=eleves,DC=guardia,DC=rc" \`
        -Enabled $true
}</code></pre>
<ul><li><code>Import-Csv</code> : lit le fichier CSV et transforme <b>chaque ligne en objet</b> dont les colonnes (Nom, Prenom, Login) deviennent des propriétés.</li>
<li><code>|</code> (pipe) : envoie ces objets à la commande suivante.</li>
<li><code>ForEach-Object { }</code> : exécute le bloc <b>pour chaque ligne</b> ; <code>$_</code> désigne la ligne en cours.</li>
<li><code>-SamAccountName</code> : l'<b>identifiant de connexion</b> (login « pré-Windows 2000 », ex. <code>GUARDIA\\j.dupont</code>), unique dans le domaine, 20 caractères max.</li>
<li><code>ConvertTo-SecureString … -AsPlainText -Force</code> : convertit le texte en <b>chaîne sécurisée</b> (chiffrée en mémoire), seul format accepté par <code>-AccountPassword</code>.</li>
<li><code>-Path "OU=eleves,…"</code> : crée le compte dans l'OU <i>eleves</i> du domaine <i>guardia.rc</i> : on peut y <b>appliquer des GPO</b> propres aux élèves et <b>déléguer</b> leur gestion.</li>
<li><code>-Enabled $true</code> : compte actif. Avec <code>$false</code>, le compte est créé <b>désactivé</b> : impossible de se connecter tant qu'un admin ne l'active pas.</li>
<li>Le backtick <code>\`</code> en fin de ligne permet de continuer la commande sur la ligne suivante.</li></ul>
<div class="trap"><b>Faiblesse du script</b> : un mot de passe identique et écrit en clair. Il faudrait ajouter <code>-ChangePasswordAtLogon $true</code> ou générer un mot de passe aléatoire par compte.</div>
<p><b>Avantages</b> : création en masse rapide, zéro faute de frappe, procédure reproductible et documentée, comptes rangés directement dans la bonne OU.</p>
<p>Autres commandes utiles : <code>Get-ADUser</code>, <code>Set-ADUser</code>, <code>New-ADGroup</code>, <code>Add-ADGroupMember</code>, <code>New-ADOrganizationalUnit</code>, <code>Get-ADComputer</code>, <code>gpupdate /force</code>, <code>gpresult /r</code>.</p>`},
{t:'Sécuriser l\'AD avec des GPO',h:`
<div class="tbl"><table><tr><th>Problème</th><th>Conséquences</th><th>Résolution</th></tr>
<tr><td>Comptes admin sans « Ce compte est sensible et ne peut pas être délégué »</td><td>Leurs identifiants peuvent être <b>délégués</b> à un serveur (délégation Kerberos) : si ce serveur est compromis, l'attaquant réutilise le ticket et <b>usurpe un administrateur</b>.</td><td>Cocher l'option dans les propriétés du compte (onglet Compte), ou les ajouter au groupe Protected Users.</td></tr>
<tr><td>Administrateurs hors du groupe <b>Protected Users</b></td><td>Exposition au phishing, au vol d'identifiants (hash en cache, NTLM) et à l'élévation de privilèges.</td><td>Ajouter les comptes admin au groupe <b>Protected Users</b> : pas de NTLM, pas de délégation, pas de mise en cache, Kerberos AES uniquement, ticket limité à 4 h.</td></tr>
<tr><td>Niveau d'authentification LAN Manager autorisant NTLMv1 ou LM</td><td>Les hash de mots de passe peuvent être capturés et cassés facilement, ou rejoués (<b>Pass-the-Hash</b>).</td><td>GPO « Sécurité réseau : niveau d'authentification LAN Manager » = <b>Envoyer uniquement les réponses NTLMv2. Refuser LM et NTLM</b> ; et « Ne pas stocker de valeurs de hachage LAN Manager » activé.</td></tr>
<tr><td>Dernière sauvegarde de l'AD il y a 7 jours</td><td>En cas de panne, de ransomware ou de suppression, <b>perte jusqu'à 7 jours</b> de modifications (comptes, GPO) voire de tout l'annuaire.</td><td>Installer la fonctionnalité <b>Windows Server Backup</b>, sauvegarder l'état du système chaque jour (tâche planifiée), copie hors ligne, tester la restauration ; activer la corbeille AD.</td></tr>
<tr><td>Mots de passe faibles</td><td>Attaques par force brute, dictionnaire ou <b>password spraying</b>.</td><td>GPO <i>Default Domain Policy</i> → Stratégie de mot de passe (longueur ≥ 12, complexité, historique, durée) + stratégie de <b>verrouillage</b> après N échecs ; ou <b>FGPP</b> (stratégie fine) plus stricte pour les admins.</td></tr></table></div>
<p>GPO vues en projet : proxy imposé à Edge, certificat de la CA du proxy déployé dans les autorités de confiance, Panneau de configuration interdit aux utilisateurs.</p>`},
{t:'Kerberos et l\'authentification AD',h:`
<p><b>Kerberos</b> est le protocole d'authentification d'Active Directory (port 88). Le mot de passe ne circule jamais sur le réseau : on échange des <b>tickets</b> délivrés par le <b>KDC</b> (Key Distribution Center), qui tourne sur le contrôleur de domaine.</p>
<ol><li>À l'ouverture de session, le client prouve qu'il connaît le mot de passe (horodatage chiffré) et reçoit un <b>TGT</b> (Ticket Granting Ticket), valable environ 10 h.</li>
<li>Pour accéder à un service (partage, proxy Squid…), il présente son TGT au KDC et reçoit un <b>ticket de service (TGS)</b> pour ce service précis, identifié par son <b>SPN</b> (ex. <code>HTTP/srv-proxy01.groupe4.internal</code>).</li>
<li>Il présente ce ticket au service, qui le vérifie sans contacter le DC : c'est le <b>SSO</b>, on ne retape pas son mot de passe.</li></ol>
<div class="key"><b>Conditions</b> : DNS correct (on utilise des <b>noms</b>, pas des IP : avec <code>192.168.10.20</code>, Kerberos échoue et le navigateur demande les identifiants, d'où le proxy imposé par GPO avec le nom complet) et <b>horloges synchronisées à moins de 5 minutes</b> (NTP).</div>
<p><b>NTLM</b> : ancien protocole par défi/réponse, utilisé en secours quand Kerberos est impossible. Plus faible (Pass-the-Hash, relais NTLM) : on le restreint par GPO.</p>
<p>Attaques à connaître : <b>Kerberoasting</b> (demander des tickets de service pour casser hors ligne le mot de passe d'un compte de service → mots de passe longs pour les comptes de service), <b>Golden Ticket</b> (forger des TGT avec la clé du compte krbtgt).</p>`},
{t:'Squid : le proxy filtrant',h:`
<p><b>Squid</b> est un proxy web. Fichier de configuration principal : <code>/etc/squid/squid.conf</code> (inclusions possibles dans <code>/etc/squid/conf.d/</code>). Port par défaut : <b>3128</b>. Journaux : <code>/var/log/squid/access.log</code> (requêtes) et <code>cache.log</code> (fonctionnement).</p>
<h3>ACL et http_access</h3>
<p>On <b>définit</b> des listes avec <code>acl</code>, puis on <b>décide</b> avec <code>http_access allow|deny</code>. Les règles <code>http_access</code> sont lues <b>dans l'ordre</b>, la première qui correspond s'applique ; la dernière est <code>http_access deny all</code>.</p>
<pre><code>acl localnet src 10.0.0.0/8 172.16.0.0/12 192.168.0.0/16   # réseaux autorisés
acl SSL_ports port 443
acl Safe_ports port 80 21 443 70 210 1025-65535 280 488 591 777
acl CONNECT method CONNECT

http_access deny !Safe_ports           # refuse les ports non sûrs
http_access deny CONNECT !SSL_ports    # tunnel CONNECT seulement vers 443
http_access allow localhost manager
http_access deny manager
http_access allow localnet
http_access allow localhost
http_access deny all
http_port 3128</code></pre>
<ul><li><b>Safe_ports</b> : ports de destination autorisés pour <i>toute</i> requête (80 http, 21 ftp, 443 https, 1025-65535…). Exemple : refuser une requête vers le port 25 (SMTP) pour éviter qu'on envoie du spam via le proxy.</li>
<li><b>SSL_ports</b> : ports autorisés pour la méthode <b>CONNECT</b>, c'est-à-dire pour ouvrir un tunnel chiffré (HTTPS) : normalement seulement 443.</li>
<li><code>http_access deny CONNECT !SSL_ports</code> : refuse tout tunnel CONNECT vers un port qui n'est pas 443. Empêche d'utiliser le proxy pour faire passer autre chose qu'HTTPS (ex. un tunnel SSH vers le port 22).</li></ul>
<h3>Types d'ACL utiles</h3>
<ul><li><code>src</code> : IP du client · <code>dst</code> : IP de destination · <code>dstdomain</code> : domaine (<code>.facebook.com</code>) · <code>url_regex -i</code> : mot dans l'URL · <code>port</code> · <code>method</code> · <code>time</code> : horaires · <code>proxy_auth</code> : utilisateur authentifié · <code>external</code> : groupe AD (via LDAP).</li>
<li>Une ACL peut lire une liste dans un fichier : <code>acl reseaux_sociaux dstdomain "/etc/squid/reseaux-sociaux.txt"</code>.</li></ul>
<p>Après modification : <code>squid -k parse</code> (vérifier) puis <code>systemctl reload squid</code> ou <code>squid -k reconfigure</code>.</p>`},
{t:'Inspection HTTPS (ssl_bump)',h:`
<p>Sans inspection, le proxy ne voit d'une connexion HTTPS que le <b>nom du site</b> (SNI) : le contenu et l'URL complète sont chiffrés. Le <b>ProxySSL</b> (ou SSL-Bump) est un proxy qui <b>intercepte et inspecte les connexions HTTPS</b>.</p>
<h3>Fonctionnement (« homme du milieu » autorisé)</h3>
<ol><li>On crée une <b>autorité de certification (CA)</b> pour le proxy avec <b>OpenSSL</b>, puis on <b>installe son certificat sur les postes clients</b> (par GPO dans les autorités racines de confiance).</li>
<li>Le client demande <code>https://site</code> ; Squid lit le ClientHello (<code>peek</code>, il voit le SNI).</li>
<li>Squid <code>bump</code> : il établit une connexion TLS avec le client en présentant un <b>certificat généré à la volée</b> pour ce site, signé par sa CA (le navigateur l'accepte car la CA est de confiance).</li>
<li>Squid ouvre une <b>seconde connexion TLS</b> vers le vrai serveur.</li>
<li>Entre les deux, le trafic est <b>en clair dans le proxy</b> : il peut filtrer l'URL complète, bloquer, journaliser, faire analyser par un antivirus.</li></ol>
<pre><code>http_port 3128 ssl-bump cert=/etc/squid/ssl/squid-ca.pem generate-host-certificates=on dynamic_cert_mem_cache_size=4MB
sslcrtd_program /usr/lib/squid/security_file_certgen -s /var/lib/squid/ssl_db -M 4MB
acl step1 at_step SslBump1
ssl_bump peek step1
ssl_bump splice banques        # ne pas déchiffrer certains sites (banques, santé)
ssl_bump bump all</code></pre>
<div class="key"><b>Limites et éthique</b> : déchiffrer est intrusif (données personnelles) : informer les utilisateurs (charte), exclure les sites sensibles avec <code>splice</code>. Certaines applis refusent l'interception (épinglage de certificat).</div>`},
{t:'SIEM et Wazuh',h:`
<p>Un <b>SIEM</b> (Security Information and Event Management) est un système de <b>collecte, de corrélation et d'analyse de logs</b> provenant de toutes les machines, pour détecter des incidents et générer des alertes.</p>
<h3>Composants de Wazuh</h3>
<ul><li><b>Agent</b> : installé sur chaque machine surveillée ; <b>collecte et envoie les logs du poste vers le serveur Wazuh</b> (ports 1514/1515), surveille l'intégrité des fichiers (FIM), l'inventaire, les vulnérabilités.</li>
<li><b>Manager (serveur)</b> : reçoit, décode, applique les <b>règles</b> et génère les alertes.</li>
<li><b>Indexer</b> (base, issue d'OpenSearch/Elasticsearch) et <b>Dashboard</b> (interface web, ex-Kibana) pour visualiser.</li></ul>
<h3>ossec.conf</h3>
<p>Fichier de configuration principal de l'agent (et du manager) : <code>/var/ossec/etc/ossec.conf</code> (Linux) ou <code>C:\\Program Files (x86)\\ossec-agent\\ossec.conf</code> (Windows). Il définit <b>quels fichiers de logs sont surveillés</b>, l'adresse du manager, la surveillance d'intégrité (syscheck), le rootcheck, les réponses actives.</p>
<pre><code>&lt;localfile&gt;
  &lt;location&gt;/var/log/syslog&lt;/location&gt;
  &lt;log_format&gt;syslog&lt;/log_format&gt;
&lt;/localfile&gt;</code></pre>
<p>C'est le bloc <code>&lt;localfile&gt;</code> qui fait remonter un fichier de log (ici syslog, ou <code>/var/log/squid/access.log</code>).</p>
<p><b>Règles personnalisées</b> : <code>/var/ossec/etc/rules/local_rules.xml</code>, identifiants à partir de 100000 (ex. 100200 « refus Squid »). Niveau d'alerte de 0 à 15 : plus il est haut, plus c'est grave (≥ 12 : critique).</p>
<p><b>Agent sur OPNsense</b> : OPNsense est basé sur <b>FreeBSD</b> : on installe l'agent FreeBSD (aujourd'hui le plugin <code>os-wazuh-agent</code>) puis on le configure vers le serveur Wazuh et on l'enregistre sur le manager.</p>
<p><b>Déployer par GPO</b> : installer l'agent MSI sur tous les postes (installation logicielle ou script de démarrage avec <code>WAZUH_MANAGER=…</code>), et activer les <b>stratégies d'audit</b> (ouvertures de session, création de processus 4688) pour que les événements existent : aucun poste ne passe entre les mailles.</p>`},
{t:'Supervision : SNMP et Centreon',h:`
<p>Le SIEM surveille la <b>sécurité</b> (journaux, alertes) ; la <b>supervision</b> surveille l'<b>état et la performance</b> : la machine répond-elle, le disque est-il plein, le service tourne-t-il ? Outils : <b>Centreon</b>, Nagios, Zabbix, PRTG.</p>
<h3>États et seuils</h3>
<p>Chaque contrôle (« service » dans Centreon) renvoie un état : <b>OK</b>, <b>WARNING</b>, <b>CRITICAL</b>, <b>UNKNOWN</b> (et UP/DOWN pour un hôte). On fixe des <b>seuils</b> : par exemple disque C: WARNING à 80 %, CRITICAL à 90 %. Un dépassement déclenche une <b>notification</b> (mail, SMS) et l'événement reste dans l'historique.</p>
<h3>Comment on récupère les mesures</h3>
<ul><li><b>SNMP</b> (Simple Network Management Protocol) : l'outil interroge l'agent SNMP de l'équipement sur le port <b>UDP 161</b> ; l'équipement peut aussi envoyer spontanément des alertes (<b>traps</b>) sur le port <b>UDP 162</b>. Les valeurs sont identifiées par des <b>OID</b>, décrits dans des MIB.</li>
<li>Versions : <b>v1/v2c</b> protégées par une simple « communauté » en clair (souvent « public » : à changer !) ; <b>v3</b> ajoute authentification et chiffrement → à privilégier.</li>
<li>Autres moyens : agents (NSClient++ pour Windows), SSH, API, <b>plugins</b> qui renvoient un code de sortie (0 = OK, 1 = WARNING, 2 = CRITICAL, 3 = UNKNOWN).</li></ul>
<div class="tip">IA appliquée (objectif du cahier des charges) : au lieu de seuils fixes, la <b>détection d'anomalies par apprentissage</b> apprend le comportement normal (trafic, connexions) et alerte sur un écart inhabituel. Les SIEM modernes l'intègrent.</div>`},
{t:'Administrer à distance en sécurité',h:`
<ul><li><b>SSH</b> (port 22) pour Linux : chiffré. Préférer l'<b>authentification par clé</b> : <code>ssh-keygen -t ed25519</code> puis copie de la clé publique dans <code>~/.ssh/authorized_keys</code> du serveur. Durcir <code>/etc/ssh/sshd_config</code> : <code>PermitRootLogin no</code>, <code>PasswordAuthentication no</code>.</li>
<li><b>RDP</b> (3389) pour Windows : jamais exposé directement sur Internet ; NLA activé ; accès via VPN ou bastion.</li>
<li><b>Interfaces web d'administration</b> (OPNsense, Webmin 10000, Wazuh) : HTTPS, accessibles seulement depuis la zone d'administration.</li>
<li><b>Bastion</b> : point d'entrée unique, comptes nominatifs, sessions journalisées.</li>
<li><b>sudo</b> plutôt que root ; un compte d'administration distinct du compte de bureautique.</li></ul>
<p>Journaux utiles sous Linux : <code>journalctl -u squid</code>, <code>/var/log/auth.log</code> (connexions SSH), <code>/var/log/syslog</code>. Sous Windows : <b>Observateur d'événements</b> ; ID à connaître : <b>4624</b> connexion réussie, <b>4625</b> échec de connexion, <b>4688</b> création de processus, <b>4720</b> compte créé, <b>4740</b> compte verrouillé.</p>`},
{t:'IDS/IPS : Suricata',h:`
<ul><li><b>IDS</b> (Intrusion Detection System) : <b>détecte</b> et alerte (ex. Suricata en mode IDS sur OPNsense).</li>
<li><b>IPS</b> (Intrusion Prevention System) : détecte <b>et bloque</b> en ligne.</li></ul>
<p>Suricata compare le trafic à des <b>signatures</b> (règles ET Open, identifiées par un SID). Exemple du projet : un scan <code>nmap -sV</code> déclenche une alerte Suricata, remontée par l'agent Wazuh de FW01 et classée MITRE ATT&amp;CK <b>T1046</b> (Network Service Discovery).</p>
<p><b>Faux positif</b> : alerte sans attaque réelle. <b>Faux négatif</b> : attaque non détectée (le plus dangereux).</p>`},
{t:'Rapport d\'incident et IOC',h:`
<p>Un <b>IOC</b> (Indicator of Compromise) est une trace technique observable qui signale une compromission : adresse IP, nom de domaine, URL, hash (SHA-256) de fichier, nom ou chemin de fichier, User-Agent, clé de registre…</p>
<h3>Plan d'un rapport d'incident</h3>
<ol><li><b>Executive summary</b> : en 2 ou 3 phrases pour un dirigeant : quand, quelle machine, quel utilisateur, quelle menace, quel impact.</li>
<li><b>Détails de l'hôte infecté</b> : nom d'hôte, IP, MAC, compte utilisateur.</li>
<li><b>Chronologie</b> des événements.</li>
<li><b>IOC</b> : trafic malveillant (IP, URL, domaines) et fichiers (hash, taille, emplacement).</li>
<li><b>Remédiation et recommandations</b>.</li></ol>
<h3>Remédiation type (infostealer comme OskiStealer)</h3>
<ol><li><b>Isoler</b> le poste du réseau (sans l'éteindre, pour préserver les preuves).</li>
<li><b>Bloquer les IOC</b> : IP et domaine C2 sur le pare-feu, le DNS et le proxy.</li>
<li>Un stealer vole les mots de passe enregistrés dans les navigateurs, les cookies, les portefeuilles crypto : <b>réinitialiser tous les mots de passe</b> de l'utilisateur, révoquer les sessions, activer la <b>MFA</b>.</li>
<li><b>Rechercher les IOC</b> sur les autres postes (Wazuh, logs du proxy).</li>
<li><b>Réinstaller</b> le poste à partir d'une image saine, puis le remettre en service.</li>
<li>Retour d'expérience : sensibilisation au phishing, blocage des exécutables déguisés (.jpg qui commence par <code>MZ</code>), mise à jour des règles de détection.</li></ol>
<div class="key"><b>Signal clé de l'ancien partiel</b> : une requête HTTP vers un <code>.jpg</code> qui renvoie un fichier commençant par <code>MZ</code> (signature d'un exécutable Windows PE) est suspecte : c'est un exécutable/DLL déguisé en image (<i>file masquerading</i>).</div>`}
],
cards:[
['Qu\'est-ce qu\'un SIEM ?','Un système de collecte, de corrélation et d\'analyse de logs.'],
['Qu\'est-ce qu\'un ProxySSL ?','Un proxy qui intercepte et inspecte les connexions HTTPS.'],
['Comment générer et installer le certificat pour l\'inspection HTTPS ?','Le générer avec OpenSSL (CA du proxy), puis l\'installer sur les postes clients (par GPO).'],
['Fichier de configuration de Squid ?','<code>/etc/squid/squid.conf</code>'],
['Port par défaut de Squid ?','<b>3128</b>'],
['Journal des requêtes de Squid ?','<code>/var/log/squid/access.log</code>'],
['Comment bloquer des sites dans Squid ?','Créer une ACL (ex. dstdomain ou url_regex, liste noire) puis <code>http_access deny</code> cette ACL.'],
['Safe_ports vs SSL_ports ?','Safe_ports : ports autorisés pour toute requête. SSL_ports : ports autorisés pour la méthode CONNECT (tunnel HTTPS, 443).'],
['Que fait <code>http_access deny CONNECT !SSL_ports</code> ?','Refuse d\'ouvrir un tunnel CONNECT vers un port autre que 443.'],
['Rôle du bloc ssl_bump ?','Déchiffrer le HTTPS : Squid présente un certificat signé par sa CA au client, ouvre une 2e connexion TLS vers le serveur et inspecte entre les deux.'],
['Composants principaux de Wazuh ?','Agent, Manager, Dashboard (Kibana ou Wazuh UI) + Indexer.'],
['Rôle de l\'agent Wazuh ?','Collecter et envoyer les logs du poste client vers le serveur Wazuh.'],
['Fichier de configuration de l\'agent Wazuh ?','<code>ossec.conf</code>'],
['Bloc ossec.conf qui fait remonter un fichier de log ?','<code>&lt;localfile&gt;&lt;location&gt;…&lt;/location&gt;&lt;log_format&gt;syslog&lt;/log_format&gt;&lt;/localfile&gt;</code>'],
['Comment installer un agent Wazuh sur OPNsense ?','Installer l\'agent FreeBSD (plugin os-wazuh-agent) et le configurer vers le serveur Wazuh.'],
['Où écrire des règles Wazuh personnalisées ?','<code>local_rules.xml</code>, avec des ID à partir de 100000.'],
['IDS vs IPS ?','IDS détecte et alerte ; IPS détecte et bloque.'],
['Qu\'est-ce qu\'un IOC ?','Un indicateur de compromission : IP, domaine, URL, hash, nom de fichier, User-Agent…'],
['Que signifie « MZ » au début d\'un fichier ?','C\'est la signature d\'un exécutable Windows (PE : EXE/DLL).'],
['Que fait <code>Import-Csv</code> ?','Lit un fichier CSV et transforme chaque ligne en objet.'],
['Que fait <code>ForEach-Object</code> ?','Exécute un bloc pour chaque objet reçu ; <code>$_</code> = l\'objet en cours.'],
['À quoi sert <code>-SamAccountName</code> ?','L\'identifiant de connexion (login) unique de l\'utilisateur dans le domaine.'],
['Que fait <code>ConvertTo-SecureString</code> ?','Convertit un texte en chaîne sécurisée, format exigé pour un mot de passe.'],
['Effet de <code>-Enabled $false</code> ?','Le compte est créé désactivé : l\'utilisateur ne peut pas se connecter.'],
['Groupe AD qui protège les administrateurs ?','<b>Protected Users</b> (pas de NTLM, pas de délégation, pas de cache, TGT 4 h).'],
['Contre NTLMv1/LM, quel réglage GPO ?','Niveau d\'authentification LAN Manager = « Envoyer uniquement NTLMv2, refuser LM et NTLM ».'],
['Ports AD à ouvrir pour un client ?','Kerberos 88, LDAP 389, RPC 135 + dynamiques, DNS 53 (+ SMB 445, NTP 123, 464, 3268).'],
['Direction des règles OPNsense pour le trafic des clients ?','IN, sur l\'interface d\'où vient le trafic (CLT/LAN).'],
['TGT ?','Ticket Granting Ticket : obtenu à l\'ouverture de session, il permet de demander des tickets de service sans retaper son mot de passe.'],
['Pourquoi Kerberos exige-t-il des noms DNS et pas des IP ?','Les tickets de service sont demandés pour un nom de service (SPN) ; avec une IP, Kerberos échoue et on retombe sur NTLM ou une demande d\'identifiants.'],
['Kerberoasting ?','Demander des tickets de service pour casser hors ligne le mot de passe d\'un compte de service.'],
['Les 4 états d\'un contrôle de supervision ?','OK, WARNING, CRITICAL, UNKNOWN.'],
['Ports SNMP ?','UDP 161 (requêtes), UDP 162 (traps).'],
['Quelle version de SNMP utiliser et pourquoi ?','SNMPv3 : authentification et chiffrement (v1/v2c n\'ont qu\'une communauté en clair).'],
['ID d\'événement Windows d\'un échec de connexion ? d\'une connexion réussie ?','4625 · 4624'],
['Durcir SSH : 2 réglages ?','PermitRootLogin no et PasswordAuthentication no (authentification par clé).']
],
quiz:[
{q:'Qu\'est-ce qu\'un SIEM ?',o:['Un pare-feu matériel','Un système de gestion des mises à jour','Un système de collecte, de corrélation et d\'analyse de logs','Un antivirus en ligne'],a:[2],e:'Security Information and Event Management : il centralise et corrèle les journaux pour détecter les incidents.',src:'Partiel 2025'},
{q:'Qu\'est-ce qu\'un ProxySSL ?',o:['Un proxy qui filtre les requêtes HTTP uniquement','Un certificat utilisé par le navigateur','Un proxy qui intercepte et inspecte les connexions HTTPS','Une option d\'authentification proxy'],a:[2],e:'Il déchiffre le HTTPS (ssl_bump) pour pouvoir filtrer et journaliser le contenu.',src:'Partiel 2025'},
{q:'Comment avez-vous généré et installé le certificat SSL pour l\'inspection HTTPS ?',o:['En le téléchargeant depuis le navigateur','En le générant via OpenSSL, puis en l\'installant sur les postes clients','En le téléchargeant automatiquement depuis le proxy','En le copiant sur le serveur Wazuh'],a:[1],e:'On crée la CA du proxy avec OpenSSL, puis on la déploie (GPO) dans les autorités de confiance des postes.',src:'Partiel 2025'},
{q:'Quel fichier de Squid configure l\'inspection HTTPS ?',o:['/etc/squid/cache.log','/etc/hosts','/etc/squid/squid.conf','/var/log/squid/access.log'],a:[2],e:'squid.conf porte http_port … ssl-bump et les directives ssl_bump. Les .log sont des journaux.',src:'Partiel 2025'},
{q:'Comment restreindre l\'accès à certains sites web dans Squid ?',o:['En modifiant les DNS','En créant une ACL avec une blacklist et en l\'ajoutant dans http_access deny','En bloquant le port 80','En créant un mot de passe'],a:[1],e:'acl interdits dstdomain "/etc/squid/blacklist.txt" puis http_access deny interdits, placé avant les allow.',src:'Partiel 2025'},
{q:'Quels sont les composants principaux de Wazuh ?',o:['Agent, Windows Defender, Sysmon','Agent, Manager, Dashboard (Kibana ou Wazuh UI)','Manager, DNS, Proxy','Manager, Ansible, Grafana'],a:[1],e:'Agents sur les machines, manager qui analyse, dashboard (et indexer) pour visualiser.',src:'Partiel 2025'},
{q:'Quel est le rôle de l\'agent Wazuh ?',o:['Gérer les utilisateurs','Fournir une interface web','Collecter et envoyer les logs du poste client vers le serveur Wazuh','Gérer les VLAN'],a:[2],e:'L\'agent collecte (logs, intégrité, inventaire) et envoie au manager sur le port 1514.',src:'Partiel 2025'},
{q:'Quel est le nom du fichier de configuration principal pour l\'agent Wazuh ?',o:['Syslog.conf','Wazuh-agentd.conf','ossec.conf','Wazuh.cfg'],a:[2],e:'Wazuh descend d\'OSSEC : le fichier s\'appelle toujours ossec.conf.',src:'Partiel 2025'},
{q:'Le port par défaut utilisé pour l\'inspection HTTPS avec Squid est :',o:['443','3128','8080','80'],a:[1],e:'Squid écoute par défaut sur 3128 (http_port 3128 ssl-bump …). 443 est le port HTTPS des serveurs web.',src:'Partiel 2025'},
{q:'Dans Wazuh, le fichier ossec.conf permet de :',o:['Créer une base d\'antivirus','Définir quels fichiers de log sont surveillés','Envoyer des emails','Chiffrer les journaux'],a:[1],e:'Entre autres via les blocs <localfile>, ainsi que l\'adresse du manager et la surveillance d\'intégrité.',src:'Partiel 2025'},
{q:'Quel code permet de remonter les logs syslog dans Wazuh ?',o:['<file><name>/var/log/syslog</name></file>','<ossec><log location="/var/log/syslog" /></ossec>','<logfile><path>/var/log/syslog</path></logfile>','<localfile><location>/var/log/syslog</location><log_format>syslog</log_format></localfile>'],a:[3],e:'La syntaxe officielle est <localfile> avec <location> et <log_format>.',src:'Partiel 2025'},
{q:'Comment installe-t-on un agent Wazuh sur OPNsense ?',o:['En copiant un fichier de conf via FTP','En lançant un script Bash','En installant manuellement l\'agent FreeBSD et en configurant le serveur Wazuh','En utilisant l\'interface graphique de Wazuh'],a:[2],e:'OPNsense repose sur FreeBSD : on installe l\'agent FreeBSD (plugin os-wazuh-agent) et on le relie au manager.',src:'Partiel 2025'},
{q:'Dans Squid, que signifie « http_access deny CONNECT !SSL_ports » ?',o:['Bloquer tout le HTTPS','Refuser la méthode CONNECT vers tout port qui n\'est pas dans SSL_ports (443)','Autoriser CONNECT partout','Bloquer le port 3128'],a:[1],e:'Le ! signifie « non » : on empêche d\'ouvrir un tunnel chiffré vers un autre port que 443.'},
{q:'Dans quel ordre Squid lit-il les règles http_access ?',o:['Aléatoirement','De la dernière à la première','De haut en bas, la première qui correspond s\'applique','Les deny d\'abord, toujours'],a:[2],e:'D\'où l\'importance de placer les deny spécifiques avant les allow, et deny all en dernier.'},
{q:'Quelle ACL Squid bloque les URL contenant « torrent » ?',o:['acl t dstdomain torrent','acl t url_regex -i torrent','acl t src torrent','acl t port torrent'],a:[1],e:'url_regex cherche un motif dans l\'URL (-i : insensible à la casse). dstdomain compare le nom de domaine.'},
{q:'Que fait la commande Import-Csv dans un script de création d\'utilisateurs ?',o:['Elle crée les comptes','Elle lit le fichier CSV et transforme chaque ligne en objet','Elle exporte l\'AD en CSV','Elle chiffre le fichier'],a:[1],e:'Les colonnes deviennent des propriétés ($_.Nom, $_.Prenom…).'},
{q:'Que se passe-t-il si -Enabled est mis à $false dans New-ADUser ?',o:['Le compte n\'est pas créé','Le compte est créé mais désactivé : l\'utilisateur ne peut pas se connecter','Le mot de passe est supprimé','Le compte devient administrateur'],a:[1],e:'Un administrateur devra l\'activer (Enable-ADAccount).'},
{q:'À quoi sert ConvertTo-SecureString -AsPlainText -Force ?',o:['À générer un mot de passe aléatoire','À convertir un texte en chaîne sécurisée exigée par -AccountPassword','À chiffrer le disque','À vérifier la complexité du mot de passe'],a:[1],e:'-AsPlainText -Force indique qu\'on accepte de partir d\'un texte en clair.'},
{q:'Quelle mesure empêche l\'usage de NTLMv1 et LM ?',o:['Activer la corbeille AD','GPO « niveau d\'authentification LAN Manager » : NTLMv2 uniquement, refuser LM et NTLM','Désactiver le DNS','Ouvrir le port 445'],a:[1],e:'LM et NTLMv1 sont faibles : leurs hash se cassent ou se rejouent (Pass-the-Hash).'},
{q:'Quels avantages apporte le groupe Protected Users aux comptes admin ?',o:['Pas d\'authentification NTLM','Pas de délégation Kerberos','Accès Internet illimité','Pas de mise en cache des identifiants'],a:[0,1,3],e:'Il durcit les comptes à privilèges : Kerberos AES, pas de NTLM, pas de délégation, pas de cache, ticket de 4 h.'},
{q:'Quel port ouvrir pour l\'authentification Kerberos des clients vers l\'AD ?',o:['53','88','389','3389'],a:[1],e:'Kerberos = 88 TCP/UDP.'},
{q:'Une règle permettant aux clients CLT de joindre le DNS de l\'AD se place :',o:['Sur l\'interface ADM, direction OUT','Sur l\'interface CLT, direction IN','Sur le WAN','Sur le serveur DNS'],a:[1],e:'Sur OPNsense, on filtre à l\'entrée de l\'interface d\'où vient le trafic.'},
{q:'Une alerte Wazuh indique « File masquerading detected » sur /temp/osk/5.jpg, signature PE32 DLL. Qu\'est-ce que cela signifie ?',o:['Une image corrompue','Un exécutable (DLL) déguisé en image .jpg','Une mise à jour Windows','Un faux positif certain'],a:[1],e:'L\'extension .jpg ne correspond pas au contenu (en-tête MZ / PE32) : technique classique d\'un malware.'},
{q:'Lesquels sont des IOC ?',o:['L\'adresse IP 2.56.57.108','Le hash SHA-256 d\'une DLL téléchargée','Le nom du domaine spoonwatch.net','Le niveau d\'alerte Wazuh'],a:[0,1,2],e:'IP, hash et domaine sont des indicateurs réutilisables pour détecter ou bloquer. Le niveau d\'alerte est une métadonnée du SIEM.'},
{q:'Quelle est la première action face à un poste infecté par un infostealer ?',o:['Formater immédiatement','Isoler le poste du réseau','Attendre la fin de la journée','Désinstaller l\'antivirus'],a:[1],e:'Isoler stoppe la communication avec le C2 et la propagation, tout en conservant les preuves.'},
{q:'Un IDS se distingue d\'un IPS car :',o:['Il bloque le trafic','Il détecte et alerte sans bloquer','Il chiffre le trafic','Il remplace le pare-feu'],a:[1],e:'IDS = détection, IPS = prévention (blocage en ligne).'},
{q:'Où se trouvent les règles Wazuh personnalisées ?',o:['/etc/squid/squid.conf','/var/ossec/etc/rules/local_rules.xml','C:\\Windows\\hosts','/etc/wazuh/custom.cfg'],a:[1],e:'Les ID personnalisés commencent à 100000.'},
{q:'Qu\'obtient un utilisateur auprès du KDC à l\'ouverture de session Kerberos ?',o:['Un certificat X.509','Un TGT (Ticket Granting Ticket)','Une adresse IP','Un cookie HTTP'],a:[1],e:'Le TGT sert ensuite à obtenir des tickets de service (TGS) sans retaper le mot de passe.'},
{q:'Un poste configuré avec le proxy 192.168.10.20 (IP) affiche une fenêtre d\'identifiants au lieu du SSO. Pourquoi ?',o:['Squid est éteint','Kerberos a besoin du nom du service (SPN), pas d\'une IP','Le port 3128 est fermé','Le certificat a expiré'],a:[1],e:'C\'est pourquoi la GPO impose le nom complet srv-proxy01.groupe4.internal.'},
{q:'Quelles conditions sont indispensables au bon fonctionnement de Kerberos ?',o:['Une résolution DNS correcte','Des horloges synchronisées (moins de 5 minutes d\'écart)','Le protocole NTLMv1','Un accès Internet'],a:[0,1],e:'D\'où l\'importance du DNS de l\'AD et de NTP.'},
{q:'Un disque à 92 % avec des seuils WARNING 80 % et CRITICAL 90 %. Quel état renvoie la supervision ?',o:['OK','WARNING','CRITICAL','UNKNOWN'],a:[2],e:'92 % dépasse le seuil critique de 90 %.'},
{q:'Quel port reçoit les traps SNMP ?',o:['UDP 161','UDP 162','TCP 443','UDP 514'],a:[1],e:'161 : interrogation de l\'agent ; 162 : alertes envoyées par l\'équipement.'},
{q:'Pourquoi préférer SNMPv3 à SNMPv2c ?',o:['Il est plus rapide','Il apporte authentification et chiffrement','Il utilise TCP','Il n\'a pas besoin d\'agent'],a:[1],e:'En v2c, la communauté circule en clair.'},
{q:'Quel ID d\'événement Windows signale un échec d\'ouverture de session ?',o:['4624','4625','4688','4720'],a:[1],e:'4624 réussite, 4688 création de processus, 4720 compte créé.'},
{q:'Quelles mesures durcissent l\'accès SSH à un serveur Linux ?',o:['Authentification par clé','PermitRootLogin no','Exposer le port 22 sur Internet','PasswordAuthentication no'],a:[0,1,3],e:'Et passer par la zone d\'administration ou un bastion.'},
{q:'Quelle différence entre supervision (Centreon) et SIEM (Wazuh) ?',o:['Aucune','La supervision surveille l\'état et les performances ; le SIEM collecte et corrèle les journaux de sécurité','Le SIEM remplace le pare-feu','La supervision chiffre les logs'],a:[1],e:'Les deux sont complémentaires.'},
{q:'Dans Squid, quelle directive permet de NE PAS déchiffrer les sites bancaires ?',o:['ssl_bump bump banques','ssl_bump splice banques','http_access deny banques','cache deny banques'],a:[1],e:'splice laisse passer le tunnel TLS sans l\'ouvrir.'}
],
exos:[
{t:'Analyse de configuration Squid',src:'ancien partiel',pts:'4 × 1 pt',q:`<p>À partir du fichier <code>squid.conf</code> fourni (extrait) :</p><pre><code>acl localnet src …   # réseaux privés
acl SSL_ports port 443
acl Safe_ports port 80 21 443 70 210 1025-65535 280 488 591 777
http_access deny !Safe_ports
http_access deny CONNECT !SSL_ports
http_access allow localnet
http_access allow localhost
http_access deny all
http_port 3128</code></pre><ol><li>Quels réseaux sont autorisés à accéder au proxy ?</li><li>Quelle est la différence entre Safe_ports et SSL_ports ? Donnez un exemple d'usage.</li><li>Expliquez la ligne <code>http_access deny CONNECT !SSL_ports</code>.</li><li>Quel est le rôle du bloc ssl_bump ? Expliquez brièvement le processus d'inspection HTTPS.</li></ol>`,r:`
<ol><li>Les réseaux de l'ACL <b>localnet</b> (<code>http_access allow localnet</code>) : 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 (RFC 1918), 100.64.0.0/10 (CGN), 169.254.0.0/16 (lien local), 0.0.0.1-0.255.255.255, fc00::/7 et fe80::/10 en IPv6 ; plus <b>localhost</b> (le proxy lui-même). Tout le reste est refusé par <code>deny all</code>.</li>
<li><b>Safe_ports</b> = ports de destination autorisés pour n'importe quelle requête (80, 21, 443, 1025-65535…) ; <code>deny !Safe_ports</code> refuse par exemple une requête vers le port 25 (SMTP) ou 23 (Telnet). <b>SSL_ports</b> = ports autorisés pour la méthode CONNECT, c'est-à-dire les tunnels chiffrés HTTPS : 443. Exemple : <code>https://site.fr</code> fait un CONNECT site.fr:443, accepté.</li>
<li>Refuse toute requête de méthode <b>CONNECT</b> dont le port <b>n'est pas</b> dans SSL_ports : on ne peut ouvrir un tunnel qu'en 443. Empêche de détourner le proxy pour tunneler un autre protocole (SSH sur 22, etc.).</li>
<li><b>ssl_bump</b> active l'inspection HTTPS : Squid intercepte la connexion (peek pour lire le SNI, puis bump), présente au client un certificat généré pour le site et signé par la <b>CA du proxy</b> (créée avec OpenSSL et installée sur les postes par GPO), ouvre une seconde connexion TLS vers le vrai serveur ; le trafic est en clair dans le proxy, qui peut filtrer l'URL complète, bloquer et journaliser.</li></ol>`},
{t:'Cas pratique de filtrage Squid',src:'ancien partiel',pts:'—',q:`<p>Modifiez la configuration pour : 1) interdire l'accès aux sites contenant les mots <b>streaming</b> et <b>torrent</b> dans leur URL ; 2) autoriser uniquement les accès aux sites en HTTPS sauf pour <b>example.com</b> qui doit être bloqué. Rédigez les extraits (en indiquant les fichiers impliqués).</p>`,r:`
<p>Fichier <code>/etc/squid/squid.conf</code> (ou un fichier inclus de <code>/etc/squid/conf.d/</code>), règles placées <b>avant</b> <code>http_access allow localnet</code> :</p>
<pre><code># 1) mots interdits dans l'URL (insensible à la casse)
acl mots_interdits url_regex -i streaming torrent
http_access deny mots_interdits

# 2) example.com bloqué (domaine et sous-domaines)
acl site_bloque dstdomain .example.com
http_access deny site_bloque

# 2) HTTPS uniquement : seules les connexions CONNECT vers 443 passent
acl SSL_ports port 443
acl CONNECT method CONNECT
http_access deny !CONNECT          # refuse le HTTP en clair (port 80…)
http_access deny CONNECT !SSL_ports

http_access allow localnet
http_access deny all</code></pre>
<p>Variante : la liste de mots peut être dans un fichier : <code>acl mots_interdits url_regex -i "/etc/squid/mots_interdits.txt"</code>.</p>
<p><b>Remarque</b> : en HTTPS sans ssl_bump, Squid ne voit que le domaine ; pour détecter un mot dans le chemin de l'URL il faut l'inspection HTTPS (ou utiliser <code>dstdom_regex</code> pour un mot dans le nom de domaine). Vérifier puis appliquer : <code>squid -k parse</code> puis <code>systemctl reload squid</code>.</p>`},
{t:'Script PowerShell New-ADUser',src:'ancien partiel',pts:'3 + 1 pts',q:`<pre><code>Import-Csv "Utilisateurs.csv" | ForEach-Object {
  New-ADUser -Name $_.Nom -GivenName $_.Prenom -SamAccountName $_.Login \`
  -AccountPassword (ConvertTo-SecureString "MotDePasseTemp" -AsPlainText -Force) \`
  -Path "OU=eleves,DC=guardia,DC=rc" -Enabled $true }</code></pre>
<ol><li>Utilité de Import-Csv ? (0,5)</li><li>Que permet ForEach-Object ? (0,5)</li><li>À quoi sert -SamAccountName ? (0,5)</li><li>Que fait ConvertTo-SecureString ? (0,5)</li><li>Pourquoi une OU spécifique ? (0,5)</li><li>Que se passerait-il si -Enabled était à $false ? (0,5)</li></ol><p>Citez deux avantages de cette méthode (1 pt).</p>`,r:`
<ol><li><b>Import-Csv</b> lit le fichier Utilisateurs.csv et transforme chaque ligne en objet dont les colonnes (Nom, Prenom, Login) sont des propriétés.</li>
<li><b>ForEach-Object</b> exécute le bloc de code pour chaque objet reçu par le pipe ; <code>$_</code> représente la ligne en cours : on crée un utilisateur par ligne.</li>
<li><b>-SamAccountName</b> définit l'identifiant de connexion (login) unique de l'utilisateur dans le domaine (ex. GUARDIA\\jdupont).</li>
<li><b>ConvertTo-SecureString</b> convertit le mot de passe texte en chaîne sécurisée (SecureString), seul type accepté par -AccountPassword ; -AsPlainText -Force autorise la conversion depuis du texte en clair.</li>
<li>L'<b>OU eleves</b> range les comptes au bon endroit pour leur appliquer des GPO spécifiques et déléguer leur administration, sans toucher aux autres comptes.</li>
<li>Avec <b>$false</b>, les comptes seraient créés <b>désactivés</b> : personne ne pourrait se connecter avant qu'un administrateur les active.</li></ol>
<p><b>Avantages</b> : gain de temps (création en masse), pas d'erreur de saisie, procédure reproductible et traçable. (Point d'amélioration : mot de passe identique et en clair → ajouter <code>-ChangePasswordAtLogon $true</code>.)</p>`},
{t:'Tableau GPO : problèmes, conséquences, résolutions',src:'ancien partiel',pts:'5 pts',q:`<p>Complétez les cases manquantes : 1) deux comptes admin sans « Ce compte est sensible et ne peut pas être délégué » (conséquences ?) ; 2) deux administrateurs hors du groupe des utilisateurs protégés (résolution ?) ; 3) niveau d'authentification LAN Manager qui permet NTLMv1 ou LM (résolution ?) ; 4) dernière sauvegarde de l'AD il y a 7 jours (conséquences ?) ; 5) appliquer un mot de passe fort (conséquences et résolution ?).</p>`,r:`
<ol><li><b>Conséquences</b> : les identifiants de ces administrateurs peuvent être délégués à un service (délégation Kerberos non contrainte) ; si ce serveur est compromis, l'attaquant récupère leur ticket et agit en tant qu'administrateur du domaine.</li>
<li><b>Résolution</b> : ajouter les comptes administrateurs au groupe <b>Protected Users</b> (pas de NTLM, pas de délégation, pas d'identifiants en cache, Kerberos AES, ticket de 4 h).</li>
<li><b>Résolution</b> : GPO <i>Configuration ordinateur › Stratégies › Paramètres Windows › Paramètres de sécurité › Stratégies locales › Options de sécurité</i> : « Sécurité réseau : niveau d'authentification LAN Manager » = <b>Envoyer uniquement les réponses NTLMv2. Refuser LM et NTLM</b> ; activer « Ne pas stocker de valeurs de hachage de niveau LAN Manager ».</li>
<li><b>Conséquences</b> : en cas de panne du DC, de ransomware ou de suppression accidentelle, on perd jusqu'à 7 jours de modifications (comptes, groupes, GPO) ; restauration incomplète, interruption de service.</li>
<li><b>Conséquences</b> d'un mot de passe faible : force brute, dictionnaire, password spraying, compromission de comptes. <b>Résolution</b> : GPO Default Domain Policy › Stratégie de mot de passe (12 caractères minimum, complexité, historique, durée de vie) + stratégie de verrouillage du compte ; FGPP plus stricte pour les admins.</li></ol>`},
{t:'Matrice de flux OPNsense',src:'ancien partiel',pts:'—',q:`<p>Trois zones séparées par OPNsense. Autorisez : les clients vers le serveur AD/DNS (Kerberos, LDAP, RPC, DNS) ; les clients CLT vers les services web internes via le reverse proxy ; les clients vers Internet (HTTP/HTTPS). Complétez : Interface, Source, Destination, Protocole, Port, Direction, Description.</p>`,r:`
<div class="tbl"><table><tr><th>Interface</th><th>Source</th><th>Destination</th><th>Proto</th><th>Port</th><th>Dir.</th><th>Description</th></tr>
<tr><td>CLT</td><td>CLT net (ex. 192.168.20.0/24)</td><td>SRV-AD01 (ex. 192.168.10.10)</td><td>TCP/UDP</td><td>88</td><td>IN</td><td>Accès AD – Kerberos</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>SRV-AD01</td><td>TCP/UDP</td><td>389</td><td>IN</td><td>Accès AD – LDAP</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>SRV-AD01</td><td>TCP</td><td>135 et 49152-65535</td><td>IN</td><td>Accès AD – RPC</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>SRV-AD01</td><td>TCP/UDP</td><td>53</td><td>IN</td><td>Résolution DNS</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>SRV-RP01 (ex. 192.168.30.10)</td><td>TCP</td><td>80</td><td>IN</td><td>Site web interne – HTTP</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>any sauf réseaux privés</td><td>TCP</td><td>80</td><td>IN</td><td>Accès web externe – HTTP</td></tr>
<tr><td>CLT</td><td>CLT net</td><td>any sauf réseaux privés</td><td>TCP</td><td>443</td><td>IN</td><td>Accès web externe – HTTPS</td></tr></table></div>
<p>Toutes les règles sont <b>IN</b> sur l'interface CLT car le trafic est initié par les clients ; le pare-feu étant stateful, les réponses reviennent automatiquement. Tout le reste est bloqué par la règle par défaut.</p>`},
{t:'Journaux d\'un SIEM : rapport d\'incident',src:'ancien partiel',pts:'—',q:`<p>Vous êtes analyste chez PyroServ. Le serveur Wazuh (192.168.3.2) a remonté des logs suspects de WIN-CLT (agent 005, 2025-04-15) : connexion de steve.smith à 15:59 (explorer.exe) ; règle 20100 niveau 10 « Possible malware communication » 192.168.2.101 → 2.56.57.108, POST http://2.56.57.108/osk//1.jpg, 645 592 octets ; sqlite3.dll en /temp/osk/1.jpg, signature MZ, « .jpg header mismatch » ; POST /osk//main.php ; User-Agent inhabituel « wget/1.20.3 » lancé par powershell.exe ; 23 requêtes DNS en 5 min vers spoonwatch.net → 2.56.57.108 ; update.bat exécuté depuis AppData\\Local\\Temp avec parent winlogon.exe ; « File masquerading » sur /temp/osk/5.jpg (PE32 DLL). Note : l'IP 2.56.57.108 est associée à OskiStealer.</p><ol><li>Executive summary</li><li>IOC</li><li>Remédiation</li><li>Rôle d'ossec.conf</li><li>En quoi une GPO renforce l'utilisation de Wazuh ?</li></ol>`,r:`
<p><b>1. Executive summary</b> : le 15/04/2025 vers 16 h, le poste Windows WIN-CLT (192.168.2.101) utilisé par <b>steve.smith</b> a été infecté par le malware <b>OskiStealer</b>, un voleur d'informations. Le poste a téléchargé des composants déguisés en images et communiqué avec un serveur de commande (2.56.57.108) : des identifiants et données du navigateur ont probablement été exfiltrés.</p>
<p><b>2. IOC</b> :</p><ul><li>IP du serveur malveillant : <b>2.56.57.108</b> (port 80) ; domaine <b>spoonwatch.net</b>.</li>
<li>URL : <code>http://2.56.57.108/osk//1.jpg</code> à <code>7.jpg</code>, <code>/osk//main.php</code>, <code>/osk/</code> (POST d'un zip = exfiltration).</li>
<li>Fichiers : DLL légitimes déguisées en .jpg (sqlite3.dll, freebl3.dll, mozglue.dll, msvcp140.dll, nss3.dll, softokn3.dll, vcruntime140.dll) avec leurs <b>SHA-256</b> (ex. 16574f51…ab17660 pour 1.jpg, e2935b5b…ae9d78 pour 5.jpg) ; <code>C:\\Users\\steve.smith\\AppData\\Local\\Temp\\update.bat</code>.</li>
<li>Comportement : User-Agent <code>Mozilla/5.0 (compatible; wget/1.20.3)</code> lancé par powershell.exe ; fichier .jpg commençant par MZ.</li></ul>
<p><b>3. Remédiation</b> : isoler WIN-CLT du réseau ; bloquer 2.56.57.108 et spoonwatch.net sur le pare-feu, le DNS et le proxy ; réinitialiser tous les mots de passe de steve.smith (et ceux enregistrés dans son navigateur), révoquer les sessions, activer la MFA ; rechercher les IOC sur les autres machines dans Wazuh ; réinstaller le poste depuis une image saine ; sensibiliser l'utilisateur ; bloquer l'exécution depuis %TEMP% (AppLocker par GPO).</p>
<p><b>4. ossec.conf</b> : fichier de configuration de l'agent/manager Wazuh. Il définit les sources de logs surveillées (blocs <code>&lt;localfile&gt;</code>), l'adresse du manager, la surveillance d'intégrité (syscheck), le rootcheck et les réponses actives : c'est lui qui permet d'ajouter des journaux personnalisés à analyser (ex. access.log de Squid).</p>
<p><b>5. GPO</b> : déployer automatiquement l'agent Wazuh sur tous les postes du domaine (installation MSI avec l'adresse du manager), garantir que le service reste actif, et activer les stratégies d'audit (connexions, création de processus, PowerShell) pour que Windows produise les événements que Wazuh analyse. Aucun poste n'échappe à la supervision, et la configuration est homogène.</p>`},
{t:'Expliquer le SSO Kerberos du proxy',pts:'entraînement',q:`<p>Dans le projet 2, j.martin ouvre sa session Windows puis navigue sans qu'aucune fenêtre d'identifiants n'apparaisse, alors que Squid exige une authentification. Expliquez le mécanisme et deux raisons pour lesquelles une fenêtre d'identifiants pourrait apparaître.</p>`,r:`
<p><b>Mécanisme</b> : à l'ouverture de session, le KDC (SRV-AD01) remet à j.martin un <b>TGT</b>. Quand Edge contacte <code>srv-proxy01.groupe4.internal:3128</code>, Squid répond 407 (authentification requise) en proposant Negotiate. Le poste demande alors au KDC un <b>ticket de service</b> pour le SPN <code>HTTP/srv-proxy01.groupe4.internal</code> et l'envoie au proxy. Squid le valide grâce à sa keytab : l'utilisateur est identifié sans saisir son mot de passe. Squid vérifie ensuite par LDAP l'appartenance au groupe <b>GG-Internet</b> (sinon 403).</p>
<p><b>Fenêtre d'identifiants si</b> : le proxy est configuré par son <b>IP</b> au lieu de son nom (pas de SPN → pas de ticket) ; l'<b>heure</b> du poste ou du proxy est décalée de plus de 5 minutes ; le DNS ne résout pas le nom ; la keytab ou le SPN sont mal créés ; le poste n'est pas membre du domaine.</p>`},
{t:'Concevoir la supervision d\'un serveur',pts:'entraînement',q:`<p>Proposez cinq contrôles de supervision pour SRV-AD01 avec leurs seuils, et indiquez comment l'outil récupère les mesures.</p>`,r:`
<div class="tbl"><table><tr><th>Contrôle</th><th>WARNING</th><th>CRITICAL</th></tr>
<tr><td>Hôte joignable (ping)</td><td>perte &gt; 20 % ou &gt; 100 ms</td><td>perte 100 %</td></tr>
<tr><td>CPU</td><td>80 % sur 5 min</td><td>95 % sur 5 min</td></tr>
<tr><td>Espace disque C:</td><td>80 %</td><td>90 %</td></tr>
<tr><td>Services AD DS, DNS, DHCP, Netlogon</td><td>—</td><td>service arrêté</td></tr>
<tr><td>Échecs de connexion (4625)</td><td>&gt; 20 / 5 min</td><td>&gt; 100 / 5 min (force brute)</td></tr></table></div>
<p>Collecte : agent (NSClient++) ou <b>SNMPv3</b> sur UDP 161 pour CPU/disque/services ; ping ICMP ; les événements de sécurité remontent plutôt par l'agent Wazuh. Chaque état CRITICAL déclenche une notification à l'équipe.</p>`}
]
});
