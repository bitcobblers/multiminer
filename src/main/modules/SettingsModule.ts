import { IpcMainInvokeEvent } from 'electron';
import * as fs from 'fs';
import { SharedModule } from './SharedModule';
import { globalStore } from '../globals';
import { logger } from '../logger';
import { SettingsSchemaType } from '../../models/DefaultSettings';

type Unsubscribe = () => void;

const watchers = new Map<string, Unsubscribe>();

function readSetting(_event: IpcMainInvokeEvent, key: keyof SettingsSchemaType) {
  let result = null;

  if (globalStore.has(key)) {
    result = globalStore.get(key);
  }

  logger.debug('ipc-readSetting invoked with: %s.  Result: %o', key, result);

  return JSON.stringify(result ?? {});
}

function writeSetting(_event: IpcMainInvokeEvent, key: keyof SettingsSchemaType, value: string) {
  const parsedValue = JSON.parse(value);

  logger.debug('Called write-settings with key: %s, value: %o', key, parsedValue);
  globalStore.set(key, parsedValue);
}

function watchSetting(event: IpcMainInvokeEvent, key: keyof SettingsSchemaType) {
  logger.debug('Watching for settings changes on: %s', key);

  if (watchers.has(key) === false) {
    const unsubscribe = globalStore.onDidChange(key, (change) => {
      event.sender.send('ipc-settingChanged', key, JSON.stringify(change));
    });

    watchers.set(key, unsubscribe);
  }
}

export function importSettings(_event: IpcMainInvokeEvent, settingsPath: string) {
  logger.info('Importing settings from %s', settingsPath);

  try {
    const content = fs.readFileSync(settingsPath);
    const allSettings: SettingsSchemaType = JSON.parse(content.toString());

    globalStore.set('wallets', allSettings.wallets);
    globalStore.set('coins', allSettings.coins);
    globalStore.set('settings', allSettings.settings);
    globalStore.set('miners', allSettings.miners);
  } catch (error) {
    return error;
  }

  return null;
}

export function exportSettings(_current: IpcMainInvokeEvent, settingsPath: string) {
  logger.info('Exporting settings from %s', settingsPath);

  const allSettings: SettingsSchemaType = {
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
};
