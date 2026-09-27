# 📊 MarketPulse

Plataforma web de **análisis diario multi-activo (cripto, metales y divisas)** con visión fundamental, visión técnica, probabilidades de subida/bajada, rango estimado de fluctuación del día y recomendación profesional.

## ✨ Características

- **Cripto**: BTC, ETH, SOL, XRP y DOGE — cada uno con su análisis completo.
- **Metales y energía**: Oro, Plata, Platino, Paladio y Petróleo WTI.
- **Divisas**: EUR/USD, GBP/USD, USD/JPY, USD/COP y USD/MXN, con botón **⇄ de inversión** para verlos al revés (USD/EUR, USD/GBP, JPY/USD, COP/USD, MXN/USD).
- **Análisis fundamental**: sentimiento de mercado, variaciones 24h/7d, índice Miedo & Codicia y capitalización.
- **Análisis técnico**: RSI(14), medias móviles SMA20/SMA50 y MACD calculados en el navegador sobre 90 días de historial.
- **Probabilidades** de subida y bajada para cada análisis + probabilidad combinada ponderada.
- **Rango estimado del día**: escenarios alcista/bajista, horquilla de precio y precio esperado al cierre.
- **Gráficos**: evolución diaria de90 días con medias móviles (Chart.js) + gráfico en tiempo real de1 min (TradingView).
- **Home** con resumen general del mercado, titular rotatorio (cripto → metales → divisas, cada 30 s de inactividad: cualquier interacción del usuario lo pospone) y botones a cada activo. El resumen y las estadísticas **acompañan al titular**: cambian entre datos de cripto, metales o divisas según el título visible.
- **Sobre nosotros** con metodología y aviso de riesgo.
- **Responsive**, tema oscuro/claro e idioma ES/EN (persistidos en `localStorage`).

## 📄 Estructura

```
├── index.html        # Home con resumen del mercado (cripto + accesos metales/forex)
├── analysis.html     # Análisis cripto ( ?coin=bitcoin|ethereum|solana|ripple|dogecoin )
├── metals.html       # Análisis metales/energía ( ?asset=gold|silver|platinum|palladium|oil )
├── forex.html        # Análisis divisas ( ?pair=eurusd|gbpusd|usdjpy|usdcop|usdmxn [&inv=1 invierte] )
├── about.html        # Sobre nosotros
├── legal.html        # Políticas de uso y liberación de responsabilidad
├── 404.html           # Página de error personalizada (HTTP 404, noindex, bilingüe)
├── css/style.css     # Estilos + temas claro/oscuro
├── js/app.js         # Lógica de análisis cripto y gráficos
├── js/metals.js      # Lógica de análisis metales/energía
├── js/forex.js       # Lógica de análisis divisas
├── js/site.js        # Home/About: tema, idioma y datos de mercado
├── js/version.js     # Versión del programa + sello del pie (versión, copyright, año)
├── robots.txt        # Permiso a rutas + URL del sitemap
├── sitemap.xml       # Las 6 páginas indexables
├── _headers          # Caché y seguridad (Netlify/Cloudflare Pages; el resto lo ignora)
├── tools/            # make_social_image.py · set_site_origin.py · check_site.py
├── assets/og-marketpulse.png     # Imagen social 1200×630 (Open Graph)
├── assets/apple-touch-icon.png   # Icono 180×180 para pantalla de inicio
└── assets/logo-marketpulse.svg   # Logo global
```

## 🚀 Ejecutar en local

```bash
cd bitcoin-dashboard
python -m http.server 8090
# abrir http://localhost:8090
```

## 🌐 Desplegar

Es una web **100% estática** (sin backend). Opciones gratuitas:

- **Netlify Drop**: arrastrar la carpeta a https://app.netlify.com/drop
- **GitHub Pages**: subir a un repo → Settings → Pages → rama `main`
- **Vercel / Cloudflare Pages**: CLI o integración con GitHub

### Dominio y SEO (paso a paso)

