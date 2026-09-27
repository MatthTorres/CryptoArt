#!/usr/bin/env python3
"""Test de sanidad del sitio estático MarketPulse (sin dependencias externas).

Comprueba versión de la app, cache-bust (HTML <-> README), SEO/Open Graph,
un único origen en las URLs absolutas, la imagen social (1200x630),
sitemap.xml/robots.txt, pies de página, navegación activa con aria-current y que
todas las claves data-i18n existan en el JS de su página (ES y EN).

Uso:
    python tools/check_site.py                    # sale con 0 si todo va bien
    python tools/check_site.py --require-domain   # además falla si sigue el placeholder
"""
import argparse
import json
import os
import re
import struct
import sys
import xml.etree.ElementTree as ET

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PLACEHOLDER = "https://marketpulse.example"

# página -> (JS que lleva su i18n, data-page esperado, enlaces activos en la nav)
PAGES = {
    "index.html": ("js/site.js", "home", 1),
    "analysis.html": ("js/app.js", "analysis", 1),
    "metals.html": ("js/metals.js", "metals", 1),
    "forex.html": ("js/forex.js", "forex", 1),
    "about.html": ("js/site.js", "about", 1),
    "legal.html": ("js/site.js", "legal", 0),
    "404.html": ("js/site.js", "error", 0),
}
INDEXABLE = [p for p in PAGES if p != "404.html"]
errors = []
infos = []


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        return fh.read()


def attr(txt, name, prop=False):
    """Valor de <meta name=...> (prop=False) o <meta property=...> (prop=True)."""
    kind = "property" if prop else "name"
    m = re.search(rf'<meta {kind}="{re.escape(name)}" content="([^"]*)"', txt)
    return m.group(1) if m else None


# ---------- 1) versión de la app vs. pies ----------
app_version = re.search(r"APP_VERSION = '([\d.]+)'", read("js/version.js")).group(1)

# ---------- 2) cache-bust: un valor por asset y coincidente con el README ----------
used = {}
for page in PAGES:
    for path, v in re.findall(r"((?:css|js)/[\w.-]+\.(?:css|js))\?v=(\d+)", read(page)):
        used.setdefault(path, set()).add(v)
for path, versions in sorted(used.items()):
    if len(versions) > 1:
        errors.append(f"cache-bust: {path} con versiones distintas {sorted(versions)}")
readme = read("README.md")
line = re.search(r"Cache-bust en uso.*", readme)
if not line:
    errors.append("README: falta la línea «Cache-bust en uso»")
    doc = {}
else:
    doc = dict(re.findall(r"(css/style\.css|js/[\w.]+\.js)\?v=(\d+)", line.group(0)))
for path, versions in used.items():
    if path in doc and doc[path] != sorted(versions)[0]:
        errors.append(f"cache-bust: {path} usa v{sorted(versions)[0]} y el README dice v{doc[path]}")
for path in doc:
    if path not in used:
        errors.append(f"cache-bust: el README documenta {path} pero ninguna página lo carga")

