// ==========================================================
// MarketPulse — Análisis de Divisas (Euro, Dolar, Peso COP, Libra, Yen)
// Fuentes: Yahoo Finance (vía proxy AllOrigins) para historial y cotizaciones
// ==========================================================

// ---------- Configuración de pares (5 pestañas) ----------
// tv: identificador exacto de TradingView. USD/COP solo existe con el proveedor
// ICE (FX_IDC), no con OANDA; un símbolo inexistente muestra «Este símbolo no existe».
const LOC_BY_LANG = { es: 'es-ES', en: 'en-US', pt: 'pt-BR' };
const LOC_BTN = { es: 'ES', en: 'EN', pt: 'PT' };
const TV_LANG = { es: 'es', en: 'en', pt: 'pt' };

const PAIRS = {
  eurusd:  { id: 'eurusd',  name: 'Euro / Dólar',   nameEn: 'Euro / US Dollar',    symbol: 'EURUSD', yahoo: 'EURUSD=X', tv: 'OANDA:EURUSD' },
  usdcop:  { id: 'usdcop',  name: 'Dólar / Peso COP', nameEn: 'US Dollar / Colombian Peso', symbol: 'USDCOP', yahoo: 'COP=X',    tv: 'FX_IDC:USDCOP' },
  gbpusd:  { id: 'gbpusd',  name: 'Libra / Dólar',  nameEn: 'British Pound / US Dollar',     symbol: 'GBPUSD', yahoo: 'GBPUSD=X', tv: 'OANDA:GBPUSD' },
  usdjpy:  { id: 'usdjpy',  name: 'Dólar / Yen',    nameEn: 'US Dollar / Japanese Yen',       symbol: 'USDJPY', yahoo: 'JPY=X',    tv: 'OANDA:USDJPY' },
  usdmxn:  { id: 'usdmxn',  name: 'Dólar / Peso MXN', nameEn: 'US Dollar / Mexican Peso',     symbol: 'USDMXN', yahoo: 'MXN=X',    tv: 'OANDA:USDMXN' },
};

const pairParam = new URLSearchParams(location.search).get('pair');
const pairKey = PAIRS[pairParam] ? pairParam : 'eurusd';
const pair = PAIRS[pairKey];
// Inversión de cotización: ?inv=1 muestra el par al revés (EUR/USD -> USD/EUR).
const invertedFromUrl = new URLSearchParams(location.search).get('inv') === '1';

// Yahoo bloquea CORS: se piden los datos a traves de proxies gratuitos. Los 4
// combos (2 hosts x 2 proxies) salen a la vez en carrera y gana el primero que
// responde: ver fetchYahooChart.
const PROXIES = [
  'https://api.allorigins.win/raw?url=',
  'https://api.cors.lol/?url=',
];
const YAHOO_HOSTS = ['https://query1.finance.yahoo.com', 'https://query2.finance.yahoo.com'];

const els = {
  statusText: document.getElementById('statusText'),
  statusRow: document.getElementById('statusRow'),
  currentPrice: document.getElementById('currentPrice'),
  priceChange: document.getElementById('priceChange'),
  themeToggle: document.getElementById('themeToggle'),
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
  tradeDir: document.getElementById('tradeDir'),
  tradeCons: document.getElementById('tradeCons'),
  tradeMed: document.getElementById('tradeMed'),
  tradeAgg: document.getElementById('tradeAgg'),
  recoDetails: document.getElementById('recoDetails'),
  updateTime: document.getElementById('updateTime'),
  pairBanner: document.getElementById('pairBanner'),
  invertBtn: document.getElementById('invertBtn'),
};

