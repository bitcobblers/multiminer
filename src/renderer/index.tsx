import { render } from 'react-dom';
import { App } from './App';
import { AboutApi } from '../shared/AboutApi';
import { DialogApi } from '../shared/DialogApi';
import { DownloadApi } from '../shared/DownloadApi';
import { LoggingApi } from '../shared/LoggingApi';
import { MinerApi } from '../shared/MinerApi';
import { SettingsApi } from '../shared/SettingsApi';
import { TickerApi } from '../shared/TickerApi';
import { UnmineableApi } from '../shared/UnmineableApi';

import { enableScreenScraper } from './services/MinerEventStreamer';
import { enableLolMiner } from './services/miners/lolminer';
import { enableNBMiner } from './services/miners/nbminer';
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
  enableScreenScraper();
  enableLolMiner();
  enableNBMiner();
  enableDataService();
});

render(<App />, document.getElementById('root'));
