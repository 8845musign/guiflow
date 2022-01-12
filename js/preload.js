const { contextBridge, ipcRenderer, clipboard, dialog, nativeImage } = require('electron')
const fs = require('fs');
const uiflow = require('../app/uiflow');

contextBridge.exposeInMainWorld(
    'requires', {
        dialog,
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