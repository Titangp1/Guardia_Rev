"""Guardia_Rev · régénère assets/data/agenda.js depuis l'agenda iCal de l'école (Aimaira).

Le lien iCal contient un jeton personnel : il ne doit JAMAIS être commité.
On le lit dans la variable d'environnement AGENDA_URL, ou à défaut dans tools/.agenda-url (ignoré par Git).
Seuls la date, les horaires, l'intitulé du cours et la salle sont publiés (pas les noms des intervenants).
Usage, depuis la racine du dépôt :
    python tools/agenda.py
"""
import json
import os
import re
import sys
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
url = os.environ.get("AGENDA_URL") or (ROOT / "tools" / ".agenda-url").read_text(encoding="utf-8").strip() \
    if (os.environ.get("AGENDA_URL") or (ROOT / "tools" / ".agenda-url").exists()) else None
if not url:
    sys.exit("Lien iCal introuvable : définissez AGENDA_URL ou créez tools/.agenda-url")

req = urllib.request.Request(url, headers={"User-Agent": "Guardia_Rev agenda"})
raw = urllib.request.urlopen(req, timeout=30).read().decode("utf-8")
raw = raw.replace("\r\n", "\n").replace("\n ", "")


def field(block, key):
    m = re.search(r"^" + key + r"[^:\n]*:(.*)$", block, re.M)
    return m.group(1).strip() if m else ""


def kind(title):
    t = title.lower()
    if "partiel" in t:
        return "partiel"
    if "rattrapage" in t:
        return "rattrapage"
    if "vacance" in t:
        return "vacances"
    if t.startswith(("lv1", "lv2")):
        return "langue"
    return "cours" if field_sem else "evenement"


events = []
for block in raw.split("BEGIN:VEVENT")[1:]:
    start, end = field(block, "DTSTART"), field(block, "DTEND")
    summary = field(block, "SUMMARY").replace("\\,", ",").replace("\\;", ";")
    title = summary.split("|")[0].strip()
    m = re.match(r"^\d\d-\d\d\s+1\.(S\d)\s+(.*)$", title)
    field_sem = m.group(1) if m else ""
    title = m.group(2) if m else title
    events.append({
        "d": f"{start[0:4]}-{start[4:6]}-{start[6:8]}",
        "s": f"{start[9:11]}:{start[11:13]}",
        "e": f"{end[9:11]}:{end[11:13]}",
        "t": title,
        "k": kind(title),
        "sem": field_sem,
        "l": field(block, "LOCATION"),
    })

events.sort(key=lambda e: (e["d"], e["s"]))
out = ROOT / "assets" / "data" / "agenda.js"
out.write_text(
    "/* Guardia_Rev · agenda GCS1 généré par tools/agenda.py (ne pas éditer à la main). */\n"
    "window.GR=window.GR||{subjects:[]};\n"
    "GR.agenda=" + json.dumps(events, ensure_ascii=False, separators=(",", ":")) + ";\n",
    encoding="utf-8",
)
print(f"{len(events)} événements écrits dans {out.relative_to(ROOT)}")
