export interface DownloadApi {
  getMinerReleases: (owner: string, repo: string) => Promise<string>;
}

export const downloadApi = window.download ?? {
  getMinerReleases: () => Promise.resolve(''),
};
