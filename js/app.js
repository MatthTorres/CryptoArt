// ==========================================================
// CryptoArt — Análisis Fundamental + Técnico de Bitcoin
// Fuentes: CoinGecko API (precios/mercado) y Alternative.me (Fear & Greed)
// ==========================================================

// ---------- Configuración de criptoactivos (5 pestañas) ----------
const COINS = {
  bitcoin:  { id: 'bitcoin',  tv: 'BINANCE:BTCUSDT',  name: 'Bitcoin',  symbol: 'BTC' },
  ethereum: { id: 'ethereum', tv: 'BINANCE:ETHUSDT', name: 'Ethereum', symbol: 'ETH' },
  solana:   { id: 'solana',   tv: 'BINANCE:SOLUSDT',  name: 'Solana',   symbol: 'SOL' },
  ripple:   { id: 'ripple',   tv: 'BINANCE:XRPUSDT',  name: 'XRP',      symbol: 'XRP' },
  dogecoin: { id: 'dogecoin', tv: 'BINANCE:DOGEUSDT', name: 'Dogecoin', symbol: 'DOGE' },
};

const coinParam = new URLSearchParams(location.search).get('coin');
const coinKey = COINS[coinParam] ? coinParam : 'bitcoin';
const coin = COINS[coinKey];

// Reemplaza {coin}/{pair}/{symbol} por la cripto activa (usado en i18n y textos dinámicos)
function fillText(s) {
  return String(s)
    .replace(/\{coin\}/g, coin.name)
    .replace(/\{pair\}/g, coin.tv)
    .replace(/\{symbol\}/g, coin.symbol);
}

const els = {
  statusText: document.getElementById('statusText'),
  statusRow: document.getElementById('statusRow'),
  currentPrice: document.getElementById('currentPrice'),
  priceChange: document.getElementById('priceChange'),
  themeToggle: document.getElementById('themeToggle'),
  langEs: document.getElementById('langEs'),
  langEn: document.getElementById('langEn'),
  fundBadge: document.getElementById('fundBadge'),
  fundMetrics: document.getElementById('fundMetrics'),
  fundUp: document.getElementById('fundUp'),
  fundDown: document.getElementById('fundDown'),
  fundUpBar: document.getElementById('fundUpBar'),
  fundDownBar: document.getElementById('fundDownBar'),
  techBadge: document.getElementById('techBadge'),
  techMetrics: document.getElementById('techMetrics'),
  techUp: document.getElementById('techUp'),
  techDown: document.getElementById('techDown'),
  techUpBar: document.getElementById('techUpBar'),
  techDownBar: document.getElementById('techDownBar'),
  recoPill: document.getElementById('recoPill'),
  combinedCircle: document.getElementById('combinedCircle'),
  combinedPct: document.getElementById('combinedPct'),
  summaryText: document.getElementById('summaryText'),
  rangeMetrics: document.getElementById('rangeMetrics'),
  rangeDate: document.getElementById('rangeDate'),
  tvBadge: document.getElementById('tvBadge'),
  recoDetails: document.getElementById('recoDetails'),
  updateTime: document.getElementById('updateTime'),
};

