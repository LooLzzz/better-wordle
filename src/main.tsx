import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'better-wordle-color-scheme',
})

const theme = createTheme({

})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme='dark'
      colorSchemeManager={colorSchemeManager}
      theme={theme}
    >
      <Notifications
        position='top-center'
        autoClose={3000}
        limit={2}
      />
      <App />
    </MantineProvider>
  </StrictMode>,
)
