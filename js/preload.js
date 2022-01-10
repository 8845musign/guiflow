const { contextBridge, ipcRenderer, clipboard, dialog } = require('electron')
const flumine = require('flumine');
const fs = require('fs');
const EventEmitter = require('events');

contextBridge.exposeInMainWorld(
    'requires', {
        ipcRenderer,
        dialog,
        clipboard,
        flumine,
        clipboard,
        fs,
        EventEmitter
    }
);