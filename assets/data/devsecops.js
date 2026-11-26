/* Guardia_Rev · Introduction à la programmation & DevSecOps (Python, API REST, Git, Linux, DevSecOps). */
window.GR=window.GR||{subjects:[]};
GR.subjects.push({
id:'devsecops', name:'Programmation & DevSecOps', icon:'PY', color:'linear-gradient(140deg,#2f9e6e,#14614a)',
exam:'UE DevSecOps · Introduction à la programmation',
short:'Python, HTTP et API REST, JSON, Git et GitHub, terminal Linux, Docker, CI/CD, DevOps et DevSecOps.',
intro:'Le module « Introduction à la programmation & DevSecOps » : bases de Python, client/serveur, API REST CRUD, JSON, Git, Linux, et la boucle DevOps/DevSecOps du projet fil rouge (Tamagochi ou Tavernier RPG).',
fiche:[
{t:'Python : les bases',h:`
<h3>Variables et types simples</h3>
<pre><code>nom = "Golem"        # str (texte)
pv = 120             # int (entier)
force = 1.5          # float (décimal)
vivant = True        # bool (True / False)
rien = None          # absence de valeur
print(type(pv))      # &lt;class 'int'&gt;
age = int(input("Âge ? "))   # input() renvoie toujours un str</code></pre>
<p>Opérateurs : <code>+ - * /</code> (division décimale : <code>7/2 = 3.5</code>), <code>//</code> division entière (<code>7//2 = 3</code>), <code>%</code> reste (<code>7%2 = 1</code>), <code>**</code> puissance. Comparaisons : <code>== != &lt; &gt; &lt;= &gt;=</code>. Logique : <code>and or not</code>.</p>
<p>f-string : <code>print(f"{nom} a {pv} PV")</code>.</p>
<h3>Conditions</h3>
<pre><code>if pv &lt;= 0:
    print("mort")
elif pv &lt; 30:
    print("blessé")
else:
    print("en forme")</code></pre>
<p>L'<b>indentation</b> (4 espaces) délimite les blocs : une erreur d'indentation provoque une <code>IndentationError</code>.</p>
<h3>Boucles</h3>
<pre><code>for i in range(3):        # 0, 1, 2  (la borne de fin est exclue)
    print(i)
for objet in inventaire:  # parcourt une liste
    print(objet)
while pv &gt; 0:             # tant que la condition est vraie
    pv -= 10
# break : sortir de la boucle · continue : passer au tour suivant</code></pre>
<h3>Fonctions</h3>
<pre><code>def calcul_degats(attaque, defense=0):
    """Renvoie les dégâts infligés (jamais négatifs)."""
    return max(0, attaque - defense)

print(calcul_degats(30, 12))   # 18</code></pre>
<p>Une fonction sans <code>return</code> renvoie <code>None</code>. Les variables créées dans une fonction sont <b>locales</b>.</p>`},
{t:'Listes et dictionnaires',h:`
<h3>Listes (ordonnées, modifiables)</h3>
<pre><code>inventaire = ["épée", "potion"]
inventaire.append("clé")      # ajoute à la fin
inventaire[0]                 # "épée"  (les index commencent à 0)
inventaire[-1]                # "clé"   (dernier élément)
len(inventaire)               # 3
inventaire.remove("potion")   # retire par valeur
inventaire.pop()              # retire et renvoie le dernier
"épée" in inventaire          # True
inventaire[0:2]               # tranche : index 0 et 1</code></pre>
<h3>Dictionnaires (clé → valeur)</h3>
<pre><code>golem = {"nom": "Golem", "pv": 120, "force": 15}
golem["pv"]             # 120
golem["pv"] = 100       # modifier
golem["niveau"] = 3     # ajouter
golem.get("armure", 0)  # 0 si la clé n'existe pas (pas d'erreur)
for cle, valeur in golem.items():
    print(cle, valeur)
del golem["force"]</code></pre>
<p>Accéder à une clé absente avec <code>d["x"]</code> lève une <code>KeyError</code>. Une liste de dictionnaires est la structure typique des données d'une API (une liste de quêtes, chacune étant un dictionnaire).</p>
<p>Autres types : <b>tuple</b> <code>(1, 2)</code> non modifiable ; <b>set</b> <code>{1, 2}</code> sans doublons.</p>`},
{t:'Lire un programme du cours (random, while, break)',h:`
<p>Les programmes de la séance (Golem, coffre, donjon) mélangent toutes les bases. Savoir les <b>dérouler à la main</b> est la compétence demandée.</p>
<pre><code>import random

code_magique = random.randint(1, 20)   # entier entre 1 et 20, bornes INCLUSES
essais = 0
inventaire = ["Pièce d'Or"]

while essais &lt; 3:
    choix = int(input("Choisis un nombre entre 1 et 20 : "))
    essais += 1
    if choix == code_magique:
        inventaire.append("l'Arme Ultime")
        break                     # sort immédiatement de la boucle
    elif choix &lt; code_magique:
        print("Trop bas")
    else:
        print("Trop haut")

if essais &gt;= 3 and "l'Arme Ultime" not in inventaire:
    inventaire.remove("Pièce d'Or")</code></pre>
<ul><li><code>random.randint(a, b)</code> : entier entre a et b <b>inclus</b>. <code>random.choice(liste)</code> : un élément au hasard. <code>random.choice(range(10, 15))</code> donne 10 à 14 (la fin d'un range est exclue).</li>
<li><code>essais += 1</code> équivaut à <code>essais = essais + 1</code>.</li>
<li><code>break</code> quitte la boucle ; <code>continue</code> passe au tour suivant.</li>
<li><code>while a &gt; 0 and b &gt; 0</code> : la boucle s'arrête dès qu'une des deux conditions devient fausse.</li>
<li><code>int(input(...))</code> plante (<code>ValueError</code>) si l'utilisateur tape « abc » : il faut un <code>try/except</code>.</li></ul>
<pre><code>def exploration_donjon():
    ...
if __name__ == "__main__":   # vrai seulement si on lance ce fichier directement
    exploration_donjon()     # (faux si le fichier est importé comme module)</code></pre>`},
{t:'Erreurs, fichiers et modules',h:`
<h3>Gérer les erreurs</h3>
<pre><code>try:
    tentative = int(input("Code : "))
except ValueError:
    print("Entrez un nombre !")
else:
    print("Merci")       # si aucune erreur
finally:
    print("Toujours exécuté")</code></pre>
<p>Erreurs fréquentes : <code>SyntaxError</code>, <code>IndentationError</code>, <code>NameError</code> (variable inconnue), <code>TypeError</code> (<code>"3" + 2</code>), <code>ValueError</code> (<code>int("abc")</code>), <code>IndexError</code> (index hors de la liste), <code>KeyError</code> (clé absente d'un dict), <code>ZeroDivisionError</code>. On lève soi-même une erreur avec <code>raise ValueError("message")</code>.</p>
<h3>Lire et écrire des fichiers</h3>
<pre><code>with open("quetes.json", "r", encoding="utf-8") as f:   # fermé automatiquement
    quetes = json.load(f)
with open("journal.txt", "a", encoding="utf-8") as f:   # "w" écrase, "a" ajoute
    f.write("Quête terminée\\n")</code></pre>
<h3>Modules et environnement</h3>
<ul><li><code>import random</code>, <code>from datetime import datetime</code>, <code>import os</code> : bibliothèque standard.</li>
<li>Bibliothèques externes avec <b>pip</b> : <code>pip install requests</code>, listées dans <code>requirements.txt</code> (<code>pip freeze &gt; requirements.txt</code>, puis <code>pip install -r requirements.txt</code>).</li>
<li><b>Environnement virtuel</b> : <code>python -m venv venv</code> puis activation (<code>venv\\Scripts\\activate</code> sous Windows, <code>source venv/bin/activate</code> sous Linux) : chaque projet a ses propres versions, sans polluer le système. Le dossier <code>venv/</code> va dans le <code>.gitignore</code>.</li></ul>`},
{t:'Client/serveur, HTTP et API REST',h:`
<p>Le <b>client</b> (navigateur, script Python, <code>curl</code>) envoie une <b>requête</b> ; le <b>serveur</b> la traite et renvoie une <b>réponse</b> avec un <b>code de statut</b>. HTTP est sans état : chaque requête est indépendante.</p>
<h3>Méthodes HTTP et CRUD</h3>
<div class="tbl"><table><tr><th>CRUD</th><th>Méthode</th><th>Exemple (Tavernier RPG)</th></tr>
<tr><td>Create</td><td><b>POST</b></td><td><code>POST /quests</code> publier une quête</td></tr>
<tr><td>Read</td><td><b>GET</b></td><td><code>GET /quests</code>, <code>GET /quests/3</code></td></tr>
<tr><td>Update</td><td><b>PUT</b> (remplace tout) / <b>PATCH</b> (modifie une partie)</td><td><code>PATCH /quests/3</code> statut « terminée »</td></tr>
<tr><td>Delete</td><td><b>DELETE</b></td><td><code>DELETE /quests/3</code></td></tr></table></div>
<p>GET ne doit pas modifier les données. GET, PUT et DELETE sont <b>idempotents</b> (les répéter donne le même résultat) ; POST ne l'est pas (deux POST = deux quêtes).</p>
<h3>Codes de statut</h3>
<ul><li><b>2xx succès</b> : 200 OK, 201 Created (après un POST), 204 No Content (après un DELETE)</li>
<li><b>3xx redirection</b> : 301, 302, 304</li>
<li><b>4xx erreur du client</b> : 400 Bad Request, 401 Unauthorized (non authentifié), 403 Forbidden (authentifié mais interdit), 404 Not Found, 405 Method Not Allowed, 409 Conflict, 422 données invalides</li>
<li><b>5xx erreur du serveur</b> : 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable</li></ul>
<p><b>REST</b> : style d'architecture où chaque <b>ressource</b> a une URL (<code>/quests/3</code>), manipulée avec les méthodes HTTP, sans état, avec des représentations en JSON.</p>`},
{t:'JSON et consommer une API en Python',h:`
<p><b>JSON</b> (JavaScript Object Notation) : format texte d'échange de données. Objets <code>{}</code> avec des clés <b>entre guillemets doubles</b>, tableaux <code>[]</code>, chaînes, nombres, <code>true/false</code>, <code>null</code>.</p>
<pre><code>{"id": 3, "nom": "Le dragon", "recompense": 500, "statut": "disponible", "tags": ["feu"], "aventurier": null}</code></pre>
<p>Correspondance Python : objet ↔ dict, tableau ↔ list, true ↔ True, null ↔ None.</p>
<pre><code>import json, requests

texte = json.dumps({"pv": 10})        # dict → texte JSON
donnees = json.loads('{"pv": 10}')   # texte JSON → dict
with open("data.json") as f:
    quetes = json.load(f)             # fichier → objet Python

r = requests.get("https://api.exemple.fr/quests", timeout=5)
if r.status_code == 200:
    for q in r.json():
        print(q["nom"])
requests.post(url, json={"nom": "Gobelins"})</code></pre>
<p>Un backend simple avec <b>Flask</b> ou <b>FastAPI</b> :</p>
<pre><code>from flask import Flask, jsonify, request
app = Flask(__name__)
quetes = []

@app.get("/quests")
def lister():
    return jsonify(quetes), 200

@app.post("/quests")
def creer():
    q = request.get_json()
    quetes.append(q)
    return jsonify(q), 201</code></pre>`},
{t:'Git et GitHub',h:`
<p><b>Git</b> : logiciel de gestion de versions <b>local</b> (historique, branches). <b>GitHub</b> : plateforme en ligne qui héberge des dépôts Git et ajoute la collaboration (pull requests, issues, Actions).</p>
<pre><code>git init                      # créer un dépôt
git clone URL                 # copier un dépôt distant
git status                    # état des fichiers
git add fichier.py            # préparer (index / staging)
git commit -m "Ajoute la route POST /quests"
git log --oneline             # historique
git branch develop            # créer une branche
git switch develop            # changer de branche (ou git checkout)
git merge develop             # fusionner develop dans la branche courante
git remote add origin URL
git push -u origin main       # envoyer
git pull                      # récupérer et fusionner (= fetch + merge)</code></pre>
<p>Les <b>trois zones</b> : répertoire de travail → <code>add</code> → index (staging) → <code>commit</code> → dépôt local → <code>push</code> → dépôt distant.</p>
<p><b>Workflow du projet</b> : branche <code>main</code> (stable) et <code>develop</code> (intégration) ; on travaille sur develop puis on ouvre une <b>pull request</b> develop → main, relue avant fusion. Commits réguliers, un par fonctionnalité ou correctif, avec un message clair.</p>
<p><code>.gitignore</code> : fichiers à ne jamais versionner (<code>venv/</code>, <code>__pycache__/</code>, <code>.env</code> contenant des secrets).</p>
<div class="trap">Un secret poussé sur GitHub est compromis, même supprimé ensuite : il reste dans l'historique. Il faut le <b>révoquer</b>.</div>`},
{t:'Linux et le terminal',h:`
<pre><code>pwd                 # où suis-je ?
ls -la              # lister (tout, en détail)
cd /var/log         # changer de dossier (cd .. remonte, cd ~ = dossier perso)
mkdir projet        # créer un dossier
touch app.py        # créer un fichier vide
cp a b · mv a b     # copier · déplacer/renommer
rm fichier · rm -r dossier
cat · less · head · tail -f   # lire (tail -f suit un log en direct)
grep "ERROR" app.log          # chercher un motif
nano app.py                   # éditer
sudo apt update &amp;&amp; sudo apt install python3-pip
chmod 755 script.sh · chown user:groupe fichier
ps aux · kill PID · systemctl status squid</code></pre>
<h3>Permissions</h3>
<p><code>-rwxr-xr--</code> : type, puis droits du <b>propriétaire</b> (rwx), du <b>groupe</b> (r-x), des <b>autres</b> (r--). r = 4, w = 2, x = 1 : <code>chmod 754</code> = rwx r-x r--. <code>chmod 600</code> = lecture/écriture pour le propriétaire seulement (fichier de secrets, clé SSH).</p>
<p>Arborescence : <code>/</code> racine, <code>/home</code> utilisateurs, <code>/etc</code> configuration, <code>/var/log</code> journaux, <code>/tmp</code> temporaire, <code>/root</code> dossier de root. Chemin <b>absolu</b> (commence par /) ou <b>relatif</b> (depuis le dossier courant).</p>`},
{t:'Tests et sécurité du code',h:`
<h3>Tests unitaires avec pytest</h3>
<pre><code># test_pet.py
import pytest
from pet import nourrir

def test_nourrir_reduit_la_faim():
    pet = {"faim": 70, "energie": 40, "humeur": 50, "vivant": True}
    assert nourrir(pet)["faim"] == 40

def test_animal_mort():
    with pytest.raises(ValueError):
        nourrir({"faim": 0, "energie": 0, "humeur": 0, "vivant": False})</code></pre>
<p>On lance <code>pytest</code> : chaque fonction <code>test_…</code> est exécutée, un <code>assert</code> faux fait échouer le test. On teste le cas normal, les <b>cas limites</b> (0, 100, liste vide) et les <b>cas d'erreur</b>. Avec Flask, on teste les routes via <code>app.test_client()</code> en vérifiant le code de statut et le JSON.</p>
<h3>Réflexes de sécurité</h3>
<ul><li><b>Jamais de secret dans le code</b> : variables d'environnement (<code>os.getenv("API_KEY")</code>), fichier <code>.env</code> ignoré par Git, secrets GitHub dans la CI.</li>
<li><b>Valider les entrées</b> : types, bornes, champs obligatoires ; refuser avec 400/422.</li>
<li><b>Jamais <code>eval()</code></b> sur une donnée utilisateur ; pas de <code>subprocess</code> avec <code>shell=True</code> et une entrée utilisateur (injection de commande).</li>
<li><b>Requêtes SQL paramétrées</b> (voir Fondamentaux › OWASP).</li>
<li><b>Mode debug désactivé</b> en production (<code>app.run(debug=False)</code>) : le débogueur Flask permet d'exécuter du code.</li>
<li>Dépendances à jour, vérifiées par la SCA ; image Docker minimale (<code>python:3.12-slim</code>) qui ne tourne pas en root.</li></ul>`},
{t:'Dev, Ops, DevOps, DevSecOps',h:`
<ul><li><b>Dev</b> : les développeurs, qui écrivent le code et veulent livrer vite.</li>
<li><b>Ops</b> : les opérations, qui exploitent les serveurs et veulent la stabilité.</li>
<li><b>DevOps</b> : culture et pratiques qui rapprochent les deux : automatisation, livraisons fréquentes et petites, feedback rapide, responsabilité partagée.</li>
<li><b>DevSecOps</b> : intégrer la <b>sécurité à chaque étape</b> du cycle, dès le début (« shift left »), au lieu d'un audit à la fin.</li></ul>
<p><b>Boucle DevOps</b> : Plan → Code → Build → Test → Release → Deploy → Operate → Monitor, et on recommence.</p>
<h3>Contrôles de sécurité automatisés</h3>
<ul><li><b>SAST</b> (Static Application Security Testing) : analyse le <b>code source</b> sans l'exécuter (ex. Bandit pour Python, Semgrep, CodeQL).</li>
<li><b>SCA</b> (Software Composition Analysis) : vérifie les <b>dépendances</b> et leurs vulnérabilités connues, CVE (ex. pip-audit, Dependabot, Safety, Trivy).</li>
<li><b>DAST</b> : teste l'application <b>en fonctionnement</b> de l'extérieur (ex. OWASP ZAP).</li>
<li><b>Détection de secrets</b> : gitleaks, push protection de GitHub.</li>
<li><b>Scan d'image Docker</b> : Trivy.</li></ul>
<p>Contrôles qualité : <b>formatage</b> (black), <b>linting</b> (flake8, ruff, pylint), <b>tests unitaires</b> (pytest).</p>`},
{t:'Docker et CI/CD',h:`
<p><b>Docker</b> : empaquette l'application et ses dépendances dans une <b>image</b> ; un <b>conteneur</b> est une image en cours d'exécution. Plus léger qu'une VM : il partage le noyau de l'hôte.</p>
<pre><code># Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
CMD ["python", "app.py"]</code></pre>
<pre><code>docker build -t tavernier .
docker run -d -p 5000:5000 -v donnees:/app/data tavernier   # -p hôte:conteneur, -v volume persistant
docker ps · docker logs ID · docker compose up -d</code></pre>
<p>Les données d'un conteneur disparaissent avec lui : on utilise un <b>volume</b> pour les rendre <b>persistantes</b>.</p>
<h3>CI/CD avec GitHub Actions</h3>
<p><b>CI</b> (intégration continue) : à chaque push/PR, le code est automatiquement construit et testé. <b>CD</b> (livraison/déploiement continu) : l'artefact validé est publié/déployé automatiquement (image poussée sur Docker Hub).</p>
<pre><code># .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  ci:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.12" }
      - run: pip install -r requirements.txt black flake8 pytest bandit pip-audit
      - run: black --check .      # qualité 1 : formatage
      - run: flake8 .             # qualité 2 : linting
      - run: pytest               # qualité 3 : tests
      - run: bandit -r .          # sécurité 1 : SAST
      - run: pip-audit            # sécurité 2 : SCA
      - uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}</code></pre>
<div class="key">Les identifiants sont stockés dans les <b>secrets GitHub</b> (Settings › Secrets and variables › Actions) et lus avec <code>\${{ secrets.NOM }}</code> : <b>jamais en clair</b> dans le code ou le YAML.</div>`},
{t:'Cahier des charges : ce qui est attendu et noté',h:`
<p>Module « Introduction à la programmation &amp; DevSecOps » (UE DevSecOps, 1 ECTS, GCS1, semaine du 9 au 13 novembre), groupes de <b>4 étudiants</b>, projet fil rouge poursuivi sur <b>trois modules</b>, versionné sur GitHub. Le travail fait avec une IA générative doit être <b>déclaré et vérifié</b> : il reste sous votre responsabilité.</p>
<h3>Travaux préparatoires (QCM du jour 1)</h3>
<div class="tbl"><table><tr><th>Domaine</th><th>Notions à connaître (sans maîtrise avancée)</th></tr>
<tr><td>Python</td><td>variables, types simples, conditions, boucles, fonctions, listes et dictionnaires</td></tr>
<tr><td>Git</td><td>dépôt, clone, commit, push, pull</td></tr>
<tr><td>Web</td><td>client/serveur, HTTP, GET / POST, JSON, API REST</td></tr>
<tr><td>Linux / terminal</td><td>navigation dans l'arborescence, fichiers et répertoires, commandes de base, permissions</td></tr></table></div>
<p>Matériel : Python 3, Git, un compte GitHub, un éditeur de code, un terminal fonctionnel.</p>
<h3>La semaine, jour par jour</h3>
<div class="tbl"><table><tr><th>Jalon</th><th>Livrable</th><th>Contenu</th></tr>
<tr><td>QCM (09/11)</td><td>Travaux préparatoires</td><td>questionnaire noté</td></tr>
<tr><td>Jour 1 · Comprendre (09/11)</td><td>Environnement Python / Git fonctionnel</td><td>projet, Dev/Ops/DevOps/DevSecOps, roadmap des 7 semaines, rappels Python, HTTP, API REST, JSON</td></tr>
<tr><td>Jour 2 · Programmer (10/11)</td><td>Première fonctionnalité Python utilisant une API</td><td>construction progressive, consommation d'une API externe, traitement des données</td></tr>
<tr><td>Jour 3 · Versionner (12/11)</td><td>Dépôt GitHub avec commits structurés</td><td>création du dépôt, commits, branches, travail collaboratif</td></tr>
<tr><td>Jour 4 · Intégrer (13/11)</td><td>Première version fonctionnelle, bilan</td><td>intégration au fil rouge, documentation, présentation, suite du projet</td></tr></table></div>
<h3>Attendus techniques minimaux du projet final</h3>
<ul><li><b>Back-end Python</b> (Flask ou équivalent) exposant une API REST avec au moins <b>1 GET, 1 POST, 1 PUT/PATCH, 1 DELETE</b> ; données en JSON ou dans une base de données (plus technique, plus propre).</li>
<li><b>Git</b> : commits réguliers (à chaque fonctionnalité ou correction), branches <code>main</code> et <code>develop</code>, <b>pull requests develop → main</b>.</li>
<li><b>Docker</b> : application conteneurisée, accessible en <code>localhost</code> sur le port de votre choix, <b>données persistantes</b> (volume).</li>
<li><b>CI/CD GitHub Actions</b> : au moins <b>3 contrôles qualité</b> (formatage, linting, tests unitaires) et <b>2 contrôles sécurité</b> (SAST, SCA) ; image <b>construite automatiquement</b> et <b>poussée sur Docker Hub</b>.</li>
<li><b>Secrets</b> : dans les secrets GitHub, <b>jamais en clair</b> dans le code ou le YAML.</li></ul>
<div class="trap">Sujet libre : mêmes attendus, mais le cahier des charges demande alors <b>3</b> contrôles de sécurité (et 3 de qualité).</div>
<h3>Les sujets</h3>
<p><b>Tamagochi</b> : un animal avec faim, énergie, humeur et état (vivant / mort). <code>POST /pet</code> (créer), <code>GET /pet</code> (état), <code>POST /pet/feed</code>, <code>/pet/play</code>, <code>/pet/sleep</code>, <code>PUT</code> ou <code>PATCH /pet</code> (ex. renommer), <code>DELETE /pet</code>. Règles : valeurs cohérentes (bornées), l'animal peut mourir, une fois mort certaines actions sont refusées. Bonus : gestion du temps, historique, messages d'erreur détaillés.</p>
<p><b>Tavernier RPG</b> : des quêtes avec nom, description, récompense et statut (disponible, en cours, terminée). <code>POST /quests</code>, <code>GET /quests</code>, <code>GET /quests/{id}</code>, <code>PUT/PATCH /quests/{id}</code> (terminer, augmenter la récompense…), <code>DELETE /quests/{id}</code>. Règles : une quête doit être <b>acceptée avant d'être terminée</b>, une quête <b>terminée n'est plus modifiable</b>, statuts cohérents. Bonus : aventuriers, attribution, historique, récompenses qui évoluent avec le temps.</p>
<h3>La boucle DevOps attendue (version simplifiée)</h3>
<div class="tbl"><table><tr><th>Étape</th><th>Ce que le jury regarde</th></tr>
<tr><td>Plan</td><td>organisation, découpage des tâches (GitHub Projects, Trello : la réflexion compte plus que l'outil)</td></tr>
<tr><td>Code</td><td>code Python sur GitHub, structure claire, Flask ou équivalent</td></tr>
<tr><td>Build</td><td>pipeline qui installe les dépendances et construit ; comprendre le rôle du build</td></tr>
<tr><td>Test</td><td>tests automatisés dans la CI, même simples ; expliquer ce qui est testé et pourquoi</td></tr>
<tr><td>Release</td><td>commits réguliers, messages compréhensibles</td></tr>
<tr><td>Deploy</td><td>application exécutable, conteneurisée, instructions dans le README</td></tr>
<tr><td>Operate</td><td>application fonctionnelle, démonstration simple (navigateur, logs)</td></tr>
<tr><td>Monitor</td><td>pas de vraie supervision : expliquer comment vérifier que ça marche et ce qu'on surveillerait en vrai</td></tr></table></div>
<h3>README.md obligatoire</h3>
<p>Présentation du projet · fonctionnement global · instructions de lancement · problèmes rencontrés · solutions ou contournements · améliorations possibles (boucle suivante).</p>
<h3>Grille d'évaluation</h3>
<div class="tbl"><table><tr><th>Critère</th><th>Poids</th></tr>
<tr><td>QCM travaux préparatoires</td><td>10 %</td></tr>
<tr><td>Fonctionnalités API / CRUD</td><td>20 %</td></tr>
<tr><td>Démarche DevOps (Plan → Release)</td><td>20 %</td></tr>
<tr><td>Qualité &amp; tests</td><td>20 %</td></tr>
<tr><td>Déploiement, exploitation, monitoring</td><td>10 %</td></tr>
<tr><td>Documentation &amp; recul</td><td>10 %</td></tr>
<tr><td>Présentation / restitution</td><td>10 %</td></tr>
<tr><td>Bonus (amélioration pertinente et justifiée)</td><td>jusqu'à +10 %</td></tr></table></div>
<div class="key">Le projet n'attend <b>pas</b> une infrastructure professionnelle. Bugs, blocages et limites sont normaux : savoir <b>expliquer un problème</b>, la tentative de résolution et la piste d'amélioration est valorisé, même si ce n'est pas résolu.</div>`},
{t:'Corrections des exercices Python du cours (jeu de rôle)',h:`
<p>Les quatre exercices de la séance, corrigés et expliqués. Le fil rouge : un personnage qui combat un squelette puis un golem.</p>
<h3>Exo 1 : variables, input et f-string</h3>
<pre><code>nomDuPersonnage = input("Veuillez entrer votre nom")
classe = input("Entrer le nom de votre classe")
niveau = 1
point_de_vie = 100
potion = 20
force = 50
print(f"Ton personnage s'appelle {nomDuPersonnage}, il est de classe {classe}, "
      f"il possède {point_de_vie}pv et il a {force} de force")</code></pre>
<p><code>input()</code> renvoie toujours du <b>texte</b> ; la f-string insère les variables entre accolades.</p>
<h3>Exo 2 : hasard et condition</h3>
<pre><code>import random
pvSquelette = 10
degats = random.randint(10, 14)      # entier entre 10 et 14 inclus
pvSquelette = pvSquelette - degats
print(f"Vous avez infligé {degats} de dégâts")
if pvSquelette &lt;= 0:
    pvSquelette = 0
    print(f"Vous avez vaincu le squelette. PV du squelette {pvSquelette}pv")
else:
    print(f"Vous avez perdu. PV du squelette : {pvSquelette}pv")</code></pre>
<p>Ici les dégâts (10 à 14) sont toujours supérieurs ou égaux aux 10 PV : le squelette meurt à chaque fois. La correction du cours teste <code>pvSquelette == 0 or pvSquelette &lt;= 0</code>, ce qui revient à <code>pvSquelette &lt;= 0</code>.</p>
<h3>Exo 3 : la boucle de combat contre le golem</h3>
<pre><code>golemPv = 50
while golemPv &gt; 0:
    coupEpee = random.randint(10, 14)
    lancerDague = random.randint(2, 22)
    bouleDeFeu = random.choice([0, 20])     # 0 OU 20, une chance sur deux
    sort = int(input("Faites votre choix : "))
    if sort == 1:
        golemPv = golemPv - coupEpee
    elif sort == 2:
        golemPv -= lancerDague
    elif sort == 3:
        golemPv -= bouleDeFeu
        if bouleDeFeu == 0:
            print("Raté !")
    else:
        point_de_vie -= 1                    # mauvais choix : on se blesse
    if golemPv &lt; 0:
        golemPv = 0
    print(f"Golem : {golemPv}  Vous : {point_de_vie}")</code></pre>
<ul><li>Les dégâts sont <b>tirés à chaque tour</b>, au début de la boucle.</li>
<li><code>random.choice([0, 20])</code> choisit un élément de la liste ; <code>random.randint(2, 22)</code> un entier, bornes comprises.</li>
<li><code>golemPv -= x</code> équivaut à <code>golemPv = golemPv - x</code>.</li>
<li>On remet les PV à 0 s'ils deviennent négatifs, pour l'affichage.</li>
<li><code>int(input(...))</code> plante (<code>ValueError</code>) si on tape une lettre : à protéger par un <code>try/except</code>.</li></ul>
<h3>Exo 4 : l'inventaire (listes et enumerate)</h3>
<pre><code>inventaire = ["Potion de soin", "Potion de mana", "Pièce d'or"]
print(f"La taille de l'inventaire est de {len(inventaire)} emplacements")   # 3
inventaire.append("Arme Ultime")                  # ajoute à la fin
point_de_vie += 20
if "Potion de soin" in inventaire:                # test d'appartenance
    inventaire.remove("Potion de soin")           # retire par valeur
for i, objet in enumerate(inventaire, 1):          # numérote à partir de 1
    print(f"Item {i}: {objet}")</code></pre>
<p>Affichage final : <code>Item 1: Potion de mana</code>, <code>Item 2: Pièce d'or</code>, <code>Item 3: Arme Ultime</code>.</p>
<div class="key"><code>enumerate(liste, 1)</code> renvoie des paires <b>(numéro, élément)</b> : <code>(1, 'Potion de mana')</code>, <code>(2, "Pièce d'or")</code>… Le <code>for i, objet in …</code> décompose chaque paire. Sans le 1, la numérotation commence à 0.</div>`},
{t:'Créer et activer un venv selon son système',h:`
<p>Un <b>environnement virtuel</b> isole les bibliothèques d'un projet. On le crée une fois, on l'active à chaque session.</p>
<pre><code>cd "chemin/vers/ton/dossier"        # 1. se placer dans le projet
python -m venv venv                 # 2. créer (Windows le plus souvent)
python3 -m venv venv                #    ou sur macOS / Linux
py -m venv venv                     #    si ni python ni python3 ne marchent sous Windows</code></pre>
<div class="tbl"><table><tr><th>Terminal</th><th>Commande d'activation</th></tr>
<tr><td>Windows, Invite de commandes (CMD)</td><td><code>venv\\Scripts\\activate</code></td></tr>
<tr><td>Windows, PowerShell</td><td><code>venv\\Scripts\\Activate.ps1</code></td></tr>
<tr><td>Windows, Git Bash</td><td><code>source venv/Scripts/activate</code></td></tr>
<tr><td>macOS / Linux</td><td><code>source venv/bin/activate</code></td></tr></table></div>
<div class="trap">Sous Windows le dossier s'appelle <code>Scripts</code>, pas <code>bin</code>. Si PowerShell refuse d'exécuter le script : <code>Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser</code>, puis réessayer.</div>
<p>Vérifier : <code>(venv)</code> apparaît au début de la ligne de commande. Installer ensuite avec <code>pip install -r requirements.txt</code>. Pour sortir : <code>deactivate</code>.</p>`}
],
cards:[
['Résultat de <code>7 // 2</code> et <code>7 % 2</code> ?','<code>3</code> (division entière) et <code>1</code> (reste).'],
['Que renvoie <code>input()</code> ?','Toujours une chaîne (str) : il faut convertir avec int() ou float().'],
['Que produit <code>range(3)</code> ?','0, 1, 2 (la borne de fin est exclue).'],
['Index du premier élément d\'une liste ? Du dernier ?','<code>0</code> et <code>-1</code>.'],
['Ajouter un élément à la fin d\'une liste ?','<code>liste.append(x)</code>'],
['Lire une clé de dictionnaire sans erreur si elle manque ?','<code>d.get("cle", valeur_par_defaut)</code>'],
['Que renvoie une fonction sans return ?','<code>None</code>'],
['Les 4 opérations CRUD et leurs méthodes HTTP ?','Create = POST, Read = GET, Update = PUT/PATCH, Delete = DELETE.'],
['PUT vs PATCH ?','PUT remplace toute la ressource ; PATCH n\'en modifie qu\'une partie.'],
['Code HTTP après une création réussie ?','<b>201 Created</b>'],
['401 vs 403 ?','401 : pas authentifié. 403 : authentifié mais pas autorisé.'],
['Que signifient les codes 4xx et 5xx ?','4xx : erreur du client (404…). 5xx : erreur du serveur (500…).'],
['Qu\'est-ce que JSON ?','Un format texte d\'échange de données : objets {}, tableaux [], clés entre guillemets doubles.'],
['json.loads vs json.dumps ?','loads : texte JSON → objet Python. dumps : objet Python → texte JSON.'],
['Git vs GitHub ?','Git : outil local de versionnement. GitHub : hébergement en ligne de dépôts + collaboration.'],
['Les 3 zones de Git ?','Répertoire de travail → index (staging, git add) → dépôt (git commit).'],
['git pull = ?','git fetch + git merge.'],
['À quoi sert une pull request ?','Proposer de fusionner une branche (develop → main) avec relecture avant fusion.'],
['Rôle du fichier .gitignore ?','Lister les fichiers à ne jamais versionner (venv, __pycache__, .env…).'],
['chmod 754 = ?','rwx (propriétaire) r-x (groupe) r-- (autres).'],
['Où sont les journaux sous Linux ? La configuration ?','<code>/var/log</code> · <code>/etc</code>'],
['Commande pour suivre un log en direct ?','<code>tail -f fichier.log</code>'],
['DevOps en une phrase ?','Rapprocher développement et exploitation par l\'automatisation et des livraisons fréquentes.'],
['DevSecOps en une phrase ?','Intégrer la sécurité à chaque étape du cycle, dès le début (shift left).'],
['SAST vs SCA vs DAST ?','SAST : analyse du code source. SCA : vulnérabilités des dépendances. DAST : test de l\'appli en fonctionnement.'],
['Image vs conteneur Docker ?','L\'image est le modèle ; le conteneur est une image en cours d\'exécution.'],
['Rendre les données d\'un conteneur persistantes ?','Utiliser un volume (<code>-v nom:/chemin</code>).'],
['Où stocker les mots de passe d\'un pipeline GitHub Actions ?','Dans les secrets GitHub, lus avec <code>${{ secrets.NOM }}</code>.'],
['CI vs CD ?','CI : construire et tester automatiquement à chaque push. CD : livrer/déployer automatiquement.'],
['<code>random.randint(1, 20)</code> peut-il renvoyer 20 ?','Oui : les deux bornes sont incluses.'],
['Que fait <code>break</code> ? et <code>continue</code> ?','break quitte la boucle ; continue passe directement au tour suivant.'],
['À quoi sert <code>if __name__ == "__main__":</code> ?','Exécuter le code seulement si le fichier est lancé directement, pas quand il est importé.'],
['Erreur levée par <code>int("abc")</code> ?','<code>ValueError</code>'],
['Erreur levée par <code>"3" + 2</code> ?','<code>TypeError</code>'],
['Pourquoi utiliser <code>with open(...)</code> ?','Le fichier est fermé automatiquement, même en cas d\'erreur.'],
['Mode "w" vs "a" de open() ?','"w" écrase le fichier ; "a" ajoute à la fin.'],
['À quoi sert un environnement virtuel (venv) ?','Isoler les dépendances d\'un projet ; on le crée avec <code>python -m venv venv</code>.'],
['Où mettre une clé d\'API dans un projet Python ?','Dans une variable d\'environnement (os.getenv), jamais dans le code ni dans Git.'],
['Pourquoi ne jamais utiliser eval() sur une entrée utilisateur ?','Elle exécute n\'importe quel code Python : exécution de code arbitraire.'],
['Méthodes HTTP minimales du projet final ?','Au moins 1 GET, 1 POST, 1 PUT ou PATCH et 1 DELETE (API CRUD).'],
['Branches et flux Git exigés par le cahier des charges ?','<code>main</code> et <code>develop</code>, avec des pull requests develop → main.'],
['Contrôles minimum dans la CI du projet ?','3 contrôles qualité (formatage, linting, tests) et 2 contrôles sécurité (SAST, SCA) ; 3 en sujet libre.'],
['Où doit finir l\'image Docker construite par la CI ?','Poussée automatiquement sur Docker Hub (identifiants dans les secrets GitHub).'],
['Les 6 rubriques minimales du README ?','Présentation, fonctionnement global, lancement, problèmes rencontrés, solutions/contournements, améliorations possibles.'],
['Tavernier : deux règles de gestion des statuts ?','Une quête doit être acceptée avant d\'être terminée ; une quête terminée n\'est plus modifiable.'],
['Tamagochi : les 4 caractéristiques de l\'animal ?','Faim, énergie, humeur, état (vivant ou mort).'],
['Poids du QCM des travaux préparatoires ?','10 % de la note ; le projet compte pour 90 %.'],
['Monitor « débutant » : qu\'attend-on ?','Pas de vraie supervision : expliquer comment vérifier que l\'appli marche et ce qu\'on surveillerait en conditions réelles.'],
['IA générative dans le projet : la règle ?','L\'utiliser est permis mais doit être déclaré et vérifié ; le code produit reste sous votre responsabilité.'],
['Que renvoie <code>enumerate(["a","b"], 1)</code> ?','Les paires <code>(1, "a")</code> puis <code>(2, "b")</code>.'],
['<code>random.choice([0, 20])</code> ?','0 ou 20, chacun avec une chance sur deux.'],
['Activer un venv sous PowerShell ?','<code>venv\\Scripts\\Activate.ps1</code>'],
['Activer un venv sous macOS / Linux ?','<code>source venv/bin/activate</code>'],
['PowerShell refuse d’activer le venv : que faire ?','<code>Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser</code> puis réessayer.'],
['Comment savoir que le venv est actif ? Comment en sortir ?','<code>(venv)</code> apparaît dans l’invite ; <code>deactivate</code> pour sortir.']
],
quiz:[
{q:'Que affiche ce code ?',code:'x = 7\ny = 2\nprint(x // y, x % y)',o:['3.5 1','3 1','3 0','4 1'],a:[1],e:'// est la division entière (3), % le reste (1).'},
{q:'Que affiche ce code ?',code:'for i in range(1, 4):\n    print(i, end=" ")',o:['0 1 2 3','1 2 3 4','1 2 3','1 2 3 4 '],a:[2],e:'range(1, 4) va de 1 à 3 : la borne de fin est exclue.'},
{q:'Quelle instruction ajoute "clé" à la fin de la liste inventaire ?',o:['inventaire.add("clé")','inventaire.append("clé")','inventaire.push("clé")','inventaire + "clé"'],a:[1],e:'append ajoute à la fin. add est pour les sets, push n\'existe pas en Python.'},
{q:'Que vaut d.get("armure", 0) si d = {"pv": 10} ?',o:['Une KeyError','None','0','10'],a:[2],e:'get renvoie la valeur par défaut si la clé est absente.'},
{q:'Que affiche ce code ?',code:'golem = {"nom": "Golem", "pv": 120}\ngolem["pv"] -= 20\nprint(golem["pv"])',o:['120','100','-20','Une erreur'],a:[1],e:'On retire 20 à la valeur associée à la clé "pv".'},
{q:'Que renvoie la fonction suivante pour f(5) ?',code:'def f(n):\n    if n > 3:\n        print("grand")',o:['"grand"','True','None','5'],a:[2],e:'Elle affiche "grand" mais ne renvoie rien : la valeur de retour est None.'},
{q:'Quel est le type de input("Âge ? ") si l\'utilisateur tape 18 ?',o:['int','str','float','bool'],a:[1],e:'input renvoie toujours une chaîne : int(input()) pour obtenir un entier.'},
{q:'Quelle méthode HTTP utiliser pour créer une nouvelle quête ?',o:['GET','POST','PUT','DELETE'],a:[1],e:'POST /quests crée une ressource ; le serveur répond 201 Created.'},
{q:'Quelle méthode HTTP pour modifier seulement le statut d\'une quête ?',o:['GET','POST','PATCH','DELETE'],a:[2],e:'PATCH modifie partiellement. PUT remplacerait toute la ressource.'},
{q:'Quel code de statut indique une ressource introuvable ?',o:['200','201','404','500'],a:[2],e:'404 Not Found. 500 = erreur interne du serveur.'},
{q:'Un utilisateur connecté tente une action qu\'il n\'a pas le droit de faire. Code adapté ?',o:['401','403','404','200'],a:[1],e:'403 Forbidden : identifié mais interdit. 401 : non authentifié.'},
{q:'Quelles méthodes HTTP sont idempotentes ?',o:['GET','POST','PUT','DELETE'],a:[0,2,3],e:'Répéter GET, PUT ou DELETE donne le même état final ; deux POST créent deux ressources.'},
{q:'Lequel est un JSON valide ?',o:["{'nom': 'Golem'}",'{"nom": "Golem", "pv": 120}','{nom: "Golem"}','["nom" = "Golem"]'],a:[1],e:'En JSON, les clés et chaînes sont entre guillemets doubles.'},
{q:'Quelle fonction transforme un texte JSON en dictionnaire Python ?',o:['json.dumps','json.loads','json.write','dict.json'],a:[1],e:'loads = load string. dumps fait l\'inverse.'},
{q:'Quelle commande Git enregistre les modifications indexées dans l\'historique local ?',o:['git add','git commit','git push','git pull'],a:[1],e:'add prépare, commit enregistre localement, push envoie au distant.'},
{q:'Quelle commande envoie les commits locaux vers GitHub ?',o:['git pull','git fetch','git push','git clone'],a:[2],e:'push envoie ; pull et fetch récupèrent ; clone copie un dépôt.'},
{q:'git pull correspond à :',o:['git fetch + git merge','git add + git commit','git clone','git push --force'],a:[0],e:'pull récupère les commits distants puis les fusionne dans la branche courante.'},
{q:'Dans le projet, comment intègre-t-on develop dans main ?',o:['git push --force sur main','Par une pull request develop → main','En supprimant main','En copiant les fichiers à la main'],a:[1],e:'La PR permet relecture et contrôles CI avant la fusion.'},
{q:'Quel fichier empêche de versionner .env et venv/ ?',o:['README.md','.gitignore','requirements.txt','Dockerfile'],a:[1],e:'.gitignore liste les chemins ignorés par Git.'},
{q:'Que fait chmod 600 secret.txt ?',o:['Tout le monde peut lire','Lecture/écriture pour le propriétaire uniquement','Exécution pour tous','Supprime le fichier'],a:[1],e:'6 = 4 + 2 = rw- pour le propriétaire, 0 pour le groupe et les autres.'},
{q:'Quelle commande affiche le dossier courant ?',o:['ls','cd','pwd','whoami'],a:[2],e:'pwd = print working directory.'},
{q:'Dans quel dossier Linux trouve-t-on les fichiers de configuration ?',o:['/home','/etc','/var/log','/tmp'],a:[1],e:'/etc : configuration ; /var/log : journaux.'},
{q:'Qu\'est-ce que le DevSecOps ?',o:['Une équipe de sécurité qui audite le code à la fin','L\'intégration de la sécurité à chaque étape du cycle de vie','Un langage de programmation','Un pare-feu applicatif'],a:[1],e:'Shift left : la sécurité est automatisée et présente dès la conception.'},
{q:'Bandit analyse le code Python sans l\'exécuter. C\'est un outil de :',o:['DAST','SAST','SCA','Monitoring'],a:[1],e:'SAST = analyse statique du code source.'},
{q:'pip-audit ou Dependabot vérifient les vulnérabilités des bibliothèques utilisées. C\'est :',o:['SAST','SCA','DAST','Un linter'],a:[1],e:'SCA = analyse de la composition logicielle (dépendances, CVE).'},
{q:'Lesquels sont des contrôles de qualité (et non de sécurité) ?',o:['black (formatage)','flake8 (linting)','pytest (tests unitaires)','gitleaks (secrets)'],a:[0,1,2],e:'gitleaks détecte des secrets : c\'est un contrôle de sécurité.'},
{q:'Où stocker le mot de passe Docker Hub utilisé par GitHub Actions ?',o:['Dans le fichier YAML','Dans le code Python','Dans les secrets GitHub','Dans le README'],a:[2],e:'Les secrets chiffrés de GitHub sont injectés à l\'exécution, jamais écrits en clair.'},
{q:'Comment rendre les données d\'un conteneur persistantes ?',o:['Avec un volume Docker','Avec docker ps','Avec EXPOSE','Impossible'],a:[0],e:'-v nom_volume:/app/data : les données survivent à la suppression du conteneur.'},
{q:'Dans « docker run -p 8080:5000 app », à quoi correspond 8080 ?',o:['Au port dans le conteneur','Au port de la machine hôte','Au numéro de version','À la mémoire'],a:[1],e:'-p hôte:conteneur : on accède à l\'appli sur localhost:8080, qui écoute sur 5000 dans le conteneur.'},
{q:'Que fait la CI (intégration continue) ?',o:['Elle écrit le code','Elle construit et teste automatiquement le code à chaque push','Elle remplace Git','Elle chiffre le dépôt'],a:[1],e:'La CI détecte les erreurs au plus tôt ; la CD publie/déploie ensuite.'},
{q:'Quelles valeurs peut prendre degats ?',code:'import random\ndegats = random.choice(range(10, 15))',o:['10 à 15','10 à 14','11 à 14','0 à 15'],a:[1],e:'range(10, 15) = 10, 11, 12, 13, 14 : la fin est exclue. random.randint(10, 14) donnerait la même chose.'},
{q:'Combien de fois au maximum le joueur peut-il proposer un nombre ?',code:'essais = 0\nwhile essais < 3:\n    choix = int(input("Nombre : "))\n    essais += 1\n    if choix == code_magique:\n        break',o:['2','3','4','Infini'],a:[1],e:'essais vaut 0, 1, 2 au début des tours : 3 tours, sauf si break arrête avant.'},
{q:'Que affiche ce code ?',code:'pv_golem = 50\npv_joueur = 100\ntours = 0\nwhile pv_golem > 0:\n    pv_golem -= 12\n    pv_joueur -= 7\n    tours += 1\nprint(tours, pv_joueur)',o:['4 72','5 65','5 72','4 65'],a:[1],e:'50 → 38 → 26 → 14 → 2 → -10 : 5 tours ; 100 − 5×7 = 65.'},
{q:'Que affiche ce code ?',code:'inventaire = ["Pièce d\'Or"]\ninventaire.append("Clé")\ninventaire.remove("Pièce d\'Or")\nprint(len(inventaire), inventaire[0])',o:['1 Clé','2 Clé','1 Pièce d\'Or','Erreur'],a:[0],e:'Après append puis remove, il ne reste que "Clé".'},
{q:'Quel est l\'effet de if __name__ == "__main__": exploration_donjon() ?',o:['La fonction est appelée même si le fichier est importé','La fonction n\'est appelée que si le fichier est exécuté directement','La fonction n\'est jamais appelée','Cela crée une classe'],a:[1],e:'À l\'import, __name__ vaut le nom du module, pas "__main__".'},
{q:'L\'utilisateur tape « abc ». Quelle erreur provoque int(input()) ?',o:['TypeError','ValueError','NameError','KeyError'],a:[1],e:'La valeur n\'est pas convertible en entier : ValueError, à intercepter avec try/except.'},
{q:'Que affiche ce code ?',code:'try:\n    x = 10 / 0\nexcept ZeroDivisionError:\n    print("A")\nfinally:\n    print("B")',o:['A','B','A puis B','Une erreur'],a:[2],e:'L\'exception est interceptée (A), puis finally s\'exécute toujours (B).'},
{q:'Quel mode d\'ouverture ajoute du texte à la fin d\'un fichier sans l\'effacer ?',o:['"r"','"w"','"a"','"x"'],a:[2],e:'"w" efface le contenu existant.'},
{q:'Quelle commande crée un environnement virtuel Python nommé venv ?',o:['pip install venv','python -m venv venv','git init venv','docker run venv'],a:[1],e:'On l\'active ensuite, puis pip install -r requirements.txt.'},
{q:'Dans un test pytest, que provoque un assert dont la condition est fausse ?',o:['Rien','L\'échec du test','La suppression du fichier','Un commit'],a:[1],e:'pytest affiche alors la valeur obtenue et la valeur attendue.'},
{q:'Lesquelles sont de mauvaises pratiques de sécurité dans une API Python ?',o:['app.run(debug=True) en production','Clé d\'API écrite dans le code source','Requêtes SQL paramétrées','eval() sur un champ envoyé par l\'utilisateur'],a:[0,1,3],e:'Les requêtes paramétrées sont la bonne pratique contre l\'injection SQL.'},
{q:'Que fait random.randint(1, 10) ?',o:['Un entier de 1 à 9','Un entier de 1 à 10','Un décimal entre 1 et 10','Une liste de 10 nombres'],a:[1],e:'Les deux bornes sont incluses, contrairement à range.'},
{q:'Selon le cahier des charges, combien de contrôles de sécurité minimum dans la CI (sujets Tamagochi / Tavernier) ?',o:['1','2','3','5'],a:[1],e:'2 contrôles de sécurité (ex. SAST, SCA) et 3 contrôles qualité ; 3 de chaque en sujet libre.',src:'cahier des charges'},
{q:'Quel flux Git est exigé ?',o:['Tout sur main','Branches main et develop, pull requests develop → main','Une branche par étudiant, sans PR','Pas de branche, des tags'],a:[1],e:'Gestion minimale des branches : main, develop et PR de develop vers main.',src:'cahier des charges'},
{q:'Tavernier : une quête « disponible » reçoit une demande pour passer à « terminée ». Que doit faire l\'API ?',o:['Accepter','Refuser : elle doit d\'abord être acceptée (en cours)','Supprimer la quête','Renvoyer 500'],a:[1],e:'Règle : acceptée avant d\'être terminée. Réponse 400/409 avec un message clair.',src:'cahier des charges'},
{q:'Quelles exigences Docker figurent au cahier des charges ? (plusieurs réponses)',o:['Accessible en localhost','Port imposé : 80','Données persistantes','Image poussée sur Docker Hub par la CI'],a:[0,2,3],e:'Le port est au choix ; les données doivent survivre au conteneur (volume).',src:'cahier des charges'},
{q:'Quel critère pèse le plus dans la note du projet ?',o:['Documentation & recul (10 %)','Déploiement (10 %)','Fonctionnalités API, Démarche DevOps et Qualité & tests (20 % chacun)','Présentation (10 %)'],a:[2],e:'Trois blocs à 20 %, puis déploiement, documentation et présentation à 10 %, QCM 10 %.',src:'cahier des charges'},
{q:'Où stocker le token Docker Hub utilisé par GitHub Actions ?',o:['Dans le Dockerfile','Dans ci.yml','Dans les secrets GitHub (Settings › Secrets and variables › Actions)','Dans le README'],a:[2],e:'Jamais en clair dans le code ni dans les fichiers YAML.',src:'cahier des charges'},
{q:'Un bug n\'a pas pu être corrigé avant la soutenance. Que conseille le cahier des charges ?',o:['Le cacher','L\'expliquer : problème, tentatives, piste d\'amélioration (c\'est valorisé)','Supprimer la fonctionnalité du dépôt','Changer de sujet'],a:[1],e:'Bugs et blocages sont « normaux et attendus » : savoir les expliquer compte.',src:'cahier des charges'},
{q:'Que affiche ce code ?',code:'inventaire = ["Potion de soin", "Potion de mana", "Pièce d\'or"]\ninventaire.append("Arme Ultime")\ninventaire.remove("Potion de soin")\nfor i, objet in enumerate(inventaire, 1):\n    print(i, objet)',o:['0 Potion de mana / 1 Pièce d’or / 2 Arme Ultime','1 Potion de mana / 2 Pièce d’or / 3 Arme Ultime','1 Potion de soin / 2 Potion de mana / 3 Pièce d’or / 4 Arme Ultime','Erreur'],a:[1],e:'remove enlève la potion de soin ; enumerate(…, 1) numérote à partir de 1.',src:'corrections du cours'},
{q:'Dans l’exo 2, pvSquelette = 10 et degats = random.randint(10, 14). Le squelette meurt :',o:['Jamais','Une fois sur deux','À tous les coups','Seulement si degats vaut 14'],a:[2],e:'Les dégâts valent au moins 10 : pvSquelette devient ≤ 0 à chaque fois.',src:'corrections du cours'},
{q:'Sous Windows, dans quel dossier du venv se trouve le script d’activation ?',o:['bin','Scripts','lib','activate'],a:[1],e:'venv\\Scripts\\activate (bin sur macOS et Linux).',src:'venv'},
{q:'Pourquoi les dégâts sont-ils tirés au début de chaque tour de la boucle while du golem ?',o:['Pour accélérer le programme','Pour obtenir une nouvelle valeur aléatoire à chaque attaque','Parce que random ne marche qu’une fois','Ce n’est pas nécessaire'],a:[1],e:'Tirés une seule fois avant la boucle, ils seraient identiques à chaque tour.',src:'corrections du cours'}
],
exos:[
{t:'Écrire une fonction Python',pts:'entraînement',q:`<p>Écrivez une fonction <code>nourrir(pet)</code> pour le Tamagochi : <code>pet</code> est un dictionnaire <code>{"faim": 70, "energie": 40, "humeur": 50, "vivant": True}</code>. Nourrir réduit la faim de 30 et augmente l'énergie et l'humeur de 10. Les valeurs restent entre 0 et 100. Si l'animal est mort, la fonction lève une erreur.</p>`,r:`
<pre><code>def borne(v):
    return max(0, min(100, v))

def nourrir(pet):
    if not pet["vivant"]:
        raise ValueError("Impossible : l'animal est mort.")
    pet["faim"] = borne(pet["faim"] - 30)
    pet["energie"] = borne(pet["energie"] + 10)
    pet["humeur"] = borne(pet["humeur"] + 10)
    return pet

print(nourrir({"faim": 70, "energie": 40, "humeur": 50, "vivant": True}))
# {'faim': 40, 'energie': 50, 'humeur': 60, 'vivant': True}</code></pre>
<p>Points notés : utilisation du dictionnaire, condition sur l'état, valeurs bornées (règle « les valeurs restent cohérentes »), fonction réutilisable. Dans l'API, cette fonction serait appelée par <code>POST /pet/feed</code> et l'erreur transformée en réponse 409 ou 400.</p>`},
{t:'Concevoir l\'API du Tavernier',pts:'entraînement',q:`<p>Listez les routes de l'API « Tavernier RPG » (méthode, URL, rôle, code de réponse attendu) et les règles de gestion à vérifier.</p>`,r:`
<div class="tbl"><table><tr><th>Méthode</th><th>URL</th><th>Rôle</th><th>Code</th></tr>
<tr><td>POST</td><td>/quests</td><td>Publier une quête (nom, description, récompense)</td><td>201 (400 si données invalides)</td></tr>
<tr><td>GET</td><td>/quests</td><td>Lister les quêtes</td><td>200</td></tr>
<tr><td>GET</td><td>/quests/{id}</td><td>Détail d'une quête</td><td>200 ou 404</td></tr>
<tr><td>PATCH</td><td>/quests/{id}</td><td>Changer le statut, augmenter la récompense</td><td>200, 404, ou 409 si règle violée</td></tr>
<tr><td>DELETE</td><td>/quests/{id}</td><td>Supprimer</td><td>204 ou 404</td></tr></table></div>
<p><b>Règles</b> : statuts possibles uniquement « disponible », « en cours », « terminée » ; une quête doit être <b>acceptée (en cours) avant d'être terminée</b> ; une quête terminée <b>ne peut plus être modifiée</b> → sinon 409 Conflict. Données en JSON, persistées (fichier JSON ou base SQLite dans un volume Docker).</p>`},
{t:'Commandes Git du projet',pts:'entraînement',q:`<p>Vous rejoignez le dépôt du groupe. Donnez la suite de commandes pour : récupérer le projet, créer et utiliser la branche <code>develop</code>, ajouter <code>app.py</code>, faire un commit, l'envoyer sur GitHub. Comment fusionner ensuite dans <code>main</code> ?</p>`,r:`
<pre><code>git clone https://github.com/groupe/tavernier.git
cd tavernier
git switch -c develop            # crée et bascule (ou git checkout -b develop)
git add app.py
git commit -m "Ajoute la route GET /quests"
git push -u origin develop</code></pre>
<p>Puis sur GitHub : ouvrir une <b>pull request develop → main</b>, laisser la CI passer (tests, lint, SAST, SCA), faire relire, puis fusionner. Avant de travailler : <code>git pull</code> pour récupérer le travail des autres.</p>`},
{t:'Pipeline CI/CD minimum',pts:'entraînement',q:`<p>Le cahier des charges impose 3 contrôles qualité, 2 contrôles de sécurité, une image Docker construite et poussée sur Docker Hub, et aucun secret en clair. Décrivez le pipeline et justifiez chaque étape.</p>`,r:`
<ol><li><b>Déclenchement</b> : à chaque push et pull request (<code>on: [push, pull_request]</code>).</li>
<li><b>Qualité</b> : <code>black --check</code> (formatage homogène), <code>flake8</code> (erreurs et mauvaises pratiques), <code>pytest</code> (tests unitaires des routes et des règles de gestion).</li>
<li><b>Sécurité</b> : <code>bandit -r .</code> (SAST : mots de passe en dur, eval, requêtes injectables) et <code>pip-audit</code> (SCA : dépendances avec CVE connues). Option : gitleaks (secrets), Trivy (image).</li>
<li><b>Build et push</b> : <code>docker build</code> puis connexion à Docker Hub avec <code>secrets.DOCKERHUB_USERNAME</code> et <code>secrets.DOCKERHUB_TOKEN</code>, puis <code>docker push</code>, uniquement sur main si tout est vert.</li></ol>
<p>Justification DevSecOps : chaque problème est détecté automatiquement le plus tôt possible, avant d'arriver en production, et les secrets restent dans le coffre chiffré de GitHub.</p>`},
{t:'Dérouler le combat contre le Golem',pts:'entraînement',q:`<pre><code>golem = 50
joueur = 100
for coup in [14, 2, 20, 0, 20]:
    if golem &lt;= 0:
        break
    golem -= coup
    joueur -= 7
print(golem, joueur)</code></pre><p>Donnez l'affichage en détaillant chaque tour, puis réécrivez la boucle avec un <code>while</code> qui s'arrête aussi si le joueur n'a plus de PV.</p>`,r:`
<div class="tbl"><table><tr><th>Tour</th><th>coup</th><th>golem</th><th>joueur</th></tr>
<tr><td>1</td><td>14</td><td>36</td><td>93</td></tr><tr><td>2</td><td>2</td><td>34</td><td>86</td></tr>
<tr><td>3</td><td>20</td><td>14</td><td>79</td></tr><tr><td>4</td><td>0</td><td>14</td><td>72</td></tr>
<tr><td>5</td><td>20</td><td>-6</td><td>65</td></tr></table></div>
<p>Affichage : <code>-6 65</code> (le <code>break</code> n'a pas servi : la boucle s'arrête faute de coups).</p>
<pre><code>coups = [14, 2, 20, 0, 20]
i = 0
while golem &gt; 0 and joueur &gt; 0 and i &lt; len(coups):
    golem -= coups[i]
    joueur -= 7
    i += 1
print(max(0, golem), max(0, joueur))</code></pre>`},
{t:'Fiabiliser une saisie',pts:'entraînement',q:`<p>Écrivez une fonction <code>demander_code()</code> qui redemande un nombre entre 1 et 10 tant que la saisie n'est pas un entier valide dans cet intervalle, puis le renvoie.</p>`,r:`
<pre><code>def demander_code():
    while True:
        saisie = input("Code (1 à 10) : ")
        try:
            n = int(saisie)
        except ValueError:
            print("Ce n'est pas un nombre.")
            continue
        if 1 &lt;= n &lt;= 10:
            return n
        print("Le code doit être entre 1 et 10.")</code></pre>
<p>Points clés : boucle infinie quittée par <code>return</code>, <code>try/except ValueError</code> pour les saisies non numériques, contrôle des bornes. C'est de la <b>validation d'entrée</b>, premier réflexe de sécurité.</p>`},
{t:'Protéger le choix du sort contre les mauvaises saisies',pts:'entraînement',q:`<p>Dans le combat contre le golem, <code>sort = int(input(...))</code> plante si l'utilisateur tape une lettre. Réécrivez cette ligne pour redemander tant que la saisie n'est pas 1, 2 ou 3.</p>`,r:`
<pre><code>while True:
    saisie = input("Faites votre choix (1, 2 ou 3) : ")
    try:
        sort = int(saisie)
    except ValueError:
        print("Tapez un chiffre.")
        continue
    if sort in (1, 2, 3):
        break
    print("Choisissez 1, 2 ou 3.")</code></pre>
<p><code>try/except ValueError</code> attrape la conversion impossible, <code>continue</code> relance la question, <code>break</code> sort de la boucle quand la saisie est valide.</p>`}
]
});
