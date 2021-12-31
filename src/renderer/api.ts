export type SettingsApi = {
  readSettings: () => Promise<string>;
  writeSettings: (settings: string) => Promise<void>;
};

export interface IElectronApi {
  serviceSettings: SettingsApi;
}
