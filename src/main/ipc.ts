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

export function registerIpcHandlers(mainWindow: BrowserWindow) {
  serverManager.setWindow(mainWindow)
  frpManager.setWindow(mainWindow)

  ipcMain.handle('core:getCores', () => getAllProviders().map(p => p.info))
  ipcMain.handle('core:getVersions', async (_e, coreId: string) => {
    const p = getProvider(coreId)
    if (!p) throw new Error(`未知核心: ${coreId}`)
    return p.fetchVersions()
  })
  ipcMain.handle('core:download', async (_e, coreId: string, version: string, destDir: string) =>
    downloadCore(coreId, version, destDir, mainWindow)
  )

  ipcMain.handle('server:start', async (_e, serverDir: string, jarPath: string, jarName: string, maxRam: number, javaPath?: string) => {
    serverManager.start({ serverDir, jarPath: path.join(serverDir, jarName), jarName, maxRam, javaPath })
  })
  ipcMain.handle('server:stop', () => serverManager.stop())
  ipcMain.handle('server:status', () => serverManager.running ? 'running' : 'stopped')
  ipcMain.handle('server:command', (_e, cmd: string) => serverManager.sendCommand(cmd))

  ipcMain.handle('servers:list', () => getServers())
  ipcMain.handle('servers:add', (_e, s) => { addServer(s) })
  ipcMain.handle('servers:remove', (_e, id: string) => { removeServer(id) })
  ipcMain.handle('servers:update', (_e, id: string, u) => { updateServer(id, u) })

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
