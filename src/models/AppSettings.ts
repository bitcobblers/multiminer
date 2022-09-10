import { CoinSelectionStrategy } from './Enums';

export type GeneralSettings = {
  workerName: string;
  defaultMiner: string;
  coinStrategy: CoinSelectionStrategy;
  proxy: string;
};

export type AppearanceSettings = {
  theme: 'light' | 'dark';
};

export type AppSettings = {
  settings: GeneralSettings;
  appearance: AppearanceSettings;
  pools: {
    etchash: string;
    kawpow: string;
    autolykos2: string;
    randomx: string;
  };
};
