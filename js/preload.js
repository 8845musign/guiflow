const { contextBridge, ipcRenderer, clipboard, dialog, nativeImage } = require('electron')
const flumine = require('flumine');
const fs = require('fs');
const EventEmitter = require('events');

contextBridge.exposeInMainWorld(
    'requires', {
        ipcRenderer,
        dialog,
        clipboard,
        flumine,
        nativeImage,
        fs,
        EventEmitter
    }
);

contextBridge.exposeInMainWorld(
  'process', {
    platform: process.platform
  }
);