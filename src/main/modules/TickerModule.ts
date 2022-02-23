import { IpcMainInvokeEvent } from 'electron';
import axios from 'axios';
import SharedModule from './SharedModule';

const TICKER_URL = 'https://api.coingecko.com/api/v3/simple/price';

async function getTicker(_event: IpcMainInvokeEvent, coins: string[]) {
  const url = `${TICKER_URL}?ids=${coins.join(',')}&vs_currencies=USD`;

  // eslint-disable-next-line no-console
  console.log(`Getting ticker: ${url}`);
  return axios.get(url).then((r) => JSON.stringify(r.data));
}

export default class TickerModule implements SharedModule {
  name = 'ticker';

  handlers = {
    'ipc-getTicker': getTicker,
  };

  reset = () => {};
}
