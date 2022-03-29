import { Wallet } from './Wallet';
import { Coin } from './Coin';
import { Miner } from './Miner';
import { AppSettings } from './AppSettings';

export const DefaultSettings = {
  wallets: [
    { id: 'e4bfb138-4365-404f-89d3-6549b22d4b3b', name: 'mywallet1', network: 'ETH', address: '0xe141167eb550b999cb59f9ac202d2dfdd240a4a0', memo: '' },
    { id: '14306209-a673-44ec-a732-9e14f14b029c', name: 'mywallet2', network: 'XLM', address: 'GD2BLIQF6SF3RJE4QOG64NOPRSEH6ASPEWLH7WJNSVQCP3ATOGQDGUOX', memo: '3128811' },
    { id: '8980b1a7-129c-4b42-ac33-b5eabfbd7f92', name: 'mywallet3', network: 'TRX', address: 'TEP6m4AAWBPqLndTJAM1PH3RzkDPKV9D71', memo: '' },
  ] as Wallet[],

  coins: [
    { symbol: 'ETH', wallet: 'mywallet1', enabled: true, duration: 5 },
    { symbol: 'SHIB', wallet: 'mywallet1', enabled: false, duration: 5 },
    { symbol: 'TRX', wallet: 'mywallet3', enabled: true, duration: 5 },
  ] as Coin[],

  miners: [{ id: '4dbc2b17-348f-4529-859a-7bcdfca20e1e', kind: 'lolminer', name: 'default', enabled: true, version: '1.46a', algorithm: 'ethash', parameters: '' }] as Miner[],

  settings: {
    settings: {
      workerName: 'default',
      cooldownInterval: 15,
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
