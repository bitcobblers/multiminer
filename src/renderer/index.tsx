import { render } from 'react-dom';
import { App } from './App';
import SettingsApi from '../shared/SettingsApi';
import { MinerApi } from '../shared/MinerApi';
import { DialogApi } from '../shared/DialogApi';

declare global {
  interface Window {
    settings: SettingsApi;
    miner: MinerApi;
    dialog: DialogApi;
  }
}

render(<App />, document.getElementById('root'));
