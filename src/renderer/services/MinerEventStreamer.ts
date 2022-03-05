import { BehaviorSubject } from 'rxjs';
import { stdout$ } from './MinerService';
import { GpuStatistic, MinerStatistic } from '../../models';
import { LolMinerLineParsers } from './scrapers/LolMiner';

type LineScraper = {
  match: RegExp;
  parse: (line: string, gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => void;
};

const handlerPacks: { [key: string]: LineScraper[] } = {
  lolminer: LolMinerLineParsers,
};

let handlers = Array<LineScraper>();

export const gpuStatistics$ = new BehaviorSubject<GpuStatistic[]>([]);
export const minerStatistics$ = new BehaviorSubject<MinerStatistic>({});

export function setHandlers(miningHandlers: LineScraper[]) {
  handlers = miningHandlers ?? [];
}

export function setHandlerPack(name: string) {
  if (name in handlerPacks) {
    handlers = handlerPacks[name];
  }
}

export function clearStatistics() {
  gpuStatistics$.next([]);
  minerStatistics$.next({});
}

function combine<T>(item: T, other: Partial<T>) {
  return { ...item, ...other };
}

stdout$.subscribe((line) => {
  const handler = handlers.find((h) => h.match.test(line) === true);

  handler?.parse(
    line,
    (stat) => {
      const previous = gpuStatistics$.getValue();
      const oldStat = previous.find((s) => s.id === stat.id);
      const newStats = oldStat ? [...previous.filter((s) => s.id !== oldStat.id), combine(oldStat, stat)] : [...previous, stat];

      newStats.sort((a, b) => a.id.localeCompare(b.id ?? 0));
      gpuStatistics$.next(newStats);
    },
    (stat) => {
      const previous = minerStatistics$.getValue();
      minerStatistics$.next(combine(previous, stat));
    }
  );
});
