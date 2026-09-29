#!/usr/bin/env python3
"""MarketPulse — núcleo de análisis del bot (puerto fiel de js/app.js).

Todo lo que la web calcula en el navegador se reproduce aquí con las MISMAS
fórmulas y los MISMOS umbrales, para que la señal del bot coincida con la que
se ve en la página. Referencia de cada bloque:

  sma / ema / ema_series / rsi / macd      -> js/app.js  líneas 431-487
  analyze_fundamental (peso 45 %)          -> js/app.js  líneas 831-877
  analyze_technical (peso 55 %)            -> js/app.js  líneas 898-940
  combinada 0,45 x 0,55 y umbral 62/38     -> js/app.js  líneas 1115-1124
  rango estimado (sigma y media absoluta)  -> js/app.js  líneas 1031-1070
  plan operativo de 3 perfiles             -> js/app.js  líneas 1081-1113

Fuentes (idénticas a la web): CoinGecko como serie oficial, Binance como
respaldo y alternative.me para el índice Miedo/Codicia. Solo librerías de
standard: no hace falta instalar nada.
"""
from __future__ import annotations

import json
import math
import time
import urllib.request

# ---------------------------------------------------------------- config
# Los 5 criptoactivos de la pestaña «Cripto» de la web (js/app.js línea 11).
# `spot`: fuente de respaldo de la web. `futures`: símbolo USDⓈ-M que opera el bot.
COINS = {
    "bitcoin":  {"name": "Bitcoin",  "symbol": "BTC",  "coingecko": "bitcoin",
                 "spot": "BTCUSDT",  "futures": "BTCUSDT"},
    "ethereum": {"name": "Ethereum", "symbol": "ETH",  "coingecko": "ethereum",
                 "spot": "ETHUSDT",  "futures": "ETHUSDT"},
    "solana":   {"name": "Solana",   "symbol": "SOL",  "coingecko": "solana",
                 "spot": "SOLUSDT",  "futures": "SOLUSDT"},
    "ripple":   {"name": "XRP",      "symbol": "XRP",  "coingecko": "ripple",
                 "spot": "XRPUSDT",  "futures": "XRPUSDT"},
    "dogecoin": {"name": "Dogecoin", "symbol": "DOGE", "coingecko": "dogecoin",
                 "spot": "DOGEUSDT", "futures": "DOGEUSDT"},
}

# Perfiles del «Plan operativo de hoy» (js/app.js línea 1093-1097).
#   pull   : retroceso que se espera para entrar, en múltiplos del movimiento
#            medio diario (m).
#   low_k  : holgura del stop bajo el mínimo estimado del día, en múltiplos de σ.
#   entry_k: si > 0, el stop se pone a entry_k·σ de la entrada (perfil arriesgado).
#   ext    : fracción del recorrido estimado del día que se toma como objetivo.
PROFILES = {
    "conservador": {"pull": 0.75, "low_k": 0.50, "entry_k": 0.0, "ext": 0.6},
    "medio":       {"pull": 0.50, "low_k": 0.75, "entry_k": 0.0, "ext": 1.0},
    "arriesgado":  {"pull": 0.00, "low_k": 0.00, "entry_k": 1.0, "ext": 1.5},
}

# Umbrales de decisión de la web (js/app.js líneas 1084 y 1122-1124).
BUY_THRESHOLD = 62
SELL_THRESHOLD = 38
WEIGHT_FUNDAMENTAL = 0.45
WEIGHT_TECHNICAL = 0.55

HTTP_TIMEOUT = 8.0          # mismo tope que FETCH_TIMEOUT_MS en la web
FETCH_TRIES = 3
BASE_DELAY = 1.2            # espera entre reintentos, crece x2


