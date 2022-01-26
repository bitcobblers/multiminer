export type MinerName = 'gminer' | 'phoenixminer' | 'lolminer' | 'nbminer' | 'trexminer' | 'xmrig';
export type AlgorithmKind = 'CPU' | 'GPU';
export type AlgorithmName = 'ethash' | 'etchash' | 'kawpaw' | 'randomx';

export type AlgorithmInfo = {
  name: AlgorithmName;
  kind: AlgorithmKind;
};

export type MinerInfo = {
  name: MinerName;
  algorithms: AlgorithmName[];
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

export const AvailableMiners: MinerInfo[] = [
  {
    name: 'gminer',
    algorithms: ['ethash'],
  },
  {
    name: 'phoenixminer',
    algorithms: ['ethash', 'etchash'],
  },
  {
    name: 'lolminer',
    algorithms: ['ethash', 'etchash'],
  },
  {
    name: 'nbminer',
    algorithms: ['ethash', 'etchash', 'kawpaw'],
  },
  {
    name: 'trexminer',
    algorithms: ['ethash', 'etchash', 'kawpaw'],
  },
  {
    name: 'xmrig',
    algorithms: ['randomx'],
  },
];

export type Miner = {
  id: string;
  info: MinerName;
  name: string;
  enabled: boolean;
  installationPath: string;
  algorithm: AlgorithmName;
  parameters: string;
  // parameters: { [key: string]: string };
};

export type Coin = {
  symbol: string;
  wallet: string;
  algorithm: string;
  enabled: boolean;
  duration: number | string;
  referral: string;
};

export type Wallet = {
  id: string;
  name: string;
  blockchain: string;
  address: string;
  memo: string;
};

export type PoolUrls = {
  ethash: string;
  etchash: string;
  kawpaw: string;
  randomx: string;
};

export type GeneralSettings = {
  workerName: string;
  updateInterval: number;
  cooldownInterval: number;
};

export type AppSettings = {
  settings: GeneralSettings;
  pools: PoolUrls;
};
