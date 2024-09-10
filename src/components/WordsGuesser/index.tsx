import { Box, Button, Center, Code, Image, Modal, Stack, Text, Title } from '@mantine/core'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useCallback, useEffect, useState } from 'react'

import { wordsSet } from '@/assets'
import gitgudImageSrc from '@/assets/gitgud.jpg'
import { useWordleStore } from '@/hooks'
import { secondsToHms } from '@/utils'

import Guess from './Guess'
import classes from './index.module.scss'

const TOTAL_GUESSES = 6

const WordsGuesser = () => {
  const [
    answer,
    currentGuess,
    guesses,
    time,
    numberOfInvalidGuesses,
    startTimer,
    stopTimer,
    submitCurrentGuess,
    addLetterToCurrentGuess,
    removeLetterFromCurrentGuess,
    setNumberOfInvalidGuesses,
    resetStore,
  ] = useWordleStore((state) => [
    state.answer,
    state.currentGuess,
    state.guesses,
    state.time,
    state.numberOfInvalidGuesses,
    state.startTimer,
    state.stopTimer,
    state.submitCurrentGuess,
    state.addLetterToCurrentGuess,
    state.removeLetterFromCurrentGuess,
    state.setNumberOfInvalidGuesses,
    state.resetStore,
  ])

  const isXs = useMediaQuery('(max-width: 400px)')
  const [selectedIdx, setSelectedIdx] = useState<number | undefined>(undefined)
  const [shake, setShake] = useState(false)
  const [isFirstGuessInSession, setIsFirstGuessInSession] = useState(true)
  const [isModalOpen, { open: openModal, close: closeModal }] = useDisclosure()

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
              setNumberOfInvalidGuesses(value => value + 1)
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
        if (selectedIdx !== undefined) {
          setSelectedIdx(selectedIdx - 1 >= 0 ? selectedIdx - 1 : undefined)
        }
        break

      case 'Delete':
        if (selectedIdx !== undefined) {
          removeLetterFromCurrentGuess(selectedIdx)
          setSelectedIdx(selectedIdx - 1 >= 0 ? selectedIdx - 1 : undefined)
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
            setSelectedIdx(selectedIdx + 1 < currentGuess.length ? selectedIdx + 1 : undefined)
          } else {
            addLetterToCurrentGuess(e.key, selectedIdx)
          }
        }
    }
  }, [lastGuess, currentGuess, currentGuessString, numberOfEmptyLetters, selectedIdx, wordsSet])

  useEffect(() => {
    setSelectedIdx(undefined)
  }, [answer])

  useEffect(() => {
    if (answer === lastGuess || guesses.length === TOTAL_GUESSES) {
      stopTimer()
    }
  }, [answer, lastGuess, guesses.length, TOTAL_GUESSES])

  useEffect(() => {
    if (answer === lastGuess || guesses.length === TOTAL_GUESSES) {
      setTimeout(openModal, 500 * 5)
    } else {
      closeModal()
    }
  }, [answer, lastGuess, guesses])

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress)
    return () => {
      window.removeEventListener('keydown', onKeyPress)
    }
  }, [onKeyPress])

  return (
    <>
      <Modal
        opened={isModalOpen}
        trapFocus={false}
        onClose={closeModal}
        title={<Title order={3}>{answer !== lastGuess && guesses.length === TOTAL_GUESSES ? 'You Lost!' : 'You Won!'}</Title>}
      >
        <Stack h='100%'>
          <Text>
            {
              answer !== lastGuess && guesses.length === TOTAL_GUESSES
                ? <>
                  <Text pb='xs'>The answer was <Code>{answer}</Code>.</Text>
                  <Text>You couldn't even guess it after <Code>{TOTAL_GUESSES}</Code> guesses, of which <Code>{numberOfInvalidGuesses}</Code> were invalid.</Text>
                  <Text pb='md'>Better luck next time! 🍀</Text>
                  <Center>
                    <Image
                      radius='md'
                      style={{ boxShadow: 'var(--mantine-shadow-xs)' }}
                      w={250}
                      src={gitgudImageSrc}
                    />
                  </Center>
                </>
                : <>
                  <Text pb='xs'>You managed to guess <Code>{answer}</Code>!</Text>
                  <Text>It only took you <Code>{numberOfInvalidGuesses + guesses.length}</Code> guesses, of which <Code>{numberOfInvalidGuesses}</Code> were invalid.</Text>
                  <Text>But who's counting 😉</Text>
                </>
            }
          </Text>
          <Text>
            Time: <Code>{secondsToHms(time)}</Code>
          </Text>
          <Button onClick={() => { closeModal(); resetStore() }}>Play Again</Button>
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
