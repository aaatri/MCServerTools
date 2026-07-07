import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
  getCores: () => ipcRenderer.invoke('core:getCores'),
  getVersions: (coreId: string) => ipcRenderer.invoke('core:getVersions', coreId),
  downloadCore: (coreId: string, version: string, destDir: string) =>
    ipcRenderer.invoke('core:download', coreId, version, destDir),

  startServer: (serverDir: string, jarPath: string, jarName: string, maxRam: number, javaPath?: string) =>
    ipcRenderer.invoke('server:start', serverDir, jarPath, jarName, maxRam, javaPath),
  stopServer: () => ipcRenderer.invoke('server:stop'),
  getServerStatus: () => ipcRenderer.invoke('server:status'),
  sendServerCommand: (cmd: string) => ipcRenderer.invoke('server:command', cmd),

  serversList: () => ipcRenderer.invoke('servers:list'),
  serversAdd: (s: any) => ipcRenderer.invoke('servers:add', s),
  serversRemove: (id: string) => ipcRenderer.invoke('servers:remove', id),
  serversUpdate: (id: string, u: any) => ipcRenderer.invoke('servers:update', id, u),

  readFile: (filePath: string) => ipcRenderer.invoke('file:read', filePath),
  writeFile: (filePath: string, content: string) => ipcRenderer.invoke('file:write', filePath, content),
  selectDirectory: () => ipcRenderer.invoke('dialog:selectDirectory'),

  detectJava: () => ipcRenderer.invoke('java:detect'),
  detectServer: (dir: string) => ipcRenderer.invoke('server:detect', dir),

  onServerLog: (callback: (log: string) => void) => {
    const h = (_: any, log: string) => callback(log)
    ipcRenderer.on('server:log', h)
    return () => { ipcRenderer.removeListener('server:log', h) }
  },
  onServerStatus: (callback: (status: string) => void) => {
    const h = (_: any, status: string) => callback(status)
    ipcRenderer.on('server:status', h)
    return () => { ipcRenderer.removeListener('server:status', h) }
  },
  onDownloadProgress: (callback: (p: any) => void) => {
    const h = (_: any, p: any) => callback(p)
    ipcRenderer.on('download:progress', h)
    return () => { ipcRenderer.removeListener('download:progress', h) }
  },

  frpStart: (config: any) => ipcRenderer.invoke('frp:start', config),
  frpStop: () => ipcRenderer.invoke('frp:stop'),
  frpStatus: () => ipcRenderer.invoke('frp:status'),
  onFrpLog: (callback: (log: string) => void) => {
    const h = (_: any, log: string) => callback(log)
    ipcRenderer.on('frp:log', h)
    return () => { ipcRenderer.removeListener('frp:log', h) }
  },
  onFrpStatus: (callback: (status: string) => void) => {
    const h = (_: any, status: string) => callback(status)
    ipcRenderer.on('frp:status', h)
    return () => { ipcRenderer.removeListener('frp:status', h) }
  },
})
