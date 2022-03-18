import { IpcMainInvokeEvent } from 'electron';
import { getUrl } from '../util';
import { SharedModule } from './SharedModule';

async function getMinerReleases(_event: IpcMainInvokeEvent, owner: string, repo: string) {
  return getUrl(`https://api.github.com/repos/${owner}/${repo}/releases`);
}

export const DownloadModule: SharedModule = {
  name: 'download',
  handlers: {
    'ipc-getMinerReleases': getMinerReleases,
  },
};
