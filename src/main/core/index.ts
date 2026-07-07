import { CoreProvider } from './CoreProvider'
import { VanillaProvider } from './VanillaProvider'
import { PaperProvider } from './PaperProvider'
import { PurpurProvider } from './PurpurProvider'
import { MohistProvider } from './MohistProvider'
import { SpongeProvider } from './SpongeProvider'
import { FabricProvider } from './FabricProvider'
import { NeoForgeProvider } from './NeoForgeProvider'
import { ForgeProvider } from './ForgeProvider'
import { CraftBukkitProvider, SpigotProvider } from './BuildToolsProvider'
import { BrowserWindow } from 'electron'

const allProviders: CoreProvider[] = [
  new VanillaProvider(),
  new PaperProvider(),
  new PurpurProvider(),
  new CraftBukkitProvider(),
  new SpigotProvider(),
  new ForgeProvider(),
  new FabricProvider(),
  new NeoForgeProvider(),
  new SpongeProvider(),
  new MohistProvider(),
]

const providerMap = new Map(allProviders.map(p => [p.info.id, p]))

export function getProvider(id: string): CoreProvider | undefined {
  return providerMap.get(id)
}

export function getAllProviders(): CoreProvider[] {
  return allProviders
}

export async function downloadCore(id: string, version: string, destDir: string, win?: BrowserWindow): Promise<string> {
  const provider = getProvider(id)
  if (!provider) throw new Error(`未知核心: ${id}`)
  return provider.download(version, destDir, win)
}
