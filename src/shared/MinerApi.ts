import { MinerName } from '../models';

type ReceiveCallback = (data: string) => void;
type ExitedCallback = (code: number | void) => void;
type StartedCallback = (coin: string) => void;
type ErrorCallback = (message: string) => void;

export interface MinerApi {
  start: (profile: string, coin: string, miner: { name: MinerName; exe: string }, version: string, args: string) => Promise<string | null>;
  stop: () => Promise<void>;
  status: () => Promise<{ state: 'active' | 'inactive'; currentCoin: string; miner: MinerName }>;
  stats: (port: number) => Promise<string>;
  receive: (callback: ReceiveCallback) => Promise<void>;
  exited: (callback: ExitedCallback) => Promise<void>;
  started: (callback: StartedCallback) => Promise<void>;
  error: (callback: ErrorCallback) => Promise<void>;
}

export const minerApi = window.miner ?? {
  start: () => Promise.resolve(''),
  stop: () => Promise.resolve(),
  status: () => Promise.resolve({}),
  stats: () => Promise.resolve(''),
  receive: () => Promise.resolve(),
  exited: () => Promise.resolve(),
  started: () => Promise.resolve(),
  error: () => Promise.resolve(),
};
