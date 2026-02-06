// Type declarations for Electron API exposed via preload
interface ElectronAPI {
    platform: string;
    onSystemWake: (callback: () => void) => void;
    removeSystemWakeListener: (callback: () => void) => void;
}

declare global {
    interface Window {
        electronAPI?: ElectronAPI;
    }
}

export { };
