import { IpcMainInvokeEvent, shell, app } from 'electron';
import { SharedModule } from './SharedModule';
import { logger } from '../logger';

function getName() {
  return app.getName();
}

function getVersion() {
  return app.getVersion();
}

function getElectronVersion() {
  return process.versions.electron;
}

async function openBrowser(_event: IpcMainInvokeEvent, url: string) {
  logger.debug('Navigating to external site: %s', url);
  await shell.openExternal(url);
}

export const AboutModule: SharedModule = {
  name: 'unmineable',
  handlers: {
    'ipc-getAppName': getName,
    'ipc-getAppVersion': getVersion,
    'ipc-getElectronVersion': getElectronVersion,
    'ipc-openExternalSite': openBrowser,
  },
};
