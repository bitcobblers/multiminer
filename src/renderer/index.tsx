import { render } from 'react-dom';
import { App } from './App';
import { settingsApi, SettingsApi } from '../shared/SettingsApi';
import { MinerApi } from '../shared/MinerApi';
import { DialogApi } from '../shared/DialogApi';
import { UnmineableApi } from '../shared/UnmineableApi';
import { TickerApi } from '../shared/TickerApi';
import { DownloadApi } from '../shared/DownloadApi';
import { AboutApi } from '../shared/AboutApi';
import { AdminApi } from '../shared/AdminApi';

import { enableScreenScraper } from './services/MinerEventStreamer';
import { enableLolMiner } from './services/miners/lolminer';
import { enableDataService } from './services/DataService';

declare global {
  interface Window {
    settings: SettingsApi;
    miner: MinerApi;
    dialog: DialogApi;
    download: DownloadApi;
    unmineable: UnmineableApi;
    ticker: TickerApi;
    about: AboutApi;
    admin: AdminApi;
  }
}

window.addEventListener('load', () => {
  enableScreenScraper();
  enableLolMiner();
  enableDataService();
});

window.addEventListener('unload', () => {
  settingsApi.unwatchAll();
});

render(<App />, document.getElementById('root'));
