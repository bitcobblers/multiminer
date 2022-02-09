import { Coin, Wallet, PoolUrls, Miner, AppSettings } from '../../models/Configuration';
import { readSetting, writeSetting } from '../../shared/SettingsApi';

type SettingsKey = 'wallets' | 'coins' | 'miners' | 'settings';

export const defaults = {
  wallets: [
    { id: 'e4bfb138-4365-404f-89d3-6549b22d4b3b', name: 'mywallet1', blockchain: 'ETH', address: '0xe141167eb550b999cb59f9ac202d2dfdd240a4a0', memo: '' },
    { id: '14306209-a673-44ec-a732-9e14f14b029c', name: 'mywallet2', blockchain: 'XLM', address: 'GD2BLIQF6SF3RJE4QOG64NOPRSEH6ASPEWLH7WJNSVQCP3ATOGQDGUOX', memo: '3128811' },
    { id: '8980b1a7-129c-4b42-ac33-b5eabfbd7f92', name: 'mywallet3', blockchain: 'TRX', address: 'TEP6m4AAWBPqLndTJAM1PH3RzkDPKV9D71', memo: '' },
  ] as Wallet[],

  coins: [
    { symbol: 'ETH', wallet: 'mywallet1', enabled: true, duration: 4, referral: 'foo' },
    { symbol: 'SHIB', wallet: 'mywallet1', enabled: false, duration: 4, referral: 'foo' },
    { symbol: 'TRX', wallet: 'mywallet3', enabled: true, duration: 4, referral: 'bar' },
  ] as Coin[],

  miners: [{ id: '12345', kind: 'lolminer', name: 'default miner', enabled: true, installationPath: 'C:\\ethereum\\gminer', algorithm: 'ethash', parameters: '' }] as Miner[],

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

async function get<T>(key: SettingsKey, defaultValue: T) {
  const content = await readSetting(key);

  if (content === '') {
    return defaultValue;
  }

  return JSON.parse(content) as T;
}

async function set<T>(key: SettingsKey, setting: T) {
  const content = JSON.stringify(setting);

  await writeSetting(key, content);
}

export const getWallets = () => get<Wallet[]>('wallets', defaults.wallets);
export const setWallets = (wallets: Wallet[]) => set('wallets', wallets);

export const getCoins = () => get<Coin[]>('coins', defaults.coins);
export const setCoins = (coins: Coin[]) => set('coins', coins);

export const getMiners = () => get<Miner[]>('miners', defaults.miners);
export const setMiners = (miners: Miner[]) => set('miners', miners);

export const getAppSettings = () => get<AppSettings>('settings', defaults.settings);
export const setAppSettings = (settings: AppSettings) => set('settings', settings);
