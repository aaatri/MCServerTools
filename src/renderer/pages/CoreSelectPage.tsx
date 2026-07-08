import React, { useEffect, useState } from 'react'
import {
  Box, Typography, Grid, Paper, Chip, Button, Avatar,
  Select, MenuItem, FormControl, InputLabel, LinearProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Alert,
} from '@mui/material'
import { CloudDownload, CheckCircle } from '@mui/icons-material'
import { SERVER_PROFILE_FILE, serializeServerProfile } from '../serverProfile'

const typeColors: Record<string, string> = {
  vanilla: '#4CAF50', bukkit: '#FF9800', modded: '#2196F3', hybrid: '#F44336',
}
const typeLabels: Record<string, string> = {
  vanilla: '原版', bukkit: 'Bukkit', modded: 'Mod加载器', hybrid: '混合',
}

function formatSpeed(bytes: number): string {
  if (bytes < 1024) return `${bytes} B/s`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB/s`
  return `${(bytes / 1048576).toFixed(1)} MB/s`
}

function getBaseName(filePath: string): string {
  const parts = filePath.split(/[\\/]/).filter(Boolean)
  return parts[parts.length - 1] || 'server.jar'
}

function joinPath(...parts: string[]) {
  return parts
    .filter(Boolean)
    .map((part, index) => index === 0 ? part.replace(/[\\/]+$/, '') : part.replace(/^[\\/]+|[\\/]+$/g, ''))
    .join('/')
}

export function CoreSelectPage() {
  const [cores, setCores] = useState<CoreInfo[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [versions, setVersions] = useState<CoreVersion[]>([])
  const [chosenVersion, setChosenVersion] = useState('')
  const [downloading, setDownloading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(0)
  const [fileName, setFileName] = useState('')
  const [destDir, setDestDir] = useState('')
  const [serverName, setServerName] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [pickDirOpen, setPickDirOpen] = useState(false)
  const [javaInfo, setJavaInfo] = useState('检测中...')

  useEffect(() => {
    if (window.electronAPI?.getCores) {
      window.electronAPI.getCores().then(setCores).catch(() => {})
    }
    if (window.electronAPI?.detectJava) {
      window.electronAPI.detectJava().then(info => {
        setJavaInfo(info ? `Java ${info.version}` : '未检测到 Java')
      }).catch(() => setJavaInfo('检测失败'))
    }
  }, [])

  useEffect(() => {
    if (!window.electronAPI?.onDownloadProgress) return
    const unsub = window.electronAPI.onDownloadProgress((p) => {
      setProgress(p.percent)
      setSpeed(p.speed)
      setFileName(p.fileName)
    })
    return unsub
  }, [])

  async function handleSelect(coreId: string) {
    setSelected(coreId)
    setChosenVersion('')
    setDone(false)
    setError('')
    setServerName('')
    try { const v = await window.electronAPI.getVersions(coreId); setVersions(v) }
    catch { setVersions([]) }
  }

  async function handlePickDir() {
    const dir = await window.electronAPI.selectDirectory()
    if (dir) setDestDir(dir)
    setPickDirOpen(false)
  }

  async function handleDownload() {
    if (!selected || !chosenVersion || !destDir) return
    if (!serverName.trim()) { setError('请输入服务器名称'); return }
    setDownloading(true)
    setError('')
    setProgress(0)
    setSpeed(0)
    try {
      const jarPath = await window.electronAPI.downloadCore(selected, chosenVersion, destDir)
      const core = cores.find(c => c.id === selected)!
      const jarName = getBaseName(jarPath)
      await window.electronAPI.writeFile(
        joinPath(destDir, SERVER_PROFILE_FILE),
        serializeServerProfile({
          serverName: serverName.trim(),
          gameVersion: chosenVersion,
          coreType: selected,
          coreName: core.name,
        })
      )
      await window.electronAPI.serversAdd({
        id: `${Date.now()}`,
        name: serverName.trim(),
        path: destDir,
        coreId: selected,
        coreName: core.name,
        version: chosenVersion,
        jarName,
        iconUrl: core.iconUrl,
        createdAt: new Date().toISOString(),
        maxRam: 2048,
      })
      setDone(true)
    } catch (e: any) {
      setError(e.message || '下载失败')
    } finally {
      setDownloading(false)
    }
  }

  const selectedCore = cores.find(c => c.id === selected)

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom>选择服务端核心</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        共 {cores.length} 种核心，均已支持下载。部分核心（CraftBukkit、Spigot）需自行编译 BuildTools
      </Typography>
      <Alert severity={javaInfo.includes('未检测到') ? 'warning' : 'info'} sx={{ mb: 3 }} icon={false}>
        Java 环境: {javaInfo}
        {javaInfo.includes('未检测到') && ' — 下载或启动服务器需要安装 Java 17 以上'}
      </Alert>

      <Grid container spacing={2} sx={{ mb: 4 }}>
        {cores.map(core => (
          <Grid item xs={12} sm={6} md={4} key={core.id}>
            <Paper
              elevation={selected === core.id ? 3 : 1}
              sx={{
                p: 2, cursor: 'pointer',
                borderLeft: `4px solid ${core.color}`,
                opacity: selected && selected !== core.id ? 0.5 : 1,
                transition: '0.15s',
              }}
              onClick={() => handleSelect(core.id)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                {core.iconUrl && (
                  <Avatar src={core.iconUrl} sx={{ width: 32, height: 32, bgcolor: core.color }}>
                    {core.name[0]}
                  </Avatar>
                )}
                <Typography variant="h6" sx={{ flexGrow: 1 }}>{core.name}</Typography>
                <Chip label={typeLabels[core.type] || core.type} size="small" sx={{ bgcolor: typeColors[core.type], color: '#fff' }} />
              </Box>
              <Typography variant="body2" color="text.secondary">{core.description}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {selected && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>配置下载 - {selectedCore?.name}</Typography>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>版本</InputLabel>
            <Select value={chosenVersion} label="版本" onChange={e => setChosenVersion(e.target.value)} disabled={versions.length === 0 || downloading}>
              {versions.map(v => <MenuItem key={v.id} value={v.id}>{v.id}</MenuItem>)}
              {versions.length === 0 && <MenuItem disabled>暂无可选版本（核心未实现）</MenuItem>}
            </Select>
          </FormControl>

          <TextField
            fullWidth label="服务器名称" placeholder="例如：我的生存服务器"
            value={serverName} onChange={e => setServerName(e.target.value)}
            sx={{ mb: 2 }} disabled={downloading}
          />

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
            <TextField label="保存目录" value={destDir} size="small" sx={{ flexGrow: 1 }} InputProps={{ readOnly: true }} />
            <Button variant="outlined" onClick={() => setPickDirOpen(true)} disabled={downloading}>选择目录</Button>
          </Box>

          {downloading && (
            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                <Typography variant="body2">{fileName || '下载中...'}</Typography>
                <Typography variant="body2">{progress}% | {formatSpeed(speed)}</Typography>
              </Box>
              <LinearProgress variant="determinate" value={progress} />
            </Box>
          )}

          {done && (
            <Alert severity="success" sx={{ mb: 2 }}>
              下载完成！服务器「{serverName}」已保存，请前往「服务器管理」启动。
            </Alert>
          )}

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Button
            variant="contained" startIcon={done ? <CheckCircle /> : <CloudDownload />}
            onClick={handleDownload}
            disabled={!chosenVersion || !destDir || !serverName.trim() || downloading || done}
          >
            {done ? '已完成' : downloading ? '下载中...' : '下载'}
          </Button>
        </Paper>
      )}

      <Dialog open={pickDirOpen} onClose={() => setPickDirOpen(false)}>
        <DialogTitle>选择保存目录</DialogTitle>
        <DialogContent>
          <Typography>请选择一个文件夹用于存放服务端文件</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPickDirOpen(false)}>取消</Button>
          <Button variant="contained" onClick={handlePickDir}>选择文件夹</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
