import { interval, withLatestFrom, map, filter } from 'rxjs';
import { minerState$, API_PORT } from '../../models';
import { minerApi } from '../../shared/MinerApi';
import { lolminerMonitor, nbminerMonitor, trexminerMonitor, MinerMonitor } from './monitors';

const UPDATE_INTERVAL = 1000 * 5;
const monitor$ = interval(UPDATE_INTERVAL);

export function enableMonitor() {
  const monitors = [nbminerMonitor, lolminerMonitor, trexminerMonitor];
  const monitorNames = monitors.map((m) => m.name);

  monitor$
    .pipe(
      withLatestFrom(minerState$),
      map(([, miner]) => ({ name: miner.miner, state: miner.state })),
      filter(({ state }) => state === 'active'),
      map(({ name }) => monitors.find((m) => m.name === name)),
      filter((m): m is MinerMonitor => m !== undefined)
    )
    .subscribe((monitor) => {
      // eslint-disable-next-line promise/catch-or-return
      minerApi.stats(API_PORT, monitor.statsUrl).then((result) => {
        // eslint-disable-next-line promise/always-return
        if (result !== '') {
          monitor.update(result);
        }
      });
    });

  // eslint-disable-next-line no-console
  console.log(`Enabled miner monitor support for: ${monitorNames.join(', ')}.`);
}
