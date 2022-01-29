import MinerApi from '../../shared/MinerApi';

type ReceiveEvent = (data: string) => void;
type ExitEvent = (code: number | void) => void;

export class MinerService {
  private readonly receiveHandlers = [] as ReceiveEvent[];

  private readonly exitHandlers = [] as ExitEvent[];

  private readonly api: MinerApi;

  constructor(api: MinerApi) {
    this.api = api;

    this.api.receive((data: string) => {
      // eslint-disable-next-line no-console
      console.log(`data: ${data}`);

      this.receiveHandlers.forEach((h) => {
        h(data);
      });
    });

    this.api.exited((code: number) => {
      // eslint-disable-next-line no-console
      console.log(`exited with code: ${code}`);

      this.exitHandlers.forEach((h) => {
        h(code);
      });
    });
  }

  async start(path: string, args: string) {
    return this.api.start(path, args);
  }

  async stop() {
    return this.api.stop();
  }

  onReceive(handler: ReceiveEvent) {
    this.receiveHandlers.push(handler);
  }

  onExit(handler: ExitEvent) {
    this.exitHandlers.push(handler);
  }

  offReceive(handler: ReceiveEvent) {
    const index = this.receiveHandlers.findIndex((h) => h === handler);

    if (index !== -1) {
      this.receiveHandlers.splice(index, 1);
    }
  }

  offExit(handler: ExitEvent) {
    const index = this.exitHandlers.findIndex((h) => h === handler);

    if (index !== -1) {
      this.exitHandlers.splice(index, 1);
    }
  }
}
