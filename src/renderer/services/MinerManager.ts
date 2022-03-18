import path from 'path-browserify';

import * as miningService from './MinerService';
import * as config from './AppSettingsService';
import { minerApi } from '../../shared/MinerApi';
import { ALL_COINS, CoinDefinition, AVAILABLE_MINERS, Miner, Coin, MinerInfo, Wallet, MinerState, minerState$, minerErrors$ } from '../../models';
import { getMiners } from './AppSettingsService';

type CoinSelection = {
  miner: Miner;
  minerInfo: MinerInfo;
  coin: Coin;
  coinInfo: CoinDefinition;
  wallet: Wallet;
};

const MILLISECONDS_PER_HOUR = 1000 * 60 * 60;

let timeout: NodeJS.Timeout;

function getRandom<T>(array: Array<T>) {
  return array[Math.floor(Math.random() * array.length)];
}

function updateState(newState: Partial<MinerState>) {
  const currentState = minerState$.getValue();
  minerState$.next({ ...currentState, ...newState });
}

function getConnectionString(symbol: string, address: string, memo: string, name: string, referral: string) {
  const sanitize = (value: string) => value.trim().replace(/\s+/g, '');

  if (memo === '') {
    return `${symbol}:${sanitize(address)}.${sanitize(name)}#${referral}`;
  }

  return `${symbol}:${sanitize(address)}:${sanitize(memo)}.${sanitize(name)}#${referral}`;
}

export async function selectCoin(onError: (message: string) => void, onSuccess: (selection: CoinSelection) => Promise<void>) {
  const minerName = minerState$.getValue().miner;
  const miner = (await config.getMiners()).find((m) => m.name === minerName);
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

  const coin = getRandom(enabledCoins);
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
  await miningService.stopMiner();

  selectCoin(
    (error) => {
      minerErrors$.next(error);
    },
    async (selection) => {
      const appSettings = await config.getAppSettings();
      const { miner, minerInfo, coin, coinInfo, wallet } = selection;

      const cs = getConnectionString(coin.symbol, wallet.address, wallet.memo, miner.name, getRandom(coinInfo.referrals));
      const filePath = path.join(miner.version, minerInfo.exe);
      const args = minerInfo.getArgs(miner.algorithm, cs, appSettings.pools[miner.algorithm]);

      // eslint-disable-next-line no-console
      console.log(`Selected coin ${coin.symbol} to run for ${coin.duration} hours.  Path: ${filePath} -- Args: ${args}`);

      await miningService.startMiner(miner.name, coin.symbol, filePath, args);
    }
  );
}

export function setMiner(minerName: string | null) {
  updateState({ miner: minerName });
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

async function getDefaultMiner() {
  const miners = await getMiners();
  const miner = miners.find((m) => m.enabled);

  return miner !== undefined ? miner : undefined;
}

async function setInitialState() {
  const minerState = await getMinerState();
  const defaultMiner = await getDefaultMiner();

  if (minerState.state === 'active') {
    // eslint-disable-next-line no-console
    console.log(`Miner already active.  Updating state to reflect.  Coin is ${minerState.currentCoin}.`);
    updateState(minerState);
  } else {
    // eslint-disable-next-line no-console
    console.log('Miner not active.  Setting default miner to use.');
    updateState({ miner: defaultMiner?.name });
  }

  miningService.minerExited$.subscribe(() => {
    updateState({
      state: 'inactive',
      currentCoin: null,
    });
  });

  miningService.minerStarted$.subscribe(({ coin, miner }) => {
    updateState({
      state: 'active',
      currentCoin: coin,
      miner,
    });

    // eslint-disable-next-line promise/catch-or-return
    config.getCoins().then((coins) => {
      const c = coins.find((x) => x.symbol === coin);

      // eslint-disable-next-line promise/always-return
      if (c !== undefined) {
        // eslint-disable-next-line no-console
        console.log(`Setting runtime for current coin to ${c.duration} hours.`);

        timeout = setTimeout(changeCoin, Number(c.duration) * MILLISECONDS_PER_HOUR);
      }
    });
  });
}

setInitialState();
