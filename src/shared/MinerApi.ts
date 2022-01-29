type ReceiveCallback = (data: string) => void;
type ExitedCallback = (code: number) => void;

export default interface MinerApi {
  start: (path: string, args: string) => Promise<string>;
  stop: () => Promise<void>;
  receive: (callback: ReceiveCallback) => Promise<void>;
  exited: (callback: ExitedCallback) => Promise<void>;
}
