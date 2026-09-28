#!/usr/bin/env python3
"""Prueba funcional + tiempos de MarketPulse (solo librería estándar).

1) Sirve el repo con http.server en un puerto libre.
2) GET a las 7 páginas + assets (mide ms y KB, valida 200).
3) Mide latencia real de las APIs externas que usa el JS:
   CoinGecko markets, Binance klines, Yahoo vía proxies, gold-api.
4) Resume qué debería tardar cada página en frío y qué pesa cada asset.

Uso:  python tools/perf_all.py
"""
import time
import urllib.request
import urllib.parse
import http.server
import functools
import threading
import os
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = {"User-Agent": "Mozilla/5.0 (MarketPulse-perf)"}


def get(url, timeout=12):
    t0 = time.time()
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
        return {"ok": True, "ms": round((time.time() - t0) * 1000),
                "kb": round(len(body) / 1024, 1), "status": 200}
    except Exception as e:  # noqa: BLE001
        code = getattr(e, "code", None)
        return {"ok": False, "ms": round((time.time() - t0) * 1000),
                "kb": 0, "status": code, "err": str(e)[:80]}


def main():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    base = f"http://127.0.0.1:{port}"
    print(f"Sirviendo {ROOT} en {base}\n")

    print("== Páginas y assets locales ==")
    worst_local = 0
    for p in ["index.html", "analysis.html", "metals.html", "forex.html",
              "about.html", "legal.html", "404.html",
              "css/style.css", "js/site.js", "js/app.js", "js/metals.js",
              "js/forex.js", "js/version.js", "assets/logo-marketpulse.svg",
              "sitemap.xml", "robots.txt"]:
        r = get(base + "/" + p)
        flag = "OK " if r["ok"] else "FALLO"
        worst_local = max(worst_local, r["ms"])
        print(f"  [{flag}] {p:28s} {r['ms']:>5} ms  {r['kb']:>6} KB")
    print(f"  Local más lento: {worst_local} ms\n")

    print("== APIs externas (lo que espera cada página en frío) ==")
    ext = {
        "home: coingecko markets(5)": "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin,ethereum,solana,ripple,dogecoin&price_change_percentage=24h,7d&sparkline=false",
        "home: fear&greed": "https://api.alternative.me/fng/?limit=1",
        "cripto: binance klines BTC": "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=90",
        "metales: gold-api oro": "https://api.gold-api.com/price/XAU",
    }
    for name, url in ext.items():
        r = get(url, timeout=12)
        flag = "OK " if r["ok"] else "FALLO"
        print(f"  [{flag}] {name:32s} {r['ms']:>5} ms  {r['kb']:>7} KB"
              + ("" if r["ok"] else f"  ({r.get('status')}/{r.get('err')})"))

    print("  Yahoo EURUSD=X vía proxies (cascada forex.js):")
    ypath = "/v8/finance/chart/EURUSD=X?interval=1d&range=3mo"
    for host in ["https://query1.finance.yahoo.com", "https://query2.finance.yahoo.com"]:
        for proxy in ["https://api.allorigins.win/raw?url=", "https://api.cors.lol/?url="]:
            url = proxy + urllib.parse.quote(host + ypath, safe="-_.!~*'()")
            r = get(url, timeout=12)
            flag = "OK " if r["ok"] else "FALLO"
            print(f"  [{flag}] {host.split('//')[1].split('.')[0]:>7s} x "
                  f"{proxy.split('//')[1].split('.')[0]:<11s} {r['ms']:>5} ms  {r['kb']:>7} KB"
                  + ("" if r["ok"] else f"  ({r.get('status')}/{r.get('err')})"))
            if r["ok"]:
                break
        else:
            continue
        break

    srv.shutdown()
    print("\nListo. El servidor local se apagó solo.")


if __name__ == "__main__":
    main()
