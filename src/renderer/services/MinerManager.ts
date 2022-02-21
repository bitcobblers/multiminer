import path from 'path-browserify';

import { BehaviorSubject, Subject } from 'rxjs';
import { AllCoins, CoinDefinition } from '../../models/Coins';
import * as miningService from './MinerService';
import * as config from './AppSettingsService';
import { AvailableMiners, Miner, Coin, MinerInfo, Wallet } from '../../models/Configuration';
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

export type MinerState = {
  state: 'active' | 'inactive';
  currentCoin: string | null;
  miner: string | null;
};

export const errors$ = new Subject<string>();
export const minerState$ = new BehaviorSubject<MinerState>({ state: 'inactive', currentCoin: null, miner: null });

function updateState(newState: Partial<MinerState>) {
  const currentState = minerState$.getValue();
  minerState$.next({ ...currentState, ...newState });
}

function activate(coin: string) {
  updateState({ state: 'active', currentCoin: coin });
}

function deactivate() {
  updateState({ state: 'inactive', currentCoin: null });
}

function getConnectionString(symbol: string, address: string, memo: string, name: string, referral: string) {
  const sanitize = (value: string) => value.trim().replace(/\s+/g, '');

  if (memo === '') {
    return `${symbol}:${sanitize(address)}.${sanitize(name)}#${referral}`;
  }

  return `${symbol}:${sanitize(address)}:${sanitize(memo)}.${sanitize(name)}#${referral}`;
}

export async function selectCoin(onError: (message: string) => void, onSuccess: (selection: CoinSelection) => Promise<void>) {
  const getRandom = <T>(array: Array<T>) => array[Math.floor(Math.random() * array.length)];

  const minerName = minerState$.getValue().miner;
  const miner = (await config.getMiners()).find((m) => m.name === minerName);
  const minerInfo = AvailableMiners.find((m) => m.name === miner?.kind);

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
  const coinInfo = AllCoins.find((c) => c.symbol === coin.symbol);

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
      errors$.next(error);
    },
    async (selection) => {
      const appSettings = await config.getAppSettings();
      const { miner, minerInfo, coin, coinInfo, wallet } = selection;

      const cs = getConnectionString(coin.symbol, wallet.address, wallet.memo, miner.name, coinInfo.referral);
      const filePath = path.join(miner.installationPath, minerInfo.exe);
      const args = minerInfo.getArgs(miner.algorithm, cs, appSettings.pools[miner.algorithm]);

      // eslint-disable-next-line no-console
      console.log(`Selected coin ${coin.symbol} to run for ${coin.duration} hours.  Path: ${filePath} -- Args: ${args}`);

      activate(coin.symbol);
      await miningService.startMiner(filePath, args);
      timeout = setTimeout(changeCoin, Number(selection.coin.duration) * MILLISECONDS_PER_HOUR);
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
  deactivate();
  clearTimeout(timeout);
  await miningService.stopMiner();
}

export async function startMiner() {
  clearTimeout(timeout);
  await changeCoin();
}

// eslint-disable-next-line promise/catch-or-return
getMiners().then((miners) => {
  const miner = miners.find((m) => m.enabled);

  // eslint-disable-next-line promise/always-return
  if (miner !== undefined) {
    updateState({ miner: miner?.name });
  }
});
