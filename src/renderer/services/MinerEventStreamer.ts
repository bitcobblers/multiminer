import { withLatestFrom, map } from 'rxjs';

import { minerStarted$, stdout$ } from './MinerService';
import { GpuStatistic, minerState$, MinerStatistic } from '../../models';
import { LolMinerLineParsers } from './scrapers/LolMiner';
import { addMinerStat, addGpuStat } from './StatisticsAggregator';

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

    // eslint-disable-next-line no-console
    console.log(`Set handler pack to ${name}`);
  }
}

stdout$.subscribe((line) => {
  const handler = handlers.find((h) => h.match.test(line) === true);
  handler?.parse(line, addGpuStat, addMinerStat);
});

minerState$.subscribe((state) => {
  if (state.state === 'active') {
    setHandlerPack(state.miner as string);
  } else {
    setHandlers([]);
  }
});

export function useScreenScraper() {
  // eslint-disable-next-line no-console
  console.log('Using screen scraper');
}