// ---------- Internacionalización (ES / EN) ----------
const I18N = {
  es: {
    docTitle: 'MarketPulse — Análisis de {coin}',
    tagline: 'Análisis diario de divisas',
    priceLabel: 'Último cierre diario',
    invertPair: 'Invertir par',
    invertTo: 'Ver {symbol}',
    statusLoading: 'Cargando datos del mercado en tiempo real…',
    statusLoadingCoin: 'Cargando datos de {coin}…',
    statusOk: 'Análisis actualizado correctamente.',
    statusRetrying: 'Conexión lenta, reintentando automáticamente…',
    statusOffline: '⚠️ Sin conexión con los datos de mercado. Reintentando en segundo plano…',
    chartUnavailable: 'No se pudo cargar el gráfico de evolución. El resto del análisis sí es válido.',
    tvUnavailable: 'No se pudo cargar el gráfico en tiempo real. Verifica tu conexión.',
    retry: 'Reintentar',
    langEsName: 'Español',
    langEnName: 'Inglés',
    langPtName: 'Portugués',
    navHome: 'Inicio',
    navAnalysis: 'Cripto',
    navMetals: 'Metales',
    navForex: 'Divisas',
    navAbout: 'Sobre nosotros',
    fundTitle: 'Análisis Fundamental',
    fundDesc: 'Variaciones diarias, semanales y mensuales de la divisa en el mercado de divisas.',
    techTitle: 'Análisis Técnico',
    techDesc: 'Indicadores de tendencia, momentum y volatilidad sobre el historial reciente.',
    up: 'Subida',
    down: 'Bajada',
    dailyTitle: 'Evolución del precio — 90 días',
    dailyDesc: 'Precio de cierre diario con las medias de tendencia de corto y largo plazo superpuestas.',
    liveTitle: 'Gráfico en tiempo real',
    liveDesc: 'Gráfico en vivo del mercado · velas de 1 hora.',
    summaryTitle: 'Resumen y Recomendación Profesional',
    combinedLabel: 'Prob. Subida Combinada',
    summaryPlaceholder: 'Analizando ambos enfoques para generar una recomendación…',
    disclaimer: '⚠️ Este análisis se genera automáticamente a partir de datos públicos de mercado e indicadores estadísticos. No constituye asesoría financiera. Las inversiones en divisas conllevan alto riesgo.',
    footerPrefix: 'MarketPulse · Datos de mercado en tiempo real · Actualizado:',
    footerLegal: 'Políticas de uso y responsabilidad',
    footerVersion: 'Versión',
    footerRights: 'Todos los derechos reservados.',
    m24h: 'Variación 24h',
    m7d: 'Variación 7 días',
    m30d: 'Variación 30 días',
    mVol: 'Volumen último día vs media 20d',
    mDayHigh: 'Máximo 7 días',
    mDayLow: 'Mínimo 7 días',
    metricRsi: 'Impulso del mercado',
    metricSma20: 'Tendencia corta',
    metricSma50: 'Tendencia larga',
    metricMacd: 'Cambio de impulso',
    metricSignal: 'Señal de impulso',
    metricHist: 'Fuerza del impulso',
    bullish: 'Alcista',
    bearish: 'Bajista',
    neutral: 'Neutral',
    recoBuy: 'COMPRA',
    recoSell: 'VENTA',
    recoHold: 'NEUTRAL',
    recoBuyText: 'Comprar / Mantener posiciones largas',
    recoSellText: 'Vender / Evitar nuevas entradas',
    recoHoldText: 'Mantener y esperar confirmación',
    summaryText: 'Combinando el análisis fundamental ({fu}%) con el técnico ({tu}%), el modelo estima una probabilidad combinada de subida del {cu}% para hoy, {date}. Recomendación: {reco}.',
    detWeight: 'Peso técnico (55%) vs fundamental (45%) — el corto plazo se guía más por momentum de precio.',
    detFundUp: 'El contexto del activo (variaciones recientes, volumen) favorece a los compradores.',
    detFundDown: 'El contexto del activo muestra cautela o presión vendedora.',
    detFundNeutral: 'El contexto del activo se mantiene neutral, sin sesgo claro.',
    detTechUp: 'Los indicadores técnicos sugieren momentum alcista.',
    detTechDown: 'Los indicadores técnicos sugieren debilidad o posible corrección.',
    detTechNeutral: 'Los indicadores técnicos están mixtos, sin tendencia definida.',
    detRisk: 'Gestiona el riesgo: usa stop-loss y no inviertas más de lo que puedes permitirte perder.',
    chartPrice: 'Precio de {coin} ({quote})',
    rangeTitle: 'Rango estimado de fluctuación — hoy',
    rangeNote: 'Estimado a partir de la volatilidad reciente y el movimiento medio diario del activo, ajustado por la probabilidad combinada de subida/bajada. Es una horquilla estadística informativa, no una garantía.',
    rangeVol: 'Volatilidad diaria (σ · 90 días)',
    rangeUp: 'Escenario alcista — máx. subida hoy',
    rangeDown: 'Escenario bajista — máx. bajada hoy',
    rangePrice: 'Horquilla de precio esperada hoy',
    rangeClose: 'Variación esperada al cierre de hoy',
    rangeClosePrice: 'Precio esperado al cierre de hoy',
    tradeTitle: 'Plan operativo de hoy',
    profileCons: '🛡️ Conservador',
    profileMed: '⚖️ Medio',
    profileAgg: '🔥 Arriesgado',
    tradeLong: 'Posición larga (compra)',
    tradeShort: 'Posición corta (venta)',
    tradeEntry: 'Precio de entrada',
    tradeStop: 'Stop loss',
    tradeTarget: 'Precio de salida',
    tradeRR: 'Ratio beneficio / riesgo',
    tradeNote: 'Tres perfiles para la operación de hoy según tu tolerancia al riesgo. Conservador: espera un retroceso, stop estrecho para arriesgar poco por operación y salida temprana. Medio: retroceso leve, stop estándar y salida en el extremo estimado del día. Arriesgado: entrada a mercado, stop amplio que aguanta el ruido y salida en extensión. Niveles estadísticos; no es asesoría financiera.',
  },
  pt: {
    invertPair: 'Inverter par',
    invertTo: 'Ver {symbol}',
    statusRetrying: 'Ligação lenta, a tentar novamente automaticamente…',
    statusOffline: '⚠️ Sem ligação aos dados de mercado. A tentar novamente em segundo plano…',
    docTitle: 'MarketPulse — Análise de {coin}',
    tagline: 'Análise diária de câmbio',
    priceLabel: 'Último fecho diário',
    statusLoading: 'Carregando dados do mercado em tempo real…',
    statusLoadingCoin: 'Carregando dados de {coin}…',
    statusOk: 'Análise atualizada com sucesso.',
    chartUnavailable: 'Não foi possível carregar o gráfico de evolução. O resto da análise é válido.',
    tvUnavailable: 'Não foi possível carregar o gráfico em tempo real. Verifique a sua ligação.',
    retry: 'Tentar novamente',
    langEsName: 'Espanhol',
    langEnName: 'Inglês',
    langPtName: 'Português',
    navHome: 'Início',
    navAnalysis: 'Cripto',
    navMetals: 'Metais',
    navForex: 'Câmbio',
    navAbout: 'Sobre nós',
    fundTitle: 'Análise Fundamental',
    fundDesc: 'Variações diárias, semanais e mensais da moeda no mercado cambial.',
    techTitle: 'Análise Técnica',
    techDesc: 'Indicadores de tendência, momentum e volatilidade sobre o histórico recente.',
    up: 'Alta',
    down: 'Baixa',
    dailyTitle: 'Evolução do preço — 90 dias',
    dailyDesc: 'Preço de fecho diário com as médias de tendência de curto e longo prazo sobrepostas.',
    liveTitle: 'Gráfico em tempo real',
    liveDesc: 'Gráfico ao vivo do mercado · velas de 1 hora.',
    summaryTitle: 'Resumo e Recomendação Profissional',
    combinedLabel: 'Prob. de Alta Combinada',
    summaryPlaceholder: 'A analisar as duas abordagens para gerar uma recomendação…',
    disclaimer: '⚠️ Esta análise é gerada automaticamente a partir de dados públicos de mercado e indicadores estatísticos. Não constitui consultoria financeira. Investir em moedas envolve risco elevado.',
    footerPrefix: 'MarketPulse · Dados de mercado em tempo real · Atualizado:',
    footerLegal: 'Políticas de uso e responsabilidade',
    footerVersion: 'Versão',
    footerRights: 'Todos os direitos reservados.',
    m24h: 'Variação 24h',
    m7d: 'Variação 7 dias',
    m30d: 'Variação 30 dias',
    mVol: 'Volume do último dia vs média 20d',
    mDayHigh: 'Máximo 7 dias',
    mDayLow: 'Mínimo 7 dias',
    metricRsi: 'Impulso do mercado',
    metricSma20: 'Tendência curta',
    metricSma50: 'Tendência longa',
    metricMacd: 'Mudança de impulso',
    metricSignal: 'Sinal de impulso',
    metricHist: 'Força do impulso',
    bullish: 'Altista',
    bearish: 'Baixista',
    neutral: 'Neutro',
    recoBuy: 'COMPRAR',
    recoSell: 'VENDER',
    recoHold: 'NEUTRO',
    recoBuyText: 'Comprar / Manter posições compradas',
    recoSellText: 'Vender / Evitar novas entradas',
    recoHoldText: 'Manter e aguardar confirmação',
    summaryText: 'Combinando a análise fundamental ({fu}%) com a técnica ({tu}%), o modelo estima uma probabilidade combinada de alta de {cu}% para hoje, {date}. Recomendação: {reco}.',
    detWeight: 'Peso técnico (55%) vs fundamental (45%) — o curto prazo guia-se mais pelo momentum do preço.',
    detFundUp: 'O contexto do ativo (variações recentes, volume) favorece os compradores.',
    detFundDown: 'O contexto do ativo mostra cautela ou pressão vendedora.',
    detFundNeutral: 'O contexto do ativo mantém-se neutro, sem viés claro.',
    detTechUp: 'Os indicadores técnicos sugerem momentum altista.',
    detTechDown: 'Os indicadores técnicos sugerem fraqueza ou possível correção.',
    detTechNeutral: 'Os indicadores técnicos estão mistos, sem tendência definida.',
    detRisk: 'Faça gestão do risco: use stop-loss e não invista mais do que pode perder.',
    chartPrice: 'Preço de {coin} ({quote})',
    rangeTitle: 'Faixa estimada de oscilação — hoje',
    rangeNote: 'Estimado a partir da volatilidade recente e do movimento médio diário do ativo, ajustado pela probabilidade combinada de alta/baixa. É uma faixa estatística informativa, não uma garantia.',
    rangeVol: 'Volatilidade diária (σ · 90 dias)',
    rangeUp: 'Cenário altista — máx. de alta hoje',
    rangeDown: 'Cenário baixista — máx. de baixa hoje',
    rangePrice: 'Intervalo de preço esperado para hoje',
    rangeClose: 'Variação esperada no fecho de hoje',
    rangeClosePrice: 'Preço esperado no fecho de hoje',
    tradeTitle: 'Plano operacional de hoje',
    profileCons: '🛡️ Conservador',
    profileMed: '⚖️ Moderado',
    profileAgg: '🔥 Agressivo',
    tradeLong: 'Posição comprada (buy)',
    tradeShort: 'Posição vendida (sell)',
    tradeEntry: 'Preço de entrada',
    tradeStop: 'Stop loss',
    tradeTarget: 'Preço de saída',
    tradeRR: 'Rácio ganho / risco',
    tradeNote: 'Três perfis para a operação de hoje conforme a sua tolerância ao risco. Conservador: espera um recuo, stop apertado para arriscar pouco por operação e saída antecipada. Moderado: recuo ligeiro, stop padrão e saída na extremidade estimada do dia. Agressivo: entrada a mercado, stop largo que aguenta o ruído e saída em extensão. Níveis estatísticos; não é consultoria financeira.',
  },
  en: {
    docTitle: 'MarketPulse — {coin} Analysis',
    tagline: 'Daily forex analysis',
    priceLabel: 'Last daily close',
    invertPair: 'Invert pair',
    invertTo: 'View {symbol}',
    statusLoading: 'Loading live market data…',
    statusLoadingCoin: 'Loading {coin} data…',
    statusOk: 'Analysis updated successfully.',
    statusRetrying: 'Slow connection, retrying automatically…',
    statusOffline: '⚠️ No connection to market data. Retrying in the background…',
    chartUnavailable: 'The price chart could not be loaded. The rest of the analysis is still valid.',
    tvUnavailable: 'The real-time chart could not be loaded. Check your connection.',
    retry: 'Retry',
    langEsName: 'Spanish',
    langEnName: 'English',
    langPtName: 'Portuguese',
    navHome: 'Home',
    navAnalysis: 'Crypto',
    navMetals: 'Metals',
    navForex: 'Forex',
    navAbout: 'About us',
    fundTitle: 'Fundamental Analysis',
    fundDesc: 'Daily, weekly and monthly changes of the currency in the forex market.',
    techTitle: 'Technical Analysis',
    techDesc: 'Trend, momentum and volatility indicators over recent history.',
    up: 'Up',
    down: 'Down',
    dailyTitle: 'Price evolution — 90 days',
    dailyDesc: 'Daily closing price with short- and long-term trend averages overlaid.',
    liveTitle: 'Real-time chart',
    liveDesc: 'Live market chart · 1-hour candles.',
    summaryTitle: 'Summary & Professional Recommendation',
    combinedLabel: 'Combined Up Probability',
    summaryPlaceholder: 'Analyzing both approaches to generate a recommendation…',
    disclaimer: '⚠️ This analysis is generated automatically from public market data and statistical indicators. It does not constitute financial advice. Currency investments carry high risk.',
    footerPrefix: 'MarketPulse · Real-time market data · Updated:',
    footerLegal: 'Terms of use & disclaimer',
    footerVersion: 'Version',
    footerRights: 'All rights reserved.',
    m24h: '24h change',
    m7d: '7-day change',
    m30d: '30-day change',
    mVol: 'Last day volume vs 20d average',
    mDayHigh: '7-day high',
    mDayLow: '7-day low',
    metricRsi: 'Market momentum',
    metricSma20: 'Short-term trend',
    metricSma50: 'Long-term trend',
    metricMacd: 'Momentum change',
    metricSignal: 'Momentum signal',
    metricHist: 'Momentum strength',
    bullish: 'Bullish',
    bearish: 'Bearish',
    neutral: 'Neutral',
    recoBuy: 'BUY',
    recoSell: 'SELL',
    recoHold: 'NEUTRAL',
    recoBuyText: 'Buy / Hold long positions',
    recoSellText: 'Sell / Avoid new entries',
    recoHoldText: 'Hold and wait for confirmation',
    summaryText: 'Combining the fundamental analysis ({fu}%) with the technical ({tu}%), the model estimates a combined upside probability of {cu}% for today, {date}. Recommendation: {reco}.',
    detWeight: 'Technical weight (55%) vs fundamental (45%) — the short term follows price momentum more closely.',
    detFundUp: 'The asset context (recent changes, volume) favors buyers.',
    detFundDown: 'The asset context shows caution or selling pressure.',
    detFundNeutral: 'The asset context remains neutral, no clear bias.',
    detTechUp: 'Technical indicators suggest bullish momentum.',
    detTechDown: 'Technical indicators suggest weakness or a possible correction.',
    detTechNeutral: 'Technical indicators are mixed, no defined trend.',
    detRisk: 'Manage risk: use a stop-loss and never invest more than you can afford to lose.',
    chartPrice: '{coin} price ({quote})',
    rangeTitle: 'Estimated fluctuation range — today',
    rangeNote: 'Estimated from recent volatility and the asset’s average daily move, adjusted by the combined up/down probability. It is an informational statistical range, not a guarantee.',
    rangeVol: 'Daily volatility (σ · 90 days)',
    rangeUp: 'Bullish scenario — max upside today',
    rangeDown: 'Bearish scenario — max downside today',
    rangePrice: 'Expected price range today',
    rangeClose: 'Expected change at today\'s close',
    rangeClosePrice: 'Expected price at today\'s close',
    tradeTitle: 'Today’s trade plan',
    profileCons: '🛡️ Conservative',
    profileMed: '⚖️ Medium',
    profileAgg: '🔥 Aggressive',
    tradeLong: 'Long position (buy)',
    tradeShort: 'Short position (sell)',
    tradeEntry: 'Entry price',
    tradeStop: 'Stop loss',
    tradeTarget: 'Exit price',
    tradeRR: 'Reward / risk ratio',
    tradeNote: 'Three profiles for today’s trade based on your risk tolerance. Conservative: waits for a pullback, tight stop to risk little per trade and early exit. Medium: mild pullback, standard stop and exit at the estimated day extreme. Aggressive: market entry, wide stop that absorbs noise and extension exit. Statistical levels; not financial advice.',
  },
};

