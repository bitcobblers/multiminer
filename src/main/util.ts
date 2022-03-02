import { app } from 'electron';
import path from 'path';
import fetch from 'node-fetch';
import { HttpProxyAgent } from 'http-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { globalStore } from './globals';
import { AppSettings } from '../models/Configuration';
import { logger } from './logger';

function getResourcesPath() {
  return app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../../assets');
}

export function getResolveHtmlPath() {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    return (htmlFileName: string) => {
      const url = new URL(`http://localhost:${port}`);
      url.pathname = htmlFileName;
      return url.href;
    };
  }

  return (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const getAssetPath = (...paths: string[]): string => {
  return path.join(getResourcesPath(), ...paths);
};

// Config tracking.
let proxy = globalStore.get('settings.settings.proxy', '') as string;

globalStore.onDidChange('settings', (settings) => {
  const rawSettings = (settings as string) ?? '';

  if (rawSettings === '') {
    return;
  }

  const appSettings = JSON.parse(settings as string) as AppSettings;

  proxy = appSettings.settings.proxy as string;
});

export function getUrl(url: string) {
  const pickCall = () => {
    if (proxy.match(/^socks:/i)) {
      return fetch(url, { agent: new SocksProxyAgent(proxy) });
    }

    if (proxy.match(/^http:/i)) {
      return fetch(url, { agent: new HttpProxyAgent(proxy) });
    }

    return fetch(url);
  };

  logger.debug(`Invoking rest call to ${url}`);

  return pickCall()
    .then((r) => r.text())
    .then((r) => {
      logger.debug(`Log the following response: ${r}`);
      return r;
    })
    .catch((error) => {
      logger.error(`An error occurred while calling ${url} - ${error}`);
      return '';
    });
}
