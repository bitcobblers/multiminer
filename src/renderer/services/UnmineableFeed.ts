import { withLatestFrom, map, ReplaySubject, timer, throttleTime } from 'rxjs';
import { ConfiguredCoin, minerState$, enabledCoins$, refreshData$ } from '../../models';
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

const REFRESH_THROTTLE = 1000 * 30;
const MILLISECONDS_PER_MINUTE = 1000 * 60;
const UPDATE_INTERVAL = 5 * MILLISECONDS_PER_MINUTE;
const updater$ = timer(0, UPDATE_INTERVAL);

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

async function updateWorkers(uuid: string) {
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

async function updateCoins(coins: ConfiguredCoin[]) {
  const updatedCoins = await Promise.all(coins.map((cm) => updateCoin(cm.symbol, cm.address)));
  const currentCoin = coins.find((c) => c.current);

  unmineableCoins$.next(updatedCoins);

  if (currentCoin) {
    const id = updatedCoins.find((c) => c.symbol === currentCoin.symbol)?.uuid;

    if (id) {
      await updateWorkers(id);
    }
  }
}

updater$
  .pipe(
    withLatestFrom(minerState$, enabledCoins$),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([_, miner, coins]) => ({ state: miner.state, coins }))
  )
  .subscribe(({ state, coins }) => {
    if (state === 'active') {
      updateCoins(coins);
    }
  });

refreshData$
  .pipe(
    throttleTime(REFRESH_THROTTLE),
    withLatestFrom(minerState$, enabledCoins$),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([_, miner, coins]) => ({ state: miner.state, coins }))
  )
  .subscribe(({ state, coins }) => {
    if (state === 'active') {
      updateCoins(coins);
    }
  });
