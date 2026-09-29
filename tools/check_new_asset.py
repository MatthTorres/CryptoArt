#!/usr/bin/env python3
"""Valida el alta de un activo nuevo en la pagina de metales.

Comprueba, sin abrir navegador:
  1. Que metals.js declara el activo y que su `tv` esta en la lista de
     permitidos (un simbolo mal escrito rompe el widget de TradingView).
  2. Que metals.html tiene la pestaña ?asset=<id> correspondiente.
  3. Que el icono/emojis de la pestaña no esten duplicados.
  4. Que no queden restos de un alta anterior con otro nombre (p. ej. 'EUA'
     cuando el activo ya no usa esa etiqueta).

Uso:  python tools/check_new_asset.py copper uranium carbon
"""
import re
import sys
import os
import json
import urllib.request
import urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Simbolos de TradingView ya verificados a mano en tradingview.com/symbols/.
# Anadir uno aqui obliga a revisar primero que exista de verdad.
KNOWN_TV = {
    "OANDA:XAUUSD", "OANDA:XAGUSD", "OANDA:XPTUSD", "OANDA:XPDUSD",
    "NYMEX:CL1!", "COMEX:HG1!", "OTC:SRUUF", "AMEX:KRBN",
}

PROXIES = [
    ("allorigins", "https://api.allorigins.win/raw?url={u}"),
    ("cors.lol", "https://api.cors.lol/?url={u}"),
]


def read(rel):
    with open(os.path.join(ROOT, rel), encoding="utf-8") as fh:
        return fh.read()


def parse_assets():
    txt = read("js/metals.js")
    body = re.search(r"const ASSETS = \{(.*?)\n\};", txt, re.S).group(1)
    out = {}
    for m in re.finditer(
        r"(\w+):\s*\{(.*?)\},\s*(?=\n|$)", body, re.S
    ):
        key, blob = m.group(1), m.group(2)
        out[key] = {
            "name": (re.search(r"name:\s*'([^']*)'", blob) or [None, None])[1],
            "yahoo": (re.search(r"yahoo:\s*'([^']*)'", blob) or [None, None])[1],
            "tv": (re.search(r"tv:\s*'([^']*)'", blob) or [None, None])[1],
        }
    return out


def yahoo_usable(sym, min_candles=64):
    """True si el simbolo devuelve >= min_candles diarias (insuficiente = no sirve)."""
    raw = (f"https://query1.finance.yahoo.com/v8/finance/chart/"
           f"{urllib.parse.quote(sym)}?interval=1d&range=6mo")
    for _, tmpl in PROXIES:
        try:
            req = urllib.request.Request(
                tmpl.format(u=urllib.parse.quote(raw, safe="")),
                headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=25) as r:
                d = json.loads(r.read().decode("utf-8", "replace"))
            res = d.get("chart", {}).get("result") or []
            if not res:
                return False
            closes = [c for c in res[0]["indicators"]["quote"][0]["close"]
                      if c is not None]
            return len(closes) >= min_candles
        except Exception:  # noqa: BLE001
            pass
    return False


def main():
    keys = sys.argv[1:]
    assets = parse_assets()
    html = read("metals.html")
    site = read("js/site.js")
    errors, notes = [], []

    if not keys:
        keys = list(assets)
    online = "--online" in keys
    keys = [k for k in keys if k != "--online"]

    for k in keys:
        a = assets.get(k)
        if not a:
            errors.append(f"{k}: no esta declarado en ASSETS de js/metals.js")
            continue
        if f'metals.html?asset={k}' not in html:
            errors.append(f"{k}: falta la pestaña en metals.html")
        if a["tv"] not in KNOWN_TV:
            errors.append(f"{k}: tv='{a['tv']}' no esta en la lista verificada")
        if not a["yahoo"]:
            errors.append(f"{k}: falta el simbolo de Yahoo")
        # Cada activo nuevo necesita su texto de home en ES y EN.
        if f"metal{ k.capitalize() }" not in site:
            notes.append(f"{k}: no veo metal{k.capitalize()} en el i18n de site.js")
        print(f"  {k:<9} {a['name']:<12} yahoo={a['yahoo']:<7} tv={a['tv']}")

    dup = [e for e in re.findall(r'data-asset="(\w+)"', html)
           if re.findall(r'data-asset="(\w+)"', html).count(e) > 1]
    if dup:
        errors.append(f"pestanas duplicadas en metals.html: {sorted(set(dup))}")

    for key, label in (("EUA", "etiqueta EUA obsoleta"),):
        if key in html:
            errors.append(f"metals.html: queda la {label} ('{key}')")

    if online:
        for k in [x for x in keys if x != "--online"]:
            sym = assets[k]["yahoo"]
            ok = yahoo_usable(sym)
            print(f"  {k:<9} Yahoo {sym:<7} {'OK' if ok else 'SIN DATOS SUFICIENTES'}")
            if not ok:
                errors.append(f"{k}: {sym} no devuelve historial utilizable")

    print()
    for n in notes:
        print("aviso:", n)
    if errors:
        for e in errors:
            print("ERROR:", e)
        return 1
    print("OK: alta correcta")
    return 0


if __name__ == "__main__":
    sys.exit(main())
