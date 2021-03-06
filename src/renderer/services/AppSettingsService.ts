/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Subject } from 'rxjs';
import { Coin, Wallet, Miner, AppSettings, DefaultSettings, SettingsSchemaType, MinerRelease } from '../../models';
import { settingsApi } from '../../shared/SettingsApi';

class WatchersObservable {
  wallets = new Subject<Wallet[]>();
  coins = new Subject<Coin[]>();
  miners = new Subject<Miner[]>();
  settings = new Subject<AppSettings>();
  minerReleases = new Subject<MinerRelease[]>();
}

export const watchers$ = new WatchersObservable();

async function get<T>(key: keyof SettingsSchemaType, defaultValue: T) {
  const content = await settingsApi.read(key);

  if (content === '""') {
    return defaultValue;
  }

  return JSON.parse(content) as T;
}

async function set<T>(key: keyof SettingsSchemaType, setting: T) {
  const content = JSON.stringify(setting);

  await settingsApi.write(key, content);
}

export const getWallets = () => get<Wallet[]>('wallets', DefaultSettings.wallets);
export const setWallets = (wallets: Wallet[]) => set('wallets', wallets);

export const getCoins = () => get<Coin[]>('coins', DefaultSettings.coins);
export const setCoins = (coins: Coin[]) => set('coins', coins);

export const getMiners = () => get<Miner[]>('miners', DefaultSettings.miners);
export const setMiners = (miners: Miner[]) => set('miners', miners);

export const getAppSettings = () => get<AppSettings>('settings', DefaultSettings.settings);
export const setAppSettings = (settings: AppSettings) => set('settings', settings);

export const getMinerReleases = () => get<MinerRelease[]>('minerReleases', DefaultSettings.minerReleases);
export const setMinerReleases = (releases: MinerRelease[]) => set('minerReleases', releases);

settingsApi.watch('wallets');
settingsApi.watch('coins');
settingsApi.watch('miners');
settingsApi.watch('settings');
settingsApi.watch('minerReleases');

settingsApi.changed((key, content) => {
  console.log(`Config change detected: ${key}: ${content}`);

  const typedKey = key as keyof WatchersObservable;

  if (typedKey in watchers$) {
    watchers$[typedKey].next(JSON.parse(content));
  }
});
