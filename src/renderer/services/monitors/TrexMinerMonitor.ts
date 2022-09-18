import { addGpuStats, addMinerStat } from '../StatisticsAggregator';
import { MinerMonitor } from './MinerMonitor';

type MinerAppStatistics = {
  accepted_count: number;
  active_pool: {
    difficulty: string;
    dns_http_server: string;
    last_submit_ts: number;
    ping: number;
    proxy: string;
    retries: number;
    url: string;
    user: string;
    worker: string;
  };
  algorithm: string;
  api: string;
  build_date: string;
  coin: string;
  description: string;
  driver: string;
  gpu_total: number;
  gpus: {
    cclock: number;
    dag_build_mode: number;
    device_id: number;
    efficiency: string;
    fan_speed: number;
    gpu_id: number;
    gpu_user_id: number;
    hashrate: number;
    hashrate_day: number;
    hashrate_hour: number;
    hashrate_instance: number;
    hashrate_minute: number;
    intensity: number;
    lhr_lock_count: number;
    lhr_tune: number;
    low_load: boolean;
    mclock: number;
    memory_temperature: number;
    mtweak: number;
    name: string;
    paused: boolean;
    pci_bus: number;
    pci_domain: number;
    potentially_unstable: boolean;
    power: number;
    power_avr: number;
    shares: {
      accepted_count: number;
      invalid_count: number;
      last_share_diff: number;
      last_share_submit_ts: number;
      max_share_diff: number;
      max_share_submit_ts: number;
      rejected_count: number;
      solved_count: number;
    };
    temperature: number;
    uuid: string;
    vendor: string;
  }[];
  hashrate: number;
  hashrate_day: number;
  hashrate_hour: number;
  hashrate_minute: number;
  invalid_count: number;
  name: string;
  os: string;
  paused: boolean;
  rejected_count: number;
  revision: string;
  sharerate: number;
  sharerate_average: number;
  solved_count: number;
  success: number;
  time: number;
  uptime: number;
  validate_shares: boolean;
  version: string;
  watchdog_stat: {
    built_in: boolean;
    startup_ts: number;
    total_restarts: number;
    uptime: number;
    wd_version: string;
  };
};

function updateStats(stats: MinerAppStatistics) {
  addGpuStats(
    stats.gpus.map((device) => {
      const efficiency = device.power === 0 ? undefined : device.hashrate / 1000 / device.power;

      return {
        id: device.gpu_id.toString(),
        name: device.name,
        hashrate: device.hashrate / 1000000,
        accepted: device.shares.accepted_count,
        rejected: device.shares.rejected_count,
        power: device.power,
        efficiency,
        coreClock: device.cclock,
        memClock: device.mclock,
        coreTemperature: device.temperature,
        memTemperature: device.memory_temperature,
        fanSpeed: device.fan_speed,
      };
    }),
  );

  const totalPower = stats.gpus.reduce((a, b) => a + b.power, 0);
  const totalEfficiency = totalPower === 0 ? undefined : stats.hashrate / 1000 / totalPower;

  addMinerStat({
    hashrate: stats.hashrate / 1000000,
    accepted: stats.accepted_count,
    rejected: stats.rejected_count,
    power: totalPower,
    efficiency: totalEfficiency,
    difficulty: stats.active_pool.difficulty,
    uptime: stats.uptime,
  });
}

export const monitor: MinerMonitor = {
  name: 'trexminer',
  statsUrls: ['summary'],
  update: (stats) => updateStats(JSON.parse(stats[0])),
};
