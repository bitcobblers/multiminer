import { MinerName, AlgorithmName } from './Enums';

export type Miner = {
  id: string;
  kind: MinerName;
  version: string;
  name: string;
  enabled: boolean;
  algorithm: AlgorithmName;
  parameters: string;
};
