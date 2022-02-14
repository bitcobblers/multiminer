import { BehaviorSubject } from 'rxjs';
import axios from 'axios';

import { AllCoins } from '../../models/Coins';
import { Coin } from '../../models/Configuration';
import * as config from './AppSettingsService';

export type CoinTicker = {
  symbol: string;
  price: number;
};

export const ticker = new BehaviorSubject<CoinTicker[]>([]);

const UPDATE_INTERVAL = 1; // Minutes
const MILLISECONDS_PER_MINUTE = 1000 * 60;
const TICKER_URL = 'https://api.coingecko.com/api/v3/simple/price';

function formatUrl(coins: Coin[]) {
  const ids = coins.map((c) => AllCoins.find((cd) => cd.symbol === c.symbol)?.id).join(',');

  return `${TICKER_URL}?ids=${ids}&vs_currencies=USD`;
}

export async function updateTicker() {
  const coins = (await config.getCoins()).filter((c) => c.enabled);
  const url = formatUrl(coins);

  if (coins.length === 0) {
    return;
  }

  const updatedCoins = await axios
    .get(url)
    .then((r) => r.data)
    .then((d) => {
      const result: CoinTicker[] = [];

      Object.keys(d).forEach((k) => {
        // This call should never fail.
        const symbol = AllCoins.find((c) => c.id === k)?.symbol;

        if (symbol !== undefined) {
          result.push({ symbol, price: d[k].usd });
        }
      });

      return result;
    });

  ticker.next(updatedCoins);
}

setInterval(updateTicker, UPDATE_INTERVAL * MILLISECONDS_PER_MINUTE);
