import { IpcMainInvokeEvent } from 'electron';
import { SharedModule } from './SharedModule';
import { globalStore } from '../globals';
import { logger } from '../logger';

const readSettings = async (_event: IpcMainInvokeEvent, key: string) => {
  let result = null;

  if (globalStore.has(key)) {
    result = globalStore.get(key);
  }

  logger.debug('ipc-readSetting invoked with: %s.  Result: %o', key, result);

  return result ?? '';
};

const writeSettings = async (_event: IpcMainInvokeEvent, key: string, value: string) => {
  logger.debug('Called write-settings with key: %s, value: %o', key, value);
  globalStore.set(key, value);
};

export const SettingsModule: SharedModule = {
  name: 'settings',
  handlers: {
    'ipc-readSetting': readSettings,
    'ipc-writeSetting': writeSettings,
  },
  reset: () => {
    globalStore.set('wallets', '');
    globalStore.set('coins', '');
    globalStore.set('settings', '');
    globalStore.set('miners', '');
  },
};
