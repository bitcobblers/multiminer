import { BehaviorSubject, timer } from 'rxjs';

import { AllCoins } from '../../models/Coins';
import * as config from './AppSettingsService';
import { tickerApi } from '../../shared/TickerApi';

export type CoinTicker = {
  symbol: string;
  price: number;
};

export const ticker = new BehaviorSubject<CoinTicker[]>([]);

const MILLISECONDS_PER_MINUTE = 1000 * 60;
const UPDATE_INTERVAL = 5 * MILLISECONDS_PER_MINUTE;

const updater = timer(0, UPDATE_INTERVAL);

export async function updateTicker() {
  const coins = (await config.getCoins()).filter((c) => c.enabled);
  const ids = coins.map((c) => AllCoins.find((cd) => cd.symbol === c.symbol)?.id ?? '').filter((c) => c !== '');
  const result = Array<CoinTicker>();

  if (ids.length === 0) {
    return;
  }

  const response = JSON.parse(await tickerApi.getTicker(ids));

  Object.keys(response).forEach((k) => {
    // This call should never fail.
    const symbol = AllCoins.find((c) => c.id === k)?.symbol;

    if (symbol !== undefined) {
      result.push({ symbol, price: response[k].usd });
    }
  });

  if (result.length > 0) {
    ticker.next(result);
  }
}

updater.subscribe(() => {
  updateTicker();
});