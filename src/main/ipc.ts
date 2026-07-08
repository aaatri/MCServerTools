import { ipcMain, dialog, BrowserWindow } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { getAllProviders, getProvider, downloadCore } from './core'
import { ServerManager } from './server/ServerManager'
import { FrpManager } from './frp/FrpManager'
import { detectJava } from './java'
import { detectServer } from './detect'
import { getServers, addServer, removeServer, updateServer } from './store'

const serverManager = new ServerManager()
const frpManager = new FrpManager()
let ipcRegistered = false

export function registerIpcHandlers(mainWindow: BrowserWindow) {
  serverManager.setWindow(mainWindow)
  frpManager.setWindow(mainWindow)

  if (ipcRegistered) {
    return
  }

  ipcRegistered = true

  const emitServersChanged = () => {
    mainWindow.webContents.send('servers:changed')
  }

  ipcMain.handle('core:getCores', () => getAllProviders().map(p => p.info))
  ipcMain.handle('core:getVersions', async (_e, coreId: string) => {
    const p = getProvider(coreId)
    if (!p) throw new Error(`未知核心: ${coreId}`)
    return p.fetchVersions()
  })
  ipcMain.handle('core:download', async (_e, coreId: string, version: string, destDir: string) =>
    downloadCore(coreId, version, destDir, mainWindow)
  )

  ipcMain.handle('server:start', async (_e, serverDir: string, jarName: string, maxRam: number, javaPath?: string) => {
    serverManager.start({ serverDir, jarPath: path.join(serverDir, jarName), jarName, maxRam, javaPath })
  })
  ipcMain.handle('server:stop', () => serverManager.stop())
  ipcMain.handle('server:status', () => serverManager.running ? 'running' : 'stopped')
  ipcMain.handle('server:command', (_e, cmd: string) => serverManager.sendCommand(cmd))

  ipcMain.handle('servers:list', () => getServers())
  ipcMain.handle('servers:add', (_e, s) => { addServer(s); emitServersChanged() })
  ipcMain.handle('servers:remove', (_e, id: string, options?: { deleteFiles?: boolean }) => {
    const server = getServers().find(s => s.id === id)
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
  ipcMain.handle('frp:status', () => frpManager.running ? 'running' : 'stopped')

  ipcMain.handle('file:read', async (_e, filePath: string) => fs.readFileSync(filePath, 'utf-8'))
  ipcMain.handle('file:write', async (_e, filePath: string, content: string) => {
    fs.writeFileSync(filePath, content, 'utf-8')
  })

  ipcMain.handle('dialog:selectDirectory', async () => {
    const r = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] })
    return r.canceled ? null : r.filePaths[0]
  })

  ipcMain.handle('java:detect', () => detectJava())
  ipcMain.handle('server:detect', (_e, dir: string) => detectServer(dir))
}
