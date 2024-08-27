import { Button, Space, Stack } from '@mantine/core'
import { useRef } from 'react'

import { FloatingKeyboard, WordsGuesser } from '@/components'
import { useWordleStore } from '@/hooks'

import './App.css'


function App() {
  const [
    targetWord,
    resetStore,
  ] = useWordleStore((state) => [
    state.targetWord,
    state.resetStore,
  ])

  const buttonRef = useRef<HTMLButtonElement>(null)

  const onResetStore = () => {
    resetStore()
    buttonRef.current?.blur()
  }

  return (
    <Stack h='100%'>
      <div>
        <Button ref={buttonRef} onClick={onResetStore}>
          Reset
        </Button>
      </div>

      <div>
        the word is: {targetWord}
      </div>

      <WordsGuesser />

      <Space flex={1} />

      <FloatingKeyboard />
    </Stack>
  )
}

export default App
