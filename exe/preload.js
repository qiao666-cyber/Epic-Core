/**
 * 预加载脚本
 * 在渲染进程加载前执行，用于安全地暴露 API 给渲染进程
 */

const { contextBridge } = require('electron');

// 暴露受保护的 API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});