// ==========================================================
// MarketPulse — JS compartido: Home (index.html) y Sobre nosotros (about.html)
// Tema oscuro/claro, idioma ES/EN y datos del mercado para el home.
// ==========================================================

const I18N = {
  es: {
    homeTitle: 'MarketPulse — Inicio',
    aboutTitle: 'MarketPulse — Sobre nosotros',
    homeTagline: 'Cripto · Metales · Forex — Fundamental + Técnico',
    navHome: 'Inicio',
    navAnalysis: 'Cripto',
    navMetals: 'Metales',
    navForex: 'Divisas',
    navAbout: 'Sobre nosotros',
    footerPrefix: 'MarketPulse · Datos: CoinGecko · Yahoo Finance · TradingView · Actualizado:',
    homeLoading: 'Cargando datos del mercado…',
    homeOk: 'Datos actualizados correctamente.',
    homeError: '⚠️ No se pudieron cargar los datos del mercado (posible límite de la API). Pulsa Reintentar en unos segundos.',
    retry: 'Reintentar',
    homeHeroTitle: 'El pulso del mercado hoy: cripto, metales y divisas',
    marketFearGreed: 'Índice Miedo/Codicia',
    marketCap: 'Cap. mercado total',
    marketDominance: 'Dominancia BTC',
    coinsTitle: 'Elige una cripto para analizar',
    metalsTitle: 'Elige un metal o energía para analizar',
    metalsDesc: 'Cobertura spot con visión fundamental, lectura técnica, probabilidades de subida/bajada, rango estimado del día y recomendación profesional.',
    metalGold: 'Metal refugio por excelencia.',
    metalSilver: 'Industrial y refugio a la vez.',
    metalPlatinum: 'Usado en catalizadores y joyería.',
    metalPalladium: 'El metal más raro de los preciosos.',
    metalOil: 'La materia prima energética más operada.',
    forexTitle: 'Elige un activo Forex para analizar',
    forexDesc: 'Cotizaciones del mercado de divisas con visión fundamental, lectura técnica, probabilidades de subida/bajada, rango estimado del día y recomendación profesional.',
    forexCardEUR: 'La divisa más operada del mundo.',
    forexCardGBP: 'Alta liquidez, sensible a tasas.',
    forexCardJPY: 'Refugio clásico en Asia.',
    forexCardCOP: 'Tasa local USD/COP.',
    forexCardMXN: 'Tasa local USD/MXN.',
    coinsDesc: 'Cada análisis incluye visión fundamental, visión técnica, probabilidades de subida/bajada, rango estimado del día y recomendación profesional.',
    btnAnalysis: 'Ver análisis completo →',
    weekPrefix: 'En 7 días:',
    summarySentiment: 'El sentimiento del mercado hoy es de {fng} ({fngVal}/100).',
    summaryLeaders: 'Líderes del día: {list}.',
    summaryLaggards: 'Más castigados hoy: {list}.',
    summaryToneUp: 'En promedio las 5 criptos analizadas operan al alza en las últimas 24 horas.',
    summaryToneFlat: 'Las 5 criptos analizadas se mueven laterales, sin una tendencia clara en las últimas 24 horas.',
    summaryToneDown: 'En promedio las 5 criptos analizadas operan a la baja en las últimas 24 horas.',
    trendUpStrong: 'Fuerte impulso alcista en las últimas 24 horas.',
    trendUp: 'Tendencia alcista moderada en el día.',
    trendFlat: 'Consolidación / movimiento lateral durante el día.',
    trendDown: 'Caída moderada en las últimas 24 horas.',
    trendDownStrong: 'Fuerte caída durante el día — posible sobreventa.',
    aboutHeroTitle: 'Sobre MarketPulse',
    aboutHeroText: 'MarketPulse es una plataforma de análisis multi-activo que combina datos de mercado en tiempo real con indicadores estadísticos para ofrecerte, cada día, una lectura clara de qué puede pasar con las principales criptomonedas, metales y divisas.',
    aboutMissionTitle: 'Nuestra misión',
    aboutMissionText: 'Democratizar el análisis financiero: traducir indicadores complejos de cripto, metales y Forex en probabilidades y rangos fáciles de entender, para que cualquier persona pueda tomar decisiones informadas y gestionar su riesgo.',
    aboutHowTitle: 'Qué incluye cada análisis',
    aboutHow1: 'Análisis fundamental: variaciones 24h/7d/30d, sentimiento de mercado, volumen y capitalización (según el activo).',
    aboutHow2: 'Análisis técnico: RSI(14), medias móviles SMA20/SMA50 y MACD calculados sobre 90 días de historial.',
    aboutHow3: 'Probabilidad de subida y de bajada para cada análisis y una probabilidad combinada ponderada.',
    aboutHow4: 'Rango estimado de fluctuación del día: escenarios alcista/bajista y precio esperado al cierre.',
    aboutHow5: 'Recomendación profesional combinada (compra / mantenimiento / venta) con gráficos diario y en tiempo real.',
    aboutVerticalsTitle: 'Tres mercados, una metodología',
    aboutVerticalCrypto: 'Cripto: Bitcoin, Ethereum, Solana, XRP y Dogecoin con datos de CoinGecko y sentimiento Fear & Greed.',
    aboutVerticalMetals: 'Metales y energía: Oro, Plata, Platino, Paladio y Petróleo WTI con datos spot de Yahoo Finance.',
    aboutVerticalForex: 'Divisas: EUR/USD, GBP/USD, USD/JPY, USD/COP y USD/MXN con cotizaciones de Yahoo Finance.',
    aboutSourcesTitle: 'Fuentes de datos',
    aboutSourcesText: 'CoinGecko API (cripto: precios, capitalización, volumen y sentimiento), Yahoo Finance (metales, energía y divisas vía proxy), Alternative.me Fear & Greed Index (miedo/codicia cripto) y TradingView (gráfico en tiempo real). Todos los cálculos se ejecutan en tu navegador, sin servidores intermedios.',
    aboutRiskTitle: 'Aviso de riesgo',
    aboutRiskText: 'MarketPulse no presta asesoría financiera. Los estimados se generan automáticamente a partir de modelos estadísticos y datos públicos, y no garantizan resultados. Cripto, metales y divisas son activos volátiles: nunca inviertas más de lo que puedes permitirte perder y usa siempre stop-loss.',
  },
  en: {
    homeTitle: 'MarketPulse — Home',
    aboutTitle: 'MarketPulse — About us',
    homeTagline: 'Crypto · Metals · Forex — Fundamental + Technical',
    navHome: 'Home',
    navAnalysis: 'Crypto',
    navMetals: 'Metals',
    navForex: 'Forex',
    navAbout: 'About us',
    footerPrefix: 'MarketPulse · Data: CoinGecko · Yahoo Finance · TradingView · Updated:',
    homeLoading: 'Loading market data…',
    homeOk: 'Data updated successfully.',
    homeError: '⚠️ Could not load market data (possible API rate limit). Press Retry in a few seconds.',
    retry: 'Retry',
    homeHeroTitle: "Today's market pulse: crypto, metals and forex",
    marketFearGreed: 'Fear/Greed Index',
    marketCap: 'Total market cap',
    marketDominance: 'BTC dominance',
    coinsTitle: 'Choose a crypto to analyze',
    metalsTitle: 'Choose a metal or energy to analyze',
    metalsDesc: 'Spot coverage with fundamental view, technical read, up/down probabilities, daily estimated range and professional recommendation.',
    metalGold: 'The ultimate safe-haven metal.',
    metalSilver: 'Industrial and safe-haven at once.',
    metalPlatinum: 'Used in catalysts and jewelry.',
    metalPalladium: 'The rarest precious metal.',
    metalOil: 'The most traded energy commodity.',
    forexTitle: 'Choose a Forex asset to analyze',
    forexDesc: 'Currency market quotes with fundamental view, technical read, up/down probabilities, daily estimated range and professional recommendation.',
    forexCardEUR: 'The most traded pair in the world.',
    forexCardGBP: 'High liquidity, rate-sensitive.',
    forexCardJPY: 'Classic Asian safe haven.',
    forexCardCOP: 'Local USD/COP rate.',
    forexCardMXN: 'Local USD/MXN rate.',
    coinsDesc: "Each analysis includes a fundamental view, a technical view, up/down probabilities, the day's estimated range and a professional recommendation.",
    btnAnalysis: 'View full analysis →',
    weekPrefix: 'Over 7 days:',
    summarySentiment: "Today's market sentiment is {fng} ({fngVal}/100).",
    summaryLeaders: "Today's leaders: {list}.",
    summaryLaggards: "Today's laggards: {list}.",
    summaryToneUp: 'On average, the 5 tracked cryptos are up over the last 24 hours.',
    summaryToneFlat: 'The 5 tracked cryptos are trading sideways, with no clear trend over the last 24 hours.',
    summaryToneDown: 'On average, the 5 tracked cryptos are down over the last 24 hours.',
    trendUpStrong: 'Strong bullish momentum in the last 24 hours.',
    trendUp: 'Moderate uptrend on the day.',
    trendFlat: 'Consolidation / sideways action during the day.',
    trendDown: 'Moderate decline over the last 24 hours.',
    trendDownStrong: 'Sharp drop on the day — possibly oversold.',
    aboutHeroTitle: 'About MarketPulse',
    aboutHeroText: 'MarketPulse is a multi-asset analysis platform that combines real-time market data with statistical indicators to give you, every day, a clear read on what may happen with leading cryptocurrencies, metals and currencies.',
    aboutMissionTitle: 'Our mission',
    aboutMissionText: 'Democratize financial analysis: turn complex crypto, metals and Forex indicators into probabilities and ranges that are easy to understand, so anyone can make informed decisions and manage their risk.',
    aboutHowTitle: 'What each analysis includes',
    aboutHow1: 'Fundamental analysis: 24h/7d/30d changes, market sentiment, volume and market cap (depending on the asset).',
    aboutHow2: 'Technical analysis: RSI(14), SMA20/SMA50 moving averages and MACD computed over 90 days of history.',
    aboutHow3: 'Up and down probabilities for each analysis plus a weighted combined probability.',
    aboutHow4: 'Estimated daily fluctuation range: bullish/bearish scenarios and expected closing price.',
    aboutHow5: 'Combined professional recommendation (buy / hold / sell) with daily and real-time charts.',
    aboutVerticalsTitle: 'Three markets, one methodology',
    aboutVerticalCrypto: 'Crypto: Bitcoin, Ethereum, Solana, XRP and Dogecoin with CoinGecko data and Fear & Greed sentiment.',
    aboutVerticalMetals: 'Metals & energy: Gold, Silver, Platinum, Palladium and WTI Oil with Yahoo Finance spot data.',
    aboutVerticalForex: 'Forex: EUR/USD, GBP/USD, USD/JPY, USD/COP and USD/MXN with Yahoo Finance quotes.',
    aboutSourcesTitle: 'Data sources',
    aboutSourcesText: 'CoinGecko API (crypto: prices, market cap, volume and sentiment), Yahoo Finance (metals, energy and forex via proxy), Alternative.me Fear & Greed Index (crypto fear/greed) and TradingView (real-time chart). All calculations run in your browser, with no intermediate servers.',
    aboutRiskTitle: 'Risk disclaimer',
    aboutRiskText: 'MarketPulse does not provide financial advice. Estimates are generated automatically from statistical models and public data and do not guarantee results. Crypto, metals and forex are volatile assets: never invest more than you can afford to lose and always use a stop-loss.',
  },
};

