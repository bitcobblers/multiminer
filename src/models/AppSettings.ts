import { AlgorithmBundle } from './AlgorithmBundle';
import { CoinConfiguration } from './CoinConfiguration';
import { MinerConfiguration } from './MinerConfiguration';
import { Wallet } from './Wallet';

export type AppSettings = {
  worker: string;
  updateInterval: number;
  cooldownInterval: number;
  urls: AlgorithmBundle;
  coins: CoinConfiguration[];
  miners: MinerConfiguration[];
  wallets: Wallet[];
};
