import { BehaviorSubject, Subject } from 'rxjs';
import { MinerState } from './MinerState';
import { GpuStatistic, MinerStatistic } from './Aggregates';

export const minerErrors$ = new Subject<string>();
export const minerState$ = new BehaviorSubject<MinerState>({ state: 'inactive', currentCoin: null, miner: null });
export const gpuStatistics$ = new BehaviorSubject<GpuStatistic[]>([]);
export const minerStatistics$ = new BehaviorSubject<MinerStatistic>({});
