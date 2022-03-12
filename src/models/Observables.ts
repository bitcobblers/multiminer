import { BehaviorSubject, ReplaySubject, Subject, throttleTime } from 'rxjs';
import { ConfiguredCoin } from './ConfiguredCoin';
import { MinerState } from './MinerState';

const REFRESH_THROTTLE = 1000 * 30;

export const minerErrors$ = new Subject<string>();
export const minerState$ = new BehaviorSubject<MinerState>({ state: 'inactive', currentCoin: null, miner: null });
export const enabledCoins$ = new BehaviorSubject<ConfiguredCoin[]>([]);
export const refreshData$ = new ReplaySubject(Date.now()).pipe(throttleTime(REFRESH_THROTTLE));
