<p align="center">
  <img src="public/icons/app-icon.png" width="128" height="128" alt="MCServerTools">
</p>

<h1 align="center">MCServerTools</h1>

<p align="center">
  跨平台 Minecraft 服务器搭建工具
</p>

<p align="center">
  <i>"化繁为简，让每一位服主都能专注于游戏本身的纯粹。"</i>
</p>

<p align="center">
  <a href="https://github.com/aaatri/MCServerTools/releases"><img src="https://img.shields.io/github/v/release/aaatri/MCServerTools?color=brightgreen&label=version" alt="Version"></a>
  <a href="https://github.com/aaatri/MCServerTools"><img src="https://img.shields.io/badge/language-React%20%7C%20Electron-blueviolet" alt="Language"></a>
  <a href="https://github.com/aaatri/MCServerTools"><img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform"></a>
  <a href="https://github.com/aaatri/MCServerTools/issues"><img src="https://img.shields.io/github/issues/aaatri/MCServerTools?color=orange" alt="Issues"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/aaatri/MCServerTools?color=yellow" alt="License"></a>
  <a href="https://github.com/aaatri/MCServerTools"><img src="https://img.shields.io/github/stars/aaatri/MCServerTools?style=social" alt="Stars"></a>
</p>

> **注意：** 目前 MCServerTools 处于开发完善阶段，可能存在部分 BUG，欢迎通过 Issues 提交反馈。

---

## 目录

- [主要特点](#主要特点)
- [支持系统](#支持系统)
- [快速上手](#快速上手)
- [支持的核心](#支持核心)
- [项目结构](#项目结构)
- [社区与支持](#社区与支持)
- [鸣谢](#鸣谢)
- [协议与免责声明](#协议与免责声明)

---

## 主要特点

- **一键部署**：选择核心 → 选择版本 → 自动下载 → 开箱即用
- **多核心支持**：内置 10 种核心（Vanilla / Paper / Purpur / Forge / Fabric / NeoForge / Sponge / Mohist / CraftBukkit / Spigot）
- **配置管理**：图形化修改 `server.properties`，提供全中文标注，无需手动查阅文档
- **内网穿透**：内置 frp 客户端，一键将本地服务器端口暴露到公网
- **现代 UI**：采用 Material Design 设计规范，注重界面的丝滑过渡与高质感细节，支持浅色与深色主题无缝切换

---

## 支持系统

- **Windows 10+** (支持架构：AMD64 / ARM64)
- **macOS** (支持架构：Intel / Apple Silicon)
- **Linux** (支持架构：AMD64 / ARM64)

---

## 快速上手

获取源码并启动开发环境：

```bash
git clone [https://github.com/aaatri/MCServerTools.git](https://github.com/aaatri/MCServerTools.git)
cd MCServerTools
npm install
npm run dev
```

构建生产版本：

```bash
npm run build
```

---

## 支持核心

- **Vanilla**：原版 (通过 Mojang 官方 API 获取)
- **Paper**：Bukkit 类 (通过 PaperMC API 获取)
- **Purpur**：Bukkit 类 (通过 PurpurMC API 获取)
- **CraftBukkit**：Bukkit 类 (通过 BuildTools 编译获取)
- **Spigot**：Bukkit 类 (通过 BuildTools 编译获取)
- **Forge**：Mod 加载器 (通过 Forge Maven 获取)
- **Fabric**：Mod 加载器 (通过 Fabric Meta API 获取)
- **NeoForge**：Mod 加载器 (通过 NeoForged Maven 获取)
- **Sponge**：Mod 加载器 (通过 Ore API 获取)
- **Mohist**：混合核心 (通过 GitHub Releases 获取)

---

## 项目结构

```text
MCServerTools/
├── src/
│   ├── main/          # Electron 主进程代码
│   ├── renderer/      # React 前端代码 (Material UI)
│   └── shared/        # 共享的类型定义与工具方法
├── public/icons/      # 核心图标与静态资源
├── scripts/           # 辅助工具与构建脚本
├── dist/              # 编译打包输出目录
└── package.json       # 项目配置文件与依赖管理
```

---

## 社区与支持

如果在安装或使用过程中遇到任何问题，或者有新的功能建议，欢迎随时交流：

- **提交 Issue**：[GitHub Issues 页面](https://github.com/aaatri/MCServerTools/issues)
- **获取最新版本**：[GitHub Releases 页面](https://github.com/aaatri/MCServerTools/releases)

---

## 鸣谢

MCServerTools 的诞生离不开以下优秀的开源项目与社区生态：

- **frp**：提供稳定高效的内网穿透反向代理支持。
- **PaperMC / Purpur / Fabric 等开源社区**：为工具提供了可靠的服务端 API 数据源。
- **Material UI**：为本工具的前端界面提供了高质量的组件库支持。

---

## 协议与免责声明

本项目采用 **MIT License** 开源协议，您可以自由地使用、修改和分发本项目代码，但需保留完整的版权声明和免责声明。

**合规注意**：
- 使用本工具下载和运行 Minecraft 服务端即表示您同意并遵守 Mojang 的 [最终用户许可协议 (EULA)](https://account.mojang.com/documents/minecraft_eula)。
- 本项目仅提供纯粹的技术聚合与自动化下载服务，不对任何通过本工具架设的服务器内产生的内容或纠纷负责。
