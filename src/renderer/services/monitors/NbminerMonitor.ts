import { addGpuStats, addMinerStat } from '../StatisticsAggregator';
import { MinerMonitor } from './MinerMonitor';

type MinerAppStatistics = {
  miner: {
    devices: {
      accepted_shares: number;
      core_clock: number;
      core_utilization: number;
      fan: number;
      hashrate: string;
      hashrate2: string;
      hashrate2_raw: number;
      hashrate_raw: number;
      id: number;
      info: string;
      invalid_shares: number;
      lhr: number;
      memTemperature: number;
      mem_clock: number;
      mem_utilization: number;
      pci_bus_id: number;
      power: number;
      rejected_shares: number;
      temperature: number;
    }[];

    total_hashrate: string;
    total_hashrate2: string;
    total_hashrate2_raw: number;
    total_hashrate_raw: number;
    total_power_consume: number;
  };

  reboot_times: number;
  start_time: number;
  stratum: {
    accepted_shares: number;
    algorithm: string;
    difficulty: string;
    dual_mine: boolean;
    invalid_shares: number;
    latency: number;
    pool_hashrate_10m: string;
    pool_hashrate_24h: string;
    pool_hashrate_4h: string;
    rejected_shares: number;
    url: string;
    use_ssl: boolean;
    user: string;
  };

  version: string;
};

function updateStats(stats: MinerAppStatistics) {
  addGpuStats(
    stats.miner.devices.map((device) => {
      const efficiency = device.power === 0 ? undefined : device.hashrate_raw / 1000 / device.power;

      return {
        id: device.id.toString(),
        name: device.info,
        hashrate: device.hashrate_raw / 1000000,
        accepted: device.accepted_shares,
        rejected: device.rejected_shares,
        power: device.power,
        efficiency,
        coreClock: device.core_clock,
        memClock: device.mem_clock,
        coreTemperature: device.temperature,
        memTemperature: device.memTemperature,
        fanSpeed: device.fan,
      };
    }),
  );

  const totalEfficiency = stats.miner.total_power_consume === 0 ? undefined : stats.miner.total_hashrate_raw / 1000 / stats.miner.total_power_consume;

  addMinerStat({
    hashrate: stats.miner.total_hashrate_raw / 1000000,
    accepted: stats.stratum.accepted_shares,
    rejected: stats.stratum.rejected_shares,
    power: stats.miner.total_power_consume,
    efficiency: totalEfficiency,
    difficulty: stats.stratum.difficulty,
    uptime: Date.now() / 1000 - stats.start_time,
  });
}

export const monitor: MinerMonitor = {
  name: 'nbminer',
  statsUrl: 'api/v1/status',
  update: (stats) => updateStats(JSON.parse(stats)),
};
