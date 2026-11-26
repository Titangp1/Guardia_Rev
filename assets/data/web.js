/* Guardia_Rev · HTML & CSS. */
window.GR=window.GR||{subjects:[]};
GR.subjects.push({
id:'web', name:'HTML & CSS', icon:'</>', color:'linear-gradient(140deg,#e2622e,#a63d14)',
exam:'Programmation · partie web',
short:'Structure d\'une page, balises sémantiques, formulaires, sélecteurs CSS, box model, flexbox, responsive.',
intro:'La partie web du module de programmation (cours « HTML - CSS - GIT » et le site réalisé en séance 2). Les questions portent sur la structure d\'une page, les balises et la mise en forme CSS.',
fiche:[
{t:'Structure d\'une page HTML',h:`
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="fr"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;Mon donjon&lt;/title&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;h1&gt;Bienvenue&lt;/h1&gt;
  &lt;p&gt;Un paragraphe avec un &lt;a href="https://guardia.school"&gt;lien&lt;/a&gt;.&lt;/p&gt;
  &lt;img src="dragon.jpeg" alt="Un dragon rouge"&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
<ul><li><code>&lt;!DOCTYPE html&gt;</code> : indique du HTML5.</li>
<li><code>&lt;head&gt;</code> : informations sur la page (non affichées) : encodage, titre de l'onglet, liens vers le CSS.</li>
<li><code>&lt;body&gt;</code> : le contenu visible.</li>
<li>Une <b>balise</b> s'ouvre et se ferme (<code>&lt;p&gt;…&lt;/p&gt;</code>) ; certaines sont orphelines (<code>&lt;img&gt;</code>, <code>&lt;br&gt;</code>, <code>&lt;meta&gt;</code>, <code>&lt;input&gt;</code>).</li>
<li>Un <b>attribut</b> précise une balise : <code>href</code> (lien), <code>src</code> (source), <code>alt</code> (texte alternatif, obligatoire pour l'accessibilité), <code>id</code> (unique), <code>class</code> (réutilisable).</li></ul>`},
{t:'Balises essentielles et sémantique',h:`
<ul><li>Titres <code>&lt;h1&gt;</code> à <code>&lt;h6&gt;</code> (un seul h1 par page), paragraphe <code>&lt;p&gt;</code>, retour à la ligne <code>&lt;br&gt;</code>.</li>
<li>Mise en valeur : <code>&lt;strong&gt;</code> (importance, gras), <code>&lt;em&gt;</code> (emphase, italique).</li>
<li>Listes : <code>&lt;ul&gt;</code> non ordonnée, <code>&lt;ol&gt;</code> ordonnée, éléments <code>&lt;li&gt;</code>.</li>
<li>Lien <code>&lt;a href="…" target="_blank"&gt;</code>, image <code>&lt;img src alt&gt;</code>.</li>
<li>Tableau : <code>&lt;table&gt;</code>, <code>&lt;tr&gt;</code> ligne, <code>&lt;th&gt;</code> cellule d'en-tête, <code>&lt;td&gt;</code> cellule.</li>
<li>Conteneurs génériques : <code>&lt;div&gt;</code> (bloc), <code>&lt;span&gt;</code> (en ligne).</li></ul>
<h3>Balises sémantiques (HTML5)</h3>
<p><code>&lt;header&gt;</code> en-tête, <code>&lt;nav&gt;</code> navigation, <code>&lt;main&gt;</code> contenu principal, <code>&lt;section&gt;</code> section thématique, <code>&lt;article&gt;</code> contenu autonome, <code>&lt;aside&gt;</code> contenu annexe, <code>&lt;footer&gt;</code> pied de page. Elles donnent du <b>sens</b> : meilleur référencement et accessibilité (lecteurs d'écran).</p>
<h3>Bloc ou en ligne</h3>
<p>Un élément <b>bloc</b> (div, p, h1, section) prend toute la largeur et commence sur une nouvelle ligne. Un élément <b>en ligne</b> (span, a, strong, img) reste dans le flux du texte.</p>`},
{t:'Formulaires',h:`
<pre><code>&lt;form action="/login" method="post"&gt;
  &lt;label for="mail"&gt;Email&lt;/label&gt;
  &lt;input type="email" id="mail" name="mail" required&gt;
  &lt;label for="mdp"&gt;Mot de passe&lt;/label&gt;
  &lt;input type="password" id="mdp" name="mdp" minlength="8"&gt;
  &lt;select name="classe"&gt;&lt;option&gt;GCS1&lt;/option&gt;&lt;/select&gt;
  &lt;textarea name="msg"&gt;&lt;/textarea&gt;
  &lt;button type="submit"&gt;Envoyer&lt;/button&gt;
&lt;/form&gt;</code></pre>
<ul><li><code>action</code> : URL qui reçoit les données ; <code>method</code> : GET (données dans l'URL) ou POST (dans le corps de la requête, pour les données sensibles).</li>
<li>Le <code>for</code> du label correspond à l'<code>id</code> du champ ; le <code>name</code> est la clé envoyée au serveur.</li>
<li>Types d'input : text, email, password, number, date, checkbox, radio, file, submit.</li></ul>
<div class="trap"><b>Sécurité</b> : la validation HTML (<code>required</code>, <code>type="email"</code>) se contourne facilement : le serveur doit <b>toujours</b> revalider. Ne jamais faire confiance aux données du client (injections, XSS).</div>`},
{t:'CSS : syntaxe et sélecteurs',h:`
<p>Le CSS met en forme le HTML. Trois façons de l'inclure : fichier externe <code>&lt;link rel="stylesheet" href="styles.css"&gt;</code> (recommandé), balise <code>&lt;style&gt;</code> dans le head, attribut <code>style="…"</code> (à éviter).</p>
<pre><code>sélecteur {
  propriété: valeur;
}
h1 { color: #e8492b; font-size: 2rem; }</code></pre>
<div class="tbl"><table><tr><th>Sélecteur</th><th>Cible</th></tr>
<tr><td><code>p</code></td><td>toutes les balises p</td></tr>
<tr><td><code>.carte</code></td><td>les éléments de classe carte</td></tr>
<tr><td><code>#menu</code></td><td>l'élément d'id menu (unique)</td></tr>
<tr><td><code>nav a</code></td><td>les liens <i>dans</i> un nav (descendants)</td></tr>
<tr><td><code>ul &gt; li</code></td><td>les li enfants directs</td></tr>
<tr><td><code>h1, h2</code></td><td>les h1 et les h2</td></tr>
<tr><td><code>a:hover</code></td><td>un lien survolé (pseudo-classe)</td></tr>
<tr><td><code>*</code></td><td>tous les éléments</td></tr></table></div>
<h3>Cascade et spécificité</h3>
<p>Quand plusieurs règles s'appliquent : la plus <b>spécifique</b> gagne (style inline &gt; <b>id</b> &gt; <b>classe</b>/pseudo-classe &gt; balise) ; à spécificité égale, la <b>dernière</b> écrite gagne. <code>!important</code> force une valeur (à éviter).</p>`},
{t:'Box model, unités et couleurs',h:`
<p>Chaque élément est une boîte : <b>content</b> → <b>padding</b> (marge intérieure) → <b>border</b> → <b>margin</b> (marge extérieure).</p>
<pre><code>.carte {
  width: 300px;
  padding: 16px;           /* intérieur */
  border: 2px solid #333;
  margin: 20px auto;       /* extérieur ; auto centre horizontalement */
  box-sizing: border-box;  /* width inclut padding et border */
}</code></pre>
<p>Sans <code>box-sizing: border-box</code>, la largeur réelle = width + padding + border (300 + 32 + 4 = 336 px).</p>
<p><b>Unités</b> : <code>px</code> (fixe), <code>%</code> (du parent), <code>em</code> (taille de police du parent), <code>rem</code> (taille de police de la racine), <code>vw/vh</code> (% de la fenêtre).</p>
<p><b>Couleurs</b> : nom (<code>red</code>), hexadécimal (<code>#ff0000</code>), <code>rgb(255,0,0)</code>, <code>rgba(255,0,0,.5)</code> (avec transparence).</p>
<p>Texte : <code>font-family</code>, <code>font-size</code>, <code>font-weight</code>, <code>text-align</code>, <code>line-height</code>, <code>color</code>. Fond : <code>background-color</code>, <code>background-image</code>.</p>`},
{t:'Accessibilité et bonnes pratiques',h:`
<ul><li>Un seul <code>&lt;h1&gt;</code>, puis des titres dans l'ordre (h2, h3) : les lecteurs d'écran naviguent par titres.</li>
<li><code>alt</code> descriptif sur les images porteuses de sens ; <code>alt=""</code> pour les images décoratives.</li>
<li>Chaque champ de formulaire a un <code>&lt;label&gt;</code> relié ; un bouton est un <code>&lt;button&gt;</code>, un lien un <code>&lt;a&gt;</code>.</li>
<li><b>Contraste</b> suffisant entre texte et fond (au moins 4,5:1 pour le texte courant) ; ne jamais transmettre une information uniquement par la couleur.</li>
<li>Tout doit être utilisable <b>au clavier</b> (Tab) avec un focus visible.</li>
<li><code>lang="fr"</code> sur <code>&lt;html&gt;</code> pour la bonne prononciation.</li></ul>
<h3>Chemins de fichiers</h3>
<p><b>Relatif</b> au fichier HTML : <code>images/dragon.jpeg</code>, <code>../styles.css</code> (dossier parent). <b>Absolu</b> : <code>https://site.fr/img.png</code> ou <code>/img.png</code> (racine du site). Une image qui ne s'affiche pas vient souvent d'un mauvais chemin ou d'une différence de majuscules (<code>Dragon.jpeg</code> ≠ <code>dragon.jpeg</code> sur un serveur Linux).</p>
<h3>Lien externe sûr</h3>
<p><code>&lt;a href="…" target="_blank" rel="noopener"&gt;</code> : <code>rel="noopener"</code> empêche la page ouverte de manipuler la page d'origine.</p>`},
{t:'Mise en page : display, flexbox, responsive',h:`
<p><code>display</code> : <code>block</code>, <code>inline</code>, <code>inline-block</code>, <code>none</code> (masqué), <code>flex</code>, <code>grid</code>.</p>
<pre><code>.menu {
  display: flex;
  justify-content: space-between;  /* axe principal (horizontal) */
  align-items: center;             /* axe secondaire (vertical) */
  gap: 12px;
  flex-wrap: wrap;
}</code></pre>
<p><code>flex-direction: column</code> passe l'axe principal à la verticale.</p>
<pre><code>.galerie { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }</code></pre>
<p><code>position</code> : <code>static</code> (défaut), <code>relative</code>, <code>absolute</code> (par rapport au parent positionné), <code>fixed</code> (par rapport à la fenêtre), <code>sticky</code>.</p>
<h3>Responsive</h3>
<pre><code>@media (max-width: 600px) {
  .galerie { grid-template-columns: 1fr; }
}</code></pre>
<p>La balise <code>&lt;meta name="viewport"&gt;</code> est indispensable pour que le site s'adapte au mobile.</p>`}
],
cards:[
['Rôle de <code>&lt;head&gt;</code> ?','Contenir les informations sur la page (encodage, titre, CSS), non affichées.'],
['Rôle de l\'attribut alt d\'une image ?','Texte alternatif : lu par les lecteurs d\'écran et affiché si l\'image ne charge pas.'],
['Différence id / class ?','id : unique dans la page (#id). class : réutilisable (.classe).'],
['ul vs ol ?','ul : liste à puces (non ordonnée). ol : liste numérotée.'],
['th vs td ?','th : cellule d\'en-tête. td : cellule de données.'],
['Citez 4 balises sémantiques HTML5.','header, nav, main, section, article, aside, footer.'],
['div vs span ?','div : conteneur bloc. span : conteneur en ligne.'],
['GET vs POST dans un formulaire ?','GET : données dans l\'URL. POST : données dans le corps de la requête.'],
['Lien entre label et input ?','Le for du label = l\'id de l\'input.'],
['3 façons d\'ajouter du CSS ?','Fichier externe (link), balise style, attribut style.'],
['Sélectionner la classe carte ? L\'id menu ?','<code>.carte</code> · <code>#menu</code>'],
['Ordre de la spécificité CSS ?','inline &gt; id &gt; classe/pseudo-classe &gt; balise.'],
['Ordre du box model de l\'intérieur vers l\'extérieur ?','content → padding → border → margin.'],
['Effet de box-sizing: border-box ?','width inclut le padding et la bordure.'],
['rem vs em ?','rem : relatif à la police de la racine (html). em : relatif à la police du parent.'],
['Centrer horizontalement un bloc de largeur fixe ?','<code>margin: 0 auto;</code>'],
['justify-content vs align-items (flexbox) ?','justify-content : axe principal. align-items : axe secondaire.'],
['À quoi sert @media ?','Appliquer des règles selon la taille d\'écran : site responsive.'],
['Masquer un élément en CSS ?','<code>display: none;</code>'],
['Pourquoi revalider côté serveur ?','La validation HTML se contourne : le serveur ne doit jamais faire confiance au client.'],
['alt d\'une image purement décorative ?','<code>alt=""</code> (vide) : le lecteur d\'écran l\'ignore.'],
['Contraste minimal recommandé pour le texte courant ?','4,5:1 (WCAG niveau AA).'],
['Chemin relatif vers styles.css situé dans le dossier parent ?','<code>../styles.css</code>'],
['Pourquoi ajouter rel="noopener" à un lien target="_blank" ?','Pour que la page ouverte ne puisse pas manipuler la page d\'origine.'],
['Rôle de la balise meta viewport ?','Adapter la largeur de la page à l\'écran du mobile.']
],
quiz:[
{q:'Quelle balise contient le contenu visible de la page ?',o:['<head>','<body>','<meta>','<title>'],a:[1],e:'head contient les métadonnées ; body le contenu affiché.'},
{q:'Quelle balise définit le titre affiché dans l\'onglet du navigateur ?',o:['<h1>','<title>','<header>','<meta name="title">'],a:[1],e:'<title> dans le head. <h1> est le titre principal dans la page.'},
{q:'Quel attribut d\'une image est essentiel pour l\'accessibilité ?',o:['src','alt','href','class'],a:[1],e:'alt décrit l\'image pour les lecteurs d\'écran.'},
{q:'Quelle balise crée un lien hypertexte ?',o:['<link>','<a>','<href>','<url>'],a:[1],e:'<a href="...">. <link> sert à relier une feuille de style dans le head.'},
{q:'Quelles balises sont sémantiques ?',o:['<nav>','<div>','<footer>','<article>'],a:[0,2,3],e:'div est un conteneur générique sans signification.'},
{q:'Quelle liste est numérotée ?',o:['<ul>','<ol>','<dl>','<li>'],a:[1],e:'ol = ordered list. li est un élément de liste.'},
{q:'Dans un formulaire, quelle méthode n\'affiche pas les données dans l\'URL ?',o:['GET','POST'],a:[1],e:'POST envoie les données dans le corps de la requête.'},
{q:'Quel sélecteur CSS cible les éléments de classe « carte » ?',o:['#carte','.carte','carte','*carte'],a:[1],e:'Le point pour les classes, le dièse pour les id.'},
{q:'Quel sélecteur cible uniquement les liens situés dans un <nav> ?',o:['nav, a','nav a','nav + a','a nav'],a:[1],e:'L\'espace désigne un descendant. La virgule regroupe deux sélecteurs.'},
{q:'Laquelle de ces règles l\'emporte sur un même paragraphe ?',code:'p { color: blue; }\n.texte { color: green; }\n#intro { color: red; }\n/* <p id="intro" class="texte"> */',o:['blue','green','red'],a:[2],e:'L\'id est plus spécifique que la classe, elle-même plus spécifique que la balise.'},
{q:'Avec width: 200px; padding: 10px; border: 5px; et box-sizing: content-box, quelle est la largeur totale ?',o:['200px','215px','230px','220px'],a:[2],e:'200 + 2×10 + 2×5 = 230 px. Avec border-box, ce serait 200 px.'},
{q:'Quelle propriété définit l\'espace entre la bordure et le contenu ?',o:['margin','padding','gap','border-spacing'],a:[1],e:'padding = intérieur ; margin = extérieur.'},
{q:'En flexbox, quelle propriété aligne les éléments sur l\'axe principal ?',o:['align-items','justify-content','flex-wrap','text-align'],a:[1],e:'justify-content sur l\'axe principal, align-items sur l\'axe secondaire.'},
{q:'Quelle règle rend un site adapté aux petits écrans ?',o:['@import','@media (max-width: 600px) { … }','@font-face','!important'],a:[1],e:'Les media queries appliquent des styles selon la largeur de l\'écran.'},
{q:'Quelle unité est relative à la taille de police de l\'élément racine ?',o:['em','rem','px','%'],a:[1],e:'rem = root em.'},
{q:'Comment cacher un élément tout en libérant sa place ?',o:['visibility: hidden','display: none','opacity: 0','color: transparent'],a:[1],e:'visibility:hidden et opacity:0 cachent mais gardent la place.'},
{q:'La validation required d\'un champ HTML suffit-elle à sécuriser les données ?',o:['Oui','Non, il faut aussi valider côté serveur'],a:[1],e:'Le client peut modifier la page ou envoyer une requête directement : le serveur doit revalider.'},
{q:'Quel élément est de type « en ligne » par défaut ?',o:['<div>','<p>','<span>','<section>'],a:[2],e:'span, a, strong sont en ligne ; div, p, section sont des blocs.'},
{q:'Quelles pratiques améliorent l\'accessibilité ?',o:['Un label relié à chaque champ','Un texte gris clair sur fond blanc','Une navigation possible au clavier','Un attribut alt descriptif'],a:[0,2,3],e:'Un contraste trop faible rend le texte illisible pour beaucoup de personnes.'},
{q:'Le fichier index.html est dans site/, l\'image dans site/images/. Quel src écrire ?',o:['/images/dragon.jpeg','images/dragon.jpeg','../images/dragon.jpeg','C:\\site\\images\\dragon.jpeg'],a:[1],e:'Chemin relatif depuis le dossier du fichier HTML.'},
{q:'Quelle balise relie une feuille de style externe ?',o:['<style src="styles.css">','<link rel="stylesheet" href="styles.css">','<css href="styles.css">','<script src="styles.css">'],a:[1],e:'Dans le <head>.'},
{q:'Combien de <h1> par page est-il recommandé ?',o:['Aucun','Un seul','Un par section','Autant que nécessaire'],a:[1],e:'Le h1 est le titre principal de la page.'},
{q:'Quelle propriété CSS change la couleur du texte ?',o:['background-color','font-color','color','text-color'],a:[2],e:'font-color et text-color n\'existent pas.'},
{q:'Quelle valeur de position garde un élément fixe dans la fenêtre pendant le défilement ?',o:['relative','absolute','fixed','static'],a:[2],e:'sticky le colle seulement une fois atteint dans son conteneur.'}
],
exos:[
{t:'Écrire une page HTML',pts:'entraînement',q:`<p>Écrivez une page HTML5 complète avec : un en-tête contenant un titre et un menu de 3 liens, une section principale avec une image d'un dragon et un paragraphe, et un pied de page. Reliez-la à <code>styles.css</code>.</p>`,r:`
<pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="fr"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;meta name="viewport" content="width=device-width, initial-scale=1.0"&gt;
  &lt;title&gt;Le donjon&lt;/title&gt;
  &lt;link rel="stylesheet" href="styles.css"&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;
    &lt;h1&gt;Le donjon&lt;/h1&gt;
    &lt;nav&gt;
      &lt;a href="index.html"&gt;Accueil&lt;/a&gt;
      &lt;a href="monstres.html"&gt;Monstres&lt;/a&gt;
      &lt;a href="contact.html"&gt;Contact&lt;/a&gt;
    &lt;/nav&gt;
  &lt;/header&gt;
  &lt;main&gt;
    &lt;section&gt;
      &lt;img src="dragon.jpeg" alt="Un dragon rouge crachant du feu"&gt;
      &lt;p&gt;Le dragon garde le trésor du donjon.&lt;/p&gt;
    &lt;/section&gt;
  &lt;/main&gt;
  &lt;footer&gt;&lt;p&gt;© 2026 · GCS1&lt;/p&gt;&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>`},
{t:'Mettre en forme en CSS',pts:'entraînement',q:`<p>Pour la page précédente, écrivez le CSS : menu horizontal avec espacement régulier, liens sans soulignement qui changent de couleur au survol, image limitée à la largeur de son conteneur, et sur mobile (moins de 600 px) un menu vertical.</p>`,r:`
<pre><code>* { box-sizing: border-box; }
body { font-family: Arial, sans-serif; margin: 0; }
header { display: flex; justify-content: space-between; align-items: center; padding: 16px; background: #13202c; color: white; }
nav { display: flex; gap: 16px; }
nav a { color: white; text-decoration: none; }
nav a:hover { color: #ff7a52; }
img { max-width: 100%; height: auto; }

@media (max-width: 600px) {
  header, nav { flex-direction: column; }
}</code></pre>`}
]
});
