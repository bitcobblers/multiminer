import { Coin } from '../../../models';

function pickCoin(currentCoin: string, enabledCoins: Coin[]) {
  const index = enabledCoins.findIndex((c) => c.symbol === currentCoin);

  if (index === -1 || index === enabledCoins.length - 1) {
    return enabledCoins[0];
  }

  return enabledCoins[index + 1];
}

export function selectCoin(currentCoin: string | null, enabledCoins: Coin[]) {
  const sortedCoins = [...enabledCoins].sort((a, b) => a.symbol.localeCompare(b.symbol));
  return currentCoin === null ? sortedCoins[0] : pickCoin(currentCoin, sortedCoins);
}
