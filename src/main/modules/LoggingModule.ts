import { exec } from 'child_process';
import { SharedModule } from './SharedModule';
import { getLoggingPath } from '../logger';

function openLogFolder() {
  exec(`explorer "${getLoggingPath()}"`);
}

export const LoggingModule: SharedModule = {
  name: 'logging',
  handlers: {
    'ipc-openLogFolder': openLogFolder,
  },
};
