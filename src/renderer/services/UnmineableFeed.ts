import { ReplaySubject, timer } from 'rxjs';
import * as config from './AppSettingsService';
import { minerState$ } from './MinerManager';
import { unmineableApi } from '../../shared/UnmineableApi';

type TimeSeries = {
  data: number[];
  timestamp: Date[];
};

type Chart = {
  reported: TimeSeries;
  calculated: TimeSeries;
};

type Worker = {
  online: boolean;
  name: string;
  last: Date;
  rhr: number;
  chr: number;
  referral: string;
};

export type UnmineableStats = {
  ethash: {
    workers: Worker[];
    chart: Chart;
  };
  etchash: {
    workers: Worker[];
    chart: Chart;
  };
  kawpow: {
    workers: Worker[];
    chart: Chart;
  };
  randomx: {
    workers: Worker[];
    chart: Chart;
  };
};

export type UnmineableCoin = {
  symbol: string;
  balance: number;
  threshold: number;
  miningFee: number;
  uuid: string;
};

export const unmineableCoins$ = new ReplaySubject<UnmineableCoin[]>();
export const unmineableWorkers$ = new ReplaySubject<UnmineableStats>();

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

export async function updateWorkers(uuid: string) {
  const stats = await unmineableApi.getWorkers(uuid).then((w) => {
    const raw = JSON.parse(w);

    return {
      ethash: raw.data.ethash,
      etchash: raw.data.etchash,
      kawpow: raw.data.kawpow,
      randomx: raw.data.randomx,
    };
  });

  unmineableWorkers$.next(stats);
}

export async function updateCoins() {
  const coins = (await getCoins()).filter((c) => c.address !== '');
  const updatedCoins = await Promise.all(coins.map((cm) => updateCoin(cm.symbol, cm.address)));

  unmineableCoins$.next(updatedCoins);
}

updater$.subscribe(() => {
  const service = minerState$.getValue();

  if (service.state === 'active') {
    //  updateCoins();
  }
});
