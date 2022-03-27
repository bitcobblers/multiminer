import { render } from 'react-dom';
import { App } from './App';
import { SettingsApi } from '../shared/SettingsApi';
import { MinerApi } from '../shared/MinerApi';
import { DialogApi } from '../shared/DialogApi';
import { UnmineableApi } from '../shared/UnmineableApi';
import { TickerApi } from '../shared/TickerApi';
import { DownloadApi } from '../shared/DownloadApi';
import { AboutApi } from '../shared/AboutApi';

import { enableScreenScraper } from './services/MinerEventStreamer';
import { enableLolMiner } from './services/miners/lolminer';
import { enableDataService } from './services/DataService';

import MinerService from './services/MinerService';
import AppSettingsService from './services/AppSettingsService';

const services = [MinerService, AppSettingsService];

declare global {
  interface Window {
    settings: SettingsApi;
    miner: MinerApi;
    dialog: DialogApi;
    download: DownloadApi;
    unmineable: UnmineableApi;
    ticker: TickerApi;
    about: AboutApi;
  }
}

window.addEventListener('load', () => {
  enableScreenScraper();
  enableLolMiner();
  enableDataService();

  services.forEach((s) => {
    // eslint-disable-next-line no-console
    console.log(`Loading ${s.name}.`);

    s.load();
  });
});

window.addEventListener('beforeunload', () => {
  // cleanupDataService();

  services.forEach((s) => {
    // eslint-disable-next-line no-console
    console.log(`Unoading ${s.name}.`);

    s.unload();
  });
});

render(<App />, document.getElementById('root'));
