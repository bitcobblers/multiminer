import { GpuStatistic, MinerStatistic } from '../../../../models';

const GPU_STATUS_LINE_REGEX = /^GPU (\d+).+\s(\d+\.\d+[GT]).+$/;
const TOTAL_LINE_REGEX = /^Total\s.+\s(\d+\.\d+[GT])\s.+$/;

export const GpuStatusLineHandler = {
  match: GPU_STATUS_LINE_REGEX,
  parse: (line: string, gpuUpdated: (stat: GpuStatistic) => void) => {
    const IdIndex = 1;
    const BestIndex = 2;

    const parts = line.match(GPU_STATUS_LINE_REGEX);

    if (parts !== null) {
      const id = parts[IdIndex];
      const best = parts[BestIndex];

      gpuUpdated({
        id,
        best,
      });
    }
  },
};

export const SummaryLineHandler = {
  match: TOTAL_LINE_REGEX,
  parse: (line: string, _gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => {
    const parts = line.match(TOTAL_LINE_REGEX);

    if (parts !== null) {
      minerUpdated({
        best: parts[1],
      });
    }
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

export const LolMinerLineParsers = [GpuStatusLineHandler, SummaryLineHandler, NewJobLineHandler];
