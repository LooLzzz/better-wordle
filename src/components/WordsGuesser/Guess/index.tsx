import { Center, Group, Paper, Text } from '@mantine/core'
import { useCallback } from 'react'

import { useWordleStore } from '@/hooks'

import classes from './index.module.scss'

type LetterState = ('perfect' | 'correct' | 'incorrect' | undefined)

interface GuessProps {
  active?: boolean
  revealAnimation?: boolean
  selectedIdx?: number
  guessedLetters?: (null | string)[]
  onSelectIdx?: (idx: number) => void
}

interface GuessBlockProps extends Omit<GuessProps, 'guessedLetters' | 'selectedIdx' | 'onSelectIdx'> {
  letter?: string | null
  letterState?: LetterState
  selected?: boolean
  onClick?: () => void
}


const GuessBlock = ({
  active = false,
  revealAnimation = false,
  selected = false,
  letter,
  letterState,
  onClick,
}: GuessBlockProps) => {
  return (
    <Paper
      component={Center as any}
      className={[
        classes.letter,
        active ? classes.active : '',
        selected ? classes.selected : '',
        letter ? classes.guessedLetter : '',
        revealAnimation ? classes.reveal : '',
      ].join(' ')}
      radius='md'
      onClick={onClick}
      data-letter-state={letterState}
      pb='0.15rem'
      pr='0.1rem'
    >
      <Text fw='bold'>
        {letter}
      </Text>
    </Paper>
  )
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

  const getLetterState = useCallback((letter: string | null, idx: number): LetterState => {
    if (!letter || active || isEmptyGuess) {
      return undefined
    }

    if (letter === answer.slice(idx, idx + 1)) {
      return 'perfect'
    }

    if (answerLetters.includes(letter)) {
      // look for 'correct' letters, but not 'perfect' letters
      const correctLettersLocations = (
        answerLetters
          .filter((l, j) => l === letter && answerLetters[j] !== guessedLetters[j])
      )

      if (correctLettersLocations.length)
        return 'correct'
      return 'incorrect'
    }

    return 'incorrect'
  }, [answer, answerLetters, active, isEmptyGuess])

  return (
    <Group className={classes.lettersContainer} align='center' justify='center'>
      {
        guessedLetters.map((letter, idx) => (
          <GuessBlock
            key={idx}
            active={active}
            selected={selectedIdx == idx}
            letter={letter}
            revealAnimation={revealAnimation}
            onClick={() => onSelectIdx?.(idx)}
            letterState={getLetterState(letter, idx)}
          />
        ))
      }
    </Group>
  )
}

export {
  Guess as default,
  GuessBlock,
  type GuessBlockProps,
  type GuessProps,
  type LetterState
}
