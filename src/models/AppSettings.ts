export type GeneralSettings = {
  workerName: string;
  updateInterval: number;
  cooldownInterval: number;
  proxy: string;
};

export type AppSettings = {
  settings: GeneralSettings;
  pools: {
    ethash: string;
    etchash: string;
    kawpaw: string;
    randomx: string;
  };
};
