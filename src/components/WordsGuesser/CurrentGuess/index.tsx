import { Code, Group } from '@mantine/core'
import { useCallback, useEffect } from 'react'

import { useWordleStore } from '@/hooks'

import wordList from '@/assets/wordlist.json'
import classes from './index.module.css'

const wordsSet = new Set<string>(wordList)


const CurrentGuess = () => {
  const [
    currentWord,
    addPastGuess,
    clearCurrentWord,
    addLetterToCurrentWord,
    removeLetterFromCurrentWord,
  ] = useWordleStore((state) => [
    state.currentWord,
    state.addPastGuess,
    state.clearCurrentWord,
    state.addLetterToCurrentWord,
    state.removeLetterFromCurrentWord,
  ])

  const currentWordWithPlaceholders = currentWord.map((v) => v ?? '_')
  const numberOfEmptyLetters = currentWord.reduce((acc, v) => acc + (v === null ? 1 : 0), 0)

  const onKeyPress = useCallback((e: KeyboardEvent) => {
    const currentWordString = currentWord.join('')

    switch (e.key) {
      case 'Enter':
        if (
          numberOfEmptyLetters === 0
          && wordsSet.has(currentWordString)
        ) {
          addPastGuess(currentWordString)
          clearCurrentWord()
        }
        break

      case 'Backspace':
        removeLetterFromCurrentWord()
        e.preventDefault()
        break

      default:
        if (
          numberOfEmptyLetters > 0
          && e.key.length === 1
          && e.key.match(/[a-z]/i)
        ) {
          addLetterToCurrentWord(e.key)
        }
    }

  }, [currentWord])

  useEffect(() => {
    window.addEventListener('keydown', onKeyPress)
    return () => {
      window.removeEventListener('keydown', onKeyPress)
    }
  }, [onKeyPress])

  return (
    <>
      <Group align='center' justify='center'>
        {
          currentWordWithPlaceholders.map((value, index) => (
            <Code className={classes.letter} key={index} fz='xl'>
              {value.toUpperCase()}
            </Code>
          ))
        }
      </Group>
    </>
  )
}

export default CurrentGuess