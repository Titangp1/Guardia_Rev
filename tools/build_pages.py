"""Guardia_Rev · génère les pages HTML du site (une par écran).

Toutes les pages partagent le même gabarit : seuls le titre, l'identifiant de page (<body data-page>)
et la présence des données de cours changent. Usage, depuis la racine du dépôt :
    python tools/build_pages.py
"""
from pathlib import Path

VERSION = "7.3.0"
ROOT = Path(__file__).resolve().parent.parent
SITE = "https://guardiarev.space"
DATA = ["isr", "supervision", "fondamentaux", "devsecops", "web", "incident", "anglais", "js", "agenda"]

# fichier, identifiant de page, titre, description, charge les données de cours ?
PAGES = [
    ("index.html", "accueil", "Tableau de bord", "Votre progression, vos révisions du jour et vos défis.", True),
    ("connexion.html", "connexion", "Connexion", "Connexion réservée aux étudiants Guardia (@guardiaschool.fr).", False),
    ("matieres.html", "matieres", "Matières", "Les huit matières des premiers partiels de GCS1.", True),
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
    ("agenda.html", "agenda", "Agenda", "Cours, langues, vacances et partiels de la promo.", True),
    ("lexique.html", "lexique", "Lexique", "Toutes les notions à connaître, filtrables.", True),
]

ICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' "
        "fill='%2312203a'/%3E%3Cpath d='M44 22a15 15 0 1 0 3 12H32' fill='none' stroke='%23fff' stroke-width='7' stroke-linecap='round'/%3E%3C/svg%3E")

TEMPLATE = """<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title} · Guardia_Rev</title>
<meta name="description" content="{desc}">
<meta name="author" content="Titan_gp1">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#12203a">
<meta name="theme-color" content="#f4eee3" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0b1322" media="(prefers-color-scheme: dark)">
<link rel="icon" href="assets/logo.svg?v={v}" type="image/svg+xml">
<link rel="icon" href="assets/icon-180.png?v={v}" type="image/png" sizes="180x180">
<link rel="apple-touch-icon" href="assets/icon-180.png?v={v}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Guardia_Rev">
<meta property="og:locale" content="fr_FR">
<meta property="og:title" content="{ogtitle}">
<meta property="og:description" content="{ogdesc}">
<meta property="og:url" content="{site}/{file}">
<meta property="og:image" content="{site}/assets/og.png?v={v}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Guardia_Rev, révisions des partiels GCS1">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{ogtitle}">
<meta name="twitter:description" content="{ogdesc}">
<meta name="twitter:image" content="{site}/assets/og.png?v={v}">
<script>(function(){{try{{var t=localStorage.getItem('gr-theme');if(t)document.documentElement.dataset.theme=t}}catch(e){{}}}})();</script>
<link rel="stylesheet" href="assets/style.css?v={v}">
<link rel="stylesheet" href="assets/theme.css?v={v}">
<link rel="stylesheet" href="assets/studio.css?v={v}">
</head>
<body data-page="{page}">
<div id="root"><div class="loading"><div class="spin" role="status" aria-label="Chargement"></div></div></div>
<div class="toasts" id="toasts" aria-live="polite"></div>
<noscript><p style="padding:20px">Guardia_Rev a besoin de JavaScript.</p></noscript>
<script src="assets/config.js?v={v}"></script>
{data}<script src="assets/app.js?v={v}"></script>
<script src="assets/motion.js?v={v}"></script>
</body>
</html>
"""

for file, page, title, desc, data in PAGES:
    scripts = "".join(f'<script src="assets/data/{d}.js?v={VERSION}"></script>\n' for d in DATA) if data else ""
    (ROOT / file).write_text(TEMPLATE.format(title=title, desc=desc, icon=ICON, v=VERSION, page=page, data=scripts, site=SITE, file="" if file == "index.html" else file, ogtitle="Guardia_Rev · Révisions des partiels GCS1" if page == "accueil" else f"{title} · Guardia_Rev", ogdesc="Cours, QCM corrigés, cartes à répétition espacée, partiels blancs, agenda de la promo, XP et défis entre étudiants de Guardia (GCS1)." if page in ("accueil", "connexion") else desc), encoding="utf-8")
    print("écrit", file)
