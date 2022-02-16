export interface TickerApi {
  getTicker: (coins: string[]) => Promise<string>;
}

export const tickerApi = window.ticker ?? {
  getTicker: () => Promise.resolve(''),
};
