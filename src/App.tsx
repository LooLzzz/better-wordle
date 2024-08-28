import { Box, Button, Stack } from '@mantine/core'
import { useRef } from 'react'

import { FloatingKeyboard, WordsGuesser } from '@/components'
import { useWordleStore } from '@/hooks'

import './App.css'


function App() {
  const [
    resetStore,
  ] = useWordleStore((state) => [
    state.resetStore,
  ])

  const buttonRef = useRef<HTMLButtonElement>(null)

  const onResetStore = () => {
    resetStore()
    buttonRef.current?.blur()
  }

  return (
    <Stack h='100%' align='center' justify='space-around'>
      <div>
        <Button ref={buttonRef} onClick={onResetStore}>
          Reset
        </Button>
      </div>

      {/* <div>
        the word is: {answer}
      </div> */}

      <Box h='100%' mah='60rem' style={{ justifySelf: 'start' }}>
        <WordsGuesser />
      </Box>

      <FloatingKeyboard />
    </Stack>
  )
}

export default App
