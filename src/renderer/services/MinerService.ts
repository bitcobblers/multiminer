/* eslint-disable promise/always-return */
/* eslint-disable promise/catch-or-return */
import { Subject } from 'rxjs';
import { minerApi } from '../../shared/MinerApi';
import { minerErrors$, MinerInfo } from '../../models';
import { SubscriptionService } from './SubscriptionService';

export const stdout$ = new Subject<string>();
export const minerExited$ = new Subject<number | void>();
export const minerStarted$ = new Subject<{ coin: string }>();

export async function startMiner(profile: string, coin: string, miner: MinerInfo, version: string, args: string) {
  // eslint-disable-next-line no-console
  console.log(`Starting miner with the following parameters: ${args}`);
  const error = await minerApi.start(profile, coin, { name: miner.name, exe: miner.exe }, version, args);

  if (error !== null) {
    minerErrors$.next(error);
  }
}

export async function stopMiner() {
  const status = await minerApi.status();

  if (status.state === 'active') {
    // eslint-disable-next-line no-console
    console.log('Stopping miner.');

    await minerApi.stop();
  }
}

class MinerService extends SubscriptionService {
  constructor() {
    super('MinerService');
  }

  public async load() {
    this.addSubscription(
      await minerApi.receive((data: string) => {
        data
          .replace(/(\r\n)/gm, '\n')
          .trim()
          .split('\n')
          .filter((l) => l !== '')
          .forEach((l) => {
            stdout$.next(l);
          });
      })
    );

    this.addSubscription(
      await minerApi.exited((code: number | void) => {
        minerExited$.next(code);
      })
    );

    this.addSubscription(
      await minerApi.started((coin: string) => {
        minerStarted$.next({ coin });
      })
    );

    this.addSubscription(
      await minerApi.error((message: string) => {
        minerErrors$.next(message);
      })
    );
  }
}

export default new MinerService();
