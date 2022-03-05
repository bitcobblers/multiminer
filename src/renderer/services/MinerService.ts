import { Subject } from 'rxjs';
import { minerApi } from '../../shared/MinerApi';

export const stdout$ = new Subject<string>();
export const minerExited$ = new Subject<number | void>();
export const minerStarted$ = new Subject<string>();

minerApi.receive((data: string) => {
  data
    .replace(/(\r\n)/gm, '\n')
    .split('\n')
    .forEach((line) => stdout$.next(line));
});

minerApi.exited((code: number | void) => {
  minerExited$.next(code);
});

minerApi.started((coin: string) => {
  minerStarted$.next(coin);
});

export async function startMiner(name: string, coin: string, path: string, args: string) {
  // eslint-disable-next-line no-console
  console.log(`Starting miner with the following parameters: [ '${path}', '${args}' ]`);
  await minerApi.start(name, coin, path, args);
}

export async function stopMiner() {
  // eslint-disable-next-line no-console
  console.log('Stopping miner.');
  await minerApi.stop();
}
