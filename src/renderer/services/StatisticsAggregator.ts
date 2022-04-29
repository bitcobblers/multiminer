import { BehaviorSubject } from 'rxjs';
import { minerStarted$ } from './MinerService';
import { GpuStatistic, MinerStatistic } from '../../models';

export const gpuStatistics$ = new BehaviorSubject<GpuStatistic[]>([]);
export const minerStatistics$ = new BehaviorSubject<MinerStatistic>({});

export function clearStatistics() {
  gpuStatistics$.next([]);
  minerStatistics$.next({});
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
