/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { mainWindow } from './main';
import { addApi } from './ipc';
import SettingsModule from './modules/SettingsModule';
import MinerModule from './modules/MinerModule';
import DialogModule from './modules/DialogModule';
import UnmineableModule from './modules/UnmineableModule';
import TickerModule from './modules/TickerModule';

const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

// export const main = new MainWindow({});

mainWindow.onEvent.on('window-created', async () => {
  await installExtensions();

  addApi(new SettingsModule());
  addApi(new MinerModule());
  addApi(new DialogModule());
  addApi(new UnmineableModule());
  addApi(new TickerModule());

  if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
  }
});