// ---------- Estado de preferencias ----------
const state = {
  theme: localStorage.getItem('btc-theme') || 'dark',
  lang: (() => { const s = localStorage.getItem('btc-lang'); return LOC_BY_LANG[s] ? s : 'es'; })(),
  statusKey: 'statusLoading',
  inverted: invertedFromUrl,
};

function pairName() {
  const base = (state.lang === 'en' && pair.nameEn) ? pair.nameEn
            : (state.lang === 'pt' && pair.namePt) ? pair.namePt
            : pair.name;
  if (!state.inverted) return base;
  // "Euro / Dólar" -> "Dólar / Euro" (misma regla para ES y EN)
  return base.split('/').map(s => s.trim()).reverse().join(' / ');
}

// ---------- Vista invertida del par (EUR/USD <-> USD/EUR) ----------
// La serie de Yahoo se guarda SIEMPRE sin tocar en cached.rawPrices; la inversión
// (1/precio) se aplica solo al derivar la serie visible, así el caché de sesión
// sirve para ambas direcciones y los indicadores se calculan sobre lo que se muestra.
function viewSeries(raw) {
  if (!state.inverted || !raw) return raw;
  return raw.map(p => (p ? 1 / p : p));
}
function viewSymbol() {
  if (!state.inverted) return pair.symbol;
  return pair.symbol.slice(3) + pair.symbol.slice(0, 3); // EURUSD -> USDEUR
}
function viewSlash() {
  return state.inverted ? revSlash() : pairSlash();
}
function pairSlash() {
  return pair.symbol.replace(/(.{3})(.{3})/, '$1/$2');
}
function revSlash() {
  return (pair.symbol.slice(3) + pair.symbol.slice(0, 3)).replace(/(.{3})(.{3})/, '$1/$2');
}
function tvSymbol() {
  // Los símbolos invertidos existen en FX_IDC (verificado: USDEUR, USDGBP,
  // JPYUSD, COPUSD, MXNUSD); en dirección normal se conserva el proveedor actual.
  return state.inverted ? `FX_IDC:${viewSymbol()}` : pair.tv;
}
// Decimales fijos para toda la vista invertida según la magnitud del precio:
// 0.9259 -> 4 | 0.057143 -> 6 | 0.006667 -> 6 | 0.00024390 -> 8
let viewDecimals = null;
function updateViewDecimals() {
  const raw = cached.rawPrices;
  if (!state.inverted || !raw || !raw.length) { viewDecimals = null; return; }
  const last = raw[raw.length - 1];
  const v = last ? 1 / last : 1;
  viewDecimals = v >= 0.1 ? 4 : v >= 0.001 ? 6 : 8;
}

