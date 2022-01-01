export type SettingsApi = {
  read: (key: string) => Promise<string>;
  write: (key: string, content: string) => Promise<void>;
};

export interface IElectronApi {
  settings: SettingsApi;
}
