import { BehaviorSubject, Subject } from 'rxjs';
import { ConfiguredCoin } from './ConfiguredCoin';
import { MinerState } from './MinerState';

type VariantType = 'default' | 'error' | 'success' | 'warning' | 'info';

export const appNotice$ = new Subject<{ variant: VariantType; message: string }>();
export const minerState$ = new BehaviorSubject<MinerState>({ state: 'inactive', currentCoin: null });
export const enabledCoins$ = new BehaviorSubject<ConfiguredCoin[]>([]);
export const refreshData$ = new Subject<number>();

export function addAppNotice(variant: VariantType, message: string) {
  appNotice$.next({ variant, message });
}
