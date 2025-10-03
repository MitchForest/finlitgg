let orderCounter = 0;

function ensurePosition(map, symbol) {
  if (!map.has(symbol)) {
    map.set(symbol, {
      symbol,
      quantity: 0,
      averagePrice: 0,
      marketValue: 0,
      updatedAt: Date.now(),
    });
  }
  return map.get(symbol);
}

function applyFill(position, side, quantity, price) {
  const signedQty = side === 'buy' ? quantity : -quantity;
  const newQuantity = position.quantity + signedQty;
  const totalCost = position.averagePrice * position.quantity + price * signedQty;
  position.quantity = Number(newQuantity.toFixed(4));
  position.averagePrice = position.quantity === 0 ? 0 : Number((totalCost / position.quantity).toFixed(4));
  position.marketValue = Number((position.quantity * price).toFixed(2));
  position.updatedAt = Date.now();
}

export function createSimulatedTradingAdapter(settings = {}) {
  const positions = new Map();
  const orders = [];

  function resolvePrice(intent) {
    if (intent.limitPrice) return intent.limitPrice;
    if (settings.pricing?.[intent.symbol]) return settings.pricing[intent.symbol];
    return Number((100 + Math.random() * 5).toFixed(2));
  }

  return {
    async placeOrder(intent) {
      const price = resolvePrice(intent);
      const quantity = Number(intent.quantity ?? 0);
      if (!quantity || quantity <= 0) {
        throw new Error('Quantity must be greater than zero');
      }
      const position = ensurePosition(positions, intent.symbol);
      applyFill(position, intent.side ?? 'buy', quantity, price);

      const execution = {
        id: intent.clientOrderId ?? `sim-order-${++orderCounter}`,
        provider: 'simulated',
        symbol: intent.symbol,
        side: intent.side ?? 'buy',
        quantity,
        filledQuantity: quantity,
        averagePrice: price,
        status: 'filled',
        submittedAt: Date.now(),
        filledAt: Date.now(),
        metadata: { simulated: true },
      };
      orders.push(execution);
      return execution;
    },

    async cancelOrder(orderId) {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      if (order.status === 'filled') {
        throw new Error('Cannot cancel an already filled simulated order');
      }
      order.status = 'cancelled';
      order.cancelledAt = Date.now();
    },

    async listOrders(filter) {
      if (!filter) return [...orders].reverse();
      return orders
        .filter((order) => {
          if (filter.symbol && order.symbol !== filter.symbol) return false;
          if (filter.status && order.status !== filter.status) return false;
          if (filter.after && order.submittedAt < filter.after) return false;
          return true;
        })
        .reverse();
    },

    async listPositions() {
      return Array.from(positions.values()).map((position) => ({ ...position }));
    },
  };
}
