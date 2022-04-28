import { Miner } from './Miner';
import { MinerInfo } from './MinerInfo';
import { Coin } from './Coin';
import { CoinDefinition } from './CoinDefinition';
import { Wallet } from './Wallet';

export type CoinSelection = {
  miner: Miner;
  minerInfo: MinerInfo;
  coin: Coin;
  coinInfo: CoinDefinition;
  wallet: Wallet;
};
