import electron, { IpcMainInvokeEvent } from 'electron';
import fs from 'fs';
import path from 'path';
import extract from 'extract-zip';
import { getDownloadUrl, getRestUrl } from '../httpHelper';
import { SharedModule } from './SharedModule';
import { logger } from '../logger';

async function downloadFile(url: string, savePath: string) {
  return getDownloadUrl(url).then(async (r) => {
    if (r.ok === false) {
      logger.error('Download failed: %s - %s', r.status, r.statusText);
      return false;
    }

    fs.writeFileSync(savePath, await r.buffer());
    logger.info('Finished downloading');
    return true;
  });
}

async function getMinerReleases(_event: IpcMainInvokeEvent, owner: string, repo: string) {
  return getRestUrl(`https://api.github.com/repos/${owner}/${repo}/releases`);
}

async function arrangeFiles(downloadPath: string) {
  const files = fs.readdirSync(downloadPath);

  logger.debug('Found %d files', files.length);

  files.forEach((f) => {
    logger.debug('Found file: %s', f);
  });

  if (files.length > 1) {
    return;
  }

  const sourcePath = path.join(downloadPath, files[0]);

  fs.readdirSync(sourcePath).forEach((file) => {
    const srcFile = path.join(sourcePath, file);
    const destFile = path.join(downloadPath, file);
    logger.debug('Moving %s to %s', srcFile, destFile);
    fs.renameSync(srcFile, destFile);
  });

  fs.rmdirSync(sourcePath);
}

async function downloadMiner(_event: IpcMainInvokeEvent, name: string, version: string, url: string) {
  const downloadPath = path.join(electron.app.getPath('userData'), name, version);
  const downloadFileName = path.join(downloadPath, 'miner.zip');

  logger.debug('Downloading %s/%s from %s', name, version, url);
  logger.debug('Download path: %s', downloadPath);

  if (fs.existsSync(downloadPath)) {
    logger.info('Miner already downloaded.');
    return true;
  }

  logger.debug('Creating folders.');
  fs.mkdirSync(downloadPath, { recursive: true });

  logger.info('Downloading miner.');
  if ((await downloadFile(url, downloadFileName)) === false) {
    return false;
  }

  logger.info('Extracting archive.');
  await extract(downloadFileName, { dir: downloadPath });

  logger.info('Removing archive.');
  fs.rmSync(downloadFileName);

  logger.info('Arraching files.');
  await arrangeFiles(downloadPath);

  logger.info('Successfully installed miner.');
  return true;
}

export const DownloadModule: SharedModule = {
  name: 'download',
  handlers: {
    'ipc-getMinerReleases': getMinerReleases,
    'ipc-downloadMiner': downloadMiner,
  },
};
