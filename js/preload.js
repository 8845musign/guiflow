const { contextBridge, ipcRenderer, clipboard } = require('electron')
const flumine = require('flumine');
//const editor = require('./editor');
const diagram = require('./diagram');

contextBridge.exposeInMainWorld(
    'requires', {
        ipcRenderer,
        flumine,
        // editor,
        diagram,
        clipboard
    }
);