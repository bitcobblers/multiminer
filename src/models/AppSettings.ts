export type GeneralSettings = {
  workerName: string;
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
