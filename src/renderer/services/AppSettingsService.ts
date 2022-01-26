import { Coin, Wallet, PoolUrls, Miner, AppSettings } from '../../models/Configuration';
import SettingsApi from '../../shared/SettingsApi';

export const defaults = {
  wallets: [
    { id: 'e4bfb138-4365-404f-89d3-6549b22d4b3b', name: 'mywallet1', blockchain: 'ETH', address: '0xe141167eb550b999cb59f9ac202d2dfdd240a4a0', memo: '' },
    { id: '14306209-a673-44ec-a732-9e14f14b029c', name: 'mywallet2', blockchain: 'XLM', address: 'GD2BLIQF6SF3RJE4QOG64NOPRSEH6ASPEWLH7WJNSVQCP3ATOGQDGUOX', memo: '3128811' },
    { id: '8980b1a7-129c-4b42-ac33-b5eabfbd7f92', name: 'mywallet3', blockchain: 'TRX', address: 'TEP6m4AAWBPqLndTJAM1PH3RzkDPKV9D71', memo: '' },
  ] as Wallet[],

  coins: [
    { symbol: 'ETH', wallet: 'mywallet1', algorithm: 'ethash', enabled: true, duration: 4, referral: 'foo' },
    { symbol: 'SHIB', wallet: 'mywallet1', algorithm: 'ethash', enabled: false, duration: 4, referral: 'foo' },
    { symbol: 'TRX', wallet: 'mywallet3', algorithm: 'ethash', enabled: true, duration: 4, referral: 'bar' },
  ] as Coin[],

  miners: [{ id: '12345', info: 'gminer', name: 'default miner', enabled: true, installationPath: 'C:\\ethereum\\gminer', algorithm: 'ethash', parameters: '' }] as Miner[],

  pools: {
    ethash: 'ethash.unmineable.com:3333',
    etchash: 'etchash.unmineable.com:3333',
    kawpaw: 'kp.unmineable.com:3333',
    randomx: 'rx.unmineable.com:3333',
  } as PoolUrls,

  settings: {
    settings: {
      workerName: 'default',
      updateInterval: 30,
      cooldownInterval: 15,
    },
    pools: {
      ethash: 'ethash.unmineable.com:3333',
      etchash: 'etchash.unmineable.com:3333',
      kawpaw: 'kp.unmineable.com:3333',
      randomx: 'rx.unmineable.com:3333',
    },
  } as AppSettings,
};

export class AppSettingsService {
  private readonly api: SettingsApi;

  constructor(api: SettingsApi) {
    this.api = api;
  }

  // eslint-disable-next-line class-methods-use-this
  async getWallets(): Promise<Wallet[]> {
    return this.get<Wallet[]>('wallets', defaults.wallets);
  }

  async setWallets(wallets: Wallet[]): Promise<void> {
    await this.set<Wallet[]>('wallets', wallets);
  }

  async getCoins(): Promise<Coin[]> {
    return this.get<Coin[]>('coins', defaults.coins);
  }

  async setCoins(coins: Coin[]): Promise<void> {
    await this.set<Coin[]>('coins', coins);
  }

  async getMiners(): Promise<Miner[]> {
    return this.get<Miner[]>('miners', defaults.miners);
  }

  async setMiners(miners: Miner[]): Promise<void> {
    await this.set<Miner[]>('miners', miners);
  }

  async getAppSettings(): Promise<AppSettings> {
    return this.get<AppSettings>('settings', defaults.settings);
  }

  async setAppSettings(appSettings: AppSettings): Promise<void> {
    await this.set<AppSettings>('settings', appSettings);
  }

  async get<T>(key: string, defaultValue: T): Promise<T> {
    const content = await this.api.read(key);

    if (content === '') {
      // eslint-disable-next-line no-console
      console.log(`Returning default value: ${JSON.stringify(defaultValue)}`);
      return defaultValue;
    }

    // eslint-disable-next-line no-console
    console.log(`Got content: ${content}`);

    return JSON.parse(content) as T;
  }

  async set<T>(key: string, setting: T): Promise<void> {
    const content = JSON.stringify(setting);

    // eslint-disable-next-line no-console
    console.log(`Calling set with content: ${content}`);
    await this.api.write(key, content);
  }
}
