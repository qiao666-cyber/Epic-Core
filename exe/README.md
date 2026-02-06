# Epic Core

基于 Electron 开发的应用，包含 API 路由管理功能。

## 安装依赖

```bash
cd core/Epic-Core/exe
npm install
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

## 打包应用

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
Epic-Core/exe/
├── main.js          # Electron 主进程
├── preload.js       # 预加载脚本
├── index.html       # 渲染进程 HTML
├── renderer.js      # 渲染进程脚本
├── styles.css       # 样式文件
├── app.js           # 应用逻辑
├── package.json     # 项目配置
└── README.md        # 说明文档
```

## 技术栈

- Electron
- HTML/CSS/JavaScript
- electron-reloader (开发热更新)