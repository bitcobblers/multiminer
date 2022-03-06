import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import { IpcMainInvokeEvent } from 'electron';
import { SharedModule } from './SharedModule';
import { logger } from '../logger';

let miner: ChildProcessWithoutNullStreams | null = null;
let minerName: string | null = null;
let currentCoin: string | null = null;

function start(event: IpcMainInvokeEvent, name: string, coin: string, path: string, args: string) {
  miner = spawn(path, args.split(' '));
  minerName = name;
  currentCoin = coin;

  event.sender.send('ipc-minerStarted', currentCoin);

  miner
    .on('exit', (code, signal) => {
      if (signal === 'SIGINT') {
        return;
      }

      event.sender.send('ipc-minerExited', code);
      miner = null;
      minerName = null;
      currentCoin = null;

      logger.debug('Stopped miner with exit code %o', code);
    })
    .stdout.setEncoding('utf8')
    .on('data', (data) => {
      event.sender.send('ipc-minerData', data.toString());
    });

  logger.debug('Started miner: Name: %s, Coin: %s, Path: %s, Args: %s', name, coin, path, args);
}

function stop(event: IpcMainInvokeEvent) {
  if (miner !== null) {
    miner.kill('SIGINT');
    event.sender.send('ipc-minerExit', miner.exitCode);

    logger.debug('Stopped miner with exit code %o', miner.exitCode);

    miner = null;
    minerName = null;
    currentCoin = null;
  }
}

function status() {
  return {
    state: miner === null ? 'inactive' : 'active',
    currentCoin,
    miner: minerName,
  };
}

export const MinerModule: SharedModule = {
  name: 'miner',
  handlers: {
    'ipc-startMiner': start,
    'ipc-stopMiner': stop,
    'ipc-statusMiner': status,
  },
};
