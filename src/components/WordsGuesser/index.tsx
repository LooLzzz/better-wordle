import { Box, Button, Code, Modal, Stack, Text, Title } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useCallback, useEffect, useState } from 'react'

import { wordsSet } from '@/assets'
import { useWordleStore } from '@/hooks'
import { humanReadableSeconds } from '@/utils'

import Guess from './Guess'
import classes from './index.module.scss'

const TOTAL_GUESSES = 6

const WordsGuesser = () => {
  const [
    answer,
    currentGuess,
    guesses,
    time,
    startTimer,
    stopTimer,
    submitCurrentGuess,
    addLetterToCurrentGuess,
    removeLetterFromCurrentGuess,
    resetStore,
  ] = useWordleStore((state) => [
    state.answer,
    state.currentGuess,
    state.guesses,
    state.time,
    state.startTimer,
    state.stopTimer,
    state.submitCurrentGuess,
    state.addLetterToCurrentGuess,
    state.removeLetterFromCurrentGuess,
    state.resetStore,
  ])

  const isXs = useMediaQuery('(max-width: 400px)')
  const [selectedIdx, setSelectedIdx] = useState<number | undefined>(undefined)
  const [shake, setShake] = useState(false)
  const [isFirstGuessInSession, setIsFirstGuessInSession] = useState(true)

  const activeGuessIdx = guesses.length
  const lastGuess = guesses.at(-1)
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
    if (e.shiftKey && e.altKey && e.key.toUpperCase() === 'R') {
      resetStore()
      return
    }

    if (answer === lastGuess || guesses.length === TOTAL_GUESSES)
      return

    const isGuessInWordsSet = wordsSet.has(currentGuessString)
    const isAlreadyGuess = guesses.includes(currentGuessString)

    startTimer()

    switch (e.key) {
      case 'Enter':
        if (numberOfEmptyLetters === 0) {
          if (isGuessInWordsSet && !isAlreadyGuess) {
            setIsFirstGuessInSession(false)
            submitCurrentGuess()
          } else {
            setShake(true)
            setTimeout(() => {
              setShake(false)
            }, 250)
            if (!isGuessInWordsSet) {
              notifications.show({
                title: 'Invalid Guess',
                message: 'Not a valid word!',
                color: 'red',
              })
            }
            if (isAlreadyGuess) {
              notifications.show({
                title: 'Already Guessed',
                message: 'You already tried that word!',
                color: 'red',
              })
            }
          }
        }
        e.preventDefault()
        break

      case 'Backspace':
        removeLetterFromCurrentGuess(selectedIdx)
        e.preventDefault()
        break

      case 'Delete':
        if (selectedIdx !== undefined) {
          removeLetterFromCurrentGuess(selectedIdx)
        }
        break

      case 'ArrowLeft':
        setSelectedIdx((prev) =>
          prev === undefined
            ? currentGuess.length - 1
            : (prev + currentGuess.length - 1) % currentGuess.length
        )
        break

      case 'ArrowRight':
        setSelectedIdx((prev) =>
          prev === undefined
            ? 0
            : (prev + 1) % currentGuess.length
        )
        break

      case 'Escape':
        setSelectedIdx(undefined)
        break

      default:
        if (
          (selectedIdx !== undefined || numberOfEmptyLetters > 0)
          && e.key.length === 1
          && e.key.match(/[a-z]/i)
        ) {
          if (selectedIdx !== undefined) {
            removeLetterFromCurrentGuess(selectedIdx)
            setTimeout(() => {
              addLetterToCurrentGuess(e.key, selectedIdx)
            }, 10)
            setSelectedIdx(undefined)
          } else {
            addLetterToCurrentGuess(e.key, selectedIdx)
            setSelectedIdx(undefined)
          }
        }
    }
  }, [lastGuess, currentGuess, currentGuessString, numberOfEmptyLetters, selectedIdx, wordsSet])

  useEffect(() => {
    setSelectedIdx(undefined)
  }, [answer, currentGuess])

  useEffect(() => {
    if (answer === lastGuess || guesses.length === TOTAL_GUESSES) {
      stopTimer()
    }
  }, [answer, lastGuess, guesses.length, TOTAL_GUESSES])

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress)
    return () => {
      window.removeEventListener('keydown', onKeyPress)
    }
  }, [onKeyPress])

  return (
    <>
      <Modal
        opened={answer === lastGuess || guesses.length === TOTAL_GUESSES}
        trapFocus={false}
        onClose={() => { }}
        withCloseButton={false}
        title={<Title order={3}>{answer !== lastGuess && guesses.length === TOTAL_GUESSES ? 'You Lost!' : 'You Won!'}</Title>}
      >
        <Stack h='100%'>
          <Text>
            {
              answer !== lastGuess && guesses.length === TOTAL_GUESSES
                ? <>The answer was <Code fz='md'>{answer}</Code>.</>
                : 'Congratulations!'
            }
          </Text>
          <Text>
            Time: <Code fz='md'>{humanReadableSeconds(time)}</Code>
          </Text>
          <Button onClick={resetStore}>Play Again</Button>
        </Stack>
      </Modal>

      <Stack h='100%' justify='space-evenly' gap={isXs ? 'xs' : 'md'}>
        {
          Array
            .from({ length: TOTAL_GUESSES })
            .map((_, idx) => (() => {
              const isActive = idx === activeGuessIdx

              return (
                <Box key={idx} className={isActive && shake ? classes.shake : undefined}>
                  <Guess
                    key={idx}
                    active={isActive}
                    guessedLetters={isActive ? currentGuess : guesses[idx]?.split('')}
                    selectedIdx={isActive ? selectedIdx : undefined}
                    onSelectIdx={isActive ? handleSelectIdx : undefined}
                    revealAnimation={!isFirstGuessInSession && idx === activeGuessIdx - 1}
                  />
                </Box>
              )
            })())
        }
      </Stack>
    </>
  )
}

export default WordsGuesser
