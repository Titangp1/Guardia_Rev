<div align="center">

<h1>Guardia_Rev</h1>

<p><b>Réviser les premiers partiels de GCS1 : cours, QCM corrigés, cartes à répétition espacée, exercices type partiel, entraînements et partiel blanc.</b></p>

<p>
<a href="https://titangp1.github.io/Guardia_Rev/"><img src="https://img.shields.io/badge/Ouvrir_le_site-1d6fd1?style=flat-square&logo=githubpages&logoColor=white" alt="Ouvrir le site"></a>
<img src="https://img.shields.io/badge/version-2.0.0-1f2937?style=flat-square" alt="Version 2.0.0">
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
| Programmation & DevSecOps | 11 | 42 | 39 | 6 |
| HTML & CSS | 7 | 24 | 25 | 2 |
| Analyse de menace & gestion d'incident | 8 | 18 | 21 | 2 |
| Anglais cyber | 5 | 23 | 37 | 2 |
| **Total** | **63** | **205** | **224** | **29** |

Les questions et exercices tirés des anciens sujets sont marqués « Partiel 2025 » ou « ancien partiel ».

## Fonctionnalités

| Fonction | Détail |
|:--|:--|
| **Tableau de bord** | Série de jours, activité sur 14 jours, maîtrise globale, compte à rebours avant les partiels, liste « À faire maintenant » |
| **Cours** | Sommaire, sections à cocher « lu », impression propre (PDF) |
| **QCM** | Ordre aléatoire, plusieurs bonnes réponses possibles, explications, correction détaillée, « Refaire mes erreurs » |
| **Cartes** | Répétition espacée (boîtes de Leitner : 1, 2, 4, 8, 16 jours) |
| **Révisions du jour** | Cartes échues et erreurs de QCM de toutes les matières, QCM express |
| **Entraînements** | Générateurs infinis : sous-réseaux (masque, réseau, broadcast, plage), ports, modèle OSI, commandes Linux/Git/Windows/Docker |
| **Partiel blanc** | Matières au choix, chrono, correction et score par matière à la fin, historique |
| **Lexique** | Toutes les notions des cartes, filtrables |
| **Recherche** | <kbd>Ctrl</kbd> + <kbd>K</kbd> ou <kbd>/</kbd> : cours, cartes, questions, exercices |
| **Clavier** | <kbd>A</kbd>–<kbd>D</kbd> répondre, <kbd>Entrée</kbd> valider, <kbd>Espace</kbd> retourner une carte, <kbd>1</kbd>/<kbd>2</kbd> noter une carte |

## Lancer en local

```bash
python -m http.server 8000
```

puis ouvrir <http://localhost:8000>. Pour tester sans compte Firebase : <http://localhost:8000/?local> (comptes gardés dans le navigateur, uniquement sur localhost).

## Firebase

1. *Authentication → Sign-in method* : activer **E-mail/Mot de passe** et **Google**.
2. *Authentication → Paramètres → Domaines autorisés* : ajouter `titangp1.github.io`.
3. *Authentication → Modèles → Validation de l'adresse e-mail* : coller `firebase/email-verification.html` (objet : « Valide ton compte Guardia_Rev »).
4. *Firestore → Règles* : coller `firebase/firestore.rules`, puis **Publier**.
5. L'objet `firebaseConfig` est dans `assets/config.js`.

**Sécurité.** La configuration Web de Firebase est publique par conception : la protection vient des règles. Firestore n'accepte que les comptes dont l'email se termine par `@guardiaschool.fr` **et** est vérifié, et chacun ne lit et n'écrit que sa propre progression.

## Structure

```text
Guardia_Rev/
├── index.html            application (une seule page)
├── assets/
│   ├── style.css         design sobre (inspiré de shadcn/ui), thème clair et sombre
│   ├── app.js            connexion, navigation, QCM, cartes, révisions, entraînements, recherche
│   ├── config.js         domaine autorisé et configuration Firebase
│   └── data/             une fiche par matière (cours, cartes, QCM, exercices)
└── firebase/
    ├── firestore.rules
    └── email-verification.html
```

Pour ajouter du contenu : éditer le fichier de la matière dans `assets/data/`. Ajouter les nouvelles questions et cartes **à la fin** des listes (la progression est liée à leur position). Pour plusieurs bonnes réponses : `a:[0,2]`.

## Crédits

Icônes [Lucide](https://lucide.dev) (licence ISC). Polices Bricolage Grotesque, Figtree et JetBrains Mono (Google Fonts).

<div align="center"><sub>Guardia_Rev · v2.0.0 · Titan_gp1</sub></div>