# ---------------------------------------------------------------- HTTP
def http_json(url: str, tries: int = FETCH_TRIES, base_delay: float = BASE_DELAY):
    """GET JSON con reintentos cortos y tope de 8 s por intento."""
    last_err: Exception | None = None
    for attempt in range(tries):
        try:
            req = urllib.request.Request(
                url, headers={"User-Agent": "MarketPulseBot/1.0",
                              "Accept": "application/json"})
            with urllib.request.urlopen(req, timeout=HTTP_TIMEOUT) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except Exception as exc:                      # noqa: BLE001
            last_err = exc
            if attempt < tries - 1:
                time.sleep(base_delay * (2 ** attempt))
    raise RuntimeError(f"no se pudo obtener {url}: {last_err}")


# ---------------------------------------------------------------- helpers
def clamp(n: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, n))


def js_round(n: float) -> int:
    """Math.round de JS: .5 redondea hacia arriba. El round() de Python no lo hace."""
    return math.floor(n + 0.5)


# ---------------------------------------------------------------- indicadores
def sma(values, period: int):
    if len(values) < period:
        return None
    return sum(values[-period:]) / period


def ema(values, period: int):
    if len(values) < period:
        return None
    k = 2 / (period + 1)
    prev = sum(values[:period]) / period
    for v in values[period:]:
        prev = v * k + prev * (1 - k)
    return prev


def ema_series(values, period: int):
    """Serie EMA con la misma siembra que la web (media de los primeros N)."""
    k = 2 / (period + 1)
    out: list = [None] * len(values)
    if len(values) < period:
        return out
    prev = sum(values[:period]) / period
    out[period - 1] = prev
    for i in range(period, len(values)):
        prev = values[i] * k + prev * (1 - k)
        out[i] = prev
    return out


def rsi(values, period: int = 14):
    """RSI de los últimos `period` cierres (igual que la web, sin Wilder)."""
    if len(values) < period + 1:
        return None
    gains = losses = 0.0
    for i in range(len(values) - period, len(values)):
        diff = values[i] - values[i - 1]
        if diff >= 0:
            gains += diff
        else:
            losses -= diff
    avg_gain, avg_loss = gains / period, losses / period
    if avg_loss == 0:
        return 100.0
    rs = avg_gain / avg_loss
    return 100 - 100 / (1 + rs)


def macd(values):
    ema12, ema26 = ema_series(values, 12), ema_series(values, 26)
    line = [None] * len(values)
    for i in range(len(values)):
        if ema12[i] is not None and ema26[i] is not None:
            line[i] = ema12[i] - ema26[i]
    series = [v for v in line if v is not None]
    if not series:
        return {"macd": None, "signal": None, "histogram": None}
    signal = ema(series, 9)
    now = series[-1]
    return {"macd": now, "signal": signal, "histogram": now - signal}


# ---------------------------------------------------------------- datos
SPOT_BASE = "https://api.binance.com"
COINGECKO = "https://api.coingecko.com/api/v3"
FNG_URL = "https://api.alternative.me/fng/?limit=1"


def load_history(coin: dict):
    """90 cierres diarios. 1) CoinGecko (serie oficial) 2) Binance spot si falla."""
    try:
        data = http_json(f"{COINGECKO}/coins/{coin['coingecko']}"
                         f"/market_chart?vs_currency=usd&days=90&interval=daily")
        return [float(p[1]) for p in data["prices"]], "coingecko"
    except Exception:                                 # noqa: BLE001
        kl = http_json(f"{SPOT_BASE}/api/v3/klines?symbol={coin['spot']}"
                       f"&interval=1d&limit=90")
        return [float(k[4]) for k in kl], "binance-spot"


