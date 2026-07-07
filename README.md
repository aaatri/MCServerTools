<p align="center">
  <img src="public/icons/app-icon.png" width="64" height="64" alt="MCServerTools">
</p>

<h1 align="center">MCServerTools</h1>

<p align="center">
  跨平台 Minecraft 服务器搭建工具
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-GPL2-yellow.svg" alt="License"></a>
  <a href="https://github.com/aaatri/MCServerTools"><img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform"></a>
  <a href="https://github.com/aaatri/MCServerTools/releases"><img src="https://img.shields.io/badge/version-0.1.0(alpha)-brightgreen" alt="Version"></a>
  <a href="https://github.com/aaatri/MCServerTools"><img src="https://img.shields.io/github/stars/aaatri/MCServerTools?style=social" alt="Stars"></a>
</p>

> ⚠️ 目前 MCServerTools 还是早期 alpha 版，可能存在 BUG。

---

## ✨ 特点

| | |
|---|---|
| 🎯 **一键部署** | 选择核心 → 选择版本 → 自动下载 → 开箱即用 |
| 🧩 **10 种核心** | Vanilla / Paper / Purpur / Forge / Fabric / NeoForge / Sponge / Mohist / CraftBukkit / Spigot |
| 🛠 **配置管理** | 图形化修改 server.properties，中文标注，无需手写 |
| 🌐 **内网穿透** | 内置 frp 客户端，一键将本地服务器暴露到公网 |
| 🎨 **Material Design** | 浅色/深色主题切换，简洁界面 |

## 💻 支持系统

| | 系统 | 架构 |
|---|---|---|
| 🪟 | Windows 10+ | AMD64 / ARM64 |
| 🍎 | macOS | Intel / Apple Silicon |
| 🐧 | Linux | AMD64 / ARM64 |

## 🚀 快速上手

```bash
git clone https://github.com/aaatri/MCServerTools.git
cd MCServerTools
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

## 🧩 支持的核心

| 核心 | 类型 | 下载方式 |
|------|------|---------|
| Vanilla | 原版 | Mojang 官方 API |
| Paper | Bukkit | PaperMC API |
| Purpur | Bukkit | PurpurMC API |
| CraftBukkit | Bukkit | BuildTools 编译 |
| Spigot | Bukkit | BuildTools 编译 |
| Forge | Mod 加载器 | Forge Maven |
| Fabric | Mod 加载器 | Fabric Meta API |
| NeoForge | Mod 加载器 | NeoForged Maven |
| Sponge | Mod 加载器 | Ore API |
| Mohist | 混合 | GitHub Releases |

## 📦 项目结构

```
MCServerTools/
├── src/
│   ├── main/          # Electron 主进程
│   ├── renderer/      # React 前端 (MUI)
│   └── shared/        # 类型定义
├── public/icons/      # 核心图标
├── scripts/           # 工具脚本
├── dist/              # 构建输出
└── package.json
```

## 🖼 预览

*(截图待补充)*

## 👤 关于

制作者：**小亚**

<p align="center">
  <sub>Made with ❤️ by 小亚</sub>
</p>
