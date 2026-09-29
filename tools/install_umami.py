#!/usr/bin/env python3
"""Instala el script de Umami Cloud en las 7 paginas.

Va con `defer` y al final del <body>, junto a los demas scripts, para que no
bloquee el renderizado. Es idempotente: si ya esta, no lo duplica.

El ID se pasa por parametro, nunca se deja escrito en el repositorio, para que
pueda rotarse sin tocar codigo.

Uso:  python tools/install_umami.py 4cf0d311-0c95-4144-ac88-d9d34998c5bc
"""
import glob
import io
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

UUID_RE = re.compile(r"^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$")


def build(website_id):
    return (
        '  <!-- Analitica: Umami Cloud. Sin cookies y con IP anonimizada, por eso no\n'
        '       hay banner de consentimiento. Ver el punto 5 de legal.html. -->\n'
        f'  <script defer src="https://cloud.umami.is/script.js" data-website-id="{website_id}"></script>\n'
    )


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 2
    wid = sys.argv[1].strip()
    if not UUID_RE.match(wid):
        print(f"ERROR: '{wid}' no parece un Website ID de Umami (UUID v4).")
        print("      Se encuentra en Umami > Websites > <tu sitio> > ID del sitio web.")
        return 2

    snippet = build(wid)
    changed = 0
    for path in sorted(glob.glob(os.path.join(ROOT, "*.html"))):
        name = os.path.basename(path)
        with io.open(path, encoding="utf-8", newline="") as fh:
            src = fh.read()

        if "cloud.umami.is" in src:
            new = re.sub(r'data-website-id="[^"]*"', f'data-website-id="{wid}"', src)
            if new != src:
                with io.open(path, "w", encoding="utf-8", newline="") as fh:
                    fh.write(new)
                print(f"  {name:<16} ID actualizado")
            else:
                print(f"  {name:<16} ya instalado")
            continue

        # Se inserta justo antes de </body>, despues del ultimo script.
        if "</body>" not in src:
            print(f"  {name:<16} ERROR: no encuentro </body>")
            return 1
        crlf = "\r\n" in src
        norm = src.replace("\r\n", "\n")
        norm = norm.replace("</body>", snippet + "</body>", 1)
        out = norm.replace("\n", "\r\n") if crlf else norm

        with io.open(path, "w", encoding="utf-8", newline="") as fh:
            fh.write(out)
        print(f"  {name:<16} Umami instalado")
        changed += 1

    print(f"\n{changed}/7 paginas actualizadas con el ID {wid}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
