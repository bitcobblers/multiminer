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
  changed(func) {
    ipcRenderer.removeAllListeners('ipc-settingChanged');
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
  start(name, coin, kind, exe, version, args) {
    return ipcRenderer.invoke('ipc-startMiner', name, coin, kind, exe, version, args);
  },
  stop() {
    return ipcRenderer.invoke('ipc-stopMiner');
  },
  status() {
    return ipcRenderer.invoke('ipc-statusMiner');
  },
  error(func) {
    ipcRenderer.removeAllListeners('ipc-minerError');
    ipcRenderer.on('ipc-minerError', (_event, ...args) => func(...args));
  },
  receive(func) {
    ipcRenderer.removeAllListeners('ipc-minerData');
    ipcRenderer.on('ipc-minerData', (_event, ...args) => func(...args));
  },
  exited(func) {
    ipcRenderer.removeAllListeners('ipc-minerExited');
    ipcRenderer.on('ipc-minerExited', (_event, ...args) => func(...args));
  },
  started(func) {
    ipcRenderer.removeAllListeners('ipc-minerStarted');
    ipcRenderer.on('ipc-minerStarted', (_event, ...args) => func(...args));
  },
});

contextBridge.exposeInMainWorld('dialog', {
  getPath() {
    return ipcRenderer.invoke('ipc-selectFolder');
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
