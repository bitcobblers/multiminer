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
  }
}

stdout$.subscribe((line) => {
  const handler = handlers.find((h) => h.match.test(line) === true);
  handler?.parse(line, addGpuStat, addMinerStat);
});

minerStarted$
  .pipe(
    withLatestFrom(minerState$),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    map(([_coin, state]) => ({
      state,
    }))
  )
  .subscribe(({ state }) => {
    if (state.state === 'active') {
      setHandlerPack(state.miner as string);
    } else {
      setHandlers([]);
    }
  });
