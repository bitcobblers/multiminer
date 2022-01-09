export type AlgorithmInfo = {
  name: string;
  kind: string;
};

export const AvailableAlgorithms: AlgorithmInfo[] = [
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

export type Miner = {
  installationPath: string;
  parameters: Record<string, string>[];
};

export type Coin = {
  symbol: string;
  wallet: string;
  algorithm: string;
  enabled: boolean;
  duration: number | string;
  referral: string;
};

export type Algorithm = {
  url: string;
  miner?: string;
};

export type AlgorithmBundle = {
  ethash: Algorithm;
  etchash: Algorithm;
  kawpaw: Algorithm;
  randomx: Algorithm;
};

export type Wallet = {
  id: string;
  name: string;
  blockchain: string;
  address: string;
  memo: string;
};
