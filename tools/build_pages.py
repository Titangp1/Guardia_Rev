"""Guardia_Rev · génère les pages HTML du site (une par écran).

Toutes les pages partagent le même gabarit : seuls le titre, l'identifiant de page (<body data-page>)
et la présence des données de cours changent. Usage, depuis la racine du dépôt :
    python tools/build_pages.py
"""
from pathlib import Path

VERSION = "4.0.0"
ROOT = Path(__file__).resolve().parent.parent
DATA = ["isr", "supervision", "fondamentaux", "devsecops", "web", "incident", "anglais"]

# fichier, identifiant de page, titre, description, charge les données de cours ?
PAGES = [
    ("index.html", "accueil", "Tableau de bord", "Votre progression, vos révisions du jour et vos défis.", True),
    ("connexion.html", "connexion", "Connexion", "Connexion réservée aux étudiants Guardia (@guardiaschool.fr).", False),
    ("matieres.html", "matieres", "Matières", "Les sept matières des premiers partiels de GCS1.", True),
    ("cours.html", "cours", "Cours", "Fiche de cours de la matière.", True),
    ("qcm.html", "qcm", "QCM", "QCM corrigés de la matière.", True),
    ("cartes.html", "cartes", "Cartes", "Cartes de révision à répétition espacée.", True),
    ("exercices.html", "exercices", "Exercices", "Exercices type partiel avec corrigé.", True),
    ("revisions.html", "revisions", "Révisions du jour", "Cartes à revoir et erreurs à refaire.", True),
    ("defis.html", "defis", "Défis", "Défiez un camarade sur les mêmes questions.", True),
    ("classement.html", "classement", "Classement", "Classement des étudiants par XP.", True),
    ("joueur.html", "joueur", "Profil d'un joueur", "Profil public d'un étudiant.", True),
    ("profil.html", "profil", "Mon profil", "Votre profil, vos badges et vos réglages.", True),
    ("partiel.html", "partiel", "Partiel blanc", "Partiel blanc chronométré, toutes matières.", True),
    ("entrainements.html", "entrainements", "Entraînements", "Sous-réseaux, ports, modèle OSI et commandes.", True),
    ("lexique.html", "lexique", "Lexique", "Toutes les notions à connaître, filtrables.", True),
]

ICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' "
        "fill='%232563eb'/%3E%3Cpath d='M44 22a15 15 0 1 0 3 12H32' fill='none' stroke='%23fff' stroke-width='7' stroke-linecap='round'/%3E%3C/svg%3E")

TEMPLATE = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title} · Guardia_Rev</title>
<meta name="description" content="{desc}">
<meta name="author" content="Titan_gp1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1115" media="(prefers-color-scheme: dark)">
<link rel="icon" href="{icon}">
<script>(function(){{try{{var t=localStorage.getItem('gr-theme');if(t)document.documentElement.dataset.theme=t}}catch(e){{}}}})();</script>
<link rel="stylesheet" href="assets/style.css?v={v}">
</head>
<body data-page="{page}">
<div id="root"><div class="loading"><div class="spin" role="status" aria-label="Chargement"></div></div></div>
<div class="toasts" id="toasts" aria-live="polite"></div>
<noscript><p style="padding:20px">Guardia_Rev a besoin de JavaScript.</p></noscript>
<script src="assets/config.js?v={v}"></script>
{data}<script src="assets/app.js?v={v}"></script>
</body>
</html>
"""

for file, page, title, desc, data in PAGES:
    scripts = "".join(f'<script src="assets/data/{d}.js?v={VERSION}"></script>\n' for d in DATA) if data else ""
    (ROOT / file).write_text(TEMPLATE.format(title=title, desc=desc, icon=ICON, v=VERSION, page=page, data=scripts), encoding="utf-8")
    print("écrit", file)
