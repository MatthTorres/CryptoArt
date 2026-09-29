import sys, json, urllib.request, urllib.parse, time
from concurrent.futures import ThreadPoolExecutor

# Prueba si un símbolo de Yahoo tiene historial diario utilizable para el analisis
# tecnico del dashboard (se necesitan >=64 velas).
# Uso: python tools/check_yahoo_symbols.py HG=F SRUUF KRBN ...

PROXIES = [
    ("allorigins", "https://api.allorigins.win/raw?url={u}"),
    ("cors.lol", "https://api.cors.lol/?url={u}"),
]
HOSTS = ["query1.finance.yahoo.com"]


def check(sym):
    raw = f"https://query1.finance.yahoo.com/v8/finance/chart/{urllib.parse.quote(sym)}?interval=1d&range=6mo"
    for pname, tmpl in PROXIES:
        url = tmpl.format(u=urllib.parse.quote(raw, safe=""))
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=25) as r:
                d = json.loads(r.read().decode("utf-8", "replace"))
            res = d.get("chart", {}).get("result") or []
            err = d.get("chart", {}).get("error")
            if not res:
                return f"{sym:10s} sin datos ({pname}) {str(err)[:60]}"
            q = res[0]["indicators"]["quote"][0]
            closes = [c for c in (q.get("close") or []) if c is not None]
            ts = res[0].get("timestamp") or []
            last = time.strftime("%Y-%m-%d", time.gmtime(ts[-1])) if ts else "?"
            meta = res[0].get("meta", {})
            cur = meta.get("currency", "?")
            price = meta.get("regularMarketPrice") or (closes[-1] if closes else None)
            flag = "OK  " if len(closes) >= 64 else "POCAS"
            return f"{sym:10s} {flag} velas={len(closes):3d} ultimo={last} precio={price} {cur} via {pname}"
        except Exception as e:
            last_err = f"{type(e).__name__} {str(e)[:40]}"
        time.sleep(1.5)
    return f"{sym:10s} ERROR {last_err}"


if __name__ == "__main__":
    syms = sys.argv[1:] or ["HG=F"]
    for s in syms:
        print(check(s), flush=True)
        time.sleep(1.5)
