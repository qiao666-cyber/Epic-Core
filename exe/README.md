# XRK Baker

基于 Electron 开发的 Hello World 应用，包含流畅的动画效果。

## 安装依赖

```bash
cd core/XRK-Core/XRKbaker
npm install
```

或者使用 pnpm：

```bash
cd core/XRK-Core/XRKbaker
pnpm install
```

**如果 Electron 安装失败，请按以下步骤修复：**

### 方法1：删除 electron 文件夹并重新安装（推荐）

```bash
# Windows (PowerShell)
Remove-Item -Recurse -Force node_modules\electron
npm install electron --force

# Windows (Git Bash) / Linux / macOS
rm -rf node_modules/electron
npm install electron --force
```

### 方法2：完全重新安装

```bash
# 删除所有 node_modules
rm -rf node_modules package-lock.json

# 重新安装
npm install
```

### 方法3：设置 Electron 镜像（如果下载慢）

已在 `.npmrc` 中配置了 Electron 镜像，如果仍有问题，可手动设置环境变量：

```bash
# Windows (PowerShell)
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"

# Windows (CMD)
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/

# Linux / macOS
export ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
```

然后重新安装：
```bash
npm install electron --force
```

## 运行应用

### 普通运行

```bash
npm start
```

### 开发模式（自动打开开发者工具）

```bash
npm run dev
```

### 调试模式（启用 Node.js 调试）

```bash
npm run debug
```

调试模式下，可以通过 Chrome DevTools 连接到 `chrome://inspect` 进行调试。

## 打包应用

### 打包所有平台

```bash
npm run build
```

### 打包 Windows

```bash
npm run build:win
```

### 打包 macOS

```bash
npm run build:mac
```

### 打包 Linux

```bash
npm run build:linux
```

打包后的文件会在 `dist` 目录中。

## 项目结构

```
XRKbaker/
├── main.js          # Electron 主进程
├── preload.js       # 预加载脚本
├── index.html       # 渲染进程 HTML
├── renderer.js      # 渲染进程脚本
├── styles.css       # 样式文件
├── package.json     # 项目配置
└── README.md        # 说明文档
```

## 技术栈

- Electron
- HTML/CSS/JavaScript
- CSS Animations
- electron-reloader (开发热更新)

## 开发说明

- 主进程文件：`main.js`
- 渲染进程：`index.html` 和 `renderer.js`
- 样式文件：`styles.css`

开发模式下，修改文件后会自动重新加载窗口。