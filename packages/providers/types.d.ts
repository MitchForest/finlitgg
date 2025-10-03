export type QuoteUpdate = {
  symbol: string;
  price: number;
  timestamp: number;
};

export type QuoteSnapshot = {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  timestamp: number;
};

export type QuoteListener = (update: QuoteUpdate) => void;

export interface QuoteSubscription {
  id: string;
  symbols: string[];
  stop(): Promise<void>;
}

export interface MarketDataPort {
  subscribeQuotes(symbols: string[], listener: QuoteListener): Promise<QuoteSubscription>;
  fetchSnapshot(symbol: string): Promise<QuoteSnapshot>;
}

export type OrderSide = 'buy' | 'sell';
export type OrderType = 'market' | 'limit';

export interface OrderIntent {
  symbol: string;
  side?: OrderSide;
  type?: OrderType;
  quantity: number;
  limitPrice?: number;
  clientOrderId?: string;
  metadata?: Record<string, unknown>;
}

export interface OrderExecution {
  id: string;
  provider?: string;
  symbol: string;
  side: OrderSide;
  quantity: number;
  filledQuantity: number;
  averagePrice: number;
  status: 'filled' | 'pending' | 'rejected' | 'cancelled';
  submittedAt: number;
  filledAt?: number;
  cancelledAt?: number;
  metadata?: Record<string, unknown>;
}

export interface OrderFilter {
  symbol?: string;
  status?: OrderExecution['status'];
  after?: number;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  marketValue: number;
  updatedAt: number;
}

export interface TradingPort {
  placeOrder(intent: OrderIntent): Promise<OrderExecution>;
  cancelOrder(orderId: string): Promise<void>;
  listOrders(filter?: OrderFilter): Promise<OrderExecution[]>;
  listPositions(): Promise<Position[]>;
}

export type AccountType = 'save' | 'spend' | 'invest' | 'donate' | 'credit';

export interface AccountSummary {
  accountId: string;
  type: AccountType;
  userId?: string;
  balanceCents: number;
  availableCents: number;
  currency: string;
  provider: string;
  createdAt: number;
  metadata?: Record<string, unknown>;
}

export interface TransferRequest {
  fromAccountId: string;
  toAccountId: string;
  amountCents: number;
  memo?: string;
  metadata?: Record<string, unknown>;
}

export interface TransferReceipt {
  id: string;
  status: 'completed' | 'pending' | 'failed';
  processedAt: number;
  amountCents: number;
  provider: string;
  providerReferenceId?: string;
  metadata?: Record<string, unknown>;
}

export interface AccountSnapshot {
  accountId: string;
  balanceCents: number;
  availableCents: number;
  currency: string;
  updatedAt: number;
}

export interface BankingPort {
  createAccount(userId: string, type: AccountType): Promise<AccountSummary>;
  transfer(request: TransferRequest): Promise<TransferReceipt>;
  fetchBalance(accountId: string): Promise<AccountSnapshot>;
}

export interface ProviderSelection {
  type: string;
  settings?: Record<string, unknown>;
}

export interface ProviderConfig {
  marketData: ProviderSelection;
  trading: ProviderSelection;
  banking: ProviderSelection;
}

export interface ProviderRegistry {
  marketData: MarketDataPort;
  trading: TradingPort;
  banking: BankingPort;
}
