import { render } from 'react-dom';
import { App } from './App';
import SettingsApi from '../shared/SettingsApi';

declare global {
  interface Window {
    settings: SettingsApi;
  }
}

render(<App />, document.getElementById('root'));
