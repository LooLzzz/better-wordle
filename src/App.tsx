import { Box, Stack } from '@mantine/core'

import { FloatingKeyboard, WordsGuesser } from '@/components'

import classes from './App.module.scss'
import { useMediaQuery } from '@mantine/hooks'


function App() {
  const isXs = useMediaQuery('(max-width: 400px)')

  return (
    <Stack className={classes.stack} h='100%' align='center' justify='center' gap={isXs ? 30 : 50}>
      <Box mah='60rem' style={{ justifySelf: 'start' }}>
        <WordsGuesser />
      </Box>

      <FloatingKeyboard />
    </Stack>
  )
}

export default App
