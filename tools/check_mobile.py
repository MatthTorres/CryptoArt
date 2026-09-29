#!/usr/bin/env python3
"""Detecta desbordamiento horizontal en movil (390 px) con emulacion real.

POR QUE NO BASTA CON --window-size
----------------------------------
Las capturas "moviles" hechas antes con `chrome --headless --window-size=390,844`
NO eran moviles. En Windows el ancho minimo de ventana es 500 px, asi que Chrome
abria a 500 y las capturas salian con 485 px de ancho util. Medido: se pidieron
320, 390 y 500 y document.documentElement.clientWidth devolvio 485 en los tres
casos. Ninguna prueba de movil anterior fue real.

La solucion es Emulation.setDeviceMetricsOverride de CDP, que fija el viewport
por protocolo y no depende del tamano de la ventana. Se habla con Chrome por su
puerto de depuracion con la libreria `websockets` (sin navegador de por medio).

El informe se obtiene con Runtime.evaluate en vez de inyectarse en el DOM: con
los CDN externos caidos, load y DOMContentLoaded no llegan a dispararse nunca y
una sonda basada en eventos se quedaria sin ejecutar (verde falso).

Uso:
    python tools/check_mobile.py
    python tools/check_mobile.py --width 360 --page index
"""
import argparse
import base64
import json
import os
import shutil
import subprocess
import sys
import tempfile
import time
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "shots")
PAGES = ["index", "analysis", "metals", "forex", "about", "legal", "404"]

# Devuelve un JSON con el viewport real, el ancho de scroll y los elementos
# que se salen por la derecha.
PROBE_JS = r"""
(function () {
  var d = document.documentElement;
  var limite = d.clientWidth;
  var culpables = [];
  var todos = document.querySelectorAll('body *');
  for (var i = 0; i < todos.length; i++) {
    var e = todos[i];
    var r = e.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (r.right <= limite + 1) continue;
    if (getComputedStyle(e).position === 'fixed') continue;
    var cn = '';
    try { cn = (typeof e.className === 'string') ? e.className.trim() : ''; } catch (x) {}
    culpables.push({
      sel: e.tagName.toLowerCase() + (e.id ? '#' + e.id : '')
           + (cn ? '.' + cn.split(/\s+/).slice(0, 3).join('.') : ''),
      right: Math.round(r.right),
      w: Math.round(r.width)
    });
  }
  return JSON.stringify({
    ancho: limite,
    scroll: d.scrollWidth,
    inner: window.innerWidth,
    culpables: culpables.slice(0, 15)
  });
})()
"""


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


def build(page: str, workdir: str) -> str | None:
    src = os.path.join(ROOT, f"{page}.html")
    if not os.path.exists(src):
        return None
    dst = os.path.join(workdir, f"{page}.html")
    shutil.copy(src, dst)
    return dst


