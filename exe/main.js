/**
 * Electron 主进程入口文件
 * 负责创建和管理应用窗口
 */

const { app, BrowserWindow } = require('electron');
const path = require('path');

// 开发环境下启用热更新
if (process.env.NODE_ENV !== 'production') {
  try {
    require('electron-reloader')(module, {
      debug: true,
      watchRenderer: true
    });
  } catch (err) {
    // 忽略错误（生产环境不安装 electron-reloader）
  }
}

let mainWindow;

/**
 * 创建主窗口
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    backgroundColor: '#f0f9ff',
    show: false,
    autoHideMenuBar: true
  });

  mainWindow.loadFile('index.html');

  // 页面加载完成后显示窗口
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    // 开发环境下自动打开开发者工具
    if (process.argv.includes('--dev')) {
      mainWindow.webContents.openDevTools();
    }
  });

  // 窗口关闭时清理引用
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * Electron 初始化完成后创建窗口
 */
app.whenReady().then(() => {
  createWindow();

  // macOS 窗口激活处理
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// 所有窗口关闭时退出应用（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});