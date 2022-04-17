import { Coin } from '../../../models';

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

export function selectCoin(currentCoin: string | null, enabledCoins: Coin[]) {
  return getRandomCoin(currentCoin, enabledCoins);
}
