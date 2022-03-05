import { MinerName, AlgorithmName } from './Enums';

export type Miner = {
  id: string;
  kind: MinerName;
  name: string;
  enabled: boolean;
  installationPath: string;
  algorithm: AlgorithmName;
  parameters: string;
};
