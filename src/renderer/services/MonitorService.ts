import { interval, withLatestFrom, map, filter } from 'rxjs';
import { minerState$, API_PORT } from '../../models';
import { minerApi } from '../../shared/MinerApi';
import { lolminerMonitor, nbminerMonitor, trexminerMonitor, xmrigMonitor } from './monitors';

const UPDATE_INTERVAL = 1000 * 5;
const monitor$ = interval(UPDATE_INTERVAL);

export function enableMonitors() {
  const monitors = [nbminerMonitor, lolminerMonitor, trexminerMonitor, xmrigMonitor];
  const monitorNames = monitors.map((m) => m.name);

  monitor$
    .pipe(
      withLatestFrom(minerState$),
      map(([, miner]) => ({ state: miner.state })),
      filter(({ state }) => state === 'active'),
    )
    .subscribe(async () => {
      const status = await minerApi.status();
      const monitor = monitors.find((m) => m.name === status.miner);

      if (monitor) {
        const results = await Promise.allSettled(monitor.statsUrls.map(async (url) => minerApi.stats(API_PORT, url)));
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const stats = results.filter(({ status }) => status === 'fulfilled').map((p) => (p as PromiseFulfilledResult<string>).value);

        monitor.update(stats);
      }
    });

  console.log(`Enabled miner monitor support for: ${monitorNames.join(', ')}.`);
}
