import { contextBridge } from 'electron';

// Expose APIs to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    platform: process.platform,
});
