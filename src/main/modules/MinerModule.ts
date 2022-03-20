import { spawn, ChildProcessWithoutNullStreams } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import electron, { IpcMainInvokeEvent } from 'electron';
import { SharedModule } from './SharedModule';
import { logger } from '../logger';

type MinerInfo = { name: string; exe: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SendCallback = (channel: string, ...args: any[]) => void;

type LaunchHandlers = {
  onError: (error: string) => string;
  onSuccess: (proc: ChildProcessWithoutNullStreams) => null;
};

let process: ChildProcessWithoutNullStreams | null = null;
let minerProfile: string | null = null;
let minerInfo: MinerInfo | null = null;
let currentCoin: string | null = null;

export function handleExit(code: number | null, signal: NodeJS.Signals | null, send: SendCallback) {
  if (signal === 'SIGINT') {
    return;
  }

  send('ipc-minerExited', code);
  process = null;
  minerProfile = null;
  minerInfo = null;
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

function start(event: IpcMainInvokeEvent, profile: string, coin: string, miner: MinerInfo, version: string, args: string) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-shadow
  const send = (channel: string, ...args: any[]) => event.sender.send(channel, ...args);
  const exePath = path.join(electron.app.getPath('userData'), miner.name, version, miner.exe);

  return launch(exePath, args, {
    onError: (error: string) => {
      logger.error('Miner failed to start: %s', error);
      return error;
    },
    onSuccess: (proc: ChildProcessWithoutNullStreams) => {
      process = proc;
      minerProfile = profile;
      minerInfo = miner;
      currentCoin = coin;

      attachHandlers(proc, send);
      send('ipc-minerStarted', coin);
      logger.info('Started miner with at %s with args = %s', exePath, args);
      return null;
    },
  });
}

function stop(event: IpcMainInvokeEvent) {
  if (process !== null) {
    process.kill('SIGINT');
    event.sender.send('ipc-minerExited', process.exitCode);
    logger.debug('Stopped miner with exit code %o', process.exitCode);

    process = null;
    minerProfile = null;
    minerInfo = null;
    currentCoin = null;
  }
}

function status() {
  return {
    state: process === null ? 'inactive' : 'active',
    currentCoin,
    profile: minerProfile,
    miner: minerInfo?.name,
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
