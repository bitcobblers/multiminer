import { ReplaySubject, timer } from 'rxjs';
import * as config from './AppSettingsService';
import { minerState$ } from '../../models';
import { unmineableApi } from '../../shared/UnmineableApi';

type TimeSeries = {
  data: number[];
  timestamps: Date[];
};

type Chart = {
  reported: TimeSeries;
  calculated: TimeSeries;
};

type Worker = {
  online: boolean;
  name: string;
  last: number;
  rhr: string;
  chr: string;
  referral: string;
};

export type AlgorithmStat = {
  workers: Worker[];
  chart: Chart;
};

export type UnmineableStats = {
  ethash: AlgorithmStat;
  etchash: AlgorithmStat;
  kawpow: AlgorithmStat;
  randomx: AlgorithmStat;
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
      balance: Number(raw.data.balance),
      threshold: Number(raw.data.payment_threshold),
      miningFee: Number(raw.data.mining_fee),
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
    } as UnmineableStats;
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
    updateCoins();
  }
});