// ---------- Internacionalización (ES / EN) ----------
const I18N = {
  es: {
    docTitle: 'CryptoArt — Análisis Diario de {coin}',
    tagline: 'Análisis diario de {coin} · Fundamental + Técnico',
    navHome: 'Inicio',
    navAnalysis: 'Cripto',
    navMetals: 'Metales',
    navForex: 'Divisas',
    navAbout: 'Sobre nosotros',
    priceLabel: 'Precio actual',
    statusLoading: 'Cargando datos de mercado en tiempo real…',
    statusOk: 'Análisis actualizado correctamente.',
    statusError: '⚠️ No se pudieron cargar los datos en vivo (posible límite de la API o falta de conexión). Pulsa Reintentar en unos segundos.',
    statusLoadingCoin: 'Cargando datos de {coin}…',
    retry: 'Reintentar',
    fundTitle: 'Análisis Fundamental',
    fundDesc: 'Sentimiento de mercado, variaciones diarias, volumen y capitalización del día.',
    techTitle: 'Análisis Técnico',
    techDesc: 'RSI(14), medias móviles SMA20/SMA50 y MACD sobre los últimos 90 días.',
    up: 'Subida',
    down: 'Bajada',
    dailyTitle: 'Evolución del precio — 90 días',
    dailyDesc: 'Precio de cierre diario con medias móviles SMA 20 (verde) y SMA 50 (rojo) superpuestas.',
    liveTitle: 'Gráfico en tiempo real — TradingView',
    liveDesc: 'Gráfico en tiempo real provisto por TradingView · par {pair}, velas de 1 minuto.',
    connecting: 'Conectando…',
    live: 'En vivo',
    reconnecting: 'Reconectando…',
    offline: 'Sin conexión',
    summaryTitle: 'Resumen y Recomendación Profesional',
    combinedLabel: 'Prob. Subida Combinada',
    summaryPlaceholder: 'Analizando ambos enfoques para generar una recomendación…',
    disclaimer: '⚠️ Este análisis se genera automáticamente a partir de datos públicos (CoinGecko, Alternative.me) e indicadores estadísticos. No constituye asesoría financiera. Las inversiones en criptoactivos conllevan alto riesgo.',
    footerPrefix: 'CryptoArt · Datos: CoinGecko API & Alternative.me Fear & Greed Index · Actualizado:',
    m24h: 'Variación 24h',
    m7d: 'Variación 7 días',
    mFng: 'Índice Miedo/Codicia',
    mSentiment: 'Sentimiento comunidad (alcista)',
    mVolCap: 'Volumen 24h / Cap. mercado',
    mCap: 'Capitalización de mercado',
    metricRsi: 'RSI (14)',
    metricSma20: 'SMA 20 días',
    metricSma50: 'SMA 50 días',
    metricMacd: 'MACD',
    metricSignal: 'Señal MACD',
    metricHist: 'Histograma MACD',
    bullish: 'Alcista',
    bearish: 'Bajista',
    neutral: 'Neutral',
    recoBuy: 'COMPRA',
    recoSell: 'VENTA',
    recoHold: 'NEUTRAL',
    recoBuyText: 'Comprar / Mantener posiciones largas',
    recoSellText: 'Vender / Evitar nuevas entradas',
    recoHoldText: 'Mantener y esperar confirmación',
    detWeight: 'Peso técnico (55%) vs fundamental (45%) — el corto plazo se guía más por momentum de precio.',
    detFundUp: 'El contexto de mercado (sentimiento, dominancia, F&G) favorece a los compradores.',
    detFundDown: 'El contexto de mercado muestra cautela o presión vendedora.',
    detFundNeutral: 'El contexto de mercado se mantiene neutral, sin sesgo claro.',
    detTechUp: 'Los indicadores técnicos (RSI, medias móviles, MACD) sugieren momentum alcista.',
    detTechDown: 'Los indicadores técnicos sugieren debilidad o posible corrección.',
    detTechNeutral: 'Los indicadores técnicos están mixtos, sin tendencia definida.',
    detRisk: 'Gestiona el riesgo: usa stop-loss y no inviertas más de lo que puedes permitirte perder.',
    chartPrice: 'Precio de {coin} (USD)',
    rangeTitle: 'Rango estimado de fluctuación — hoy',
    rangeNote: 'Estimado a partir de la volatilidad y el movimiento medio diario de los últimos 90 días, ajustado por la probabilidad combinada de subida/bajada del análisis. Es una horquilla estadística informativa, no una garantía.',
    rangeVol: 'Volatilidad diaria (σ · 90 días)',
    rangeUp: 'Escenario alcista — máx. subida hoy',
    rangeDown: 'Escenario bajista — máx. bajada hoy',
    rangePrice: 'Horquilla de precio esperada hoy',
    rangeClose: 'Variación esperada al cierre de hoy',
    rangeClosePrice: 'Precio esperado al cierre de hoy',
    summaryText: 'Combinando el análisis fundamental ({fu}% de probabilidad de subida) con el análisis técnico ({tu}% de probabilidad de subida), el modelo estima una probabilidad combinada de subida del {cu}% para hoy, {date}. Recomendación profesional: {reco}.',
  },
  en: {
    docTitle: 'CryptoArt — Daily {coin} Analysis',
    tagline: 'Daily {coin} analysis · Fundamental + Technical',
    navHome: 'Home',
    navAnalysis: 'Crypto',
    navMetals: 'Metals',
    navForex: 'Forex',
    navAbout: 'About us',
    priceLabel: 'Current price',
    statusLoading: 'Loading live market data…',
    statusOk: 'Analysis updated successfully.',
    statusError: '⚠️ Could not load live data (possible API rate limit or no connection). Press Retry in a few seconds.',
    statusLoadingCoin: 'Loading {coin} data…',
    retry: 'Retry',
    fundTitle: 'Fundamental Analysis',
    fundDesc: 'Market sentiment, daily changes, volume and market cap for the day.',
    techTitle: 'Technical Analysis',
    techDesc: 'RSI(14), SMA20/SMA50 moving averages and MACD over the last 90 days.',
    up: 'Up',
    down: 'Down',
    dailyTitle: 'Price evolution — 90 days',
    dailyDesc: 'Daily closing price with SMA 20 (green) and SMA 50 (red) moving averages overlaid.',
    liveTitle: 'Real-time chart — TradingView',
    liveDesc: 'Real-time chart powered by TradingView · {pair} pair, 1-minute candles.',
    connecting: 'Connecting…',
    live: 'Live',
    reconnecting: 'Reconnecting…',
    offline: 'Offline',
    summaryTitle: 'Summary & Professional Recommendation',
    combinedLabel: 'Combined Up Probability',
    summaryPlaceholder: 'Analyzing both approaches to generate a recommendation…',
    disclaimer: '⚠️ This analysis is generated automatically from public data (CoinGecko, Alternative.me) and statistical indicators. It does not constitute financial advice. Cryptoasset investments carry high risk.',
    footerPrefix: 'CryptoArt · Data: CoinGecko API & Alternative.me Fear & Greed Index · Updated:',
    m24h: '24h change',
    m7d: '7-day change',
    mFng: 'Fear/Greed Index',
    mSentiment: 'Community sentiment (bullish)',
    mVolCap: '24h Volume / Mkt Cap',
    mCap: 'Market capitalization',
    metricRsi: 'RSI (14)',
    metricSma20: 'SMA 20 days',
    metricSma50: 'SMA 50 days',
    metricMacd: 'MACD',
    metricSignal: 'MACD Signal',
    metricHist: 'MACD Histogram',
    bullish: 'Bullish',
    bearish: 'Bearish',
    neutral: 'Neutral',
    recoBuy: 'BUY',
    recoSell: 'SELL',
    recoHold: 'NEUTRAL',
    recoBuyText: 'Buy / Hold long positions',
    recoSellText: 'Sell / Avoid new entries',
    recoHoldText: 'Hold and wait for confirmation',
    detWeight: 'Technical weight (55%) vs fundamental (45%) — the short term follows price momentum more closely.',
    detFundUp: 'Market context (sentiment, dominance, F&G) favors buyers.',
    detFundDown: 'Market context shows caution or selling pressure.',
    detFundNeutral: 'Market context remains neutral, no clear bias.',
    detTechUp: 'Technical indicators (RSI, moving averages, MACD) suggest bullish momentum.',
    detTechDown: 'Technical indicators suggest weakness or a possible correction.',
    detTechNeutral: 'Technical indicators are mixed, no defined trend.',
    detRisk: 'Manage risk: use a stop-loss and never invest more than you can afford to lose.',
    chartPrice: '{coin} price (USD)',
    rangeTitle: 'Estimated fluctuation range — today',
    rangeNote: 'Estimated from the volatility and average daily move of the last 90 days, adjusted by the combined up/down probability of the analysis. It is an informative statistical range, not a guarantee.',
    rangeVol: 'Daily volatility (σ · 90 days)',
    rangeUp: 'Bullish scenario — max upside today',
    rangeDown: 'Bearish scenario — max downside today',
    rangePrice: 'Expected price range today',
    rangeClose: 'Expected change at today\'s close',
    rangeClosePrice: 'Expected price at today\'s close',
    summaryText: 'Combining the fundamental analysis ({fu}% probability of going up) with the technical analysis ({tu}% probability of going up), the model estimates a combined upside probability of {cu}% for today, {date}. Professional recommendation: {reco}.',
  },
};