Hasta que haya hosting, las URLs absolutas (canonical, `og:url`, `og:image`,
`twitter:image`, `robots.txt` y `sitemap.xml`) usan el dominio reservado
`https://marketpulse.example` (`.example` lo reserva la IANA): si se publica sin fijar el
origen, sencillamente no se genera la tarjeta social ni se indexa. Para activarlo:

```bash
# 1) fija el dominio real en todas las URLs absolutas (incluye subcarpeta si aplica)
python tools/set_site_origin.py https://tudominio.com

# 2) comprueba que todo sigue en orden y que no queda ningún placeholder
python tools/check_site.py --require-domain

# 3) publica la carpeta como sitio estático (los 404 usan 404.html por convención)
```

Detalles según el host:

- `_headers` lo entienden **Netlify** y **Cloudflare Pages** (caché `immutable` para
  `css/` y `js/` gracias al cache-bust `?v=N`, y `no-cache` para el HTML). En **Vercel**
  esas cabeceras se configuran en `vercel.json`; en **GitHub Pages** no se pueden fijar
  (el `?v=N` ya evita que el HTML quede viejo en caché).
- `404.html` lo detectan los cuatro hosts anteriores sin configuración extra.
- Al cambiar `APP_VERSION` o cualquier JS/CSS modificado: sube su `?v=N`, actualiza la
  línea *Cache-bust en uso* y ejecuta `python tools/check_site.py` (lo verifica solo).
- Tras publicar: da de alta el `sitemap.xml` en **Search Console** y valida la tarjeta
  con el **Sharing Debugger** de Meta y **cards.twitter.com** (memorizan la imagen).

## 🗄️ Fuentes de datos (documentación interna)

> Los proveedores y los símbolos se detallan aquí **solo para mantenimiento del código**: las páginas públicas no los nombran (el pie de página muestra "Datos de mercado en tiempo real") ni describen los indicadores que se calculan.