class Cdp:
    """Cliente minimo del protocolo de depuracion: emular viewport y leer el DOM."""

    def __init__(self, port: int):
        self.port = port
        self._id = 0
        self.ws = None

    def connect(self, timeout: float = 25.0) -> None:
        import asyncio

        import websockets

        url = None
        deadline = time.time() + timeout
        while time.time() < deadline:
            try:
                with urllib.request.urlopen(
                    f"http://127.0.0.1:{self.port}/json/list", timeout=2
                ) as resp:
                    for t in json.load(resp):
                        if t.get("type") == "page" and t.get("webSocketDebuggerUrl"):
                            url = t["webSocketDebuggerUrl"]
                            break
                if url:
                    break
            except Exception:
                pass
            time.sleep(0.3)
        if not url:
            raise RuntimeError("no se encontro ninguna pestana de depuracion")
        # Un solo bucle asincrono para toda la sesion: connect, llamadas y cierre.
        self._loop = asyncio.new_event_loop()
        self.ws = self._loop.run_until_complete(
            websockets.connect(url, max_size=16 * 1024 * 1024, open_timeout=30)
        )

    def call(self, method: str, params: dict | None = None, timeout: float = 60.0):
        import asyncio

        self._id += 1
        payload = {"id": self._id, "method": method, "params": params or {}}

        async def rpc():
            await self.ws.send(json.dumps(payload))
            while True:
                msg = json.loads(await asyncio.wait_for(self.ws.recv(), timeout))
                if msg.get("id") == payload["id"]:
                    if "error" in msg:
                        raise RuntimeError(f"{method}: {msg['error']}")
                    return msg.get("result", {})

        return self._loop.run_until_complete(rpc())

    def close(self) -> None:
        if self.ws:
            try:
                self._loop.run_until_complete(self.ws.close())
            except Exception:
                pass
            self.ws = None
        try:
            self._loop.close()
        except Exception:
            pass


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--width", type=int, default=390)
    ap.add_argument("--height", type=int, default=844)
    ap.add_argument("--page", default=None, help="una sola pagina")
    ap.add_argument("--pages", default=None)
    ap.add_argument("--shots", action="store_true",
                    help="ademas de medir, guardar capturas reales del movil")
    args = ap.parse_args()

    chrome = find_chrome()
    if not chrome:
        print("No se encuentra Chrome/Edge.")
        return 1
    try:
        import websockets  # noqa: F401
    except ImportError:
        print("Falta la libreria 'websockets': pip install websockets")
        return 1

    if args.page:
        pages = [args.page]
    elif args.pages:
        pages = [p.strip() for p in args.pages.split(",") if p.strip()]
    else:
        pages = PAGES

    workdir = tempfile.mkdtemp(prefix="mp_ovf_")
    for item in ("css", "js", "assets"):
        src = os.path.join(ROOT, item)
        if os.path.isdir(src):
            shutil.copytree(src, os.path.join(workdir, item), dirs_exist_ok=True)

    # La ventana real se deja ancha: el viewport lo fija la emulacion de CDP.
    port = 9333
    proc = subprocess.Popen(
        [
            chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
            "--hide-scrollbars", f"--remote-debugging-port={port}",
            "--user-data-dir=" + os.path.join(workdir, "profile"), "about:blank",
        ],
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )

    cdp = Cdp(port)
    fallos = []
    try:
        cdp.connect()
        cdp.call("Page.enable")
        cdp.call("Runtime.enable")
        print(f"Emulando {args.width}x{args.height} px (mobile=true)\n")
        for page in pages:
            pf = build(page, workdir)
            if not pf:
                print(f"  {page:<12} no existe, se omite")
                continue
            url = "file:///" + pf.replace("\\", "/")
            try:
                cdp.call("Emulation.setDeviceMetricsOverride", {
                    "width": args.width, "height": args.height,
                    "deviceScaleFactor": 2, "mobile": True,
                })
                cdp.call("Page.navigate", {"url": url})
                time.sleep(4.0)   # margen para el CSS y el i18n
                res = cdp.call("Runtime.evaluate", {
                    "expression": PROBE_JS, "returnByValue": True,
                })
                data = json.loads(res["result"]["value"])
            except Exception as exc:
                print(f"  {page:<12} ERROR: {exc}")
                fallos.append(page)
                continue

            ancho, scroll, culpa = data["ancho"], data["scroll"], data["culpables"]

            if args.shots:
                os.makedirs(OUT, exist_ok=True)
                png = os.path.join(OUT, f"cdp_{args.width}_{page}.png")
                try:
                    shot = cdp.call("Page.captureScreenshot", {"format": "png"})
                    with open(png, "wb") as fh:
                        fh.write(base64.b64decode(shot["data"]))
                except Exception as exc:
                    print(f"  {page:<12} captura fallida: {exc}")

            if not culpa and scroll <= ancho + 1:
                print(f"  {page:<12} OK       viewport={ancho} scroll={scroll}")
            else:
                print(f"  {page:<12} DESBORDA viewport={ancho} scroll={scroll}")
                for c in culpa:
                    print(f"                 - {c['sel']}  right={c['right']} w={c['w']}")
                fallos.append(page)
    finally:
        cdp.close()
        proc.terminate()
        try:
            proc.wait(timeout=10)
        except subprocess.TimeoutExpired:
            proc.kill()
        shutil.rmtree(workdir, ignore_errors=True)

    print()
    if fallos:
        print(f"{len(fallos)} PAGINA(S) CON DESBORDAMIENTO: {fallos}")
        return 1
    print("SIN DESBORDAMIENTO HORIZONTAL")
    return 0


if __name__ == "__main__":
    sys.exit(main())