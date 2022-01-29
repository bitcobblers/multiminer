import MinerApi from '../../shared/MinerApi';

export class MinerService {
  private readonly api: MinerApi;

  constructor(api: MinerApi) {
    this.api = api;

    this.api.receive((data: string) => {
      // eslint-disable-next-line no-console
      console.log(`data: ${data}`);
    });

    this.api.exited((code: number) => {
      // eslint-disable-next-line no-console
      console.log(`exited with code: ${code}`);
    });
  }

  async start(path: string, args: string) {
    return this.api.start(path, args);
  }

  async stop() {
    return this.api.stop();
  }
}
