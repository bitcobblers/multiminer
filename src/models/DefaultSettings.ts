import { Wallet } from './Wallet';
import { Coin } from './Coin';
import { Miner } from './Miner';
import { AppSettings } from './AppSettings';
import { MinerRelease } from './MinerRelease';

export const DefaultSettings = {
  wallets: [] as Wallet[],

  coins: [] as Coin[],

  miners: [{ id: '4dbc2b17-348f-4529-859a-7bcdfca20e1e', kind: 'lolminer', name: 'default', version: '1.46a', algorithm: 'ethash', parameters: '' }] as Miner[],

  settings: {
    settings: {
      workerName: 'default',
      defaultMiner: 'default',
      proxy: '',
    },
    pools: {
      ethash: 'ethash.unmineable.com:3333',
      etchash: 'etchash.unmineable.com:3333',
      kawpow: 'kp.unmineable.com:3333',
      randomx: 'rx.unmineable.com:3333',
    },
    appearance: { theme: 'light' },
  } as AppSettings,

  miner_releases: Array<MinerRelease>(),
};

export type SettingsSchemaType = {
  settings: AppSettings;
  wallets: Wallet[];
  coins: Coin[];
  miners: Miner[];
  miner_releases: MinerRelease[];
};
