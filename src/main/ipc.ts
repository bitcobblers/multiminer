import { ipcMain } from 'electron';
import { SharedModule } from './modules/SharedModule';
import { logger } from './logger';

export function addApi(module: SharedModule) {
  Object.keys(module.handlers).forEach((key) => {
    logger.debug('Added handler for: %s', key);
    ipcMain.handle(key, module.handlers[key]);
  });
}

export function disposeApi(module: SharedModule) {
  if (module.dispose !== undefined) {
    logger.debug('Disposing api: %s', module.name);
    module.dispose();
  }
}
