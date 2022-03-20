import { app } from 'electron';
import path from 'path';

function getResourcesPath() {
  return app.isPackaged ? path.join(process.resourcesPath, 'assets') : path.join(__dirname, '../../assets');
}

export function getResolveHtmlPath() {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    return (htmlFileName: string) => {
      const url = new URL(`http://localhost:${port}`);
      url.pathname = htmlFileName;
      return url.href;
    };
  }

  return (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}

export const getAssetPath = (...paths: string[]): string => {
  return path.join(getResourcesPath(), ...paths);
};
