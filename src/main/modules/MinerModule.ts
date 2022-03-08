import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as fs from 'fs';
import { IpcMainInvokeEvent } from 'electron';
import { SharedModule } from './SharedModule';
import { logger } from '../logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SendCallback = (channel: string, ...args: any[]) => void;
type LaunchResponse = string | null;

let miner: ChildProcessWithoutNullStreams | null = null;
let minerName: string | null = null;
let currentCoin: string | null = null;

export function handleExit(code: number | null, signal: NodeJS.Signals | null, send: SendCallback) {
  if (signal === 'SIGINT') {
    return;
  }

  send('ipc-minerExited', code);
  miner = null;
  minerName = null;
  currentCoin = null;

  logger.debug('Stopped miner with exit code %o', code);
}

export function handleError(error: Error, send: SendCallback) {
  logger.error('Failed to start miner: %o', error);
  send('ipc-minerError', error.message);
}

export function handleData(data: string, send: SendCallback) {
  send('ipc-minerData', data);
}

export function attachHandlers(proc: ChildProcessWithoutNullStreams, send: SendCallback) {
  proc
    .on('exit', (code, signal) => {
      handleExit(code, signal, send);
    })
    .stdout.setEncoding('utf8')
    .on('error', (error) => {
      handleError(error, send);
    })
    .on('data', (data) => {
      handleData(data, send);
    });
}

export function launch(path: string, args: string, onError: (error: string) => LaunchResponse, onSuccess: (proc: ChildProcessWithoutNullStreams) => LaunchResponse) {
  if (fs.existsSync(path) === false) {
    return onError(`The path to the miner could not be found: ${path}.`);
  }

  try {
    fs.accessSync(path, fs.constants.X_OK);
  } catch (error) {
    return onError(`The miner is not executable: ${error}`);
  }

  return onSuccess(spawn(path, args.split(' ')));
}

function start(event: IpcMainInvokeEvent, name: string, coin: string, path: string, args: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow
  const send = (channel: string, ...args: any[]) => event.sender.send(channel, ...args);

  return launch(
    path,
    args,
    (error) => {
      logger.error('Miner failed to start: %s', error);
      return error;
    },
    (proc) => {
      miner = proc;
      minerName = name;
      currentCoin = coin;

      attachHandlers(proc, send);
      send('ipc-minerStarted', coin);
      logger.info('Started miner with at %s with args = %s', path, args);
      return null;
    }
  );
}

function stop(event: IpcMainInvokeEvent) {
  if (miner !== null) {
    miner.kill('SIGINT');
    event.sender.send('ipc-minerExited', miner.exitCode);
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
