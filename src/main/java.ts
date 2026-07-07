import { execSync } from 'child_process'

export interface JavaInfo {
  path: string
  version: string
  majorVersion: number
}

export function detectJava(): JavaInfo | null {
  const candidates = process.platform === 'win32'
    ? ['java', `${process.env.JAVA_HOME}\\bin\\java`]
    : ['java', '/usr/lib/jvm/default-java/bin/java']

  for (const candidate of candidates) {
    try {
      const out = execSync(`"${candidate}" -version 2>&1`).toString()
      const match = out.match(/(?:openjdk|java) version "(\d+)/i)
      if (match) {
        return {
          path: candidate,
          version: match[0],
          majorVersion: parseInt(match[1], 10),
        }
      }
    } catch { continue }
  }
  return null
}
