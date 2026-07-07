# MinecraftServerTools — 开发计划

## 一、项目概述
跨平台（Windows / Linux / macOS，AMD64 + ARM64）Electron 桌面应用，自动搭建 Minecraft 服务器，支持多核心选择、配置修改、frp 内网穿透。

## 二、技术栈
| 层面 | 选型 |
|------|------|
| 框架 | Electron + Electron Builder |
| 前端 | React / Vue (TBD) + Material Design |
| 语言 | TypeScript (主), Rust (可选, 性能敏感模块) |
| 构建 | electron-builder + GitHub Actions (CI/CD) |
| 包管理 | pnpm |

## 三、核心支持清单 (共 10 种)

| # | 核心 | 类型 | 下载源 | 启动参数特点 |
|---|------|------|--------|-------------|
| 1 | Vanilla | 原版 | Mojang API (version_manifest.json) | 直接 `-jar server.jar` |
| 2 | CraftBukkit | Bukkit 分支 | 需从 BuildTools 编译 | `-jar craftbukkit.jar` |
| 3 | Spigot | Bukkit 分支 | 需从 BuildTools 编译 | `-jar spigot.jar` |
| 4 | Paper | Bukkit 分支 | PaperMC API | `-jar paper.jar` (支持 `--paper-detect` ) |
| 5 | Purpur | Bukkit 分支 | PurpurMC API | `-jar purpur.jar` |
| 6 | Forge | Mod 加载器 | Forge CDN / maven | 安装器模式：先安装再启动 |
| 7 | Fabric | Mod 加载器 | Fabric Maven + installer | 安装器模式 |
| 8 | NeoForge | Mod 加载器 (Forge 后继) | NeoForge Maven | 安装器模式 |
| 9 | Sponge | Mod 加载器 (SpongeAPI) | Sponge 官网 / Ore | `-jar sponge.jar` |
| 10 | Mohist | 混合 (Forge + Bukkit) | MohistMC Release | `-jar mohist.jar` |

## 四、阶段规划

### Phase 1 — 项目脚手架 & 基础架构
- [ ] Electron 项目初始化 (React/Vue + TypeScript)
- [ ] Electron Builder 配置 (Windows NSIS, macOS DMG, Linux AppImage)
- [ ] 多架构构建脚本 (AMD64 / ARM64)
- [ ] Material Design 主题系统 (浅色 / 深色切换)
- [ ] 主窗口布局: 侧边导航 + 内容区

### Phase 2 — 核心下载引擎
- [ ] 抽象 `CoreProvider` 接口: `fetchVersions()`, `download(version, outputDir)`, `getLaunchJar()`
- [ ] 实现 10 个 Provider:
  - **VanillaProvider**: 解析 version_manifest.json，下载 server.jar
  - **PaperProvider**: 调用 PaperMC API
  - **PurpurProvider**: 调用 PurpurMC API
  - **CraftBukkitProvider / SpigotProvider**: 调用 BuildTools 自动编译
  - **ForgeProvider / NeoForgeProvider**: 解析 maven 元数据，运行 installer
  - **FabricProvider**: 使用 fabric-installer 生成服务器文件
  - **SpongeProvider**: 从 Ore API 获取
  - **MohistProvider**: 从 GitHub Release 获取
- [ ] 断点续传 + 校验 (SHA-256)
- [ ] 进度回调 → UI 进度条

### Phase 3 — 服务端生命周期管理
- [ ] 配置生成 (server.properties, eula.txt, ops.json 等)
- [ ] 子进程管理 (启动 / 停止 / 重启 / 崩溃自动重启)
- [ ] 控制台日志实时输出 + 过滤
- [ ] 内存 / JVM 参数配置 UI

### Phase 4 — frp 内网穿透
- [ ] 内置 frpc 二进制 (分平台分架构分发)
- [ ] frpc.toml 生成器 (服务端地址、token、端口映射)
- [ ] frp 进程管理 (启动 / 停止 / 状态监控)
- [ ] 一键开启穿透

### Phase 5 — 后端服务 (可选)
- [ ] 用户系统
- [ ] 云端配置同步
- [ ] 插件市场 / 模组市场

### Phase 6 — 测试 & 分发
- [ ] 单元测试 (核心下载、配置生成)
- [ ] 集成测试 (各核心实际启动验证)
- [ ] CI: GitHub Actions 多平台构建
- [ ] 自动更新 (electron-updater)

## 五、项目结构 (草案)

```
MinecraftServerTools/
├── src/
│   ├── main/            # Electron 主进程
│   │   ├── core/        # 10 种 CoreProvider 实现
│   │   ├── server/      # 服务进程管理
│   │   ├── frp/         # frp 管理
│   │   └── updater/     # 自动更新
│   ├── renderer/        # 前端 UI (React/Vue)
│   │   ├── components/
│   │   ├── pages/       # 首页、核心选择、服务器设置、frp
│   │   ├── theme/       # Material Design 主题
│   │   └── i18n/        # 国际化
│   └── shared/          # 类型定义、常量
├── build/               # 构建配置、图标
├── scripts/             # CI 脚本
├── resources/           # 各平台资源
├── electron-builder.yml
├── package.json
└── PLAN.md
```

## 六、图标处理
- 自动从各核心官网 / 仓库抓取 favicon 或 logo
- 备选: 使用内置图标库 (Material Icons) 映射
- 用户自定义图标功能 (可选)

## 七、注意事项
1. **EULA**: 所有 Bukkit 派生核心需自动同意 Mojang EULA
2. **BuildTools**: CraftBukkit / Spigot 需要 JDK 环境，安装时需检测或自动下载 JDK
3. **ARM64 兼容**: Forge / NeoForge 部分版本可能不支持 ARM，需做检测并提示
4. **frp 二进制**: 需分 6 种组合 (3 系统 × 2 架构) 打包或首次下载
5. **Java 检测**: 程序需自动检测系统 Java 或内置 JDK (建议用 adoptium API)
