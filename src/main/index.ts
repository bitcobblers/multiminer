/* eslint global-require: off */

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
import { addApi, disposeApi } from './ipc';
import { isDevelopment } from './globals';
import { AboutModule, DialogModule, DownloadModule, LoggingModule, MinerModule, SettingsModule, TickerModule, UnmineableModule } from './modules';

if (isDevelopment) {
  require('electron-debug')();
}

const modules = [AboutModule, DialogModule, DownloadModule, LoggingModule, MinerModule, SettingsModule, TickerModule, UnmineableModule];

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

mainWindow.onEvent.on('window-created', async () => {
  await installExtensions();

  modules.forEach(addApi);

  if (process.env.NODE_ENV === 'production') {
    const sourceMapSupport = require('source-map-support');
    sourceMapSupport.install();
  }

  mainWindow.window.on('close', () => {
    modules.forEach(disposeApi);
  });
});
