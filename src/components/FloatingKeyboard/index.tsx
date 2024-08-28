import { Group, Kbd, Stack } from '@mantine/core'
import { useEffect, useMemo, useRef } from 'react'

import { useWordleStore } from '@/hooks'

import classes from './index.module.scss'


const keyboardRows = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['Enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'Backspace'],
]


const FloatingKeyboard = () => {
  const [
    answer,
    guesses,
  ] = useWordleStore((state) => [
    state.answer,
    state.guesses,
  ])

  const keyRefs = Object.fromEntries(
    keyboardRows
      .flat()
      .map((key) => [key, useRef<HTMLButtonElement>(null)])
  )

  const deadLetters = useMemo(() => (
    new Set(
      guesses
        .join('')
        .split('')
        .filter((letter) => !answer.includes(letter))
        .map((letter) => letter)
    )
  ), [answer, guesses])

  const correctLetters = useMemo(() => (
    new Set(
      guesses
        .join('')
        .split('')
        .filter((letter) => answer.includes(letter))
        .map((letter) => letter)
    )
  ), [answer, guesses])

  const perfectLetters = useMemo(() => (
    new Set(
      guesses
        .map((guess) => guess.split(''))
        .flatMap((guess) => guess.map((letter, idx) => [letter, letter === answer[idx]]))
        .filter(([, isCorrect]) => isCorrect)
        .map(([letter]) => letter)
    )
  ), [answer, guesses])

  const generateLetterBg = (letter: string) => {
    if (perfectLetters.has(letter)) {
      return 'var(--mantine-color-green-8)'
    } else if (correctLetters.has(letter)) {
      return 'var(--mantine-color-yellow-9)'
    } else if (deadLetters.has(letter)) {
      return 'var(--mantine-color-dimmed)'
    } else {
      return undefined
    }
  }

  const handleClick = (key: string) => {
    window.dispatchEvent(
      new KeyboardEvent('keydown', { key })
    )
    window.dispatchEvent(
      new KeyboardEvent('keyup', { key })
    )
  }

  const handleKeyDown = ({ key }: KeyboardEvent) => {
    keyRefs[key]?.current?.setAttribute('data-active', 'true')
  }

  const handleKeyUp = ({ key }: KeyboardEvent) => {
    keyRefs[key]?.current?.removeAttribute('data-active')
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  return (
    <Stack gap='xs' align='center'>
      {
        keyboardRows.map((row, idx) => (
          <Group key={idx} gap='0.2rem'>
            {
              row.map((key) => (
                <Kbd
                  key={key}
                  ref={keyRefs[key]}
                  className={classes.kbd}
                  size='xl'
                  fz='h3'
                  bg={generateLetterBg(key)}
                  onClick={() => handleClick(key)}
                  tt={key.length === 1 ? 'uppercase' : undefined}
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