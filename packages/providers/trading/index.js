import { createSimulatedTradingAdapter } from './simulated.js';
import { createDrivewealthTradingAdapter } from './drivewealth.js';
import { createAlpacaTradingAdapter } from './alpaca.js';

export const tradingAdapters = {
  simulated: createSimulatedTradingAdapter,
  drivewealth: createDrivewealthTradingAdapter,
  alpaca: createAlpacaTradingAdapter,
};

/**
 * Resolve a trading adapter by key.
 * @param {string} key
 * @param {Record<string, any>} settings
 * @returns {import('../types.js').TradingPort}
 */
export function resolveTradingAdapter(key, settings = {}) {
  const factory = tradingAdapters[key];
  if (!factory) {
    throw new Error(`Unknown trading provider: ${key}`);
  }
  return factory(settings);
}
