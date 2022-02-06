import { MinerApi } from '../../shared/MinerApi';
import { Signal } from './SignalService';

export type ApiReceiveEvent = (data: string) => void;
export type ApiExitEvent = (code: number | void) => void;

export class MinerService {
  private readonly receiveHandlers = new Signal<string>();

  private readonly exitHandlers = new Signal<number | void>();

  private readonly api: MinerApi;

  constructor(api: MinerApi) {
    this.api = api;

    this.api.receive((data: string) => {
      const parsedData = data.replace(/(\r\n)/gm, '\n');

      parsedData.split('\n').forEach((line) => {
        this.receiveHandlers.trigger(line);
      });
    });

    this.api.exited((code: number | void) => {
      this.exitHandlers.trigger(code);
    });
  }

  async start(path: string, args: string) {
    await this.api.stop();
    return this.api.start(path, args);
  }

  async stop() {
    await this.api.stop();
  }

  onReceive(handler: ApiReceiveEvent) {
    this.receiveHandlers.on(handler);
  }

  onExit(handler: ApiExitEvent) {
    this.exitHandlers.on(handler);
  }

  offReceive(handler: ApiReceiveEvent) {
    this.receiveHandlers.off(handler);
  }

  offExit(handler: ApiExitEvent) {
    this.exitHandlers.off(handler);
  }
}
