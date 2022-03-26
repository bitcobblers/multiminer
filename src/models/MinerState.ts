import { MinerName } from './Enums';

export type MinerState = {
  state: 'active' | 'inactive';
  currentCoin: string | null;
  profile?: string;
  miner?: MinerName;
};
