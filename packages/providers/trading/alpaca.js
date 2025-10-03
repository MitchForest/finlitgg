export function createAlpacaTradingAdapter() {
  const notReady = () => {
    throw new Error('Alpaca trading adapter not configured yet.');
  };

  return {
    async placeOrder() {
      notReady();
    },
    async cancelOrder() {
      notReady();
    },
    async listOrders() {
      notReady();
    },
    async listPositions() {
      notReady();
    },
  };
}
