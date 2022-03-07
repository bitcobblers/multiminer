export interface UnmineableApi {
  getCoin: (coins: string, address: string) => Promise<string>;
  getWorkers: (uuid: string) => Promise<string>;
  openBrowser: (coin: string, address: string) => Promise<void>;
}

export const unmineableApi = window.unmineable ?? {
  getCoin: () => Promise.resolve(''),
  getWorkers: () => Promise.resolve(''),
  openBrowser: () => Promise.resolve(),
};
