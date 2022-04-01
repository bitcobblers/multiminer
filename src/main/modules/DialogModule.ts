import { dialog, OpenDialogOptions, SaveDialogOptions } from 'electron';
import { SharedModule } from './SharedModule';
import { mainWindow } from '../main';

async function getSavePath() {
  const options: OpenDialogOptions = {
    title: 'Select a folder',
    properties: ['openDirectory'],
  };

  const result = await dialog.showOpenDialog(mainWindow.window, options);

  return result.canceled ? '' : result.filePaths[0];
}

async function getSaveFile() {
  const options: SaveDialogOptions = {
    title: 'Select a path to save to',
    properties: ['showOverwriteConfirmation'],
    filters: [{ name: 'Settings Files', extensions: ['json'] }],
  };

  const result = await dialog.showSaveDialog(mainWindow.window, options);

  return result.canceled ? '' : result.filePath;
}

async function getOpenFile() {
  const options: OpenDialogOptions = {
    title: 'Select a path to save to',
    filters: [{ name: 'Settings Files', extensions: ['json'] }],
  };

  const result = await dialog.showOpenDialog(mainWindow.window, options);

  return result.canceled ? '' : result.filePaths[0];
}

export const DialogModule: SharedModule = {
  name: 'dialog',
  handlers: {
    'ipc-selectFolder': getSavePath,
    'ipc-selectSaveFile': getSaveFile,
    'ipc-selectOpenFile': getOpenFile,
  },
};
