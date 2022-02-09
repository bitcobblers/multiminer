import EventEmitter from 'events';
import { app, BrowserWindow } from 'electron';
import path from 'path';
import { getAssetPath, resolveHtmlPath } from './util';

const AppName = 'Unmineable Multi-Miner';
const defaultSettings = {
  title: AppName,
  width: 1200,
  height: 800,
  minWidth: 1000,
  minHeight: 600,
  show: false,
  icon: getAssetPath('icon.png'),
};

type Setting = string | number | boolean;

class MainWindow {
  settings: { [key: string]: Setting };

  window!: BrowserWindow;

  onEvent: EventEmitter = new EventEmitter();

  constructor(settings: { [key: string]: Setting } | null = null) {
    this.settings = settings ? { ...settings } : { ...defaultSettings };

    app.on('ready', () => {
      this.window = this.createWindow();
      this.onEvent.emit('window-created');
    });

    app.on('window-all-closed', this.onWindowAllClosed);
    app.on('activate', this.onActivate);
  }

  createWindow() {
    app.name = AppName;

    const settings = { ...this.settings };
    const window = new BrowserWindow({
      ...settings,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js'),
      },
    });

    window.loadURL(resolveHtmlPath('index.html'));
    window.once('ready-to-show', () => {
      if (process.env.START_MINIMIZED) {
        window.minimize();
      } else {
        window.show();
      }
    });

    return window;
  }

  // eslint-disable-next-line class-methods-use-this
  onWindowAllClosed() {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  }

  onActivate() {
    if (this.window === undefined) {
      this.window = this.createWindow();
    }
  }
}

export const mainWindow = new MainWindow({});
