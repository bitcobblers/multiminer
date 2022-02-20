import { IpcMainInvokeEvent } from 'electron';
import axios from 'axios';
import SharedModule from './SharedModule';

const TICKER_URL = 'https://api.unmineable.com/v4/address';
const WORKERS_URL = 'https://api.unminable.com/v4/account';

async function getCoin(_event: IpcMainInvokeEvent, coin: string, address: string) {
  const url = `${TICKER_URL}/${address}?coin=${coin}`;

  return axios.get(url).then((r) => JSON.stringify(r.data));
}

async function getWorkers(_event: IpcMainInvokeEvent, uuid: string) {
  const url = `${WORKERS_URL}/${uuid}/workers`;

  return axios.get(url).then((r) => JSON.stringify(r.data));
}

export default class UnmineableModule implements SharedModule {
  name = 'unmineable';

  handlers = {
    'ipc-getUnmineableCoin': getCoin,
    'ipc-getUnmineableWorkers': getWorkers,
  };

  reset = () => {};
}