- [CoinGecko API](https://www.coingecko.com/en/api) — cripto: precios, capitalización, volumen y sentimiento
- [Yahoo Finance](https://finance.yahoo.com/) — metales, energía y divisas (vía proxy)
- [Alternative.me Fear & Greed Index](https://alternative.me/crypto/fear-and-greed-index/) — miedo/codicia cripto
- [TradingView](https://www.tradingview.com/) — gráfico en tiempo real

**Símbolos de TradingView** (se definen por activo en el JS de cada sección):

| Sección | Símbolos |
| --- | --- |
| Cripto (`js/app.js`) | `BINANCE:BTCUSDT`, `ETHUSDT`, `SOLUSDT`, `XRPUSDT`, `DOGEUSDT` |
| Metales (`js/metals.js`) | `OANDA:XAUUSD`, `OANDA:XAGUSD`, `OANDA:XPTUSD`, `OANDA:XPDUSD`, `NYMEX:CL1!` |
| Divisas (`js/forex.js`) | `OANDA:EURUSD`, `OANDA:GBPUSD`, `OANDA:USDJPY`, `OANDA:USDMXN`, `FX_IDC:USDCOP` (invertidos: `FX_IDC:USDEUR`, `USDGBP`, `JPYUSD`, `COPUSD`, `MXNUSD`) |

Si el widget muestra *«Este símbolo no existe»*, el proveedor elegido no publica ese activo en TradingView: verifica el prefijo correcto (`OANDA`, `FX_IDC` = datos de ICE, `NYMEX`, `BINANCE`) en `https://www.tradingview.com/symbols/<SÍMBOLO>/`.

## ⚡ Rendimiento y datos (interno)

- **Cripto (`js/app.js`)**: historial, datos de mercado y sentimiento se piden **en paralelo** con un único `Promise.all` (antes iban en serie, y la página tardaba la suma de las tres). La pausa del gate anti-429 baja de 2 s a 400 ms, los reintentos de CoinGecko son cortos (3 en vez de 6, con `Retry-After` acotado a 2,5 s) porque hay respaldo a Binance, y la caché también dura 15 min.
- **Caché en dos niveles**: el historial de cada activo/par se guarda 15 min en `sessionStorage` y una copia de 24 h en `localStorage` (clave `backup_*`). Al saltar entre pestañas o volver atrás no se vuelve a pedir nada por la red; y si los proxies fallan se muestra el último historial guardado en lugar de una página de error.
- **Cascada de proxies**: Yahoo bloquea CORS, así que se prueban 2 hosts (`query1`/`query2`) × 2 proxies con CORS (`api.allorigins.win`, `api.cors.lol`), **con un solo intento por combinación y sin pausas artificiales**: se avanza al siguiente en cuanto falla. Proxies retirados por estar caídos: `corsproxy.io` (401) y `codetabs.com` (503).
- **Gráfico en vivo diferido**: el widget de TradingView es el recurso más pesado y está bajo el pliegue, así que se crea al entrar en pantalla con `IntersectionObserver` (red de seguridad a los 4 s) en vez de bloquear la carga inicial.
- **Scripts con `defer`** para que Chart.js (201 KB) no bloquee el pintado inicial.
- **Home**: los datos de metales y divisas del titular se piden de uno en uno (no 10 en paralelo, que disparaba el rate-limit del proxy) y se cachean 15 min en `localStorage`.
- **Inversión de pares (divisas)**: el modo `?inv=1` se pinta **antes** de pedir datos y cada pestaña de par lleva su `data-base-href`, de modo que al cambiar de par o de sección se conserva la dirección invertida sin duplicar el parámetro `inv`.
- **Navegación y accesibilidad**: la sección activa se marca en el HTML con `class="nav-link active"` + `aria-current="page"`, y el JS de cada sección (o `site.js` en home/about) vuelve a sincronizar ambos al cambiar de idioma o de activo.

## 🧾 Políticas de uso y versión

- **Políticas de uso y liberación de responsabilidad**: página `legal.html`, accesible desde el enlace *«Políticas de uso y responsabilidad»* del pie de página de todas las vistas (7 apartados: uso permitido, uso no permitido, liberación de responsabilidad, riesgo de los activos, datos y disponibilidad, propiedad intelectual y contacto/cambios).
- **Versión del programa**: se define una sola vez en `js/version.js` (`APP_VERSION`, actual **v3.5.0**). El pie de página de las 6 páginas muestra `Versión vX.Y.Z`, y cada HTML lleva el mismo `vX.Y.Z` como respaldo por si el navegador no ejecuta JS.
- **Cache-bust en uso**: `css/style.css?v=7`, `js/version.js?v=12`, `js/site.js?v=15`, `js/app.js?v=12`, `js/metals.js?v=11`, `js/forex.js?v=11`. Las 6 páginas apuntan a los mismos valores para no descargar dos copias del mismo archivo.
- **Pie de página unificado**: las 6 páginas cierran con las mismas dos líneas (versión con `data-app-version` y copyright con `data-app-year`) y con **dos enlaces que nunca apuntan a la página actual**: `index/analysis/metals/forex` → políticas + *Sobre nosotros*, `about` → políticas + *Inicio*, `legal` → *Inicio* + *Sobre nosotros*. La primera línea de `index/analysis/metals/forex/about` es el sello de datos de mercado (`footerPrefix` + `#updateTime`), que `js/version.js` rellena al cargar y el JS de cada sección sustituye después por la hora real del último dato; `legal.html` no muestra hora y usa la línea de marca (`footerBrandLine`) porque no tiene datos de mercado.
- **Copyright**: `© <año actual> MarketPulse`; el año se calcula automáticamente en el navegador.
- **Fecha de la política**: `APP_RELEASE` en `js/version.js`, en español e inglés.

Para publicar una versión nueva: cambia `APP_VERSION` (y `APP_RELEASE` si aplica) en `js/version.js` y sube el cache-bust `?v=N` de `css/style.css` y de los JS modificados.

## ⚠️ Aviso de riesgo

MarketPulse **no presta asesoría financiera**. Los estimados se generan automáticamente a partir de modelos estadísticos y datos públicos, y no garantizan resultados. Cripto, metales y divisas son activos volátiles: nunca inviertas más de lo que puedes permitirte perder.
