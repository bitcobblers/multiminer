import Store from 'electron-store';
import { SettingsSchemaType, DefaultSettings } from '../models/DefaultSettings';

export const globalStore = new Store<SettingsSchemaType>({
  defaults: {
    wallets: DefaultSettings.wallets,
    coins: DefaultSettings.coins,
    miners: DefaultSettings.miners,
    settings: DefaultSettings.settings,
    minerReleases: DefaultSettings.minerReleases,
  },
  schema: {
    settings: {
      type: 'object',
      properties: {
        settings: {
          type: 'object',
          properties: {
            workerName: { type: 'string' },
            defaultMiner: { type: 'string' },
            coinStrategy: { type: 'string' },
            proxy: { type: 'string' },
          },
          required: [],
        },
        pools: {
          type: 'object',
          properties: {
            etchash: { type: 'string' },
            kawpow: { type: 'string' },
            autolykos2: { type: 'string' },
            randomx: { type: 'string' },
          },
          required: [],
        },
      },
      required: [],
    },
    wallets: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          network: { type: 'string' },
          address: { type: 'string' },
          memo: { type: 'string' },
        },
        required: [],
      },
    },
    coins: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          symbol: { type: 'string' },
          wallet: { type: 'string' },
          enabled: { type: 'boolean' },
          duration: { type: 'number' },
        },
        required: [],
      },
    },
    miners: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          kind: { type: 'string', enum: ['gminer', 'phoenixminer', 'lolminer', 'nbminer', 'trexminer', 'xmrig'] },
          version: { type: 'string' },
          name: { type: 'string' },
          enabled: { type: 'boolean' },
          algorithm: { type: 'string', enum: ['ethash', 'etchash', 'kawpow', 'autolykos2', 'randomx'] },
          parameters: { type: 'string' },
        },
        required: [],
      },
    },
    minerReleases: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          version: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                tag: { type: 'string' },
                published: { type: 'string' },
                url: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
});

export const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

export const isJestTest = process.env.JEST_WORKER_ID !== undefined;
