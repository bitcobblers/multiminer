import { BehaviorSubject, filter, map, merge, withLatestFrom } from 'rxjs';
import { minerStarted$ } from './MinerService';
import { CpuStatistic, GpuStatistic, MinerStatistic, minerState$ } from '../../models';

export const cpuStatistics$ = new BehaviorSubject<CpuStatistic>({});
export const gpuStatistics$ = new BehaviorSubject<GpuStatistic[]>([]);
export const minerStatistics$ = new BehaviorSubject<MinerStatistic>({});

export const currentHashrate$ = merge(minerStatistics$, cpuStatistics$).pipe(
  withLatestFrom(minerState$),
  filter(([,state]) => state.state === 'active'),
  map(([stat, state]) => ({
    scale: state.algorithm?.kind === 'GPU' ? 'M' : 'K' as 'M' | 'K',
    hashrate: stat.hashrate,
  })),
);

export function clearStatistics() {
  cpuStatistics$.next({});
  gpuStatistics$.next([]);
  minerStatistics$.next({});
}

export function addCpuStat(stat: CpuStatistic) {
  cpuStatistics$.next(stat);
}

export function addGpuStats(stats: GpuStatistic[]) {
  gpuStatistics$.next(stats);
}

export function addMinerStat(stat: MinerStatistic) {
  minerStatistics$.next(stat);
}

minerStarted$.subscribe(() => {
  clearStatistics();
});
