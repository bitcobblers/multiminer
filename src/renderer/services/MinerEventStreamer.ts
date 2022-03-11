import { minerStarted$, stdout$ } from './MinerService';
import { GpuStatistic, MinerStatistic, gpuStatistics$, minerStatistics$ } from '../../models';
import { LolMinerLineParsers } from './scrapers/LolMiner';

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

stdout$.subscribe((line) => {
  const handler = handlers.find((h) => h.match.test(line) === true);

  // eslint-disable-next-line no-console
  console.log(`Parsing line: xxx${line}xxx`);
  // eslint-disable-next-line no-console
  console.log(`Parsing handler: ${handler?.match}`);

  handler?.parse(
    line.trim(),
    (stat) => {
      // eslint-disable-next-line no-console
      console.log(`Matched gpu pattern for: ${handler?.match}`);

      const previous = gpuStatistics$.getValue();
      const oldStat = previous.find((s) => s.id === stat.id);
      const newStats = oldStat ? [...previous.filter((s) => s.id !== oldStat.id), combine(oldStat, stat)] : [...previous, stat];

      newStats.sort((a, b) => a.id.localeCompare(b.id ?? 0));
      gpuStatistics$.next(newStats);
    },
    (stat) => {
      // eslint-disable-next-line no-console
      console.log(`Matched miner pattern for: ${handler?.match}`);

      const previous = minerStatistics$.getValue();
      minerStatistics$.next(combine(previous, stat));
    }
  );
});

export function init() {
  minerStarted$.subscribe(({ miner }) => {
    clearStatistics();
    setHandlerPack(miner);
  });
}
