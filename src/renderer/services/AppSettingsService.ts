import { Coin, Wallet } from '../../models/Configuration';
import { SettingsApi } from '../api';

export class AppSettingsService {
  private readonly api: SettingsApi;

  // static DefaultSettings: AppSettings = {
  //   worker: 'default',
  //   updateInterval: 15,
  //   cooldownInterval: 30,
  //   urls: {
  //     ethash: {
  //       url: 'ethash.unmineable.com:3333',
  //     },
  //     etchash: {
  //       url: 'etchash.unmineable.com:3333',
  //     },
  //     kawpaw: {
  //       url: 'kp.unmineable.com:3333',
  //     },
  //     randomx: {
  //       url: 'rx.unmineable.com:3333',
  //     },
  //   },
  //   coins: [],
  //   miners: [],
  //   wallets: [],
  // };

  constructor(api: SettingsApi) {
    this.api = api;
  }

  // eslint-disable-next-line class-methods-use-this
  async getWallets(): Promise<Wallet[]> {
    const defaultWallets: Wallet[] = [
      { id: 'e4bfb138-4365-404f-89d3-6549b22d4b3b', name: 'mywallet1', blockchain: 'ETH', address: '0xe141167eb550b999cb59f9ac202d2dfdd240a4a0', memo: '' },
      { id: '14306209-a673-44ec-a732-9e14f14b029c', name: 'mywallet2', blockchain: 'XLM', address: 'GD2BLIQF6SF3RJE4QOG64NOPRSEH6ASPEWLH7WJNSVQCP3ATOGQDGUOX', memo: '3128811' },
      { id: '8980b1a7-129c-4b42-ac33-b5eabfbd7f92', name: 'mywallet3', blockchain: 'TRX', address: 'TEP6m4AAWBPqLndTJAM1PH3RzkDPKV9D71', memo: '' },
    ];

    return this.get<Wallet[]>('wallets', defaultWallets);
  }

  async setWallets(wallets: Wallet[]): Promise<void> {
    await this.set<Wallet[]>('wallets', wallets);
  }

  async getCoins(): Promise<Coin[]> {
    const defaultCoins: Coin[] = [
      { symbol: 'ETH', wallet: 'mywallet1', algorithm: 'ethash', enabled: true, duration: 4, referral: 'foo' },
      { symbol: 'SHIB', wallet: 'mywallet1', algorithm: 'ethash', enabled: true, duration: 4, referral: 'foo' },
      { symbol: 'TRX', wallet: 'mywallet3', algorithm: 'ethash', enabled: true, duration: 4, referral: 'bar' },
    ];

    return this.get<Coin[]>('coins', defaultCoins);
  }

  async setCoins(coins: Coin[]): Promise<void> {
    await this.set<Coin[]>('coins', coins);
  }

  async get<T>(key: string, defaultValue: T): Promise<T> {
    const content = await this.api.read(key);

    if (content === '') {
      return defaultValue;
    }

    return JSON.parse(content) as T;
  }

  async set<T>(key: string, setting: T): Promise<void> {
    const content = JSON.stringify(setting);

    // eslint-disable-next-line no-console
    console.log(`Calling set with content: ${content}`);
    await this.api.write(key, content);
  }
}