# ---------- 3) description + Open Graph / Twitter ----------
descriptions = {}
for page, (js_file, data_page, active_expected) in PAGES.items():
    txt = read(page)
    body = re.search(r"<body([^>]*)>", txt)
    got = re.search(r'data-page="([^"]+)"', body.group(1)) if body else None
    if not got or got.group(1) != data_page:
        errors.append(f"{page}: data-page {got.group(1) if got else 'ausente'} (esperado {data_page})")

    desc = attr(txt, "description")
    if not desc:
        errors.append(f'{page}: falta <meta name="description">')
    else:
        if desc in descriptions:
            errors.append(f"{page}: description duplicada con {descriptions[desc]}")
        descriptions[desc] = page
        if not 40 <= len(desc) <= 170:
            errors.append(f"{page}: description de {len(desc)} caracteres (40-170)")

    if page == "404.html":
        robots = attr(txt, "robots") or ""
        if "noindex" not in robots:
            errors.append('404.html: debe llevar <meta name="robots" content="noindex">')
        if attr(txt, "og:url", prop=True) or 'rel="canonical"' in txt:
            errors.append("404.html: no debe llevar canonical ni og:url")
        continue

    for prop, expect in (("og:type", "website"), ("og:site_name", "MarketPulse"),
                         ("og:locale", "es_ES"), ("og:image:width", "1200"),
                         ("og:image:height", "630")):
        if attr(txt, prop, prop=True) != expect:
            errors.append(f"{page}: og:{prop} = {attr(txt, prop, prop=True)!r} (esperado {expect!r})")
    for prop in ("og:title", "og:description", "og:url", "og:image", "og:image:alt"):
        if not attr(txt, prop, prop=True):
            errors.append(f"{page}: falta og:{prop}")
    if attr(txt, "twitter:card") != "summary_large_image":
        errors.append(f"{page}: twitter:card distinto de summary_large_image")
    for name in ("twitter:title", "twitter:description", "twitter:image"):
        if not attr(txt, name):
            errors.append(f"{page}: falta twitter:{name}")
    if desc and attr(txt, "og:description", prop=True) != desc:
        errors.append(f"{page}: og:description no coincide con la description")
    if desc and attr(txt, "twitter:description") != desc:
        errors.append(f"{page}: twitter:description no coincide con la description")
    canonical = re.search(r'rel="canonical" href="([^"]+)"', txt)
    if not canonical:
        errors.append(f'{page}: falta <link rel="canonical">')
    elif attr(txt, "og:url", prop=True) != canonical.group(1):
        errors.append(f"{page}: og:url no coincide con el canonical")

# ---------- 4) un único origen en las URLs absolutas ----------
site_urls = []
for page in PAGES:
    txt = read(page)
    site_urls += re.findall(
        r'(?:rel="canonical" href|property="(?:og:url|og:image)" content|'
        r'name="twitter:image" content)="(https://[^"]+)"', txt)
site_urls += re.findall(r"^Sitemap: (\S+)$", read("robots.txt"), re.M)
site_urls += re.findall(r"<loc>([^<]+)</loc>", read("sitemap.xml"))
bases = set()
for u in site_urls:
    bases.add(re.sub(r"/(assets/[^/]+|[\w.-]+\.html|sitemap\.xml).*$", "", u) + "/")
if len(bases) > 1:
    errors.append(f"orígenes mixtos en las URLs absolutas: {sorted(bases)}")
origin = sorted(bases)[0] if bases else ""
if not origin.startswith("https://"):
    errors.append(f"origen no válido: {origin!r}")
if origin == PLACEHOLDER + "/":
    infos.append("origen = placeholder; fijalo con tools/set_site_origin.py")

# ---------- 5) imagen social ----------
img = "assets/og-marketpulse.png"
img_path = os.path.join(ROOT, *img.split("/"))
if not os.path.exists(img_path):
    errors.append(f"falta {img} (python tools/make_social_image.py)")
else:
    with open(img_path, "rb") as fh:
        head = fh.read(24)
    if head[:8] != b"\x89PNG\r\n\x1a\n":
        errors.append(f"{img} no es un PNG")
    else:
        w, h = struct.unpack(">II", head[16:24])
        if (w, h) != (1200, 630):
            errors.append(f"{img} mide {w}x{h} (esperado 1200x630)")
if not os.path.exists(os.path.join(ROOT, "assets", "apple-touch-icon.png")):
    errors.append("falta assets/apple-touch-icon.png")
for page in INDEXABLE:
    txt = read(page)
    for url in (attr(txt, "og:image", prop=True), attr(txt, "twitter:image")):
        if url and not url.startswith(origin):
            errors.append(f"{page}: og/twitter:image no usa el origen {origin}")