function fillText(s) {
  return String(s)
    .replace(/\{coin\}/g, pairName())
    .replace(/\{pair\}/g, tvSymbol())
    .replace(/\{quote\}/g, viewSymbol().slice(3))
    .replace(/\{symbol\}/g, viewSymbol());
}

function t(key) {
  return (I18N[state.lang] && I18N[state.lang][key]) || I18N.es[key] || key;
}

function locale() { return LOC_BY_LANG[state.lang] || 'es-ES'; }

function fmtUSD(n) {
  return new Intl.NumberFormat(locale(), { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n);
}
// Formato dinámico por par de divisas: respeta decimales de la moneda cotizada.
// EUR/USD y GBP/USD -> 4 decimales; USD/JPY y USD/MXN -> 2; USD/COP -> 2.
function pairDecimals(key = pairKey) {
  if (key === 'eurusd' || key === 'gbpusd') return 4;
  return 2;
}
function fmtPairPrice(n, key = pairKey) {
  if (n == null || Number.isNaN(Number(n))) return '—';
  const d = viewDecimals ?? pairDecimals(key);
  return new Intl.NumberFormat(locale(), { minimumFractionDigits: d, maximumFractionDigits: d }).format(Number(n));
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

// Colores según tema para Chart.js
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
  // Desplegable: el boton muestra el codigo y las opciones se marcan con
  // aria-current (el CSS ya no usa la clase .active de los botones en fila).
  const current = document.getElementById('langCurrent');
  if (current) {
    const active = LOC_BY_LANG[state.lang] ? state.lang : 'es';
    current.textContent = (LOC_BTN[active] || active).toUpperCase();
  }
  document.querySelectorAll('.lang-option').forEach(opt => {
    opt.setAttribute('aria-current', opt.dataset.lang === state.lang ? 'true' : 'false');
  });
  els.statusText.textContent = fillText(t(state.statusKey));
  els.pairBanner.textContent = `${pairName()} · ${viewSymbol()}`;
  updateInvertUi();
  renderAnalysis();
  renderTradingView();
  if (cached.prices) renderChart(cached.prices, cached.dates);
}
function setLang(lang) {
  state.lang = lang;
  localStorage.setItem('btc-lang', lang);
  applyLang();
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

// ---------- Fetch con reintento y proxy ----------
// Tope de 8 s por petición: sin AbortController, un proxy que cuelga la conexión
// dejaba la página en "Cargando..." hasta el timeout del navegador (minutos).
// Cada combo de la cascada puede costar como máximo FETCH_TIMEOUT_MS.
const FETCH_TIMEOUT_MS = 8000;
async function fetchWithTimeout(url, options, timeoutMs = FETCH_TIMEOUT_MS) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  // Signal del llamante (para cancelar el resto de la carrera) encadenada con la
  // del timeout propio: si una cancela, la peticion se aborta igual.
  const outer = options && options.signal;
  if (outer) {
    if (outer.aborted) ctrl.abort();
    else outer.addEventListener('abort', () => ctrl.abort(), { once: true });
  }
  try {
    return await fetch(url, { ...(options || {}), signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}
async function fetchRetry(url, tries = 3) {
  let lastErr = null;
  for (let i = 0; i < tries; i++) {
    const isLast = i === tries - 1;
    try {
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (e) {
      lastErr = e && e.name === 'AbortError' ? new Error('timeout 8s') : e;
      if (isLast) break;
      await new Promise(r => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr || new Error('fetch failed');
}

// ---------- Datos: Yahoo Finance en carrera de proxies ----------
// En cada ronda sale UNA peticion por proxy (los gratuitos limitan por IP: 4 a
// la vez responden 429) y gana la primera que traiga datos validos. Si ninguna
// ruta responde, se prueba con el otro host de Yahoo.
// Antes era en serie: con un proxy colgado, cada combo costaba 8 s y el peor
// caso sumaba 32 s antes de rendirse.
const RACE_TIMEOUT_MS = 7000;
async function fetchYahooChart(yahooSymbol) {
  const path = `/v8/finance/chart/${yahooSymbol}?interval=1d&range=3mo`;
  const group = new AbortController();
  const attempt = (proxy, host) => fetchWithTimeout(
    proxy + encodeURIComponent(host + path), { signal: group.signal }, RACE_TIMEOUT_MS,
  ).then(res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  }).then(data => {
    if (!data || !data.chart || !data.chart.result || !data.chart.result[0]) {
      throw new Error('yahoo empty');
    }
    return data;
  });
  let lastErr = null;
  for (const host of YAHOO_HOSTS) {
    try {
      const data = await Promise.any(PROXIES.map(proxy => attempt(proxy, host)));
      group.abort();            // la ruta perdedora deja de gastar cuota
      return data;
    } catch (agg) {
      lastErr = (agg && agg.errors && agg.errors[0]) || agg;
    }
  }
  group.abort();
  throw (lastErr instanceof Error ? lastErr : new Error('yahoo failed'));
}

// 15 min en cache de sesion + copia en localStorage: al cambiar de par o volver
// atras, el historial ya esta y no se vuelve a pedir nada por la red.
const CACHE_TTL = 15 * 60 * 1000;
const CACHE_BACKUP_TTL = 24 * 60 * 60 * 1000;
const cached = {};
// Las fechas viajan como strings ISO en session/localStorage: se reviven a Date
// al leer, o drawChart fallaría (d.toLocaleDateString no existe en strings) en
// la 2ª visita a un par ya cacheado.
function reviveHistory(data) {
  if (data && Array.isArray(data.dates)) {
    data.dates = data.dates.map(d => (d instanceof Date ? d : new Date(d)));
  }
  return data;
}
function getCached(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_TTL) return null;
    return reviveHistory(data);
  } catch { return null; }
}
function setCached(key, data) {
  try { sessionStorage.setItem(key, JSON.stringify({ ts: Date.now(), data })); } catch { /* cuota */ }
}
// Copia en localStorage: sobrevive al cierre de la pestaña y sirve de red de
// seguridad si los proxies fallan cuando se vuelve a entrar.
function getBackup(key) {
  try {
    const raw = localStorage.getItem('backup_' + key);
    if (!raw) return null;
    const { ts, data } = JSON.parse(raw);
    if (Date.now() - ts > CACHE_BACKUP_TTL) return null;
    return reviveHistory(data);
  } catch { return null; }
}
function setBackup(key, data) {
  try { localStorage.setItem('backup_' + key, JSON.stringify({ ts: Date.now(), data })); } catch { /* cuota */ }
}

// ---------- Datos: Yahoo Finance vía cascada de proxies ----------
async function loadHistoricalPrices() {
  const key = 'fp_hist_' + pair.id;
  const cachedData = getCached(key);
  if (cachedData) return cachedData;
  try {
    const data = await fetchYahooChart(pair.yahoo);
    const result = data.chart.result[0];
    const quote = result.indicators.quote[0];
    const timestamps = result.timestamp || [];
    // Emparejar precios con timestamps para no desfasar fechas tras filtrar nulos
    const zipped = [];
    for (let i = 0; i < timestamps.length; i++) {
      const c = quote.close[i];
      if (c != null) zipped.push({ time: timestamps[i], price: c });
    }
    const prices = zipped.map(z => z.price);
    const dates = zipped.map(z => new Date(z.time * 1000));
    const closesMeta = { prices, dates };
    setCached(key, closesMeta);
    setBackup(key, closesMeta);
    return closesMeta;
  } catch (e) {
    // Si los proxies fallan, se muestra el ultimo historial guardado (hasta 24 h)
    // en lugar de una pagina de error.
    const backup = getBackup(key);
    if (backup) { setCached(key, backup); return backup; }
    throw e;
  }
}

async function loadSpotPrice() {
  // Divisas: el precio en vivo sale de Yahoo (último cierre diario); no se usa spot externo
  return null;
}

// ---------- Análisis Fundamental ----------
function analyzeFundamental(prices, spotPrice) {
  const n = prices.length;
  const lastPrice = prices[n - 1];
  const change24h = n >= 2 ? ((prices[n - 1] - prices[n - 2]) / prices[n - 2]) * 100 : 0;
  const change7d = n >= 8 ? ((prices[n - 1] - prices[n - 8]) / prices[n - 8]) * 100 : 0;
  const change30d = n >= 31 ? ((prices[n - 1] - prices[n - 31]) / prices[n - 31]) * 100 : 0;
  // Máximo/mínimo de los últimos 7 cierres diarios (los datos son diarios, no
  // intradía: con slice(-1) el max/min siempre sería el último precio).
  const win7 = prices.slice(-7);
  const weekHigh = Math.max(...win7);
  const weekLow = Math.min(...win7);
  const current = spotPrice ?? lastPrice;

  let score = 50;
  score += clamp(change24h, -8, 8) * 2.0;
  score += clamp(change7d, -15, 15) * 0.8;
  score += clamp(change30d, -25, 25) * 0.3;

  const upProb = clamp(Math.round(score), 5, 95);
  const downProb = 100 - upProb;

  els.fundMetrics.innerHTML = '';
  addMetricRow(els.fundMetrics, t('m24h'), fmtPct(change24h), change24h >= 0 ? 'up' : 'down');
  addMetricRow(els.fundMetrics, t('m7d'), fmtPct(change7d), change7d >= 0 ? 'up' : 'down');
  addMetricRow(els.fundMetrics, t('m30d'), fmtPct(change30d), change30d >= 0 ? 'up' : 'down');
  addMetricRow(els.fundMetrics, t('mDayHigh'), fmtPairPrice(weekHigh), 'up');
  addMetricRow(els.fundMetrics, t('mDayLow'), fmtPairPrice(weekLow), 'down');

  els.fundUp.textContent = `${upProb}%`;
  els.fundDown.textContent = `${downProb}%`;
  els.fundUpBar.style.width = `${upProb}%`;
  els.fundDownBar.style.width = `${downProb}%`;
  setBadge(els.fundBadge, upProb);

  return { upProb, downProb };
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
  addMetricRow(els.techMetrics, t('metricSma20'), sma20 ? fmtPairPrice(sma20) : '—', lastPrice > sma20 ? 'up' : 'down');
  addMetricRow(els.techMetrics, t('metricSma50'), sma50 ? fmtPairPrice(sma50) : '—', lastPrice > sma50 ? 'up' : 'down');
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
let chartJsPromise = null;

// Chart.js llega desde el HTML en paralelo, pero si el CDN va lento, está bloqueado
// o falla, se vuelve a pedir bajo demanda. Si de verdad no se puede cargar, el
// gráfico muestra un aviso propio sin tumbar el análisis que ya está en pantalla.
function ensureChartJs() {
  if (typeof Chart !== 'undefined') return Promise.resolve();
  if (!chartJsPromise) {
    chartJsPromise = new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => { chartJsPromise = null; reject(new Error('chart.js no disponible')); };
      document.head.appendChild(s);
    });
  }
  return chartJsPromise;
}

function renderChart(prices, dates) {
  const canvas = document.getElementById('priceChart');
  if (!canvas || !prices || !dates) return;
  ensureChartJs()
    .then(() => drawChart(canvas, prices, dates))
    .catch(err => {
      console.error('No se pudo cargar el gráfico de evolución:', err);
      const wrap = canvas.parentElement;
      if (wrap) wrap.innerHTML = `<p class="card-desc">${t('chartUnavailable')}</p>`;
    });
}

function drawChart(canvas, prices, dates) {
  const ctx = canvas.getContext('2d');
  const tag = LOC_BY_LANG[state.lang] || 'es-ES';
  const labels = dates.map(d => d.toLocaleDateString(tag, { day: '2-digit', month: 'short' }));
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
          label: t('metricSma20'),
          data: sma20Series,
          borderColor: '#17e6b0',
          borderWidth: 1.5,
          fill: false,
          pointRadius: 0,
          borderDash: [4, 3],
          tension: 0.25,
        },
        {
          label: t('metricSma50'),
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
            label: (item) => `${item.dataset.label}: ${fmtPairPrice(item.parsed.y)}`,
          },
        },
      },
      scales: {
        x: {
          ticks: { color: cc.tick, maxTicksLimit: 10, font: { size: 10 } },
          grid: { color: cc.grid },
        },
        y: {
          ticks: { color: cc.tick, font: { size: 10 }, callback: (v) => fmtPairPrice(v) },
          grid: { color: cc.grid },
        },
      },
    },
  });
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

