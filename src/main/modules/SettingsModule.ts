import { IpcMainInvokeEvent } from 'electron';
import { SharedModule } from './SharedModule';
import { globalStore } from '../globals';
import { logger } from '../logger';

type Unsubscribe = () => void;

const watchers = new Map<string, Unsubscribe>();

async function readSetting(_event: IpcMainInvokeEvent, key: string) {
  let result = null;

  if (globalStore.has(key)) {
    result = globalStore.get(key);
  }

  logger.debug('ipc-readSetting invoked with: %s.  Result: %o', key, result);

  return result ?? '';
}

async function writeSetting(_event: IpcMainInvokeEvent, key: string, value: string) {
  logger.debug('Called write-settings with key: %s, value: %o', key, value);
  globalStore.set(key, value);
}

function watchSetting(event: IpcMainInvokeEvent, key: string) {
  logger.debug('Watching for settings changes on: %s', key);

  if (watchers.has(key) === false) {
    const unsubscribe = globalStore.onDidChange(key, (change) => {
      event.sender.send('ipc-settingChanged', key, change);
    });

    watchers.set(key, unsubscribe);
  }
}

export const SettingsModule: SharedModule = {
  name: 'settings',
  handlers: {
    'ipc-readSetting': readSetting,
    'ipc-writeSetting': writeSetting,
    'ipc-watchSetting': watchSetting,
  },
  reset: () => {
    globalStore.set('wallets', '');
    globalStore.set('coins', '');
    globalStore.set('settings', '');
    globalStore.set('miners', '');
  },
};