// ---------- Estado de preferencias (compartido con la app de análisis) ----------
const state = {
  theme: localStorage.getItem('btc-theme') || 'dark',
  lang: localStorage.getItem('btc-lang') || 'es',
  statusKey: 'homeLoading',
};

const cached = {};

function t(key) {
  return (I18N[state.lang] && I18N[state.lang][key]) || I18N.es[key] || key;
}

function locale() { return state.lang === 'es' ? 'es-ES' : 'en-US'; }

function fmtUSD(n) {
  return new Intl.NumberFormat(locale(), { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}
function fmtPct(n, digits = 1) {
  return `${n >= 0 ? '+' : ''}${n.toFixed(digits)}%`;
}
function fmtBig(n) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  return fmtUSD(n);
}

function applyTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = state.theme === 'dark' ? '🌙' : '☀️';
}
function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem('btc-theme', theme);
  applyTheme();
}

function applyLang() {
  document.documentElement.lang = state.lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  const langEs = document.getElementById('langEs');
  const langEn = document.getElementById('langEn');
  if (langEs) langEs.classList.toggle('active', state.lang === 'es');
  if (langEn) langEn.classList.toggle('active', state.lang === 'en');
  const st = document.getElementById('statusText');
  if (st) st.textContent = t(state.statusKey);
  // Navegación activa según la página
  const page = document.body.dataset.page;
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href');
    const active = (page === 'home' && href.startsWith('index.html')) ||
                   (page === 'about' && href.startsWith('about.html'));
    a.classList.toggle('active', active);
  });
  renderHome();
}
function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('btc-lang', lang);
  applyLang();
}

