import { addCpuStat } from '../StatisticsAggregator';
import { MinerMonitor } from './MinerMonitor';

type SummaryStatistics = {
  id: string;
  worker_id: string;
  uptime: number;
  restricted: boolean;
  resources: {
    memory: {
      free: number;
      total: number;
      resident_set_memory: number;
    },
    load_average: number[];
    hardware_concurrency: number;
  };
  features: string[];
  results: {
    diff_current: number;
    shares_good: number;
    shares_total: number;
    avg_time: number;
    avg_time_ms: number;
    hashes_total: number;
    best: number[];
  };
  algo: string;
  connection: {
    pool: string;
    ip: string;
    uptime: number;
    uptime_ms: number;
    ping: number;
    failures: number;
    tls: number | null;
    algo: string;
    diff: number;
    accepted: number;
    rejected: number;
    avg_time: number;
    avg_time_ms: number;
    hashes_total: number;
  };
  version: string;
  kind: string;
  ua: string;
  cpu: {
    brand: string;
    family: number;
    model: number;
    stepping: number;
    proc_info: number;
    aes: boolean;
    avx2: boolean;
    x64: boolean;
    l2: number;
    l3: number;
    cores: number;
    threads: number;
    packages: number;
    nodes: number;
    backend: string;
    msr: string;
    assembly: string;
    arch: string;
    flags: string[];
  };
  donate_level: number;
  paused: boolean;
  algorithms: string[];
  hashrate: {
    total: number[];
    highest: number;
  };
  hugepages: number[];
};

type BackendStatistics = {
  type: string;
  enabled: true;
  algo: string;
  profile: string;
  priority: number;
  msr: boolean;
  asm: string;
  homepages: number[];
  memory: number;
  hashrate: number;
  threads: {
    intensity: number;
    affinity: number;
    av: number;
    hashrate: number[];
  }[];
};

function updateStats(stats: string[]) {
  const backends = JSON.parse(stats[0]);
  const summary = JSON.parse(stats[1]) as SummaryStatistics;
  const cpu = backends[0] as BackendStatistics;

  addCpuStat({
    hashrate: summary.hashrate.total[0],
    accepted: summary.connection.accepted,
    rejected: summary.connection.rejected,
    cores: summary.cpu.cores,
    threads: summary.cpu.threads,
    algorithm: summary.algo,
    difficulty: summary.connection.diff,
    uptime: summary.uptime,
    timings: cpu.threads?.map((x) => ({
      tenSeconds: x.hashrate[0],
      sixtySeconds: x.hashrate[1],
      fifteenMinutes: x.hashrate[2],
    })) ?? [],
  });
}

export const monitor: MinerMonitor = {
  name: 'xmrig',
  statsUrl: ['2/backends', '2/summary'],
  update: (stats) => updateStats(stats as string[]),
};
