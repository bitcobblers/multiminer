import path from 'path-browserify';

import * as miningService from './MinerService';
import * as config from './AppSettingsService';
import { minerApi } from '../../shared/MinerApi';
import { ALL_COINS, CoinDefinition, AVAILABLE_MINERS, Miner, Coin, MinerInfo, Wallet, MinerState, minerState$, minerErrors$ } from '../../models';
import { getMiners, getAppSettings, watchers$ as settingsWatcher$ } from './AppSettingsService';
import { downloadMiner } from './DownloadManager';

type CoinSelection = {
  miner: Miner;
  minerInfo: MinerInfo;
  coin: Coin;
  coinInfo: CoinDefinition;
  wallet: Wallet;
};

let timeout: NodeJS.Timeout;

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

function updateState(newState: Partial<MinerState>) {
  const currentState = minerState$.getValue();
  const mergedState = { ...currentState, ...newState };

  minerState$.next(mergedState);
}

function getConnectionString(symbol: string, address: string, memo: string, name: string, referral: string) {
  const sanitize = (value: string) => value.trim().replace(/\s+/g, '');

  if (memo === '') {
    return `${symbol}:${sanitize(address)}.${sanitize(name)}#${referral}`;
  }

  return `${symbol}:${sanitize(address)}:${sanitize(memo)}.${sanitize(name)}#${referral}`;
}

export async function selectCoin(onError: (message: string) => void, onSuccess: (selection: CoinSelection) => Promise<void>) {
  const { profile, currentCoin } = minerState$.getValue();
  const allMiners = await config.getMiners();
  const miner = allMiners.find((m) => m.name === profile);
  const minerInfo = AVAILABLE_MINERS.find((m) => m.name === miner?.kind);

  if (miner === undefined) {
    onError('No miners have been enabled.');
    return;
  }

  if (minerInfo === undefined) {
    onError('Could not find any information about this miner.');
    return;
  }

  const enabledCoins = (await config.getCoins()).filter((c) => c.enabled);

  if (enabledCoins.length === 0) {
    onError('No coins have been configured for mining.');
    return;
  }

  const coin = getRandomCoin(currentCoin, enabledCoins);
  const coinInfo = ALL_COINS.find((c) => c.symbol === coin.symbol);

  if (coinInfo === undefined) {
    onError('Could not find any information about this coin.');
    return;
  }

  const wallet = (await config.getWallets()).find((w) => w.name === coin.wallet);

  if (wallet === undefined) {
    onError(`The wallet '${coin.wallet}' associated with ${coin.symbol} could not be found.`);
    return;
  }

  await onSuccess({ miner, minerInfo, coin, coinInfo, wallet });
}

async function changeCoin() {
  selectCoin(
    (error) => {
      minerErrors$.next(error);
    },
    async (selection) => {
      const appSettings = await config.getAppSettings();
      const { miner, minerInfo, coin, coinInfo, wallet } = selection;

      const cs = getConnectionString(coin.symbol, wallet.address, wallet.memo, miner.name, getRandom(coinInfo.referrals));
      const filePath = path.join(miner.version, minerInfo.exe);
      const minerArgs = minerInfo.getArgs(miner.algorithm, cs, appSettings.pools[miner.algorithm]);
      const extraArgs = miner.parameters;
      const mergedArgs = `${minerArgs} ${extraArgs}`;

      // eslint-disable-next-line no-console
      console.log(`Selected coin ${coin.symbol} to run for ${coin.duration} hours.  Path: ${filePath} -- Args: ${mergedArgs}`);

      const downloadResult = await downloadMiner(miner.kind, miner.version);

      if (downloadResult === true) {
        await miningService.stopMiner();
        await miningService.startMiner(miner.name, coin.symbol, minerInfo, miner.version, mergedArgs);
      }
    }
  );
}

export async function setProfile(profile: string) {
  const miner = (await getMiners()).find((m) => m.name === profile);
  updateState({ profile, miner: miner?.kind });
}

export async function nextCoin() {
  clearTimeout(timeout);
  await changeCoin();
}

export async function stopMiner() {
  clearTimeout(timeout);
  await miningService.stopMiner();
}

export async function startMiner() {
  clearTimeout(timeout);
  await changeCoin();
}

async function getMinerState() {
  return minerApi.status();
}

async function getDefaultMiner(defaultMiner: string) {
  const miners = await getMiners();
  const miner = miners.find((m) => m.name === defaultMiner);

  return miner !== undefined ? miner : miners[0];
}

async function setInitialState() {
  const minerState = await getMinerState();
  const appSettings = await getAppSettings();
  const defaultMiner = await getDefaultMiner(appSettings.settings.defaultMiner);

  if (minerState.state === 'active') {
    updateState({ state: 'active', currentCoin: minerState.currentCoin, miner: minerState.miner });
  } else {
    updateState({ profile: defaultMiner?.name, miner: defaultMiner?.kind });
  }

  miningService.minerExited$.subscribe(() => {
    updateState({
      state: 'inactive',
      currentCoin: null,
    });
  });

  miningService.minerStarted$.subscribe(({ coin }) => {
    updateState({
      state: 'active',
      currentCoin: coin,
    });

    // eslint-disable-next-line promise/catch-or-return
    config.getCoins().then((coins) => {
      const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;
      const c = coins.find((x) => x.symbol === coin);

      // eslint-disable-next-line promise/always-return
      if (c !== undefined) {
        timeout = setTimeout(changeCoin, Number(c.duration) * MILLISECONDS_PER_HOUR);
      }
    });
  });

  settingsWatcher$.settings.subscribe(async (updatedAppSettings) => {
    const miner = await getDefaultMiner(updatedAppSettings.settings.defaultMiner);
    updateState({ profile: miner.name, miner: miner.kind });
  });
}

setInitialState();
