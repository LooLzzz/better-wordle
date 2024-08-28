import { Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { useCallback, useEffect, useState } from 'react'

import { wordsSet } from '@/assets'
import { useWordleStore } from '@/hooks'

import Guess from './Guess'
import classes from './index.module.scss'

const TOTAL_GUESSES = 6

const WordsGuesser = () => {
  const [
    answer,
    currentGuess,
    guesses,
    submitCurrentGuess,
    addLetterToCurrentGuess,
    removeLetterFromCurrentGuess,
  ] = useWordleStore((state) => [
    state.answer,
    state.currentGuess,
    state.guesses,
    state.submitCurrentGuess,
    state.addLetterToCurrentGuess,
    state.removeLetterFromCurrentGuess,
  ])

  const [selectedIdx, setSelectedIdx] = useState<number | undefined>(undefined)
  const [shake, setShake] = useState(false)

  const activeGuessIdx = guesses.length
  const numberOfEmptyLetters = currentGuess.reduce((acc, v) => acc + (!v ? 1 : 0), 0)
  const currentGuessString = currentGuess.join('')

  const handleSelectIdx = useCallback((idx: number) => {
    if (selectedIdx === idx) {
      setSelectedIdx(undefined)
    } else {
      setSelectedIdx(idx)
    }
  }, [selectedIdx])

  const onKeyPress = useCallback((e: KeyboardEvent) => {
    const isGuessInWordsSet = wordsSet.has(currentGuessString)
    const isAlreadyGuess = guesses.includes(currentGuessString)

    switch (e.key) {
      case 'Enter':
        if (numberOfEmptyLetters === 0) {
          if (isGuessInWordsSet && !isAlreadyGuess) {
            submitCurrentGuess()
          } else {
            setShake(true)
            setTimeout(() => {
              setShake(false)
            }, 250)
            if (!isGuessInWordsSet) {
              notifications.show({
                title: 'Not a Word',
                message: 'That is not a word!',
                color: 'red',
              })
            } else if (isAlreadyGuess) {
              notifications.show({
                title: 'Already Guessed',
                message: 'You already guessed that word!',
                color: 'red',
              })
            }
          }
        }
        break

      case 'Backspace':
        removeLetterFromCurrentGuess(selectedIdx)
        e.preventDefault()
        break

      default:
        if (
          numberOfEmptyLetters > 0
          && e.key.length === 1
          && e.key.match(/[a-z]/i)
        ) {
          addLetterToCurrentGuess(e.key, selectedIdx)
          setSelectedIdx(undefined)
        }
    }
  }, [currentGuess, currentGuessString, numberOfEmptyLetters, selectedIdx, wordsSet])

  useEffect(() => {
    setSelectedIdx(undefined)
  }, [answer, currentGuess])

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress)
    return () => {
      window.removeEventListener('keydown', onKeyPress)
    }
  }, [onKeyPress])

  return (
    <Stack h='100%' justify='space-evenly'>
      {
        Array
          .from({ length: TOTAL_GUESSES })
          .map((_, idx) => (
            <span className={idx === activeGuessIdx && shake ? classes.shake : undefined}>
              <Guess
                key={idx}
                active={idx === activeGuessIdx}
                guessedLetters={idx === activeGuessIdx ? currentGuess : guesses[idx]?.split('')}
                selectedIdx={idx === activeGuessIdx ? selectedIdx : undefined}
                onSelectIdx={idx === activeGuessIdx ? handleSelectIdx : undefined}
              />
            </span>
          ))
      }
    </Stack>
  )
}

export default WordsGuesser
