import { MinerApi } from '../../shared/MinerApi';
import { RollingBuffer } from './RollingBuffer';
import { Signal } from './SignalService';

export type ApiReceiveEvent = (data: string) => void;
export type ApiExitEvent = (code: number | void) => void;

export class MinerService {
  private readonly receiveHandlers = new Signal<string>();

  private readonly exitHandlers = new Signal<number | void>();

  private readonly api: MinerApi;

  public readonly buffer = new RollingBuffer();

  constructor(api: MinerApi) {
    this.api = api;

    this.api.receive((data: string) => {
      this.buffer.addContent(data);
      this.receiveHandlers.trigger(this.buffer.content);
    });

    this.api.exited((code: number | void) => {
      this.exitHandlers.trigger(code);
    });
  }

  async start(path: string, args: string) {
    this.buffer.clear();
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
