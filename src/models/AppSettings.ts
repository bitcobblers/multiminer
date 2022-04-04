export type GeneralSettings = {
  workerName: string;
  defaultMiner: string;
  proxy: string;
};

export type AppearanceSettings = {
  theme: 'light' | 'dark';
};

export type AppSettings = {
  settings: GeneralSettings;
  appearance: AppearanceSettings;
  pools: {
    ethash: string;
    etchash: string;
    kawpow: string;
    randomx: string;
  };
};