// El widget de TradingView es lo mas pesado de la pagina y esta bajo el pliegue:
// se crea solo cuando va a entrar en pantalla (o, como red de seguridad, a los
// 4 s), de modo que no retrasa el primer pintado ni el analisis.
let tvReady = false;
let tvObserved = false;
function scheduleTradingView() {
  if (tvReady) return;
  const container = document.getElementById('tvChart');
  if (!container) return;
  const start = () => {
    if (tvReady) return;
    tvReady = true;
    createTradingView();
  };
  if (typeof IntersectionObserver === 'undefined') { start(); return; }
  if (!tvObserved) {
    tvObserved = true;
    const io = new IntersectionObserver(entries => {
      if (entries.some(e => e.isIntersecting)) { io.disconnect(); start(); }
    }, { rootMargin: '300px' });
    io.observe(container);
    setTimeout(start, 4000);   // por si el observer no llegara a dispararse
  }
}

function renderTradingView() {
  if (!tvReady) { scheduleTradingView(); return; }
  createTradingView();
}

function createTradingView() {
  const container = document.getElementById('tvChart');
  if (!container) return;
  const theme = state.theme === 'light' ? 'light' : 'dark';
  const locale = TV_LANG[state.lang] || 'es';

  loadTradingViewScript()
    .then(() => {
      container.innerHTML = '';
      new TradingView.widget({
        container_id: 'tvChart',
        symbol: tvSymbol(),
        interval: '60',
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
      container.innerHTML = `<p class="card-desc">${t('tvUnavailable')}</p>`;
    });
}


// ---------- Resumen y recomendación ----------
function renderRangeBlock(upProb, downProb) {
  const prices = cached.prices;
  const market = cached.market;
  if (!prices || prices.length < 30) return;

  const returns = [];
  for (let i = 1; i < prices.length; i++) {
    returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
  }
  const n = returns.length;
  const mean = returns.reduce((a, r) => a + r, 0) / n;
  const variance = returns.reduce((a, r) => a + (r - mean) ** 2, 0) / (n - 1);
  const sigma = Math.sqrt(variance);
  const meanAbs = returns.reduce((a, r) => a + Math.abs(r), 0) / n;

  const price = market ?? prices[prices.length - 1];
  const upPct = meanAbs * (0.5 + upProb / 100) * 100;
  const downPct = meanAbs * (0.5 + downProb / 100) * 100;
  const high = price * (1 + upPct / 100);
  const low = price * (1 - downPct / 100);
  const closePct = (upProb / 100) * upPct - (downProb / 100) * downPct;
  const closePrice = price * (1 + closePct / 100);

  const today = new Date().toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  els.rangeDate.textContent = `· ${today}`;

  els.rangeMetrics.innerHTML = '';
  addMetricRow(els.rangeMetrics, t('rangeVol'), `${(sigma * 100).toFixed(2)}%`, 'neutral');
  addMetricRow(els.rangeMetrics, t('rangeUp'), `+${upPct.toFixed(2)}% → ${fmtPairPrice(high)}`, 'up');
  addMetricRow(els.rangeMetrics, t('rangeDown'), `−${downPct.toFixed(2)}% → ${fmtPairPrice(low)}`, 'down');
  addMetricRow(els.rangeMetrics, t('rangePrice'), `${fmtPairPrice(low)} – ${fmtPairPrice(high)}`, 'neutral');
  addMetricRow(els.rangeMetrics, t('rangeClose'), fmtPct(closePct, 2), closePct >= 0 ? 'up' : 'down');
  addMetricRow(els.rangeMetrics, t('rangeClosePrice'), fmtPairPrice(closePrice), closePct >= 0 ? 'up' : 'down');

  renderTradeLevels(price, sigma, meanAbs, high, low, upProb);
}

// Plan operativo de hoy en 3 perfiles, alineados con la recomendación del día
// (COMPRA → larga, VENTA → corta; en NEUTRAL manda la ligera ventaja de prob.).
// Parámetros (m = movimiento medio diario, σ = volatilidad diaria):
//  - Conservador: retroceso de 0,75m, stop holgado 0,5σ bajo el mínimo estimado
//    del día y salida temprana al 60% del rango alcista.
//  - Medio: retroceso de 0,5m, stop 0,75σ bajo el mínimo y salida en el extremo
//    estimado del día.
//  - Arriesgado: entrada a mercado, stop 1σ bajo la entrada (aguanta el ruido)
//    y salida en extensión al 150% del rango.
function renderTradeLevels(price, sigma, meanAbs, high, low, upProb) {
  if (!els.tradeCons || !els.tradeMed || !els.tradeAgg) return;
  if (!(price > 0) || !(sigma > 0) || !(meanAbs > 0)) return;
  const long = upProb >= 62 ? true : upProb <= 38 ? false : upProb >= 50;
  if (els.tradeDir) {
    els.tradeDir.textContent = `· ${t(long ? 'tradeLong' : 'tradeShort')}`;
    els.tradeDir.className = `range-date ${long ? 'up' : 'down'}`;
  }

  const dayUp = Math.max(high - price, 0);
  const dayDown = Math.max(price - low, 0);
  const pctFrom = v => ((v - price) / price) * 100;
  const profiles = [
    { box: els.tradeCons, pull: 0.75, lowK: 0.50, entryK: 0, ext: 0.6 },
    { box: els.tradeMed, pull: 0.50, lowK: 0.75, entryK: 0, ext: 1.0 },
    { box: els.tradeAgg, pull: 0, lowK: 0, entryK: 1.0, ext: 1.5 },
  ];

  for (const p of profiles) {
    const entry = long ? price * (1 - p.pull * meanAbs) : price * (1 + p.pull * meanAbs);
    const stop = p.entryK
      ? (long ? entry * (1 - p.entryK * sigma) : entry * (1 + p.entryK * sigma))
      : (long ? low * (1 - p.lowK * sigma) : high * (1 + p.lowK * sigma));
    const target = long ? price + p.ext * dayUp : price - p.ext * dayDown;
    const risk = Math.abs(entry - stop);
    const rr = risk > 0 ? Math.abs(target - entry) / risk : 0;
    p.box.innerHTML = '';
    addMetricRow(p.box, t('tradeEntry'), `${fmtPairPrice(entry)} (${fmtPct(pctFrom(entry), 2)})`, 'neutral');
    addMetricRow(p.box, t('tradeStop'), `${fmtPairPrice(stop)} (${fmtPct(pctFrom(stop), 2)})`, 'down');
    addMetricRow(p.box, t('tradeTarget'), `${fmtPairPrice(target)} (${fmtPct(pctFrom(target), 2)})`, 'up');
    addMetricRow(p.box, t('tradeRR'), `1 : ${rr.toFixed(2)}`, rr >= 1 ? 'up' : 'neutral');
  }
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
    .replace('{date}', new Date().toLocaleDateString(locale(), { weekday: 'long', day: 'numeric', month: 'long' }))
    .replace('{reco}', t(recoKey));

  els.recoDetails.innerHTML = '';
  const details = [
    t('detWeight'),
    fundamental.upProb >= 55 ? t('detFundUp') : fundamental.upProb <= 45 ? t('detFundDown') : t('detFundNeutral'),
    technical.upProb >= 55 ? t('detTechUp') : technical.upProb <= 45 ? t('detTechDown') : t('detTechNeutral'),
    t('detRisk'),
  ];
  details.forEach(d => {
    const li = document.createElement('li');
    li.textContent = d;
    els.recoDetails.appendChild(li);
  });

  renderRangeBlock(combinedUp, 100 - combinedUp);
}

// ---------- Render del análisis ----------
function renderAnalysis() {
  if (!cached.prices) return;
  const { prices } = cached;
  const spot = cached.spotPrice;
  const current = spot ?? prices[prices.length - 1];
  const prev = prices.length >= 2 ? prices[prices.length - 2] : current;
  const change24h = prev !== 0 ? ((current - prev) / prev) * 100 : 0;

  els.currentPrice.textContent = fmtPairPrice(current);
  els.priceChange.textContent = `${fmtPct(change24h)} (24h)`;
  els.priceChange.className = `price-change ${change24h >= 0 ? 'up' : 'down'}`;

  const fundamental = analyzeFundamental(prices, spot);
  const technical = analyzeTechnical(prices);
  buildSummary(fundamental, technical);
}

// ---------- Inversión del par (EUR/USD <-> USD/EUR) ----------
function updateInvertUi() {
  const btn = els.invertBtn;
  if (!btn) return;
  btn.setAttribute('aria-pressed', String(state.inverted));
  btn.classList.toggle('active', state.inverted);
  const labelEl = btn.querySelector('.invert-label');
  if (labelEl) labelEl.textContent = t('invertPair');
  // El título ofrece la dirección contraria a la visible
  const target = state.inverted ? pairSlash() : revSlash();
  const hint = t('invertTo').replace('{symbol}', target);
  btn.title = hint;
  btn.setAttribute('aria-label', hint);
  // Pestañas: conservan el modo invertido al cambiar de par y muestran la dirección visible.
  // Se aplica desde el primer pintado (no solo al pulsar ⇄), para que entrar con
  // ?inv=1 no pierda la dirección al cambiar de pestaña.
  document.querySelectorAll('.coin-tab').forEach(a => {
    const cfg = PAIRS[a.dataset.pair];
    if (!cfg) return;
    if (!a.dataset.icon) a.dataset.icon = a.textContent.split('·')[0].trim();
    const base = a.dataset.baseHref || `forex.html?pair=${cfg.id}`;
    const sym = state.inverted ? cfg.symbol.slice(3) + cfg.symbol.slice(0, 3) : cfg.symbol;
    a.textContent = `${a.dataset.icon} · ${sym.replace(/(.{3})(.{3})/, '$1/$2')}`;
    a.setAttribute('href', state.inverted && !base.includes('inv=1') ? `${base}&inv=1` : base);
  });
  // El enlace "Divisas" del menú también conserva la dirección elegida
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (!href.startsWith('forex.html')) return;
    if (!a.dataset.href) a.dataset.href = href;
    a.setAttribute('href', state.inverted && !a.dataset.href.includes('inv=1')
      ? `${a.dataset.href}&inv=1`
      : a.dataset.href);
  });
}