// ---------- Estado de preferencias (persistente) ----------
const state = {
  theme: localStorage.getItem('btc-theme') || 'dark',
  lang: localStorage.getItem('btc-lang') || 'es',
  statusKey: 'statusLoading',
};

function t(key) {
  return (I18N[state.lang] && I18N[state.lang][key]) || I18N.es[key] || key;
}

// Datos cacheados para re-render al cambiar idioma/tema
const cached = {};

function chartColors() {
  const light = state.theme === 'light';
  return {
    grid: light ? 'rgba(16,22,42,0.08)' : 'rgba(255,255,255,0.04)',
    tick: light ? '#6b7490' : '#7c86a0',
    tooltipBg: light ? '#ffffff' : '#161d35',
    tooltipBorder: light ? 'rgba(16,22,42,0.12)' : 'rgba(255,255,255,0.1)',
    title: light ? '#10162a' : '#f5f7fb',
    body: light ? '#444c63' : '#b9c2d6',
    legend: light ? '#444c63' : '#b9c2d6',
  };
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  els.themeToggle.textContent = state.theme === 'dark' ? '🌙' : '☀️';
}

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('btc-theme', theme);
  applyTheme();
  if (cached.prices) renderChart(cached.prices, cached.dates);
  renderTradingView();
}

function applyLang() {
  document.documentElement.lang = state.lang;
  document.title = fillText(t('docTitle'));
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = fillText(t(el.getAttribute('data-i18n')));
  });
  els.langEs.classList.toggle('active', state.lang === 'es');
  els.langEn.classList.toggle('active', state.lang === 'en');
  els.statusText.textContent = fillText(t(state.statusKey));
  renderAnalysis();
  renderTradingView();
  if (cached.prices) renderChart(cached.prices, cached.dates);
}

function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('btc-lang', lang);
  applyLang();
}

function fmtUSD(n) {
  const locale = state.lang === 'es' ? 'es-ES' : 'en-US';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}
