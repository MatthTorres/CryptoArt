#!/usr/bin/env python3
"""Cronometra la ruta de datos de divisas: Yahoo vía la cascada de proxies.

Reproduce el orden exacto de js/forex.js (host x proxy, UN intento por combo y sin
pausas artificiales) para ver cuánto tarda de verdad la petición que bloquea el
"Análisis actualizado correctamente." de la página.

Uso:
    python tools/time_forex.py                  # cascada de EURUSD (para en el 1er éxito)
    python tools/time_forex.py --all            # cronometra los 4 combos por separado
    python tools/time_forex.py --pair usdjpy     # otro par
    python tools/time_forex.py --timeout 6      # tope por petición (segundos)
"""
import argparse
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROXIES = [
    "https://api.allorigins.win/raw?url=",
    "https://api.cors.lol/?url=",
]
YAHOO_HOSTS = ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"]
# yahoo: símbolo de cada par, igual que js/forex.js
PAIRS = {
    "eurusd": "EURUSD=X", "usdcop": "COP=X", "gbpusd": "GBPUSD=X",
    "usdjpy": "JPY=X", "usdmxn": "MXN=X",
}


def encode_component(s):
    """Igual que encodeURIComponent() de JavaScript."""
    return urllib.parse.quote(s, safe="-_.!~*'()")


def time_combo(host, proxy, yahoo_symbol, timeout):
    path = f"/v8/finance/chart/{yahoo_symbol}?interval=1d&range=3mo"
    target = encode_component(host + path)
    url = proxy + target
    t0 = time.time()
    result = {
        "host": host.split("//")[1].split(".")[0],
        "proxy": proxy.split("//")[1].split(".")[0],
        "ms": None,
        "ok": False,
        "detail": "",
    }
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            body = resp.read()
        ms = round((time.time() - t0) * 1000)
        result["ms"] = ms
        data = json.loads(body)
        chart = data.get("chart") or {}
        rows = chart.get("result") or []
        bars = len(rows[0].get("timestamp", [])) if rows else 0
        if rows and bars:
            result["ok"] = True
            result["detail"] = f"HTTP 200 + JSON válido ({bars} velas)"
        else:
            result["detail"] = "HTTP 200 pero sin datos de Yahoo"
    except urllib.error.HTTPError as exc:
        result["ms"] = round((time.time() - t0) * 1000)
        result["detail"] = f"HTTP {exc.code}"
    except Exception as exc:  # noqa: BLE001
        result["ms"] = round((time.time() - t0) * 1000)
        result["detail"] = f"{type(exc).__name__}: {exc}"[:90]
    return result


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--pair", default="eurusd", choices=sorted(PAIRS))
    ap.add_argument("--all", action="store_true",
                    help="mide los 4 combos por separado en vez de parar en el 1er éxito")
    ap.add_argument("--timeout", type=float, default=10.0, help="tope por petición (s)")
    args = ap.parse_args()

    symbol = PAIRS[args.pair]
    print(f"Par {args.pair.upper()} -> Yahoo «{symbol}»")
    print(f"Cascada: {len(YAHOO_HOSTS)} hosts x {len(PROXIES)} proxies, "
          f"1 intento/combo, tope {args.timeout:g}s\n")

    results = []
    total0 = time.time()
    for host in YAHOO_HOSTS:
        for proxy in PROXIES:
            r = time_combo(host, proxy, symbol, args.timeout)
            results.append(r)
            flag = "OK " if r["ok"] else "fallo"
            print(f"  [{flag}] {r['host']:>7} x {r['proxy']:<11} {r['ms']:>5} ms  {r['detail']}")
            if r["ok"] and not args.all:
                break
        if results and results[-1]["ok"] and not args.all:
            break

    cascade_ms = round((time.time() - total0) * 1000)
    first_ok = next((r for r in results if r["ok"]), None)
    print()
    print(f"Lo que espera el usuario (hasta el 1er éxito): {first_ok['ms'] if first_ok else 'nunca llegó'} ms")
    print(f"Total de la medición: {cascade_ms} ms en {len(results)} peticion(es)")
    if not first_ok:
        print("Ningún combo funcionó: la página caería al backup de localStorage (24 h) "
              "o mostraría «Reintentar».")


if __name__ == "__main__":
    sys.exit(main())
