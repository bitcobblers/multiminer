import { BehaviorSubject, Subject } from 'rxjs';
import { MinerState } from './MinerState';

export const minerErrors$ = new Subject<string>();
export const minerState$ = new BehaviorSubject<MinerState>({ state: 'inactive', currentCoin: null, miner: null });
