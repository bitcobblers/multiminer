import Store from 'electron-store';

export const globalStore = new Store();
export const isDevelopment = process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';
