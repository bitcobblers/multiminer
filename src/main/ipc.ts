import { ipcMain } from 'electron';
import SharedModule from './modules/SharedModule';

export function addApi(module: SharedModule) {
  module.reset();

  Object.keys(module.handlers).forEach((key) => {
    // eslint-disable-next-line no-console
    console.log(`Added handler for: ${key}`);
    ipcMain.handle(key, module.handlers[key]);
  });
}
