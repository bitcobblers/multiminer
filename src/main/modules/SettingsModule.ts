import { IpcMainInvokeEvent } from 'electron';
import SharedModule from './SharedModule';
import { globalStore } from '../globals';

const readSettings = async (_event: IpcMainInvokeEvent, key: string): Promise<string> => {
  let result = '';

  if (globalStore.has(key)) {
    result = globalStore.get(key) as string;
  }

  // eslint-disable-next-line no-console
  console.log(`ipc-readSetting invoked with: ${key}.  Result: ${result}`);

  return result;
};

const writeSettings = async (_event: IpcMainInvokeEvent, key: string, value: string): Promise<string> => {
  // eslint-disable-next-line no-console
  console.log(`Called write-settings with key: ${key}, value: ${value}`);
  globalStore.set(key, value);
  return '';
};

export default class SettingsModule implements SharedModule {
  name = 'settings';

  handlers = {
    'ipc-readSetting': readSettings,
    'ipc-writeSetting': writeSettings,
  };

  reset = () => {
    globalStore.set('wallets', '');
    globalStore.set('coins', '');
    globalStore.set('settings', '');
    globalStore.set('miners', '');
  };
}
