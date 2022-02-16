import { IpcMainInvokeEvent } from 'electron';
import axios from 'axios';
import SharedModule from './SharedModule';

const TICKER_URL = 'https://api.unmineable.com/v4/address';

async function getCoin(_event: IpcMainInvokeEvent, coin: string, address: string) {
  const url = `${TICKER_URL}/${address}?coin=${coin}`;

  return axios.get(url).then((r) => JSON.stringify(r.data));
}

export default class UnmineableModule implements SharedModule {
  name = 'unmineable';

  handlers = {
    'ipc-getUnmineableCoin': getCoin,
  };

  reset = () => {};
}
