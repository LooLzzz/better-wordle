// @ts-ignore
export { default as BackspaceIcon } from './backspace.svg?react'
// @ts-ignore
export { default as EnterIcon } from './enter.svg?react'

import answerList from './answerlist.json'
import wordList from './wordlist.json'

const wordsSet = new Set<string>(wordList)
const answersSet = new Set<string>(answerList)

export {
  answersSet,
  wordsSet
}
