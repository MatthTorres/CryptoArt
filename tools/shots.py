#!/usr/bin/env python3
"""Capturas de pantalla de QA visual: tema claro y movil 390 px.

Por que existe: hasta ahora solo se habian revisado capturas de escritorio en
tema oscuro. Los cambios de rendimiento del commit b359e51 tocan
renderTradingView(), que es justo lo que se ejecuta al cambiar de tema, asi que
el escenario "tema claro" no podia quedar sin revisar.

El tema vive en localStorage['btc-theme'] y lo lee el JS al arrancar, asi que no
basta con pasar un flag por linea de comandos: hay que fijar el valor ANTES de que
se evalue el script. Por eso se genera una copia de cada pagina con un <script>
sincrono inyectado en el <head> (los scripts de la pagina son `defer`, de modo que
se ejecutan despues de cualquier script sincrono del head).

Uso:
    python tools/shots.py                 # todas las combinaciones
    python tools/shots.py --pages index,metals
    python tools/shots.py --views light,mobile
"""
import argparse
import os
import re
import shutil
import subprocess
import sys
import tempfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "shots")

PAGES = ["index", "analysis", "metals", "forex", "about", "legal", "404"]

VIEWS = {
    # nombre -> (ancho, alto, tema forzado)
    "dark": (1440, 1000, "dark"),
    "light": (1440, 1000, "light"),
    "mobile": (390, 844, "dark"),
    "mobile-light": (390, 844, "light"),
}


def find_chrome() -> str | None:
    for p in (
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"),
    ):
        if os.path.exists(p):
            return p
    for name in ("chrome", "google-chrome", "chromium", "msedge"):
        found = shutil.which(name)
        if found:
            return found
    return None


def build_paged_copy(page: str, theme: str, workdir: str) -> str | None:
    """Copia la pagina con localStorage pre-fijado. Devuelve la ruta o None."""
    src = os.path.join(ROOT, f"{page}.html")
    if not os.path.exists(src):
        return None
    with open(src, "r", encoding="utf-8") as fh:
        html = fh.read()

    inject = (
        "<script>try{localStorage.setItem('btc-theme',%s);"
        "localStorage.setItem('btc-lang','es');}catch(e){}</script>" % repr(theme)
    )
    # Si la pagina ya trae <html ...>, se inyecta justo despues: antes de
    # cualquier hoja de estilo y, sobre todo, antes de los scripts defer.
    if re.search(r"<html[^>]*>", html, re.I):
        html = re.sub(r"(<html[^>]*>)", r"\1" + inject, html, count=1, flags=re.I)
    else:
        html = inject + html

    dst = os.path.join(workdir, f"{page}.html")
    with open(dst, "w", encoding="utf-8") as fh:
        fh.write(html)
    return dst


def shoot(chrome: str, page_file: str, out_png: str, w: int, h: int) -> bool:
    """Captura con timeout acotado: TradingView se queda colgado con facilidad."""
    url = "file:///" + page_file.replace("\\", "/")
    cmd = [
        chrome,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        f"--window-size={w},{h}",
        # OJO: el presupuesto de tiempo virtual debe ser CORTO. Con 12000 las
        # paginas con TradingView (analysis, metals, forex) no terminan nunca: el
        # reloj virtual no avanza dentro de los iframes externos, Chrome espera
        # eternamente y hay que matarlo. Con 4000 la captura sale en ~11 s.
        "--virtual-time-budget=4000",
        f"--screenshot={out_png}",
        url,
    ]
    try:
        subprocess.run(cmd, capture_output=True, timeout=60)
    except subprocess.TimeoutExpired:
        print(f"  {os.path.basename(out_png)}  TIMEOUT (60 s)")
        return False
    ok = os.path.exists(out_png) and os.path.getsize(out_png) > 5000
    if not ok:
        print(f"  {os.path.basename(out_png)}  FALLO (sin imagen util)")
    return ok


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--pages", default=",".join(PAGES))
    ap.add_argument("--views", default="dark,light,mobile,mobile-light")
    args = ap.parse_args()

    chrome = find_chrome()
    if not chrome:
        print("No se encuentra Chrome/Edge: no se pueden hacer capturas.")
        return 1

    pages = [p.strip() for p in args.pages.split(",") if p.strip()]
    views = [v.strip() for v in args.views.split(",") if v.strip()]
    unknown = [v for v in views if v not in VIEWS]
    if unknown:
        print(f"Vistas no reconocidas: {unknown}. Opciones: {list(VIEWS)}")
        return 1

    os.makedirs(OUT, exist_ok=True)
    print(f"Navegador: {chrome}\n")

    workdir = tempfile.mkdtemp(prefix="mp_shots_")
    # Copia de recursos (css/js/assets) para que file:// resuelva igual que el repo.
    for item in ("css", "js", "assets"):
        src = os.path.join(ROOT, item)
        if os.path.isdir(src):
            shutil.copytree(src, os.path.join(workdir, item), dirs_exist_ok=True)

    made, fallos = [], []
    try:
        for view in views:
            w, h, theme = VIEWS[view]
            print(f"--- {view}  ({w}x{h}, tema {theme}) ---")
            for page in pages:
                pf = build_paged_copy(page, theme, workdir)
                if not pf:
                    print(f"  {page:<14} no existe, se omite")
                    continue
                out_png = os.path.join(OUT, f"{view}_{page}.png")
                if os.path.exists(out_png):
                    os.remove(out_png)
                if shoot(chrome, pf, out_png, w, h):
                    size = os.path.getsize(out_png) // 1024
                    print(f"  {page:<14} OK  {size} KB")
                    made.append(os.path.basename(out_png))
                else:
                    fallos.append(f"{view}/{page}")
    finally:
        shutil.rmtree(workdir, ignore_errors=True)

    print(f"\nCapturas: {len(made)} en {OUT}")
    if fallos:
        print(f"CON FALLOS ({len(fallos)}): {fallos}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())