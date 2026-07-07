import * as fs from 'fs'
import * as path from 'path'

export interface ServerDetection {
  jarName: string
  coreId: string
  coreName: string
  version: string
  jarFiles: string[]
}

const patterns: Array<{ regex: RegExp; id: string; name: string }> = [
  { regex: /^paper-?(\d[\d.]*)?/i, id: 'paper', name: 'Paper' },
  { regex: /^purpur-?(\d[\d.]*)?/i, id: 'purpur', name: 'Purpur' },
  { regex: /^forge-?(\d[\d.]*)?/i, id: 'forge', name: 'Forge' },
  { regex: /^fabric-?(\d[\d.]*)?/i, id: 'fabric', name: 'Fabric' },
  { regex: /^neoforge-?(\d[\d.]*)?/i, id: 'neoforge', name: 'NeoForge' },
  { regex: /^spongevanilla-?(\d[\d.]*)?/i, id: 'sponge', name: 'Sponge' },
  { regex: /^mohist-?(\d[\d.]*)?/i, id: 'mohist', name: 'Mohist' },
  { regex: /^craftbukkit-?(\d[\d.]*)?/i, id: 'craftbukkit', name: 'CraftBukkit' },
  { regex: /^spigot-?(\d[\d.]*)?/i, id: 'spigot', name: 'Spigot' },
  { regex: /^server\.jar$/i, id: 'vanilla', name: 'Vanilla' },
]

export function detectServer(dir: string): ServerDetection {
  let files: string[] = []
  try { files = fs.readdirSync(dir).filter(f => f.endsWith('.jar')) } catch { /* ignore */ }

  for (const file of files) {
    for (const p of patterns) {
      const m = file.match(p.regex)
      if (m) {
        return { jarName: file, coreId: p.id, coreName: p.name, version: m[1] || '未知', jarFiles: files }
      }
    }
  }

  const largest = files.map(f => ({ name: f, size: fs.statSync(path.join(dir, f)).size }))
    .sort((a, b) => b.size - a.size)

  return {
    jarName: largest[0]?.name || 'server.jar',
    coreId: 'unknown',
    coreName: largest[0]?.name?.replace(/\.jar$/i, '') || '未知',
    version: '未知',
    jarFiles: files,
  }
}
