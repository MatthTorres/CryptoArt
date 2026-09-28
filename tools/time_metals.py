#!/usr/bin/env python3
"""Mide cuanto tarda el historial de cada metal: cascada en serie (como estaba)
frente a la carrera de proxies (como esta ahora).

Reproduce las dos estrategias sobre las mismas rutas reales (2 hosts de Yahoo x
2 proxies gratuitos). La cascada en serie suma los timeouts de los combos que
fallan; la carrera lanza todos escalonados 250 ms y se queda con el primero que
trae datos validos, que es lo que hace ahora fetchYahooChart en metals.js.

Uso:  python tools/time_metals.py
"""
import threading
import time
import urllib.parse
import urllib.request

UA = {"User-Agent": "Mozilla/5.0 (MarketPulse-perf)"}
PROXIES = {
    "allorigins": "https://api.allorigins.win/raw?url=",
    "cors.lol": "https://api.cors.lol/?url=",
}
HOSTS = ["query1", "query2"]
SYMBOLS = {"Oro GC=F": "GC=F", "Plata SI=F": "SI=F", "Platino PL=F": "PL=F"}
RACE_TIMEOUT = 7          # mismo tope que RACE_TIMEOUT_MS en metals.js
STAGGER = 0.25            # mismo escalonamiento que RACE_STAGGER_MS


def get(url, timeout=10):
    t0 = time.time()
    try:
        req = urllib.request.Request(url, headers=UA)
        with urllib.request.urlopen(req, timeout=timeout) as r:
            body = r.read()
        return round((time.time() - t0) * 1000), len(body), None
    except Exception as e:  # noqa: BLE001
        return round((time.time() - t0) * 1000), 0, str(e)[:48]


def urls_for(ysym):
    path = f"/v8/finance/chart/{ysym}?interval=1d&range=3mo"
    return [prefix + urllib.parse.quote(f"https://{h}.finance.yahoo.com{path}", safe="")
            for prefix in PROXIES.values() for h in HOSTS]


def measure(u):
    """Cascada en serie: prueba combo a combo y devuelve (1er OK, suma total)."""
    total = 0
    first_ok = None
    for url in urls_for(u):
        ms, kb, err = get(url, timeout=RACE_TIMEOUT)
        total += ms
        if first_ok is None and not err and kb > 1000:
            first_ok = ms
    return first_ok, total


def measure_race(u):
    """Carrera: todos salen escalonados; devuelve el tiempo del primer OK."""
    t0 = time.time()
    winner = {}

    def runner(idx, url):
        time.sleep(idx * STAGGER)
        ms, kb, err = get(url, timeout=RACE_TIMEOUT)
        if not err and kb > 1000:
            done = round((time.time() - t0) * 1000)
            if idx not in winner or done < winner[idx]:
                winner[idx] = done

    threads = [threading.Thread(target=runner, args=(i, url), daemon=True)
               for i, url in enumerate(urls_for(u))]
    for th in threads:
        th.start()
    deadline = time.time() + RACE_TIMEOUT + len(threads) * STAGGER + 1
    while time.time() < deadline and not winner:
        time.sleep(0.05)
    return min(winner.values()) if winner else None


def main():
    print("historial 3 meses | serial = suma de intentos | carrera = primer OK\n")
    for label, ysym in SYMBOLS.items():
        first_ok, total = measure(ysym)
        raced = measure_race(ysym)
        print(f"  {label:<12} serial {str(first_ok) + 'ms':>9} (peor caso {total}ms) | "
              f"carrera {str(raced) + 'ms':>8}")

    print("\nspot gold-api (se pide en paralelo, no suma):")
    for sym in ["XAU", "XAG", "XPT", "XPD"]:
        ms, kb, err = get(f"https://api.gold-api.com/price/{sym}")
        print(f"  gold-api {sym} {'OK ' if not err else 'ERR'} {ms:>6}ms {err or ''}")


if __name__ == "__main__":
    main()
