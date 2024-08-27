import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

import answerList from '@/assets/answerlist.json'

interface WordleState {
  targetWord: string
  guessedWords: string[]
  currentWord: (null | string)[]

  resetStore: () => void

  addLetterToCurrentWord: (letter: string, idx?: number) => void
  removeLetterFromCurrentWord: (idx?: number) => void
  addPastGuess: (word: string) => void
  clearCurrentWord: () => void
}


const generateRandomWord = () => answerList[Math.floor(Math.random() * answerList.length)]

const initialState: Pick<WordleState, 'targetWord' | 'guessedWords' | 'currentWord'> = {
  targetWord: null as any,
  guessedWords: [],
  currentWord: [null, null, null, null, null],
}

const useWordleStore = create<WordleState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        resetStore: () => set({
          ...initialState,
          targetWord: generateRandomWord(),
        }),

        addLetterToCurrentWord: (letter, idx = undefined) => set(({ currentWord }) => {
          if (idx === undefined) (
            idx = currentWord.findIndex(v => !v)
          )
          return { currentWord: currentWord.map((v, i) => i === idx ? letter.toLowerCase() : v) }
        }),

        removeLetterFromCurrentWord: (idx = undefined) => set(({ currentWord }) => {
          if (idx === undefined) {
            idx = currentWord.length - currentWord.slice().reverse().findIndex(v => v) - 1
          }
          return { currentWord: currentWord.map((v, i) => i === idx ? null : v) }
        }),

        clearCurrentWord: () => set({ currentWord: [null, null, null, null, null] }),
        addPastGuess: (word) => set((state) => ({ guessedWords: [...state?.guessedWords, word] })),
      }),
      {
        name: 'better-wordle-store',
      },
    ),
  )
)

if (!useWordleStore.getState()?.targetWord) {
  useWordleStore.setState({ targetWord: generateRandomWord() })
}

export {
  useWordleStore as default,
  type WordleState
}
