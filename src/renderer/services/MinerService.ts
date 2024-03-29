import { Subject } from 'rxjs';
import { minerApi } from '../../shared/MinerApi';
import { addAppNotice, MinerInfo } from '../../models';

export const stdout$ = new Subject<string>();
export const minerExited$ = new Subject<number | void>();
export const minerStarted$ = new Subject<{ coin: string }>();

export async function startMiner(profile: string, coin: string, miner: MinerInfo, version: string, args: string) {
  console.log(`Starting miner with the following parameters: ${args}`);
  const error = await minerApi.start(profile, coin, { name: miner.name, exe: miner.exe }, version, args);

  if (error !== null) {
    addAppNotice('error', error);
  }
}

export async function stopMiner() {
  const status = await minerApi.status();

  if (status.state === 'active') {
    console.log('Stopping miner.');

    await minerApi.stop();
  }
}

minerApi.receive((data: string) => {
  data
    .replace(/(\r\n)/gm, '\n')
    .trim()
    .split('\n')
    .filter((l) => l !== '')
    .forEach((l) => {
      stdout$.next(l);
    });
});

minerApi.started((coin: string) => {
  minerStarted$.next({ coin });
});

minerApi.exited((code: number | void) => {
  minerExited$.next(code);
});

minerApi.error((message: string) => {
  addAppNotice('error', message);
});
