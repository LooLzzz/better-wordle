import answerList from './answerlist.json'
import wordList from './wordlist.json'

const wordsSet = new Set<string>(wordList)
const answersSet = new Set<string>(answerList)

export {
  answerList as answersList,
  answersSet,
  wordList as wordsList,
  wordsSet
}