function toggleInvert() {
  state.inverted = !state.inverted;
  const url = new URL(location.href);
  if (state.inverted) url.searchParams.set('inv', '1');
  else url.searchParams.delete('inv');
  history.replaceState(null, '', url);

  updateViewDecimals();
  // Rehacer la serie visible a partir de la cruda y repintar todo
  cached.prices = viewSeries(cached.rawPrices);
  if (cached.prices) cached.market = cached.spotPrice ?? cached.prices[cached.prices.length - 1];

  els.pairBanner.textContent = `${pairName()} · ${viewSymbol()}`;
  const pairBadgeEl = document.getElementById('pairBadge');
  if (pairBadgeEl) pairBadgeEl.textContent = viewSlash();
  updateInvertUi();

  if (cached.prices) {
    renderAnalysis();
    renderChart(cached.prices, cached.dates);
    renderTradingView();
  }
}

// Reintento automático: sin botón ni intervención. Si la cascada falla, se espera
// con espera progresiva (3 s, 6 s, 12 s… hasta 30 s) y se vuelve a intentar;
// a partir del 5º fallo seguido se muestra «sin conexión» y los reintentos
// siguen en segundo plano cada 30 s hasta que los datos entren.
const RETRY_BASE_MS = 3000;
const RETRY_MAX_MS = 30000;
const RETRY_OFFLINE_AFTER = 5;
let retryTimer = null;

