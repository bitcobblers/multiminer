import { Subject } from 'rxjs';
import { minerApi } from '../../shared/MinerApi';
import { minerErrors$ } from '../../models';

export const stdout$ = new Subject<string>();
export const minerExited$ = new Subject<number | void>();
export const minerStarted$ = new Subject<string>();

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

minerApi.exited((code: number | void) => {
  minerExited$.next(code);
});

minerApi.started((coin: string) => {
  minerStarted$.next(coin);
});

minerApi.error((message: string) => {
  minerErrors$.next(message);
});

export async function startMiner(name: string, coin: string, path: string, args: string) {
  // eslint-disable-next-line no-console
  console.log(`Starting miner with the following parameters: [ '${path}', '${args}' ]`);
  const error = await minerApi.start(name, coin, path, args);

  if (error !== null) {
    minerErrors$.next(error);
  }
}

export async function stopMiner() {
  // eslint-disable-next-line no-console
  console.log('Stopping miner.');
  await minerApi.stop();
}
