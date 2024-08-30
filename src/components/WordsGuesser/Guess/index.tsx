import { Center, Group, Paper, Text } from '@mantine/core'
import { useCallback } from 'react'

import { useWordleStore } from '@/hooks'

import classes from './index.module.scss'

interface GuessProps {
  active?: boolean
  revealAnimation?: boolean
  selectedIdx?: number
  guessedLetters?: (null | string)[]
  onSelectIdx?: (idx: number) => void
}


const Guess = ({
  active = false,
  revealAnimation = false,
  selectedIdx,
  guessedLetters = [null, null, null, null, null],
  onSelectIdx,
}: GuessProps) => {
  const [answer] = useWordleStore((state) => [state.answer])
  const answerLetters = answer.split('')
  const isEmptyGuess = guessedLetters.every(v => !v)

  const getLetterState = useCallback((letter: string | null, idx: number) => {
    if (!letter || active || isEmptyGuess) {
      return undefined
    }

    if (letter === answer.slice(idx, idx + 1)) {
      return 'perfect'
      // return 'var(--mantine-color-green-9)'
    }

    if (answerLetters.includes(letter)) {
      return 'correct'
      // return 'var(--mantine-color-yellow-9)'
    }

    return 'incorrect'
    // return 'var(--mantine-color-gray-8)'
  }, [answer, answerLetters, active, isEmptyGuess])

  return (
    <Group className={classes.lettersContainer} align='center' justify='center'>
      {
        guessedLetters.map((letter, idx) => (
          <Paper
            key={idx}
            component={Center as any}
            className={[
              classes.letter,
              active ? classes.active : '',
              selectedIdx == idx ? classes.selected : '',
              letter ? classes.guessedLetter : '',
              revealAnimation ? classes.reveal : '',
            ].join(' ')}
            radius='md'
            onClick={() => onSelectIdx?.(idx)}
            data-letter-state={getLetterState(letter, idx)}
          >
            <Text fz='inherit' fw='bold'>
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
