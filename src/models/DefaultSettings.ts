import { Wallet } from './Wallet';
import { Coin } from './Coin';
import { Miner } from './Miner';
import { AppSettings } from './AppSettings';
import { MinerRelease } from './MinerRelease';

export type SettingsSchemaType = {
  settings: AppSettings;
  wallets: Wallet[];
  coins: Coin[];
  miners: Miner[];
  minerReleases: MinerRelease[];
};

export const DefaultSettings: SettingsSchemaType = {
  wallets: [],
  coins: [],
  miners: [
    { id: '5d81682a-50e4-452c-a8cc-cfa516b3c667', kind: 'nbminer', name: 'nbminer', version: 'v40.1', algorithm: 'ethash', parameters: '' },
    { id: '4dbc2b17-348f-4529-859a-7bcdfca20e1e', kind: 'lolminer', name: 'lolminer', version: '1.48', algorithm: 'ethash', parameters: '' },
    { id: 'e76609d0-7823-4c17-bb13-17d0ef61f717', kind: 'trexminer', name: 'trexminer', version: '0.25.9', algorithm: 'ethash', parameters: '' },
  ],
  settings: {
    settings: {
      workerName: 'default',
      defaultMiner: 'nbminer',
      proxy: '',
    },
    pools: {
      ethash: 'ethash.unmineable.com:3333',
      etchash: 'etchash.unmineable.com:3333',
      kawpow: 'kp.unmineable.com:3333',
      randomx: 'rx.unmineable.com:3333',
    },
    appearance: { theme: 'dark' },
  },
  minerReleases: [],
};
