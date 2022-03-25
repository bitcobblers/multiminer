export interface AboutApi {
  getName: () => Promise<string>;
  getVersion: () => Promise<string>;
  getElectronVersion: () => Promise<string>;
  openBrowser: (url: string) => Promise<void>;
}

export const aboutApi = window.about ?? {
  getName: () => Promise.resolve(''),
  getVersion: () => Promise.resolve(''),
  getElectronVersion: () => Promise.resolve(''),
  openBrowser: () => Promise.resolve(),
};
