import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { IpcMainInvokeEvent } from 'electron';
import { SharedModule } from './SharedModule';

let miner: ChildProcessWithoutNullStreams | null;

function start(event: IpcMainInvokeEvent, path: string, args: string) {
  miner = spawn(path, args.split(' '));
  miner
    .on('exit', (code) => {
      event.sender.send('ipc-minerExit', code);
    })
    .stdout.setEncoding('utf8')
    .on('data', (data) => {
      event.sender.send('ipc-minerData', data.toString());
    });

  return Promise.resolve('');
}

function stop(event: IpcMainInvokeEvent) {
  if (miner !== null) {
    miner.kill('SIGINT');
    event.sender.send('ipc-minerExit', miner.exitCode);
  }

  miner = null;
  return Promise.resolve('');
}

export const MinerModule: SharedModule = {
  name: 'miner',
  handlers: {
    'ipc-startMiner': start,
    'ipc-stopMiner': stop,
  },
};
