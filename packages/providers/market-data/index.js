import { createSimulatedMarketDataAdapter } from './simulated.js';
import { createPolygonMarketDataAdapter } from './polygon.js';

export const marketDataAdapters = {
  simulated: createSimulatedMarketDataAdapter,
  polygon: createPolygonMarketDataAdapter,
};

/**
 * Resolve a market data adapter by key.
 * @param {string} key
 * @param {Record<string, any>} settings
 * @returns {import('../types.js').MarketDataPort}
 */
export function resolveMarketDataAdapter(key, settings = {}) {
  const factory = marketDataAdapters[key];
  if (!factory) {
    throw new Error(`Unknown market data provider: ${key}`);
  }
  return factory(settings);
}
