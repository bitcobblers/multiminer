import { interval, withLatestFrom, map, filter } from 'rxjs';
import { minerState$, API_PORT } from '../../../../models';
import { addGpuStat, addMinerStat } from '../../StatisticsAggregator';
import { minerApi } from '../../../../shared/MinerApi';

const UPDATE_INTERVAL = 1000 * 5;

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

const monitor$ = interval(UPDATE_INTERVAL);

function updateStats(stats: MinerAppStatistics) {
  stats.miner.devices.forEach((device) => {
    const efficiency = device.power === 0 ? undefined : device.hashrate_raw / 1000 / device.power;

    addGpuStat({
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
    });
  });

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

export function enableNBMiner() {
  monitor$
    .pipe(
      withLatestFrom(minerState$),
      map(([, miner]) => ({ name: miner.miner, state: miner.state })),
      filter(({ name, state }) => state === 'active' && name === 'nbminer')
    )
    .subscribe(() => {
      // eslint-disable-next-line promise/catch-or-return
      minerApi.stats(API_PORT, 'api/v1/status').then((result) => {
        // eslint-disable-next-line promise/always-return
        if (result !== '') {
          const stats = JSON.parse(result) as MinerAppStatistics;
          updateStats(stats);
        }
      });
    });

  // eslint-disable-next-line no-console
  console.log('Enabled NBMiner support.');
}
