<div align="center">
  <h1>Epic-Core</h1>
  <h3>Epic限免游戏查询</h3>
  <p>快速获取Epic Games Store上的限免游戏信息</p>
  <img src="./src/img/1.png" alt="Epic-Core Logo" width="512" height="1024"> 
</div>

<hr>

## 核心简介

**Epic-Core** 是 XRK-AGT 项目中的一个核心，主要提供以下功能：

- **Epic 免费游戏 API**：通过 HTTP API 获取 Epic 游戏商店的免费游戏信息
- **Epic 免费游戏 Web 界面**：提供可视化的 Epic 免费游戏展示页面
- **XRK Baker Electron 应用**：基于 Electron 开发的示例应用，包含流畅的动画效果

## 目录结构

```
Epic-Core/
├── exe/             # Electron 应用 (XRK Baker)
│   ├── main.js      # Electron 主进程
│   ├── preload.js   # 预加载脚本
│   ├── index.html   # 渲染进程 HTML
│   ├── renderer.js  # 渲染进程脚本
│   ├── styles.css   # 样式文件
│   ├── package.json # 项目配置
│   └── README.md    # Electron 应用说明
├── http/            # HTTP API 模块
│   └── epic-free.js # Epic 免费游戏 API
├── www/             # Web 界面
│   └── epic-free/   # Epic 免费游戏 Web 界面
│       ├── app.js   # 前端脚本
│       ├── index.html # 前端页面
│       └── styles.css # 前端样式
└── .gitignore       # Git 忽略文件
```

## 功能说明

### 1. Epic 免费游戏 API

**API 地址**：`/api/qiao/epic-free`

**功能**：获取 Epic 游戏商店当前免费的游戏信息

**使用方法**：
- 发送 GET 请求到 `/api/qiao/epic-free`
- API 会返回 Epic 游戏商店的免费游戏数据

**实现原理**：
- 通过调用外部 API `https://uapis.cn/api/v1/game/epic-free` 获取数据
- 使用 XRK-AGT 的 HTTP 响应工具统一处理响应格式

### 2. Epic 免费游戏 Web 界面

**访问地址**：`/epic-free`

**功能**：提供可视化的 Epic 免费游戏展示页面，用户可以通过浏览器查看当前 Epic 游戏商店的免费游戏。

### 3. XRK Baker Electron 应用

**功能**：基于 Electron 开发的示例应用，包含流畅的动画效果，展示了如何在 XRK-AGT 中集成 Electron 应用。

**技术特点**：
- 使用 Electron 框架
- 包含主进程和渲染进程
- 支持开发模式热更新
- 提供多平台打包能力

## 安装与使用

### 1. 安装依赖

#### Electron 应用依赖

```bash
cd core/Epic-Core/exe
pnpm install
```

**如果 Electron 安装失败，请参考 `exe/README.md` 中的解决方案。**

### 2. 运行模块

#### 运行 XRK-AGT 主服务

```bash
# 在项目根目录运行
node app
```

#### 访问 Epic 免费游戏 Web 界面

启动 XRK-AGT 服务后，通过浏览器访问：

```
http://localhost:2537/epic-free
```

#### 运行 XRK Baker Electron 应用

```bash
cd core/Epic-Core/exe
npm start
```

**开发模式**（自动打开开发者工具）：

```bash
npm run dev
```

**调试模式**（启用 Node.js 调试）：

```bash
npm run debug
```

### 3. 打包 XRK Baker Electron 应用

#### 打包所有平台

```bash
npm run build
```

#### 打包特定平台

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

打包后的文件会在 `dist` 目录中。

## 技术栈

| 模块 | 技术 | 说明 |
|------|------|------|
| Epic 免费游戏 API | JavaScript (ES6+) | 使用 Fetch API 调用外部接口 |
| Epic 免费游戏 Web 界面 | HTML/CSS/JavaScript | 前端展示页面 |
| XRK Baker | Electron | 跨平台桌面应用框架 |
| 通用 | XRK-AGT 框架 | 基于 Node.js 的智能体平台 |

## 开发指南

### 1. 修改 Epic 免费游戏 API

**文件**：`http/epic-free.js`

- 可以修改 `EPIC_API_URL` 变量来更换数据源
- 可以扩展 `routes` 数组来添加更多 API 端点
- 可以修改 `fetchEpicFreeGames` 函数来调整数据处理逻辑

### 2. 修改 Epic 免费游戏 Web 界面

**文件**：`www/epic-free/` 目录下的文件

- `index.html`：修改页面结构
- `styles.css`：修改页面样式
- `app.js`：修改前端逻辑

### 3. 修改 XRK Baker Electron 应用

**文件**：`exe/` 目录下的文件

- `main.js`：修改 Electron 主进程逻辑
- `index.html`：修改渲染进程页面
- `renderer.js`：修改渲染进程逻辑
- `styles.css`：修改应用样式

## 集成说明

### 1. 与 XRK-AGT 框架集成

Epic-Core 模块通过以下方式与 XRK-AGT 框架集成：

- **HTTP API**：通过导出标准的 HTTP API 配置对象，由 XRK-AGT 的 ApiLoader 加载
- **Web 界面**：通过 `www/` 目录下的静态文件，由 XRK-AGT 的 Web 服务提供访问
- **Electron 应用**：作为独立的子项目，可单独运行和打包

### 2. 扩展建议

- **添加更多游戏平台**：可以参考 Epic 免费游戏 API 的实现，添加 Steam、GOG 等其他游戏平台的免费游戏 API
- **增强 Web 界面**：可以添加游戏详情页、收藏功能、通知功能等
- **扩展 Electron 应用**：可以添加更多功能，如游戏库管理、启动器等

## 注意事项

1. **外部 API 依赖**：Epic 免费游戏 API 依赖于外部服务 `https://uapis.cn/api/v1/game/epic-free`，请确保网络连接正常
2. **Electron 版本**：建议使用与 `exe/package.json` 中指定的 Electron 版本
3. **打包配置**：打包 Electron 应用时，请根据目标平台调整打包配置

## 故障排除

### 1. Epic 免费游戏 API 无法访问

- 检查网络连接是否正常
- 检查外部 API `https://uapis.cn/api/v1/game/epic-free` 是否可访问
- 查看 XRK-AGT 日志，确认是否有相关错误信息

### 2. Electron 应用无法启动

- 参考 `exe/README.md` 中的解决方案
- 检查 Node.js 版本是否符合要求
- 检查依赖是否正确安装

### 3. Web 界面无法访问

- 确认 XRK-AGT 服务是否正常运行
- 检查端口配置是否正确
- 查看 XRK-AGT 日志，确认是否有相关错误信息

## 版本历史

### v1.0.0

- 初始版本
- 实现 Epic 免费游戏 API
- 实现 Epic 免费游戏 Web 界面
- 集成 XRK Baker Electron 应用

## 贡献

欢迎提交 Issue 和 Pull Request 来改进 Epic-Core 模块。

## 许可证

遵循 XRK-AGT 项目的许可证。