const { contextBridge, ipcRenderer, clipboard, nativeImage } = require('electron')
const fs = require('fs');
const uiflow = require('./uiflow');

contextBridge.exposeInMainWorld(
    'requires', {
        clipboard,
        nativeImage,
        fs,
    }
);

contextBridge.exposeInMainWorld(
  'process', {
    platform: process.platform
  }
);

contextBridge.exposeInMainWorld(
  'api', {
    on: (channel, callback) => ipcRenderer.on(channel, (event, argv) => callback(event, argv))
  }
)

contextBridge.exposeInMainWorld(
  'uiflow', {
    'update': uiflow.update,
    'compile': uiflow.compile,
    'base64png': uiflow.base64png,
  }
)

contextBridge.exposeInMainWorld(
  'file', {
    'save': async () => await ipcRenderer.invoke('save')
  }
)
