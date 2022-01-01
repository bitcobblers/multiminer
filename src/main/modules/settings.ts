import { IpcMain } from 'electron';
import Store from 'electron-store';

export function LoadSettingsHandlers(ipc: IpcMain) {
  const store = new Store();

  ipc.handle('ipc-readSetting', async (event, arg) => {
    console.log(`ipc-readSetting invoked with: ${arg}`);

    if (store.has(arg)) {
      return store.get(arg);
    }

    return '';
  });

  ipc.handle('ipc-writeSetting', (event, arg) => {
    console.log(`ipc-writeSetting invoked with: ${arg}`);
  });
}