function fmtPct(n, digits = 1) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(digits)}%`;
}
function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

function addMetricRow(container, name, value, cls) {
  const row = document.createElement('div');
  row.className = 'metric-row';
  row.innerHTML = `<span class="metric-name">${name}</span><span class="metric-value ${cls}">${value}</span>`;
  container.appendChild(row);
}

// ---------- Indicadores técnicos ----------
function sma(values, period) {
  if (values.length < period) return null;
  const slice = values.slice(-period);
  return slice.reduce((a, b) => a + b, 0) / period;
}

function ema(values, period) {
  if (values.length < period) return null;
  const k = 2 / (period + 1);
  let emaPrev = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  for (let i = period; i < values.length; i++) {
    emaPrev = values[i] * k + emaPrev * (1 - k);
  }
  return emaPrev;
}

function emaSeries(values, period) {
  const k = 2 / (period + 1);
  const out = [];
  let prev = values.slice(0, period).reduce((a, b) => a + b, 0) / period;
  out[period - 1] = prev;
  for (let i = period; i < values.length; i++) {
    prev = values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

function rsi(values, period = 14) {
  if (values.length < period + 1) return null;
  let gains = 0, losses = 0;
  for (let i = values.length - period; i < values.length; i++) {
    const diff = values[i] - values[i - 1];
    if (diff >= 0) gains += diff; else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 + rs);
}

function macd(values) {
  const ema12 = emaSeries(values, 12);
  const ema26 = emaSeries(values, 26);
  const macdLine = [];
  for (let i = 0; i < values.length; i++) {
    if (ema12[i] !== undefined && ema26[i] !== undefined) {
      macdLine[i] = ema12[i] - ema26[i];
    }
  }
  const macdValues = macdLine.filter(v => v !== undefined);
  const signal = ema(macdValues, 9);
  const macdNow = macdValues[macdValues.length - 1];
  return { macd: macdNow, signal, histogram: macdNow - signal };
}

// ---------- Fetch de datos (con reintento ante rate-limit/red) ----------
// CoinGecko permite ~5-15 req/min en plan gratuito. Navegar pestaña por
// pestaña (BTC->ETH->SOL->XRP->DOGE) dispara 3 req por moneda; la 4a/5a cae
// en 429. Por eso:
//  - fetchGate: solo 1 request CoinGecko a la vez, con pausa mínima (2s).
//  - Backoff con jitter + respeto a Retry-After (hasta 6 intentos).
//  - Fallback Binance (sin API key, sin rate-limit agresivo) para historial
//    y precio spot si CoinGecko falla -> las ultimas monedas TAMBIEN cargan.
let fetchGate = Promise.resolve();
function gatedFetch(url, options) {
  const run = fetchGate.then(async () => {
    try { return await fetch(url, options); }
    finally { await new Promise(r => setTimeout(r, 2000)); }
  });
  fetchGate = run.catch(() => {});
  return run;
}
const BINANCE_SYMBOL = {
  bitcoin: 'BTCUSDT', ethereum: 'ETHUSDT', solana: 'SOLUSDT',
  ripple: 'XRPUSDT', dogecoin: 'DOGEUSDT',
};
async function fetchJSON(url, tries = 6, baseDelay = 2500, useGate = true) {
  let lastErr = null;
  for (let i = 0; i < tries; i++) {
    try {
      const doFetch = useGate && url.includes('coingecko.com')
        ? gatedFetch(url)
        : fetch(url);
      const res = await doFetch;
      if (res.status === 429) {
        const retryAfter = Number(res.headers.get('Retry-After'));
        const wait = Number.isFinite(retryAfter) && retryAfter > 0
          ? retryAfter * 1000
          : baseDelay * Math.pow(2, i) + Math.random() * 1500;
        await new Promise(r => setTimeout(r, wait));
        continue;
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e;
      if (i === tries - 1) throw e;
      // Espera creciente con jitter: 2.5s, 5s, 10s, 20s, 40s
      await new Promise(r => setTimeout(r, baseDelay * Math.pow(2, i) + Math.random() * 1500));
    }
  }
  throw lastErr || new Error('fetch failed');
}
// Historial diario 90d vía Binance (klines 1d). Devuelve {prices, dates}.
// No requiere key y tolera muchas más req/min que CoinGecko.
async function loadHistoryBinance(symbol) {
  const data = await fetchJSON(
    `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1d&limit=90`,
    3, 1500, false
  );
  if (!Array.isArray(data) || !data.length) throw new Error('binance empty');
  const prices = data.map(k => Number(k[4]));
  const dates = data.map(k => new Date(k[0]));
  return { prices, dates };
}
// Precio spot vía Binance (ticker 24h): price, change%, volume, quoteVolume.
async function loadSpotBinance(symbol) {
  const tk = await fetchJSON(
    `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`,
    3, 1500, false
  );
  if (!tk || !tk.lastPrice) throw new Error('binance spot empty');
  return tk;
}

// Caché corta por moneda (5 min) + caché backup (24h) para recargas/cambios
// de pestaña instantáneos y para operar degradado si la API da 429.
const CACHE_TTL = 5 * 60 * 1000;
const CACHE_BACKUP_TTL = 24 * 60 * 60 * 1000;
function getCached(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    return Date.now() - ts < CACHE_TTL ? data : null;
  } catch { return null; }
}
function setCached(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch { /* cuota llena */ }
}
// Backup persistente (localStorage): permite render degradado aunque la API falle.
function getBackup(key) {
  try {
    const raw = localStorage.getItem('backup_' + key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    return Date.now() - ts < CACHE_BACKUP_TTL ? data : null;
  } catch { return null; }
}
function setBackup(key, data) {
  try { localStorage.setItem('backup_' + key, JSON.stringify({ ts: Date.now(), data })); } catch { /* cuota llena */ }
}

// Botón "Reintentar" en la fila de estado
function showRetry(container, onClick) {
  container.querySelectorAll('.retry-btn').forEach(b => b.remove());
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'retry-btn';
  btn.textContent = t('retry');
  btn.addEventListener('click', () => { btn.remove(); onClick(); });
  container.appendChild(btn);
}

async function loadMarketData() {
  const key = 'ca_mkt_' + coin.id;
  const cachedData = getCached(key);
  if (cachedData) return cachedData;
  try {
    const data = await fetchJSON(`https://api.coingecko.com/api/v3/coins/${coin.id}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=false`);
    setCached(key, data);
    setBackup(key, data);
    return data;
  } catch (e) {
    const backup = getBackup(key);
    if (backup) { setCached(key, backup); return backup; }
    throw e;
  }
}

