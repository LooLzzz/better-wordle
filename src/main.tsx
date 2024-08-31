import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'

import { CSSVariablesResolver, MantineProvider, createTheme, localStorageColorSchemeManager } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import './index.css'

const colorSchemeManager = localStorageColorSchemeManager({
  key: 'better-wordle-color-scheme',
})

const cssResolver: CSSVariablesResolver = (theme) => ({
  variables: {
    '--color-letter-state-perfect': theme.colors.green[9],
    '--color-letter-state-correct': theme.colors.yellow[9],
    '--color-letter-state-incorrect': theme.colors.gray[8],
    '--color-letter-state-incorrect-light': 'var(--mantine-color-dimmed)',
  },

  light: {
    '--mantine-color-body': theme.colors.gray[1],
    '--color-letter-state-incorrect': theme.colors.gray[7],
    '--color-letter-filled-border': 'color-mix(in srgb, var(--mantine-color-default-border), #000 20%)',
    '--color-letter-selected': theme.colors.gray[3],
  },

  dark: {
    '--color-letter-filled-border': 'color-mix(in srgb, var(--mantine-color-default-border), #fff 20%)',
    '--color-letter-selected': theme.colors.gray[7],
  },
})

const theme = createTheme({

})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme='dark'
      colorSchemeManager={colorSchemeManager}
      cssVariablesResolver={cssResolver}
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
