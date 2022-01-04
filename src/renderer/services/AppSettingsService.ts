import { Wallet } from '../../models/Wallet';
import { SettingsApi } from '../api';
import { AppSettings } from '../../models/AppSettings';

export class AppSettingsService {
  private readonly api: SettingsApi;

  static DefaultSettings: AppSettings = {
    worker: 'default',
    updateInterval: 15,
    cooldownInterval: 30,
    urls: {
      ethash: {
        url: 'ethash.unmineable.com:3333',
      },
      etchash: {
        url: 'etchash.unmineable.com:3333',
      },
      kawpaw: {
        url: 'kp.unmineable.com:3333',
      },
      randomx: {
        url: 'rx.unmineable.com:3333',
      },
    },
    coins: [],
    miners: [],
    wallets: [],
  };

  constructor(api: SettingsApi) {
    this.api = api;
  }

  // eslint-disable-next-line class-methods-use-this
  async getWallets(): Promise<Wallet[]> {
    const defaultWallets: Wallet[] = [
      { name: 'mywallet1', network: 'ETH', address: '0xe141167eb550b999cb59f9ac202d2dfdd240a4a0', memo: '' },
      { name: 'mywallet2', network: 'XLM', address: 'GD2BLIQF6SF3RJE4QOG64NOPRSEH6ASPEWLH7WJNSVQCP3ATOGQDGUOX', memo: '3128811' },
      { name: 'mywallet3', network: 'TRX', address: 'TEP6m4AAWBPqLndTJAM1PH3RzkDPKV9D71', memo: '' },
    ];

    return this.get<Wallet[]>('wallets', defaultWallets);
  }

  async setWallets(wallets: Wallet[]): Promise<void> {
    await this.set<Wallet[]>('wallets', wallets);
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
