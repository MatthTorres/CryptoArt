# 📊 MarketPulse

Plataforma web de **análisis diario multi-activo (cripto, metales y divisas)** con visión fundamental, visión técnica, probabilidades de subida/bajada, rango estimado de fluctuación del día y recomendación profesional.

## ✨ Características

- **Cripto**: BTC, ETH, SOL, XRP y DOGE — cada uno con su análisis completo.
- **Metales, energía y carbono**: Oro, Platino, Paladio, Petróleo WTI, Cobre y Carbono.
  - **Nota sobre los dos nuevos activos**: el Cobre usa su futuro real (`HG=F`, USD por libra). El Carbono se analiza con `KRBN` (KraneShares Global Carbon Strategy ETF) porque **Yahoo Finance no publica serie diaria de los permisos de emisión (EUA)**: `C2E=F` devuelve solo 7 velas (insuficiente para RSI/SMA/MACD) y `ICEENDEX:ECF1!` solo existe en TradingView. `KRBN` sí replica futuros reales de permisos de emisión (EUA, CCA, RGGI, UKA y WCA) y tiene 6 meses de historial verificado. El gráfico de TradingView muestra el **mismo** instrumento que las métricas (`AMEX:KRBN`), para que el precio del gráfico cuadre con el del panel. ⚠️ No confundir `CARZ` con un ETF de carbono: es un ETF de **acciones** de la estrategia de carbono, así que sigue cotizaciones, no el precio del carbono.
  - **Por qué no está el grafeno** (decidido el 28/09/2026): el grafeno no tiene precio de mercado. No existe futuro, spot ni índice, y Yahoo Finance no publica ningún símbolo (`GRAPHENE`, `GRAPH` y `GOEV` devuelven «no data»; `GPH` devuelve 0 velas). Lo único cotizado son microcapitals de grafeno en OTCQB sin ingresos reales frente a su capitalización (`FGPHF`: 537 K de ingresos sobre 34,7 M de cap; `GMGMF`: 414 K sobre 222 M), cuyo precio mide la cotización de la empresa, no el del material. Meterlas en el panel daría un RSI y un MACD aparentemente de mercado sobre un valor que no es el grafeno, así que se excluyen a propósito. Si algún día existe un futuro o un índice de referencia, se añade como activo normal con su `yahoo` y su `tv` verificados (ver `tools/check_new_asset.py`).
  - **Por qué no está la plata** (retirada el 28/09/2026): su serie de Yahoo (`SI=F`) sí funciona (127 velas, precio $61,10), pero el respaldo de contingencia estaba roto. El plan B era `XAGUSDT` en Binance y **ese símbolo no existe** — devuelve HTTP 400 —; no hay ningún otro par de plata en Binance (`XAGUSDT`, `XAGUSD`, `SILVERUSDT` y `PAXGSUSDT` dan los cuatro 400). Quedaba un activo cuyo único plan de emergencia era un símbolo muerto, que es peor que no tener plan: si caía la fuente principal, la página no tenía salida. Se decidió quitarlo en vez de publicar un activo a medias. Si en el futuro Binance u otro proveedor publican un par de plata real, se reincorpora con `yahoo` y `tv` verificados.
  - **Por qué no está el uranio** (retirado el 28/09/2026, tras estar unos días en producción): no hay un mercado real que lo respalde. El futuro del U3O8 (`COMEX:UX1!`) tiene volumen 1 y interés abierto 4, y el «spot price» de TradeTech es un indicador de valoración publicado (promedio de transacciones, ofertas y bids para lotes de 2 millones de libras), no un mercado donde se compra y vende. Lo único con liquidez era `SRUUF`, un ETF de uranio físico, pero su precio mide **las acciones del trust, no el metal**: el panel habría mostrado un RSI y un MACD que parecen de commodity y no lo eran. Se retiró para no confundir a quien lo lee. Si algún día hay un futuro líquido o un índice de referencia, se reincorpora con `yahoo` y `tv` verificados.
- **Divisas**: EUR/USD, GBP/USD, USD/JPY, USD/COP y USD/MXN, con botón **⇄ de inversión** para verlos al revés (USD/EUR, USD/GBP, JPY/USD, COP/USD, MXN/USD).
- **Análisis fundamental**: sentimiento de mercado, variaciones 24h/7d, índice Miedo & Codicia y capitalización.
- **Análisis técnico**: RSI(14), medias móviles SMA20/SMA50 y MACD calculados en el navegador sobre 90 días de historial.
- **Probabilidades** de subida y bajada para cada análisis + probabilidad combinada ponderada.
- **Rango estimado del día**: escenarios alcista/bajista, horquilla de precio y precio esperado al cierre.
- **Plan operativo de hoy en el resumen**: con precio de entrada, stop loss y precio de salida concretos, en **3 perfiles de riesgo** (🛡️ conservador, ⚖️ medio y 🔥 arriesgado) alineados con la recomendación del día (larga o corta).
- **Gráficos**: evolución diaria de90 días con medias móviles (Chart.js) + gráfico en tiempo real de1 min (TradingView).
- **Home** con resumen general del mercado, titular rotatorio (cripto → metales → divisas, cada 30 s de inactividad: cualquier interacción del usuario lo pospone) y botones a cada activo. El resumen y las estadísticas **acompañan al titular**: cambian entre datos de cripto, metales o divisas según el título visible.
- **Sobre nosotros** con metodología y aviso de riesgo.
- **Responsive**, tema oscuro/claro e idioma **ES / EN / PT-BR** (persistido en `localStorage`). El idioma se elige con un array `LANGS` en `js/site.js` y los botones de los 7 HTML: añadir un cuarto idioma es añadir una entrada al array, su diccionario y el botón, sin tocar la lógica de las páginas. Los números y fechas usan el locale del idioma activo (`pt-BR` → `1.234,56` y `28/09/2026`).

