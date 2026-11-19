/* Guardia_Rev · Introduction ISR (réseaux, services, architecture). */
window.GR=window.GR||{subjects:[]};
GR.subjects.push({
id:'isr', name:'Introduction ISR', icon:'ISR', color:'linear-gradient(140deg,#1f78c8,#0f4f8f)',
exam:'Partiel · Partie 1 (QCM)',
short:'Modèle OSI, adressage IP, VLAN, DHCP, DNS, Active Directory, pare-feu, DMZ, virtualisation.',
intro:'La base de l\'épreuve « Introduction ISR & Techniques d\'administration ». Les anciens sujets commencent par une vingtaine de QCM sur ces notions : elles doivent être sues par cœur.',
fiche:[
{t:'Le modèle OSI', h:`
<p>Le modèle OSI découpe une communication réseau en <b>7 couches</b>. Chaque couche rend un service à la couche du dessus.</p>
<div class="tbl"><table>
<tr><th>#</th><th>Couche</th><th>Rôle</th><th>Exemples</th><th>Unité</th></tr>
<tr><td>7</td><td>Application</td><td>Fournir des services réseau aux applications de l'utilisateur</td><td>HTTP, DNS, SMTP, FTP, SSH, LDAP</td><td>Données</td></tr>
<tr><td>6</td><td>Présentation</td><td>Format des données : <b>chiffrement</b>, compression, encodage</td><td>TLS/SSL, JPEG, ASCII</td><td>Données</td></tr>
<tr><td>5</td><td>Session</td><td>Ouvrir, maintenir et fermer un dialogue entre deux applications</td><td>RPC, NetBIOS</td><td>Données</td></tr>
<tr><td>4</td><td>Transport</td><td>Communication <b>de bout en bout</b>, fiabilité, récupération d'erreurs, <b>ports</b></td><td>TCP, UDP</td><td>Segment</td></tr>
<tr><td>3</td><td>Réseau</td><td><b>Adressage IP</b> et routage : acheminer les paquets entre réseaux différents</td><td>IP, ICMP, routeur</td><td>Paquet</td></tr>
<tr><td>2</td><td>Liaison</td><td>Transmission sur un même réseau local, adresses MAC, VLAN</td><td>Ethernet, Wi-Fi, switch</td><td>Trame</td></tr>
<tr><td>1</td><td>Physique</td><td>Signaux électriques, optiques ou radio sur le support</td><td>Câble, fibre, hub</td><td>Bit</td></tr>
</table></div>
<div class="key"><b>Moyen mnémotechnique</b> (de 1 à 7) : « <b>P</b>our <b>L</b>e <b>R</b>éseau <b>T</b>out <b>S</b>e <b>P</b>asse <b>A</b>utomatiquement ».</div>
<div class="trap"><b>Pièges des anciens partiels</b> : le chiffrement est en couche <b>6 présentation</b> (pas en session ni en liaison) ; les ports (80, 443) et la fiabilité relèvent de la couche <b>4 transport</b> ; la résolution de noms (DNS) est un service de couche <b>7</b>.</div>
<p><b>TCP</b> : orienté connexion (poignée de main SYN, SYN-ACK, ACK), fiable, ordonné, retransmission. <b>UDP</b> : sans connexion, rapide, sans garantie (DNS, DHCP, streaming, VoIP).</p>`},
{t:'Adressage IPv4 et masques', h:`
<p>Une adresse IPv4 fait <b>32 bits</b>, écrite en 4 octets (ex. <code>192.168.10.25</code>). Le <b>masque</b> sépare la partie réseau de la partie hôte. Notation CIDR : <code>/24</code> = 24 bits à 1.</p>
<div class="tbl"><table><tr><th>CIDR</th><th>Masque</th><th>Adresses</th><th>Hôtes utilisables</th></tr>
<tr><td>/8</td><td>255.0.0.0</td><td>16 777 216</td><td>16 777 214</td></tr>
<tr><td>/16</td><td>255.255.0.0</td><td>65 536</td><td>65 534</td></tr>
<tr><td>/24</td><td>255.255.255.0</td><td>256</td><td>254</td></tr>
<tr><td>/25</td><td>255.255.255.128</td><td>128</td><td>126</td></tr>
<tr><td>/26</td><td>255.255.255.192</td><td>64</td><td>62</td></tr>
<tr><td>/27</td><td>255.255.255.224</td><td>32</td><td>30</td></tr>
<tr><td>/30</td><td>255.255.255.252</td><td>4</td><td>2</td></tr></table></div>
<p>Formule : nombre d'hôtes = 2<sup>(32 − CIDR)</sup> − 2 (on retire l'adresse <b>réseau</b>, la première, et l'adresse de <b>broadcast</b>, la dernière).</p>
<h3>Plages privées (RFC 1918)</h3>
<ul><li><code>10.0.0.0/8</code> : 10.0.0.0 → 10.255.255.255</li><li><code>172.16.0.0/12</code> : 172.16.0.0 → <b>172.31</b>.255.255</li><li><code>192.168.0.0/16</code> : 192.168.0.0 → 192.168.255.255</li></ul>
<div class="trap"><b>Piège</b> : <code>172.35.20.1</code> n'est <b>pas</b> privée (la plage s'arrête à 172.31). <code>8.8.8.8</code> est publique (DNS de Google).</div>
<p>Autres plages à connaître : <code>127.0.0.0/8</code> boucle locale (localhost), <code>169.254.0.0/16</code> APIPA / lien local (le poste n'a pas eu de réponse DHCP), <code>100.64.0.0/10</code> CGNAT.</p>
<p><b>NAT</b> : le pare-feu/routeur traduit les adresses privées en une adresse publique pour sortir sur Internet. La <b>passerelle</b> (gateway) est le routeur par lequel un poste sort de son réseau.</p>`},
{t:'Matériel réseau et VLAN', h:`
<ul><li><b>Switch</b> (couche 2) : relie les machines d'un même réseau local grâce aux adresses MAC.</li>
<li><b>Routeur</b> (couche 3) : relie des réseaux différents et choisit le chemin des paquets.</li>
<li><b>Pare-feu</b> : filtre le trafic selon des règles (souvent aussi routeur entre les zones, comme OPNsense).</li></ul>
<h3>VLAN</h3>
<p>Un <b>VLAN</b> (Virtual LAN, norme 802.1Q) crée des <b>réseaux logiques distincts sur un même réseau physique</b>. C'est donc aussi une <b>méthode de segmentation</b>. Deux VLAN ne communiquent pas sans passer par un équipement de couche 3 (routeur ou pare-feu), qui peut alors filtrer.</p>
<ul><li>Port <b>access</b> : appartient à un seul VLAN (un poste).</li><li>Port <b>trunk</b> : transporte plusieurs VLAN « étiquetés » (tag 802.1Q) entre switchs ou vers le pare-feu.</li></ul>
<div class="key"><b>À retenir</b> : un VLAN n'est ni un protocole de routage, ni du chiffrement. Il cloisonne : une machine compromise dans le VLAN « clients » n'atteint pas directement le VLAN « serveurs ».</div>`},
{t:'DHCP et DNS', h:`
<h3>DHCP : donner une adresse automatiquement</h3>
<p>Le serveur <b>DHCP</b> distribue automatiquement aux équipements : adresse IP, masque, <b>passerelle</b>, <b>serveur DNS</b>, suffixe de domaine, durée de bail. Échange en 4 temps : <b>D</b>iscover → <b>O</b>ffer → <b>R</b>equest → <b>A</b>ck (DORA), en UDP 67 (serveur) / 68 (client).</p>
<p>Le Discover est un <b>broadcast</b> : il ne traverse pas un routeur. Si le serveur DHCP est dans une autre zone, le pare-feu doit activer un <b>relais DHCP (DHCP Relay)</b> qui transmet la demande au serveur. C'est ce qu'on a fait sur OPNsense pour la zone CLT.</p>
<h3>DNS : traduire les noms</h3>
<p>Le <b>DNS</b> traduit un nom de domaine en adresse IP (<code>site1.groupe6.internal</code> → <code>192.168.30.10</code>). Port <b>53</b> (UDP, et TCP pour les grosses réponses et transferts de zone).</p>
<ul><li><b>A</b> : nom → IPv4 · <b>AAAA</b> : nom → IPv6 · <b>CNAME</b> : alias · <b>MX</b> : serveur de mail · <b>PTR</b> : IP → nom (zone inverse) · <b>SRV</b> : localiser un service (ex. le contrôleur de domaine).</li></ul>
<div class="key"><b>Le lien DHCP ↔ DNS</b> (question à 2 points) : le DHCP indique aux clients <b>quel serveur DNS utiliser</b> (option 6) et le suffixe du domaine ; avec les mises à jour dynamiques, il <b>enregistre le nom des postes dans le DNS</b>. Le DNS permet ensuite aux clients de trouver les serveurs par leur nom, et surtout de localiser le <b>contrôleur de domaine Active Directory</b> (enregistrements SRV). Sans bon DNS, pas de connexion au domaine.</div>`},
{t:'Active Directory', h:`
<p><b>Active Directory (AD DS)</b> est l'annuaire de Microsoft. Il permet de <b>gérer les comptes utilisateurs, ordinateurs et groupes et leurs droits d'accès</b>, et de <b>centraliser l'authentification</b> sur le réseau. Le serveur qui l'héberge est un <b>contrôleur de domaine (DC)</b>.</p>
<ul><li><b>Domaine</b> : ensemble d'objets partageant le même annuaire (ex. <code>groupe4.internal</code>). <b>Forêt</b> : ensemble de domaines.</li>
<li><b>OU (unité d'organisation)</b> : dossier pour ranger les objets, appliquer des <b>GPO</b> et déléguer l'administration.</li>
<li><b>Groupes</b> : donner des droits à plusieurs comptes d'un coup (ex. <code>GG-Internet</code>).</li>
<li><b>GPO</b> (stratégie de groupe) : règles appliquées automatiquement à tous les utilisateurs/ordinateurs d'une OU (proxy imposé, panneau de configuration interdit, politique de mot de passe…).</li></ul>
<p>Protocoles : <b>Kerberos</b> (authentification, port 88), <b>LDAP</b> (interrogation de l'annuaire, 389 ; LDAPS 636), <b>DNS</b> (53), <b>SMB</b> (445, partages SYSVOL/GPO), <b>RPC</b> (135 + ports dynamiques).</p>
<p><b>Corbeille AD</b> : permet de restaurer un objet supprimé. Activation : <code>Enable-ADOptionalFeature 'Recycle Bin Feature' -Scope ForestOrConfigurationSet -Target groupe4.internal</code>.</p>
<div class="trap">Active Directory ne fournit pas l'accès Internet (c'est le proxy) et n'analyse pas le trafic (c'est l'IDS/SIEM).</div>`},
{t:'Pare-feu, DMZ et zones', h:`
<p>Un <b>pare-feu</b> filtre le trafic selon des <b>règles prédéfinies</b> (source, destination, protocole, port). Il peut bloquer un port précis. Il ne chiffre pas les communications (c'est le rôle de TLS/VPN) et ne remplace pas l'AD.</p>
<p>Politique de base : <b>tout est interdit sauf ce qui est explicitement autorisé</b> (deny all par défaut, <b>moindre privilège</b>). Les règles sont lues de haut en bas, la première qui correspond s'applique.</p>
<h3>Les zones</h3>
<ul><li><b>LAN / CLT</b> : les postes des utilisateurs.</li>
<li><b>Zone d'administration (ADM)</b> : les serveurs sensibles (AD, DNS, DHCP) et le <b>bastion</b> ; accès très restreint.</li>
<li><b>DMZ</b> (zone démilitarisée) : zone tampon qui héberge les services <b>exposés</b> (serveur web, reverse proxy, relais mail). Si un serveur de la DMZ est piraté, l'attaquant reste enfermé : il ne peut pas aller vers le LAN.</li>
<li><b>WAN</b> : Internet.</li></ul>
<p>Le pare-feu a <b>une adresse IP par zone</b> (ex. 4 interfaces : WAN, LAN, ADM, DMZ) et sert de passerelle à chacune.</p>
<p><b>Bastion</b> : machine durcie, seul point d'entrée pour administrer les serveurs ; tout est tracé.</p>
<p><b>Défense en profondeur</b> : plusieurs couches de protection successives, pour qu'une seule faille ne suffise pas (pare-feu périmétrique + pare-feu interne + proxy + supervision).</p>`},
{t:'Reverse proxy et proxy', h:`
<ul><li><b>Proxy (direct)</b> : les <b>clients internes</b> passent par lui pour sortir sur Internet. Il filtre, authentifie et journalise (ex. <b>Squid</b>, port 3128).</li>
<li><b>Reverse proxy</b> : les <b>visiteurs</b> s'adressent à lui, et il <b>redirige les requêtes web vers les serveurs internes</b> (ex. Nginx dans la DMZ). Le vrai serveur web n'est jamais exposé directement.</li></ul>
<div class="key"><b>Image à retenir</b> : le reverse proxy est un standard téléphonique. On appelle l'accueil, jamais directement le bureau du directeur. Dans notre projet : <code>site1.groupe6.internal</code> par le reverse proxy → la page s'affiche ; l'IP du serveur web en direct → aucune réponse (bloqué par le pare-feu).</div>`},
{t:'Virtualisation', h:`
<p>L'<b>hyperviseur</b> <b>alloue les ressources matérielles</b> (CPU, RAM, disque, réseau) aux <b>machines virtuelles</b>. Plusieurs VM tournent sur un seul serveur physique.</p>
<ul><li><b>Type 1 (bare-metal)</b> : installé directement sur le matériel : Proxmox VE, VMware ESXi, Hyper-V.</li>
<li><b>Type 2 (hébergé)</b> : s'installe sur un système existant : VirtualBox, VMware Workstation.</li></ul>
<p>Avantages : économies de matériel, <b>snapshots</b> (retour arrière avant une modification), isolation, déploiement rapide. Nos projets tournaient sur Proxmox, avec des snapshots « avant_soutenance ».</p>`},
{t:'Ports à connaître par cœur', h:`
<div class="tbl"><table><tr><th>Service</th><th>Port</th><th>Protocole</th></tr>
<tr><td>FTP</td><td>20/21</td><td>TCP</td></tr><tr><td>SSH</td><td>22</td><td>TCP</td></tr><tr><td>Telnet</td><td>23</td><td>TCP</td></tr>
<tr><td>SMTP</td><td>25 (587 soumission)</td><td>TCP</td></tr><tr><td>DNS</td><td>53</td><td>UDP et TCP</td></tr>
<tr><td>DHCP</td><td>67 (serveur) / 68 (client)</td><td>UDP</td></tr><tr><td>HTTP</td><td>80</td><td>TCP</td></tr>
<tr><td>Kerberos</td><td>88</td><td>TCP et UDP</td></tr><tr><td>NTP (heure)</td><td>123</td><td>UDP</td></tr>
<tr><td>RPC (Endpoint Mapper)</td><td>135 (+ 49152-65535 dynamiques)</td><td>TCP</td></tr>
<tr><td>SNMP</td><td>161</td><td>UDP</td></tr><tr><td>LDAP</td><td>389</td><td>TCP et UDP</td></tr>
<tr><td>HTTPS</td><td>443</td><td>TCP</td></tr><tr><td>SMB</td><td>445</td><td>TCP</td></tr>
<tr><td>Kerberos (mot de passe)</td><td>464</td><td>TCP et UDP</td></tr><tr><td>LDAPS</td><td>636</td><td>TCP</td></tr>
<tr><td>Catalogue global</td><td>3268</td><td>TCP</td></tr><tr><td>RDP</td><td>3389</td><td>TCP</td></tr>
<tr><td>Squid (proxy)</td><td>3128</td><td>TCP</td></tr><tr><td>Wazuh agent → manager</td><td>1514 (événements), 1515 (enrôlement)</td><td>TCP</td></tr>
</table></div>`}
],
cards:[
['Combien de couches dans le modèle OSI ?','7 : physique, liaison, réseau, transport, session, présentation, application.'],
['Quelle couche OSI gère le chiffrement ?','La couche 6, <b>présentation</b> (format, chiffrement, compression).'],
['Quelle couche OSI gère la communication de bout en bout et les ports ?','La couche 4, <b>transport</b> (TCP, UDP).'],
['Quelle couche OSI achemine les paquets entre réseaux ?','La couche 3, <b>réseau</b> (IP, routage).'],
['Masque décimal de /8 ?','<code>255.0.0.0</code>'],
['Masque décimal de /24 ?','<code>255.255.255.0</code>'],
['Masque décimal de /26 et nombre d\'hôtes ?','<code>255.255.255.192</code>, 62 hôtes.'],
['Les 3 plages d\'adresses privées ?','10.0.0.0/8 · 172.16.0.0/12 (jusqu\'à 172.31) · 192.168.0.0/16'],
['Que signifie une adresse en 169.254.x.x ?','APIPA : le poste n\'a reçu aucune réponse du serveur DHCP.'],
['Qu\'est-ce qu\'un VLAN ?','Un réseau logique distinct créé sur un même réseau physique (802.1Q) : une méthode de segmentation.'],
['Les 4 étapes du DHCP ?','DORA : Discover, Offer, Request, Ack.'],
['Que faut-il activer sur OPNsense pour qu\'un DHCP d\'une autre zone serve les clients ?','Le <b>DHCP Relay</b> (relais DHCP).'],
['Rôle du DNS ?','Traduire un nom de domaine en adresse IP (et l\'inverse avec les PTR). Port 53.'],
['Enregistrement DNS qui localise le contrôleur de domaine ?','<b>SRV</b> (ex. _ldap._tcp.dc._msdcs.domaine).'],
['Que permet Active Directory ?','Gérer les comptes et leurs droits, et centraliser l\'authentification sur le réseau.'],
['Qu\'est-ce qu\'une OU ?','Une unité d\'organisation : un conteneur AD pour ranger les objets, appliquer des GPO et déléguer.'],
['Qu\'est-ce qu\'une GPO ?','Une stratégie de groupe : des règles appliquées automatiquement aux utilisateurs/ordinateurs d\'une OU.'],
['Commande PowerShell pour activer la corbeille AD ?','<code>Enable-ADOptionalFeature</code> (feature « Recycle Bin Feature »).'],
['Qu\'est-ce qu\'une DMZ ?','Zone tampon isolée qui héberge les services exposés à Internet (web, reverse proxy). Un serveur piraté y reste enfermé.'],
['Rôle d\'un reverse proxy ?','Recevoir les requêtes web des visiteurs et les rediriger vers les serveurs internes, sans les exposer.'],
['Rôle d\'un hyperviseur ?','Allouer les ressources matérielles (CPU, RAM, disque, réseau) aux machines virtuelles.'],
['Hyperviseur type 1 vs type 2 ?','Type 1 directement sur le matériel (Proxmox, ESXi, Hyper-V) ; type 2 sur un OS (VirtualBox).'],
['Port Kerberos ? LDAP ? LDAPS ?','88 · 389 · 636'],
['Port DNS ? HTTP ? HTTPS ?','53 · 80 · 443'],
['Port RPC Endpoint Mapper ? SMB ? RDP ?','135 · 445 · 3389'],
['Principe du moindre privilège ?','Ne donner que les droits strictement nécessaires ; sur un pare-feu : tout bloquer sauf le nécessaire.'],
['Qu\'est-ce qu\'un bastion ?','Machine durcie, unique point d\'entrée pour administrer les serveurs, dont l\'accès est tracé.'],
['TCP vs UDP ?','TCP : connexion, fiable, ordonné (HTTP, SSH). UDP : sans connexion, rapide, sans garantie (DNS, DHCP, VoIP).']
],
quiz:[
{q:'Qu\'est-ce qu\'un VLAN ?',o:['Un protocole de routage dynamique','Une technologie permettant de créer des réseaux logiques distincts sur un même réseau physique','Une méthode de segmentation réseau','Une méthode de cryptage des données réseau'],a:[1,2],e:'Le VLAN crée des réseaux logiques séparés sur le même matériel : c\'est donc bien une méthode de segmentation. Il ne route pas et ne chiffre pas.',src:'Partiel 2025'},
{q:'Quelle est la notation décimale du masque de sous-réseau /8 ?',o:['255.255.0.0','255.255.255.0','255.0.0.0'],a:[2],e:'/8 = 8 bits à 1 = le premier octet entier : 255.0.0.0.',src:'Partiel 2025'},
{q:'Parmi les adresses suivantes, lesquelles sont des adresses IP privées ?',o:['192.168.1.100','10.0.0.5','172.35.20.1','8.8.8.8'],a:[0,1],e:'La plage 172.16.0.0/12 s\'arrête à 172.31.255.255 : 172.35.x.x est publique. 8.8.8.8 est le DNS public de Google.',src:'Partiel 2025'},
{q:'Dans le modèle OSI, la couche transport correspond :',o:['À la gestion des câbles et des ports','À la gestion de la fiabilité de la communication','À la résolution des noms de domaine','À la gestion des ports logiques (ex : TCP/UDP)'],a:[1,3],e:'Transport = fiabilité de bout en bout et ports logiques (TCP/UDP). Les câbles sont en couche physique, le DNS en couche application.',src:'Partiel 2025'},
{q:'Quelle(s) affirmation(s) est(sont) vraie(s) à propos d\'un pare-feu ?',o:['Il peut bloquer un port spécifique','Il filtre le trafic selon des règles prédéfinies','Il chiffre les communications réseau','Il remplace l\'Active Directory'],a:[0,1],e:'Le pare-feu filtre selon des règles (dont les ports). Le chiffrement relève de TLS/VPN, l\'annuaire de l\'AD.',src:'Partiel 2025'},
{q:'Que permet un Active Directory ?',o:['Gérer les comptes utilisateurs et leurs droits d\'accès','Fournir un accès Internet via un proxy','Centraliser l\'authentification des utilisateurs sur le réseau','Analyser le trafic réseau en temps réel'],a:[0,2],e:'AD = annuaire : comptes, groupes, droits, authentification centralisée (Kerberos).',src:'Partiel 2025'},
{q:'Le rôle de la couche transport dans le modèle OSI est :',o:['Assurer la fiabilité de la transmission','Résoudre les noms de domaines','Utiliser les ports logiques comme le 443 ou le 80'],a:[0,2],e:'Fiabilité (TCP) et ports logiques : couche 4.',src:'Partiel 2025'},
{q:'La couche réseau dans le modèle OSI permet de :',o:['Acheminer les paquets entre des réseaux différents','Fournir une interface utilisateur','Appliquer des stratégies de sécurité','Utiliser des adresses IP'],a:[0,3],e:'Couche 3 : adressage IP et routage entre réseaux.',src:'Partiel 2025'},
{q:'Quelle(s) couche(s) du modèle OSI se charge(nt) du chiffrement ?',o:['La couche liaison de données','La couche session','La couche présentation','La couche physique'],a:[2],e:'La couche 6, présentation, gère le format des données : chiffrement, compression, encodage.',src:'Partiel 2025'},
{q:'Quelle couche gère les connexions de bout en bout et la récupération d\'erreurs ?',o:['Couche liaison','Couche réseau','Couche transport','Couche application'],a:[2],e:'TCP (couche transport) établit la connexion de bout en bout et retransmet les segments perdus.',src:'Partiel 2025'},
{q:'À quoi sert la couche application dans le modèle OSI ?',o:['À fournir des services réseau aux applications utilisateurs','À déterminer le chemin du routage','À segmenter les paquets','À gérer les signaux électriques'],a:[0],e:'Couche 7 : HTTP, DNS, SMTP… au service des applications.',src:'Partiel 2025'},
{q:'Quelle(s) fonction(s) réalise un serveur DNS ?',o:['Traduire un nom de domaine en adresse IP','Chiffrer les requêtes HTTP','Superviser l\'usage du disque dur'],a:[0],e:'Le DNS résout les noms. Le chiffrement HTTP est assuré par TLS (HTTPS).',src:'Partiel 2025'},
{q:'Quelle est la fonction principale du reverse proxy dans l\'architecture du projet ?',o:['Contrôler l\'accès des utilisateurs au réseau local','Analyser les paquets réseau entrants','Rediriger les requêtes web vers les serveurs internes','Traduire des noms de domaine en IP'],a:[2],e:'Le reverse proxy reçoit les requêtes des visiteurs et les transmet au serveur web interne, qui n\'est jamais exposé.',src:'Partiel 2025'},
{q:'Quelle technologie est utilisée pour relier plusieurs zones réseau sur la même infrastructure ?',o:['DNS','VLAN','NAT','HTTPS'],a:[1],e:'Chaque zone est un VLAN ; le pare-feu route et filtre entre ces VLAN. Le NAT sert à sortir vers Internet.',src:'Partiel 2025'},
{q:'Quel service doit être activé dans OPNsense pour permettre à un serveur DHCP d\'un autre réseau de fournir des adresses IP aux clients ?',o:['DHCP server','DHCP Relay','Proxy ARP','VPN Gateway'],a:[1],e:'Le Discover DHCP est un broadcast qui ne traverse pas le routeur : le relais le transmet au serveur de l\'autre zone.',src:'Partiel 2025'},
{q:'À quoi sert un serveur DHCP dans un réseau d\'entreprise ?',o:['À distribuer automatiquement des adresses IP aux équipements connectés','À traduire les noms de domaine en adresse IP','À gérer les impressions en réseau','À héberger des pages web'],a:[0],e:'DHCP = configuration réseau automatique (IP, masque, passerelle, DNS).',src:'Partiel 2025'},
{q:'Quel protocole est utilisé pour accéder à un site web ?',o:['SNMP','HTTP','SMTP','FTP'],a:[1],e:'HTTP (ou HTTPS). SNMP = supervision, SMTP = envoi de mail, FTP = transfert de fichiers.',src:'Partiel 2025'},
{q:'Quel est le rôle d\'un hyperviseur dans une architecture virtualisée ?',o:['Allouer les ressources matérielles aux VM','Fournir des adresses IP','Gérer les utilisateurs du domaine','Protéger le réseau contre les attaques'],a:[0],e:'L\'hyperviseur partage CPU, RAM, disque et réseau entre les VM.',src:'Partiel 2025'},
{q:'Quelle est la commande PowerShell pour activer la corbeille Active Directory ?',o:['Enable-ADOptionalFeature','Remove-ADObject','Restore-ADRecycleBin','Enable-ADRecycleBin'],a:[0],e:'Enable-ADOptionalFeature « Recycle Bin Feature ». Les deux dernières commandes n\'existent pas.',src:'Partiel 2025'},
{q:'Combien d\'hôtes utilisables dans un réseau /26 ?',o:['64','62','30','126'],a:[1],e:'2^(32−26) = 64 adresses, moins réseau et broadcast = 62.'},
{q:'Quelle est l\'adresse de broadcast de 192.168.10.0/24 ?',o:['192.168.10.0','192.168.10.1','192.168.10.254','192.168.10.255'],a:[3],e:'La dernière adresse du réseau est le broadcast ; la première est l\'adresse réseau.'},
{q:'Un poste obtient l\'adresse 169.254.12.7. Que s\'est-il passé ?',o:['Il a reçu une adresse publique','Il n\'a pas reçu de réponse du serveur DHCP','Il est dans la DMZ','Son DNS est mal configuré'],a:[1],e:'169.254.0.0/16 = APIPA : adresse auto-attribuée faute de serveur DHCP joignable (relais absent, règle de pare-feu…).'},
{q:'Quels protocoles utilisent principalement UDP ?',o:['DNS','DHCP','SSH','HTTPS'],a:[0,1],e:'DNS (53) et DHCP (67/68) utilisent UDP. SSH et HTTPS utilisent TCP.'},
{q:'Dans quelle zone placer un serveur web accessible depuis Internet ?',o:['LAN','Zone d\'administration','DMZ','WAN'],a:[2],e:'La DMZ isole les services exposés : s\'ils sont compromis, l\'attaquant n\'atteint pas le LAN.'},
{q:'Quel enregistrement DNS associe un nom à une adresse IPv4 ?',o:['MX','A','PTR','CNAME'],a:[1],e:'A = nom → IPv4. PTR = IP → nom, MX = mail, CNAME = alias.'},
{q:'Quel est le port de Kerberos ?',o:['53','88','389','443'],a:[1],e:'Kerberos : 88 (TCP/UDP). LDAP 389, DNS 53, HTTPS 443.'},
{q:'Quelle politique de pare-feu respecte le moindre privilège ?',o:['Tout autoriser puis bloquer les attaques connues','Tout bloquer par défaut puis autoriser uniquement le nécessaire','Autoriser tout le trafic sortant','Bloquer uniquement Internet'],a:[1],e:'Deny all par défaut, puis des règles d\'autorisation précises (liste blanche).'},
{q:'Quel équipement relie des réseaux différents et choisit le chemin des paquets ?',o:['Hub','Switch','Routeur','Point d\'accès'],a:[2],e:'Le routeur travaille en couche 3. Le switch relie les machines d\'un même réseau (couche 2).'},
{q:'Quelle est la différence entre un proxy et un reverse proxy ?',o:['Aucune','Le proxy sert les clients internes qui sortent ; le reverse proxy reçoit les visiteurs et les renvoie vers les serveurs internes','Le reverse proxy chiffre le disque','Le proxy remplace le DNS'],a:[1],e:'Proxy : sortie des utilisateurs (Squid). Reverse proxy : entrée des visiteurs vers les serveurs (Nginx).'}
],
exos:[
{t:'Lien entre DHCP et DNS',src:'ancien partiel',pts:'2 pts',q:`<p>Expliquez le lien entre DHCP et DNS dans votre architecture, et le rôle qu'ils jouent pour les clients.</p>`,r:`
<ul><li><b>DHCP</b> : à son démarrage, le poste client reçoit automatiquement son adresse IP, son masque, sa passerelle (le pare-feu) et <b>l'adresse du serveur DNS</b> (option 6) ainsi que le suffixe de domaine. Comme le serveur est dans une autre zone, le pare-feu joue le rôle de <b>relais DHCP</b>.</li>
<li><b>DNS</b> : le client utilise ce serveur pour traduire les noms en adresses IP (<code>site1.groupe.internal</code>, <code>srv-ad01</code>…) et pour <b>localiser le contrôleur de domaine</b> grâce aux enregistrements SRV : c'est indispensable pour joindre le domaine et s'authentifier.</li>
<li><b>Lien</b> : le DHCP indique aux clients quel DNS utiliser, et il peut <b>mettre à jour dynamiquement</b> le DNS avec le nom et l'adresse de chaque poste. Dans notre architecture, les deux rôles sont sur le même serveur (SRV-AD01), avec l'AD.</li></ul>`},
{t:'Analyse d\'une infrastructure',src:'ancien partiel',pts:'4 pts',q:`<p>Complétez le tableau (le pare-feu possède 4 adresses IP) : Windows Server (DNS/DHCP/AD), Reverse proxy, Client Win 10 (dhcp), Serveur web, Bastion d'administration (192.168.1.2), Pare-feu (LAN / Administration / WAN / DMZ). Puis : pourquoi ces informations doivent figurer dans un dossier technique ? Quelles autres informations peuvent y figurer ?</p>`,r:`
<p>Exemple de plan d'adressage cohérent (une zone = un réseau /24) :</p>
<div class="tbl"><table><tr><th>Machine</th><th>Adresse IP</th><th>Zone</th><th>Rôle</th></tr>
<tr><td>Windows Server</td><td>192.168.1.10</td><td>Administration</td><td>DNS / DHCP / AD</td></tr>
<tr><td>Reverse proxy</td><td>192.168.30.10</td><td>DMZ</td><td>Reçoit les requêtes web et les transmet au serveur web</td></tr>
<tr><td>Client Win 10</td><td>DHCP (192.168.20.x)</td><td>LAN</td><td>Poste utilisateur</td></tr>
<tr><td>Serveur web</td><td>192.168.30.20</td><td>DMZ</td><td>Héberge les sites, joignable seulement par le reverse proxy</td></tr>
<tr><td>Bastion</td><td>192.168.1.2</td><td>Administration</td><td>Point d'entrée unique pour administrer</td></tr>
<tr><td>Pare-feu</td><td>WAN : DHCP/IP publique · LAN 192.168.20.254 · ADM 192.168.1.254 · DMZ 192.168.30.254</td><td>Les 4 zones</td><td>Routage et filtrage inter-zones, passerelle de chaque zone, relais DHCP</td></tr></table></div>
<p><b>Pourquoi dans le dossier technique ?</b> Pour que n'importe quel administrateur puisse comprendre, maintenir, dépanner et faire évoluer l'infrastructure ; éviter les conflits d'adresses ; écrire des règles de pare-feu justes ; assurer la continuité si l'équipe change ; servir de preuve lors d'un audit.</p>
<p><b>Autres informations</b> : masques et passerelles, VLAN et interfaces, noms DNS (FQDN), systèmes et versions, comptes de service (sans les mots de passe), matrice des flux / règles de pare-feu, schéma réseau, procédures de sauvegarde et de restauration, contacts, historique des modifications.</p>`},
{t:'DMZ, zone d\'administration, LAN',src:'ancien partiel',pts:'—',q:`<p>Qu'est-ce qu'une DMZ ? Une zone d'administration ? Un LAN ?</p>`,r:`
<ul><li><b>DMZ</b> : zone tampon entre Internet et le réseau interne, qui héberge les services accessibles de l'extérieur (serveur web, reverse proxy, relais mail). Elle est isolée : un serveur compromis ne peut pas atteindre le réseau interne.</li>
<li><b>Zone d'administration</b> : zone très restreinte qui contient les serveurs critiques (AD, DNS, DHCP) et/ou le bastion ; seuls les administrateurs y accèdent, de façon tracée.</li>
<li><b>LAN</b> : réseau local des utilisateurs (postes clients, imprimantes) ; il accède aux services internes et à Internet selon les règles du pare-feu.</li></ul>`},
{t:'Proposition d\'amélioration réseau',src:'ancien partiel',pts:'4 + 3 pts',q:`<p>À partir du schéma existant, proposez une évolution de l'architecture pour isoler la DMZ du reste du SI à l'aide d'un pare-feu interne, d'un pare-feu périmétrique et d'une éventuelle zone tampon (bastion, bastion mail…). Réalisez un schéma simplifié. Citez au moins 3 avantages concrets.</p>`,r:`
<pre><code>Internet
   │
[Pare-feu périmétrique]  (filtre l'entrée/sortie Internet, NAT)
   │
  DMZ ── reverse proxy, serveur web, relais mail
   │
[Pare-feu interne]  (autre éditeur si possible ; n'autorise que les flux DMZ→interne indispensables)
   ├── Zone administration : bastion, AD/DNS/DHCP
   └── LAN : postes clients</code></pre>
<p><b>Principe</b> : deux pare-feux en cascade, la DMZ entre les deux. Un attaquant qui compromet un serveur de la DMZ doit encore franchir le pare-feu interne. L'administration passe uniquement par le bastion.</p>
<p><b>Avantages</b> :</p><ol><li><b>Défense en profondeur</b> : deux barrières ; une faille sur l'une ne suffit pas (encore mieux avec deux éditeurs différents).</li>
<li><b>Confinement</b> : la compromission d'un service exposé ne se propage pas au LAN ni à l'AD.</li>
<li><b>Administration maîtrisée et tracée</b> grâce au bastion : un seul point d'entrée, journalisé.</li>
<li><b>Surface d'attaque réduite</b> et flux lisibles, plus faciles à superviser.</li></ol>`},
{t:'Calcul d\'adressage',pts:'entraînement',q:`<p>On attribue le réseau <code>192.168.40.0/26</code> à la zone CLT. Donnez : le masque décimal, l'adresse réseau, la première et la dernière adresse utilisable, le broadcast et le nombre d'hôtes.</p>`,r:`
<ul><li>Masque : <b>255.255.255.192</b> (/26 = 2 bits « empruntés » dans le dernier octet : 128 + 64).</li>
<li>Adresse réseau : <b>192.168.40.0</b></li><li>Première utilisable : <b>192.168.40.1</b> · dernière : <b>192.168.40.62</b></li>
<li>Broadcast : <b>192.168.40.63</b></li><li>Hôtes : 2<sup>6</sup> − 2 = <b>62</b></li></ul>`}
]
});
