export function createDrivewealthTradingAdapter() {
  const notReady = () => {
    throw new Error('DriveWealth trading adapter not configured yet.');
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