async function loadHistoricalPrices() {
  const key = 'ca_hist_' + coin.id;
  const cachedData = getCached(key);
  if (cachedData) {
    return {
      prices: cachedData,
      dates: cachedData.map((_, i) => new Date(Date.now() - (cachedData.length - i) * 86400000)),
    };
  }
  // 1) Intento CoinGecko (serie oficial). 2) Fallback Binance si hay 429.
  try {
    const data = await fetchJSON(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart?vs_currency=usd&days=90&interval=daily`);
    const prices = data.prices.map(p => p[1]);
    const dates = data.prices.map(p => new Date(p[0]));
    setCached(key, prices);
    setBackup(key, prices);
    return { prices, dates };
  } catch (e) {
    try {
      const sym = BINANCE_SYMBOL[coin.id];
      if (sym) {
        const hb = await loadHistoryBinance(sym);
        setCached(key, hb.prices);
        setBackup(key, hb.prices);
        return hb;
      }
    } catch { /* sigue a backup */ }
    const backup = getBackup(key);
    if (backup) {
      setCached(key, backup);
      return {
        prices: backup,
        dates: backup.map((_, i) => new Date(Date.now() - (backup.length - i) * 86400000)),
      };
    }
    throw e;
  }
}

async function loadFearGreed() {
  // Opcional: si falla, el análisis sigue (fng = null).
  try {
    const data = await fetchJSON('https://api.alternative.me/fng/?limit=1', 2, 1500);
    return data.data[0];
  } catch { return null; }
}

// ---------- Serie de SMA para el gráfico ----------
function smaSeries(values, period) {
  const out = new Array(values.length).fill(null);
  for (let i = period - 1; i < values.length; i++) {
    const slice = values.slice(i - period + 1, i + 1);
    out[i] = slice.reduce((a, b) => a + b, 0) / period;
  }
  return out;
}

let priceChartInstance = null;

function renderChart(prices, dates) {
  const ctx = document.getElementById('priceChart').getContext('2d');
  const labels = dates.map(d => d.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }));
  const sma20Series = smaSeries(prices, 20);
  const sma50Series = smaSeries(prices, 50);
  const cc = chartColors();

  if (priceChartInstance) priceChartInstance.destroy();

  priceChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: fillText(t('chartPrice')),
          data: prices,
          borderColor: '#f2a900',
          backgroundColor: 'rgba(242,169,0,0.12)',
          borderWidth: 2,
          fill: true,
          pointRadius: 0,
          tension: 0.25,
        },
        {
          label: 'SMA 20',
          data: sma20Series,
          borderColor: '#17e6b0',
          borderWidth: 1.5,
          fill: false,
          pointRadius: 0,
          borderDash: [4, 3],
          tension: 0.25,
        },
        {
          label: 'SMA 50',
          data: sma50Series,
          borderColor: '#ff5d6c',
          borderWidth: 1.5,
          fill: false,
          pointRadius: 0,
          borderDash: [2, 2],
          tension: 0.25,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: {
          labels: { color: cc.legend, usePointStyle: true, boxWidth: 8, font: { family: 'Inter', size: 11 } },
        },
        tooltip: {
          backgroundColor: cc.tooltipBg,
          borderColor: cc.tooltipBorder,
          borderWidth: 1,
          titleColor: cc.title,
          bodyColor: cc.body,
          callbacks: {
            label: (item) => `${item.dataset.label}: ${fmtUSD(item.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: cc.tick, maxTicksLimit: 10, font: { size: 10 } },
          grid: { color: cc.grid },
        },
        y: {
          ticks: { color: cc.tick, font: { size: 10 }, callback: (v) => fmtUSD(v) },
          grid: { color: cc.grid },
        },
      },
    },
  });
}

