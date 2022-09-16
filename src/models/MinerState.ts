import { MinerName } from './Enums';
import { AlgorithmInfo } from './AlgorithmInfo';

export type MinerState = {
  state: 'active' | 'inactive';
  currentCoin: string | null;
  algorithm?: AlgorithmInfo;
  profile?: string;
  miner?: MinerName;
};
