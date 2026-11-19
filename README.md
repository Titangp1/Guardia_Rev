<div align="center">

<h1>Guardia_Rev</h1>

<p><b>Réviser les premiers partiels de GCS1 : fiches, QCM corrigés, flashcards, exercices type partiel et partiel blanc.</b></p>

<p>
<a href="https://titangp1.github.io/Guardia_Rev/"><img src="https://img.shields.io/badge/Ouvrir_le_site-1f78c8?style=flat-square&logo=githubpages&logoColor=white" alt="Ouvrir le site"></a>
<img src="https://img.shields.io/badge/version-1.0.0-1f2937?style=flat-square" alt="Version 1.0.0">
<img src="https://img.shields.io/badge/acc%C3%A8s-%40guardiaschool.fr-a8833f?style=flat-square" alt="Accès @guardiaschool.fr">
</p>

<sub>Réalisé par <b>Titan_gp1</b></sub>

</div>

## Présentation

Au lancement, le site demande **obligatoirement** de se connecter ou de créer un compte avec une adresse **@guardiaschool.fr**. Avec Firebase, l'adresse doit aussi être **confirmée par email** : cela prouve qu'on possède vraiment la boîte de l'école.

| Matière | Contenu |
|:--|:--|
| **Introduction ISR** | Modèle OSI, IPv4 et masques, VLAN, DHCP, DNS, Active Directory, pare-feu, DMZ, reverse proxy, virtualisation, ports |
| **Administration, sécurisation & supervision ISR** | Règles OPNsense, PowerShell AD, GPO de sécurité, Squid et ssl_bump, Wazuh, SIEM, IDS, rapport d'incident et IOC |
| **Programmation & DevSecOps** | Python, listes et dictionnaires, HTTP et API REST, JSON, Git, Linux, Docker, CI/CD, SAST/SCA |
| **HTML & CSS** | Structure, balises sémantiques, formulaires, sélecteurs, box model, flexbox, responsive |
| **Analyse de menace & gestion d'incident** | Méthode ORION : faits, hypothèses, confiance, phishing, fraude à l'IBAN, RGPD |
| **Anglais cyber** | Vocabulaire, past simple et present perfect, comparatifs, modaux, présentations |

Chaque matière comporte une **fiche de cours**, un **QCM** (avec explications, et plusieurs bonnes réponses possibles comme au partiel), des **flashcards** et des **exercices type partiel** avec corrigé. Les questions des anciens sujets sont marquées « Partiel 2025 » ou « ancien partiel ». La page **Partiel blanc** tire des questions au hasard, avec un chrono.

## Lancer en local

```bash
python -m http.server 8000
```

puis ouvrir <http://localhost:8000>.

## Brancher Firebase

Tant que `firebase` vaut `null` dans `assets/config.js`, le site tourne en **mode local** : les comptes et la progression restent dans le navigateur.

1. Créer un projet sur la [console Firebase](https://console.firebase.google.com), y ajouter une application **Web** et copier son objet `firebaseConfig`.
2. *Authentication → Sign-in method* : activer **E-mail/Mot de passe**.
3. *Authentication → Paramètres → Domaines autorisés* : ajouter `titangp1.github.io`.
4. *Firestore Database* : créer la base en mode production.
5. *Firestore → Règles* : coller `firebase/firestore.rules`, puis **Publier**.
6. Coller l'objet dans `assets/config.js` à la place de `null`.

**Sécurité.** La configuration Web de Firebase est publique par conception : la protection vient des règles. Firestore n'accepte que les comptes dont l'email se termine par `@guardiaschool.fr` **et** est vérifié, et chacun ne lit et n'écrit que sa propre progression.

## Structure

```text
Guardia_Rev/
├── index.html            application (une seule page)
├── assets/
│   ├── style.css
│   ├── app.js            connexion, navigation, QCM, cartes, exercices, partiel blanc
│   ├── config.js         domaine autorisé et configuration Firebase
│   └── data/             une fiche par matière (cours, cartes, QCM, exercices)
└── firebase/
    └── firestore.rules
```

Pour ajouter des questions : éditer le fichier de la matière dans `assets/data/`. Pour une question à plusieurs bonnes réponses, mettre plusieurs index dans `a` (ex. `a:[0,2]`).

<div align="center"><sub>Guardia_Rev · v1.0.0 · Titan_gp1</sub></div>