// ---------- Análisis Fundamental ----------
// Acepta market CoinGecko O market adaptado desde Binance (spot), para que
// XRP/SOL/DOGE rindan aunque CoinGecko devuelva 429.
function adaptBinanceMarket(spot, history) {
  const price = Number(spot.lastPrice);
  const change24h = Number(spot.priceChangePercent ?? 0);
  const volume24h = Number(spot.quoteVolume ?? 0);
  const last = history && history.prices ? history.prices : [];
  const ref7 = last.length >= 8 ? last[last.length - 8] : (last[0] ?? price);
  const change7d = ref7 ? ((price - ref7) / ref7) * 100 : 0;
  return {
    _binance: true,
    market_data: {
      current_price: { usd: price },
      price_change_percentage_24h: change24h,
      price_change_percentage_7d: change7d,
      total_volume: { usd: volume24h },
      market_cap: { usd: 0 },
    },
    sentiment_votes_up_percentage: 50,
  };
}
function analyzeFundamental(market, fng) {
  const md = market.market_data;
  const change24h = md.price_change_percentage_24h ?? 0;
  const change7d = md.price_change_percentage_7d ?? 0;
  const volume24h = md.total_volume.usd || 0;
  const marketCap = md.market_cap.usd || 0;
  const volMcapRatio = marketCap > 0 ? (volume24h / marketCap) * 100 : 0;
  const sentimentUp = market.sentiment_votes_up_percentage ?? 50;
  const fngValue = fng ? Number(fng.value) : 50;
  const fngLabel = fng ? fng.value_classification : (state.lang === 'es' ? 'Neutral' : 'Neutral');

  let score = 50;
  score += clamp(change24h, -10, 10) * 1.5;
  score += clamp(change7d, -20, 20) * 0.6;
  score += (sentimentUp - 50) * 0.4;
  if (fng) {
    if (fngValue <= 25) score += 6;
    else if (fngValue >= 75) score -= 6;
    else score += (fngValue - 50) * 0.15;
  }

  const upProb = clamp(Math.round(score), 5, 95);
  const downProb = 100 - upProb;

  els.fundMetrics.innerHTML = '';
  addMetricRow(els.fundMetrics, t('m24h'), fmtPct(change24h), change24h >= 0 ? 'up' : 'down');
  addMetricRow(els.fundMetrics, t('m7d'), fmtPct(change7d), change7d >= 0 ? 'up' : 'down');
  addMetricRow(els.fundMetrics, t('mFng'), `${fngValue} · ${translateFng(fngLabel)}`, fngValue >= 50 ? 'up' : 'down');
  addMetricRow(els.fundMetrics, t('mSentiment'), `${sentimentUp.toFixed(0)}%`, sentimentUp >= 50 ? 'up' : 'down');
  if (marketCap > 0) {
    addMetricRow(els.fundMetrics, t('mVolCap'), `${volMcapRatio.toFixed(2)}%`, 'neutral');
    addMetricRow(els.fundMetrics, t('mCap'), fmtUSD(marketCap), 'neutral');
  } else {
    addMetricRow(els.fundMetrics, t('mVolCap'), fmtUSD(volume24h) + ' (24h)', 'neutral');
    addMetricRow(els.fundMetrics, t('mCap'), state.lang === 'es' ? 'Vía Binance (spot)' : 'Via Binance (spot)', 'neutral');
  }

  els.fundUp.textContent = `${upProb}%`;
  els.fundDown.textContent = `${downProb}%`;
  els.fundUpBar.style.width = `${upProb}%`;
  els.fundDownBar.style.width = `${downProb}%`;
  setBadge(els.fundBadge, upProb);

  return { upProb, downProb };
}

function translateFng(label) {
  if (state.lang === 'en') return label;
  const map = {
    'Extreme Fear': 'Miedo extremo',
    'Fear': 'Miedo',
    'Neutral': 'Neutral',
    'Greed': 'Codicia',
    'Extreme Greed': 'Codicia extrema',
  };
  return map[label] || label;
}

// ---------- Análisis Técnico ----------
function analyzeTechnical(prices) {
  const lastPrice = prices[prices.length - 1];
  const rsi14 = rsi(prices, 14);
  const sma20 = sma(prices, 20);
  const sma50 = sma(prices, 50);
  const { macd: macdVal, signal, histogram } = macd(prices);

  let score = 50;
  if (rsi14 !== null) {
    if (rsi14 < 30) score += 15;
    else if (rsi14 > 70) score -= 15;
    else score += (50 - rsi14) * 0.3;
  }
  if (sma20 && sma50) {
    if (lastPrice > sma20 && sma20 > sma50) score += 15;
    else if (lastPrice < sma20 && sma20 < sma50) score -= 15;
    else if (lastPrice > sma20) score += 6;
    else score -= 6;
  }
  if (histogram !== undefined && !Number.isNaN(histogram)) {
    score += clamp(histogram / lastPrice * 10000, -12, 12);
  }

  const upProb = clamp(Math.round(score), 5, 95);
  const downProb = 100 - upProb;

  els.techMetrics.innerHTML = '';
  addMetricRow(els.techMetrics, t('metricRsi'), rsi14 ? rsi14.toFixed(1) : '—',
    rsi14 < 30 ? 'up' : rsi14 > 70 ? 'down' : 'neutral');
  addMetricRow(els.techMetrics, t('metricSma20'), sma20 ? fmtUSD(sma20) : '—', lastPrice > sma20 ? 'up' : 'down');
  addMetricRow(els.techMetrics, t('metricSma50'), sma50 ? fmtUSD(sma50) : '—', lastPrice > sma50 ? 'up' : 'down');
  addMetricRow(els.techMetrics, t('metricMacd'), macdVal ? macdVal.toFixed(2) : '—', macdVal >= 0 ? 'up' : 'down');
  addMetricRow(els.techMetrics, t('metricSignal'), signal ? signal.toFixed(2) : '—', 'neutral');
  addMetricRow(els.techMetrics, t('metricHist'), histogram ? histogram.toFixed(2) : '—', histogram >= 0 ? 'up' : 'down');

  els.techUp.textContent = `${upProb}%`;
  els.techDown.textContent = `${downProb}%`;
  els.techUpBar.style.width = `${upProb}%`;
  els.techDownBar.style.width = `${downProb}%`;
  setBadge(els.techBadge, upProb);

  return { upProb, downProb };
}

