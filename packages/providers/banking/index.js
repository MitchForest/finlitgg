import { createVirtualBankingAdapter } from './virtual.js';
import { createBassBankingAdapter } from './bass-provider.js';

export const bankingAdapters = {
  virtual: createVirtualBankingAdapter,
  baas: createBassBankingAdapter,
};

/**
 * Resolve a banking adapter by key.
 * @param {string} key
 * @param {Record<string, any>} settings
 * @returns {import('../types.js').BankingPort}
 */
export function resolveBankingAdapter(key, settings = {}) {
  const factory = bankingAdapters[key];
  if (!factory) {
    throw new Error(`Unknown banking provider: ${key}`);
  }
  return factory(settings);
}
