type ReceiveCallback = (data: string) => void;
type ExitedCallback = (code: number | void) => void;

export interface MinerApi {
  start: (path: string, args: string) => Promise<string>;
  stop: () => Promise<void>;
  receive: (callback: ReceiveCallback) => Promise<void>;
  exited: (callback: ExitedCallback) => Promise<void>;
}

const minerApi = window.miner;

export const start = minerApi?.start ?? (() => Promise.resolve(''));
export const stop = minerApi?.stop ?? (() => Promise.resolve());
export const receive = minerApi?.receive ?? (() => Promise.resolve());
export const exited = minerApi?.exited ?? (() => Promise.resolve());
