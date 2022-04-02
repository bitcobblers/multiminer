import { MinerName, AlgorithmName } from './Enums';

export type Miner = {
  id: string;
  kind: MinerName;
  version: string;
  name: string;
  algorithm: AlgorithmName;
  parameters: string;
};
