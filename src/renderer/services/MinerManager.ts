import path from 'path-browserify';

import { BehaviorSubject, Subject } from 'rxjs';
import { AllCoins, CoinDefinition } from '../../models/Coins';
import * as miningService from './MinerService';
import * as config from './AppSettingsService';
import { AvailableMiners, Miner, Coin, MinerInfo, Wallet } from '../../models/Configuration';

export type ManagerState = 'inactive' | 'active';

export const errors = new Subject<string>();
export const serviceState = new BehaviorSubject<ManagerState>('inactive');
export const currentCoin = new Subject<string>();

let timeout: NodeJS.Timeout;

function setError(message: string) {
  errors.next(message);
}

function getRandom<T>(array: Array<T>) {
  return array[Math.floor(Math.random() * array.length)];
}

function sanitize(value: string) {
  return value.trim().replace(/\s+/g, '');
}

function getConnectionString(symbol: string, address: string, memo: string, name: string, referral: string) {
  if (memo === '') {
    return `${symbol}:${sanitize(address)}.${sanitize(name)}#${referral}`;
  }

  return `${symbol}:${sanitize(address)}:${sanitize(memo)}.${sanitize(name)}#${referral}`;
}

type CoinSelection = {
  miner: Miner;
  minerInfo: MinerInfo;
  coin: Coin;
  coinInfo: CoinDefinition;
  wallet: Wallet;
};

export async function selectCoin(onError: (message: string) => void, onSuccess: (selection: CoinSelection) => Promise<void>) {
  const miner = (await config.getMiners()).find((m) => m.enabled);
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
      setError(error);
    },
    async (selection) => {
      const appSettings = await config.getAppSettings();
      const { miner, minerInfo, coin, coinInfo, wallet } = selection;

      const cs = getConnectionString(coin.symbol, wallet.address, wallet.memo, miner.name, coinInfo.referral);
      const filePath = path.join(miner.installationPath, minerInfo.exe);
      const args = minerInfo.getArgs(miner.algorithm, cs, appSettings.pools[miner.algorithm]);

      // eslint-disable-next-line no-console
      console.log(`Selected coin ${coin.symbol} to run for ${coin.duration} hours.  Path: ${filePath} -- Args: ${args}`);

      currentCoin.next(coin.symbol);
      await miningService.startMiner(filePath, args);
      timeout = setTimeout(changeCoin, Number(selection.coin.duration) * 1000 * 60);
    }
  );
}

export async function nextCoin() {
  clearTimeout(timeout);
  await changeCoin();
}

export async function stopMiner() {
  serviceState.next('inactive');
  clearTimeout(timeout);
  await miningService.stopMiner();
}

export async function startMiner() {
  serviceState.next('active');
  clearTimeout(timeout);
  await changeCoin();
}
