import { useWordleStore } from '@/hooks'

import CurrentGuess from './CurrentGuess'
import PastGuess from './PastGuess'

import { Stack } from '@mantine/core'
import classes from './index.module.css'


const WordsGuesser = () => {
  const [
    targetWord,
    guessedWords,
  ] = useWordleStore((state) => [
    state.targetWord,
    state.guessedWords,
  ])

  const remainingGuesses = 5 - guessedWords.length

  return (
    <Stack className={classes.wordsGuesser} gap='xs'>
      {
        guessedWords.map((word, idx) => (
          <PastGuess key={`past_${idx}`} word={word} />
        ))
      }

      <CurrentGuess />

      {
        Array
          .from({ length: remainingGuesses })
          .map((_, idx) => (
            <PastGuess key={`future_${idx}`} />
          ))
      }
    </Stack>
  )
}

export default WordsGuesser