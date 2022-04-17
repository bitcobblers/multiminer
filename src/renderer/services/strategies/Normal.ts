import { Coin } from '../../../models';
import * as config from '../AppSettingsService';

function pickCoin(currentCoin: string, enabledCoins: Coin[]) {
  const index = enabledCoins.findIndex((c) => c.symbol === currentCoin);

  if (index === -1 || index === enabledCoins.length - 1) {
    return enabledCoins[0];
  }

  return enabledCoins[index + 1];
}

export async function selectCoin(currentCoin: string | null) {
  const enabledCoins = (await config.getCoins()).filter((c) => c.enabled).sort((a, b) => a.symbol.localeCompare(b.symbol));
  return currentCoin === null ? enabledCoins[0] : pickCoin(currentCoin, enabledCoins);
}
