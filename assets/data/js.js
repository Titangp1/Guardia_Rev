/* Guardia_Rev · JavaScript & API (cours « JS et API », Y. Baghdadi) : API, requests, JavaScript, DOM, fetch, Flask. */
window.GR=window.GR||{subjects:[]};
GR.subjects.push({
id:'js', name:'JavaScript & API', icon:'JS', color:'linear-gradient(140deg,#eab308,#a16207)',
exam:'UE DevSecOps · Cours « JavaScript et API »',
short:'API (définition, types, documentation), requests et venv, bases de JavaScript, DOM, fetch et async/await, Flask, exercices CatFacts, PokéAPI, TMDB, Banque, JWT.',
intro:'Le cours « JavaScript et API » : ce qu\'est une API et comment la lire, la consommer depuis Python (requests) et depuis le navigateur (JavaScript, fetch), manipuler la page (DOM), puis exposer ses propres routes avec Flask. Exemples fil rouge : Pokémon.',
fiche:[
{t:'Qu\'est-ce qu\'une API ?',h:`
<p>Une <b>API</b> (<i>Application Programming Interface</i>) est une <b>interface entre deux applications</b> : un contrat qui dit quelles demandes on peut faire et sous quelle forme arrive la réponse.</p>
<div class="tip">Vous en utilisez déjà une : le module <code>random</code> de Python est une « petite API locale ». On demande un nombre avec <code>randint</code> ou <code>choice</code>, Python répond. Une <b>API web</b> fait la même chose, mais le service est <b>hébergé ailleurs</b> et renvoie des données réelles (météo, scores, cartes…).</div>
<h3>Le trajet d'une requête</h3>
<div class="flow"><span>Appli web<br><small>navigateur</small></span><i>→</i><span>Internet</span><i>→</i><span>API</span><i>→</i><span>Serveur web</span><i>→</i><span>Base de données</span></div>
<p>La <b>requête</b> part de l'application, traverse Internet jusqu'à l'API ; l'API interroge le serveur et la base, puis renvoie une <b>réponse</b> (souvent du JSON).</p>
<h3>L'analogie du restaurant</h3>
<div class="tbl"><table><tr><th>Restaurant</th><th>Informatique</th></tr>
<tr><td>Le client passe commande</td><td>L'utilisateur (navigateur, appli) envoie une requête</td></tr>
<tr><td><b>Le serveur</b> prend la commande et rapporte le plat</td><td><b>L'API</b> transmet la demande et rapporte la réponse</td></tr>
<tr><td>Le chef cuisine en cuisine</td><td>Le back-end (serveur, base de données) fait le travail</td></tr></table></div>
<p>Le client n'entre jamais en cuisine : il n'a besoin de connaître que le <b>menu</b> (la documentation de l'API).</p>
<h3>Exemple concret : l'appli météo</h3>
<ol><li>Je consulte mon appli météo : elle <b>ne mesure pas</b> la température dehors.</li>
<li>Elle envoie une <b>requête</b> à l'API d'un serveur météo.</li>
<li>Le serveur météo répond à l'API avec le temps qu'il fait.</li>
<li>L'API répond à notre application, qui affiche le résultat.</li></ol>
<p>Exemples d'API connues : <b>Google Maps</b> (applis de livraison), <b>API météo</b> (Open-Meteo, Météo-France), <b>YouTube</b>, <b>GitHub</b>… et on peut aussi <b>coder sa propre API</b>.</p>
<h3>Une bonne API est une API bien documentée</h3>
<p>La documentation liste pour chaque <b>endpoint</b> (adresse, ex. <code>/v1/meteofrance</code>) ses <b>paramètres</b> :</p>
<div class="tbl"><table><tr><th>Paramètre</th><th>Format</th><th>Obligatoire</th><th>Défaut</th><th>Rôle</th></tr>
<tr><td><code>latitude</code>, <code>longitude</code></td><td>décimal</td><td>oui</td><td>–</td><td>coordonnées du lieu</td></tr>
<tr><td><code>hourly</code></td><td>liste de textes</td><td>non</td><td>–</td><td>variables heure par heure</td></tr>
<tr><td><code>temperature_unit</code></td><td>texte</td><td>non</td><td><code>celsius</code></td><td><code>fahrenheit</code> possible</td></tr>
<tr><td><code>timezone</code></td><td>texte</td><td>non</td><td><code>GMT</code></td><td><code>auto</code> = fuseau du lieu</td></tr></table></div>
<div class="key">Avant de coder, on <b>lit la doc</b> : URL de l'endpoint, méthode HTTP, paramètres obligatoires, valeurs par défaut, format de la réponse, besoin d'une clé.</div>`},
{t:'Les différents types d\'API',h:`
<div class="tbl"><table><tr><th>Type</th><th>Description</th><th>Exemple</th></tr>
<tr><td><b>Ouverte / publique</b></td><td>Accessible à tous, partage de données ou de services</td><td>API météo, Google Maps</td></tr>
<tr><td><b>Interne / privée</b></td><td>Réservée à l'usage interne d'une entreprise</td><td>API interne d'une appli</td></tr>
<tr><td><b>Partenaire</b></td><td>Accessible seulement à certains partenaires</td><td>API PayPal pour l'e-commerce</td></tr>
<tr><td><b>REST</b></td><td>Basée sur HTTP, des <b>ressources</b> (URL), <b>sans état</b> (stateless)</td><td>API GitHub, Twitter</td></tr>
<tr><td><b>Bibliothèque</b></td><td>Interface pour utiliser les fonctions d'une bibliothèque</td><td>jQuery, NumPy, <code>random</code></td></tr>
<tr><td><b>WebSocket</b></td><td>Communication <b>bidirectionnelle en temps réel</b></td><td>Chat en ligne, jeux</td></tr>
<tr><td><b>GraphQL</b></td><td>Le client demande <b>exactement</b> les champs voulus</td><td>Shopify GraphQL</td></tr>
<tr><td><b>Streaming</b></td><td>Envoie des données en continu</td><td>Twitter Streaming API</td></tr>
<tr><td><b>Événementielle</b></td><td>Déclenchée par un événement (le serveur vous appelle)</td><td>Webhooks</td></tr>
<tr><td><b>Bas niveau</b></td><td>Accès direct au système ou au matériel</td><td>API Windows, appels système Linux</td></tr></table></div>
<p><b>Stateless</b> (REST) : chaque requête contient tout ce qu'il faut pour être traitée ; le serveur ne garde pas de « conversation » entre deux requêtes. D'où le <b>jeton</b> (token) envoyé à chaque appel pour s'authentifier.</p>
<div class="tip">Un <b>webhook</b> inverse le sens habituel : ce n'est pas vous qui interrogez l'API, c'est le service qui appelle <i>votre</i> URL quand un événement se produit (paiement reçu, push sur GitHub…).</div>`},
{t:'Consommer une API en Python (requests, pip, venv)',h:`
<p>Les bibliothèques Python sont publiées sur <b>PyPI</b> (<code>pypi.org</code>) et s'installent avec <b>pip</b>, le gestionnaire de paquets de Python (comme <code>apt</code> ou <code>pacman</code> sous Linux). Pour appeler une API : la bibliothèque <b>requests</b>.</p>
<h3>Travailler proprement : l'environnement virtuel</h3>
<pre><code>python3 -m venv venv               # créer l'environnement (dossier venv/)
venv\\Scripts\\activate              # l'activer sous Windows
source venv/bin/activate           # l'activer sous Linux / macOS
pip install -r requirements.txt    # installer les dépendances du projet
pip freeze &gt; requirements.txt      # figer les versions installées</code></pre>
<p><code>requirements.txt</code> liste une dépendance par ligne : <code>requests</code>, <code>flask</code>, <code>black</code>, <code>pytest</code>, <code>ruff</code>… Le dossier <code>venv/</code> va dans le <code>.gitignore</code>.</p>
<h3>Premier appel : CatFacts</h3>
<pre><code>import requests

reponse = requests.get("https://catfact.ninja/fact", timeout=5)
print(reponse.status_code)        # 200 si tout va bien
donnees = reponse.json()          # JSON → dictionnaire Python
print(donnees["fact"])            # le fait sur les chats</code></pre>
<h3>Paramètres, erreurs et clé d'API</h3>
<pre><code>import os, requests

def chercher_films(texte, page=1):
    try:
        r = requests.get(
            "https://api.themoviedb.org/3/search/movie",
            params={"query": texte, "page": page},           # → ?query=...&amp;page=1
            headers={"Authorization": f"Bearer {os.getenv('TMDB_API_KEY')}"},
            timeout=5,
        )
        r.raise_for_status()          # lève une erreur si 4xx / 5xx
        return r.json()["results"]
    except requests.RequestException as e:
        print("API indisponible :", e)
        return []</code></pre>
<ul><li><code>params=</code> construit la chaîne de requête ; <code>json=</code> envoie un corps JSON (POST/PUT).</li>
<li><code>timeout</code> : sans lui, le programme peut attendre indéfiniment.</li>
<li><code>raise_for_status()</code> transforme une réponse 404 ou 500 en exception.</li>
<li>La clé vient de <code>os.getenv(...)</code> (fichier <code>.env</code> non versionné, secret GitHub en CI) : <b>jamais en dur dans le code</b>.</li></ul>`},
{t:'JavaScript : où et comment ?',h:`
<p><b>JavaScript</b> est le langage du <b>navigateur</b> : il rend la page interactive (clics, affichage dynamique, appels d'API). Il s'exécute <b>côté client</b>, sur la machine de l'utilisateur. On voit ses messages dans la <b>console</b> des outils de développement (<kbd>F12</kbd>).</p>
<h3>Inclure un script dans la page</h3>
<pre><code>&lt;!-- Dans index.html --&gt;
&lt;head&gt;
  &lt;script src="/static/js/app.js" defer&gt;&lt;/script&gt;
&lt;/head&gt;</code></pre>
<div class="key">Sans <code>defer</code>, le script peut s'exécuter <b>avant</b> que les éléments HTML de la page soient chargés : <code>document.querySelector("#bouton")</code> renvoie alors <code>null</code>. <code>defer</code> attend la fin de l'analyse du HTML.</div>
<h3>Python vs JavaScript</h3>
<div class="tbl"><table><tr><th>Python</th><th>JavaScript</th></tr>
<tr><td><code>nom = "Pikachu"</code></td><td><code>const nom = "Pikachu";</code></td></tr>
<tr><td><code>niveau = 12</code></td><td><code>let niveau = 12;</code></td></tr>
<tr><td><code>print(nom)</code></td><td><code>console.log(nom);</code></td></tr>
<tr><td><code>if niveau &gt; 10:</code> + indentation</td><td><code>if (niveau &gt; 10) { … }</code></td></tr>
<tr><td><code>True</code> / <code>False</code> / <code>None</code></td><td><code>true</code> / <code>false</code> / <code>null</code></td></tr>
<tr><td><code>and</code> / <code>or</code> / <code>not</code></td><td><code>&amp;&amp;</code> / <code>||</code> / <code>!</code></td></tr>
<tr><td><code>def f(x):</code></td><td><code>function f(x) { }</code> ou <code>(x) =&gt; { }</code></td></tr>
<tr><td>liste <code>[1, 2]</code>, dictionnaire <code>{"a": 1}</code></td><td>tableau <code>[1, 2]</code>, objet <code>{ a: 1 }</code></td></tr>
<tr><td><code>len(liste)</code></td><td><code>tableau.length</code></td></tr>
<tr><td><code>liste.append(x)</code></td><td><code>tableau.push(x)</code></td></tr></table></div>
<p>En JavaScript, ce sont les <b>accolades</b> qui délimitent les blocs (l'indentation n'est que de la lisibilité) et les conditions sont entre <b>parenthèses</b>.</p>`},
{t:'Variables, types et affichage',h:`
<pre><code>const nomDresseur = "Yamine";   // const : ne sera pas réassignée
let niveau = 30;                // let : pourra changer (niveau = 31)
niveau++;                       // niveau vaut 31</code></pre>
<ul><li><code>const</code> par défaut ; <code>let</code> si la valeur doit changer. L'ancien <code>var</code> est à éviter (portée confuse).</li>
<li>Attention aux noms globaux du navigateur : <code>name</code> existe déjà (<code>window.name</code>), préférez <code>nomDresseur</code>.</li></ul>
<h3>Types de base</h3>
<pre><code>const nom = "Pikachu";       // string (texte)
let niveau = 12;             // number (entiers ET décimaux)
let estKO = false;           // boolean
let pokemonChoisi = null;    // null : absence VOLONTAIRE de valeur
let x;                       // undefined : jamais affectée
typeof niveau                // "number"</code></pre>
<h3>Afficher</h3>
<pre><code>console.log(\`Le dresseur est \${nomDresseur}, niveau \${niveau}\`);   // gabarit (backticks)
console.log("Le dresseur est " + nomDresseur + ", niveau " + niveau); // concaténation
console.log("Le dresseur est", nomDresseur, ", niveau", niveau);      // plusieurs arguments
alert("UN POKEMON SAUVAGE APPARAIT !!");                            // fenêtre bloquante</code></pre>
<p>Le <b>gabarit</b> (<i>template literal</i>) s'écrit entre <b>backticks</b> <code>\`…\`</code> et insère des valeurs avec <code>\${…}</code> : c'est l'équivalent de la f-string Python <code>f"{nom}"</code>.</p>`},
{t:'Conditions, === et point-virgule',h:`
<h3>== ou === ?</h3>
<pre><code>console.log(5 == "5");    // true  : "5" est converti en nombre avant la comparaison
console.log(5 === "5");   // false : nombre et texte sont de types différents</code></pre>
<div class="key">Utilisez toujours <code>===</code> (égalité <b>stricte</b> : même valeur <b>et</b> même type) et <code>!==</code>. Le <code>==</code> convertit les types et donne des surprises (<code>0 == ""</code> est vrai).</div>
<pre><code>if (pokemonChoisi === null) {
  console.log("Choisis un Pokémon avant de continuer.");
} else if (nom === "Pikachu") {
  console.log("Pikachu, je te choisis !");
} else {
  console.log("Erreur");
}</code></pre>
<h3>; or not ; ? Telle est la question</h3>
<p>JavaScript ajoute souvent les points-virgules tout seul… mais pas toujours.</p>
<pre><code>// Sans point-virgule :
const message = "Bonjour"
[1, 2, 3].forEach((nombre) =&gt; console.log(nombre))
// → Uncaught TypeError: "Bonjour"[(1, 2, 3)].forEach is not a function</code></pre>
<p>Sans <code>;</code>, la ligne qui commence par <code>[</code> est collée à la précédente : JavaScript lit <code>"Bonjour"[1, 2, 3]</code>. Avec <code>const message = "Bonjour";</code> le code affiche bien 1, 2, 3.</p>
<div class="trap">Mettez un <code>;</code> à la fin de chaque instruction : c'est la convention du cours et cela évite ce piège.</div>`},
{t:'Boucles et fonctions',h:`
<h3>while</h3>
<pre><code>while (niveau &lt; 10) {
  niveau++;
}
while (!estKO) {
  // instructions du combat
  break;            // sort de la boucle
}</code></pre>
<h3>for : trois écritures</h3>
<pre><code>const listAttack = ["Éclair", "Vive-Attaque", "Fatal-Foudre"];

for (let index = 0; index &lt; listAttack.length; index++) {   // classique, avec index
  const attaqueChoisie = listAttack[index];
  console.log("Attaque :", attaqueChoisie);
}

for (const attaqueOf of listAttack) {                          // for...of : chaque élément
  console.log("Attaque (of) :", attaqueOf);
}

listAttack.forEach((attaqueFleche) =&gt; {                        // forEach + fonction fléchée
  console.log("Attaque (fleche) :", attaqueFleche);
});</code></pre>
<div class="tip">Lire <code>=&gt;</code> comme « <b>reçoit</b> … <b>et fait</b> … ». Ici : la fonction <b>reçoit</b> <code>attaqueFleche</code> <b>et fait</b> <code>console.log(...)</code>. <code>forEach</code> l'appelle une fois par élément.</div>
<div class="trap"><code>for...of</code> parcourt les <b>valeurs</b> d'un tableau. <code>for...in</code> parcourt les <b>clés</b> (les index "0", "1"…) : ne pas confondre.</div>
<h3>Fonctions</h3>
<pre><code>function afficherPokemon(nom, niveau) {
  console.log(nom + " est au niveau " + niveau);
}
afficherPokemon("Pikachu", 12);

const doubler = (x) =&gt; x * 2;        // fléchée sur une ligne : return implicite
const saluer = (nom) =&gt; {            // avec accolades : return obligatoire
  return \`Salut \${nom} !\`;
};</code></pre>`},
{t:'Objets et tableaux (forEach, map, filter)',h:`
<p>Un <b>objet</b> rassemble les informations d'une même chose (l'équivalent du dictionnaire Python) ; un <b>tableau</b> est une liste ordonnée.</p>
<pre><code>const pokemon = {
  nom: "Pikachu",
  niveau: 12,
  attaques: ["Éclair", "Vive-Attaque"]
};
console.log(pokemon.nom);          // "Pikachu"  (notation point)
console.log(pokemon["niveau"]);    // 12         (notation crochets)
console.log(pokemon.attaques[0]);  // "Éclair"
pokemon.niveau = 13;               // modifier (même si l'objet est const)
pokemon.type = "électrik";         // ajouter une propriété</code></pre>
<p><code>const</code> empêche de <b>réassigner</b> la variable, pas de modifier le contenu de l'objet.</p>
<h3>Un tableau d'objets</h3>
<pre><code>const equipe = [
  { nom: "Pikachu",    niveau: 12, type: "electrik" },
  { nom: "Bulbizarre", niveau: 8,  type: "plante" },
  { nom: "Salamèche",  niveau: 15, type: "feu" },
];

equipe.forEach((p) =&gt; console.log(p.nom));               // agir sur chacun (ne renvoie rien)
const noms = equipe.map((p) =&gt; p.nom);                  // ["Pikachu", "Bulbizarre", "Salamèche"]
const forts = equipe.filter((p) =&gt; p.niveau &gt;= 10);     // Pikachu et Salamèche
const feu = equipe.find((p) =&gt; p.type === "feu");       // le premier qui correspond
</code></pre>
<div class="tbl"><table><tr><th>Méthode</th><th>Renvoie</th><th>Usage</th></tr>
<tr><td><code>forEach</code></td><td>rien (<code>undefined</code>)</td><td>faire une action sur chaque élément</td></tr>
<tr><td><code>map</code></td><td>un <b>nouveau tableau de même taille</b>, transformé</td><td>extraire ou convertir</td></tr>
<tr><td><code>filter</code></td><td>un nouveau tableau avec les éléments qui passent le test</td><td>trier, rechercher</td></tr>
<tr><td><code>find</code></td><td>le premier élément trouvé (ou <code>undefined</code>)</td><td>chercher un seul élément</td></tr></table></div>
<h3>Objet JavaScript ↔ JSON</h3>
<pre><code>const texte = JSON.stringify(pokemon);   // objet → texte JSON (pour l'envoyer)
const objet = JSON.parse(texte);         // texte JSON → objet</code></pre>`},
{t:'Le DOM : manipuler la page',h:`
<p>Le <b>DOM</b> (<i>Document Object Model</i>) est la représentation de la page HTML sous forme d'arbre d'objets que JavaScript peut lire et modifier.</p>
<pre><code>&lt;p id="info"&gt;Tiens, un paragraphe tout seul !&lt;/p&gt;
&lt;button id="bouton"&gt;Voir mon Pokémon&lt;/button&gt;
&lt;button id="reset"&gt;Reset le paragraphe&lt;/button&gt;</code></pre>
<pre><code>const monInfo = document.querySelector("#info");     // # = id, . = classe, sinon balise
const monBouton = document.querySelector("#bouton");
const monReset = document.querySelector("#reset");

monBouton.addEventListener("click", () =&gt; {
  console.log("Clic !");
  monInfo.textContent = "Pikachu de niveau 12 !";
});

// Équivalent avec une fonction nommée (on passe la fonction, SANS parenthèses) :
function afficherInfo() {
  monInfo.textContent = "Pikachu de niveau 12 !";
}
monBouton.addEventListener("click", afficherInfo);</code></pre>
<ul><li><code>querySelector</code> renvoie le <b>premier</b> élément trouvé (ou <code>null</code>) ; <code>querySelectorAll</code> les renvoie tous.</li>
<li>Événements utiles : <code>click</code>, <code>mouseover</code> / <code>mouseout</code> (survol), <code>input</code>, <code>submit</code>, <code>keydown</code>.</li>
<li>Créer un élément : <code>document.createElement("img")</code>, puis <code>img.src = url</code> et <code>parent.appendChild(img)</code>.</li></ul>
<div class="trap"><b>Sécurité</b> : <code>textContent</code> affiche du texte brut. <code>innerHTML</code> interprète le HTML : y mettre une donnée venant d'un utilisateur ou d'une API, c'est ouvrir la porte au <b>XSS</b> (injection de script). Préférez <code>textContent</code>.</div>
<div class="tip">Erreur classique : <code>addEventListener("click", afficherInfo())</code> avec parenthèses <b>appelle</b> la fonction tout de suite et passe son résultat (<code>undefined</code>). Il faut passer la fonction elle-même.</div>`},
{t:'Asynchrone : fetch, promesses, async / await',h:`
<p>Un appel réseau prend du temps. JavaScript ne bloque pas la page en attendant : l'appel est <b>asynchrone</b>. <code>fetch()</code> renvoie une <b>promesse</b> (« je te donnerai la réponse plus tard »).</p>
<pre><code>async function chargerDonnees() {
  const reponse = await fetch("https://pokeapi.co/api/v2/pokemon/mewtwo");
  const pokemon = await reponse.json();

  console.log(pokemon.name);                // "mewtwo"
  console.log(pokemon.types[0].type.name);  // "psychic"
}
chargerDonnees();</code></pre>
<ul><li><code>async</code> devant la fonction autorise <code>await</code> à l'intérieur.</li>
<li><code>await</code> attend que la promesse soit <b>résolue</b> sans figer la page.</li>
<li><b>Deux</b> attentes : <code>fetch</code> (les en-têtes de la réponse) puis <code>.json()</code> (lire et convertir le corps).</li></ul>
<h3>Version robuste</h3>
<pre><code>async function afficherSprite(nom) {
  try {
    const rep = await fetch(\`https://pokeapi.co/api/v2/pokemon/\${nom.toLowerCase()}\`);
    if (!rep.ok) throw new Error("Pokémon introuvable (" + rep.status + ")");
    const p = await rep.json();
    document.querySelector("#sprite").src = p.sprites.front_default;
    document.querySelector("#nom").textContent = p.name;
  } catch (e) {
    document.querySelector("#nom").textContent = e.message;
  }
}
document.querySelector("#go").addEventListener("click", () =&gt; afficherSprite("pikachu"));</code></pre>
<div class="key"><code>fetch</code> ne lève <b>pas</b> d'erreur sur un 404 ou un 500 : seule une panne réseau la fait échouer. Il faut tester <code>reponse.ok</code> (vrai pour 200 à 299) ou <code>reponse.status</code>.</div>
<p>Écriture équivalente avec <code>.then()</code> : <code>fetch(url).then(r =&gt; r.json()).then(p =&gt; console.log(p.name)).catch(console.error);</code></p>
<p><b>CORS</b> : par sécurité, le navigateur bloque la lecture d'une réponse venant d'un autre domaine si ce serveur ne l'autorise pas (en-tête <code>Access-Control-Allow-Origin</code>). Solution courante : passer par son propre back-end.</p>`},
{t:'Front-end, back-end Python et API externe',h:`
<p>L'architecture des exercices (portfolio « Pokéweb ») tient en trois couches qui se parlent en <b>HTTP / JSON</b> :</p>
<div class="flow col"><span><b>Front-end</b> · HTML / CSS / JavaScript<br><small>affichage des cartes, recherche, interactions</small></span><i>↕ HTTP / JSON</i><span><b>Back-end</b> · Python (Flask)<br><small>API maison, gestion de la collection, traitement des données</small></span><i>↕ HTTP / JSON</i><span><b>API externe</b> · PokéAPI<br><small>données, sprites, statistiques</small></span></div>
<h3>Exposer des routes avec Flask</h3>
<pre><code>from flask import Flask, jsonify, render_template
import requests

app = Flask(__name__)

@app.get("/")
def accueil():
    return render_template("index.html")      # la page (templates/index.html)

@app.get("/api/catfact")
def catfact():
    r = requests.get("https://catfact.ninja/fact", timeout=5)
    return jsonify({"fact": r.json()["fact"]})

@app.get("/api/pokemon/&lt;nom&gt;")
def pokemon(nom):
    r = requests.get(f"https://pokeapi.co/api/v2/pokemon/{nom}", timeout=5)
    if r.status_code == 404:
        return jsonify({"erreur": "inconnu"}), 404
    p = r.json()
    return jsonify({
        "nom": p["name"],
        "sprite": p["sprites"]["front_default"],
        "stats": {s["stat"]["name"]: s["base_stat"] for s in p["stats"]},
    })

if __name__ == "__main__":
    app.run(debug=True)       # jamais debug=True en production</code></pre>
<p>Côté navigateur : <code>const data = await (await fetch("/api/catfact")).json();</code> puis on affiche <code>data.fact</code> sous le bouton.</p>
<div class="key">Pourquoi passer par son back-end ? Il <b>cache la clé d'API</b> (elle reste sur le serveur, jamais dans le JavaScript que tout le monde peut lire), il <b>filtre</b> les données renvoyées, il évite les soucis de <b>CORS</b> et peut <b>mettre en cache</b>.</div>
<p>Organisation conseillée : <code>app.py</code> (routes), <code>services/tmdb.py</code> (client de l'API, lit <code>os.getenv("TMDB_API_KEY")</code>), <code>templates/</code>, <code>static/js/app.js</code>, <code>tests/</code>, <code>README.md</code>.</p>`},
{t:'Les exercices du cours, de CatFacts au JWT',h:`
<div class="tbl"><table><tr><th>Exercice</th><th>À faire</th><th>Notions</th></tr>
<tr><td>JS 1 · Découvrir JS</td><td>Fonction qui affiche le nom du Pokémon préféré dans la console (F12)</td><td>console.log, let/const, types, if/else, fonctions</td></tr>
<tr><td>JS 2 · Tableaux et objets</td><td>Stocker 5 Pokémon dans un tableau d'objets et les afficher</td><td>objets, tableaux, forEach, map, filter</td></tr>
<tr><td>JS 3 · Le DOM</td><td>Bouton « Afficher mon Pokémon préféré » ; image au survol</td><td>querySelector, textContent, click, mouseover</td></tr>
<tr><td>JS 4 · fetch</td><td>Récupérer son Pokémon sur PokéAPI et afficher son sprite au clic</td><td>HTTP, JSON, fetch, promesses, async/await</td></tr>
<tr><td>API 1 · CatFacts</td><td>Bouton « Cat Facts » qui appelle <code>catfact.ninja/fact</code> et affiche la réponse dessous</td><td>requests, affichage</td></tr>
<tr><td>API 2 · PokéAPI</td><td>Bouton, choix du Pokémon, statistiques et sprite sur le portfolio</td><td>JSON imbriqué</td></tr>
<tr><td>API 3 · Organisation</td><td>2 à 3 routes Flask max : une pour CatFacts, une pour PokéAPI</td><td>routes, back-end</td></tr>
<tr><td>API 4 · README</td><td>Documenter le projet dans <code>README.md</code></td><td>documentation</td></tr>
<tr><td>API 5 · PokéTCG</td><td>Cartes filtrées par type, rareté, HP minimum ; image, nom, HP, type ; recherche ; bonus pagination de 20</td><td>paramètres, pagination, filtres</td></tr>
<tr><td>API 6 · TMDB (avec clé)</td><td><code>GET /movies/search?q=…&amp;page=…</code>, <code>GET /movies/&lt;id&gt;</code>, <code>POST /favorites</code> (JSON local), <code>GET /favorites</code></td><td>clé via os.getenv, .env, secret GitHub, retries, pytest, lint</td></tr>
<tr><td>API 7 · Banque</td><td>Comptes (créer, afficher, supprimer), dépôts, retraits, transferts, historique, JSON comme base</td><td>validation : solde jamais négatif, montant &gt; 0</td></tr>
<tr><td>API 8 · Todolist sécurisée</td><td>Création de compte, connexion, JWT, routes protégées, CRUD du profil</td><td>authentification, tests, linting</td></tr></table></div>
<h3>Le JWT en bref</h3>
<p>Un <b>JWT</b> (<i>JSON Web Token</i>) est un jeton <code>en-tête.contenu.signature</code> (trois parties en Base64URL). Après la connexion, le serveur le <b>signe</b> avec une clé secrète et le renvoie ; le client l'envoie ensuite à chaque requête :</p>
<pre><code>Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI0MiJ9.signature</code></pre>
<ul><li>Le serveur <b>vérifie la signature</b> et la date d'expiration (<code>exp</code>) avant de servir une route protégée : sinon <b>401</b>.</li>
<li>Le contenu est seulement <b>encodé, pas chiffré</b> : n'y mettez jamais de mot de passe.</li>
<li>Les mots de passe sont stockés <b>hachés</b> (bcrypt, argon2), jamais en clair ; la clé de signature est un <b>secret</b> (variable d'environnement).</li></ul>`}
],
cards:[
['Que signifie API ?','<i>Application Programming Interface</i> : une interface (un contrat) entre deux applications.'],
['Pourquoi dit-on que <code>random</code> est une « petite API locale » ?','On lui demande un service (randint, choice) sans savoir comment il est codé, et il répond. Une API web fait pareil, mais le service est hébergé ailleurs.'],
['Dans l\'analogie du restaurant, qui joue le rôle de l\'API ?','Le <b>serveur</b> : il prend la commande du client et rapporte le plat préparé en cuisine (le back-end).'],
['Que doit indiquer une bonne documentation d\'API ?','Endpoints, méthode HTTP, paramètres (format, obligatoire, valeur par défaut), format de réponse, authentification (clé).'],
['API REST : que veut dire « stateless » ?','Chaque requête contient tout ce qu\'il faut : le serveur ne garde pas d\'état de session entre deux requêtes.'],
['Qu\'est-ce qu\'un webhook ?','Une API événementielle : le service appelle <b>votre</b> URL quand un événement se produit.'],
['API WebSocket : pour quoi faire ?','Communication bidirectionnelle en temps réel (chat, jeux en ligne).'],
['À quoi sert <code>pip</code> ?','Le gestionnaire de paquets Python : il installe les bibliothèques publiées sur PyPI.'],
['Créer et activer un venv sous Windows ?','<code>python -m venv venv</code> puis <code>venv\\Scripts\\activate</code>.'],
['Installer les dépendances d\'un projet Python ?','<code>pip install -r requirements.txt</code>'],
['Appeler une API en Python ?','<code>r = requests.get(url, timeout=5)</code> puis <code>r.status_code</code> et <code>r.json()</code>.'],
['Rôle de <code>raise_for_status()</code> ?','Lever une exception si la réponse est une erreur HTTP (4xx ou 5xx).'],
['Pourquoi <code>defer</code> sur la balise script ?','Le script s\'exécute après le chargement du HTML : les éléments existent quand on les sélectionne.'],
['<code>const</code> ou <code>let</code> ?','<code>const</code> si la variable ne sera pas réassignée, <code>let</code> si elle change. Éviter <code>var</code>.'],
['<code>null</code> vs <code>undefined</code> ?','<code>null</code> : absence volontaire de valeur. <code>undefined</code> : variable jamais affectée.'],
['Écrire « Pikachu niveau 12 » avec un gabarit ?','<code>`${nom} niveau ${niveau}`</code> entre backticks.'],
['<code>5 == "5"</code> et <code>5 === "5"</code> ?','<code>true</code> (conversion de type) et <code>false</code> (types différents). Toujours utiliser <code>===</code>.'],
['Équivalents JS de <code>and</code>, <code>or</code>, <code>not</code> ?','<code>&amp;&amp;</code>, <code>||</code>, <code>!</code>'],
['Comment lire <code>(x) =&gt; { ... }</code> ?','« reçoit x et fait … » : une fonction fléchée.'],
['<code>for...of</code> vs <code>for...in</code> ?','<code>of</code> : les valeurs du tableau. <code>in</code> : les clés (index).'],
['Longueur d\'un tableau / ajouter un élément en JS ?','<code>tab.length</code> et <code>tab.push(x)</code>.'],
['Que renvoie <code>map</code> ?','Un nouveau tableau de même taille, chaque élément transformé.'],
['Que renvoie <code>filter</code> ?','Un nouveau tableau avec seulement les éléments qui passent le test.'],
['Que renvoie <code>forEach</code> ?','Rien (<code>undefined</code>) : il sert à agir sur chaque élément.'],
['Objet ↔ texte JSON en JS ?','<code>JSON.stringify(obj)</code> et <code>JSON.parse(texte)</code>.'],
['Qu\'est-ce que le DOM ?','<i>Document Object Model</i> : la page HTML sous forme d\'arbre d\'objets manipulable en JavaScript.'],
['Sélectionner l\'élément d\'id <code>info</code> ?','<code>document.querySelector("#info")</code>'],
['Réagir au clic sur un bouton ?','<code>bouton.addEventListener("click", () =&gt; { ... })</code>'],
['Pourquoi préférer <code>textContent</code> à <code>innerHTML</code> ?','<code>innerHTML</code> interprète le HTML : une donnée non fiable peut injecter un script (XSS).'],
['Que renvoie <code>fetch()</code> ?','Une promesse de réponse (Response). Il faut ensuite <code>await reponse.json()</code>.'],
['<code>fetch</code> échoue-t-il sur un 404 ?','Non : il faut tester <code>reponse.ok</code> ou <code>reponse.status</code>.'],
['À quoi servent <code>async</code> / <code>await</code> ?','Écrire du code asynchrone qui se lit de haut en bas : <code>await</code> attend une promesse sans bloquer la page.'],
['Pourquoi passer par son back-end pour appeler TMDB ?','Pour garder la clé d\'API secrète côté serveur (et filtrer, éviter CORS, mettre en cache).'],
['Qu\'est-ce que CORS ?','Règle du navigateur qui bloque la lecture d\'une réponse d\'un autre domaine si ce serveur ne l\'autorise pas.'],
['Structure d\'un JWT ?','<code>en-tête.contenu.signature</code>, encodés en Base64URL ; signé, pas chiffré.'],
['Comment envoie-t-on un JWT ?','En-tête <code>Authorization: Bearer &lt;jeton&gt;</code> à chaque requête.'],
['Règles métier de l\'API Banque ?','Solde jamais négatif, montant strictement positif, historique des opérations, données en JSON.']
],
quiz:[
{q:'Qu\'est-ce qu\'une API ?',o:['Un langage de programmation','Une interface qui permet à deux applications de communiquer','Une base de données','Un serveur web'],a:[1],e:'Application Programming Interface : un contrat d\'échange entre deux logiciels.'},
{q:'Dans l\'analogie du restaurant, le chef en cuisine représente…',o:['Le client','L\'API','Le back-end (serveur, base de données)','Le navigateur'],a:[2],e:'Le serveur de salle est l\'API, le chef est le back-end qui fait le travail.'},
{q:'Une appli météo affiche la température. Où est-elle mesurée ?',o:['Par le téléphone','Par un serveur météo, interrogé via une API','Par le navigateur','Par le DNS'],a:[1],e:'L\'appli envoie une requête à l\'API ; le serveur météo répond.'},
{q:'Quelles API sont des API web REST ? (plusieurs réponses)',o:['API GitHub','Le module random','API Twitter','NumPy'],a:[0,2],e:'random et NumPy sont des API de bibliothèque, locales.'},
{q:'Quel type d\'API convient à un chat en temps réel ?',o:['GraphQL','WebSocket','Bibliothèque','Bas niveau'],a:[1],e:'WebSocket : connexion bidirectionnelle maintenue ouverte.'},
{q:'Un webhook est une API…',o:['de bas niveau','événementielle : le service appelle votre URL','privée','de streaming vidéo'],a:[1],e:'C\'est le service qui vous notifie quand un événement se produit.'},
{q:'Dans une doc d\'API, timezone a pour défaut GMT et n\'est pas obligatoire. Que se passe-t-il si on ne l\'envoie pas ?',o:['Erreur 400','Les heures sont en GMT','Les heures sont en heure locale','La requête est ignorée'],a:[1],e:'Un paramètre facultatif prend sa valeur par défaut.'},
{q:'Quelle commande installe toutes les dépendances listées d\'un projet ?',o:['pip install requirements.txt','pip install -r requirements.txt','python requirements.txt','apt install -r requirements.txt'],a:[1],e:'-r lit la liste dans le fichier.'},
{q:'À quoi sert un environnement virtuel (venv) ?',o:['Accélérer Python','Isoler les dépendances d\'un projet','Chiffrer le code','Lancer une machine virtuelle'],a:[1],e:'Chaque projet a ses propres versions de bibliothèques.'},
{q:'Que vaut r.json() après r = requests.get("https://catfact.ninja/fact") ?',o:['Une chaîne de caractères JSON','Un dictionnaire Python','Un objet Response','Le code HTTP'],a:[1],e:'.json() convertit le corps JSON en objets Python (dict, list…).'},
{q:'Pourquoi passer timeout=5 à requests.get ?',o:['Pour limiter la taille de la réponse','Pour ne pas attendre indéfiniment si le serveur ne répond pas','Pour réessayer 5 fois','C\'est obligatoire'],a:[1],e:'Sans timeout, un serveur muet bloque le programme.'},
{q:'Où ranger la clé TMDB d\'un projet Flask ?',o:['Dans app.py','Dans le JavaScript du front','Dans une variable d\'environnement (.env non versionné, secret GitHub en CI)','Dans le README'],a:[2],e:'Lue avec os.getenv("TMDB_API_KEY"), jamais en clair dans le code.'},
{q:'Que fait l\'attribut defer de la balise <script> ?',o:['Il désactive le script','Il exécute le script après l\'analyse du HTML','Il charge le script plus vite','Il exécute le script deux fois'],a:[1],e:'Sans defer, le script peut s\'exécuter avant que les éléments existent.'},
{q:'Où voir le résultat de console.log() ?',o:['Dans la page','Dans la console des outils de développement (F12)','Dans une fenêtre pop-up','Dans le terminal Python'],a:[1],e:'alert() ouvre une fenêtre ; console.log écrit dans la console.'},
{q:'Que affiche ce code ?',code:'console.log(5 == "5");\nconsole.log(5 === "5");',o:['true true','false false','true false','false true'],a:[2],e:'== convertit "5" en nombre ; === compare aussi le type.'},
{q:'Quelle déclaration provoque une erreur ?',code:'const nom = "Pikachu";\nlet niveau = 12;\nniveau = 13;\nnom = "Raichu";',o:['let niveau = 12;','niveau = 13;','nom = "Raichu";','Aucune'],a:[2],e:'Une variable const ne peut pas être réassignée (TypeError).'},
{q:'Quelle valeur représente une absence VOLONTAIRE de valeur ?',o:['undefined','null','0','""'],a:[1],e:'undefined = jamais affectée ; null = vide exprès.'},
{q:'Quel est l\'équivalent JavaScript de la f-string Python f"Niveau {n}" ?',o:['"Niveau {n}"','\'Niveau ${n}\'','`Niveau ${n}`','f"Niveau {n}"'],a:[2],e:'Le gabarit s\'écrit entre backticks ; entre guillemets simples, ${n} reste du texte.'},
{q:'Pourquoi ce code plante-t-il ?',code:'const message = "Bonjour"\n[1, 2, 3].forEach((n) => console.log(n))',o:['forEach n\'existe pas','Sans point-virgule, JavaScript lit "Bonjour"[1, 2, 3].forEach','const est interdit','Les flèches sont mal écrites'],a:[1],e:'La ligne commençant par [ est collée à la précédente : mettre un ; après "Bonjour".'},
{q:'Que affiche ce code ?',code:'let niveau = 7;\nwhile (niveau < 10) {\n  niveau++;\n}\nconsole.log(niveau);',o:['7','9','10','11'],a:[2],e:'La boucle s\'arrête quand niveau vaut 10.'},
{q:'Que affiche ce code ?',code:'const t = ["a", "b", "c"];\nfor (const x in t) {\n  console.log(x);\n}',o:['a b c','0 1 2','undefined','Erreur'],a:[1],e:'for...in parcourt les clés (index) ; for...of donnerait a b c.'},
{q:'Que vaut noms ?',code:'const equipe = [{nom: "Pikachu", niveau: 12}, {nom: "Bulbizarre", niveau: 8}];\nconst noms = equipe.map((p) => p.nom);',o:['["Pikachu", "Bulbizarre"]','"Pikachu"','[12, 8]','undefined'],a:[0],e:'map renvoie un nouveau tableau avec la valeur transformée de chaque élément.'},
{q:'Combien d\'éléments dans forts ?',code:'const niveaux = [12, 8, 15, 3];\nconst forts = niveaux.filter((n) => n >= 10);',o:['1','2','3','4'],a:[1],e:'12 et 15 passent le test.'},
{q:'Que renvoie forEach ?',o:['Un nouveau tableau','Le premier élément','undefined','Le nombre d\'éléments'],a:[2],e:'forEach sert à agir ; pour obtenir un tableau, utiliser map ou filter.'},
{q:'Comment accéder à la première attaque ?',code:'const pokemon = { nom: "Pikachu", attaques: ["Éclair", "Vive-Attaque"] };',o:['pokemon.attaques(0)','pokemon.attaques[0]','pokemon[attaques][0]','pokemon->attaques[0]'],a:[1],e:'Notation point pour la propriété, crochets pour l\'index.'},
{q:'Quelle instruction sélectionne <p id="info"> ?',o:['document.querySelector("info")','document.querySelector(".info")','document.querySelector("#info")','document.getElement("info")'],a:[2],e:'# pour un id, . pour une classe.'},
{q:'Quel est le bug ?',code:'function afficherInfo() {\n  info.textContent = "Pikachu !";\n}\nbouton.addEventListener("click", afficherInfo());',o:['Il manque async','afficherInfo() est appelée tout de suite au lieu d\'être passée','textContent n\'existe pas','click doit être en majuscules'],a:[1],e:'Il faut passer la fonction : addEventListener("click", afficherInfo).'},
{q:'Afficher dans la page le nom d\'un Pokémon reçu d\'une API : quel choix est le plus sûr ?',o:['element.innerHTML = nom','element.textContent = nom','document.write(nom)','eval(nom)'],a:[1],e:'textContent n\'interprète pas le HTML : pas d\'injection de script (XSS).'},
{q:'Quel événement déclencher pour afficher une image au survol d\'un bouton ?',o:['click','mouseover','submit','load'],a:[1],e:'mouseover à l\'entrée du pointeur, mouseout à la sortie.'},
{q:'Pourquoi deux await ?',code:'const reponse = await fetch(url);\nconst pokemon = await reponse.json();',o:['C\'est une erreur, un seul suffit','fetch attend la réponse, puis .json() attend la lecture et la conversion du corps','Pour réessayer en cas d\'échec','Pour appeler l\'API deux fois'],a:[1],e:'fetch et .json() renvoient chacun une promesse.'},
{q:'PokéAPI renvoie 404 pour un nom inconnu. Que fait await fetch(url) ?',o:['Il lève une exception','Il renvoie une réponse avec ok === false et status 404','Il renvoie null','Il boucle'],a:[1],e:'fetch n\'échoue que sur une erreur réseau : tester reponse.ok.'},
{q:'Le mot-clé await peut s\'utiliser…',o:['partout','dans une fonction déclarée async (ou au niveau d\'un module)','seulement dans une boucle','seulement avec setTimeout'],a:[1],e:'async function … { await … }'},
{q:'Pourquoi appeler TMDB depuis Flask plutôt que depuis le JavaScript du navigateur ? (plusieurs réponses)',o:['Pour cacher la clé d\'API','Pour éviter les blocages CORS','Parce que JavaScript ne sait pas faire de requêtes','Pour filtrer et mettre en cache les données'],a:[0,1,3],e:'JavaScript sait appeler une API (fetch), mais tout code front est lisible par l\'utilisateur.'},
{q:'Quelle route Flask renvoie le détail d\'un film ?',o:['GET /movies/<id>','POST /movies/<id>','GET /favorites','DELETE /movies'],a:[0],e:'GET pour lire une ressource identifiée par son id ; POST /favorites ajoute un favori.'},
{q:'API Banque : un retrait de 50 € sur un compte à 30 €. Réponse attendue ?',o:['200 et solde -20','400 (ou 422) avec un message : solde insuffisant','201','500'],a:[1],e:'Règle : le solde ne peut pas être négatif ; on valide et on refuse avec une erreur client.'},
{q:'Que contient la troisième partie d\'un JWT ?',o:['Le mot de passe','La signature','La date du jour','L\'adresse IP'],a:[1],e:'en-tête.contenu.signature ; la signature prouve que le jeton n\'a pas été modifié.'},
{q:'Le contenu (payload) d\'un JWT est…',o:['chiffré','seulement encodé en Base64URL, lisible par tous','haché','compressé'],a:[1],e:'Jamais de donnée sensible dedans.'},
{q:'Une requête vers une route protégée arrive sans jeton valide. Code HTTP ?',o:['200','301','401','404'],a:[2],e:'401 Unauthorized : authentification absente ou invalide.'}
],
exos:[
{t:'Découvrir JavaScript',pts:'exercice 1 · cours',q:`<p>Créez une fonction qui affiche le nom de votre Pokémon préféré dans la console (F12). Si aucun Pokémon n'est choisi (<code>null</code>), affichez « Choisis un Pokémon ».</p>`,r:`
<pre><code>let pokemonPrefere = "Pikachu";

function afficherPrefere(nom) {
  if (nom === null) {
    console.log("Choisis un Pokémon");
  } else {
    console.log(\`Mon Pokémon préféré est \${nom} !\`);
  }
}

afficherPrefere(pokemonPrefere);   // Mon Pokémon préféré est Pikachu !
afficherPrefere(null);             // Choisis un Pokémon</code></pre>
<p>Points clés : <code>let</code>/<code>const</code>, comparaison stricte <code>===</code>, gabarit entre backticks, appel de la fonction avec un argument.</p>`},
{t:'Tableau d\'objets : mon équipe',pts:'exercice 2 · cours',q:`<p>Stockez cinq Pokémon (nom, niveau, type) dans un tableau d'objets. Affichez-les tous, puis la liste des noms des Pokémon de niveau 10 ou plus.</p>`,r:`
<pre><code>const equipe = [
  { nom: "Pikachu",    niveau: 12, type: "électrik" },
  { nom: "Bulbizarre", niveau: 8,  type: "plante" },
  { nom: "Salamèche",  niveau: 15, type: "feu" },
  { nom: "Carapuce",   niveau: 5,  type: "eau" },
  { nom: "Évoli",      niveau: 10, type: "normal" },
];

equipe.forEach((p) =&gt; console.log(\`\${p.nom} (niv. \${p.niveau}, \${p.type})\`));

const forts = equipe
  .filter((p) =&gt; p.niveau &gt;= 10)
  .map((p) =&gt; p.nom);
console.log(forts);   // ["Pikachu", "Salamèche", "Évoli"]</code></pre>
<p><code>filter</code> garde les éléments, <code>map</code> les transforme : on peut les <b>enchaîner</b>.</p>`},
{t:'Manipuler la page (DOM)',pts:'exercice 3 · cours',q:`<p>Ajoutez un bouton « Afficher mon Pokémon préféré » qui écrit son nom dans un paragraphe, et une image qui n'apparaît qu'au survol du bouton.</p>`,r:`
<pre><code>&lt;button id="btn"&gt;Afficher mon Pokémon préféré&lt;/button&gt;
&lt;p id="info"&gt;&lt;/p&gt;
&lt;img id="img" src="pikachu.png" alt="Pikachu" hidden&gt;</code></pre>
<pre><code>const btn = document.querySelector("#btn");
const info = document.querySelector("#info");
const img = document.querySelector("#img");

btn.addEventListener("click", () =&gt; {
  info.textContent = "Pikachu, niveau 12 !";
});
btn.addEventListener("mouseover", () =&gt; { img.hidden = false; });
btn.addEventListener("mouseout",  () =&gt; { img.hidden = true; });</code></pre>
<p>Le script est inclus avec <code>defer</code> pour que les éléments existent au moment du <code>querySelector</code>.</p>`},
{t:'PokéAPI : afficher un sprite au clic',pts:'exercice 4 · cours',q:`<p>Au clic sur un bouton, récupérez votre Pokémon sur <code>https://pokeapi.co/api/v2/pokemon/&lt;nom&gt;</code> et affichez son sprite et son premier type. Gérez le cas d'un nom inconnu.</p>`,r:`
<pre><code>async function charger(nom) {
  const zone = document.querySelector("#resultat");
  try {
    const rep = await fetch(\`https://pokeapi.co/api/v2/pokemon/\${nom}\`);
    if (!rep.ok) throw new Error("Pokémon inconnu");
    const p = await rep.json();
    const img = document.createElement("img");
    img.src = p.sprites.front_default;
    img.alt = p.name;
    zone.replaceChildren(img);
    zone.append(" " + p.types[0].type.name);
  } catch (e) {
    zone.textContent = e.message;
  }
}
document.querySelector("#go").addEventListener("click", () =&gt; charger("mewtwo"));</code></pre>
<p>Points clés : <code>async</code>/<code>await</code>, test de <code>rep.ok</code> (fetch ne lève pas d'erreur sur 404), <code>try/catch</code>, création d'élément plutôt qu'<code>innerHTML</code>.</p>`},
{t:'Routes Flask CatFacts et PokéAPI',pts:'exercice API 3',q:`<p>Depuis votre back-end Flask, exposez deux routes : <code>/api/catfact</code> qui renvoie un fait sur les chats, et <code>/api/pokemon/&lt;nom&gt;</code> qui renvoie le nom, le sprite et les statistiques. Écrivez aussi l'appel côté JavaScript pour CatFacts.</p>`,r:`
<pre><code>from flask import Flask, jsonify
import requests

app = Flask(__name__)

@app.get("/api/catfact")
def catfact():
    try:
        r = requests.get("https://catfact.ninja/fact", timeout=5)
        r.raise_for_status()
    except requests.RequestException:
        return jsonify({"erreur": "service indisponible"}), 502
    return jsonify({"fact": r.json()["fact"]})

@app.get("/api/pokemon/&lt;nom&gt;")
def pokemon(nom):
    r = requests.get(f"https://pokeapi.co/api/v2/pokemon/{nom.lower()}", timeout=5)
    if r.status_code == 404:
        return jsonify({"erreur": "Pokémon inconnu"}), 404
    p = r.json()
    return jsonify({"nom": p["name"], "sprite": p["sprites"]["front_default"],
                    "stats": {s["stat"]["name"]: s["base_stat"] for s in p["stats"]}})</code></pre>
<pre><code>document.querySelector("#cat").addEventListener("click", async () =&gt; {
  const data = await (await fetch("/api/catfact")).json();
  document.querySelector("#fact").textContent = data.fact ?? data.erreur;
});</code></pre>
<p>Le front ne parle qu'à <b>notre</b> back-end ; le back-end gère les erreurs de l'API externe (502 si elle est indisponible, 404 si le Pokémon n'existe pas).</p>`},
{t:'API Banque : endpoints et validation',pts:'exercice API 7',q:`<p>Concevez l'API bancaire : listez les endpoints (méthode, URL, rôle) et écrivez la fonction de retrait qui respecte les règles (montant &gt; 0, solde jamais négatif, historique).</p>`,r:`
<div class="tbl"><table><tr><th>Méthode</th><th>URL</th><th>Rôle</th><th>Succès</th></tr>
<tr><td>POST</td><td>/accounts</td><td>créer un compte</td><td>201</td></tr>
<tr><td>GET</td><td>/accounts/&lt;id&gt;</td><td>afficher un compte</td><td>200</td></tr>
<tr><td>DELETE</td><td>/accounts/&lt;id&gt;</td><td>supprimer un compte</td><td>204</td></tr>
<tr><td>POST</td><td>/accounts/&lt;id&gt;/deposit</td><td>déposer</td><td>200</td></tr>
<tr><td>POST</td><td>/accounts/&lt;id&gt;/withdraw</td><td>retirer</td><td>200</td></tr>
<tr><td>POST</td><td>/transfers</td><td>virement entre comptes</td><td>201</td></tr>
<tr><td>GET</td><td>/accounts/&lt;id&gt;/history</td><td>historique</td><td>200</td></tr></table></div>
<pre><code>def retirer(compte, montant):
    if not isinstance(montant, (int, float)) or montant &lt;= 0:
        raise ValueError("Le montant doit être strictement positif")   # → 400
    if compte["solde"] - montant &lt; 0:
        raise ValueError("Solde insuffisant")                          # → 400
    compte["solde"] -= montant
    compte["historique"].append({"type": "retrait", "montant": montant})
    sauvegarder()        # réécrit le fichier JSON
    return compte</code></pre>
<p>Un transfert = retrait sur le compte A <b>puis</b> dépôt sur B : on vérifie tout <b>avant</b> de modifier quoi que ce soit, sinon l'argent peut disparaître à mi-chemin. Tests pytest : montant négatif, solde insuffisant, compte inconnu (404).</p>`}
]
});
