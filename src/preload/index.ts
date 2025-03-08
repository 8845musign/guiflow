import { contextBridge, ipcRenderer, clipboard, nativeImage } from 'electron';
import * as fs from 'fs';
import uiflow from './uiflow';

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
    on: (channel: string, callback: (event: any, argv: any) => void) => 
      ipcRenderer.on(channel, (event, argv) => callback(event, argv))
  }
);

contextBridge.exposeInMainWorld(
  'uiflow', {
    'update': uiflow.update,
    'compile': uiflow.compile,
    'base64png': uiflow.base64png,
  }
);

contextBridge.exposeInMainWorld(
  'file', {
    'save': async () => await ipcRenderer.invoke('save')
  }
);
