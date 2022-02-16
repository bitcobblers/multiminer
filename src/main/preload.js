const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('settings', {
  read(key) {
    return ipcRenderer.invoke('ipc-readSetting', key);
  },
  write(key, value) {
    return ipcRenderer.invoke('ipc-writeSetting', key, value);
  },
});

contextBridge.exposeInMainWorld('miner', {
  start(path, args) {
    return ipcRenderer.invoke('ipc-startMiner', path, args);
  },
  stop() {
    return ipcRenderer.invoke('ipc-stopMiner');
  },
  receive(func) {
    ipcRenderer.on('ipc-minerData', (_event, ...args) => func(...args));
  },
  exited(func) {
    ipcRenderer.on('ipc-minerExit', (_event, ...args) => func(...args));
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
});

contextBridge.exposeInMainWorld('ticker', {
  getTicker(coins) {
    return ipcRenderer.invoke('ipc-getTicker', coins);
  },
});
