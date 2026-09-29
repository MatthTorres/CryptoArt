#!/usr/bin/env python3
"""Deja el repositorio listo tras renombrarlo en GitHub a MarketPulse.

Comprueba primero que el repo nuevo existe y que el viejo redirige, y solo
entonces toca el remoto local. Asi no se rompe el push a mitad: si algo falla,
el remoto se queda como estaba y avisa.

Opcionalmente fija despues el origen SEO, que es el paso que mas se olvida
(las URLs absolutas siguen apuntando al host anterior si no).

Uso:
    python tools/after_rename.py
    python tools/after_rename.py --origin https://marketpulse.netlify.app
"""
import argparse
import os
import subprocess
import sys
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OLD = "https://github.com/MatthTorres/CryptoArt.git"
NEW = "https://github.com/MatthTorres/MarketPulse.git"
NEW_PAGES = "https://matthtorres.github.io/MarketPulse/"


def sh(*args):
    """Ejecuta git y devuelve (codigo, salida)."""
    p = subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True)
    return p.returncode, (p.stdout + p.stderr).strip()


def http_code(url):
    try:
        req = urllib.request.Request(url, method="GET", headers={"User-Agent": "MarketPulse-check"})
        with urllib.request.urlopen(req, timeout=20) as r:
            return r.status
    except urllib.error.HTTPError as e:
        return e.code
    except Exception as e:  # noqa: BLE001
        return f"error: {type(e).__name__}"


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--origin", help="fija despues el origen SEO a esta URL (p.ej. https://marketpulse.netlify.app)")
    ap.add_argument("--skip-check", action="store_true", help="no comprueba que el repo nuevo exista")
    args = ap.parse_args()

    code, out = sh("remote", "get-url", "origin")
    current = out.strip() if code == 0 else ""
    print(f"Remoto actual: {current or '(sin remote origin)'}")

    if current == NEW:
        print("El remoto ya apunta a MarketPulse: no hay nada que cambiar.")
    elif not args.skip_check:
        print("Comprobando que el repositorio nuevo existe...")
        st = http_code(NEW_PAGES)
        print(f"  https://matthtorres.github.io/MarketPulse/ -> {st}")
        if st not in (200,):
            print()
            print("El repositorio renombrado todavia no responde.")
            print("Puede que falte el rename en GitHub, o que GitHub Pages tarde unos minutos.")
            print("Si ya lo has hecho, espera un poco y vuelve a ejecutar, o usa --skip-check.")
            return 1
        code, out = sh("remote", "set-url", "origin", NEW)
        if code != 0:
            print(f"ERROR al cambiar el remoto:\n{out}")
            return 1
        print("Remoto actualizado a MarketPulse.")
    else:
        code, out = sh("remote", "set-url", "origin", NEW)
        if code != 0:
            print(f"ERROR al cambiar el remoto:\n{out}")
            return 1
        print("Remoto actualizado a MarketPulse (sin comprobar).")

    code, out = sh("push", "-u", "origin", "main")
    if code != 0:
        print(f"ERROR al hacer push:\n{out}")
        print("Comprueba que el renombrado este hecho y que tengas sesion iniciada.")
        return 1
    print("Push a origin/main correcto.")

    if args.origin:
        p = subprocess.run([sys.executable, os.path.join(ROOT, "tools", "set_site_origin.py"), args.origin],
                           cwd=ROOT)
        if p.returncode != 0:
            print("El remoto esta bien, pero fallo el cambio de origen SEO.")
            return 1
        print(f"Origen SEO fijado en {args.origin}.")
        code, out = sh("status", "--short")
        if out.strip():
            print("Quedan cambios sin commitear (el origen SEO). Revisa y sube:")
            print("  git add -A && git commit -m \"Origen SEO: \" && git push")
        return 0

    print()
    print("Siguiente paso: publica en Netlify y, cuando tengas la URL definitiva, ejecuta")
    print("  python tools/after_rename.py --origin https://marketpulse.netlify.app")
    return 0


if __name__ == "__main__":
    sys.exit(main())
