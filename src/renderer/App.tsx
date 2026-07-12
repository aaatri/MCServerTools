import React, { Component, useMemo, useState } from 'react'
import { Box, Button, CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { CoreSelectPage } from './pages/CoreSelectPage'
import { FrpPage } from './pages/FrpPage'
import { HomePage } from './pages/HomePage'
import { ServerPage } from './pages/ServerPage'
import { SettingsPage } from './pages/SettingsPage'
import { darkTheme, lightTheme } from './theme'

export type Page = 'home' | 'cores' | 'server' | 'frp' | 'settings' | 'about'

class ErrorBoundary extends Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            渲染出错
          </Typography>
          <Typography variant="body2" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
            {this.state.error.message}
          </Typography>
          <Button variant="outlined" onClick={() => this.setState({ error: null })}>
            重试
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export function App() {
  const [darkMode, setDarkMode] = useState(false)
  const [page, setPage] = useState<Page>('home')
  const theme = useMemo(() => (darkMode ? darkTheme : lightTheme), [darkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <Layout
          page={page}
          onPageChange={setPage}
          darkMode={darkMode}
          onToggleDark={() => setDarkMode(value => !value)}
        >
          <Box sx={{ display: page === 'home' ? '' : 'none' }}>
            <HomePage onNavigate={setPage} />
          </Box>
          <Box sx={{ display: page === 'cores' ? '' : 'none' }}>
            <CoreSelectPage />
          </Box>
          <Box sx={{ display: page === 'server' ? '' : 'none' }}>
            <ServerPage active={page === 'server'} />
          </Box>
          <Box sx={{ display: page === 'frp' ? '' : 'none' }}>
            <FrpPage />
          </Box>
          <Box sx={{ display: page === 'settings' ? '' : 'none' }}>
            <SettingsPage />
          </Box>
          <Box sx={{ display: page === 'about' ? '' : 'none' }}>
            <AboutPage />
          </Box>
        </Layout>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
