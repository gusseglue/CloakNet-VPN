const { app, BrowserWindow, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const Store = require('electron-store');
const { exec, spawn } = require('child_process');
const fs = require('fs');
const https = require('https');
const http = require('http');
const sudo = require('sudo-prompt');

const store = new Store();

// Single instance lock - prevent multiple instances
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Another instance is already running, quit this one
  app.quit();
} else {
  // This is the first instance
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, focus our window instead
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

let mainWindow;
let tray;
let vpnProcess = null;
let isConnected = false;

// API Configuration
const API_BASE_URL = process.env.CLOAKNET_API_URL || 'https://cloaknet.de';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    resizable: false,
    frame: false,
    transparent: false,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../assets/icon.png')
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  // Try to load custom icon, fall back to empty icon if not found
  let icon;
  const iconPath = path.join(__dirname, '../assets/tray-icon.png');
  
  try {
    if (fs.existsSync(iconPath)) {
      icon = nativeImage.createFromPath(iconPath);
      icon = icon.resize({ width: 16, height: 16 });
    } else {
      // Create a simple colored icon as fallback
      icon = nativeImage.createEmpty();
    }
  } catch (error) {
    icon = nativeImage.createEmpty();
  }
  
  // On Windows, if icon is empty, create a simple one
  if (icon.isEmpty() && process.platform === 'win32') {
    // Create a small green square as fallback
    const size = 16;
    const buffer = Buffer.alloc(size * size * 4);
    for (let i = 0; i < size * size; i++) {
      buffer[i * 4] = 16;      // R
      buffer[i * 4 + 1] = 185; // G (green)
      buffer[i * 4 + 2] = 129; // B
      buffer[i * 4 + 3] = 255; // A
    }
    icon = nativeImage.createFromBuffer(buffer, { width: size, height: size });
  }
  
  tray = new Tray(icon);
  
  updateTrayMenu();
  
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
}

