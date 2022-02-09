import { Subject } from 'rxjs';
import { start, stop, receive } from '../../shared/MinerApi';

export const stdout = new Subject<string>();

receive((data: string) => {
  data
    .replace(/(\r\n)/gm, '\n')
    .split('\n')
    .forEach((line) => stdout.next(line));
});

export async function startMiner(path: string, args: string) {
  await start(path, args);
}

export async function stopMiner() {
  await stop();
}
