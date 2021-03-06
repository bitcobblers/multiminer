import fetch from 'node-fetch';
import { HttpProxyAgent } from 'http-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { globalStore } from './globals';
import { logger } from './logger';

// Config tracking.
let proxy = globalStore.get('settings.settings.proxy', '') as string;

globalStore.onDidChange('settings', (settings) => {
  if (settings !== undefined) {
    proxy = settings.settings.proxy;
  }
});

function callFetch(url: string, ignoreProxy = false) {
  if (ignoreProxy === false) {
    if (proxy.toLowerCase().startsWith('socks://')) {
      return fetch(url, { agent: new SocksProxyAgent(proxy) });
    }

    if (proxy.toLowerCase().startsWith('http://')) {
      return fetch(url, { agent: new HttpProxyAgent(proxy) });
    }
  }

  return fetch(url);
}

export function getDownloadUrl(url: string) {
  return callFetch(url);
}

export function getRestUrl(url: string, ignoreProxy = false) {
  logger.debug(`Invoking rest call to ${url}`);

  return callFetch(url, ignoreProxy)
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
