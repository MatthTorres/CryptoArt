#!/usr/bin/env python3
"""Comprueba que los tres diccionarios de idioma (es/en/pt) esten completos.

Un alta de idioma a mano se rompe casi siempre de la misma forma: se olvidan
unas claves en un fichero, o se cuela una de mas. No da error de sintaxis, y
t() cae silenciosamente al espanol, asi que la pagina "funciona" pero medio
texto se queda en el idioma equivocado. Este script lo detecta.

Que los tres tengan las mismas claves es lo unico que se puede comprobar sin un
parser de JS. No se intenta validar el balance de llaves con regex: los literales
de regex del propio codigo (p. ej. /[^"]+/) confunden a un contador ingenuo y
daria falsos positivos en ficheros que funcionan.

Uso:  python tools/check_i18n.py
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILES = ["js/site.js", "js/app.js", "js/metals.js", "js/forex.js"]
LANGS = ("es", "en", "pt")


def i18n_keys(src):
    """Claves de cada diccionario de idioma, si el fichero tiene I18N.

    Se acota primero al objeto I18N entero: si no, el slice del ultimo idioma
    se desborda hacia el resto del fichero y recoge claves de otros objetos
    (las de Chart.js, por ejemplo) como si fueran traducciones.
    """
    if "const I18N" not in src:
        return None
    m = re.search(r"const I18N = \{", src)
    rest = src[m.end():]
    stop = min([i for i in (rest.find("\n};"), rest.find("\n};"))
                if i > 0] or [len(rest)])
    i18n = rest[:stop]

    out = {}
    for code in ("es", "en", "pt"):
        if not re.search(rf"^  {code}: \{{$", i18n, re.M):
            return "falta el bloque {code}"
        start = i18n.index(f"\n  {code}: {{")
        rest2 = i18n[start + 1:]
        nxt = [rest2.find(f"\n  {c}: {{") for c in ("es", "en", "pt")
               if rest2.find(f"\n  {c}: {{") > 0]
        end = min(nxt) if nxt else len(rest2)
        out[code] = set(re.findall(r"^ {4}(\w+):", rest2[:end], re.M))
    return out


def main():
    errors = []
    for rel in FILES:
        path = os.path.join(ROOT, rel)
        with open(path, encoding="utf-8") as fh:
            src = fh.read()

        keys = i18n_keys(src)
        if keys == "falta el bloque {code}":
            print(f"  {rel:<14} FALTA un diccionario de idioma")
            errors.append(f"{rel}: falta un diccionario de idioma")
            continue
        if not keys:
            print(f"  {rel:<14} sin I18N (no aplica)")
            continue

        base = keys.get("es", set())
        total = len(base)
        line = f"  {rel:<14} {total:>3} claves"
        bad = False
        for code in LANGS:
            miss = base - keys.get(code, set())
            extra = keys.get(code, set()) - base
            if miss or extra:
                bad = True
                line += f"  [{code.upper()} MAL"
                if miss:
                    line += f" faltan={sorted(miss)}"
                if extra:
                    line += f" sobran={sorted(extra)}"
                line += "]"
        print(line + ("" if bad else "  OK en es/en/pt"))
        if bad:
            errors.append(f"{rel}: diccionarios descuadrados")

    print()
    if errors:
        for e in errors:
            print("ERROR:", e)
        return 1
    print(f"OK: los {len(FILES)} ficheros tienen las mismas claves en es/en/pt")
    return 0


if __name__ == "__main__":
    sys.exit(main())