// ---------- Traducciones del sentimiento Fear & Greed ----------
function translateFng(label) {
  if (state.lang === 'en') return label;
  const map = { 'Extreme Fear': 'Miedo extremo', 'Fear': 'Miedo', 'Neutral': 'Neutral', 'Greed': 'Codicia', 'Extreme Greed': 'Codicia extrema' };
  return map[label] || label;
}

function trendKey(change24h) {
  if (change24h >= 2.5) return 'trendUpStrong';
  if (change24h >= 0.5) return 'trendUp';
  if (change24h > -0.5) return 'trendFlat';
  if (change24h > -2.5) return 'trendDown';
  return 'trendDownStrong';
}

// ---------- Home: tarjetas + resumen del mercado ----------
function renderHome() {
  const grid = document.getElementById('coinCards');
  if (!grid || !cached.markets) return;

  grid.innerHTML = '';
  cached.markets.forEach(m => {
    const c24 = m.price_change_percentage_24h ?? 0;
    const c7 = m.price_change_percentage_7d ?? 0;
    const a = document.createElement('a');
    a.className = 'coin-card card';
    a.href = `analysis.html?coin=${m.id}`;
    a.innerHTML = `
      <div class="coin-card-head">
        <img src="${m.image}" alt="${m.symbol}" width="40" height="40">
        <div>
          <h3>${m.name}</h3>
          <span class="coin-sym">${m.symbol.toUpperCase()}</span>
        </div>
      </div>
      <div class="coin-card-price">${fmtUSD(m.current_price)}</div>
      <div class="coin-chg">
        <span class="${c24 >= 0 ? 'up' : 'down'}">24h ${fmtPct(c24)}</span>
        <span class="${c7 >= 0 ? 'up' : 'down'}">${t('weekPrefix')} ${fmtPct(c7)}</span>
      </div>
      <p class="coin-trend">${t(trendKey(c24))}</p>
      <span class="coin-cta">${t('btnAnalysis')}</span>`;
    grid.appendChild(a);
  });

  // Resumen general del día
  const el = document.getElementById('marketSummary');
  if (el) {
    const sorted = [...cached.markets].sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0));
    const leaders = sorted.slice(0, 2).map(m => `${m.symbol.toUpperCase()} ${fmtPct(m.price_change_percentage_24h ?? 0)}`).join(', ');
    const laggards = sorted.slice(-2).reverse().map(m => `${m.symbol.toUpperCase()} ${fmtPct(m.price_change_percentage_24h ?? 0)}`).join(', ');
    const avg = cached.markets.reduce((s, m) => s + (m.price_change_percentage_24h ?? 0), 0) / cached.markets.length;
    const tone = avg > 0.5 ? 'summaryToneUp' : avg < -0.5 ? 'summaryToneDown' : 'summaryToneFlat';
    const parts = [];
    if (cached.fng) parts.push(t('summarySentiment').replace('{fng}', translateFng(cached.fng.value_classification)).replace('{fngVal}', cached.fng.value));
    parts.push(t(tone));
    parts.push(t('summaryLeaders').replace('{list}', leaders));
    parts.push(t('summaryLaggards').replace('{list}', laggards));
    el.textContent = parts.join(' ');
  }

  // Estadísticas de mercado
  const stats = document.getElementById('marketStats');
  if (stats) {
    stats.innerHTML = '';
    const add = (name, value, cls = 'neutral') => {
      const row = document.createElement('div');
      row.className = 'metric-row';
      row.innerHTML = `<span class="metric-name">${name}</span><span class="metric-value ${cls}">${value}</span>`;
      stats.appendChild(row);
    };
    if (cached.fng) add(t('marketFearGreed'), `${cached.fng.value} · ${translateFng(cached.fng.value_classification)}`, Number(cached.fng.value) >= 50 ? 'up' : 'down');
    if (cached.global) {
      add(t('marketCap'), fmtBig(cached.global.total_market_cap.usd));
      add(t('marketDominance'), `${cached.global.market_cap_percentage.btc.toFixed(1)}%`);
    }
  }
}

