import { BehaviorSubject, Subject, withLatestFrom, map } from 'rxjs';
import { minerStarted$ } from './MinerService';
import { GpuStatistic, MinerStatistic } from '../../models';

export const gpuStatistics$ = new BehaviorSubject<GpuStatistic[]>([]);
export const minerStatistics$ = new BehaviorSubject<MinerStatistic>({});

const internalGpuStats$ = new Subject<GpuStatistic>();
const internalMinerStats$ = new Subject<MinerStatistic>();

function combine<T>(item: T, other: Partial<T>) {
  return { ...item, ...other };
}

export function clearStatistics() {
  gpuStatistics$.next([]);
  minerStatistics$.next({});
}
export function addGpuStat(stat: GpuStatistic) {
  internalGpuStats$.next(stat);
}

export function addMinerStat(stat: MinerStatistic) {
  internalMinerStats$.next(stat);
}

minerStarted$.subscribe(() => {
  clearStatistics();
});

internalGpuStats$
  .pipe(
    withLatestFrom(gpuStatistics$),
    map(([stat, allStats]) => ({
      newStat: stat,
      oldStat: allStats.find((s) => s.id === stat.id),
      allStats,
    })),
    map(({ newStat, oldStat, allStats }) => (oldStat ? [...allStats.filter((s) => s.id !== oldStat.id), combine(oldStat, newStat)] : [...allStats, newStat])),
    map((stats) => stats.sort((a, b) => a.id.localeCompare(b.id ?? 0)))
  )
  .subscribe((x) => gpuStatistics$.next(x));

internalMinerStats$
  .pipe(
    withLatestFrom(minerStatistics$),
    map(([stat, currentStats]) => combine(currentStats, stat))
  )
  .subscribe((x) => minerStatistics$.next(x));
