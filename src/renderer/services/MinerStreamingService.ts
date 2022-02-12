import { Subject } from 'rxjs';
import { stdout } from './MinerService';

type LineHandler = {
  match: RegExp;
  parse: (line: string, gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => void;
};

let handlers = Array<LineHandler>();

export type GpuStatistic = {
  id: string;
  name?: string;
  field: string;
  value?: string;
};

export type MinerStatistic = {
  field: string;
  value?: string;
};

export const gpuStatistics = new Subject<GpuStatistic>();
export const minerStatistics = new Subject<MinerStatistic>();

export function setHandlers(miningHandlers: LineHandler[]) {
  handlers = miningHandlers ?? [];
}

stdout.subscribe((line) => {
  const handler = handlers.find((h) => h.match.test(line) === true);

  handler?.parse(
    line,
    (stat) => gpuStatistics.next(stat),
    (stat) => minerStatistics.next(stat)
  );
});