function setBadge(el, upProb) {
  if (upProb >= 60) { el.textContent = t('bullish'); el.className = 'badge up'; }
  else if (upProb <= 40) { el.textContent = t('bearish'); el.className = 'badge down'; }
  else { el.textContent = t('neutral'); el.className = 'badge'; }
}

// ---------- Gráfico en tiempo real (TradingView) ----------
let tvScriptPromise = null;

function loadTradingViewScript() {
  if (tvScriptPromise) return tvScriptPromise;
  tvScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/tv.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return tvScriptPromise;
}

function renderTradingView() {
  const container = document.getElementById('tvChart');
  if (!container) return;
  const theme = state.theme === 'light' ? 'light' : 'dark';
  const locale = state.lang === 'es' ? 'es' : 'en';

  loadTradingViewScript()
    .then(() => {
      container.innerHTML = '';
      new TradingView.widget({
        container_id: 'tvChart',
        symbol: coin.tv,
        interval: '1',
        timezone: 'Etc/UTC',
        theme,
        style: '1',
        locale,
        toolbar_bg: theme === 'dark' ? '#10162a' : '#f4f6fb',
        enable_publishing: false,
        allow_symbol_change: false,
        autosize: true,
        hide_top_toolbar: false,
        hide_legend: false,
        save_image: false,
        studies: [],
      });
    })
    .catch(err => {
      console.error('Error cargando TradingView:', err);
      container.innerHTML = '<p class="card-desc">No se pudo cargar el gráfico de TradingView. Verifica tu conexión.</p>';
    });
}

// ---------- Resumen y recomendación ----------

// Rango estimado de fluctuación intradiaria:
// media del movimiento absoluto diario (90d) sesgada por las probabilidades combinadas.
function renderRangeBlock(upProb, downProb) {
  const prices = cached.prices;
  const market = cached.market;
  if (!prices || prices.length < 30 || !market) return;

  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const n = returns.length;
  const mean = returns.reduce((a, r) => a + r, 0) / n;
  const variance = returns.reduce((a, r) => a + (r - mean) ** 2, 0) / (n - 1);
  const sigma = Math.sqrt(variance);                     // volatilidad diaria (σ)
  const meanAbs = returns.reduce((a, r) => a + Math.abs(r), 0) / n; // movimiento medio diario

  const price = market.market_data.current_price.usd;
  // Sesgo: a mayor probabilidad de subida, mayor alcance al alza y menor a la baja
  const upPct = meanAbs * (0.5 + upProb / 100) * 100;
  const downPct = meanAbs * (0.5 + downProb / 100) * 100;
  const high = price * (1 + upPct / 100);
  const low = price * (1 - downPct / 100);
  // Variación esperada al cierre: valor ponderado por ambas probabilidades
  const closePct = (upProb / 100) * upPct - (downProb / 100) * downPct;
  const closePrice = price * (1 + closePct / 100);

  // Fecha del día en curso
  const locale = state.lang === 'es' ? 'es-ES' : 'en-US';
  const today = new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  els.rangeDate.textContent = `· ${today}`;

  els.rangeMetrics.innerHTML = '';
  addMetricRow(els.rangeMetrics, t('rangeVol'), `${(sigma * 100).toFixed(2)}%`, 'neutral');
  addMetricRow(els.rangeMetrics, t('rangeUp'), `+${upPct.toFixed(2)}% → ${fmtUSD(high)}`, 'up');
  addMetricRow(els.rangeMetrics, t('rangeDown'), `−${downPct.toFixed(2)}% → ${fmtUSD(low)}`, 'down');
  addMetricRow(els.rangeMetrics, t('rangePrice'), `${fmtUSD(low)} – ${fmtUSD(high)}`, 'neutral');
  addMetricRow(els.rangeMetrics, t('rangeClose'), fmtPct(closePct, 2), closePct >= 0 ? 'up' : 'down');
  addMetricRow(els.rangeMetrics, t('rangeClosePrice'), fmtUSD(closePrice), closePct >= 0 ? 'up' : 'down');
}

