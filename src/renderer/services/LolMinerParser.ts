import { GpuStatistic, GlobalStatistic } from './MinerStreamingService';

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

    gpuUpdated({ id, name, field: 'hashrate', value: currentSpeed });
    gpuUpdated({ id, name, field: 'accepted', value: acceptedShares });
    gpuUpdated({ id, name, field: 'rejected', value: staleShares });
    gpuUpdated({ id, name, field: 'best', value: bestShare });
    gpuUpdated({ id, name, field: 'power', value: power });
    gpuUpdated({ id, name, field: 'efficiency', value: efficiency });
    gpuUpdated({ id, name, field: 'cclk', value: coreClock });
    gpuUpdated({ id, name, field: 'mclk', value: memoryClock });
    gpuUpdated({ id, name, field: 'core_temp', value: coreTemperature });
    gpuUpdated({ id, name, field: 'fan_speed', value: fanPercent });
  },
};

export const SummaryLineHandler = {
  match: new RegExp(/^Total\s.+$/),
  parse: (line: string, _gpuUpdated: (stat: GpuStatistic) => void, globalUpdated: (stat: GlobalStatistic) => void) => {
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

    globalUpdated({ field: 'hashrate', value: currentSpeed });
    globalUpdated({ field: 'accepted', value: acceptedShares });
    globalUpdated({ field: 'rejected', value: staleShares });
    globalUpdated({ field: 'best', value: bestShare });
    globalUpdated({ field: 'power', value: power });
    globalUpdated({ field: 'efficiency', value: efficiency });
  },
};

export const NewJobLineHandler = {
  match: new RegExp(/^New job received:\s.+$/),
  parse: (line: string, _gpuUpdated: (stat: GpuStatistic) => void, globalUpdated: (stat: GlobalStatistic) => void) => {
    const IdIndex = 3;
    const EpochIndex = 5;
    const DifficultyIndex = 7;

    const parts = line.split(/\s+/);
    const id = parts[IdIndex];
    const epoch = parts[EpochIndex];
    const difficulty = parts[DifficultyIndex];

    globalUpdated({ field: 'job', value: id });
    globalUpdated({ field: 'epoch', value: epoch });
    globalUpdated({ field: 'difficulty', value: difficulty });
  },
};

export const AverageSpeedLineHandler = {
  match: new RegExp(/^Average speed\s.+$/),
  parse: (line: string, _gpuUpdated: (stat: GpuStatistic) => void, globalUpdated: (stat: GlobalStatistic) => void) => {
    const SpeedIndex = 3;
    const parts = line.split(/\s+/);
    const hashrate = parts[SpeedIndex];

    globalUpdated({ field: 'hashrate', value: hashrate });
  },
};

export const UptimeLineHandler = {
  match: new RegExp(/^Uptime:\s.+$/),
  parse: (line: string, _gpuUpdated: (stat: GpuStatistic) => void, globalUpdated: (stat: GlobalStatistic) => void) => {
    const uptime = line.replace(/Uptime:\s+/, '');

    globalUpdated({ field: 'uptime', value: uptime });
  },
};

export const FoundShareLineHandler = {
  match: new RegExp(/^GPU \d+: Found.+/),
  parse: (line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
    const IdIndex = 1;
    const DifficultyIndex = 7;

    const parts = line.split(/\s+/);
    const id = parts[IdIndex].replace(':', '');
    const difficulty = parts[DifficultyIndex];

    gpuUpdated({ id, name: '', field: 'found', value: difficulty });
  },
};

export const ShareAcceptedLineHandler = {
  match: new RegExp(/GPU \d+: Share.+/),
  parse: (line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
    const IdIndex = 1;

    const parts = line.split(/\s+/);
    const id = parts[IdIndex].replace(':', '');

    gpuUpdated({ id, name: '', field: 'accepted', value: '' });
  },
};

export const LolMinerParser = [GpuStatusLineHandler, SummaryLineHandler, NewJobLineHandler, AverageSpeedLineHandler, UptimeLineHandler, FoundShareLineHandler, ShareAcceptedLineHandler];

// Process: lolminer.exe
// Multiple graphics cards???
// Commandline:  lolminer.exe --algo ETHASH --user xxx --pool xxx
