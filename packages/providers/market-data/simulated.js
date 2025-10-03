import { setInterval as nodeSetInterval, clearInterval as nodeClearInterval } from 'node:timers';

let subscriptionCounter = 0;

function createPriceState(basePrice = 100) {
  return {
    tick: 0,
    price: basePrice,
  };
}

export function createSimulatedMarketDataAdapter(settings = {}) {
  const basePrices = settings.basePrices ?? {};
  const tickInterval = settings.tickInterval ?? 2_000;

  const priceState = new Map();
  const subscriptions = new Map();
  let timer = null;

  const ensureTimer = () => {
    if (timer) return;
    timer = nodeSetInterval(runTick, tickInterval);
    if (typeof timer?.unref === 'function') {
      timer.unref();
    }
  };

  const maybeClearTimer = () => {
    if (timer && subscriptions.size === 0) {
      nodeClearInterval(timer);
      timer = null;
    }
  };

  function generatePrice(symbol) {
    if (!priceState.has(symbol)) {
      priceState.set(symbol, createPriceState(basePrices[symbol] ?? 100));
    }
    const state = priceState.get(symbol);
    state.tick += 1;
    const amplitude = settings.amplitude ?? 3;
    const drift = settings.drift ?? 0.05;
    const noise = Math.sin(state.tick / 3) * amplitude + (Math.random() - 0.5) * drift;
    state.price = Math.max(0.01, state.price + noise);
    state.price = Number(state.price.toFixed(2));
    return {
      symbol,
      price: state.price,
      timestamp: Date.now(),
    };
  }

  function runTick() {
    if (subscriptions.size === 0) {
      maybeClearTimer();
      return;
    }
    const now = Date.now();
    for (const { symbols, listener } of subscriptions.values()) {
      for (const symbol of symbols) {
        const update = generatePrice(symbol);
        listener({ ...update, timestamp: now });
      }
    }
  }

  return {
    async subscribeQuotes(symbols, listener) {
      const normalized = Array.from(new Set(symbols));
      const id = `sim-${++subscriptionCounter}`;
      subscriptions.set(id, { symbols: normalized, listener });
      ensureTimer();

      // Emit immediate snapshot so UI has data
      const now = Date.now();
      normalized.forEach((symbol) => {
        const update = generatePrice(symbol);
        listener({ ...update, timestamp: now });
      });

      return {
        id,
        symbols: normalized,
        async stop() {
          subscriptions.delete(id);
          maybeClearTimer();
        },
      };
    },

    async fetchSnapshot(symbol) {
      const update = generatePrice(symbol);
      return {
        symbol,
        price: update.price,
        open: update.price,
        high: update.price,
        low: update.price,
        volume: 0,
        timestamp: update.timestamp,
      };
    },
  };
}
