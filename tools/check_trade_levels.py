#!/usr/bin/env python3
"""Verifica que el bloque «Plan operativo» se pinta con datos reales.

Sirve el repo, carga cada página de análisis en Edge headless (dump-dom con
virtual-time-budget) y extrae las filas de #tradeLong / #tradeShort.

Uso:  python tools/check_trade_levels.py
"""
import http.server
import functools
import os
import re
import shutil
import subprocess
import tempfile
import threading

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
EDGE = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
PAGES = ["forex.html?pair=eurusd", "analysis.html?coin=bitcoin", "metals.html?asset=gold"]


def main():
    handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", 0), handler)
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()

    prof = tempfile.mkdtemp(prefix="mp_trade_")
    ok = True
    try:
        for page in PAGES:
            out = os.path.join(prof, re.sub(r"\W", "_", page) + ".html")
            args = [
                EDGE, "--headless", "--disable-gpu", "--no-sandbox", "--no-first-run",
                f"--user-data-dir={prof}",
                "--virtual-time-budget=40000", "--dump-dom",
                f"http://127.0.0.1:{port}/{page}",
            ]
            with open(out, "w", encoding="utf-8") as fh:
                subprocess.run(args, stdout=fh, stderr=subprocess.DEVNULL, timeout=120)
            html = open(out, encoding="utf-8").read()
            print(f"=== {page}")
            for box in ("tradeCons", "tradeMed", "tradeAgg"):
                m = re.search(
                    rf'id="{box}"[^>]*>(.*?)</div>\s*</div>', html, re.S)
                if not m:
                    print(f"   {box}: NO ENCONTRADO")
                    ok = False
                    continue
                rows = re.findall(
                    r'metric-name">([^<]+)</span><span class="metric-value [^"]*">([^<]+)',
                    m.group(1))
                if not rows:
                    print(f"   {box}: VACIO")
                    ok = False
                for name, val in rows:
                    print(f"   {box:10s} | {name:26s} = {val}")
    finally:
        srv.shutdown()
        shutil.rmtree(prof, ignore_errors=True)
    print("OK" if ok else "FALLO")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
