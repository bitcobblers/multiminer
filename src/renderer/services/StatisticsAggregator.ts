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
    map(([stat, aggregateStats]) => ({
      stat,
      aggregateStats,
    }))
  )
  .subscribe(({ stat, aggregateStats }) => {
    const oldStat = aggregateStats.find((s) => s.id === stat.id);
    const newStats = oldStat ? [...aggregateStats.filter((s) => s.id !== oldStat.id), combine(oldStat, stat)] : [...aggregateStats, stat];

    newStats.sort((a, b) => a.id.localeCompare(b.id ?? 0));
    gpuStatistics$.next(newStats);
  });

internalMinerStats$
  .pipe(
    withLatestFrom(minerStatistics$),
    map(([stat, currentStats]) => ({
      stat,
      currentStats,
    }))
  )
  .subscribe(({ stat, currentStats }) => {
    minerStatistics$.next(combine(currentStats, stat));
  });
