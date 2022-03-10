export type MinerState = {
  state: 'active' | 'inactive';
  currentCoin: string | null;
  miner: string | null;
};
