import { CoreProvider, CoreInfo, CoreVersion } from './CoreProvider'
import { fetchJson, downloadFile } from '../utils/download'
import * as path from 'path'
import { BrowserWindow } from 'electron'

interface OreProject { name: string; recommended: any; versions: Array<{ name: string; type: string }> }
interface OreVersion { id: string; download: { url: string } }

export class SpongeProvider implements CoreProvider {
  info: CoreInfo = {
    id: 'sponge', name: 'Sponge', type: 'modded',
    description: '全新架构的 Mod API，稳定且高性能',
    color: '#FFD700', iconUrl: '/icons/sponge.ico',
  }

  async fetchVersions(): Promise<CoreVersion[]> {
    const data = await fetchJson<OreProject>('https://ore.spongepowered.org/api/v1/projects/spongevanilla')
    return (data.versions || [])
      .filter((v: any) => v.type === 'release')
      .map((v: any) => ({ id: v.name, type: 'release' as const }))
  }

  async download(version: string, destDir: string, win?: BrowserWindow): Promise<string> {
    const data = await fetchJson<any>(`https://ore.spongepowered.org/api/v1/projects/spongevanilla/versions/${version}`)
    const url = data?.download?.url || data?.download?.href
    if (!url) throw new Error(`Sponge 版本 ${version} 无下载链接`)

    const jarPath = path.join(destDir, 'sponge.jar')
    await downloadFile(url.startsWith('http') ? url : `https://ore.spongepowered.org${url}`, jarPath, win)
    return jarPath
  }

  getLaunchJar(serverDir: string) { return path.join(serverDir, 'sponge.jar') }
  getDefaultArgs() { return [] }
}
