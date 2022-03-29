export type GpuStatistic = {
  id: string;
  name?: string;
  hashrate?: number;
  accepted?: number;
  rejected?: number;
  best?: string;
  power?: number;
  efficiency?: number;
  coreClock?: number;
  memClock?: number;
  coreTemperature?: number;
  memTemperature?: number;
  fanSpeed?: number;
};

export type MinerStatistic = {
  hashrate?: number;
  accepted?: number;
  rejected?: number;
  best?: string;
  power?: number;
  efficiency?: number;
  job?: string;
  epoch?: number;
  difficulty?: string;
  uptime?: number;
};
