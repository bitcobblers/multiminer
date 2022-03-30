import { SettingsSchemaType } from '../models';

export interface SettingsApi {
  read: (key: keyof SettingsSchemaType) => Promise<string>;
  write: (key: keyof SettingsSchemaType, content: string) => Promise<void>;
  watch: (key: keyof SettingsSchemaType) => Promise<void>;
  changed: (callback: (key: keyof SettingsSchemaType, content: string) => void) => Promise<void>;
  import: (settingsPath: string) => Promise<string>;
  export: (settingsPath: string) => Promise<string>;
}

export const settingsApi = window.settings ?? {
  read: async () => Promise.resolve(''),
  write: async () => Promise.resolve(),
  watch: async () => Promise.resolve(),
  changed: async () => Promise.resolve(),
  import: async () => Promise.resolve(''),
  export: async () => Promise.resolve(''),
};
