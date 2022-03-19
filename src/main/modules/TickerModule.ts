import { IpcMainInvokeEvent } from 'electron';
import { SharedModule } from './SharedModule';
import { getRestUrl } from '../util';

const TICKER_URL = 'https://api.coingecko.com/api/v3/simple/price';

async function getTicker(_event: IpcMainInvokeEvent, coins: string[]) {
  return getRestUrl(`${TICKER_URL}?ids=${coins.join(',')}&vs_currencies=USD`);
}

export const TickerModule: SharedModule = {
  name: 'ticker',
  handlers: {
    'ipc-getTicker': getTicker,
  },
};
