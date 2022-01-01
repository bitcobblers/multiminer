const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  settings: {
    read(key) {
      return ipcRenderer.invoke('ipc-readSetting', key);
    },
    write(key, value) {
      return ipcRenderer.invoke('ipc-writeSetting', key, value);
    },
  },
});