// ---------- Selector de idioma desplegable ----------
// Es el mismo marcado que en site.js (los 7 HTML comparten el desplegable), asi
// que la logica se replica aqui en vez de depender de site.js, que no se carga
// en estas paginas. Se le pasa setLang para no duplicar la persistencia.
function initLangDropdown(pick) {
  const toggle = document.getElementById('langToggle');
  const menu = document.getElementById('langMenu');
  if (!toggle || !menu) return;
  const options = Array.from(menu.querySelectorAll('.lang-option'));

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  const isOpen = () => !menu.hidden;

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!isOpen());
  });
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      pick(opt.dataset.lang);
      setOpen(false);
      toggle.focus();
    });
  });
  document.addEventListener('click', (e) => {
    if (isOpen() && !menu.contains(e.target) && e.target !== toggle) setOpen(false);
  });
  menu.addEventListener('keydown', (e) => {
    const i = options.indexOf(document.activeElement);
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const next = e.key === 'ArrowDown'
        ? (i + 1) % options.length
        : (i - 1 + options.length) % options.length;
      options[next].focus();
    } else if (e.key === 'Home') {
      e.preventDefault(); options[0].focus();
    } else if (e.key === 'End') {
      e.preventDefault(); options[options.length - 1].focus();
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen()) {
      setOpen(false);
      toggle.focus();
    }
  });
}

