import { MinerName } from '../models';
import UnsubscribeMethod from './UnsubscribeMethod';

type ReceiveCallback = (data: string) => void;
type ExitedCallback = (code: number | void) => void;
type StartedCallback = (coin: string) => void;
type ErrorCallback = (message: string) => void;

export interface MinerApi {
  start: (profile: string, coin: string, miner: { name: MinerName; exe: string }, version: string, args: string) => Promise<string | null>;
  stop: () => Promise<void>;
  status: () => Promise<{ state: 'active' | 'inactive'; currentCoin: string; miner: MinerName }>;
  stats: (port: number) => Promise<string>;
  receive: (callback: ReceiveCallback) => Promise<UnsubscribeMethod>;
  exited: (callback: ExitedCallback) => Promise<UnsubscribeMethod>;
  started: (callback: StartedCallback) => Promise<UnsubscribeMethod>;
  error: (callback: ErrorCallback) => Promise<UnsubscribeMethod>;
}

export const minerApi = window.miner ?? {
  start: () => Promise.resolve(''),
  stop: () => Promise.resolve(),
  status: () => Promise.resolve({}),
  stats: () => Promise.resolve(''),
  receive: () => Promise.resolve(() => {}),
  exited: () => Promise.resolve(() => {}),
  started: () => Promise.resolve(() => {}),
  error: () => Promise.resolve(() => {}),
};
