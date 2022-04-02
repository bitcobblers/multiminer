export type GeneralSettings = {
  workerName: string;
  defaultMiner: string;
  proxy: string;
};

export type AppSettings = {
  settings: GeneralSettings;
  pools: {
    ethash: string;
    etchash: string;
    kawpow: string;
    randomx: string;
  };
};
