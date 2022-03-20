export interface DownloadApi {
  getMinerReleases: (owner: string, repo: string) => Promise<string>;
  downloadMiner: (name: string, version: string, url: string) => Promise<boolean>;
}

export const downloadApi = window.download ?? {
  getMinerReleases: () => Promise.resolve(''),
  downloadMiner: () => Promise.resolve(false),
};
