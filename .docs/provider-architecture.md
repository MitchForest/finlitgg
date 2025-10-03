# Provider Architecture Strategy

Goal: keep finlit.gg’s money and investing experiences provider-agnostic so we can swap simulated engines for real banking/brokerage partners without rewrites. Everything domain-facing depends on narrow ports; adapters translate provider quirks into those contracts.

## 1. Core Abstractions

### Domain Ports (interfaces)
Defined in `packages/providers/<area>/types.ts`, shared across backend code.

```ts
export interface MarketDataPort {
  subscribeQuotes(symbols: string[]): Promise<SubscriptionHandle>;
  unsubscribe(handle: SubscriptionHandle): Promise<void>;
  fetchSnapshot(symbol: string): Promise<QuoteSnapshot>;
}

export interface TradingPort {
  placeOrder(intent: OrderIntent): Promise<OrderExecution>;
  cancelOrder(orderId: string): Promise<void>;
  listOrders(params?: OrderFilter): Promise<OrderExecution[]>;
  listPositions(): Promise<Position[]>;
}

export interface BankingPort {
  createAccount(userId: string, type: AccountType): Promise<Account>;
  transfer(request: TransferRequest): Promise<TransferReceipt>;
  fetchBalance(accountId: string): Promise<AccountSnapshot>;
}
```

- All inputs/outputs are Zod schemas defined in `packages/shared` to guarantee type safety.
- Ports expose **only what the domain needs** (no provider-specific flags).

### Provider Registry
`packages/providers/index.ts` exports:

```ts
export type ProviderConfig = {
  marketData: { type: ProviderKey; settings: Record<string, unknown> };
  trading: { type: ProviderKey; settings: Record<string, unknown> };
  banking: { type: ProviderKey; settings: Record<string, unknown> };
};

export interface ProviderRegistry {
  marketData: MarketDataPort;
  trading: TradingPort;
  banking: BankingPort;
}

export function resolveProviders(cfg: ProviderConfig): ProviderRegistry { /* adapter lookup */ }
```

Config can be global (env-based) or per household (Convex table `provider_configs`).

## 2. Adapter Layout

```
packages/providers/
  market-data/
    index.ts          // exports type definitions + adapter map
    polygon.ts        // Polygon WS/REST implementation
    simulated.ts      // deterministic price engine for demos/tests
  trading/
    index.ts
    simulated.ts      // writes to virtual ledger
    drivewealth.ts    // future real adapter
    alpaca.ts         // future real adapter
  banking/
    index.ts
    virtual.ts        // uses our virtual accounts tables
    bass-provider.ts  // future bank partner
```

Each adapter:
- Implements the relevant port using provider SDKs or HTTP.
- Normalizes responses to domain objects via Zod.
- Encapsulates connection lifecycle, retries, error mapping, telemetry.
- Exposes a factory `createAdapter(settings: AdapterSettings): MarketDataPort` so `resolveProviders` can instantiate it.

## 3. Using Adapters in Convex

1. **Context helper** in `backend/convex/providers.ts`:
   ```ts
   import { resolveProviders } from "@finlit/providers";

   export function getProviderRegistry(ctx: MutationCtx | ActionCtx) {
     const cfg = getConfigForHousehold(ctx); // query convex table or env
     return resolveProviders(cfg);
   }
   ```

2. **Domain actions/mutations** request adapters instead of touching provider SDKs:
   ```ts
   export const placeOrder = mutation({
     args: { intent: OrderIntentSchema },
     handler: async (ctx, args) => {
       const providers = getProviderRegistry(ctx);
       const execution = await providers.trading.placeOrder(args.intent);
       // persist execution, reward vault, notifications
     }
   });
   ```

3. **Household-specific configuration** stored in `provider_configs` table: `{ householdId, marketData: "simulated", trading: "simulated", banking: "virtual" }`. Ops can flip to real providers without redeploy.

## 4. Market Data Streaming Pattern

Convex actions are short-lived, so websocket connections stay outside Convex in a dedicated worker.

- `services/market-data-worker/`
  - Loads `resolveProviders` with current config.
  - If provider is `polygon`, uses `packages/providers/market-data/polygon` to connect to Polygon websocket (`wss://delayed.polygon.io/stocks`).
  - Normalizes events → `QuoteUpdate` objects.
  - Publishes updates to Convex via an action (`marketData.ingestQuote`) or alternative pub/sub (Redis/SSE). Convex stores latest quotes and broadcasts to clients.
  - Swapping to `simulated` provider simply changes adapter selection; worker code stays the same.

Frontend consumption:
- `useMarketQuotes(symbols)` query subscribes to Convex table or SSE endpoint, receives identical payloads independent of provider.

## 5. Trading & Banking Flow

```
UI → Convex mutation → domain service → Provider Registry → adapter → provider API → domain writes ledger/notifications
```

- Simulated adapters manipulate our virtual accounts (`accounts`, `transactions`, etc.).
- Real adapters call partner APIs, then persist results into the same tables. Downstream features (goals, automations, reward vault) read the same schema regardless of source.
- Orders/transfers store `provider`, `providerReferenceId`, and raw payload in `metadata` for audit.

## 6. Testing & Switching Providers

- **Contract tests**: For each adapter implement Jest/Vitest tests that assert compliance with the port using Zod schemas and recorded fixtures.
- **Environment configs**: `provider_configs` seeded to `simulated` by default. CI can run both simulated (unit) and integration (hitting Polygon sandbox) by flipping config.
- **Hot swaps**: To move from Polygon to another feed or from virtual banking to real partner, add the new adapter file, register it in the adapter map, update config. Domain code, UI, and database stay untouched.

## 7. Operational Considerations

- Centralized logging inside adapters (`logger.child({ provider: 'polygon' })`).
- Health checks for each adapter (e.g., `polygonAdapter.health()`), surfaced in admin dashboard.
- Graceful degradation: if real provider fails, registry can fall back to simulated adapter for resilience.
- Security: store provider credentials in environment secrets; adapters read from `settings` passed via config.

## 8. Implementation Checklist

1. Scaffold `packages/providers` with interfaces and simulated adapters.
2. Add `backend/convex/providers.ts` helper and `provider_configs` table + seeding.
3. Update domain mutations/actions to use `getProviderRegistry`.
4. Build market-data worker consuming adapters.
5. Write contract tests for simulated + polygon adapters.
6. Document adapter addition steps (README in `packages/providers`).

Once this foundation is live, adding DriveWealth, Alpaca, or a real banking partner is just a new adapter + config change.
