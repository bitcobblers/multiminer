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
    ipcRenderer.on('ipc-settingChanged', (_event, ...args) => func(...args));
  },
});

contextBridge.exposeInMainWorld('miner', {
  start(name, coin, path, args) {
    return ipcRenderer.invoke('ipc-startMiner', name, coin, path, args);
  },
  stop() {
    return ipcRenderer.invoke('ipc-stopMiner');
  },
  status() {
    return ipcRenderer.invoke('ipc-statusMiner');
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
});

contextBridge.exposeInMainWorld('unmineable', {
  getCoin(coin, address) {
    return ipcRenderer.invoke('ipc-getUnmineableCoin', coin, address);
  },
  getWorkers(uuid) {
    return ipcRenderer.invoke('ipc-getUnmineableWorkers', uuid);
  },
});

contextBridge.exposeInMainWorld('ticker', {
  getTicker(coins) {
    return ipcRenderer.invoke('ipc-getTicker', coins);
  },
});
