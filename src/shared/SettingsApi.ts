export interface SettingsApi {
  read: (key: string) => Promise<string>;
  write: (key: string, content: string) => Promise<void>;
}

const settingsApi = window.settings;

export const readSetting = settingsApi?.read ?? (async () => Promise.resolve(''));
export const writeSetting = settingsApi?.write ?? (async () => Promise.resolve());
