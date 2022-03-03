import { ipcMain } from 'electron';
import { SharedModule } from './modules/SharedModule';
import { logger } from './logger';
import { isDevelopment } from './globals';

export function addApi(module: SharedModule) {
  if (isDevelopment) {
    if (module.reset !== undefined) {
      module.reset();
    }
  }

  Object.keys(module.handlers).forEach((key) => {
    logger.debug('Added handler for: %s', key);
    ipcMain.handle(key, module.handlers[key]);
  });
}
