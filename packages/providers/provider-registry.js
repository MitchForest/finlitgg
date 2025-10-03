import { resolveMarketDataAdapter } from './market-data/index.js';
import { resolveTradingAdapter } from './trading/index.js';
import { resolveBankingAdapter } from './banking/index.js';

const DEFAULT_CONFIG = {
  marketData: { type: 'simulated', settings: {} },
  trading: { type: 'simulated', settings: {} },
  banking: { type: 'virtual', settings: {} },
};

function withDefaultSection(section, fallback) {
  if (!section) return { ...fallback };
  return {
    type: section.type ?? fallback.type,
    settings: section.settings ?? fallback.settings,
  };
}

/**
 * Resolve provider adapters according to configuration.
 * @param {import('./types.js').ProviderConfig} config
 * @returns {import('./types.js').ProviderRegistry}
 */
export function resolveProviders(config = DEFAULT_CONFIG) {
  const merged = {
    marketData: withDefaultSection(config.marketData, DEFAULT_CONFIG.marketData),
    trading: withDefaultSection(config.trading, DEFAULT_CONFIG.trading),
    banking: withDefaultSection(config.banking, DEFAULT_CONFIG.banking),
  };

  return {
    marketData: resolveMarketDataAdapter(merged.marketData.type, merged.marketData.settings),
    trading: resolveTradingAdapter(merged.trading.type, merged.trading.settings),
    banking: resolveBankingAdapter(merged.banking.type, merged.banking.settings),
  };
}

export { DEFAULT_CONFIG };
