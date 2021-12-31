import { render } from 'react-dom';
import { App } from './App';
import { IElectronApi } from './api';

declare global {
  interface Window {
    electron: IElectronApi;
  }
}

render(<App />, document.getElementById('root'));