function buildSummary(fundamental, technical) {
  const combinedUp = Math.round(fundamental.upProb * 0.45 + technical.upProb * 0.55);

  els.combinedCircle.style.setProperty('--pct', `${combinedUp}%`);
  els.combinedPct.textContent = `${combinedUp}%`;

  let recoKey, recoClass, recoPillKey;
  if (combinedUp >= 62) { recoKey = 'recoBuyText'; recoClass = 'buy'; recoPillKey = 'recoBuy'; }
  else if (combinedUp <= 38) { recoKey = 'recoSellText'; recoClass = 'sell'; recoPillKey = 'recoSell'; }
  else { recoKey = 'recoHoldText'; recoClass = 'hold'; recoPillKey = 'recoHold'; }

  els.recoPill.textContent = t(recoPillKey);
  els.recoPill.className = `reco-pill ${recoClass}`;

  els.summaryText.textContent = t('summaryText')
    .replace('{fu}', fundamental.upProb)
    .replace('{tu}', technical.upProb)
    .replace('{cu}', combinedUp)
    .replace('{date}', new Date().toLocaleDateString(state.lang === 'es' ? 'es-ES' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' }))
    .replace('{reco}', t(recoKey));

  els.recoDetails.innerHTML = '';
  const details = [
    t('detWeight'),
    fundamental.upProb >= 55
      ? t('detFundUp')
      : fundamental.upProb <= 45
        ? t('detFundDown')
        : t('detFundNeutral'),
    technical.upProb >= 55
      ? t('detTechUp')
      : technical.upProb <= 45
        ? t('detTechDown')
        : t('detTechNeutral'),
    t('detRisk'),
  ];
  details.forEach(d => {
    const li = document.createElement('li');
    li.textContent = d;
    els.recoDetails.appendChild(li);
  });

  renderRangeBlock(combinedUp, 100 - combinedUp);
}

// ---------- Render del análisis (reutilizable al cambiar idioma) ----------
function renderAnalysis() {
  if (!cached.market) return;
  const { market, prices, fng } = cached;
  const price = market.market_data.current_price.usd;
  const change24h = market.market_data.price_change_percentage_24h ?? 0;
  els.currentPrice.textContent = fmtUSD(price);
  els.priceChange.textContent = `${fmtPct(change24h)} (24h)`;
  els.priceChange.className = `price-change ${change24h >= 0 ? 'up' : 'down'}`;
  const fundamental = analyzeFundamental(market, fng);
  const technical = analyzeTechnical(prices);
  buildSummary(fundamental, technical);
}

// ---------- Inicialización ----------
// Estrategia anti-429 para navegar BTC->ETH->SOL->XRP->DOGE sin que las
// últimas fallen: CoinGecko secuencial (gate 2s) + fallback Binance + cache.
async function init() {
  applyTheme();
  state.statusKey = 'statusLoadingCoin';
  els.statusText.textContent = fillText(t(state.statusKey));
  els.statusRow.querySelector('.loader').classList.remove('done');
  els.statusRow.querySelectorAll('.retry-btn').forEach(b => b.remove());
  try {
    // Historial primero (CoinGecko, con fallback Binance adentro).
    const history = await loadHistoricalPrices();
    // Market CoinGecko; si da 429, adaptar spot Binance con el historial.
    let market = null;
    try {
      market = await loadMarketData();
    } catch (e) {
      const sym = BINANCE_SYMBOL[coin.id];
      if (sym) {
        const spot = await loadSpotBinance(sym);
        market = adaptBinanceMarket(spot, history);
      } else throw e;
    }
    const fng = await loadFearGreed(); // null si falla -> análisis sigue igual
    cached.market = market;
    cached.prices = history.prices;
    cached.dates = history.dates;
    cached.fng = fng;

    renderAnalysis();
    renderChart(cached.prices, cached.dates);
    renderTradingView();

    state.statusKey = 'statusOk';
    els.statusRow.querySelector('.loader').classList.add('done');
    els.statusText.textContent = t(state.statusKey);
    els.updateTime.textContent = new Date().toLocaleString(state.lang === 'es' ? 'es-ES' : 'en-US');
  } catch (err) {
    console.error(err);
    state.statusKey = 'statusError';
    els.statusRow.querySelector('.loader').classList.add('done');
    els.statusText.textContent = t(state.statusKey);
    showRetry(els.statusRow, () => init());
  }

  applyLang();
}

// ---------- Listeners de tema e idioma ----------
els.themeToggle.addEventListener('click', () => {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
});
els.langEs.addEventListener('click', () => setLang('es'));
els.langEn.addEventListener('click', () => setLang('en'));

// ---------- Pestañas de cripto y navegación activa ----------
document.querySelectorAll('.coin-tab').forEach(a => {
  a.classList.toggle('active', a.dataset.coin === coinKey);
});
document.querySelectorAll('.nav-link').forEach(a => {
  a.classList.toggle('active', a.getAttribute('href').startsWith('analysis.html'));
});
const tvBadgeEl = document.getElementById('tvBadge');
if (tvBadgeEl) tvBadgeEl.textContent = `${coin.tv} · 1 min`;
const pairBadgeEl = document.getElementById('pairBadge');
if (pairBadgeEl) pairBadgeEl.textContent = `${coin.symbol} / USD`;
const coinBannerEl = document.getElementById('coinBanner');
if (coinBannerEl) coinBannerEl.textContent = `${coin.name} · ${coin.symbol}`;

init();