## 📄 Estructura

```
├── index.html        # Home con resumen del mercado (cripto + accesos metales/forex)
├── analysis.html     # Análisis cripto ( ?coin=bitcoin|ethereum|solana|ripple|dogecoin )
├── metals.html       # Análisis metales/energía/carbono ( ?asset=gold|platinum|palladium|oil|copper|carbon )
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
├── tools/            # check_site.py · check_i18n.py · check_new_asset.py · check_yahoo_symbols.py · set_site_origin.py · perf_all.py · time_metals.py · time_forex.py · make_social_image.py
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

### Sincronización con el repositorio (regla del proyecto)

GitHub Pages **solo publica lo que está subido**: un commit local no se ve en
`https://matthtorres.github.io/CryptoArt/` hasta que se hace `git push`. Para que
la web publicada nunca quede desactualizada, **cada tanda de cambios se commitea
y se sube de inmediato**:

```bash
git add -A
git commit -m "Resumen del cambio"
git push origin main          # GitHub Pages despliega en ~1 minuto
```

Comprobación rápida de que local y publicado coinciden:

```bash
git status -sb                # debe terminar en "## main...origin/main" sin "ahead"
```

Si aparece `ahead N`, hay N commits que **solo existen en el ordenador** y que
todavía no se ven en la web. Tras el push, recargar con **Ctrl+Shift+R** porque
el navegador puede conservar el HTML, el CSS o el JS antiguos.

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

> Estos hosts (y los proxies de Yahoo) también se declaran como `preconnect` /
> `dns-prefetch` en el `<head>` de las páginas que los usan, para que la conexión
> esté lista cuando el JS pida datos. Si cambias un proxy, actualiza esas líneas.

**Símbolos de TradingView** (se definen por activo en el JS de cada sección):

| Sección | Símbolos |
| --- | --- |
| Cripto (`js/app.js`) | `BINANCE:BTCUSDT`, `ETHUSDT`, `SOLUSDT`, `XRPUSDT`, `DOGEUSDT` |
| Metales (`js/metals.js`) | `OANDA:XAUUSD`, `OANDA:XAGUSD`, `OANDA:XPTUSD`, `OANDA:XPDUSD`, `NYMEX:CL1!`, `COMEX:HG1!`, `AMEX:KRBN` |
| Divisas (`js/forex.js`) | `OANDA:EURUSD`, `OANDA:GBPUSD`, `OANDA:USDJPY`, `OANDA:USDMXN`, `FX_IDC:USDCOP` (invertidos: `FX_IDC:USDEUR`, `USDGBP`, `JPYUSD`, `COPUSD`, `MXNUSD`) |

Si el widget muestra *«Este símbolo no existe»*, el proveedor elegido no publica ese activo en TradingView: verifica el prefijo correcto (`OANDA`, `FX_IDC` = datos de ICE, `NYMEX`, `BINANCE`) en `https://www.tradingview.com/symbols/<SÍMBOLO>/`.

## ⚡ Rendimiento y datos (interno)

- **Cripto (`js/app.js`)**: historial, datos de mercado y sentimiento se piden **en paralelo** con un único `Promise.all` (antes iban en serie, y la página tardaba la suma de las tres). La pausa del gate anti-429 baja de 2 s a 400 ms, los reintentos de CoinGecko son cortos (3 en vez de 6, con `Retry-After` acotado a 2,5 s) porque hay respaldo a Binance, y la caché también dura 15 min.
- **Caché en dos niveles**: el historial de cada activo/par se guarda 15 min en `sessionStorage` y una copia de 24 h en `localStorage` (clave `backup_*`). Al saltar entre pestañas o volver atrás no se vuelve a pedir nada por la red; y si los proxies fallan se muestra el último historial guardado en lugar de una página de error.
- **Carrera de proxies**: Yahoo bloquea CORS, así que `fetchYahooChart` pone 2 hosts (`query1`/`query2`) × 2 proxies con CORS (`api.allorigins.win`, `api.cors.lol`) a **competir en paralelo**: cada ronda lanza **una petición por proxy** (más de una a la vez contra el mismo gratuito responde `429`) y gana la primera que traiga datos válidos, cancelando la perdedora. Si ninguna de la ronda responde, se prueba con el otro host. Tope 7 s por petición. Coste peor caso: `2 × 7 s`, frente a los ~32 s que sumaba la cascada en serie. Antes la cascada era en serie host→proxy y `gatedFetch` no aplicaba `AbortController`, así que un proxy colgado (típico con `PL=F`, Platino) se tragaba el timeout entero antes de probar el que sí respondía: el platino tardaba ~9 s. Proxies retirados por estar caídos: `corsproxy.io` (401) y `codetabs.com` (503).
- **Gráfico en vivo diferido**: el widget de TradingView es el recurso más pesado y está bajo el pliegue, así que se crea al entrar en pantalla con `IntersectionObserver` (red de seguridad a los 4 s) en vez de bloquear la carga inicial.
- **Scripts con `defer`** para que Chart.js (201 KB) no bloquee el pintado inicial.
- **Chart.js solo cuando se usa**: las páginas de análisis lo cargan de forma perezosa
  (`ensureChartJs()`, en `js/app.js`, `js/metals.js` y `js/forex.js`) y nunca como
  `<script>` estático en el HTML, así los datos del análisis no esperan a los 201 KB
  del CDN. Si el CDN falla, el gráfico muestra su aviso sin tumbar el análisis.
