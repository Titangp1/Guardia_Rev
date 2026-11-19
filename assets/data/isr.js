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
{t:'Découper un réseau en sous-réseaux', h:`
<p>Le calcul tombe presque à chaque partiel. Méthode rapide, sans binaire :</p>
<ol><li><b>Repérer l'octet « coupé »</b> par le masque : /8 → 1<sup>er</sup> octet, /9 à /16 → 2<sup>e</sup>, /17 à /24 → 3<sup>e</sup>, /25 à /32 → 4<sup>e</sup>.</li>
<li><b>Valeur du masque dans cet octet</b> : 128, 192, 224, 240, 248, 252, 254, 255 pour 1 à 8 bits à 1.</li>
<li><b>Le pas</b> (taille du bloc) = 256 − cette valeur.</li>
<li><b>Adresse réseau</b> = le plus grand multiple du pas inférieur ou égal à l'octet de l'IP (les octets suivants à 0).</li>
<li><b>Broadcast</b> = réseau + pas − 1 (les octets suivants à 255) ; première = réseau + 1 ; dernière = broadcast − 1.</li></ol>
<div class="tip"><b>Exemple</b> : <code>192.168.10.77/27</code> → 4<sup>e</sup> octet coupé, masque 255.255.255.<b>224</b>, pas = 32. Multiples : 0, 32, <b>64</b>, 96… 77 est entre 64 et 95. Réseau <b>192.168.10.64</b>, broadcast <b>.95</b>, plage <b>.65 → .94</b>, 30 hôtes.</div>
<div class="tip"><b>Exemple 2</b> : <code>172.20.150.9/20</code> → 3<sup>e</sup> octet coupé, masque 255.255.<b>240</b>.0, pas = 16. 150 est entre 144 et 159. Réseau <b>172.20.144.0</b>, broadcast <b>172.20.159.255</b>, plage 172.20.144.1 → 172.20.159.254, 4 094 hôtes.</div>
<h3>Découper un /24 en plusieurs zones</h3>
<p>Pour obtenir N sous-réseaux, on emprunte n bits tels que 2<sup>n</sup> ≥ N. Un /24 découpé en 4 → /26 (4 blocs de 64) : .0/26, .64/26, .128/26, .192/26. Pour un nombre d'hôtes H, on choisit le plus petit bloc tel que bloc − 2 ≥ H (50 postes → bloc de 64 → /26). Le <b>VLSM</b> consiste à donner des tailles différentes selon les besoins (un /30 suffit pour relier deux routeurs).</p>`},
{t:'ARP, ICMP, routage et NAT', h:`
<h3>ARP : de l'IP à l'adresse MAC</h3>
<p>Sur un réseau local, une trame est envoyée à une <b>adresse MAC</b>. <b>ARP</b> demande en broadcast « qui a l'IP 192.168.20.254 ? » et la machine concernée répond avec sa MAC. Le résultat est gardé en cache (<code>arp -a</code>). Pour sortir du réseau, le poste envoie la trame à la MAC de sa <b>passerelle</b>. Attaque : <b>ARP spoofing</b> (répondre à la place de la passerelle pour intercepter le trafic : man-in-the-middle).</p>
<h3>ICMP</h3>
<p>Protocole de messages de contrôle de la couche 3 : <code>ping</code> (echo request / echo reply), <code>tracert</code> / <code>traceroute</code> (liste des routeurs traversés), « destination injoignable ». Beaucoup de pare-feux bloquent le ping entrant : « pas de ping » ne veut pas dire « machine éteinte ».</p>
<h3>Routage</h3>
<p>Chaque routeur (ici OPNsense) consulte sa <b>table de routage</b> : réseaux directement connectés (une interface par zone), routes statiques, et la <b>route par défaut</b> (0.0.0.0/0) vers Internet. Un poste n'a besoin que de sa passerelle par défaut.</p>
<h3>NAT</h3>
<ul><li><b>NAT source / PAT (masquerade)</b> : les adresses privées sortent sur Internet avec l'adresse publique du pare-feu ; les ports distinguent les connexions. C'est ce qui permet à tout le LAN de naviguer avec une seule IP publique.</li>
<li><b>NAT destination / redirection de port (port forwarding)</b> : le pare-feu redirige un port de son IP publique (ex. 443) vers un serveur interne de la DMZ (ex. le reverse proxy). C'est ainsi qu'on publie un service.</li></ul>`},
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
{t:'Diagnostiquer un problème réseau', h:`
<p>On remonte les couches, du plus simple au plus complexe :</p>
<ol><li><b>Configuration IP</b> : <code>ipconfig /all</code> (Windows) ou <code>ip a</code> et <code>ip route</code> (Linux). Une adresse en 169.254.x.x = pas de DHCP.</li>
<li><b>Passerelle</b> : <code>ping 192.168.20.254</code>.</li>
<li><b>Autre zone / Internet par IP</b> : <code>ping 192.168.10.10</code>, <code>ping 8.8.8.8</code>, <code>tracert</code> pour voir où ça bloque.</li>
<li><b>DNS</b> : <code>nslookup site1.groupe6.internal</code>. Si l'IP marche mais pas le nom, c'est le DNS.</li>
<li><b>Service / port</b> : <code>Test-NetConnection 192.168.30.10 -Port 80</code> (PowerShell), <code>curl -I http://site1…</code>, <code>ss -tulpn</code> ou <code>netstat -an</code> sur le serveur pour voir s'il écoute.</li>
<li><b>Pare-feu</b> : journaux en direct d'OPNsense (<i>Firewall › Log Files › Live View</i>) : la ligne rouge montre la règle qui bloque.</li></ol>
<div class="tbl"><table><tr><th>Symptôme</th><th>Cause probable</th></tr>
<tr><td>Adresse 169.254.x.x</td><td>Pas de réponse DHCP : relais absent, règle UDP 67/68, serveur DHCP arrêté ou étendue épuisée</td></tr>
<tr><td>Ping par IP OK, nom KO</td><td>DNS : mauvais serveur DNS reçu, enregistrement absent, port 53 bloqué</td></tr>
<tr><td>Impossible de joindre le domaine</td><td>DNS du client ne pointe pas vers le DC, ports Kerberos/LDAP/RPC/SMB bloqués, heure décalée de plus de 5 min</td></tr>
<tr><td>Site joignable par IP du serveur web mais pas par le nom</td><td>Le DNS pointe vers le serveur web au lieu du reverse proxy, ou en-tête Host non reconnu</td></tr></table></div>`},
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
['TCP vs UDP ?','TCP : connexion, fiable, ordonné (HTTP, SSH). UDP : sans connexion, rapide, sans garantie (DNS, DHCP, VoIP).'],
['Comment calculer le « pas » d\'un sous-réseau ?','256 − valeur du masque dans l\'octet coupé (/27 → 224 → pas de 32).'],
['192.168.10.77/27 : réseau et broadcast ?','Réseau 192.168.10.64, broadcast 192.168.10.95.'],
['Rôle d\'ARP ?','Trouver l\'adresse MAC correspondant à une IP sur le réseau local.'],
['Qu\'est-ce que l\'ARP spoofing ?','Répondre à la place de la passerelle pour intercepter le trafic (man-in-the-middle).'],
['NAT source (PAT) vs redirection de port ?','PAT : le LAN sort avec l\'IP publique du pare-feu. Redirection : un port public est renvoyé vers un serveur interne (publication).'],
['Commande pour voir sa configuration IP complète sous Windows ?','<code>ipconfig /all</code>'],
['Ping par IP OK mais pas par nom : quel service est en cause ?','Le DNS.'],
['Écart d\'heure maximal toléré par Kerberos ?','5 minutes.'],
['Qu\'est-ce que la route par défaut ?','0.0.0.0/0 : là où l\'on envoie tout ce qui n\'a pas de route plus précise (vers Internet).']
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
{q:'Quelle est la différence entre un proxy et un reverse proxy ?',o:['Aucune','Le proxy sert les clients internes qui sortent ; le reverse proxy reçoit les visiteurs et les renvoie vers les serveurs internes','Le reverse proxy chiffre le disque','Le proxy remplace le DNS'],a:[1],e:'Proxy : sortie des utilisateurs (Squid). Reverse proxy : entrée des visiteurs vers les serveurs (Nginx).'},
{q:'Quelle est l\'adresse réseau de 192.168.10.77/27 ?',o:['192.168.10.0','192.168.10.64','192.168.10.72','192.168.10.96'],a:[1],e:'/27 → pas de 32 : 0, 32, 64, 96… 77 est dans le bloc 64-95.'},
{q:'Quel est le broadcast de 172.20.150.9/20 ?',o:['172.20.150.255','172.20.159.255','172.20.255.255','172.20.144.255'],a:[1],e:'/20 → 3e octet, masque 240, pas de 16 : bloc 144-159, donc broadcast 172.20.159.255.'},
{q:'On doit loger 50 postes dans un sous-réseau. Quel masque est le plus économe ?',o:['/24','/25','/26','/27'],a:[2],e:'/26 = 64 adresses, 62 hôtes ≥ 50. /27 n\'offre que 30 hôtes.'},
{q:'En découpant 192.168.1.0/24 en 4 sous-réseaux égaux, quel est le masque obtenu ?',o:['/25','/26','/27','/28'],a:[1],e:'4 = 2² : on emprunte 2 bits, 24 + 2 = /26.'},
{q:'Quel protocole permet de trouver l\'adresse MAC associée à une adresse IP ?',o:['DNS','DHCP','ARP','ICMP'],a:[2],e:'ARP (Address Resolution Protocol), par une requête en broadcast.'},
{q:'Quelle commande Windows affiche l\'adresse IP, la passerelle et les serveurs DNS ?',o:['ipconfig /all','netstat -r','ping -a','arp -d'],a:[0],e:'Sous Linux : ip a et ip route, et /etc/resolv.conf pour le DNS.'},
{q:'Un poste ping 192.168.10.10 mais pas srv-ad01.groupe4.internal. Que vérifier en premier ?',o:['Le câble réseau','Le DNS configuré sur le poste','Le pare-feu HTTP','La carte graphique'],a:[1],e:'La connectivité IP fonctionne ; c\'est la résolution de nom qui échoue.'},
{q:'Quel mécanisme permet à tout le LAN de sortir sur Internet avec une seule adresse publique ?',o:['VLAN','NAT source / PAT','DHCP Relay','Reverse proxy'],a:[1],e:'Le pare-feu remplace l\'IP source privée par son IP publique et distingue les connexions par les ports.'},
{q:'Pour publier sur Internet le reverse proxy de la DMZ, on configure sur le pare-feu :',o:['Une redirection de port (NAT destination) vers le reverse proxy','Un relais DHCP','Un VLAN supplémentaire','Une GPO'],a:[0],e:'Le port 443 public est redirigé vers l\'IP interne du reverse proxy, avec une règle qui l\'autorise.'},
{q:'Quel est l\'écart d\'horloge maximal toléré par défaut par Kerberos ?',o:['30 secondes','5 minutes','1 heure','Aucun'],a:[1],e:'D\'où l\'importance de NTP : au-delà, l\'authentification échoue.'},
{q:'Que fait la commande tracert (traceroute) ?',o:['Elle affiche les routeurs traversés jusqu\'à la destination','Elle résout un nom DNS','Elle renouvelle le bail DHCP','Elle liste les ports ouverts'],a:[0],e:'Utile pour voir à quel saut le trafic s\'arrête.'},
{q:'Quelle est la route par défaut ?',o:['127.0.0.1','0.0.0.0/0','255.255.255.255','192.168.0.0/16'],a:[1],e:'Elle couvre toutes les destinations sans route plus précise.'}
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
<li>Broadcast : <b>192.168.40.63</b></li><li>Hôtes : 2<sup>6</sup> − 2 = <b>62</b></li></ul>`},
{t:'Plan d\'adressage d\'une PME',pts:'entraînement',q:`<p>On dispose de <code>192.168.50.0/24</code>. Il faut : une zone CLT de 100 postes, une zone ADM de 20 serveurs, une DMZ de 10 serveurs, et un lien /30 entre deux routeurs. Proposez un découpage (VLSM) avec réseau, masque et plage de chaque zone.</p>`,r:`
<p>On attribue les plus gros blocs en premier :</p>
<div class="tbl"><table><tr><th>Zone</th><th>Besoin</th><th>Réseau</th><th>Masque</th><th>Plage utilisable</th><th>Broadcast</th></tr>
<tr><td>CLT</td><td>100</td><td>192.168.50.0/25</td><td>255.255.255.128</td><td>.1 → .126 (126 hôtes)</td><td>.127</td></tr>
<tr><td>ADM</td><td>20</td><td>192.168.50.128/27</td><td>255.255.255.224</td><td>.129 → .158 (30 hôtes)</td><td>.159</td></tr>
<tr><td>DMZ</td><td>10</td><td>192.168.50.160/28</td><td>255.255.255.240</td><td>.161 → .174 (14 hôtes)</td><td>.175</td></tr>
<tr><td>Lien</td><td>2</td><td>192.168.50.176/30</td><td>255.255.255.252</td><td>.177 → .178</td><td>.179</td></tr></table></div>
<p>Il reste 192.168.50.180 → .255 pour une évolution. Convention utile : la passerelle (pare-feu) prend la dernière adresse utilisable de chaque zone (.126, .158, .174).</p>`},
{t:'Diagnostic : le poste n\'a pas d\'adresse',pts:'entraînement',q:`<p>Le poste PC-CLT01 (zone CLT) affiche l'adresse <code>169.254.33.12</code> et ne peut pas ouvrir de session sur le domaine. Le serveur DHCP est SRV-AD01 en zone ADM. Décrivez votre démarche de diagnostic et les causes possibles.</p>`,r:`
<ol><li><b>Interpréter</b> : 169.254.x.x = APIPA, le poste n'a reçu <b>aucune réponse DHCP</b>. Sans IP valide, pas de DNS, donc pas de domaine.</li>
<li><b>Relais DHCP</b> : le serveur est dans une autre zone ; vérifier sur OPNsense que le <b>DHCP Relay</b> est activé sur l'interface CLT et pointe vers l'IP de SRV-AD01.</li>
<li><b>Règles</b> : autoriser UDP 67/68 entre le pare-feu et SRV-AD01 ; regarder le Live View du pare-feu.</li>
<li><b>Serveur DHCP</b> : service démarré, <b>serveur autorisé dans l'AD</b>, étendue CLT créée et <b>activée</b>, options (routeur = 192.168.20.254, DNS = 192.168.10.10), étendue non épuisée.</li>
<li><b>Poste</b> : carte réseau sur le bon pont/VLAN, puis <code>ipconfig /release</code> et <code>ipconfig /renew</code>.</li></ol>`}
]
});
