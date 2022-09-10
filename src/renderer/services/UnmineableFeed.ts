import { withLatestFrom, map, ReplaySubject, timer, throttleTime, filter } from 'rxjs';
import { ConfiguredCoin, minerState$, enabledCoins$, refreshData$ } from '../../models';
import { unmineableApi } from '../../shared/UnmineableApi';

type TimeSeries = {
  data: number[];
  timestamps: number[];
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
  etchash: AlgorithmStat;
  kawpow: AlgorithmStat;
  autolykos: AlgorithmStat;
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
    if (r === '') {
      return null;
    }

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

function updateWorkers(uuid: string) {
  unmineableApi
    .getWorkers(uuid)
    .then((w) => {
      if (w === '') {
        return null;
      }

      const raw = JSON.parse(w);

      return {
        etchash: raw.data.etchash,
        kawpow: raw.data.kawpow,
        autolykos: raw.data.autolykos,
        randomx: raw.data.randomx,
      } as UnmineableStats;
    })
    .then((stats) => {
      if (stats !== null) {
        unmineableWorkers$.next(stats);
      }
    });
}

async function updateCoins(coins: ConfiguredCoin[]) {
  const queriedCoins = await Promise.allSettled(coins.map((cm) => updateCoin(cm.symbol, cm.address)));
  const fullfilledCoins = queriedCoins.filter(({ status }) => status === 'fulfilled').map((p) => (p as PromiseFulfilledResult<UnmineableCoin | null>).value);
  const updatedCoins = fullfilledCoins.filter((c): c is UnmineableCoin => c !== null);
  const currentCoin = coins.find((c) => c.current);

  unmineableCoins$.next(updatedCoins);

  if (currentCoin) {
    const id = updatedCoins.find((c) => c.symbol === currentCoin.symbol)?.uuid;

    if (id) {
      updateWorkers(id);
    }
  }
}

updater$
  .pipe(
    withLatestFrom(minerState$, enabledCoins$),
    map(([, miner, coins]) => ({ state: miner.state, coins })),
    filter(({ state }) => state === 'active')
  )
  .subscribe(({ coins }) => {
    updateCoins(coins);
  });

refreshData$
  .pipe(
    throttleTime(REFRESH_THROTTLE),
    withLatestFrom(minerState$, enabledCoins$),
    map(([, miner, coins]) => ({ state: miner.state, coins })),
    filter(({ state }) => state === 'active')
  )
  .subscribe(({ coins }) => {
    updateCoins(coins);
  });

minerState$.pipe(filter((s) => s.state === 'active')).subscribe(() => {
  const blankStat = () => {
    return {
      workers: [],
      chart: {
        reported: {
          data: [],
          timestamps: [],
        },
        calculated: {
          data: [],
          timestamps: [],
        },
      },
    };
  };

  unmineableWorkers$.next({
    etchash: blankStat(),
    kawpow: blankStat(),
    autolykos: blankStat(),
    randomx: blankStat(),
  });
});
