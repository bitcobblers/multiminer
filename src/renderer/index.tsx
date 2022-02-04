import { render } from 'react-dom';
import { App } from './App';
import SettingsApi from '../shared/SettingsApi';
import { MinerApi } from '../shared/MinerApi';

declare global {
  interface Window {
    settings: SettingsApi;
    miner: MinerApi;
  }
}

render(<App />, document.getElementById('root'));
