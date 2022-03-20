import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import electron, { IpcMainInvokeEvent } from 'electron';
import { SharedModule } from './SharedModule';
import { logger } from '../logger';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SendCallback = (channel: string, ...args: any[]) => void;

type LaunchHandlers = {
  onError: (error: string) => string;
  onSuccess: (proc: ChildProcessWithoutNullStreams) => null;
};

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

export function launch(exePath: string, args: string, handlers: LaunchHandlers) {
  if (fs.existsSync(exePath) === false) {
    return handlers.onError(`The path to the miner could not be found: ${exePath}.`);
  }

  try {
    fs.accessSync(exePath, fs.constants.X_OK);
  } catch (error) {
    return handlers.onError(`The miner is not executable: ${error}`);
  }

  return handlers.onSuccess(spawn(exePath, args.split(' ')));
}

function start(event: IpcMainInvokeEvent, name: string, coin: string, kind: string, exe: string, version: string, args: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow
  const send = (channel: string, ...args: any[]) => event.sender.send(channel, ...args);
  const exePath = path.join(electron.app.getPath('userData'), kind, version, exe);

  return launch(exePath, args, {
    onError: (error: string) => {
      logger.error('Miner failed to start: %s', error);
      return error;
    },
    onSuccess: (proc: ChildProcessWithoutNullStreams) => {
      miner = proc;
      minerName = name;
      currentCoin = coin;

      attachHandlers(proc, send);
      send('ipc-minerStarted', coin, minerName);
      logger.info('Started miner with at %s with args = %s', exePath, args);
      return null;
    },
  });
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
