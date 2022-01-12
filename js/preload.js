const { contextBridge, ipcRenderer, clipboard, dialog, nativeImage } = require('electron')
const fs = require('fs');
const EventEmitter = require('events');
contextBridge.exposeInMainWorld(
    'requires', {
        dialog,
        clipboard,
        nativeImage,
        fs,
        EventEmitter,
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