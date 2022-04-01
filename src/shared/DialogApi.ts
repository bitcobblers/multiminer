export interface DialogApi {
  getPath: () => Promise<string>;
  getSaveFile: () => Promise<string>;
  getOpenFile: () => Promise<string>;
}

export const dialogApi = window.dialog ?? {
  getPath: () => Promise.resolve(''),
  getSaveFile: () => Promise.resolve(''),
  getOpenFile: () => Promise.resolve(''),
};
