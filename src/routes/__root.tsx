import { Box, Burger, useComputedColorScheme } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { Helmet } from 'react-helmet'

import { Sidebar } from '@/components'

export const Route = createRootRoute({
  component: () => {
    const colorScheme = useComputedColorScheme()
    const [isSidebarOpened, { toggle: toggleSidebar, close: closeSidebar }] = useDisclosure(false)

    return (
      <>
        <Helmet>
          <meta name='theme-color' content={colorScheme === 'dark' ? '#242424' : '#f1f3f5'} />
        </Helmet>

        <Sidebar
          opened={isSidebarOpened}
          onClose={closeSidebar}
        />

        <Box
          pos='absolute'
          top={10}
          left={10}
        >
          <Burger
            opened={isSidebarOpened}
            onClick={toggleSidebar}
            opacity={0.6}
          />
        </Box>

        <Outlet />
      </>
    )
  },
})
