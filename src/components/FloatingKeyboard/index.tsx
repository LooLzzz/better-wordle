import { Group, Kbd, Stack } from '@mantine/core'

import { useWordleStore } from '@/hooks'

import classes from './index.module.css'


const keyboardRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
]


const FloatingKeyboard = () => {
  const [
    targetWord,
    guessedWords,
  ] = useWordleStore((state) => [
    state.targetWord,
    state.guessedWords,
  ])

  const deadLetters = (
    guessedWords
      .join('')
      .split('')
      .filter((letter) => !targetWord.includes(letter))
      .map((letter) => letter.toUpperCase())
  )

  const handleClick = (key: string) => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key }))
  }

  console.log('classes', classes)

  return (
    <Stack gap='xs' align='center'>
      {
        keyboardRows.map((row, idx) => (
          <Group key={idx} gap='0.2rem'>
            {
              row.map((key) => (
                <Kbd
                  className={classes.kbd}
                  key={key}
                  size='xl'
                  bg={deadLetters.includes(key) ? 'var(--mantine-color-dimmed)' : undefined}
                  onClick={() => handleClick(key)}
                >
                  {
                    key === 'Backspace'
                      ? '⌫'
                      : key
                  }
                </Kbd>
              ))
            }
          </Group>
        ))
      }
    </Stack>
  )
}

export default FloatingKeyboard