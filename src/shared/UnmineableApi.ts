export interface UnmineableApi {
  getCoin: (coins: string, address: string) => Promise<string>;
}

export const unmineableApi = window.unmineable ?? {
  getCoin: () => Promise.resolve(''),
};
