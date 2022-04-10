/* eslint-disable max-classes-per-file */
import EventEmitter from 'events';
import { app, BrowserWindow, Tray, Menu } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { getAssetPath, getResolveHtmlPath } from './resourceHelper';
import { logger } from './logger';

export default class AppUpdater {
  constructor() {
    autoUpdater.logger = logger;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const AppName = 'Multi-Miner';
const defaultSettings = {
  title: AppName,
  width: 1260,
  height: 1024,
  minWidth: 1260,
  minHeight: 900,
  show: false,
  icon: getAssetPath('icon.png'),
};

type Setting = string | number | boolean;

class MainWindow {
  settings: { [key: string]: Setting };

  appIcon?: Tray;

  contextMenu?: Menu;

  window!: BrowserWindow;

  onEvent: EventEmitter = new EventEmitter();

  constructor(settings: { [key: string]: Setting }) {
    this.settings = { ...settings, ...defaultSettings };

    app.on('ready', () => {
      this.window = this.createWindow();

      this.appIcon = new Tray(this.settings.icon as string);
      this.contextMenu = Menu.buildFromTemplate([
        { label: 'Show', click: () => this.window.show() },
        { label: 'Quit', click: () => this.window.close() },
      ]);

      this.appIcon.setContextMenu(this.contextMenu);
      this.appIcon.on('click', () => this.window.show());

      if (process.env.NODE_ENV !== 'development') {
        // TODO: Uncomment this line for the official release.  This is needed for debugging pre-release builds.
        // this.window.removeMenu();
      }

      this.onEvent.emit('window-created');
    });

    // TODO: Uncomment this to enable auto-update once the app is GA.
    // eslint-disable-next-line no-new
    // new AppUpdater();

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

    window.loadURL(getResolveHtmlPath()('index.html'));
    window.once('ready-to-show', () => {
      if (process.env.START_MINIMIZED) {
        window.minimize();
      } else {
        window.show();
      }
    });

    window.on('minimize', (event: Event) => {
      event.preventDefault();
      window.hide();
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
