import { Code, Group } from '@mantine/core'

import { useWordleStore } from '@/hooks'

import classes from './index.module.css'

type PastGuessProps = {
  word?: string
}


const PastGuess = ({ word }: PastGuessProps) => {
  const [
    targetWord,
  ] = useWordleStore((state) => [
    state.targetWord,
  ])
  const letters = (word ?? '_____').split('')

  return (
    <Group justify='center' align='center'>
      {
        letters.map((letter, idx) => (
          <Code
            className={classes.letter}
            key={idx}
            fz='xl'
            tt='uppercase'
            bg={
              word
                ? !targetWord.includes(letter)
                  ? 'var(--mantine-color-dimmed)'
                  : targetWord.indexOf(letter) === idx
                    ? 'green'
                    : 'yellow'
                : undefined
            }
          >
            {letter}
          </Code>
        ))
      }
    </Group>
  )
}

export {
  PastGuess as default,
  type PastGuessProps
}
