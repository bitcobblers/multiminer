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
import { enableNBMiner } from './services/miners/nbminer';
import { enableTrexMiner } from './services/miners/trexminer';
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
  }
}

window.addEventListener('load', () => {
  enableScreenScraper();
  enableLolMiner();
  enableNBMiner();
  enableTrexMiner();
  enableDataService();
});

render(<App />, document.getElementById('root'));
