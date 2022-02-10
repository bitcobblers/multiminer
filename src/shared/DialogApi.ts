export interface DialogApi {
  getPath: () => Promise<string>;
}

export const dialogApi = window.dialog ?? {
  getPath: () => Promise.resolve(''),
};
