/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Subject } from 'rxjs';
import { Coin, Wallet, Miner, AppSettings } from '../../models';
import { settingsApi } from '../../shared/SettingsApi';

type SettingsKey = 'wallets' | 'coins' | 'miners' | 'settings';

class WatchersObservable {
  wallets = new Subject<Wallet[]>();
  coins = new Subject<Coin[]>();
  miners = new Subject<Miner[]>();
  appSettings = new Subject<AppSettings>();
}

export const defaults = {
  wallets: [
    { id: 'e4bfb138-4365-404f-89d3-6549b22d4b3b', name: 'mywallet1', network: 'ETH', address: '0xe141167eb550b999cb59f9ac202d2dfdd240a4a0', memo: '' },
    { id: '14306209-a673-44ec-a732-9e14f14b029c', name: 'mywallet2', network: 'XLM', address: 'GD2BLIQF6SF3RJE4QOG64NOPRSEH6ASPEWLH7WJNSVQCP3ATOGQDGUOX', memo: '3128811' },
    { id: '8980b1a7-129c-4b42-ac33-b5eabfbd7f92', name: 'mywallet3', network: 'TRX', address: 'TEP6m4AAWBPqLndTJAM1PH3RzkDPKV9D71', memo: '' },
  ] as Wallet[],

  coins: [
    { symbol: 'ETH', wallet: 'mywallet1', enabled: true, duration: 5 },
    { symbol: 'SHIB', wallet: 'mywallet1', enabled: false, duration: 5 },
    { symbol: 'TRX', wallet: 'mywallet3', enabled: true, duration: 5 },
  ] as Coin[],

  miners: [
    { id: '4dbc2b17-348f-4529-859a-7bcdfca20e1e', kind: 'lolminer', name: 'default', enabled: true, installationPath: 'C:\\ethereum\\lolminer\\1.42', algorithm: 'ethash', parameters: '' },
  ] as Miner[],

  settings: {
    settings: {
      workerName: 'default',
      updateInterval: 30,
      cooldownInterval: 15,
      proxy: '',
    },
    pools: {
      ethash: 'ethash.unmineable.com:3333',
      etchash: 'etchash.unmineable.com:3333',
      kawpow: 'kp.unmineable.com:3333',
      randomx: 'rx.unmineable.com:3333',
    },
  } as AppSettings,
};

export const watchers$ = new WatchersObservable();

async function get<T>(key: SettingsKey, defaultValue: T) {
  const content = await settingsApi.read(key);

  if (content === '') {
    return defaultValue;
  }

  return JSON.parse(content) as T;
}

async function set<T>(key: SettingsKey, setting: T) {
  const content = JSON.stringify(setting);

  await settingsApi.write(key, content);
}

export const getWallets = () => get<Wallet[]>('wallets', defaults.wallets);
export const setWallets = (wallets: Wallet[]) => set('wallets', wallets);

export const getCoins = () => get<Coin[]>('coins', defaults.coins);
export const setCoins = (coins: Coin[]) => set('coins', coins);

export const getMiners = () => get<Miner[]>('miners', defaults.miners);
export const setMiners = (miners: Miner[]) => set('miners', miners);

export const getAppSettings = () => get<AppSettings>('settings', defaults.settings);
export const setAppSettings = (settings: AppSettings) => set('settings', settings);

settingsApi.watch('wallets');
settingsApi.watch('coins');
settingsApi.watch('miners');
settingsApi.watch('settings');

settingsApi.changed((key, content) => {
  // eslint-disable-next-line no-console
  console.log(`Config change detected: ${key}: ${content}`);

  const typedKey = key as keyof WatchersObservable;

  if (typedKey in watchers$) {
    watchers$[typedKey].next(JSON.parse(content));
  }
});
