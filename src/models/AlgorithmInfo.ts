import { AlgorithmName, AlgorithmKind } from './Enums';

export type AlgorithmInfo = {
  name: AlgorithmName;
  kind: AlgorithmKind;
};

export const AVAILABLE_ALGORITHMS: AlgorithmInfo[] = [
  {
    name: 'ethash',
    kind: 'GPU',
  },
  {
    name: 'etchash',
    kind: 'GPU',
  },
  {
    name: 'kawpaw',
    kind: 'GPU',
  },
  {
    name: 'randomx',
    kind: 'CPU',
  },
];
