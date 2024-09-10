import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './index.scss'

import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import router from './router'
import { colorSchemeManager, cssResolver, theme } from './theme'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider
      colorSchemeManager={colorSchemeManager}
      cssVariablesResolver={cssResolver}
      theme={theme}
    >
      <Notifications
        position='top-center'
        autoClose={3000}
        limit={2}
      />
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>
)
