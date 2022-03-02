import { dialog, IpcMainInvokeEvent, OpenDialogOptions } from 'electron';
import { SharedModule } from './SharedModule';
import { mainWindow } from '../main';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getPath = async (_event: IpcMainInvokeEvent): Promise<string> => {
  const options: OpenDialogOptions = {
    title: 'Select a folder',
    properties: ['openDirectory'],
  };

  const result = await dialog.showOpenDialog(mainWindow.window, options);

  return result.canceled ? '' : result.filePaths[0];
};

export const DialogModule: SharedModule = {
  name: 'dialog',
  handlers: {
    'ipc-selectFolder': getPath,
  },
};
