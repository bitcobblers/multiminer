import { ipcMain } from 'electron';
import SharedModule from './modules/SharedModule';
import { logger } from './logger';

export function addApi(module: SharedModule) {
  module.reset();

  Object.keys(module.handlers).forEach((key) => {
    logger.debug('Added handler for: %s', key);
    ipcMain.handle(key, module.handlers[key]);
  });
}
