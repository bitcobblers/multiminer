import { BehaviorSubject, Subject } from 'rxjs';
import { ConfiguredCoin } from './ConfiguredCoin';
import { MinerState } from './MinerState';

export const appNotice$ = new Subject<{ variant: 'default' | 'error' | 'success' | 'warning' | 'info'; message: string }>();
export const minerErrors$ = new Subject<string>();
export const minerState$ = new BehaviorSubject<MinerState>({ state: 'inactive', currentCoin: null });
export const enabledCoins$ = new BehaviorSubject<ConfiguredCoin[]>([]);
export const refreshData$ = new Subject<number>();
