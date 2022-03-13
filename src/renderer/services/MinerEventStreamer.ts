import { BehaviorSubject, withLatestFrom, map } from 'rxjs';

import { minerStarted$, stdout$ } from './MinerService';
import { GpuStatistic, MinerStatistic } from '../../models';
import { LolMinerLineParsers } from './scrapers/LolMiner';
import { getMiners } from './AppSettingsService';

export const gpuStatistics$ = new BehaviorSubject<GpuStatistic[]>([]);
export const minerStatistics$ = new BehaviorSubject<MinerStatistic>({});

type LineScraper = {
  match: RegExp;
  parse: (line: string, gpuUpdated: (stat: GpuStatistic) => void, minerUpdated: (stat: MinerStatistic) => void) => void;
};

const handlerPacks: { [key: string]: LineScraper[] } = {
  lolminer: LolMinerLineParsers,
};

let handlers = Array<LineScraper>();

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

stdout$
  .pipe(
    withLatestFrom(gpuStatistics$, minerStatistics$),
    map(([line, prevGpu, prevMiner]) => ({
      line: line.trim(),
      prevGpu,
      prevMiner,
    }))
  )
  .subscribe(({ line, prevGpu, prevMiner }) => {
    const handler = handlers.find((h) => h.match.test(line) === true);

    handler?.parse(
      line,
      (stat) => {
        const oldStat = prevGpu.find((s) => s.id === stat.id);
        const newStats = oldStat ? [...prevGpu.filter((s) => s.id !== oldStat.id), combine(oldStat, stat)] : [...prevGpu, stat];

        newStats.sort((a, b) => a.id.localeCompare(b.id ?? 0));
        gpuStatistics$.next(newStats);
      },
      (stat) => {
        minerStatistics$.next(combine(prevMiner, stat));
      }
    );
  });

minerStarted$.subscribe(({ miner }) => {
  clearStatistics();

  // eslint-disable-next-line promise/catch-or-return
  getMiners().then((miners) => {
    const minerType = miners.find((m) => m.name === miner);

    // eslint-disable-next-line promise/always-return
    if (minerType?.kind !== undefined) {
      setHandlerPack(minerType?.kind);
    }
  });
});
