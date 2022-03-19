import electron, { IpcMainInvokeEvent } from 'electron';
import fs from 'fs';
import path from 'path';
import StreamZip from 'node-stream-zip';
import { getDownloadUrl, getRestUrl } from '../util';
import { SharedModule } from './SharedModule';
import { logger } from '../logger';

async function delay(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

async function downloadFile(url: string, savePath: string) {
  return getDownloadUrl(url).then((r) => {
    if (r.ok === false) {
      logger.error('An error occurred while calling downloading: %s - %s', r.status, r.statusText);
      return false;
    }

    r.body.pipe(fs.createWriteStream(savePath, { autoClose: true }));
    logger.info('Finished downloading');
    return true;
  });
}

async function extractArchive(savePath: string, destination: string) {
  // eslint-disable-next-line new-cap
  const zip = new StreamZip.async({ file: savePath });
  await zip.extract(null, destination);
  await zip.close();
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
  const downloadResult = await downloadFile(url, downloadFileName);

  if (downloadResult === false) {
    logger.error('Failed to download miner.');
    return false;
  }

  logger.debug('Pausing 1s');
  await delay(1);

  logger.debug('Extracting archive.');
  extractArchive(downloadFileName, downloadPath);

  logger.debug('Removing archive at %s', downloadFileName);
  fs.rmSync(downloadFileName);

  logger.debug('Pausing 1s');
  await delay(1);

  logger.debug('Arranging files.');
  arrangeFiles(downloadPath);

  logger.info('Completed installing miner.');
  return true;
}

export const DownloadModule: SharedModule = {
  name: 'download',
  handlers: {
    'ipc-getMinerReleases': getMinerReleases,
    'ipc-downloadMiner': downloadMiner,
  },
};
