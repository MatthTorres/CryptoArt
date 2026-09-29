#!/usr/bin/env python3
"""Auditoría completa de MarketPulse: enlaces, recursos, i18n, CSS, JS y a11y.

No comprueba el render en navegador, pero sí todo lo que se puede verificar
estáticamente y que suele romperse al editar: enlaces que apuntan a ficheros
inexistentes, recursos que no están, claves data-i18n que faltan en alguno de
los tres idiomas, clases CSS sin definir, variables CSS no declaradas, IDs
duplicados, img sin alt y desajustes entre los placeholders {x} de las
traducciones.

Uso:
    python tools/audit.py
Salida: 0 si todo correcto, 1 si hay errores.
"""
from __future__ import annotations

import os
import re
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

PAGES = {
    "index.html": ("js/site.js", "home", True),
    "analysis.html": ("js/app.js", "analysis", True),
    "metals.html": ("js/metals.js", "metals", True),
    "forex.html": ("js/forex.js", "forex", True),
    "about.html": ("js/site.js", "about", True),
    "legal.html": ("js/site.js", "legal", True),
    "404.html": ("js/site.js", "error", False),
}
LANGS = ("es", "pt", "en")
ORIGIN = "https://matthtorres.github.io/MarketPulse/"

errors: list[str] = []
warnings: list[str] = []
info: list[str] = []


def read(rel: str) -> str:
    # Los src del HTML llevan el cache-bust ?v=N; para leer del disco se quita.
    rel = rel.split("?")[0].split("#")[0]
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        return fh.read()


def exists(rel: str) -> bool:
    return os.path.exists(os.path.join(ROOT, rel.split("?")[0].split("#")[0]))


def err(page: str, msg: str) -> None:
    errors.append(f"[{page}] {msg}")


def warn(page: str, msg: str) -> None:
    warnings.append(f"[{page}] {msg}")


# --------------------------------------------------------------- i18n parsing
def i18n_keys(js: str) -> dict[str, dict[str, str]]:
    """Extrae {lang: {clave: valor}} del objeto I18N de un JS."""
    m = re.search(r"const I18N\s*=\s*\{", js)
    if not m:
        return {}
    body = js[m.end():]
    out: dict[str, dict[str, str]] = {}
    for lang in LANGS:
        lm = re.search(rf"^\s{{2}}{lang}\s*:\s*\{{", body, re.M)
        if not lm:
            out[lang] = {}
            continue
        start = lm.end()
        end_m = re.search(r"^\s{2}\}\s*,?\s*$", body[start:], re.M)
        chunk = body[start:start + end_m.start()] if end_m else body[start:]
        keys: dict[str, str] = {}
        # Admite comillas simples y dobles: el bloque en usa dobles y las
        # simples hacen que el parser lo declare ausente por error.
        for km in re.finditer(
                r'^\s{4}([A-Za-z0-9_]+)\s*:\s*(?:"((?:[^"\\]|\\.)*)"|\'((?:[^\'\\]|\\.)*)\')',
                chunk, re.M):
            keys[km.group(1)] = km.group(2) if km.group(2) is not None else km.group(3)
        out[lang] = keys
    return out


def strip_js_noise(src: str) -> str:
    """Quita comentarios y cadenas para contar paréntesis con sentido."""
    src = re.sub(r"/\*.*?\*/", " ", src, flags=re.S)
    src = re.sub(r"//[^\n]*", " ", src)
    src = re.sub(r"`(?:\\.|[^`\\])*`", '""', src, flags=re.S)
    src = re.sub(r"'(?:\\.|[^'\\\n])*'", '""', src)
    src = re.sub(r'"(?:\\.|[^"\\\n])*"', '""', src)
    return src


def placeholders(text: str) -> set[str]:
    return set(re.findall(r"\{(\w+)\}", text))


# ----------------------------------------------------------------- HTML checks
TAG_RE = re.compile(r"<(/?)([a-zA-Z][a-zA-Z0-9]*)([^>]*?)(/?)>")
VOID = {"img", "br", "hr", "meta", "link", "input", "source",
        "col", "area", "base", "embed", "param", "track", "wbr"}


def check_html(page: str, html: str, js_keys: dict[str, dict[str, str]]) -> None:
    ids = re.findall(r'\sid="([^"]+)"', html)
    for dup, n in Counter(ids).items():
        if n > 1:
            err(page, f'id duplicado: "{dup}" aparece {n} veces')

    stack: list[str] = []
    for m in TAG_RE.finditer(html):
        closing, name, _attrs, selfclose = m.groups()
        name = name.lower()
        if name in VOID or selfclose:
            continue
        if closing:
            if not stack:
                err(page, f"</{name}> sobrante")
            elif stack[-1] != name:
                if name in stack:
                    while stack and stack.pop() != name:
                        pass
                else:
                    err(page, f"</{name}> sin apertura")
            else:
                stack.pop()
        else:
            stack.append(name)
    for left in stack:
        err(page, f"<{left}> sin cerrar")

    for pat, kind in ((r'<script[^>]+src="([^"]+)"', "script"),
                      (r'<img[^>]+src="([^"]+)"', "img"),
                      (r'<link[^>]+href="([^"]+)"', "link")):
        for src in re.findall(pat, html):
            if src.startswith(("http://", "https://", "//", "data:")):
                continue
            if not exists(src):
                err(page, f"{kind} inexistente: {src}")

    for href in re.findall(r'<a[^>]+href="([^"]+)"', html):
        if href.startswith(("http://", "https://", "mailto:", "#", "data:")):
            continue
        target = href.split("?")[0].split("#")[0]
        if target and not exists(target):
            err(page, f"enlace roto: {href}")

    for tag in re.findall(r"<img[^>]*>", html):
        if "alt=" not in tag:
            err(page, f"img sin alt: {tag[:70]}")

    used = set(re.findall(r'data-i18n(?:-placeholder|-title|-content)?="([^"]+)"', html))
    for key in sorted(used):
        for lang in LANGS:
            if key not in js_keys.get(lang, {}):
                err(page, f"clave i18n '{key}' ausente en '{lang}'")

    for key in sorted(used):
        ph = {}
        for lang in LANGS:
            v = js_keys.get(lang, {}).get(key)
            if v is not None:
                ph[lang] = placeholders(v)
        if len(set(map(frozenset, ph.values()))) > 1:
            warn(page, f"placeholders distintos en '{key}': " +
                 ", ".join(f"{k}={sorted(v)}" for k, v in sorted(ph.items())))


