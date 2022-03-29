import { IpcMainInvokeEvent } from 'electron';
import * as fs from 'fs';
import { SharedModule } from './SharedModule';
import { globalStore } from '../globals';
import { logger } from '../logger';
import { Wallet, Coin, Miner, AppSettings } from '../../models';

type Unsubscribe = () => void;

const watchers = new Map<string, Unsubscribe>();

const defaults = {
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

  miners: [{ id: '4dbc2b17-348f-4529-859a-7bcdfca20e1e', kind: 'lolminer', name: 'default', enabled: true, version: '1.46a', algorithm: 'ethash', parameters: '' }] as Miner[],

  settings: {
    settings: {
      workerName: 'default',
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

type SettingsCollection = {
  wallets: Wallet[];
  coins: Coin[];
  settings: AppSettings;
  miners: Miner[];
};

function readSetting(_event: IpcMainInvokeEvent, key: string) {
  let result = null;

  if (globalStore.has(key)) {
    result = globalStore.get(key);
  }

  logger.debug('ipc-readSetting invoked with: %s.  Result: %o', key, result);

  return JSON.stringify(result ?? {});
}

function writeSetting(_event: IpcMainInvokeEvent, key: string, value: string) {
  const parsedValue = JSON.parse(value);

  logger.debug('Called write-settings with key: %s, value: %o', key, parsedValue);
  globalStore.set(key, parsedValue);
}

function watchSetting(event: IpcMainInvokeEvent, key: string) {
  logger.debug('Watching for settings changes on: %s', key);

  if (watchers.has(key) === false) {
    const unsubscribe = globalStore.onDidChange(key, (change) => {
      event.sender.send('ipc-settingChanged', key, JSON.stringify(change));
    });

    watchers.set(key, unsubscribe);
  }
}

async function importSettings(_event: IpcMainInvokeEvent, settingsPath: string) {
  logger.debug('Importing settings from %s', settingsPath);

  const content = fs.readFileSync(settingsPath);
  const allSettings = JSON.parse(content.toString());

  globalStore.set('wallets', allSettings.wallets);
  globalStore.set('coins', allSettings.coins);
  globalStore.set('settings', allSettings.settings);
  globalStore.set('miners', allSettings.miners);
}

async function exportSettings(_current: IpcMainInvokeEvent, settingsPath: string) {
  logger.debug('Exporting settings from %s', settingsPath);

  const allSettings = {
    wallets: globalStore.get('wallets'),
    coins: globalStore.get('coins'),
    settings: globalStore.get('settings'),
    miners: globalStore.get('miners'),
  };

  fs.writeFileSync(settingsPath, JSON.stringify(allSettings, null, 2));
}

export const SettingsModule: SharedModule = {
  name: 'settings',
  handlers: {
    'ipc-readSetting': readSetting,
    'ipc-writeSetting': writeSetting,
    'ipc-watchSetting': watchSetting,
    'ipc-importSettings': importSettings,
    'ipc-exportSettings': exportSettings,
  },
  reset: () => {
    globalStore.set('wallets', defaults.wallets);
    globalStore.set('coins', defaults.coins);
    globalStore.set('settings', defaults.settings);
    globalStore.set('miners', defaults.miners);
  },
};
