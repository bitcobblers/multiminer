import { ReplaySubject, timer } from 'rxjs';
import * as config from './AppSettingsService';
import { serviceState$ } from './MinerManager';
import { unmineableApi } from '../../shared/UnmineableApi';

export type UnmineableCoin = {
  symbol: string;
  balance: number;
  threshold: number;
  miningFee: number;
  uuid: string;
};

export const unmineable$ = new ReplaySubject<UnmineableCoin[]>();

const MILLISECONDS_PER_MINUTE = 1000 * 60;
const UPDATE_INTERVAL = 5 * MILLISECONDS_PER_MINUTE;
const updater$ = timer(0, UPDATE_INTERVAL);

async function getCoins() {
  const wallets = await config.getWallets();
  const configuredCoins = (await config.getCoins()).filter((c) => c.enabled);

  return configuredCoins.map((c) => {
    return {
      symbol: c.symbol,
      address: wallets.find((w) => w.name === c.wallet)?.address ?? '',
    };
  });
}

async function updateCoin(coin: string, address: string) {
  return unmineableApi.getCoin(coin, address).then((r) => {
    const raw = JSON.parse(r);

    return {
      symbol: coin,
      balance: raw.data.balance,
      threshold: raw.data.payment_threshold,
      miningFee: raw.data.mining_fee,
      uuid: raw.data.uuid,
    };
  });
}

export async function updateCoins() {
  const coins = (await getCoins()).filter((c) => c.address !== '');
  const updatedCoins = await Promise.all(coins.map((cm) => updateCoin(cm.symbol, cm.address)));

  unmineable$.next(updatedCoins);
}

updater$.subscribe(() => {
  const service = serviceState$.getValue();

  if (service.state === 'active') {
    //  updateCoins();
  }
});
