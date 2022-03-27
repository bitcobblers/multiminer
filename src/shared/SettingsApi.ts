import UnsubscribeMethod from './UnsubscribeMethod';

export interface SettingsApi {
  read: (key: string) => Promise<string>;
  write: (key: string, content: string) => Promise<void>;
  watch: (key: string) => Promise<void>;
  changed: (callback: (key: string, content: string) => void) => Promise<UnsubscribeMethod>;
}

export const settingsApi = window.settings ?? {
  read: async () => Promise.resolve(''),
  write: async () => Promise.resolve(),
  watch: async () => Promise.resolve(),
  changed: () => Promise.resolve(() => {}),
};
