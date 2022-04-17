import { Coin } from '../../../models';
import * as config from '../AppSettingsService';

function getRandom<T>(array: Array<T>) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomCoin(currentCoin: string | null, coins: Coin[]): Coin {
  if (coins.length === 1) {
    return coins[0];
  }

  const newCoin = getRandom(coins);

  if (currentCoin !== newCoin.symbol) {
    return newCoin;
  }

  return getRandomCoin(currentCoin, coins);
}

export async function selectCoin(currentCoin: string | null) {
  const enabledCoins = (await config.getCoins()).filter((c) => c.enabled);
  return getRandomCoin(currentCoin, enabledCoins);
}