# ---------- 6) sitemap.xml y robots.txt ----------
try:
    tree = ET.fromstring(read("sitemap.xml"))
    locs = [e.text for e in tree.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc")]
except Exception as exc:  # noqa: BLE001
    locs = []
    errors.append(f"sitemap.xml no valido: {exc}")
expected = sorted(origin + p for p in INDEXABLE)
if sorted(locs) != expected:
    errors.append(f"sitemap.xml: {sorted(locs)} != {expected}")
for url in locs:
    rel = url[len(origin):]
    if not os.path.exists(os.path.join(ROOT, *rel.split("/"))):
        errors.append(f"sitemap.xml apunta a {rel}, que no existe")
robots = read("robots.txt")
if f"Sitemap: {origin}sitemap.xml" not in robots:
    errors.append(f"robots.txt no apunta a {origin}sitemap.xml")
if "User-agent:" not in robots or "Allow:" not in robots:
    errors.append("robots.txt incompleto (User-agent / Allow)")

# ---------- 7) pies de pagina ----------
for page in PAGES:
    txt = read(page)
    foot = re.search(r'<footer class="footer">.*?</footer>', txt, re.S)
    if not foot:
        errors.append(f'{page}: sin <footer class="footer">')
        continue
    block = foot.group(0)
    links = re.findall(r'<a href="([^"]+)"', block)
    if len(links) != 2:
        errors.append(f"{page}: {len(links)} enlaces en el pie (esperado 2)")
    for link in links:
        target = link.split("?")[0]
        if target == page:
            errors.append(f"{page}: el pie se enlaza a si mismo ({link})")
        if not os.path.exists(os.path.join(ROOT, *target.split("/"))):
            errors.append(f"{page}: el pie enlaza a {link}, que no existe")
    if block.count('class="footer-sep"') != 1:
        errors.append(f"{page}: el pie necesita exactamente 1 separador")
    if re.findall(r"data-app-version>([^<]+)<", block) != ["v" + app_version]:
        errors.append(f"{page}: sello de version del pie distinto de v{app_version}")
    if len(re.findall(r"data-app-year>", block)) != 1:
        errors.append(f"{page}: falta o sobra data-app-year")
    prefix = 'data-i18n="footerPrefix"' in block
    brand = 'data-i18n="footerBrandLine"' in block
    if prefix == brand:
        errors.append(f"{page}: el pie debe usar footerPrefix o footerBrandLine (uno solo)")
    if prefix and 'id="updateTime"' not in block:
        errors.append(f"{page}: footerPrefix sin #updateTime")
    if brand and 'id="updateTime"' in block:
        errors.append(f"{page}: footerBrandLine con #updateTime")

# ---------- 8) navegacion activa + aria-current ----------
for page, (_, _, active_expected) in PAGES.items():
    txt = read(page)
    n = len(re.findall(r'class="nav-link active"', txt))
    if n != active_expected:
        errors.append(f"{page}: {n} enlaces .nav-link.active (esperado {active_expected})")
    for ln in txt.splitlines():
        if 'class="nav-link active"' in ln and 'aria-current="page"' not in ln:
            errors.append(f"{page}: nav activo sin aria-current")
        if 'class="nav-link"' in ln and 'aria-current' in ln:
            errors.append(f"{page}: nav inactivo con aria-current")

# ---------- 9) recursos locales referenciados ----------
for page in PAGES:
    for ref in re.findall(r'(?:href|src)="((?:css|js|assets)/[^"]+)"', read(page)):
        if not os.path.exists(os.path.join(ROOT, *ref.split("?")[0].split("/"))):
            errors.append(f"{page}: recurso inexistente {ref}")

# ---------- 10) claves data-i18n en el JS de su pagina (ES y EN) ----------
i18n_cache = {}
for page, (js_file, _, _) in PAGES.items():
    if js_file not in i18n_cache:
        i18n_cache[js_file] = read(js_file)
    for key in sorted(set(re.findall(r'data-i18n="(\w+)"', read(page)))):
        defs = len(re.findall(rf"^\s*{key}:", i18n_cache[js_file], re.M))
        if defs < 2:
            errors.append(f"{page}: clave {key} esta {defs} vez(ces) en {js_file} (falta ES/EN)")

# ---------- salida ----------
ap = argparse.ArgumentParser()
ap.add_argument("--require-domain", action="store_true",
                help="falla si el origen sigue siendo el placeholder")
args = ap.parse_args()
if args.require_domain and origin == PLACEHOLDER + "/":
    errors.append("sigue el placeholder: ejecuta tools/set_site_origin.py <origen>")

print(json.dumps({
    "app_version": app_version,
    "origen": origin,
    "paginas": len(PAGES),
    "cache_bust": {k: sorted(v)[0] for k, v in sorted(used.items())},
    "informativo": infos,
    "errores": errors,
}, indent=2, ensure_ascii=False))
sys.exit(1 if errors else 0)


