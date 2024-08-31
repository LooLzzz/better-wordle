import { Box, Burger, Stack, useComputedColorScheme } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { Helmet } from 'react-helmet'

import { FloatingKeyboard, Sidebar, WordsGuesser } from '@/components'

import classes from './App.module.scss'


function App() {
  const colorScheme = useComputedColorScheme()
  const isXs = useMediaQuery('(max-width: 400px)')
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

      <Stack className={classes.stack} h='100%' align='center' justify='center' gap={isXs ? 30 : 50}>
        <Box mah='60rem' style={{ justifySelf: 'start' }}>
          <WordsGuesser />
        </Box>

        <FloatingKeyboard />
      </Stack>
    </>
  )
}

export default App
