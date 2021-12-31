export type SettingsApi = {
  read: () => Promise<string>;
  write: (settings: string) => Promise<void>;
};

export interface IElectronApi {
  settings: SettingsApi;
}
