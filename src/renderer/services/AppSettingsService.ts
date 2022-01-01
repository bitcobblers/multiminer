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
      { id: 0, name: 'mywallet1', network: 'ETH', address: '12345', memo: '' },
      { id: 1, name: 'mywallet2', network: 'BSC', address: '54321', memo: '' },
      { id: 2, name: 'mywallet3', network: 'KCC', address: '54321', memo: '' },
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

    console.log(`Calling set with content: ${content}`);
    await this.api.write(key, content);
  }
}
