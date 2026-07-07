import { CoreProvider, CoreInfo, CoreVersion } from './CoreProvider'
import { fetchJson, downloadFile } from '../utils/download'
import * as path from 'path'
import { BrowserWindow } from 'electron'

interface NeoVersion { version: string; latest: boolean }

export class NeoForgeProvider implements CoreProvider {
  info: CoreInfo = {
    id: 'neoforge', name: 'NeoForge', type: 'modded',
    description: 'Forge 的下一代分支，社区驱动开发',
    color: '#00BCD4', iconUrl: '/icons/neoforge.ico',
  }

  async fetchVersions(): Promise<CoreVersion[]> {
    try {
      const data = await fetchJson<NeoVersion[]>('https://api.neoforged.net/api/v1/versions')
      return data.map(v => ({ id: v.version, type: 'release' as const }))
    } catch {
      const text = await fetchJson<string[]>('https://maven.neoforged.net/releases/net/neoforged/neoforge/maven-metadata.json')
      if (Array.isArray(text)) return text.map(v => ({ id: v, type: 'release' as const }))
      return []
    }
  }

  async download(version: string, destDir: string, win?: BrowserWindow): Promise<string> {
    const jarPath = path.join(destDir, 'neoforge.jar')
    const url = `https://maven.neoforged.net/releases/net/neoforged/neoforge/${version}/neoforge-${version}-server.jar`
    await downloadFile(url, jarPath, win)
    return jarPath
  }

  getLaunchJar(serverDir: string) { return path.join(serverDir, 'neoforge.jar') }
  getDefaultArgs() { return [] }
}
