const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('settings', {
  read(key) {
    return ipcRenderer.invoke('ipc-readSetting', key);
  },
  write(key, value) {
    ipcRenderer.invoke('ipc-writeSetting', key, value);
  },
  watch(key) {
    ipcRenderer.invoke('ipc-watchSetting', key);
  },
  import(settingsPath) {
    ipcRenderer.invoke('ipc-importSettings', settingsPath);
  },
  export(settingsPath) {
    ipcRenderer.invoke('ipc-exportSettings', settingsPath);
  },
  changed(func) {
    ipcRenderer.on('ipc-settingChanged', (_event, ...args) => func(...args));
  },
});

contextBridge.exposeInMainWorld('download', {
  getMinerReleases(owner, repo) {
    return ipcRenderer.invoke('ipc-getMinerReleases', owner, repo);
  },
  downloadMiner(name, version, url) {
    return ipcRenderer.invoke('ipc-downloadMiner', name, version, url);
  },
});

contextBridge.exposeInMainWorld('miner', {
  start(profile, coin, miner, version, args) {
    return ipcRenderer.invoke('ipc-startMiner', profile, coin, miner, version, args);
  },
  stop() {
    return ipcRenderer.invoke('ipc-stopMiner');
  },
  status() {
    return ipcRenderer.invoke('ipc-statusMiner');
  },
  stats(port) {
    return ipcRenderer.invoke('ipc-statsMiner', port);
  },
  error(func) {
    ipcRenderer.on('ipc-minerError', (_event, ...args) => func(...args));
  },
  receive(func) {
    ipcRenderer.on('ipc-minerData', (_event, ...args) => func(...args));
  },
  exited(func) {
    ipcRenderer.on('ipc-minerExited', (_event, ...args) => func(...args));
  },
  started(func) {
    ipcRenderer.on('ipc-minerStarted', (_event, ...args) => func(...args));
  },
});

contextBridge.exposeInMainWorld('dialog', {
  getPath() {
    return ipcRenderer.invoke('ipc-selectFolder');
  },
  getSaveFile() {
    return ipcRenderer.invoke('ipc-selectSaveFile');
  },
  getOpenFile() {
    return ipcRenderer.invoke('ipc-selectOpenFile');
  },
});

contextBridge.exposeInMainWorld('unmineable', {
  getCoin(coin, address) {
    return ipcRenderer.invoke('ipc-getUnmineableCoin', coin, address);
  },
  getWorkers(uuid) {
    return ipcRenderer.invoke('ipc-getUnmineableWorkers', uuid);
  },
  openBrowser(coin, address) {
    return ipcRenderer.invoke('ipc-openUnmineableWeb', coin, address);
  },
});

contextBridge.exposeInMainWorld('ticker', {
  getTicker(coins) {
    return ipcRenderer.invoke('ipc-getTicker', coins);
  },
});

contextBridge.exposeInMainWorld('about', {
  getName() {
    return ipcRenderer.invoke('ipc-getAppName');
  },
  getVersion() {
    return ipcRenderer.invoke('ipc-getAppVersion');
  },
  getElectronVersion() {
    return ipcRenderer.invoke('ipc-getElectronVersion');
  },
  openBrowser(url) {
    return ipcRenderer.invoke('ipc-openExternalSite', url);
  },
});
