import { DEFAULT_THEME } from '@mantine/core'
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { answersList } from '@/assets'

interface WordleStateValues {
  answer: string
  guesses: string[]
  time: number
  currentGuess: (null | string)[]
  numberOfInvalidGuesses: number

  blockColors: {
    correct: string,
    perfect: string,
  }
}

interface WordleStateActions {
  resetStore: () => void

  startTimer: () => void
  stopTimer: () => void
  addLetterToCurrentGuess: (letter: string, idx?: number) => void
  removeLetterFromCurrentGuess: (idx?: number) => void
  submitCurrentGuess: () => void
  clearCurrentGuess: () => void
  setNumberOfInvalidGuesses: (setter: (value: number) => number) => void

  setBlockColor: (key: 'correct' | 'perfect', color: string) => void
}

type WordleState = WordleStateValues & WordleStateActions

const generateRandomWord = () => answersList[Math.floor(Math.random() * answersList.length)]

const initialState: WordleStateValues = {
  answer: null as any,
  guesses: [],
  time: 0,
  currentGuess: [null, null, null, null, null],
  numberOfInvalidGuesses: 0,
  blockColors: {
    perfect: DEFAULT_THEME.colors.green[9],
    correct: DEFAULT_THEME.colors.yellow[9],
  }
}

let timer: NodeJS.Timeout | null = null

const useWordleStore = create<WordleState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        resetStore: () => {
          get().stopTimer()
          set(({ blockColors }) => ({
            ...initialState,
            blockColors,
            answer: generateRandomWord(),
          }))
        },

        startTimer: () => {
          if (!timer) {
            timer = setInterval(() => {
              set(({ time }) => ({ time: time + 0.1 }))
            }, 100)
          }
        },

        stopTimer: () => {
          if (timer) {
            clearInterval(timer)
            timer = null
          }
        },

        addLetterToCurrentGuess: (letter, idx = undefined) => set(({ currentGuess }) => {
          if (idx === undefined) (
            idx = currentGuess.findIndex(v => !v)
          )
          return { currentGuess: currentGuess.map((v, i) => i === idx ? letter.toLowerCase() : v) }
        }),

        removeLetterFromCurrentGuess: (idx = undefined) => set(({ currentGuess }) => {
          if (idx === undefined) {
            idx = currentGuess.length - currentGuess.slice().reverse().findIndex(v => v) - 1
          }
          return { currentGuess: currentGuess.map((v, i) => i === idx ? null : v) }
        }),

        clearCurrentGuess: () => set({ currentGuess: [null, null, null, null, null] }),
        submitCurrentGuess: () => set((state) => ({
          guesses: [
            ...state?.guesses,
            state.currentGuess.join('')
          ],
          currentGuess: [null, null, null, null, null],
        })),

        setNumberOfInvalidGuesses: (setter) => { set({ numberOfInvalidGuesses: setter(get().numberOfInvalidGuesses) }) },

        setBlockColor: (key, color) => set(({ blockColors }) => ({
          blockColors: {
            ...blockColors,
            [key]: color
          }
        })),
      }),
      {
        name: 'better-wordle-store',
      },
    ),
  )
)

if (!useWordleStore.getState()?.answer) {
  useWordleStore.setState({ answer: generateRandomWord() })
}

if (useWordleStore.getState()?.time !== 0) {
  useWordleStore.getState()?.startTimer()
}

if (useWordleStore.getState()?.guesses.at(-1) === useWordleStore.getState()?.answer) {
  useWordleStore.getState().resetStore()
}

export {
  useWordleStore as default,
  generateRandomWord,
  initialState,
  type WordleState
}
