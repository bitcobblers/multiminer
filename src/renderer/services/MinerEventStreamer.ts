import { Subject } from 'rxjs';
import { stdout } from './MinerService';

type LineScraper = {
  match: RegExp;
  parse: (line: string, gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => void;
};

let handlers = Array<LineScraper>();

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

export function setHandlers(miningHandlers: LineScraper[]) {
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
