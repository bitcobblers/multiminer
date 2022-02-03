import MinerApi from '../../shared/MinerApi';
import { RollingBuffer } from './RollingBuffer';

export type ApiReceiveEvent = (data: string) => void;
export type ApiExitEvent = (code: number | void) => void;

export class MinerService {
  private readonly receiveHandlers = [] as ApiReceiveEvent[];

  private readonly exitHandlers = [] as ApiExitEvent[];

  private readonly api: MinerApi;

  public readonly buffer = new RollingBuffer();

  constructor(api: MinerApi) {
    this.api = api;

    this.api.receive((data: string) => {
      this.buffer.addContent(data);

      this.receiveHandlers.forEach((h) => {
        h(this.buffer.content);
      });
    });

    this.api.exited((code: number) => {
      this.exitHandlers.forEach((h) => {
        h(code);
      });
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
    this.receiveHandlers.push(handler);
  }

  onExit(handler: ApiExitEvent) {
    this.exitHandlers.push(handler);
  }

  offReceive(handler: ApiReceiveEvent) {
    const index = this.receiveHandlers.findIndex((h) => h === handler);

    if (index !== -1) {
      this.receiveHandlers.splice(index, 1);
    }
  }

  offExit(handler: ApiExitEvent) {
    const index = this.exitHandlers.findIndex((h) => h === handler);

    if (index !== -1) {
      this.exitHandlers.splice(index, 1);
    }
  }
}
