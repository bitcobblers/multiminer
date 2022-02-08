export type ReceiveCallback = (data: string) => void;
export type ExitedCallback = (code: number | void) => void;

export interface MinerApi {
  start: (path: string, args: string) => Promise<string>;
  stop: () => Promise<void>;
  receive: (callback: ReceiveCallback) => Promise<void>;
  exited: (callback: ExitedCallback) => Promise<void>;
}

export const minerApi = window.miner;
