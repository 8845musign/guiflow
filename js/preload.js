const { contextBridge, ipcRenderer, clipboard } = require('electron')
const flumine = require('flumine');

contextBridge.exposeInMainWorld(
    'requires', {
        ipcRenderer,
        flumine,
        clipboard
    }
);