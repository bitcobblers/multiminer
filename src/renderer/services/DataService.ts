import { Coin, ALL_COINS, MinerState, minerState$, enabledCoins$, ConfiguredCoin } from '../../models';
import * as config from './AppSettingsService';
import { CoinTicker, ticker$ } from './CoinFeed';
import { UnmineableCoin, unmineableCoins$ } from './UnmineableFeed';

function publishCoins(coins: ConfiguredCoin[]) {
  enabledCoins$.next(coins.sort((a, b) => a.symbol.localeCompare(b.symbol)));
}

function minerStateChanged(state: MinerState) {
  // eslint-disable-next-line no-console
  console.log(`Miner state changed to ${state.state}`);

  const updatedCoins = enabledCoins$.getValue().map((c) => {
    return {
      ...c,
      current: state.state === 'active' ? state.currentCoin === c.symbol : false,
    };
  });

  publishCoins(updatedCoins);
}

function tickerUpdated(coins: CoinTicker[]) {
  // eslint-disable-next-line no-console
  console.log('Updating coins from ticker feed.');

  const updatedCoins = enabledCoins$.getValue().map((c) => {
    const ticker = coins.find((t) => t.symbol === c.symbol);

    if (ticker === null) {
      return c;
    }

    return {
      ...c,
      price: ticker?.price,
    };
  });

  publishCoins(updatedCoins);
}

function unmineableCoinsUpdated(coins: UnmineableCoin[]) {
  // eslint-disable-next-line no-console
  console.log('Updating coins from unmineable feed.');

  const updatedCoins = enabledCoins$.getValue().map((c) => {
    const ticker = coins.find((t) => t.symbol === c.symbol);

    if (ticker === undefined) {
      return c;
    }

    return {
      ...c,
      ...{
        mined: ticker.balance,
        threshold: ticker.threshold,
      },
    };
  });

  publishCoins(updatedCoins);
}

function reloadCoins(coins: Coin[]) {
  // eslint-disable-next-line no-console
  console.log('Reloading coins from configuration.');

  const updateCoins = async () => {
    const { currentCoin } = minerState$.getValue();
    const previouslyLoadedCoins = enabledCoins$.getValue();
    const wallets = await config.getWallets();

    return coins
      .filter((c) => c.enabled)
      .map((c) => {
        const cd = ALL_COINS.find((x) => x.symbol === c.symbol);
        const wallet = wallets.find((w) => c.wallet === w.name);

        const previousCoin = previouslyLoadedCoins.find((x) => x.symbol === c.symbol);
        return {
          current: currentCoin === c.symbol,
          icon: cd?.icon ?? '',
          symbol: c.symbol,
          price: previousCoin?.price,
          mined: previousCoin?.mined,
          threshold: previousCoin?.threshold,
          duration: Number(c.duration),
          address: wallet?.address ?? '',
        };
      });
  };

  // eslint-disable-next-line promise/catch-or-return
  updateCoins().then(publishCoins);
}

const minerStateSubscription = minerState$.subscribe(minerStateChanged);
const tickerSubscription = ticker$.subscribe(tickerUpdated);
const unmineableCoinsSubscription = unmineableCoins$.subscribe(unmineableCoinsUpdated);
const configWatcherSubscription = config.watchers$.coins.subscribe(reloadCoins);

export function cleanup() {
  // eslint-disable-next-line no-console
  console.log('Cleaning up data service.');

  minerStateSubscription.unsubscribe();
  tickerSubscription?.unsubscribe();

  unmineableCoinsSubscription?.unsubscribe();
  configWatcherSubscription?.unsubscribe();
}

export async function enableDataService() {
  const loadedCoins = (await config.getCoins()).filter((c) => c.enabled);
  const wallets = await config.getWallets();

  publishCoins(
    loadedCoins.map((c) => {
      const cd = ALL_COINS.find((x) => x.symbol === c.symbol);
      const wallet = wallets.find((w) => c.wallet === w.name);

      return {
        current: false,
        icon: cd?.icon ?? '',
        symbol: c.symbol,
        duration: Number(c.duration),
        address: wallet?.address ?? '',
      };
    })
  );
}
