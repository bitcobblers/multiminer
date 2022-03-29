export interface SettingsApi {
  read: (key: string) => Promise<string>;
  write: (key: string, content: string) => Promise<void>;
  watch: (key: string) => Promise<void>;
  changed: (callback: (key: string, content: string) => void) => Promise<void>;
  import: (settingsPath: string) => Promise<void>;
  export: (settingsPath: string) => Promise<void>;
}

export const settingsApi = window.settings ?? {
  read: async () => Promise.resolve(''),
  write: async () => Promise.resolve(),
  watch: async () => Promise.resolve(),
  changed: async () => Promise.resolve(),
  import: async () => Promise.resolve(),
  export: async () => Promise.resolve(),
};
