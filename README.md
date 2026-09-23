# 🎨 CryptoArt

Plataforma web de **análisis diario de criptomonedas** con visión fundamental, visión técnica, probabilidades de subida/bajada, rango estimado de fluctuación del día y recomendación profesional.

## ✨ Características

- **5 pestañas de criptoactivos**: BTC, ETH, SOL, XRP y DOGE — cada uno con su análisis completo.
- **Análisis fundamental**: sentimiento de mercado, variaciones 24h/7d, índice Miedo & Codicia y capitalización.
- **Análisis técnico**: RSI(14), medias móviles SMA20/SMA50 y MACD calculados en el navegador sobre 90 días de historial.
- **Probabilidades** de subida y bajada para cada análisis + probabilidad combinada ponderada.
- **Rango estimado del día**: escenarios alcista/bajista, horquilla de precio y precio esperado al cierre.
- **Gráficos**: evolución diaria de90 días con medias móviles (Chart.js) + gráfico en tiempo real de1 min (TradingView).
- **Home** con resumen general del mercado y botones a cada cripto.
- **Sobre nosotros** con metodología y aviso de riesgo.
- **Responsive**, tema oscuro/claro e idioma ES/EN (persistidos en `localStorage`).

## 📄 Estructura

```
├── index.html        # Home con resumen del mercado
├── analysis.html     # Análisis completo ( ?coin=bitcoin|ethereum|solana|ripple|dogecoin )
├── about.html        # Sobre nosotros
├── css/style.css     # Estilos + temas claro/oscuro
├── js/app.js         # Lógica de análisis y gráficos
├── js/site.js        # Home/About: tema, idioma y datos de mercado
└── assets/logo.svg   # Logo
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

## 🗄️ Fuentes de datos

- [CoinGecko API](https://www.coingecko.com/en/api) — precios, capitalización, volumen y sentimiento de la comunidad
- [Alternative.me Fear & Greed Index](https://alternative.me/crypto/fear-and-greed-index/) — miedo/codicia del mercado
- [TradingView](https://www.tradingview.com/) — gráfico en tiempo real

## ⚠️ Aviso de riesgo

CryptoArt **no presta asesoría financiera**. Los estimados se generan automáticamente a partir de modelos estadísticos y datos públicos, y no garantizan resultados. Las criptomonedas son activos volátiles: nunca inviertas más de lo que puedes permitirte perder.
