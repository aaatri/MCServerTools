![](public/icons/app-icon.ico)

# MCServerTools

跨平台 Minecraft 服务器搭建工具

[![License: GPL2](https://img.shields.io/badge/License-GPL2-yellow.svg)](LICENSE) [![Platform](https://img.shields.io/badge/OS-macOS%2FWindows%2FLinux-blue)](https://github.com/aaatri/MCServerTools) [![Version](https://img.shields.io/badge/version-0.1.0(alpha)-brightgreen)](https://github.com/aaatri/MCServerTools) [![Stars](https://img.shields.io/github/stars/aaatri/MCServerTools?style=social)](https://github.com/aaatri/MCServerTools)

WARNING：目前 MCServerTools 还是早期 alpha 版，可能有 BUG。

## 💗 特点

一键部署！

支持 10 种核心

配置管理

内网穿透

支持 Vanilla / Paper / Purpur / Forge / Fabric 等主流服务端核心

图形化修改 server.properties，中文标注

内置 frp 客户端，一键暴露到公网

## 支持系统

| macOS | Windows | Linux |
|-------|---------|-------|
| ✅ Intel & Apple Silicon | ✅ 10+ | ✅ 常见发行版 |

## 🚀 快速上手

前往 [Releases](https://github.com/aaatri/MCServerTools/releases) 下载最新版，或从源码构建：

```
git clone https://github.com/aaatri/MCServerTools.git
cd MCServerTools
npm install
npm run dev
```

## 支持的核心

| 核心 | 类型 | 下载方式 |
|------|------|---------|
| Vanilla | 原版 | Mojang API |
| Paper | Bukkit | PaperMC API |
| Purpur | Bukkit | PurpurMC API |
| CraftBukkit | Bukkit | BuildTools |
| Spigot | Bukkit | BuildTools |
| Forge | Mod 加载器 | Forge Maven |
| Fabric | Mod 加载器 | Fabric Meta API |
| NeoForge | Mod 加载器 | NeoForged Maven |
| Sponge | Mod 加载器 | Ore API |
| Mohist | 混合 | GitHub Releases |

## 📦 源码构建

```
git clone https://github.com/aaatri/MCServerTools.git
cd MCServerTools
npm install
npm run dev
```

构建生产版本：

```
npm run build
```

