/**
 * 渲染进程脚本
 * 处理页面交互逻辑
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.electronAPI) {
        const versionElement = document.getElementById('electron-version');
        if (versionElement) {
            versionElement.textContent = window.electronAPI.versions.electron;
        }
    }
});
