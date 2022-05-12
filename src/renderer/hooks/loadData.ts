import { useEffect } from 'react';
import { AppSettings, Coin, Miner, MinerRelease, Wallet } from '../../models';
import * as settings from '../services/AppSettingsService';

type SettingsApi = {
  getWallets: () => Promise<Wallet[]>;
  getCoins: () => Promise<Coin[]>;
  getMiners: () => Promise<Miner[]>;
  getAppSettings: () => Promise<AppSettings>;
  getMinerReleases: () => Promise<MinerRelease[]>;
};

export function useLoadData(load: (settings: SettingsApi) => Promise<void>) {
  useEffect(() => {
    const settingsApi = {
      getWallets: settings.getWallets,
      getCoins: settings.getCoins,
      getMiners: settings.getMiners,
      getAppSettings: settings.getAppSettings,
      getMinerReleases: settings.getMinerReleases,
    };

    load(settingsApi);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
