import { Subject } from 'rxjs';
import { minerApi } from '../../shared/MinerApi';

export const stdout = new Subject<string>();

minerApi.receive((data: string) => {
  data
    .replace(/(\r\n)/gm, '\n')
    .split('\n')
    .forEach((line) => stdout.next(line));
});

export async function startMiner(path: string, args: string) {
  // eslint-disable-next-line no-console
  console.log(`Starting miner with the following parameters: [ '${path}', '${args}' ]`);
  await minerApi.start(path, args);
}

export async function stopMiner() {
  // eslint-disable-next-line no-console
  console.log('Stopping miner.');
  await minerApi.stop();
}
