import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import * as fs from 'fs'
import * as https from 'https'
import * as path from 'path'
import { downloadCore, getAllProviders, getVersions } from './core'
import { detectServer } from './detect'
import { FrpManager } from './frp/FrpManager'
import { detectJava } from './java'
import { ServerManager } from './server/ServerManager'
import { addServer, getServers, removeServer, updateServer } from './store'

const serverManager = new ServerManager()
const frpManager = new FrpManager()
let ipcRegistered = false

interface LatestReleaseInfo {
  repo: string
  source: string
  version: string
  tag: string
  title: string
  publishedAt?: string | null
  url: string
  notes: string[]
}

const UPDATE_INFO_URLS = [
  'https://raw.githubusercontent.com/aaatri/MCServerTools/master/public/latest.json',
  'https://cdn.jsdelivr.net/gh/aaatri/MCServerTools@master/public/latest.json',
]

function getProjectVersion(): string {
  const candidates = [
    path.join(process.cwd(), 'package.json'),
    path.join(app.getAppPath(), 'package.json'),
    path.join(app.getAppPath(), '..', 'package.json'),
  ]

  for (const filePath of candidates) {
    try {
      if (!fs.existsSync(filePath)) continue
      const content = fs.readFileSync(filePath, 'utf-8')
      const match = content.match(/"version"\s*:\s*"([^"]+)"/)
      if (match?.[1]) return match[1]
    } catch {
      // keep trying
    }
  }

  return app.getVersion()
}

function requestJson<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    https.get(
      url,
      {
        headers: {
          'User-Agent': 'MCServerTools-Updater',
          'Accept': 'application/json',
        },
      },
      (res) => {
        const statusCode = res.statusCode || 0
        if (statusCode < 200 || statusCode >= 300) {
          reject(new Error(`HTTP ${statusCode}`))
          res.resume()
          return
        }

        let data = ''
        res.setEncoding('utf8')
        res.on('data', chunk => { data += chunk })
        res.on('end', () => {
          try {
            resolve(JSON.parse(data) as T)
          } catch (error: any) {
            reject(new Error(`Invalid JSON: ${error.message}`))
          }
        })
      },
    ).on('error', reject)
  })
}

async function checkForUpdates(): Promise<LatestReleaseInfo> {
  let lastError: Error | null = null

  for (const url of UPDATE_INFO_URLS) {
    try {
      return await requestJson<LatestReleaseInfo>(`${url}?t=${Date.now()}`)
    } catch (error: any) {
      lastError = error instanceof Error ? error : new Error(String(error))
    }
  }

  throw lastError || new Error('Unable to load latest.json')
}

export function registerIpcHandlers(mainWindow: BrowserWindow) {
  serverManager.setWindow(mainWindow)
  frpManager.setWindow(mainWindow)

  if (ipcRegistered) return
  ipcRegistered = true

  const emitServersChanged = () => {
    mainWindow.webContents.send('servers:changed')
  }

  ipcMain.handle('core:getCores', () => getAllProviders())
  ipcMain.handle('core:getVersions', (_e, coreId: string) => getVersions(coreId))
  ipcMain.handle('core:download', (_e, coreId: string, version: string, destDir: string) =>
    downloadCore(coreId, version, destDir, mainWindow),
  )

  ipcMain.handle('server:start', async (_e, serverDir: string, jarName: string, maxRam: number, javaPath?: string) => {
    serverManager.start({ serverDir, jarPath: path.join(serverDir, jarName), jarName, maxRam, javaPath })
  })
  ipcMain.handle('server:stop', () => serverManager.stop())
  ipcMain.handle('server:status', () => (serverManager.running ? 'running' : 'stopped'))
  ipcMain.handle('server:command', (_e, cmd: string) => serverManager.sendCommand(cmd))

  ipcMain.handle('servers:list', () => getServers())
  ipcMain.handle('servers:add', (_e, s) => { addServer(s); emitServersChanged() })
  ipcMain.handle('servers:remove', (_e, id: string, options?: { deleteFiles?: boolean }) => {
    const server = getServers().find(item => item.id === id)
    if (!server) return

    const shouldDeleteFiles = options?.deleteFiles === true
    const runningConfig = serverManager.getConfig()
    if (shouldDeleteFiles && serverManager.running && runningConfig?.serverDir === server.path) {
      throw new Error('请先停止该服务器，再删除文件')
    }

    removeServer(id)

    if (shouldDeleteFiles && fs.existsSync(server.path)) {
      fs.rmSync(server.path, { recursive: true, force: true })
    }

    emitServersChanged()
  })
  ipcMain.handle('servers:update', (_e, id: string, u) => { updateServer(id, u); emitServersChanged() })

  ipcMain.handle('frp:start', async (_e, config) => { await frpManager.start(config) })
  ipcMain.handle('frp:stop', () => { frpManager.stop() })
  ipcMain.handle('frp:status', () => (frpManager.running ? 'running' : 'stopped'))

  ipcMain.handle('file:read', async (_e, filePath: string) => fs.readFileSync(filePath, 'utf-8'))
  ipcMain.handle('file:write', async (_e, filePath: string, content: string) => {
    fs.writeFileSync(filePath, content, 'utf-8')
  })

  ipcMain.handle('dialog:selectDirectory', async () => {
    const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
    return result.canceled ? null : result.filePaths[0]
  })

  ipcMain.handle('java:detect', () => detectJava())
  ipcMain.handle('server:detect', (_e, dir: string) => detectServer(dir))
  ipcMain.handle('app:getVersion', () => getProjectVersion())
  ipcMain.handle('app:checkForUpdates', () => checkForUpdates())
  ipcMain.handle('app:openExternal', (_e, url: string) => shell.openExternal(url))
}
