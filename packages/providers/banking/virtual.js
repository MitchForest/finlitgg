import { randomUUID } from 'node:crypto';

export function createVirtualBankingAdapter() {
  const balances = new Map();

  function ensureAccount(accountId, defaults = {}) {
    if (!balances.has(accountId)) {
      balances.set(accountId, {
        accountId,
        balanceCents: defaults.balanceCents ?? 0,
        availableCents: defaults.availableCents ?? defaults.balanceCents ?? 0,
        currency: defaults.currency ?? 'USD',
        updatedAt: Date.now(),
      });
    }
    return balances.get(accountId);
  }

  return {
    async createAccount(userId, type) {
      const accountId = randomUUID();
      const snapshot = {
        accountId,
        type,
        userId,
        balanceCents: 0,
        availableCents: 0,
        currency: 'USD',
        provider: 'virtual',
        createdAt: Date.now(),
      };
      balances.set(accountId, {
        accountId,
        balanceCents: 0,
        availableCents: 0,
        currency: 'USD',
        updatedAt: Date.now(),
      });
      return snapshot;
    },

    async transfer(request) {
      const from = ensureAccount(request.fromAccountId);
      const to = ensureAccount(request.toAccountId);
      if (from.availableCents < request.amountCents) {
        throw new Error('Insufficient funds for simulated transfer');
      }
      from.balanceCents -= request.amountCents;
      from.availableCents -= request.amountCents;
      from.updatedAt = Date.now();

      to.balanceCents += request.amountCents;
      to.availableCents += request.amountCents;
      to.updatedAt = Date.now();

      return {
        id: randomUUID(),
        status: 'completed',
        processedAt: Date.now(),
        provider: 'virtual',
        amountCents: request.amountCents,
        metadata: request.metadata ?? {},
      };
    },

    async fetchBalance(accountId) {
      const snapshot = ensureAccount(accountId);
      return { ...snapshot };
    },
  };
}
