import { CoreProvider, CoreInfo, CoreVersion } from './CoreProvider'
import { fetchJson, downloadFile } from '../utils/download'
import * as path from 'path'
import { BrowserWindow } from 'electron'

interface PaperProject { version_groups: string[]; versions: string[] }
interface PaperBuilds { builds: Array<{ build: number; downloads: { application: { name: string } } }> }

export class PaperProvider implements CoreProvider {
  info: CoreInfo = {
    id: 'paper',
    name: 'Paper',
    type: 'bukkit',
    description: '高性能 Bukkit 分支，修复了大量 Vanilla/Spigot 漏洞，社区最活跃',
    color: '#F5A623',
    iconUrl: '/icons/paper.ico',
  }

  private baseUrl = 'https://api.papermc.io/v2/projects/paper'

  async fetchVersions(): Promise<CoreVersion[]> {
    const project = await fetchJson<PaperProject>(this.baseUrl)
    return project.versions
      .filter(v => !v.includes('pre') && !v.includes('rc'))
      .map(v => ({ id: v, type: 'release' as const }))
  }

  async download(version: string, destDir: string, win?: BrowserWindow): Promise<string> {
    const buildsData = await fetchJson<PaperBuilds>(`${this.baseUrl}/versions/${version}/builds`)
    const build = buildsData.builds
      .filter(b => b.downloads?.application)
      .pop()
    if (!build) throw new Error(`版本 ${version} 无可用构建`)

    const jarName = build.downloads.application.name
    const jarUrl = `${this.baseUrl}/versions/${version}/builds/${build.build}/downloads/${jarName}`
    const jarPath = path.join(destDir, 'paper.jar')

    await downloadFile(jarUrl, jarPath, win)
    return jarPath
  }

  getLaunchJar(serverDir: string): string {
    return path.join(serverDir, 'paper.jar')
  }

  getDefaultArgs(): string[] {
    return []
  }
}
