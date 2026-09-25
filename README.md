# 📊 MarketPulse

Plataforma web de **análisis diario multi-activo (cripto, metales y divisas)** con visión fundamental, visión técnica, probabilidades de subida/bajada, rango estimado de fluctuación del día y recomendación profesional.

## ✨ Características

- **Cripto**: BTC, ETH, SOL, XRP y DOGE — cada uno con su análisis completo.
- **Metales y energía**: Oro, Plata, Platino, Paladio y Petróleo WTI.
- **Divisas**: EUR/USD, GBP/USD, USD/JPY, USD/COP y USD/MXN.
- **Análisis fundamental**: sentimiento de mercado, variaciones 24h/7d, índice Miedo & Codicia y capitalización.
- **Análisis técnico**: RSI(14), medias móviles SMA20/SMA50 y MACD calculados en el navegador sobre 90 días de historial.
- **Probabilidades** de subida y bajada para cada análisis + probabilidad combinada ponderada.
- **Rango estimado del día**: escenarios alcista/bajista, horquilla de precio y precio esperado al cierre.
- **Gráficos**: evolución diaria de90 días con medias móviles (Chart.js) + gráfico en tiempo real de1 min (TradingView).
- **Home** con resumen general del mercado, titular rotatorio (cripto → metales → divisas, cada 30 s) y botones a cada activo.
- **Sobre nosotros** con metodología y aviso de riesgo.
- **Responsive**, tema oscuro/claro e idioma ES/EN (persistidos en `localStorage`).

## 📄 Estructura

```
├── index.html        # Home con resumen del mercado (cripto + accesos metales/forex)
├── analysis.html     # Análisis cripto ( ?coin=bitcoin|ethereum|solana|ripple|dogecoin )
├── metals.html       # Análisis metales/energía ( ?asset=gold|silver|platinum|palladium|oil )
├── forex.html        # Análisis divisas ( ?pair=eurusd|gbpusd|usdjpy|usdcop|usdmxn )
├── about.html        # Sobre nosotros
├── legal.html        # Políticas de uso y liberación de responsabilidad
├── css/style.css     # Estilos + temas claro/oscuro
├── js/app.js         # Lógica de análisis cripto y gráficos
├── js/metals.js      # Lógica de análisis metales/energía
├── js/forex.js       # Lógica de análisis divisas
├── js/site.js        # Home/About: tema, idioma y datos de mercado
├── js/version.js     # Versión del programa + sello del pie (versión, copyright, año)
└── assets/logo-marketpulse.svg   # Logo global
```

## 🚀 Ejecutar en local

```bash
cd bitcoin-dashboard
python -m http.server8090
# abrir http://localhost:8090
```

## 🌐 Desplegar

Es una web **100% estática** (sin backend). Opciones gratuitas:

- **Netlify Drop**: arrastrar la carpeta a https://app.netlify.com/drop
- **GitHub Pages**: subir a un repo → Settings → Pages → rama `main`
- **Vercel / Cloudflare Pages**: CLI o integración con GitHub

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
| Divisas (`js/forex.js`) | `OANDA:EURUSD`, `OANDA:GBPUSD`, `OANDA:USDJPY`, `OANDA:USDMXN`, `FX_IDC:USDCOP` |

Si el widget muestra *«Este símbolo no existe»*, el proveedor elegido no publica ese activo en TradingView: verifica el prefijo correcto (`OANDA`, `FX_IDC` = datos de ICE, `NYMEX`, `BINANCE`) en `https://www.tradingview.com/symbols/<SÍMBOLO>/`.

## 🧾 Políticas de uso y versión

- **Políticas de uso y liberación de responsabilidad**: página `legal.html`, accesible desde el enlace *«Políticas de uso y responsabilidad»* del pie de página de todas las vistas (7 apartados: uso permitido, uso no permitido, liberación de responsabilidad, riesgo de los activos, datos y disponibilidad, propiedad intelectual y contacto/cambios).
- **Versión del programa**: se define una sola vez en `js/version.js` (`APP_VERSION`, actual **v3.1.2**). El pie de página de las 6 páginas muestra `Versión vX.Y.Z`.
- **Copyright**: `© <año actual> MarketPulse`; el año se calcula automáticamente en el navegador.
- **Fecha de la política**: `APP_RELEASE` en `js/version.js`, en español e inglés.

Para publicar una versión nueva: cambia `APP_VERSION` (y `APP_RELEASE` si aplica) en `js/version.js` y sube el cache-bust `?v=N` de `css/style.css` y de los JS modificados.

## ⚠️ Aviso de riesgo

MarketPulse **no presta asesoría financiera**. Los estimados se generan automáticamente a partir de modelos estadísticos y datos públicos, y no garantizan resultados. Cripto, metales y divisas son activos volátiles: nunca inviertas más de lo que puedes permitirte perder.
