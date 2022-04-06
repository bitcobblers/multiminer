import { spawn, ChildProcessWithoutNullStreams, execSync } from 'child_process';
import * as fs from 'fs';
import path from 'path';
import electron, { IpcMainInvokeEvent } from 'electron';
import { getRestUrl } from '../httpHelper';
import { SharedModule } from './SharedModule';
import { logger } from '../logger';

type MinerInfo = { name: string; exe: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SendCallback = (channel: string, ...args: any[]) => void;

type LaunchHandlers = {
  onError: (error: string) => string;
  onSuccess: (proc: ChildProcessWithoutNullStreams) => null;
};

let child: ChildProcessWithoutNullStreams | null = null;
let minerProfile: string | null = null;
let minerInfo: MinerInfo | null = null;
let currentCoin: string | null = null;

export function handleExit(code: number | null, send: SendCallback) {
  send('ipc-minerExited', code);
  child = null;
  minerProfile = null;
  minerInfo = null;
  currentCoin = null;

  logger.info('Stopped miner with exit code %o', code);
}

export function handleError(error: Error, send: SendCallback) {
  logger.error('Failed to start miner: %o', error);
  send('ipc-minerError', error.message);
}

export function handleData(data: string, send: SendCallback) {
  send('ipc-minerData', data);
}

export function attachHandlers(proc: ChildProcessWithoutNullStreams, send: SendCallback) {
  proc.on('exit', (code) => {
    handleExit(code, send);
  });

  proc.stderr.setEncoding('utf-8').on('data', (data) => {
    handleData(data, send);
  });

  proc.stdout
    .setEncoding('utf-8')
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

function getMinerProcesses(exe: string | undefined) {
  if (exe === undefined) {
    return [];
  }

  return execSync('tasklist /fo table /nh')
    .toString('utf-8')
    .split('\r\n')
    .map((line) => line.split(/\s+/))
    .filter(([name]) => name.toLowerCase() === exe.toLowerCase())
    .map(([, pid]) => Number(pid));
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
      child = proc;
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

function stop() {
  if (child?.pid !== undefined) {
    getMinerProcesses(minerInfo?.exe).forEach((pid) => {
      logger.debug('Killing process: %s', pid);
      process.kill(pid);
    });
  }
}

function status() {
  return {
    state: child === null ? 'inactive' : 'active',
    currentCoin,
    profile: minerProfile,
    miner: minerInfo?.name,
  };
}

function stats(_event: IpcMainInvokeEvent, port: number, args: string) {
  return getRestUrl(`http://localhost:${port}/${args}`, true);
}

export const MinerModule: SharedModule = {
  name: 'miner',
  handlers: {
    'ipc-startMiner': start,
    'ipc-stopMiner': stop,
    'ipc-statusMiner': status,
    'ipc-statsMiner': stats,
  },
};
