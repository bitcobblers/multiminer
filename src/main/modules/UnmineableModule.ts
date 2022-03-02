import { IpcMainInvokeEvent } from 'electron';
import { SharedModule } from './SharedModule';
import { getUrl } from '../util';

const TICKER_URL = 'https://api.unmineable.com/v4/address';
const WORKERS_URL = 'https://api.unmineable.com/v4/account';

async function getCoin(_event: IpcMainInvokeEvent, coin: string, address: string) {
  return getUrl(`${TICKER_URL}/${address}?coin=${coin}`);
}

async function getWorkers(_event: IpcMainInvokeEvent, uuid: string) {
  return getUrl(`${WORKERS_URL}/${uuid}/workers`);
}

export const UnmineableModule: SharedModule = {
  name: 'unmineable',
  handlers: {
    'ipc-getUnmineableCoin': getCoin,
    'ipc-getUnmineableWorkers': getWorkers,
  },
};
