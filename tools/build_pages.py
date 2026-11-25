"""Guardia_Rev · génère les pages HTML du site (une par écran).

Toutes les pages partagent le même gabarit : seuls le titre, l'identifiant de page (<body data-page>)
et la présence des données de cours changent. Usage, depuis la racine du dépôt :
    python tools/build_pages.py
"""
from pathlib import Path
import re

VERSION = "4.3.0"
ROOT = Path(__file__).resolve().parent.parent

DATA = [
    "isr",
    "supervision",
    "fondamentaux",
    "devsecops",
    "web",
    "incident",
    "anglais",
]

# (nom_fichier, identifiant_page, titre_onglet, description, charger_donnees_matieres)
PAGES = [
    ("index.html", "index", "Tableau de bord", "Tableau de bord de révision Guardia_Rev", True),
    ("connexion.html", "connexion", "Connexion", "Connexion étudiante @guardiaschool.fr", False),
    ("matieres.html", "matieres", "Matières", "Toutes les matières du programme GCS1", True),
    ("cours.html", "cours", "Cours", "Fiches de cours synthétiques Guardia_Rev", True),
    ("qcm.html", "qcm", "QCM", "QCM corrigés par matière", True),
    ("cartes.html", "cartes", "Cartes", "Cartes mémoire à répétition espacée", True),
    ("exercices.html", "exercices", "Exercices", "Exercices pratiques type partiel", True),
    ("entrainements.html", "entrainements", "Entraînements", "Sessions d'entraînement ciblées", True),
    ("revisions.html", "revisions", "Révisions du jour", "Programme de révision quotidienne", True),
    ("partiel.html", "partiel", "Partiel blanc", "Simulation d'examen chronométrée", True),
    ("lexique.html", "lexique", "Lexique", "Glossaire cybersécurité, réseau et DevSecOps", True),
    ("profil.html", "profil", "Mon profil", "Gestion du profil, avatar et statistiques", False),
    ("joueur.html", "joueur", "Profil d'un joueur", "Profil public et statistiques d'un étudiant", False),
    ("classement.html", "classement", "Classement", "Classement général XP des étudiants", False),
    ("defis.html", "defis", "Défis", "Défis 1v1 entre étudiants Guardia", True),
]

CSP_POLICY = (
    "default-src 'self'; "
    "script-src 'self' https://www.gstatic.com; "
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
    "font-src 'self' https://fonts.gstatic.com; "
    "img-src 'self' data: blob: https:; "
    "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com; "
    "object-src 'none'; "
    "base-uri 'self'; "
    "frame-ancestors 'none';"
)

TEMPLATE = """<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title>{title} · Guardia_Rev</title>
  <meta name="description" content="{description}">
  <meta http-equiv="Content-Security-Policy" content="{csp}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap">
  <link rel="stylesheet" href="assets/style.css?v={version}">
  <link rel="stylesheet" href="assets/ux-enhancements.css?v={version}">
</head>
<body data-page="{page_id}" data-version="{version}">
  <div id="root"></div>
  <script src="assets/config.js?v={version}"></script>
{data_scripts}  <script src="assets/app.js?v={version}"></script>
  <script src="assets/ux-enhancements.js?v={version}"></script>
</body>
</html>
"""


def build_html_pages() -> None:
    data_block = "".join(
        f'  <script src="assets/data/{subject}.js?v={VERSION}"></script>\n'
        for subject in DATA
    )
    for filename, page_id, title, description, needs_data in PAGES:
        html = TEMPLATE.format(
            title=title,
            description=description,
            csp=CSP_POLICY,
            version=VERSION,
            page_id=page_id,
            data_scripts=data_block if needs_data else "",
        )
        (ROOT / filename).write_text(html, encoding="utf-8")
        print(f"Généré : {filename}")


def sync_readme_version() -> None:
    readme_path = ROOT / "README.md"
    if not readme_path.exists():
        return
    content = readme_path.read_text(encoding="utf-8")
    updated = re.sub(
        r"version-\d+\.\d+\.\d+-1f2937",
        f"version-{VERSION}-1f2937",
        content,
    )
    updated = re.sub(
        r"Version \d+\.\d+\.\d+",
        f"Version {VERSION}",
        updated,
    )
    if updated != content:
        readme_path.write_text(updated, encoding="utf-8")
        print(f"README.md synchronisé sur la version {VERSION}")


if __name__ == "__main__":
    build_html_pages()
    sync_readme_version()