# ------------------------------------------------------------------ CSS checks
def check_css(pages: dict[str, str]) -> None:
    css = read("css/style.css")
    defined = set(re.findall(r"\.([A-Za-z][A-Za-z0-9_-]*)", css))
    used: set[str] = set()
    for html in pages.values():
        for group in re.findall(r'class="([^"]+)"', html):
            used |= set(group.split())
    for c in sorted(c for c in used - defined if not c.startswith(("is-", "has-"))):
        # Un envoltorio sin estilo propio no es un fallo: lo normal es que solo
        # agrupe y el estilo lo ponga el elemento padre. Se busca un selector
        # que use la clase como nombre completo; el lookahead evita que
        # .trade-side case dentro de .trade-side-title.
        if re.search(rf"\.{re.escape(c)}(?![\w-])", css):
            info.append(f"[css] .{c} usada en HTML; se estilo desde su contenedor")
        else:
            warn("css", f"clase usada en HTML sin regla propia: .{c}")

    decl = set(re.findall(r"(--[\w-]+)\s*:", css))
    # var(--pct, 50%) lleva valor de reserva: es CSS válido, no una variable rota.
    for v in sorted(set(re.findall(r"var\((--[\w-]+)", css)) - decl):
        uses = re.findall(rf"var\({v}(?:\s*,)", css)
        if not uses:
            err("css", f"variable no declarada y sin valor de reserva: var({v})")

    if css.count("{") != css.count("}"):
        err("css", f"llaves descompensadas: {css.count('{')} / {css.count('}')}")


# ------------------------------------------------------------------- JS checks
def check_js(pages: dict[str, str]) -> None:
    """Comprobaciones estáticas fiables del JS.

    No se cuentan llaves ni paréntesis: los literales de regex de JavaScript
    contienen esos caracteres y cualquier conteo da falsos positivos. La
    validez sintáctica la comprueba de verdad tools/functional_test.py, que
    abre cada página en Chrome headless y recoge los errores de JavaScript.
    """
    for page, html in pages.items():
        for src in sorted(set(re.findall(r'<script[^>]+src="(js/[^"]+)"', html))):
            js = read(src)
            if not js.strip():
                err(page, f"{src} está vacío")
            if re.search(r"<<<<<<<|>>>>>>>", js):
                err(page, f"{src} tiene marcadores de conflicto de merge sin resolver")
            for fn in re.findall(r"^function\s+(\w+)", js, re.M):
                if len(re.findall(rf"^function\s+{fn}\s*\(", js, re.M)) > 1:
                    err(page, f"funcion '{fn}' definida mas de una vez en {src}")


# ------------------------------------------------------------------- globals
def main() -> int:
    pages = {p: read(p) for p in PAGES}
    cache: dict[str, dict[str, dict[str, str]]] = {}

    for page, (jsrel, expected, _indexable) in PAGES.items():
        html = pages[page]
        if jsrel not in cache:
            cache[jsrel] = i18n_keys(read(jsrel))
        check_html(page, html, cache[jsrel])

        dp = re.search(r'<body[^>]+data-page="([^"]+)"', html)
        if not dp:
            err(page, "falta data-page en <body>")
        elif dp.group(1) != expected:
            err(page, f"data-page='{dp.group(1)}' pero se esperaba '{expected}'")

        if jsrel not in html:
            err(page, f"no carga su JS ({jsrel})")

        # El 404 es noindex: no necesita canonical (check_site.py no lo indexa).
        canon = re.search(r'<link rel="canonical" href="([^"]+)"', html)
        if not canon and page != "404.html":
            err(page, "sin canonical")
        elif canon:
            want = ORIGIN if page == "index.html" else ORIGIN + page
            if canon.group(1) != want:
                err(page, f"canonical '{canon.group(1)}' != '{want}'")
        og = re.search(r'<meta property="og:url" content="([^"]+)"', html)
        if og and canon and og.group(1) != canon.group(1):
            err(page, "og:url no coincide con canonical")

    check_css(pages)
    check_js(pages)

    sm = read("sitemap.xml")
    for page, (_j, _e, indexable) in PAGES.items():
        if indexable and page not in sm:
            err("sitemap.xml", f"falta {page}")
    if "404.html" in sm:
        err("sitemap.xml", "no debería incluir 404.html")

    if ORIGIN + "sitemap.xml" not in read("robots.txt"):
        err("robots.txt", "la línea Sitemap no apunta al origen actual")

    print("=" * 62)
    print("AUDITORIA MARKETPULSE")
    print("=" * 62)
    print(f"Paginas: {len(PAGES)}   Errores: {len(errors)}   Avisos: {len(warnings)}")
    if errors:
        print("\nERRORES")
        for e in errors:
            print("  x " + e)
    if warnings:
        print("\nAVISOS")
        for w in warnings:
            print("  ! " + w)
    if not errors and not warnings:
        print("\nSin errores ni avisos.")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())