// ---------- Inicialización ----------
async function init() {
  applyTheme();
  if (retryTimer) { clearTimeout(retryTimer); retryTimer = null; }
  const attempt = init._attempt = (init._attempt || 0) + 1;
  // Solo la primera carga (o un par nuevo) pone el estado "Cargando…": los
  // reintentos en segundo plano no tapan el mensaje de reintentando/offline.
  if (attempt === 1) {
    state.statusKey = 'statusLoadingCoin';
    els.statusText.textContent = fillText(t(state.statusKey));
    els.statusRow.querySelector('.loader').classList.remove('done');
  }
  try {
    const [history, spot] = await Promise.all([
      loadHistoricalPrices(),
      loadSpotPrice(),
    ]);
    // rawPrices: serie de Yahoo sin tocar (clave de caché compartida por dirección);
    // prices: serie visible (invertida 1/x si el usuario mostró el par al revés).
    cached.rawPrices = history.prices;
    cached.dates = history.dates;
    cached.prices = viewSeries(history.prices);
    cached.spotPrice = spot;
    cached.market = spot ?? cached.prices[cached.prices.length - 1];
    updateViewDecimals();

    renderAnalysis();

    // A partir de aquí los gráficos son opcionales: si alguno falla, el análisis ya
    // mostrado sigue siendo válido y NO se muestra un error de "datos no cargados".
    state.statusKey = 'statusOk';
    els.statusRow.querySelector('.loader').classList.add('done');
    els.statusText.textContent = t(state.statusKey);
    els.updateTime.textContent = new Date().toLocaleString(locale());

    renderChart(cached.prices, cached.dates);
    renderTradingView();
    init._attempt = 0;
  } catch (err) {
    console.error(err);
    // Sin botón: reintento automático. Hasta el 5º fallo seguido se muestra
    // "reintentando…"; a partir de ahí "sin conexión" y el reintento sigue en
    // segundo plano (cada 30 s) hasta que los datos entren.
    const wait = Math.min(RETRY_BASE_MS * Math.pow(2, attempt - 1), RETRY_MAX_MS);
    if (attempt < RETRY_OFFLINE_AFTER) {
      state.statusKey = 'statusRetrying';
      els.statusRow.querySelector('.loader').classList.remove('done');
      els.statusText.textContent = t(state.statusKey);
    } else {
      state.statusKey = 'statusOffline';
      els.statusRow.querySelector('.loader').classList.add('done');
      els.statusText.textContent = t(state.statusKey);
    }
    retryTimer = setTimeout(() => { retryTimer = null; init(); }, wait);
  }

  applyLang();
}

// ---------- Listeners de tema, idioma y pestañas ----------
els.themeToggle?.addEventListener('click', () => {
  setTheme(state.theme === 'dark' ? 'light' : 'dark');
});
// Se pasa setLang directamente. Antes era `() => setLang`, que solo devolvia
// la funcion sin ejecutarla: el menu se cerraba pero el idioma no cambiaba.
initLangDropdown(setLang);

document.querySelectorAll('.coin-tab').forEach(a => {
  a.classList.toggle('active', a.dataset.pair === pairKey);
});
document.querySelectorAll('.nav-link').forEach(a => {
  const isActive = a.classList.toggle('active', a.getAttribute('href').startsWith('forex.html'));
  if (isActive) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
});
const tvBadgeEl = document.getElementById('tvBadge');
if (tvBadgeEl) tvBadgeEl.textContent = '1 h';
const pairBadgeEl = document.getElementById('pairBadge');
if (pairBadgeEl) pairBadgeEl.textContent = viewSlash();
if (els.invertBtn) els.invertBtn.addEventListener('click', toggleInvert);
// Pinta la dirección inicial en tabs/nav ANTES de pedir la red, para que los
// enlaces ya conserven ?inv=1 aunque el usuario navegue de inmediato.
updateInvertUi();

init();

