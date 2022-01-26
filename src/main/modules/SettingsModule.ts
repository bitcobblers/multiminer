import { IpcMainInvokeEvent } from 'electron';
import Store from 'electron-store';
import SharedModule from './SharedModule';

const store = new Store();

const readSettings = async (_event: IpcMainInvokeEvent, key: string): Promise<string> => {
  let result = '';

  if (store.has(key)) {
    result = store.get(key) as string;
  }

  // eslint-disable-next-line no-console
  console.log(`ipc-readSetting invoked with: ${key}.  Result: ${result}`);

  return result;
};

const writeSettings = async (_event: IpcMainInvokeEvent, key: string, value: string): Promise<string> => {
  // eslint-disable-next-line no-console
  console.log(`Called write-settings with key: ${key}, value: ${value}`);
  store.set(key, value);
  return '';
};

export default class SettingsModule implements SharedModule {
  name = 'settings';

  handlers = {
    'ipc-readSetting': readSettings,
    'ipc-writeSetting': writeSettings,
  };

  reset = () => {
    store.set('wallets', '');
    store.set('coins', '');
    store.set('settings', '');
    store.set('miners', '');
  };
}