def load_market(coin: dict, history):
    """Datos fundamentales. CoinGecko; si falla se adapta un ticker de Binance
    (equivale a adaptBinanceMarket de js/app.js, líneas 812-830)."""
    try:
        data = http_json(
            f"{COINGECKO}/coins/{coin['coingecko']}?localization=false"
            f"&tickers=false&market_data=true&community_data=true&developer_data=false")
        return data, "coingecko"
    except Exception:                                 # noqa: BLE001
        tk = http_json(f"{SPOT_BASE}/api/v3/ticker/24hr?symbol={coin['spot']}")
        price = float(tk["lastPrice"])
        ref7 = history[-8] if len(history) >= 8 else history[0]
        return {
            "_binance": True,
            "market_data": {
                "current_price": {"usd": price},
                "price_change_percentage_24h": float(tk.get("priceChangePercent", 0)),
                "price_change_percentage_7d": (price - ref7) / ref7 * 100,
                "total_volume": {"usd": float(tk.get("quoteVolume", 0))},
                "market_cap": {"usd": 0},
            },
            "sentiment_votes_up_percentage": 50,
        }, "binance-spot"


def load_fng():
    """Índice Miedo/Codicia. Opcional: si falla, la web también sigue sin él."""
    try:
        return http_json(FNG_URL, tries=2)["data"][0]
    except Exception:                                 # noqa: BLE001
        return None


# ---------------------------------------------------------------- análisis
def analyze_fundamental(market: dict, fng) -> dict:
    """Porta analyzeFundamental (js/app.js 831-877). Devuelve up_prob 5..95."""
    md = market["market_data"]
    change24 = md.get("price_change_percentage_24h") or 0.0
    change7d = md.get("price_change_percentage_7d") or 0.0
    sentiment_up = market.get("sentiment_votes_up_percentage") or 50
    fng_value = float(fng["value"]) if fng else 50.0

    score = 50.0
    score += clamp(change24, -10, 10) * 1.5
    score += clamp(change7d, -20, 20) * 0.6
    score += (sentiment_up - 50) * 0.4
    if fng:
        if fng_value <= 25:
            score += 6
        elif fng_value >= 75:
            score -= 6
        else:
            score += (fng_value - 50) * 0.15

    up = clamp(js_round(score), 5, 95)
    return {
        "up_prob": up, "down_prob": 100 - up,
        "change_24h": change24, "change_7d": change7d,
        "fng_value": fng_value,
        "fng_label": fng["value_classification"] if fng else "Neutral",
        "sentiment_up": sentiment_up,
    }


def analyze_technical(prices) -> dict:
    """Porta analyzeTechnical (js/app.js 898-940) sobre los 90 cierres."""
    last = prices[-1]
    rsi14 = rsi(prices, 14)
    sma20, sma50 = sma(prices, 20), sma(prices, 50)
    m = macd(prices)

    score = 50.0
    if rsi14 is not None:
        if rsi14 < 30:
            score += 15
        elif rsi14 > 70:
            score -= 15
        else:
            score += (50 - rsi14) * 0.3
    if sma20 and sma50:
        if last > sma20 and sma20 > sma50:
            score += 15
        elif last < sma20 and sma20 < sma50:
            score -= 15
        elif last > sma20:
            score += 6
        else:
            score -= 6
    if m["histogram"] is not None and not math.isnan(m["histogram"]):
        score += clamp(m["histogram"] / last * 10000, -12, 12)

    up = clamp(js_round(score), 5, 95)
    return {
        "up_prob": up, "down_prob": 100 - up,
        "rsi": rsi14, "sma20": sma20, "sma50": sma50,
        "macd": m["macd"], "macd_signal": m["signal"], "macd_hist": m["histogram"],
    }


def daily_stats(prices):
    """sigma (volatilidad diaria) y media de movimientos absolutos (js 1036-1044)."""
    rets = [(prices[i] - prices[i - 1]) / prices[i - 1] for i in range(1, len(prices))]
    n = len(rets)
    mean = sum(rets) / n
    var = sum((r - mean) ** 2 for r in rets) / (n - 1)
    return math.sqrt(var), sum(abs(r) for r in rets) / n


