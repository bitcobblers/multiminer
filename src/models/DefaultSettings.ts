import { Wallet } from './Wallet';
import { Coin } from './Coin';
import { Miner } from './Miner';
import { AppSettings } from './AppSettings';

export const DefaultSettings = {
  wallets: [] as Wallet[],

  coins: [] as Coin[],

  miners: [{ id: '4dbc2b17-348f-4529-859a-7bcdfca20e1e', kind: 'lolminer', name: 'default', enabled: true, version: '1.46a', algorithm: 'ethash', parameters: '' }] as Miner[],

  settings: {
    settings: {
      workerName: 'default',
      cooldownInterval: 0,
      proxy: '',
    },
    pools: {
      ethash: 'ethash.unmineable.com:3333',
      etchash: 'etchash.unmineable.com:3333',
      kawpow: 'kp.unmineable.com:3333',
      randomx: 'rx.unmineable.com:3333',
    },
  } as AppSettings,
};

export type SettingsSchemaType = {
  settings: AppSettings;
  wallets: Wallet[];
  coins: Coin[];
  miners: Miner[];
};
