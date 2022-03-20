import fetch from 'node-fetch';
import { HttpProxyAgent } from 'http-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { globalStore } from './globals';
import { AppSettings } from '../models';
import { logger } from './logger';

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

function callFetch(url: string) {
  if (proxy.match(/^socks:/i)) {
    return fetch(url, { agent: new SocksProxyAgent(proxy) });
  }

  if (proxy.match(/^http:/i)) {
    return fetch(url, { agent: new HttpProxyAgent(proxy) });
  }

  return fetch(url);
}

export function getDownloadUrl(url: string) {
  return callFetch(url);
}

export function getRestUrl(url: string) {
  logger.debug(`Invoking rest call to ${url}`);

  return callFetch(url)
    .then((r) => {
      if (r.ok === false) {
        logger.error('An error occurred while calling %s - %d: %s', url, r.status, r.statusText);
        return '';
      }

      return r.text();
    })
    .catch((error) => {
      logger.error('An error occurred while calling %s - %o$', url, error);
      return '';
    });
}