# ---------------------------------------------------------------- rango y plan
def range_block(price: float, sigma: float, mean_abs: float, up_prob: int) -> dict:
    """Porta renderRangeBlock (js/app.js 1031-1070): horquilla estimada del día."""
    down_prob = 100 - up_prob
    up_pct = mean_abs * (0.5 + up_prob / 100) * 100
    down_pct = mean_abs * (0.5 + down_prob / 100) * 100
    high = price * (1 + up_pct / 100)
    low = price * (1 - down_pct / 100)
    close_pct = (up_prob / 100) * up_pct - (down_prob / 100) * down_pct
    return {"sigma": sigma, "mean_abs": mean_abs, "up_pct": up_pct,
            "down_pct": down_pct, "high": high, "low": low,
            "close_pct": close_pct, "close_price": price * (1 + close_pct / 100)}


def trade_levels(price: float, sigma: float, mean_abs: float, high: float,
                 low: float, up_prob: int, profile: str = "medio") -> dict:
    """Porta renderTradeLevels (js/app.js 1081-1113) para un solo perfil.

    Devuelve dirección (long/short), entrada, stop, objetivo y R:R. El bot
    redondea después al tickSize/minQty del símbolo según los filtros.
    """
    if not (price > 0 and sigma > 0 and mean_abs > 0):
        raise ValueError("precio/volatilidad inválidos para calcular el plan")
    # js/app.js 1084: larga con >=62 %, corta con <=38 %; en neutro manda la
    # ligera ventaja (up_prob >= 50).
    long = up_prob >= BUY_THRESHOLD or (up_prob > SELL_THRESHOLD and up_prob >= 50)
    p = PROFILES[profile]

    day_up = max(high - price, 0.0)
    day_down = max(price - low, 0.0)
    entry = (price * (1 - p["pull"] * mean_abs) if long
             else price * (1 + p["pull"] * mean_abs))
    if p["entry_k"]:
        stop = (entry * (1 - p["entry_k"] * sigma) if long
                else entry * (1 + p["entry_k"] * sigma))
    else:
        stop = (low * (1 - p["low_k"] * sigma) if long
                else high * (1 + p["low_k"] * sigma))
    target = (price + p["ext"] * day_up) if long else (price - p["ext"] * day_down)
    risk = abs(entry - stop)
    rr = abs(target - entry) / risk if risk > 0 else 0.0
    return {"side": "long" if long else "short", "entry": entry, "stop": stop,
            "target": target, "risk": risk, "rr": rr,
            "entry_pct": (entry - price) / price * 100,
            "stop_pct": (stop - price) / price * 100,
            "target_pct": (target - price) / price * 100}



# ---------------------------------------------------------------- señal
def build_signal(coin_key: str, profile: str = "medio", price: float | None = None,
                 history=None, market=None, fng=...) -> dict:
    """Señal completa de un activo, con los números exactos que pinta la web.

    `price`: precio de referencia. Si se omite se usa el spot de CoinGecko/Binance
    (como la web). El bot pasa el precio de futuros para que el plan se calcule
    sobre el instrumento que opera; la probabilidad no cambia.
    `history`/`market`/`fng`: se pueden inyectar para reutilizar datos ya
    descargados o para pruebas deterministas.
    """
    if coin_key not in COINS:
        raise KeyError(f"activo desconocido: {coin_key}. "
                       f"Válidos: {', '.join(COINS)}")
    if profile not in PROFILES:
        raise KeyError(f"perfil desconocido: {profile}. "
                       f"Válidos: {', '.join(PROFILES)}")
    coin = COINS[coin_key]

    src_history = "inyectado"
    if history is None:
        history, src_history = load_history(coin)
    if len(history) < 30:
        raise ValueError(f"historial demasiado corto ({len(history)} velas)")

    src_market = "inyectado"
    if market is None:
        market, src_market = load_market(coin, history)
    if fng is ...:
        fng = load_fng()

    fund = analyze_fundamental(market, fng)
    tech = analyze_technical(history)
    # js/app.js 1116: combinada = 45 % fundamental + 55 % técnico.
    combined = clamp(js_round(fund["up_prob"] * WEIGHT_FUNDAMENTAL
                              + tech["up_prob"] * WEIGHT_TECHNICAL), 0, 100)

    if combined >= BUY_THRESHOLD:
        reco = "COMPRA"
    elif combined <= SELL_THRESHOLD:
        reco = "VENTA"
    else:
        reco = "NEUTRAL"

    spot_price = float(market["market_data"]["current_price"]["usd"])
    ref_price = float(price) if price else spot_price
    sigma, mean_abs = daily_stats(history)
    rng = range_block(ref_price, sigma, mean_abs, combined)
    plan = trade_levels(ref_price, sigma, mean_abs, rng["high"], rng["low"],
                        combined, profile)

    return {
        "coin": coin_key, "name": coin["name"], "symbol": coin["symbol"],
        "futures_symbol": coin["futures"], "spot_symbol": coin["spot"],
        "profile": profile, "price": ref_price, "spot_price": spot_price,
        "sources": {"history": src_history, "market": src_market,
                    "fng": "alternative.me" if fng else "no disponible"},
        "fundamental": fund, "technical": tech,
        "combined_up": combined, "combined_down": 100 - combined,
        "recommendation": reco,
        "range": rng, "plan": plan,
        "generated_at": int(time.time()),
    }



