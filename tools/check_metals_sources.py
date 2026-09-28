#!/usr/bin/env python3
"""Prueba que rutas de datos siguen vivas para Platino (PL=F / XPTUSD).

Comprueba los combos proxy x host Yahoo que usa metals.js y varias alternativas,
ademas de Stooq como segunda fuente de historiales para metales sin Binance.

Uso:  python tools/time_metals.py --sources
"""
import time
import urllib.request
import urllib.parse

UA = {"User-Agent": "Mozilla/5.0 (MarketPulse-perf)"}


def get(url, timeout=10):
    t0 = time.time()
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
        return round((time.time() - t0) * 1000), len(body), None, body
    except Exception as e:  # noqa: BLE001
        return round((time.time() - t0) * 1000), 0, str(e)[:60], b""


def main():
    ypath = "/v8/finance/chart/PL=F?interval=1d&range=3mo"
    proxies = {
        "allorigins": "https://api.allorigins.win/raw?url=",
        "cors.lol": "https://api.cors.lol/?url=",
        "codetabs": "https://api.codetabs.com/v1/proxy?quest=",
        "corsproxy.io": "https://corsproxy.io/?url=",
        "whateverorigin": "https://whateverorigin.org/get?url=",
    }
    print("== proxies con Yahoo PL=F (query1) ==")
    target = urllib.parse.quote("https://query1.finance.yahoo.com" + ypath, safe="")
    for name, prefix in proxies.items():
        ms, kb, err, _ = get(prefix + target)
        print(f"  {name:<15} {'OK ' if not err else 'ERR'} {ms:>6}ms {kb/1024:>5.1f}kb {err or ''}")

    print("\n== Stooq como 2a fuente de historial (CSV diario) ==")
    for sym in ["xptusd", "xauusd", "xagusd", "xpdusd"]:
        ms, kb, err, body = get(f"https://stooq.com/q/d/l/?s={sym}&i=d")
        head = body.decode("utf-8", "replace").strip().splitlines()
        rows = len(head) - 1 if head and head[0].lower().startswith("date") else 0
        last = head[-1][:48] if rows else ""
        print(f"  {sym:<8} {'OK ' if not err else 'ERR'} {ms:>6}ms filas={rows:<5} {err or last}")


def main():
    print("== contenido real de Stooq (que devuelve?) ==")
    for sym in ["xptusd", "xauusd", "pl.f", "xpt"]:
        ms, kb, err, body = get(f"https://stooq.com/q/d/l/?s={sym}&i=d")
        txt = body.decode("utf-8", "replace").strip()
        print(f"  {sym:<7} {ms:>5}ms kb={kb:<5} {'ERR ' + (err or '') if err else txt[:110]!r}")

    print("\n== fiabilidad de allorigins con PL=F (6 intentos) ==")
    target = urllib.parse.quote(
        "https://query1.finance.yahoo.com/v8/finance/chart/PL=F?interval=1d&range=3mo", safe="")
    ok = 0
    times = []
    for i in range(6):
        ms, kb, err, _ = get("https://api.allorigins.win/raw?url=" + target, timeout=12)
        times.append(ms)
        ok += 1 if not err and kb > 1000 else 0
        print(f"  intento {i + 1}: {'OK ' if not err else 'ERR'} {ms:>6}ms {kb/1024:>5.1f}kb {err or ''}")
    print(f"  -> {ok}/6 correctas, media {sum(times) // len(times)}ms, max {max(times)}ms")

    print("\n== gold-api (spot XPT, fuente del precio actual) ==")
    for i in range(3):
        ms, kb, err, body = get("https://api.gold-api.com/price/XPT", timeout=12)
        print(f"  intento {i + 1}: {'OK ' if not err else 'ERR'} {ms:>6}ms "
              f"{err or body.decode('utf-8', 'replace')[:80]}")


if __name__ == "__main__":
    main()
