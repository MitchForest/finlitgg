export function createBassBankingAdapter() {
  const notReady = () => {
    throw new Error('Banking-as-a-service adapter not configured yet.');
  };

  return {
    async createAccount() {
      notReady();
    },
    async transfer() {
      notReady();
    },
    async fetchBalance() {
      notReady();
    },
  };
}
