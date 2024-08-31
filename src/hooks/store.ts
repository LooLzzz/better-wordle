import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import { answersList } from '@/assets'

interface WordleState {
  answer: string
  guesses: string[]
  currentGuess: (null | string)[]

  resetStore: () => void

  addLetterToCurrentGuess: (letter: string, idx?: number) => void
  removeLetterFromCurrentGuess: (idx?: number) => void
  submitCurrentGuess: () => void
  clearCurrentGuess: () => void
}


const generateRandomWord = () => answersList[Math.floor(Math.random() * answersList.length)]

const initialState: Pick<WordleState, 'answer' | 'guesses' | 'currentGuess'> = {
  answer: null as any,
  guesses: [],
  currentGuess: [null, null, null, null, null],
}

const useWordleStore = create<WordleState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        resetStore: () => set({
          ...initialState,
          answer: generateRandomWord(),
        }),

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

if (useWordleStore.getState()?.guesses.at(-1) === useWordleStore.getState()?.answer) {
  useWordleStore.getState().resetStore()
}

export {
  useWordleStore as default,
  type WordleState
}
