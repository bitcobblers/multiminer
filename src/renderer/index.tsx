// import { render } from 'react-dom';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { AboutApi } from '../shared/AboutApi';
import { DialogApi } from '../shared/DialogApi';
import { DownloadApi } from '../shared/DownloadApi';
import { LoggingApi } from '../shared/LoggingApi';
import { MinerApi } from '../shared/MinerApi';
import { SettingsApi } from '../shared/SettingsApi';
import { TickerApi } from '../shared/TickerApi';
import { UnmineableApi } from '../shared/UnmineableApi';

import { enableMonitors } from './services/MonitorService';
import { enableDataService } from './services/DataService';

declare global {
  interface Window {
    about: AboutApi;
    dialog: DialogApi;
    download: DownloadApi;
    logging: LoggingApi;
    miner: MinerApi;
    settings: SettingsApi;
    ticker: TickerApi;
    unmineable: UnmineableApi;
  }
}

window.addEventListener('load', () => {
  enableMonitors();
  enableDataService();
});

const container = document.getElementById('root');
const root = createRoot(container as Element);
root.render(<App />);
