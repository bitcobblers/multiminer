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

  async getSettings(): Promise<AppSettings> {
    const content = await this.api.read();

    if (content !== '') {
      return JSON.parse(content) as AppSettings;
    }

    return AppSettingsService.DefaultSettings;
  }

  async saveSettings(settings: AppSettings): Promise<void> {
    if (settings) {
      await this.api.write(JSON.stringify(settings));
    }
  }
}
