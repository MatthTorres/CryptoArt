#!/usr/bin/env python3
"""Fija el origen definitivo (dominio) en todos los archivos con URLs absolutas.

Uso:
    python tools/set_site_origin.py https://tudominio.com
    python tools/set_site_origin.py https://usuario.github.io/bitcoin-dashboard
    python tools/set_site_origin.py --status

Se usa el placeholder reservado https://marketpulse.example (TLD .example, IANA/RFC 2606)
hasta que haya hosting: ningún crawler puede resolverlo, así que si se despliega sin
ejecutar este script simplemente no se genera la tarjeta social ni se indexa la canonical.
Sustituye el origen en: las 7 páginas (canonical, og:url, og:image, twitter:image),
robots.txt (Sitemap) y sitemap.xml (<loc>).
"""
import argparse
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLACEHOLDER = "https://marketpulse.example"
FILES = ["index.html", "analysis.html", "metals.html", "forex.html",
         "about.html", "legal.html", "404.html", "robots.txt", "sitemap.xml"]

# Cada patrón captura el origen (hasta la primera barra tras el host) de las URLs
# que la web declara sobre sí misma.
ORIGIN_PATTERNS = [
    re.compile(r'rel="canonical" href="(https://[^"]+)"'),
    re.compile(r'property="og:url" content="(https://[^"]+)"'),
    re.compile(r'property="og:image" content="(https://[^"]+)"'),
    re.compile(r'name="twitter:image" content="(https://[^"]+)"'),
    re.compile(r'^Sitemap: (https://\S+)$', re.M),
    re.compile(r'<loc>(https://[^<]+)</loc>'),
]


def origin_of(url: str) -> str:
    """https://host/sub/pag.html -> https://host/sub/  (conserva la subcarpeta)."""
    m = re.match(r"^(https://[^/]+)(.*)$", url)
    host, path = m.group(1), m.group(2).rstrip("/")
    if "/assets/" in path:            # url de imagen: se queda con la raíz de assets
        path = path.split("/assets/")[0]
    elif "/" in path:                 # url de página: quita el último segmento
        path = path.rsplit("/", 1)[0]
    else:
        path = ""
    return host + path + "/"


def scan():
    """Origen declarado por archivo (lista para detectar orígenes mixtos)."""
    found = {}
    for name in FILES:
        path = os.path.join(ROOT, name)
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as fh:
            txt = fh.read()
        for pat in ORIGIN_PATTERNS:
            for url in pat.findall(txt):
                found.setdefault(origin_of(url), []).append(name)
    return found


def normalize(raw: str) -> str:
    base = raw.strip().rstrip("/")
    if not re.match(r"^https://[a-z0-9.-]+(:\d+)?(/[A-Za-z0-9._~%-]*)*$", base, re.I):
        raise SystemExit(f"Origen no válido: {raw!r} (esperado https://dominio[/subcarpeta])")
    return base + "/"


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("origin", nargs="?", help="https://tudominio.com[/subcarpeta]")
    ap.add_argument("--status", action="store_true", help="solo informa del origen actual")
    ap.add_argument("--force", action="store_true", help="permite cambiar un origen ya fijado")
    args = ap.parse_args()

    origins = scan()
    print("Origen actual:")
    for origin, files in sorted(origins.items()):
        tag = "  <- PLACEHOLDER (pendiente)" if origin.rstrip("/") == PLACEHOLDER else ""
        print(f"  {origin:<35} ({len(files)} referencias){tag}")

    if args.status:
        return 0
    if not args.origin:
        raise SystemExit("Indica el origen: python tools/set_site_origin.py https://tudominio.com")

    new = normalize(args.origin)
    olds = [o for o in origins if o != new]
    if not olds:
        print(f"Ya está fijado en {new}; nada que hacer.")
        return 0
    non_placeholder = [o for o in olds if o.rstrip("/") != PLACEHOLDER]
    if non_placeholder and not args.force:
        raise SystemExit(
            f"Ya hay un origen distinto al placeholder: {non_placeholder}. "
            "Usa --force si quieres sobrescribirlo.")

    total = 0
    for name in FILES:
        path = os.path.join(ROOT, name)
        if not os.path.exists(path):
            continue
        with open(path, encoding="utf-8") as fh:
            txt = fh.read()
        original = txt
        for old in olds:
            txt = txt.replace(old, new)
        if txt != original:
            with open(path, "w", encoding="utf-8", newline="") as fh:
                fh.write(txt)
            n = sum(original.count(old) for old in olds)
            total += n
            print(f"  {name}: {n} URLs")

    print(f"\nListo: {total} URLs -> {new}")
    print("Siguiente: python tools/check_site.py --require-domain")
    return 0


if __name__ == "__main__":
    sys.exit(main())