def profile_label(key: str) -> str:
    """Etiqueta legible del perfil, igual que la web (🛡️/⚖️/🔥)."""
    return {"conservador": "conservador", "medio": "medio",
            "arriesgado": "arriesgado"}[key]


def format_signal(s: dict) -> str:
    """Texto de una señal, con los mismos datos que muestra la página."""
    p, t, f, r = s["plan"], s["technical"], s["fundamental"], s["range"]
    lines = [
        f"{s['name']} ({s['futures_symbol']})  precio {s['price']:.6g}",
        f"  fuentes          historia={s['sources']['history']} "
        f"mercado={s['sources']['market']} · fng={s['sources']['fng']}",
        f"  fundamental      {f['up_prob']}% subida  "
        f"(24h {f['change_24h']:+.2f}% · 7d {f['change_7d']:+.2f}% · "
        f"Miedo/Codicia {f['fng_value']:.0f} · sentimiento {f['sentiment_up']:.0f}%)",
        f"  técnico          {t['up_prob']}% subida  "
        f"(RSI {t['rsi']:.1f} · SMA20 {t['sma20']:.6g} · SMA50 {t['sma50']:.6g} · "
        f"MACD {t['macd']:.6g} · señal {t['macd_signal']:.6g})",
        f"  combinada        {s['combined_up']}% subida  ->  {s['recommendation']}",
        f"  rango del día    {r['low']:.6g} .. {r['high']:.6g}  "
        f"(σ diaria {r['sigma'] * 100:.2f}% · cierre esperado {r['close_pct']:+.2f}%)",
        f"  plan {profile_label(s['profile'])}  {p['side'].upper()}  "
        f"entrada {p['entry']:.6g} ({p['entry_pct']:+.2f}%) · "
        f"stop {p['stop']:.6g} ({p['stop_pct']:+.2f}%) · "
        f"objetivo {p['target']:.6g} ({p['target_pct']:+.2f}%) · R:R 1:{p['rr']:.2f}",
    ]
    return "\n".join(lines)


def main(argv=None) -> int:
    """Uso: python bot/mp_core.py [--coin bitcoin] [--profile medio] [--json]"""
    import argparse
    ap = argparse.ArgumentParser(
        description="Calcula la señal MarketPulse de un activo (no opera)")
    ap.add_argument("--coin", default="bitcoin", choices=sorted(COINS))
    ap.add_argument("--profile", default="medio", choices=sorted(PROFILES))
    ap.add_argument("--json", action="store_true", help="volcar la señal en JSON")
    a = ap.parse_args(argv)

    sig = build_signal(a.coin, a.profile)
    print(json.dumps(sig, indent=2, ensure_ascii=False) if a.json
          else format_signal(sig))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

    return math.sqrt(var), sum(abs(r) for r in rets) / n
