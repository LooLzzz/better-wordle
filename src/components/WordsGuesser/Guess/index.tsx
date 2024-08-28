import { Center, Group, Paper, Text } from '@mantine/core'
import { useCallback } from 'react'

import { useWordleStore } from '@/hooks'

import classes from './index.module.scss'

interface GuessProps {
  active?: boolean
  selectedIdx?: number
  guessedLetters?: (null | string)[]
  onSelectIdx?: (idx: number) => void
}


const Guess = ({
  active = false,
  selectedIdx,
  guessedLetters = [null, null, null, null, null],
  onSelectIdx,
}: GuessProps) => {
  const [
    answer,
  ] = useWordleStore((state) => [
    state.answer,
  ])

  const answerLetters = answer.split('')

  const generateGuessedLetterBg = useCallback((letter: string | null, idx: number) => {
    if (!letter || active || guessedLetters.every(v => !v)) {
      return undefined
    }

    if (letter === answer.slice(idx, idx + 1))
      return 'var(--mantine-color-green-9)'

    if (answerLetters.includes(letter))
      return 'var(--mantine-color-yellow-9)'

    return 'var(--mantine-color-gray-8)'
  }, [answer, answerLetters, active])

  return (
    <Group align='center' justify='center'>
      {
        guessedLetters.map((letter, idx) => (
          <Paper
            key={idx}
            component={Center as any}
            className={[
              classes.letterContainer,
              active ? classes.active : '',
              active && selectedIdx == idx ? classes.selected : '',
            ].join(' ')}
            radius='md'
            bg={generateGuessedLetterBg(letter, idx)}
            onClick={() => onSelectIdx?.(idx)}
          >
            <Text fz='h1' fw='bold'>
              {letter}
            </Text>
          </Paper>
        ))
      }
    </Group>
  )
}

export {
  Guess as default,
  type GuessProps
}
