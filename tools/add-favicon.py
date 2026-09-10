"""Injecte les balises d'icone et de theme-color dans les pages HTML."""

import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent

TAGS = (
    '<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">\n'
    '<link rel="alternate icon" href="assets/favicon.ico" sizes="any">\n'
    '<link rel="apple-touch-icon" href="assets/apple-touch-icon.png">\n'
    '<meta name="theme-color" content="#7C3AED">\n'
)

ANCHOR = '<link rel="preconnect" href="https://fonts.googleapis.com">'

for page in sorted(ROOT.glob("*.html")):
    text = page.read_text(encoding="utf-8")
    if 'rel="icon"' in text:
        print(f"  {page.name} : deja present")
        continue
    if ANCHOR not in text:
        print(f"  {page.name} : ancre introuvable, ignore")
        continue
    text = text.replace(ANCHOR, TAGS + ANCHOR, 1)
    page.write_text(text, encoding="utf-8")
    print(f"  {page.name} : injecte")
