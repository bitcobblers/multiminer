const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  serviceSettings: {
    readSettings() {
      return ipcRenderer.invoke('ipc-readSettings');
    },
    writeSettings(content) {
      return ipcRenderer.invoke('ipc-writeSettings', content);
    },
  },
  ipcRenderer: {
    myPing() {
      ipcRenderer.send('ipc-example', 'ping');
    },
    echo(message) {
      const result = ipcRenderer.invoke('my-message', message);

      // eslint-disable-next-line no-console
      console.log(`Received reply: ${result}`);
    },
    on(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      const validChannels = ['ipc-example'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
