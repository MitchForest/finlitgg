export function createPolygonMarketDataAdapter() {
  const notReady = () => {
    throw new Error(
      "Polygon market data adapter not configured yet. Provide an implementation before enabling this provider."
    );
  };

  return {
    async subscribeQuotes() {
      notReady();
    },
    async fetchSnapshot() {
      notReady();
    },
  };
}
