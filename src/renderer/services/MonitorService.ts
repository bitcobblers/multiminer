import { interval, withLatestFrom, map, filter } from 'rxjs';
import { minerState$, API_PORT } from '../../models';
import { minerApi } from '../../shared/MinerApi';
import { lolminerMonitor, nanominerCudaMonitor, nbminerMonitor, trexminerMonitor } from './monitors';

const UPDATE_INTERVAL = 1000 * 5;
const monitor$ = interval(UPDATE_INTERVAL);

export function enableMonitors() {
  const monitors = [nbminerMonitor, lolminerMonitor, trexminerMonitor, nanominerCudaMonitor];
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
        minerApi.stats(API_PORT, monitor.statsUrl).then((result) => {
          if (result !== '') {
            monitor.update(result);
          }
        });
      }
    });

  console.log(`Enabled miner monitor support for: ${monitorNames.join(', ')}.`);
}