// ---------- Fetch con reintento (cubre el rate-limit429 de CoinGecko) ----------
async function fetchRetry(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise(r => setTimeout(r, 1500 * (i + 1)));
    }
  }
}

function showRetry(container, onClick) {
  if (!container) return;
  container.querySelectorAll('.retry-btn').forEach(b => b.remove());
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'retry-btn';
  btn.textContent = t('retry');
  btn.addEventListener('click', () => { btn.remove(); onClick(); });
  container.appendChild(btn);
}

function setStatusText(key) {
  state.statusKey = key;
  const st = document.getElementById('statusText');
  if (st) st.textContent = t(key);
}

function loadHomeWithRetry() {
  document.querySelector('#statusRow .loader')?.classList.remove('done');
  document.querySelector('#statusRow')?.querySelectorAll('.retry-btn').forEach(b => b.remove());
  setStatusText('homeLoading');
  loadHomeData().catch(handleHomeError);
}

function handleHomeError(err) {
  console.error(err);
  document.querySelector('#statusRow .loader')?.classList.add('done');
  setStatusText('homeError');
  showRetry(document.getElementById('statusRow'), loadHomeWithRetry);
}

async function loadHomeData() {
  const ids = 'bitcoin,ethereum,solana,ripple,dogecoin';
  const [markets, fngRes, globalRes] = await Promise.all([
    fetchRetry(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${ids}&price_change_percentage=24h,7d&sparkline=false`),
    fetchRetry('https://api.alternative.me/fng/?limit=1'),
    fetchRetry('https://api.coingecko.com/api/v3/global'),
  ]);
  if (!Array.isArray(markets) || !markets.length) throw new Error('markets vacío');
  cached.markets = markets;
  cached.fng = fngRes.data[0];
  cached.global = globalRes.data;
  state.statusKey = 'homeOk';
  const st = document.getElementById('statusText');
  if (st) st.textContent = t(state.statusKey);
  document.querySelector('#statusRow .loader')?.classList.add('done');
  const ut = document.getElementById('updateTime');
  if (ut) ut.textContent = new Date().toLocaleString(locale());
  renderHome();
}

// ---------- Init ----------
function initSite() {
  applyTheme();

  document.getElementById('themeToggle')?.addEventListener('click', () => setTheme(state.theme === 'dark' ? 'light' : 'dark'));
  document.getElementById('langEs')?.addEventListener('click', () => setLang('es'));
  document.getElementById('langEn')?.addEventListener('click', () => setLang('en'));

  applyLang();

  const grid = document.getElementById('coinCards');
  if (grid) {
    loadHomeWithRetry();
  }
}

initSite();
