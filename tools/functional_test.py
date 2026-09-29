"""Banco de pruebas funcional del desplegable de idioma.

Se inyecta en una copia de cada pagina para comprobar en un navegador real
que cambiar de idioma funciona de verdad. Cubre el bug que se dio en
analysis/metals/forex, donde el menu se abria pero setLang no se ejecutaba.

Uso:  python tools/functional_test.py
Genera _t_<pagina>.html, las abre con Chrome headless y lee el veredicto.
"""
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHROME_CANDIDATES = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    r"C:\Program Files\Microsoft\Edge\Application\msedge.exe",
]

# Paginas a probar y una clave data-i18n presente en cada una, cuyo texto ES
# y EN son distintos: si el idioma cambia, ese texto tiene que cambiar.
TEST_KEY = {
    "index.html": "navHome",
    "analysis.html": "navHome",
    "metals.html": "navHome",
    "forex.html": "navHome",
    "about.html": "navAbout",
    "legal.html": "legalTitle",
    "404.html": "errorHeading",
}

# Elemento cuyo texto tiene que dejar de estar vacio cuando la red responde.
# En la portada se mide el estado y las tarjetas; el resto, la fecha de pie.
LIVE_PROBE = {
    "index.html": "#statusText",
    "analysis.html": "#updateTime",
    "metals.html": "#updateTime",
    "forex.html": "#updateTime",
    "about.html": "#updateTime",
    "legal.html": None,
    "404.html": "#updateTime",
}

HARNESS = r"""
<script>
window.addEventListener('load', function () {
  var out = [];
  function sample() {
    var el = document.querySelector('[data-i18n="%s"]');
    return el ? el.textContent.trim() : '(sin elemento)';
  }
  var toggle = document.getElementById('langToggle');
  var menu = document.getElementById('langMenu');
  out.push('lang_inicial=' + document.documentElement.lang);
  out.push('texto_inicial=' + sample());
  if (!toggle || !menu) {
    out.push('FALLO: no existe el desplegable');
  } else {
    toggle.click();
    out.push('menu_abierto=' + (!menu.hidden));
    var en = menu.querySelector('.lang-option[data-lang="en"]');
    if (!en) {
      out.push('FALLO: no hay opcion EN');
    } else {
      en.click();
      out.push('lang_tras_clic=' + document.documentElement.lang);
      out.push('texto_tras_clic=' + sample());
      out.push('localStorage=' + (localStorage.getItem('btc-lang') || '(vacio)'));
      out.push('etiqueta_boton=' + (document.getElementById('langCurrent') || {}).textContent);
    }
  }
  // Segunda parte: comprobar que tambien vuelve a ES.
  var toggle2 = document.getElementById('langToggle');
  var menu2 = document.getElementById('langMenu');
  if (toggle2 && menu2) {
    toggle2.click();
    var es = menu2.querySelector('.lang-option[data-lang="es"]');
    if (es) {
      es.click();
      out.push('vuelta_a_es=' + document.documentElement.lang);
    }
  }
  // Cuarta parte: boton de tema, para confirmar que responde.
  var theme = document.getElementById('themeToggle');
  if (theme) {
    var antes = document.documentElement.getAttribute('data-theme');
    theme.click();
    out.push('tema_cambio=' + (document.documentElement.getAttribute('data-theme') !== antes));
    theme.click();
  } else {
    out.push('tema_cambio=sin_boton');
  }
  // Quinta parte: ¿llego data de la red? Se mide el texto de estado y la
  // fecha de pie; si siguen vacios o en el guion, las APIs fallaron.
  var probe = document.querySelector('%s');
  if (probe) {
    out.push('datos=' + (probe.textContent.trim() || '(vacio)').slice(0, 60));
  } else {
    out.push('datos=sin_elemento');
  }

  // Sexta parte: ¿puede el navegador alcanzar la API desde esta pagina?
  // En headless puede estar bloqueado por la red, y eso no dice nada del
  // sitio: se mide aparte para no confundirlo con un fallo del codigo.
  fetch('https://api.coingecko.com/api/v3/ping')
    .then(function (r) { window.__ping = 'ok_' + r.status; })
    .catch(function (e) { window.__ping = 'fallo_' + String(e.message).slice(0, 40); });

  // Tercera parte: errores de consola acumulados.
  out.push('errores_js=' + (window.__errs ? window.__errs.length : 0));
  if (window.__errs) { out.push('detalle=' + window.__errs.join(' | ')); }
  var d = document.createElement('pre');
  d.id = 'TESTOUT';
  // El ping se resuelve despues: se espera un poco y se anade al informe.
  setTimeout(function () {
    out.push('api=' + (window.__ping || 'sin_respuesta'));
    d.textContent = out.join(' ;; ');
  }, 1500);
  document.body.appendChild(d);
});
window.__errs = [];
window.addEventListener('error', function (e) { window.__errs.push(e.message); });
</script>
"""


def find_chrome() -> str | None:
    for c in CHROME_CANDIDATES:
        if os.path.exists(c):
            return c
    return None


def run(chrome: str, url: str) -> str:
    proc = subprocess.run(
        [chrome, "--headless=new", "--disable-gpu", "--no-sandbox",
         "--virtual-time-budget=9000", "--dump-dom", url],
        capture_output=True, timeout=90)
    return proc.stdout.decode("utf-8", errors="replace")


def main() -> int:
    chrome = find_chrome()
    if not chrome:
        print("No se encuentra Chrome ni Edge: no se puede hacer la prueba funcional.")
        return 2

    fallos = 0
    print(f"Navegador: {chrome}\n")
    for page, key in TEST_KEY.items():
        src = os.path.join(ROOT, page)
        with open(src, encoding="utf-8") as fh:
            html = fh.read()
        harness = HARNESS % (key, LIVE_PROBE.get(page) or "body")
        html = html.replace("</body>", harness + "\n</body>")
        tmp_html = os.path.join(ROOT, "_t_" + page)
        with open(tmp_html, "w", encoding="utf-8") as fh:
            fh.write(html)

        url = "file:///" + tmp_html.replace("\\", "/")
        dom = run(chrome, url)
        os.remove(tmp_html)

        m = re.search(r'id="TESTOUT"[^>]*>(.*?)</pre>', dom, re.S)
        if not m:
            print(f"{page:<15} SIN RESULTADO (la pagina no llego a ejecutar el test)")
            fallos += 1
            continue
        data = dict(kv.split("=", 1) for kv in
                    (s.strip() for s in m.group(1).split(";;")) if "=" in kv)

        ok = (data.get("lang_tras_clic") == "en"
              and data.get("vuelta_a_es") == "es"
              and data.get("texto_inicial") != data.get("texto_tras_clic")
              and data.get("tema_cambio") == "true"
              and data.get("errores_js") == "0")
        print(f"{page:<15} {'OK  ' if ok else 'FALLO'} "
              f"{data.get('lang_inicial')}->{data.get('lang_tras_clic')}"
              f"->{data.get('vuelta_a_es')}  "
              f"menu={data.get('menu_abierto')}  "
              f"tema={data.get('tema_cambio')}  "
              f"errores={data.get('errores_js')}  "
              f"api={data.get('api')}  "
              f"datos={data.get('datos')}")
        if not ok:
            fallos += 1
            for k, v in data.items():
                print(f"                 {k} = {v}")

    print()
    print("TODO CORRECTO" if fallos == 0 else f"{fallos} PAGINA(S) CON FALLOS")
    return 1 if fallos else 0


if __name__ == "__main__":
    sys.exit(main())

