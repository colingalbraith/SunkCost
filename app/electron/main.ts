import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 480,
    height: 720,
    minWidth: 400,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false, // Allow loading local files
      backgroundThrottling: false, // Prevent throttling when window is hidden
    },
    titleBarStyle: 'default',
    backgroundColor: '#ffffff',
  });

  // In development, load from vite dev server
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Keep Cmd+R for reload
  mainWindow.webContents.on('before-input-event', (_event, input) => {
    if (input.key === 'r' && input.meta && mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.reload();
    }
  });

  // On macOS, hide to dock instead of closing when X is clicked (keeps tracking)
  mainWindow.on('close', (event) => {
    if (process.platform === 'darwin' && !isQuitting) {
      event.preventDefault();
      mainWindow?.hide();
    }
  });

  // Clear reference when window is actually destroyed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Set quitting flag before app quits
app.on('before-quit', () => {
  isQuitting = true;
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS, show the hidden window or create new one when dock icon is clicked
    if (mainWindow) {
      mainWindow.show();
    } else {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  // On macOS, apps typically stay in dock until explicitly quit
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
