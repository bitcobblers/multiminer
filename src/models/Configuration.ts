export type MinerName = 'phoenixminer' | 'lolminer' | 'nbminer' | 'trexminer' | 'xmrig';
export type AlgorithmKind = 'CPU' | 'GPU';
export type AlgorithmName = 'ethash' | 'etchash' | 'kawpaw' | 'randomx';

export type AlgorithmInfo = {
  name: AlgorithmName;
  kind: AlgorithmKind;
};

export type MinerInfo = {
  name: MinerName;
  algorithms: AlgorithmName[];
  exe: string;
  getArgs: (algorithm: AlgorithmName, cs: string, url: string) => string;
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
    name: 'phoenixminer',
    algorithms: ['ethash', 'etchash'],
    exe: 'phoenixminer.exe',
    getArgs: (alg, cs, url) => `-pool ${url} -wal ${cs} -pass x${alg === 'etchash' ? ' -coin etc' : ''}`,
  },
  {
    name: 'lolminer',
    algorithms: ['ethash', 'etchash'],
    exe: 'lolminer.exe',
    getArgs: (alg, cs, url) => `--algo ${alg.toLocaleUpperCase()} --pool ${url} --user ${cs} --nocolor`,
  },
  {
    name: 'nbminer',
    algorithms: ['ethash', 'etchash', 'kawpaw'],
    exe: 'nbminer.exe',
    getArgs: (alg, cs, url) => `-a ${alg} -o stratum+tcp://${url} -u ${cs} -log`,
  },
  {
    name: 'trexminer',
    algorithms: ['ethash', 'etchash', 'kawpaw'],
    exe: 't-reg.exe',
    getArgs: (alg, cs, url) => `-a ${alg} -o ${url} -u ${cs} -p x`,
  },
  {
    name: 'xmrig',
    algorithms: ['randomx'],
    exe: 'xmrig.exe',
    getArgs: (_alg, cs, url) => `o ${url} -a rx -k -u ${cs} -p x`,
  },
];

export type Miner = {
  id: string;
  kind: MinerName;
  name: string;
  enabled: boolean;
  installationPath: string;
  algorithm: AlgorithmName;
  parameters: string;
};

export type Coin = {
  symbol: string;
  wallet: string;
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
