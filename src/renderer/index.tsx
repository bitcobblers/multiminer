import { render } from 'react-dom';
import { App } from './App';
import { SettingsApi } from '../shared/SettingsApi';
import { MinerApi } from '../shared/MinerApi';
import { DialogApi } from '../shared/DialogApi';
import { UnmineableApi } from '../shared/UnmineableApi';
import { TickerApi } from '../shared/TickerApi';
import { DownloadApi } from '../shared/DownloadApi';

import { cleanup as cleanupDataService } from './services/DataService';

declare global {
  interface Window {
    settings: SettingsApi;
    miner: MinerApi;
    dialog: DialogApi;
    download: DownloadApi;
    unmineable: UnmineableApi;
    ticker: TickerApi;
  }
}

window.addEventListener('beforeunload', () => {
  cleanupDataService();
});

render(<App />, document.getElementById('root'));
