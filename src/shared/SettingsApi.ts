export interface SettingsApi {
  read: (key: string) => Promise<string>;
  write: (key: string, content: string) => Promise<void>;
  watch: (key: string) => Promise<void>;
  unwatchAll: () => Promise<void>;
  changed: (callback: (key: string, content: string) => void) => Promise<void>;
}

export const settingsApi = window.settings ?? {
  read: async () => Promise.resolve(''),
  write: async () => Promise.resolve(),
  watch: async () => Promise.resolve(),
  unwatchAll: async () => Promise.resolve(),
  changed: () => Promise.resolve(),
};
