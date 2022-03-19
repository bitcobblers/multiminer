import { IpcMainInvokeEvent, shell } from 'electron';
import { SharedModule } from './SharedModule';
import { getRestUrl } from '../util';
import { logger } from '../logger';

const TICKER_URL = 'https://api.unmineable.com/v4/address';
const WORKERS_URL = 'https://api.unmineable.com/v4/account';
const WEB_URL = 'https://unmineable.com/coins';

async function getCoin(_event: IpcMainInvokeEvent, coin: string, address: string) {
  return getRestUrl(`${TICKER_URL}/${address}?coin=${coin}`);
}

async function getWorkers(_event: IpcMainInvokeEvent, uuid: string) {
  return getRestUrl(`${WORKERS_URL}/${uuid}/workers`);
}

async function openBrowser(_event: IpcMainInvokeEvent, coin: string, address: string) {
  const url = `${WEB_URL}/${coin}/address/${address}`;
  logger.debug('Navigating to %s', url);
  await shell.openExternal(url);
}

export const UnmineableModule: SharedModule = {
  name: 'unmineable',
  handlers: {
    'ipc-getUnmineableCoin': getCoin,
    'ipc-getUnmineableWorkers': getWorkers,
    'ipc-openUnmineableWeb': openBrowser,
  },
};
