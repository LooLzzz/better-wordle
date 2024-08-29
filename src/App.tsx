import { Box, Stack } from '@mantine/core'

import { FloatingKeyboard, WordsGuesser } from '@/components'

import './App.css'


function App() {
  return (
    <Stack h='100%' align='center' justify='center' gap={50}>
      <Box mah='60rem' style={{ justifySelf: 'start' }}>
        <WordsGuesser />
      </Box>

      <FloatingKeyboard />
    </Stack>
  )
}

export default App
