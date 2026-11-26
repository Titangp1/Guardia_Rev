<div align="center">

<h1>Guardia_Rev</h1>

<p><b>Réviser les premiers partiels de GCS1 : cours, QCM corrigés, cartes à répétition espacée, exercices type partiel, entraînements, partiel blanc, XP, classement et défis entre étudiants.</b></p>

<p>
<a href="https://titangp1.github.io/Guardia_Rev/"><img src="https://img.shields.io/badge/Ouvrir_le_site-1d6fd1?style=flat-square&logo=githubpages&logoColor=white" alt="Ouvrir le site"></a>
<img src="https://img.shields.io/badge/version-7.3.0-1f2937?style=flat-square" alt="Version 7.3.0">
<img src="https://img.shields.io/badge/acc%C3%A8s-%40guardiaschool.fr-a77d2f?style=flat-square" alt="Accès @guardiaschool.fr">
</p>

<sub>Réalisé par <b>Titan_gp1</b></sub>

</div>

## Présentation

Au lancement, le site demande **obligatoirement** de se connecter ou de créer un compte avec une adresse **@guardiaschool.fr** (email + mot de passe avec confirmation par email, ou compte Google de l'école). La progression est enregistrée dans Firebase et suit l'étudiant sur tous ses appareils.

| Matière | Cours | QCM | Cartes | Exercices |
|:--|--:|--:|--:|--:|
| Introduction ISR | 12 | 41 | 37 | 7 |
| Administration, sécurisation & supervision ISR | 11 | 37 | 36 | 8 |
| Fondamentaux de la cybersécurité | 9 | 20 | 29 | 2 |
| Programmation & DevSecOps | 12 | 49 | 49 | 6 |
| HTML & CSS | 7 | 24 | 25 | 2 |
| Analyse de menace & gestion d'incident | 8 | 18 | 21 | 2 |
| Anglais cyber | 5 | 23 | 37 | 2 |
| JavaScript & API | 12 | 38 | 37 | 6 |
| **Total** | **76** | **250** | **271** | **35** |

Les questions et exercices tirés des anciens sujets sont marqués « Partiel 2025 » ou « ancien partiel ».

## Fonctionnalités

| Fonction | Détail |
|:--|:--|
| **XP et niveaux** | +10 XP par bonne réponse, +3 par carte, +15 par section lue, +40 par exercice, +5 par entraînement, bonus de série ; niveaux de « Script kiddie » à « RSSI » |
| **Badges** | 13 badges (série de 7 jours, sans faute, 100 cartes, masque d'or, gladiateur…) |
| **Profil** | Photo (recadrée en 192 px), pseudo, groupe, bio, apparition ou non dans le classement |
| **Classement** | Podium, rang, nombre d'étudiants inscrits, profils publics des joueurs |
| **Défis** | Duel sur les mêmes 10 questions : meilleur score gagne, le temps départage, +70 XP à la victoire |
| **Tableau de bord** | Niveau et XP, série, classement, défis à relever, activité, maîtrise, compte à rebours, « À faire maintenant » |
| **Pages séparées** | Une page HTML par écran, fil d'Ariane, connexion obligatoire sur chaque page avec retour à la page demandée |
| **Cours** | Sommaire, sections à cocher « lu », impression propre (PDF) |
| **QCM** | Ordre aléatoire, plusieurs bonnes réponses possibles, explications, correction détaillée, « Refaire mes erreurs » |
| **Cartes** | Répétition espacée (boîtes de Leitner : 1, 2, 4, 8, 16 jours) |
| **Révisions du jour** | Cartes échues et erreurs de QCM de toutes les matières, QCM express |
| **Entraînements** | Générateurs infinis : sous-réseaux (masque, réseau, broadcast, plage), ports, modèle OSI, commandes Linux/Git/Windows/Docker |
| **Partiel blanc** | Matières au choix, chrono, correction et score par matière à la fin, historique |
| **Lexique** | Toutes les notions des cartes, filtrables |
| **Recherche** | <kbd>Ctrl</kbd> + <kbd>K</kbd> ou <kbd>/</kbd> : cours, cartes, questions, exercices |
| **Mobile** | Barre de navigation en bas (Accueil, Réviser, Partiel, Entraîner, Matières), cibles tactiles de 44 px |
| **Accessibilité** | Contrastes AA vérifiés, lien « Aller au contenu », focus visible, corrections qui ne reposent pas sur la couleur seule, mouvement réduit respecté |
| **Clavier** | <kbd>A</kbd>–<kbd>D</kbd> répondre, <kbd>Entrée</kbd> valider, <kbd>Espace</kbd> retourner une carte, <kbd>1</kbd>/<kbd>2</kbd> noter une carte |

## Lancer en local

```bash
python -m http.server 8000
```

puis ouvrir <http://localhost:8000>. Pour tester sans compte Firebase : <http://localhost:8000/?local> (comptes gardés dans le navigateur, uniquement sur localhost ; le mode reste actif pendant la session, de page en page).

## Agenda

`assets/data/agenda.js` est généré depuis l'agenda iCal de l'école par `python tools/agenda.py`.
Le lien iCal contient un **jeton personnel** : il n'est jamais commité. Le script le lit dans la variable
d'environnement `AGENDA_URL` ou dans `tools/.agenda-url` (ignoré par Git). Seuls la date, les horaires,
l'intitulé et la salle sont publiés. Relancer le script puis pousser pour mettre l'agenda à jour.
Le compte à rebours de l'accueil utilise la prochaine session « Partiels » si l'étudiant n'a pas saisi de date.

## Firebase

1. *Authentication → Sign-in method* : activer **E-mail/Mot de passe** et **Google**. Dans E-mail/Mot de passe, activer aussi **Lien envoyé par e-mail (connexion sans mot de passe)** : les comptes Google doivent ouvrir une fois un lien reçu par mail avant d'accéder au site.
2. *Authentication → Paramètres → Domaines autorisés* : ajouter `titangp1.github.io`.
3. *Authentication → Modèles → Validation de l'adresse e-mail* : coller `firebase/email-verification.html` (objet : « Valide ton compte Guardia_Rev »).
4. *Firestore → Règles* : coller `firebase/firestore.rules`, puis **Publier**. À refaire après chaque modification du fichier (profils et défis depuis la v3).
5. L'objet `firebaseConfig` est dans `assets/config.js`.
6. Adresses interdites : leurs empreintes SHA-256 (email en minuscules) sont dans `blocked` de `assets/config.js` **et** dans `banned()` de `firebase/firestore.rules` ; garder les deux listes identiques.

**Sécurité.** La configuration Web de Firebase est publique par conception : la protection vient des règles. Firestore n'accepte que les comptes `@guardiaschool.fr` vérifiés et non bannis. La progression est privée ; le profil public (pseudo, photo, XP, badges) est visible des seuls étudiants connectés. Les XP ne peuvent que monter, de 3000 au plus par écriture, et un défi n'est lisible et jouable que par ses deux joueurs. Les XP sont calculés dans le navigateur : les règles limitent la triche sans la rendre impossible (il faudrait des Cloud Functions, offre payante).

## Structure

```text
Guardia_Rev/
├── index.html            tableau de bord
├── connexion.html        connexion et inscription (seule page accessible sans compte)
├── matieres.html         les 8 matières et la progression
├── cours.html ?m=…       cours d'une matière (#s3 pour aller à la section 3)
├── qcm.html ?m=…         QCM d'une matière
├── cartes.html ?m=…      cartes à répétition espacée
├── exercices.html ?m=…   exercices type partiel
├── revisions.html        cartes à revoir, erreurs, QCM express
├── partiel.html          partiel blanc chronométré
├── entrainements.html ?t=sousreseaux|ports|osi|commandes
├── agenda.html ?tout=1    agenda de la promo (cours, langues, vacances, partiels)
├── lexique.html ?m=… ?q=…
├── defis.html ?adv=…     défis entre étudiants
├── classement.html       classement et nombre d'inscrits
├── joueur.html ?id=…     profil public d'un étudiant
├── profil.html           mon profil, photo, badges, réglages
├── assets/
│   ├── style.css         mise en page et composants
│   ├── theme.css         thème éditorial v6 (papier crème, bleu nuit, or ; menu plein écran)
│   ├── studio.css        couche v7 : bandeau défilant, boutons flèche, frise (palette v6)
│   ├── motion.js         animations d'apparition et en-tête qui se cache au défilement
│   ├── app.js            code commun à toutes les pages (connexion, navigation, QCM, cartes, défis…)
│   ├── config.js         domaine autorisé, adresses bannies (empreintes) et configuration Firebase
│   └── data/             une fiche par matière (cours, cartes, QCM, exercices)
├── firebase/
│   ├── firestore.rules
│   └── email-verification.html
└── tools/build_pages.py  régénère les pages HTML (titres, scripts, version)
```

Pour ajouter du contenu : éditer le fichier de la matière dans `assets/data/`. Ajouter les nouvelles questions et cartes **à la fin** des listes (la progression est liée à leur position). Pour plusieurs bonnes réponses : `a:[0,2]`.

## Crédits

Icônes [Lucide](https://lucide.dev) (licence ISC). Polices Inter et JetBrains Mono (Google Fonts). Choix de design guidés par les skills ui-ux-pro-max, no-ai-design-slop et beautiful-shadows.

<div align="center"><sub>Guardia_Rev · v7.3.0 · Titan_gp1</sub></div>