function updateTrayMenu() {
  const contextMenu = Menu.buildFromTemplate([
    {
      label: isConnected ? '🟢 Forbundet' : '🔴 Ikke forbundet',
      enabled: false
    },
    { type: 'separator' },
    {
      label: isConnected ? 'Afbryd' : 'Forbind',
      click: () => {
        if (isConnected) {
          disconnectVPN();
        } else {
          mainWindow.webContents.send('request-connect');
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Vis vindue',
      click: () => mainWindow.show()
    },
    {
      label: 'Afslut',
      click: () => {
        app.isQuitting = true;
        if (isConnected) {
          disconnectVPN().then(() => app.quit());
        } else {
          app.quit();
        }
      }
    }
  ]);
  
  tray.setContextMenu(contextMenu);
  tray.setToolTip(isConnected ? 'CloakNet VPN - Forbundet' : 'CloakNet VPN - Ikke forbundet');
}

// Validate activation key with backend
async function validateActivationKey(key) {
  return new Promise((resolve, reject) => {
    const url = new URL('/api/vpn/validate', API_BASE_URL);
    const isHttps = url.protocol === 'https:';
    const requestModule = isHttps ? https : http;
    
    const postData = JSON.stringify({ key });
    
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = requestModule.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(new Error('Invalid response from server'));
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(postData);
    req.end();
  });
}

// Validate WireGuard public key format (base64, 44 characters)
function isValidWireGuardKey(key) {
  if (!key || typeof key !== 'string') return false;
  // WireGuard keys are 32 bytes base64-encoded = 44 characters (with padding)
  // or 43 characters without padding
  const base64Regex = /^[A-Za-z0-9+/]{42,44}=*$/;
  return base64Regex.test(key) && (key.length === 44 || key.length === 43);
}

// Generate a unique client IP based on user ID hash
function generateClientIP(userId) {
  // Create a simple hash from user ID to generate consistent IP
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // Use last octet between 2-254 (1 is server, 255 is broadcast)
  const lastOctet = (Math.abs(hash) % 253) + 2;
  return `10.0.0.${lastOctet}`;
}

// Generate WireGuard configuration
function generateWireGuardConfig(serverConfig, privateKey, publicKey, userId) {
  // Use server public key from API response
  const serverPublicKey = serverConfig.serverPublicKey || process.env.WG_SERVER_PUBLIC_KEY || '';
  
  if (!serverPublicKey) {
    throw new Error('Server public key not configured');
  }
  
  if (!isValidWireGuardKey(serverPublicKey)) {
    throw new Error('Invalid server public key format');
  }
  
  // Generate consistent client IP from user ID
  const clientIP = generateClientIP(userId);
  
  return `[Interface]
PrivateKey = ${privateKey}
Address = ${clientIP}/32
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = ${serverPublicKey}
AllowedIPs = 0.0.0.0/0
Endpoint = ${serverConfig.server}:${serverConfig.port}
PersistentKeepalive = 25
`;
}

// Generate WireGuard keys
function generateWireGuardKeys() {
  return new Promise((resolve, reject) => {
    const wgPath = getWireGuardPath();
    
    exec(`"${wgPath}" genkey`, (error, privateKey) => {
      if (error) {
        reject(error);
        return;
      }
      
      privateKey = privateKey.trim();
      
      exec(`echo "${privateKey}" | "${wgPath}" pubkey`, (error, publicKey) => {
        if (error) {
          reject(error);
          return;
        }
        
        resolve({
          privateKey,
          publicKey: publicKey.trim()
        });
      });
    });
  });
}

function getWireGuardPath() {
  const platform = process.platform;
  
  if (platform === 'win32') {
    return path.join(process.resourcesPath, 'wireguard', 'wg.exe');
  } else if (platform === 'darwin') {
    return '/usr/local/bin/wg';
  } else {
    return '/usr/bin/wg';
  }
}

function getWireGuardQuickPath() {
  const platform = process.platform;
  
  if (platform === 'win32') {
    return path.join(process.resourcesPath, 'wireguard', 'wireguard.exe');
  } else if (platform === 'darwin') {
    return '/usr/local/bin/wg-quick';
  } else {
    return '/usr/bin/wg-quick';
  }
}

// Connect to VPN
async function connectVPN(activationKey) {
  try {
    // Validate key with backend
    const validation = await validateActivationKey(activationKey);
    
    if (!validation.valid) {
      throw new Error(validation.error || 'Ugyldig aktiveringsnøgle');
    }

    // Store the key for auto-reconnect
    store.set('activationKey', activationKey);
    
    // Generate keys if not stored
    let keys = store.get('wireguardKeys');
    if (!keys) {
      keys = await generateWireGuardKeys();
      store.set('wireguardKeys', keys);
    }
    
    // Get user ID for consistent IP assignment (use key hash as fallback)
    const userId = validation.userId || activationKey;
    
    // Generate config
    const config = generateWireGuardConfig(validation.config, keys.privateKey, keys.publicKey, userId);
    
    // Write config to temp file
    const configPath = path.join(app.getPath('temp'), 'cloaknet.conf');
    fs.writeFileSync(configPath, config);
    
    // Start WireGuard
    const wgQuickPath = getWireGuardQuickPath();
    
    return new Promise((resolve, reject) => {
      const platform = process.platform;
      
      if (platform === 'win32') {
        // Windows: Use wireguard.exe /installtunnelservice
        vpnProcess = spawn(wgQuickPath, ['/installtunnelservice', configPath], {
          stdio: 'pipe'
        });
      } else {
        // macOS/Linux: Use wg-quick with sudo
        const sudoOptions = { name: 'CloakNet VPN' };
        
        sudo.exec(`${wgQuickPath} up ${configPath}`, sudoOptions, (error) => {
          if (error) {
            reject(error);
            return;
          }
          
          isConnected = true;
          updateTrayMenu();
          resolve({ success: true });
        });
        return;
      }
      
      vpnProcess.on('error', (err) => {
        reject(err);
      });
      
      // Give it a moment to connect
      setTimeout(() => {
        isConnected = true;
        updateTrayMenu();
        resolve({ success: true });
      }, 2000);
    });
    
  } catch (error) {
    throw error;
  }
}

// Disconnect from VPN
async function disconnectVPN() {
  return new Promise((resolve) => {
    const platform = process.platform;
    const configPath = path.join(app.getPath('temp'), 'cloaknet.conf');
    
    if (platform === 'win32') {
      const wgQuickPath = getWireGuardQuickPath();
      exec(`"${wgQuickPath}" /uninstalltunnelservice cloaknet`, () => {
        isConnected = false;
        updateTrayMenu();
        resolve();
      });
    } else {
      const sudoOptions = { name: 'CloakNet VPN' };
      const wgQuickPath = getWireGuardQuickPath();
      
      sudo.exec(`${wgQuickPath} down ${configPath}`, sudoOptions, () => {
        isConnected = false;
        updateTrayMenu();
        resolve();
      });
    }
  });
}

// IPC Handlers
ipcMain.handle('validate-key', async (event, key) => {
  try {
    const result = await validateActivationKey(key);
    return result;
  } catch (error) {
    return { valid: false, error: error.message };
  }
});

ipcMain.handle('connect', async (event, key) => {
  try {
    await connectVPN(key);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('disconnect', async () => {
  try {
    await disconnectVPN();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-status', () => {
  return {
    connected: isConnected,
    savedKey: store.get('activationKey') || null
  };
});

ipcMain.handle('clear-saved-key', () => {
  store.delete('activationKey');
  store.delete('wireguardKeys');
  return { success: true };
});

ipcMain.on('minimize', () => {
  mainWindow.minimize();
});

ipcMain.on('close', () => {
  // On Windows, actually quit the app instead of hiding to tray
  // since tray icon support can be problematic
  if (process.platform === 'win32') {
    app.isQuitting = true;
    if (isConnected) {
      disconnectVPN().then(() => app.quit());
    } else {
      app.quit();
    }
  } else {
    mainWindow.hide();
  }
});

// App lifecycle - only start if we got the lock
if (gotTheLock) {
  app.whenReady().then(() => {
    createWindow();
    createTray();
    
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      } else {
        mainWindow.show();
      }
    });
  });

  app.on('window-all-closed', () => {
    // On Windows and Linux, don't quit when window is hidden to tray
    // The app should keep running in the system tray
    if (process.platform === 'darwin') {
      // On macOS, apps typically stay running even without windows
    }
    // Don't call app.quit() - let the app run in tray
  });

  app.on('before-quit', async () => {
    app.isQuitting = true;
    if (isConnected) {
      await disconnectVPN();
    }
  });
}
