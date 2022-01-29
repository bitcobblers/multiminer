import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { IpcMainInvokeEvent } from 'electron';
import SharedModule from './SharedModule';

export default class MinerModule implements SharedModule {
  miner?: ChildProcessWithoutNullStreams;

  name = 'miner';

  handlers = {
    'ipc-startMiner': this.start.bind(this),
    'ipc-stopMiner': this.stop.bind(this),
  };

  reset = () => {};

  start(event: IpcMainInvokeEvent, path: string, args: string) {
    this.miner = spawn(path, args.split(' '));
    this.miner
      .on('exit', (code) => {
        event.sender.send('ipc-minerExit', code);
      })
      .stdout.setEncoding('utf8')
      .on('data', (data) => {
        event.sender.send('ipc-minerData', data.toString());
      });

    return Promise.resolve('');
  }

  stop(event: IpcMainInvokeEvent) {
    if (this.miner !== undefined) {
      this.miner.kill('SIGINT');
      event.sender.send('ipc-minerExit', this.miner.exitCode);
    }

    this.miner = undefined;
    return Promise.resolve('');
  }
}
