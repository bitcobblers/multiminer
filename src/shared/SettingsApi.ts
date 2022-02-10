export interface SettingsApi {
  read: (key: string) => Promise<string>;
  write: (key: string, content: string) => Promise<void>;
}

export const settingsApi = window.settings ?? {
  read: async () => Promise.resolve(''),
  write: async () => Promise.resolve(),
};
