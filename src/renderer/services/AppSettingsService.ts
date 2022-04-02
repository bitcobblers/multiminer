/* eslint-disable @typescript-eslint/lines-between-class-members */
import { Subject } from 'rxjs';
import { Coin, Wallet, Miner, AppSettings, DefaultSettings, SettingsSchemaType } from '../../models';
import { settingsApi } from '../../shared/SettingsApi';

class WatchersObservable {
  wallets = new Subject<Wallet[]>();
  coins = new Subject<Coin[]>();
  miners = new Subject<Miner[]>();
  settings = new Subject<AppSettings>();
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

settingsApi.watch('wallets');
settingsApi.watch('coins');
settingsApi.watch('miners');
settingsApi.watch('settings');

settingsApi.changed((key, content) => {
  // eslint-disable-next-line no-console
  console.log(`Config change detected: ${key}: ${content}`);

  const typedKey = key as keyof WatchersObservable;

  if (typedKey in watchers$) {
    // eslint-disable-next-line no-console
    console.log(`Triggering change for ${typedKey}`);
    watchers$[typedKey].next(JSON.parse(content));
  }
});