- **Tope por petición en todas las secciones**: `site.js`, `app.js`, `metals.js` y
  `forex.js` abortan cualquier petición que tarde más de 8 s (`AbortController`),
  de modo que ninguna página se queda en «Cargando…» si un proveedor se cuelga.
  En `analysis.html` y `metals.html` se añadieron `dns-prefetch` a los hosts que
  realmente se piden (Binance, Alternative.me, gold-api). Medido con
  `python tools/perf_all.py`: CoinGecko ≈0,6 s, Binance ≈1 s, Yahoo ≈0,5 s.
- **Divisas sin botón Reintentar**: si la carrera de proxies falla, `js/forex.js` reintenta
  solo con espera progresiva (3 s, 6 s, 12 s… hasta 30 s). A partir del 5º fallo
  seguido muestra «Sin conexión… Reintentando en segundo plano» y sigue
  reintentando cada 30 s hasta que los datos entren (nunca pide clic al usuario).
- **Home**: los datos de metales y divisas del titular se piden de uno en uno (no 10 en paralelo, que disparaba el rate-limit del proxy) y se cachean 15 min en `localStorage`.
- **Inversión de pares (divisas)**: el modo `?inv=1` se pinta **antes** de pedir datos y cada pestaña de par lleva su `data-base-href`, de modo que al cambiar de par o de sección se conserva la dirección invertida sin duplicar el parámetro `inv`.
- **Navegación y accesibilidad**: la sección activa se marca en el HTML con `class="nav-link active"` + `aria-current="page"`, y el JS de cada sección (o `site.js` en home/about) vuelve a sincronizar ambos al cambiar de idioma o de activo.

## 🧾 Políticas de uso y versión

- **Políticas de uso y liberación de responsabilidad**: página `legal.html`, accesible desde el enlace *«Políticas de uso y responsabilidad»* del pie de página de todas las vistas (7 apartados: uso permitido, uso no permitido, liberación de responsabilidad, riesgo de los activos, datos y disponibilidad, propiedad intelectual y contacto/cambios).
- **Versión del programa**: se define una sola vez en `js/version.js` (`APP_VERSION`, actual **v3.6.1**). El pie de página de las 6 páginas muestra `Versión vX.Y.Z`, y cada HTML lleva el mismo `vX.Y.Z` como respaldo por si el navegador no ejecuta JS.
- **Cache-bust en uso**: `css/style.css?v=9`, `js/version.js?v=13`, `js/site.js?v=19`, `js/app.js?v=18`, `js/metals.js?v=19`, `js/forex.js?v=18`. Las 6 páginas apuntan a los mismos valores para no descargar dos copias del mismo archivo.
- **Pie de página unificado**: las 6 páginas cierran con las mismas dos líneas (versión con `data-app-version` y copyright con `data-app-year`) y con **dos enlaces que nunca apuntan a la página actual**: `index/analysis/metals/forex` → políticas + *Sobre nosotros*, `about` → políticas + *Inicio*, `legal` → *Inicio* + *Sobre nosotros*. La primera línea de `index/analysis/metals/forex/about` es el sello de datos de mercado (`footerPrefix` + `#updateTime`), que `js/version.js` rellena al cargar y el JS de cada sección sustituye después por la hora real del último dato; `legal.html` no muestra hora y usa la línea de marca (`footerBrandLine`) porque no tiene datos de mercado.
- **Copyright**: `© <año actual> MarketPulse`; el año se calcula automáticamente en el navegador.
- **Fecha de la política**: `APP_RELEASE` en `js/version.js`, en español e inglés.

Para publicar una versión nueva: cambia `APP_VERSION` (y `APP_RELEASE` si aplica) en `js/version.js` y sube el cache-bust `?v=N` de `css/style.css` y de los JS modificados.

## ⚠️ Aviso de riesgo

MarketPulse **no presta asesoría financiera**. Los estimados se generan automáticamente a partir de modelos estadísticos y datos públicos, y no garantizan resultados. Cripto, metales y divisas son activos volátiles: nunca inviertas más de lo que puedes permitirte perder.
