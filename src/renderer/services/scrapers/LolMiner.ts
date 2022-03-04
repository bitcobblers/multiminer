import { GpuStatistic, MinerStatistic } from '../../../models';

export const GpuStatusLineHandler = {
  match: RegExp(/^GPU \d+\s.+$/),
  parse: (line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
    const IdIndex = 1;

    const CoreTempIndex = 1;
    const MemoryClockIndex = 2;
    const CoreClockIndex = 3;
    const EfficiencyIndex = 4;
    const PowerIndex = 5;
    const BestShareIndex = 6;
    const SharesIndex = 7;
    const CurrentSpeedIndex = 9;

    const parts = line.split(/\s+/);
    const id = parts[IdIndex];
    const name = parts.splice(2, parts.length - 12).join(' ');
    const offset = parts.length - 1;

    const fanPercent = parts[offset];
    const coreTemperature = parts[offset - CoreTempIndex];
    const memoryClock = parts[offset - MemoryClockIndex];
    const coreClock = parts[offset - CoreClockIndex];
    const efficiency = parts[offset - EfficiencyIndex];
    const power = parts[offset - PowerIndex];
    const bestShare = parts[offset - BestShareIndex];
    const [acceptedShares, staleShares] = parts[offset - SharesIndex].split('/');
    const currentSpeed = parts[offset - CurrentSpeedIndex];

    gpuUpdated({
      id,
      name,
      hashrate: Number(currentSpeed),
      accepted: Number(acceptedShares),
      rejected: Number(staleShares),
      best: bestShare,
      power: Number(power),
      efficiency: Number(efficiency) * 1000,
      coreClock: Number(coreClock),
      memClock: Number(memoryClock),
      coreTemperature: Number(coreTemperature),
      fanSpeed: Number(fanPercent),
    });
  },
};

export const SummaryLineHandler = {
  match: new RegExp(/^Total\s.+$/),
  parse: (line: string, _gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => {
    const CurrentSpeedIndex = 1;
    const SharesIndex = 3;
    const BestShareIndex = 4;
    const PowerIndex = 5;
    const EfficiencyIndex = 6;

    const parts = line.split(/\s+/);
    const currentSpeed = parts[CurrentSpeedIndex];
    const [acceptedShares, staleShares] = parts[SharesIndex].split('/');
    const bestShare = parts[BestShareIndex];
    const power = parts[PowerIndex];
    const efficiency = parts[EfficiencyIndex];

    minerUpdated({
      hashrate: Number(currentSpeed),
      accepted: Number(acceptedShares),
      rejected: Number(staleShares),
      best: bestShare,
      power: Number(power),
      efficiency: Number(efficiency) * 1000,
    });
  },
};

export const NewJobLineHandler = {
  match: new RegExp(/^New job received:\s.+$/),
  parse: (line: string, _gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => {
    const IdIndex = 3;
    const EpochIndex = 5;
    const DifficultyIndex = 7;

    const parts = line.split(/\s+/);
    const id = parts[IdIndex];
    const epoch = parts[EpochIndex];
    const difficulty = parts[DifficultyIndex];

    minerUpdated({
      job: id,
      epoch: Number(epoch),
      difficulty,
    });
  },
};

export const AverageSpeedLineHandler = {
  match: new RegExp(/^Average speed\s.+$/),
  parse: (line: string, _gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => {
    const SpeedIndex = 3;
    const parts = line.split(/\s+/);
    const hashrate = parts[SpeedIndex];

    minerUpdated({
      hashrate: Number(hashrate),
    });
  },
};

export const UptimeLineHandler = {
  match: new RegExp(/^Uptime:\s.+$/),
  parse: (line: string, _gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => {
    const uptime = line.replace(/Uptime:\s+/, '');

    minerUpdated({
      uptime,
    });
  },
};

export const LolMinerLineParsers = [GpuStatusLineHandler, SummaryLineHandler, NewJobLineHandler, AverageSpeedLineHandler, UptimeLineHandler];
