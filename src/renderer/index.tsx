import { render } from 'react-dom';
import { App } from './App';
import { SettingsApi } from '../shared/SettingsApi';
import { MinerApi } from '../shared/MinerApi';
import { DialogApi } from '../shared/DialogApi';
import { UnmineableApi } from '../shared/UnmineableApi';
import { TickerApi } from '../shared/TickerApi';

declare global {
  interface Window {
    settings: SettingsApi;
    miner: MinerApi;
    dialog: DialogApi;
    unmineable: UnmineableApi;
    ticker: TickerApi;
  }
}

render(<App />, document.getElementById('root'));
